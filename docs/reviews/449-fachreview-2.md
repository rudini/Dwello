# Fach-Review #449, Runde 2 (Entscheide vom 2026-10-20)

Gegenstand: Worktree `review-449-fach2`, Commit bb965442, Delta `git diff 156ab50f bb965442` (nur Tests, Szenarien, Vertrag; kein Produktionscode). Vorheriger Bericht: `docs/reviews/449-fachreview-1.md`. Rollen: Verwalter, Mietrecht. Rechtstexte sind nicht betroffen.

## Status der IDs aus Runde 1 (nur die entschiedenen)

| ID | Status |
|---|---|
| V-1 | Entschieden (Koordinator). Abgedeckt durch `overview.test.ts` («zählt keine Abrechnung, deren letzte Mahnung noch zu versenden ist») und den pg-Test `reminderToSend`. Erledigt, sobald beide grün sind |
| V-2 | Entschieden (A). Szenarien und pg-Test passen. Die abgeleitete Anzeige nach «Zahlung zurücksetzen» ist **bestätigt** (siehe unten). Neu: N-1, N-2, N-3, N-5 |
| V-3 | Entschieden (A). Der DOM-Test prüft den ganzen Satz (`toBe`), das ist in Ordnung. Texte fr/it/en unten |
| V-4 | Entschieden (Ablehnung). Szenario und pg-Test passen. Offen ist die Anzeige in «Zu versenden»: N-1 |
| M-1 | Entschieden (A und B). DOM-Test und statement-send.feature haben den zweiten Satz. Das Issue #534 gibt es. Erledigt |
| V-5 | #532 ist offen. Ihm fehlt aber der neue Begriff aus V-2: N-4 |
| V-6 | Entschieden. `reminder-letter.test.ts` prüft den de-Satz. fr/it/en aus Runde 1 bleiben unverändert (unten) |
| V-7 | Entschieden. Der Satz stimmt nur, weil #491 im selben PR umgesetzt wird (Brief ohne PDF wird abgelehnt). Sonst entstünde ohne PDF kein Dokument. Bestätigt unter dieser Bedingung |
| V-9 | Entschieden. Im DOM-Test enthalten. Erledigt |
| V-10 | it «spedisca» bei der Ablehnung: in N-6 berichtigt |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| N-1 | Verwalter | Major (Entscheid) | Die Mahnung einer ersetzten Abrechnung bleibt für immer «Zu versenden». Ebenso die Mahnung einer bezahlten Abrechnung, die danach ersetzt wird: Sie taucht wieder in «Zu versenden» auf. Empfehlung: analog V-2 A ausblenden, Zeile «Nicht mehr versenden: Abrechnung ersetzt» |
| N-2 | Verwalter | Major | Die Mieterseite (`TenantDocumentRow.svelte:27–30`) zeigt die Mahnung einer bezahlten Abrechnung weiter als «Zu versenden». Das widerspricht der Liste «Dokumente», und der Verwalter druckt den Brief womöglich doch aus |
| N-3 | Verwalter | Minor | `MarkSentButton.svelte:12` bietet «Als versendet markieren» weiter an, obwohl die Zeile «Nicht mehr versenden» sagt (Gegenstück zu V-1). Den Knopf ausblenden, wenn die Abrechnung bezahlt oder ersetzt ist. Das Szenario mit der veralteten Seite bleibt für die Ablehnung |
| N-4 | Verwalter | Minor | Der Marker `TODO(fachlich prüfen, #532)` nennt ein Issue, das den Begriff «Nicht mehr versenden» nicht enthält. Den Vorschlag unten (Fehlende Begriffe) in #532 ergänzen |
| N-5 | Verwalter | Minor | Kein Test hält fest, dass der Brief nach «Zahlung zurücksetzen» wieder «Zu versenden» zählt und sich markieren lässt. Fix: ein pg-Test (bezahlt, dann zurückgesetzt: wieder in `status=to_send`, `PUT …/sent` gibt 200) |
| N-6 | Verwalter | Minor | Ablehnung bei ersetzter Abrechnung: fr muss «décompte rectificatif» heissen (i18n-begriffe.md:87), nicht «rectifié». it «Non spedisca più», wie im entschiedenen Text von REMINDER_STATEMENT_PAID, nicht «invii». Korrigierte Fassung unten |
| N-7 | Verwalter | Nit | Das Badge `DocumentItem.svelte:51` hat bei «Zu versenden» den Ton `caution`. «Nicht mehr versenden» sollte neutral sein, sonst wirkt die Zeile wie eine Aufgabe. Zusätzlich die Zeile «Zahlungsfrist …» (`documents_payment_deadline`) für diese Briefe weglassen |
| N-8 | Verwalter | Nit | V-7: Im Brief-Dialog steht nun zweimal «danach» hintereinander («… markieren Sie die Abrechnung danach als versendet. Dwello legt sie danach …»). Der Text ist entschieden, also nur ein Hinweis an den Product Owner: «dann» wäre flüssiger |

