# Code-Review Strukturbericht, Runde 1 (eab26ffa9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tools/arch-baseline/structure.ts:184-186, 160-161 | Die DSM zeigt nur Kanten innerhalb einer Schichtgruppe. Kanten zwischen den Gruppen fallen ohne Hinweis weg, und davon gibt es echte: `shared:types` importiert `be:api` und `be:services/split-keys` (`src/lib/types.ts:1-3`), `bff:server/*` importiert `be:api` (z. B. `src/lib/server/building.ts:2`). Diese Abhängigkeiten stehen in keiner Matrix, eine Rückkante zwischen den Gruppen würde nie rot. Der Text bei Zeile 221 («Zeile verwendet Spalte …») und die Zahl «${edges.length} Modul-Abhängigkeiten» (Zeile 209) sagen nicht, dass sie fehlen. |
| C-2 | Minor | tools/arch-baseline/structure.ts:55-56 | Laut Kommentar zählen Re-Exporte dort, wo sie deklariert sind. Die Regex zählt aber `export type { X }` und `export type { X } from '…'` als je einen abstrakten Export (`type\b` passt vor `{`). Betroffen sind z. B. `src/lib/types.ts:85`, `:307`, `backend/src/services/contract.service.ts:28` und `backend/src/services/pdf.service.ts:30`. Das erhöht A dieser Module, der Kommentar und die Testannahme (structure.test.ts:43 deckt nur `export { … } from` ab) treffen nicht zu. |
| C-3 | Minor | tools/arch-baseline/structure.ts:116, 194 | Die Liste «Funktionen über den Schwellen» filtert auf Produktivdateien und sortiert nach zyklomatischer Komplexität. Kein Test deckt das ab: Die Tests in `structure.test.ts` lesen `analysis.functions` nicht, und keiner prüft die Tabelle im HTML. |

Keine Blocker, keine Major.

Ponytail-review: Lean already. Ship. (Ich habe in `tools/` keinen vorhandenen HTML-Escape-Helfer und keinen anderen Ampel-Helfer gefunden, den der Code kopiert.)

Zu den Designentscheidungen, die zu beurteilen waren:
- **Abstraktheit per Regex:** Für einen Bericht vertretbar, bis auf die Abweichung in C-2.
- **I = 1 ohne Verwender:** Martin lässt 0/0 offen; I = 1 ist für einen Bericht vertretbar, und Zeile 212 nennt die Regel.
- **Rot erst ab Ca ≥ 5:** Ist im Bericht erklärt (Zeile 212) und getestet (structure.test.ts:101-112).
- **fallow mit `--no-cache`:** Wie `tools/arch-baseline/run.sh:21`, nur ohne Cache; die Pfade passen zu `files.csv`, wie `04-metrics.ts:156-160` zeigt.
- **DSM-Aufteilung in zwei Gruppen:** Siehe C-1.

Geprüft: Lakos-Level und Zusammenfassung der Zyklen (levels), Ca/Ce nur über Produktivkanten, Formeln für I, A und D, Ampelskalen und ihre Umkehr bei «höher ist besser», Gesamtfarbe = schlechteste Teilfarbe, Rückkanten in der DSM, Sortierung der Modultabelle, HTML-Escaping der Namen, npm-Script (OUT-Verzeichnis legt `lib.ts:13` an, `build/` steht in `.gitignore`), Doku-Zeile in fitness-functions.md, Plan-Session. Kein Diff ausserhalb des Auftrags. Nach dem Lesen schlägt jeder neue Test ohne den Code fehl (alles neue Dateien).

## Nicht bestätigt

- `bunx vitest run tools/arch-baseline/structure.test.ts` (11 grün, jeder vorher rot), eslint, `bun run check`, `testcheck:audit`, `deepcheck:audit`, prettier, `open-work.test.ts`, Lauf von `bun run structure:report` mit Screenshots hell/dunkel: vom Aufrufer gemeldet.
- Ob die Hotspot-Schwellen 10/20 zur Skala von fallow passen und ob fallow für Hotspots wirklich «die letzten 6 Monate» nimmt (Text Zeile 214): Im Worktree gibt es weder `node_modules` noch eine fallow-Doku; `04-metrics.ts` liest nur `hotspots[].score`.
- Ob `fallow health --format json` `findings[].severity` mit den Werten `critical` und `high` liefert (Zeile 96): Kein anderes Tool im Repo liest das Feld, und es liegt keine Beispielausgabe vor.
