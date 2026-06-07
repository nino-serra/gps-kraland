import type { City } from "../types";

export const cities: City[] = [
  { empire: "EB", province: "Niarkalistan", city: "Léprosie", x: 6, y: 8, routing: true },
  { empire: "EB", province: "Plaine Irradiée", city: "Atome", x: 6, y: 5, routing: true },
  { empire: "EB", province: "Mystisie", city: "Lampe du Génie", x: 12, y: 2, routing: true },
  { empire: "EB", province: "Mystisie", city: "Abandon", x: 6, y: 4, routing: true },
  { empire: "EB", province: "Santa Banana", city: "Bagdad", x: 16, y: 3, routing: true },
  { empire: "EB", province: "Santa Banana", city: "Santa Banana City", x: 12, y: 7, routing: true },
  { empire: "EB", province: "Sicilia", city: "Trou Perdu", x: 2, y: 3, routing: true },

  { empire: "CL", province: "Warriorland", city: "Blofelopolis", x: 10, y: 1, routing: true },
  { empire: "CL", province: "Acropole", city: "Forum", x: 10, y: 11, routing: true },
  { empire: "CL", province: "Acropole", city: "Tribunal Mondial", x: 15, y: 7, routing: true },
  { empire: "CL", province: "Milieu", city: "Structural", x: 9, y: 6, routing: true },

  { empire: "RR", province: "Crab Key", city: "Port Magmor", x: 6, y: 6, routing: true },
  { empire: "RR", province: "Crab Key", city: "Diocèse Tutélaire", x: 11, y: 7, routing: true },
  { empire: "RR", province: "Crab Key", city: "Jadeite", x: 17, y: 8, routing: true },
  { empire: "RR", province: "Géofront", city: "Sanctuaire", x: 9, y: 2, routing: true },
  { empire: "RR", province: "Valégro", city: "Fort Émouchet", x: 7, y: 4, routing: true },
  { empire: "RR", province: "Ruthvénie", city: "Ruthenville", x: 5, y: 8, routing: true },
  { empire: "RR", province: "Ruthvénie", city: "Lantenac du Lac", x: 11, y: 3, routing: true },
  { empire: "RR", province: "Karaïbes", city: "Trésorville", x: 5, y: 6, routing: true, notes: "Maritime probable" },
  { empire: "RR", province: "Karaïbes", city: "Palladium City", x: 4, y: 1, routing: true, notes: "Maritime probable" },
  { empire: "RR", province: "Karaïbes", city: "Adam", x: 14, y: 6, routing: true, notes: "Maritime probable" },

  { empire: "RK", province: "Slavonie", city: "Gynerak", x: 5, y: 3, routing: true },
  { empire: "RK", province: "Kraland", city: "Quartier Suprême", x: 9, y: 4, routing: true },
  { empire: "RK", province: "Kraland", city: "Honolulu", x: 3, y: 5, routing: true },

  { empire: "PV", province: "Île aux Kanards", city: "Kanardville", x: 7, y: 5, routing: true },
  { empire: "PV", province: "Forêt de Jade", city: "Accalmie", x: 4, y: 6, routing: true },
  { empire: "PV", province: "Irendol", city: "Bamboutopia", x: 9, y: 10, routing: true },
  { empire: "PV", province: "Irendol", city: "Grand Jardin", x: 5, y: 6, routing: true },
  { empire: "PV", province: "Sibéria", city: "Garinaville", x: 12, y: 4, routing: true, notes: "Glace / mer à gérer" },

  { empire: "KE", province: "Capsulie", city: "Caps Lock", x: 3, y: 8, routing: true },
  { empire: "KE", province: "Elmérie", city: "Gueule du Lézard", x: 4, y: 5, routing: true },
  { empire: "KE", province: "Elmérie", city: "Igloo", x: 16, y: 2, routing: true },
  { empire: "KE", province: "Bouletie", city: "Youpigrad", x: 13, y: 5, routing: true },
  { empire: "KE", province: "Bananie", city: "Distillerie", x: 6, y: 9, routing: true },
  { empire: "KE", province: "Bananie", city: "Quasar", x: 6, y: 3, routing: true },

  { empire: "PI", province: "Hélénie", city: "Bisouville", x: 16, y: 2, routing: true, notes: "Province indépendante" },
  {
    empire: "PI",
    province: "Australine",
    city: "Camp de Bagnards",
    x: 6,
    y: 8,
    routing: false,
    notes: "Province isolée, bagne, exclue du routage normal",
  },
];

export function cityLabel(city: City): string {
  return `${city.city} (${city.province}, ${city.empire})`;
}
