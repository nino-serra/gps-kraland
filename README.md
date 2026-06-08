# GPS Kralandais V1

Prototype React + TypeScript + Vite pour calculer des itineraires dans le jeu Kraland.

## Lancement

```bash
npm install
npm run dev
```

## Sources de verite

- Villes : `src/data/cities.ts`
- Provinces : `src/data/provinces.ts`
- Origines globales : `src/data/provinceOrigins.ts`
- Terrains et couts : `src/data/terrain.ts`
- Vehicules, vitesses et energie : `src/data/vehicles.ts`
- Regle essence : `src/data/fuel.ts`
- Routes confirmees : `src/data/provinceRoads.ts`
- Eau confirmee : `src/data/provinceWater.ts`
- Cartes finales : `src/data/provinceMaps.ts`
- Suivi du releve : `docs/releve-cartographique.md`
- Regles de coordonnees : `docs/coordonnees.md`
- Calcul Dijkstra local/global : `src/lib/pathfinding.ts`

## Regles importantes

- Les coordonnees locales sont conservees telles quelles, sans `x - 1` ni `y - 1`.
- Les cartes locales font 20 colonnes par 13 lignes, de `0:0` a `19:12`.
- Les routes et cases d'eau sont verrouillees depuis le PDF utilisateur `Provinces Coordonnes krland _.pdf`.
- Les cases ville sont aussi traitees comme des cases `route` pour le routage terrestre.
- Les cases d'eau bloquent les vehicules terrestres.
- Le routage inter-province est actif via les origines globales et les liens de provinces.
- Le trajet de test prioritaire est Ruthvenie : Lantenac du Lac `11:3` vers Ruthenville `5:8`.
- Australine reste dans la base, mais sa ville est exclue du routage normal.
- Bouletie et Bananie etaient absentes du PDF verrouille ; leurs donnees precedentes sont conservees.

## Essence

Un vehicule a essence consomme `0.1` unite d'essence par minute de deplacement.
Cette regle est stockee dans `src/data/fuel.ts`.

L'interface separe la capacite du reservoir et l'essence estimee consommee par le trajet.
Exemple : un trajet de `10 minutes` consomme `1` unite d'essence.

## Limites V1

- Le routage inter-provinces ne modelise pas encore des ports, frontieres officielles ou couts speciaux de changement de province.
- Les trajets maritimes ne traversent pas les cases inconnues.
