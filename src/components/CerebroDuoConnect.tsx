import { useState, useCallback, useRef, useEffect } from "react";
import { Search, ShoppingCart, Check, Loader2, MicOff, ArrowLeft, RefreshCw, Zap } from "lucide-react";
import superflashLogo from "@/assets/superflash-logo.png";
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
      const lastResult = e.results[e.results.length - 1];
      const text = lastResult[0].transcript.trim();
      setTranscript(text);
      hasSpokenRef.current = true;

      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        if (hasSpokenRef.current) {
          recognitionRef.current?.stop();
          onSilenceDetected();
        }
      }, 2000);
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

  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOnLeft, setIsOnLeft] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const fabRef = useRef<HTMLDivElement>(null);
  const hasDraggedRef = useRef(false);

  // Bubble visibility state
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBubbleTemporarily = useCallback(() => {
    setBubbleVisible(true);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleVisible(false);
    }, 4000);
  }, []);

  useEffect(() => {
    showBubbleTemporarily();
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, [showBubbleTemporarily]);

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

  const textoRef = useRef(textoInput);
  useEffect(() => { textoRef.current = textoInput; }, [textoInput]);

  const onSilenceDetected = useCallback(() => {
    procesarTextoFromRef(textoRef.current);
  }, [procesarTextoFromRef]);

  const speech = useSpeechRecognition(onSilenceDetected);

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

  const [showSyncOverlay, setShowSyncOverlay] = useState(false);

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
        setShowSyncOverlay(true);
        setTimeout(() => {
          setShowSyncOverlay(false);
          setTimeout(() => onDismiss?.(), 600);
        }, 4000);
      }, 400);
    }, 1500);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (speech.isListening) speech.stopListening();
      if (paso === "input") resetear();
    }
  };

  const snapToEdge = useCallback((currentX: number) => {
    const screenWidth = window.innerWidth;
    const fabWidth = 48;
    const margin = 16;
    const fabCenter = screenWidth - margin - fabWidth / 2 + currentX;
    const screenCenter = screenWidth / 2;

    if (fabCenter < screenCenter) {
      const leftX = -(screenWidth - margin * 2 - fabWidth);
      setPosition(prev => ({ ...prev, x: leftX }));
      setIsOnLeft(true);
    } else {
      setPosition(prev => ({ ...prev, x: 0 }));
      setIsOnLeft(false);
    }
  }, []);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      posX: position.x,
      posY: position.y,
    };
  }, [position]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDraggedRef.current = true;
    }
    const newX = dragStartRef.current.posX + deltaX;
    const newY = dragStartRef.current.posY + deltaY;
    const maxY = window.innerHeight - 150;
    const minY = -(window.innerHeight - 200);
    setPosition({
      x: newX,
      y: Math.max(minY, Math.min(0, newY)),
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      snapToEdge(position.x);
      showBubbleTemporarily();
    }
  }, [isDragging, position.x, snapToEdge, showBubbleTemporarily]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = () => handleDragEnd();
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  const handleFabClick = () => {
    if (!hasDraggedRef.current) {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* ── FAB — Superflash with circular speech bubble ── */}
      <div
        ref={fabRef}
        className="fixed bottom-6 right-4 z-50 flex flex-col items-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Circular speech bubble above logo */}
        <div
          className={`relative mb-2 transition-opacity duration-500 ${
            bubbleVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="w-20 h-12 rounded-full flex items-center justify-center text-center px-2 shadow-md border"
            style={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--sf-purple))",
              boxShadow: "0 2px 10px hsla(var(--sf-purple) / 0.25)",
            }}
          >
            <p className="text-[10px] font-black leading-tight" style={{ color: "hsl(var(--sf-purple))" }}>
              ¿Qué querés comprar?
            </p>
          </div>
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0"
            style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "6px solid hsl(var(--background))",
              filter: "drop-shadow(0 1px 0 hsl(var(--sf-purple)))",
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-0 h-0"
            style={{
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "7px solid hsl(var(--sf-purple))",
              zIndex: -1,
            }}
          />
        </div>

        {/* FAB Button */}
        <button
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={handleFabClick}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
            isDragging ? "scale-110 cursor-grabbing" : "hover:scale-110 active:scale-95 cursor-grab"
          }`}
          style={{
            background: "linear-gradient(135deg, hsl(var(--sf-purple-light)), hsl(var(--sf-purple-dark)))",
            boxShadow: isDragging
              ? "0 20px 60px hsla(var(--sf-purple) / 0.6), 0 8px 20px hsla(0, 0%, 0%, 0.3)"
              : "0 12px 40px hsla(var(--sf-purple) / 0.5), 0 4px 12px hsla(0, 0%, 0%, 0.2)",
            border: "2px solid hsla(0, 0%, 100%, 0.2)",
          }}
          aria-label="Abrir asistente Superflash"
        >
          <img src={superflashLogo} alt="Superflash" className="w-10 h-10 rounded-xl object-cover drop-shadow-md pointer-events-none" />
        </button>
      </div>

      {/* ── Bottom Sheet ── */}
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className={`bg-card ${paso === "resultados" ? "min-h-[100dvh] max-h-[100dvh]" : "min-h-[65dvh] max-h-[92dvh]"}`}>
          <DrawerHeader className={paso === "resultados" ? "py-2 px-4" : "pb-2"}>
            {paso === "resultados" ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={irAtras}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-foreground" />
                </button>
                <DrawerTitle className="text-base font-bold text-card-foreground">
                  {resultados.length} productos encontrados
                </DrawerTitle>
                <button
                  onClick={() => resetear()}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Nuevo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {paso === "procesando" && (
                  <button
                    onClick={irAtras}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-foreground" />
                  </button>
                )}
                <img src={superflashLogo} alt="Superflash" className="w-9 h-9 rounded-xl" />
                <div className="flex-1">
                  <DrawerTitle className="text-lg font-bold text-card-foreground">
                    Superflash
                  </DrawerTitle>
                  <DrawerDescription className="text-sm">
                    {paso === "input"
                      ? "Tocá el micrófono o escribí tu pedido"
                      : paso === "procesando"
                      ? "Procesando..."
                      : "¡Listo!"}
                  </DrawerDescription>
                </div>
              </div>
            )}
          </DrawerHeader>

          <div className="px-4 pb-4 overflow-y-auto flex-1">
            {/* ── PASO: INPUT ── */}
            {paso === "input" && (
              <div className="space-y-4">
                {/* Mic button */}
                <div className="flex flex-col items-center gap-3 pt-2 pb-1">
                  <button
                    onClick={speech.isListening ? speech.stopListening : speech.startListening}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95"
                    style={{
                      background: speech.isListening
                        ? "linear-gradient(135deg, hsl(var(--sf-gold)), hsl(var(--sf-gold-dark)))"
                        : "linear-gradient(135deg, hsl(var(--sf-purple)), hsl(var(--sf-purple-dark)))",
                      color: speech.isListening ? "hsl(0, 0%, 10%)" : "hsl(0, 0%, 100%)",
                    }}
                  >
                    {speech.isListening && (
                      <>
                        <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "hsla(var(--sf-gold) / 0.25)" }} />
                        <span className="absolute -inset-2 rounded-full border-2 animate-pulse" style={{ borderColor: "hsla(var(--sf-gold) / 0.30)" }} />
                      </>
                    )}
                    {speech.isListening ? (
                      <Zap className="w-7 h-7 relative z-10" />
                    ) : (
                      <MicOff className="w-6 h-6" />
                    )}
                  </button>
                  <p className={`text-sm font-semibold ${speech.isListening ? "animate-pulse" : "text-muted-foreground"}`} style={speech.isListening ? { color: "hsl(var(--sf-gold-dark))" } : undefined}>
                    {speech.isListening ? "⚡ Escuchando..." : "Tocá para activar el micrófono"}
                  </p>
                </div>

                {/* Live transcript or text input */}
                {speech.isListening && textoInput ? (
                  <div className="w-full p-4 rounded-xl border-2 text-center min-h-[100px] flex items-center justify-center" style={{ borderColor: "hsla(var(--sf-purple) / 0.4)", backgroundColor: "hsla(var(--sf-purple) / 0.05)" }}>
                    <p className="text-lg font-bold text-foreground leading-snug break-words">
                      {textoInput}
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={textoInput}
                    onChange={(e) => setTextoInput(e.target.value)}
                    placeholder='Ej: "Buscame harina, pollo y algo de queso"'
                    className="w-full h-24 p-3 rounded-xl border border-border bg-secondary text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        procesarTexto();
                      }
                    }}
                  />
                )}

                {error && <p className="text-xs text-destructive text-center">{error}</p>}

                <button
                  onClick={procesarTexto}
                  disabled={!textoInput.trim()}
                  className="w-full h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-40 active:scale-[0.98]"
                  style={{
                    background: textoInput.trim()
                      ? "linear-gradient(135deg, hsl(var(--sf-purple)), hsl(var(--sf-purple-dark)))"
                      : undefined,
                    backgroundColor: !textoInput.trim() ? "hsl(var(--muted))" : undefined,
                    color: textoInput.trim() ? "hsl(0, 0%, 100%)" : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Search className="w-5 h-5" />
                  Procesar pedido
                </button>
              </div>
            )}

            {/* ── PASO: PROCESANDO ── */}
            {paso === "procesando" && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="relative">
                  <img src={superflashLogo} alt="Superflash" className="w-12 h-12 rounded-xl animate-pulse" />
                  <Loader2 className="absolute -bottom-1 -right-1 w-4 h-4 text-primary animate-spin" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground animate-pulse">Sincronizando con la tienda...</p>
              </div>
            )}

            {/* ── PASO: RESULTADOS ── */}
            {paso === "resultados" && (
              <div className="flex flex-col h-full animate-fade-in">
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-2 pb-28">
                  {resultados.map((r, i) => (
                    <div
                      key={r.item.id}
                      className={`flex items-center gap-3 rounded-xl border-2 p-2.5 transition-all cursor-pointer ${
                        r.seleccionado
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card opacity-70"
                      }`}
                      onClick={() => toggleSeleccion(i)}
                    >
                      {r.productoCatalogo.imagen ? (
                        <img
                          src={r.productoCatalogo.imagen}
                          alt={r.productoCatalogo.nombre}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-xl flex-shrink-0">
                          🛒
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-card-foreground leading-tight line-clamp-1">
                          {r.productoCatalogo.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {r.productoCatalogo.marca} · {r.item.cantidad} {r.item.unidad}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-black text-card-foreground">
                          ${r.productoCatalogo.precio.toLocaleString("es-AR")}
                        </span>
                        {r.seleccionado ? (
                          <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </span>
                        ) : (
                          <span className="w-7 h-7 rounded-full border-2 border-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 z-10">
                  <button
                    onClick={confirmarSeleccion}
                    disabled={seleccionados.length === 0}
                    className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 active:scale-[0.98] text-white"
                    style={{
                      background: seleccionados.length > 0
                        ? "linear-gradient(135deg, hsl(var(--success)), hsl(var(--success-light)))"
                        : undefined,
                      backgroundColor: seleccionados.length === 0 ? "hsl(var(--muted))" : undefined,
                      boxShadow: seleccionados.length > 0 ? "0 4px 16px hsla(var(--success) / 0.3)" : undefined,
                      color: seleccionados.length === 0 ? "hsl(var(--muted-foreground))" : undefined,
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {seleccionados.length > 0
                      ? `Confirmar ${seleccionados.length} · $${totalPrecio.toLocaleString("es-AR")}`
                      : "Seleccioná productos"}
                  </button>
                </div>
              </div>
            )}

            {/* ── PASO: CONFIRMACIÓN ── */}
            {paso === "confirmacion" && (
              <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade-in">
                <div className="flex flex-col items-center gap-3 px-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: "hsla(var(--success) / 0.2)" }}>
                    <Check className="w-6 h-6" style={{ color: "hsl(var(--success))" }} />
                  </div>
                  <div className="rounded-2xl px-8 py-4 shadow-xl" style={{ background: `linear-gradient(135deg, hsl(var(--success)), hsl(var(--success-light)))`, boxShadow: `0 8px 30px hsla(var(--success) / 0.4)` }}>
                    <p className="text-lg font-black text-white text-center">
                      ¡Agregado al carrito!
                    </p>
                  </div>
                  <p className="text-sm font-semibold rounded-full px-5 py-2 backdrop-blur-sm" style={{ backgroundColor: "hsla(var(--background) / 0.9)", color: "hsl(var(--foreground))" }}>
                    {seleccionados.length} productos · ${totalPrecio.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* ── SYNC OVERLAY ── */}
      {showSyncOverlay && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
          style={{ animation: "fade-in 0.4s ease-out" }}
        >
          <div
            className="flex flex-col items-center gap-4 p-8 rounded-2xl border-2 mx-6 shadow-xl"
            style={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--sf-purple))",
              boxShadow: "0 16px 48px hsla(0, 0%, 0%, 0.4)",
            }}
          >
            <RefreshCw
              className="w-10 h-10"
              style={{ color: "hsl(var(--sf-purple))", animation: "spin 0.5s linear infinite" }}
            />
            <p className="text-lg font-black text-center leading-tight" style={{ color: "hsl(var(--sf-purple))" }}>
              ¡Lista sincronizada con Tu Súper Online!
            </p>
            <p className="text-sm font-semibold text-muted-foreground text-center">
              Stock actualizado en tiempo real
            </p>
          </div>
        </div>
      )}
    </>
  );
}