## Blocker und Major im Einzelnen

### N-1: Mahnung einer ersetzten Abrechnung (Frage 2) – Produktentscheid
- **Beleg:** Entscheid V-4: «Als versendet markieren» wird abgelehnt (REMINDER_STATEMENT_REPLACED). `document.service.ts:122–129`: Eine Mahnung lässt sich nicht löschen. `statement.service.ts:690–700` (`replaceStatement`): `replaced` ist endgültig, es gibt keinen Weg zurück, und auch eine bezahlte Abrechnung (`paid`) lässt sich ersetzen. Der pg-Test zu V-2 leitet die Anzeige aus `statementPaid` ab. Wird eine bezahlte Abrechnung ersetzt, ist sie nicht mehr `paid`, und ihr Brief zählt wieder als «Zu versenden». Glossar UBIQUITOUS_LANGUAGE.md:199: «**Ersetzt** … wird nicht gemahnt».
- **Warum falsch:** Es ist dieselbe Sackgasse, die V-2 für bezahlte Abrechnungen behebt. Der Brief lässt sich weder markieren noch löschen, und die Aufgabe «Briefe zu versenden» (`overview.ts:167`, `dashboard/+page.server.ts:175`) geht nie weg. Beim Ersetzen einer bezahlten Abrechnung würde ein Brief, den V-2 schon ausgeblendet hat, sogar wieder auftauchen.
- **Frage an den Product Owner:**
  - A: wie V-2 A. Der Brief bleibt unter «Dokumente», zählt aber nicht als «Zu versenden» (weder in der Aufgabe noch im Filter). Die Zeile sagt «Nicht mehr versenden: Abrechnung ersetzt». Ist die Abrechnung bezahlt und ersetzt, gilt «ersetzt», denn das ist der aktuelle Status.
  - B: Die Ablehnung allein. Der Brief bleibt dann für immer «Zu versenden».
  - **Empfehlung: A.** Die Ableitung kostet keinen neuen Status. Statt `statementPaid: boolean` liefert das Backend besser ein Feld für beide Fälle, z. B. `notToSend: 'paid' | 'replaced' | null`. Dazu ein Szenario: «Eine Mahnung einer ersetzten Abrechnung geht nicht mehr hinaus» (Zeile «Nicht mehr versenden: Abrechnung ersetzt», nicht bei den zu versendenden Dokumenten). Und ein pg-Test für den Fall «bezahlt, dann ersetzt».

### N-2: Die Mieterseite zeigt weiter «Zu versenden»
- **Beleg:** `src/routes/tenants/[id]/TenantDocumentRow.svelte:27–30`: `document.status === 'to_send' ? m.tenants_document_to_send() : …`. Der Entscheid V-2 A sagt «its row says «Nicht mehr versenden: Abrechnung bezahlt»». Die Szenarien prüfen nur die Liste «Dokumente».
- **Warum falsch:** Ein Brief erscheint auf zwei Seiten mit zwei verschiedenen Status. Der Verwalter sieht beim Mieter «Zu versenden», lädt das PDF herunter und schickt einem Mieter, der bezahlt hat, eine Mahnung. Genau das sollen Punkt 3 und V-2 verhindern.
- **Fix:** Die Mieterseite bekommt dieselbe abgeleitete Zeile wie `DocumentItem.svelte`, am besten aus einer gemeinsamen Funktion. Dazu ein DOM-Test der Mieterseite oder ein Schritt im Szenario («Dann führen die Dokumente von "Anna Keller" …»). Gilt auch für N-1.

## Bestätigt (mit Quelle)

