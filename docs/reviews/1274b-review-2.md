# Review 1274b, Runde 2 (Abschlussrunde, Delta d5f83a2f..167a233f)

Geschlossen: C-1 (Titel und Namen aus `shots.txt` sind auf 200 Zeichen begrenzt; ein Screenshot-Block ist damit höchstens rund 1 300 Zeichen lang, die Schleife hält `listed` bei höchstens 60 000 Zeichen, `same` bei höchstens rund 2 040).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | .github/workflows/pr-comments.yml:158, 164 | Die Grenze wird vor dem Unschädlichmachen der @-Erwähnungen gemessen. `.replace(/@(?=[\w-])/g, '@​')` fügt danach pro `@` vor einem Wortzeichen ein Zeichen hinzu. Titel (je 3-mal im Block) und Namen (je 2-mal; `@a@a….png` ist ein gültiger Dateiname) aus den Fork-Daten können zur Hälfte aus `@` bestehen: rund 500 zusätzliche Zeichen pro Block von rund 1 300, also bis etwa 60 000 × 1,38 ≈ 83 000 Zeichen, deutlich über 65 536. Die Folge bleibt wie bei C-1: 422 von `createComment`/`updateComment`, nur der Pull Request des Forks selbst betroffen. Beheben, indem `listed.length + same.length` nach dem `replace` gemessen wird (oder `replace` vorher auf Titel und Namen angewendet wird). Der Kommentar in Zeile 154 und die Commit-Nachricht («cannot fill the comment») versprechen damit mehr, als gilt. |

Auf die Frage des Aufrufers: Ja, im ungünstigsten Fall kann der Kommentar die Grenze weiterhin überschreiten, allerdings nur über C-2. Ohne `@` in den Titeln und Namen hält die Grenze jetzt (PDF-Namen sind durch die Dateisystemgrenze von 255 Bytes beschränkt, PDF-Titel werden erzeugt).

Geprüft: Diff beider Dateien; die Kürzung des Namens lässt einen echten Screenshot nur dann als «unverändert» erscheinen, wenn sein Name länger als 200 Zeichen ist, was bei Fork-Daten unbedenklich ist. Der Test pinnt den Text der Zeile, wie es die übrigen Tests dieser Datei auch tun.

## Nicht bestätigt

- `bunx vitest run tools/ci` (70 bestanden), vom Aufrufer gemeldet; nicht selbst ausgeführt.
- Das rote Ergebnis des neuen `toContain`-Checks ist vom Aufrufer gemeldet; beim Lesen fällt er ohne die Änderung (der Text der Zeile fehlt dann).
- Ob GitHub die Grenze von 65 536 in UTF-16-Einheiten oder in Codepoints zählt: nicht nachgesehen. Für C-2 spielt das keine Rolle (U+200B ist in beiden Zählungen ein Zeichen).
- `Gate change approved: #<n>` für die Änderung an `.github/workflows`: Der Text des Pull Requests liegt nicht vor.
