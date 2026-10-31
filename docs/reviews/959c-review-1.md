# Code-Review 959b, Runde 3 (Abschlussrunde vor dem Push)

Gelesen im Worktree `/tmp/claude/review-959c-code`: `git diff da0bef7 bcf1b02` (bcf1b02), alle geänderten Dateien ausser Plan, Archiv und Bericht.

Geschlossen: C-7, C-12, C-13

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-10 | Minor | src/routes/statements/+page.svelte (Knopf «Teilzahlung festhalten» in der Liste); src/lib/statement.ts (`partPaid`, Zweig `statements_part_refunded`); src/lib/server/statement-actions.ts:30-34 | Unverändert offen wie in Runde 2: Für den Knopf in der Liste, für den Zweig Rückerstattung von `partPaid` und für die Ablehnung eines ungültigen, nicht leeren Betrags im BFF gibt es keinen Test |
| C-14 | Minor | tests/e2e/questions/statement-detail.ts:178 | `paymentDone = Text.of(successToast)` ist eine Kopie von `replacedDone` in Zeile 122 derselben Datei. Beide Fragen lesen dieselbe Erfolgsmeldung |

C-7 (geschlossen): Der Dialog prüft jetzt `statement.unpaid`, und zwar in `PaidDateFields.svelte:49`, `signedPaid` und `isPartPayment`. Laut `paymentOf` (`backend/src/services/statement-payment.ts:24`) ist `unpaid` wahr bei einem Saldo von 0, bei einer verrechneten Abrechnung (Status `settled`) und bei einem Saldo unter dem Mindestbetrag ohne Schlussabrechnung, unabhängig vom Status. Liste und Detailseite holen `unpaid` über denselben Mapper (`src/lib/server/statement.ts:152`). Der DOM-Test (`statement-pages.dom.test.ts:1784`) verwendet jetzt die Felder so, wie das Backend sie für eine versendete Abrechnung mit Saldo 3.40 liefert. Mit der alten Prüfung auf `waived` wäre er rot (Feld vorhanden, `paidAmount` '3.40').

C-12 (geschlossen): Das Szenario «Nach einer Teilzahlung mahnt der Liegenschaftsverwalter den Rest» (`statement-detail.feature:111-120`) prüft die Bestätigung «Teilzahlung für Abrechnung …» auf der Detailseite. Damit ist auch C-13 geschlossen. Ausserdem prüft es «schuldet noch CHF 432.90» über `reminder-owed`. Das entfernte Szenario zur Summe in der Übersicht gibt es auf `origin/main` (d7c6940) nicht, es kam erst mit diesem Pull Request dazu. Es entfernen braucht deshalb keine Freigabe. `dashboard.pg.test.ts:149-155` hält die Summe nach einer Teilzahlung fest. Die Schritte bleiben in ihren Schichten: Schritt, Frage, Target.

## Nicht bestätigt

- Diese Prüfungen hat nur der Aufrufer gemeldet, ich habe sie nicht selbst ausgeführt: `bun run lint`, `bun run check` (0/0), die DOM-Tests von statement-pages (225), E2E chromium und api von statement-detail, statement-reminder, documents und dashboard (199 bestanden). Auch dass der DOM-Test mit der Prüfung auf `waived` rot war, ist nur gemeldet. Beim Lesen schlägt er ohne die Änderung fehl.
- Ob der Text von `reminder-owed` wirklich «schuldet noch CHF 432.90» enthält, habe ich nicht nachgeprüft. Fraglich sind der Leerraum zwischen `{m.statements_owes()}`, dem Kommentar und `<strong>` sowie das Leerzeichen nach «CHF» aus `formatCurrency`. Ich verlasse mich auf den gemeldeten grünen E2E-Lauf.
- Den Text des Pull Requests mit `No scenario:` für die Summe in der Übersicht gibt es im Worktree nicht. Die Begründung steht nur in der Commit-Nachricht von bcf1b02.

Geprüft: Mapper und Verwendung von `unpaid` in Liste und Detailseite. Keine neuen Texte in `messages/*.json`, kein neuer Bildschirm. Das Szenario hat kein `@api`, und der Then-Schritt liest nur die Meldung der UI. Das Target ist eine `data-testid` in kebab-case. Nach dem Entfernen von `overdueAmountText` und des Schritts «nennt die Übersicht» bleibt nichts Unbenutztes zurück, `statTile` wird in `tasks/dashboard.ts` weiter verwendet.
