# Code-Review #966, Runde 1 (origin/main..c6be714)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/routes/statements/[id]/edit/+page.server.ts:34–39 | Der neue Zweig (Code `STATEMENT_DEADLINE_BEFORE_SENT` → Fehler am Feld `paymentDeadline` statt `form`) hat keinen Test auf der untersten Schicht. `src/__tests__/statement-edit-actions.test.ts` testet die Action schon, und `runAction(..., 400, fields, { code, params })` kann die Ablehnung mit Body liefern. Abgedeckt ist er nur durch das E2E-Szenario. |
| C-2 | Minor | docs/api-specification.md:299, docs/data-model.md:361–362 | Die Doku ist jetzt falsch. `PUT /:id` nennt unter den 400ern `STATEMENT_DEADLINE_BEFORE_SENT {date}` nicht, und das Datenmodell sagt, dass `payment_deadline` nach dem Versand ohne Einschränkung «editable» bleibt. |
| C-3 | Minor | backend/src/__tests__/statement-mail.pg.test.ts:330 | Der Rückerstattungs-Test war laut Aufrufer nicht rot, weil die Basis das Verhalten schon zeigt. Weder c6be714 (fügt ihn hinzu) noch fd61a3a nennen ihn in der Commit-Message als Test, der bestehendes Verhalten festhält (CLAUDE.md, Workflow 2). Die Basis zeigt das Verhalten tatsächlich (dort keine Sperre), und es ist kein Bugfix. Es fehlt also nur der Vermerk, nachzuholen im PR-Text. |

Keine Blocker und keine Major.

Zur Frage nach dem Bildschirmzustand: Es braucht keinen neuen Zustand. Die Feldmeldung nutzt dasselbe Feld mit derselben Fehleranzeige (`aria-invalid` und Problemtext) wie der bestehende Zustand `statement-edit`/`submit-cleared` (tests/a11y/screens.json:800–805, accessibility.feature:241, sprachen-bildschirme.feature:242). Es ist dieselbe Variante ohne eigene Bedienelemente, nur mit anderem Text. Den Text decken die vier `messages/*.json` und `backend-codes.test.ts` ab.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun run fitness`, `bunx vitest run --changed origin/main` (494) und `src/__tests__/backend-codes.test.ts`, die pg-Tests statement*/document*/reminder*/api-contracts (436), E2E chromium statement-edit.feature + statement-redeliver.feature (9), den Rot-Lauf der neuen Tests und des @wip-Szenarios sowie den Commit-Hook (fallow).
- Ob «die Abrechnung versendet» im Szenario per E-Mail oder per Brief versendet, habe ich nicht nachgelesen (tests/e2e/steps/statement-detail.steps.ts:178). Beide Wege speichern jetzt `paymentDeadline`.
- Altdaten: Ist eine E-Mail von vor #966 ohne `paymentDeadline` das jüngste versendete Dokument, liefert `toldDeadline` null und lässt jede Frist zu. Das ist so gewollt (Fachreview «Nicht bestätigt», #969). Gegen echte Daten habe ich das nicht geprüft.
- Eine versendete E-Mail mit `deliveryError` (Mieter hat sie nicht erhalten), die noch nicht erneut zugestellt ist, zählt in `toldDeadline` als mitgeteilt (backend/src/services/delivery.ts:36–43). Das liegt ausserhalb von #966, und ich habe nicht geprüft, ob ein Issue das abdeckt.

Geprüft: `toldDeadline` (Typen statement/new_pdf, nur `sent`, jüngstes nach `sentAt`) und `refuseEarlierDeadline` (Saldo > 0, gleicher Tag erlaubt, Vergleich der Strings YYYY-MM-DD bei `format: 'date'`); die internen Aufrufe von `updateStatement` (erster Versand ohne Dokument, `datedToday` verkürzt nie, `resetPayment` ohne Frist, Demo-Daten); die E-Mail-Ablage über `sent?.paymentDeadline`; den BFF über `backendMessage` mit Datumsformat; die vier Meldungen im Wortlaut der Fachreview (fr U+00A0/U+2019); die pg-Tests (rot ohne die Änderung, ausser C-3); die Screenplay-Schichten und die Formulierung von Szenario und Step; ponytail-review ohne Befund.
