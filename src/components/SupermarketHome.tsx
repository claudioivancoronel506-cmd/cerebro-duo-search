import { Search, ShoppingCart, Menu, Bell, Tag, Truck, Clock, ChevronRight } from "lucide-react";
import bannerOfertas from "@/assets/banner-ofertas.jpg";
import bannerCarnes from "@/assets/banner-carnes.jpg";
import bannerLacteos from "@/assets/banner-lacteos.jpg";
import CarruselConsumoInmediato from "@/components/CarruselConsumoInmediato";
import type { Producto } from "@/lib/catalogo-supermercado";
const categorias = [
  { emoji: "🥩", nombre: "Carnes" },
  { emoji: "🥛", nombre: "Lácteos" },
  { emoji: "🍎", nombre: "Frutas" },
  { emoji: "🥬", nombre: "Verduras" },
  { emoji: "🍞", nombre: "Panadería" },
  { emoji: "🧴", nombre: "Limpieza" },
  { emoji: "🍷", nombre: "Bebidas" },
  { emoji: "🧊", nombre: "Congelados" },
];

const ofertasFlash = [
  { nombre: "Aceite Girasol 1.5L", marca: "Cocinero", precio: 2890, precioAnterior: 3450, descuento: 16 },
  { nombre: "Leche Entera 1L", marca: "La Serenísima", precio: 1250, precioAnterior: 1590, descuento: 21 },
  { nombre: "Arroz Largo Fino 1kg", marca: "Gallo", precio: 1890, precioAnterior: 2200, descuento: 14 },
  { nombre: "Fideos Tallarin 500g", marca: "Matarazzo", precio: 990, precioAnterior: 1350, descuento: 27 },
];

interface SupermarketHomeProps {
  cartCount: number;
  onCartClick?: () => void;
  onAddProduct?: (producto: Producto & { cantidadSeleccionada?: number }) => void;
}

export default function SupermarketHome({ cartCount, onCartClick, onAddProduct }: SupermarketHomeProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Header — Store branding (yellow) ── */}
      <header className="sticky top-0 z-40" style={{ background: "hsl(var(--store-primary))", color: "hsl(var(--store-primary-foreground))" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Menu className="w-5 h-5" />
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <div>
                <h1 className="text-base font-bold tracking-tight">Tu Súper Online</h1>
                <p className="text-[10px] opacity-70">Comprá desde tu casa</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 opacity-80" />
            <button onClick={onCartClick} className="relative active:scale-95 transition-transform">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center" style={{ background: "hsl(var(--store-secondary))", color: "hsl(var(--store-secondary-foreground))" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/30 backdrop-blur-sm">
            <Search className="w-4 h-4 opacity-60" />
            <span className="text-xs opacity-60">Buscar productos, marcas...</span>
          </div>
        </div>
      </header>

      {/* ── Info bar ── */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-card border-b border-border overflow-x-auto">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground whitespace-nowrap">
          <Truck className="w-3.5 h-3.5" style={{ color: "hsl(var(--store-secondary))" }} />
          <span>Envío gratis +$15.000</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" style={{ color: "hsl(var(--store-secondary))" }} />
          <span>Entrega en 45 min</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground whitespace-nowrap">
          <Tag className="w-3.5 h-3.5" style={{ color: "hsl(var(--store-secondary))" }} />
          <span>3 cuotas sin interés</span>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className="px-4 pt-4">
        <div className="relative rounded-2xl overflow-hidden aspect-[2/1]">
          <img src={bannerOfertas} alt="Ofertas de la semana" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Ofertas de la semana</p>
            <p className="text-lg font-bold text-white leading-tight">Hasta 30% OFF<br/>en productos frescos</p>
          </div>
        </div>
      </div>

      {/* ── Categorías ── */}
      <section className="px-4 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">Categorías</h2>
          <button className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: "hsl(var(--store-secondary))" }}>
            Ver todas <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categorias.map((cat) => (
            <button
              key={cat.nombre}
              className="flex flex-col items-center gap-1.5 min-w-[60px] group"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                {cat.emoji}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{cat.nombre}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Consumo Inmediato ── */}
      {onAddProduct && (
        <CarruselConsumoInmediato onAgregar={onAddProduct} />
      )}

      {/* ── Banners secundarios ── */}
      <section className="px-4 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <img src={bannerCarnes} alt="Carnicería" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-2.5 left-2.5">
              <p className="text-[10px] font-bold text-white/80">CARNICERÍA</p>
              <p className="text-xs font-bold text-white">20% OFF</p>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <img src={bannerLacteos} alt="Lácteos" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-2.5 left-2.5">
              <p className="text-[10px] font-bold text-white/80">LÁCTEOS</p>
              <p className="text-xs font-bold text-white">2do al 50%</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ofertas flash ── */}
      <section className="px-4 pt-5 pb-24">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">⚡ Ofertas Flash</h2>
          <button className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: "hsl(var(--store-secondary))" }}>
            Ver más <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {ofertasFlash.map((prod) => (
            <div
              key={prod.nombre}
              className="rounded-xl border border-border bg-card p-3 space-y-2"
            >
              <div className="w-full aspect-square rounded-lg bg-secondary flex items-center justify-center text-3xl">
                🛒
              </div>
              <div>
                <p className="text-xs font-semibold text-card-foreground truncate">{prod.nombre}</p>
                <p className="text-[10px] text-muted-foreground">{prod.marca}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-card-foreground">
                  ${prod.precio.toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] text-muted-foreground line-through">
                  ${prod.precioAnterior.toLocaleString("es-AR")}
                </span>
                <span className="text-[10px] font-bold" style={{ color: "hsl(var(--store-secondary))" }}>-{prod.descuento}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
