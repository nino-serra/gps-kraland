import type { TerrainType } from "../types";
import { getProvinceRoadSurvey } from "./provinceRoads";
import { getProvinceWaterSurvey } from "./provinceWater";
import { PROVINCE_HEIGHT, PROVINCE_WIDTH } from "./terrain";

export type ProvinceMap = TerrainType[][];

function emptyMap(fill: TerrainType = "terre"): ProvinceMap {
  return Array.from({ length: PROVINCE_HEIGHT }, () => Array.from({ length: PROVINCE_WIDTH }, () => fill));
}

function setTile(map: ProvinceMap, x: number, y: number, terrain: TerrainType): void {
  if (y >= 0 && y < map.length && x >= 0 && x < map[y].length) {
    map[y][x] = terrain;
  }
}

function mapWithTiles(tiles: Array<[number, number, TerrainType]>): ProvinceMap {
  const map = emptyMap();
  for (const [x, y, terrain] of tiles) {
    setTile(map, x, y, terrain);
  }
  return map;
}

// Ajoute ici les vraies cartes terrain, province par province, quand elles seront relevées.
// Chaque carte doit faire 13 lignes de 20 colonnes. Ne pas inventer les routes.
export const provinceMapOverrides: Record<string, ProvinceMap> = {};

export function getProvinceMap(province: string): ProvinceMap {
  const map = provinceMapOverrides[province] ?? emptyMap();
  const roadSurvey = getProvinceRoadSurvey(province);
  const waterSurvey = getProvinceWaterSurvey(province);
  const mapWithSurveys = map.map((row) => [...row]);

  if (roadSurvey) {
    for (const [x, y] of [...roadSurvey.roadTiles, ...roadSurvey.roadTilesToConfirm]) {
      setTile(mapWithSurveys, x, y, "route");
    }
  }

  if (waterSurvey) {
    for (const [x, y] of waterSurvey.waterTiles) {
      setTile(mapWithSurveys, x, y, "mer");
    }

    for (const [x, y] of waterSurvey.waterTilesToConfirm) {
      if (mapWithSurveys[y]?.[x] !== "route") {
        setTile(mapWithSurveys, x, y, "mer");
      }
    }
  }

  return mapWithSurveys;
}
