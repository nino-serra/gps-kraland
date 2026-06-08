# GPS Kralandais, notes techniques V1

## Grille province

- Largeur : 20 cases
- Hauteur : 13 cases
- Coordonnées : de `0:0` à `19:12`
- Accès tableau : `map[y][x]`

## Deplacement

Le cout d'un segment entre deux cases adjacentes est :

```txt
(coutCaseDepart + coutCaseArrivee) x 10 / multiplicateurVehicule
```

Le `x 10` correspond au deplacement en province.

Le resultat de chaque segment est arrondi a la minute superieure.

## Terrains

| Terrain | A pied | Bateau |
|---|---:|---:|
| herbe | 1 | - |
| fleurs | 1 | - |
| arbre | 2 | - |
| glace | 1 | - |
| montagne | 2 | - |
| route | 0.5 | - |
| pont | 0.5 | 2 |
| sable | 1 | 2 |
| mer | - | 1 |
| riviere | - | 1 |

Les terrains non releves restent `unknown`.

## Vehicules

Les vitesses sont stockees dans `src/data/vehicles.ts`.

| Famille | Modes |
|---|---|
| `land` | pied, velo, cheval, moto, voiture, camionnette, camion, bus, voiture de sport, moto de course, moto de course bidouillee, camion bidouille, voiture de sport bidouillee |
| `boat` | kayak, radeau, voilier, caravelle, cargo, vedette |
| `air` | montgolfiere, helicoptere, jet prive |

## Essence

Source secondaire consultee : `https://kraland.ragondin-earth.org/pages/page_3_2_3.htm`

Regle actuelle : un vehicule consomme `0.1` unite d'essence par minute de deplacement.

Implementation actuelle :

- `src/data/vehicles.ts` marque les vehicules utilisant l'essence.
- `src/data/fuel.ts` expose `estimateEssenceUnits(fatiguePdv, vehicle)`.
- `src/data/fuel.ts` expose aussi `estimateEssenceUnitsFromTravelMinutes(rawMinutes, vehicle)`.
- L'interface affiche maintenant la capacite du reservoir separement de l'essence estimee consommee par le trajet.
- Exemple : un trajet de `10 minutes` consomme `1` unite d'essence.

## V1

- Le calcul fonctionne dans une province et sur la grille globale construite depuis `provinceOrigins`.
- Les cartes de route et d'eau sont verrouillees depuis le PDF utilisateur `Provinces Coordonnes krland _.pdf`.
- Les cases ville sont aussi traitees comme des cases `route` pour simplifier et fiabiliser le routage terrestre.
- Les liens inter-provinces sont derives de la grille des provinces dans `src/data/provinceLinks.ts`; le routage global franchit une frontiere seulement si ce lien de province est actif.
- Pour les modes terrestres, une case `route` ou `pont` peut servir de portail vers une case `route` ou `pont` d'une province voisine active, afin de representer les routes inter-provinces meme quand la sortie visible n'est pas exactement sur la case de bordure.
- Australine est conservee dans la base, mais `routing: false`.
