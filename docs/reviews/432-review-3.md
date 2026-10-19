# Code-Review #432, Runde 3 (Abschlussrunde vor dem Push)

Gegenstand: `git diff 4cbed469 205253d8 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/design/personas'` im Worktree `review-432-code3` (detached auf 205253d8). Vorheriger Bericht: `docs/reviews/432-review-2.md`.
Gelesen: `src/lib/contract-wizard.ts` (einzige Code-Änderung, Zeilen 86-96), die Aufrufer von `flatRateNotice` (`src/routes/contracts/new/RentStep.svelte:38`, `src/__tests__/contract-wizard.test.ts:107-133`), dazu der Diff von `implementation_plan.md` und Issue #432 (GitHub API, Text).

## Status der offenen IDs aus Runde 2

| ID | Status |
|----|--------|
| C-2 | offen (Nit), unverändert; braucht nach den Regeln keine Behebung |
| C-3 | erledigt: Issue #432, «Decided (product owner)», enthält jetzt den Eintrag «2026-10-19 (persona Helga, … P-1): with an Akonto, the warning shows only while every Nebenkosten box is still ticked …; without an Akonto the rule of #429 stays. A contract with Akonto and no ticked box is #444.» Code und Entscheidungstext stimmen überein. |
| C-4 | erledigt: `src/lib/contract-wizard.ts:95` lautet jetzt `return ticked >= (categories?.length ?? 0) ? m.contracts_flat_rate_warning_text_advance() : null;` |

## Neue Befunde im Delta

Keine. Keine Blocker, keine Major.

## Bestätigt

- **Gleiche Wahrheitstabelle wie vorher** (alt: `!values.agreedCategoryIds || !categories || ticked >= categories.length`), Fall für Fall:
  - `agreedCategoryIds` fehlt, `categories` vorhanden: `ticked = categories.length`, also `ticked >= categories.length` wahr, wie alt.
  - `agreedCategoryIds` fehlt, `categories` fehlt: `ticked = 0`, die Funktion gibt schon in Zeile 92 `null` zurück; die Zeile 95 wird nicht erreicht, wie alt.
  - `agreedCategoryIds` vorhanden, `categories` fehlt: neu `ticked >= 0`, wahr (ticked > 0 nach Zeile 92), wie alt (`!categories`).
  - beide vorhanden: gleicher Vergleich wie alt.
- **Tests:** `contract-wizard.test.ts:127-131` decken «alle angekreuzt» (Warnung) und «eins abgewählt» (`null`) mit Akonto ab; selbst ausgeführt: `bunx vitest run src/__tests__/contract-wizard.test.ts` 26/26 grün. Ein Refactoring ohne Verhaltensänderung braucht keinen neuen Test und kein Rot.
- **Nichts Fremdes:** Das Delta ändert ausser der einen Zeile nur Berichte und den Plan (Plan: zwei Punkte abgehakt, Verweis auf #444, passt zum Slice).
- **Texte, Bildschirme, API, Sicherheit, Design:** nicht berührt.
- **ponytail-review:** Die Änderung ist selbst die Kürzung aus C-4; nichts Unbenutztes bleibt zurück (die Variable `all` ist weg).

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend `bun run type-check`, `bunx vitest run` (3109) und E2E chromium `-g "Nebenkostenpauschale|flat-rate-warning"` (18, auf 4cbed469): vom Aufrufer gemeldet; nur `bunx vitest run src/__tests__/contract-wizard.test.ts` selbst wiederholt (26 grün). Dass E2E auf 4cbed469 lief, trägt für 205253d8, weil das Delta im Code nur die oben geprüfte gleichwertige Zeile ändert.
- Die Berichte `docs/reviews/432-review-2.md` und `docs/design/personas/helga-432-2.md` habe ich nicht inhaltlich geprüft (vom Aufrufer ausgenommen, keine Code-Wirkung).
