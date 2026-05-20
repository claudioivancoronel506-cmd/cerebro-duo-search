import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import CerebroDuoConnect from "@/components/CerebroDuoConnect";
import SupermarketHome from "@/components/SupermarketHome";
import type { Producto } from "@/lib/catalogo-supermercado";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [cartItems, setCartItems] = useState<(Producto & { cantidadSeleccionada?: number })[]>([]);
  const [isAssistantActive, setIsAssistantActive] = useState(true);
  const [showCartJson, setShowCartJson] = useState(false);

  const handleListaSeleccionada = useCallback(
    (productos: (Producto & { cantidadSeleccionada?: number })[]) => {
      setCartItems((prev) => [...prev, ...productos]);
    },
    []
  );

  const handleDismiss = useCallback(() => {
    setIsAssistantActive(false);
    setTimeout(() => setIsAssistantActive(true), 1500);
  }, []);

  const cartData = cartItems.map((p) => ({
    sku: p.sku,
    name: p.nombre,
    brand: p.marca,
    quantity: p.cantidadSeleccionada ?? 1,
    unit_price: p.precio,
    stock_actual: p.stock_actual,
    expiration_date: p.expiration_date,
    discount_price: (p as any).precioOferta ?? p.discount_price,
    subtotal: (p.cantidadSeleccionada ?? 1) * p.precio,
  }));

  const cartJson = {
    status: "success",
    source: "superflash",
    currency: "ARS",
    data: cartData,
    total: cartData.reduce((sum, item) => sum + item.subtotal, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Superflash — Asistente inteligente de compras</title>
        <meta name="description" content="Superflash: tu asistente de compras con inteligencia artificial" />
        <meta property="og:title" content="Superflash" />
        <meta property="og:description" content="Asistente inteligente de compras para supermercados" />
        <meta property="og:url" content="https://www.xn--doasistente-4gb.com.ar/" />
        <meta property="og:image" content="https://www.xn--doasistente-4gb.com.ar/og-superflash.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_AR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.xn--doasistente-4gb.com.ar/og-superflash.jpg" />
        <link rel="canonical" href="https://www.xn--doasistente-4gb.com.ar/" />
      </Helmet>
      <SupermarketHome
        cartCount={cartItems.length}
        onCartClick={() => setShowCartJson(true)}
      />

      {isAssistantActive && (
        <CerebroDuoConnect
          onListaSeleccionada={handleListaSeleccionada}
          onDismiss={handleDismiss}
        />
      )}

      {/* Cart JSON Demo Modal */}
      <Dialog open={showCartJson} onOpenChange={setShowCartJson}>
        <DialogContent className="max-w-md mx-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Output del Sistema</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              JSON estructurado generado por Superflash
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[55vh]">
            {/* API Documentation Header */}
            <div className="mb-4 space-y-3">
              <h3 className="text-sm font-black tracking-tight text-foreground">Superflash API</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-green-600 text-white text-[10px] font-bold uppercase">POST</span>
                <code className="text-xs font-mono text-muted-foreground">/interpret</code>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Request</p>
                <pre className="text-xs font-mono bg-muted p-3 rounded-lg text-foreground">
{`{
  "text": "pollo, fiambres, pan, yogurt"
}`}
                </pre>
              </div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Response</p>
            </div>
            <pre className="text-xs font-mono bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap break-words text-foreground">
              {cartItems.length > 0
                ? JSON.stringify(cartJson, null, 2)
                : "// Aún no hay productos procesados.\n// Usá el widget para agregar items al carrito."}
            </pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
