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
];

export function buscarProductos(termino: string): Producto[] {
  const t = termino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Exact matches first
  const exact = catalogoProductos.filter((p) => {
    const texto = `${p.nombre} ${p.marca} ${p.categoria} ${(p.keywords || []).join(" ")}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return texto.includes(t);
  });

  if (exact.length > 0) return exact;

  // Fuzzy: find the most similar product
  let bestScore = 0;
  let bestProduct: typeof catalogoProductos[0] | null = null;

  for (const p of catalogoProductos) {
    const fields = `${p.nombre} ${p.marca} ${p.categoria} ${(p.keywords || []).join(" ")}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Simple similarity: count matching characters
    let score = 0;
    for (const char of t) {
      if (fields.includes(char)) score++;
    }
    // Bonus for substring matches of 3+ chars
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
