import { useState, useCallback, useRef, useEffect } from "react";
import { X, Search, Mic, ShoppingCart, Check, Loader2, MicOff } from "lucide-react";
import duoRobot from "@/assets/duo-robot.png";
import { buscarProductos, type Producto } from "@/lib/catalogo-supermercado";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

/* ─────────────────────────────────────────────
   🔑  PEGÁ TU API KEY DE GEMINI ACÁ ABAJO
   ───────────────────────────────────────────── */
const GEMINI_API_KEY = "PEGA_TU_CLAVE_AQUI";
const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT =
  "Actuá como un procesador semántico de alta precisión para una lista de compras de supermercado argentino. " +
  "REGLAS ESTRICTAS: " +
  "1) EXCLUSIÓN TOTAL DE MULETILLAS Y VERBOS: Las siguientes palabras están PROHIBIDAS y NUNCA deben aparecer como producto: " +
  "\"Búscame\", \"Buscame\", \"Anotame\", \"Poneme\", \"Comprame\", \"Quiero\", \"Necesito\", \"Fijate\", \"Eh\", \"Coso\", \"Dame\", \"Traeme\", \"Agregame\". " +
  "Eliminalas ANTES de analizar. Solo verbos de acción o muletillas, jamás pueden ser ítems. " +
  "2) FILTRO DE SUSTANTIVOS FÍSICOS: Solo se permiten sustantivos que representen objetos físicos vendidos en un supermercado (alimentos, bebidas, limpieza, higiene, bazar básico). " +
  "Antes de crear un ítem, preguntate: '¿Se puede tocar y poner en un carrito físico de supermercado?'. Si NO, descartalo. " +
  "Ejemplos de descarte: cocina, mesa, auto, tele, coso, heladera, computadora. " +
  "3) Para cada producto válido identificá: nombre, cantidad (si no dice, poner 1), unidad (kg, litro, paquete, unidad, etc). " +
  "4) Asigná un id único incremental string a cada item y un precio_estimado en pesos argentinos (número entero razonable). " +
  "5) Devolvé UNA lista plana, sin clasificar por categorías. " +
  "6) Incluí un array 'keywords' solo con los sustantivos válidos de supermercado que extrajiste. " +
  'Respondé SOLO con JSON estricto: ' +
  '{"productos":[{"id":"1","producto":"Nombre","cantidad":"1","unidad":"unidad","precio_estimado":1200}],"keywords":["palabra1","palabra2"],"resumen":"Se encontraron X productos válidos."}';

/* ─── Types ─── */
interface ItemProducto {
  id: string;
  producto: string;
  cantidad: string;
  unidad: string;
  precio_estimado: number;
}

interface RespuestaGemini {
  productos: ItemProducto[];
  keywords: string[];
  resumen: string;
}

/* ─── Gemini direct call ─── */
async function llamarGemini(texto: string): Promise<RespuestaGemini> {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\nPedido del usuario: " + texto }] },
      ],
      generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
    }),
  });

  if (!res.ok) throw new Error("Error al conectar con Gemini");

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) return { productos: [], keywords: [], resumen: "" };
  try {
    const parsed = JSON.parse(match[0]);
    return {
      productos: parsed.productos || [],
      keywords: parsed.keywords || [],
      resumen: parsed.resumen || "",
    };
  } catch {
    return { productos: [], keywords: [], resumen: "" };
  }
}

/* ─── Web Speech API hook ─── */
function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "es-AR";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, setTranscript, startListening, stopListening };
}

/* ─── Types ─── */
interface CerebroDuoConnectProps {
  onListaSeleccionada: (productos: Producto[]) => void;
}

type Paso = "input" | "procesando" | "resultados" | "confirmacion";

