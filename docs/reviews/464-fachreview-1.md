# Fach-Review #464, Runde 1 (Commit 7addda2d, vor der Umsetzung)

Gegenstand: die vier `@wip`-Szenarien aus 7addda2d (`contract-edit.feature:195–209`, `statement-generate.feature:629–638`, `statement-detail.feature:785–809`) und der Entwurf in `implementation_plan.md:17–24` («### #464»). Grundlage: Issue #464 («Decided (product owner)» aus #90 und #103, verbindlich), #453, `docs/reviews/66-fachreview-{1,2,3}.md`. Gelesen im Worktree `fach-464` (detached, 7addda2d), nichts darin geändert.

Gesetzestext: Fedlex-Filestore, OR Stand 1. Oktober 2026 (`eli/cc/27/317_321_377/20261001/de/pdf-a`), VMWG Stand 1. Oktober 2025 (`eli/cc/1990/835_835_835/20251001/de/pdf-a`), heruntergeladen und mit `pdftotext` gelesen.

Hinweis zu den IDs: Der Auftrag verlangt F-n. Die Rolle steht deshalb in einer eigenen Spalte.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| F-1 | Verwalter | Major | Der Plan sagt nicht, woher das PDF die Zeilen «Monate × Betrag» nimmt. Rechnet es sie beim Drucken aus den heutigen Beträgen des Mietvertrags, passen die Zeilen einer versendeten Abrechnung nicht mehr zu ihrem gespeicherten Total, sobald sich ein Betrag ändert. |
| F-2 | Verwalter | Major | Rundung: Die Zeilen müssen zusammen «Geleistete Akontobeiträge» ergeben. Heute wird einmal über alle Monate gerundet. Mit Zeilen kann das 1 Rappen abweichen (Beispiel unten). Eine Regel dazu fehlt. |
| F-3 | Verwalter / Mietrecht | Major | Keine Regel für einen Betrag, dessen «Gültig ab» in den Mietstagen einer gespeicherten Abrechnung liegt. Für Vertragsdaten gibt es diese Regel schon (`BilledDaysError`). Fehlt sie hier, rechnet die nächste berichtigte Abrechnung stillschweigend mit einem Akonto, das der Mieter nie erhalten hat. Ein Szenario für die Ablehnung fehlt auch. |
| F-4 | Verwalter | Major (Option B braucht den Product Owner) | Die Migration setzt den heutigen Betrag ab Vertragsbeginn. Wurde das Akonto schon vor der Migration geändert, behält eine berichtigte Abrechnung einer früheren Periode den Fehler aus V-6 (12 × 200 statt 12 × 150). |
| F-5 | Verwalter | Major | Ist `monthlyAdvancePayment` ein gespeicherter «Betrag, der heute gilt», veraltet er, sobald ein im Voraus eingetragener Betrag zu gelten beginnt. Das betrifft das Monatlich total, die monatlichen Kosten der Wohnung und die Vertragshistorie. |
| F-6 | Verwalter / Mietrecht | Major | Kein Szenario zeigt, dass die Abrechnung (das PDF) sagt: Das Akonto zählt als vereinbart, und fehlende Zahlungen werden ausserhalb geregelt. #90 hat das beschlossen. |
| F-7 | Verwalter | Minor | Das PDF-Szenario prüft nur das Wort «Geleistete Akontobeiträge», nicht die Summe CHF 580.00. Fix: `Und steht im PDF "– CHF 580.00"` (oder die Zeile mit Betrag). |
| F-8 | Verwalter | Minor | «Berichtigte Abrechnung rechnet mit dem damaligen Akonto» besteht auch, wenn eine falsche Umsetzung den Betrag am Periodenbeginn oder Periodenende nimmt. Fix: eine Änderung auch in 2024 (50, ab 01.07.2024 80, ab 01.01.2025 100), erwartet 2 × 50 + 6 × 80 = 580.00. |
| F-9 | Verwalter | Minor | PDF-Wortlaut: geschlossene Zeiträume statt «ab» und das Wort «Monate» (Vorschlag unten). Das Issue lässt den genauen Wortlaut ausdrücklich dem fach-reviewer. Die Szenario-Zeilen `statement-detail.feature:807–808` ändern sich mit. |
| F-10 | Verwalter / Mietrecht | Minor (Entscheid PO) | Ob «Gültig ab» der Erste eines Monats sein muss, ist nicht entschieden. Empfehlung: nur der Erste eines Monats, nicht vor dem Vertragsbeginn und nicht nach dem Vertragsende. Die Ablehnung ist ein neuer Text und eine neue Regel. |
| F-11 | Verwalter | Minor (Begriffe, Issue) | Im Glossar fehlt der Begriff für das Datum («Gültig ab»). «Akonto» (`UBIQUITOUS_LANGUAGE.md:51`, `monthly_advance_payment` Feld) und «Geleistete Akontobeiträge» (Z. 174, «Vorauszahlungen des Mieters») sagen nicht, dass Dwello das vereinbarte Akonto zählt und mehrere Beträge mit Datum kennt. `glossary_advance_text` ebenso. Vorschlag unten. Issue mit den Labels `fachlich` und `entscheiden`. |
| F-12 | Mietrecht | Minor | Senkung: Laut Wortlaut braucht nur eine Änderung «zu Lasten des Mieters» das Formular (Art. 269d Abs. 3 OR), für eine Senkung also keines. Das ist ein Umkehrschluss, kein ausdrücklicher Satz (**unsicher**). Die Hilfe soll eine schriftliche Mitteilung empfehlen, kein Formular verlangen. |
| F-13 | Verwalter | Minor | Der Plan sagt nicht, wie man einen falsch eingetragenen Betrag korrigiert oder einen Eintrag löscht. Vorschlag: Ein Eintrag mit demselben «Gültig ab» ersetzt den alten. Jeder Eintrag ausser dem ersten (ab Vertragsbeginn) lässt sich löschen. Für beides gilt F-3. F-4 braucht genau diesen Weg. |
| F-14 | Verwalter | Minor | Das Hilfe-Szenario (`contract-edit.feature:205–209`) prüft nur den unbefristeten Mietvertrag. `contracts_running_text_fixed_term` und der Wegfall des alten Satzes «auch für die Zeit, die noch nicht abgerechnet ist» sind nicht abgedeckt. Fix: DOM-Test beider Texte, mit und ohne den alten Satz. |
| F-15 | Verwalter | Nit | Die Mieterdaten-Auskunft gibt nur einen Betrag aus (`backend/src/services/tenant-export.service.ts:64`). Nach #464 gehören alle Beträge mit «Gültig ab» dazu. |

Bestätigt ist ausserdem: Alle Beträge in den Szenario-Kommentaren stimmen (Nachrechnung unten). Die Begriffe «Akonto», «Geleistete Akontobeiträge», «Mietvertrag» und «Berichtigte Abrechnung» sind richtig verwendet. Die Formularpflicht für eine Erhöhung des Akontos ist jetzt mit Fedlex-Wortlaut belegt (siehe Mietrecht).

---

## Nachrechnung

**`statement-generate.feature:629` «Akonto ändert sich während der Abrechnungsperiode».** Grundlage (`statement-generate.feature:12–14`): Eva Frei vom 01.01. bis 31.03.2024, Leerstand im April, Marc Huber seit 01.05.2024, eine Wohnung.
- Hauswart 732.00 / 366 Tage = 2.00 pro Tag. Marc: Mai bis Dezember = 31+30+31+31+30+31+30+31 = 245 Tage, also 490.00.
- Verwaltungspauschale 3 %: 14.70, zusammen 504.70. Den Satz von 3 % bei Marc belegt `statement-generate.feature:84` (900 × 1.03 = 927.00).
- Akonto: 2 × 50.00 + 6 × 80.00 = 100.00 + 480.00 = 580.00. Saldo 504.70 − 580.00 = −75.30. Das ist schon ein Vielfaches von 5 Rappen, also «Rückerstattung CHF 75.30». **Bestätigt.**
- Gegenprobe heute (Betrag von heute × Monate): 8 × 80 = 640.00, Rückerstattung 135.30. Das Szenario wird also an der richtigen Stelle rot.

**`statement-detail.feature:787` «Berichtigte Abrechnung …».** 8 × 50.00 = 400.00, mit heutigem Betrag wären es 8 × 80.00 = 640.00. **Bestätigt** (Schwäche: F-8).

**`statement-detail.feature:800` «Das PDF nennt …».** 2 × 50.00 (Mai, Juni) + 6 × 80.00 (Juli bis Dezember) = 580.00. **Bestätigt** (Wortlaut: F-9, Summe: F-7).

**Issue-Beispiele (#66 V-1, V-6).** Kosten 2'000. Bei einer Erhöhung von 150 auf 200 im Juli ist richtig 6 × 150 + 6 × 200 = 2'100, also Rückerstattung 100. Dwello rechnet heute 2'400, also 300 zu viel zurück. Bei einer Senkung von 200 auf 150 ist richtig ebenfalls 2'100, also Rückerstattung 100. Dwello rechnet heute 1'800, also Nachzahlung 200. V-6: 12 × 150 = 1'800 statt 12 × 200 = 2'400. **Bestätigt.**

**Randfälle für die Unit-Tests (Vorschlag):**
- Null: 150, ab 01.10.2024 0: 9 × 150 + 3 × 0 = 1'350.00. Die Zeile «3 Monate × CHF 0.00» bleibt stehen, damit der Mieter die Änderung sieht.
- Angebrochener Monat mit «Abgerechnet bis» 15.03.2024 (Beispiel aus #453), 120: 16/31 × 120 = 61.935… → 61.94. Dazu 9 × 120 = 1'080.00, zusammen 1'141.94.
- Ein- und Auszug unter dem Jahr (bestehender Test `advance-payments.test.ts`, 150, 16.03.–15.09.2024): 77.42 + 5 × 150 + 75.00 = 902.42, wie heute.
- Mieterwechsel: Jeder Mietvertrag hat seine eigenen Beträge. Eva Frei und Marc Huber teilen keinen Eintrag.
- Rückerstattung: siehe das Generate-Szenario (−75.30).

---

## F-1 (Major): Woher kommen die PDF-Zeilen?

**Beleg.** `implementation_plan.md:19`: «sent statements keep their stored totals». Gespeichert ist nur `totalAdvancePayments` (das Feld ist geschützt, siehe `66-fachreview-3.md`). Das PDF druckt heute nur dieses Total (`backend/src/services/pdf.service.ts:778`). Das Issue verlangt: «statements already sent are unchanged».

**Warum falsch.** Liest das PDF die Zeilen aus den heutigen Beträgen des Mietvertrags, ändert sich das PDF einer versendeten Abrechnung, sobald der Vermieter einen Betrag nachträgt oder korrigiert. Zeilen und Total passen dann nicht mehr zusammen. Der Mieter hätte zwei verschiedene PDFs derselben Abrechnungsnummer.

**Fix.** Beim Erstellen und beim Neuberechnen eines Entwurfs die Zeilen an der Abrechnung speichern: von, bis, Monate oder Tage/Tage des Monats, Betrag, Zeilenbetrag. Vorbild ist das JSON `heating_share`. Das PDF druckt nur, was gespeichert ist. Eine Abrechnung von vor #464 hat keine Zeilen und druckt wie heute nur das Total. Die Migration darf dafür keine Zeilen erfinden.

## F-2 (Major): Rundung der Zeilen

**Beleg.** `calculateTotalAdvancePayments` zählt die Monate als Bruch zusammen und rundet einmal: `return roundToRappen(months * monthlyAdvancePayment);` (`backend/src/services/calculation.service.ts:308`). Das Issue verlangt: «summing to «Geleistete Akontobeiträge»».

**Nachgerechnet** (Skript, 1'680 Treffer bei sieben Beträgen von Januar bis März 2024): Akonto 95.00, Mietstage 02.01.2024 bis 02.03.2024.
- Zeilen: Januar 30/31 × 95 = 91.935… → 91.94; Februar 95.00; März 2/31 × 95 = 6.129… → 6.13. Zusammen **193.07**.
- Heute: (30/31 + 1 + 2/31) × 95 = 193.064… → **193.06**.

Das PDF ginge nicht auf.

**Fix.** Jede Zeile auf Rappen runden, das Total ist die Summe der gerundeten Zeilen. Das ändert gespeicherte Abrechnungen nicht, nur neue (versendete behalten ihr Total, F-1). Die fünf bestehenden Tests in `advance-payments.test.ts` bleiben gleich, also 902.42 und 77.42 (nachgerechnet). Der Fall oben kommt als neuer Test dazu.

## F-3 (Major): Neuer Betrag in einer schon abgerechneten Zeit (Frage 5)

**Beleg.**
- Für Vertragsdaten lehnt Dwello eine Änderung ab, wenn sie die Mietstage einer gespeicherten, nicht ersetzten Abrechnung änderte: `statementsChanged` und `BilledDaysError` in `backend/src/services/contract.service.ts:330–355`. Ein Entwurf wird gelöscht, wenn er als einziger betroffen ist (`onlyDraft`, Z. 382).
- Berichtigen geht in zwei Schritten: `replaceStatement` (Status `replaced`, `statement.service.ts:657`), danach `correctStatement` «from today's data» (Z. 693–697).
- Der Plan (`implementation_plan.md:19–23`) nennt für die Beträge keine solche Regel.

**Warum falsch.** Trägt der Vermieter ab 01.07.2024 einen neuen Betrag ein, obwohl die Abrechnung 2024 schon versendet ist, bleibt sie zwar gleich (F-1). Ihre spätere Berichtigung (etwa wegen einer Gutschrift) rechnet dann aber mit dem neuen Betrag. Der Mieter erhielte stillschweigend eine andere Akonto-Summe als in der Abrechnung, die er geprüft hat. Rechtlich zählt nur das Akonto, das wirksam vereinbart oder mitgeteilt wurde (Art. 269d Abs. 2 OR, siehe Mietrecht).

**Fix** (gleiche Regel wie bei den Vertragsdaten):
- Ein neuer, geänderter oder gelöschter Betrag wird abgelehnt (coded error), wenn er die geleisteten Akontobeiträge einer gespeicherten, nicht ersetzten Abrechnung ändern würde. Dwello vergleicht neu gerechnet gegen `total_advance_payments`. Ein betroffener Entwurf wird wie bei `onlyDraft` gelöscht oder neu berechnet (#338).
- Weil Dwello vergleicht statt nur das Datum zu prüfen, darf der Vermieter einen früheren Betrag nachtragen, der zur versendeten Abrechnung passt (F-4).
- Vorschlag Meldung (de): «Das Akonto ab {Datum} ändert die Abrechnung {Nummer}, die schon erstellt ist. Berichtigen Sie zuerst diese Abrechnung, oder wählen Sie ein späteres «Gültig ab».» Bei einem Entwurf lautet der zweite Teil «Löschen Sie zuerst den Entwurf …» wie beim bestehenden Text für Vertragsdaten. fr/it/en folgen dem bestehenden Text der Datumsablehnung.
- Ein Szenario für die Ablehnung gehört nach `contract-edit.feature` (Fehlerzustand, `tests/e2e/CLAUDE.md`).

## F-4 (Major): Migration mit dem heutigen Betrag

**Beleg.** Issue, Done means: «Existing contracts keep their amount, valid from the Vertragsbeginn (migration); statements already sent are unchanged.» und «A berichtigte Abrechnung of a billed period uses the amounts that applied in that period». `implementation_plan.md:19`: «one row per contract from its Vertragsbeginn with today's amount».

**Warum ein Problem.** Fall V-6: 2025 mit 150 abgerechnet und versendet, Akonto vor der Migration auf 200 gesetzt. Nach der Migration gilt 200 ab Vertragsbeginn. Wer 2025 berichtigt, erhält 12 × 200 = 2'400 statt 1'800, also 600 zu Lasten des Vermieters. Bei einer Senkung trägt der Mieter den Fehler, entgegen Art. 257b Abs. 1 OR. Gespeicherte Abrechnungen bleiben gleich, die Stop-and-ask-Bedingung des Issues trifft also nicht zu. Die zweite Bedingung des Issues erfüllt die Migration für alte Daten aber nicht.

**Fix innerhalb des Entscheids (Option A, empfohlen):**
- F-13 und F-3 erlauben, nach dem Ersetzen den früheren Betrag mit seinem Datum nachzutragen.
- `correctStatement` warnt, wenn die geleisteten Akontobeiträge der berichtigten Abrechnung von denen der ersetzten abweichen. Vorschlag (de): «Die Akontobeiträge dieser Abrechnung (CHF 2’400.00) sind anders als in der ersetzten Abrechnung {Nummer} (CHF 1’800.00). Prüfen Sie die Akontobeträge am Mietvertrag.»

**Option B (braucht den Product Owner, weicht von «today's amount» ab):** Die Migration leitet die früheren Beträge aus den gespeicherten, nicht ersetzten Abrechnungen ab: Total / Monate der Mietstage, aber nur, wenn das Ergebnis das Total auf den Rappen genau ergibt.

## F-5 (Major): Welcher Betrag «heute» gilt

**Beleg.** `implementation_plan.md:19`: «the contract keeps `monthlyAdvancePayment` as the amount that applies today». Gelesen wird der Betrag in `src/lib/server/contract-history.ts:13` (Monatlich total), `src/lib/server/apartment.ts:67` (monatliche Kosten) und `backend/src/services/tenant-export.service.ts:64`. Glossar «Monatlich total»: «der Betrag, den der Mieter laut Mietvertrag jeden Monat bezahlt» (`UBIQUITOUS_LANGUAGE.md:53`).

**Warum falsch.** Ein Betrag, der am 01.01.2027 zu gelten beginnt und heute eingetragen wird, gilt dann ohne Speichern. Eine gespeicherte Spalte zeigt dann den alten Betrag und ein falsches Monatlich total.

**Fix.** Den Betrag beim Lesen bestimmen: der Eintrag mit dem letzten «Gültig ab» bis zum Stichtag. Der Stichtag ist heute, bei einem künftigen Mietvertrag der Vertragsbeginn, bei einem beendeten das Vertragsende. Die Spalte nur behalten, wenn sie aus dieser Regel abgeleitet und nie selbst geschrieben wird. Die Vertragsseite zeigt einen künftigen Betrag mit «ab {Datum}».

## F-6 (Major): Hinweis «vereinbart, nicht bezahlt» im PDF ohne Szenario

**Beleg.** #90, beschlossen: «The help and the statement say that the Akonto is counted as agreed and that missing payments are settled outside Dwello.» Die Szenarien prüfen nur die Hilfe (`contract-edit.feature:205–209`), nicht das PDF.

**Warum.** Das ist ein beschlossener Text, den der Mieter sieht. «Geleistete Akontobeiträge» klingt nach bezahlt. Ohne den Hinweis glaubt der Mieter, Dwello habe seine Zahlungen geprüft.

**Fix.** Im PDF-Szenario `Und steht im PDF "Abgezogen sind die Akontobeiträge, die im Mietvertrag vereinbart sind."` ergänzen. Der Text steht unten.

---

## Mietrecht: Erhöhung und Senkung des Akontos (Frage 4)

**Fedlex, Art. 269d OR:**
- Abs. 1: «Der Vermieter kann den Mietzins jederzeit auf den nächstmöglichen Kündigungstermin erhöhen. Er muss dem Mieter die Mietzinserhöhung mindestens zehn Tage vor Beginn der Kündigungsfrist auf einem vom Kanton genehmigten Formular mitteilen und begründen.»
- Abs. 2: «Die Mietzinserhöhung ist nichtig, wenn der Vermieter: a. sie nicht mit dem vorgeschriebenen Formular mitteilt; b. sie nicht begründet; c. mit der Mitteilung die Kündigung androht oder ausspricht.»
- Abs. 3: «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, namentlich seine bisherigen Leistungen zu vermindern oder neue Nebenkosten einzuführen.»

**Fedlex, Art. 19 Abs. 1 VMWG** (neu gegenüber #66 M-3): «Das Formular für die Mitteilung von Mietzinserhöhungen und anderen einseitigen Vertragsänderungen im Sinne von Artikel 269d OR muss enthalten: a. Für Mietzinserhöhungen: 1. den bisherigen Mietzins und die bisherige Belastung des Mieters für Nebenkosten; 2. den neuen Mietzins und die neue Belastung des Mieters für Nebenkosten; 3. den Zeitpunkt, auf den die Erhöhung in Kraft tritt; …» und «b. Für andere einseitige Vertragsänderungen: 1. die Umschreibung dieser Forderung; 2. den Zeitpunkt, auf den sie wirksam wird; …»

**Ergebnis.** Die Verordnung nennt die «Belastung des Mieters für Nebenkosten» ausdrücklich als Inhalt des Erhöhungsformulars. Eine höhere Akonto-Belastung wird also mit dem amtlichen Formular nach Art. 269d OR mitgeteilt, mit Begründung, auf den nächstmöglichen Kündigungstermin. Das gilt, ob sie unter Abs. 1 oder Abs. 3 fällt. Die Formularpflicht ist damit **bestätigt**. Unter welchen Absatz die Erhöhung fällt, bleibt offen, ändert aber nichts (Nicht bestätigt).

**Datum.** Art. 266c OR: «Bei der Miete von Wohnungen können die Parteien mit einer Frist von drei Monaten auf einen ortsüblichen Termin oder, wenn es keinen Ortsgebrauch gibt, auf Ende einer dreimonatigen Mietdauer kündigen.» Ein Kündigungstermin ist also ein Monatsende, und das neue Akonto gilt ab dem Tag danach, dem Ersten eines Monats. Dazu passt Art. 257c OR: «Der Mieter muss den Mietzins und allenfalls die Nebenkosten am Ende jedes Monats … bezahlen, wenn kein anderer Zeitpunkt vereinbart oder ortsüblich ist.» Das Akonto ist ein Monatsbetrag.

**Senkung (F-12).** Abs. 3 nennt nur Änderungen «zu Lasten des Mieters», Abs. 1 nur die Erhöhung. Eine Senkung braucht laut Wortlaut also kein Formular. Das ist ein Umkehrschluss (**unsicher**). Empfehlung: schriftlich mitteilen, damit das Datum belegt ist.

**Befristeter Mietvertrag.** Der bestehende Satz «erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor» stammt aus #76 und ist dort beschlossen. Er hängt am offenen #388 (66-fachreview-2 zu M-2). Für das Akonto übernehme ich ihn unverändert, keine neue Regel.

## Frage 5: Erster des Monats oder beliebiger Tag (F-10)

- **Empfehlung:** «Gültig ab» muss der Erste eines Monats sein. Der erste Eintrag gilt ab dem Vertragsbeginn, der auch mitten im Monat liegen kann. «Gültig ab» liegt nicht vor dem Vertragsbeginn und nicht nach dem Vertragsende. Grund: Termine nach Art. 266c/269d OR und Monatsbeträge nach Art. 257c OR, siehe oben. Eine Änderung mitten im Monat würde zudem einen Monat auf zwei Beträge aufteilen, was niemand nachrechnen kann.
- Ablehnungstexte (de): «Ein neues Akonto gilt ab dem Ersten eines Monats. Tragen Sie zum Beispiel {nächster Erster} ein.» / «Das Akonto kann nicht vor dem Vertragsbeginn {Datum} gelten.» / «Das Akonto kann nicht nach dem Vertragsende {Datum} gelten.»
- Wenn der Product Owner jeden Tag zulassen will: Der Monat wird nach Tagen geteilt, zum Beispiel 150 → 200 ab 16.07.2024: 15/31 × 150 = 72.58 und 16/31 × 200 = 103.23. Im PDF stehen dann zwei Tageszeilen für Juli.
- Beginnt ein neuer Betrag vor der letzten abgerechneten Periode: siehe F-3. Er wird nur abgelehnt, wenn er eine gespeicherte, nicht ersetzte Abrechnung ändert.

---

## Vorschlag: PDF-Zeilen (Frage 3)

**Aufbau.** Die Zeile «Geleistete Akontobeiträge» bleibt mit dem Total (mit #453: «Geleistete Akontobeiträge ab {Datum}»). Darunter folgt je Betrag eine eingerückte Zeile in der Schrift der Rechnungsteile (`partsBelow`), in zeitlicher Folge, mit ihrem Betrag rechts, wie in der Spalte «Ihr Anteil». Die Zeilen ergeben zusammen das Total (F-2). Ein angebrochener Monat (Vertragsbeginn, Vertragsende, «Abgerechnet bis») steht auf einer eigenen Zeile mit Tagen. Die Schreibweise «{days}/{total} Tage» kennt das PDF schon (`pdf.service.ts:85`). Jede Zeile hat einen geschlossenen Zeitraum, auch die letzte.

Warum nicht «ab» wie im Beispiel des Issues: «ab 01.07.2025» sagt dem Mieter, der Betrag gelte weiter. Endet der Mietvertrag in der Periode, stimmt das nicht. Es passt auch nicht zur Anzahl Monate. Geschlossene Zeiträume entsprechen der Treuhandpraxis («Akonto 01.01.–31.12.: n × CHF x»). Das Wort «Monate» macht «6 ×» für Laien lesbar und unterscheidet die Zeile von der Tageszeile.

| | ganze Monate | angebrochener Monat |
|---|---|---|
| de | `{n} Monate × CHF {Betrag} ({von} – {bis})`, bei 1: `1 Monat × …` | `{Tage}/{Tage des Monats} Tage × CHF {Betrag} ({von} – {bis})` |
| fr | `{n} mois × CHF {montant} ({du} – {au})` | `{j}/{total} jours × CHF {montant} ({du} – {au})` |
| it | `{n} mesi × CHF {importo} ({dal} – {al})`, bei 1: `1 mese × …` | `{g}/{total} giorni × CHF {importo} ({dal} – {al})` |
| en | `{n} months × CHF {amount} ({from} – {to})`, bei 1: `1 month × …` | `{d}/{total} days × CHF {amount} ({from} – {to})` |

Beispiel (Szenario `statement-detail.feature:800`):

```
Geleistete Akontobeiträge                                   – CHF 580.00
   2 Monate × CHF 50.00 (01.05.2024 – 30.06.2024)                 100.00
   6 Monate × CHF 80.00 (01.07.2024 – 31.12.2024)                 480.00
```

Mit «Abgerechnet bis» 15.03.2024 (#453), 120:

```
Geleistete Akontobeiträge ab 16.03.2024                   – CHF 1’141.94
   16/31 Tage × CHF 120.00 (16.03.2024 – 31.03.2024)               61.94
   9 Monate × CHF 120.00 (01.04.2024 – 31.12.2024)              1’080.00
```

Die erste Zeile beginnt am Tag nach «Abgerechnet bis», wie das Issue verlangt. Die Zeile im Ergebniskasten («Ihre Nebenkosten … – Geleistete Akontobeiträge …», `pdf.service.ts:693`) bleibt beim Total.

Die Szenario-Zeilen werden damit `Dann steht im PDF "2 Monate × CHF 50.00 (01.05.2024 – 30.06.2024)"` und `Und steht im PDF "6 Monate × CHF 80.00 (01.07.2024 – 31.12.2024)"`.

**Hinweis im PDF** (Abschnitt «Hinweise», neben `agreedCosts`; «wir» wie in `refundBy`):
- de: «Abgezogen sind die Akontobeiträge, die im Mietvertrag vereinbart sind. Haben Sie Akontobeiträge nicht bezahlt, regeln wir das ausserhalb dieser Abrechnung.»
- fr: «Les acomptes déduits sont ceux convenus dans le contrat de bail. Si vous n’avez pas payé certains acomptes, nous réglons cela en dehors de ce décompte.»
- it: «Sono dedotti gli acconti pattuiti nel contratto di locazione. Se non ha pagato alcuni acconti, lo regoliamo al di fuori di questo conteggio.»
- en: «The advance payments deducted are those agreed in the rental contract. If you have not paid some of them, we settle this outside this statement.»

## Vorschlag: Texte in der App (Frage 4)

**`contracts_advance_help`** (neuer Mietvertrag und Bearbeiten):
- de: «Monatlicher Vorschuss des Mieters für die im Mietvertrag vereinbarten Nebenkosten (zum Beispiel Heizung, Wasser). Die Nebenkostenabrechnung zieht das vereinbarte Akonto ab, nicht das bezahlte. Fehlende Zahlungen regeln Sie ausserhalb von Dwello.»
- fr: «Avance mensuelle du locataire pour les frais accessoires convenus dans le contrat de bail (par exemple chauffage, eau). Le décompte des charges déduit l’acompte convenu, pas l’acompte payé. Réglez les paiements manquants en dehors de Dwello.»
- it: «Anticipo mensile dell’inquilino per le spese accessorie pattuite nel contratto di locazione (per esempio riscaldamento, acqua). Il conteggio spese accessorie deduce l’acconto pattuito, non quello pagato. Regoli i pagamenti mancanti al di fuori di Dwello.»
- en: «The tenant’s monthly advance for the utility costs agreed in the rental contract (for example heating, water). The utility cost statement deducts the agreed advance payment, not the amount paid. Settle missing payments outside Dwello.»

**Neue Hilfe beim neuen Betrag im laufenden, unbefristeten Mietvertrag** (z. B. `contracts_advance_change_help`):
- de: «Ein neues Akonto gilt ab dem Tag bei «Gültig ab»; das bisherige bleibt für die Zeit davor. Eine Erhöhung gilt frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist sie nichtig. Tragen Sie bei «Gültig ab» den Tag nach dem Kündigungstermin ein. Für eine Senkung genügt eine schriftliche Mitteilung.»
- fr: «Un nouvel acompte s’applique dès le jour indiqué sous «Valable dès le» ; l’ancien reste valable pour la période précédente. Une augmentation prend effet au plus tôt pour le prochain terme de congé : motivée, avec la formule officielle, reçue par le locataire au moins 10 jours avant le début du délai de congé. Sans formule ou sans motif, elle est nulle. Indiquez sous «Valable dès le» le jour qui suit le terme de congé. Pour une baisse, une communication écrite suffit.»
- it: «Un nuovo acconto vale dal giorno indicato in «Valido dal»; quello precedente resta per il periodo prima. Un aumento vale al più presto per la prossima scadenza di disdetta: motivato, con il modulo ufficiale, recapitato all’inquilino almeno 10 giorni prima dell’inizio del termine di preavviso. Senza modulo o senza motivazione è nullo. In «Valido dal» inserisca il giorno dopo la scadenza di disdetta. Per una riduzione basta una comunicazione scritta.»
- en: «A new advance payment applies from the day under «Valid from»; the previous one stays for the time before. An increase takes effect at the earliest from the next termination date: with reasons, on the official form, received by the tenant at least 10 days before the notice period begins. Without the form or without reasons it is void. Under «Valid from», enter the day after the termination date. For a reduction, a written notice is enough.»
- Befristeter Mietvertrag (`…_fixed_term`): Den zweiten bis vierten Satz durch den beschlossenen Satz aus #76 ersetzen, mit «Erhöhung» statt «Mietzinserhöhung». de: «Bei einem befristeten Mietvertrag ist eine Erhöhung erst nach dem Vertragsende möglich, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.» fr/it/en wortgleich zu den bestehenden `contracts_running_text_fixed_term` mit «augmentation» / «aumento» / «increase».
- «Für eine Senkung genügt eine schriftliche Mitteilung» ist eine Empfehlung, kein Gesetzessatz (F-12, unsicher). Wer sie zu weit findet, nimmt: «Eine Senkung teilen Sie dem Mieter am besten schriftlich mit.»

**`contracts_running_text`** (ersetzt den ersten Satz; die Sätze zur Mietzinserhöhung bleiben wortgleich):
- de: «Ein neues Akonto gilt ab dem Tag, den Sie dazu eintragen. Andere Änderungen übernimmt Dwello sofort, auch für die Zeit, die noch nicht abgerechnet ist, und für berichtigte Abrechnungen. Eine Mietzinserhöhung gilt frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist sie nichtig. Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.»
- fr: «Un nouvel acompte s’applique dès le jour que vous indiquez. Dwello applique les autres modifications immédiatement, y compris pour la période qui n’a pas encore été décomptée et pour les décomptes rectificatifs. Une augmentation de loyer prend effet … (inchangé).»
- it: «Un nuovo acconto vale dal giorno che inserisce. Dwello applica subito le altre modifiche, anche al periodo non ancora conteggiato e ai conteggi rettificati. Un aumento della pigione vale … (invariato).»
- en: «A new advance payment applies from the day you enter for it. Dwello applies other changes immediately, including to the period not yet billed and to corrected statements. A rent increase takes effect … (unchanged).»
- «Andere Änderungen … und für berichtigte Abrechnungen» stimmt mit dem Code: Verwaltungspauschale und vereinbarte Nebenkosten kommen aus dem heutigen Mietvertrag (`feePercentOf(contract, …)`, `agreedCategoryIds`, `calculation.service.ts`, sowie `correctStatement` «from today's data»). Das schliesst V-6 aus #66 Runde 3.

**`contracts_running_text_fixed_term`:** Den ersten Satz gleich ersetzen. Der Rest bleibt.

**Feldbezeichnung:** «Gültig ab» (fr «Valable dès le», it «Valido dal», en «Valid from», nach dem Muster «Vermietet ab {Datum}» in `docs/design/i18n-begriffe.md:19`). Anzeige am Mietvertrag: «CHF 150.00 vom 01.04.2024 bis 30.06.2025» und «CHF 200.00 ab 01.07.2025», wie im Szenario. Für «ab» verwendet die Vertragsseite Dauerangaben, das PDF dagegen geschlossene Zeiträume (F-9). Das ist gewollt.

## Fehlende Begriffe (für das Issue, Labels `fachlich`, `entscheiden`)

- **Gültig ab (Akonto)**: «Tag, ab dem ein Akonto-Betrag des Mietvertrags gilt; der Erste eines Monats, der erste Betrag ab dem Vertragsbeginn. Der frühere Betrag gilt bis zum Tag davor. Die Nebenkostenabrechnung zählt jeden Betrag für seine Monate.» Feld: neue Tabelle (Name nach Umsetzung).
- **Akonto** (Ergänzung): «… Ein Mietvertrag kann mehrere Beträge mit «Gültig ab» haben. Dwello rechnet das vereinbarte Akonto ab, nicht das bezahlte; fehlende Zahlungen regelt der Vermieter ausserhalb von Dwello.» Die Spalte `monthly_advance_payment` ist dann nur noch der Betrag zum Stichtag (F-5).
- **Geleistete Akontobeiträge** (Ergänzung): «Summe der vereinbarten monatlichen Akontobeiträge während der Mietstage in der Abrechnungsperiode, jeder Betrag für die Monate, in denen er galt; ein angebrochener Monat nach Tagen.» Ob der Name «Geleistete …» bleibt, obwohl Dwello Vereinbartes zählt, entscheidet der Product Owner. Der PDF-Hinweis oben lindert das.
- `glossary_advance_text` (App-Glossar): Den Satz «Die Nebenkostenabrechnung zieht das vereinbarte Akonto ab, nicht das bezahlte.» anfügen.

---

## Nicht bestätigt

- **Unter welchen Absatz von Art. 269d OR eine Akonto-Erhöhung fällt** (Abs. 1, Mietzins im weiteren Sinn, oder Abs. 3): steht weder im OR noch im VMWG. Art. 19 Abs. 1 lit. a VMWG zählt die Nebenkosten-Belastung zum Erhöhungsformular. Formular, Begründung und Termin gelten in beiden Fällen. Gelesen: OR Stand 1.10.2026 und VMWG Stand 1.10.2025 (Fedlex-Filestore), keine Rechtsprechung.
- **Senkung ohne Formular** (F-12): nur Umkehrschluss aus «zu Lasten des Mieters» (Art. 269d Abs. 3 OR). Nicht weiter gesucht.
- **Erhöhung beim befristeten Mietvertrag:** übernommen aus dem beschlossenen Text von #76. Die Frage ist in #388 offen, Fedlex sagt dazu nichts ausdrücklich.
- **Einvernehmliche Akonto-Anpassung** (Vereinbarung statt Formular): `docs/nebenkostenabrechnung-anforderungen.md:82`, unsicher-C, nicht für MVP. Nicht in die Hilfe aufgenommen.
- **Treuhandpraxis «n × CHF x (von – bis)»:** Erfahrungswert und `docs/nebenkostenabrechnung-anforderungen.md:43, 120, 131` (unsicher-B/C), keine Primärquelle.
- **Schritte der Szenarien:** `der Mietvertrag von {string} hat ab {string} {string} Franken Akonto`, `ändert … das Akonto ab …`, `zeigt der Mietvertrag das Akonto … vom … bis …`, `zieht die Abrechnung {string} Akontobeiträge ab` und die beiden `erfährt …`-Schritte gibt es in `tests/e2e/steps` noch nicht. Ob sie das Richtige prüfen, konnte ich nicht sehen. Vorhanden: `der Mietvertrag von {string} hat {string} Franken Akonto` (`contract-detail.steps.ts:304`) und `beträgt der Saldo von` (`statement-generate.steps.ts:303`).
- **Entwürfe nach einer Akonto-Änderung:** Ob Dwello einen veralteten Entwurf anzeigt (#338, `recalculateStatement`, `statement.service.ts:454`), habe ich nicht geprüft. F-3 schlägt dasselbe Vorgehen wie bei Vertragsdaten vor.
- **fr/it/en-Vorschläge:** nach `docs/design/i18n-begriffe.md` (acompte/acconto/advance payment, terme de congé/scadenza di disdetta/termination date, décompte rectificatif/conteggio rettificato/corrected statement), aber ohne muttersprachliche Prüfung. «Valable dès le / Valido dal / Valid from» steht nicht in i18n-begriffe.
