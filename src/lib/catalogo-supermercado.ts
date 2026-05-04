export type TipoProducto = "normal" | "merma";

/**
 * Buffer de seguridad GLOBAL.
 * Stock físico real reservado para venta presencial — NO se vende online.
 * Unidades_Disponibles_App = stock_actual - STOCK_SAFETY_BUFFER
 */
export const STOCK_SAFETY_BUFFER = 10;

/** Unidades realmente disponibles para venta online. Nunca negativo. */
export function getDisponibleApp(p: Pick<Producto, "stock_actual">): number {
  return Math.max(0, p.stock_actual - STOCK_SAFETY_BUFFER);
}

/** True si el producto está bloqueado para venta online por buffer de seguridad. */
export function isAgotadoOnline(p: Pick<Producto, "stock_actual">): boolean {
  return p.stock_actual <= STOCK_SAFETY_BUFFER;
}

/** Recorta una cantidad solicitada al máximo permitido por el buffer. */
export function capCantidadPorBuffer(
  p: Pick<Producto, "stock_actual">,
  cantidadSolicitada: number
): number {
  const disp = getDisponibleApp(p);
  if (disp <= 0) return 0;
  return Math.max(0, Math.min(cantidadSolicitada, disp));
}

export interface Producto {
  id: string;
  sku: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  original_price: number;
  discount_price: number;
  stock_actual: number;
  expiration_date: string; // vacío "" en góndola normal, fecha próxima en merma
  unidad: string;
  tipo: TipoProducto;
  imagen?: string;
  keywords?: string[];
}

