# Code-Review 959d, Runde 1 (ca6c3a3, `git diff 7e4bdf6 ca6c3a3`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | src/lib/statement.ts:64 | In der Liste erscheint «Bezahlt: …, offen: …» nie mehr: `listStatements` liefert kein `asksPayment`, `toStatement` macht daraus `false`, also gibt `partPaid` für jede Zeile `null` zurück. Der DOM-Test bleibt grün, weil sein Fixture `asksPayment` selbst setzt. |

## C-1: In der Liste fehlt die Zeile zur Teilzahlung

Warum es falsch ist:
- `asksPayment` kommt nur aus `allowed()` (`backend/src/services/statement.service.ts:368`). Das setzt nur `getStatement` ein (`:342`).
- `listStatements` (`:213-231`) gibt `status`, `paymentOf(...)`, `reminderDue` und die Beziehungen zurück, aber kein `asksPayment`. Der Vertrag `tests/contracts/statements.json` hat das Feld deshalb auch nicht.
- `toStatement` (`src/lib/server/statement.ts:143`) macht daraus `asksPayment: data.asksPayment === true`, für jede Listenzeile also `false`.
- `StatementRow.svelte:61` ruft `partPaid(statement)` auf. Seit dem Fix gibt die Funktion bei `asksPayment === false` immer `null` zurück. Vor dem Fix prüfte sie `status` (sent/overdue), und das liefert die Liste. Die Listenzeile für versendete oder überfällige Abrechnungen mit Teilzahlung ist damit weg. Die Anforderung verlangt sie («genau auf sent/overdue mit Teilzahlung»).

Warum kein Test das zeigt: `src/__tests__/statement-pages.dom.test.ts:256-260` baut die Zeile aus `helpers/statement.ts`. Dort ist `asksPayment: status !== 'replaced'` (Zeile 8) fest gesetzt, die Zeile kommt also nicht aus dem Listenvertrag. Das widerspricht `CLAUDE.md`, Gotchas, «API contracts». Kein E2E-Szenario prüft `statement-row-part-paid`. `statement-detail.feature:109` prüft nur das Panel Zahlung in der Detailansicht.

Wie man es zeigt: im Test von Zeile 256 die Zeile mit `asksPayment: false` bauen, so wie sie aus `toStatement` über einer Antwort nach `tests/contracts/statements.json` kommt. Die Erwartung «Bezahlt: CHF 10.00, offen: CHF 432.90» schlägt dann fehl.

Möglicher Fix: `listStatements` gibt `...allowed(row.statement.status)` mit zurück. Dazu gehören der Vertrag `statements.json` und ein Listentest, der seine Zeile aus dem Vertrag nimmt.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run fitness`, `bun run lint`, `bun run check` (0/0) und die DOM-Tests in `statement-pages` (225) sind grün. Ich habe keine Tests ausgeführt.
- Ein Rand bleibt offen: `paid` mit `waived` (Saldo unter CHF 5, keine Schlussabrechnung) und einem eingegebenen Teilbetrag. `recordPayment` übernimmt dann `entered` ungeprüft (`statement.service.ts:803`). Bei 0 < paidAmount < Saldo zeigt `partPaid` die Zeile jetzt auch auf einer bezahlten Abrechnung, denn `unpaid` wertet die Funktion nicht aus. Ob die UI diesen Weg erlaubt, habe ich nicht geprüft.

Geprüft: Detailansicht (PaymentPanel). Bei `paid` ist nichts offen, bei `replaced` (auch mit «Bereits bezahlt» aus `replaceStatement`/`paidOn`) ist `asksPayment` false. Bei `settled` ist `paidAmount` leer oder 0. In allen drei Fällen erscheint keine Zeile. Bei `sent`/`overdue` mit Teilzahlung erscheint sie.
