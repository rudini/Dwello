# Code-Review Fitness, Runde 3 (Delta 57d4dbf6..f510c841)

## Status der offenen IDs aus Runde 2

| ID | Status | Nachweis |
|----|--------|----------|
| C-5 | beantwortet | `tools/fitness/fitness.ts:258`: `technicalAdded` ist jetzt `unlisted(ratchet.technical, baseRatchet.technical, path\tline).length`, also die Multimengen-Differenz (`unlisted`, `fitness.ts:159-168`). Damit warnt ein ausgetauschter Eintrag. Die Doku (`fitness-functions.md:51, 75`) stimmt jetzt. Einen Unit-Test für den Austausch gibt es nicht (siehe C-6). |
| C-3 (Nachtrag) | erledigt | `.github/workflows/ci.yml:340`: `continue-on-error` steht jetzt am Schritt, der Job bleibt grün. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Minor | tools/fitness/fitness.ts:258, 225-230 | Die Korrektur von C-5 ist ein Bugfix, hat aber keinen Test, der ihn nachstellt. Sie liegt im Block `import.meta.main`. Der Test `fitness.test.ts:185-190` übergibt `advise` nur eine fertige Zahl. Ein Rückfall auf die Längendifferenz bliebe grün. Dasselbe gilt für `newFields()`: Abgleich mit dem Schema der Basis und Schlüssel `table.field`. Belegt ist beides nur durch den lokalen Nachweis des Aufrufers. Abhilfe: Die Berechnung von `technicalAdded` als exportierte Funktion testen (Austausch ergibt 1). `newFields` mit Schema-Text und Spread-Zeilen als Parametern testbar machen. |
| C-7 | Minor | tools/fitness/fitness.ts:77-78 | Der JSDoc von `advise` («Warnings, never failures: …») steht jetzt über `NEW_FIELD_MAX`. Zwei Doc-Kommentare folgen direkt aufeinander. Damit beschreibt der erste in Editor und Hover die Konstante statt `advise`, und `advise` hat keinen Doc-Kommentar mehr. Abhilfe: Die Konstante über den Kommentar von `advise` verschieben. |

Keine Blocker oder Major.

Geprüft: alle 6 geänderten Dateien des Deltas. `tablesOf` ist eine mechanische Verschiebung (for→map, gleiche Regexe). `newFields` vergleicht beide Seiten über den Export-Namen der Tabelle (`m[1]`, `fitness.ts:227` gegen `05-knowledge.ts:164`). Der Check läuft nur mit `--base` und Messung, also bei PR und Push, nicht nächtlich. Das passt zur Doku-Zeile `fitness-functions.md:19`. Der Test `new-field` würde ohne die Änderung fehlschlagen (kein Check `new-field`). Prettier `--check` auf den seit `origin/main` hinzugefügten Dateien: sauber (selbst ausgeführt).

## Nicht bestätigt

- «05-knowledge-Ausgabe byte-identisch»: nicht selbst ausgeführt, weil das Skript Dateien schreibt. Ich habe nur den Code verglichen (`tools/arch-baseline/lib.ts:133-147` gegen die entfernten Zeilen in `05-knowledge.ts`).
- Lokale Nachweise (`tenants.mailCountry` in 5 Dateien ergibt `new-field`; ausgetauschter `technical`-Eintrag ergibt Warnung): vom Aufrufer gemeldet.
- `bun run lint`, `bun run check`, `bunx vitest run tools/fitness` (13 Tests, `new-field` zuerst rot gesehen), `bun run fitness -- --base origin/main`: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Ob GitHub den Check «CI duration» bei einem fehlschlagenden Schritt mit `continue-on-error` grün zeigt: nur in CI zu sehen. Gelesen habe ich `.github/workflows/ci.yml:330-353`.
- Grenze der Messung, kein Befund: Felder mit generischem Namen, mit weniger als 5 Zeichen oder mit einem Namen, den auch eine andere Tabelle hat, fehlen in `m4-field-spread.csv` (`05-knowledge.ts:161`). Für sie warnt `new-field` daher nie. Das folgt der Definition der Baseline, auf die die Doku verweist.
