# Fachreview #524, Runde 1 (Szenarien vor der Umsetzung)

Gegenstand: `git diff c086727 87e4107`, `tests/e2e/features/statement-detail.feature:1153-1173`, und der Plan des Aufrufers. Worktree `/tmp/claude/main-review-524-fach` (87e4107).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | «gilt nicht mehr» stimmt nicht, wenn sich nur die Bemerkung ändert, und «erhalten» behauptet mehr, als Dwello weiss. Der Hinweis muss sagen, was sich geändert hat. |
| V-2 | Verwalter | Major | Ein dauernder Hinweis hat keinen Ausweg: Dwello kann eine versendete Abrechnung nicht nochmals versenden. Ausserdem geht er über den Entscheid hinaus («a hint after saving»). |
| V-3 | Verwalter | Major | Entscheid B («der Verlauf nennt beide») steht weder im Plan noch im Szenario. Die Zeile «PDF erstellt» steht vor «Versendet» und sagt nicht, dass es ein neues PDF ist. |
| V-4 | Verwalter | Major | Das Szenario prüft nicht, dass der Verlauf das versendete PDF anbietet (ohne die neue Bemerkung). Auch ein Link auf das aktuelle PDF liesse es grün werden. |
| M-1 | Mietrecht | Major | Für Abrechnungen, die vor #449 versendet wurden, sieht der Plan keinen Hinweis vor. Das widerspricht dem Entscheid, denn der Mieter hat auch dort ein altes PDF. |
| M-2 | Mietrecht | Major | Besteht schon auf dem Basis-Commit: Die Zahlungsfrist einer versendeten Abrechnung lässt sich ohne Mitteilung an den Mieter verkürzen. Dwello zeigt die Abrechnung dann früher als «Überfällig» und schlägt früher eine Mahnung vor (beantwortet Frage 4). |
| V-5 | Verwalter | Minor | Die Bedingung «PDF verworfen oder nach sentAt neu erstellt» zeigt den Hinweis auch ohne Änderung, nämlich wenn das PDF beim Versand nicht neu erstellt werden konnte (`statement-pdf.service.ts:382-383`). Sie zeigt ihn auch, wenn eine Bemerkung zurückgeändert wurde. Fix: die aktuellen Werte mit den Werten beim Versand vergleichen (Zahlungsfrist und Bemerkung am Dokument speichern), nicht den Zustand des PDF. |
| V-6 | Verwalter | Minor | Der Plan umfasst nur «versendet/überfällig». Bearbeitet werden können aber auch «Erledigt» und «Bezahlt» (`statement.service.ts:343`, `editable: current`), und eine geänderte Bemerkung verwirft auch dort das PDF (`statement.service.ts:667-672`). Fix: Für diese Status gilt der Hinweis zur Bemerkung genauso. |
| V-7 | Verwalter | Minor | «PDF ansehen» stimmt nicht, denn die Route lädt die Datei herunter (`src/lib/server/file-proxy.ts:9`, Vorgabe `attachment`). Daneben stünde ein zweites «PDF herunterladen» (`PdfAction.svelte:30-32`). Fix: «Versendetes PDF herunterladen» (Tabelle unten). |
| V-8 | Verwalter | Minor | Bei einer versendeten Abrechnung ist der Hilfetext `statements_notes_help` («Die Bemerkung steht im PDF, das der Mieter erhält.», `messages/de.json:1405`) falsch. Fix: eine Variante für versendete Abrechnungen, `statements_notes_help_sent` (Tabelle). |

## V-1 «gilt nicht mehr» und «erhalten»

- Beleg: Szenario-Zeile 1161-1162 (nur die Bemerkung ändert sich, danach «Dann sagt die Abrechnung, dass das PDF, das der Mieter erhalten hat, nicht mehr gilt»). Wortlaut im Plan: «Das PDF, das der Mieter erhalten hat, gilt nicht mehr». Nach dem Versand sind die Beträge geschützt (`statement.service.ts:657-663`). Es ändern sich nur die Zahlungsfrist und die Bemerkung über die Oberfläche, das Abrechnungsdatum nur über die API (`edit/+page.server.ts:15-29`).
- Warum falsch: Ändert sich nur die Bemerkung, bleibt die Abrechnung, die der Mieter hat, vollständig gültig: Beträge, Saldo, Zahlteil und Zahlungsfrist. Eine Absprache wie «Ratenzahlung bis Ende März vereinbart» gilt, weil sie vereinbart ist, nicht weil sie im PDF steht. «Gilt nicht mehr» lässt den Vermieter glauben, die Abrechnung müsse förmlich neu zugestellt werden und die Frist beginne neu. Beim Brief weiss Dwello nur, dass der Vermieter das PDF versendet hat (`statement-send.service.ts:70-96`), nicht dass der Mieter es erhalten hat.
- Fix:
  - Der Hinweis nennt, was sich geändert hat, in drei Fassungen: Bemerkung, Zahlungsfrist, Rückerstattung bis. Ändern sich Zahlungsfrist und Bemerkung, gilt die Fassung zur Zahlungsfrist.
  - Statt «erhalten» heisst es «versendet».
  - Die Fassung zur Bemerkung folgt dem früheren Vorschlag V-31 («…, wenn er die Bemerkung lesen soll»).
  - Die Szenario-Zeile 1162 lautet dann z.B. «Dann rät die Abrechnung, dem Mieter das neue PDF zu senden, wenn er die Bemerkung lesen soll». Zeile 1172 wird entsprechend verneint.

