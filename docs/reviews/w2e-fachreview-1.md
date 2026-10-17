# Fachreview W2e (#358 / #120): berichtigte Abrechnung – Runde 1

Gegenstand: @wip-Szenarien von Commit 08690ad (`statement-detail.feature:545-610`, `contract-edit.feature:55-68`, `contract-detail.feature:321-343`) und der geplante Entwurf mit Texten `scratchpad/w2e-design.md`.
Grundlagen: #120 «Decided (product owner)» und zwei Kommentare, #358, `UBIQUITOUS_LANGUAGE.md:70,156,157,161,173`, `docs/anforderungen-vertragsende.md:334-344` (A-11).
Gesetzestexte von Fedlex (Filestore): OR Stand 1.10.2026, VMWG Stand 1.10.2025.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Zahlungen auf eine versendete Abrechnung, die nicht erfasst sind (auch Teilzahlungen), werden nicht angerechnet; der Mieter zahlt doppelt |
| V-2 | Verwalter / Mietrecht | Major | Das PDF der berichtigten Abrechnung sagt nicht, dass die alte Abrechnung (mit ihrer QR-Rechnung) nicht mehr gilt |
| V-3 | Verwalter | Major | Entwurf Punkt 6: Eine Abrechnung mit nur überlappender Periode wird zur berichtigten Abrechnung; die Zahlung wird auf eine andere Abrechnungsperiode angerechnet |
| V-4 | Verwalter | Minor | Kette von Berichtigungen: «Bereits bezahlt auf {number}» nennt nur die letzte Nummer, der Betrag enthält auch frühere Zahlungen |
| V-5 | Verwalter / Mietrecht | Minor | Absage ohne Mietstage (Frage 4): Text gilt nur für eine bezahlte Nachzahlung; bei Rückerstattung oder nur versendet falsch |
| V-6 | Verwalter | Minor | Bestätigung: nicht nach Status unterschieden, nennt weder den angerechneten Betrag noch, dass sie nicht rückgängig zu machen ist |
| V-7 | Verwalter | Minor | `contracts_billed_locked_rest` / `contracts_continue_locked_rest` sprechen nur von einer Abrechnung, folgen aber auch auf `_many` |
| V-8 | Verwalter | Minor | `contracts_delete_billed_locked` schickt den Verwalter weiter «direkt zum Mieter»; fehlt in der Liste der geänderten Texte |
| M-1 | Mietrecht | Minor | Neue Texte lassen den Vorbehalt «nicht in jedem Fall» fallen und kürzen die entschiedene Verjährungsformel |
| V-9 | Verwalter | Minor | Szenarien: «nicht mehr gemahnt» nur mit überfälliger Abrechnung prüfbar; Absage ohne Mietstage und Rückerstattungsfall fehlen |
| V-10 | Verwalter | Nit | «Sie rechnet an …» nach einem Satz mit formellem «Sie»; «Dwello ändert sie nicht» neben «berichtigen» |
| V-11 | Verwalter | Nit | Herleitungszeile im PDF braucht die Variante Rückerstattung («+ bereits zurückerstattet») |
| G-1 | Glossar | Minor | «Saldo» deckt den Abzug des bereits Bezahlten nicht ab; Zeilenbezeichnung «Bereits bezahlt» fehlt im Glossar |

Bestätigt (ohne Befund): Beträge 442.90 / 630.36 / 187.45; Rundung zugunsten des Mieters; Rechenrichtung bei Rückerstattung; Begriffe ohne «storniert», «Gutschrift», «Nachtragsabrechnung»; Verjährungshilfe in der Bestätigung; zweistufiger Ablauf (Frage 1); Szenarien `contract-edit.feature` und `contract-detail.feature`.

---

## Antworten auf die fünf Fragen

