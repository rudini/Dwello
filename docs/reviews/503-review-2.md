# Code-Review #503, Runde 2 (Abschluss, 889d06b..HEAD)

Vorheriger Bericht: docs/reviews/503-review-1.md

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/statement-pdf.pg.test.ts:1006 | Geschlossen. Der neue pg-Test setzt die Abrechnung auf `sent`, erstellt ein PDF, entfernt `company_city` und erwartet nach `POST /generate-pdf` den Status 400 sowie `pdfBlob` und `pdfGeneratedAt` unverändert gesetzt. Ohne `found.status === 'draft'` (statement-pdf.service.ts:298) würde `discard()` im `catch` beide Felder leeren, und der Test fiele. Die Commit-Nachricht von 8987c77 gibt an, dass der Test ein bestehendes Verhalten festhält. Das ist zulässig: 9e19d11 hat das PDF nie verworfen, und es handelt sich um keine Fehlerbehebung. |

Keine neuen Befunde im Delta. Keine Blocker, keine Major.

Geprüft: Der Code-Delta besteht nur aus diesem Test. Das Aufräumen setzt den Status vor `deleteStatement` zurück auf `draft`, wie es die bestehenden Tests ebenfalls tun. Im Delta gibt es keinen Diff ohne Bezug zur Anforderung. Persona-Befund P-1 hat der Product Owner entschieden, er ist jetzt Issue #609. Er gehört nicht zu dieser Prüfung.

## Nicht bestätigt

- Backend-Type-Check, Lint und statement-pdf.pg.test.ts (59) auf HEAD sind «vom Aufrufer gemeldet» und wurden nicht erneut ausgeführt. Dass der Test ohne die Bedingung für Entwürfe rot wird, ist nur durch Lesen bestätigt (statement-pdf.service.ts:296-316).
