# Code-Review #449 (mit #491), Runde 2

Geprüft: `git diff 861b9873 026677db -- . ':!docs/reviews' ':!docs/design/personas'` (Commit 026677db), im Worktree
`w5-review-449-code2` (detached 026677db). Gelesen: alle zehn geänderten Dateien des Deltas. Dazu habe ich gelesen:
`SendDialog.svelte`, `StatusActions.svelte`, `generateStatementPdf`/`changeStatementStatus`
(`statement-pdf.service.ts`), `sendStatement` (E-Mail-Weg), `tests/e2e/fixtures/backend.ts` (`correspondence`,
`sendStatement`), `tasks/accessibility.ts:387-389`, `statement-send.feature` und `statement-send.steps.ts`, die Einträge
von `statement-detail` und `statement-empty-detail` in `screens.json`, `accessibility.feature` und
`sprachen-bildschirme.feature`. Vorheriger Bericht: `docs/reviews/449-review-1.md`.

## Status der offenen IDs

| ID | Status | Beleg |
|---|---|---|
| C-1 | geschlossen | `fixtures/screens.ts:69-70`: Anna hat jetzt den Kanal E-Mail und eine Adresse (`seed.correspondence` setzt beides). `statement-detail` / `send-dialog` (`{statement}` = «Abrechnung Anna 2025») zeigt damit die E-Mail-Variante mit `send-by-letter-instead`. Die Zeile steht in allen drei Dateien. Dass Anna jetzt den Kanal E-Mail hat, ändert die anderen Bildschirme nicht: `sendStatement('Anna', 2024)` setzt nur den Status per `PUT …/status` und schickt keine E-Mail, und die neue Adresse «Ahornweg 3» ist nicht die des Gebäudes («Testweg 1»), löst also keinen Hinweis auf eine alte Adresse aus |
| C-2 | geschlossen | `git diff 6b99011e 026677db -- tests/e2e/steps/apartment-detail.steps.ts` zeigt nur noch die zwei neuen Schritte |
| C-3 | geschlossen | `screens.json:40-41`: Beide Bedeutungen beschreiben jetzt, was der Bildschirm zeigt. `send-refused` entsteht weiterhin durch den direkten POST ohne `byLetter` |
| C-4 | geschlossen (anders gelöst, die Begründung trägt) | Der Zweig `if (!pdf) return` und der Cast sind weg. Der Titel kommt aus `made.language`; das ist dieselbe Sprache wie vorher, denn `generateStatementPdf(id)` ohne Sprache nimmt die des Mieters. Das Dokument entsteht jetzt immer. `changeStatementStatus` schreibt `pdfBlob` nur, wenn das zweite PDF gelingt; sonst bleibt das von `made` gespeichert. Die Abfrage behält das PDF, das die Abrechnung aufbewahrt, und damit dieselben Bytes wie beim Abruf. Das ist ein Grund, sie nicht durch `made.pdf` zu ersetzen |
| C-5 | geschlossen | `statement-mail.pg.test.ts:249-259`: Briefweg ohne IBAN, prüft `IBAN_MISSING`, Status `draft` und dass kein Dokument entsteht. Beim Lesen: Ohne die Zeile wäre `made` der String `'no-iban'`, der Status würde `sent`, und der Test schlüge fehl (Status, Code). Das passt zur Meldung des Aufrufers |
| C-6 | geschlossen | `reminder.service.ts:105-106`: Die Prüfung auf `paid` ist weg. `reminderOn` erreichen nur `sendReminder` (`assertClaimable`: nur `sent`/`overdue`) und `markDocumentPosted` (lehnt `replaced`/`paid` vorher ab). Der Kommentar stimmt |
| C-7 | geschlossen | `document-status.ts`: `toSend` ist entfernt. Laut grep liest es niemand |

