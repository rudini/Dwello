# Code-Review 534 Abschluss, Runde 2 (09190a7..69d7691)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Minor | backend/src/services/delivery.ts:26-31, backend/src/services/statement.service.ts:359-360 | Weiter offen wie in Runde 1 (vom Aufrufer als Minor stehen gelassen): Kein Backend-Test liest `resent[].createdAt` oder `newPdfMadeAt`. |
| C-5 | Minor | tests/e2e/steps/statement-detail.steps.ts:834 | Der Schritt «nennt der Verlauf zuerst das PDF des Versands, …» prüft nur die Reihenfolge der Zeilen, nicht die Zeit von «PDF erstellt». Mit dem Fehler aus C-1 (Stand 701cd17) zeigt der Verlauf in diesem Szenario «PDF erstellt <Zeit des später erstellten PDF> · Versendet per Brief · Neues PDF erstellt …». Das passt auf `/PDF erstellt.*Versendet per Brief.*Neues PDF erstellt/`, das Szenario bleibt also grün. Dass es das PDF des Versands ist, zeigt nur der DOM-Test (statement-pages.dom.test.ts:1938). Ohne 701cd17 ist das Szenario rot (es gibt dann keine Zeile «PDF erstellt» vor dem Versand), C-2 ist damit erfüllt. |

Geschlossen: C-1, C-2, C-3

## Nicht bestätigt

- Lint, check, die DOM-Tests der Abrechnung (212 bestanden) und E2E chromium `-g "Verlauf das PDF des Versands|neue PDF|neue Bemerkung"` (4 bestanden): vom Aufrufer gemeldet.
- Ob der neue DOM-Test vor dem Fix rot war, habe ich nur durch Lesen geprüft. Mit dem alten `firstPdfAt` und `resent: []` sowie `newPdfMadeAt` gesetzt (also `newPdf` falsch) war `firstPdfAt = pdfGeneratedAt`. Der Verlauf zeigte also «PDF erstellt 31.10.2026, 16:20», und die Regex bei Z. 1948 schlägt fehl.
- Ob `pdfGeneratedAt` und `delivery.sentAt` immer im selben ISO-Format kommen, so dass der Vergleich der Strings stimmt: nicht geprüft. Der Vergleich `pdfGeneratedAt > lastSent` stand schon vorher so da.

Geprüft: das neue `firstPdfAt` für diese Fälle: nicht versendet; PDF vor dem Versand; Versand ohne PDF (`!pdfGeneratedAt`); neues PDF wartet (`newPdfMadeAt`); neues PDF ohne `newPdfMadeAt` (`newPdf`); erneuter Versand desselben PDF (zeigt jetzt die echte Zeit des PDF statt der Zeit des Versands, das ist richtig). Ausserdem die Regex von C-3 und dass Szenario und Schritt den Screenplay-Schichten folgen.
