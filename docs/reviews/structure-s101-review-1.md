# Code-Review Runde 1: Strukturbericht nach Structure101 (2fd9fa1dd)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tools/arch-baseline/structure.ts:123 | Der Ordner-Filter für versteckte Kopplung verwirft nicht nur SvelteKit-Seite und Lade-Funktion, sondern jedes Paar zweier Module aus einem flachen Ordner: `backend/src/services/*.ts`, `backend/src/routes/*.ts`, `src/lib/server/*.ts`, `src/lib/*.ts` und `backend/src/db/*.ts` sind je Datei ein eigenes Modul (`layers.json:41,47,52,53,56`). |
| C-2 | Minor | tools/arch-baseline/structure.ts:440, package.json:38, tools/arch-baseline/structure-history.sh:38 | Die Prüfung `existsSync(fallow-gaps.json)` greift nie: Die Umleitung `>` legt die Datei auch dann an, wenn fallow scheitert. Eine leere Datei lässt `JSON.parse` werfen. Damit bricht der Bericht ab, und im Verlaufsskript bricht `set -e` die Schleife ab, obwohl `|| true` das Scheitern abfangen soll. |
| C-3 | Minor | tools/arch-baseline/structure.ts:131 | Der Ce-Teil der Fat-Module-Regel (Ce > 15) hat keinen Test. Fällt `ce / LIMITS.fatModule.ce` weg, bleiben alle Tests grün; der XS-Test prüft nur die Dateizahl (`fe:ui`, 40 Dateien). |
| C-4 | Minor | tools/arch-baseline/structure.ts:424-426 | Das Inline-Skript, das bei einem Hash-Wechsel die Moduldetails öffnet, hat keinen Test. Der Test prüft nur Link und Anker. Ein jsdom-Test (Hash setzen, `details.open` prüfen) könnte das Verhalten zeigen; belegt ist es bisher nur durch den gemeldeten Screenshot. |

## C-1 (Major): Die versteckte Kopplung lässt echte Paare zwischen Geschwistermodulen weg

Laut Begründung soll die Regel «a pair in one folder is SvelteKit's own wiring (a page and its load function)» nur die Verdrahtung durch das Framework ausnehmen. `folder(path_a) !== folder(path_b)` trifft aber alle Ordner. In `layers.json` werden Services, Backend-Routen, BFF-Server-Module, `src/lib`-Dateien und `db`-Dateien pro Datei zu einem Modul. Zwei Services, die immer gemeinsam geändert werden und einander nicht importieren, sind genau die versteckte Kopplung, die die Spalte zeigen soll. Sie fallen trotzdem weg. Damit sind die Spalte pro Modul und die Kennzahl (33) systematisch zu tief. Von den 16 ausgenommenen Paaren ist nicht belegt, dass alle zu Seite und Lade-Funktion gehören. Auch der Satz in `fitness-functions.md` und im Bericht («without pairs in one folder (a SvelteKit page and its load function)») nennt den Grund zu eng für das, was der Code tut.

So zeigt man den Fehler: In `Versteckte Kopplung` die Dateien `backend/src/services/b.ts` (Modul `be:services/b`) und das Paar `pair('backend/src/services/a.ts', 'backend/src/services/b.ts')` ohne Kante zwischen den Modulen ergänzen. Erwartet wird `hidden` = 1 für beide Module, der Code liefert 0.
Lösung: Den Filter auf SvelteKit-Routendateien beschränken, also beide Pfade unter `src/routes/` im selben Ordner.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/arch-baseline src/__tests__/open-work.test.ts` (43 Tests, neue jeweils zuerst rot), `bun run lint`, `bun run check`, die Audits von testcheck, deepcheck und fallow, prettier, `bash -n` auf das Skript, `bun run structure:report` von Anfang bis Ende (44 Snapshots), Screenshots der KPI-Kacheln und des Zellklicks.
- Wie fallow arbeitet, konnte ich nicht prüfen, weil der Worktree keine `node_modules` hat: die Schwellen für `change_coupling` (der Berichtstext nennt «at least 5 shared commits and 30 %»), ob `coverage_gaps.summary.file_coverage_pct` nur Produktivcode zählt (die Kachel heisst «Code files a test reaches») und ob reine Typdateien in `coverage_gaps.files` erscheinen.
- Die realen Werte (XS 14.3 %, 33 Paare, 91.7 %) habe ich nicht nachgerechnet; es gibt keinen Build-Ordner im Worktree.

Geprüft: XS-Formel und Kappung, Ampeln und Grenzen in `LIMITS`, das Verwerfen des Verlaufs-Caches bei geänderten Werkzeugen (structure-history.sh:12, Workflow-Cache-Key), XS in Snapshot, Markdown und Verlaufsdiagramm, eindeutige DSM-Anker (`id()` lässt kein `--` stehen), dass Test-Dateikanten aus den Details herausgefiltert werden, die Rot-Lage der neuen Tests durch Lesen und die Doku in `fitness-functions.md`. Ponytail-review: kein ungenutzter Code, keine kopierte Hilfsfunktion.