**1. Zweistufiger Ablauf (erst ersetzen, dann Daten korrigieren, dann erstellen)?** Ja, richtig. Ein sofort erstellter Entwurf sperrt die Vertragsdaten wieder (`contract-edit.feature:49-53`: auch ein Entwurf sperrt einen späteren Vertragsbeginn, «Sie können den Entwurf unten löschen …»). Der Verwalter müsste ihn also löschen, bevor er das Datum ändert. So arbeitet auch ein Verwalter: Zuerst den Fehler beheben, dann die berichtigte Abrechnung ausstellen. Zwei Ergänzungen:
- Eine ersetzte Abrechnung ohne berichtigte Abrechnung darf nicht vergessen gehen. Entwurf Punkt 6 («zählt nicht als abgerechnet») führt dazu, dass der «Hinweis auf fehlende Abrechnungen» (`UBIQUITOUS_LANGUAGE.md:46`) die Periode wieder nennt. Das ist gut so und sollte ausdrücklich so gelten, mit einem pg-Test.
- Ersetzen lässt sich nicht rückgängig machen. Das sagt die Bestätigung (V-6). Alternative für den Product Owner: «Ersetzen rückgängig machen», solange es keine berichtigte Abrechnung gibt. Nicht nötig für #358.

**2. Versendet, nicht bezahlt: Anrechnung 0?** Ja, wenn wirklich nichts bezahlt ist. Die berichtigte Abrechnung ist dann die ganze Forderung, die alte gilt nicht mehr. Voraussetzungen: Das PDF sagt das dem Mieter (V-2), und eine Zahlung, die schon eingegangen ist, wird vorher erfasst (V-1).

**3. Teilzahlungen nicht erfasst: genügt das?** Nein (V-1). Gerade bei einer bestrittenen Abrechnung, also dem typischen Anlass für eine Berichtigung, zahlt der Mieter oft den unbestrittenen Teil. Dwello kennt keinen Teilbetrag: `paidAmount` ist immer der Saldo (`statement.service.ts:494`), und die Oberfläche hat kein Betragsfeld (`messages/de.json:942-1024`). Die berichtigte Abrechnung verlangt dann den ganzen Betrag noch einmal. Mindestens braucht es einen Hinweis; die eigentliche Lösung ist ein Entscheid des Product Owners.

**4. Mietvertrag ohne Mietstage in der Periode: Absage, Rückzahlung ausserhalb von Dwello, Text richtig?** Der Ablauf ist vertretbar, der Text nur für einen von drei Fällen richtig (V-5). Mietrechtlich schuldet ein Mieter ohne Mietverhältnis in der Periode keine Nebenkosten (Art. 257a Abs. 2 OR, Fedlex: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»). Was er auf die Abrechnung bezahlt hat, bekommt er zurück. Hat dagegen der Vermieter eine Rückerstattung bezahlt, schuldet der Mieter sie zurück. Bei einer nur versendeten Abrechnung muss nichts fliessen, der Mieter muss aber erfahren, dass sie nicht mehr gilt. Für den Product Owner bleibt offen, ob Dwello stattdessen eine berichtigte Abrechnung ohne Kosten mit nur der Zeile «Bereits bezahlt» erstellen soll. Das gäbe dem Mieter ein Dokument und eine Rückerstattung mit Zahlungsfrist.

**5. #115-Kommentar beantwortet?** Ja, der erste Teil: Die Absage von «Unbefristet weiterführen» führt jetzt zu «Abrechnung berichtigen» (`contract-detail.feature:331`). Danach lässt sich der Vertrag unbefristet weiterführen (`contract-detail.feature:334-343`). Damit muss niemand mehr fälschlich «Mieter ist ausgezogen» wählen. Der zweite Teil («bis dahin die Aufgabe zurückstellen») fällt weg, weil die Berichtigung im selben Release kommt. Mietrechtlich stimmt der Text «Für Sie und den Mieter läuft der Mietvertrag trotzdem unbefristet weiter» (Art. 266 Abs. 2 OR, Fedlex: «Setzen die Parteien das Mietverhältnis stillschweigend fort, so gilt es als unbefristetes Mietverhältnis.»). Ob ein Verwalter die Aufgabe auch ohne Berichtigung abschliessen darf (kleiner Betrag, er verzichtet auf die Nachforderung), ist eine neue Produktfrage. Sie ist nicht Teil von #358; ich empfehle, den Kommentar in #120 mit diesem Hinweis abzuschliessen.

---

## Befunde

### V-1 (Major) Nicht erfasste Zahlungen und Teilzahlungen werden nicht angerechnet