## V-2 Dauernder Hinweis ohne Ausweg

- Beleg: `statement-send.service.ts:23` (`STATEMENT_ALREADY_SENT`, «Only a draft can be sent»). Laut Plan zeigt die Seite den Hinweis, solange die Abrechnung versendet oder überfällig ist. Der Entscheid vom 31.10.2026 sagt «a hint after saving».
- Warum falsch: Der Vermieter kann das neue PDF nur ausserhalb von Dwello senden. Danach bleibt der Hinweis, bis die Abrechnung bezahlt ist, und fordert ihn zu etwas auf, das er schon getan hat. Ein Hinweis, der immer bleibt, wird mit der Zeit übersehen. Gleichzeitig fehlt im Verlauf, dass die neue Fassung versendet wurde. Bei Mahnungen ist das ein Dokument.
- Fix:
  - Wie entschieden: Der Hinweis erscheint nach dem Speichern auf der Detailseite (Rückmeldung nach dem Redirect).
  - Was dauerhaft sichtbar bleiben soll, zeigt der Verlauf (V-3).
  - Ein dauernder Hinweis mit «Neues PDF als versendet markieren» (ein zweites Dokument) wäre eine neue Funktion. Dafür braucht es einen Entscheid in einem eigenen Issue (`domain`, `needs-decision`).

## V-3 Der Verlauf nennt nicht beide PDF

- Beleg: `src/routes/statements/[id]/MetadataCard.svelte:46-52`. Die Zeile `statements_pdf_created` («PDF erstellt», `pdfGeneratedAt`) steht immer vor der Versandzeile. Die Liste ist nicht nach Datum geordnet.
- Warum falsch: Nach einer Änderung steht «PDF erstellt 05.11.2026» über «Versendet per E-Mail … 01.11.2026». So sieht es aus, als hätte der Mieter dieses PDF erhalten. Genau das soll #524 verhindern. Laut Entscheid ist die spätere Fassung eine neue Version, und der Verlauf nennt beide.
- Fix: Ein PDF, das nach dem Versand erstellt wurde, erhält die Zeile «Neues PDF erstellt» nach der Versandzeile. Die Versandzeile trägt den Link auf das versendete PDF. Das Szenario erhält einen Schritt wie «Und nennt der Verlauf das versendete und das neue PDF». Im Szenario muss der Verwalter dafür nach dem Speichern das PDF erstellen (vgl. Zeile 1149).

## V-4 Das Szenario prüft nicht, welches PDF der Verlauf anbietet

- Beleg: Zeilen 1163 und 1173 («bietet der Verlauf das PDF an, das der Mieter erhalten hat»). Es gibt einen Schritt `steht im PDF nicht {string}` (`tests/e2e/steps/statement-detail.steps.ts:311`).
- Warum falsch: Kern von #524 ist, dass das PDF des Mieters nicht stillschweigend ersetzt wird. Ein Schritt, der nur einen Link sucht, lässt auch einen Link auf das aktuelle PDF durch.
- Fix: In Szenario 1 nach Zeile 1163 ergänzen: «Und im versendeten PDF steht nicht "Ratenzahlung bis Ende März vereinbart"». Dazu kommt, nach dem Erstellen des neuen PDF, «Dann steht im PDF "Ratenzahlung …"». Der Schritt muss das PDF des Links im Verlauf laden.

## M-1 Abrechnungen vor #449

