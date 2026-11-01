# Fachreview #1003, Runde 1 (Schritt 1, vor der Umsetzung)

Worktree: /tmp/scratchpad/review-1003-fach-reviewer (b3689fd). Gegenstand: @wip-Szenario «Ein neues PDF nach einer Teilzahlung verlangt den offenen Betrag» (tests/e2e/features/statement-detail.feature:1309–1320) und der Plan für Ort und Wortlaut im Abrechnungs-PDF.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Wenn «Offener Betrag» wie in der Mahnung übersetzt wird, kollidiert es im PDF mit «Nachzahlung»: it beides «Importo dovuto», fr «Montant à payer» neben «Montant dû», en «Amount due» neben «Amount outstanding» |
| V-2 | Verwalter | Major | Den Betrag, der im Zahlteil und im Empfangsschein gedruckt steht, liest der Code aus `data.balance`, getrennt vom QR-Code. Ein Test nur des QR-Betrags lässt zu, dass der gedruckte Betrag weiter CHF 442.90 zeigt |
| V-3 | Verwalter | Major | Wird eine Teilzahlung zurückgesetzt, bleibt ein PDF, das nach ihr erstellt wurde, und nennt weiter «Bereits bezahlt CHF 10.00»; der Zahlteil verlangt zu wenig |
| V-4 | Verwalter | Major (needs-decision) | Ein neues PDF «Zu versenden», das vor einer (weiteren) Teilzahlung erstellt wurde, verlangt beim Versand zu viel |
| V-5 | Verwalter / Mietrecht | Major | Auf einer berichtigten Abrechnung mit eigener Teilzahlung sagt der Satz «Bezahlen Sie nur noch den Saldo dieser Abrechnung.» das Gegenteil des Zahlteils |
| V-6 | Verwalter | Minor | Bei einer teilweise zurückerstatteten Rückerstattung fehlen Wortlaut und Begriff für den Rest; «Teilen Sie uns dafür Ihre IBAN mit …» passt nach einer Teilrückerstattung nicht mehr. Wortlaut unten, Begriff: Issue |
| V-7 | Verwalter | Minor | Das Szenario prüft nur zwei der drei entschiedenen Zeilen. Fix: `Und steht im PDF "Betrag der Abrechnung CHF 442.90"` ergänzen |
| V-8 | Verwalter | Minor | Laut UBIQUITOUS_LANGUAGE.md:187 nennen «Offener Betrag» nur «die Mahnung und ihr QR-Teil», laut :185 ist «Bereits bezahlt» nur die Zeile der berichtigten Abrechnung bzw. der Mahnung. Fix: beide Zeilen um das PDF ergänzen; der Product Owner muss die Zeilen im Issue nennen, i18n-begriffe.md:101 bekommt die PDF-Variante (V-1) |
| V-9 | Verwalter | Minor | Auf einer berichtigten Abrechnung mit eigener Teilzahlung stehen im Kasten zweimal «bereits bezahlt» mit verschiedener Bedeutung (Kurzform `priorPaidShort` und die neue Zeile). Fix: die eigene Zeile dort «Bereits bezahlt auf diese Abrechnung» |

## V-1 (Major) Begriffskollision von «Offener Betrag» und «Nachzahlung» in fr/it/en

- Belege: In der Mahnung heisst «Offener Betrag» `Importo dovuto` / `Montant dû` / `Amount outstanding` (backend/src/services/reminder-letter.ts:41, 64, 87, 110; docs/design/i18n-begriffe.md:101). Im Abrechnungs-PDF heisst die Nachzahlung (Kasten und letzte Zeile der Kostentabelle) `Importo dovuto` / `Montant à payer` / `Amount due` (backend/src/services/pdf.service.ts:187, 314, 441; i18n-begriffe.md:93).
- Warum falsch: In der Mahnung steht keine «Nachzahlung», dort kollidiert nichts. Im PDF schliesst die Tabelle mit «Importo dovuto 442.90», und der Kasten nennt «Importo dovuto CHF 432.90». Der Mieter sieht dann zwei Beträge unter demselben Wort. In fr und en sind die beiden Wörter fast gleichbedeutend, und es bleibt offen, welcher Betrag gilt.
- Fix: Im PDF ein Wort für den Rest, das «noch» bzw. «Rest» ausdrückt, wie es die UI schon tut (i18n-begriffe.md:102 «reste dû», «ancora dovuto», «outstanding»). Wortlaut in der Tabelle unten. Die Mahnung kann bleiben; «ancora dovuto» und «reste dû» passen zu ihr. i18n-begriffe.md:101 bekommt die PDF-Variante (Issue).

