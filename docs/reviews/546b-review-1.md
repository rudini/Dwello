# Code-Review #546, Slice 1b (Abschlussrunde), Runde 2

Worktree: /tmp/scratchpad/review-546b-code-reviewer (2658b19), Delta `d4e5087..2658b19` ohne `docs/reviews` und `docs/design/personas`. Vorheriger Bericht: `docs/reviews/546-review-1.md`.

Geschlossen: C-1, C-2, C-3

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Belege für die geschlossenen Befunde:
- C-1: `statement-invoices.pg.test.ts:472` prüft `declineCosts` gleich dem Unterschied. `:561` prüft `declineCosts` null beim Fall 4.00 → 3.00. Ohne `&& Number(difference) > 0` in `statement.service.ts:617` wäre `declineCosts` dort «-1.00», und `:561` würde rot. Ohne die ganze Bedingung (`null` immer) würde `:472` rot.
- C-2: `statement.service.ts:615-616` prüft jetzt beide Saldi, ausser in einer Schlussabrechnung. Der neue Test «erklärt einen bisherigen Saldo unter CHF 5» (`:477-492`) nutzt einen eigenen Mietvertrag ohne Ende, also keine Schlussabrechnung. Der bisherige Saldo ist 3.00, der neue liegt bei etwa CHF 100. Auf d4e5087 prüfte der Code nur den neuen Saldo und lieferte deshalb `false`. Der Test wäre dort rot. Der Text `statements_later_below_minimum` passt zu beiden Seiten, weil er allgemein von «einem Saldo unter CHF 5.00» spricht.
- C-3: Der Import steht jetzt in `src/lib/server/statement.ts:10` bei den anderen Imports. Der JSDoc steht wieder direkt über `laterChanges`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - auf bc66b84: `statement-invoices.pg.test.ts` (46 bestanden), `bun run lint`, `bun run check`;
  - auf d4e5087: `cd backend && bun run type-check`, `bunx vitest run --changed` (1106 bestanden), E2E-Szenarien zu «berichtigen» (15 bestanden).
- Die Rotläufe von C-1 und C-2 habe ich nur durch Lesen beurteilt. Für den C-2-Test habe ich nicht nachgerechnet, ob der neue Saldo genau über CHF 5 liegt. Bei einer Rechnung über CHF 100 und Akonto 0 ist das plausibel.
- Den Persona-Bericht `docs/design/personas/weber-546.md` habe ich nicht gelesen, er liegt ausserhalb des Deltas.

Geprüft: Archiveintrag in `docs/archive/implementation-plan-verlauf.md`. Im Delta gibt es keine fremden Änderungen und keine neuen UI-Texte.
