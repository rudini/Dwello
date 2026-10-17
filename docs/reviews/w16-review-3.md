# Code-Review Runde 3 (Abschluss vor Push): #100 «Brennstoff» (c66beba1..d3678aec, Merge 38dfba5d)

Worktree: `/tmp/claude-0/-home-user-Dwello/6a612fe5-db6f-5ef4-85c5-983800bc9434/scratchpad/review-w16-code3` (detached, 38dfba5d). Ich habe alle 7 Dateien des Deltas gelesen, ausserdem `category.service.ts:173,184-192` und den Merge (`git show --remerge-diff 38dfba5d`, `git diff d3678aec 38dfba5d` für `schema.ts` und `calculation.service.ts`).

## Befunde (offen und neu)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Nit | `src/routes/config/categories/HeatingChoice.svelte:17-26` | Stammt aus Runde 1 und bleibt bewusst offen. |
| C-9 | Nit | `tests/e2e/steps/building-detail.steps.ts:117-123` | Stammt aus Runde 1 und bleibt bewusst offen. |
| C-14 | Nit | `tests/e2e/steps/categories.steps.ts:85` | Stammt aus Runde 2 und bleibt bewusst offen. |

Es gibt keine neuen Befunde, keine Blocker und keine Major.

## Erledigt aus Runde 2 (am Code geprüft)

- **C-12:** Der Test `category-admin.pg.test.ts:73-86` prüft beide Wege:
  - POST mit `isFuel` ohne `isHeatingCost` (Regel in `category.service.ts:173`);
  - PUT `{ isHeatingCost: false }` auf eine Brennstoff-Kategorie ohne Tankbestand (Regel in `category.service.ts:191`).

  Nur durch Lesen beurteilt: Wird `!!(data.isHeatingCost && data.isFuel)` zu `!!data.isFuel` vereinfacht, schlägt der erste Fall fehl. Fällt Z. 191 weg, schlägt der zweite fehl. Dass er sofort grün war, ist richtig, weil er bestehenden Code abdeckt. Die Workflow-Notiz hält den fehlenden roten Lauf fest.
- **C-13:** Kommentar und Testname in `migrations.pg.test.ts:220-222` sprechen jetzt von «Heizkosten-Kategorien».
- **Merge 38dfba5d:** Der Konflikt ist richtig gelöst: Beide Sessions stehen im Archiv, und die Konfliktmarker sind weg. Die Zeile zur Migration wurde dabei an V-9 angepasst («heating cost category»). Die Änderungen von main in `calculation.service.ts` erkennen die Tankkategorie über `periodReadings(...).categoryId` und nicht über `isFuel`, kollidieren also nicht mit #100. In `schema.ts` kam nur `InvoicePart.profile` dazu. Für die Migrationen kam nichts dazu (kein zweites `0024`).
- **Plan:** Die Session W16 liegt im Archiv, alle Punkte sind abgehakt, und `implementation_plan.md` enthält keine Session mehr.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (3029), `cd backend && bun run test` (960) und E2E chromium (14): vom Aufrufer gemeldet. Selbst ausgeführt habe ich nichts; Backend-Tests waren laut Auftrag ausgeschlossen.
- Dass der Test von C-12 ohne die Regel rot wird, habe ich nur durch Lesen beurteilt, nicht vorgeführt.
- Ob die Bildschirmzeilen von `accessibility.feature` und `sprachen-bildschirme.feature` ausserhalb der gemeldeten Auswahl nach dem Merge grün sind, ist offen wie in Runde 2.
- P-6 aus der zweiten Runde von Helga (`docs/design/personas/helga-w16.md`) habe ich nicht am Code geprüft: Nach der Ablehnung zeigt das Formular das Häkchen leer, obwohl die Meldung «bleiben gesetzt» sagt. Es ist ein Persona-Minor und bleibt laut Plan im Bericht.
