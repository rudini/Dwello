# Fachreview W6d (#94): Mindest-Saldo CHF 5, Runde 1

Gegenstand: `tests/e2e/features/statement-minimum-balance.feature` und der neue Schritt «sagt die Zahlung der Abrechnung …» (`tests/e2e/steps/statement-detail.steps.ts:184`), Commit 041baa4 (Worktree `review-w6d-fach`), dazu die geplante Umsetzung 1–5 des Auftrags.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Rückerstattung unter CHF 5 «nicht auszahlen» behält zu viel bezahlte Akonti ein (Art. 257b Abs. 1 OR); ein einseitiger Verzicht des Vermieters lässt die Forderung des Mieters nicht untergehen (Art. 115 OR). Text «Wir zahlen ihn nicht aus.» ist für den Mieter irreführend. Widerspricht dem Entscheid in #94 → Produktentscheid |
| V-1 | Verwalter | Major | Das Szenario prüft nur das PDF vor dem Versand; das PDF nach dem Versand (mit `paidDate`) zeigt heute «Bezahlt am … Vielen Dank.» bzw. «Überwiesen am …» und ist ungeprüft |
| V-2 | Verwalter | Major | «Zahlung zurücksetzen» (#92, offen #291) öffnet eine erledigte Kleinsaldo-Abrechnung wieder: Versendet → Überfällig → Mahnung über CHF 3.00 möglich, gegen «kann nicht gemahnt werden» |
| V-3 | Verwalter | Minor | «bietet die Abrechnung keine Mahnung an» direkt nach dem Versand ist auch ohne die Änderung wahr (noch nicht überfällig) und belegt nichts |
| V-4 | Verwalter | Minor | Zahlungsfeld zeigt neben «nicht eingefordert» die Zeilen «Zahlungsfrist»/«Rückerstattung bis» und «Bezahlt am»; Glossar «Zahlungsdatum = Datum der tatsächlichen Bezahlung» passt nicht |
| V-5 | Verwalter | Minor | Fehlender Glossarbegriff (Szenario: «Kleiner Saldo»); Glossar-Einträge Saldo, Bezahlt, Zahlungsdatum und Anforderungsdokumente nennen die Schwelle nicht |
| V-6 | Verwalter | Minor | Grenzbeispiele liegen alle auf dem 5-Rappen-Raster; kein Beispiel belegt, dass der gerundete Saldo verglichen wird |
| V-7 | Verwalter | Minor | Versand-Dialog nennt die neue Folge nicht (Abrechnung gilt mit dem Versand als bezahlt, Betrag wird nicht eingefordert/ausbezahlt) |
| M-2 | Mietrecht | Minor | «Wir fordern ihn nicht ein.» lässt offen, ob nur jetzt oder endgültig; für einen klaren Erlass «Wir verzichten darauf.» |
| V-8 | Verwalter | Nit | Übersetzungen weichen von den bestehenden PDF-Verben ab (fr «virer», it «bonificare») |
| V-9 | Verwalter | Nit | Detailseiten-Text für die kleine Rückerstattung («… Sie zahlen ihn nicht aus.») ist in keinem Szenario |

## Bestätigt

- **Rechnungen der Beispiele** (eine Wohnung im Gebäude → Wohnungsanteil 100 %; Mietvertrag seit 2020 → Zeitanteil 366/366, Heizprofil über das ganze Jahr = 100 %; keine Verwaltungspauschale; Akonto 12 × 100.00 = 1'200.00):
  - 1'203.00 − 1'200.00 = Nachzahlung 3.00; 1'197.00 − 1'200.00 = Rückerstattung 3.00.
  - 1'204.95 → 4.95 (unter 5, Bezahlt); 1'205.00 → 5.00 (Versendet); 1'195.05 → −4.95 (Bezahlt); 1'195.00 → −5.00 (Versendet).
  - Alle Werte liegen auf dem 5-Rappen-Raster: mit kaufmännischer Rundung (heute) und mit der Rundung zugunsten des Mieters (#79/#341) dasselbe Ergebnis. Randfall Saldo 0: bleibt im bestehenden Zweig `balance === 0` (`pdf.service.ts:547`, `statement.service.ts:486`), muss vor dem neuen Zweig geprüft werden. Mieterwechsel: jede Abrechnung hat ihren eigenen Saldo, die Schwelle gilt je Abrechnung; kein Sonderfall.
- **Punkt 5 (genau CHF 5.00 wie bisher):** stimmt mit #94 («below CHF 5») überein; Beispiele 1205 / 1195 decken es ab.
- **Punkt 2, paidAmount 0.00:** einverstanden. Es floss kein Geld; `paidThisMonth` summiert `paidAmount` (`backend/src/routes/dashboard.ts:130–133`) und würde sonst erlassene Franken als Einnahme zählen. Die Oberfläche zeigt `paidAmount` sonst nirgends (nur im Verlauf-Datensatz `paymentResets`). Nachzuführen: `docs/data-model.md:272` («the Saldo when marked paid without an amount») um «0.00 when the Saldo is below CHF 5 and settled on sending (#94)». paidDate = Abrechnungsdatum: analog Saldo 0, siehe aber V-4.
- **Punkt 4 (Mahnung):** `reminder.service.ts:58` lehnt jeden Status ausser `sent`/`overdue` ab; gilt, solange der Status `paid` bleibt (siehe V-2).
- **Nachzahlung erlassen (Punkt 1, Nachzahlung):** der Vermieter darf auf seine eigene Forderung verzichten; Art. 115 OR: «Eine Forderung kann durch Übereinkunft ganz oder zum Teil auch dann formlos aufgehoben werden, wenn zur Eingehung der Verbindlichkeit eine Form erforderlich oder von den Vertragschliessenden gewählt war.» Die Übereinkunft kommt bei einem für den Mieter nur vorteilhaften Antrag ohne ausdrückliche Annahme zustande, Art. 6 OR: «Ist wegen der besonderen Natur des Geschäftes oder nach den Umständen eine ausdrückliche Annahme nicht zu erwarten, so gilt der Vertrag als abgeschlossen, wenn der Antrag nicht binnen angemessener Frist abgelehnt wird.» (Anwendung auf den Erlass: **unsicher**, eigene Würdigung.)
- **Vorlegepflicht** bleibt erfüllt, die Abrechnung wird weiterhin erstellt und zugestellt: Art. 4 Abs. 1 VMWG: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
- **Kein Zahlteil, keine IBAN-Bitte:** prüfbar über «steht im PDF nicht "Zahlteil"» (`qrBillSection`, `payBy`) und «nicht "IBAN mit"» (`refundAccount`, `pdf.service.ts:90`); beide Teilstrings kommen sonst nicht im PDF vor.
- Bezüge zu #322 und #278: keine Auswirkung, solange eine Kleinsaldo-Abrechnung nie eine Mahnung erhält (gilt nur ohne den Weg aus V-2).

## Befunde

### M-1 (Mietrecht, Major): Kleine Rückerstattung einbehalten

- **Beleg:** Szenario Z. 29–37 («Wir zahlen ihn nicht aus.»); #94 «Decided»: «is not claimed or paid out». Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Art. 115 OR (oben): Aufhebung nur «durch Übereinkunft». `docs/nebenkostenabrechnung-anforderungen.md:28`: «Kein Gewinn auf Nebenkosten.» Die App selbst sagt bei der Mahnungs-Ablehnung: «Eine Rückerstattung wird nicht gemahnt: Sie schulden dem Mieter den Betrag.» (`reminder.service.ts:62`).
- **Warum falsch:** Die Akonti über den tatsächlichen Kosten sind keine Nebenkosten; der Vermieter schuldet sie zurück. Er kann diese Schuld nicht einseitig erlassen, nur der Mieter als Gläubiger kann darauf verzichten. Ein stillschweigender Verzicht nach Art. 6 OR ist hier unwahrscheinlich, weil der Antrag den Mieter benachteiligt (**unsicher**). Die Forderung bleibt bestehen (Verjährung laut `anforderungen.md:78` 5 Jahre, **unsicher-B**). Dwello führt die Abrechnung aber als «Bezahlt», und das PDF sagt dem Mieter «Wir zahlen ihn nicht aus.», als hätte er keinen Anspruch. Das ist zum Nachteil des Mieters irreführend. Der Betrag ist klein, aber Dwello erzeugt das für jede solche Abrechnung.
- **Was es löst (Produktentscheid, widerspricht #94):**
  - (a) Mindestbetrag nur für die Nachzahlung; eine Rückerstattung wird immer ausbezahlt. Das folgt dem Grundsatz «zugunsten des Mieters» der Rundung (#79).
  - (b) Kleine Rückerstattung nur auf Wunsch: Abrechnung mit dem Versand erledigt, Text de «Der Betrag ist kleiner als CHF 5.00. Wir überweisen ihn Ihnen auf Wunsch: Teilen Sie uns dazu Ihre IBAN mit.» (Detailseite: «Der Betrag ist kleiner als CHF 5.00. Sie überweisen ihn nur, wenn der Mieter es wünscht.»). Der Anspruch bleibt erhalten; der Mieter muss für CHF 3 nichts tun.
  - (c) Verrechnung mit dem nächsten Mietzins (Art. 120 OR) ist nach #94 ausgeschlossen («Nothing is carried forward»).
  Empfehlung: (a) oder (b); der Aufrufer legt es dem Produktverantwortlichen vor (Issue `fachlich`, `entscheiden`, Verweis auf #94).

### V-1 (Verwalter, Major): PDF nach dem Versand ungeprüft

- **Beleg:** Szenarien Z. 18–37 erstellen und laden das PDF im Entwurf (vor «versendet»). Beim Versand werden Abrechnungsdatum und Zahlungsfrist neu gesetzt und das PDF verworfen (`statement.service.ts:423–431`, `datedToday`); das neue PDF hat dann `paidDate`. `balanceText` (`pdf.service.ts:548`) gibt bei gesetztem `paidDate` «Bezahlt am {date}. Vielen Dank.» bzw. «Überwiesen am {date}.» zurück. Genau dieses PDF erhält der Mieter nach dem Versand, und die Reihenfolge der Zweige ist die Fehlerquelle.
- **Warum falsch:** Das Mieter-Dokument sagt sonst «Bezahlt am … Vielen Dank.» zu einem Betrag, den niemand bezahlt hat (bzw. «Überwiesen am» für eine nicht überwiesene Rückerstattung).
- **Was es löst:** im Szenario «Kleiner Saldo ist mit dem Versand erledigt» (oder einem eigenen) nach dem Versand das PDF erstellen und herunterladen und prüfen: «steht im PDF "Der Betrag ist kleiner als CHF 5.00. Wir fordern ihn nicht ein."», «steht im PDF nicht "Bezahlt am"», «steht im PDF nicht "Zahlteil"». Im Code den Kleinsaldo-Zweig vor den `paidDate`-Zweig setzen (wie Saldo 0).

### V-2 (Verwalter, Major): Zurücksetzen macht den Kleinsaldo mahnbar

- **Beleg:** `StatusActions.svelte:36–40` bietet «Zahlung zurücksetzen» bei jedem `paid`; `resetPayment` (`statement.service.ts:512–527`) setzt auf `sent`, nach der Frist `overdue`. Danach Mahnung möglich, weil `owes` und `reminder.service.ts:62` nur `balance > 0` prüfen. Die gleiche Lücke für Saldo 0 ist offen in #291 (V-5); die Änderung macht sie häufiger (jeder Saldo bis CHF 4.95 statt nur 0.00). Nach dem Zurücksetzen speichert «Als bezahlt markieren» ohne Betrag `paidAmount = balance` (3.00), nicht 0.00 (`statement.service.ts:494`).
- **Warum falsch:** #94 entscheidet «cannot be gemahnt». Über diesen Weg erhält der Mieter eine Mahnung über einen Betrag, den ihm die Abrechnung erlassen hat; bei einer Nachzahlung widerspricht das dem Erlass (M-2).
- **Was es löst:** die Mahnung am Saldo festmachen, nicht nur am Status: `reminder.service.ts` lehnt `0 < balance < 5` mit einem eigenen Code ab (z. B. `REMINDER_BELOW_MINIMUM`, de «Der Betrag ist kleiner als CHF 5.00. Er wird nicht eingefordert und nicht gemahnt.»), und `owes` in der Oberfläche verlangt `balance >= 5`. Zusätzlich Kleinsaldo in #291 nachtragen (kein Zurücksetzen bei Saldo 0 oder unter CHF 5).

### V-3 (Verwalter, Minor): Mahnungsschritt belegt nichts

- **Beleg:** Szenario Z. 47; Schritt `documents.steps.ts:108`. Direkt nach dem Versand ist die Abrechnung nie überfällig; der Knopf fehlt schon heute (`StatusActions.svelte:28`).
- **Was es löst:** Schritt streichen (der Status «Bezahlt» trägt die Aussage) oder die Mahnung über den in V-2 genannten Backend-Test belegen (`*.pg.test.ts`: Kleinsaldo, Status `overdue` gesetzt, Mahnung abgelehnt).

### V-4 (Verwalter, Minor): Zahlungsfeld widerspricht dem Text

- **Beleg:** `PaymentPanel.svelte:30–46` zeigt immer «Zahlungsfrist» bzw. «Rückerstattung bis» mit Datum und bei `paidDate` «Bezahlt am». Glossar `UBIQUITOUS_LANGUAGE.md:67`: «**Zahlungsdatum** | Datum der tatsächlichen Bezahlung.»
- **Warum falsch:** «Der Betrag ist kleiner als CHF 5.00. Sie fordern ihn nicht ein.» neben «Zahlungsfrist 16.11.2026» und «Bezahlt am 17.10.2026»: der unerfahrene Vermieter liest, es sei doch etwas fällig bzw. bezahlt worden. Gilt heute schon für Saldo 0.
- **Was es löst:** bei Saldo 0 und Kleinsaldo die Zeilen Zahlungsfrist und «Bezahlt am» weglassen. Glossar: siehe V-5.

### V-5 (Verwalter, Minor): Fehlender Begriff, Dokumente nicht nachgeführt

- **Beleg:** Funktionalität Z. 3 und Szenario Z. 40 «Kleiner Saldo», nicht im Glossar. `UBIQUITOUS_LANGUAGE.md:156` (Saldo: «Saldo 0.00: keine Zahlung, kein Zahlteil»), `:171` (Bezahlt), `:67` (Zahlungsdatum); `docs/nebenkostenabrechnung-anforderungen.md:45` («QR-Rechnung nur bei Nachzahlung»), `:93`, `:148`, `:151`; `docs/PRD-Dwello.md:480`, `:545`. #94 «Done means» verlangt die Glossar-Nachführung; das Glossar darf hier nicht geändert werden → Issue.
- **Vorschlag Glossar (Issue, Labels `fachlich`, `entscheiden`):**
  - neu **Mindestbetrag**: «Fester Betrag von CHF 5.00. Ist der Saldo (Nachzahlung oder Rückerstattung) kleiner, wird er weder eingefordert noch ausbezahlt: kein Zahlteil, keine Bitte um die IBAN; die Abrechnung ist mit dem Versand bezahlt und wird nicht gemahnt; nichts wird auf die nächste Abrechnung übertragen (#94). Verglichen wird der gerundete Saldo.» (Wortlaut zur Rückerstattung je nach Entscheid zu M-1.) Im Szenario dann «Saldo unter dem Mindestbetrag» statt «Kleiner Saldo».
  - Saldo: «Saldo 0.00 oder unter dem Mindestbetrag: keine Zahlung, kein Zahlteil.»
  - Bezahlt: «… abgeschlossen; bei Saldo 0.00 oder unter dem Mindestbetrag mit dem Versand.»
  - Zahlungsdatum: «Datum der tatsächlichen Bezahlung; bei Saldo 0.00 oder unter dem Mindestbetrag das Abrechnungsdatum.»
- Anforderungsdokument und PRD in derselben Änderung nachführen (z. B. `:45` «QR-Rechnung nur bei einer Nachzahlung ab CHF 5.00»).

### V-6 (Verwalter, Minor): Vergleich mit dem gerundeten Saldo nicht belegt

- **Beleg:** Beispiele Z. 58–62 liegen auf dem 5-Rappen-Raster; die Rundung spielt keine Rolle.
- **Was es löst:** zwei Beispiele, die mit beiden Rundungsregeln gleich ausgehen:
  - 1195.02 → vor Rundung −4.98, kaufmännisch −5.00, zugunsten Mieter (aufgerundet) −5.00 → «Versendet»;
  - 1205.02 → vor Rundung 5.02, kaufmännisch 5.00, zugunsten Mieter (abgerundet) 5.00 → «Versendet».
  Das erste würde «Bezahlt», wenn der ungerundete Betrag (−4.98) verglichen würde; das zweite prüft, dass ein auf genau 5.00 gerundeter Saldo eingefordert wird. 1204.98 (4.98) geht je nach Rundung verschieden aus (kaufmännisch 5.00 → Versendet, #79 → 4.95 → Bezahlt) und gehört erst nach dem Merge von #341 dazu.

### V-7 (Verwalter, Minor): Folge des Versands nicht genannt

- **Beleg:** `SendDialog.svelte:47–48` («Dwello verschickt die Abrechnung nicht selbst …», «Dwello datiert die Abrechnung …»). CLAUDE.md, Design-Regeln: Aktionen bestätigen «with their real consequence».
- **Was es löst:** bei Kleinsaldo ein dritter Satz, de «Der Saldo von {amount} ist kleiner als CHF 5.00. Mit dem Versand gilt die Abrechnung als bezahlt; Sie fordern den Betrag nicht ein.» (bzw. «… zahlen ihn nicht aus.»), in allen vier Sprachen.

### M-2 (Mietrecht, Minor): «Wir fordern ihn nicht ein» ist kein klarer Verzicht

- **Beleg:** Szenario Z. 25; Art. 115 OR (oben).
- **Warum:** «nicht einfordern» lässt offen, ob der Vermieter später doch fordert (Verjährung 5 Jahre). Ein Erlass sollte eindeutig sein; der Mieter soll wissen, dass er nichts tun muss.
- **Was es löst:** de «Der Betrag ist kleiner als CHF 5.00. Wir verzichten darauf; Sie müssen nichts bezahlen.»; fr «Le montant est inférieur à CHF 5.00. Nous y renonçons ; vous n’avez rien à payer.»; it «L’importo è inferiore a CHF 5.00. Vi rinunciamo; non deve pagare nulla.»; en «The amount is less than CHF 5.00. We waive it; you do not need to pay anything.» Detailseite: «Der Betrag ist kleiner als CHF 5.00. Sie verzichten darauf.»

### V-8 (Verwalter, Nit): Übersetzungen

- **Beleg:** bestehende PDF-Texte `pdf.service.ts:164–167` (fr «Nous vous virons le montant»), `:241–244` (it «Le bonifichiamo l’importo»).
- **Vorschlag** (falls der Wortlaut bleibt): fr «Nous ne vous le virons pas.»; it «Non lo richiediamo.» statt «Non lo esigiamo.» (natürlicher, weniger hart) und «Non glielo bonifichiamo.»; en «We will not collect it.» / «We will not pay it out.»

### V-9 (Verwalter, Nit): Detailtext Rückerstattung ohne Szenario

- **Beleg:** Szenario Z. 40–47 nur Nachzahlung; Z. 50–62 prüft für die Rückerstattung nur den Status.
- **Was es löst:** im Szenariogrundriss eine Spalte «Zahlung» mit dem erwarteten Satz, oder ein zweites Versand-Szenario mit 1197.

## Fehlende Begriffe

- «Mindestbetrag» (Vorschlag siehe V-5), dazu die Nachführung von Saldo, Bezahlt, Zahlungsdatum. Issue mit Labels `fachlich`, `entscheiden`; bis dahin `TODO(fachlich prüfen, #<issue>)` an Code und Texten mit dem Begriff.

## Nicht bestätigt

- Ob das Schweigen des Mieters einen Verzicht auf seine Rückerstattung nach Art. 6 OR annimmt: eigene Würdigung, keine Rechtsprechung gefunden (`mmx search` «Nebenkostenabrechnung Kleinbetrag Guthaben Mieter nicht ausbezahlt Bagatellgrenze Schweiz»: nur allgemeine Ratgeber; Beobachter: «Eine zahlenmässige Grenze gibt es nicht» – zur Höhe von Nachforderungen, nicht zu Kleinbeträgen) → **unsicher**.
- Eine in der Praxis übliche Bagatellgrenze für Nebenkosten-Salden (HEV, Mieterverband): keine Quelle gefunden (gleiche Suche).
- Verjährungsfrist der Rückforderung (5 oder 10 Jahre): nur `anforderungen.md:78` (unsicher-B); Fedlex Art. 128 Ziff. 1 OR («für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen») gelesen, Anwendung auf den Abrechnungssaldo nicht bestätigt.
- Fedlex-Wortlaute abgerufen aus `fedlex.data.admin.ch` (OR Stand 1.10.2026, VMWG Stand 1.10.2025): Art. 6, 115, 120, 128, 257a, 257b OR; Art. 4, 8 VMWG.
- Wirkung von #341 (Rundung zugunsten des Mieters) nur aus dem Glossar (`UBIQUITOUS_LANGUAGE.md:156–157`) gelesen; PR #341 selbst nicht geprüft.
- Die Szenarien nicht ausgeführt (Review vor der Umsetzung, @wip).
