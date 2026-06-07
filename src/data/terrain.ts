import type { SurfaceType, TerrainType, TravelFamily } from "../types";

export const PROVINCE_WIDTH = 20;
export const PROVINCE_HEIGHT = 13;
export const MIN_X = 0;
export const MIN_Y = 0;
export const MAX_X = 19;
export const MAX_Y = 12;
export const PROVINCE_COST_MULTIPLIER = 10;

export const terrainCosts: Record<TerrainType, Partial<Record<TravelFamily, number>>> = {
  unknown: { land: 4 },
  terre: { land: 1 },
  herbe: { land: 1 },
  fleurs: { land: 1 },
  arbre: { land: 2 },
  glace: { land: 1 },
  montagne: { land: 2 },
  route: { land: 0.5 },
  pont: { land: 0.5, boat: 2 },
  sable: { land: 1, boat: 2 },
  mer: { boat: 1 },
  riviere: { boat: 1 },
};

export const surfaceCosts: Record<SurfaceType, Partial<Record<TravelFamily, number>>> = {
  terre: { land: 1 },
  route: { land: 0.5 },
  eau: { boat: 1 },
};

export function getSurfaceType(terrain: TerrainType): SurfaceType {
  if (terrain === "route" || terrain === "pont") return "route";
  if (terrain === "mer" || terrain === "riviere") return "eau";
  return "terre";
}

export function isInsideProvince(x: number, y: number): boolean {
  return x >= MIN_X && x <= MAX_X && y >= MIN_Y && y <= MAX_Y;
}

export function getTerrainCost(terrain: TerrainType, family: TravelFamily): number | null {
  if (family === "air") return 0.5;
  return terrainCosts[terrain][family] ?? null;
}