interface ResultadoGrilla {
  item: ItemProducto;
  productoCatalogo: Producto;
  seleccionado: boolean;
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL — FAB + BOTTOM SHEET
   ═══════════════════════════════════════════════ */
export default function CerebroDuoConnect({ onListaSeleccionada }: CerebroDuoConnectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paso, setPaso] = useState<Paso>("input");
  const [textoInput, setTextoInput] = useState("");
  const [resultados, setResultados] = useState<ResultadoGrilla[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [resumen, setResumen] = useState("");
  const [error, setError] = useState("");

  const speech = useSpeechRecognition();

  // Auto-start voice when sheet opens
  useEffect(() => {
    if (isOpen && paso === "input") {
      const timer = setTimeout(() => speech.startListening(), 400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (speech.transcript) setTextoInput(speech.transcript);
  }, [speech.transcript]);

  const resetear = useCallback(() => {
    setPaso("input");
    setTextoInput("");
    setResultados([]);
    setKeywords([]);
    setResumen("");
    setError("");
    speech.setTranscript("");
  }, [speech]);

  const procesarTexto = async () => {
    if (!textoInput.trim()) return;
    if (speech.isListening) speech.stopListening();
    setPaso("procesando");
    setError("");

    try {
      let respuesta: RespuestaGemini;

      if (GEMINI_API_KEY === "PEGA_TU_CLAVE_AQUI") {
        const { procesarTextoDesordenado } = await import("@/lib/procesador-texto");
        const terminos = procesarTextoDesordenado(textoInput);
        respuesta = {
          productos: terminos.map((t, i) => ({
            id: String(i + 1),
            producto: t,
            cantidad: "1",
            unidad: "unidad",
            precio_estimado: 1500,
          })),
          keywords: terminos.map((t) => t.toLowerCase()),
          resumen: `Se encontraron ${terminos.length} productos válidos.`,
        };
      } else {
        respuesta = await llamarGemini(textoInput);
      }

      if (respuesta.productos.length === 0) {
        setError("No pude identificar productos de supermercado. Intentá de nuevo.");
        setPaso("input");
        return;
      }

      const grilla = respuesta.productos.map((item) => {
        const encontrados = buscarProductos(item.producto);
        const prod = encontrados[0];
        return {
          item: { ...item, precio_estimado: prod?.precio ?? item.precio_estimado },
          productoCatalogo: prod || {
            id: item.id,
            nombre: item.producto,
            marca: "Genérico",
            categoria: "Otros",
            precio: item.precio_estimado,
            unidad: item.unidad,
          },
          seleccionado: false,
        };
      });

      setResultados(grilla);
      setKeywords(respuesta.keywords);
      setResumen(respuesta.resumen);
      setPaso("resultados");
    } catch {
      setError("Error al procesar. Verificá tu conexión o API Key.");
      setPaso("input");
    }
  };

  const toggleSeleccion = (idx: number) => {
    setResultados((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, seleccionado: !r.seleccionado } : r))
    );
  };

  const eliminarItem = (idx: number) => {
    setResultados((prev) => prev.filter((_, i) => i !== idx));
  };

  const seleccionados = resultados.filter((r) => r.seleccionado);
  const totalPrecio = seleccionados.reduce(
    (s, r) => s + r.productoCatalogo.precio * Number(r.item.cantidad || 1),
    0
  );

  const confirmarSeleccion = () => {
    const prods = seleccionados.map((r) => r.productoCatalogo);
    setPaso("confirmacion");
    setTimeout(() => {
      onListaSeleccionada(prods);
      resetear();
      setIsOpen(false);
    }, 1800);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (speech.isListening) speech.stopListening();
      if (paso === "input") resetear();
    }
  };

