# Code-Review #1273, Runde 3 (Abschlussrunde, Delta 6dc15700..fe7c05ba)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/review-report/report.ts:208 | Der Renderer-Override maskiert nur rohes HTML; marked 12 entfernt keine `javascript:`-URLs mehr (`sanitize` gibt es seit v5 nicht), ein Link `[x](javascript:…)` im PR-Text landet als `href` im HTML-Bericht und läuft beim Klick. Nur PRs aus dem eigenen Repo (Forks: #1274), daher kein Merge-Hindernis. |

Geprüft: (a) leeres Diagramm listet Notizen (report.ts:172, Test report.test.ts:190 rot vor der Änderung); (b) Override mit Positionsargumenten passt zu marked 12.0.2 (Block- und Inline-HTML gehen beide über `renderer.html`), Test liest den Quelltext; (c) `github.actor` ist bei Dependabot-PRs `dependabot[bot]`, der Job ist kein Gate (ci.yml:494), Test schneidet den Job `review-comment:` korrekt aus.

## Nicht bestätigt
- Dass das Escaping im Browser greift: nur durch Lesen des Quelltexts und der marked-12-Signatur geprüft, kein Browserlauf.
- vom Aufrufer gemeldet: `bunx vitest run tools/review-report tools/ci tools/deepcheck/test/workflows.test.ts` (84 bestanden), eslint, `bun run check`, prettier.
