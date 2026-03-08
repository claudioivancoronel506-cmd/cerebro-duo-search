import { useState, useCallback, useRef, useEffect } from "react";
import { X, Search, Mic, ShoppingCart, Check, ChevronRight, Loader2, MicOff } from "lucide-react";
import duoRobot from "@/assets/duo-robot.png";
import { buscarProductos, type Producto } from "@/lib/catalogo-supermercado";

/* ─────────────────────────────────────────────
   🔑  PEGÁ TU API KEY DE GEMINI ACÁ ABAJO
   ───────────────────────────────────────────── */
const GEMINI_API_KEY = "PEGA_TU_CLAVE_AQUI";
const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT =
  "Actuá como un procesador semántico de alta precisión para una lista de compras de supermercado argentino. " +
  "REGLAS: 1) Solo productos de supermercado. Si mencionan objetos que no se venden (cocina, mesa, auto, tele), IGNÓRALOS. " +
  "2) Eliminá muletillas: eh, buscame, necesito, poneme, comprame, fijate si hay. " +
  "3) Para cada producto válido identificá: nombre, cantidad (si no dice, poner 1), unidad (kg, litro, paquete, unidad, etc). " +
  "4) Devolvé UNA lista plana, sin clasificar por categorías. " +
  'Respondé SOLO con JSON estricto, sin saludos ni comentarios, con este formato: ' +
  '{"lista_compras":[{"producto":"Nombre","cantidad":"1","unidad":"unidad"}],"resumen":"Se encontraron X productos válidos."}. ' +
  'Ejemplo: "Eh buscame harina, fideos y fijate si hay una cocina barata y un poco de pan" -> ' +
  '{"lista_compras":[{"producto":"Harina","cantidad":"1","unidad":"kg"},{"producto":"Fideos","cantidad":"1","unidad":"paquete"},{"producto":"Pan","cantidad":"1","unidad":"unidad"}],"resumen":"Se encontraron 3 productos válidos."}';

/* ─── Types for Gemini response ─── */
interface ItemListaCompras {
  producto: string;
  cantidad: string;
  unidad: string;
}

interface RespuestaGemini {
  lista_compras: ItemListaCompras[];
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

  if (!res.ok) {
    console.error("Gemini error:", res.status, await res.text());
    throw new Error("Error al conectar con Gemini");
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  // Extract JSON object from response
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) return { lista_compras: [], resumen: "" };
  try {
    const parsed = JSON.parse(match[0]);
    return {
      lista_compras: parsed.lista_compras || [],
      resumen: parsed.resumen || "",
    };
  } catch {
    return { lista_compras: [], resumen: "" };
  }
}

/* ─── Web Speech API hook ─── */
function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz. Usá Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-AR";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
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
  isOpen: boolean;
  onClose: () => void;
  onListaSeleccionada: (productos: Producto[]) => void;
}

type Paso = "input" | "procesando" | "resultados" | "confirmacion";

