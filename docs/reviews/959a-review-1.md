# Code-Review 959a (Backend), Runde 1

Bereich: `git diff 9bebf57 6a83a40` im Worktree `/tmp/claude/review-959a-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/statement.service.ts:806-809 | `paidAmount` wird nicht geprüft (anders als `paidOn`, Zeile 922): «432.899» bei offenem Betrag 442.90 wird zu einer Teilzahlung mit `paidAmount` 442.90, die Abrechnung bleibt «Versendet» mit offenem Betrag 0.00 und lässt sich nicht mehr bezahlen; «abc» oder «1'000.00» geben `STATEMENT_PAID_AMOUNT_ZERO` statt `STATEMENT_PAID_AMOUNT_INVALID` |
| C-2 | Major | backend/src/services/statement.service.ts:835 | `payment-reset` nimmt jetzt auch eine ersetzte Abrechnung mit festgehaltener Zahlung an und setzt sie auf `sent` zurück (vorher `STATEMENT_NOT_PAID`) |
| C-3 | Major | tests/e2e/features (fehlt) | Für das, was der Benutzer in diesem Slice sieht (Mahnung nennt den Rest, Übersicht summiert den offenen Betrag, «Zahlung zurücksetzen» nimmt eine Teilzahlung zurück), gibt es weder ein Szenario noch ein `No scenario: <Grund>`; das `@wip`-Szenario aus 9bebf57 prüft nur Status und Rest auf der Detailseite |
| C-4 | Minor | backend/src/services/statement.service.ts:852 | Das Protokoll schreibt bei einer zurückgesetzten Teilzahlung `paidDate: existing.paidDate` (null, also «Zahlung … zurückgesetzt» ohne Datum); nach mehreren Teilen steht dort der späteste Tag statt des Tages der zurückgesetzten Zahlung; `reset.paidDate` wäre richtig |
| C-5 | Minor | backend/src/__tests__/statement-lock.pg.test.ts:211-251 | Nicht getestet: eine Teilzahlung einer Rückerstattung (Vorzeichen-Regel, `-5.00` wird nur bei einer Nachzahlung geprüft), «Bezahlt am» = späteste Zahlung (beide Zahlungen sind von heute, `.sort().at(-1)` ist also nicht abgedeckt), «Als bezahlt markieren» ohne Betrag nach einer Teilzahlung (zahlt den Rest) |
| C-6 | Minor | docs/api-specification.md:29, 274, 306 | Nicht nachgeführt: die neuen Codes `STATEMENT_PAID_AMOUNT_TOO_HIGH {rest}` und `STATEMENT_PAID_AMOUNT_ZERO`, die Teilzahlung bei `PUT /:id/status`, das Feld `payments`; Zeile 306 sagt weiter «`paidAmount` … cleared», was jetzt falsch ist. Auch `docs/data-model.md:321` (`paid_amount`) nennt die Summe der Teilzahlungen auf einer versendeten Abrechnung nicht |

## C-1: Der Betrag wird nicht geprüft

`recordPayment` macht nur `Number(data.paidAmount)`. Die Route (`backend/src/routes/statements.ts:400`) nimmt jeden String an (`t.String()`).
- Bei «432.899» ist `amount !== rest`, also wird der Betrag als Teilzahlung festgehalten. `roundToRappen(before + amount)` ergibt aber 442.90 = Saldo, die Abrechnung bleibt `sent` mit `paidDate` null. Danach ist `rest` = 0, und jede weitere Zahlung wird mit `STATEMENT_PAID_AMOUNT_ZERO` abgewiesen. Die Mahnung fordert «Offener Betrag: CHF 0.00», und der Zahlteil lautet auf 0.00 (`reminder.service.ts:112`). Ausserdem weicht `payments[].amount` (`toFixed(2)` von 10.005 ergibt «10.00») von der Summe in `paidAmount` (`roundToRappen`, «10.01») ab.
- Bei «abc», «» oder «1'000.00» ist `Number(...)` NaN oder 0, und die Antwort heisst «Geben Sie einen Betrag über CHF 0.00 ein.». Der Benutzer erfährt also nicht, dass er den Betrag falsch eingegeben hat. Code und Text für genau diesen Fall gibt es schon: `STATEMENT_PAID_AMOUNT_INVALID {amount}`.
- Zeigen: in «Teilzahlung» `pay('432.899')` muss 400 `STATEMENT_PAID_AMOUNT_INVALID` liefern; heute kommt 200 mit `status: 'sent', paidAmount: '442.90'`.
- ponytail `reuse:` die Regex aus `paidOn` (statement.service.ts:922), mit erlaubtem Minus für die Rückerstattung.

## C-2: Zurücksetzen einer ersetzten Abrechnung

Vorher galt `if (existing.status !== 'paid') throw STATEMENT_NOT_PAID`. Jetzt reicht `existing.payments.at(-1)`, ganz gleich welcher Status. Eine Abrechnung, auf die eine Teilzahlung oder eine volle Zahlung festgehalten und die dann ersetzt wurde (`replaceStatement` lässt `payments` stehen), hat den Status `replaced` und eine Zahlung in der Liste. `resetPayment` setzt sie auf `status: 'sent'`. So gibt es zwei geltende Abrechnungen für die Periode, und die Berichtigte Abrechnung rechnet die Zahlung als `priorPayments` weiter an.
- Zeigen: Teilzahlung 10.00 festhalten, `POST /:id/replace`, dann `POST /:id/payment-reset`. Erwartet ist 400 `STATEMENT_NOT_PAID`, heute kommt 200 mit `status: 'sent'`.
- Abhilfe: eine Teilzahlung nur bei `sent`/`overdue` zurücksetzen.

## C-3: Kein Szenario für die sichtbaren Folgen des Slice

`CLAUDE.md`, Workflow 1: Jede Änderung des Verhaltens beginnt mit einem Szenario. Mahnbrief und Zahlteil, die Beträge der Übersicht und «Zahlung zurücksetzen» nach einer Teilzahlung ändern sich für den Liegenschaftsverwalter. Im Bereich (auch in 9bebf57) prüft das kein Szenario. Abhilfe: mindestens `@wip`-Szenarien, zum Beispiel «Die Mahnung nach einer Teilzahlung verlangt den offenen Betrag» und «Die Übersicht zählt nach einer Teilzahlung nur den offenen Betrag». Wo der E2E-Stack einen Zustand nicht erzeugen kann: `No scenario: <Grund>`.

## Nicht bestätigt

- `docs/reviews/959-fachreview-1.md` gibt es im Worktree nicht (auch nicht in `git log --all`). Die Regeln 1–7 und die dort vorgegebenen Texte in vier Sprachen habe ich nur gegen den Entscheid in #959 geprüft. Offen ist damit, ob der Wortlaut von `backend_statement_paid_amount_too_high`/`_zero` und der Mahnbrief-Zeilen dem Bericht entspricht. Aufgefallen ist dabei: «Offener Betrag» heisst im Brief «Montant dû» / «Importo dovuto» / «Amount outstanding», im Fehlertext dagegen «montant ouvert» / «importo aperto» / «open amount» (messages/*.json:462 gegenüber reminder-letter.ts). Das Glossar (`UBIQUITOUS_LANGUAGE.md`) hat noch keine Zeile «Offener Betrag».
- «Eine Teilzahlung ändert weder Überfällig noch Mahnstufe noch die nächste Mahnung»: Im Code bleiben die Felder der Mahnung unberührt, und «Überfällig» wird aus `sent` berechnet (statement.service.ts:322-327). Einen Test, der eine Teilzahlung auf einer gemahnten Abrechnung prüft, gibt es nicht.
- Die Berichtigung einer versendeten Abrechnung mit Teilzahlungen: Das heutige `Correction.svelte:57` schickt `paidAmount` «0.00» und überschreibt die Summe der Teilzahlungen. Das Vorbelegen ist laut Aufrufer im nächsten Slice; dort prüfen.
- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun test` von statement-lock, statement-correction, statement-carry-over, reminders, statement-reminder-due, dashboard, api-contracts, audit-log, statement-mail, tenant-anonymise, statement-recalculation (pg) und reminder-letter; `cd backend && bun run type-check`; `bunx vitest run src/__tests__/backend-codes.test.ts`; dass die neuen Tests rot gesehen wurden.
- Gelesen ist jede Datei im Diff. Beim Lesen schlagen die neuen Tests ohne die Änderung fehl: Teilzahlung, Grenzen, Summe, Zurücksetzen, Übersicht, Brief, Zahlteil.

Geprüft: Migration 0041 und Schema, Summen der Übersicht (`owed` nur Nachzahlungen), Betrag des QR-Zahlteils (`addPaymentPart` nimmt `balance`), der Weg ohne Mindestbetrag (#94) unverändert, neue Codes in allen vier `messages/*.json`, keine Verträge in `tests/contracts` nötig (das Frontend liest `payments` noch nicht), ponytail: ausser der Wiederverwendung in C-1 nichts zu kürzen.