**Beleg.** `w2e-design.md:17`: «Bereits bezahlt = paid amount of the replaced statement (0 if it was only sent)». Bei `status = 'paid'` gilt `paidAmount ?? existing.balance` (`backend/src/services/statement.service.ts:494`), sonst gibt es keinen Betrag. Die Bestätigung (`w2e-design.md:6-7`) fragt nicht nach einer Zahlung. Laut #358 «offsets what tenant or landlord already paid on the replaced one»: gemeint ist, was tatsächlich bezahlt ist, nicht was in Dwello erfasst ist.

**Warum falsch.** Fall 1: Der Mieter hat die versendete Abrechnung bezahlt, der Verwalter hat es noch nicht erfasst. Er berichtigt sie, die Anrechnung ist 0, und der Mieter soll den ganzen Saldo noch einmal zahlen. Fall 2: Der Mieter bestreitet eine Position und zahlt den Rest (in der Praxis üblich). Dwello kann den Teil nicht erfassen. Beide Male verlangt die berichtigte Abrechnung mehr, als der Mieter schuldet. Das widerspricht dem Entscheid und Art. 257b Abs. 1 OR (nur die tatsächlichen Aufwendungen).

**Fix.**
1. Für #358: Die Bestätigung einer versendeten oder überfälligen Abrechnung sagt: «Hat der Mieter schon bezahlt, markieren Sie die Abrechnung zuerst als bezahlt. Sonst rechnet die berichtigte Abrechnung die Zahlung nicht an.»
2. Teilzahlungen: neues Issue (`fachlich`, `entscheiden`). Vorschlag: ein Feld «Bereits bezahlt» (CHF, vorbelegt 0.00) in der Bestätigung, nur bei versendet oder überfällig, gespeichert als `paidAmount` der ersetzten Abrechnung. Hilfe am Feld: «Was der Mieter auf diese Abrechnung schon überwiesen hat, auch ein Teilbetrag.»

### V-2 (Major) Das PDF sagt nicht, dass die alte Abrechnung nicht mehr gilt

**Beleg.** `w2e-design.md:18`: Titelzusatz «Berichtigte Abrechnung: ersetzt {number} vom {statementDate}», sonst nur die Zeile «Bereits bezahlt».

**Warum falsch.** Der Mieter hat die alte Abrechnung mit QR-Rechnung noch. Ist sie nur versendet, zahlt er leicht beide: die alte über ihren QR-Code und die neue, die ja den ganzen Betrag verlangt (Frage 2). Dwello kann eine Zahlung auf die ersetzte Abrechnung danach nicht mehr erfassen (`w2e-design.md:9`: «no payment»). «Ersetzt» allein sagt dem Laien nicht, dass er die alte nicht mehr bezahlen soll. In der Praxis schreibt ein Verwalter das ausdrücklich dazu.

**Fix.** Unter dem Titel ein Satz, je nach Saldo der berichtigten Abrechnung:
- Nachzahlung: «Diese Abrechnung ersetzt die Abrechnung {number} vom {statementDate}. Diese gilt nicht mehr: Bezahlen Sie nur noch den Saldo dieser Abrechnung.»
- Rückerstattung oder 0.00: «Diese Abrechnung ersetzt die Abrechnung {number} vom {statementDate}. Diese gilt nicht mehr.»

PDF-Unit-Test für beide Varianten.

### V-3 (Major) Eine Abrechnung mit nur überlappender Periode wird zur berichtigten Abrechnung

**Beleg.** `w2e-design.md:19`: «a new statement of that Mietvertrag in an overlapping period becomes the berichtigte Abrechnung of the replaced one». Dagegen `w2e-design.md:12`: «for the same Mietvertrag and Abrechnungsperiode».

**Rechnung.** Ersetzt ist 01.01.–31.12.2024, bezahlt 442.90. Danach wechselt die Einstellung «Abrechnungsperiode» auf Juli–Juni, und ein Abrechnungslauf 01.07.2024–30.06.2025 erstellt eine Abrechnung. Sie würde 442.90 anrechnen, obwohl sie die Kosten Januar bis Juni 2024 nicht enthält. Gleichzeitig zählt die ersetzte Abrechnung nicht mehr, also stehen Januar bis Juni 2024 in keiner gültigen Abrechnung. Ergebnis: Der Saldo der Periode 2024/25 ist falsch, die erste Jahreshälfte 2024 ist nicht abgerechnet.

