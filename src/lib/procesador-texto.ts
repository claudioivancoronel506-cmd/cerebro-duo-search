/**
 * Simulación local de procesamiento de texto con IA.
 * Extrae términos de búsqueda limpios de texto desordenado.
 * En producción, esto se conectaría a Gemini via Lovable Cloud.
 */

const PALABRAS_RUIDO = new Set([
  "eh", "ehh", "eee", "um", "mmm", "bueno", "dale", "eso", "este",
  "buscame", "quiero", "necesito", "dame", "trae", "traeme", "poneme",
  "dos", "tres", "cuatro", "cinco", "seis", "un", "una", "uno", "unos", "unas",
  "de", "del", "la", "el", "las", "los", "y", "con", "para", "por",
  "esas", "esos", "esa", "ese", "eso", "algo", "cosa", "cosas",
  "baratas", "barata", "baratos", "caras", "cara", "caro", "caros",
  "buenas", "buena", "bueno", "buenos", "mejor", "mejores",
  "también", "tambien", "después", "despues", "primero", "luego",
  "a", "al", "mas", "más", "si", "no", "pero", "que", "como",
  "me", "te", "se", "lo", "le", "nos",
]);

const SINONIMOS: Record<string, string> = {
  "fideo": "Fideos",
  "fideos": "Fideos",
  "pasta": "Fideos",
  "tallarines": "Fideos",
  "galleta": "Galletitas",
  "galletas": "Galletitas",
  "galletita": "Galletitas",
  "galletitas": "Galletitas",
  "huevo": "Huevos",
  "huevos": "Huevos",
  "harina": "Harina",
  "harinas": "Harina",
  "pan": "Pan",
  "panes": "Pan",
  "leche": "Leche",
  "azucar": "Azúcar",
  "azúcar": "Azúcar",
  "yerba": "Yerba",
  "mate": "Yerba",
  "aceite": "Aceite",
  "arroz": "Arroz",
  "manteca": "Manteca",
  "queso": "Queso",
  "sal": "Sal",
};

export function procesarTextoDesordenado(texto: string): string[] {
  const palabras = texto
    .toLowerCase()
    .replace(/[.,;!?¡¿()]/g, "")
    .split(/\s+/)
    .filter((p) => p.length > 1 && !PALABRAS_RUIDO.has(p));

  const terminos = new Set<string>();
  for (const palabra of palabras) {
    const normalizada = palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const sinonimo = SINONIMOS[normalizada] || SINONIMOS[palabra];
    if (sinonimo) {
      terminos.add(sinonimo);
    } else {
      // Capitalize
      terminos.add(palabra.charAt(0).toUpperCase() + palabra.slice(1));
    }
  }

  return Array.from(terminos);
}
