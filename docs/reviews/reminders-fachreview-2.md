# Fachreview 2: Mahnungen mit Zahlungsfrist (#107, #193, #194)

Geprüft: Worktree `review-reminders-fach2`, detached auf 5fd7b55. Gegenstand: `git diff 63fab35 5fd7b55` (Umsetzung) und `git diff b1b4025 63fab35` (Tests), gemessen an Runde 1 (`docs/reviews/reminders-fachreview-1.md`). Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, Issues #277 und #278 (beide offen, Labels `fachlich`, `entscheiden`), Code im Worktree.

## Stand der Befunde aus Runde 1

| ID | Stand |
|----|-------|
| V-1 (Blocker) | **Teilweise beantwortet.** Die fünf Texte nennen jetzt in allen vier Sprachen die richtige Reihenfolge, und `markDocumentPosted` erstellt den Brief neu (`reminder.service.ts:231-239`). Offen bleibt: Auf dem Weg, auf den die Texte führen, ist das neue PDF nach dem Markieren nicht mehr da. Das ist jetzt **V-14 (Major)**. Herunterladen mit heutigem Datum vor dem Markieren: braucht ein OK des Product Owners, nicht Teil dieser Runde. |
| V-2 | In #278 (`entscheiden`). Nicht erneut bewertet. |
| V-3 (Major) | **Beantwortet.** `overview.ts:110-112` zieht nur Abrechnungen ab, bei denen `nextReminderFrom > today` gilt. Rückerstattungen und Abrechnungen nach der 3. Mahnung haben `nextReminderFrom = null` und zählen weiter. Der Unit-Test `overview.test.ts:130-149` deckt «Frist läuft», «Frist abgelaufen» und `null` ab. Kleiner Rest: **V-16**. |
| V-4 (Major) | **Im Code beantwortet.** `statement.service.ts:259-263` gibt nach 3 Mahnungen `null` zurück. Damit fehlen die Zeile in der Liste und das Feld auf der Detailseite. Kein Test zeigt das, siehe **V-15**. |
| V-5 | Offen (Minor). Bleibt im Bericht von Runde 1. |
| V-6 | **Beantwortet.** `0007_reminder_payment_deadline.sql:9` rechnet `(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Zurich')::date + 10`. Das ist richtig, solange `created_at` in UTC gespeichert ist (lokaler Server: `show timezone` = `Etc/UTC`). Kein pg-Test, siehe **V-15**. |
| V-7 | Marker `TODO(fachlich prüfen, #64)` steht noch (`overview.ts:117`). Einverstanden. |
| V-8 | Begründung angenommen: Die Zahl in der Übersicht ist über parallele Szenarien global. Der Unit-Test ersetzt den Schritt. |
| V-9 | In #277 (`entscheiden`). Der Marker steht in `DocumentItem.svelte:44`. |
| V-10 | **Beantwortet.** Liste und Detailseite sagen beide «Nächste Mahnung möglich ab». Der Step ist angepasst (`documents.steps.ts:123`). |
| V-11 | **Beantwortet.** Szenario `statement-reminder.feature:50-56`. |
| V-12 | Offen (Nit). |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-13 | Verwalter | Major | «Nächste Mahnung möglich ab» steht auch bei einer **bezahlten** Abrechnung. Das ist der häufige Fall: Der Mieter zahlt innerhalb der Frist der Mahnung. |
| V-14 | Verwalter | Major | Rest von V-1: Unter «Zu versenden» verschwindet der Brief nach dem Markieren. Das neu erstellte PDF, das die Texte jetzt zum Drucken vorsehen, ist dort nicht mehr erreichbar. |
| V-15 | Verwalter | Minor | Für V-4 (keine Anzeige nach der 3. Mahnung) und V-6 (Rückfüllung nach Schweizer Tag) fehlt je ein Test. |
| V-16 | Verwalter | Nit | Die Übersicht zieht auch Abrechnungen mit Status «Versendet» von der Zahl der überfälligen ab. |
| V-17 | Verwalter | Nit | `help_payments_4` (de) ist ein langer Satz mit zwei Teilsätzen und Doppelpunkt. Die Meldung `statements_reminder_letter` («… zum Ausdrucken …») nennt das Markieren nicht. |
| V-18 | Verwalter | Nit | Eine Zeile im Status «Zu versenden» zeigt «Zahlungsfrist der Mahnung: <Datum>». Dieses Datum ändert sich beim Markieren noch. |
| V-19 | Verwalter | Nit | Wird eine Mahnung im Status «Zu versenden» erst nach Eingang der Zahlung markiert, erstellt Dwello sie trotzdem neu und setzt «Letzte Mahnung» bei einer bezahlten Abrechnung. |

