# Code-Review W4b (Runde 1): Zahlung einer Abrechnung (#138, #93, #92)

Geprüft: `git diff 86c8233 7e13aaa` im Worktree `review-w4b-code` (detached auf 7e13aaa), alle 52 geänderten Dateien gelesen, dazu `statement.service.ts` (updateStatementStatus, getStatement, updateStatement), `coded-error.ts`, `FormDialog.svelte`, `DateInput.svelte`, `statements/+page.svelte`, `fixtures/screens.ts`, `tests/e2e/CLAUDE.md`, `ponytail-review`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/statement.service.ts:489, src/lib/statement.ts:42-44 | Prüfung «echter Kalendertag» wirft bei Monat 13, Tag 32, Monat 00 einen `RangeError`: Backend antwortet 400 ohne `PAID_DATE_INVALID`, BFF (`markPaid`-Action, `/mark-paid`) antwortet 500. Vorhandene Helfer `isRealDate` (backend/src/services/real-date.ts) bzw. `isDay` (src/lib/contract-status.ts:71) nicht wiederverwendet |
| C-2 | Major | tests/e2e/features/statement-detail.feature:100-131, implementation_plan.md:15 | Fehlerzustand «Zahlung zurücksetzen scheitert» (Meldung `statements_reset_payment_failed` / `backend_statement_not_paid`) hat weder Szenario noch `No scenario: <Grund>`, obwohl der Browser die Form-Action `?/resetPayment` sendet und `FailRequests` ihn erreicht |
| C-3 | Minor | tests/e2e/steps/statement-detail.steps.ts:135, :262 | Schritt `nennt der Verlauf {string} am {string}` wird von keinem Feature mehr benutzt (übrig gelassen); der neue Schritt `… am Tag des Versands` kopiert seinen Regex-Aufbau |
| C-4 | Minor | messages/it.json:394, :904; messages/fr.json:394, :904 | «Inserisca al più presto questa data» / «Saisissez au plus tôt cette date» liest sich als «so bald wie möglich»; klarer: «Inserisca questa data o una successiva» / «Saisissez cette date ou une date ultérieure» (Wortlaut V-3 ist in #291, dort mitnehmen) |
| C-5 | Minor | tests/e2e/features/statement-detail.feature:75-81 | «Zahlungseingang mit Datum festhalten» gibt jetzt den heutigen Tag ein und unterscheidet damit nicht mehr «eingegebener Tag» von «Tag des Erfassens» (Strenge geringer als vorher). Unterhalb abgedeckt (DOM-Test Liste mit 20.01.25, `statement-actions.test.ts` «Zahlungsdatum»); im Szenario-Kommentar oder Plan erwähnen |
| C-6 | Minor | implementation_plan.md:13, :15 | Plan nennt `error-codes.pg.test` (die Tests stehen in `statement-lock.pg.test.ts`) und «new table» (es ist die JSONB-Spalte `payment_resets`); `No scenario` für die Anzeige einer Backend-Ablehnung des Zahlungsdatums, die die BFF-Prüfung nicht abfängt (abgedeckt mit Contract in `statement-actions.test.ts`), fehlt |
| C-7 | Nit | src/lib/server/statement.ts:73-76, src/lib/types.ts:301 | ponytail `delete:` `paidAmount` der Zurücksetzungen wird gemappt und typisiert, aber nirgends gezeigt. `paymentResets: data.paymentResets ?? []`, Typ ohne `paidAmount`; net: -3 Zeilen |
| C-8 | Nit | backend/src/routes/statements.ts:267 | Jeder unerwartete Fehler (DB) beim Zurücksetzen wird 400 statt 500 |
| C-9 | Nit | backend/src/__tests__/statement-lock.pg.test.ts:143-145 | doppelte Leerzeile; `today()` doppelt zur lokalen Konstante in Z. 102 |
| C-10 | Nit | tests/e2e/features/statement-detail.feature:89 | neuer Schritt «meldet das Feld «Bezahlt am»» nennt ein UI-Element («Feld»); folgt dem bestehenden Schritt, daher nur Nit |

Ponytail-Review: C-1 (`reuse:` real-date.ts / contract-status.ts `isDay` statt eigener Regex+ISO-Prüfung zweimal, ein dritter Helfer `isDate` steht in src/routes/statements/+page.server.ts), C-3 (`delete:` ungenutzter Schritt), C-7 (`delete:`). net: etwa -10 Zeilen möglich.

## C-1 (Major): ungültiger Monat oder Tag ergibt keinen Code bzw. einen 500

Die Anforderung (#138): das Zahlungsdatum muss ein echter Kalendertag sein, sonst lehnt das Backend mit `PAID_DATE_INVALID` ab; das BFF prüft dasselbe vorher.

Beide neuen Prüfungen rufen `new Date(`${paidDate}T00:00:00Z`).toISOString()` ohne vorherigen `isNaN`-Test auf:

```ts
const real = /^\d{4}-\d{2}-\d{2}$/.test(paidDate) && new Date(`${paidDate}T00:00:00Z`).toISOString().startsWith(paidDate);
```

Für `2025-02-30` geht das gut (der Tag rollt auf den 2. März über), für `2025-13-01`, `2025-01-32`, `2025-00-10` wirft `toISOString()` in Bun und Node `RangeError` (geprüft: `bun -e` / `node -e`, «Invalid Date» / «Invalid time value»).

- Backend: der `RangeError` landet im `catch` der Route `PUT /:id/status` → 400 `{ error: "Invalid Date" }` ohne `code`; die UI zeigt dann den allgemeinen Satz statt `backend_paid_date_invalid`.
- BFF: `paidDateError('2025-13-01', …)` wirft in `markStatementPaid` vor dem Backend-Aufruf → die Form-Action `?/markPaid` und `POST /statements/[id]/mark-paid` antworten 500.

Die UI selbst schickt solche Werte nicht (`parseSwissDate` liefert dann `''`), wohl aber ein veralteter oder handgemachter Request; die Anforderung verlangt die codierte Ablehnung für jeden unechten Tag.

Nachweis: `expect(paidDateError('2025-13-01', '2025-01-15')).toBe('Bitte geben Sie das Zahlungsdatum als TT.MM.JJJJ ein.')` in `statement-status.test.ts` scheitert mit `RangeError`; in `statement-lock.pg.test.ts` `expectRejection(await markPaid(statementId, '2025-13-01'), 400, 'Invalid payment date', 'PAID_DATE_INVALID', { date: '2025-13-01' })` scheitert am fehlenden Code.

Behebung: Backend `isRealDate` aus `backend/src/services/real-date.ts` verwenden (prüft Monat/Tag per Regex); Frontend `isDay` aus `src/lib/contract-status.ts` exportieren und verwenden. Am Rand: ein leerer `paidDate: ''` überspringt im Backend die Prüfung (`additionalData?.paidDate` falsy) und endet als PostgreSQL-Fehler ohne Code; mit `paidDate !== undefined` statt Truthiness ebenfalls erledigt.

## C-2 (Major): Fehlerzustand des Zurücksetzens ohne Szenario

`CLAUDE.md`, Workflow 1, und `tests/e2e/CLAUDE.md`, «Rules», Failure states: ein Zustand, den nur ein scheiternder Request erreicht, bekommt ein Szenario, oder, wenn der E2E-Stack ihn nicht erzeugen kann, einen Test darunter und `No scenario: <Grund>`. Das Zurücksetzen ist eine Form-Action, die der Browser sendet (`?/resetPayment`); `FailRequests.to('/statements/<id>', { '/resetPayment': '' })` erreicht den Zustand (wie `uploadsFail` in `tasks/tenant-documents.ts`). Die neue Meldung `statements_reset_payment_failed` ist nur im Unit-Test `statement-actions.test.ts` («meldet einen Fehler mit dem nächsten Schritt») abgedeckt; im Plan steht kein `No scenario` dafür.

Nachweis: `grep -n "FailRequests\|zurückgesetzt werden" tests/e2e/features/statement-detail.feature tests/e2e/tasks/statement-detail.ts` findet nichts.

Behebung: Szenario «Zahlung zurücksetzen scheitert» (Meldung mit nächstem Schritt sichtbar, Status bleibt «Bezahlt»), oder eine begründete `No scenario`-Zeile, falls die Triage den Zustand als bereits durch `action-error` abgedeckt ansieht.

## Bestätigt (Anforderung → Code und Test)

- #138 Backend: Codes `PAID_DATE_INVALID {date}`, `PAID_DATE_BEFORE_STATEMENT {date: Abrechnungsdatum}`, `PAID_DATE_IN_FUTURE {date: heute}` (statement.service.ts:487-494), Route mit `errorBody` (statements.ts:225); pg-Tests statement-lock.pg.test.ts:149-162 (ausser C-1). Meldungen `backend_*` in allen vier Sprachen; Codes in docs/api-specification.md:26, :408.
- #138 BFF: `paidDateError(paidDate, statementDate)` mit Grenze; Grenze kommt vom Dialog (`fields`, `+page.svelte:208`) bzw. als JSON aus der Liste; Backend-Ablehnung über `backendMessage` (`refusalOf`, statement-actions.ts:35-38), `date`-Param formatiert (backend-error.ts:27). Unit-Tests für 2025-02-30, Tag davor, Grenze selbst (statement-status.test.ts); Contract `statement-paid-date-refused.json` gegen echte API geprüft (api-contracts.pg.test.ts:46).
- #138 Szenarien: «Kein Zahlungseingang vor dem Abrechnungsdatum» neu, «Zahlungseingang mit Datum festhalten» mit dem Tag des Versands, beide ohne `@wip`. Gespeicherte frühere Daten bleiben: keine Migration oder Prüfung beim Lesen.
- #93: `paidAmount ??= existing.balance` auch für den Saldo-0-Fall beim Versenden (statement.service.ts:479-480); `paidThisMonth` nur Nachzahlungen (`owed('paid')`, dashboard.ts:131); dashboard.pg.test zahlt über den Service inkl. Rückerstattung -60 (rot ohne Änderung: Summe 0 bzw. 170); demo-data.pg.test angepasst; Contracts `statement.json` ergänzt. `No scenario` im Plan.
- #92: Knopf nur bei `paid` (StatusActions.svelte:34), Bestätigung mit Status, der dann gilt, und Zahlungsdatum (ResetPaymentDialog.svelte, gleiche Regel wie getStatement: Frist < heute → Überfällig); Backend `resetPayment` mit 404/400-Codes, Datum und Betrag geleert, PDF verworfen (V-1), Zurücksetzung in `payment_resets` (Migration 0007, schema.ts, data-model.md); Verlauf je Zurücksetzung mit Index-Schlüssel (V-11). Tests: pg (statement-lock.pg.test.ts:165-197), DOM (statement-pages.dom.test.ts:825-872), Mapping, Contract `statement-payment-reset.json`, drei Szenarien inkl. erneutes Bezahlen (V-7) und Überfällig.
- a11y/Sprachen: `statement-paid-detail` mit `default` und `reset-payment-dialog` in screens.json (mit `stateMeanings`), accessibility.feature, sprachen-bildschirme.feature.
- Screenplay: Schritte rufen nur Tasks/Questions; `resetConfirmation` liefert den Text; Tasks folgen dem Muster von `markStatementPaidOn`. Tokens/Komponenten: nur `Button`, `FormDialog`, bestehende Klassen. XSRF: Form-Action wie die bestehenden. Rotlauf der neuen Tests per Lesen: jeder scheitert ohne die Änderung (fehlende Codes, fehlender Knopf/Dialog, generischer Text, `paidAmount` null, Svelte-Duplicate-Key ohne V-11).

## Nicht bestätigt

- Selbst wiederholt: `bunx vitest run` für statement-status, statement-actions, statement-endpoints, statement-mapping, statement-pages.dom, statements-i18n (134 grün). Alles andere vom Aufrufer gemeldet: `bun run lint`, `bun run check`, Backend type-check, `cd backend && bun run test` (694, 94 %), gesamter `bunx vitest run`, E2E chromium+api statement-detail/statements/dashboard (76), axe- und Sprachzeilen statement-sent-detail und statement-paid-detail (12).
- E2E lief laut Aufrufer vor dem Herauslösen von `ResetPaymentDialog.svelte`; danach nicht erneut. Der DOM-Test deckt den Dialog ab, die Szenarien «Zahlung zurücksetzen …» und die Zeile `reset-payment-dialog` sind nach dem Umbau nicht bestätigt.
- `tests/e2e/fixtures/screens.ts:69-70` ändert den gemeinsamen Seed aller Bildschirme (Anna 2024 jetzt versendet und bezahlt). Nur zwei Bildschirmzeilen wurden laufen gelassen; ob Liste, Mieter-, Vertrags-, Dashboard- und Wizard-Zeilen (Statusfilter, «2024 all billed») unverändert grün sind, habe ich nicht geprüft.
- Kein Backend-pg-Test selbst ausgeführt (würde `dwello_test` neu anlegen); die Bun-Ergebnisse zu C-1 stammen aus `bun -e` mit derselben Ausdrucksform.
- Fachlicher Inhalt von `docs/reviews/w4b-fachreview-1.md` nur auf die genannten Punkte (V-1, V-3, V-4, V-7, V-8, V-11) gegen den Code abgeglichen, V-6 «teilweise» nicht.