- **Frage 1, V-2 A, nach «Zahlung zurücksetzen»:** Bestätigt. Die abgeleitete Anzeige ist hier richtig. Glossar UBIQUITOUS_LANGUAGE.md:208: «Nimmt eine falsch erfasste Zahlung … zurück … der Status wird wieder Versendet bzw. Überfällig.» Die Forderung ist dann wieder offen, und die Mahnung setzt eine fällige Verbindlichkeit voraus (Art. 102 Abs. 1 OR, Fedlex SR 220, in Runde 1 zitiert: «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.»). Der vorbereitete Brief ist also wieder gültig. Er geht auch nicht veraltet hinaus: `markDocumentPosted` (`reminder.service.ts:154–161`) erstellt ihn beim Markieren neu, mit dem heutigen Datum, einer neuen Zahlungsfrist und dem aktuellen Saldo. Zwei Beispiele: (a) Mahnung erstellt am 01.10.2026, bezahlt erfasst am 03.10.2026, zurückgesetzt am 10.10.2026, markiert am 12.10.2026: Der Brief trägt den 12.10.2026, die Frist endet am 22.10.2026, die nächste Stufe ist ab dem 23.10.2026 möglich. (b) Grenzfall «bezahlt, dann ersetzt»: Zurücksetzen geht nicht mehr (`resetPayment` verlangt `paid`), deshalb N-1. Zur Übersicht (V-1): Nach dem Zurücksetzen gilt `reminderToSend` wieder, die Abrechnung wartet, und es wird keine zweite Mahnung vorgeschlagen. Das passt zusammen.
- **Szenarien V-2:** Die Trennung in «geht nicht mehr hinaus» (frische Liste) und «lässt sich nicht als versendet markieren» (Liste offen, dann bezahlt) ist richtig. Den Schritt «ist bei den zu versendenden Dokumenten» erreicht man nur vor der Zahlung. Der Schritt «nicht mehr bei den zu versendenden Dokumenten» prüft zuerst den Seitentitel und dann 0 Treffer. Das ist richtig, denn so ergibt eine leere Seite kein falsches Grün.
- **pg-Test V-2:** `status` bleibt `to_send` (kein neuer Status), `statementPaid: true`. Das entspricht dem Plan. Zur Form des Felds siehe N-1.
- **V-4 Text de:** «Die Abrechnung ist durch eine berichtigte Abrechnung ersetzt.» entspricht den Glossarbegriffen «Berichtigte Abrechnung» (Z. 185) und «Ersetzt» (Z. 199).
- **Vertrag `reminder-paid-refused.json`:** Code und `params: {}` passen zum entschiedenen Text ohne Platzhalter.
- **M-1, zweiter Satz:** Er ist inhaltlich richtig, wenn auch nur ein Hinweis: Dwello schlägt die Mahnung weiter nach der gespeicherten Frist der E-Mail vor. Der Rest liegt in #534.
- **V-6:** Der Satz verweist auf `payBy` (`reminder-letter.ts:39`, 58, 77, 96). Dieser Absatz steht im Brief darunter (Z. 126), und er nennt ein Datum. «unten genannte Frist» stimmt also in allen vier Sprachen.

## Fehlende Begriffe (Vorschlag; in #532 ergänzen, Labels `fachlich`, `entscheiden`)

