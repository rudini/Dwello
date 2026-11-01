# Fachreview #959, Schritt 1, Runde 1

Gegenstand: `@wip`-Szenario «Eine Teilzahlung lässt die Abrechnung mit dem Rest offen» (`tests/e2e/features/statement-detail.feature:102-110`) und die offenen Punkte 1–7 des Entscheids A in #959. Worktree `/tmp/claude/review-959-fach`, Commit `9bebf57`.
Rechtsquelle: OR, Fedlex-Fassung Stand 1. Oktober 2026 (`eli/cc/27/317_321_377/20261001`).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Der Dialog sagt bei jeder Nachzahlung «Danach können Sie keine Mahnung mehr senden.», auch bei einer Teilzahlung |
| V-2 | Verwalter | Major | Das Szenario «Der Zahlungseingang sagt, was bei einer Teilzahlung gilt» hält den Satz aus #523 fest, der unter A falsch ist |
| V-3 | Verwalter | Major | Das neue Szenario hält den Rest nicht fest: Der Schritt prüft nur `/CHF/` |
| V-4 | Verwalter | Major | Der Umfang («Where» in #959) lässt Stellen aus, die den Saldo als Forderung zeigen: die Summen der Übersicht und den Betrag im QR-Teil |
| M-1 | Mietrecht | Minor | Die 2. und 3. Mahnung sagen nach einer Teilzahlung «… ist noch nicht bezahlt». Richtig wäre «noch nicht vollständig bezahlt» (`reminder-letter.ts:36-37`, fr/it/en analog). Neue Texte unten, Schlüssel `openings` |
| V-5 | Verwalter | Minor | Die Auskunft an den Mieter (`tenant-export.service.ts:127`) enthält nur `paidAmount`. Sie soll jede Teilzahlung mit Datum ausgeben |

Rechnung zu V-3. Der Saldo von Eva Frei in der Grundlage ist 442.90: 430.00 Heizkosten plus 3 % Verwaltungspauschale, kein Akonto. Das bestätigt der Kommentar in Zeile 1087 und das Szenario in Zeile 1099. 10.00 ist also kleiner als der Saldo, und der Rest beträgt 442.90 − 10.00 = 432.90. Der Rest liegt über dem Mindestbetrag, und die Zahlungsfrist läuft noch, also ist der Status «Versendet» richtig.

## Blocker/Major

**V-1.** Beleg: `src/routes/statements/PaidDateFields.svelte:25` zeigt `{#if statement.claimed}<p>{m.statements_no_reminder_after()}</p>{/if}`. Unter A ist der Satz bei einem Betrag unter dem offenen Betrag falsch, denn der Rest bleibt fällig und wird weiter gemahnt (Regel 2). Abhilfe: Den Satz nur zeigen, wenn der eingegebene Betrag gleich dem offenen Betrag ist. Dazu ein DOM-Test, der zuerst rot ist.

**V-2.** Beleg: `statement-detail.feature:118`, «Hat der Mieter erst einen Teil überwiesen, markieren Sie die Abrechnung noch nicht als bezahlt.» Mit dem Feld markiert der Liegenschaftsverwalter die Teilzahlung genau in diesem Dialog. Der Satz hielte ihn davon ab. Der Kommentar in Zeile 112 kündigt Option A schon an. Abhilfe: Zeile 118 erhält den neuen Text `statements_paid_partial` (Tabelle unten), und die Rückerstattung im DOM-Test erhält `statements_paid_partial_refund`. Die Szenarioänderung braucht `Spec change approved: #959`. Zuerst hält #959 in seinem «Decided» fest, dass A diesen Satz ersetzt und welcher Text gilt (CLAUDE.md, Schritt 1).

**V-3.** Beleg: `statement-detail.feature:110` «Und nennt die Abrechnung den offenen Rest», dazu `statement-detail.steps.ts` mit `toMatch(/CHF/)`. Auch ein falscher Rest würde grün, etwa der unveränderte Saldo «CHF 442.90» oder eine Rückerstattung. Abhilfe: `Und nennt die Abrechnung "Bezahlt: CHF 10.00, offen: CHF 432.90"`, mit einem Text-Vergleich.

**V-4.** Belege:
- `backend/src/routes/dashboard.ts:27` und :140, laut `docs/api-specification.md:343`: «`totalPending`/`overdueAmount` sum positive balances of open/overdue statements». Nach einer Teilzahlung zeigt die Übersicht so mehr als offen ist.
- `backend/src/services/qr-bill.service.ts:360-362`: Der Betrag kommt aus `statement.balance`. Der Zahlteil der Mahnung (`reminder.service.ts:110`) verlangte also den ganzen Saldo, auch wenn Brieftext und QR-Teil sonst den Rest nennen.
- `reminder.service.ts:100` übergibt `balance: Number(statement.balance)` an den Brief.

Wer einen bereits bezahlten Teil erneut einfordert, verlangt mehr als die Schuld. Nach Art. 85 Abs. 1 OR mindert eine Teilzahlung das Kapital, wenn weder Zinsen noch Kosten offen sind. Dwello erhebt weder Verzugszins noch Mahngebühr. Abhilfe: Wo eine Forderung genannt wird, gilt der offene Betrag: Brief, QR-Teil der Mahnung, `totalPending`, `overdueAmount` und die Zeile auf Liste und Detailseite. Die Prüfungen auf «Rückerstattung» und «Mindestbetrag» in `assertClaimable` bleiben beim Saldo (Regel 2). Für `paidThisMonth` siehe Regel 4.

## Regeln je Punkt (Empfehlung, entscheidungsreif)

Quellen, wörtlich nach Fedlex, Stand 1.10.2026:
- Art. 69 OR: «1 Der Gläubiger braucht eine Teilzahlung nicht anzunehmen, wenn die gesamte Schuld feststeht und fällig ist. 2 Will der Gläubiger eine Teilzahlung annehmen, so kann der Schuldner die Zahlung des von ihm anerkannten Teiles der Schuld nicht verweigern.»
- Art. 85 Abs. 1 OR: «Der Schuldner kann eine Teilzahlung nur insoweit auf das Kapital anrechnen, als er nicht mit Zinsen oder Kosten im Rückstande ist.»
- Art. 86 Abs. 1 OR: «Hat der Schuldner mehrere Schulden an denselben Gläubiger zu bezahlen, so ist er berechtigt, bei der Zahlung zu erklären, welche Schuld er tilgen will.»
- Art. 88 Abs. 1 OR: «Der Schuldner, der eine Zahlung leistet, ist berechtigt, eine Quittung und, falls die Schuld vollständig getilgt wird, auch die Rückgabe des Schuldscheines oder dessen Entkräftung zu fordern.»
- Art. 88 Abs. 2 OR: «Ist die Zahlung keine vollständige […], so kann der Schuldner ausser der Quittung nur die Vormerkung auf dem Schuldscheine verlangen.»
- Art. 102 Abs. 1 OR: «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.»

Grundregel. **Offener Betrag** = Saldo − Summe der festgehaltenen Zahlungen. Bei einer Rückerstattung zählen die Beträge negativ, wie heute in `paidOn`, `statement.service.ts:898-905`.
- Wer einen Betrag festhält, nimmt die Teilzahlung an (Art. 69 Abs. 2).
- Sie mindert das Kapital (Art. 85 Abs. 1).
- Gebucht wird nur, was für diese Abrechnung eingegangen ist. Der Hilfetext sagt das, weil Mieter auch Mietzins überweisen (Art. 86).
- Der Betrag ist grösser als 0.00 und höchstens der offene Betrag, mit 2 Dezimalstellen. Rappen sind erlaubt: Ein Mieter darf 10.03 überweisen, eine Rundung auf 5 Rappen gibt es nur beim Saldo.
- Eine Abrechnung unter dem Mindestbetrag, die nach #94 mit 0.00 bezahlt wird (`moved = '0.00'`), zeigt kein Feld.

1. **Anzeige.** Der Status bleibt «Versendet» bzw. «Überfällig». Es gibt keinen neuen Status.
   - Detailseite (Panel «Zahlung»): Unter der Zeile zum Saldo steht `statements_part_paid` («Bezahlt: CHF 10.00, offen: CHF 432.90»).
   - Liste: Dieselbe Zeile steht unter dem Betrag in `StatementRow.svelte:53-54`, nur wenn mindestens eine Teilzahlung festgehalten ist.
   - Der Dialog ist mit dem offenen Betrag vorausgefüllt (beim ersten Mal ist das der Saldo), seine Zusammenfassung nennt den offenen Betrag.
   - «Bezahlt am» (`paidDate`) bleibt leer, bis die Abrechnung bezahlt ist. `MetadataCard` und `minimumOf` (`statement-pdf.service.ts:177`) lesen `paidDate` als vollständige Zahlung.
   - Der Verlauf nennt jede Teilzahlung mit Datum und Betrag. Das ist die Quittung nach Art. 88 Abs. 2, die der Mieter verlangen kann.
2. **Mahnung.** Die Mahnung zählt ab der ersten Zahlungsfrist weiter.
   - Eine Teilzahlung tilgt den Rest nicht. Der Rest bleibt fällig, der Mieter bleibt im Verzug (Art. 102 Abs. 1).
   - Eine Teilzahlung ändert weder den Status «Überfällig» noch die Mahnstufe noch `nextReminderFrom`.
   - Der Brief nennt drei Zeilen:
     - «Betrag der Abrechnung: CHF 442.90»
     - «Bereits bezahlt: CHF 10.00» (die Summe, ohne Daten)
     - «Offener Betrag: CHF 432.90»
     
     Der QR-Teil verlangt den offenen Betrag. Ohne Teilzahlung bleibt der Brief wie heute.
   - Eine Mahnung «Zu versenden» erstellt Dwello beim Markieren schon heute neu (`reminder.service.ts:176`). Sie nennt dann den Rest von diesem Tag.
   - Auch ein Rest unter CHF 5.00 bleibt fällig und lässt sich mahnen: Der Mindestbetrag gilt für den Saldo (Glossar «Mindestbetrag»), nicht für einen Rest.
3. **Bereits bezahlt der berichtigten Abrechnung.** Das Feld ist mit der Summe der Teilzahlungen vorausgefüllt (sonst 0.00, Zeile 1118 bleibt gültig). Der Liegenschaftsverwalter kann den Wert ändern, etwa für eine Zahlung, die er noch nicht festgehalten hat.
   - Der eingegebene Wert wird wie heute `paidAmount` der ersetzten Abrechnung (`replaceStatement`, `statement.service.ts:847`).
   - Ihr Verlauf behält die Teilzahlungen.
   - Ohne Body (Abrechnungslauf) bleibt die Summe stehen. `paidSoFar` rechnet sie dann schon an (`statement.service.ts:449-450`).
   - Das Szenario in Zeile 1104 (200.00 → 430.35) bleibt gültig.
4. **Mehrere Teilzahlungen.** Die Beträge werden addiert, nicht ersetzt. Ersetzen würde eine angenommene Zahlung verlieren und in der Mahnung zu viel verlangen.
   - Gespeichert wird eine Liste `{date, amount}` (wie `payment_resets`), dazu `paidAmount` = Summe. Im UI bleibt es ein Feld, kein Listen-Editor (A).
   - Erreicht die Summe den Saldo, wird die Abrechnung «Bezahlt». Das Zahlungsdatum ist das späteste Datum der Zahlungen: Erst dann ist die Schuld getilgt.
   - Ein Betrag über dem offenen Betrag wird abgelehnt (`backend_statement_paid_amount_too_high`).
   - Der Bestätigungsknopf heisst unter dem offenen Betrag «Teilzahlung festhalten», sonst «Als bezahlt markieren».
   - `paidThisMonth` zählt die Teilzahlungen nach ihrem Datum.
5. **Rückerstattung (Saldo < 0).** Es gilt dieselbe Regel, mit dem Label «Zurückerstatteter Betrag» und negativ gespeichert.
   - Der Rest bleibt eine Schuld des Vermieters, die Abrechnung bleibt «Versendet» bzw. «Überfällig».
   - Dwello mahnt keine Rückerstattung, wie heute (`REMINDER_REFUND`).
   - Beispiel: Saldo −120.00, zurückerstattet 50.00, offen 70.00; danach 70.00 → «Bezahlt».
6. **Zahlung zurücksetzen.** Die Aktion steht zur Verfügung, sobald eine Zahlung festgehalten ist, also auch bei «Versendet» bzw. «Überfällig» mit einer Teilzahlung.
   - Sie nimmt die zuletzt festgehaltene Zahlung zurück. Die Teile davor bleiben, und der Status wird neu bestimmt: Bezahlt → Versendet bzw. Überfällig.
   - `paymentResets` hält Datum und Betrag fest, wie heute.
   - Eine Mahnung «Nicht mehr versenden» wird wieder «Zu versenden», wenn die Abrechnung nicht mehr bezahlt ist. So ist es heute schon.
7. **PDF.** Den Rest nennt das PDF der Mahnung (Brief und QR-Teil).
   - Das PDF der Abrechnung bleibt die Abrechnung mit ihrem Saldo, das versendete PDF bleibt unverändert.
   - Eine Teilzahlung ändert weder die Zahlungsfrist noch die Bemerkung. Sie löst also kein neues PDF nach #524/#968 aus.
   - Lücke für ein Folge-Issue: Ein neues PDF (#968), das nach einer Teilzahlung aus anderem Grund entsteht, verlangt im QR-Teil den ganzen Saldo.

Proben:
- Saldo 442.90, Zahlungen 10.00 und 432.90: offen zuerst 432.90, dann 0 → «Bezahlt» mit dem Datum der zweiten Zahlung.
- Saldo 442.90, Zahlung 500.00: abgelehnt.
- Saldo 442.90, Zahlung 440.00: offen 2.90. Die Abrechnung bleibt fällig und lässt sich mahnen.
- Zahlung 0.00: abgelehnt.
- Saldo −120.00: siehe Regel 5.
- Berichtigung nach 200.00: 630.36 − 200.00 = 430.36, gerundet 430.35, wie Zeile 1104.

## Texte

| key | de | fr | it | en |
|-----|----|----|----|----|
| statements_paid_amount | Bezahlter Betrag | Montant payé | Importo pagato | Amount paid |
| statements_paid_amount_refund | Zurückerstatteter Betrag | Montant remboursé | Importo rimborsato | Amount refunded |
| statements_paid_partial | Was an diesem Tag für diese Abrechnung eingegangen ist. Hat der Mieter erst einen Teil überwiesen, geben Sie diesen Betrag ein. Die Abrechnung bleibt dann mit dem Rest offen. | Ce qui est arrivé ce jour-là pour ce décompte. Si le locataire n’a versé qu’une partie du montant, saisissez ce montant. Le décompte reste alors ouvert pour le solde restant. | Quanto è arrivato quel giorno per questo conteggio. Se l’inquilino ha versato solo una parte dell’importo, inserisca questo importo. Il conteggio resta allora aperto per il resto. | What came in on that day for this statement. If the tenant has paid only part of the amount, enter that amount. The statement then stays open for the rest. |
| statements_paid_partial_refund | Was Sie an diesem Tag zurückerstattet haben. Haben Sie erst einen Teil zurückerstattet, geben Sie diesen Betrag ein. Die Abrechnung bleibt dann mit dem Rest offen. | Ce que vous avez remboursé ce jour-là. Si vous n’avez remboursé qu’une partie du montant, saisissez ce montant. Le décompte reste alors ouvert pour le solde restant. | Quanto ha rimborsato quel giorno. Se ha rimborsato solo una parte dell’importo, inserisca questo importo. Il conteggio resta allora aperto per il resto. | What you refunded on that day. If you have refunded only part of the amount, enter that amount. The statement then stays open for the rest. |
| statements_part_paid | Bezahlt: {paid}, offen: {rest} | Payé : {paid}, reste dû : {rest} | Pagato: {paid}, ancora dovuto: {rest} | Paid: {paid}, outstanding: {rest} |
| statements_part_refunded | Zurückerstattet: {paid}, offen: {rest} | Remboursé : {paid}, reste à rembourser : {rest} | Rimborsato: {paid}, ancora da rimborsare: {rest} | Refunded: {paid}, still to refund: {rest} |
| statements_record_part_payment | Teilzahlung festhalten | Enregistrer le paiement partiel | Registrare il pagamento parziale | Record part payment |
| backend_statement_paid_amount_too_high | Der Betrag ist höher als der offene Betrag von {rest}. Geben Sie höchstens diesen Betrag ein. | Le montant dépasse le montant ouvert de {rest}. Saisissez au maximum ce montant. | L’importo supera l’importo aperto di {rest}. Inserisca al massimo questo importo. | The amount is higher than the open amount of {rest}. Enter at most this amount. |
| backend_statement_paid_amount_zero | Geben Sie einen Betrag über CHF 0.00 ein. | Saisissez un montant supérieur à CHF 0.00. | Inserisca un importo superiore a CHF 0.00. | Enter an amount above CHF 0.00. |
| reminder-letter `statementAmount` | Betrag der Abrechnung: | Montant du décompte : (NBSP) | Importo del conteggio: | Statement amount: |
| reminder-letter `paidSoFar` | Bereits bezahlt: | Déjà payé : (NBSP) | Già pagato: | Already paid: |
| reminder-letter `openings[1]` mit Teilzahlung (M-1) | Trotz unserer Zahlungserinnerung ist die ${s} noch nicht vollständig bezahlt. | Malgré notre rappel, le ${s} n’a toujours pas été entièrement réglé. | Nonostante il nostro promemoria, il ${s} non risulta ancora interamente pagato. | Despite our payment reminder, the ${s} has still not been paid in full. |
| reminder-letter `openings[2]` mit Teilzahlung (M-1) | Trotz zweimaliger Mahnung ist die ${s} noch immer nicht vollständig bezahlt. Geht der Betrag nicht innert der unten genannten Frist ein, müssen wir weitere Schritte einleiten. | Malgré deux rappels, le ${s} n’a toujours pas été entièrement réglé. Si le montant ne nous parvient pas dans le délai indiqué ci-dessous, nous nous verrons contraints d’entreprendre d’autres démarches. | Nonostante il promemoria e il sollecito, il ${s} risulta tuttora non interamente pagato. Se l’importo non ci perverrà entro il termine indicato qui sotto, dovremo adottare ulteriori provvedimenti. | Despite two reminders, the ${s} has still not been paid in full. If the amount is not received by the deadline below, we will have to take further steps. |

Hinweise zu den Texten:
- Die Zeile «Offener Betrag» bleibt `amount`.
- `statements_paid_partial` ersetzt den Satz aus #523 und dient zugleich als Hilfe am Feld. Es gibt keinen zweiten Text.

## Glossar (Zeilen, die sich ändern; das «Decided» von #959 muss sie nennen)

| Begriff | Neue Definition |
|---------|-----------------|
| **Bezahlt** | Nachzahlung oder Rückerstattung vollständig bezahlt: Die festgehaltenen Zahlungen erreichen den Saldo. Das Zahlungsdatum ist der Tag der letzten Zahlung. Lässt sich mit «Zahlung zurücksetzen» zurücknehmen. (`paid`) |
| **Überfällig** | Versendet und Zahlungsfrist überschritten, auch nach einer Teilzahlung, solange ein offener Betrag bleibt. (`overdue`) |
| **Teilzahlung** (neu) | Zahlung auf eine versendete Abrechnung, die kleiner ist als der offene Betrag: vom Mieter auf eine Nachzahlung, vom Vermieter auf eine Rückerstattung. Die Abrechnung bleibt «Versendet» bzw. «Überfällig». Der Rest bleibt fällig und wird ab der ersten Zahlungsfrist weiter gemahnt. | `paid_amount` (Summe), Liste der Zahlungen |
| **Offener Betrag** (neu) | Saldo minus die festgehaltenen Teilzahlungen. Die Mahnung und ihr QR-Teil nennen ihn. |
| **Bereits bezahlt / Bereits zurückerstattet** | Zusatz: Dwello füllt das Feld mit der Summe der festgehaltenen Teilzahlungen vor. In der Mahnung nennt die Zeile «Bereits bezahlt» diese Summe. |
| **Zahlung zurücksetzen** | Nimmt die zuletzt festgehaltene Zahlung einer Abrechnung zurück, auch eine Teilzahlung. Die Teilzahlungen davor bleiben, und der Status wird wieder Versendet bzw. Überfällig. Der Verlauf und das Protokoll halten das Zurücksetzen mit Datum und Betrag der zurückgesetzten Zahlung fest. |
| **Mahnung** | Zusatz: Nach einer Teilzahlung nennt sie den Betrag der Abrechnung, was bereits bezahlt ist und den offenen Betrag. |

Fehlende Begriffe: «Teilzahlung» und «Offener Betrag». Vorschlag wie oben. Der Aufrufer erfasst sie im «Decided» von #959 oder in einem Issue (`domain`, `needs-decision`).

## Was sich streichen lässt

- Die Daten der Teilzahlungen im Mahnbrief: Die Summe genügt.
- Das PDF der Abrechnung: keine Änderung. Für das neue PDF (#968) nach einer Teilzahlung ein Folge-Issue.
- Die geänderten Mahn-Einleitungen (M-1): Sie sind Minor und lassen sich nachziehen.
- `paidThisMonth` nach Datum der Teilzahlung: als Folge-Issue, wenn die Liste der Zahlungen zu viel Umfang bringt.
- Rest unter CHF 5.00: Es braucht keine Sonderregel und keinen eigenen Text.

## Nicht bestätigt

- Art. 102 Abs. 2 OR («Verfalltag verabredet»): Ob die einseitig gesetzte Zahlungsfrist der Abrechnung ein Verfalltag ist, bleibt **unsicher**, nur der Wortlaut von Fedlex ist geprüft, keine Rechtsprechung. Die Regel 2 hängt nicht davon ab: Spätestens die Mahnung setzt in Verzug (Art. 102 Abs. 1).
- Ob eine Zahlungsfrist nach Art. 257d OR, die einen zu hohen Betrag nennt, unwirksam ist: **unsicher**, keine Rechtsprechung gesucht. Für Dwello zählt das nicht, denn seine Mahnung ist keine Frist nach Art. 257d (`statements_reminder_257d`).
- `dashboard.ts:27/140` habe ich nur über die API-Spezifikation (Zeile 343) gelesen, nicht im Code nachgerechnet.

Geprüft: Saldo von Eva Frei (442.90) und Rest (432.90); `paidSoFar`/`replaceStatement` passen zu Regel 3; das Neuerstellen der Mahnung «Zu versenden» beim Markieren; Art. 69, 85, 86, 88, 102, 257d OR (Stand 1.10.2026).
