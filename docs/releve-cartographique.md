# Releve cartographique

Source de travail : http://www.kraland.org/map/ressources

Les captures de reference sont stockees dans `resources/cartography/province-images`.
Le manifeste de collecte est dans `resources/cartography/province-image-manifest.json`.

## Methode

1. Ouvrir la capture de province.
2. Identifier visuellement les routes, ponts, mers, rivieres et terrains.
3. Reporter uniquement les cases confirmees dans `roadTiles`.
4. Garder les cases douteuses ou auto-detectees dans `roadTilesToConfirm`.
5. Ne jamais convertir les coordonnees avec `x - 1` ou `y - 1`.
6. Une case ne devient routable que si elle est confirmee.

## Etat du releve

Toutes les provinces ont maintenant une entree dans `src/data/provinceRoads.ts`.
Les routes auto-detectees restent dans `roadTilesToConfirm` et ne sont pas utilisees par le routage.
Les cases d'eau auto-detectees sont stockees dans `src/data/provinceWater.ts` en `waterTilesToConfirm`.
Elles sont visibles sur les cartes pour faciliter la validation manuelle ; les cases confirmees passent ensuite dans `waterTiles`.
Les routes candidates `roadTilesToConfirm` sont aussi affichees en gris et utilisees provisoirement par le GPS afin de guider les trajets terrestres sur les routes visibles.

| Province | Capture | Routes confirmees | A confirmer |
|---|---|---:|---:|
| Siberia | `resources/cartography/province-images/siberia.png` | 3 | 0 |
| Capsulie | `resources/cartography/province-images/capsulie.png` | 0 | 20 candidates |
| Elmerie | `resources/cartography/province-images/elmerie.png` | 0 | 30 candidates |
| Bouletie | `resources/cartography/province-images/bouletie.png` | 0 | 40 candidates |
| Bananie | `resources/cartography/province-images/bananie.png` | 0 | 49 candidates |
| Irendol | `resources/cartography/province-images/irendol.png` | 0 | 26 candidates |
| Foret de Jade | `resources/cartography/province-images/foret-de-jade.png` | 0 | 21 candidates |
| Kraland | `resources/cartography/province-images/kraland.png` | 0 | 14 candidates |
| Helenie | `resources/cartography/province-images/helenie.png` | 0 | 32 candidates |
| Karaibes | `resources/cartography/province-images/karaibes.png` | 0 | 6 candidates |
| Ile aux Kanards | `resources/cartography/province-images/ile-aux-kanards.png` | 0 | 14 candidates |
| Sicilia | `resources/cartography/province-images/sicilia.png` | 0 | 38 candidates |
| Milieu | `resources/cartography/province-images/milieu.png` | 0 | 43 candidates |
| Slavonie | `resources/cartography/province-images/slavonie.png` | 0 | 39 candidates |
| Ruthvenie | `resources/cartography/province-images/ruthvenie.png` | 34 | 0 |
| Santa Banana | `resources/cartography/province-images/santa-banana.png` | 0 | 23 candidates |
| Mystisie | `resources/cartography/province-images/mystisie.png` | 0 | 18 candidates |
| Acropole | `resources/cartography/province-images/acropole.png` | 0 | 40 candidates |
| Valegro | `resources/cartography/province-images/valegro.png` | 0 | 44 candidates |
| Geofront | `resources/cartography/province-images/geofront.png` | 0 | 14 candidates |
| Australine | `resources/cartography/province-images/australine.png` | 0 | hors routage normal |
| Niarkalistan | `resources/cartography/province-images/niarkalistan.png` | 0 | 21 candidates |
| Plaine Irradiee | `resources/cartography/province-images/plaine-irradiee.png` | 0 | 15 candidates |
| Warriorland | `resources/cartography/province-images/warriorland.png` | 0 | 11 candidates |
| Crab Key | `resources/cartography/province-images/crab-key.png` | 0 | 14 candidates |

## Siberia

Routes confirmees :

```ts
roadTiles: [
  [12, 3],
  [12, 2],
  [13, 2],
]
```

La route ne commence pas sur la ville de Garinaville `12:4`; elle part de la case au-dessus `12:3`.

## Crab Key

Capture : `resources/cartography/province-images/crab-key.png`

Statut :

- extraction automatique depuis la capture, completee manuellement avec `11:6`
- les cases sont stockees dans `roadTilesToConfirm`, donc non utilisees par le routage
- Port Magmor `6:6` semble isolee sur l'image, sans route visible vers l'axe principal
- l'axe probable relie Diocese Tutelaire `11:7`, Jadeite `17:8` et une sortie de province en `13:0`

Cases candidates :

```ts
roadTilesToConfirm: [
  [13, 0],
  [13, 1],
  [13, 2],
  [13, 3],
  [13, 4],
  [13, 5],
  [11, 6],
  [12, 6],
  [13, 6],
  [14, 6],
  [15, 6],
  [16, 6],
  [16, 7],
  [16, 8],
]
```

## Ruthvenie

Trajet cible pour tester la V1 :

- Lantenac du Lac : `11:3`
- Ruthenville : `5:8`

Capture : `resources/cartography/province-images/ruthvenie.png`

Statut :

- les deux villes sont confirmees dans `src/data/cities.ts`
- la route est visible sur la capture
- les segments de route sont confirmes manuellement
- les cases `10:2`, `11:2` et `12:2` sont de l'eau, pas de la route
- aucune case Ruthvenie ne reste en attente dans `roadTilesToConfirm`

Cases confirmees :

```ts
roadTiles: [
  [0, 4],
  [1, 0],
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 4],
  [7, 4],
  [8, 4],
  [8, 5],
  [8, 6],
  [8, 7],
  [8, 8],
  [8, 9],
  [8, 10],
  [8, 11],
  [9, 6],
  [10, 6],
  [11, 4],
  [11, 5],
  [11, 6],
  [3, 11],
  [3, 12],
  [4, 11],
  [5, 9],
  [5, 10],
  [5, 11],
  [6, 11],
  [7, 11],
  [7, 12],
]
```
