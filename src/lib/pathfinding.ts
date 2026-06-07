import type { City, PathResult, Position, TerrainType, TravelMode, WorldPosition } from "../types";
import { getProvinceMap } from "../data/provinceMaps";
import { provinceOrigins } from "../data/provinceOrigins";
import { hasEnabledProvinceLink, provinceLinks } from "../data/provinceLinks";
import { getTerrainCost, isInsideProvince, PROVINCE_COST_MULTIPLIER, PROVINCE_HEIGHT, PROVINCE_WIDTH } from "../data/terrain";
import { vehicles } from "../data/vehicles";
import { toGlobalCoordinates } from "./worldCoordinates";

const directions: Position[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function key(pos: Position): string {
  return `${pos.x},${pos.y}`;
}

function parseKey(value: string): Position {
  const [x, y] = value.split(",").map(Number);
  return { x, y };
}

function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

function reconstructPath(previous: Map<string, string>, endKey: string): Position[] {
  const pathKeys: string[] = [endKey];
  let current = endKey;
  while (previous.has(current)) {
    current = previous.get(current)!;
    pathKeys.push(current);
  }
  return pathKeys.reverse().map(parseKey);
}

function reconstructWorldPath(previous: Map<string, string>, endKey: string, worldTiles: Map<string, WorldPosition>): WorldPosition[] {
  return reconstructPath(previous, endKey).map((position) => worldTiles.get(key(position))).filter((position): position is WorldPosition => Boolean(position));
}

function segmentCost(province: string, from: Position, to: Position, mode: TravelMode): number | null {
  const map = getProvinceMap(province);
  const vehicle = vehicles[mode];
  const fromTerrain = map[from.y]?.[from.x];
  const toTerrain = map[to.y]?.[to.x];
  if (!fromTerrain || !toTerrain) return null;

  const fromCost = getTerrainCost(fromTerrain, vehicle.family);
  const toCost = getTerrainCost(toTerrain, vehicle.family);
  if (fromCost === null || toCost === null) return null;

  return Math.ceil(((fromCost + toCost) * PROVINCE_COST_MULTIPLIER) / vehicle.speed);
}

export function findFastestPath(province: string, start: Position, end: Position, mode: TravelMode): PathResult {
  if (!isInsideProvince(start.x, start.y) || !isInsideProvince(end.x, end.y)) {
    return {
      ok: false,
      path: [],
      rawMinutes: 0,
      totalMinutes: 0,
      visitedCount: 0,
      warning: "Coordonnées hors province.",
    };
  }

  const startKey = key(start);
  const endKey = key(end);
  const distances = new Map<string, number>([[startKey, 0]]);
  const previous = new Map<string, string>();
  const visited = new Set<string>();
  const frontier = new Set<string>([startKey]);

  while (frontier.size > 0) {
    let currentKey = "";
    let currentDistance = Infinity;
    for (const candidateKey of frontier) {
      const candidateDistance = distances.get(candidateKey) ?? Infinity;
      if (candidateDistance < currentDistance) {
        currentDistance = candidateDistance;
        currentKey = candidateKey;
      }
    }

    if (!currentKey) break;
    frontier.delete(currentKey);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    const current = parseKey(currentKey);
    if (positionsEqual(current, end)) {
      const path = reconstructPath(previous, endKey);
      const map = getProvinceMap(province);
      const usesUnknownTerrain = path.some((position) => map[position.y]?.[position.x] === "unknown");

      return {
        ok: true,
        path,
        rawMinutes: currentDistance,
        totalMinutes: Math.ceil(currentDistance),
        visitedCount: visited.size,
        warning: usesUnknownTerrain
          ? "Trajet calculé avec des cases sans terrain confirmé. Le temps est provisoire."
          : undefined,
      };
    }

    for (const direction of directions) {
      const next = { x: current.x + direction.x, y: current.y + direction.y };
      if (!isInsideProvince(next.x, next.y)) continue;
      const nextKey = key(next);
      if (visited.has(nextKey)) continue;

      const cost = segmentCost(province, current, next, mode);
      if (cost === null) continue;

      const newDistance = currentDistance + cost;
      if (newDistance < (distances.get(nextKey) ?? Infinity)) {
        distances.set(nextKey, newDistance);
        previous.set(nextKey, currentKey);
        frontier.add(nextKey);
      }
    }
  }

  return {
    ok: false,
    path: [],
    rawMinutes: 0,
    totalMinutes: 0,
    visitedCount: visited.size,
    warning: "Aucun trajet praticable avec ce mode de déplacement.",
  };
}

function getWorldTiles(): Map<string, WorldPosition> {
  const worldTiles = new Map<string, WorldPosition>();

  for (const origin of provinceOrigins) {
    for (let y = 0; y < PROVINCE_HEIGHT; y += 1) {
      for (let x = 0; x < PROVINCE_WIDTH; x += 1) {
        const globalX = origin.originX + x;
        const globalY = origin.originY + y;
        worldTiles.set(`${globalX},${globalY}`, {
          province: origin.province,
          x,
          y,
          globalX,
          globalY,
        });
      }
    }
  }

  return worldTiles;
}

function worldSegmentCost(from: WorldPosition, to: WorldPosition, mode: TravelMode): number | null {
  const vehicle = vehicles[mode];
  const fromTerrain = getProvinceMap(from.province)[from.y]?.[from.x];
  const toTerrain = getProvinceMap(to.province)[to.y]?.[to.x];
  if (!fromTerrain || !toTerrain) return null;

  if (from.province !== to.province) {
    if (!hasEnabledProvinceLink(from.province, to.province)) return null;
  }

  const fromCost = getTerrainCost(fromTerrain, vehicle.family);
  const toCost = getTerrainCost(toTerrain, vehicle.family);
  if (fromCost === null || toCost === null) return null;

  return Math.ceil(((fromCost + toCost) * PROVINCE_COST_MULTIPLIER) / vehicle.speed);
}

function isRouteTerrain(terrain: TerrainType | undefined): boolean {
  return terrain === "route" || terrain === "pont";
}

function getProvinceRoutePortals(worldTiles: Map<string, WorldPosition>): Map<string, WorldPosition[]> {
  const portals = new Map<string, WorldPosition[]>();

  for (const link of provinceLinks) {
    if (!link.enabled) continue;

    const routeTiles: WorldPosition[] = [];
    const targetMap = getProvinceMap(link.toProvince);
    for (let y = 0; y < PROVINCE_HEIGHT; y += 1) {
      for (let x = 0; x < PROVINCE_WIDTH; x += 1) {
        if (!isRouteTerrain(targetMap[y]?.[x])) continue;

        const targetGlobal = toGlobalCoordinates(link.toProvince, { x, y });
        if (!targetGlobal) continue;

        const targetTile = worldTiles.get(key(targetGlobal));
        if (targetTile) {
          routeTiles.push(targetTile);
        }
      }
    }

    portals.set(`${link.fromProvince}->${link.toProvince}`, routeTiles);
  }

  return portals;
}

export function findFastestWorldPath(startCity: City, endCity: City, mode: TravelMode): PathResult {
  const startGlobal = toGlobalCoordinates(startCity.province, startCity);
  const endGlobal = toGlobalCoordinates(endCity.province, endCity);

  if (!startGlobal || !endGlobal) {
    return {
      ok: false,
      path: [],
      rawMinutes: 0,
      totalMinutes: 0,
      visitedCount: 0,
      warning: "Coordonnees globales introuvables.",
    };
  }

  const worldTiles = getWorldTiles();
  const routePortals = getProvinceRoutePortals(worldTiles);
  const startTile = worldTiles.get(key(startGlobal));
  const endTile = worldTiles.get(key(endGlobal));

  if (!startTile || !endTile) {
    return {
      ok: false,
      path: [],
      rawMinutes: 0,
      totalMinutes: 0,
      visitedCount: 0,
      warning: "Une des villes est hors grille mondiale.",
    };
  }

  const startKey = key(startGlobal);
  const endKey = key(endGlobal);
  const distances = new Map<string, number>([[startKey, 0]]);
  const previous = new Map<string, string>();
  const visited = new Set<string>();
  const frontier = new Set<string>([startKey]);

  while (frontier.size > 0) {
    let currentKey = "";
    let currentDistance = Infinity;
    for (const candidateKey of frontier) {
      const candidateDistance = distances.get(candidateKey) ?? Infinity;
      if (candidateDistance < currentDistance) {
        currentDistance = candidateDistance;
        currentKey = candidateKey;
      }
    }

    if (!currentKey) break;
    frontier.delete(currentKey);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    const current = parseKey(currentKey);
    if (positionsEqual(current, endGlobal)) {
      const worldPath = reconstructWorldPath(previous, endKey, worldTiles);
      const localPath = worldPath
        .filter((position) => position.province === startCity.province)
        .map((position) => ({ x: position.x, y: position.y }));
      const crossedProvinces = new Set(worldPath.map((position) => position.province));

      return {
        ok: true,
        path: startCity.province === endCity.province ? localPath : [],
        worldPath,
        rawMinutes: currentDistance,
        totalMinutes: Math.ceil(currentDistance),
        visitedCount: visited.size,
        warning:
          crossedProvinces.size > 1
            ? `Trajet inter-province calcule sur ${crossedProvinces.size} provinces avec le reseau de liens entre provinces.`
            : undefined,
      };
    }

    const currentTile = worldTiles.get(currentKey);
    if (!currentTile) continue;

    for (const direction of directions) {
      const next = { x: current.x + direction.x, y: current.y + direction.y };
      const nextKey = key(next);
      const nextTile = worldTiles.get(nextKey);
      if (!nextTile || visited.has(nextKey)) continue;

      const cost = worldSegmentCost(currentTile, nextTile, mode);
      if (cost === null) continue;

      const newDistance = currentDistance + cost;
      if (newDistance < (distances.get(nextKey) ?? Infinity)) {
        distances.set(nextKey, newDistance);
        previous.set(nextKey, currentKey);
        frontier.add(nextKey);
      }
    }

    const currentTerrain = getProvinceMap(currentTile.province)[currentTile.y]?.[currentTile.x];
    if (vehicles[mode].family === "land" && isRouteTerrain(currentTerrain)) {
      for (const link of provinceLinks) {
        if (!link.enabled || link.fromProvince !== currentTile.province) continue;

        const portalTiles = routePortals.get(`${link.fromProvince}->${link.toProvince}`) ?? [];
        for (const nextTile of portalTiles) {
          const nextKey = `${nextTile.globalX},${nextTile.globalY}`;
          if (visited.has(nextKey)) continue;

          const cost = worldSegmentCost(currentTile, nextTile, mode);
          if (cost === null) continue;

          const newDistance = currentDistance + cost;
          if (newDistance < (distances.get(nextKey) ?? Infinity)) {
            distances.set(nextKey, newDistance);
            previous.set(nextKey, currentKey);
            frontier.add(nextKey);
          }
        }
      }
    }
  }

  return {
    ok: false,
    path: [],
    rawMinutes: 0,
    totalMinutes: 0,
    visitedCount: visited.size,
    warning: "Aucun trajet inter-province praticable avec ce mode.",
  };
}