// ───────────── GÓNDOLA NORMAL (sin fecha de vencimiento) ─────────────
export const catalogoProductos: Producto[] = [
  {
    id: "1", sku: "779100001", tipo: "normal",
    nombre: "Fiambres Surtidos", marca: "Paladini", categoria: "Fiambres",
    precio: 3500, original_price: 3500, discount_price: 2450, stock_actual: 18, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/nsG5wZNK/tostas-sanas-saludables-elle-gourmet-64b7fc94449f4.jpg",
    keywords: ["fiambre", "jamon", "salame", "mortadela", "queso", "picada"],
  },
  {
    id: "2", sku: "779100002", tipo: "normal",
    nombre: "Manteca", marca: "La Serenísima", categoria: "Lácteos",
    precio: 1450, original_price: 1450, discount_price: 1015, stock_actual: 16, expiration_date: "",
    unidad: "200 g",
    imagen: "https://i.ibb.co/Cp79HfnR/whatsapp-image-2020-04-14-at-21-56-181-8d534ba3f2cd57d1fb15869129951510-480-0.jpg",
    keywords: ["manteca", "mantequilla"],
  },
  {
    id: "3", sku: "779100003", tipo: "normal",
    nombre: "Pan Lactal", marca: "Bimbo", categoria: "Pan",
    precio: 1200, original_price: 1200, discount_price: 840, stock_actual: 20, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/mrmhpK39/344963-800-auto.jpg",
    keywords: ["pan", "pan lactal", "pan blanco", "pan de molde"],
  },
  {
    id: "4", sku: "779100004", tipo: "normal",
    nombre: "Yogur", marca: "Milkaut", categoria: "Lácteos",
    precio: 980, original_price: 980, discount_price: 686, stock_actual: 17, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/k6zG0974/193002-800-auto.jpg",
    keywords: ["yogur", "yogurt", "yoghurt"],
  },
  {
    id: "5", sku: "779100005", tipo: "normal",
    nombre: "Pollo Entero", marca: "Granja del Sol", categoria: "Carnes",
    precio: 4200, original_price: 4200, discount_price: 2940, stock_actual: 15, expiration_date: "",
    unidad: "1 unidad",
    imagen: "https://i.ibb.co/4ZJ1tgys/49d594341598b4eb2820d6ea40459fc6.jpg",
    keywords: ["pollo", "pollo entero", "ave", "carne"],
  },
  {
    id: "6", sku: "779100006", tipo: "normal",
    nombre: "Dulce de Leche", marca: "La Serenísima", categoria: "Dulces",
    precio: 2100, original_price: 2100, discount_price: 1470, stock_actual: 19, expiration_date: "",
    unidad: "400 g",
    imagen: "https://i.ibb.co/YTtfXsYd/image.png",
    keywords: ["dulce de leche", "dulce", "ddl"],
  },
  {
    id: "7", sku: "779100007", tipo: "normal",
    nombre: "Harina 000", marca: "Blancaflor", categoria: "Harina",
    precio: 890, original_price: 890, discount_price: 623, stock_actual: 18, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/ZRVdbGsb/image.png",
    keywords: ["harina", "harina 000", "harina 0000", "harina leudante"],
  },
  {
    id: "8", sku: "779100008", tipo: "normal",
    nombre: "Queso Cremoso", marca: "La Paulina", categoria: "Lácteos",
    precio: 2800, original_price: 2800, discount_price: 1960, stock_actual: 16, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yBM5kqTf/image.png",
    keywords: ["queso", "queso cremoso", "queso rallado"],
  },
  {
    id: "9", sku: "779100009", tipo: "normal",
    nombre: "Fideos", marca: "Matarazzo", categoria: "Pastas",
    precio: 800, original_price: 800, discount_price: 560, stock_actual: 20, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/r2sHdQ5t/images-6.jpg",
    keywords: ["fideos", "fideo", "pasta", "tallarines", "spaghetti", "mostachol"],
  },
  {
    id: "10", sku: "779100010", tipo: "normal",
    nombre: "LECHE 2X1", marca: "La Serenísima", categoria: "Lácteos",
    precio: 1800, original_price: 1800, discount_price: 1260, stock_actual: 17, expiration_date: "",
    unidad: "2 litros",
    imagen: "https://i.ibb.co/whBDWMmC/images-6.jpg",
    keywords: ["leche", "leche entera", "leche descremada", "lacteo", "2x1"],
  },
  {
    id: "11", sku: "779100011", tipo: "normal",
    nombre: "Mermelada", marca: "Arcor", categoria: "Dulces",
    precio: 2000, original_price: 2000, discount_price: 1400, stock_actual: 15, expiration_date: "",
    unidad: "450 g",
    imagen: "https://i.ibb.co/nNSLwbfS/images-2.jpg",
    keywords: ["mermelada", "dulce", "jalea", "mermelada de frutilla", "mermelada de durazno"],
  },
  {
    id: "200", sku: "779200001", tipo: "normal",
    nombre: "Azúcar Clásica", marca: "Ledesma", categoria: "Almacén",
    precio: 950, original_price: 950, discount_price: 665, stock_actual: 19, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yc9B6MwD/image.jpg",
    keywords: ["azucar", "azúcar", "azucar clasica"],
  },
  {
    id: "201", sku: "779200002", tipo: "normal",
    nombre: "Yerba Mate", marca: "Mañanita", categoria: "Almacén",
    precio: 2200, original_price: 2200, discount_price: 1540, stock_actual: 18, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/BKf1WVcw/image.jpg",
    keywords: ["yerba", "yerba mate", "mate", "mañanita", "mananita"],
  },
  {
    id: "202", sku: "779200003", tipo: "normal",
    nombre: "Yerba Mate", marca: "Amanda", categoria: "Almacén",
    precio: 2500, original_price: 2500, discount_price: 1750, stock_actual: 16, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/8wvMJ8x/image.jpg",
    keywords: ["yerba", "yerba mate", "mate", "amanda"],
  },
  {
    id: "203", sku: "779200004", tipo: "normal",
    nombre: "Mayonesa Clásica", marca: "Hellmann's", categoria: "Almacén",
    precio: 2800, original_price: 2800, discount_price: 1960, stock_actual: 20, expiration_date: "",
    unidad: "400 g",
    imagen: "https://i.ibb.co/qYWp3kPZ/image.jpg",
    keywords: ["mayonesa", "mayo", "aderezo"],
  },
  {
    id: "204", sku: "779200005", tipo: "normal",
    nombre: "Mayonesa", marca: "Natura", categoria: "Almacén",
    precio: 1200, original_price: 1200, discount_price: 840, stock_actual: 17, expiration_date: "",
    unidad: "125 g",
    imagen: "https://i.ibb.co/jv7h9bvK/image.jpg",
    keywords: ["mayonesa", "mayo", "aderezo"],
  },
  {
    id: "205", sku: "779200006", tipo: "normal",
    nombre: "Fideos Moñitos", marca: "Lucchetti", categoria: "Pastas",
    precio: 850, original_price: 850, discount_price: 595, stock_actual: 15, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/dwvCWGps/image.jpg",
    keywords: ["fideos", "fideo", "pasta", "moñitos", "moños"],
  },
  {
    id: "206", sku: "779200007", tipo: "normal",
    nombre: "Leche Entera", marca: "Tregar", categoria: "Lácteos",
    precio: 1100, original_price: 1100, discount_price: 770, stock_actual: 19, expiration_date: "",
    unidad: "1 L",
    imagen: "https://i.ibb.co/hFrDBs8T/image.jpg",
    keywords: ["leche", "leche entera", "lacteo"],
  },
  {
    id: "207", sku: "779200008", tipo: "normal",
    nombre: "Papas Fritas", marca: "Lays", categoria: "Almacén",
    precio: 3800, original_price: 3800, discount_price: 2660, stock_actual: 18, expiration_date: "",
    unidad: "230 g",
    imagen: "https://i.ibb.co/xSxssvH7/image.jpg",
    keywords: ["papas", "papas fritas", "snack", "snacks", "lays"],
  },
  {
    id: "208", sku: "779200009", tipo: "normal",
    nombre: "Arroz Largo Fino", marca: "Lucchetti", categoria: "Almacén",
    precio: 1150, original_price: 1150, discount_price: 805, stock_actual: 16, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/wNvVhBgk/image.jpg",
    keywords: ["arroz", "arroz largo", "arroz fino"],
  },
  {
    id: "209", sku: "779200010", tipo: "normal",
    nombre: "Queso Rallado", marca: "La Quesera", categoria: "Lácteos",
    precio: 1400, original_price: 1400, discount_price: 980, stock_actual: 20, expiration_date: "",
    unidad: "100 g",
    imagen: "https://i.ibb.co/mfXwyXG/image.jpg",
    keywords: ["queso", "queso rallado"],
  },
  {
    id: "210", sku: "779200011", tipo: "normal",
    nombre: "Queso Rallado", marca: "Sancor", categoria: "Lácteos",
    precio: 1950, original_price: 1950, discount_price: 1365, stock_actual: 17, expiration_date: "",
    unidad: "100 g",
    imagen: "https://i.ibb.co/jPs7F5HB/image.jpg",
    keywords: ["queso", "queso rallado"],
  },
  {
    id: "211", sku: "779200012", tipo: "normal",
    nombre: "Huevos", marca: "Check", categoria: "Frescos",
    precio: 1200, original_price: 1200, discount_price: 840, stock_actual: 15, expiration_date: "",
    unidad: "6 unidades",
    imagen: "https://i.ibb.co/Dd7FTvw/image.jpg",
    keywords: ["huevos", "huevo"],
  },
  {
    id: "212", sku: "779200013", tipo: "normal",
    nombre: "Crema de Leche", marca: "Tregar", categoria: "Lácteos",
    precio: 1650, original_price: 1650, discount_price: 1155, stock_actual: 19, expiration_date: "",
    unidad: "200 cc",
    imagen: "https://i.ibb.co/KzxJk2Gt/image.jpg",
    keywords: ["crema", "crema de leche"],
  },
  {
    id: "213", sku: "779200014", tipo: "normal",
    nombre: "Gaseosa", marca: "Coca-Cola", categoria: "Bebidas",
    precio: 2400, original_price: 2400, discount_price: 1680, stock_actual: 18, expiration_date: "",
    unidad: "1.5 L",
    imagen: "https://i.ibb.co/pBFq3dvG/image.jpg",
    keywords: ["gaseosa", "coca", "coca-cola", "coca cola", "bebida"],
  },
  {
    id: "214", sku: "779200015", tipo: "normal",
    nombre: "Galletitas Variedad", marca: "Terrabusi", categoria: "Almacén",
    precio: 1850, original_price: 1850, discount_price: 1295, stock_actual: 16, expiration_date: "",
    unidad: "300 g",
    imagen: "https://i.ibb.co/chkZ6vFc/image.jpg",
    keywords: ["galletitas", "galletas", "galletita", "terrabusi"],
  },
  {
    id: "215", sku: "779200016", tipo: "normal",
    nombre: "Pan Francés", marca: "Panadería", categoria: "Panadería",
    precio: 2200, original_price: 2200, discount_price: 1540, stock_actual: 20, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/KzVRzqgH/image.jpg",
    keywords: ["pan", "pan frances", "pan francés"],
  },
  {
    id: "216", sku: "779200017", tipo: "normal",
    nombre: "Aceite", marca: "Cañuelas", categoria: "Almacén",
    precio: 1900, original_price: 1900, discount_price: 1330, stock_actual: 17, expiration_date: "",
    unidad: "900 ml",
    imagen: "https://i.ibb.co/Pzc5Cn71/image.jpg",
    keywords: ["aceite", "aceite girasol", "cañuelas"],
  },
  {
    id: "217", sku: "779200018", tipo: "normal",
    nombre: "Aceite", marca: "Natura", categoria: "Almacén",
    precio: 2300, original_price: 2300, discount_price: 1610, stock_actual: 18, expiration_date: "",
    unidad: "900 ml",
    imagen: "https://i.ibb.co/JTT7GxL/image.jpg",
    keywords: ["aceite", "aceite girasol", "natura"],
  },
  // ─── Parrilla / Carnicería / Verdulería / Almacén (lote nuevo) ───
  {
    id: "300", sku: "VC8KQ2X1", tipo: "normal",
    nombre: "Vacío de Novillo", marca: "Genérico", categoria: "Carnes",
    precio: 28500, original_price: 28500, discount_price: 24230, stock_actual: 18, expiration_date: "2026-05-15",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/4gp4yKsw/image.jpg",
    keywords: ["vacio", "vacío", "novillo", "carne", "asado", "parrilla"],
  },
  {
    id: "301", sku: "SG7CL3M2", tipo: "normal",
    nombre: "Sal Gruesa", marca: "Celusal", categoria: "Almacén",
    precio: 1850, original_price: 1850, discount_price: 1570, stock_actual: 20, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/mr8dqmrr/image.jpg",
    keywords: ["sal", "sal gruesa", "celusal", "parrilla"],
  },
  {
    id: "302", sku: "CV4KG9P3", tipo: "normal",
    nombre: "Carbón Vegetal", marca: "Genérico", categoria: "Almacén",
    precio: 9400, original_price: 9400, discount_price: 7990, stock_actual: 17, expiration_date: "",
    unidad: "4 kg",
    imagen: "https://i.ibb.co/JRxpGm6D/image.jpg",
    keywords: ["carbon", "carbón", "carbon vegetal", "parrilla", "asado"],
  },
  {
    id: "303", sku: "CH5KG1B4", tipo: "normal",
    nombre: "Chorizo", marca: "Genérico", categoria: "Carnes",
    precio: 8200, original_price: 8200, discount_price: 6970, stock_actual: 16, expiration_date: "2026-05-12",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/99XbZ8d9/image.jpg",
    keywords: ["chorizo", "embutido", "parrilla", "asado"],
  },
  {
    id: "304", sku: "AA6KQ8N5", tipo: "normal",
    nombre: "Achuras", marca: "Genérico", categoria: "Carnes",
    precio: 8800, original_price: 8800, discount_price: 7480, stock_actual: 15, expiration_date: "2026-05-10",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/Sw7MFnWB/image.jpg",
    keywords: ["achuras", "asado", "parrilla", "menudencias"],
  },
  {
    id: "305", sku: "AT9KP2H6", tipo: "normal",
    nombre: "Asado en Tiras", marca: "Genérico", categoria: "Carnes",
    precio: 24500, original_price: 24500, discount_price: 20830, stock_actual: 19, expiration_date: "2026-05-14",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/Kj8T5Y70/image.jpg",
    keywords: ["asado", "asado tira", "asado en tiras", "tira", "parrilla", "carne"],
  },
  {
    id: "306", sku: "PR2GK7T7", tipo: "normal",
    nombre: "Provenzal", marca: "Genérico", categoria: "Almacén",
    precio: 1200, original_price: 1200, discount_price: 1020, stock_actual: 18, expiration_date: "",
    unidad: "23 g",
    imagen: "https://i.ibb.co/BHHkGrhb/image.jpg",
    keywords: ["provenzal", "condimento", "especias"],
  },
  {
    id: "307", sku: "AT3GA8L8", tipo: "normal",
    nombre: "Ajo Triturado", marca: "Alicante", categoria: "Almacén",
    precio: 1510, original_price: 1510, discount_price: 1280, stock_actual: 17, expiration_date: "",
    unidad: "50 g",
    imagen: "https://i.ibb.co/x823pf35/image.jpg",
    keywords: ["ajo", "ajo triturado", "alicante", "condimento"],
  },
  {
    id: "308", sku: "AO4ML9V9", tipo: "normal",
    nombre: "Aceite de Oliva", marca: "Genérico", categoria: "Almacén",
    precio: 15000, original_price: 15000, discount_price: 12750, stock_actual: 16, expiration_date: "",
    unidad: "500 ml",
    imagen: "https://i.ibb.co/MD2FhQr3/image.jpg",
    keywords: ["aceite", "aceite de oliva", "oliva"],
  },
  {
    id: "309", sku: "AO5ML6W1", tipo: "normal",
    nombre: "Aceite de Oliva", marca: "Genérico", categoria: "Almacén",
    precio: 15000, original_price: 15000, discount_price: 12750, stock_actual: 18, expiration_date: "",
    unidad: "500 ml",
    imagen: "https://i.ibb.co/xkdLdFR/image.jpg",
    keywords: ["aceite", "aceite de oliva", "oliva"],
  },
  {
    id: "310", sku: "VE6ML4D2", tipo: "normal",
    nombre: "Vino Tinto", marca: "Estancia Mendoza", categoria: "Bebidas",
    precio: 7900, original_price: 7900, discount_price: 6720, stock_actual: 19, expiration_date: "",
    unidad: "750 ml",
    imagen: "https://i.ibb.co/Rkzwsk9R/image.jpg",
    keywords: ["vino", "vino tinto", "estancia mendoza", "mendoza", "bebida"],
  },
  {
    id: "311", sku: "VT7ML2E3", tipo: "normal",
    nombre: "Vino Tinto", marca: "Genérico", categoria: "Bebidas",
    precio: 6500, original_price: 6500, discount_price: 5530, stock_actual: 20, expiration_date: "",
    unidad: "750 ml",
    imagen: "https://i.ibb.co/JRkbBHwM/image.jpg",
    keywords: ["vino", "vino tinto", "bebida"],
  },
  {
    id: "312", sku: "ZH8KG5F4", tipo: "normal",
    nombre: "Zanahoria", marca: "Genérico", categoria: "Verdulería",
    precio: 1100, original_price: 1100, discount_price: 940, stock_actual: 17, expiration_date: "2026-05-15",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/7tqzgJST/image.jpg",
    keywords: ["zanahoria", "verdura", "verduleria"],
  },
  {
    id: "313", sku: "CM9KG3G5", tipo: "normal",
    nombre: "Carne Molida", marca: "Genérico", categoria: "Carnes",
    precio: 12900, original_price: 12900, discount_price: 10970, stock_actual: 16, expiration_date: "2026-05-08",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/Kc5Fx9Xv/image.jpg",
    keywords: ["carne", "carne molida", "molida", "picada"],
  },
  {
    id: "314", sku: "PR1KG7H6", tipo: "normal",
    nombre: "Pimientos Rojos", marca: "Genérico", categoria: "Verdulería",
    precio: 4100, original_price: 4100, discount_price: 3490, stock_actual: 15, expiration_date: "2026-05-13",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/4wSnLwnn/image.jpg",
    keywords: ["pimiento", "pimientos", "morron", "morrón", "verdura"],
  },
  {
    id: "315", sku: "PR2KG4I7", tipo: "normal",
    nombre: "Pimientos Rojos", marca: "Genérico", categoria: "Verdulería",
    precio: 4100, original_price: 4100, discount_price: 3490, stock_actual: 18, expiration_date: "2026-05-14",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/mVtHhjQF/image.jpg",
    keywords: ["pimiento", "pimientos", "morron", "morrón", "verdura"],
  },
  {
    id: "316", sku: "CV3GR9J8", tipo: "normal",
    nombre: "Cebolla de Verdeo", marca: "Genérico", categoria: "Verdulería",
    precio: 660, original_price: 660, discount_price: 560, stock_actual: 19, expiration_date: "2026-05-09",
    unidad: "100 g",
    imagen: "https://i.ibb.co/xSGm4K51/image.jpg",
    keywords: ["cebolla", "verdeo", "cebolla de verdeo", "verdura"],
  },
  {
    id: "317", sku: "CB4KG6K9", tipo: "normal",
    nombre: "Cebolla", marca: "Genérico", categoria: "Verdulería",
    precio: 1200, original_price: 1200, discount_price: 1020, stock_actual: 20, expiration_date: "2026-05-15",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/0VdJhSNQ/image.jpg",
    keywords: ["cebolla", "verdura"],
  },
  {
    id: "318", sku: "CB5KG8L1", tipo: "normal",
    nombre: "Cebolla", marca: "Genérico", categoria: "Verdulería",
    precio: 1200, original_price: 1200, discount_price: 1020, stock_actual: 17, expiration_date: "2026-05-15",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/nMsfG8JT/image.jpg",
    keywords: ["cebolla", "verdura"],
  },
  {
    id: "400", sku: "SF-001", tipo: "normal",
    nombre: "Pan para Pancho", marca: "Bimbo", categoria: "Panadería",
    precio: 1850, original_price: 1850, discount_price: 1573, stock_actual: 20, expiration_date: "2026-05-15",
    unidad: "6 u.",
    imagen: "https://i.ibb.co/DSq8B3n/image.jpg",
    keywords: ["pan pancho", "pancho", "pan para pancho", "pan de pancho", "panchos"],
  },
  {
    id: "401", sku: "SF-002", tipo: "normal",
    nombre: "Salchicha", marca: "66", categoria: "Fiambres",
    precio: 950, original_price: 950, discount_price: 808, stock_actual: 22, expiration_date: "2026-05-16",
    unidad: "6 u.",
    imagen: "https://i.ibb.co/nM18gz4W/image.jpg",
    keywords: ["salchicha", "salchichas", "pancho"],
  },
  {
    id: "402", sku: "SF-003", tipo: "normal",
    nombre: "Salchicha", marca: "Paladini", categoria: "Fiambres",
    precio: 1650, original_price: 1650, discount_price: 1403, stock_actual: 20, expiration_date: "2026-05-17",
    unidad: "6 u.",
    imagen: "https://i.ibb.co/fV73p3xJ/image.jpg",
    keywords: ["salchicha", "salchichas", "pancho"],
  },
  {
    id: "403", sku: "SF-004", tipo: "normal",
    nombre: "Ravioles", marca: "Paladini", categoria: "Pastas",
    precio: 2400, original_price: 2400, discount_price: 2040, stock_actual: 18, expiration_date: "2026-05-12",
    unidad: "500 g",
    imagen: "https://i.ibb.co/7dFJCz79/image.jpg",
    keywords: ["ravioles", "raviol", "pasta"],
  },
  {
    id: "404", sku: "SF-005", tipo: "normal",
    nombre: "Ravioles 4 Quesos", marca: "La Salteña", categoria: "Pastas",
    precio: 2950, original_price: 2950, discount_price: 2508, stock_actual: 16, expiration_date: "2026-05-13",
    unidad: "500 g",
    imagen: "https://i.ibb.co/LztSvvm3/image.jpg",
    keywords: ["ravioles", "raviol", "pasta", "4 quesos", "cuatro quesos"],
  },
  {
    id: "405", sku: "SF-006", tipo: "normal",
    nombre: "Perejil", marca: "Genérica", categoria: "Verdulería",
    precio: 450, original_price: 450, discount_price: 383, stock_actual: 25, expiration_date: "2026-05-09",
    unidad: "100 g",
    imagen: "https://i.ibb.co/0RDK5RNb/image.jpg",
    keywords: ["perejil", "hierba", "verdura"],
  },
  {
    id: "406", sku: "SF-007", tipo: "normal",
    nombre: "Atún", marca: "La Campagnola", categoria: "Conservas",
    precio: 4200, original_price: 4200, discount_price: 3570, stock_actual: 20, expiration_date: "2026-05-18",
    unidad: "170 g",
    imagen: "https://i.ibb.co/whmLJYt9/image.jpg",
    keywords: ["atun", "conserva", "lata"],
  },
  {
    id: "407", sku: "SF-008", tipo: "normal",
    nombre: "Mostaza", marca: "Natura", categoria: "Aderezos",
    precio: 1550, original_price: 1550, discount_price: 1318, stock_actual: 18, expiration_date: "2026-05-19",
    unidad: "500 g",
    imagen: "https://i.ibb.co/gL2HxZRB/image.jpg",
    keywords: ["mostaza", "aderezo", "salsa"],
  },
  {
    id: "408", sku: "SF-009", tipo: "normal",
    nombre: "Peceto de novillo", marca: "Novillo", categoria: "Carnes",
    precio: 22800, original_price: 22800, discount_price: 19380, stock_actual: 14, expiration_date: "2026-05-11",
    unidad: "2 kg",
    imagen: "https://i.ibb.co/8LTXqzVw/image.jpg",
    keywords: ["peceto", "novillo", "carne", "vacio"],
  },
  {
    id: "409", sku: "SF-010", tipo: "normal",
    nombre: "Ketchup", marca: "Hellmann's", categoria: "Aderezos",
    precio: 1950, original_price: 1950, discount_price: 1658, stock_actual: 20, expiration_date: "2026-05-19",
    unidad: "500 g",
    imagen: "https://i.ibb.co/XfhwTPKS/image.jpg",
    keywords: ["ketchup", "salsa", "aderezo", "tomate"],
  },
  {
    id: "410", sku: "SF-011", tipo: "normal",
    nombre: "Champiñones", marca: "Inca", categoria: "Conservas",
    precio: 3100, original_price: 3100, discount_price: 2635, stock_actual: 16, expiration_date: "2026-05-14",
    unidad: "250 g",
    imagen: "https://i.ibb.co/SDqgJg2h/image.jpg",
    keywords: ["champiñones", "champinones", "hongos"],
  },
  {
    id: "411", sku: "SF-012", tipo: "normal",
    nombre: "Champiñones", marca: "Cumana", categoria: "Conservas",
    precio: 2850, original_price: 2850, discount_price: 2423, stock_actual: 16, expiration_date: "2026-05-14",
    unidad: "284 g",
    imagen: "https://i.ibb.co/wZGRgFH2/image.jpg",
    keywords: ["champiñones", "champinones", "hongos"],
  },
  {
    id: "412", sku: "SF-013", tipo: "normal",
    nombre: "Tomates", marca: "Genérica", categoria: "Verdulería",
    precio: 1900, original_price: 1900, discount_price: 1615, stock_actual: 25, expiration_date: "2026-05-12",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/21DhN71L/image.jpg",
    keywords: ["tomate", "tomates", "verdura", "fruta"],
  },
  {
    id: "413", sku: "SF-014", tipo: "normal",
    nombre: "Papas", marca: "Genérica", categoria: "Verdulería",
    precio: 1100, original_price: 1100, discount_price: 935, stock_actual: 30, expiration_date: "2026-05-18",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/CKJhVj58/image.jpg",
    keywords: ["papa", "papas", "patata", "verdura"],
  },
  {
    id: "414", sku: "SF-015", tipo: "normal",
    nombre: "Nuez moscada", marca: "Alicante", categoria: "Especias",
    precio: 1250, original_price: 1250, discount_price: 1063, stock_actual: 18, expiration_date: "2026-05-19",
    unidad: "25 g",
    imagen: "https://i.ibb.co/Pz9y9JgC/image.jpg",
    keywords: ["nuez moscada", "especia", "condimento"],
  },
  {
    id: "415", sku: "SF-016", tipo: "normal",
    nombre: "Pimienta Blanca", marca: "La Campagnola", categoria: "Especias",
    precio: 1450, original_price: 1450, discount_price: 1233, stock_actual: 18, expiration_date: "2026-05-19",
    unidad: "23 g",
    imagen: "https://i.ibb.co/XxH1Pf28/image.jpg",
    keywords: ["pimienta", "pimienta blanca", "especia", "condimento"],
  },
  {
    id: "416", sku: "SF-017", tipo: "normal",
    nombre: "Apio", marca: "Genérica", categoria: "Verdulería",
    precio: 550, original_price: 550, discount_price: 468, stock_actual: 20, expiration_date: "2026-05-10",
    unidad: "100 g",
    imagen: "https://i.ibb.co/Z1SVC0Km/image.jpg",
    keywords: ["apio", "verdura"],
  },
  {
    id: "417", sku: "SF-018", tipo: "normal",
    nombre: "Morcilla", marca: "Genérica", categoria: "Carnes",
    precio: 4800, original_price: 4800, discount_price: 4080, stock_actual: 16, expiration_date: "2026-05-13",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/PqK2jgs/image.jpg",
    keywords: ["morcilla", "embutido", "achura", "achuras", "parrilla"],
  },
  {
    id: "418", sku: "SF-019", tipo: "normal",
    nombre: "Provoleta", marca: "La Blanqueada", categoria: "Lácteos",
    precio: 3400, original_price: 3400, discount_price: 2890, stock_actual: 18, expiration_date: "2026-05-15",
    unidad: "1 unidad",
    imagen: "https://i.ibb.co/rgDkjWh/image.jpg",
    keywords: ["provoleta", "queso", "provolone", "parrilla"],
  },
  {
    id: "419", sku: "SF-020", tipo: "normal",
    nombre: "Chimichurri", marca: "Alicante", categoria: "Aderezos",
    precio: 1150, original_price: 1150, discount_price: 978, stock_actual: 20, expiration_date: "2026-05-19",
    unidad: "25 g",
    imagen: "https://i.ibb.co/0pbzSjmW/image.jpg",
    keywords: ["chimichurri", "aderezo", "condimento", "parrilla"],
  },
  {
    id: "420", sku: "SF-021", tipo: "normal",
    nombre: "Caldo sabor gallina", marca: "Knorr", categoria: "Almacén",
    precio: 1100, original_price: 1100, discount_price: 935, stock_actual: 25, expiration_date: "2026-05-19",
    unidad: "6 cubos",
    imagen: "https://i.ibb.co/C39tx22y/image.jpg",
    keywords: ["caldo", "caldo gallina", "cubo", "knorr"],
  },
];

