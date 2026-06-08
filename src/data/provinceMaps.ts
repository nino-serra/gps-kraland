import type { TerrainType } from "../types";
import { cities } from "./cities";
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

// Cartes verrouillees depuis le PDF utilisateur "Provinces Coordonnes krland _".
export const provinceMapOverrides: Record<string, ProvinceMap> = {};

export function getProvinceMap(province: string): ProvinceMap {
  const map = provinceMapOverrides[province] ?? emptyMap();
  const roadSurvey = getProvinceRoadSurvey(province);
  const waterSurvey = getProvinceWaterSurvey(province);
  const mapWithSurveys = map.map((row) => [...row]);

  if (roadSurvey) {
    for (const [x, y] of roadSurvey.roadTiles) {
      setTile(mapWithSurveys, x, y, "route");
    }
  }

  for (const city of cities) {
    if (city.province === province) {
      setTile(mapWithSurveys, city.x, city.y, "route");
    }
  }

  if (waterSurvey) {
    for (const [x, y] of waterSurvey.waterTiles) {
      if (mapWithSurveys[y]?.[x] !== "route") {
        setTile(mapWithSurveys, x, y, "mer");
      }
    }
  }

  return mapWithSurveys;
}
