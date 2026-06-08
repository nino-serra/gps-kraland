import { useMemo, useState } from "react";
import type { City, PathResult, Position, TerrainType, TravelMode } from "./types";
import { cities, cityLabel } from "./data/cities";
import { estimateEssenceUnitsFromTravelMinutes } from "./data/fuel";
import { vehicleList, vehicles } from "./data/vehicles";
import { getProvinceMap } from "./data/provinceMaps";
import { getSurfaceType, PROVINCE_HEIGHT, PROVINCE_WIDTH } from "./data/terrain";
import { findFastestWorldPath } from "./lib/pathfinding";
import { toGlobalCoordinates, toLocalCoordinates } from "./lib/worldCoordinates";

const ISO_TILE_X = 24;
const ISO_TILE_Y = 12;

function cityKey(city: City): string {
  return `${city.empire}|${city.province}|${city.city}`;
}

function positionKey(position: Position): string {
  return `${position.x}:${position.y}`;
}

function getCityByKey(value: string): City | undefined {
  return cities.find((city) => cityKey(city) === value);
}

function StatusBadge({ city }: { city: City }) {
  return <span className={city.routing ? "badge ok" : "badge blocked"}>{city.routing ? "GPS" : "hors routage"}</span>;
}

type DisplayTile = {
  key: string;
  x: number;
  y: number;
  globalX: number;
  globalY: number;
  terrain: TerrainType;
  city?: City;
};

type RouteStep = {
  index: number;
  province: string;
  x: number;
  y: number;
  globalX?: number;
  globalY?: number;
  terrain: TerrainType;
  city?: City;
};

