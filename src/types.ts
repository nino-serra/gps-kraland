export type Empire = "EB" | "CL" | "RR" | "RK" | "PV" | "KE" | "PI";

export type TerrainType =
  | "unknown"
  | "terre"
  | "herbe"
  | "fleurs"
  | "arbre"
  | "glace"
  | "montagne"
  | "route"
  | "pont"
  | "sable"
  | "mer"
  | "riviere";

export type SurfaceType = "terre" | "route" | "eau";

export type TravelMode =
  | "pied"
  | "velo"
  | "cheval"
  | "moto"
  | "voiture"
  | "camionnette"
  | "camion"
  | "bus"
  | "voitureSport"
  | "motoCourse"
  | "motoCourseBidouille"
  | "camionBidouille"
  | "voitureSportBidouille"
  | "kayak"
  | "radeau"
  | "voilier"
  | "caravelle"
  | "cargo"
  | "vedette"
  | "montgolfiere"
  | "helicoptere"
  | "jetPrive";

export type TravelFamily = "land" | "boat" | "air";
export type EnergyType = "none" | "essence" | "animal";

export interface City {
  empire: Empire;
  province: string;
  city: string;
  x: number;
  y: number;
  routing: boolean;
  notes?: string;
}

export interface VehicleDefinition {
  id: TravelMode;
  label: string;
  speed: number;
  family: TravelFamily;
  energy: EnergyType;
  fuelCapacity?: number;
  fuelRuleStatus?: "confirmed-secondary-source" | "to-confirm";
}

export interface Position {
  x: number;
  y: number;
}

export interface WorldPosition extends Position {
  province: string;
  globalX: number;
  globalY: number;
}

export interface PathResult {
  ok: boolean;
  path: Position[];
  worldPath?: WorldPosition[];
  totalMinutes: number;
  rawMinutes: number;
  visitedCount: number;
  warning?: string;
}
