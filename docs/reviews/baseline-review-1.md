# Review baseline-review-1: Architektur-Baseline (Phase 0)

Bereich: `git diff d4d508cc2 c54b7dd6d^1 -- . ':!docs/reviews'` im Worktree `review-baseline-code-reviewer` (c54b7dd6d).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | docs/architecture/baseline.md:20, :41, :219, :232, :283 | Zahlen im Report widersprechen `out/report-tables.md` bzw. den CSV (2603/2723 statt 2609/2729 Commits, 58 statt 60 ausgeschlossene Dateien, 13 statt 14 schichtübergreifende Wertelisten, «PLZ in 3 BFF-Dateien» statt 2) |
| C-2 | Minor | docs/architecture/baseline.md:20, :22, :68, :317, :323; tools/arch-baseline/02-imports.ts:51, :145 | Zahlen ohne Quelle in `out/`: 312 Commits/3 Tage, «Issue-Nummern in 27 PR-Titeln» (units.csv ergibt 31 PR-Merge-Titel mit `#n`), 1007 Dateien und 14 Dateien mit unaufgelösten Importen (nur Konsolenausgabe; die Prüfung in :51 löst `$lib/…` gegen `dirname(f)` auf und zählt damit falsch), «um 6 Commits bewegt» |
| C-3 | Minor | docs/architecture/baseline.md:15 | Zusammenfassung Punkt 5 trägt [gemessen], obwohl «alle in Abrechnung und Mietvertrag» und «komplexer als die meisten Backend-Services» gelesen bzw. abgeleitet sind (Abschnitt M3, :182, kennzeichnet dasselbe als [abgeleitet]) |
| C-4 | Minor | docs/architecture/baseline.md:53-64 | Die Landkarte [gemessen] lässt die Zeilen Marketing (30 Dateien, 7 118 LOC) und Other (1 Datei) aus `layers.csv` weg, ohne es zu sagen |
| C-5 | Minor | docs/architecture/baseline.md:162-180 | Spalte «Rang» ist auf Produktivdateien neu nummeriert, «CRAP-Rang» ist der CSV-Rang inkl. Testdateien (1, 3, 5, 11, …); die Fussnote sagt, die Tabelle zeige nur Produktivcode, die beiden Ränge sind aber nicht vergleichbar |
| C-6 | Minor | tools/arch-baseline/02-imports.ts:119 | Laufzeitzyklus nur erkannt, wenn die Laufzeit-SCC exakt der Gesamt-SCC gleicht: eine SCC mit Laufzeit-Teilzyklus plus Knoten über `import type` wird als «no (type-only edge)» ausgegeben; `import { type X }` gilt als Laufzeitkante. Heute (1 Zyklus) ist das Ergebnis richtig |
| C-7 | Minor | tools/arch-baseline/02-imports.ts:133 | Kommentar «production files only» ist falsch: die Matrix zählt alle Kanten inkl. Tests und Tooling (siehe `imports-layer.csv`) |
| C-8 | Minor | tools/arch-baseline/03-history.ts:252; 02-imports.ts:37,46; 04-metrics.ts:129 | Toter Code: erster Schreibvorgang von `excluded-units.csv` wird in :280 überschrieben; `seen` in 02 ist nie wahr, wenn `prev` fehlt; Sonderfall `messages/` in `fileLayer` ergibt dasselbe wie `classify` (`^messages/` → FE) |
| C-9 | Minor | tools/arch-baseline/06-examples.ts:12; 07-tables.ts:222 | Kopien vorhandener Helfer aus `lib.ts`: `logicalName` (06 hart kodiert `messages/` → Quartett) und `quantile` (07 `q`) |

## C-1 (Major): Report-Zahlen widersprechen den eigenen Rohdaten

Die Anforderung verlangt, dass jede Zahl aus den Skripten stammt; Abschnitt 6 (:323) sagt «alle Zahlen stammen aus dem letzten Lauf auf d4d508cc2». Mehrere Zahlen im Text stimmen nicht mit der eingecheckten Skriptausgabe überein:

- :20 «2723 Commits ab 23.01.2026 … Okt 2603»: `out/report-tables.md` (History) zeigt Okt **2609**, Summe **2729**. Nachgeprüft: `git log d4d508cc2 --format=%ad --date=format:%Y-%m | sort | uniq -c` ergibt 54/39/4/23/2609 = 2729. Der Text stammt also aus einem älteren Lauf.
- :41 «Diese Analyse selbst … 58»: `excluded-summary.csv` und report-tables.md zeigen **60**.
- :219 und :283 (H1) «13 schichtübergreifend»: `m4-literal-sets.csv` hat **14** Zeilen mit `cross_layer=yes` (gezählt: `grep -c ',yes,'` = 14).
- :232 «PLZ `^\d{4}$` in 3 BFF-Dateien»: laut `m4-regex.csv` ist eine der drei `src/routes/invoices/+page.server.ts`, und dort prüft :26 den Query-Parameter `year`, keine PLZ. Der Report selbst zählt diesen Treffer in :244 als technisch («Jahr als Query-Parameter»).

So zeigt es sich: jede der genannten Zeilen gegen die zitierte CSV bzw. den Abschnitt in `out/report-tables.md` halten. Lösung: die Textzahlen aus dem eingecheckten Lauf übernehmen (oder `run.sh` neu laufen lassen und alle Textzahlen danach abgleichen).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `bunx eslint tools/arch-baseline --max-warnings 0` sauber, `bun run check` 0 Fehler, `bunx vitest run src/__tests__/open-work.test.ts` 5 bestanden, fallow- und deepcheck-Gates bestanden, `run.sh` mit Exit 0 (nicht gestartet, da es Dateien schreibt).
- Ob `.fallowrc.json` den Glob `tools/arch-baseline/0*.ts` als Einstiegspunkt auflöst: nur über das gemeldete Gate.
- Die Rohdaten selbst (units.csv, commit-files.csv, fallow-/deepcheck-JSON) habe ich nicht neu erzeugt; geprüft habe ich, dass die Skripte die behaupteten Formeln rechnen, und Stichproben der Tabellen gegen die CSV.
- `parseNumstat`/`renameTarget` (lib.ts) und die Import-Regex haben keine Tests; nur durch Lesen geprüft (Brace- und Leerseiten-Renames ergeben den neuen Pfad).
- Die gelesenen Diffs der Beispiel-Commits in Abschnitt 4 (Einordnung essenziell/akzidentell) habe ich nicht nachgelesen; ausser für den Stand von HEAD (Status-Vergleiche in den 5 BFF-Dateien, 4 Prüfregeln in `settings.ts`: bestätigt).

Geprüft: Kopplungsgrad n_AB/(n_A+n_B−n_AB) und Konfidenzen (04:103-114, revs und Paare über dieselben Transaktionen ≤ MAX_TX), PR-Einheiten aus First-Parent-Merges mit Diff `ps[0]..merge` und Ausschluss der Sync-Merges (03), Ausschlussregeln (layers.json), M1-Median/P90, M2-Sichten, Top-20-Paare, Modulpaare, M3-Top-15, M4-Tabellen (Spiegel, Typen, Status, Regex, Klone, Entscheidungen pro Schicht), 132/122/27 Paare der prod+test-Sicht, 63,1 %, H-28-Zeile gegen M4; keine App-, Text- oder E2E-Änderung, nichts Fremdes im Diff.