**Fix.** Nur eine Abrechnung derselben Abrechnungsperiode (gleicher Beginn und gleiches Ende) desselben Mietvertrags wird zur berichtigten Abrechnung. Für einen Abrechnungslauf mit überlappender anderer Periode lehnt Dwello den Mietvertrag ab, mit dem Hinweis: «Die Abrechnung {number} ist ersetzt. Erstellen Sie die berichtigte Abrechnung auf der Abrechnung {number}, für dieselbe Abrechnungsperiode.» Dazu ein pg-Test.

### V-4 (Minor) Kette: Die Zeile nennt nur die letzte ersetzte Abrechnung

**Beleg.** `w2e-design.md:15,17`: Zeile «Bereits bezahlt auf {number}», Betrag = Zahlung der ersetzten Abrechnung + was diese selbst angerechnet hat.

**Rechnung.** A (630.36 Kosten-Fall oben): A bezahlt 442.90, B ersetzt A mit Saldo 187.45 und ist nur versendet, C ersetzt B. Anrechnung auf C = 0 + 442.90 = 442.90. Die Zeile heisst «Bereits bezahlt auf NK-B: − CHF 442.90», auf NK-B ist aber nichts bezahlt. Der Betrag stimmt, die Angabe gegenüber dem Mieter nicht.

**Fix.** Ab einer Kette die Zeile «Bereits bezahlt auf {numbers}», mit allen ersetzten Abrechnungen, auf die bezahlt wurde (z.B. «auf NK-A und NK-B»). Gleiches für «Bereits zurückerstattet». Ein pg-Test für die Kette.

### V-5 (Minor) Absage ohne Mietstage: falscher Text bei Rückerstattung und bei nur versendet

**Beleg.** `w2e-design.md:13`: «Es gibt keine berichtigte Abrechnung: Zahlen Sie dem Mieter zurück, was er auf {number} bezahlt hat.»

**Warum falsch.** Der Text stimmt nur, wenn der Mieter eine Nachzahlung bezahlt hat. Hat der Vermieter eine Rückerstattung bezahlt, schuldet der Mieter sie zurück. Ist die Abrechnung nur versendet, fliesst kein Geld. «Zahlen Sie zurück» passt zudem nicht zum Glossarbegriff «Rückerstattung» (`UBIQUITOUS_LANGUAGE.md:156`).

**Fix.** Drei Texte, je mit Betrag:
- Mieter hat Nachzahlung bezahlt: «Der Mietvertrag hat in dieser Abrechnungsperiode keine Mietstage mehr. Darum gibt es keine berichtigte Abrechnung. Erstatten Sie dem Mieter die CHF {amount} zurück, die er auf {number} bezahlt hat.»
- Vermieter hat Rückerstattung bezahlt: «… Der Mieter schuldet Ihnen die CHF {amount}, die Sie ihm auf {number} zurückerstattet haben.»
- Nur versendet: «… Teilen Sie dem Mieter mit, dass die Abrechnung {number} nicht mehr gilt.»

Die Alternative (berichtigte Abrechnung ohne Kosten, Frage 4) ins Entscheid-Issue.

### V-6 (Minor) Bestätigung nicht nach Status, ohne Betrag, ohne «nicht rückgängig»

**Beleg.** `w2e-design.md:6-7`. CLAUDE.md, Design-Regeln: «Irreversible actions confirm with their real consequence.»