// ───────────── MERMA / CONSUMO INMEDIATO ─────────────
// Duplicados de productos frescos (lácteos, carnes, panificados) con:
//  - mismo SKU que el original (identifica el mismo artículo)
//  - id distinto (registro independiente)
//  - tipo: "merma"
//  - 40-50% de descuento sobre original_price
//  - expiration_date entre 15 y 20 días desde hoy
export const catalogoMerma: Producto[] = [
  {
    id: "m-2", sku: "779100002", tipo: "merma",
    nombre: "Manteca", marca: "La Serenísima", categoria: "Lácteos",
    precio: 725, original_price: 1450, discount_price: 725, stock_actual: 15, expiration_date: "2026-05-16",
    unidad: "200 g",
    imagen: "https://i.ibb.co/Cp79HfnR/whatsapp-image-2020-04-14-at-21-56-181-8d534ba3f2cd57d1fb15869129951510-480-0.jpg",
    keywords: ["manteca", "mantequilla"],
  },
  {
    id: "m-3", sku: "779100003", tipo: "merma",
    nombre: "Pan Lactal", marca: "Bimbo", categoria: "Pan",
    precio: 600, original_price: 1200, discount_price: 600, stock_actual: 17, expiration_date: "2026-05-17",
    unidad: "500 g",
    imagen: "https://i.ibb.co/mrmhpK39/344963-800-auto.jpg",
    keywords: ["pan", "pan lactal"],
  },
  {
    id: "m-4", sku: "779100004", tipo: "merma",
    nombre: "Yogur", marca: "Milkaut", categoria: "Lácteos",
    precio: 540, original_price: 980, discount_price: 540, stock_actual: 19, expiration_date: "2026-05-18",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/k6zG0974/193002-800-auto.jpg",
    keywords: ["yogur", "yogurt"],
  },
  {
    id: "m-5", sku: "779100005", tipo: "merma",
    nombre: "Pollo Entero", marca: "Granja del Sol", categoria: "Carnes",
    precio: 2100, original_price: 4200, discount_price: 2100, stock_actual: 16, expiration_date: "2026-05-19",
    unidad: "1 unidad",
    imagen: "https://i.ibb.co/4ZJ1tgys/49d594341598b4eb2820d6ea40459fc6.jpg",
    keywords: ["pollo", "ave", "carne"],
  },
  {
    id: "m-8", sku: "779100008", tipo: "merma",
    nombre: "Queso Cremoso", marca: "La Paulina", categoria: "Lácteos",
    precio: 1540, original_price: 2800, discount_price: 1540, stock_actual: 18, expiration_date: "2026-05-20",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yBM5kqTf/image.png",
    keywords: ["queso", "queso cremoso"],
  },
  {
    id: "m-10", sku: "779100010", tipo: "merma",
    nombre: "LECHE 2X1", marca: "La Serenísima", categoria: "Lácteos",
    precio: 900, original_price: 1800, discount_price: 900, stock_actual: 20, expiration_date: "2026-05-21",
    unidad: "2 litros",
    imagen: "https://i.ibb.co/whBDWMmC/images-6.jpg",
    keywords: ["leche", "leche entera"],
  },
  {
    id: "m-206", sku: "779200007", tipo: "merma",
    nombre: "Leche Entera", marca: "Tregar", categoria: "Lácteos",
    precio: 605, original_price: 1100, discount_price: 605, stock_actual: 15, expiration_date: "2026-05-16",
    unidad: "1 L",
    imagen: "https://i.ibb.co/hFrDBs8T/image.jpg",
    keywords: ["leche", "leche entera"],
  },
  {
    id: "m-211", sku: "779200012", tipo: "merma",
    nombre: "Huevos", marca: "Check", categoria: "Frescos",
    precio: 660, original_price: 1200, discount_price: 660, stock_actual: 17, expiration_date: "2026-05-18",
    unidad: "6 unidades",
    imagen: "https://i.ibb.co/Dd7FTvw/image.jpg",
    keywords: ["huevos", "huevo"],
  },
  {
    id: "m-212", sku: "779200013", tipo: "merma",
    nombre: "Crema de Leche", marca: "Tregar", categoria: "Lácteos",
    precio: 825, original_price: 1650, discount_price: 825, stock_actual: 19, expiration_date: "2026-05-20",
    unidad: "200 cc",
    imagen: "https://i.ibb.co/KzxJk2Gt/image.jpg",
    keywords: ["crema", "crema de leche"],
  },
  {
    id: "m-215", sku: "779200016", tipo: "merma",
    nombre: "Pan Francés", marca: "Panadería", categoria: "Panadería",
    precio: 1100, original_price: 2200, discount_price: 1100, stock_actual: 16, expiration_date: "2026-05-21",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/KzVRzqgH/image.jpg",
    keywords: ["pan", "pan frances"],
  },
];

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function buscarProductos(termino: string): Producto[] {
  const t = normalize(termino.trim());
  const palabrasTermino = t.split(/\s+/);
  const esBusquedaSimple = palabrasTermino.length === 1;

  // Góndola normal: NUNCA mezclar productos de merma en búsqueda general
  const fuente = catalogoProductos;

  const seenIds = new Set<string>();
  const results: Producto[] = [];

  const addUnique = (productos: Producto[]) => {
    for (const p of productos) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        results.push(p);
      }
    }
  };

  // REGLA DE ORO: El término debe coincidir con la PRIMERA palabra del nombre del producto
  // O con un keyword exacto del producto (case-insensitive, trim aplicado).
  const nucleusMatches = fuente.filter((p) => {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const primeraPalabra = nombre.split(/\s+/)[0];
    const nombreCompleto = `${nombre} ${marca}`;
    const keywords = (p.keywords || []).map((k) => normalize(k.trim()));
    const exactKeywordMatch = keywords.some((k) => k === t);

    if (marca === t || (t.includes(marca) && marca.length > 2)) return true;

    if (esBusquedaSimple) {
      return primeraPalabra === t || nombre === t || exactKeywordMatch;
    }

    return nombre.startsWith(t) || nombreCompleto.startsWith(t) || nombreCompleto === t || exactKeywordMatch;
  });

  if (esBusquedaSimple && nucleusMatches.length > 0) {
    const articulos = new Set(["de", "del", "la", "el", "las", "los", "con", "para", "2x1"]);
    const base = nucleusMatches.filter((p) => {
      const palabras = normalize(p.nombre).split(/\s+/).filter((w) => !articulos.has(w));
      return palabras.length === 1;
    });

    if (base.length > 0) {
      addUnique(base);
    } else {
      addUnique(nucleusMatches);
    }
  } else {
    addUnique(nucleusMatches);
  }

  const keywordMatches = fuente.filter((p) => {
    if (seenIds.has(p.id)) return false;
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const primeraPalabra = nombre.split(/\s+/)[0];
    const keywords = (p.keywords || []).map(normalize);
    const hasExactKeyword = keywords.some((k) => k === t);
    const marcaMatch = marca === t || (t.includes(marca) && marca.length > 2);

    if (esBusquedaSimple && primeraPalabra !== t && !marcaMatch) {
      return false;
    }

    if (!esBusquedaSimple) {
      const endsWithTerm = nombre.endsWith(t) || marca === t;
      const nameLenRatio = nombre.length / t.length;
      if (primeraPalabra !== palabrasTermino[0] && nameLenRatio > 1.5 && !hasExactKeyword && !endsWithTerm && !marcaMatch) return false;
    }

    return hasExactKeyword || marcaMatch || nombre.includes(t) || `${nombre} ${marca}`.includes(t);
  });

  if (esBusquedaSimple && keywordMatches.length > 0 && results.length === 0) {
    const articulos = new Set(["de", "del", "la", "el", "las", "los", "con", "para", "2x1"]);
    const base = keywordMatches.filter((p) => {
      const palabras = normalize(p.nombre).split(/\s+/).filter((w) => !articulos.has(w));
      return palabras.length === 1;
    });
    addUnique(base.length > 0 ? base : keywordMatches);
  } else {
    addUnique(keywordMatches);
  }

  if (results.length > 0) return results;

  const broad = fuente.filter((p) => {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const primeraPalabra = nombre.split(/\s+/)[0];
    const keywords = (p.keywords || []).map(normalize);
    const all = `${nombre} ${marca} ${keywords.join(" ")}`;
    const marcaMatch = marca === t || (t.includes(marca) && marca.length > 2);

    if (esBusquedaSimple && primeraPalabra !== t && !marcaMatch) return false;

    return all.includes(t);
  });
  if (broad.length > 0) return broad;

  // Fuzzy fallback ESTRICTO: solo retorna un producto si hay un match
  // sustancial (≥60% del término aparece como substring de algún campo).
  // Evita "alucinaciones" donde 3 letras random matcheaban cualquier cosa.
  if (t.length < 4) return [];

  let bestScore = 0;
  let bestProduct: Producto | null = null;
  const minScoreRequired = Math.max(t.length * 2, 8);

  for (const p of fuente) {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const primeraPalabra = nombre.split(/\s+/)[0];
    const keywords = (p.keywords || []).map(normalize);
    const marcaMatch = marca === t || (t.includes(marca) && marca.length > 2);

    if (esBusquedaSimple && primeraPalabra !== t && !marcaMatch) continue;

    const fields = `${nombre} ${marca} ${keywords.join(" ")}`;
    let score = 0;
    for (let len = Math.max(4, Math.floor(t.length * 0.6)); len <= t.length; len++) {
      for (let i = 0; i <= t.length - len; i++) {
        if (fields.includes(t.substring(i, i + len))) score += len;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestProduct = p;
    }
  }

  return bestProduct && bestScore >= minScoreRequired ? [bestProduct] : [];
}
