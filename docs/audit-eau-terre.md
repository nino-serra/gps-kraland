# Audit eau / terre

Date: 2026-06-01

## Methode

- Source verifiee: `resources/cartography/province-images/*.png`
- Grille controlee: 20 x 13 cases par province
- Centre de case utilise: meme projection que `resources/cartography/diagnostics/ruthvenie-grid-overlay.png`
- Une case est signalee comme eau visuelle forte quand son losange contient une majorite de pixels bleus/eau.
- Les cases de route sont signalees a part, car le rendu final les priorise sur l'eau dans `getProvinceMap`.

## Conclusion

La coherence terre/eau n'est pas encore bonne province par province.

- Toutes les provinces ont bien une entree dans `src/data/provinceWater.ts`.
- Les cases non-eau sont maintenant bien interpretees comme `terre` par defaut.
- Le relevé eau reste incomplet dans 24 provinces sur 25.
- Sicilia est la seule province qui ressort coherente avec le seuil automatique.
- Plusieurs provinces ont aussi des cases eau qui chevauchent les routes candidates. Ce n'est pas bloquant pour le rendu actuel, car les routes gagnent sur l'eau, mais c'est a nettoyer pour une validation carto propre.

## Synthese par province

| Province | Eau relevee | Eau visuelle forte | Eau forte manquante | Eau declaree suspecte terre | Eau/route chevauchement | Verdict |
|---|---:|---:|---:|---:|---:|---|
| Siberia | 84 | 113 | 34 | 3 | 0 | incomplet |
| Capsulie | 1 | 31 | 26 | 0 | 0 | tres incomplet |
| Elmerie | 1 | 2 | 1 | 0 | 1 | a corriger |
| Bouletie | 2 | 30 | 26 | 1 | 0 | tres incomplet |
| Bananie | 22 | 40 | 20 | 0 | 0 | incomplet |
| Irendol | 63 | 84 | 27 | 1 | 5 | incomplet + conflits route |
| Foret de Jade | 5 | 6 | 1 | 0 | 1 | presque coherent, conflit route |
| Kraland | 46 | 82 | 42 | 4 | 11 | incoherent |
| Helenie | 19 | 63 | 32 | 0 | 0 | tres incomplet |
| Karaibes | 135 | 149 | 29 | 7 | 2 | incomplet + suspects |
| Ile aux Kanards | 71 | 82 | 14 | 0 | 1 | incomplet leger |
| Sicilia | 8 | 8 | 0 | 0 | 0 | coherent |
| Milieu | 4 | 17 | 13 | 1 | 0 | tres incomplet |
| Slavonie | 34 | 61 | 26 | 0 | 6 | incomplet + conflits route |
| Ruthvenie | 72 | 89 | 23 | 3 | 3 | incomplet + conflits route |
| Santa Banana | 67 | 98 | 30 | 0 | 0 | incomplet |
| Mystisie | 14 | 56 | 40 | 0 | 1 | tres incomplet |
| Acropole | 33 | 43 | 5 | 0 | 9 | eau proche, conflits route |
| Valegro | 15 | 60 | 38 | 0 | 0 | tres incomplet |
| Geofront | 152 | 148 | 7 | 3 | 4 | presque complet, a nettoyer |
| Australine | 76 | 101 | 34 | 4 | 0 | incomplet |
| Niarkalistan | 86 | 116 | 30 | 1 | 1 | incomplet |
| Plaine Irradiee | 40 | 81 | 39 | 0 | 0 | tres incomplet |
| Warriorland | 100 | 131 | 31 | 0 | 0 | incomplet |
| Crab Key | 77 | 111 | 41 | 4 | 1 | tres incomplet |

## Priorite de correction

1. Corriger d'abord les provinces tres incompletes: Capsulie, Bouletie, Helenie, Milieu, Mystisie, Valegro, Plaine Irradiee, Crab Key.
2. Nettoyer les chevauchements eau/route: Kraland, Acropole, Slavonie, Irendol, Geofront, Ruthvenie.
3. Valider manuellement les cases signalees seches: Siberia, Kraland, Karaibes, Ruthvenie, Geofront, Australine, Crab Key.
4. Garder Sicilia comme reference positive.

