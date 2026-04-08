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
  expiration_date: string;
  unidad: string;
  imagen?: string;
  keywords?: string[];
}

export const catalogoProductos: Producto[] = [
  {
    id: "1", sku: "779100001",
    nombre: "Fiambres Surtidos", marca: "Paladini", categoria: "Fiambres",
    precio: 3500, original_price: 3500, stock_actual: 18, expiration_date: "2026-04-12",
    unidad: "500 g",
    imagen: "https://i.ibb.co/nsG5wZNK/tostas-sanas-saludables-elle-gourmet-64b7fc94449f4.jpg",
    keywords: ["fiambre", "jamon", "salame", "mortadela", "queso", "picada"],
  },
  {
    id: "2", sku: "779100002",
    nombre: "Manteca", marca: "La Serenísima", categoria: "Lácteos",
    precio: 1450, original_price: 1450, stock_actual: 42, expiration_date: "2026-04-15",
    unidad: "200 g",
    imagen: "https://i.ibb.co/Cp79HfnR/whatsapp-image-2020-04-14-at-21-56-181-8d534ba3f2cd57d1fb15869129951510-480-0.jpg",
    keywords: ["manteca", "mantequilla"],
  },
  {
    id: "3", sku: "779100003",
    nombre: "Pan Lactal", marca: "Bimbo", categoria: "Pan",
    precio: 1200, original_price: 1200, stock_actual: 30, expiration_date: "2026-04-10",
    unidad: "500 g",
    imagen: "https://i.ibb.co/mrmhpK39/344963-800-auto.jpg",
    keywords: ["pan", "pan lactal", "pan blanco", "pan de molde"],
  },
  {
    id: "4", sku: "779100004",
    nombre: "Yogur", marca: "Milkaut", categoria: "Lácteos",
    precio: 980, original_price: 980, stock_actual: 55, expiration_date: "2026-04-11",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/k6zG0974/193002-800-auto.jpg",
    keywords: ["yogur", "yogurt", "yoghurt"],
  },
  {
    id: "5", sku: "779100005",
    nombre: "Pollo Entero", marca: "Granja del Sol", categoria: "Carnes",
    precio: 4200, original_price: 4200, stock_actual: 12, expiration_date: "2026-04-09",
    unidad: "1 unidad",
    imagen: "https://i.ibb.co/4ZJ1tgys/49d594341598b4eb2820d6ea40459fc6.jpg",
    keywords: ["pollo", "pollo entero", "ave", "carne"],
  },
  {
    id: "6", sku: "779100006",
    nombre: "Dulce de Leche", marca: "La Serenísima", categoria: "Dulces",
    precio: 2100, original_price: 2100, stock_actual: 37, expiration_date: "2026-04-20",
    unidad: "400 g",
    imagen: "https://i.ibb.co/YTtfXsYd/image.png",
    keywords: ["dulce de leche", "dulce", "ddl"],
  },
  {
    id: "7", sku: "779100007",
    nombre: "Harina 000", marca: "Blancaflor", categoria: "Harina",
    precio: 890, original_price: 890, stock_actual: 65, expiration_date: "2026-06-30",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/ZRVdbGsb/image.png",
    keywords: ["harina", "harina 000", "harina 0000", "harina leudante"],
  },
  {
    id: "8", sku: "779100008",
    nombre: "Queso Cremoso", marca: "La Paulina", categoria: "Lácteos",
    precio: 2800, original_price: 2800, stock_actual: 22, expiration_date: "2026-04-14",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yBM5kqTf/image.png",
    keywords: ["queso", "queso cremoso", "queso rallado"],
  },
  {
    id: "9", sku: "779100009",
    nombre: "Fideos", marca: "Matarazzo", categoria: "Pastas",
    precio: 800, original_price: 800, stock_actual: 80, expiration_date: "2026-09-15",
    unidad: "500 g",
    imagen: "https://i.ibb.co/r2sHdQ5t/images-6.jpg",
    keywords: ["fideos", "fideo", "pasta", "tallarines", "spaghetti", "mostachol"],
  },
  {
    id: "10", sku: "779100010",
    nombre: "LECHE 2X1", marca: "La Serenísima", categoria: "Lácteos",
    precio: 1800, original_price: 1800, stock_actual: 48, expiration_date: "2026-04-13",
    unidad: "2 litros",
    imagen: "https://i.ibb.co/whBDWMmC/images-6.jpg",
    keywords: ["leche", "leche entera", "leche descremada", "lacteo", "2x1"],
  },
  {
    id: "11", sku: "779100011",
    nombre: "Mermelada", marca: "Arcor", categoria: "Dulces",
    precio: 2000, original_price: 2000, stock_actual: 33, expiration_date: "2026-05-20",
    unidad: "450 g",
    imagen: "https://i.ibb.co/nNSLwbfS/images-2.jpg",
    keywords: ["mermelada", "dulce", "jalea", "mermelada de frutilla", "mermelada de durazno"],
  },
  {
    id: "200", sku: "779200001",
    nombre: "Azúcar Clásica", marca: "Ledesma", categoria: "Almacén",
    precio: 950, original_price: 950, stock_actual: 70, expiration_date: "2026-12-01",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yc9B6MwD/image.jpg",
    keywords: ["azucar", "azúcar", "azucar clasica"],
  },
  {
    id: "201", sku: "779200002",
    nombre: "Yerba Mate", marca: "Mañanita", categoria: "Almacén",
    precio: 2200, original_price: 2200, stock_actual: 45, expiration_date: "2026-08-15",
    unidad: "500 g",
    imagen: "https://i.ibb.co/BKf1WVcw/image.jpg",
    keywords: ["yerba", "yerba mate", "mate", "mañanita", "mananita"],
  },
  {
    id: "202", sku: "779200003",
    nombre: "Yerba Mate", marca: "Amanda", categoria: "Almacén",
    precio: 2500, original_price: 2500, stock_actual: 38, expiration_date: "2026-08-20",
    unidad: "500 g",
    imagen: "https://i.ibb.co/8wvMJ8x/image.jpg",
    keywords: ["yerba", "yerba mate", "mate", "amanda"],
  },
  {
    id: "203", sku: "779200004",
    nombre: "Mayonesa Clásica", marca: "Hellmann's", categoria: "Almacén",
    precio: 2800, original_price: 2800, stock_actual: 27, expiration_date: "2026-06-10",
    unidad: "400 g",
    imagen: "https://i.ibb.co/qYWp3kPZ/image.jpg",
    keywords: ["mayonesa", "mayo", "aderezo"],
  },
  {
    id: "204", sku: "779200005",
    nombre: "Mayonesa", marca: "Natura", categoria: "Almacén",
    precio: 1200, original_price: 1200, stock_actual: 50, expiration_date: "2026-06-05",
    unidad: "125 g",
    imagen: "https://i.ibb.co/jv7h9bvK/image.jpg",
    keywords: ["mayonesa", "mayo", "aderezo"],
  },
  {
    id: "205", sku: "779200006",
    nombre: "Fideos Moñitos", marca: "Lucchetti", categoria: "Pastas",
    precio: 850, original_price: 850, stock_actual: 60, expiration_date: "2026-10-01",
    unidad: "500 g",
    imagen: "https://i.ibb.co/dwvCWGps/image.jpg",
    keywords: ["fideos", "fideo", "pasta", "moñitos", "moños"],
  },
  {
    id: "206", sku: "779200007",
    nombre: "Leche Entera", marca: "Tregar", categoria: "Lácteos",
    precio: 1100, original_price: 1100, stock_actual: 55, expiration_date: "2026-04-16",
    unidad: "1 L",
    imagen: "https://i.ibb.co/hFrDBs8T/image.jpg",
    keywords: ["leche", "leche entera", "lacteo"],
  },
  {
    id: "207", sku: "779200008",
    nombre: "Papas Fritas", marca: "Lays", categoria: "Almacén",
    precio: 3800, original_price: 3800, stock_actual: 25, expiration_date: "2026-05-10",
    unidad: "230 g",
    imagen: "https://i.ibb.co/xSxssvH7/image.jpg",
    keywords: ["papas", "papas fritas", "snack", "snacks", "lays"],
  },
  {
    id: "208", sku: "779200009",
    nombre: "Arroz Largo Fino", marca: "Lucchetti", categoria: "Almacén",
    precio: 1150, original_price: 1150, stock_actual: 72, expiration_date: "2026-11-20",
    unidad: "500 g",
    imagen: "https://i.ibb.co/wNvVhBgk/image.jpg",
    keywords: ["arroz", "arroz largo", "arroz fino"],
  },
  {
    id: "209", sku: "779200010",
    nombre: "Queso Rallado", marca: "La Quesera", categoria: "Lácteos",
    precio: 1400, original_price: 1400, stock_actual: 35, expiration_date: "2026-04-18",
    unidad: "100 g",
    imagen: "https://i.ibb.co/mfXwyXG/image.jpg",
    keywords: ["queso", "queso rallado"],
  },
  {
    id: "210", sku: "779200011",
    nombre: "Queso Rallado", marca: "Sancor", categoria: "Lácteos",
    precio: 1950, original_price: 1950, stock_actual: 28, expiration_date: "2026-04-17",
    unidad: "100 g",
    imagen: "https://i.ibb.co/jPs7F5HB/image.jpg",
    keywords: ["queso", "queso rallado"],
  },
  {
    id: "211", sku: "779200012",
    nombre: "Huevos", marca: "Check", categoria: "Frescos",
    precio: 1200, original_price: 1200, stock_actual: 40, expiration_date: "2026-04-12",
    unidad: "6 unidades",
    imagen: "https://i.ibb.co/Dd7FTvw/image.jpg",
    keywords: ["huevos", "huevo"],
  },
  {
    id: "212", sku: "779200013",
    nombre: "Crema de Leche", marca: "Tregar", categoria: "Lácteos",
    precio: 1650, original_price: 1650, stock_actual: 32, expiration_date: "2026-04-19",
    unidad: "200 cc",
    imagen: "https://i.ibb.co/KzxJk2Gt/image.jpg",
    keywords: ["crema", "crema de leche"],
  },
  {
    id: "213", sku: "779200014",
    nombre: "Gaseosa", marca: "Coca-Cola", categoria: "Bebidas",
    precio: 2400, original_price: 2400, stock_actual: 60, expiration_date: "2026-07-15",
    unidad: "1.5 L",
    imagen: "https://i.ibb.co/pBFq3dvG/image.jpg",
    keywords: ["gaseosa", "coca", "coca-cola", "coca cola", "bebida"],
  },
  {
    id: "214", sku: "779200015",
    nombre: "Galletitas Variedad", marca: "Terrabusi", categoria: "Almacén",
    precio: 1850, original_price: 1850, stock_actual: 44, expiration_date: "2026-06-25",
    unidad: "300 g",
    imagen: "https://i.ibb.co/chkZ6vFc/image.jpg",
    keywords: ["galletitas", "galletas", "galletita", "terrabusi"],
  },
  {
    id: "215", sku: "779200016",
    nombre: "Pan Francés", marca: "Panadería", categoria: "Panadería",
    precio: 2200, original_price: 2200, stock_actual: 20, expiration_date: "2026-04-08",
    unidad: "1 kg",
    imagen: "https://i.ibb.co/KzVRzqgH/image.jpg",
    keywords: ["pan", "pan frances", "pan francés"],
  },
  {
    id: "216", sku: "779200017",
    nombre: "Aceite", marca: "Cañuelas", categoria: "Almacén",
    precio: 1900, original_price: 1900, stock_actual: 50, expiration_date: "2026-10-10",
    unidad: "900 ml",
    imagen: "https://i.ibb.co/Pzc5Cn71/image.jpg",
    keywords: ["aceite", "aceite girasol", "cañuelas"],
  },
  {
    id: "217", sku: "779200018",
    nombre: "Aceite", marca: "Natura", categoria: "Almacén",
    precio: 2300, original_price: 2300, stock_actual: 46, expiration_date: "2026-10-15",
    unidad: "900 ml",
    imagen: "https://i.ibb.co/JTT7GxL/image.jpg",
    keywords: ["aceite", "aceite girasol", "natura"],
  },
];

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function buscarProductos(termino: string): Producto[] {
  const t = normalize(termino);
  const palabrasTermino = t.split(/\s+/);
  const esBusquedaSimple = palabrasTermino.length === 1;

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
  const nucleusMatches = catalogoProductos.filter((p) => {
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

  const keywordMatches = catalogoProductos.filter((p) => {
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

  const broad = catalogoProductos.filter((p) => {
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

  for (const p of catalogoProductos) {
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
