# Code-Review #449 (mit #491), Runde 1

Geprüft: `git diff 6b99011e 61493b31` (ohne Reviews, Plan, Archiv) und `git show --remerge-diff 861b9873`, im Worktree
`w5-review-449-code` (detached 861b9873). Gelesen: alle geänderten Dateien des Diffs, dazu `statement-pdf.service.ts`,
`statement.service.ts` (`updateStatementStatus`), `routes/statements.ts` (send), `statement-actions.ts`,
`tests/a11y/screens.json`, `tests/e2e/fixtures/screens.ts`, `tests/e2e/tasks/accessibility.ts`, `tests/e2e/CLAUDE.md`,
Issues #449, #491, #532.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | `tests/a11y/screens.json:40`, `tests/e2e/fixtures/screens.ts:74-75`, `src/routes/statements/[id]/SendDialog.svelte:27-29` | Die E-Mail-Variante des Versanddialogs (neuer Hilfetext zur Unzustellbarkeit, neuer Button «Stattdessen per Brief zustellen») zeigt kein Bildschirm in `screens.json` mehr. Axe und die Sprachprüfung sehen die neuen Elemente nie |
| C-2 | Major | `tests/e2e/steps/apartment-detail.steps.ts:3` | Der mehrzeilige Import aus `../questions/apartment-detail` ist auf eine Zeile zusammengezogen. Die Namen sind gleich geblieben, es ist also reine Umformatierung von Code, den die Änderung sonst nicht braucht |
| C-3 | Minor | `tests/a11y/screens.json:41` | Die Bedeutung von `send-refused` («tenant wants e-mail but has no address, sent: it stays a draft …») stimmt nicht mehr. Die Oberfläche schickt ohne Adresse jetzt den Brief. Den Zustand erreicht nur noch der direkte POST ohne `byLetter` (`tests/e2e/tasks/accessibility.ts:389`); in der App zeigt er sich nur nach einer gescheiterten E-Mail |
| C-4 | Minor | `backend/src/services/statement-send.service.ts:81-82` | `sendByLetter` liest `pdfBlob` noch einmal aus der Datenbank. Scheitert das zweite PDF in `changeStatementStatus`, gibt der Zweig `if (!pdf) return { statement: sent }` die Abrechnung als versendet zurück, aber ohne Dokument. Damit stimmt «Dwello legt sie dann unter «Dokumente» ab» nicht mehr. Der Zweig hat keinen Test. `made.pdf` und `made.language` sind schon da (ponytail `reuse:`, so wie der E-Mail-Weg in Zeile 63 `made.pdf` ablegt): damit fallen die Abfrage, der Zweig und der Cast `tenant.language as Language` weg |
| C-5 | Minor | `backend/src/services/statement-send.service.ts:79` | Die Ablehnung `IBAN_MISSING` auf dem Briefweg (#491) hat keinen Test. `statement-mail.pg.test.ts` prüft beim Brief nur `CREDITOR_ADDRESS_MISSING`; der Test mit `IBAN_MISSING` (Zeile 202-207) läuft über die E-Mail. Ohne die Zeile wäre der Brief wieder versendet und ohne PDF, und kein Test fiele |
| C-6 | Minor | `backend/src/services/reminder.service.ts:105-106` | Toter Code: `statement.status === 'paid' ? null :` wird nie erreicht. `sendReminder` lässt nur `sent`/`overdue` zu, und `markDocumentPosted` lehnt eine bezahlte Abrechnung jetzt vorher ab. Der zugehörige Test «druckt keinen Zahlteil in den Brief, der erst nach der Zahlung versendet wird» ist entfernt. Der Kommentar beschreibt einen Fall, den es nicht mehr gibt (ponytail `delete:`) |
| C-7 | Minor | `src/lib/document-status.ts:11-16` | Das Feld `toSend` im Rückgabewert von `documentStatus` liest niemand (`DocumentItem.svelte` nutzt `tone`/`label`, `TenantDocumentRow.svelte` nur `label`) (ponytail `delete:`) |

### C-1 (Major): Die E-Mail-Variante des Versanddialogs ist aus der Bildschirmprüfung gefallen

Warum falsch: `CLAUDE.md`, «Process», verlangt für jeden neuen Zustand einen Eintrag in `screens.json`,
`accessibility.feature` und `sprachen-bildschirme.feature`. Im Fixture der Bildschirme hat nur Carla den Kanal E-Mail,
und Carla hat keine Adresse (`fixtures/screens.ts:74-75`, `seed.noEmail('Carla')`). Bisher zeigte ihr Entwurf
(`statement-empty-detail` / `send-dialog`) die E-Mail-Variante. Seit `SendDialog.svelte:27-29` ist
`noEmail` → `letterForEmail` → `byEmail = false`, ihr Dialog zeigt also jetzt die Brief-Variante. Anna (`statement-detail`) und Ida
(`statement-old-address-detail`) haben den Standardkanal Brief. Die Bedeutung in `screens.json:40` («sending it by e-mail
for a tenant who wants e-mail») trifft auf keinen Eintrag mehr zu. Damit laufen weder axe (hell/dunkel,
drei Breiten, unter anderem der ghost-`Button` mit 48 px) noch die Prüfung «fr/it/en ohne Deutsch» je über den neuen
Hilfetext `statements_send_email_bounce` und den Button `send-by-letter-instead`.

So zeigt man es: Den Dialog in `statement-empty-detail` / `send-dialog` öffnen. Er enthält
«Für Carla … ist keine E-Mail-Adresse erfasst.» und «Als versendet markieren», aber kein `send-by-letter-instead`. Kein
anderer Eintrag in `screens.json` gehört zu einem Mieter mit E-Mail-Kanal und Adresse.

Behebung: Im Fixture einen Entwurf für einen Mieter mit Kanal E-Mail und Adresse anlegen (z. B.
`seed.correspondence('Anna', 'email')`, wenn das sonst nichts berührt, oder ein eigener Mieter). Diesen Bildschirm mit
`send-dialog` in alle drei Dateien eintragen und die Bedeutung von `send-dialog` und `send-refused` anpassen (C-3).

Zur Frage 2 des Aufrufers: Bei den anderen Varianten stimme ich zu. Die Brief-Variante samt dem Satz ohne Adresse
prüft `statement-empty-detail` / `send-dialog` jetzt ohnehin. Der Mahndialog ohne Adresse, die Zeile «Nicht mehr
versenden» (Badge `neutral`, eine Farbe aus den Tokens, die es schon gibt) und die Zeilen im Verlauf sind Textvarianten
bestehender Zustände. Nur die E-Mail-Variante verliert durch diese Änderung ihre Abdeckung, und die bringt neue
Bedienelemente mit.

### C-2 (Major): Umformatierung ohne Bezug zur Anforderung

Warum falsch: Die Prüfliste verlangt, dass der Diff nichts enthält, was nicht zur Anforderung gehört (Formatierung,
Refactoring von unberührtem Code). `CLAUDE.md`, «Formatting», erlaubt nur das Formatieren der eigenen Zeilen.
`git diff 6b99011e 861b9873 -- tests/e2e/steps/apartment-detail.steps.ts` zeigt, dass der Import aus 12 Zeilen eine
wird, mit denselben zehn Namen. Die neuen Schritte (Zeilen 102-111) brauchen keinen neuen Import.

So zeigt man es: Den Diff der Datei ansehen; `apartmentInfo` war schon importiert. Behebung: Den alten mehrzeiligen
Import wiederherstellen.

## Antworten auf die Fragen des Aufrufers

1. **Migration 0029:** `ALTER TABLE documents ADD COLUMN recipient varchar(255)` passt zu `schema.ts:570` und zu
   `docs/data-model.md` (die Spalte und der Absatz zu `notToSend`). Der Runner wendet die Dateien in sortierter
   Reihenfolge an (`readdir … .sort()`), es gibt kein Journal. 0028 ist die von main (`statement_carry_over`). Die
   E-Mail speichert `recipient` (Test in `statement-mail.pg.test.ts:134-135`), der Brief speichert `null` (`:224`).
   In Ordnung.
2. Siehe C-1.
3. **`notToSend` gegen Filter, Übersicht und Sperre:** `listDocuments` filtert bei `status=to_send` mit
   `notToSend is null` (`document.service.ts:74`). Dieselbe Abfrage liefert die Zahl auf der Übersicht
   (`dashboard/+page.server.ts:175` → `lettersToSend`). Die Liste und die Aufgabe «Briefe zu versenden» stimmen also
   überein. `reminderToSend` (`statement.service.ts:62-65`) zählt jede Mahnung `to_send` ohne Blick auf `notToSend`.
   Das ist richtig, denn `nextLevel` erreicht nach `assertClaimable` nur `sent`/`overdue`, und dort ist `notToSend` nie
   gesetzt. Nach «Zahlung zurücksetzen» zählt der Brief wieder (N-5, als beibehaltenes Verhalten benannt in 6adbcf1a).
   Die Aufgabe der Übersicht wartet mit `s.reminderToSend` (`overview.ts:145`, Test in `overview.test.ts`). In Ordnung.
4. **Briefweg:** Zuerst kommt das PDF (`generateStatementPdf`, das bei einer Ablehnung wirft, bevor es schreibt), dann
   der Status, dann das Dokument. Scheitert das PDF, ändert sich der Status nicht (Test
   `lehnt den Brief ab, solange das PDF nicht entstehen kann`, Status `draft`, kein Dokument). `IBAN_INVALID` und
   `CREDITOR_ADDRESS_MISSING` kommen als `CodedError` aus `qr-bill.service.ts:345/350`, die Route macht daraus 400.
   Offen sind C-4 und C-5.
5. **Begründungen für «No scenario»:**
   - 3. Mahnung und die Sperre «nach dem Markieren»: Die Begründung trägt. Eine Mahnung, deren Zahlungsfrist
     abgelaufen ist, kann der E2E-Stack nicht herstellen. Die Seite blendet «Mahnung senden» aus, solange
     `nextReminderFrom > heute` ist; die Ablehnung `REMINDER_PREVIOUS_NOT_SENT` erreicht die Oberfläche also erst nach
     der Frist einer Mahnung, die noch zu versenden ist. Das ist die Uhr des Servers (`tests/e2e/CLAUDE.md`,
     «No scenario»). Das Szenario «Nächste Mahnung erst nach der Zahlungsfrist der letzten» deckt den Teil vor der
     Frist ab. Dasselbe gilt für V-1 (Übersicht).
   - #491: Die Begründung trägt technisch und hat einen Vorläufer. #450 hat aus demselben Grund kein Szenario
     («settings are global for parallel scenarios», `docs/archive/implementation-plan-verlauf.md:2061`), und
     `withSettingsLock` schützt nur das Schreiben. Der Entscheid in #491 sagt aber wörtlich «Scenario and texts in
     the send dialog». Der Pull Request muss diese Abweichung als «No scenario: …» nennen und sagen, dass die
     bestehenden Texte `backend_iban_missing` / `backend_creditor_address_missing` / `backend_iban_invalid` als
     `actionError` erscheinen (`statement-actions.ts:65-67`; diese Codes stehen nicht in `UNDELIVERED`, die Oberfläche
     bietet also nicht erneut den Brief an). Ein eigener Test der Oberfläche für eine Ablehnung des Briefs fehlt; der
     Weg über die BFF ist für alle Codes derselbe.

**Fehlschlag in heating-distribution.pg.test.ts:321** (von main, #451, nicht aus diesem Diff): Ursache aus dem Code
erkennbar. Beide Rechnungen des Tests tragen dasselbe `invoiceDate` (`'2024-04-10'`, Helfer `invoice`, Zeile 229), und
die Berechnung lädt die Rechnungen nur `orderBy(invoices.invoiceDate)` (`invoice.service.ts:574`), ohne zweiten
Schlüssel. Bei Gleichstand bestimmt PostgreSQL die Reihenfolge nach der physischen Lage im Heap. Allein läuft die Datei
auf einer frischen Tabelle in Einfügereihenfolge. Im vollen Lauf belegen neue Zeilen Platz von früher gelöschten,
dann kann die Rechnung über −1000 vor der Januar–März-Rechnung kommen, und `invoiceParts![0].profile!.percent` ist
nicht mehr 0. Derselbe Fehler wurde in 5e60256c («find the heating part by its dates») für den Test darüber behoben:
Den Teil über `start === '2024-01-01'` suchen statt über `[0]`, oder die Berechnung zusätzlich nach `createdAt`/`id`
ordnen. Das war schon auf main so und gehört nicht zu diesem Slice. Wenn es noch kein Issue dafür gibt, gehört ein
Issue bzw. eine Zeile in `offene-punkte.md` dazu.

## Anforderungen gegen Code und Tests

- Punkt 2 / `REMINDER_PREVIOUS_NOT_SENT {reminderLevel}`: `reminder.service.ts:73-74`, `backend-error.ts` (Mahnstufe
  mit Namen), `reminders.pg.test.ts`, `backend-error.test.ts`. Bestätigt.
- Punkt 3 / V-2 A / N-1 A / V-4: `markDocumentPosted` (ersetzt vor bezahlt), `notToSend`, `documentStatus`,
  `MarkSentButton`, `DocumentItem` (keine Zahlungsfrist, N-7), `TenantDocumentRow` (N-2); pg-, DOM- und E2E-Tests.
  Bestätigt (C-6, C-7).
- Punkt 4 (Sprache im Mahndialog): `ReminderModal.svelte`, DOM-Test und Szenario. Bestätigt.
- Punkt 6 Mahnung ohne Adresse (#283, V-3 A): Text genau wie entschieden, DOM-Test mit `toBe`, Szenario. Bestätigt.
- Punkt 5.2 / V-6: Text in vier Sprachen, `reminder-letter.test.ts`. Bestätigt.
- Punkt 5.3: `floorLabel` (UI) und `FLOORS.en` (PDF) 0/−1/−2, Unit-Tests, Szenario in `sprachen.feature`. Bestätigt.
- Punkt 6 Versanddialog (Link, nur Brief ohne Adresse, M-1, V-7/N-8, V-9): `SendDialog.svelte`, DOM-Tests,
  Szenarien. Bestätigt (C-1).
- Punkt 7 (Dokument beim Brief, Verlauf mit Weg, Adresse und Uhrzeit): `sendByLetter`, `recipient`, `MetadataCard`,
  `delivery` in `+page.server.ts`, pg- und DOM-Tests, Szenarien. Bestätigt (C-4).
- #491: siehe Frage 4 und 5 (C-5).
- Texte: alle neuen Schlüssel in den vier `messages/*.json` (verglichen). Ablehnungen mit Code und `backend_<code>`.
  Verträge `documents.json`, `statement(s).json`, `reminder-paid-refused.json` sind nachgeführt.
- Rot: Ich habe jeden neuen Test und jedes neue Szenario gelesen. Ohne die Änderung schlagen sie fehl. N-5 ist in
  6adbcf1a als beibehaltenes Verhalten benannt, und die Basis zeigt es (kein Bugfix).
- Merge 861b9873: Die Konflikte sind richtig gelöst (`reminderToSend` neben `final`, die Zeile zu `POST /:id/send` und
  die Zeile `PUT /:id` von main bleiben, die Importe in E2E gemischt). Die Aufteilung in `assertClaimable` ändert kein
  Verhalten.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet; ich habe sie nicht wiederholt: `bun run lint`, `bun run check`,
  `cd backend && bun run type-check`, `bunx vitest run` (3418), Backend `bun run test` (1177/1 Fehlschlag), die
  E2E-Läufe (202 passed). Ein Wiederholen von `bunx vitest run` ging im Worktree nicht: `node_modules` verweist auf
  `/home/user/Dwello` und ist durch eine Regel gesperrt.
- `accessibility.feature` und `sprachen-bildschirme.feature` hat niemand auf 861b9873 laufen lassen (sie fehlen in der
  Liste des Aufrufers). Ob `statement-empty-detail` / `send-dialog` und `send-refused` nach der Änderung grün sind, ist
  ungeprüft. Gelesen: `tasks/accessibility.ts:387-389`; `PostFormAction` schickt kein `byLetter`, `send-refused`
  sollte also weiter entstehen.
- Den Fehlschlag in `heating-distribution.pg.test.ts` habe ich nur aus dem Code begründet, nicht im vollen Lauf
  nachgestellt.
- Ob es für die Reihenfolge der Rechnungen schon ein Issue gibt, habe ich nicht gesucht.
