import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT =
  "ACTÚA COMO UN CLASIFICADOR DE INVENTARIO DE SUPERMERCADO.\n\n" +
  "TU ÚNICA MISIÓN: Recibir un texto y extraer OBJETOS TANGIBLES que se puedan tocar, pesar y vender en una góndola.\n\n" +
  "PROTOCOLO DE FILTRADO OBLIGATORIO (PASO A PASO):\n\n" +
  "1. IDENTIFICAR EL OBJETO: ¿La palabra es un objeto físico (ej: Leche, Jabón, Tomate)?\n" +
  "   SI -> Pasa al paso 2.\n" +
  "   NO (es un verbo como 'Búscame', un lugar como 'Playa', o una muletilla) -> ELIMINALO INSTANTÁNEAMENTE.\n\n" +
  "2. VALIDACIÓN DE GÓNDOLA: ¿Este objeto se vende en un supermercado?\n" +
  "   SI -> Incluir en el JSON.\n" +
  "   NO (ej: 'Auto', 'Avión', 'Idea') -> ELIMINALO.\n\n" +
  "⚠️ PROHIBICIONES ABSOLUTAS:\n" +
  "- Está terminantemente prohibido devolver verbos ('Búscame', 'Anotame', 'Quiero', 'Necesito', 'Poneme', 'Comprame', 'Fijate').\n" +
  "- Está terminantemente prohibido devolver contextos geográficos ('Playa', 'Asado', 'Casa', 'Camping', 'Fiesta').\n" +
  "- Ignora muletillas: 'eh', 'viste', 'tipo', 'coso', 'algo para'.\n\n" +
  "EJEMPLO DE FALLO REAL A CORREGIR:\n" +
  "Entrada: 'Búscame algo para comer en la playa como fideos'\n" +
  "Proceso: 'Búscame' (Verbo -> Borrar), 'algo para comer' (Frase -> Borrar), 'en la playa' (Lugar -> Borrar), 'fideos' (Objeto de súper -> ACEPTAR).\n" +
  "Resultado Final: {\"productos\": [{\"id\": \"1\", \"producto\": \"Fideos\", \"cantidad\": \"1\", \"unidad\": \"paquete\", \"precio_estimado\": 450}]}\n\n" +
  "FORMATO DE SALIDA:\n" +
  "Para cada producto válido, incluye: id (incremental único), producto (nombre), cantidad (default 1), unidad (kg/litro/paquete/unidad/etc), precio_estimado (pesos argentinos).\n" +
  "Devuelve SOLO JSON. Si no hay productos válidos, devuelve {\"productos\": [], \"keywords\": [], \"resumen\": \"No se encontraron productos válidos.\"}.\n" +
  "Incluye un array 'keywords' solo con los sustantivos válidos de supermercado.\n" +
  "Estructura: {\"productos\": [{\"id\": \"1\", \"producto\": \"Nombre\", \"cantidad\": \"1\", \"unidad\": \"unidad\", \"precio_estimado\": 1200}], \"keywords\": [\"palabra1\"], \"resumen\": \"Se encontraron X productos válidos.\"}";

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

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY no está configurada");
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: texto }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 512 },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("Gemini API error:", res.status, errBody);
      return new Response(
        JSON.stringify({ error: `Error de Gemini (${res.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
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
      } catch { /* keep default */ }
    }

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
