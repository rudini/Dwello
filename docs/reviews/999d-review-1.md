# Code-Review 999d, Runde 1 (a627d01~1..a627d01)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/statement.service.ts:874, 880 | Mit `paymentRecordedAt = 1970` verwirft das zweite Zurücksetzen über `dropNewPdfSince` auch ein neues PDF «Zu versenden», das **vor** der Teilzahlung ohne Zeit erstellt wurde. Dieses nennt die Zahlung nicht und zeigt genau den Stand nach dem Zurücksetzen; mit ihm verschwindet die noch offene Versendung einer Änderung (z. B. neue Zahlungsfrist, #968), und `keepNewPdf` legt es nicht neu an. Es tritt nur bei Daten aus der Zeit vor #999 auf, und die Anforderung verlangt ausdrücklich, auch das offene PDF vorsorglich zu verwerfen. Deshalb kein Merge-Hindernis; besser wäre ein Hinweis im PR-Text oder ein Issue. |

Zur Frage, ob es schadet, auch PDFs vor der ersten Zahlung zu verwerfen (das PDF der Versendung): Beim gespeicherten PDF schadet es nicht. `updateStatement` ruft bei `pdfBlob: null` `keepPdfBeforeChange` auf (statement.service.ts:704). Ohne Dokument der Versendung bleibt die einzige Kopie also als «PDF vor der Änderung» erhalten (delivery.ts:20–50). Mit einem solchen Dokument liegt das versendete PDF bereits dort. `generateStatementPdf` erstellt das gespeicherte PDF auf Anfrage neu. `paymentRecordedAt` liest nur `resetPayment` (eine Suche über src, backend/src und tests ergibt keine weitere Stelle). Der Wert 1970 erscheint deshalb nirgends sichtbar. Schaden entsteht nur beim offenen neuen PDF (C-1).

Geprüft: Ohne die Änderung schlägt der neue pg-Test fehl: Der alte Code übernimmt die Zeit der Zahlung über 20.00, und das PDF davor bleibt. Mit der Änderung wird es verworfen. Die Zeile in docs/data-model.md stimmt mit dem Code überein. Der Diff enthält nichts, was mit der Anforderung nichts zu tun hat. ponytail-review ergibt keinen Befund.

## Nicht bestätigt

- backend statement-lock.pg 28 bestanden, neuer Test vorher rot, type-check, eslint und prettier auf den geänderten Dateien: vom Aufrufer gemeldet.
- Das Verwerfen des offenen neuen PDFs bei einer Teilzahlung ohne Zeit deckt kein Test ab. Der neue Test prüft nur `pdfBlob`. `dropNewPdfSince` erhält zwar denselben Wert, doch C-1 zeigt kein Test.
- Szenario oder `No scenario: <Grund>` für diesen Fix: Commit a627d01 nennt keines. Ob der PR-Text #1049 es nennt, habe ich nicht geprüft; im Worktree sind nur Code und Commit-Text sichtbar. Daten ohne `recordedAt` kann der E2E-Stack voraussichtlich nicht herstellen.
