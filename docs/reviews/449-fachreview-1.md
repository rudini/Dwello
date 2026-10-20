# Fach-Review #449, Runde 1 (Szenarien und rote Tests vor der Umsetzung)

Gegenstand: Worktree `review-449-fach`, Commit 156ab50f, Basis 6b99011e (`git diff 6b99011e 156ab50f`), dazu die geplante Umsetzung (Punkte 1 bis 8) und die Texte aus dem Auftrag. Rollen: Verwalter, Mietrecht. Rechtstexte sind nicht betroffen: Die neue Spalte `documents.recipient` und das abgelegte Brief-PDF bleiben auf dem Server, es geht keine Personendaten auf einem neuen Weg hinaus.

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Übersicht und Detailseite bieten die nächste Mahnstufe weiter an, solange die vorige Mahnung «Zu versenden» ist; danach lehnt das Backend sie ab (Punkt 2) |
| V-2 | Verwalter | Major (Entscheid) | Die Mahnung einer bezahlten Abrechnung bleibt für immer «Zu versenden»: Sie lässt sich weder markieren noch löschen, und die Aufgabe «Briefe zu versenden» geht nie weg |
| V-3 | Verwalter | Major (Entscheid) | Ohne E-Mail-Adresse nennt der Mahnungs-Dialog die Sprache nicht und sagt nicht, dass der Brief als versendet zu markieren ist. Das widerspricht Punkt 4 und dem «Done means» des Issues |
| V-4 | Verwalter | Major (besteht schon auf der Basis, Entscheid) | Die Mahnung einer ersetzten Abrechnung lässt sich weiter als versendet markieren und wird dann mit dem alten Saldo neu erstellt. Glossar: «Ersetzt … wird nicht gemahnt» |
| M-1 | Mietrecht | Major (Entscheid) | Der Hilfetext zur unzustellbaren E-Mail schickt den Brief nach, aber Abrechnungsdatum und Zahlungsfrist bleiben die der E-Mail, die nie angekommen ist (Art. 4 Abs. 1 VMWG «vorlegen») |
| V-5 | Verwalter | Minor | Glossar-Zeile «Zahlungsfrist einer Mahnung» (UBIQUITOUS_LANGUAGE.md:209) und Anforderungen Punkt 11 (docs/nebenkostenabrechnung-anforderungen.md:152) sagen nichts mehr vom Versand der vorigen Mahnung: Wortlaut unten, Issue nötig |
| V-6 | Verwalter | Minor | 3. Mahnung: Nach dem Streichen von «umgehend» folgen zwei Bitten aufeinander (reminder-letter.ts:36, dann `payBy`). Der Wortlaut ist zulässig. Eine bessere Fassung mit Bezug auf die Frist steht unten (sie braucht einen Entscheid) |
| V-7 | Verwalter | Minor | Der Brief-Dialog (`statements_send_text_1`, messages/de.json:1264) sagt nicht, dass Dwello die Abrechnung jetzt unter «Dokumente» ablegt. Vorschlag: anhängen «Dwello legt sie danach unter «Dokumente» ab.» |
| V-8 | Verwalter | Minor | Das abgelegte Brief-PDF wird beim Markieren neu erstellt (statement.service.ts:635–645). Es gleicht dem Papier nur, wenn am Tag des Drucks markiert wird. `statements_send_text_2` sagt das schon; in der PR-Beschreibung «wie versendet» so einschränken |
| V-9 | Verwalter | Minor | Ohne E-Mail-Adresse zeigt der Versanddialog nur den Brief, sagt aber nicht warum. Vorschlag: den Satz «Für {tenant} ist keine E-Mail-Adresse erfasst.» aus `statements_reminder_no_email` übernehmen |
| V-10 | Verwalter | Minor | fr/it/en-Vorschläge: it «spedito» statt des Begriffs «inviato» (i18n-begriffe.md:132 «Segnare come inviato»), fr «n’est pas encore envoyé», en «The «Payment reminder»» mit Artikel. Korrigierte Fassungen unten |
| V-11 | Verwalter | Nit | de/fr/it-UI zeigen jedes Untergeschoss gleich («UG», «sous-sol»), das PDF aber «2. UG». `floorOptions` mit −2 listet zwei gleiche «UG» (apartment.ts:17–30). Besteht schon auf der Basis; eigenes Issue |
| V-12 | Verwalter | Nit | Eine Abrechnung, die vor #449 oder (bis #491) ohne PDF per Brief versendet wurde, hat kein Dokument: Der Verlauf soll dann «Versendet» zeigen, nicht «Versendet per Brief». Im Plan festhalten |

