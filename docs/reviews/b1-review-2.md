# Slice-Review B1, Runde 2 (Abschlussrunde vor dem Push)

Worktree `agent-a265ac74420fe6194`, HEAD 720266ab. Vorbericht: `docs/reviews/b1-review-1.md`.
Delta: `git diff 5d964822 8df1863e` (ohne `docs/reviews`, `docs/design/personas`) und die Konfliktauflösung des Merges von origin/main a50d72e3 (`git show --remerge-diff 720266ab`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde im Delta. |

Keine Blocker, keine Majors.

## Status der offenen IDs aus Runde 1

- **C-1 (Minor): behoben.** In `tests/e2e/steps/statement-detail.steps.ts:505` steht jetzt `toBe(32)`.
  - `Gap.between` (`tests/e2e/screenplay/questions.ts:146`) gibt `Math.round(bottom.y - (top.y + top.height))` zurück. Gebrochene Pixel ergeben also keine falsche Röte.
  - Mit der alten Lücke (128 px) und auch mit 0 px oder einem negativen Wert wird der Schritt rot.
  - `Math.round` war schon vor 5d964822 im Code, das Delta ändert es nicht.
- **C-2 (Minor): offen.** Der Aufrufer lässt ihn bewusst im Bericht. Das Delta ändert `error-codes.pg.test.ts` nicht.

## Merge a50d72e3: Konfliktauflösung

- `backend/src/__tests__/api-contracts.pg.test.ts:11-12`:
  - Die Auflösung nimmt den Schema-Import von main (mit `contractAdvancePayments`) und den Import von `config.service` aus dem Branch.
  - Beide werden benutzt: `getConfig`, `setConfig` und `deleteConfig` ab Z. 334, `contractAdvancePayments` ab Z. 378.
  - Es fehlt kein Import, und keiner ist doppelt.
- `tests/e2e/questions/statement-detail.ts`:
  - Die Auflösung nimmt die Imports beider Seiten (`advanceDiffers`, `costBreakdown`, `statementAdvancePaid`).
  - Sie behält beide Export-Blöcke: `gapAboveCostBreakdown` und die beiden Questions zu #464.
  - Es bleibt kein Konfliktmarker stehen, und kein Export fehlt.

## Neue Elemente von main auf der Abrechnungsdetailseite (#464)

- `statement-advance-paid` liegt in `CostTable.svelte:176`, also in der Kostenaufstellung selbst und nicht darüber. Für den Abstand ist es ohne Belang.
- `statement-advance-differs` (`Correction.svelte:102-112`) liegt zwischen der Statuszeile und der Kostenaufstellung.
  - Es wird nur gezeigt, wenn die Abrechnung ein Entwurf ist, eine andere ersetzt (`replaces`) und das Akonto abweicht.
  - Das Szenario «Die Kostenaufstellung folgt im üblichen Abstand auf den Status» (`statement-detail.feature:192-196`) nutzt eine versendete Abrechnung, die keine andere ersetzt. Dort erscheint der Hinweis nicht, und das Szenario bleibt gültig.
  - Wenn der Hinweis erscheint, ist er sichtbarer Inhalt mit dem üblichen `gap-8` und keine leere Lücke. Das Szenario ist darum nicht anzupassen.
- Das versteckte Formular in `FormDialog.svelte:41-43` und `empty:-mt-8` an den Live-Regionen (`ReminderFeedback.svelte:25`, `SendFeedback.svelte:11`) sind nach dem Merge unverändert.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst wiederholt:
  - `bun run lint`, `bun run check`, Backend `type-check`
  - Backend `bun test` für error-codes, api-contracts und fuel-stock (104 Tests)
  - vitest design-guard, backend-codes und tokens (470 Tests)
  - E2E Chromium von `statement-detail.feature` und `navigation.feature` (110 Tests)
- Nicht geprüft habe ich den übrigen Inhalt des Merges von main (#464, Verträge und Akonto). Er ist nicht Teil dieses Slices und wurde dort reviewt. Gelesen habe ich nur die beiden Konfliktdateien und die Dateien der Abrechnungsdetailseite, die main geändert hat (`Correction.svelte`, `CostTable.svelte`, `targets/statement-detail.ts`).