## V-2 (Major) Gedruckter Betrag im Zahlteil und Empfangsschein, Testebene

- Beleg: Der QR-Code bekommt den Betrag in `qrCodeFor` (pdf.service.ts:1385–1390, `balance: data.balance.toString()`; im QR-Code dann qr-bill.service.ts:361–362). Den gedruckten Betrag zeichnet `paymentPart(page, qr, data.balance)` (pdf.service.ts:1443, über `qrAmount(balance)` im Empfangsschein und im Zahlteil, ab :1310). Auch `owed()` (:1384) entscheidet nach `data.balance`.
- Warum falsch: Laut den SIX Implementation Guidelines müssen der gedruckte Betrag und der Betrag im QR-Code übereinstimmen (nicht in der Fedlex-Quelle, siehe «Nicht bestätigt»). Ändert der Fix nur `qr-bill.service.ts` bzw. die QR-Daten, verlangt der Code CHF 432.90, gedruckt bleibt aber CHF 442.90.
- Fix: Den offenen Betrag einmal in `toPdfData` bilden (Saldo minus `paidAmount`, `roundToRappen`, wie reminder.service.ts:112) und an QR-Code, Empfangsschein und Zahlteil geben; der Saldo der Tabelle bleibt. In `statement-pdf.pg.test.ts` prüfen wie reminders.pg.test.ts:557–566: Wie oft kommt «432.90» vor (Kasten, Empfangsschein, Zahlteil), und «Nachzahlung 442.90» bleibt am Ende der Tabelle. Den Betrag im QR-Code prüft ein Unit-Test der Daten, die an `generateQRBillForStatement` gehen. Für die Done-means des Issues ist das die richtige Ebene, aber nur mit beiden Prüfungen.

## V-3 (Major) Zurückgesetzte Teilzahlung, PDF bleibt

- Beleg: `recordPayment` setzt `paymentRecordedAt` nur bei vollständiger Zahlung; der Zweig der Teilzahlung gibt ihn nicht zurück (backend/src/services/statement.service.ts:808–810). `resetPayment` verwirft das PDF nur, wenn `pdfGeneratedAt >= paymentRecordedAt` gilt (:850–851, :858). Den Dokumenten-Eintrag `new_pdf` «Zu versenden» fasst es nicht an.
- Warum falsch: Nach #1003 bestätigt ein PDF eine Teilzahlung. Wird sie zurückgesetzt, stehen im gespeicherten PDF der Abrechnung und im neuen PDF «Zu versenden» weiter «Bereits bezahlt CHF 10.00» und «Offener Betrag CHF 432.90», obwohl jetzt CHF 442.90 offen sind. Das ist eine falsche Quittungsaussage gegenüber dem Mieter, und der Zahlteil verlangt CHF 10.00 zu wenig. Die Regel steht schon für die volle Zahlung (#92, statement.service.ts:840–841: «a PDF made after the payment was recorded confirms it: it is discarded and made again»).
- Fix: Die Regel von #92 auf Teilzahlungen ausdehnen (den Zeitpunkt der Erfassung auch bei einer Teilzahlung festhalten), und ein neues PDF «Zu versenden», das nach der zurückgesetzten Zahlung erstellt wurde, neu erstellen. pg-Test: Teilzahlung, neues PDF, Zahlung zurücksetzen. Danach nennt das PDF kein «Bereits bezahlt», und der Zahlteil verlangt 442.90.

## V-4 (Major, braucht Entscheid) Neues PDF «Zu versenden» vor einer (weiteren) Teilzahlung

- Beleg: `keepNewPdf` erstellt das neue PDF nur bei einer Änderung von Zahlungsfrist oder Bemerkung (backend/src/routes/statements.ts:249, statement-send.service.ts:158–173). Eine Teilzahlung erstellt es nicht neu, und ein bezahltes PDF sperrt nur `notToSend = 'paid'` (reminder.service.ts:190).
- Warum falsch: Das Szenario deckt nur die Reihenfolge Teilzahlung → Änderung ab. Bei Änderung → Teilzahlung → «als versendet markieren» geht ein PDF hinaus, das den ganzen Saldo verlangt. Bei Teilzahlung → neues PDF → zweite Teilzahlung → Versand verlangt der Zahlteil 432.90 statt des Rests. Für den Mieter ist das derselbe Fehler, den #1003 behebt: verlangt wird mehr als geschuldet (Art. 69 Abs. 2 OR, unten).
- Fix (Product Owner): Eine Teilzahlung erstellt ein offenes neues PDF «Zu versenden» neu, oder sie sperrt es wie eine volle Zahlung. Vorschlag: neu erstellen; der Verlauf nennt es wie bei #968. Dieselbe Lücke hat eine Mahnung «Zu versenden», die vor einer Teilzahlung erstellt wurde. Sie bestand schon vor dieser Änderung und gehört nicht in #1003.

