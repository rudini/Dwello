# Re-Review 548, Runde 3 (dfd07ac..cc5fd3a)

## Status der offenen IDs aus 548-review-2.md

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-2 | Major | geschlossen | Das neue Szenario «Die Kategorie bringt den Verteilschlüssel und nimmt seinen Fehler zurück» steht in tests/e2e/features/invoices.feature:134–145 und hat kein `@wip`. `seed.invoiceOn` legt den letzten Schlüssel für Allgemeinstrom an, danach lädt die Rechnungsliste neu. Der erste Erstellversuch zeigt den Fehler des Verteilschlüssels. Die Wahl der Kategorie setzt den Schlüssel ohne Eingabe am Feld. Der Anker «1 Rechnung erstellen» erscheint erst, wenn `checkRow` die Zeile vollständig findet (InvoiceUploadDialog.svelte:114–118). Vorher heisst der Knopf «0 Rechnungen erstellen …», also wartet der Anker genau auf den gesetzten Schlüssel. Danach prüft der neue Schritt, dass das `form-error` mit dem Text fehlt (Field.svelte:109, targets/form.ts:4). Ohne den Fix bleibt dieser Fehlertext stehen, weil `corrected` in Field.svelte nur bei einer Eingabe greift. Das Szenario wäre also rot. Nach Workflow 2 braucht es keinen eigenen roten Lauf, weil der DOM-Test rot war. |

## Neue Befunde im Delta

Keine.

Geprüft: Der neue Schritt in tests/e2e/steps/common.steps.ts:36–39 ruft nur die bestehende Question `errorMessageShown` auf, das hält die Screenplay-Schichten ein. Vor der negativen Prüfung steht der positive Anker (Regel «Negative checks»). Die Schritte des Szenarios gibt es alle schon (statement-detail.steps.ts:119, invoices.steps.ts:27, invoice-upload.steps.ts:108/147/269). Das Feature beschreibt das Ziel des Liegenschaftsverwalters, nicht die Bedienung. Der Fehlertext gehört nur zum Verteilschlüssel (`invoices_error_key_required`), die Kategorie hat einen eigenen Text. Es gibt keine neuen UI-Texte, keinen neuen Bildschirm und nichts ausserhalb der Anforderung. Die Bemerkung zu «Neue Rechnung»/«Rechnung bearbeiten» ist als #573 erfasst, wie gemeldet. Das Issue selbst habe ich nicht angesehen.

## Nicht bestätigt

- Das Szenario in Chromium (1 passed), `bun run lint` und der e2e-screenplay-lint-Test: vom Aufrufer gemeldet, nicht wiederholt (E2E ist mir nicht erlaubt).
- Dass das Szenario auf dem Stand vor dem Fix (6f963da) wirklich rot ist: Das habe ich nur durch Lesen festgestellt, nicht laufen lassen.