## Blocker und Major im Einzelnen

### V-1: Nächste Mahnstufe wird angeboten, aber abgelehnt
- **Beleg:** `src/lib/overview.ts:142–148`: `waiting()` stützt sich nur auf `nextReminderFrom`. `backend/src/services/statement.service.ts:55–59`: `max(paymentDeadline) + 1` über alle Mahnungen, auch die «Zu versenden». `src/lib/statement.ts:61–63` (`nextReminderLater`) ebenso. Ein Beispiel: Die Zahlungserinnerung entsteht am 01.10.2026 und bleibt «Zu versenden», ihre Frist endet am 11.10.2026. Am 20.10.2026 zählt die Übersicht die Abrechnung unter «Überfällig» (zu mahnen), und die Detailseite bietet «2. Mahnung senden» an. Nach Punkt 2 lehnt das Backend mit REMINDER_PREVIOUS_NOT_SENT ab.
- **Warum falsch:** Dwello schlägt eine Handlung vor, die seine eigene Regel verbietet. Ein Verwalter mit wenig Übung folgt der Aufgabe und bekommt eine Ablehnung. Dieselbe Abrechnung steht ausserdem schon unter «Briefe zu versenden».
- **Fix:** Eine Abrechnung mit einer Mahnung «Zu versenden» gilt in der Übersicht als wartend. Am einfachsten liefert `nextReminderFrom` für sie `null`/«nach Versand», und `waiting()` behandelt sie als wartend. Die Detailseite sagt statt «2. Mahnung senden»: «Markieren Sie zuerst die {Mahnstufe} unter «Dokumente» als versendet.» Die Detailseite darf den Knopf auch behalten, die Ablehnung nennt ja den Ausweg. Die Übersicht darf die Aufgabe aber nicht vorschlagen. Dazu ein Unit-Test für `overview.ts`.

### V-2: Mahnung nach der Zahlung bleibt für immer «Zu versenden» (Produktentscheid)
- **Beleg:** Szenario statement-reminder.feature, letzte Zeile: «liegt die "Zahlungserinnerung" … weiter bei den zu versendenden Dokumenten». `document.service.ts:122–129`: Eine Mahnung lässt sich nicht löschen (DOCUMENT_NOT_DELETABLE). `src/routes/dashboard/+page.server.ts:175,209`: `documents?status=to_send` zählt in die Aufgabe «Briefe zu versenden». Vor dieser Änderung liess sich der Brief noch markieren (dann ohne Zahlteil); jetzt hat er keinen Ausgang mehr.
- **Warum falsch:** Die Aufgabe in der Übersicht lässt sich nie erledigen, und die Liste «Zu versenden» führt einen Brief, den Dwello nicht abzuschicken erlaubt. Der Entscheid «The letter stays in «Dokumente»» schliesst einen Ausgang nicht aus.
- **Frage an den Product Owner:**
  - A: Der Brief bleibt unter «Dokumente», zählt aber nicht mehr als «Zu versenden» (nicht in der Aufgabe, nicht im Filter). Die Zeile zeigt «Nicht mehr versenden: Abrechnung bezahlt». Neuer Glossarbegriff nötig, Vorschlag unten.
  - B: Ein neuer Versandstatus «Nicht versendet» (`cancelled`), den Dwello bei der Zahlung setzt; «Zu versenden» zählt ihn nicht.
  - C: so lassen (die Aufgabe bleibt stehen).
  - **Empfehlung: A** (kein neuer Status in der Datenbank, der Entscheid bleibt erfüllt). Das Szenario prüft dann «liegt weiter unter «Dokumente»» statt «bei den zu versendenden Dokumenten».

