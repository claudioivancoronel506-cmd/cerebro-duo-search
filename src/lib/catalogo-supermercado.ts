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
    nombre: "Leche Entera Larga Vida",
    marca: "Milkaut",
    categoria: "Lácteos",
    precio: 950,
    unidad: "1 litro",
    imagen: "https://i.ibb.co/yc9B6MwD/milkaut-entera.jpg",
    keywords: ["leche", "leche entera", "lacteo"],
  },
  {
    id: "201",
    nombre: "Leche Descremada Larga Vida",
    marca: "Milkaut",
    categoria: "Lácteos",
    precio: 980,
    unidad: "1 litro",
    imagen: "https://i.ibb.co/BKf1WVcw/milkaut-descremada.jpg",
    keywords: ["leche", "leche descremada", "lacteo"],
  },
  {
    id: "202",
    nombre: "Fideos Tallarines",
    marca: "Marolio",
    categoria: "Almacén",
    precio: 650,
    unidad: "500 g",
    imagen: "https://i.ibb.co/8wvMJ8x/marolio-tallarin.jpg",
    keywords: ["fideos", "fideo", "tallarin", "tallarines", "pasta"],
  },
  {
    id: "203",
    nombre: "Fideos Tirabuzón",
    marca: "Matarazzo",
    categoria: "Almacén",
    precio: 850,
    unidad: "500 g",
    imagen: "https://i.ibb.co/qYWp3kPZ/matarazzo-tirabuzon.jpg",
    keywords: ["fideos", "fideo", "tirabuzon", "pasta"],
  },
  {
    id: "204",
    nombre: "Harina 000",
    marca: "Favorita",
    categoria: "Almacén",
    precio: 750,
    unidad: "1 kg",
    imagen: "https://i.ibb.co/jv7h9bvK/favorita-000.jpg",
    keywords: ["harina", "harina 000", "harina 0000"],
  },
  {
    id: "205",
    nombre: "Puré de Tomate",
    marca: "Noel",
    categoria: "Almacén",
    precio: 680,
    unidad: "520 g",
    imagen: "https://i.ibb.co/dwvCWGps/noel-tomate.jpg",
    keywords: ["pure", "tomate", "pure de tomate", "salsa"],
  },
  {
    id: "206",
    nombre: "Arroz Largo Fino",
    marca: "Lucchetti",
    categoria: "Almacén",
    precio: 920,
    unidad: "1 kg",
    imagen: "https://i.ibb.co/hFrDBs8T/lucchetti-arroz.jpg",
    keywords: ["arroz", "arroz largo", "arroz fino"],
  },
];

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function buscarProductos(termino: string): Producto[] {
  const t = normalize(termino);

  // 1. Strict match: product name STARTS with the search term
  const startsWith = catalogoProductos.filter((p) => {
    const nombre = normalize(p.nombre);
    return nombre.startsWith(t) || nombre.split(" ")[0] === t;
  });
  if (startsWith.length > 0) return startsWith;

  // 2. Keyword exact match, but apply derivative exclusion rule:
  //    The term must appear as the FIRST keyword or the product name's
  //    first word must match the term. Reject products where the term
  //    is secondary (e.g. "Dulce de leche" when searching "leche").
  const keywordStrict = catalogoProductos.filter((p) => {
    const nombre = normalize(p.nombre);
    const firstWord = nombre.split(" ")[0];
    const keywords = (p.keywords || []).map(normalize);

    // Derivative exclusion: if the product name's first word differs
    // from the search term AND the name is >50% longer, skip it
    const nameLenRatio = nombre.length / t.length;
    if (firstWord !== t && nameLenRatio > 1.5) return false;

    // Check if term matches first keyword or is contained in name starting position
    return nombre.includes(t) || keywords[0] === t || keywords.some((k) => k === t);
  });
  if (keywordStrict.length > 0) return keywordStrict;

  // 3. Broad keyword search (any keyword contains term), still with derivative filter
  const broad = catalogoProductos.filter((p) => {
    const nombre = normalize(p.nombre);
    const firstWord = nombre.split(" ")[0];
    const keywords = (p.keywords || []).map(normalize);
    const all = `${nombre} ${keywords.join(" ")}`;

    // Derivative exclusion
    if (firstWord !== t && nombre.length / t.length > 1.5 && !nombre.startsWith(t)) return false;

    return all.includes(t);
  });
  if (broad.length > 0) return broad;

  // 4. Fuzzy fallback for typos - still respect derivative exclusion
  let bestScore = 0;
  let bestProduct: Producto | null = null;

  for (const p of catalogoProductos) {
    const nombre = normalize(p.nombre);
    const firstWord = nombre.split(" ")[0];

    // Skip derivatives even in fuzzy
    if (firstWord !== t && nombre.length / t.length > 1.5 && !nombre.startsWith(t)) continue;

    const fields = `${nombre} ${(p.keywords || []).map(normalize).join(" ")}`;
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
