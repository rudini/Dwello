# Review 1274b, Runde 3 (Delta 1064b015..faf01dd4)

Geschlossen: C-2 (aus `docs/reviews/1274b-review-2.md`: der fertige Text wird nach dem `replace` auf 65 000 Zeichen gekürzt)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | .github/workflows/pr-comments.yml:130, 150-152, 157-158 | Die Zahl der Durchläufe ist nur für `shots.txt` begrenzt. `pdfPages` kommt aus `readdirSync` über das Artefakt des Forks und hat keine Obergrenze, `ui-routes.txt` (das `pdf` freischaltet) stammt ebenfalls aus dem Artefakt. Bei N geplanten Dateien `pdf_a_<n>.png` läuft die Kürzungsschleife bis zu N-mal und baut jedes Mal `shots.slice(0, count).join(...)` neu, ist also weiterhin quadratisch in N. Der Job ist nicht mit `timeout-minutes` begrenzt. Betroffen ist nur der Kommentar-Job zum Pull Request des Forks selbst, wie bei C-1/C-2. Behebung: `pdfPages` ebenfalls kürzen (z. B. `.slice(0, 300)`) oder `shots` nach dem `push` kürzen. |

Geprüft: `slice(0, 300)` vor `sort()` verändert nur bei mehr als 300 Zeilen, welche Screenshots erscheinen. Legitime Läufe liegen weit darunter (nur Desktop/hell, ein Shot pro Zustand bzw. Assistentenschritt aus `screens.json`). Ausserdem fasst ein Kommentar bei mindestens rund 250 Zeichen pro Block (zwei Blob-URLs) ohnehin weniger als 300 Blöcke. Der Schnitt bei 65 000 Zeichen trennt den Marker nicht ab: Er steht am Anfang, und `startsWith(marker)` findet den Kommentar weiter. Ein Schnitt direkt nach einem `@` lässt kein Zeichen folgen, das eine Erwähnung bilden könnte. Der neue Test in `tools/ci/pr-comments.test.ts:71-74` heftet beide Zeilen fest und ist auf der Basis rot (beide Teilstrings fehlen dort). Der bestehende Zähltest für das `replace` (zwei Treffer) hält weiterhin.

## Nicht bestätigt

- `bunx vitest run tools/ci` (71 bestanden) und die Prüfung, dass das YAML geparst wird: vom Aufrufer gemeldet.
- Das Verhalten des Workflows auf GitHub (Fork-Artefakt, Länge des Kommentars) wurde nicht ausgeführt, sondern nur durch Lesen von `.github/workflows/pr-comments.yml:117-168` und `tests/ui-screenshots/screenshots.spec.ts` beurteilt.