interface ResultadoBusqueda {
  termino: string;
  productos: Producto[];
  seleccionado?: Producto;
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════ */
export default function CerebroDuoConnect({
  isOpen,
  onClose,
  onListaSeleccionada,
}: CerebroDuoConnectProps) {
  const [paso, setPaso] = useState<Paso>("input");
  const [textoInput, setTextoInput] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [terminoActivo, setTerminoActivo] = useState(0);
  const [error, setError] = useState("");

  const speech = useSpeechRecognition();

  // Sync speech transcript to input
  useEffect(() => {
    if (speech.transcript) setTextoInput(speech.transcript);
  }, [speech.transcript]);

  const resetear = useCallback(() => {
    setPaso("input");
    setTextoInput("");
    setResultados([]);
    setTerminoActivo(0);
    setError("");
    speech.setTranscript("");
  }, [speech]);

  const handleClose = () => {
    if (speech.isListening) speech.stopListening();
    resetear();
    onClose();
  };

  const procesarTexto = async () => {
    if (!textoInput.trim()) return;
    if (speech.isListening) speech.stopListening();
    setPaso("procesando");
    setError("");

    try {
      let terminos: string[];

      if (GEMINI_API_KEY === "PEGA_TU_CLAVE_AQUI") {
        // Fallback local si no hay API Key
        const { procesarTextoDesordenado } = await import("@/lib/procesador-texto");
        terminos = procesarTextoDesordenado(textoInput);
      } else {
        terminos = await llamarGemini(textoInput);
      }

      if (terminos.length === 0) {
        setError("No pude identificar productos en tu pedido. Intentá de nuevo.");
        setPaso("input");
        return;
      }

      const res = terminos.map((t) => ({
        termino: t,
        productos: buscarProductos(t),
      }));
      setResultados(res);
      setTerminoActivo(0);
      setPaso("resultados");
    } catch (e) {
      console.error(e);
      setError("Error al procesar con Gemini. Verificá tu API Key.");
      setPaso("input");
    }
  };

  const seleccionarProducto = (idx: number, producto: Producto) => {
    setResultados((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, seleccionado: producto } : r))
    );
  };

  const todosSeleccionados = resultados.length > 0 && resultados.every((r) => r.seleccionado);

  const confirmarSeleccion = () => {
    const seleccionados = resultados.filter((r) => r.seleccionado).map((r) => r.seleccionado!);
    setPaso("confirmacion");
    setTimeout(() => {
      onListaSeleccionada(seleccionados);
      handleClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-lg bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={duoRobot} alt="DÚO Robot" className="w-10 h-10 rounded-xl" />
            <div>
              <h2 className="font-bold text-foreground text-sm">Cerebro Dúo Connect</h2>
              <p className="text-[11px] text-muted-foreground">
                {GEMINI_API_KEY === "PEGA_TU_CLAVE_AQUI" ? "Modo local (sin Gemini)" : "Gemini 1.5 Flash · Voz activa"}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {paso === "input" && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3">
                <img src={duoRobot} alt="DÚO" className="w-20 h-20 rounded-2xl shadow-lg" />
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                  Tocá el micrófono para dictar, o escribí tu pedido. Gemini se encarga de entenderlo.
                </p>
              </div>

              {/* Voice button */}
              <div className="flex justify-center">
                <button
                  onClick={speech.isListening ? speech.stopListening : speech.startListening}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                    speech.isListening
                      ? "bg-destructive text-destructive-foreground animate-pulse shadow-lg shadow-destructive/30"
                      : "bg-primary text-primary-foreground hover:bg-[hsl(var(--duo-red-light))]"
                  }`}
                >
                  {speech.isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  {speech.isListening && (
                    <span className="absolute -bottom-7 text-xs font-medium text-destructive animate-pulse">
                      Escuchando...
                    </span>
                  )}
                </button>
              </div>

              {/* Text area */}
              <div className="relative mt-4">
                <textarea
                  value={textoInput}
                  onChange={(e) => setTextoInput(e.target.value)}
                  placeholder='Ej: "Eh... buscame dos de esas harinas baratas y un pan"'
                  className="w-full h-24 p-4 rounded-2xl border border-border bg-secondary text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      procesarTexto();
                    }
                  }}
                />
              </div>

              {error && (
                <p className="text-xs text-destructive text-center">{error}</p>
              )}

              <button
                onClick={procesarTexto}
                disabled={!textoInput.trim()}
                className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-[hsl(var(--duo-red-light))] active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                Procesar pedido
              </button>
            </div>
          )}

          {paso === "procesando" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <img src={duoRobot} alt="DÚO" className="w-20 h-20 rounded-2xl animate-pulse" />
                <Loader2 className="absolute -bottom-1 -right-1 w-6 h-6 text-primary animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">
                {GEMINI_API_KEY === "PEGA_TU_CLAVE_AQUI"
                  ? "Procesando localmente..."
                  : "Gemini está procesando tu pedido..."}
              </p>
            </div>
          )}

          {paso === "resultados" && (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {resultados.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setTerminoActivo(i)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      i === terminoActivo
                        ? "bg-primary text-primary-foreground border-primary"
                        : r.seleccionado
                        ? "bg-secondary text-foreground border-border"
                        : "bg-background text-muted-foreground border-border"
                    }`}
                  >
                    {r.seleccionado && <Check className="w-3 h-3 inline mr-1" />}
                    {r.termino}
                  </button>
                ))}
              </div>

              {resultados[terminoActivo] && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {resultados[terminoActivo].productos.length} resultado
                    {resultados[terminoActivo].productos.length !== 1 ? "s" : ""} para "
                    {resultados[terminoActivo].termino}"
                  </p>
                  {resultados[terminoActivo].productos.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      No se encontraron productos.
                    </p>
                  ) : (
                    resultados[terminoActivo].productos.map((p) => {
                      const isSelected = resultados[terminoActivo].seleccionado?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => seleccionarProducto(terminoActivo, p)}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-secondary hover:border-muted-foreground"
                          }`}
                        >
                          {p.imagen ? (
                            <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                              🛒
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{p.nombre}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {p.marca} · {p.unidad}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">
                              ${p.precio.toLocaleString("es-AR")}
                            </span>
                            {isSelected ? (
                              <Check className="w-5 h-5 text-primary" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {paso === "confirmacion" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">¡Lista enviada!</p>
              <p className="text-xs text-muted-foreground">Productos agregados correctamente.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {paso === "resultados" && (
          <div className="px-5 py-4 border-t border-border">
            <button
              onClick={confirmarSeleccion}
              disabled={!todosSeleccionados}
              className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-[hsl(var(--duo-red-light))] active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4" />
              Confirmar selección ({resultados.filter((r) => r.seleccionado).length}/
              {resultados.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
