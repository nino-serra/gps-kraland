import type { TravelMode, VehicleDefinition } from "../types";

const essence250 = {
  energy: "essence" as const,
  fuelCapacity: 250,
  fuelRuleStatus: "confirmed-secondary-source" as const,
};

export const vehicles: Record<TravelMode, VehicleDefinition> = {
  pied: { id: "pied", label: "À pied", speed: 1, family: "land", energy: "none" },
  velo: { id: "velo", label: "Vélo", speed: 1.2, family: "land", energy: "none" },
  cheval: { id: "cheval", label: "Cheval", speed: 1.2, family: "land", energy: "animal" },
  moto: { id: "moto", label: "Moto", speed: 2, family: "land", ...essence250 },
  voiture: { id: "voiture", label: "Voiture", speed: 2, family: "land", ...essence250 },
  camionnette: { id: "camionnette", label: "Camionnette", speed: 2, family: "land", ...essence250 },
  camion: { id: "camion", label: "Camion", speed: 2, family: "land", ...essence250 },
  bus: { id: "bus", label: "Bus", speed: 2, family: "land", ...essence250 },
  voitureSport: { id: "voitureSport", label: "Voiture de sport", speed: 3, family: "land", ...essence250 },
  motoCourse: { id: "motoCourse", label: "Moto de course", speed: 3, family: "land", ...essence250 },
  motoCourseBidouille: {
    id: "motoCourseBidouille",
    label: "Moto de course bidouillée",
    speed: 3.5,
    family: "land",
    ...essence250,
  },
  camionBidouille: { id: "camionBidouille", label: "Camion bidouillé", speed: 3.5, family: "land", ...essence250 },
  voitureSportBidouille: {
    id: "voitureSportBidouille",
    label: "Voiture de sport bidouillée",
    speed: 3.5,
    family: "land",
    ...essence250,
  },
  kayak: { id: "kayak", label: "Kayak", speed: 1, family: "boat", energy: "none" },
  radeau: { id: "radeau", label: "Radeau", speed: 1, family: "boat", energy: "none", fuelRuleStatus: "to-confirm" },
  voilier: { id: "voilier", label: "Voilier", speed: 1, family: "boat", energy: "none" },
  caravelle: { id: "caravelle", label: "Caravelle", speed: 1, family: "boat", energy: "none" },
  cargo: { id: "cargo", label: "Cargo", speed: 1, family: "boat", energy: "none", fuelRuleStatus: "to-confirm" },
  vedette: { id: "vedette", label: "Vedette", speed: 2, family: "boat", ...essence250 },
  montgolfiere: { id: "montgolfiere", label: "Montgolfière", speed: 1, family: "air", ...essence250 },
  helicoptere: { id: "helicoptere", label: "Hélicoptère", speed: 2, family: "air", ...essence250 },
  jetPrive: { id: "jetPrive", label: "Jet privé", speed: 3, family: "air", energy: "essence", fuelRuleStatus: "to-confirm" },
};

export const vehicleList = Object.values(vehicles);