Mietrecht: kein neuer Befund. Die Änderung enthält keine neue Rechtsaussage. Art. 102 Abs. 1 OR ist in Runde 1 zitiert und gilt weiter.

---

## V-13 (Major): «Nächste Mahnung möglich ab» bei bezahlter Abrechnung

**Belege**
- `src/routes/statements/[id]/PaymentPanel.svelte:47` `{#if nextReminder}`. Keine Prüfung von Status oder Saldo.
- `src/lib/statement.ts:731-734` `nextReminderLater` prüft nur `nextReminderFrom > localToday()`.
- `statement.service.ts:259-263`: `nextReminderFrom` hängt nur an den Mahnungen, nicht am Status.
- Die Liste macht es richtig: `StatementRow.svelte:61` `statement.status === 'overdue' && nextReminder`.

**Warum falsch**

Ein Beispiel: Zahlungserinnerung am 16.10., Frist 26.10. Der Mieter zahlt am 20.10., und der Vermieter markiert die Abrechnung als bezahlt. Bis zum 26.10. zeigt die Zahlungsbox «Bezahlt am 20.10.2026» und daneben «Nächste Mahnung möglich ab 27.10.2026». Das ist kein Randfall: Die meisten Mieter zahlen nach der Zahlungserinnerung innerhalb ihrer Frist. Ein unerfahrener Vermieter liest daraus, dass noch etwas offen ist. Es ist derselbe Fehler wie V-4 (eine Mahnung wird angekündigt, die es nicht geben darf). Dasselbe gilt für eine Abrechnung, deren Zahlungsfrist nach einer Mahnung verlängert wurde (Status «Versendet»).

**Behebung**

Die Zeile nur zeigen, wenn die Abrechnung den Status «Überfällig» hat und der Saldo eine Nachzahlung ist. Am besten gleich in `nextReminderLater`, damit Liste, Detailseite und `StatusActions` dieselbe Regel verwenden. Ein DOM-Test: bezahlte Abrechnung mit `nextReminderFrom` in der Zukunft zeigt `statement-next-reminder` nicht.

## V-14 (Major): Das neu erstellte PDF ist nach dem Markieren dort nicht mehr, wo der Vermieter ist

**Belege**
- Die Aufgabe «Briefe verschicken» der Übersicht führt auf `/documents?status=to_send` (`overview.ts:132`), ebenso der Filter «Zu versenden» (`documents/+page.svelte:25`).
- `documents/+page.server.ts:15-19`: Die Aktion `markSent` gibt bei Erfolg nichts zurück. Die Seite lädt `status=to_send` neu, und der markierte Brief fällt heraus. Das prüft der E2E-Step selbst: `documents.steps.ts` «in den Dokumenten als versendet markiert» erwartet `documentsFor(title, name)).toBe(0)`.
- War es der letzte Brief, zeigt die Seite «Keine Briefe zu versenden» mit «Briefe, die Sie ausdrucken und per Post schicken müssen, erscheinen hier.» (`documents_empty_to_send_text`).
- Die Texte verlangen jetzt «Markieren Sie … als versendet. Drucken Sie ihn danach aus …» (`dashboard_task_letters_text_*`, `documents_purpose`, `backend_mail_delivery_failed`, `statements_reminder_by_letter`, `help_payments_4`).
- Der Aufrufer schreibt: «The PDF download stays on the row after marking». Das stimmt nur im Filter «Alle».

