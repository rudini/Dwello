# Review Strukturbericht-Verlauf, Runde 2 (Delta 356a3bdb8..12945de07)

Geschlossen: C-1, C-2

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-3 | Minor | tools/arch-baseline/structure-history.sh:13; .github/workflows/structure-report.yml:39-40 | Der Fingerabdruck deckt `structure-history.sh` selbst nicht ab. Das Skript legt aber einen Teil der Messung fest: die Aufrufe und Flags von fallow (Zeile 37: `--no-cache`, `-c`), `svelte-kit sync` (Zeile 33) und das Datumsformat des Snapshots (Zeile 38). Ändert sich nur das Skript, bleiben die gecachten Snapshots stehen, lokal wie in CI. Das ist dieselbe Lücke wie C-1, nur seltener. Behebung: `tools/arch-baseline/structure-history.sh` in `cat` und `hashFiles` aufnehmen. |
| C-4 | Minor | tools/arch-baseline/structure-history.sh:22 | Der Kommentar «drop snapshots that left the window» stimmt nicht mehr, denn seit dieser Änderung gibt es kein Fenster. Die Schleife entfernt jetzt Snapshots von Commits, die nicht mehr der letzte First-Parent-Commit ihres Tages sind, und Snapshots eines früheren HEAD. |

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/arch-baseline src/__tests__/open-work.test.ts` (36 bestanden, die zwei neuen Tests zuerst rot gesehen), eslint, testcheck:audit, deepcheck:audit, Prettier, `bun run structure:report` von Anfang bis Ende (45 Snapshots), den Screenshot.
- Vom Aufrufer gemeldet: Die Diagramme sind nicht flach (Funktionen 0 → 161 → 8, Module 3 → 211). Damit ist die offene Frage aus Runde 1 beantwortet, ob fallow mit `-c <root>/.fallowrc.json` den alten Baum misst. Selbst geprüft habe ich das nicht, denn ohne `node_modules` gibt es keine fallow-Dokumentation.
- Weiterhin offen aus Runde 1: Der Workflow ist auf GitHub noch nie gelaufen (`actions/cache@v5`, `hashFiles` mit mehreren Mustern, `origin/main` nach dem Checkout). In CI misst jede Änderung an den Werkzeugen jetzt rund 45 Stände neu, und wie lange das dauert, ist unbekannt.
- `structure-history.sh` hat weiterhin keinen Test. Gelesen: Die Auswahl je Tag in Zeile 18 nimmt den neuesten Commit des Tages, weil `git log` die First-Parent-Kette absteigend ausgibt. Das gilt unter der Annahme, dass die Commit-Daten auf `main` monoton steigen. Ausserdem entfällt das GNU-only `date -d` damit.

Geprüft: Fix C-1: `.tools` ist in Zeile 13-16 vor `mkdir` gesetzt, und `restore-keys` holt nur einen Cache mit demselben Hash zurück. Unter den Eingaben wird `unit-types.json` von den Messskripten nicht gelesen. Fix C-2: `byTime` gilt in `markdown()` und `historySection()`, und `moved()` erhält die sortierte Liste. Ein Tag ohne Uhrzeit wird als UTC-Mitternacht gelesen. Die Filterung auf `*.json` schliesst `.tools` aus. Beide neuen Tests schlagen auf der Basis fehl: Die Reihenfolge der Eingabe ergibt einen falschen ersten Markdown-Eintrag und ein falsches from/to, und vorher lagen die Abstände auf der x-Achse gleichmässig. In der Doku gibt es keinen Rest von `STRUCTURE_DAYS`. Ponytail-review: nichts zu kürzen.
