# Fachreview #448, Runde 4 (Texte nach den Persona-Reviews)

Gegenstand: Vorschläge des Koordinators zu `docs/design/personas/dr-weber-448.md` (P-1, P-2, Beobachtung «verrechnen») und `docs/design/personas/anna-448.md` (P-1, P-3, P-4). Worktree `review-448-fach4`, Commit a49c11dd. Vorherige Berichte: `docs/reviews/448-fachreview-1..3.md`. Gesetzestexte: OR, Fedlex-Filestore, «Stand am 1. Oktober 2026» (`fedlex.data.admin.ch/filestore/.../eli/cc/27/317_321_377/20261001/de/html/...-html-1.html`). Die Absatznummern fehlen im HTML-Auszug; sie sind nach der Satzfolge der Artikel zugeordnet.

Offene IDs aus Runde 3 (V-16/M-3, V-11, M-2, M-4, V-13, V-22, V-23, V-24, V-25): nicht Gegenstand, nicht erneut geprüft. V-25 ist im Code umgesetzt (`Correction.svelte:26-28`, `carried` auch für die Rückerstattung nach #94).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-26 | Verwalter | Minor | Punkt 1: «verliert der Entwurf ihn» stimmt (`statement.service.ts:761-764`). Die Aufforderung, den Entwurf neu zu berechnen, braucht es aber nur, wenn auch der Saldo der berichtigten Abrechnung unter CHF 5.00 liegt. Wortlaut siehe Punkt 1. |
| V-27 | Verwalter | Minor | Punkt 2: «bei der kein Geld fliesst» stimmt beim Übertrag nicht, denn das Geld fliesst mit der nächsten Abrechnung. Genau dieses Missverständnis nennt Weber als Fehlerrisiko. Wortlaut siehe Punkt 2. |
| V-28 | Verwalter | Nit | Glossarzeile «Erledigt» (`UBIQUITOUS_LANGUAGE.md:198`) inhaltlich richtig, auch für 0.00. Veraltet ist «(geplant #403)», und es fehlen «kein Zahlung zurücksetzen» und die Schlussabrechnung. Vorschlag für den PO (#484) siehe Punkt 2. |
| V-29 | Verwalter | Nit | EN `statements_correct_open_settled` setzt “Already offset” in “ ”; `en.json` verwendet sonst überwiegend « » (130 zu 29). Wird mit Punkt 1 behoben. |
| V-30 | Verwalter | Minor | Punkt 5: Der Satz ist richtig (Art. 69, 88 OR), aber unvollständig. Nach einer Teilzahlung fordert die Mahnung den ganzen Saldo (`reminder.service.ts:89`), und für die Rückerstattung fehlt eine eigene Fassung. Gehört ins geplante Issue. |
| V-31 | Verwalter | Minor | Anna, Beobachtung: Wer die Bemerkung oder die Zahlungsfrist einer versendeten Abrechnung ändert, verwirft das versendete PDF (`statement.service.ts:617, 627-630`). Danach ist nicht mehr belegbar, was der Mieter erhalten hat. Bestand schon vorher und ist in #448 (6) so entschieden. Fix: Hinweis nach dem Speichern («Senden Sie dem Mieter das neue PDF, wenn er die Bemerkung lesen soll.») und das versendete PDF aufbewahren, beides in einem eigenen Issue. |
| V-32 | Verwalter | Nit | Eine erledigte Abrechnung mit Saldo 0.00 zeigt beim Berichtigen `statements_correct_open_settled`. Ein Saldo 0.00 wird aber nie übertragen (`carriable`: `balance <> 0`, `statement.service.ts:397`). Passender wäre `statements_correct_settled` (`Correction.svelte:26`). |
| V-33 | Verwalter | Nit | Punkt 2: Der Satz «‹Bezahlt› heisst dagegen, dass Sie eine Zahlung erfasst haben» trifft auf Abrechnungen nach #94 nicht zu: Sie stehen auf «Bezahlt» mit `paidAmount` 0. Hinnehmbar, weil es ein Altbestand ist. |

Keine Blocker, keine Major. Punkt 3 (Art. 120 OR): kein Befund, siehe unten.

## Punkt 1: `statements_correct_open_settled` (Weber P-1)

**Was der Code tut** (`replaceStatement` → `offsetOf`, `statement.service.ts:738-766`): Im selben Vorgang wie das Ersetzen setzt Dwello bei jedem **Entwurf**, der den Saldo als Übertrag zählt, `carried_from_id` auf null und zieht den Übertrag von dessen Saldo ab. Der Entwurf verliert den Übertrag also **sofort**. «verliert der Entwurf ihn» ist richtig. «Bereits verrechnet» (`paidAmount` = Saldo) gibt es nur, wenn eine **nicht-Entwurf**-Abrechnung einer anderen Periode ihn zählt (`countedBy`, Z. 388-393). Nach dem Ersetzen ist A «Ersetzt» und nicht mehr `carriable`. Die nächste Abrechnung nimmt nur einen Saldo der berichtigten A', und zwar erst, wenn A' versendet und selbst «Erledigt» ist, ihr Saldo also unter CHF 5.00 liegt. Liegt der Saldo von A' bei CHF 5.00 oder mehr, wird er mit A' eingefordert, und der Entwurf braucht keine Neuberechnung.

Nachgerechnet (A 2024 übertragen, B 2025 mit eigenem Saldo 50.00, richtiger Saldo 2024 = 20.00):
- B versendet, A +3.00: A' = 20.00 − 3.00 = 17.00; B 53.00; Summe 70.00 = Soll.
- B versendet, A −3.00 (Rückerstattung): A' = 20.00 − (−3.00) = 23.00; B 47.00; Summe 70.00 = Soll.
- B Entwurf, A +3.00: B sofort 53.00 − 3.00 = 50.00; A' = 20.00 (kein «Bereits verrechnet»); Summe 70.00 = Soll.
- Randfall 0: B versendet, A −3.00, A' unverändert −3.00: −3.00 + 3.00 = 0.00, «Erledigt»; keine doppelte Rückerstattung.
- Randfall A' wieder klein: B Entwurf, A' = 4.00 → «Erledigt», übertragbar. B nimmt die 4.00 erst, wenn er nach dem Versand von A' neu berechnet wird. Vorher berechnet findet B nichts, weil A' als Entwurf nicht `carriable` ist. Darum ist «nachdem Sie … versendet haben» nötig.

«Der Mieter erhält oder bezahlt ihn nicht doppelt» stimmt für beide Vorzeichen.

**Empfohlener Wortlaut** (eindeutig, kein PO-Entscheid: Der Text ist in #448 nicht wörtlich entschieden. Er beschreibt die entschiedene Regel V-14/M-5 genauer):

- de: «Die Abrechnung {number} wird durch eine berichtigte Abrechnung ersetzt. Die bisherige bleibt unverändert erhalten. Enthält eine versendete nächste Abrechnung ihren Saldo schon als Übertrag, rechnet die berichtigte Abrechnung ihn als «Bereits verrechnet» an: Der Mieter bezahlt oder erhält ihn nicht doppelt. Enthält ein Entwurf ihn als Übertrag, entfernt Dwello den Übertrag sofort aus dem Entwurf; die berichtigte Abrechnung rechnet dann den ganzen Saldo ab. Ist der Saldo der berichtigten Abrechnung wieder kleiner als CHF 5.00, berechnen Sie den Entwurf neu, nachdem Sie die berichtigte Abrechnung versendet haben.»
- fr: «Le décompte {number} est remplacé par un décompte rectificatif. L’ancien reste conservé tel quel. Si un décompte suivant envoyé contient déjà son solde comme report, le décompte rectificatif le prend en compte comme « Déjà compensé » : le locataire ne le paie pas ou ne le reçoit pas deux fois. Si un brouillon le contient comme report, Dwello retire aussitôt le report du brouillon ; le décompte rectificatif tient alors compte de tout le solde. Si le solde du décompte rectificatif est de nouveau inférieur à CHF 5.00, recalculez le brouillon après avoir envoyé le décompte rectificatif.» (U+00A0 vor «:» und «;» und innerhalb der « », wie in `fr.json`.)
- it: «Il conteggio {number} viene sostituito da un conteggio rettificato. Il precedente resta conservato invariato. Se un conteggio successivo inviato contiene già il suo saldo come riporto, il conteggio rettificato lo considera come «Già compensato»: l’inquilino non lo paga né lo riceve due volte. Se una bozza lo contiene come riporto, Dwello toglie subito il riporto dalla bozza; il conteggio rettificato tiene allora conto dell’intero saldo. Se il saldo del conteggio rettificato è di nuovo inferiore a CHF 5.00, ricalcoli la bozza dopo aver inviato il conteggio rettificato.»
- en: «Statement {number} is replaced by a corrected statement. The previous one is kept unchanged. If a sent next statement already contains its balance as carried over, the corrected statement counts it as «Already offset»: the tenant does not pay or receive it twice. If a draft contains it as carried over, Dwello removes it from the draft at once; the corrected statement then settles the whole balance. If the corrected statement’s balance is again below CHF 5.00, recalculate the draft after sending the corrected statement.»

Abweichungen vom Vorschlag: «verliert der Entwurf ihn» wird zu «entfernt Dwello den Übertrag sofort aus dem Entwurf». Das sagt, wer handelt und wann, und vermeidet ein zweites «ihn». Neu ist der Satz, dass die berichtigte Abrechnung dann den ganzen Saldo abrechnet: Er beantwortet Webers Frage «doppelt oder gar nicht». Die Neuberechnung ist an die Bedingung «wieder kleiner als CHF 5.00» geknüpft, weil «Neu berechnen» auch geänderte Rechnungen übernimmt (`statements_recalculate_text`) und sonst nichts bewirkt. Die Kurzform des Koordinators (immer neu berechnen) ist nicht falsch, nur ungenauer. Wählt man sie, bleibt «nachdem Sie die berichtigte Abrechnung versendet haben» Pflicht.

## Punkt 2: Hilfebegriff «Erledigt» (Weber P-2, Anna P-4)

Code: `updateStatus` setzt «Erledigt» (`settled`) beim Versand, wenn `balance === 0 || (belowMinimum && !final)` (`statement.service.ts:680-682`). Saldo 0.00 ist also auch auf der Schlussabrechnung «Erledigt», ein Saldo unter CHF 5.00 dort nicht. Die Glossarzeile (`UBIQUITOUS_LANGUAGE.md:198`) und #448 «2 Status» («Saldo 0.00 or carried over») stimmen damit überein. **Für 0.00 ist «Erledigt» richtig.** Fachlich ist es auch passend: Eine Abrechnung ohne Forderung ist abgeschlossen, aber nicht «bezahlt», denn eine Quittung (Art. 88 Abs. 1 OR, Wortlaut unter Punkt 5) gibt es ohne Zahlung nicht.

Zum Vorschlag: «bei der kein Geld fliesst» ist beim Übertrag irreführend (V-27). Weber: «Ich halte ‹Erledigt› für ‹ausbezahlt› und vergesse, dass der Mieter noch CHF 3.00 gut hat.»

**Empfohlener Wortlaut** (eindeutig, kein PO-Entscheid: neuer Hilfetext zum entschiedenen Status, keine entschiedene Formulierung geändert):

- de: «Status einer versendeten Abrechnung, auf die keine Zahlung folgt: Der Saldo ist 0.00, oder er ist kleiner als CHF 5.00 und wird mit der nächsten Abrechnung desselben Mietvertrags verrechnet (Übertrag). Ein übertragener Betrag ist damit noch nicht bezahlt: Der Mieter bezahlt oder erhält ihn mit der nächsten Abrechnung. Eine erledigte Abrechnung hat kein Zahlungsdatum und wird nicht gemahnt. «Bezahlt» heisst dagegen, dass Sie eine Zahlung erfasst haben.»
- fr: «Statut d’un décompte envoyé qui n’est suivi d’aucun paiement : le solde est de 0.00, ou il est inférieur à CHF 5.00 et est compensé avec le prochain décompte du même contrat de bail (report). Un montant reporté n’est donc pas encore payé : le locataire le paie ou le reçoit avec le prochain décompte. Un décompte clôturé n’a pas de date de paiement et ne fait l’objet d’aucun rappel. « Payé » signifie en revanche que vous avez saisi un paiement.» (Terme «clôturé» laut `i18n-begriffe.md:88`.)
- it: «Stato di un conteggio inviato a cui non segue alcun pagamento: il saldo è 0.00, oppure è inferiore a CHF 5.00 e viene compensato con il prossimo conteggio dello stesso contratto di locazione (riporto). Un importo riportato non è quindi ancora pagato: l’inquilino lo paga o lo riceve con il prossimo conteggio. Un conteggio chiuso non ha una data di pagamento e non riceve solleciti. «Pagato» significa invece che Lei ha registrato un pagamento.»
- en: «Status of a sent statement that no payment follows: the balance is 0.00, or it is below CHF 5.00 and is offset against the next statement of the same rental contract (carried over). An amount carried over is therefore not paid yet: the tenant pays or receives it with the next statement. A closed statement has no payment date and gets no reminder. «Paid», by contrast, means that you have recorded a payment.»

Begriffsname auf der Hilfeseite: de «Erledigt», fr «Clôturé», it «Chiuso», en «Closed» (`statements_status_settled`).

**Abzeichen neutral statt grün:** Aus Verwaltersicht richtig. «Erledigt» meldet keinen Zahlungseingang, und Grün mit Häkchen setzt es mit «Bezahlt» gleich (Anna P-4). Weil `neutral` auch «Entwurf» und «Ersetzt» trägt (`src/lib/statement.ts:29-35`), braucht «Erledigt» ein eigenes Symbol (`Badge` nimmt `icon`). Die Farbe ist eine Designfrage und in #448 nicht entschieden, also kein PO-Entscheid.

**Glossarzeile** (V-28; der PO trägt sie mit #484 ein, `entscheiden`): «Status einer versendeten Abrechnung, auf die keine Zahlung folgt: Saldo 0.00, oder ein Saldo unter dem Mindestbetrag, der übertragen wird (nicht auf der Schlussabrechnung). Ein übertragener Betrag ist damit nicht bezahlt; er wird mit der nächsten Abrechnung eingefordert oder zurückerstattet. Kein Zahlungsdatum, keine Mahnung, kein «Zahlung zurücksetzen». (`settled`)» Statt «(geplant #403)».

## Punkt 3: «verrechnet» (Weber, Beobachtung, Art. 120 OR)

- Art. 120 Abs. 1 OR: «Wenn zwei Personen einander Geldsummen oder andere Leistungen, die ihrem Gegenstande nach gleichartig sind, schulden, so kann jede ihre Schuld, insofern beide Forderungen fällig sind, mit ihrer Forderung verrechnen.»
- Art. 124 Abs. 1 OR: «Eine Verrechnung tritt nur insofern ein, als der Schuldner dem Gläubiger zu erkennen gibt, dass er von seinem Rechte der Verrechnung Gebrauch machen wolle.»
- Art. 265 OR: «Der Vermieter und der Mieter können nicht im Voraus auf das Recht verzichten, Forderungen und Schulden aus dem Mietverhältnis zu verrechnen.»

Urteil: **Es bleibt beim entschiedenen Wortlaut. Eine Änderung ist nicht nötig, und es braucht keinen PO-Entscheid.** Ist die nächste Abrechnung eine Nachzahlung, stehen sich bei ihrer Fälligkeit zwei fällige, gleichartige Forderungen gegenüber. Die nächste Abrechnung mit der Zeile «Übertrag aus Abrechnung NK-…» ist dann die Erklärung nach Art. 124 Abs. 1 OR. Das ist eine Verrechnung im Rechtssinn, nur eine angekündigte. Bei einer Nachzahlung unter CHF 5.00 aus der Vorperiode verrechnet der Gläubiger nicht, er stundet und fordert später zusammen ein. Folgt auf eine kleine Rückerstattung wieder eine Rückerstattung, ist es eine Gutschrift (Stundung mit Anrechnung, Runde 1 M-2). In beiden Fällen ist «verrechnet» der in der Schweizer Verwaltungspraxis übliche Ausdruck («wird mit der nächsten Abrechnung verrechnet», Saldovortrag) und für den Mieter verständlich. Es verkürzt kein Recht des Mieters: Art. 265 OR bleibt unberührt, ebenso die Auszahlung nach Art. 75 OR (M-2, offen). Ein juristisch genaueres Wort wie «angerechnet» oder «gutgeschrieben» passt nicht für beide Vorzeichen und würde «Bereits verrechnet mit NK-…» (Glossar Z. 178) und die PDF-Texte nach #448 (1) entzweien.

## Punkt 4: Hilfe zur Bemerkung (Anna P-3)

Code: Das PDF druckt die Bemerkung unter «Hinweise» («Remarques», «Osservazioni», «Notes») als ersten Satz (`pdf.service.ts:134, 1060-1068`, `statement-pdf.service.ts:151`). «steht im PDF, das der Mieter erhält» stimmt.

**Empfohlener Wortlaut** (eindeutig, kein PO-Entscheid: #448 (6) entscheidet nur, dass die Hilfe der berichtigten Abrechnung den Grund vorschlägt. Diese Fassung behält das bei):

- `statements_notes_help`
  - de: «Zum Beispiel eine Absprache mit dem Mieter. Die Bemerkung steht im PDF, das der Mieter erhält.»
  - fr: «Par exemple un accord avec le locataire. La remarque figure dans le PDF que reçoit le locataire.»
  - it: «Per esempio un accordo con l’inquilino. L’osservazione figura nel PDF che riceve l’inquilino.»
  - en: «For example an agreement with the tenant. The remark appears in the PDF the tenant receives.»
- `statements_notes_help_correction`
  - de: «Schreiben Sie hier, warum Sie die Abrechnung berichtigen. Die Bemerkung steht im PDF, das der Mieter erhält.»
  - fr: «Indiquez ici pourquoi vous rectifiez le décompte. La remarque figure dans le PDF que reçoit le locataire.»
  - it: «Indichi qui perché rettifica il conteggio. L’osservazione figura nel PDF che riceve l’inquilino.»
  - en: «Write here why you are correcting the statement. The remark appears in the PDF the tenant receives.»

Der Vorschlag ist bestätigt. Optional (Nit) beim gewöhnlichen Feld der Zusatz «Notieren Sie hier nichts, was nur für Sie bestimmt ist.» (fr «N’y notez rien qui ne soit destiné qu’à vous.», it «Non annoti qui nulla che sia destinato solo a Lei.», en «Do not note anything here that is meant only for you.»). Zum verworfenen versendeten PDF siehe V-31.

## Punkt 5: Satz im Dialog «Als bezahlt markieren» (Anna P-1, eigenes Issue)

- Art. 69 Abs. 1 OR: «Der Gläubiger braucht eine Teilzahlung nicht anzunehmen, wenn die gesamte Schuld feststeht und fällig ist.» Abs. 2: «Will der Gläubiger eine Teilzahlung annehmen, so kann der Schuldner die Zahlung des von ihm anerkannten Teiles der Schuld nicht verweigern.»
- Art. 88 Abs. 1 OR: «Der Schuldner, der eine Zahlung leistet, ist berechtigt, eine Quittung und, falls die Schuld vollständig getilgt wird, auch die Rückgabe des Schuldscheines oder dessen Entkräftung zu fordern.»

Urteil: **fachlich richtig.** Eine Teilzahlung tilgt die Schuld nicht. «Bezahlt» sperrt die Mahnung (`statements_no_reminder_after`), und das neue PDF sagt «Bezahlt am … Vielen Dank.». Damit bestätigt es wie eine Quittung den ganzen Betrag, und der Vermieter müsste den Rest gegen sein eigenes Dokument beweisen. Dass ein solches PDF rechtlich als Quittung gilt, ist **unsicher**.

Unvollständig (V-30): Der Dialog gilt auch für die Rückerstattung, also braucht es eine zweite Fassung. Und wer nicht als bezahlt markiert, kann den Rest heute nicht richtig mahnen, weil die Mahnung den ganzen Saldo nennt (`reminder.service.ts:89`). «Abrechnung berichtigen» mit «Bereits bezahlt» ist kein Ersatz: Es ist für eine fehlerhafte Abrechnung gedacht und erzeugt eine neue Nummer und ein neues PDF. Das Issue (`fachlich`, `entscheiden`) muss deshalb entscheiden, wie eine Teilzahlung erfasst wird und wie die Mahnung den Restbetrag nennt.

Wortlaut für das Issue (Text neu, der Hinweis zum Zahlungsdatum vor dem Abrechnungsdatum, #448 (4), bleibt unverändert, also kein PO-Entscheid für diesen Satz; die Regel zur Teilzahlung braucht ihn):

- Nachzahlung
  - de: «Hat der Mieter erst einen Teil überwiesen, markieren Sie die Abrechnung noch nicht als bezahlt.»
  - fr: «Si le locataire n’a versé qu’une partie du montant, ne marquez pas encore le décompte comme payé.»
  - it: «Se l’inquilino ha versato solo una parte dell’importo, non segni ancora il conteggio come pagato.»
  - en: «If the tenant has paid only part of the amount, do not mark the statement as paid yet.»
- Rückerstattung
  - de: «Haben Sie erst einen Teil zurückerstattet, markieren Sie die Abrechnung noch nicht als bezahlt.»
  - fr: «Si vous n’avez remboursé qu’une partie du montant, ne marquez pas encore le décompte comme payé.»
  - it: «Se ha rimborsato solo una parte dell’importo, non segni ancora il conteggio come pagato.»
  - en: «If you have refunded only part of the amount, do not mark the statement as paid yet.»

## Zusammenfassung: Eindeutig oder PO

| Punkt | Empfehlung | PO nötig |
|---|---|---|
| 1 | Wortlaut oben (genauer als der Vorschlag) | nein |
| 2 | Hilfetext oben; Abzeichen neutral mit eigenem Symbol | nein. Nur die Glossarzeile trägt der PO ein (#484) |
| 3 | «verrechnet» bleibt | nein |
| 4 | Vorschlag bestätigt | nein |
| 5 | Satz richtig, mit Fassung für die Rückerstattung; Teilzahlungsregel ins Issue | ja, für die Regel (eigenes Issue) |

## Vorgeschlagene Begriffe

Keine neuen Glossarbegriffe. Die Glossarzeile «Erledigt» neu formuliert (V-28, siehe Punkt 2), für #484.

## Nicht bestätigt

- Ob ein PDF «Bezahlt am … Vielen Dank.» rechtlich als Quittung nach Art. 88 OR gilt (Punkt 5): Gelesen habe ich nur den Wortlaut von Art. 88 und 89 OR auf Fedlex, keine Rechtsprechung.
- Dass «verrechnet» in der Schweizer Verwaltungspraxis üblich ist (Punkt 3): Das ist Verwalterpraxis, ich habe keine Quelle gesucht.
- Wie die Detailseite des Entwurfs nach dem Ersetzen den neuen Saldo zeigt, ohne neu zu laden: UI-Frage, nicht geprüft (wie in Runde 3).
- Tests nicht ausgeführt (laut Auftrag kein E2E, kein Persona-Stack). Alle Beträge habe ich von Hand nachgerechnet, aus `statement.service.ts` (`calculateStatement`, `countedBy`, `carriable`, `carriedOver`, `replaceStatement`, `offsetOf`, `updateStatus` Z. 680-682), `reminder.service.ts:58-89`, `Correction.svelte:20-45` und `src/lib/statement.ts:29-35`.
- Ob Issue #484 (Glossarzeilen) noch offen ist: nicht nachgesehen.
