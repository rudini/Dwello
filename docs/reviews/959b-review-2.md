# Code-Review 959b, Runde 2 (Abschlussrunde vor dem Push)

Gelesen im Worktree `/tmp/claude/review-959c-code`: `git diff 819687e eb6ef7d` (99eebf8, eb6ef7d), alle 20 geänderten Dateien. `git diff eb6ef7d HEAD --name-only` enthält nur Dateien von `main` (CI, Fitness, Architektur-Doku, #997). Keine davon überschneidet sich mit dem Slice.

Geschlossen: C-5, C-8, C-9, C-11

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | Major | src/routes/statements/PaidDateFields.svelte:49; src/lib/statement.ts:75-80; src/__tests__/statement-pages.dom.test.ts:1783-1790 | Weiter offen. Die Korrektur prüft `statement.waived`. Dieses Feld der Antwort meint aber etwas anderes: «nach #94 mit 0.00 bezahlt» (`backend/src/services/statement-payment.ts:26-32`, `waived: paidNothing && balance >= 0`, `paidNothing` setzt `status === 'paid'` voraus). Eine versendete oder überfällige Abrechnung unter CHF 5 bekommt deshalb immer `waived: false`. Bei ihr zeigt der Dialog das Feld weiter und sendet den Saldo als `paidAmount`. Der DOM-Test verwendet `{ status: 'sent', waived: true }`, eine Kombination, die das Backend nie liefert |
| C-10 | Minor | src/routes/statements/+page.svelte (Knopf «Teilzahlung festhalten» in der Liste); src/lib/statement.ts (`partPaid`, Zweig `statements_part_refunded`); src/lib/server/statement-actions.ts:30-34 | Teilweise geschlossen. Neu getestet sind das Weiterreichen von `paidAmount` und die Ablehnung eines leeren Felds (`statement-actions.test.ts:97-108`). Weiter ohne Test: der Knopf «Teilzahlung festhalten» in der Liste, der Zweig Rückerstattung von `partPaid`, die Ablehnung eines ungültigen Betrags (nicht leer) im BFF |
| C-12 | Major | src/routes/statements/[id]/ReminderModal.svelte:49-50; src/routes/statements/+page.svelte:109-115; src/routes/statements/[id]/+page.svelte:112-116; tests/e2e/features/*.feature | Zwei Fehler, die der Nutzer sieht (Persona P-1: der Mahndialog nennt den Saldo statt des offenen Betrags; Helga P-2: Bestätigung «als bezahlt markiert» nach einer Teilzahlung), sind behoben, aber ohne Szenario und ohne `No scenario: <reason>` in einem Commit |
| C-13 | Minor | src/routes/statements/[id]/+page.svelte:112-116 | Die Meldung `statements_part_payment_recorded` auf der Detailseite prüft kein Test. Der DOM-Test in Zeile 287-299 deckt nur die Liste ab. Das E2E-Szenario wartet nur auf `toast-success` und prüft den Text nicht |

## C-7: Die Bedingung prüft das falsche Feld

`paymentOf` (`statement-payment.ts:24-32`) gibt für eine versendete Abrechnung mit Saldo 3.40, die keine Schlussabrechnung ist, `unpaid: true` und `noPayment: true` zurück, aber `waived: false`. `waived` ist erst wahr, wenn die Abrechnung den Status `paid` hat und der bezahlte Betrag 0.00 ist. Beide Wege aus Runde 1 betreffen offene Abrechnungen: Die nach #94 bezahlte Abrechnung, deren Zahlung zurückgesetzt wurde, hat wieder den Status `sent` (`paidAmount` null). Die vor #448 versendete Abrechnung unter CHF 5 war nie bezahlt. In beiden Fällen ist `!statement.waived` wahr:
- `PaidDateFields` zeigt `paid-amount-input`, vorbelegt mit 3.40.
- `signedPaid` gibt `'3.40'` zurück, `isPartPayment` rechnet weiter.
- Das Backend speichert im Zweig `waived` (`statement.service.ts:803`, `entered ?? '0.00'`) 3.40, und `paidThisMonth` zählt den Betrag als Einnahme.

Das Backend bestimmt `waived` dagegen selbst richtig (`belowMinimum(balance) && !existing.final`, Zeile 784). Nur das Feld der Antwort mit demselben Namen meint etwas anderes. Der neue Test ist nur grün, weil die Testdaten eine Lage zeigen, die es nicht gibt.
- Zeigen: Im DOM-Test von Zeile 1783 `detail({ status: 'sent', balance: 3.4, unpaid: true, noPayment: true })` verwenden (so liefert `paymentOf` die Abrechnung) statt `waived: true`. Dann ist `paid-amount-input` da, und `formData.get('paidAmount')` ist `'3.40'`.
- Abhilfe: In der UI an `statement.unpaid` anknüpfen (der Saldo verlangt keine Zahlung). Oder im Backend bei `waived` immer `'0.00'` speichern (Zeile 803), dazu der pg-Test von `statement-lock.pg.test.ts:114` mit `paidAmount: '3.40'`.

## C-12: Sichtbare Korrekturen ohne Szenario

`CLAUDE.md`, Workflow 1: Jede Änderung des Verhaltens, auch die Korrektur eines Fehlers, den der Nutzer sieht, beginnt mit einem Szenario. In eb6ef7d sind es zwei:
- Der Mahndialog nennt nach einer Teilzahlung den offenen Betrag statt des Saldos. Der Fehler widersprach dem «Decided» von #959 («Mahnung … names … Offener Betrag»).
- Nach einer Teilzahlung lautet die Bestätigung «Teilzahlung für Abrechnung … festgehalten».

Kein Szenario in `tests/e2e/features` prüft das eine oder das andere. Zu #959 gibt es nur die drei Szenarien in `statement-detail.feature:103-129`, und keines davon mahnt oder liest die Meldung. Kein Commit nennt `No scenario: <reason>`. Der E2E-Stack kann beides erzeugen: Das Szenario «Nach einer Teilzahlung zählt die Übersicht nur den Rest als überfällig» kommt schon in den Zustand «Überfällig mit Teilzahlung».
- Zeigen: `grep -rn "schuldet noch\|Teilzahlung für" tests/e2e` findet nichts.
- Abhilfe: Ein Szenario, etwa «Die Mahnung nach einer Teilzahlung nennt den offenen Betrag» (Teilzahlung festhalten, Mahnung öffnen, «schuldet noch CHF 432.90»). Ein Then-Schritt, der den Text der Meldung nach «eine Zahlung von … festhält» liest, würde auch C-13 schliessen. Oder `No scenario: <reason>` mit einer Begründung, die nach `tests/e2e/CLAUDE.md` zulässig ist.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check` (0/0), Typprüfung des Backends, `bunx vitest run --changed origin/main` (1012), DOM-Tests von statement-pages (225), statement-actions, pg-Tests von statement-lock, statement-correction und dashboard (51), fallow audit. Ebenfalls nur gemeldet: E2E chromium/api und die Zeilen für axe und Sprachen, gelaufen auf 819687e mit den E2E-Dateien von eb6ef7d. Den App-Code von eb6ef7d (Meldung, Mahndialog, Feld unter dem Mindestbetrag) hat damit kein E2E-Lauf und kein axe-Lauf gesehen. Nur gemeldet ist auch, dass die neuen Tests rot waren. Beim Lesen schlagen sie ohne die Änderung fehl: Meldung in der Liste, Mahndialog 215.80 statt 165.80, leeres Feld (`'' || undefined` sendete), späteste Zahlung (C-5). Der Test zu C-7 schlägt dagegen nur mit den Testdaten fehl, die es nicht gibt.
- «Zahlung zurücksetzen»: Das Glossar sagt jetzt «Verlauf und Protokoll halten … Datum und Betrag der zurückgesetzten Zahlung fest». Dass das Protokoll den Betrag schreibt, habe ich im Diff nicht gesehen. Es gehört zu 959a, und die Zeile im Verlauf ist laut «Decided» Folgearbeit (#999).
- Ob `sentStatement(2026)` eine Abrechnungsperiode hat, die vor dem 1.7.2026 endet (sonst lehnt das Backend den Tag im C-5-Test mit `PAID_DATE_BEFORE_PERIOD_END` ab), habe ich nicht nachgelesen. Der Aufrufer meldet den Test als grün.

Geprüft: Glossarzeilen und die Zeilen in `i18n-begriffe.md` gegen `959-fachreview-1.md:120-130` und das «Decided» (gleicher Wortlaut). `backend_statement_paid_amount_too_high` in vier Sprachen gleich wie die Texttabelle (Zeile 109), `{rest}` mit «CHF» und Apostroph (`formatCHF`), pg-Test nachgeführt. `statements_part_payment_recorded` in allen vier `messages/*.json`, Begriffe gleich wie `i18n-begriffe.md`. Aufteilung `paidAmountOf` ohne Änderung des Verhaltens (`Math.sign(rest)` gleich `Math.sign(balance)`, solange ein Rest offen ist). `recordPayment` wartet auf `toast-success`, Screenplay-Schichten eingehalten. Tokens unverändert. ponytail: nichts zu streichen.
