import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, ShoppingCart, Menu, Bell, Tag, Truck, Clock, ChevronRight, Sparkles, X } from "lucide-react";
import bannerOfertas from "@/assets/banner-ofertas.jpg";
import bannerCarnes from "@/assets/banner-carnes.jpg";
import bannerLacteos from "@/assets/banner-lacteos.jpg";
import { buscarProductos, catalogoProductos, type Producto } from "@/lib/catalogo-supermercado";

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

interface SupermarketHomeProps {
  cartCount: number;
  onCartClick?: () => void;
}

export default function SupermarketHome({ cartCount, onCartClick }: SupermarketHomeProps) {
  // ── Search state (controlled, comma-separated terms) ──
  const [searchInput, setSearchInput] = useState("");
  // True only when the current search came from the URL (deep link)
  const [fromUrl, setFromUrl] = useState(false);

  // Parse ?search= on mount and whenever URL changes (back/forward)
  useEffect(() => {
    const applyFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("search");
      if (raw && raw.trim()) {
        setSearchInput(raw);
        setFromUrl(true);
      } else {
        setFromUrl(false);
      }
    };
    applyFromUrl();
    window.addEventListener("popstate", applyFromUrl);
    return () => window.removeEventListener("popstate", applyFromUrl);
  }, []);

  // Split into clean terms
  const terms = useMemo(
    () =>
      searchInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    [searchInput]
  );

  const isSearching = terms.length > 0;

  // Prioritized list: first matches (in term order, deduped), then everything else
  const { matches, fullList } = useMemo(() => {
    if (!isSearching) {
      return { matches: [] as Producto[], fullList: catalogoProductos };
    }
    const seen = new Set<string>();
    const matched: Producto[] = [];
    for (const term of terms) {
      for (const p of buscarProductos(term)) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          matched.push(p);
        }
      }
    }
    const rest = catalogoProductos.filter((p) => !seen.has(p.id));
    return { matches: matched, fullList: [...matched, ...rest] };
  }, [terms, isSearching]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    // Manual edits invalidate the "sugerido por el asistente" indicator
    setFromUrl(false);
    // Keep URL clean when user clears manually
    if (!value.trim()) {
      const url = new URL(window.location.href);
      if (url.searchParams.has("search")) {
        url.searchParams.delete("search");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setFromUrl(false);
    const url = new URL(window.location.href);
    if (url.searchParams.has("search")) {
      url.searchParams.delete("search");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

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

        {/* Search bar — functional */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/30 backdrop-blur-sm">
            <Search className="w-4 h-4 opacity-70" />
            <input
              type="text"
              inputMode="search"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar productos, marcas..."
              className="flex-1 bg-transparent outline-none text-xs placeholder:opacity-60 text-current min-w-0"
              aria-label="Buscar productos"
            />
            {isSearching && (
              <button
                onClick={clearSearch}
                className="opacity-70 hover:opacity-100 active:scale-90 transition"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
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

      {/* ── Indicador de Deep Link del Asistente ── */}
      {isSearching && fromUrl && (
        <div className="px-4 pt-3">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold"
            style={{
              background: "hsl(var(--sf-purple) / 0.08)",
              borderColor: "hsl(var(--sf-purple) / 0.35)",
              color: "hsl(var(--sf-purple))",
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Resultados sugeridos por el Asistente</span>
            <button
              onClick={clearSearch}
              className="ml-1 opacity-70 hover:opacity-100"
              aria-label="Quitar sugerencia"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          {terms.length > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Buscando: <span className="font-semibold">{terms.join(", ")}</span>
            </p>
          )}
        </div>
      )}

      {/* ── Hero Banner — solo cuando no hay búsqueda ── */}
      {!isSearching && (
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
      )}

      {/* ── Categorías — solo cuando no hay búsqueda ── */}
      {!isSearching && (
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
      )}

      {/* ── Banners secundarios — solo cuando no hay búsqueda ── */}
      {!isSearching && (
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
      )}

      {/* ── Catálogo / Resultados ── */}
      <section className="px-4 pt-5 pb-24">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground">
            {isSearching
              ? `Resultados (${matches.length})`
              : "⚡ Productos destacados"}
          </h2>
          {!isSearching && (
            <button className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: "hsl(var(--store-secondary))" }}>
              Ver más <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {isSearching && matches.length === 0 && (
          <div className="text-center py-8 text-xs text-muted-foreground">
            No se encontraron coincidencias para "<span className="font-semibold">{terms.join(", ")}</span>".
            <br />
            Mostrando catálogo completo abajo.
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          {fullList.map((prod, idx) => {
            const isMatch = isSearching && idx < matches.length;
            return (
              <div
                key={prod.id}
                className={`rounded-xl border bg-card p-3 space-y-2 transition ${
                  isMatch ? "ring-2" : "border-border"
                }`}
                style={
                  isMatch
                    ? {
                        borderColor: "hsl(var(--sf-purple) / 0.4)",
                        boxShadow: "0 2px 8px hsla(var(--sf-purple) / 0.15)",
                      }
                    : undefined
                }
              >
                <div className="w-full aspect-square rounded-lg bg-secondary overflow-hidden flex items-center justify-center text-3xl">
                  {prod.imagen ? (
                    <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    "🛒"
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-card-foreground truncate">{prod.nombre}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{prod.marca} · {prod.unidad}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-card-foreground">
                    ${prod.precio.toLocaleString("es-AR")}
                  </span>
                  {prod.original_price > prod.precio && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      ${prod.original_price.toLocaleString("es-AR")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
