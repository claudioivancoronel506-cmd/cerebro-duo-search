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
  onListaSeleccionada: (productos: Producto[]) => void;
}

type Paso = "input" | "procesando" | "resultados" | "confirmacion";

interface ResultadoGrilla {
  item: ItemListaCompras;
  productoCatalogo: Producto;
  seleccionado: boolean;
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════ */
export default function CerebroDuoConnect({
  onListaSeleccionada,
}: CerebroDuoConnectProps) {
  const [paso, setPaso] = useState<Paso>("input");
  const [textoInput, setTextoInput] = useState("");
  const [resultados, setResultados] = useState<ResultadoGrilla[]>([]);
  const [resumen, setResumen] = useState("");
  const [error, setError] = useState("");

  const speech = useSpeechRecognition();

  // Auto-start voice on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speech.startListening();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync speech transcript to input
  useEffect(() => {
    if (speech.transcript) setTextoInput(speech.transcript);
  }, [speech.transcript]);

  const resetear = useCallback(() => {
    setPaso("input");
    setTextoInput("");
    setResultados([]);
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
          lista_compras: terminos.map((t) => ({ producto: t, cantidad: "1", unidad: "unidad" })),
          resumen: `Se encontraron ${terminos.length} productos válidos.`,
        };
      } else {
        respuesta = await llamarGemini(textoInput);
      }

      if (respuesta.lista_compras.length === 0) {
        setError("No pude identificar productos de supermercado en tu pedido. Intentá de nuevo.");
        setPaso("input");
        return;
      }

      const grilla = respuesta.lista_compras.map((item) => {
        const encontrados = buscarProductos(item.producto);
        return {
          item,
          productoCatalogo: encontrados[0] || buscarProductos("")[0],
          seleccionado: true,
        };
      });

      setResultados(grilla);
      setResumen(respuesta.resumen);
      setPaso("resultados");
    } catch (e) {
      console.error(e);
      setError("Error al procesar. Verificá tu conexión o API Key.");
      setPaso("input");
    }
  };

  const toggleSeleccion = (idx: number) => {
    setResultados((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, seleccionado: !r.seleccionado } : r))
    );
  };

  const seleccionadosCount = resultados.filter((r) => r.seleccionado).length;

  const confirmarSeleccion = () => {
    const seleccionados = resultados.filter((r) => r.seleccionado).map((r) => r.productoCatalogo);
    setPaso("confirmacion");
    setTimeout(() => {
      onListaSeleccionada(seleccionados);
      resetear();
      // Auto-restart voice after confirmation
      setTimeout(() => speech.startListening(), 500);
    }, 1500);
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col flex-1 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <img src={duoRobot} alt="DÚO Robot" className="w-10 h-10 rounded-xl" />
        <div>
          <h2 className="font-bold text-foreground text-sm">Cerebro Dúo Connect</h2>
          <p className="text-[11px] text-muted-foreground">
            {GEMINI_API_KEY === "PEGA_TU_CLAVE_AQUI" ? "Modo local (sin Gemini)" : "Gemini 1.5 Flash · Voz activa"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {paso === "input" && (
          <div className="space-y-5">
            {/* Mic animation */}
            <div className="flex flex-col items-center gap-4 py-6">
              <button
                onClick={speech.isListening ? speech.stopListening : speech.startListening}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                  speech.isListening
                    ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
                    : "bg-primary text-primary-foreground hover:bg-[hsl(var(--duo-red-light))]"
                }`}
              >
                {/* Pulsing rings when listening */}
                {speech.isListening && (
                  <>
                    <span className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
                    <span className="absolute -inset-2 rounded-full border-2 border-destructive/30 animate-pulse" />
                    <span className="absolute -inset-4 rounded-full border border-destructive/15 animate-pulse [animation-delay:150ms]" />
                  </>
                )}
                {speech.isListening ? <MicOff className="w-9 h-9 relative z-10" /> : <Mic className="w-9 h-9" />}
              </button>
              <p className={`text-sm font-medium ${speech.isListening ? "text-destructive animate-pulse" : "text-muted-foreground"}`}>
                {speech.isListening ? "🎙 Escuchando... hablá ahora" : "Tocá para activar el micrófono"}
              </p>
            </div>

            {/* Text area */}
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

            {error && <p className="text-xs text-destructive text-center">{error}</p>}

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
              {GEMINI_API_KEY === "PEGA_TU_CLAVE_AQUI" ? "Procesando localmente..." : "Gemini está procesando tu pedido..."}
            </p>
          </div>
        )}

        {paso === "resultados" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center">{resumen}</p>
            {resultados.map((r, i) => (
              <button
                key={i}
                onClick={() => toggleSeleccion(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  r.seleccionado
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-secondary opacity-50"
                }`}
              >
                {r.productoCatalogo.imagen ? (
                  <img src={r.productoCatalogo.imagen} alt={r.productoCatalogo.nombre} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">🛒</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.productoCatalogo.nombre}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {r.productoCatalogo.marca} · {r.item.cantidad} {r.item.unidad}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">
                    ${r.productoCatalogo.precio.toLocaleString("es-AR")}
                  </span>
                  {r.seleccionado ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>
            ))}
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
        <div className="py-4">
          <button
            onClick={confirmarSeleccion}
            disabled={seleccionadosCount === 0}
            className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-[hsl(var(--duo-red-light))] active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            Confirmar selección ({seleccionadosCount}/{resultados.length})
          </button>
        </div>
      )}
    </div>
  );
}
