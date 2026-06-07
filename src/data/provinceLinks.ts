export type ProvinceDirection = "NW" | "NE" | "E" | "SE" | "SW" | "W";

import { provinceOrigins } from "./provinceOrigins";

export interface ProvinceLink {
  fromProvince: string;
  toProvince: string;
  direction: ProvinceDirection;
  enabled: boolean;
}

const directionByOffset: Record<string, ProvinceDirection> = {
  "-10,-13": "NW",
  "10,-13": "NE",
  "20,0": "E",
  "10,13": "SE",
  "-10,13": "SW",
  "-20,0": "W",
};

export const provinceLinks: ProvinceLink[] = provinceOrigins.flatMap((from) =>
  provinceOrigins.flatMap((to) => {
    if (from.province === to.province) return [];

    const direction = directionByOffset[`${to.originX - from.originX},${to.originY - from.originY}`];
    if (!direction) return [];

    return [
      {
        fromProvince: from.province,
        toProvince: to.province,
        direction,
        enabled: true,
      },
    ];
  }),
);

export function hasEnabledProvinceLink(fromProvince: string, toProvince: string): boolean {
  return provinceLinks.some((link) => link.enabled && link.fromProvince === fromProvince && link.toProvince === toProvince);
}
