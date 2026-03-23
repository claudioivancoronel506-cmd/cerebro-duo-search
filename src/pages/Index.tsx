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
              JSON estructurado generado por Cerebro Dúo
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[55vh]">
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
