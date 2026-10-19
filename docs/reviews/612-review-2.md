# Review 612, Runde 2 (Re-Review und Abschlussrunde)

Delta: `git diff 33d34081 4ad1e9ba -- . ':!docs/reviews' ':!implementation_plan.md'` (Commit `4ad1e9ba fix(tests): wait for apartment in toRentStep`),
Worktree auf 4ad1e9ba. Gelesen: `tests/e2e/tasks/accessibility.ts`, `tests/e2e/tasks/contract-form.ts`.

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Major | behoben | `accessibility.ts:157`: `toRentStep` nutzt nach dem ersten «Weiter» jetzt `keepApartment` (wartet auf `apartmentSelect`). Erneute Suche nach `Click.on(nextButton)` gefolgt von einem weiteren Klick: nur `contracts-unknown-review` (411-413, wartet dazwischen auf `apartmentContractsUnknown`, gleiches Update wie die Auswahl) und der Abrechnungsassistent (438-440, `Check.the` dazwischen, nicht Teil dieser Race). Keine weitere ungesicherte Stelle. |
| C-2 | Nit | behoben | `contract-form.ts:160-161` nennt jetzt die Auswahl, die den Ladetext ersetzt, und die Hinweise. |

## Neue Befunde im Delta

Keine. Der Delta ist minimal, Schichtregeln eingehalten (Task ruft Task), nichts Fremdes.

## Nicht bestätigt

- prettier, lint, Chromium-Zeilen agreed-costs-none*/flat-rate-warning* in accessibility und sprachen-bildschirme (8 passed): vom Aufrufer gemeldet; E2E nicht selbst gestartet.
- Grün in Firefox/WebKit: nur per Code-Lesen plausibel, dort nicht ausführbar.
- `docs/reviews/612-review-1.md` und `implementation_plan.md` gemäss Auftrag vom Delta ausgenommen, nicht geprüft.