**Warum falsch**

Der Vermieter folgt der Aufgabe, markiert den Brief, und der Brief ist weg. Den zweiten Schritt («danach ausdrucken») kann er dort nicht tun. Er muss selbst erkennen, dass der Brief unter «Alle» steht. Schlimmer ist die naheliegende Ausweichhandlung: Er hat sich den Brief schon vorher heruntergeladen (der Knopf «PDF herunterladen» steht in derselben Zeile wie «Als versendet markieren») und druckt diesen. Dann erhält der Mieter den Brief mit dem alten Datum und der alten Frist. Das ist genau der Fall, den V-1 und die «Done means» von #193 ausschliessen sollen. Punkt 2 der Behebung von V-1 («Nach dem Markieren bietet die Zeile oder die Erfolgsmeldung direkt ‹PDF herunterladen› mit dem neuen PDF an») ist damit nicht erfüllt.

**Behebung**

Die Aktion `markSent` gibt bei Erfolg Id und Titel zurück. Die Seite zeigt dann eine Erfolgsmeldung mit einem Knopf zum neuen PDF, etwa «Die {title} an {name} ist als versendet markiert. Dwello hat sie auf heute datiert. Drucken Sie sie jetzt aus und schicken Sie sie heute.» mit «PDF herunterladen». Das passt zur Bestätigung von V-5. Ein E2E- oder DOM-Test: Nach dem Markieren unter «Zu versenden» ist der Link zum PDF des markierten Briefs sichtbar. Neue Texte in allen vier Sprachen.

## V-15 (Minor): Tests für V-4 und V-6 fehlen

**Belege**
- `reminders.pg.test.ts`: Kein Test prüft `nextReminderFrom === null` nach der 3. Mahnung. «lehnt eine 4. Mahnung ab» prüft nur die Ablehnung.
- Kein Test für die Rückfüllung in `0007_reminder_payment_deadline.sql`.

**Warum**

Bei beiden Regeln ist ein stiller Rückfall leicht möglich: `count(*) < 3` im SQL und die Zeitzone in der Migration. Ein Fehler wäre wieder genau die falsche Ankündigung aus V-4 oder eine Sperre, die einen Tag daneben liegt.

**Behebung**

Im Block «Mahnung per Brief» nach der 3. Mahnung `GET /statements/:id` lesen und `nextReminderFrom` gleich `null` erwarten. Für die Migration einen pg-Test mit `created_at = '2026-10-15 22:30:00'` (UTC, Schweizer Tag 16.10.): erwartet `payment_deadline = 2026-10-26`, nicht 25.10.

## V-16 (Nit): Abzug in der Übersicht auch für Abrechnungen mit Status «Versendet»

**Beleg**: `dashboard/+page.server.ts:141` übergibt `[...overdue, ...sent]` als `dueStatements`. `overview.ts:110-112` zieht von `statementCounts.overdue` jede Abrechnung darin ab, deren `nextReminderFrom` in der Zukunft liegt.

**Warum**: Wurde die Zahlungsfrist einer schon gemahnten Abrechnung verlängert (Status wieder «Versendet»), sinkt die Zahl der überfälligen, ohne dass diese Abrechnung darin war. Im Extremfall verschwindet die Aufgabe für eine andere, wirklich überfällige Abrechnung.

**Behebung**: Nur Abrechnungen abziehen, deren `paymentDeadline < today` ist (also überfällig). Oder die Abrechnungen mit Status «Überfällig» getrennt übergeben.

## V-17 (Nit): Satzlänge und eine nicht angepasste Meldung