**Warum.** Bei einer bezahlten Abrechnung ist «lässt sich nicht mehr als bezahlt markieren» sinnlos. Die wichtigste Folge fehlt: welcher Betrag angerechnet wird. Der Verwalter kann die erfasste Zahlung nach dem Ersetzen nicht mehr zurücksetzen (#92); stimmt sie nicht, bleibt die Anrechnung falsch.

**Fix.**
- Versendet oder überfällig: «Die Abrechnung {number} wird ersetzt. Sie bleibt unverändert erhalten, wird nicht mehr gemahnt und lässt sich nicht mehr als bezahlt markieren. Hat der Mieter schon bezahlt, markieren Sie sie zuerst als bezahlt.» (siehe V-1)
- Bezahlt: «Die Abrechnung {number} wird ersetzt. Sie bleibt unverändert erhalten. Die berichtigte Abrechnung rechnet die CHF {amount} an, die am {paidDate} bezahlt wurden.» Bei einer Rückerstattung: «… die Sie am {paidDate} zurückerstattet haben.»
- Für alle Status als letzter Satz: «Das lässt sich nicht rückgängig machen.»

### V-7 (Minor) Einzahl in Texten, die auch auf mehrere Abrechnungen folgen

**Beleg.** `messages/de.json:1447-1449`: `contracts_billed_locked_one` / `_many` («Die Nebenkostenabrechnungen {numbers} wurden …») und danach dasselbe `_rest`. Neuer Text: «Stimmt es, berichtigen Sie zuerst die Abrechnung. Öffnen Sie sie dazu …». Bei `contracts_continue_locked_rest` gilt dasselbe.

**Fix.** Den Text mehrzahlfähig machen: «Stimmt es, berichtigen Sie zuerst jede dieser Abrechnungen: Öffnen Sie sie und wählen Sie «Abrechnung berichtigen».» Oder `_rest_one` und `_rest_many`. Das Szenario `contract-edit.feature:60` prüft nur «Stimmt es, berichtigen Sie zuerst die Abrechnung.» und müsste dem angepasst werden.

### V-8 (Minor) `contracts_delete_billed_locked` schickt weiter ausserhalb von Dwello

**Beleg.** `messages/de.json:1469`: «Eine versendete oder bezahlte Abrechnung bleibt, und mit ihr der Mietvertrag. Klären Sie eine Korrektur direkt mit dem Mieter.» `w2e-design.md:31`: «unchanged in effect». #358 «Done means»: «The texts that sent the landlord outside Dwello point to the correction».

**Fix.** «Eine versendete oder bezahlte Abrechnung bleibt, auch wenn Sie sie berichtigen, und mit ihr der Mietvertrag. Stimmt eine Abrechnung nicht, öffnen Sie sie und wählen Sie «Abrechnung berichtigen».»

### M-1 (Minor) Vorbehalt gestrichen, Verjährungsformel gekürzt

**Beleg.** Bisher `messages/de.json:1180`: «Später können Sie sie nur noch mit einer berichtigten Abrechnung und nicht in jedem Fall nachverlangen.»; neu (`w2e-design.md:29`) ohne «und nicht in jedem Fall». `invoices_missed_text` / `statements_later_sent` neu (`w2e-design.md:28`): «Forderungen verjähren in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR).» Der Product Owner hat entschieden (#120, Kommentar 16.10.2026; #358): «in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR); ab wann die Frist läuft, ist nicht einheitlich geklärt».

Fedlex, Art. 128 OR: «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen;». Art. 130 Abs. 1 OR: «Die Verjährung beginnt mit der Fälligkeit der Forderung.»

**Warum.** Ob eine Nachforderung nach einer bezahlten Abrechnung noch möglich ist, hängt nicht nur von der Verjährung ab. Wann die Forderung fällig wird, ist offen, und ob ein vorbehaltlos bezahlter Saldo als Anerkennung gilt, ebenso (siehe «Nicht bestätigt»). Ohne Vorbehalt verspricht der Text dem Laien, dass er Kosten innert fünf Jahren sicher nachverlangen kann. Die gekürzte Formel weicht vom Entscheid ab.

**Fix.**
- `statements_missing_consequence`: «… Später können Sie sie nur noch mit einer berichtigten Abrechnung und nicht in jedem Fall nachverlangen.» (Vorbehalt behalten)
- `invoices_missed_text` / `statements_later_sent`: «Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung. Die berichtigte Abrechnung rechnet an, was schon bezahlt ist. Forderungen aus der Nebenkostenabrechnung verjähren in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR); ab wann die Frist läuft, ist nicht einheitlich geklärt. Lassen Sie sich im Zweifel beraten.»

