# Code-Review #969, Runde 2 (Delta 806fbe4..e9b4f53, Worktree /tmp/claude/review-969-code2)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-5 | Minor | `backend/src/services/statement-send.service.ts:140-145` | Bleibt offen: Für das Zurückrollen der Kopie, wenn das PDF beim erneuten Zustellen nicht entsteht, gibt es keinen Test. |
| C-10 | Minor | `src/__tests__/statement-pages.dom.test.ts:2011` | Der Kommentar `#524 (Fachreview 524-1 V-1, M-1): nach dem Speichern, was nur im neuen PDF steht …` steht jetzt über dem neuen Test «bietet das PDF vor der Änderung auch nach dem erneuten Zustellen an». Schon im Stand von Runde 1 stand er über dem V-6-Test und nicht über dem Test «rät nach einer Änderung, das neue PDF zu senden …», den er beschreibt. Der Kommentar sagt also über den Test darunter etwas Falsches. Es ist derselbe Fehler wie C-8, nur im Test. |

Geschlossen: C-1, C-2, C-3, C-4, C-6, C-7, C-8, C-9

- C-1: `localTitle` nennt `pdf_before_change` mit `documents_pdf_before_change`. Der Key steht in allen vier Sprachen, mit denselben Texten wie `pdfBeforeChangeTitle`. Der Test (französischer Titel gespeichert, deutsche UI erwartet) ist ohne die Zeile rot.
- C-2: Die Reihenfolge ist ohne neuen Fachentscheid in Ordnung. Mit Dokument des Versands bleiben die Zeilen wie im Basis-Commit (`firstPdfAt` aus `delivery`/`pdfGeneratedAt`, kein `afterKept`). V-2 ordnet die Zeilen nur für eine Abrechnung ohne Dokument. Neu sind nur die Links und der Hilfesatz unter der Liste, und der Hilfesatz passt auch hier. Der Hinweis auf der Seite nimmt mit `delivery` weiter `statements_sent_pdf_in_history`. Ohne die Änderung ist der DOM-Test rot (`kept = []`, `byTestId` liefert null).
- C-3: Die Begründung trägt. In `tests/e2e/fixtures/screens.ts:117,148-149` wird zuerst die IBAN gesetzt. Dann wird Bruno 2024 über die Statusroute versendet, und `changeStatementStatus` erstellt das PDF. Danach ändert `paymentDeadline` die Zahlungsfrist, und `updateStatement` ruft `keepPdfBeforeChange` auf, weil es kein Dokument `statement` gibt. So zeigen `statement-reminded-detail` `default` und `pdf-changed` sowie `/documents` `default` die neuen Varianten in a11y und Sprachen.
- C-4: `notInArray(['upload', 'pdf_before_change'])` antwortet über die Route mit 404, wie beim Upload. Der pg-Test prüft, dass `status` null bleibt, und ist ohne die Änderung rot.

## Nicht bestätigt

- Diese Prüfungen hat nur der Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun run fitness` (0 Zyklen), backend pg statement-mail/carry-over/tenant-export/reminders/api-contracts (237 pass), `bunx vitest run --changed origin/main` (965). Ebenso, dass jeder neue Test ohne seinen Code rot war (hier nur durch Lesen beurteilt).
- Die Variante mit mehreren Kopien (`statements_history_pdf_before_change_download_on`, mit Datum) zeigt kein Bildschirm aus `screens.json`, denn der Seed legt für Bruno 2024 nur eine Kopie ab. Ob fr/it/en dort Deutsch zeigen, prüft die Sprachprüfung also nicht. Die vier Texte habe ich in `messages/*.json` nicht erneut gelesen. Es sind dieselben Bedienelemente, deshalb verlangt «Process» keine eigene Zeile.
- Für den Weg «Erneut per Brief zustellen» mit Link im Verlauf gibt es kein E2E-Szenario. Abgedeckt ist er durch den pg-Test (`statement-mail.pg.test.ts`, Ablage) und den DOM-Test (Link). Das Szenario des Issues (`statement-detail.feature:1254-1262`) deckt den Weg über die Änderung ab.

Geprüft: alle Dateien des Deltas (ohne `docs/reviews/969-review-1.md`): `fileNameOf`, verschoben nach `delivery.ts` und importiert; den `#534`-Kommentar wieder über `sinceDelivery`; die Dokumentation in `api-specification.md`, `data-model.md` und den Kommentaren in `schema.ts`; `[pdf!]` im pg-Test (nur der Typ); die Commit-Nachricht zu C-6.
