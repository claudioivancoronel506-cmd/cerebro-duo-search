import { useState, useCallback } from "react";
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
    name: p.nombre,
    brand: p.marca,
    quantity: p.cantidadSeleccionada ?? 1,
    unit_price: p.precio,
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
