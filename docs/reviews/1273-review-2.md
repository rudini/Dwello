# Review #1273 «Reviewer report per PR», Runde 2 (Delta c5c63afe..41090625)

Geschlossen: C-1, C-2, C-3, C-4, C-6, C-7

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Minor | tools/review-report/report.ts:124-128 | unverändert offen (Ablauf fehlt bei Änderung nur in einem `src/lib/server/*`-Helfer) |
| C-8 | Minor | tools/review-report/report.ts:45-47 | unverändert offen (Typ-/Default-Änderung eines Felds fehlt im Datenmodell) |
| C-9 | Minor | tools/review-report/report.ts:219-275 | unverändert offen (CLI-Logik ungetestet; neu dazu der Zyklenfilter Z. 245-247 und die Schlüsselwort-Regex Z. 253) |
| C-10 | Minor | tools/review-report/report.ts (marked.parse) | unverändert offen (PR-Text ungefiltert als HTML) |
| C-11 | Minor | tools/review-report/report.ts:84 | `endpoints` erkennt nur `const X = \`…/api/v1\``. `src/lib/server/ki-settings.ts:5` definiert `const API = () => \`…/api/v1\`` und ruft `${API()}/ki-settings` (Z. 35): kein Treffer, der Ablauf der KI-Einstellungen endet bei der BFF-Route und meldet weiter «without a changed call». Alle anderen Konstanten im Worktree (`API`, `BACKEND`, auch die Kette `BACKEND` → `${BACKEND}/documents`) werden gefunden |
| C-12 | Minor | .github/workflows/ci.yml:254, tools/fitness/fitness.ts:574 | Die Fixes für C-1 (`set -o pipefail`) und C-2 (`resolve`) haben keinen Test; fällt `pipefail` wieder weg, wird das Gate erneut still grün. Ein Pin in `tools/deepcheck/test/workflows.test.ts` (oder ein Test, dass `structureAt` mit relativem `keep` misst) fehlt |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bunx vitest run tools/review-report tools/fitness tools/ci tools/deepcheck/test/workflows.test.ts tools/testcheck/test/wiring.test.ts` (139 bestanden, die zwei neuen Tests für C-3/C-4 zuvor rot), eslint, `bun run check`, fallow audit, die Handläufe zu C-2 (`REVIEW_DIR=build/w1273b` ENOENT vor, `build/w1273c` «0 errors» nach dem Fix) und zu C-1 (`set -eo pipefail` ergibt 1).
- Rot der beiden neuen Tests nur durch Lesen beurteilt: ohne `endpoints` findet die alte Regex in `${API}/reports/1` kein Segment, ohne die Rückfallsuche nach `prefix: '/api/v1'` gibt es keine Route; ohne `return []` (Z. 77) entsteht der Browser-Schritt auf beiden Seiten und ist nicht «new». Beide wären also rot gewesen.

Geprüft: ci.yml-Delta (`pipefail` gilt für die `tee`-Pipeline, Push-Zweig unverändert), `resolve` in fitness.ts gegen `measure.sh` (`cd "$wt"`), Rückfallsuche in `backendCalls` gegen die drei Routen mit `prefix: '/api/v1'` (ki-settings, documents, reports), Format von `cycles-module.csv` (`c.join(' ')`, 02-imports.ts:162) zum Filter, Schlüsselwörter gleich check-issues.mjs:59.