### V-3: Mahnung ohne E-Mail-Adresse nennt die Sprache nicht und nicht das Markieren (Produktentscheid)
- **Beleg:** `src/__tests__/statement-pages.dom.test.ts` (neuer Test «sagt vor der Mahnung, wenn … keine E-Mail-Adresse»): `textContent` muss *genau* der entschiedene Satz sein, also ohne Sprache und ohne Hinweis zum Markieren. Issue #449 «Done means»: «The «Mahnung senden» dialog names the language of the reminder; for a tenant with channel «E-Mail» and no address it says so before sending.» `reminder.service.ts:155–161`: Erst beim Markieren entsteht der Brief neu, mit Datum und Frist. Nach Punkt 2 sperrt ein unmarkierter Brief die nächste Mahnstufe.
- **Warum falsch:** Ausgerechnet im Briefweg ohne E-Mail erfährt der Verwalter die Sprache nicht. Er erfährt auch nicht, dass er den Brief am Tag der Post markieren muss. Ohne diese Markierung stimmt die Frist im Brief nicht, und die nächste Mahnstufe bleibt gesperrt.
- **Frage an den Product Owner:**
  - A: Der entschiedene Satz bleibt unverändert; danach folgen die Sprache und die Anleitung aus `statements_reminder_by_letter`: «Für {tenant} ist keine E-Mail-Adresse erfasst. Dwello erstellt die Mahnung als PDF. Sie liegt danach unter «Dokumente» zum Ausdrucken. Die {next} ist auf {language}. Markieren Sie den Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet.»
  - B: Der entschiedene Satz wird angepasst: «… Dwello erstellt die {next} auf {language} als PDF. …» plus der Satz zum Markieren.
  - C: so lassen (Sprache fehlt in diesem Fall).
  - **Empfehlung: A** (lässt den entschiedenen Wortlaut stehen). Der DOM-Test prüft dann mit `toContain` statt `toBe`.