«was der Mieter schon bezahlt hat» ersetze ich durch «was schon bezahlt ist», weil bei einer Rückerstattung der Vermieter bezahlt hat (Glossar `:161`).

### V-9 (Minor) Szenarien: Lücken

**Beleg und Fix.**
- `statement-detail.feature:585-592` «Ersetzte Abrechnung bleibt unverändert» nutzt eine versendete Abrechnung innerhalb der Zahlungsfrist. Dass keine Mahnung angeboten wird, zeigt nur eine überfällige Abrechnung. Ergänzen: `Und die Zahlungsfrist der Abrechnung 2024 von "Eva Frei" ist abgelaufen` (Schritt besteht, `:140`), damit auch «überfällig» aus #358 abgedeckt ist. Ausserdem prüfen, dass «Abrechnung berichtigen» nicht nochmals angeboten wird.
- Die Absage ohne Mietstage (V-5) ist im E2E-Stack erreichbar (Anna I4: Vertragsbeginn 2025-05-01 nach Ersetzen der Abrechnung 2024). Laut `tests/e2e/CLAUDE.md` braucht sie ein Szenario.
- Rückerstattung und Kette: mindestens pg-Tests (Zahl siehe «Formeln»).
- Der Abrechnungslauf, der den Mietvertrag wieder abrechnet und verknüpft (#358 «Done means», 3. Punkt), hat kein Szenario. Ich empfehle eines in `statement-generate.feature`.

### V-10 (Nit) Formulierungen

- `w2e-design.md:7`: «… erstellen. Sie rechnet an, was auf {number} schon bezahlt ist. Senden Sie sie dem Mieter.» Das «Sie» am Satzanfang liest sich als Anrede. Besser: «Die berichtigte Abrechnung rechnet an, was auf {number} schon bezahlt ist. Senden Sie sie dem Mieter.»
- `contracts_billed_locked_rest`: «Dwello ändert sie nicht, … berichtigen Sie zuerst die Abrechnung» wirkt widersprüchlich. Besser: «Dwello ändert sie nicht, sondern ersetzt sie durch eine berichtigte Abrechnung. Darum lässt sich das Datum noch nicht speichern. …»

### V-11 (Nit) Herleitungszeile bei Rückerstattung

`w2e-design.md:18` nennt nur «– bereits bezahlt …». Bei einer schon bezahlten Rückerstattung lautet die Zeile «Ihre Nebenkosten … – Akontobeiträge … + bereits zurückerstattet …», passend zur Zeile in `:15`. Ein Unit-Test im PDF.

### G-1 (Minor) Glossar: Saldo und «Bereits bezahlt»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:156` «Saldo»: «Kostenanteil inklusive Verwaltungspauschale minus geleistete Akontobeiträge, gerundet …». Bei der berichtigten Abrechnung kommt laut `w2e-design.md:16` ein dritter Posten dazu. Die Zeilen «Bereits bezahlt auf …» / «Bereits zurückerstattet auf …» sind keine Glossarbegriffe.

**Vorschlag (Issue `fachlich`, `entscheiden`; das Glossar ändert nur der Product Owner):**
- Saldo: «Kostenanteil inklusive Verwaltungspauschale minus geleistete Akontobeiträge; bei einer berichtigten Abrechnung zusätzlich minus, was auf die ersetzte Abrechnung schon bezahlt ist (plus, was der Vermieter schon zurückerstattet hat). Gerundet auf 5 Rappen zugunsten des Mieters. …»
- Neuer Eintrag **Bereits bezahlt** (auf eine ersetzte Abrechnung): «Zeile der berichtigten Abrechnung: was der Mieter auf die ersetzten Abrechnungen schon bezahlt hat; bei einer Rückerstattung «Bereits zurückerstattet», was der Vermieter schon erstattet hat. Wird vom Saldo abgezogen bzw. dazugezählt.» Code: geplant (#358).
- Bis zum Entscheid: `TODO(fachlich prüfen, #<issue>)` an den Texten.

---

## Formeln (nachgerechnet)

Daten: `statement-detail.feature:9-29`, Wohnung 3.01 einzige Wohnung im Lindenhof, Eva Frei 01.01.–31.03.2024 = 31 + 29 + 31 = 91 Tage von 366, Akonto 0 (`tests/e2e/fixtures/backend.ts:158`), Verwaltungspauschale vereinbart (`:160`), Satz 3 % (Lauf/Einstellung, `calculation.service.ts:260-265`).

1. Ursprünglich: Heizkosten 1000 × (18 + 14 + 11) % = 430.00 (bestätigt `:40`); Pauschale 3 % = 12.90; Kosten 442.90; Saldo = roundTo5Rappen(442.90 − 0) = 442.90. Bezahlt = Saldo (`statement.service.ts:494`). **442.90 bestätigt.**
2. Berichtigt: Hauswart 732.00 × 91/366 = 182.00 (Rechnung ohne Leistungszeitraum gilt für die ganze Periode, `invoice.service.ts:513`; Wert bestätigt durch `statement-detail.feature:474-479`); Kosten 430.00 + 182.00 = 612.00; Pauschale 18.36; Total **630.36 bestätigt**.
3. Saldo = roundTo5Rappen(630.36 − 0 − 442.90) = roundTo5Rappen(187.46) = 187.45 (`pdf-format.ts:20` rundet ab). **187.45 bestätigt.** Der Mieter zahlt insgesamt 630.35 ≤ 630.36, also zu seinen Gunsten.
4. Randfall Rückerstattung: Kosten 400.00, Akonto 420.00 → Saldo −20.00, vom Vermieter bezahlt (paidAmount −20.00). Berichtigt Kosten 410.00: roundTo5Rappen(410.00 − 420.00 − (−20.00)) = 10.00. Der richtige Saldo wäre −10.00; der Mieter hat 20.00 erhalten und gibt 10.00 zurück. Vorzeichen stimmen. Mit 410.02: roundTo5Rappen(10.02) = 10.00, zu Gunsten des Mieters.
5. Randfall Null: Die ersetzte Abrechnung ist nur versendet oder hat Saldo 0.00, Anrechnung 0. Saldo wie eine neue Abrechnung. Stimmt, siehe aber V-1.
6. Reihenfolge der Rundung: Weil jeder gespeicherte Saldo ein Vielfaches von 0.05 ist, gilt roundTo5(x − k) = roundTo5(x) − k. Ein vor #79 gespeicherter Saldo auf den Rappen (z.B. 442.93) wird im Entwurf einmal zu Gunsten des Mieters gerundet. Das ist vertretbar.
7. Mieterwechsel: Eva Frei ist selbst ein Fall mit Mieterwechsel (Leerstand im April, Marc Huber ab Mai). Ihr Anteil ändert sich durch die Berichtigung nur um die eigene neue Position.
8. Verwaltungspauschale: Die berichtigte Abrechnung rechnet die Pauschale auf die vollen berichtigten Kosten, die ersetzte zählt nicht mehr. Die Pauschale wird also nur einmal verlangt. Das passt zu Art. 4 Abs. 3 VMWG (Fedlex: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.»).

## Rechtliche Prüfung (bestätigt)

- **Art. 257b Abs. 1 OR** (Fedlex: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»): Eine berichtigte Abrechnung ist der richtige Weg, eine später eingegangene Rechnung oder falsche Vertragsdaten nachzuführen. Mit V-1 und V-3 wird sicher, dass nicht mehr verlangt wird.
- **Art. 257b Abs. 2 OR** (Fedlex: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»): Die gespeicherten Positionen und Verknüpfungen (#96, `utility_statement_line_items`) der ersetzten Abrechnung bleiben erhalten. Das stützt die Belegeinsicht für beide Fassungen.
- **Art. 4 Abs. 1 VMWG** (Fedlex: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»): Eine berichtigte Abrechnung zusätzlich zur jährlichen ist zulässig. «Senden Sie sie dem Mieter» (Vorlegen) steht in der Bestätigung.
- **Art. 128 Ziff. 1 / Art. 130 Abs. 1 OR**: Wortlaut oben. Die Hilfe in der Bestätigung (`w2e-design.md:8`) entspricht wörtlich dem Entscheid des Product Owners.
- **Begriffe**: Weder Entwurf noch Szenarien verwenden «storniert», «Gutschrift» oder «Nachtragsabrechnung» (Entscheid #120). «Berichtigte Abrechnung», «Ersetzt», «Abrechnungsperiode», «Heizprofil», «Verwaltungspauschale», «Mietstage», «Geleistete Akontobeiträge», «Zahlungsdatum», «Saldo», «Abrechnungslauf» und «Rückerstattung» stehen im Glossar.

## Übersetzungen für neue Begriffe (Vorschlag für `docs/design/i18n-begriffe.md`)

| de | fr | it | en |
|----|----|----|----|
| Berichtigte Abrechnung | décompte rectificatif | conteggio rettificato | corrected statement |
| Ersetzt (Status) | remplacé | sostituito | replaced |
| Abrechnung berichtigen (Aktion) | Rectifier le décompte | Rettificare il conteggio | Correct statement |
| Abrechnung ersetzen (Bestätigung) | Remplacer le décompte | Sostituire il conteggio | Replace statement |
| Berichtigte Abrechnung erstellen | Créer le décompte rectificatif | Creare il conteggio rettificato | Create corrected statement |
| ersetzt NK-… / Ersetzt durch NK-… | remplace NK-… / Remplacé par NK-… | sostituisce NK-… / Sostituito da NK-… | replaces NK-… / Replaced by NK-… |
| Bereits bezahlt auf NK-… | Déjà payé sur NK-… | Già pagato su NK-… | Already paid on NK-… |
| Bereits zurückerstattet auf NK-… | Déjà remboursé sur NK-… | Già rimborsato su NK-… | Already refunded on NK-… |

Die Verben folgen dem Stil von `i18n-begriffe.md:100-101` (Infinitiv). «Décompte rectificatif» ist in der Westschweiz geläufig, nicht an einer Quelle geprüft (siehe unten).

## Nicht bestätigt

- **Ob Art. 128 Ziff. 1 OR für Nebenkosten-Nachforderungen gilt und wann die Frist beginnt** (BGE 126 III 119, BGer 4C.24/2002): Der Wortlaut nennt nur «andere periodische Leistungen». Die Anwendung beruht auf Lehre und Rechtsprechung, die ich weder auf bger.ch noch auf Fedlex nachgelesen habe. **unsicher.** Der Text des Product Owners deckt das mit «in der Regel» und «nicht einheitlich geklärt» ab.
- **Ob ein vorbehaltlos bezahlter Saldo als Anerkennung gilt**, die eine spätere Nachforderung des Vermieters ausschliesst oder begrenzt (Treu und Glauben, Art. 2 ZGB): Keine Fedlex-Norm regelt das, Rechtsprechung habe ich nicht geprüft. **unsicher.** Deshalb M-1 (Vorbehalt behalten).
- **Rückforderung des Mieters**: Ob für zu viel bezahlte Nebenkosten die fünf Jahre gelten oder Art. 67 Abs. 1 OR (Fedlex: «Der Bereicherungsanspruch verjährt mit Ablauf von drei Jahren, nachdem der Verletzte von seinem Anspruch Kenntnis erhalten hat, in jedem Fall aber mit Ablauf von zehn Jahren seit der Entstehung des Anspruchs.»), habe ich nicht geklärt (BGE 130 III 504 nur aus zweiter Hand). **unsicher.** Für #358 ohne Folge, weil die berichtigte Abrechnung zu Gunsten des Mieters immer möglich ist.
- **Ob die Oberfläche bei einer versendeten Abrechnung vor Ablauf der Zahlungsfrist eine Mahnung anbietet**: Das Backend lässt `sent` zu (`reminder.service.ts:58`), die Oberfläche habe ich nicht geprüft. Betrifft nur die Aussagekraft des Szenarios (V-9).
- **Übliche Westschweizer und Tessiner Bezeichnung** («décompte rectificatif», «conteggio rettificato»): nicht mit einer Quelle geprüft, nur Sprachgefühl.
- **Gesucht und gelesen**: Fedlex-Filestore OR (20261001) Art. 63, 67, 120, 128, 130, 257a, 257b, 266; VMWG (20251001) Art. 4, 8. `mmx search` nur für die Suche nach der Fedlex-Quelle.
