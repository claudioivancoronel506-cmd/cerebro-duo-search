import { useState } from "react";
import { Search } from "lucide-react";
import CerebroDuoConnect from "@/components/CerebroDuoConnect";
import duoRobot from "@/assets/duo-robot.png";
import type { Producto } from "@/lib/catalogo-supermercado";

const Index = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productosSeleccionados, setProductosSeleccionados] = useState<Producto[]>([]);

  const handleListaSeleccionada = (productos: Producto[]) => {
    setProductosSeleccionados((prev) => [...prev, ...productos]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={duoRobot} alt="DÚO" className="w-9 h-9 rounded-xl" />
          <span className="font-bold text-foreground">DÚO Supermercado</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-sm font-medium hover:bg-duo-red-light transition-colors active:scale-[0.97]"
        >
          <Search className="w-4 h-4" />
          Búsqueda inteligente
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {productosSeleccionados.length === 0 ? (
          <div className="text-center space-y-4 max-w-md">
            <img
              src={duoRobot}
              alt="DÚO Robot"
              className="w-24 h-24 mx-auto rounded-3xl shadow-lg"
            />
            <h1 className="text-2xl font-bold text-foreground">
              Cerebro Dúo Connect V1
            </h1>
            <p className="text-muted-foreground text-sm">
              Usá la búsqueda inteligente para dictar tu pedido de forma natural. El sistema procesa tu texto y te muestra los productos del catálogo para que elijas.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-duo-red-light transition-colors active:scale-[0.97]"
            >
              <Search className="w-5 h-5" />
              Comenzar
            </button>
          </div>
        ) : (
          <div className="w-full max-w-lg space-y-4 py-8">
            <h2 className="text-lg font-bold text-foreground">
              Productos seleccionados ({productosSeleccionados.length})
            </h2>
            <div className="space-y-2">
              {productosSeleccionados.map((p, i) => (
                <div
                  key={`${p.id}-${i}`}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card"
                >
                  <div className="w-10 h-10 rounded-xl bg-duo-gray flex items-center justify-center text-lg">
                    🛒
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{p.nombre}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {p.marca} · {p.unidad}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-card-foreground">
                    ${p.precio.toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Total estimado</span>
              <span className="text-lg font-bold text-foreground">
                ${productosSeleccionados.reduce((s, p) => s + p.precio, 0).toLocaleString("es-AR")}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-duo-red-light transition-colors active:scale-[0.97]"
            >
              + Agregar más productos
            </button>
          </div>
        )}
      </main>

      <CerebroDuoConnect
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onListaSeleccionada={handleListaSeleccionada}
      />
    </div>
  );
};

export default Index;
