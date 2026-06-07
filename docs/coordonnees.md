# Coordonnees et fiabilite

## Grille locale du GPS

Le GPS utilise une grille locale de province :

- largeur : 20 colonnes
- hauteur : 13 lignes
- premiere case : `0:0`
- derniere case : `19:12`
- stockage : `{ x, y }`
- acces carte : `map[y][x]`

Une coordonnee fournie comme `12:4` doit rester `x = 12`, `y = 4`.

## Carte du site Kraland

Les pages `http://www.kraland.org/map/province/...` affichent une carte visuelle et une image-map.
Cette image-map expose des coordonnees propres au site, par exemple `(2,1)` a `(34,17)`.

Ces coordonnees du site ne doivent pas etre injectees directement dans le GPS tant que la conversion exacte vers la grille locale `0:0` a `19:12` n'est pas confirmee.

## Regle de travail

- Les villes deja fournies restent la reference pour les coordonnees locales.
- Les captures du site servent de support visuel.
- Les routes passent dans `src/data/provinceRoads.ts` uniquement quand leur position locale est confirmee.
- Les cases douteuses vont dans `roadTilesToConfirm`.
- Les terrains inconnus restent `unknown`.

## Statuts

- `confirmed` : utilisable par le moteur de routage.
- `to-confirm` : visible dans les notes, non utilise pour calculer un trajet.
- `unknown` : terrain ou route non releve.
