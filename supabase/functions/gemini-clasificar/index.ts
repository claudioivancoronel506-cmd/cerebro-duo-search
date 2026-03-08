import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `ACTÚA COMO UN CLASIFICADOR DE INVENTARIO DE SUPERMERCADO.

TU ÚNICA MISIÓN: Recibir un texto y extraer OBJETOS TANGIBLES que se puedan tocar, pesar y vender en una góndola.

PROTOCOLO DE FILTRADO OBLIGATORIO (PASO A PASO):

1. IDENTIFICAR EL OBJETO: ¿La palabra es un objeto físico (ej: Leche, Jabón, Tomate)?
   SI -> Pasa al paso 2.
   NO (es un verbo como 'Búscame', un lugar como 'Playa', o una muletilla) -> ELIMINALO INSTANTÁNEAMENTE.

2. VALIDACIÓN DE GÓNDOLA: ¿Este objeto se vende en un supermercado?
   SI -> Incluir en el JSON.
   NO (ej: 'Auto', 'Avión', 'Idea') -> ELIMINALO.

⚠️ PROHIBICIONES ABSOLUTAS:
- Está terminantemente prohibido devolver verbos ('Búscame', 'Anotame', 'Quiero', 'Necesito', 'Poneme', 'Comprame', 'Fijate').
- Está terminantemente prohibido devolver contextos geográficos ('Playa', 'Asado', 'Casa', 'Camping', 'Fiesta').
- Ignora muletillas: 'eh', 'viste', 'tipo', 'coso', 'algo para'.

EJEMPLO DE FALLO REAL A CORREGIR:
Entrada: 'Búscame algo para comer en la playa como fideos'
Proceso: 'Búscame' (Verbo -> Borrar), 'algo para comer' (Frase -> Borrar), 'en la playa' (Lugar -> Borrar), 'fideos' (Objeto de súper -> ACEPTAR).
Resultado Final: {"productos": [{"id": "1", "producto": "Fideos", "cantidad": "1", "unidad": "paquete", "precio_estimado": 450}]}

FORMATO DE SALIDA:
Para cada producto válido, incluye: id (incremental único), producto (nombre), cantidad (default 1), unidad (kg/litro/paquete/unidad/etc), precio_estimado (pesos argentinos).
Devuelve SOLO JSON válido sin markdown. Si no hay productos válidos, devuelve {"productos": [], "keywords": [], "resumen": "No se encontraron productos válidos."}.
Incluye un array 'keywords' solo con los sustantivos válidos de supermercado.
Estructura: {"productos": [{"id": "1", "producto": "Nombre", "cantidad": "1", "unidad": "unidad", "precio_estimado": 1200}], "keywords": ["palabra1"], "resumen": "Se encontraron X productos válidos."}`;

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
        max_tokens: 512,
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
