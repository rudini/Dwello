# Code-Review #966, Schlussrunde 1 (c6be714..5d90002)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/api-contracts.pg.test.ts:697–700 | Der `finally`-Block stellt nur `status` und `balance` wieder her und löscht das eingefügte Dokument. Das reicht, solange das Backend ablehnt: `refuseEarlierDeadline` wirft, bevor `updateStatement` schreibt (backend/src/services/statement.service.ts:693). Fällt die Ablehnung aber weg, also genau in dem Fall, für den das `finally` da ist, schreibt der PUT `paymentDeadline: '2025-03-01'` und leert `pdfBlob`/`pdfGeneratedAt`. Das stellt der Block nicht wieder her. Die geteilte Abrechnung bleibt dann für die späteren Tests der Datei verändert (z. B. Versand und Zahlung ab Zeile 916), und der eine rote Test zieht weitere nach sich. Abhilfe: `paymentDeadline: before.paymentDeadline` (und die PDF-Felder wie in Zeile 727) mit zurücksetzen. |

Keine Blocker und keine Major.

Geschlossen (aus docs/reviews/966-review-1.md): C-1 (BFF-Test für den Zweig am Feld `paymentDeadline`; ohne den Zweig landet die Meldung unter `form`, und der Test wird rot), C-2 (api-specification.md:299 und data-model.md:362 nennen die Ablehnung jetzt).

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `cd backend && bun test src/__tests__/api-contracts.pg.test.ts` (98 pass), `bunx vitest run src/__tests__/statement-edit-actions.test.ts` (5 pass), den Rot-Lauf des BFF-Tests ohne den Zweig.
- Ob `backendMessage` das Datum im Test als «31.03.2025» formatiert, habe ich nur über den gemeldeten grünen Lauf und den Platzhalter `{date}` in messages/de.json:568 nachvollzogen. Die Formatierung selbst habe ich nicht gelesen.

Geprüft: der Vertrag passt zum `CodedError` (statement.service.ts:718) und zum Body von `runAction` (helpers/action.ts:11–20); im Erfolgsfall ändert der Vertragstest nur, was er wiederherstellt; die Doku stimmt mit `refuseEarlierDeadline` und `toldDeadline` überein; ponytail-review ohne Befund; es gibt keine Änderung ausserhalb der Anforderung.