  return (
    <>
      {/* ── FAB (Floating Action Button) ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Abrir asistente Dúo"
      >
        <img src={duoRobot} alt="DÚO" className="w-10 h-10 rounded-full object-cover" />
        {/* Notification dot */}
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full border-2 border-background animate-pulse" />
      </button>

      {/* ── Bottom Sheet ── */}
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[85dvh] bg-card">
          <DrawerHeader className="pb-2">
            <div className="flex items-center gap-3">
              <img src={duoRobot} alt="DÚO" className="w-9 h-9 rounded-xl" />
              <div className="flex-1">
                <DrawerTitle className="text-sm font-bold text-card-foreground">
                  Cerebro Dúo Connect
                </DrawerTitle>
                <DrawerDescription className="text-[11px]">
                  {paso === "input"
                    ? "Listo para escuchar o escribir"
                    : paso === "procesando"
                    ? "Procesando..."
                    : paso === "resultados"
                    ? resumen
                    : "¡Listo!"}
                </DrawerDescription>
              </div>
              {paso === "resultados" && (
                <button
                  onClick={() => { resetear(); setTimeout(() => speech.startListening(), 300); }}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Nuevo pedido
                </button>
              )}
            </div>
          </DrawerHeader>

          <div className="px-4 pb-4 overflow-y-auto flex-1">
            {/* ── PASO: INPUT ── */}
            {paso === "input" && (
              <div className="space-y-4">
                {/* Mic button */}
                <div className="flex flex-col items-center gap-3 pt-2 pb-1">
                  <button
                    onClick={speech.isListening ? speech.stopListening : speech.startListening}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                      speech.isListening
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {speech.isListening && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-destructive/25 animate-ping" />
                        <span className="absolute -inset-2 rounded-full border-2 border-destructive/30 animate-pulse" />
                        <span className="absolute -inset-4 rounded-full border border-destructive/15 animate-pulse [animation-delay:200ms]" />
                      </>
                    )}
                    {speech.isListening ? (
                      <MicOff className="w-8 h-8 relative z-10" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </button>
                  <p className={`text-xs font-medium ${speech.isListening ? "text-destructive animate-pulse" : "text-muted-foreground"}`}>
                    {speech.isListening ? "🎙 Escuchando... hablá ahora" : "Tocá para activar el micrófono"}
                  </p>
                </div>

                {/* Text input */}
                <textarea
                  value={textoInput}
                  onChange={(e) => setTextoInput(e.target.value)}
                  placeholder='Ej: "Buscame harina, pollo y algo de queso"'
                  className="w-full h-20 p-3 rounded-2xl border border-border bg-secondary text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      procesarTexto();
                    }
                  }}
                />

                {error && <p className="text-xs text-destructive text-center">{error}</p>}

                <button
                  onClick={procesarTexto}
                  disabled={!textoInput.trim()}
                  className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  Procesar pedido
                </button>
              </div>
            )}

            {/* ── PASO: PROCESANDO ── */}
            {paso === "procesando" && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="relative">
                  <img src={duoRobot} alt="DÚO" className="w-16 h-16 rounded-2xl animate-pulse" />
                  <Loader2 className="absolute -bottom-1 -right-1 w-5 h-5 text-primary animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">Analizando tu pedido...</p>
              </div>
            )}

            {/* ── PASO: RESULTADOS ── */}
            {paso === "resultados" && (
              <div className="space-y-3">
                {/* Keyword Chips */}
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* 2-Column Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {resultados.map((r, i) => (
                    <div
                      key={r.item.id}
                      className={`relative rounded-2xl border p-2.5 transition-all cursor-pointer ${
                        r.seleccionado
                          ? "border-primary bg-primary/5 ring-2 ring-primary/40 shadow-sm"
                          : "border-border bg-secondary/60 opacity-55"
                      }`}
                      onClick={() => toggleSeleccion(i)}
                    >
                      {/* X dismiss button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); eliminarItem(i); }}
                        className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Image */}
                      {r.productoCatalogo.imagen ? (
                        <img
                          src={r.productoCatalogo.imagen}
                          alt={r.productoCatalogo.nombre}
                          className="w-full aspect-square rounded-xl object-cover mb-2"
                        />
                      ) : (
                        <div className="w-full aspect-square rounded-xl bg-muted flex items-center justify-center text-2xl mb-2">
                          🛒
                        </div>
                      )}

                      {/* Info */}
                      <p className="text-xs font-semibold text-card-foreground truncate">
                        {r.productoCatalogo.nombre}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {r.productoCatalogo.marca} · {r.item.cantidad} {r.item.unidad}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-bold text-card-foreground">
                          ${r.productoCatalogo.precio.toLocaleString("es-AR")}
                        </span>
                        {r.seleccionado && (
                          <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Cart Button */}
                <button
                  onClick={confirmarSeleccion}
                  disabled={seleccionados.length === 0}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/20"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {seleccionados.length > 0
                    ? `Agregar al Carrito ($${totalPrecio.toLocaleString("es-AR")})`
                    : "Seleccioná productos"}
                </button>
              </div>
            )}

            {/* ── PASO: CONFIRMACIÓN ── */}
            {paso === "confirmacion" && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm font-semibold text-card-foreground">¡Agregado al carrito!</p>
                <p className="text-xs text-muted-foreground">
                  {seleccionados.length} productos · ${totalPrecio.toLocaleString("es-AR")}
                </p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
