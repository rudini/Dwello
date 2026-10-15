# Code-Review issue-126, Runde 1

Geprüft: `origin/main..c94cb61` (1 Commit, `fix(statements): code failed reminder e-mails`), Worktree `review-126-code`. Alle 12 geänderten Dateien gelesen, dazu `ReminderFeedback.svelte`, `DocumentItem.svelte`, `ReminderModal.svelte`, `StatusActions.svelte`, `statement-actions.ts`, `tests/contracts/documents.json`, `docs/design/i18n-begriffe.md`, `UBIQUITOUS_LANGUAGE.md`.

Selbst erneut ausgeführt: `bun test src/__tests__/reminders.pg.test.ts` (13 pass; der Fehler des SMTP-Stand-ins erscheint per `console.error` im Log), `bunx vitest run src/__tests__/backend-error.test.ts src/__tests__/statement-pages.dom.test.ts` (83 pass).

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | `messages/de.json:444` (und fr/it/en:444) | «senden Sie die Mahnung erneut» führt in Dwello zur nächsten Mahnstufe: Es gibt keine Aktion, die eine nicht zugestellte Mahnung nochmals sendet; «Mahnung senden» erstellt nach einer gescheiterten Zahlungserinnerung eine 2. Mahnung. |
| C-2 | Minor | `messages/en.json:444` | «e-mail» statt des festgelegten Begriffs «email» (`docs/design/i18n-begriffe.md:22`; en.json braucht sonst überall «email»). |
| C-3 | Minor | `backend/src/services/reminder.service.ts:68-69` | Dass der Text des Transports geloggt wird (Done means), zeigt kein Test (z. B. Spy auf `console.error` im neuen pg-Fall). |
| C-4 | Minor | `backend/src/__tests__/reminders.pg.test.ts:143-148` | Der zweite neue Fall hängt von Dokumenten früherer Tests ab (`update … where status = 'to_send'` und `[{ id }]`); allein ausgeführt (`-t`) oder umsortiert scheitert er mit TypeError statt einer Aussage. Besser ein eigenes Dokument anlegen (`remind(...)`) und dieses ändern. |
| C-5 | Minor | `implementation_plan.md:11`, Issue #126 | Die Meldung weicht vom «Done means» des Issues ab (ohne «Mail-Einstellungen»). Begründung ist schlüssig (Mail richtet der Betreiber per env ein, siehe Bestätigung unten), aber die Abweichung steht nur im Plan; im Issue bzw. in der PR-Beschreibung festhalten. |
| C-6 | Nit | `src/__tests__/backend-error.test.ts:121`, `src/__tests__/statement-pages.dom.test.ts:837` | Neue Zeilen nicht Prettier-formatiert (`bunx prettier <file> \| diff <file> -` zeigt genau diese Zeilen). |
| C-7 | Nit | `backend/src/services/reminder.service.ts:59,68` | Die Suche `known` über alle `DELIVERY_ERRORS` dient nur dazu, das selbst geworfene `TENANT_NO_EMAIL` wiederzuerkennen; den fehlenden Empfänger vor dem `try` direkt zu speichern wäre kürzer und bräuchte keinen Vergleich über den Text. |

## C-1 (Major): «senden Sie die Mahnung erneut» löst die nächste Mahnstufe aus

**Warum falsch:** Die Meldung sagt der Person, was sie tun soll (Design-Regeln: «errors say what happened and what to do»). In Dwello gibt es aber keinen Weg, eine nicht zugestellte Mahnung nochmals zu senden:
- `DocumentItem.svelte:54-63` bietet für ein Dokument im Status «zum Versand» nur «PDF herunterladen» und «Als versendet markieren» (`MarkSentButton.svelte`), kein erneutes Senden.
- Der einzige Sendeweg ist «Mahnung senden» auf der Abrechnung (`StatusActions.svelte:24-27`). `nextLevel` (`reminder.service.ts:46-53`) zählt mit `countReminders` (`document.service.ts`) alle Mahnungen der Abrechnung, unabhängig von Status und Zustellfehler. Nach einer gescheiterten Zahlungserinnerung bietet `ReminderModal.svelte:15-25` deshalb «2. Mahnung senden» an.

Wer der Anleitung folgt, schickt dem Mieter also eine 2. Mahnung mit einer neuen Zahlungsfrist, obwohl er die Zahlungserinnerung nie bekommen hat. Die gescheiterte Zahlungserinnerung bleibt dabei «zum Versand» in den Dokumenten. Das betrifft die Mahnstufen (UBIQUITOUS_LANGUAGE.md:157), also eine Fachregel; bei einem Server, der vorübergehend nicht erreichbar ist (die Meldung gilt ja für jeden anderen Fehler), ist «erneut senden» sogar der naheliegendste Rat. Nach drei solchen Versuchen meldet `REMINDER_LIMIT`, dass keine Mahnung mehr möglich ist.

