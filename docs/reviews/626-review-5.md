# Review 626, Schlussrunde, Runde 3 (Delta)

Delta: `git diff aa57375 b0ddb74 -- . ':!docs/reviews'` (Worktree review-626-close3, Commit b0ddb74). Vorheriger Bericht: `docs/reviews/626-review-4.md`.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-4 | Major | behoben | `tests/e2e/tasks/invoice-upload.ts:69-70`: `addBelegOnceRead` wartet nach dem Upload auf `belegDetailsToggle(fileName)`. Diesen Umschalter gibt es nur bei `editable`, also bei `row.status === 'check' \|\| 'failed'` (`src/routes/invoices/InvoiceUploadRow.svelte:47,64`). Er erscheint also erst, wenn das Lesen beendet ist. Die Negativprüfung `not.toContain('KI')` (`tests/e2e/steps/ki-settings.steps.ts:170`) läuft damit auf der fertigen Zeile. Der Step nutzt die neue Task (`ki-settings.steps.ts:163`). Das gemeldete Rot passt zum Code: Ohne `InvoiceUploadDialog.svelte:152` setzt der Extraktionspfad den Hinweis «Die KI hat diese Datei nicht gelesen». |
| C-6 | Minor | behoben | `tests/e2e/tasks/invoice-upload.ts:62-71`: Jeder JSDoc steht jetzt über seiner eigenen Task (`addBelege`, `uploadBelege`, `addBelegOnceRead`). `addBelege` ist wieder modulprivat, und ausserhalb der Datei verwendet es niemand mehr (grep in `tests/e2e`). |

## Neue Befunde

Keine.

## Nicht bestätigt

- Das Rot ohne `InvoiceUploadDialog.svelte:152`, E2E chromium (50 bestanden), lint, check und fallow audit auf b0ddb74 sind «vom Aufrufer gemeldet». Ich habe sie nicht wiederholt, weil ich E2E nicht starten darf. Das Rot habe ich nur durch Lesen nachvollzogen (Umschalter-Bedingung in `InvoiceUploadRow.svelte:47`).

Geprüft: Steps rufen nur Tasks und Questions auf, die Task wartet auf ihren Zielzustand, keine neuen UI-Texte, nichts ausserhalb der Anforderung.
