# Code-Review #685, Runde 2 (bd83d34..e975f66)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Minor | docs/design/i18n-begriffe.md:3, docs/PRD-Dwello.md:1521 | Beide Dokumente nennen `backend/src/services/pdf.service.ts` als Ort der PDF-Texte. Seit e975f66 stehen die Texte in `backend/src/services/pdf-texts/{de,fr,it,en}.ts`. Wer nach der bestehenden PDF-Übersetzung eines Begriffs sucht, wird damit in die falsche Datei geschickt. |

Geschlossen: C-1

Geprüft: C-1 ist behoben. Bei genau einer Position hält `heading` jetzt `90 + positionHeight + closing` frei (pdf.service.ts, `costTable`). Damit wechseln die Überschrift und der Tabellenkopf mit der Position und den Summen auf die nächste Seite. Das anschliessende `room(…, 60)` und das `room` der letzten Zeile brechen danach nicht noch einmal um. Bei mehreren Positionen ist `alone = 0`, das Verhalten bleibt also gleich. Der neue Test fällt auf der Basis rot aus: Die Überschrift steht dort auf Seite 0, die Position und die Zwischensumme auf Seite 1. Die Verschiebung in e975f66 ist textgleich: Ich habe die vier Sprachblöcke aus `bd83d34:pdf.service.ts` zeilenweise mit dem Inhalt der neuen Dateien verglichen, mit `diff` ohne Unterschied (de 137, fr/it/en je 136 Zeilen). `translations` wird mit demselben Typ aus `{ de, fr, it, en }` gebaut, und an pdf.service.ts ändern sich sonst nur die Imports. `pdf-translations.test.ts` prüft dieselben Schlüssel (`^\t(\w+):` statt `^\t\t`) und denselben fr-Guillemet-Check. Die Zeile für `PDF_SOURCES` mit ihrem Test ist korrekt. Den Ratchet-Wert 898 habe ich bestätigt: Die Datei hat 898 nicht leere Zeilen. Andere Leser des alten Blocks gibt es nicht. Ponytail: nichts zu kürzen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: fitness `--base origin/main` (Exit 0), fallow 0, deepcheck 0, lint, backend type-check, PDF-Render-, Mahnungs- und Übersetzungstests (206), statement-pdf.pg.test.ts (60).
- Ob der neue Test auf der Basis tatsächlich rot ist: Das habe ich nur aus dem Code geschlossen (`room`, `heading`, `costTable`). Gerendert habe ich nichts.
- Ob fitness die Zeilen nicht leer zählt: Ich habe nur nachgezählt (898 nicht leere Zeilen, 978 insgesamt), die Zähllogik in `tools/fitness` nicht gelesen.
