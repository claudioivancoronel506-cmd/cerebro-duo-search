export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  unidad: string;
  imagen?: string;
  keywords?: string[];
}

export const catalogoProductos: Producto[] = [
  {
    id: "1",
    nombre: "Fiambres Surtidos",
    marca: "Paladini",
    categoria: "Fiambres",
    precio: 3500,
    unidad: "500 g",
    imagen: "https://i.ibb.co/nsG5wZNK/tostas-sanas-saludables-elle-gourmet-64b7fc94449f4.jpg",
    keywords: ["fiambre", "jamon", "salame", "mortadela", "queso", "picada"],
  },
  {
    id: "2",
    nombre: "Manteca",
    marca: "La Serenísima",
    categoria: "Lácteos",
    precio: 1450,
    unidad: "200 g",
    imagen: "https://i.ibb.co/Cp79HfnR/whatsapp-image-2020-04-14-at-21-56-181-8d534ba3f2cd57d1fb15869129951510-480-0.jpg",
    keywords: ["manteca", "mantequilla"],
  },
  {
    id: "3",
    nombre: "Pan Lactal",
    marca: "Bimbo",
    categoria: "Pan",
    precio: 1200,
    unidad: "500 g",
    imagen: "https://i.ibb.co/mrmhpK39/344963-800-auto.jpg",
    keywords: ["pan", "pan lactal", "pan blanco", "pan de molde"],
  },
  {
    id: "4",
    nombre: "Yogur",
    marca: "Milkaut",
    categoria: "Lácteos",
    precio: 980,
    unidad: "1 kg",
    imagen: "https://i.ibb.co/k6zG0974/193002-800-auto.jpg",
    keywords: ["yogur", "yogurt", "yoghurt"],
  },
  {
    id: "5",
    nombre: "Pollo Entero",
    marca: "Granja del Sol",
    categoria: "Carnes",
    precio: 4200,
    unidad: "1 unidad",
    imagen: "https://i.ibb.co/4ZJ1tgys/49d594341598b4eb2820d6ea40459fc6.jpg",
    keywords: ["pollo", "pollo entero", "ave", "carne"],
  },
  {
    id: "6",
    nombre: "Dulce de Leche",
    marca: "La Serenísima",
    categoria: "Dulces",
    precio: 2100,
    unidad: "400 g",
    imagen: "https://i.ibb.co/YTtfXsYd/image.png",
    keywords: ["dulce de leche", "dulce", "ddl"],
  },
  {
    id: "7",
    nombre: "Harina 000",
    marca: "Blancaflor",
    categoria: "Harina",
    precio: 890,
    unidad: "1 kg",
    imagen: "https://i.ibb.co/ZRVdbGsb/image.png",
    keywords: ["harina", "harina 000", "harina 0000", "harina leudante"],
  },
  {
    id: "8",
    nombre: "Queso Cremoso",
    marca: "La Paulina",
    categoria: "Lácteos",
    precio: 2800,
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yBM5kqTf/image.png",
    keywords: ["queso", "queso cremoso", "queso rallado"],
  },
  {
    id: "9",
    nombre: "Fideos",
    marca: "Matarazzo",
    categoria: "Pastas",
    precio: 800,
    unidad: "500 g",
    imagen: "https://i.ibb.co/r2sHdQ5t/images-6.jpg",
    keywords: ["fideos", "fideo", "pasta", "tallarines", "spaghetti", "mostachol"],
  },
  {
    id: "10",
    nombre: "LECHE 2X1",
    marca: "La Serenísima",
    categoria: "Lácteos",
    precio: 1800,
    unidad: "2 litros",
    imagen: "https://i.ibb.co/whBDWMmC/images-6.jpg",
    keywords: ["leche", "leche entera", "leche descremada", "lacteo", "2x1"],
  },
  {
    id: "11",
    nombre: "Mermelada",
    marca: "Arcor",
    categoria: "Dulces",
    precio: 2000,
    unidad: "450 g",
    imagen: "https://i.ibb.co/nNSLwbfS/images-2.jpg",
    keywords: ["mermelada", "dulce", "jalea", "mermelada de frutilla", "mermelada de durazno"],
  },
  {
    id: "200",
    nombre: "Azúcar Clásica",
    marca: "Ledesma",
    categoria: "Almacén",
    precio: 950,
    unidad: "1 kg",
    imagen: "https://i.ibb.co/yc9B6MwD/image.jpg",
    keywords: ["azucar", "azúcar", "azucar clasica"],
  },
  {
    id: "201",
    nombre: "Yerba Mate",
    marca: "Mañanita",
    categoria: "Almacén",
    precio: 2200,
    unidad: "500 g",
    imagen: "https://i.ibb.co/BKf1WVcw/image.jpg",
    keywords: ["yerba", "yerba mate", "mate", "mañanita", "mananita"],
  },
  {
    id: "202",
    nombre: "Yerba Mate",
    marca: "Amanda",
    categoria: "Almacén",
    precio: 2500,
    unidad: "500 g",
    imagen: "https://i.ibb.co/8wvMJ8x/image.jpg",
    keywords: ["yerba", "yerba mate", "mate", "amanda"],
  },
  {
    id: "203",
    nombre: "Mayonesa Clásica",
    marca: "Hellmann's",
    categoria: "Almacén",
    precio: 2800,
    unidad: "400 g",
    imagen: "https://i.ibb.co/qYWp3kPZ/image.jpg",
    keywords: ["mayonesa", "mayo", "aderezo"],
  },
  {
    id: "204",
    nombre: "Mayonesa",
    marca: "Natura",
    categoria: "Almacén",
    precio: 1200,
    unidad: "125 g",
    imagen: "https://i.ibb.co/jv7h9bvK/image.jpg",
    keywords: ["mayonesa", "mayo", "aderezo"],
  },
  {
    id: "205",
    nombre: "Fideos Moñitos",
    marca: "Lucchetti",
    categoria: "Pastas",
    precio: 850,
    unidad: "500 g",
    imagen: "https://i.ibb.co/dwvCWGps/image.jpg",
    keywords: ["fideos", "fideo", "pasta", "moñitos", "moños"],
  },
  {
    id: "206",
    nombre: "Leche Entera",
    marca: "Tregar",
    categoria: "Lácteos",
    precio: 1100,
    unidad: "1 L",
    imagen: "https://i.ibb.co/hFrDBs8T/image.jpg",
    keywords: ["leche", "leche entera", "lacteo"],
  },
];

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function buscarProductos(termino: string): Producto[] {
  const t = normalize(termino);
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

  // 1. Strict match: product name STARTS with the search term OR full term matches "nombre + marca"
  const startsWith = catalogoProductos.filter((p) => {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const nombreCompleto = `${nombre} ${marca}`;
    return nombre.startsWith(t) || nombre.split(" ")[0] === t || nombreCompleto === t || t.includes(marca) && nombre.startsWith(t.replace(marca, "").trim());
  });
  addUnique(startsWith);

  // 2. Keyword exact match, with derivative exclusion rule (includes marca)
  const keywordStrict = catalogoProductos.filter((p) => {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const nombreCompleto = `${nombre} ${marca}`;
    const firstWord = nombre.split(" ")[0];
    const keywords = (p.keywords || []).map(normalize);
    const hasExactKeyword = keywords.some((k) => k === t);
    const endsWithTerm = nombre.endsWith(t) || marca === t;
    const marcaMatch = t.includes(marca) && marca.length > 2;

    const nameLenRatio = nombre.length / t.length;
    if (firstWord !== t && nameLenRatio > 1.5 && !hasExactKeyword && !endsWithTerm && !marcaMatch) return false;

    return nombre.includes(t) || nombreCompleto.includes(t) || hasExactKeyword || marcaMatch;
  });
  addUnique(keywordStrict);

  // If we already have results from steps 1-2, return them
  if (results.length > 0) return results;

  // 3. Broad keyword search (includes marca), still with derivative filter
  const broad = catalogoProductos.filter((p) => {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const firstWord = nombre.split(" ")[0];
    const keywords = (p.keywords || []).map(normalize);
    const all = `${nombre} ${marca} ${keywords.join(" ")}`;
    const hasExactKeyword = keywords.some((k) => k === t);
    const endsWithTerm = nombre.endsWith(t) || marca === t;
    const marcaMatch = t.includes(marca) && marca.length > 2;

    if (firstWord !== t && nombre.length / t.length > 1.5 && !nombre.startsWith(t) && !hasExactKeyword && !endsWithTerm && !marcaMatch) return false;

    return all.includes(t);
  });
  if (broad.length > 0) return broad;

  // 4. Fuzzy fallback for typos
  let bestScore = 0;
  let bestProduct: Producto | null = null;

  for (const p of catalogoProductos) {
    const nombre = normalize(p.nombre);
    const marca = normalize(p.marca);
    const firstWord = nombre.split(" ")[0];
    const keywords = (p.keywords || []).map(normalize);
    const hasExactKeyword = keywords.some((k) => k === t);
    const endsWithTerm = nombre.endsWith(t) || marca === t;
    const marcaMatch = t.includes(marca) && marca.length > 2;

    if (firstWord !== t && nombre.length / t.length > 1.5 && !nombre.startsWith(t) && !hasExactKeyword && !endsWithTerm && !marcaMatch) continue;

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
