# Code-Review Strukturbericht, Runde 2 (Abschlussrunde, db9ee0305)

Delta: `git diff eab26ffa9 db9ee0305 -- tools/arch-baseline` (structure.ts, structure.test.ts). Der im Auftrag genannte Hash 2b8f5d4d4 existiert nicht; geprüft wurde nach der Korrektur des Aufrufers db9ee0305 (HEAD des Worktrees).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1, C-2, C-3

Keine Blocker, keine Major, keine Minor.

Geprüft: C-2: Die Regex `type(?!\s*\{)` (structure.ts:56) schliesst `export type { X }` und `export type { X } from …` aus, `export type Foo = …` zählt weiter; der Test (structure.test.ts:43-45) ergäbe ohne den Fix `{ abstract: 5, exports: 10 }` und wäre rot. Im Code gibt es kein `export type * from` (grep in src und backend/src), das die Regex noch falsch zählen würde. C-1: `cross` (structure.ts:188-189) zählt Produktivkanten mit verschiedenem Gruppenindex; der Test (structure.test.ts:155-158) wäre ohne den Text rot und unterscheidet 1 von 0 und von «alle Kanten» (3). Präfixe ausserhalb beider Gruppen (Index -1, z. B. `static/…`) haben keine Import-Kanten. C-3: Der Test (structure.test.ts:160-171) prüft den Filter auf Produktivdateien und die Sortierung; der Code (structure.ts:116, 196) ist seit eab26ffa9 unverändert, die Commit-Nachricht nennt den Test als Pin von bestehendem Verhalten, und es ist kein Bugfix. Ponytail-review: Lean already. Kein Diff ausserhalb des Auftrags.

## Nicht bestätigt

- `bunx vitest run tools/arch-baseline/structure.test.ts` (13 grün; C-1- und C-2-Test vor dem Fix rot), eslint auf beiden Dateien, prettier, `testcheck:audit`, `deepcheck:audit`, Lauf von `bun run structure:report`: vom Aufrufer gemeldet.
- Aus Runde 1 weiter offen und unverändert: ob die Hotspot-Schwellen 10/20 zur Skala von fallow passen und ob `fallow health --format json` `findings[].severity` mit `critical`/`high` liefert (kein `node_modules`, keine Beispielausgabe im Worktree).
