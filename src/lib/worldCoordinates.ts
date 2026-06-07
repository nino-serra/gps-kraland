import type { Position } from "../types";
import { provinceOrigins } from "../data/provinceOrigins";
import { PROVINCE_HEIGHT, PROVINCE_WIDTH } from "../data/terrain";

export function toGlobalCoordinates(provinceName: string, local: Position): Position | null {
  const origin = provinceOrigins.find((item) => item.province === provinceName);
  if (!origin) return null;

  return {
    x: origin.originX + local.x,
    y: origin.originY + local.y,
  };
}

export function toLocalCoordinates(global: Position): { province: string; x: number; y: number } | null {
  for (const origin of provinceOrigins) {
    const x = global.x - origin.originX;
    const y = global.y - origin.originY;
    if (x >= 0 && x < PROVINCE_WIDTH && y >= 0 && y < PROVINCE_HEIGHT) {
      return { province: origin.province, x, y };
    }
  }

  return null;
}