- `messages/de.json:83` `help_payments_4`: «Markieren Sie einen Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet, und drucken Sie ihn danach aus: Erst dann trägt er das Datum dieses Tages und eine neue Zahlungsfrist.» Die Copy-Regel verlangt kurze Sätze. Vorschlag: «Briefe erscheinen unter «Dokumente». Markieren Sie einen Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet. Dwello setzt dann das heutige Datum und eine neue Zahlungsfrist ein. Drucken Sie den Brief danach aus.»
- `messages/de.json:1000` `statements_reminder_letter`: «{title} liegt als Brief zum Ausdrucken in den Dokumenten bereit.» Diese Erfolgsmeldung sieht der Vermieter direkt nach «Mahnung senden». Sie lädt zum Ausdrucken ein, ohne das Markieren zu nennen. Vorschlag: «{title} liegt unter «Dokumente» zum Versand bereit. Markieren Sie sie dort am Tag, an dem Sie sie zur Post bringen, als versendet, und drucken Sie sie danach aus.» Der Satz steht im Szenario «Mahnung per Brief» (`statement-reminder.feature:35`), das Szenario müsste mit.

## V-18 (Nit): Vorläufige Frist auf einem Brief im Status «Zu versenden»

**Beleg**: `DocumentItem.svelte:45-49` zeigt `paymentDeadline` für jeden Brief, auch im Status «Zu versenden». `markDocumentPosted` setzt beim Markieren eine neue Frist.

**Warum**: Der Vermieter sieht «Zahlungsfrist der Mahnung: 25.10.2026», und nach dem Markieren steht dort ein anderes Datum. `documents_purpose` erklärt das zwar, aber an der Zeile steht nichts. Das hängt mit #277 und #278 zusammen.

**Behebung**: Die Frist erst bei versendeten Briefen zeigen. Oder bei «Zu versenden» schreiben: «Zahlungsfrist: 10 Tage ab dem Tag, an dem Sie den Brief als versendet markieren».

## V-19 (Nit): Markieren einer Mahnung nach Eingang der Zahlung

**Beleg**: `reminder.service.ts:231-239` prüft den Status der Abrechnung nicht. Bei einer bezahlten Abrechnung erstellt die Funktion den Brief trotzdem neu und setzt `reminderSentDate = today` (`updateStatement`).

**Warum**: Ein Verwalter schickt keine Mahnung, nachdem das Geld eingegangen ist. Markiert der Vermieter sie trotzdem (etwa weil der Brief schon zur Post ging), zeigt die bezahlte Abrechnung «Letzte Mahnung» nach «Bezahlt am».

**Behebung**: Ein Fall für V-5: Die Bestätigung nennt bei einer bezahlten Abrechnung «Diese Abrechnung ist bereits bezahlt. Verschicken Sie die Mahnung nicht, sondern löschen Sie sie.» Andernfalls als bekannte Grenze stehen lassen.

---

## Bestätigt

- **Fristrechnung** im fertigen Code: `reminderOn` setzt die Frist als Briefdatum + `PAYMENT_DAYS`, `nextReminderFrom` = `max(payment_deadline) + 1`, und `REMINDER_TOO_EARLY` greift bei `from > swissToday()` (`reminder.service.ts:151-158,166`). Nachgerechnet:
  - Brief 16.10.2026: Frist 26.10.2026, nächste Mahnung ab 27.10.2026. Am 26.10. abgelehnt mit `deadline = daysAfter(27.10., -1) = 26.10.`, am 27.10. erlaubt. Der pg-Test prüft beide Grenzen (`reminders.pg.test.ts` «… solange die Zahlungsfrist … läuft» mit Frist = heute, «… ab dem Tag nach …» mit Frist = gestern).
  - Monatsende 25.10.2026: Frist 04.11.2026, ab 05.11.2026. Jahreswechsel 25.12.2026: Frist 04.01.2027, ab 05.01.2027.
  - #193, erstellt 7 Tage vor heute, heute markiert: Das PDF trägt das heutige Datum und die Frist heute + 10 und nicht mehr den Erstellungstag. `reminderSentDate` ist heute. Ein zweites Markieren ändert nichts mehr. Der pg-Test «Brief, der später versendet wird» prüft alle drei Punkte am PDF-Text.
  - Null-Fall: Keine Mahnung ergibt `max(null) + 1 = null`, keine Sperre, keine Zeile. Nach 3 Mahnungen: `null`.
