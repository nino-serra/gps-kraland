export interface Province {
  name: string;
  row: number;
  col: number;
}

const provinceRows = [
  ["Sibéria", "Capsulie", "Elmérie", "Bouletie", "Bananie"],
  ["Irendol", "Forêt de Jade", "Kraland", "Hélénie", "Karaïbes"],
  ["Île aux Kanards", "Sicilia", "Milieu", "Slavonie", "Ruthvénie"],
  ["Santa Banana", "Mystisie", "Acropole", "Valégro", "Géofront"],
  ["Australine", "Niarkalistan", "Plaine Irradiée", "Warriorland", "Crab Key"],
] as const;

export const provinces: Province[] = provinceRows.flatMap((row, rowIndex) =>
  row.map((name, colIndex) => ({
    name,
    row: rowIndex,
    col: colIndex,
  })),
);
