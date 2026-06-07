# GPS Kralandais V1

Prototype React + TypeScript + Vite pour calculer des itinéraires dans le jeu Kraland.

## Lancement

```bash
npm install
npm run dev
```

## Sources de vérité

- Villes : `src/data/cities.ts`
- Provinces : `src/data/provinces.ts`
- Origines globales : `src/data/provinceOrigins.ts`
- Terrains et couts : `src/data/terrain.ts`
- Vehicules, vitesses et energie : `src/data/vehicles.ts`
- Regle essence : `src/data/fuel.ts`
- Routes confirmees : `src/data/provinceRoads.ts`
- Eau confirmee et candidates : `src/data/provinceWater.ts`
- Captures de reference : `resources/cartography/province-images`
- Suivi du releve : `docs/releve-cartographique.md`
- Regles de coordonnees : `docs/coordonnees.md`
- Calcul Dijkstra local/global : `src/lib/pathfinding.ts`
- Validation interactive routes/eau : panneau `Validation carto` dans l'application

## Regles importantes

- Les coordonnees locales sont conservees telles quelles, sans `x - 1` ni `y - 1`.
- Les cartes locales font 20 colonnes par 13 lignes, de `0:0` a `19:12`.
- Aucune route n'est inventee.
- Les terrains inconnus restent `unknown`.
- Les routes candidates sont affichees en gris et utilisees provisoirement pour que les trajets terrestres preferent les axes releves.
- Les cases d'eau sont affichees en bleu et bloquent les vehicules terrestres.
- Le routage inter-province est actif via les origines globales de provinces, mais reste limite par les terrains/cartes confirmes.
- Les seules routes confirmees actuellement sont en Siberia : `12:3`, `12:2`, `13:2`.
- Le trajet de test prioritaire est Ruthvénie : Lantenac du Lac `11:3` vers Ruthenville `5:8`.
- Ruthvénie a maintenant ses segments de route confirmes pour le releve V1.
- Australine reste dans la base, mais sa ville est exclue du routage normal.
- Les donnees douteuses restent dans un fichier de suivi, pas dans le routage.

## Essence

Un vehicule a essence consomme `0.1` unite d'essence par minute de deplacement.
Cette regle est stockee dans `src/data/fuel.ts`.

L'interface separe la capacite du reservoir et l'essence estimee consommee par le trajet.
Exemple : un trajet de `10 minutes` consomme `1` unite d'essence.

## Limites V1

- Le routage inter-provinces ne modelise pas encore des ports, frontieres officielles ou couts de changement de province.
- Les terrains manquants rendent les temps provisoires.
- Les trajets maritimes ne traversent pas les cases inconnues.
