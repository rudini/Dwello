# Code-Review #609, Runde 1 (6ac7a7c..37717ca)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Alle vier geänderten Dateien sind gelesen. `+page.svelte:225` gibt einem Entwurf kein `pdfGeneratedAt` an die MetadataCard. Der Wert, den `generatePdf()` lokal setzt (Z. 110), erscheint bei einem Entwurf darum auch ohne Neuladen nicht im Verlauf. `PdfAction generated={!!pdfGeneratedAt}` (Z. 154) bleibt unverändert, und die Sprachangabe hängt nicht an `pdfGeneratedAt`. Beim Versand setzt `statement.service.ts:764` `pdfGeneratedAt` auf null, und `statement-pdf.service.ts:325` setzt es beim PDF wie versendet neu. Eine versendete Abrechnung nennt «PDF erstellt» also wieder mit dem neuen Datum, und der DOM-Test deckt das ab. Der DOM-Test wäre auf dem Basis-Commit rot, weil `statement()` standardmässig `status: 'draft'` hat. Das Szenario wäre ebenfalls rot: Das PDF ist gespeichert, und die Seite wird neu geöffnet. Die negative Prüfung hat mit «Erstellt am heutigen Tag» einen positiven Anker, und `history` ist auf den Verlauf begrenzt. Der Step ruft nur eine Question auf. Es gibt keine neuen Texte und keinen neuen Bildschirmzustand, das Szenario hat kein `@wip`, und der Diff enthält nichts, was nicht zum Issue gehört. Ponytail: einzeilige Änderung, nichts ungenutzt.

## Nicht bestätigt

- lint, check, die DOM-Tests in `statement-pages.dom.test.ts` (184) und das Szenario in chromium und api sind «vom Aufrufer gemeldet». Ich wollte den DOM-Test erneut laufen lassen, aber eine Deny-Regel hat den Zugriff auf `node_modules` blockiert.
- Ausserhalb der gewählten Lösung (dem ersten Weg aus «Done means»): Ein Entwurf bietet weiterhin «PDF herunterladen» an. Das gilt auf der Detailseite (`PdfAction`, Z. 154) und in der Liste (`StatementRow.svelte:75`), solange ein gespeichertes PDF besteht. Das Issue nennt das als zweites Symptom, verlangt die Änderung in «Done means» aber nicht. Es ist kein Befund dieses Diffs.