export default function App() {
  const routableCities = useMemo(() => cities.filter((city) => city.routing), []);
  const cityOptions = useMemo(() => [...cities].sort((a, b) => cityLabel(a).localeCompare(cityLabel(b), "fr")), []);
  const defaultStart = cities.find((city) => city.province === "Ruthvénie" && city.city === "Lantenac du Lac") ?? routableCities[0];
  const defaultEnd = cities.find((city) => city.province === "Ruthvénie" && city.city === "Ruthenville") ?? routableCities[1];
  const [startKey, setStartKey] = useState(cityKey(defaultStart));
  const [endKey, setEndKey] = useState(cityKey(defaultEnd));
  const [mode, setMode] = useState<TravelMode>("pied");
  const [result, setResult] = useState<PathResult | null>(null);
  const [message, setMessage] = useState<string>("Sélectionne deux villes pour lancer le calcul.");
  const [showCoordinates, setShowCoordinates] = useState(false);

  const startCity = getCityByKey(startKey)!;
  const endCity = getCityByKey(endKey)!;
  const selectedProvince = startCity?.province ?? cities[0].province;
  const provinceMap = getProvinceMap(selectedProvince);
  const provinceCities = cities.filter((city) => city.province === selectedProvince);
  const startGlobal = toGlobalCoordinates(startCity.province, startCity);
  const endGlobal = toGlobalCoordinates(endCity.province, endCity);
  const selectedVehicle = vehicles[mode];
  const essenceEstimate = result?.ok ? estimateEssenceUnitsFromTravelMinutes(result.rawMinutes, selectedVehicle) : null;
  const isWorldView = Boolean(result?.ok && result.worldPath && new Set(result.worldPath.map((position) => position.province)).size > 1);
  const display = useMemo(() => {
    if (isWorldView && result?.worldPath?.length) {
      const minPathX = Math.min(...result.worldPath.map((position) => position.globalX));
      const maxPathX = Math.max(...result.worldPath.map((position) => position.globalX));
      const minPathY = Math.min(...result.worldPath.map((position) => position.globalY));
      const maxPathY = Math.max(...result.worldPath.map((position) => position.globalY));
      const minX = Math.max(0, minPathX - 2);
      const maxX = maxPathX + 2;
      const minY = Math.max(0, minPathY - 2);
      const maxY = maxPathY + 2;
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      const tiles: DisplayTile[] = [];

      for (let globalY = minY; globalY <= maxY; globalY += 1) {
        for (let globalX = minX; globalX <= maxX; globalX += 1) {
          const local = toLocalCoordinates({ x: globalX, y: globalY });
          if (!local) continue;
          const terrain = getProvinceMap(local.province)[local.y]?.[local.x] ?? "unknown";
          const city = cities.find((item) => item.province === local.province && item.x === local.x && item.y === local.y);
          tiles.push({
            key: `${globalX}:${globalY}`,
            x: local.x,
            y: local.y,
            globalX,
            globalY,
            terrain,
            city,
          });
        }
      }

      const layerWidth = (width + height) * ISO_TILE_X + 88;
      const layerHeight = (width + height) * ISO_TILE_Y + 48;
      return {
        tiles,
        minX,
        minY,
        height,
        layerWidth,
        layerHeight,
        scale: Math.max(0.38, Math.min(1, 1180 / layerWidth, 500 / layerHeight)),
      };
    }

    const tiles = provinceMap.flatMap((row, y) =>
      row.map((terrain, x) => ({
        key: `${x}:${y}`,
        x,
        y,
        globalX: x,
        globalY: y,
        terrain,
        city: provinceCities.find((item) => item.x === x && item.y === y),
      })),
    );
    const width = PROVINCE_WIDTH;
    const height = PROVINCE_HEIGHT;
    return {
      tiles,
      minX: 0,
      minY: 0,
      height,
      layerWidth: (width + height) * ISO_TILE_X + 88,
      layerHeight: (width + height) * ISO_TILE_Y + 48,
      scale: 1,
    };
  }, [isWorldView, result?.worldPath, provinceMap, provinceCities]);
  const localPathKeys = new Set(result?.path.map(positionKey) ?? []);
  const worldPathKeys = new Set(result?.worldPath?.map((position) => `${position.globalX}:${position.globalY}`) ?? []);
  const routeSteps = useMemo<RouteStep[]>(() => {
    if (!result?.ok) {
      return [];
    }

    if (result.worldPath?.length) {
      return result.worldPath.map((position, index) => ({
        index: index + 1,
        province: position.province,
        x: position.x,
        y: position.y,
        globalX: position.globalX,
        globalY: position.globalY,
        terrain: getProvinceMap(position.province)[position.y]?.[position.x] ?? "unknown",
        city: cities.find((city) => city.province === position.province && city.x === position.x && city.y === position.y),
      }));
    }

    return result.path.map((position, index) => ({
      index: index + 1,
      province: startCity.province,
      x: position.x,
      y: position.y,
      globalX: startGlobal ? startGlobal.x - startCity.x + position.x : undefined,
      globalY: startGlobal ? startGlobal.y - startCity.y + position.y : undefined,
      terrain: getProvinceMap(startCity.province)[position.y]?.[position.x] ?? "unknown",
      city: cities.find((city) => city.province === startCity.province && city.x === position.x && city.y === position.y),
    }));
  }, [result, startCity, startGlobal]);
  const provinceSequence = useMemo(
    () =>
      routeSteps.reduce<string[]>((sequence, step) => {
        if (sequence[sequence.length - 1] !== step.province) {
          sequence.push(step.province);
        }
        return sequence;
      }, []),
    [routeSteps],
  );
  const routeExport = routeSteps
    .map((step) => {
      const cityName = step.city ? ` - ${step.city.city}` : "";
      const global = step.globalX !== undefined && step.globalY !== undefined ? ` | global ${step.globalX}:${step.globalY}` : "";
      return `${step.index}. ${step.province} ${step.x}:${step.y} - ${step.terrain}${cityName}${global}`;
    })
    .join("\n");

  function calculateRoute() {
    setResult(null);
    if (!startCity || !endCity) {
      setMessage("Ville introuvable dans la base.");
      return;
    }
    if (!startCity.routing || !endCity.routing) {
      setMessage("Une des villes est exclue du routage normal.");
      return;
    }
    if (startCity.city === endCity.city && startCity.province === endCity.province) {
      setMessage("La ville de départ et la ville d'arrivée sont identiques.");
      return;
    }
    const pathResult = findFastestWorldPath(startCity, endCity, mode);
    setResult(pathResult);
    setMessage(pathResult.warning ?? "Trajet calculé.");
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Prototype V1 · GPS inter-province</p>
          <h1>Cyphia Futé GPS Kraland</h1>
          <p className="subtitle">
            Calcul d'itinéraire sur grille Kraland, avec routes, terres et cases d'eau séparées pour préparer les trajets terrestres et maritimes.
          </p>
        </div>
        <div className="hero-card">
          <span>Province active</span>
          <strong>{selectedProvince}</strong>
        </div>
      </header>

      <section className="controls card">
        <label>
          Départ
          <select value={startKey} onChange={(event) => setStartKey(event.target.value)}>
            {cityOptions.map((city) => (
              <option key={cityKey(city)} value={cityKey(city)} disabled={!city.routing}>
                {cityLabel(city)}{!city.routing ? " - hors routage" : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Arrivée
          <select value={endKey} onChange={(event) => setEndKey(event.target.value)}>
            {cityOptions.map((city) => (
              <option key={cityKey(city)} value={cityKey(city)} disabled={!city.routing}>
                {cityLabel(city)}{!city.routing ? " - hors routage" : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Mode
          <select value={mode} onChange={(event) => setMode(event.target.value as TravelMode)}>
            {vehicleList.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.label} · x{vehicle.speed}
              </option>
            ))}
          </select>
        </label>

        <button type="button" onClick={calculateRoute}>Calculer l'itinéraire</button>
      </section>

      <section className="layout">
        <section className="card map-card">
          <div className="section-title">
            <h2>{isWorldView ? "Carte trajet" : "Carte province"}</h2>
            <div className="map-actions">
              <label className="toggle-field">
                <input type="checkbox" checked={showCoordinates} onChange={(event) => setShowCoordinates(event.target.checked)} />
                Coordonnées
              </label>
              <span>{isWorldView ? "vue inter-province" : `${PROVINCE_WIDTH} x ${PROVINCE_HEIGHT}`}</span>
            </div>
          </div>
          <div className={`iso-map ${isWorldView ? "world-view" : ""}`} aria-label={isWorldView ? "Carte globale du trajet" : `Carte locale de ${selectedProvince}`}>
            <div
              className="map-layer"
              style={{
                width: `${display.layerWidth}px`,
                height: `${display.layerHeight}px`,
                transform: `scale(${display.scale})`,
              }}
            >
              {display.tiles.map((tile) => {
                const isStart = tile.city?.province === startCity?.province && tile.city.city === startCity?.city;
                const isEnd = tile.city?.province === endCity?.province && tile.city.city === endCity?.city;
                const isPath = isWorldView ? worldPathKeys.has(`${tile.globalX}:${tile.globalY}`) : localPathKeys.has(`${tile.x}:${tile.y}`);
                const label = tile.city ? tile.city.city : `${tile.x}:${tile.y}`;
                const leftOffset = (display.height - 1) * ISO_TILE_X + 28;
                return (
                  <div
                    key={tile.key}
                    className={`tile terrain-${tile.terrain} surface-${getSurfaceType(tile.terrain)} ${isPath ? "path" : ""} ${tile.city ? "city" : ""} ${isStart ? "start" : ""} ${isEnd ? "end" : ""}`}
                    style={{
                      left: `${(tile.globalX - display.minX - (tile.globalY - display.minY)) * ISO_TILE_X + leftOffset}px`,
                      top: `${(tile.globalX - display.minX + tile.globalY - display.minY) * ISO_TILE_Y + 18}px`,
                    }}
                    title={`${label} - ${tile.terrain} - ${tile.city?.province ?? selectedProvince} - ${tile.x}:${tile.y}`}
                  >
                    {tile.city ? <span>{tile.city.city.slice(0, 2)}</span> : showCoordinates ? <span className="tile-coordinates">{tile.x}:{tile.y}</span> : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="legend">
            <span><i className="legend-path" /> trajet</span>
            <span><i className="legend-city" /> ville</span>
            <span><i className="legend-route" /> route</span>
            <span><i className="legend-water" /> mer</span>
            <span><i className="legend-land" /> terre</span>
          </div>
        </section>

        <aside className="card result-card">
          <h2>Résultat</h2>
          <p className="message">{message}</p>

          <dl>
            <div><dt>Départ</dt><dd>{cityLabel(startCity)}</dd></div>
            <div><dt>Arrivée</dt><dd>{cityLabel(endCity)}</dd></div>
            <div><dt>Coordonnées départ</dt><dd>{startCity.x}:{startCity.y}{startGlobal ? ` | global ${startGlobal.x}:${startGlobal.y}` : ""}</dd></div>
            <div><dt>Coordonnées arrivée</dt><dd>{endCity.x}:{endCity.y}{endGlobal ? ` | global ${endGlobal.x}:${endGlobal.y}` : ""}</dd></div>
            <div><dt>Mode</dt><dd>{selectedVehicle.label} · x{selectedVehicle.speed}</dd></div>
            <div>
              <dt>Énergie</dt>
              <dd>
                {selectedVehicle.energy === "essence"
                  ? "Essence"
                  : selectedVehicle.energy === "animal"
                    ? "Animal"
                    : "Aucune"}
              </dd>
            </div>
            <div>
              <dt>Réservoir</dt>
              <dd>{selectedVehicle.energy === "essence" ? `${selectedVehicle.fuelCapacity ?? "?"} unités max` : "-"}</dd>
            </div>
            <div>
              <dt>Essence estimée</dt>
              <dd>
                {selectedVehicle.energy === "essence"
                  ? result?.ok
                    ? `${essenceEstimate ?? "?"} unités`
                    : "Calculer un trajet"
                  : "-"}
              </dd>
            </div>
            <div><dt>Temps estimé</dt><dd>{result?.ok ? `${result.totalMinutes} min` : "Non calculé"}</dd></div>
            <div><dt>Cases traversées</dt><dd>{result?.ok ? (result.worldPath?.length ?? result.path.length) : "-"}</dd></div>
            <div>
              <dt>Provinces traversées</dt>
              <dd>{result?.worldPath ? new Set(result.worldPath.map((position) => position.province)).size : "-"}</dd>
            </div>
          </dl>

          {result?.ok ? (
            <div className="route-plan">
              <h3>Feuille de route</h3>
              <div className="route-summary">
                <span>{routeSteps.length} cases</span>
                <span>{provinceSequence.join(" → ")}</span>
              </div>
              <ol className="route-steps">
                {routeSteps.slice(0, 18).map((step) => (
                  <li key={`${step.index}-${step.province}-${step.x}-${step.y}`}>
                    <strong>{step.province}</strong>
                    <span>{step.city?.city ?? `${step.x}:${step.y}`}</span>
                    <small>{step.terrain}</small>
                  </li>
                ))}
              </ol>
              {routeSteps.length > 18 ? <p className="section-note">+ {routeSteps.length - 18} cases dans l'export complet.</p> : null}
              <textarea className="route-export" readOnly value={routeExport} aria-label="Export complet de la feuille de route" />
            </div>
          ) : null}

          <h3>Villes de la province</h3>
          <ul className="city-list">
            {provinceCities.map((city) => (
              <li key={cityKey(city)}>
                <span>{city.city}</span>
                <small>{city.x}:{city.y}</small>
                <StatusBadge city={city} />
              </li>
            ))}
          </ul>
        </aside>
      </section>

    </main>
  );
}