### V-4: Mahnung einer ersetzten Abrechnung lässt sich versenden (besteht schon auf der Basis)
- **Beleg:** `reminder.service.ts:154–161` (`markDocumentPosted`) prüft den Status der Abrechnung nicht und erstellt den Brief mit `statement.balance` und der QR-Referenz der alten Abrechnung neu. Glossar UBIQUITOUS_LANGUAGE.md:199: «**Ersetzt** … wird nicht gemahnt». Die Prüfung REMINDER_STATEMENT_PAID entsteht genau an dieser Stelle.
- **Warum falsch:** Der Mieter erhält eine Mahnung über einen Betrag, den die berichtigte Abrechnung ersetzt hat, und bezahlt womöglich mit dem Zahlteil der alten Abrechnung.
- **Fix (Produktentscheid zum Text):** Bei `replaced` ablehnen, mit dem neuen Code REMINDER_STATEMENT_REPLACED. Vorschlag de: «Die Abrechnung ist durch eine berichtigte Abrechnung ersetzt. Schicken Sie diese Mahnung nicht mehr ab.» fr: «Le décompte a été remplacé par un décompte rectifié. N’envoyez plus ce rappel.» it: «Il conteggio è stato sostituito da un conteggio rettificato. Non invii più questo sollecito.» en: «The statement has been replaced by a corrected statement. Do not send this reminder any more.» (Die fr/it/en-Begriffe für «berichtigte Abrechnung» vor der Übernahme in i18n-begriffe.md nachsehen.) Alternative: gleich in diesem PR oder als eigenes Issue. **Empfehlung:** im selben PR, denn es ist dieselbe Prüfung an derselben Stelle. Gilt später auch für «Erledigt» (#403).

### M-1: Unzustellbare E-Mail: Der Brief geht nach, die Zahlungsfrist bleibt die der E-Mail (Produktentscheid)
- **Beleg:** Art. 4 Abs. 1 VMWG (Fedlex, SR 221.213.11, Fassung vom 1.10.2025): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Art. 102 Abs. 1 OR (Fedlex, SR 220, Fassung vom 1.1.2026): «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.» `statement-send.service.ts` und `statement.service.ts:635`: Das Abrechnungsdatum und die Zahlungsfrist setzt Dwello am Tag der E-Mail. Neuer Text `statements_send_email_bounce`: «Kommt die E-Mail später als unzustellbar zurück, stellen Sie die Abrechnung per Brief zu.»
- **Warum falsch:** Eine zurückgekommene E-Mail hat dem Mieter nichts vorgelegt. Der Brief, den der Verwalter nach dem Hilfetext nachschickt, ist das PDF mit Datum und Frist der E-Mail (abgelegt unter «Dokumente»). Dwello schlägt die Mahnung nach dieser Frist vor, obwohl der Mieter die Abrechnung erst später erhalten hat. Dass die Nachzahlung erst mit dem Zugang der Abrechnung fällig wird, ist **unsicher** (keine Fedlex-Norm dazu; die Anforderungen nennen nur die Praxis von 30 Tagen, docs/nebenkostenabrechnung-anforderungen.md:46). Eine Mahnung vor Ablauf einer angemessenen Frist nach Zugang ist in der Praxis aber jedenfalls verfrüht.
- **Frage an den Product Owner:**
  - A: Der Hilfetext bleibt (er ist richtig, soweit er reicht). Ein neues Issue «Versendete Abrechnung erneut per Brief zustellen» setzt Abrechnungsdatum und Zahlungsfrist neu, legt das PDF als Dokument per Brief ab, und der Verlauf nennt beide Wege.
  - B: Zusätzlich jetzt ein zweiter Satz: «Mahnen Sie dann erst, wenn der Mieter die Abrechnung per Brief erhalten hat und die Zahlungsfrist danach abgelaufen ist.»
  - C: nichts weiter.
  - **Empfehlung: A und B.** B ist eine kleine Textänderung ohne Code, A wird ein eigenes Issue (`fachlich`, `entscheiden`). Das Problem gibt es schon auf der Basis; der neue Hilfetext macht diesen Weg aber erst sichtbar.

## Bestätigt (mit Quelle)

- **Punkt 2, Ablauf:** Die Ablehnung kommt zuerst bei «Zu versenden», danach REMINDER_TOO_EARLY. Das stimmt mit dem Entscheid überein («refused until the previous reminder is marked sent and its Zahlungsfrist has passed»). Zwei Beispiele, nachgerechnet mit `reminder.service.ts:83,155–161` und `statement.service.ts:55–59`: (a) Brief vom 01.10.2026, markiert am 05.10.2026: Die Frist wird neu gesetzt auf den 15.10.2026, die nächste Stufe ist ab dem 16.10.2026 möglich. (b) Grenzfall: Brief vom 01.10.2026, alte Frist am 11.10.2026 abgelaufen. Am 20.10.2026 gilt REMINDER_PREVIOUS_NOT_SENT; markiert am 20.10.2026: neue Frist 30.10.2026. Am 21.10.2026 gilt REMINDER_TOO_EARLY «ab 31.10.2026». Der entschiedene Satz «… nach ihrer Zahlungsfrist möglich» stimmt also, weil die Frist beim Markieren neu läuft. Eine fehlgeschlagene E-Mail-Mahnung ist «Zu versenden» und wird ebenso abgelehnt; der Ausweg «unter «Dokumente» markieren» gilt dort auch. Der Parameter reminderLevel 1/2 mit `documents_reminder_1/2` ergibt «Die Zahlungserinnerung …» und «Die 2. Mahnung …» (beide weiblich, «sie» passt), Glossar Mahnstufe Z. 211. Kein E2E-Szenario, Begründung in Ordnung (Uhr des Servers).
- **Punkt 3:** Die Ablehnung mit REMINDER_STATEMENT_PAID entspricht dem Entscheid; die Texte aus #322 werden wörtlich übernommen. Rechtlich: Mahnung setzt eine fällige Verbindlichkeit voraus (Art. 102 Abs. 1 OR, oben zitiert); nach der Zahlung gibt es nichts mehr zu mahnen. Dass der Brief bleibt, siehe V-2.
- **Punkt 4:** Sprache in der Sprache der Oberfläche, in fr/it klein geschrieben («en français», «in francese»), de/en gross («auf Französisch», «in French»): richtig. Die Satzstellung für fr/it/en steht unten.
- **Punkt 5.2:** Das Streichen genügt sprachlich in allen vier Sprachen (V-6 ist nur eine Stilfrage). Mietrecht: «weitere Schritte einleiten» ist keine Androhung der Kündigung nach Art. 257d OR. Das ist richtig so, denn eine solche verlangt mehr. Art. 257d Abs. 1 OR (Fedlex): «… so kann ihm der Vermieter schriftlich eine Zahlungsfrist setzen und ihm androhen, dass bei unbenütztem Ablauf der Frist das Mietverhältnis gekündigt werde. Diese Frist beträgt mindestens zehn Tage, bei Wohn- und Geschäftsräumen mindestens 30 Tage.» Die 10 Tage der Mahnung sind also keine 257d-Frist, und der Brief gibt sich auch nicht als eine aus.
- **Punkt 5.3:** −1 «basement», −2 «2nd basement», −3 «3rd basement», 0 «ground floor» in UI und PDF entsprechen dem Entscheid. Bisher zeigte das PDF bei −1 «basement 1» (pdf.service.ts:575), nicht «basement»; das wird mit der Änderung behoben. Die Tests in buildings-i18n und statement-pdf-render decken −1, −2 und −3 bzw. 0, −1 und −2 ab.
- **Punkt 6:** Der Link öffnet die Brief-Fassung, der Korrespondenzkanal bleibt (das Szenario prüft «wünscht … weiterhin Korrespondenz per E-Mail»). Ohne Adresse gibt es nur den Brief. Beides entspricht dem Entscheid. Das bisherige Szenario (Entwurf bleibt, Meldung) fällt richtigerweise weg. Das Backend lehnt den direkten Aufruf weiter mit STATEMENT_TENANT_NO_EMAIL ab (statement-send.service.ts:23).
- **Punkt 7:** Der Brief wird ein Dokument (Glossar Z. 213 «Brief oder E-Mail an einen Mieter … mit PDF»), mit Status «Versendet» (Glossar Z. 216). Die Adresse wird beim Dokument gespeichert, also so, wie sie beim Versand war. Das ist richtig, denn die Adresse beim Mieter kann sich später ändern. **Erfüllt «<Adresse>, <Uhrzeit>»?** Ja: links «Versendet per E-Mail an anna@example.ch», rechts «28.09.2026, 10:15». Das ist dieselbe Spalte wie bei «Erstellt» (MetadataCard.svelte:23, `formatDateTime`, Zeitzone Europe/Zurich). Eine Uhrzeit ohne Datum wäre im Verlauf wertlos; das Datum dazu ist kein Abweichen vom Entscheid. Nachgerechnet: 2026-09-28T08:15Z ergibt 10:15 (Sommerzeit, UTC+2), 2026-12-01T08:15Z ergibt 09:15 (UTC+1). Beim Brief nur das Abrechnungsdatum: richtig, denn den Gang zur Post kennt Dwello nicht. Ältere E-Mail-Dokumente ohne Adresse zeigen «Versendet per E-Mail»: richtig.
- **Punkt 8 (#491):** Bis dahin entsteht ohne PDF kein Dokument. Als Zwischenstand vertretbar, siehe V-12.
- **Begriffe:** Zahlungserinnerung, Mahnstufe, Mahnung, Dokument, Versandstatus, Zu versenden, Korrespondenzkanal, Zahlungsfrist, Verlauf, Abrechnungsdatum stehen alle im Glossar. «Unzustellbar» ist ein Wort der Alltagssprache, kein Fachbegriff; es braucht keinen Glossareintrag.

## Fehlende Begriffe (Vorschläge, der Aufrufer eröffnet das Issue mit `fachlich`, `entscheiden`)

1. Glossar «Zahlungsfrist einer Mahnung» (V-5), letzter Satz neu: «Die nächste Mahnstufe ist erst möglich, wenn die Mahnung als versendet markiert ist, und ab dem Tag nach ihrer Zahlungsfrist; beim Markieren erstellt Dwello den Brief neu und setzt die Frist ab diesem Tag.» Gleich in den Anforderungen, Punkt 11. Dazu bei «Mahnung»: «Eine Mahnung einer inzwischen bezahlten Abrechnung lässt sich nicht mehr als versendet markieren.»
2. Nur bei V-2 Option A: Begriff «Nicht mehr zu versenden»: «Mahnung, deren Abrechnung bezahlt ist, bevor der Brief zur Post ging; sie bleibt unter «Dokumente», zählt aber nicht als «Zu versenden».»

## Geprüfte Texte fr/it/en (Begriffe nach docs/design/i18n-begriffe.md; fr: Guillemets mit U+00A0 innen, wie in messages/fr.json; it und de ohne)

**backend_reminder_previous_not_sent** (de entschieden)
- fr: «Le document « {reminderLevel} » n’a pas encore été envoyé. Marquez-le comme envoyé sous « Documents ». Le niveau de rappel suivant sera possible après l’expiration de son délai de paiement.» («n’a pas encore été envoyé» statt «n’est pas encore envoyé»; «après l’expiration» wie in `backend_reminder_not_overdue`)
- it: «Il documento «{reminderLevel}» non è ancora stato inviato. Lo segni come inviato in «Documenti». Il livello di sollecito successivo sarà possibile dopo la scadenza del suo termine di pagamento.» («inviato» nach i18n-begriffe.md:132 und :99, nicht «spedito»; «segni» wie in `statements_mark_sent`)
- en: ««{reminderLevel}» has not been sent yet. Mark it as sent under «Documents». The next reminder level is possible once its payment deadline has passed.» (ohne «The», das sich mit dem grossgeschriebenen «Payment reminder» stösst; Stil wie in `statements_reminder_by_email` «Dwello creates «{next}»»)

**statements_reminder_by_email / _by_letter** (Punkt 4)
- de: in Ordnung wie vorgeschlagen.
- fr: «Dwello crée le document « {next} » en {language} au format PDF et l’envoie par e-mail à {email}.» bzw. «Dwello crée le document « {next} » en {language} au format PDF et le met à disposition sous « Documents ». …» («au format PDF» vermeidet «en français en PDF»)
- it: «Dwello crea il documento «{next}» in {language} in formato PDF e lo invia per e-mail a {email}.» bzw. «… in formato PDF e lo mette a disposizione sotto «Documenti». …»
- en: «Dwello creates «{next}» in {language} as a PDF and sends it by email to {email}.» bzw. «Dwello creates «{next}» in {language} as a PDF and puts it under «Documents». …»
- {language} fr: français, allemand, italien, anglais; it: tedesco, francese, italiano, inglese (klein); en: German, French, Italian, English.

**statements_reminder_no_email** (de entschieden; zur Sprache siehe V-3)
- fr: «Aucune adresse e-mail n’est saisie pour {tenant}. Dwello crée le rappel en PDF. Il se trouvera ensuite sous « Documents », prêt à être imprimé.» («saisie» wie in `statements_no_email`)
- it: «Per {tenant} non è registrato alcun indirizzo e-mail. Dwello crea il sollecito in PDF. In seguito lo troverà in «Documenti», pronto da stampare.» («registrato» wie in `statements_no_email`)
- en: «No email address has been added for {tenant}. Dwello creates the reminder as a PDF. It will then be under «Documents» for printing.» («added» wie in `statements_no_email`)

**statements_send_by_letter_instead** (de entschieden)
- fr: «Remettre plutôt par lettre» · it: «Recapitare invece per lettera» · en: «Deliver by letter instead» (Verb im Infinitiv, wie `statements_send_by_letter`)

**statements_send_email_bounce** (Vorschlag)
- de: «Kommt die E-Mail später als unzustellbar zurück, stellen Sie die Abrechnung per Brief zu.» In Ordnung; Ergänzung siehe M-1 B.
- fr: «Si l’e-mail revient plus tard comme non distribuable, remettez le décompte par lettre.»
- it: «Se l’e-mail torna indietro più tardi come non recapitabile, recapiti il conteggio per lettera.»
- en: «If the email later comes back as undeliverable, deliver the statement by letter.»

**statements_history_sent_letter / _sent_email** (de entschieden)
- fr: «Envoyé par lettre», «Envoyé par e-mail à {email}», ohne Adresse «Envoyé par e-mail» (männlich, bezogen auf «le décompte»)
- it: «Inviato per lettera», «Inviato per e-mail a {email}», «Inviato per e-mail»
- en: «Sent by letter», «Sent by email to {email}», «Sent by email»

**reminder-letter.ts, 3. Mahnung, nur «umgehend» gestrichen** (Wortstellung geprüft, zulässig)
- de: «Trotz zweimaliger Mahnung ist die … noch immer nicht bezahlt. Begleichen Sie den Betrag bitte, andernfalls müssen wir weitere Schritte einleiten.»
- fr: «Malgré deux rappels, le … n’a toujours pas été réglé. Veuillez régler le montant, faute de quoi nous nous verrons contraints d’entreprendre d’autres démarches.»
- it: «Nonostante il promemoria e il sollecito, il … risulta tuttora non pagato. Le chiediamo di saldare l’importo, altrimenti dovremo adottare ulteriori provvedimenti.»
- en: «Despite two reminders, the … has still not been paid. Please settle the amount; otherwise we will have to take further steps.»
- Bessere Fassung (V-6, braucht einen Entscheid, weil sie mehr ändert als das eine Wort): de «… noch immer nicht bezahlt. Geht der Betrag nicht innert der unten genannten Frist ein, müssen wir weitere Schritte einleiten.» · fr «… Si le montant ne nous parvient pas dans le délai indiqué ci-dessous, nous nous verrons contraints d’entreprendre d’autres démarches.» · it «… Se l’importo non ci perverrà entro il termine indicato qui sotto, dovremo adottare ulteriori provvedimenti.» · en «… If the amount is not received by the deadline below, we will have to take further steps.» Der Satz verweist auf die Frist im Absatz `payBy` darunter, und die doppelte Bitte fällt weg. Die Tests bleiben grün (kein «umgehend», Frist 31.03.2025 vorhanden).

**apartments_floor_lower** (en «{floor} basement»): richtig für −2 und tiefer («2nd basement», «3rd basement»); −1 bleibt `apartments_floor_basement` «basement». fr/it/de unverändert, siehe V-11.

## Nicht bestätigt

- **Rote Tests nicht ausgeführt:** `node_modules` im Worktree verweist auf `/home/user/Dwello/node_modules`, und eine Deny-Regel sperrt den Zugriff dorthin. Ob die Tests aus dem richtigen Grund rot sind, habe ich nur durch Lesen der Tests und des Codes geprüft.
- **Fälligkeit der Nachzahlung erst mit Zugang der Abrechnung:** keine Fedlex-Norm gefunden (OR Art. 257a–257b, VMWG Art. 4 gelesen); docs/nebenkostenabrechnung-anforderungen.md:45–46 und :159 nennen nur die Praxis. Deshalb **unsicher** in M-1.
- **Wohin eine unzustellbare E-Mail zurückkommt:** Bei SMTP an `MAIL_FROM` (backend/src/mail/index.ts). Bei Resend erscheint sie nach meiner Kenntnis im Dashboard bzw. als Webhook und nicht unbedingt im Postfach des Verwalters; das habe ich nicht in der Resend-Dokumentation geprüft. Erreicht sie den Verwalter nicht, nützt der Hilfetext wenig. Vorschlag für die PR: in der README beim Mail-Versand dazuschreiben, wohin Bounces gehen.
- **fr/it-Wortlaut der VMWG und des OR auf Fedlex** nicht abgerufen: Die Begriffe stammen aus docs/design/i18n-begriffe.md (Entscheid #405), wie dort vorgesehen.
- **Begriff «berichtigte Abrechnung» in fr/it/en** (für V-4) nicht in i18n-begriffe.md nachgesehen; die Vorschläge oben («décompte rectifié», «conteggio rettificato», «corrected statement») sind ungeprüft.
- **Fedlex-Quellen:** OR SR 220, Fassung vom 1.1.2026, Filestore-HTML (Art. 102, Art. 257d); VMWG SR 221.213.11, Fassung vom 1.10.2025, Filestore-HTML über den SPARQL-Endpoint gefunden (Art. 4). Die Fedlex-Webseite selbst lädt ohne JavaScript nicht.
