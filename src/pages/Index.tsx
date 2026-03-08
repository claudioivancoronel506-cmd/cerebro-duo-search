import { useState } from "react";
import CerebroDuoConnect from "@/components/CerebroDuoConnect";
import type { Producto } from "@/lib/catalogo-supermercado";

const Index = () => {
  const [productosSeleccionados, setProductosSeleccionados] = useState<Producto[]>([]);

  const handleListaSeleccionada = (productos: Producto[]) => {
    setProductosSeleccionados((prev) => [...prev, ...productos]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {productosSeleccionados.length > 0 && (
        <div className="w-full max-w-lg mx-auto space-y-4 py-8 px-6">
          <h2 className="text-lg font-bold text-foreground">
            Productos seleccionados ({productosSeleccionados.length})
          </h2>
          <div className="space-y-2">
            {productosSeleccionados.map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card"
              >
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">🛒</div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">{p.nombre}</p>
                  <p className="text-[11px] text-muted-foreground">{p.marca} · {p.unidad}</p>
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
        </div>
      )}

      <CerebroDuoConnect
        onListaSeleccionada={handleListaSeleccionada}
      />
    </div>
  );
};

export default Index;