## V-5 (Major) Berichtigte Abrechnung mit eigener Teilzahlung

- Beleg: pdf.service.ts:803–806 hängt an den Hinweis der berichtigten Abrechnung `replacesPay` («Bezahlen Sie nur noch den Saldo dieser Abrechnung.», :80; fr :208, it :335, en :462), sobald `balance > 0 && !paidDate`. Eine Teilzahlung auf der berichtigten Abrechnung selbst ist möglich: `recordPayment` gilt für jede versendete Abrechnung, und `balance` enthält dort schon `priorPayments`.
- Warum falsch: Fett oben auf der ersten Seite verlangt das PDF «den Saldo». Kasten und Zahlteil verlangen den offenen Betrag. Der Mieter bezahlt dann den Saldo und damit die Teilzahlung doppelt.
- Fix: Nach einer Teilzahlung `replacesPayOpen` (Wortlaut unten). Ein pg-Test mit einer berichtigten Abrechnung mit «Bereits bezahlt auf NK-…» und eigener Teilzahlung prüft den Satz und den Betrag im Zahlteil. Ein Beispiel zum Nachrechnen: Kosten 442.90, bereits bezahlt auf NK-alt 100.00, Saldo 342.90, eigene Teilzahlung 42.90, offen 300.00. Der Zahlteil verlangt 300.00, die Tabelle endet mit «Nachzahlung 342.90».

## Wo und wie (Teil 2 der Frage)

- Ort: nur der Ergebniskasten oben (`balanceBox`, pdf.service.ts:884–911). Die Kostentabelle bleibt, wie sie ist, und endet beim Saldo («Nachzahlung 442.90»). Sie leitet den Saldo aus den Kosten her; eine Teilzahlung ist keine Kostenposition und ändert den Saldo nicht (UBIQUITOUS_LANGUAGE.md:184, :187).
- Aufbau des Kastens nach einer Teilzahlung (Nachzahlung):
  1. Fett: `Offener Betrag` … `CHF 432.90` (statt «Nachzahlung CHF 442.90»; der Kasten nennt, was der Mieter jetzt tut)
  2. `Bitte bezahlen Sie den offenen Betrag bis 01.12.2026 mit dem Zahlteil.` Ja, der Aufforderungssatz muss den offenen Betrag nennen: Im Kasten stehen dann drei Beträge, und «den Betrag» wäre nicht mehr eindeutig.
  3. `Betrag der Abrechnung CHF 442.90 – Bereits bezahlt CHF 10.00` (neue Zeile; der Betrag der Abrechnung ist derselbe wie am Ende der Tabelle)
  4. grau wie heute: `Ihre Nebenkosten CHF 442.90 – Akontobeiträge CHF 0.00`
- Damit enthält der Text des PDFs «Bereits bezahlt CHF 10.00» und «Offener Betrag CHF 432.90», wie das Szenario es verlangt.
- Ohne Teilzahlung (`paidAmount` null oder 0) bleibt das PDF unverändert.
- Der offene Betrag wird nicht noch einmal auf 5 Rappen gerundet: Gerundet wird nur der Saldo (UBIQUITOUS_LANGUAGE.md:194), und eine Teilzahlung kann auf den Rappen lauten. So hält es auch die Mahnung (reminder.service.ts:112).
- E-Mail: `balanceText` geht auch in die E-Mail (statement-send.service.ts:37). Eine Teilzahlung gibt es erst nach dem Versand, und das neue PDF geht per Brief. Die E-Mail ändert sich daher praktisch nicht.

## Fälle (Teil 3)