**Wie sich der Fehler zeigt:** In `reminders.pg.test.ts` den Mieter auf `abgelehnt@example.com` setzen, `remind(statement)` aufrufen (Ergebnis `to_send`, `MAIL_DELIVERY_FAILED`), danach die Adresse korrigieren und nochmals `remind(statement)`: Das zweite Ergebnis hat `reminderLevel: 2`, Titel «2. Mahnung». In der UI genauso: Nach der Meldung zeigt «Mahnung senden» den Dialog mit «2. Mahnung senden».

**Vorschlag:** Den Rat an das anpassen, was Dwello kann, z. B. «… Drucken Sie die Mahnung aus und senden Sie sie per Post; markieren Sie sie danach in den Dokumenten als versendet. Korrigieren Sie die E-Mail-Adresse des Mieters für die nächste Mahnung.» (in allen vier Sprachen). Das Issue verlangt wörtlich «send again». Falls der Text so bleiben soll, ist das eine Produktentscheidung (`entscheiden`) oder eine Funktion «erneut senden» für ein Dokument «zum Versand», die es noch nicht gibt. Da es um Mahnstufen geht, sollte der `fach-reviewer` den neuen Text prüfen.

## Bestätigt

- Jeder Zustellfehler bekommt einen Code: Ein unbekannter Fehler wird als `DELIVERY_ERRORS.MAIL_DELIVERY_FAILED` gespeichert (`reminder.service.ts:68-71`), der Text des Transports nur mit `console.error` geloggt. Gezeigt durch den pg-Fall «legt die Mahnung mit einem Code statt dem Text des Mailservers …» (Ergebnis und Dokumentliste) und durch das Log beim erneuten Lauf.
- Alte Dokumente: `deliveryErrorCode` (`document.service.ts:45-48`) leitet beim Lesen für jeden unbekannten Text, der nicht null ist, `MAIL_DELIVERY_FAILED` ab. Gezeigt durch den pg-Fall «nennt auch für eine früher gespeicherte Fehlermeldung …» (siehe C-4).
- Frontend: `deliveryErrorText` zeigt nie den gespeicherten Text (`backend-error.ts:53-56`). Der Unit-Test mit «550 5.1.1 User unknown» wäre ohne die Änderung rot gewesen (der alte Code gab `error` an `backendMessage` weiter). Die Rückmeldung nach der Mahnung zeigt der DOM-Test.
- `backend_mail_delivery_failed` steht in allen vier Sprachen, mit Sie/vous/Lei; fr «rappel», it «sollecito» wie bisher (zu en siehe C-2). Der Code steht in `docs/api-specification.md:34`.
- Vertrag: Die Form der Antwort ist gleich geblieben (`deliveryErrorCode` gab es schon, `tests/contracts/documents.json:16`).
- Entscheidung «ohne Mail-Einstellungen»: hält. Die App hat keine Mail-Einstellungen für den Benutzer, und für fehlende Konfiguration gibt es schon `MAIL_NOT_CONFIGURED`. Was der Rat stattdessen sagt, siehe C-1.
- «No scenario: server-side failure» ist begründet: Der Fehler entsteht zwischen Backend und Mailserver, und der Browser kann ihn nicht auslösen. Die tiefere Ebene deckt der pg-Test mit dem SMTP-Stand-in ab.
- Neue Bildschirmzustände: keine. Der Zustand «nicht zugestellt» gab es schon (`MAIL_NOT_CONFIGURED`), nur der Text ist neu.
- Plan: nur die aktuelle Session; die Zeilen «Skills: tdd, ponytail, ponytail-review» und «Test red» für alle drei neuen Tests sind da.
- Nichts im Diff gehört nicht zur Anforderung.

## Nicht bestätigt

- `bun run test:coverage` (2416), `bun run lint`, `bun run check`, `cd backend && bun run test && bun run type-check`, `deepcheck:audit`, E2E chromium+api `statement-reminder.feature` und `documents.feature` (8 passed): vom Aufrufer gemeldet. Selbst neu ausgeführt habe ich nur die oben genannten drei Testdateien.
- «Test red» der drei neuen Tests: vom Aufrufer gemeldet. Für den Unit-Test aus dem alten Code von `deliveryErrorText` abgeleitet (gab `body.error` zurück), nicht ausgeführt.
- Ob der Text von fr/it/en fachlich und sprachlich passt (z. B. fr «distribué» für eine E-Mail): nur gegen `i18n-begriffe.md` geprüft, nicht durch eine Muttersprachlerin.
- CI-Prüfung `check-issues.mjs`: Die PR, die #126 schliesst, braucht `No scenario: server-side failure` im Text. Das lässt sich erst an der PR prüfen.
- Ob Fehlertexte von nodemailer im Log Empfängeradressen enthalten (EENVELOPE listet abgelehnte Empfänger): nur im Testlog gesehen. Ob das im Betrieb erwünscht ist, habe ich nicht geprüft.
