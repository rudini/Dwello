# Code-Review W6d – Merge 4 (3e8973f, 20214c2)

Geprüft im Worktree `review-w6d-merge4` (detached 20214c2): `git show 3e8973f`, `git diff 3e8973f^2 3e8973f`, `git diff 3e8973f^1 3e8973f` (Backend-Services, Routes, `src/lib`, `src/routes`), `git show 20214c2`, `git diff 3e8973f^2 20214c2 -- tests/e2e`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-23 | Minor | backend/src/services/pdf.service.ts:585 (`title`) | Interaktion #120/#94: Der Hinweis «Bezahlen Sie nur noch den Saldo dieser Abrechnung.» hängt an `data.balance > 0 && !data.paidDate`. Eine berichtigte Abrechnung mit Saldo unter CHF 5 zeigt im Entwurfs-PDF diesen Satz und im Saldo-Kasten gleichzeitig «Wir verzichten darauf; Sie müssen nichts bezahlen.». Das PDF für den Mieter ist nicht betroffen: Beim Versenden wird die Abrechnung erledigt (`paid` mit `paidDate`), und das PDF wird neu erzeugt. Betroffen ist nur die Vorschau des Verwalters. Behebung: das vorhandene `owed(data)` verwenden. |
| C-24 | Nit | src/__tests__/statement-pages.dom.test.ts | Kein Test für eine ersetzte Abrechnung mit Saldo unter CHF 5 (`replaced` und `waived` zusammen). Der Code ist eindeutig (`replaced` hat Vorrang, Frist und «Bezahlt am» bleiben ausgeblendet), aber kein Test hält die Reihenfolge fest. |

Keine Blocker, keine Majors.

## Ergebnis der Prüfung

- **Konfliktauflösung PaymentPanel:** Keine Seite verliert etwas. Von main bleiben die Zeilenstruktur mit `deadline` und `testid`, `statements_summary_replaced`, Frist ohne Datum bei `replaced` und der Kommentar zu #120. Von #94 bleiben `belowMinimum`, die Texte waived_refund/waived_due, die ausgeblendete Frist (früher `{#if !waived}`, jetzt `date: undefined` und dadurch herausgefiltert, mit derselben testid `statement-payment-deadline`) und `paidDate: waived ? null`. Die neue Reihenfolge der Zusammenfassung entspricht main für `replaced`. Für die übrigen Fälle entspricht sie unserer Seite: `balance === 0` steht vor `waived`, sonst gleiche Ergebnisse wie bei main (`refund` → `due` → `settled`).
- **20214c2:** Main hat dasselbe Ziel als `paymentSummary` (targets:87) und die Frage `paymentText` (questions:93), beide auf `statement-payment-summary`. Unser doppeltes Ziel und unsere doppelte Frage sind entfernt. Der Schritt «sagt die Zahlung der Abrechnung» liest jetzt `paymentText` mit `toBe`, also bleibt die Prüfung so streng wie vorher. Kein Import ist übrig, kein Schritttext doppelt (main: «sagt die Abrechnung» mit `toContain`, ein anderer Text). `git diff 3e8973f^2 20214c2 -- tests/e2e` zeigt nur noch die Ergänzungen von #94.
- **Automatisch gemergte Backend-Teile (keine Verluste):** `updateStatementStatus` behält `waived`/`settled`/`moved = '0.00'`. `reminder.service` behält `REMINDER_BELOW_MINIMUM`. In `pdf.service` stehen `balanceText` mit `settledText`, `owed()` für den QR-Teil und `paymentInfo` neben den Teilen von #120 (`replaces`, `priorLine`, `unrounded` mit `priorPayments`).
- **Zusammenspiel von #120 und #94:**
  - Eine ersetzte Abrechnung, die unter CHF 5 erledigt wurde, hat `paidAmount` 0.00. Bei der Korrektur rechnet `paidSoFar` daher 0 an, und `correctionsOf.priorPaidOn` lässt sie weg. Der Dialog «Abrechnung berichtigen» zeigt `statements_correct_settled` (Correction.svelte:23-24). Das Dashboard («bezahlt diesen Monat», auch `replaced`) summiert `paidAmount` und zählt damit 0. Alles stimmig.
  - Bei einer berichtigten Abrechnung mit Saldo unter CHF 5 wird beim Versenden `belowMinimum` auf den gespeicherten Saldo nach der Anrechnung angewendet. Sie wird also erledigt, `balanceText` liefert den Verzichtstext, und es gibt keinen QR-Teil und keine Mahnung. `rounding()` rechnet mit `priorPayments`, deshalb stimmt `balancedRounded` beim Saldo 0. Einzige Unstimmigkeit ist C-23.
  - Für eine ersetzte Abrechnung verweigert `nextLevel` die Mahnung schon über den Status (`!== 'overdue'`). `resetPayment` und `updateStatement` werden von #94 nicht berührt.

## Nicht bestätigt

- lint, check, Backend-Typecheck, vitest (2873 grün), Backend-Tests mit Coverage-Untergrenze, E2E @statements chromium+api (179 grün): vom Aufrufer gemeldet. Mein Versuch, `statement-pages.dom.test.ts` erneut laufen zu lassen, wurde von der Berechtigungsregel blockiert (Zugriff auf `node_modules`).
- C-23 habe ich nur am Code nachvollzogen. Ein gerendertes Entwurfs-PDF einer berichtigten Abrechnung mit kleinem Saldo habe ich nicht erzeugt.
