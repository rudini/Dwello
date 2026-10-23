# Review baseline-review-2: Architektur-Baseline (Phase 0), Runde 2

Bereich: `git diff c54b7dd6d 3cc0a3490 -- . ':!docs/reviews'` im Worktree `review-baseline-2` (3cc0a3490).

## Status der IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 (Major) | geschlossen | baseline.md:20 (2729/2609), :41 (Zeile «Diese Analyse selbst» jetzt Muster, `excluded-summary.csv` ohne Zeile), :221 und :285 (14, `m4-literal-sets.csv` 14× `cross_layer=yes`), :234 (`^\d{4}$` als zweimal PLZ, einmal Jahr) stimmen mit `out/report-tables.md` und den CSV überein; `git log d4d508cc2` = 2729 Commits |
| C-2 | geschlossen | 312/3 Tage und «6 Commits» entfernt; 1007/3247/260/14 in `imports-stats.csv`, `imports-unresolved.csv`; 34 von 408 in report-tables.md:22 (nachgezählt). Auflösung von `$lib` jetzt über `basePath` (02-imports.ts:66). Zur Zählung der 34 siehe C-12 |
| C-3 | geschlossen | baseline.md:15 trägt [abgeleitet aus M3]; zum Inhalt siehe C-13 |
| C-4 | geschlossen | baseline.md:65-66 Marketing 30/7 118/12 und Other 1/124/1 = `layers.csv`; `LICENSE` ist laut `files.csv` die einzige Datei in Other |
| C-5 | geschlossen | 07-tables.ts:105-111 rangiert beide Spalten nur über Produktivdateien; nachgerechnet aus `m3-hotspots.csv` (score_crap = commits × crap_max, 04-metrics.ts:173): 1,2,3,6,5,12,14,10,9,4,41,151,35,31,27 = baseline.md:167-181 |
| C-6 | geschlossen (Teilzyklus); der zweite Teil meines Befunds war falsch, siehe C-10 | 02-imports.ts:140 prüft, ob eine Laufzeit-SCC in der Gesamt-SCC liegt; `tarjan` liefert nur SCC > 1 Knoten, also richtig |
| C-7 | geschlossen | 02-imports.ts:160 |
| C-8 | geschlossen | 03-history.ts (erster Schreibvorgang entfernt), 02-imports.ts (`seen` entfernt), 04-metrics.ts:129 (`classify`, `layers.json:26` ergibt FE) |
| C-9 | geschlossen | 06-examples.ts:5,12 `logicalName` (Repo hat nur `messages/{de,fr,it,en}.json`, `s4-pair-examples.csv` unverändert), 07-tables.ts:5 `quantile` (gleiche Nearest-Rank-Formel) |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-10 | Minor | tools/arch-baseline/02-imports.ts:22-29; docs/architecture/baseline.md:319 | `import { type A, type B } from './x'` gilt als Typ-Kante. Das Frontend kompiliert mit `verbatimModuleSyntax: true` (tsconfig.json:13), dort wird daraus `import {} from './x'`, der Modul-Import bleibt zur Laufzeit. Mein Befund C-6 aus Runde 1 hatte das Gegenteil verlangt und war hier falsch. Heute gibt es 0 solche Importe auf interne Pfade (nachgezählt mit der Regex des Skripts), also ändert sich keine Zahl; der Satz in :319 ist für FE/BFF aber falsch, und ein künftiger Laufzeitzyklus über so einen Import würde als «no (type-only edges)» ausgegeben (das Backend hat kein `verbatimModuleSyntax`, dort stimmt die Regel) |
| C-11 | Minor | docs/architecture/baseline.md:325 | «`run.sh` mit diesem Wert gibt dieselben Zahlen» stimmt nicht: `ARCH_BASE` wirkt nur auf die Historie (03); Landkarte, Import-Graph, M4, fallow und Deepcheck lesen `git ls-files` bzw. das Arbeitsverzeichnis (01-map.ts:7, 02-imports.ts:11, 05-knowledge.ts:15, run.sh:20-23). Auf diesem Branch ergäbe derselbe Aufruf schon andere Zahlen (zusätzliche Zeile «this analysis itself» in den Ausschlüssen, `docs/reviews/baseline-review-1.md` in der Landkarte, fallow-Zeilen wie 67 143 vs. 67 156 in `m4-clone-stats.csv`), und auf `d4d508cc2` selbst fehlen die Skripte. Der Satz müsste sagen: Lauf in einem Checkout von `d4d508cc2` mit den Skripten dieses Branches |
| C-12 | Minor | tools/arch-baseline/07-tables.ts:33; docs/architecture/baseline.md:22 | «Issue-Nummern stehen nur in 34 von 408 Einheiten-Titeln»: `/#\d+/` zählt auch die PR-Nummer, die GitHub an Squash-Titel hängt: PR#614 «… (#614)» und PR#157 «… (#157)» tragen keine Issue-Nummer; mit Issue-Nummer sind es 32. Die Aussage ändert sich nicht, die Zahl ist aber als gemessen ausgewiesen |
| C-13 | Minor | docs/architecture/baseline.md:15 | «Die Hotspots … liegen alle in Abrechnung und Mietvertrag»: M3 (:183) leitet das nur für die Top 10 ab; die eigene Top-15-Tabelle hat auf Rang 12-15 `schema.ts`, `invoice.service.ts`, `dashboard/+page.server.ts`, `invoice-completeness.service.ts`. «Die zehn stärksten Hotspots» wäre durch die Tabelle gedeckt |

Keine Blocker, keine Major.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt: `bunx eslint tools/arch-baseline --max-warnings 0` sauber, `bunx fallow audit` ohne Befund, Commit-Gates bestanden.
- Den Lauf in einem Worktree auf `d4d508cc2` habe ich nicht wiederholt (schreibt Dateien); ob die kopierten CSV aus genau den Skripten von 3cc0a3490 stammen, kann ich nur indirekt sehen: alle CSV ausser `m4-clone-stats.csv`, `cycles-file.csv`, den Ausschlüssen und den neuen Import-Dateien sind gegenüber Runde 1 unverändert, und die Abweichung der fallow-Zeilen (67 143 → 67 156) passt zu geänderten Skripten im Arbeitsverzeichnis.
- Die fallow-/Deepcheck-JSON in `out/` sind nicht eingecheckt; die daraus abgeleiteten Abschnitte von report-tables.md haben sich nicht geändert.
- `imports-unresolved.csv`: nur Plausibilität (alle 14 sind Test-/Tool-Dateien), nicht jede Fundstelle gelesen.

Geprüft: Zahlen von baseline.md:15-22, :41, :59-68, :163-183, :221, :234, :285, :319-325 gegen report-tables.md und CSV; 02-imports.ts (Regex-Gruppen, Typ-Kanten, Laufzeitzyklus, Statistik), 07-tables.ts (Ränge, Issue-Zählung), run.sh (`clone.csv`); nichts Fremdes im Delta.
