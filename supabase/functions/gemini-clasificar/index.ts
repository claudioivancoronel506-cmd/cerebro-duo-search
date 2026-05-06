import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `ACTÚA COMO UN NORMALIZADOR LITERAL DE PRODUCTOS DE SUPERMERCADO.

TU MISIÓN: Recibir un texto desordenado y extraer ÚNICAMENTE los objetos tangibles de supermercado que el usuario mencionó explícitamente. NO inventar, NO sugerir, NO agregar productos que el usuario no haya dicho.

REGLA CRÍTICA — PROHIBIDO GENERALIZAR:
- NUNCA recortes ni simplifiques el nombre de un producto. El campo "producto" debe ser lo más fiel posible al dictado del usuario.
- Si el usuario menciona una MARCA (ej: 'Mañanita', 'Amanda', 'Lucchetti', 'Hellmanns', 'Terrabusi'), DEBES incluirla en el campo "producto".
- Si el usuario menciona un CALIFICADOR o VARIEDAD (ej: 'Cremoso', 'Rallado', 'Moñito', 'Tirabuzón', 'Descremada', 'Entera', 'Clásica', 'Gruesa'), DEBES incluirlo como parte del nombre.
- Tallarines, Moñitos y Tirabuzones son productos DISTINTOS. No los generalices como "Fideos".
- 'Queso Rallado' y 'Queso Cremoso' son productos DISTINTOS. No los agrupes como "Queso".
- Los adjetivos y calificadores son PARTE INSEPARABLE del nombre del producto y NO deben eliminarse jamás.

PRIORIDAD SEMÁNTICA:
- ELIMINAR: verbos ('traeme', 'anotá', 'poneme', 'comprame', 'búscame', 'fijate', 'quiero', 'necesito') y muletillas ('eh', 'viste', 'tipo', 'coso', 'algo para').
- CONSERVAR: sustantivos, adjetivos descriptivos, marcas comerciales y calificadores de variedad.

═══════════════════════════════════════════
MÓDULO: DETECCIÓN DE MODIFICADORES DE VALOR
═══════════════════════════════════════════

DICCIONARIO DE AHORRO — Las siguientes palabras indican "Intención de Barato":
barato, barata, baratos, baratas, económico, económica, económicos, económicas, oferta, ofertas, mejor precio, más bajo, más barato, más barata, más baratos, más baratas, más económico, más económica.

REGLAS DE EXTRACCIÓN:
1. Estas palabras NO son parte del nombre del producto. NUNCA incluirlas en el campo "producto".
2. Si una de estas palabras acompaña a un producto, agregar "sort": "price_asc" en ese objeto.
   Ejemplo: 'Buscame la harina barata' → {"producto": "Harina", "sort": "price_asc"}
3. Si la frase de ahorro es GLOBAL (ej: 'buscame los productos más baratos', 'todo barato', 'lo más económico'), agregar "global_sort": "price_asc" en el JSON raíz.
4. IGNORAR GÉNERO: 'harina barato', 'aceite barata' → normalizar igualmente a sort: price_asc.

VALIDACIÓN INTERNA (el modelo DEBE pasar estos tests):
- Entrada: 'Queso rallado y un queso cremoso' → [{"producto": "Queso Rallado"}, {"producto": "Queso Cremoso"}] ✅ (NO agrupar como "Queso" ❌)
- Entrada: 'Fideo tirabuzón y galletitas terrabusi' → [{"producto": "Fideo Tirabuzón"}, {"producto": "Galletitas Terrabusi"}] ✅
- Entrada: 'Yerba mañanita' → [{"producto": "Yerba Mañanita"}] ✅ (NO devolver "Yerba" ❌)
- Entrada: 'Traeme leche descremada y mayonesa hellmanns' → [{"producto": "Leche Descremada"}, {"producto": "Mayonesa Hellmanns"}] ✅
- Entrada: 'Buscame la harina barata' → [{"producto": "Harina", "sort": "price_asc"}] ✅ (NO devolver "Harina Barata" ❌)
- Entrada: 'Quiero aceite económico y yerba' → [{"producto": "Aceite", "sort": "price_asc"}, {"producto": "Yerba"}] ✅
- Entrada: 'Dame los productos más baratos' → global_sort: "price_asc" ✅

PROTOCOLO DE FILTRADO OBLIGATORIO (PASO A PASO):

1. IDENTIFICAR EL OBJETO: ¿La palabra es un objeto físico (ej: Leche, Jabón, Tomate)?
   SI -> Pasa al paso 2.
   NO (es un verbo o una muletilla) -> ELIMINALO INSTANTÁNEAMENTE.

2. VALIDACIÓN DE GÓNDOLA: ¿Este objeto se vende en un supermercado?
   SI -> Incluir en el JSON.
   NO (ej: 'Auto', 'Avión', 'Idea') -> ELIMINALO.

3. VALIDACIÓN DE CATEGORÍA: El producto debe pertenecer a una de estas categorías permitidas:
   Almacén, Bebidas, Limpieza, Lácteos, Carnicería, Pollería, Panadería, Perfumería, Verdulería.
   Si el producto no encaja en ninguna de estas categorías -> ELIMINALO.

⚠️ PROHIBICIONES ABSOLUTAS:
- Está terminantemente prohibido devolver verbos o muletillas.
- Está terminantemente prohibido devolver contextos geográficos ('Playa', 'Asado', 'Casa').
- Está terminantemente prohibido agregar productos que el usuario NO mencionó. CERO sugerencias.
- Categorías PROHIBIDAS: Bazar, Electrónica. Si un producto pertenece a estas categorías, ELIMINALO.
- NUNCA elimines marcas, calificadores ni adjetivos que definen al producto.
- NUNCA incluyas palabras del Diccionario de Ahorro dentro del campo "producto".

EJEMPLOS DE SALIDA:
Entrada: 'Pan y Leche'
Resultado: {"productos": [{"id": "1", "sku": "", "producto": "Pan", "cantidad": "1", "unidad": "unidad", "precio_estimado": 0}, {"id": "2", "sku": "", "producto": "Leche", "cantidad": "1", "unidad": "unidad", "precio_estimado": 0}], "keywords": ["pan", "leche"], "resumen": "Se encontraron 2 productos."}

Entrada: 'Traeme yerba Mañanita y fideo moñito Lucchetti'
Resultado: {"productos": [{"id": "1", "sku": "", "producto": "Yerba Mañanita", "cantidad": "1", "unidad": "unidad", "precio_estimado": 0}, {"id": "2", "sku": "", "producto": "Fideo Moñito Lucchetti", "cantidad": "1", "unidad": "unidad", "precio_estimado": 0}], "keywords": ["yerba mañanita", "fideo moñito lucchetti"], "resumen": "Se encontraron 2 productos."}

Entrada: 'Buscame la harina barata y leche económica'
Resultado: {"productos": [{"id": "1", "sku": "", "producto": "Harina", "cantidad": "1", "unidad": "unidad", "precio_estimado": 0, "sort": "price_asc"}, {"id": "2", "sku": "", "producto": "Leche", "cantidad": "1", "unidad": "unidad", "precio_estimado": 0, "sort": "price_asc"}], "keywords": ["harina", "leche"], "global_sort": "price_asc", "resumen": "Se encontraron 2 productos."}

FORMATO DE SALIDA:
Para cada producto, incluye: id (incremental único), sku (string vacío "", el frontend lo resolverá), producto (nombre completo con marca/calificador/tipo si fue mencionado, SIN palabras de ahorro), cantidad (default 1), unidad (kg/litro/paquete/unidad/etc), precio_estimado (siempre 0), y opcionalmente "sort": "price_asc" si el usuario pidió el más barato de ese producto.
Devuelve SOLO JSON válido sin markdown. Si no hay productos válidos, devuelve {"productos": [], "keywords": [], "resumen": "No se encontraron productos válidos."}.
Incluye un array 'keywords' con los nombres completos de productos (incluyendo marca/calificador/tipo) en minúsculas.
Si el usuario pidió ordenar TODA la lista por precio, incluye "global_sort": "price_asc" en el JSON raíz.
Estructura: {"productos": [...], "keywords": [...], "global_sort": "price_asc"|null, "resumen": "..."}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texto } = await req.json();
    if (!texto || typeof texto !== "string") {
      return new Response(JSON.stringify({ error: "Falta el campo 'texto'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key no configurada en el servidor" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Lovable AI Gateway with texto:", texto.substring(0, 80));

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: texto },
        ],
        temperature: 0.1,
        max_tokens: 2048,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error(`AI Gateway error: status=${res.status} body=${errBody}`);

      if (res.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes, intentá en unos segundos" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (res.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados en el servicio de IA" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: `Error del servicio de IA (${res.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const rawText = data.choices?.[0]?.message?.content ?? "{}";
    console.log("AI raw response:", rawText.substring(0, 200));

    const match = rawText.match(/\{[\s\S]*\}/);

    let result = { productos: [], keywords: [], resumen: "" };
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        result = {
          productos: parsed.productos || [],
          keywords: parsed.keywords || [],
          resumen: parsed.resumen || "",
        };
      } catch (parseErr) {
        console.error("JSON parse error:", parseErr, "raw:", match[0].substring(0, 200));
      }
    } else {
      console.error("No JSON found in response:", rawText.substring(0, 200));
    }

    console.log(`Returning ${result.productos.length} productos, ${result.keywords.length} keywords`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Edge function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
