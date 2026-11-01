# Code-Review #999, Slice 1, Runde 1

Worktree `/tmp/scratchpad/review-999-code-reviewer` (c7e729a), Bereich `94db423..c7e729a` ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | `src/lib/server/audit-log.ts:52-62`, `backend/src/services/statement.service.ts:876` | Das Protokoll nennt neu den Betrag des Zurücksetzens (V-5). Das sieht der Benutzer, aber kein Szenario prüft es, und es gibt kein `No scenario: <reason>` |
| C-2 | Minor | `src/routes/statements/[id]/ResetPaymentDialog.svelte:28` | `open: chf(statement.balance - kept)` kopiert `openAmount` aus `src/lib/statement.ts:58`, aber ohne dessen Rundung auf Rappen. Richtig wäre `formatCurrency(openAmount({ balance: statement.balance, paidAmount: kept }))` |
| C-3 | Minor | `src/routes/statements/[id]/MetadataCard.svelte:102-106` | Bei einer Rückerstattung, die in Teilen bezahlt ist, heissen die Teile im Verlauf «Zurückerstattet: …», die Schlusszahlung aber «Zahlung über …». Nach Antwort 4 der Fachreview liest der Verwalter das als Eingang. Weder die Fachreview noch #999 hat diesen Fall entschieden, und kein Test deckt ihn ab |
| C-4 | Minor | `src/__tests__/audit-log-mapping.test.ts:83` | Der Kommentar «Fachprüfung V-3: eine früher erfasste Zahlung ohne Datum» steht jetzt über dem neuen #999-Test und nicht mehr über dem Test «nennt eine zurückgesetzte Zahlung ohne Datum», den er beschreibt |

## C-1 (Major)

Warum: Laut CLAUDE.md, Workflow 1 und «Done means» braucht jede Verhaltensänderung, die ein Benutzer sieht, ein Szenario ohne `@wip` oder ein `No scenario: <reason>`. Die Seite «Protokoll» zeigt nach dieser Änderung «Zahlung vom {date} über {amount} zur Abrechnung {number} zurückgesetzt» statt des Texts ohne Betrag. `grep -rn "zurückgesetzt" tests/e2e/features` findet ausserhalb von `statement-detail.feature` keine Prüfung des Protokolls. Die fünf neuen Szenarien und das geänderte «Zahlung zurücksetzen» prüfen nur den Verlauf auf der Detailseite. Die Commit-Nachrichten von 55a795c und c7e729a nennen keinen Grund für ein fehlendes Szenario. Abgedeckt ist V-5 nur auf tieferen Schichten: `audit-log.pg.test.ts:194-197` und `audit-log-mapping.test.ts:41,84-92`.

So zeigt es sich: Man setzt `audit_payment_reset_amount` in `audit-log.ts` wieder auf `audit_payment_reset` zurück. Alle E2E-Szenarien bleiben grün.

Abhilfe: Ein Szenario «Das Protokoll nennt das Zurücksetzen mit Datum und Betrag», zum Beispiel als Fortsetzung von «Zahlung zurücksetzen». Oder ein `No scenario: <reason>` im Pull Request.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, Backend `type-check`, die Backend-Tests api-contracts, statement-lock, audit-log, statement-carry-over und reminders (250), `bunx vitest run --changed origin/main` (921), die Regeltests mit audit-log-page, statement-part-payment und statement-actions (1138), E2E chromium statement-detail (130), Axe- und Sprachzeilen statement-part-paid-detail und statement-paid-detail (12), Prettier auf den neuen Dateien.
- `tenant-export.service.ts:133` gibt `paymentResets` unverändert weiter. Der Datenexport enthält damit neu das Feld `part`. Ob die Doku zum Export (README.txt, daten.json) die Felder einzeln aufzählt, habe ich nicht geprüft. Unter `backend/src/__tests__` habe ich keinen Exporttest gefunden, der `paymentResets` prüft.
- Auf einer überfälligen Abrechnung mit Teilzahlung stehen jetzt vier Aktionen im Seitenkopf: PDF, Mahnung, Zahlung zurücksetzen, Als bezahlt markieren. Ob dabei bei 390 px kein seitliches Scrollen entsteht, habe ich nicht geprüft. Gelesen habe ich nur `StatusActions.svelte`. Axe prüft das nicht, und ob `partPaidStatement` («Abrechnung Rita 2025», `tests/e2e/fixtures/screens.ts:324`) die Mahnung anbietet, habe ich nicht nachgesehen.
- Der Text des Pull Requests mit `Spec change approved: #999` existiert noch nicht. Den Entscheid in #999 (01.11.2026) habe ich nicht in GitHub gelesen; ich verlasse mich auf die Angabe des Aufrufers und auf die Fachreview, Abschnitt V-1 A.
- Ob `api-contracts.pg.test.ts` ohne die Änderung rot ist, habe ich nur durch Lesen beurteilt. `drift` meldet `.paymentResets[0].part: fehlt`, solange das Backend `part` nicht speichert. Ohne die neue Teilzahlung zu Beginn käme `payments[]: leer geliefert`. Der Test würde also rot.

Hinweise des Implementierers:
- `part` im JSONB ohne Migration: in Ordnung. Das Feld ist optional, und die Doku sagt «absent before».
- Teil- oder Gesamtzahlung im Dialog nach `!statement.paidDate`: in Ordnung. Es entspricht `status !== 'paid'` im Backend.
- Nur eine a11y-Zeile für den Dialog: in Ordnung. Die Variante mit mehreren Zahlungen hat dieselben Bedienelemente.

Geprüft: alle Texte wörtlich gegen die Tabelle der Fachreview, in fr mit geschütztem Leerzeichen vor «:» und in «»; alle Texte in allen vier `messages/*.json`; V-1 A, V-2 (die Zeile fällt weg, weil sie aus `payments` entfernt wird), V-3, V-4, V-5 im Code, M-1; die Antworten 1-7; die Verträge `statement.json`, `statement-payment-reset.json`, `audit-log.json`; die Screenplay-Schichten der neuen Schritte und Tasks; jede negative Prüfung hat einen positiven Anker; das geänderte Szenario «Zahlung zurücksetzen» prüft strenger als vorher; das Rot der neuen DOM-, pg- und Mapping-Tests durch Lesen; Tokens und Komponenten (nur `Button`, keine neuen Klassen).
