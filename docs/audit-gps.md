# Audit du GPS — 2026-10-04

## Références comparées

- `positionnement-provinces-kraland.md` fourni par l'utilisateur.
- `map-complete.md` fourni par l'utilisateur.
- `reseau-routier-interprovinces-kraland.md` fourni par l'utilisateur.

## Résultats

- Les 25 cartes correspondent exactement au fichier fourni : 6 500 cases, sans doublon, trou ou coordonnée hors grille.
- Les 37 villes ont les mêmes noms et coordonnées ; toutes sont également des routes.
- Les 6 500 conversions locales → globales → locales ont été vérifiées, sans chevauchement entre provinces.
- Les 29 raccords routiers calculés correspondent exactement aux 29 raccords du document réseau, sans raccord supplémentaire.
- Chaque raccord a été testé dans les deux sens : une étape adjacente de 10 minutes à pied.
- 18 calculs de trajet ont été vérifiés, à pied, en voiture de sport bidouillée et en jet privé. Chaque étape des trajets obtenus est adjacente ; chaque frontière terrestre emprunte un raccord du réseau.
- Compilation de production vérifiée avec `npm run build`.

## Corrections

Le décalage horizontal était alterné (`row % 2`). Il est désormais cumulatif : `originX = col * 20 + row * 10`, `originY = row * 13`, conformément aux raccordements du document réseau.

L'ancien moteur permettait de sauter de n'importe quelle route d'une province à n'importe quelle route de la province voisine. Ces portails ont été supprimés : le trajet doit maintenant suivre toutes les cases, et une frontière terrestre nécessite une route ou un pont de chaque côté. Les temps précédemment annoncés de quelques minutes entre villes de plusieurs provinces étaient donc incorrects.

Les cartes sont chargées une fois par calcul mondial, au lieu d'être reconstruites pour chaque étape examinée. Les conversions de coordonnées refusent les positions locales hors grille et les coordonnées non entières.

## Exemples après correction

| Départ | Arrivée | Mode | Résultat |
|---|---|---|---|
| Ruthenville | Honolulu | Voiture de sport bidouillée | 288 minutes, 97 cases |
| Caps Lock | Distillerie | Voiture de sport bidouillée | 252 minutes, 81 cases |
| Lantenac du Lac | Ruthenville | Voiture de sport bidouillée | 51 minutes, 18 cases |
| Léprosie | Honolulu | Voiture de sport bidouillée | Aucun raccordement terrestre praticable |
| Port Magmor | Honolulu | Voiture de sport bidouillée | Aucun raccordement terrestre praticable |

## Limites de la vérification

L'audit confirme la conformité aux trois fichiers fournis, pas une vérification indépendante de la carte du jeu. Bouletie reste provisoire selon le document réseau. Les six directions sont déduites de la géométrie décrite ; les calculs de temps conservent les coûts et arrondis actuels du GPS.

Les véhicules terrestres peuvent circuler sur la terre dans une province ; le contrôle route des deux côtés s'applique au franchissement de frontière. Les bateaux suivent l'eau et les aéronefs les cases adjacentes sans contrainte de terrain. Aucun raccord absent n'a été inventé pour rendre un trajet possible.

## Reproduction

`node scripts/audit-map.mjs` lit les trois fichiers de référence dans leur dossier utilisateur et produit `docs/audit-source.json`. `node scripts/export-map.mjs` régénère la fiche Markdown de la carte.