- **Nicht mehr versenden:** «Anzeige bei einer Mahnung «Zu versenden», deren Abrechnung bezahlt oder ersetzt ist, bevor der Brief zur Post ging. Der Brief bleibt unter «Dokumente», zählt aber nicht als «Zu versenden» und lässt sich nicht als versendet markieren. Wird die Zahlung zurückgesetzt, ist er wieder «Zu versenden». Kein eigener Versandstatus.» (Anzeige, kein Feld)
- Bei **Mahnung** ergänzen (zum Vorschlag in #532): «… einer inzwischen bezahlten oder ersetzten Abrechnung lässt sich nicht mehr als versendet markieren.»

## Texte fr/it/en (Begriffe nach docs/design/i18n-begriffe.md; fr: Guillemets und Doppelpunkt mit U+00A0, wie in messages/fr.json; it, en wie in den Dateien)

**backend_reminder_statement_replaced** (de entschieden)
- fr: «Le décompte a été remplacé par un décompte rectificatif. N’envoyez plus ce rappel.» (i18n-begriffe.md:87 «décompte rectificatif», :88 «remplacé»)
- it: «Il conteggio è stato sostituito da un conteggio rettificato. Non spedisca più questo sollecito.» (:87, :88; «spedisca» wie im entschiedenen Text von REMINDER_STATEMENT_PAID)
- en: «The statement has been replaced by a corrected statement. Do not send this reminder any more.» (:87, :88)

**Zeile «Nicht mehr versenden: Abrechnung bezahlt»** (de entschieden)
- fr: «Ne plus envoyer : décompte payé» (U+00A0 vor dem Doppelpunkt)
- it: «Non più da inviare: conteggio pagato» («da inviare» wie «Zu versenden», :99)
- en: «Do not send any more: statement paid»
- Falls N-1 A: de «Nicht mehr versenden: Abrechnung ersetzt» · fr «Ne plus envoyer : décompte remplacé» · it «Non più da inviare: conteggio sostituito» · en «Do not send any more: statement replaced»

**V-3, angehängt an statements_reminder_no_email**
- fr: «Le document « {next} » est en {language}. Marquez-y la lettre comme envoyée le jour où vous la postez.»
- it: «Il documento «{next}» è in {language}. Lì segni la lettera come inviata il giorno in cui la porta alla posta.»
- en: ««{next}» is in {language}. Mark the letter as sent there on the day you post it.»
- (Die Wortlaute folgen `statements_reminder_by_letter`; {language} in fr/it klein geschrieben, wie in Runde 1)

**M-1, zweiter Satz von statements_send_email_bounce**
- fr: «Dans ce cas, n’envoyez un rappel qu’une fois que le locataire a reçu le décompte par lettre et que le délai de paiement a ensuite expiré.»
- it: «In tal caso, invii un sollecito solo quando l’inquilino ha ricevuto il conteggio per lettera e il termine di pagamento è poi scaduto.»
- en: «In that case, only send a reminder once the tenant has received the statement by letter and the payment deadline has then passed.»
- («Mahnen» als «envoyer un rappel / inviare un sollecito / send a reminder», wie der Knopf «Mahnung senden»)

**V-6, 3. Mahnung** (aus Runde 1 unverändert)
- fr: «Si le montant ne nous parvient pas dans le délai indiqué ci-dessous, nous nous verrons contraints d’entreprendre d’autres démarches.»
- it: «Se l’importo non ci perverrà entro il termine indicato qui sotto, dovremo adottare ulteriori provvedimenti.»
- en: «If the amount is not received by the deadline below, we will have to take further steps.»

**V-7, angehängt an statements_send_text_1**
- fr: «Dwello le classe ensuite sous « Documents ».» («le» = le décompte)
- it: «Dwello lo archivia poi in «Documenti».» («lo» = il conteggio)
- en: «Dwello then files it under «Documents».»

**V-9, Versanddialog ohne Adresse**
- fr: «Aucune adresse e-mail n’est saisie pour {tenant}.»
- it: «Per {tenant} non è registrato alcun indirizzo e-mail.»
- en: «No email address has been added for {tenant}.»
- (wie `statements_no_email` und die Fassung von `statements_reminder_no_email` aus Runde 1)

## Nicht bestätigt

- **Tests nicht ausgeführt:** Der Delta besteht nur aus roten Tests ohne Produktionscode. Ich habe sie gelesen, aber nicht laufen lassen (dafür hätte es `TEST_DATABASE_URL=…/dwello_test_r449g` gebraucht). Ob sie aus dem richtigen Grund rot sind, habe ich nur durch Lesen geprüft.
- **Teilzahlung:** Eine Teilzahlung wird als bezahlt erfasst (#523, offen, `entscheiden`). Dann zeigt der Brief «Nicht mehr versenden: Abrechnung bezahlt», obwohl noch Geld offen ist. Das ist kein neuer Befund, denn er hängt an #523. Entscheidet #523 anders, muss die Ableitung folgen.
- **Wo der Plan die Zeile anzeigt:** Der Plan sagt «die Liste aller Dokumente». Ob er die Mieterseite einschliesst, steht nicht im Delta. Deshalb N-2. Ich habe in `src/routes` nach `to_send` gesucht: Den Status zeigen nur `DocumentItem.svelte` und `TenantDocumentRow.svelte`.
- **Fedlex:** In dieser Runde gibt es keine neue Rechtsfrage. Art. 102 Abs. 1 OR stammt aus Runde 1 (Fedlex SR 220, Fassung vom 1.1.2026). Den fr/it-Wortlaut des OR habe ich nicht abgerufen; die Begriffe stammen aus i18n-begriffe.md (#405).