- **#194**: `markDocumentSent(id, { …, channel: 'letter' })` gilt nur für eine Mahnung im Status «Zu versenden». Eine schon per E-Mail versendete Mahnung behält «E-Mail». Der pg-Test und das Szenario prüfen den Kanal «Brief». Der neu erstellte Brief für die gescheiterte E-Mail trägt das Datum des Postversands. Das ist richtig, weil erst dieser Brief den Mieter erreicht.
- **REMINDER_TOO_EARLY** in vier Sprachen: Daten kommen als `YYYY-MM-DD` und werden im Frontend ins Schweizer Format gesetzt (`backend-error.ts:27`, Test in `backend-error.test.ts`).
- **Übersetzungen gegen `docs/design/i18n-begriffe.md`**: «Zahlungsfrist» = délai de paiement / termine di pagamento / payment deadline. «Mahnung» = rappel / sollecito / reminder. «Als versendet markieren» = marquer comme envoyé / segnare come inviato / mark as sent. «Brief» = lettre / lettera / letter. Alle neuen und geänderten Texte verwenden diese Wörter. Die Anrede ist durchgehend formell (vous, Lei). Im Französischen stehen schmale Leerzeichen (U+00A0) vor «:» und innerhalb der Guillemets. Im Italienischen stehen Guillemets ohne Leerzeichen. «dès le {date}», «dal {date}» und «from {date}» sind sprachlich richtig.
- **Begriffe (de)**: «Nächste Mahnung möglich ab» und «Zahlungsfrist der Mahnung» verwenden Mahnung als Oberbegriff, der die Zahlungserinnerung einschliesst (`UBIQUITOUS_LANGUAGE.md:182-183`). «Mahnfrist» kommt nirgends vor, wie von #107 verlangt. Die zweite Bedeutung von «Zahlungsfrist» ist mit #277 und dem Marker korrekt als offen gekennzeichnet.
- **Nur zwei Dokumenttypen** (`schema.ts:484`: `reminder`, `upload`): Jeder Brief unter «Zu versenden» ist eine Mahnung. Die Texte, die allgemein von «Brief … neue Zahlungsfrist» sprechen, stimmen deshalb heute.

## Nicht bestätigt

- **Zeitzone von `created_at` in Produktion**: Die Rückfüllung (V-6) setzt voraus, dass `created_at` in UTC gespeichert ist. Lokal liefert `show timezone` den Wert `Etc/UTC`, und der Vertrag `tests/contracts/documents.json` zeigt `…Z`. Die Docker- oder Produktionskonfiguration (TimeZone des PostgreSQL-Servers) habe ich nicht eingesehen: `grep` in `backend/src/db`, `docker-compose*`, `Dockerfile*` fand keine Einstellung. Läuft ein Server mit einer anderen `TimeZone`, liegt die Rückfüllung um bis zu einen Tag daneben.
- **Ob `paymentDeadline` einer versendeten Abrechnung über die API änderbar ist** (Voraussetzung für V-16 und den zweiten Fall von V-13): Ich habe gesehen, dass `routes/statements.ts:162,182` das Feld annimmt. Ob der Service es nach dem Versand noch erlaubt, habe ich nicht geprüft. V-16 bleibt deshalb ein Nit.
- **E2E-Lauf und Bildschirm `statement-reminded-detail`** (axe und Sprachen): nicht ausgeführt. Die Seed-Daten (`tests/e2e/fixtures/screens.ts:68-73`) ergeben fachlich eine überfällige Abrechnung mit laufender Frist der Zahlungserinnerung. Das passt.
- **Rechtliches**: keine neue Aussage. Die in Runde 1 als unsicher markierten Punkte (Art. 102 Abs. 2 OR, Wirkung der Mahnung erst mit Empfang) bleiben unsicher.
