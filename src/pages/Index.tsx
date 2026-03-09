import { useState, useCallback } from "react";
import CerebroDuoConnect from "@/components/CerebroDuoConnect";
import SupermarketHome from "@/components/SupermarketHome";
import type { Producto } from "@/lib/catalogo-supermercado";
import { toast } from "sonner";

const Index = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isAssistantActive, setIsAssistantActive] = useState(true);

  const handleListaSeleccionada = useCallback((productos: Producto[]) => {
    setCartCount((prev) => prev + productos.length);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsAssistantActive(false);
    // Re-enable after unmount so user can use it again
    setTimeout(() => setIsAssistantActive(true), 1500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SupermarketHome cartCount={cartCount} />

      {isAssistantActive && (
        <CerebroDuoConnect
          onListaSeleccionada={handleListaSeleccionada}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};

export default Index;
