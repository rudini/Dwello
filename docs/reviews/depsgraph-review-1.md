# Code-Review depsgraph, Runde 1 (95461d8..d10f333)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/arch-baseline/graph.ts:20, graph.test.ts:17-28 | Der Vergleich `cycleOf.get(e.from) === cycleOf.get(e.to)` (Kante zwischen zwei *verschiedenen* Zyklen bleibt schwarz) hat keinen Test: Steht dort nur `cycleOf.has(e.from) && cycleOf.has(e.to)`, bleiben beide Tests grün. Ein Testfall mit zwei Zyklen und einer Kante zwischen ihnen fehlt. |

Keine Blocker, keine Majors.

Ponytail-review: Lean already. Ship. (`COLORS` dient zugleich als Filter auf die Produktiv-Präfixe; `ARCH_LAYERS`/`classify` aus `lib.ts` arbeiten auf Layernamen bzw. Dateipfaden und taugen hier nicht als Ersatz.)

Geprüft: alle fünf geänderten Dateien gelesen. `readCsv` liest das `.json`, das `csv()` in `02-imports.ts` neben jede CSV schreibt. `ARCH_OUT=build/deps` geht relativ zum Repo-Root, und `build/` steht in `.gitignore`. Der Filter lässt `fe-test`, `be-test`, `e2e`, `tests`, `contracts` und Pfadmodule weg. Ein Zyklus wird pro SCC-Index erkannt, passend zu Tarjan in `02-imports.ts`. Beide Tests schlagen ohne das Verhalten fehl (nachgelesen): ohne Filter erscheint `tests/e2e`, ohne Färbung fehlt `color=red`. Es gibt keine zweite Zyklusprüfung in CI, und der Diff ändert keine App-Dateien. Die Doku-Zeile und der Plan stimmen mit dem Code überein, die Commit-Nachricht enthält «No scenario: tooling only». `bunx vitest run tools/arch-baseline/graph.test.ts` lief erneut: 2 Tests bestanden.

## Nicht bestätigt

- Lint, `bun run check`, Backend-Type-Check, die übrigen vom Aufrufer genannten Vitest-Dateien, Prettier, die Commit-Hooks und der Lauf von `bun run deps:graph` mit 4 roten Kanten: vom Aufrufer gemeldet, nicht erneut ausgeführt (`deps:graph` schreibt Dateien).
- Ob «Graph über das ganze Projekt» auch erfüllt ist, wenn nur Produktivmodule erscheinen (Tests, E2E, Tools und Skripte fehlen, `tools/arch-baseline/` schliesst `layers.json` ohnehin aus): Die Entscheidung des Product Owners liegt mir nicht vor. Nachgesehen habe ich nur `implementation_plan.md` und die Commit-Nachricht, beide sagen «production modules».
- Die Mitteltests in `src/lib/utils/__tests__/` zählen zum Modul `fe:lib/utils`. Heute importieren sie nur innerhalb dieses Moduls und erzeugen deshalb keine Kante (`out/imports-file.csv:1400-1402`). Künftige mitgelegte Tests könnten aber Test-Imports in die Kantenzahlen der «Produktivmodule» tragen. Ursache ist `layers.json`, nicht dieser Diff.