- **Teilrückerstattung (negativer Saldo):** folgt aus den Regeln. Eine Teilzahlung ist auch die des Vermieters auf eine Rückerstattung (UBIQUITOUS_LANGUAGE.md:186; `paidAmountOf` mit dem Vorzeichen des Saldos, statement.service.ts:815–824). Einen Zahlteil gibt es nicht (`owed`, pdf.service.ts:1384). Der Kasten nennt «Bereits zurückerstattet» (der bestehende Begriff, :82) und den Rest. Der Begriff für den Rest einer Rückerstattung fehlt (V-6, Wortlaut unten). Beispiel: −442.90, zurückerstattet −10.00, Rest −432.90; gedruckt wird 432.90 ohne Vorzeichen.
- **Teilzahlungen erreichen den Saldo:** folgt aus den Regeln, kein Entscheid nötig. Die Abrechnung ist «Bezahlt», das Zahlungsdatum ist der Tag der letzten Zahlung (statement.service.ts:811–812; UBIQUITOUS_LANGUAGE.md:211). Das PDF zeigt «Bezahlt am {Datum}. Vielen Dank.» ohne Zahlteil (pdf.service.ts:826, 1384), und ein neues PDF wird nicht mehr versendet (`redeliverable` nur bei «Versendet», statement.service.ts:371; statement-send.service.ts:166).
- **Berichtigte Abrechnung mit «Bereits bezahlt auf NK-…» und eigener Teilzahlung:** folgt aus den Regeln. Der offene Betrag ist der Saldo der berichtigten Abrechnung minus ihre eigenen Teilzahlungen. Fehler: V-5, V-9.
- **Mindestbetrag:** folgt aus den Regeln. Der Mindestbetrag gilt für den gerundeten Saldo (UBIQUITOUS_LANGUAGE.md:189; `belowMinimum(balance)` in statement-payment.ts:22 und reminder.service.ts:68). Bei einem Saldo unter CHF 5 ausserhalb einer Schlussabrechnung ist keine Zahlung möglich. Ein Rest unter CHF 5 nach einer Teilzahlung bleibt fällig (UBIQUITOUS_LANGUAGE.md:186 «Der Rest bleibt fällig») und wird im Zahlteil verlangt. Beispiel: 442.90 − 440.00 = 2.90, der Zahlteil verlangt 2.90; auf einer Schlussabrechnung 4.00 − 1.00 = 3.00.
- **Erneut per Brief zustellen:** das PDF wird mit `generateStatementPdf` neu erstellt (statement-send.service.ts:139–147). Der Fix in `toPdfData` gilt dort mit, richtig so.
- **Braucht einen Entscheid:** nur V-4 und der Begriff für den Rest einer Rückerstattung (V-6).

## Szenario (Teil 4)

Das Szenario beschreibt das Ziel des Liegenschaftsverwalters in Fachsprache, ohne UI-Wörter (Bemerkung, PDF erstellen, herunterladen); alle Schritte gibt es schon (statement-detail.steps.ts:220, :340). Die Zahlen gehen auf: 442.90 − 10.00 = 432.90, Gegenprobe 245.50 − 45.50 = 200.00 (reminder-letter.test.ts:36). Lücken: V-7. Den Betrag des Zahlteils in `statement-pdf.pg.test.ts` zu prüfen ist die richtige Ebene, wenn dort auch die gedruckten Beträge geprüft werden (V-2). Für V-3 und V-5 braucht es je einen eigenen pg-Test.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| openAmount (Kasten, Nachzahlung) | Offener Betrag | Reste dû | Importo ancora dovuto | Amount still outstanding |
| openRefund (Kasten, Rückerstattung; braucht Entscheid, V-6) | Offene Rückerstattung | Remboursement restant | Rimborso residuo | Remaining refund |
| paidSoFarLine | Betrag der Abrechnung {amount} – Bereits bezahlt {paid} | Montant du décompte {amount} – Déjà payé {paid} | Importo del conteggio {amount} – Già pagato {paid} | Statement amount {amount} – Already paid {paid} |
| refundedSoFarLine | Betrag der Abrechnung {amount} – Bereits zurückerstattet {paid} | Montant du décompte {amount} – Déjà remboursé {paid} | Importo del conteggio {amount} – Già rimborsato {paid} | Statement amount {amount} – Already refunded {paid} |
| paidSoFarOwnLine (nur berichtigte Abrechnung, V-9) | Betrag der Abrechnung {amount} – Bereits bezahlt auf diese Abrechnung {paid} | Montant du décompte {amount} – Déjà payé sur le présent décompte {paid} | Importo del conteggio {amount} – Già pagato su questo conteggio {paid} | Statement amount {amount} – Already paid on this statement {paid} |
| payOpenBy | Bitte bezahlen Sie den offenen Betrag bis {date} mit dem Zahlteil. | Veuillez payer le reste dû au plus tard le {date} au moyen de la section paiement. | La preghiamo di pagare l’importo ancora dovuto entro il {date} tramite la sezione pagamento. | Please pay the amount still outstanding by {date} using the payment part. |
| payOpenNoDate | Bitte bezahlen Sie den offenen Betrag mit dem Zahlteil. | Veuillez payer le reste dû au moyen de la section paiement. | La preghiamo di pagare l’importo ancora dovuto tramite la sezione pagamento. | Please pay the amount still outstanding using the payment part. |
| refundOpenBy (ohne den Satz zur IBAN) | Wir überweisen Ihnen die offene Rückerstattung bis {date}. | Nous vous verserons le remboursement restant au plus tard le {date}. | Le bonifichiamo il rimborso residuo entro il {date}. | We will transfer the remaining refund to you by {date}. |
| refundOpenNoDate | Wir überweisen Ihnen die offene Rückerstattung. | Nous vous verserons le remboursement restant. | Le bonifichiamo il rimborso residuo. | We will transfer the remaining refund to you. |
| replacesPayOpen | ␣Bezahlen Sie nur noch den offenen Betrag dieser Abrechnung. | ␣Payez uniquement le reste dû du présent décompte. | ␣Paghi solo l’importo ancora dovuto di questo conteggio. | ␣Pay only the amount still outstanding on this statement. |

