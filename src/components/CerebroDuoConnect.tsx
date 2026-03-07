import { useState, useCallback } from "react";
import { X, Search, Mic, ShoppingCart, Check, ChevronRight, Loader2 } from "lucide-react";
import duoRobot from "@/assets/duo-robot.png";
import { procesarTextoDesordenado } from "@/lib/procesador-texto";
import { buscarProductos, type Producto } from "@/lib/catalogo-supermercado";

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

export default function CerebroDuoConnect({
  isOpen,
  onClose,
  onListaSeleccionada,
}: CerebroDuoConnectProps) {
  const [paso, setPaso] = useState<Paso>("input");
  const [textoInput, setTextoInput] = useState("");
  const [terminosLimpios, setTerminosLimpios] = useState<string[]>([]);
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [terminoActivo, setTerminoActivo] = useState<number>(0);

  const resetear = useCallback(() => {
    setPaso("input");
    setTextoInput("");
    setTerminosLimpios([]);
    setResultados([]);
    setTerminoActivo(0);
  }, []);

  const handleClose = () => {
    resetear();
    onClose();
  };

  const procesarTexto = async () => {
    if (!textoInput.trim()) return;
    setPaso("procesando");

    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 1200));

    const terminos = procesarTextoDesordenado(textoInput);
    setTerminosLimpios(terminos);

    const res = terminos.map((t) => ({
      termino: t,
      productos: buscarProductos(t),
    }));
    setResultados(res);
    setTerminoActivo(0);
    setPaso("resultados");
  };

  const seleccionarProducto = (terminoIdx: number, producto: Producto) => {
    setResultados((prev) =>
      prev.map((r, i) => (i === terminoIdx ? { ...r, seleccionado: producto } : r))
    );
  };

  const todosSeleccionados = resultados.length > 0 && resultados.every((r) => r.seleccionado);

  const confirmarSeleccion = () => {
    const seleccionados = resultados
      .filter((r) => r.seleccionado)
      .map((r) => r.seleccionado!);
    setPaso("confirmacion");
    setTimeout(() => {
      onListaSeleccionada(seleccionados);
      handleClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={duoRobot} alt="DÚO Robot" className="w-10 h-10 rounded-xl" />
            <div>
              <h2 className="font-bold text-foreground text-sm">Cerebro Dúo Connect</h2>
              <p className="text-[11px] text-muted-foreground">Búsqueda inteligente V1</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {paso === "input" && (
            <PasoInput
              texto={textoInput}
              setTexto={setTextoInput}
              onProcesar={procesarTexto}
            />
          )}

          {paso === "procesando" && <PasoProcesando />}

          {paso === "resultados" && (
            <PasoResultados
              resultados={resultados}
              terminoActivo={terminoActivo}
              setTerminoActivo={setTerminoActivo}
              onSeleccionar={seleccionarProducto}
            />
          )}

          {paso === "confirmacion" && <PasoConfirmacion />}
        </div>

        {/* Footer */}
        {paso === "resultados" && (
          <div className="px-5 py-4 border-t border-border">
            <button
              onClick={confirmarSeleccion}
              disabled={!todosSeleccionados}
              className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-duo-red-light active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4" />
              Confirmar selección ({resultados.filter((r) => r.seleccionado).length}/{resultados.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function PasoInput({
  texto,
  setTexto,
  onProcesar,
}: {
  texto: string;
  setTexto: (t: string) => void;
  onProcesar: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3">
        <img src={duoRobot} alt="DÚO" className="w-20 h-20 rounded-2xl shadow-lg" />
        <p className="text-center text-sm text-muted-foreground max-w-xs">
          Dictá o escribí tu pedido como quieras. Yo me encargo de entenderlo.
        </p>
      </div>

      <div className="relative">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder='Ej: "Eh... buscame dos de esas harinas baratas y un pan"'
          className="w-full h-28 p-4 pr-12 rounded-2xl border border-border bg-secondary text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onProcesar();
            }
          }}
        />
        <button className="absolute right-3 bottom-3 p-2 rounded-full bg-primary text-primary-foreground hover:bg-duo-red-light transition-colors">
          <Mic className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onProcesar}
        disabled={!texto.trim()}
        className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-duo-red-light active:scale-[0.98]"
      >
        <Search className="w-4 h-4" />
        Procesar pedido
      </button>
    </div>
  );
}

function PasoProcesando() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <img src={duoRobot} alt="DÚO" className="w-20 h-20 rounded-2xl animate-pulse" />
        <Loader2 className="absolute -bottom-1 -right-1 w-6 h-6 text-primary animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Procesando tu pedido...</p>
    </div>
  );
}

function PasoResultados({
  resultados,
  terminoActivo,
  setTerminoActivo,
  onSeleccionar,
}: {
  resultados: ResultadoBusqueda[];
  terminoActivo: number;
  setTerminoActivo: (i: number) => void;
  onSeleccionar: (terminoIdx: number, producto: Producto) => void;
}) {
  const actual = resultados[terminoActivo];

  return (
    <div className="space-y-4">
      {/* Term tabs */}
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

      {/* Results for active term */}
      {actual && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {actual.productos.length} resultado{actual.productos.length !== 1 ? "s" : ""} para "{actual.termino}"
          </p>
          {actual.productos.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No se encontraron productos.</p>
          ) : (
            actual.productos.map((p) => {
              const isSelected = actual.seleccionado?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSeleccionar(terminoActivo, p)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-secondary hover:border-muted-foreground"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-duo-gray flex items-center justify-center text-lg shrink-0">
                    🛒
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.nombre}
                    </p>
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
  );
}

function PasoConfirmacion() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Check className="w-8 h-8 text-primary" />
      </div>
      <p className="text-sm font-medium text-foreground">¡Lista enviada!</p>
      <p className="text-xs text-muted-foreground">Productos agregados correctamente.</p>
    </div>
  );
}
