# Review 6 zu #1366 (PR #1369), Delta e237335..d95d190

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geschlossen: keine offenen IDs aus Review 5.

Geprüft: Die Behauptung hält. Der Schlüssel ist `${pair}/${Anzahl früherer Positionen mit genau diesem pair-String}`, also schon durch seine Bauart eindeutig, unabhängig davon, was im pair steht: zwei gleiche Strings bekommen verschiedene Zähler, also kann Svelte keinen doppelten Schlüssel melden. Gelöschte Kategorie oder gelöschter Schlüssel (Runde 1, C-1) ergibt `null/k1/0` und `null/k1/1` (Test `cost-table.svelte.dom.test.ts:37`), mehrfach vorkommende Paare ergeben `c/k/0` und `c/k/1` (Test `:52`). Beim Neuberechnen (#1366) bleibt der Schlüssel gleich, solange Reihenfolge und Paare gleich bleiben (Test `:11`). Für Positionen mit `null` ist das sogar besser als mit dem früheren `?? id`, denn die id ändert sich beim Neuberechnen. `withPositionKeys` hat nur noch einen Aufrufer (`CostTable.svelte:4/21`, beide `#each` bei 135/164), von `position-keys` ist nichts übrig, der verschobene Kommentar stimmt, und die Typschranke ohne `id` passt zu `lineItems`.

## Nicht bestätigt

- lint, check, vitest `cost-table.svelte.dom` und `statement-pages.dom` (279), Prettier auf den eigenen Zeilen, lokales fallow (CostTable 87.4, `$lib/statement` 83.5) und `fitness --base origin/main` ohne Fehler: vom Aufrufer gemeldet.
- Ob CI-fitness auf d95d190 grün ist: Das zeigt erst der CI-Lauf.
- Kein Test prüft das Neuberechnen einer Position ohne Kategorie, also ob ihr Knoten erhalten bleibt. Durch Lesen des Codes ist das Verhalten klar, es ist aber nur gelesen und nicht getestet.
