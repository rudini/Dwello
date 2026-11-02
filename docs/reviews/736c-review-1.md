# Review 736c, Runde 1 (Delta `73f17b8f1^..73f17b8f1`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde |

Geprüft: Der Vertrag `tests/contracts/reminder-undelivered.json` hat genau die Felder von `documents` (`backend/src/db/schema.ts:594-615`) ohne `content` und dazu `notToSend`, `tenantName`, `statementNumber` und `deliveryErrorCode` aus `DocumentSummary` (`backend/src/api/document.ts`). Auf oberster Ebene stehen `{document, deliveryError}`, wie `Reminder` in `src/lib/server/statement-actions.ts:150` sie liest. Der neue pg-Test vergleicht die Schlüssel der obersten Ebene (der vom Helfer `remind` angefügte `status` ist entfernt) und für `document` Schlüssel und JSON-Typ jedes Felds. Er scheitert also, wenn ein Feld entfernt, hinzugefügt oder umtypisiert wird. Ein Feld, das im Vertrag `null` ist (`sentAt`, `notToSend`), muss auch in der echten Antwort `null` sein. Ohne die Vertragsdatei scheitert der Test. Der DOM-Test prüft weiter Titel, Empfängeradresse, Link zum Mieter (jetzt aus `tenantId` des Vertrags), Link zu «Dokumente» und den UI-Text zum Zustellfehler. Er umgeht `localTitle` des BFF wie zuvor, und das sagt auch sein Kommentar. Im Delta ist nichts ohne Bezug zur Anforderung.

## Nicht bestätigt

- Backend `reminders.pg.test.ts` 49 bestanden, Backend-Type-Check 0, DOM-Test bestanden, Lint 0, svelte-check 0, Prettier sauber: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Ob der echte Wert von `paymentDeadline` (Spalte `date`) und von `createdAt` im JSON als String ankommt: Nur gelesen, nicht ausgeführt. Der Typvergleich im pg-Test würde eine Abweichung zeigen.
- Die Commit-Nachricht sagt nicht ausdrücklich, dass der neue pg-Test schon bestehendes Verhalten festhält. Rot ist er nur, solange die Vertragsdatei fehlt. Gesehen habe ich das nicht.
