export type TipoProducto = "normal" | "merma";

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
    precio: 1450, original_price: 1450, discount_price: 1015, stock_actual: 42, expiration_date: "",
    unidad: "200 g",
    imagen: "https://i.ibb.co/Cp79HfnR/whatsapp-image-2020-04-14-at-21-56-181-8d534ba3f2cd57d1fb15869129951510-480-0.jpg",
    keywords: ["manteca", "mantequilla"],
  },
  {
    id: "3", sku: "779100003", tipo: "normal",
    nombre: "Pan Lactal", marca: "Bimbo", categoria: "Pan",
    precio: 1200, original_price: 1200, discount_price: 840, stock_actual: 30, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/mrmhpK39/344963-800-auto.jpg",
    keywords: ["pan", "pan lactal", "pan blanco", "pan de molde"],
  },
  {
    id: "4", sku: "779100004", tipo: "normal",
    nombre: "Yogur", marca: "Milkaut", categoria: "Lácteos",
    precio: 980, original_price: 980, discount_price: 686, stock_actual: 55, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/k6zG0974/193002-800-auto.jpg",
    keywords: ["yogur", "yogurt", "yoghurt"],
  },
  {
    id: "5", sku: "779100005", tipo: "normal",
    nombre: "Pollo Entero", marca: "Granja del Sol", categoria: "Carnes",
    precio: 4200, original_price: 4200, discount_price: 2940, stock_actual: 12, expiration_date: "",
    unidad: "1 unidad",
    imagen: "https://i.ibb.co/4ZJ1tgys/49d594341598b4eb2820d6ea40459fc6.jpg",
    keywords: ["pollo", "pollo entero", "ave", "carne"],
  },
  {
    id: "6", sku: "779100006", tipo: "normal",
    nombre: "Dulce de Leche", marca: "La Serenísima", categoria: "Dulces",
    precio: 2100, original_price: 2100, discount_price: 1470, stock_actual: 37, expiration_date: "",
    unidad: "400 g",
    imagen: "https://i.ibb.co/YTtfXsYd/image.png",
    keywords: ["dulce de leche", "dulce", "ddl"],
  },
  {
    id: "7", sku: "779100007", tipo: "normal",
    nombre: "Harina 000", marca: "Blancaflor", categoria: "Harina",
    precio: 890, original_price: 890, discount_price: 623, stock_actual: 65, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/ZRVdbGsb/image.png",
    keywords: ["harina", "harina 000", "harina 0000", "harina leudante"],
  },
  {
    id: "8", sku: "779100008", tipo: "normal",
    nombre: "Queso Cremoso", marca: "La Paulina", categoria: "Lácteos",
    precio: 2800, original_price: 2800, discount_price: 1960, stock_actual: 22, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yBM5kqTf/image.png",
    keywords: ["queso", "queso cremoso", "queso rallado"],
  },
  {
    id: "9", sku: "779100009", tipo: "normal",
    nombre: "Fideos", marca: "Matarazzo", categoria: "Pastas",
    precio: 800, original_price: 800, discount_price: 560, stock_actual: 80, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/r2sHdQ5t/images-6.jpg",
    keywords: ["fideos", "fideo", "pasta", "tallarines", "spaghetti", "mostachol"],
  },
  {
    id: "10", sku: "779100010", tipo: "normal",
    nombre: "LECHE 2X1", marca: "La Serenísima", categoria: "Lácteos",
    precio: 1800, original_price: 1800, discount_price: 1260, stock_actual: 48, expiration_date: "",
    unidad: "2 litros",
    imagen: "https://i.ibb.co/whBDWMmC/images-6.jpg",
    keywords: ["leche", "leche entera", "leche descremada", "lacteo", "2x1"],
  },
  {
    id: "11", sku: "779100011", tipo: "normal",
    nombre: "Mermelada", marca: "Arcor", categoria: "Dulces",
    precio: 2000, original_price: 2000, discount_price: 1400, stock_actual: 33, expiration_date: "",
    unidad: "450 g",
    imagen: "https://i.ibb.co/nNSLwbfS/images-2.jpg",
    keywords: ["mermelada", "dulce", "jalea", "mermelada de frutilla", "mermelada de durazno"],
  },
  {
    id: "200", sku: "779200001", tipo: "normal",
    nombre: "Azúcar Clásica", marca: "Ledesma", categoria: "Almacén",
    precio: 950, original_price: 950, discount_price: 665, stock_actual: 70, expiration_date: "",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yc9B6MwD/image.jpg",
    keywords: ["azucar", "azúcar", "azucar clasica"],
  },
  {
    id: "201", sku: "779200002", tipo: "normal",
    nombre: "Yerba Mate", marca: "Mañanita", categoria: "Almacén",
    precio: 2200, original_price: 2200, discount_price: 1540, stock_actual: 45, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/BKf1WVcw/image.jpg",
    keywords: ["yerba", "yerba mate", "mate", "mañanita", "mananita"],
  },
  {
    id: "202", sku: "779200003", tipo: "normal",
    nombre: "Yerba Mate", marca: "Amanda", categoria: "Almacén",
    precio: 2500, original_price: 2500, discount_price: 1750, stock_actual: 38, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/8wvMJ8x/image.jpg",
    keywords: ["yerba", "yerba mate", "mate", "amanda"],
  },
  {
    id: "203", sku: "779200004", tipo: "normal",
    nombre: "Mayonesa Clásica", marca: "Hellmann's", categoria: "Almacén",
    precio: 2800, original_price: 2800, discount_price: 1960, stock_actual: 27, expiration_date: "",
    unidad: "400 g",
    imagen: "https://i.ibb.co/qYWp3kPZ/image.jpg",
    keywords: ["mayonesa", "mayo", "aderezo"],
  },
  {
    id: "204", sku: "779200005", tipo: "normal",
    nombre: "Mayonesa", marca: "Natura", categoria: "Almacén",
    precio: 1200, original_price: 1200, discount_price: 840, stock_actual: 50, expiration_date: "",
    unidad: "125 g",
    imagen: "https://i.ibb.co/jv7h9bvK/image.jpg",
    keywords: ["mayonesa", "mayo", "aderezo"],
  },
  {
    id: "205", sku: "779200006", tipo: "normal",
    nombre: "Fideos Moñitos", marca: "Lucchetti", categoria: "Pastas",
    precio: 850, original_price: 850, discount_price: 595, stock_actual: 60, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/dwvCWGps/image.jpg",
    keywords: ["fideos", "fideo", "pasta", "moñitos", "moños"],
  },
  {
    id: "206", sku: "779200007", tipo: "normal",
    nombre: "Leche Entera", marca: "Tregar", categoria: "Lácteos",
    precio: 1100, original_price: 1100, discount_price: 770, stock_actual: 55, expiration_date: "",
    unidad: "1 L",
    imagen: "https://i.ibb.co/hFrDBs8T/image.jpg",
    keywords: ["leche", "leche entera", "lacteo"],
  },
  {
    id: "207", sku: "779200008", tipo: "normal",
    nombre: "Papas Fritas", marca: "Lays", categoria: "Almacén",
    precio: 3800, original_price: 3800, discount_price: 2660, stock_actual: 25, expiration_date: "",
    unidad: "230 g",
    imagen: "https://i.ibb.co/xSxssvH7/image.jpg",
    keywords: ["papas", "papas fritas", "snack", "snacks", "lays"],
  },
  {
    id: "208", sku: "779200009", tipo: "normal",
    nombre: "Arroz Largo Fino", marca: "Lucchetti", categoria: "Almacén",
    precio: 1150, original_price: 1150, discount_price: 805, stock_actual: 72, expiration_date: "",
    unidad: "500 g",
    imagen: "https://i.ibb.co/wNvVhBgk/image.jpg",
    keywords: ["arroz", "arroz largo", "arroz fino"],
  },
  {
    id: "209", sku: "779200010", tipo: "normal",
    nombre: "Queso Rallado", marca: "La Quesera", categoria: "Lácteos",
    precio: 1400, original_price: 1400, discount_price: 980, stock_actual: 35, expiration_date: "",
    unidad: "100 g",
    imagen: "https://i.ibb.co/mfXwyXG/image.jpg",
    keywords: ["queso", "queso rallado"],
  },
  {
    id: "210", sku: "779200011", tipo: "normal",
    nombre: "Queso Rallado", marca: "Sancor", categoria: "Lácteos",
    precio: 1950, original_price: 1950, discount_price: 1365, stock_actual: 28, expiration_date: "",
    unidad: "100 g",
    imagen: "https://i.ibb.co/jPs7F5HB/image.jpg",
    keywords: ["queso", "queso rallado"],
  },
  {
    id: "211", sku: "779200012", tipo: "normal",
    nombre: "Huevos", marca: "Check", categoria: "Frescos",
    precio: 1200, original_price: 1200, discount_price: 840, stock_actual: 40, expiration_date: "",
    unidad: "6 unidades",
    imagen: "https://i.ibb.co/Dd7FTvw/image.jpg",
    keywords: ["huevos", "huevo"],
  },
  {
    id: "212", sku: "779200013", tipo: "normal",
    nombre: "Crema de Leche", marca: "Tregar", categoria: "Lácteos",
    precio: 1650, original_price: 1650, discount_price: 1155, stock_actual: 32, expiration_date: "",
    unidad: "200 cc",
    imagen: "https://i.ibb.co/KzxJk2Gt/image.jpg",
    keywords: ["crema", "crema de leche"],
  },
  {
    id: "213", sku: "779200014", tipo: "normal",
    nombre: "Gaseosa", marca: "Coca-Cola", categoria: "Bebidas",
    precio: 2400, original_price: 2400, discount_price: 1680, stock_actual: 60, expiration_date: "",
    unidad: "1.5 L",
    imagen: "https://i.ibb.co/pBFq3dvG/image.jpg",
    keywords: ["gaseosa", "coca", "coca-cola", "coca cola", "bebida"],
  },
  {
    id: "214", sku: "779200015", tipo: "normal",
    nombre: "Galletitas Variedad", marca: "Terrabusi", categoria: "Almacén",
    precio: 1850, original_price: 1850, discount_price: 1295, stock_actual: 44, expiration_date: "",
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
    precio: 1900, original_price: 1900, discount_price: 1330, stock_actual: 50, expiration_date: "",
    unidad: "900 ml",
    imagen: "https://i.ibb.co/Pzc5Cn71/image.jpg",
    keywords: ["aceite", "aceite girasol", "cañuelas"],
  },
  {
    id: "217", sku: "779200018", tipo: "normal",
    nombre: "Aceite", marca: "Natura", categoria: "Almacén",
    precio: 2300, original_price: 2300, discount_price: 1610, stock_actual: 46, expiration_date: "",
    unidad: "900 ml",
    imagen: "https://i.ibb.co/JTT7GxL/image.jpg",
    keywords: ["aceite", "aceite girasol", "natura"],
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
    precio: 725, original_price: 1450, discount_price: 725, stock_actual: 6, expiration_date: "2026-05-16",
    unidad: "200 g",
    imagen: "https://i.ibb.co/Cp79HfnR/whatsapp-image-2020-04-14-at-21-56-181-8d534ba3f2cd57d1fb15869129951510-480-0.jpg",
    keywords: ["manteca", "mantequilla"],
  },
  {
    id: "m-3", sku: "779100003", tipo: "merma",
    nombre: "Pan Lactal", marca: "Bimbo", categoria: "Pan",
    precio: 600, original_price: 1200, discount_price: 600, stock_actual: 4, expiration_date: "2026-05-17",
    unidad: "500 g",
    imagen: "https://i.ibb.co/mrmhpK39/344963-800-auto.jpg",
    keywords: ["pan", "pan lactal"],
  },
  {
    id: "m-4", sku: "779100004", tipo: "merma",
    nombre: "Yogur", marca: "Milkaut", categoria: "Lácteos",
    precio: 540, original_price: 980, discount_price: 540, stock_actual: 8, expiration_date: "2026-05-18",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/k6zG0974/193002-800-auto.jpg",
    keywords: ["yogur", "yogurt"],
  },
  {
    id: "m-5", sku: "779100005", tipo: "merma",
    nombre: "Pollo Entero", marca: "Granja del Sol", categoria: "Carnes",
    precio: 2100, original_price: 4200, discount_price: 2100, stock_actual: 3, expiration_date: "2026-05-19",
    unidad: "1 unidad",
    imagen: "https://i.ibb.co/4ZJ1tgys/49d594341598b4eb2820d6ea40459fc6.jpg",
    keywords: ["pollo", "ave", "carne"],
  },
  {
    id: "m-8", sku: "779100008", tipo: "merma",
    nombre: "Queso Cremoso", marca: "La Paulina", categoria: "Lácteos",
    precio: 1540, original_price: 2800, discount_price: 1540, stock_actual: 5, expiration_date: "2026-05-20",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yBM5kqTf/image.png",
    keywords: ["queso", "queso cremoso"],
  },
  {
    id: "m-10", sku: "779100010", tipo: "merma",
    nombre: "LECHE 2X1", marca: "La Serenísima", categoria: "Lácteos",
    precio: 900, original_price: 1800, discount_price: 900, stock_actual: 7, expiration_date: "2026-05-21",
    unidad: "2 litros",
    imagen: "https://i.ibb.co/whBDWMmC/images-6.jpg",
    keywords: ["leche", "leche entera"],
  },
  {
    id: "m-206", sku: "779200007", tipo: "merma",
    nombre: "Leche Entera", marca: "Tregar", categoria: "Lácteos",
    precio: 605, original_price: 1100, discount_price: 605, stock_actual: 9, expiration_date: "2026-05-16",
    unidad: "1 L",
    imagen: "https://i.ibb.co/hFrDBs8T/image.jpg",
    keywords: ["leche", "leche entera"],
  },
  {
    id: "m-211", sku: "779200012", tipo: "merma",
    nombre: "Huevos", marca: "Check", categoria: "Frescos",
    precio: 660, original_price: 1200, discount_price: 660, stock_actual: 6, expiration_date: "2026-05-18",
    unidad: "6 unidades",
    imagen: "https://i.ibb.co/Dd7FTvw/image.jpg",
    keywords: ["huevos", "huevo"],
  },
  {
    id: "m-212", sku: "779200013", tipo: "merma",
    nombre: "Crema de Leche", marca: "Tregar", categoria: "Lácteos",
    precio: 825, original_price: 1650, discount_price: 825, stock_actual: 4, expiration_date: "2026-05-20",
    unidad: "200 cc",
    imagen: "https://i.ibb.co/KzxJk2Gt/image.jpg",
    keywords: ["crema", "crema de leche"],
  },
  {
    id: "m-215", sku: "779200016", tipo: "merma",
    nombre: "Pan Francés", marca: "Panadería", categoria: "Panadería",
    precio: 1100, original_price: 2200, discount_price: 1100, stock_actual: 5, expiration_date: "2026-05-21",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/KzVRzqgH/image.jpg",
    keywords: ["pan", "pan frances"],
  },
];

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function buscarProductos(termino: string): Producto[] {
  const t = normalize(termino);
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

  // REGLA DE ORO: El término debe coincidir con la PRIMERA palabra del nombre del producto.
  const nucleusMatches = fuente.filter((p) => {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const primeraPalabra = nombre.split(/\s+/)[0];
    const nombreCompleto = `${nombre} ${marca}`;

    if (marca === t || (t.includes(marca) && marca.length > 2)) return true;

    if (esBusquedaSimple) {
      return primeraPalabra === t || nombre === t;
    }

    return nombre.startsWith(t) || nombreCompleto.startsWith(t) || nombreCompleto === t;
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

  let bestScore = 0;
  let bestProduct: Producto | null = null;

  for (const p of fuente) {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const primeraPalabra = nombre.split(/\s+/)[0];
    const keywords = (p.keywords || []).map(normalize);
    const marcaMatch = marca === t || (t.includes(marca) && marca.length > 2);

    if (esBusquedaSimple && primeraPalabra !== t && !marcaMatch) continue;

    const fields = `${nombre} ${marca} ${keywords.join(" ")}`;
    let score = 0;
    for (let len = 3; len <= t.length; len++) {
      for (let i = 0; i <= t.length - len; i++) {
        if (fields.includes(t.substring(i, i + len))) score += len;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestProduct = p;
    }
  }

  return bestProduct ? [bestProduct] : [];
}
