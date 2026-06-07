import type { VehicleDefinition } from "../types";

export const FUEL_RULE_SOURCE =
  "https://kraland.ragondin-earth.org/pages/page_3_2_3.htm";

export const TRAVEL_MINUTES_PER_FATIGUE_PDV = 10;
export const ESSENCE_UNITS_PER_TRAVEL_MINUTE = 0.1;
export const ESSENCE_UNITS_PER_FATIGUE_PDV =
  ESSENCE_UNITS_PER_TRAVEL_MINUTE * TRAVEL_MINUTES_PER_FATIGUE_PDV;

function roundEssenceUnits(units: number): number {
  return Math.round(units * 10) / 10;
}

export function estimateEssenceUnits(fatiguePdv: number, vehicle: VehicleDefinition): number | null {
  if (vehicle.energy !== "essence") {
    return null;
  }

  return roundEssenceUnits(fatiguePdv * ESSENCE_UNITS_PER_FATIGUE_PDV);
}

export function estimateEssenceUnitsFromTravelMinutes(rawMinutes: number, vehicle: VehicleDefinition): number | null {
  if (vehicle.energy !== "essence") {
    return null;
  }

  return roundEssenceUnits(rawMinutes * ESSENCE_UNITS_PER_TRAVEL_MINUTE);
}