- Beleg: Plan («Statements sent before #449 have no such document: no link, no hint»). Entscheid: «After a change that discards the PDF of a sent statement, a hint after saving says to send the tenant the new PDF.»
- Warum falsch: Auch der Mieter einer vor #449 versendeten Abrechnung hat das alte PDF. Die geänderte Zahlungsfrist oder Bemerkung kennt er genauso wenig. Ohne Dokument fehlt nur der Link.
- Fix: Ob der Hinweis erscheint, hängt an der Änderung beim Speichern (`changesPdf` bei einer Abrechnung, die kein Entwurf ist), nicht am Dokument. Der Satz «Das versendete PDF finden Sie im Verlauf.» erscheint nur, wenn es ein Dokument gibt. Szenario: eine Zeile in den Examples oder ein Szenario ohne Dokument, falls die E2E-Daten das erlauben, sonst ein Test auf einer tieferen Ebene.

## M-2 Zahlungsfrist nach dem Versand (Frage 4)

- Beleg:
  - Die Bearbeitungsseite übernimmt jedes Datum (`src/routes/statements/[id]/edit/+page.server.ts:20-29`), das Backend ebenfalls (`backend/src/routes/statements.ts:260`, nur `format: 'date'`).
  - «Überfällig» richtet sich nach `payment_deadline` (`backend/src/services/statement.service.ts:104`), ebenso der Vorschlag für eine Mahnung (`:88-93`).
  - Der Hilfetext sagt bei einer versendeten Abrechnung nicht die Wahrheit: «Bis zu diesem Datum bezahlt der Mieter die Nachzahlung.» (`messages/de.json:1404`).
- Fedlex, OR (SR 220), Stand 1. Oktober 2026:
  - Art. 75: «Ist die Zeit der Erfüllung weder durch Vertrag noch durch die Natur des Rechtsverhältnisses bestimmt, so kann die Erfüllung sogleich geleistet und gefordert werden.»
  - Art. 102 Abs. 1: «Ist eine Verbindlichkeit fällig, so wird der Schuldner durch Mahnung des Gläubigers in Verzug gesetzt.»
  - Art. 102 Abs. 2: «Wurde für die Erfüllung ein bestimmter Verfalltag verabredet, oder ergibt sich ein solcher infolge einer vorbehaltenen und gehörig vorgenommenen Kündigung, so kommt der Schuldner schon mit Ablauf dieses Tages in Verzug.»
  - Art. 257d Abs. 1, Satz 1: «Ist der Mieter nach der Übernahme der Sache mit der Zahlung fälliger Mietzinse oder Nebenkosten im Rückstand, so kann ihm der Vermieter schriftlich eine Zahlungsfrist setzen …»
- Antwort auf Frage 4:
  - Der Mieter gerät nicht durch den Ablauf der Zahlungsfrist in der Abrechnung in Verzug, sondern erst durch eine Mahnung (Art. 102 Abs. 1 OR). Abs. 2 gilt nur für einen «verabredeten» Verfalltag. Eine Frist, die der Vermieter in der Abrechnung einseitig setzt, ist nach dem Wortlaut kein solcher.
  - Ob die mitgeteilte Frist den Vermieter bindet, also ob er vorher nicht mahnen kann, sagt der Normtext nicht. Das ist **unsicher**: Vertrauensprinzip und Praxis, nicht auf Fedlex belegt.
  - Für die Praxis: Eine längere Frist begünstigt den Mieter und schadet nicht, wenn er sie nicht kennt. Eine kürzere Frist, die dem Mieter nicht mitgeteilt wurde, kann ihm nicht entgegengehalten werden (**unsicher**, s.o.). Dwello würde ihn aber nach ihr als «Überfällig» zeigen und eine Mahnung vorschlagen, bevor die Frist abgelaufen ist, die er kennt.
  - Kurz: Ja, eine neue Zahlungsfrist muss dem Mieter zugehen, sonst gilt für ihn die Frist im versendeten PDF.
- Fix:
  - Der Hinweis nach dem Speichern nennt die Zahlungsfrist (V-1).
  - Die Bearbeitungsseite zeigt bei einer versendeten Abrechnung den Hilfetext `statements_deadline_help_sent`.
  - Das Backend weist eine Zahlungsfrist zurück, die vor der Frist beim Versand liegt. Die Frist beim Versand liegt am Dokument: `documents.paymentDeadline` gibt es, `createDocument` in `statement-send.service.ts` setzt sie aber nicht.
  - Weil der Fehler schon besteht, entscheidet der Aufrufer: im Rahmen von #524 beheben oder als eigenes Issue (`domain`, `needs-decision`) erfassen.

## Wortlaut

| key | de | fr | it | en |
|---|---|---|---|---|
| statements_sent_pdf_changed_notes | Die neue Bemerkung steht nur im neuen PDF. Soll der Mieter sie lesen, erstellen Sie das neue PDF und senden Sie es ihm. | La nouvelle remarque ne figure que dans le nouveau PDF. Si le locataire doit la lire, créez le nouveau PDF et envoyez-le-lui. | La nuova osservazione figura solo nel nuovo PDF. Se l’inquilino deve leggerla, crei il nuovo PDF e glielo invii. | The new note is only in the new PDF. If the tenant should read it, create the new PDF and send it to them. |
| statements_sent_pdf_changed_deadline | Im versendeten PDF steht die bisherige Zahlungsfrist. Damit der Mieter die neue kennt, erstellen Sie das neue PDF und senden Sie es ihm. | Le PDF envoyé indique l’ancien délai de paiement. Pour que le locataire connaisse le nouveau, créez le nouveau PDF et envoyez-le-lui. | Nel PDF inviato figura il termine di pagamento precedente. Affinché l’inquilino conosca quello nuovo, crei il nuovo PDF e glielo invii. | The PDF sent shows the previous payment deadline. So that the tenant knows the new one, create the new PDF and send it to them. |
| statements_sent_pdf_changed_refund_by | Im versendeten PDF steht das bisherige Datum der Rückerstattung. Damit der Mieter das neue kennt, erstellen Sie das neue PDF und senden Sie es ihm. | Le PDF envoyé indique l’ancienne date du remboursement. Pour que le locataire connaisse la nouvelle, créez le nouveau PDF et envoyez-le-lui. | Nel PDF inviato figura la data di rimborso precedente. Affinché l’inquilino conosca quella nuova, crei il nuovo PDF e glielo invii. | The PDF sent shows the previous refund date. So that the tenant knows the new one, create the new PDF and send it to them. |
| statements_sent_pdf_in_history | Das versendete PDF finden Sie im Verlauf. | Vous trouverez le PDF envoyé dans l’historique. | Trova il PDF inviato nella cronologia. | You will find the PDF sent in the history. |
| statements_history_sent_pdf | Versendetes PDF herunterladen | Télécharger le PDF envoyé | Scaricare il PDF inviato | Download PDF sent |
| statements_history_new_pdf | Neues PDF erstellt | Nouveau PDF créé | Nuovo PDF creato | New PDF created |
| statements_notes_help_sent | Die Bemerkung steht im neuen PDF. Der Mieter liest sie erst, wenn Sie es ihm senden. | La remarque figure dans le nouveau PDF. Le locataire ne la lira que lorsque vous le lui enverrez. | L’osservazione figura nel nuovo PDF. L’inquilino la leggerà solo quando glielo invierà. | The note is in the new PDF. The tenant only reads it once you send it to them. |
| statements_deadline_help_sent | Der Mieter kennt die neue Zahlungsfrist erst, wenn Sie ihm das neue PDF senden. | Le locataire ne connaîtra le nouveau délai de paiement que lorsque vous lui enverrez le nouveau PDF. | L’inquilino conoscerà il nuovo termine di pagamento solo quando gli invierà il nuovo PDF. | The tenant only knows the new payment deadline once you send them the new PDF. |

Fehlende Begriffe: «Versendetes PDF» und «Neues PDF» (die Fassung beim Versand und eine später erstellte) stehen nicht in `UBIQUITOUS_LANGUAGE.md`. Vorschlag für die Zeile «Dokument» oder eine eigene Zeile: «**Versendetes PDF**: Das PDF einer Abrechnung, wie Dwello es beim Versand als Dokument abgelegt hat (#449). Ändert sich danach die Zahlungsfrist oder die Bemerkung, erstellt Dwello ein **neues PDF**. Das versendete bleibt unverändert, und der Verlauf nennt beide (#524).» Bitte als Issue erfassen (`domain`, `needs-decision`).

## Nicht bestätigt

- Ob eine mitgeteilte Zahlungsfrist den Vermieter bindet, sodass er vorher nicht mahnen kann, und ob eine einseitig gesetzte Frist ein «verabredeter Verfalltag» nach Art. 102 Abs. 2 OR sein kann: Der Normtext sagt es nicht (OR, Fedlex, Stand 1.10.2026, Art. 75 und 102 gelesen). Rechtsprechung habe ich nicht gesucht; **unsicher**.
- Code-Fakt des Aufrufers «marking paid also discards it»: Im Code nicht bestätigt. `updateStatementStatus` verwirft das PDF nur beim Versand (`statement.service.ts:743`), und der Kommentar sagt «Once paid, the PDF as sent stays» (`:666`). «Bezahlt am» steht nur in einem PDF, das nach der Zahlung erstellt wurde, und `resetPayment` verwirft nur dieses (`:776-781`). Dafür braucht es keinen Hinweis; der Fall «Zahlung zurücksetzen» erzeugt keinen falschen Hinweis.
- Ob die E2E-Daten eine Abrechnung ohne Dokument (vor #449) bereitstellen können (M-1): nicht geprüft.

Geprüft: Versandablauf (E-Mail und Brief) und Zeitpunkte von `pdfGeneratedAt` und `sentAt` an zwei Fällen: ohne Änderung kein Hinweis, nach einer Änderung der Bemerkung ein Hinweis, mit dem Sonderfall eines PDF, das beim Versand nicht erstellt werden konnte (V-5); Abrechnungsdatum nur über die API änderbar; Szenario 2 ohne Änderung mit Ausnahme von V-1 und V-4; Begriffe der Szenarien.
