# Code-Review W16b, Runde 2 (Delta 232adab3..a4c103d7)

Keine Blocker, keine Major.

## Status der offenen IDs aus Runde 1

| ID | Status |
|----|--------|
| C-1 | Behoben. `startDraft` ist jetzt eine Funktion des Beispiels und hakt `on.generateBuilding(example.building)` an. Für `draft-restored` und `draft-discard-dialog` gibt `seedFor` ein `building` zurück (`tests/e2e/fixtures/screens.ts:38`, `:160`: Seeblick). `firstGenerateBuilding` ist entfernt und wird nirgends mehr verwendet (`grep` in `tests` und `src`). |
| C-2 | Behoben. Das `select` läuft nur noch für `management_fee_pct`, und der veraltete Kommentar ist entfernt. Das Audit-Verhalten bleibt gleich: `before` wird vor dem Upsert in derselben `tx` gelesen. |
| C-3 | Akzeptiert (vom Aufrufer). |
| C-4 | Wird laut Aufrufer beim Merge in #417 erledigt. Im Delta ist nichts zu prüfen. |

## Neue Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-5 | Nit | tests/e2e/targets/accessibility.ts:65 | Beim Entfernen von `firstGenerateBuilding` ist der Zeilenumbruch mit verloren gegangen. Jetzt stehen zwei Anweisungen auf einer Zeile: `...generate-building-${buildingId}`);export const confirmMissingInvoices = ...`. Prettier meldet das nicht, weil `.prettierignore` nur `src/` prüft. Lint ist laut Aufrufer grün. Es ist nur ein Lesbarkeitsfehler. |
| C-6 | Nit | backend/src/services/config.service.ts:203,205 | Die zwei neuen Zeilen sind länger als `printWidth` 100. Prettier prüft `backend/` nicht, und Z. 7 der Datei ist schon heute länger. Rein kosmetisch. |

## Geprüft und in Ordnung

- `restoreDraft(example)` wird an beiden Stellen (`draft-restored`, `draft-discard-dialog`) mit dem Beispiel aufgerufen. Der Vertragsassistent ignoriert das Beispiel und verhält sich wie vorher (`Select.option({ index: 1 })`).
- Die Plan-Zeile ist nachgeführt. `docs/reviews/w16b-review-1.md` ist der Bericht der Runde 1. Es gibt keine fremden Änderungen im Delta.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-`type-check`, `config.pg.test.ts` und `audit-log.pg.test.ts` (20 pass), E2E `(contract-new|statement-generate) draft-` (10 passed): vom Aufrufer gemeldet, von mir nicht wiederholt (Backend und E2E laut Auftrag nicht gestartet).
- `bunx prettier --check` auf die drei Dateien ist grün, sagt aber nichts aus: `.prettierignore` schliesst alles ausser `src/` aus.