(␣ = führendes Leerzeichen wie bei `replacesPay`; {amount} und {paid} als «CHF 442.90».)

## Fehlende Begriffe (Issue, Labels `domain`, `needs-decision`)

- «Offener Betrag» im Abrechnungs-PDF in fr/it/en: «reste dû» / «importo ancora dovuto» / «amount still outstanding» (i18n-begriffe.md:101 ergänzen; die Mahnung behält «montant dû» / «importo dovuto» / «amount outstanding»).
- «Offene Rückerstattung»: Rückerstattung minus die festgehaltenen Teilrückerstattungen; im PDF der Rest, den der Vermieter noch überweist. fr «remboursement restant», it «rimborso residuo», en «remaining refund».

## Nicht bestätigt

- Dass der gedruckte Betrag mit dem Betrag im QR-Code übereinstimmen muss (V-2), steht in den SIX Implementation Guidelines QR-Rechnung, nicht in einem Gesetz auf Fedlex. Die Guidelines habe ich hier nicht abgerufen (Quelle laut Code: statement-detail.feature:417, «v2.4»): **unsicher** in Bezug auf die genaue Stelle.
- Ob die Textextraktion der E2E die fette Kopfzeile wirklich als «Offener Betrag CHF 432.90» liest (Bezeichnung links, Betrag rechtsbündig auf derselben Zeile). Ich verlasse mich auf die Angabe des Auftrags, dass heute «Nachzahlung CHF 442.90» so gelesen wird; laufen lassen habe ich nichts.
- Ob sich auf eine Abrechnung mit dem Status «Erledigt» (Saldo unter CHF 5) eine Teilzahlung erfassen lässt. Geschlossen habe ich das aus `paymentOf` (statement-payment.ts:22); die Route der Zahlung habe ich nicht gelesen.

Geprüft: Art. 69 OR (Stand 01.10.2026), Abs. 1 «Der Gläubiger braucht eine Teilzahlung nicht anzunehmen, wenn die gesamte Schuld feststeht und fällig ist.», Abs. 2 «Will der Gläubiger eine Teilzahlung annehmen, so kann der Schuldner die Zahlung des von ihm anerkannten Teiles der Schuld nicht verweigern.» Nach einer angenommenen Teilzahlung den ganzen Saldo zu verlangen, ist eine Mehrforderung, und der Entscheid vom 01.11.2026 ist damit gedeckt. Art. 85 Abs. 1 OR («Der Schuldner kann eine Teilzahlung nur insoweit auf das Kapital anrechnen, als er nicht mit Zinsen oder Kosten im Rückstande ist.»): Dwello führt keine Verzugszinsen; dass die Teilzahlung auf den Saldo angerechnet wird, steht damit nicht im Widerspruch. Ebenfalls geprüft: die Begriffe Teilzahlung, Offener Betrag und Bezahlt (UBIQUITOUS_LANGUAGE.md:186–187, :211), der Wortlaut der Mahnung (reminder-letter.ts:41–43, 141–144) und die Rechnung des Szenarios.
