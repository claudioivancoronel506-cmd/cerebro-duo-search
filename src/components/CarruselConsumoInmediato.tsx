import { useMemo } from "react";
import { Plus, Clock } from "lucide-react";
import { catalogoProductos, type Producto } from "@/lib/catalogo-supermercado";
import { Badge } from "@/components/ui/badge";

const DESCUENTOS = [20, 30, 40, 50, 60];

function shuffleAndPick<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

interface Props {
  onAgregar: (producto: Producto & { cantidadSeleccionada?: number; precioOferta?: number }) => void;
}

export default function CarruselConsumoInmediato({ onAgregar }: Props) {
  const productos = useMemo(() => {
    const seleccion = shuffleAndPick(
      catalogoProductos.filter((p) => p.imagen),
      5
    );
    return seleccion.map((p) => {
      const descuento = DESCUENTOS[Math.floor(Math.random() * DESCUENTOS.length)];
      const precioOferta = Math.round(p.precio * (1 - descuento / 100));
      return { ...p, descuento, precioOferta };
    });
  }, []);

  return (
    <section className="px-4 pt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
          <h2 className="text-sm font-bold text-foreground">Consumo Inmediato</h2>
        </div>
        <Badge
          className="text-[9px] px-2 py-0.5 border-none"
          style={{
            background: "hsl(var(--destructive) / 0.12)",
            color: "hsl(var(--destructive))",
          }}
        >
          🔥 Últimas unidades
        </Badge>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
        {productos.map((prod) => (
          <div
            key={prod.id}
            className="relative min-w-[150px] w-[150px] shrink-0 snap-start rounded-2xl border border-border bg-card overflow-hidden group"
          >
            {/* Badge vence pronto */}
            <div
              className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
              style={{
                background: "hsl(var(--destructive))",
                color: "hsl(var(--destructive-foreground))",
              }}
            >
              <Clock className="w-2.5 h-2.5" />
              Vence pronto
            </div>

            {/* Descuento badge */}
            <div
              className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black"
              style={{
                background: "hsl(var(--store-secondary))",
                color: "hsl(var(--store-secondary-foreground))",
              }}
            >
              -{prod.descuento}%
            </div>

            {/* Imagen */}
            <div className="w-full aspect-square bg-secondary overflow-hidden">
              {prod.imagen ? (
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🛒</div>
              )}
            </div>

            {/* Info */}
            <div className="p-2.5 space-y-1.5">
              <p className="text-xs font-semibold text-card-foreground truncate leading-tight">
                {prod.nombre}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{prod.marca} · {prod.unidad}</p>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-sm font-bold text-card-foreground">
                    ${prod.precioOferta.toLocaleString("es-AR")}
                  </span>
                  <span className="block text-[10px] text-muted-foreground line-through">
                    ${prod.precio.toLocaleString("es-AR")}
                  </span>
                </div>
                <button
                  onClick={() =>
                    onAgregar({
                      ...prod,
                      precio: prod.precioOferta,
                      cantidadSeleccionada: 1,
                      precioOferta: prod.precioOferta,
                    })
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                  style={{
                    background: "hsl(var(--store-secondary))",
                    color: "hsl(var(--store-secondary-foreground))",
                  }}
                  aria-label={`Agregar ${prod.nombre}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
