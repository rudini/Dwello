# Review #489, Runde 2 (Abschluss, c547714..4cbc654)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/tenants/[id]/TenantDocumentUpload.svelte:47 | Geschlossen: «meldet ein hochgeladenes Dokument» (src/__tests__/tenant-detail-page.dom.test.ts:253-261) wählt vorher `ausweis.pdf` über das `change`-Ereignis (`choose`, Zeile 36) und prüft danach `tenant-document-file-chosen` = «Keine Datei ausgewählt». Ohne `chosenName = ''` bliebe `ausweis.pdf` stehen, der Test wäre rot. |

Keine neuen Befunde. Keine Blocker, keine Major.

Geprüft: Delta ist nur Test (6 Zeilen), `flushSync` bereits importiert; Commit-Nachricht fbac5d3 nennt C-1.

## Nicht bestätigt

- tenant-detail DOM-Tests (26): selbst erneut ausgeführt, grün.
- Rot ohne Zeile 47: nur gelesen (vom Aufrufer gemeldet), nicht ausgeführt.
- lint, check auf c547714: vom Aufrufer gemeldet.