## Neue Befunde im Delta

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-8 | Major | `src/routes/statements/[id]/+page.svelte:69`, `tests/e2e/features/statement-send.feature:36-41` | Der Fix zu Helga P-2 ändert, was der Benutzer sieht: Ohne E-Mail-Adresse heisst der Knopf jetzt «Als versendet markieren» statt «Per E-Mail senden». Kein Szenario zeigt das. «Mieter ohne E-Mail-Adresse» prüft nur die Bestätigung, und sein Schritt «die Abrechnung per E-Mail senden will» beschreibt jetzt eine Handlung, die die Oberfläche nicht mehr anbietet |

### C-8 (Major): Die geänderte Beschriftung des Knopfs hat kein Szenario

Warum falsch: Laut `CLAUDE.md`, Workflow 1, braucht jede Verhaltensänderung, die der Benutzer sieht, ein Szenario in
`tests/e2e/features` ohne `@wip`. Der DOM-Test `statement-pages.dom.test.ts:1259-1260` deckt den Knopf auf der unteren
Ebene ab. Er war vor dem Fix rot: `byEmail` war für den Kanal E-Mail ohne Adresse `true`, der Knopf hiess also «Per
E-Mail senden». Das passende Szenario gibt es schon, «Mieter ohne E-Mail-Adresse». Es klickt aber nur über die testid
(`openSendConfirmation`) und liest danach `sendConfirmLabel` im Dialog (`statement-send.steps.ts:53-56`). Würde die
Zeile 69 zurückgenommen, bliebe das Szenario grün. Ausserdem sagt der Wenn-Schritt «per E-Mail senden will», und genau
das bietet der Knopf seit dem Fix nicht mehr an.

So zeigt man es: `+page.svelte:69` auf `statement.tenantCorrespondenceChannel === 'email'` zurücksetzen. Der DOM-Test
schlägt fehl, `statement-send.feature` «Mieter ohne E-Mail-Adresse» bleibt grün.

Behebung: Im Szenario einen Schritt ergänzen, der die Beschriftung als Wert liest, etwa «Dann nennt die Abrechnung
den Versand "Als versendet markieren"» mit einer Question auf `statement-send-button` und `toBe`. Den Wenn-Schritt so
formulieren, dass er das Ziel nennt («die Abrechnung versenden will»), und dabei die Domänenwörter beibehalten. Kann der
Schritt erst nach dem Fix rot gesehen werden, zeigt man das, indem man die Zeile 69 vorübergehend zurücknimmt.

Sonst ist an P-2 nichts zu beanstanden. `StatusActions` und `SendDialog` stimmen jetzt überein: `SendDialog` setzt
ohne Adresse ohnehin `letterForEmail`. Der Weg «nach gescheiterter E-Mail per Brief» (`onletter`, Zeile 203) hängt
nicht an `byEmail`. Der Text `statements_mark_sent` steht schon in allen vier Sprachen.

`offene-punkte.md` O-45 (Reihenfolge in `heating-distribution.pg.test.ts`) gibt die Ursache aus Runde 1 richtig wieder.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet; ich habe keine davon wiederholt: lint und check, Backend-`type-check`,
  `statement-pages.dom` (167), `statement-mail.pg` und `reminders.pg` (53), die axe- und Sprachzeilen (132). Im Worktree
  gibt es weder `node_modules` noch `backend/node_modules` (per Glob gesucht), deshalb liefen weder vitest noch die
  pg-Tests.
- Die axe- und Sprachzeilen liefen laut Aufrufer vor dem Fix zu P-2. Auf 026677db hat
  `statement-empty-detail` (Carla, `default` und `send-dialog`) einen anderen Text im Knopf: `statements_mark_sent`.
  Den Schlüssel gibt es schon übersetzt, ein Befund ist daher unwahrscheinlich. Gelaufen ist die Zeile auf diesem
  Commit aber nicht.
- Dass der neue pg-Test ohne die Zeile `IBAN_MISSING` rot ist, habe ich nur aus dem Code geschlossen. Gelesen:
  `statement-send.service.ts:75-95`, `generateStatementPdf`.
