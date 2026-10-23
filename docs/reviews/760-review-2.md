# Code-Review #760, Runde 2 (Abschluss, abd6172..a1c0469)

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|----|--------|-------|
| C-1 | behoben | `src/routes/invoices/InvoiceUploadRow.svelte:49` `unread = row.byHand \|\| row.status === 'failed'`, gleich wie `toDoOf` (`src/lib/invoice-upload.ts:153`). DOM-Test `src/__tests__/invoice-upload-dialog.dom.test.ts:188`: Mit 500 und ohne Code geht die Zeile in den Zweig `status: 'failed'` (`InvoiceUploadDialog.svelte:160`). Ohne die Änderung bleibt `byHand: false` und der Test sieht «Angaben prüfen», er fällt also rot aus. |
| C-2 | behoben | Die Nachricht von 3b09c03 nennt «lässt die Angaben einer gelesenen Datei prüfen» als Test, der beibehaltenes Verhalten festhält und nicht rot lief. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | tests/e2e/features/invoices.feature:214 | Mit dem Fix von C-1 sieht der Benutzer in der Zeile «Auslesen fehlgeschlagen» eine andere Beschriftung («Angaben eingeben» statt «Angaben prüfen»). Das deckt nur der DOM-Test ab. Das bestehende Szenario mit `FailRequests` an dieser Stelle prüft die neue Beschriftung nicht. Mit dem vorhandenen Schritt `bietet der Dialog "Rechnungen hochladen" zur Datei {string} {string} an` (`tests/e2e/steps/ki-settings.steps.ts`) wäre es eine Zeile. Der Schritt braucht keinen eigenen Rotlauf, weil der DOM-Test rot lief (`CLAUDE.md`, Workflow 2). |

Keine Blocker oder Majors.

Geprüft: Delta abd6172..3b09c03 (2 Dateien). 97012c0 enthält nur `docs/design/personas/helga-760.md`. Der Merge a1c0469 berührt keine Datei zu Rechnungen, `messages` oder KI. Es gibt keine neuen Texte, Bildschirme oder Zustände. Nichts ist ungenutzt, und nichts gehört nicht zur Anforderung.

## Nicht bestätigt

- lint, check, fallow audit und vitest `invoice-upload-dialog.dom` (54 grün) auf 3b09c03: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Den Rotlauf des neuen DOM-Tests habe ich nur durch Lesen bestätigt (`InvoiceUploadDialog.svelte:158-160`, `InvoiceUploadRow.svelte:47-51`).
- E2E nach dem Merge wurde nicht ausgeführt. Der Merge ändert keine Datei dieses Slices.
