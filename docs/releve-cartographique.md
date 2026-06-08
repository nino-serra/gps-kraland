# Releve cartographique

Version verrouillee depuis le PDF utilisateur `Provinces Coordonnes krland _.pdf`, corrige le 2026-06-07.

## Etat

- Les routes confirmees sont stockees dans `src/data/provinceRoads.ts`.
- Les cases d'eau confirmees sont stockees dans `src/data/provinceWater.ts`.
- Les cartes finales sont construites dans `src/data/provinceMaps.ts`.
- Les cases ville sont traitees comme des routes pour le routage terrestre.
- Le mode editeur / validation cartographique a ete retire de la dapp.

## Notes

- Le PDF contient une entree Elmerie dupliquee ; elle a ete dedupliquee a l'import.
- Bouletie et Bananie n'etaient pas presentes dans le PDF verrouille ; leurs donnees precedentes ont ete conservees.
- Toutes les listes `roadTilesToConfirm` et `waterTilesToConfirm` sont vides dans cette version.

## Routage

Le routage inter-province utilise les liens actifs de `src/data/provinceLinks.ts`.
Pour les modes terrestres, une case `route` ou `pont` peut servir de liaison vers une case `route` ou `pont` d'une province voisine active.
