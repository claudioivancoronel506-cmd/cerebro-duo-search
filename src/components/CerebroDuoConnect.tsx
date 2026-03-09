import { useState, useCallback, useRef, useEffect } from "react";
import { X, Search, Mic, ShoppingCart, Check, Loader2, MicOff, ArrowLeft } from "lucide-react";
import duoRobot from "@/assets/duo-robot.png";
import { buscarProductos, type Producto } from "@/lib/catalogo-supermercado";
import { supabase } from "@/integrations/supabase/client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

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

/* ─── Edge function call ─── */
async function llamarGemini(texto: string): Promise<RespuestaGemini> {
  const { data, error } = await supabase.functions.invoke("gemini-clasificar", {
    body: { texto },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error("Error al conectar con el clasificador");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return {
    productos: data?.productos || [],
    keywords: data?.keywords || [],
    resumen: data?.resumen || "",
  };
}

/* ─── Web Speech API hook with silence detection ─── */
function useSpeechRecognition(onSilenceDetected: () => void) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSpokenRef = useRef(false);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "es-AR";
    recognition.interimResults = true;
    recognition.continuous = true;
    hasSpokenRef.current = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (e: any) => {
      // Only take the LAST result's transcript (final or interim) to avoid duplication
      const lastResult = e.results[e.results.length - 1];
      const text = lastResult[0].transcript.trim();
      setTranscript(text);
      hasSpokenRef.current = true;

      // Reset silence timer on every result
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        // 1.5s of silence after speech → auto-process
        if (hasSpokenRef.current) {
          recognitionRef.current?.stop();
          onSilenceDetected();
        }
      }, 1500);
    };

    recognition.onerror = () => {
      setIsListening(false);
      clearSilenceTimer();
    };
    recognition.onend = () => {
      setIsListening(false);
      clearSilenceTimer();
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onSilenceDetected, clearSilenceTimer]);

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, [clearSilenceTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, [clearSilenceTimer]);

  return { isListening, transcript, setTranscript, startListening, stopListening };
}

/* ─── Props & types ─── */
interface CerebroDuoConnectProps {
  onListaSeleccionada: (productos: Producto[]) => void;
  onDismiss?: () => void;
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
export default function CerebroDuoConnect({ onListaSeleccionada, onDismiss }: CerebroDuoConnectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paso, setPaso] = useState<Paso>("input");
  const [textoInput, setTextoInput] = useState("");
  const [resultados, setResultados] = useState<ResultadoGrilla[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [resumen, setResumen] = useState("");
  const [error, setError] = useState("");
  const processingRef = useRef(false);

  const procesarTextoFromRef = useCallback(async (texto: string) => {
    if (!texto.trim() || processingRef.current) return;
    processingRef.current = true;
    setPaso("procesando");
    setError("");

    try {
      const respuesta = await llamarGemini(texto);

      if (respuesta.productos.length === 0) {
        setError("No pude identificar productos de supermercado. Intentá de nuevo.");
        setPaso("input");
        processingRef.current = false;
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
      setError("Error al procesar. Verificá tu conexión.");
      setPaso("input");
    }
    processingRef.current = false;
  }, []);

  // Silence callback needs access to current textoInput
  const textoRef = useRef(textoInput);
  useEffect(() => { textoRef.current = textoInput; }, [textoInput]);

  const onSilenceDetected = useCallback(() => {
    procesarTextoFromRef(textoRef.current);
  }, [procesarTextoFromRef]);

  const speech = useSpeechRecognition(onSilenceDetected);

  // Sync transcript → input
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

  const procesarTexto = () => procesarTextoFromRef(textoInput);

  const irAtras = () => {
    if (paso === "resultados") {
      setPaso("input");
    } else if (paso === "procesando") {
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
    if (speech.isListening) speech.stopListening();
    const prods = seleccionados.map((r) => ({
      ...r.productoCatalogo,
      cantidadSeleccionada: Number(r.item.cantidad || 1),
    }));
    onListaSeleccionada(prods);
    setPaso("confirmacion");
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        resetear();
        onDismiss?.();
      }, 400);
    }, 1000);
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
      {/* ── FAB — Dúo branding (red), floats as external plugin ── */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-center gap-4">
        {/* Welcome Message */}
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <p className="text-sm font-semibold text-foreground text-center">¿Qué querés comprar?</p>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
        </div>

        {/* Large FAB Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-28 h-28 rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, hsl(var(--duo-red)), hsl(var(--duo-red-dark)))",
            boxShadow: "0 12px 40px hsla(var(--duo-red) / 0.5), 0 4px 12px hsla(0, 0%, 0%, 0.2)",
            border: "2px solid hsla(0, 0%, 100%, 0.2)",
          }}
          aria-label="Abrir asistente Cerebro Dúo"
        >
          <img src={duoRobot} alt="Cerebro Dúo" className="w-20 h-20 rounded-2xl object-cover drop-shadow-lg" />
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-background animate-pulse" style={{ background: "hsl(var(--duo-red-light))" }} />
        </button>
      </div>

      {/* ── Bottom Sheet ── */}
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[92dvh] bg-card">
          <DrawerHeader className="pb-2">
            <div className="flex items-center gap-3">
              {/* Back button */}
              {(paso === "resultados" || paso === "procesando") && (
                <button
                  onClick={irAtras}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-foreground" />
                </button>
              )}
              <img src={duoRobot} alt="DÚO" className="w-9 h-9 rounded-xl" />
              <div className="flex-1">
                <DrawerTitle className="text-sm font-bold text-card-foreground">
                  Cerebro Dúo Connect
                </DrawerTitle>
                <DrawerDescription className="text-[11px]">
                  {paso === "input"
                    ? "Tocá el micrófono o escribí tu pedido"
                    : paso === "procesando"
                    ? "Procesando..."
                    : paso === "resultados"
                    ? resumen
                    : "¡Listo!"}
                </DrawerDescription>
              </div>
              {paso === "resultados" && (
                <button
                  onClick={() => resetear()}
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
                    {speech.isListening ? "🎙 Escuchando... se envía solo al dejar de hablar" : "Tocá para activar el micrófono"}
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
                <p className="text-sm text-muted-foreground animate-pulse">Sincronizando con la tienda...</p>
              </div>
            )}

            {/* ── PASO: RESULTADOS — Higher position ── */}
            {paso === "resultados" && (
              <div className="space-y-3 animate-fade-in">
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
                      <button
                        onClick={(e) => { e.stopPropagation(); eliminarItem(i); }}
                        className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>

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

                {/* Cart Button */}
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
              <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="flex flex-col items-center gap-4 px-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                    <Check className="w-9 h-9 text-green-600" />
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full px-8 py-4 shadow-2xl shadow-green-500/40">
                    <p className="text-2xl font-bold text-white text-center">
                      ¡Agregado al carrito!
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-card-foreground bg-background/90 rounded-full px-6 py-2 backdrop-blur-sm">
                    {seleccionados.length} productos · ${totalPrecio.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
