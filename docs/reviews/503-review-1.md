# Code-Review #503, Runde 1 (9e19d11..2567557)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/statement-pdf.service.ts:298 | Die Bedingung `found.status === 'draft'` (ein versendetes oder bezahltes PDF bleibt bei einer Ablehnung erhalten) hat keinen Test. Ohne sie bleiben beide neuen Tests grün, und kein bestehender Test fällt: `POST /:id/generate-pdf` auf einer versendeten Abrechnung ohne IBAN würde dann das PDF, wie es versendet wurde, löschen. Fehlt: ein pg-Test, der für eine versendete Abrechnung nach einer abgelehnten Neuerstellung `pdfBlob`/`pdfGeneratedAt` unverändert findet. |

Keine Blocker, keine Major.

Geprüft: Beide neuen pg-Tests schlagen auf 9e19d11 fehl (Entwurf behält sonst `pdfBlob`/`pdfGeneratedAt`). Der Verlauf zeigt «PDF erstellt» nur mit `pdfGeneratedAt` (MetadataCard.svelte:49f., DOM-Test ohne den Wert vorhanden). Verwerfen bei jedem Fehler, auch einem vorübergehenden, schadet nicht: Das gespeicherte PDF eines Entwurfs wird nie so ausgeliefert. `getStatementPdf` erstellt Entwürfe immer neu, der Mieter-Export lässt Entwürfe weg (tenant-export.service.ts:97), die E-Mail hängt `made.pdf` an. `sendByLetter` liest das gespeicherte PDF erst nach `changeStatementStatus('sent')` (dann nicht mehr Entwurf, also kein Verwerfen). Die Ablehnung bricht den Versand wie bisher ab. Weitere Prüfungen: kein fremder Diff. «No scenario» ist im Plan begründet, wie es die Anforderung zulässt. Keine neuen Texte oder Verträge. ponytail-review ohne Befund.

## Nicht bestätigt

- Die Testläufe (backend type-check, lint, statement-pdf.pg.test.ts 59, statement.routes / statement-mail / reminders / error-codes 94) sind «vom Aufrufer gemeldet», nicht erneut ausgeführt.
- IBAN_INVALID (qr-bill.service.ts:350) läuft durch denselben `catch` wie CREDITOR_ADDRESS_MISSING. Durch Lesen bestätigt, ohne eigenen Test.
