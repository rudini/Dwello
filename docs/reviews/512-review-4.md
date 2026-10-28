# Code-Review 512, Runde 4 (Abschlussrunde vor dem Push)

Bereich: `git diff a676075 439e653 -- . ':!docs/reviews' ':!implementation_plan.md'`. d60b9b5 ist ein konfliktfreier Merge von origin/main (nur `docs/architecture/utility-tree.md` und `docs/archive/implementation-plan-verlauf.md`), kein App-Code.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | Minor | backend/src/__tests__/period-types.test.ts:8, :17 | Der erste und der dritte Test bestehen schon auf a676075: Sie halten Verhalten fest, das schon da war. Die Commit-Nachricht von 439e653 sagt aber nicht, dass sie bestehendes Verhalten festhalten (CLAUDE.md, Workflow 2). Rot war nur der zweite Test, und den nennt die Nachricht über C-5. Das gehört in den PR-Text. |

Geschlossen: C-5, C-6.

Geprüft: `changeOnSave` behält bei einer kurzen Zwischeneinstellung die gespeicherte Änderung samt Tag. Ohne die Behebung schlägt der zweite Test fehl, denn der alte Code liefert `2027-03-01:calendar`. Beim Zurückwechseln auf den früheren Typ bleibt `from === type`, und `earlierType` (accounting-period.ts:80) übergeht das wie bisher. Bei `brief` ist `on` nicht leer, also ist `stored!` sicher. `month` gibt es nur noch einmal, und es hat keinen weiteren Aufrufer. Keine Texte, keine Oberfläche, keine API-Antwort geändert.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: Der neue Test «behält Tag und Abrechnungsperiode des ersten Wechsels …» war vor der Behebung rot. `bun test src/__tests__/period-types.test.ts src/__tests__/accounting-period.test.ts src/__tests__/statement-run.pg.test.ts` lief mit 49 bestandenen Tests. Ausserdem liefen ohne Befund: der Type-Check im Backend, `bun run lint`, Prettier auf den neuen Dateien und die Commit-Hooks.
