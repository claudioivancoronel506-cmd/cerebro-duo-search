export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  unidad: string;
  imagen?: string;
}

export const catalogoProductos: Producto[] = [
  { id: "1", nombre: "Harina 000", marca: "Blancaflor", categoria: "Harina", precio: 890, unidad: "1 kg" },
  { id: "2", nombre: "Harina 0000", marca: "Blancaflor", categoria: "Harina", precio: 920, unidad: "1 kg" },
  { id: "3", nombre: "Harina 000", marca: "Favorita", categoria: "Harina", precio: 750, unidad: "1 kg" },
  { id: "4", nombre: "Harina Leudante", marca: "Pureza", categoria: "Harina", precio: 980, unidad: "1 kg" },
  { id: "5", nombre: "Harina Integral", marca: "Blancaflor", categoria: "Harina", precio: 1050, unidad: "1 kg" },
  { id: "6", nombre: "Pan Felipe", marca: "Panadería del Día", categoria: "Pan", precio: 450, unidad: "6 unidades" },
  { id: "7", nombre: "Pan Mignon", marca: "Bimbo", categoria: "Pan", precio: 520, unidad: "6 unidades" },
  { id: "8", nombre: "Pan Lactal Blanco", marca: "Bimbo", categoria: "Pan", precio: 1200, unidad: "500 g" },
  { id: "9", nombre: "Pan Lactal Integral", marca: "Fargo", categoria: "Pan", precio: 1350, unidad: "500 g" },
  { id: "10", nombre: "Pan Rallado", marca: "Preferido", categoria: "Pan", precio: 680, unidad: "500 g" },
  { id: "11", nombre: "Leche Entera", marca: "La Serenísima", categoria: "Leche", precio: 890, unidad: "1 L" },
  { id: "12", nombre: "Leche Descremada", marca: "La Serenísima", categoria: "Leche", precio: 920, unidad: "1 L" },
  { id: "13", nombre: "Leche Entera", marca: "SanCor", categoria: "Leche", precio: 850, unidad: "1 L" },
  { id: "14", nombre: "Azúcar", marca: "Ledesma", categoria: "Azúcar", precio: 750, unidad: "1 kg" },
  { id: "15", nombre: "Azúcar Impalpable", marca: "Ledesma", categoria: "Azúcar", precio: 890, unidad: "500 g" },
  { id: "16", nombre: "Yerba Mate", marca: "Taragüí", categoria: "Yerba", precio: 2500, unidad: "1 kg" },
  { id: "17", nombre: "Yerba Mate", marca: "Rosamonte", categoria: "Yerba", precio: 2350, unidad: "1 kg" },
  { id: "18", nombre: "Yerba Mate", marca: "Playadito", categoria: "Yerba", precio: 2600, unidad: "1 kg" },
  { id: "19", nombre: "Aceite de Girasol", marca: "Natura", categoria: "Aceite", precio: 1800, unidad: "1.5 L" },
  { id: "20", nombre: "Aceite de Oliva", marca: "Cocinero", categoria: "Aceite", precio: 3200, unidad: "500 ml" },
  { id: "21", nombre: "Fideos Tallarín", marca: "Matarazzo", categoria: "Fideos", precio: 780, unidad: "500 g" },
  { id: "22", nombre: "Fideos Mostachol", marca: "Lucchetti", categoria: "Fideos", precio: 690, unidad: "500 g" },
  { id: "23", nombre: "Arroz Largo Fino", marca: "Gallo", categoria: "Arroz", precio: 950, unidad: "1 kg" },
  { id: "24", nombre: "Arroz Integral", marca: "Gallo", categoria: "Arroz", precio: 1100, unidad: "1 kg" },
  { id: "25", nombre: "Galletitas Crackers", marca: "Traviata", categoria: "Galletitas", precio: 650, unidad: "300 g" },
  { id: "26", nombre: "Galletitas Dulces", marca: "Pepitos", categoria: "Galletitas", precio: 890, unidad: "350 g" },
  { id: "27", nombre: "Manteca", marca: "La Serenísima", categoria: "Manteca", precio: 1450, unidad: "200 g" },
  { id: "28", nombre: "Queso Cremoso", marca: "La Paulina", categoria: "Queso", precio: 2800, unidad: "1 kg" },
  { id: "29", nombre: "Huevos", marca: "Granja del Sol", categoria: "Huevos", precio: 1200, unidad: "12 unidades" },
  { id: "30", nombre: "Sal Fina", marca: "Celusal", categoria: "Sal", precio: 350, unidad: "500 g" },
];

export function buscarProductos(termino: string): Producto[] {
  const t = termino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return catalogoProductos.filter((p) => {
    const texto = `${p.nombre} ${p.marca} ${p.categoria}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return texto.includes(t);
  });
}
