# Fach-Review Glossar, Runde 1

Gegenstand: `git diff 846f8b5~1 846f8b5 -- UBIQUITOUS_LANGUAGE.md` (Worktree `review-glossary-fach`, detached auf 846f8b5). Entscheide gelesen in den Issues #56, #58, #62, #63, #68, #75, #79, #85, #100, #102, #120, #133, #140, #205, #222, #239 (Abschnitt «Decided (product owner)» und Kommentare), dazu #106 (Sprache der Mahnungen).
Gesetzestexte von Fedlex (Filestore, über den SPARQL-Endpunkt gefunden): OR Stand 1. Oktober 2026, VMWG Stand 1. Oktober 2025.
Zeilennummern: `UBIQUITOUS_LANGUAGE.md` im Stand 846f8b5.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | «Zeitanteil»: Zähler falsch, Anteil kann über 100 % liegen; der Teil zum Heizprofil gilt zu allgemein |
| V-2 | Verwalter | Major | «Veränderung Tankbestand» wird «der Verbrauch» genannt; Verbrauch = Anfangsbestand + Lieferungen − Endbestand |
| V-3 | Verwalter | Minor | «Empfangsschein» als «linker Teil des Zahlteils»; nach SIX steht er links neben dem Zahlteil |
| M-1 | Mietrecht | Minor | «Berichtigte Abrechnung»: Verjährungssatz zu absolut (Beginn, Rückforderung des Mieters), «schon Bezahltes» ohne Richtung |
| V-4 | Verwalter | Minor | «Berichtigte Abrechnung»: Abrechnungsstatus der ersetzten Abrechnung fehlt |
| M-2 | Mietrecht | Minor | «Nachmieter» nur nach gekündigtem Vertrag: widerspricht A-4 (befristet) und lässt den Fall nach Art. 264 OR offen; «Ersatzmieter» fehlt |
| V-5 | Verwalter | Minor | «Gutschrift» ohne Zusatz, obwohl #120 das Wort für Abrechnungen ausschliesst; A-11 nutzt es noch anders; Fall «Rechnung schon abgerechnet» fehlt |
| V-6 | Verwalter | Minor | «Akontorechnung»: nicht gesagt, wie Dwello sie erfasst (Risiko doppelter Kosten) |
| M-3 | Mietrecht | Minor | «Umlagefähigkeit» ohne die Voraussetzung der besonderen Vereinbarung (Art. 257a Abs. 2 OR) |
| V-7 | Verwalter | Minor | «Abgerechnet bis»: Periode, die das Datum überspannt, nicht geregelt (Doppelabrechnung möglich) |
| V-8 | Verwalter | Minor | «Korrespondenzadresse»: Land noch nicht im Schema, ohne «geplant (#102)»; Code-Spalte ohne Land |
| V-9 | Verwalter | Minor | «Mieter»: «sonst ehemalig» trifft auch Mieter ohne Mietvertrag; der Code nennt sie nicht ehemalig |
| V-10 | Verwalter | Minor | Anforderungsdokumente widersprechen dem neuen Glossar (Rundung kaufmännisch / höchstens 2 Rappen; A-11 Storno mit Gutschrift) |
| V-11 | Verwalter | Nit | «Vermietet bis {Datum}»: Ausnahme bei Nachmieter ab dem Folgetag fehlt |
| V-12 | Verwalter | Nit | «Vorschlag der KI (Kategorie)»: «ab Konfidenz 0.7», Konfidenz aber neu in Prozent |
| V-13 | Verwalter | Nit | «Ihr Anteil» (in Zeitanteil) ist kein Glossarbegriff; im Glossar heisst er «Mieteranteil» |
| V-14 | Verwalter | Nit | Brennstoff / Heizmaterial / Tankbestand erklären sich gegenseitig; «Brennstoff (Kategorie)» ohne «umlagefähig» |
| V-15 | Verwalter | Nit | «Rundung auf 5 Rappen»: Vorzeichen der Definition ≠ Vorzeichen im PDF; Saldo 0.00 nach Rundung nicht benannt |
| V-16 | Verwalter | Nit | «Rechnung»: «Dienstleister» statt Rechnungssteller; Beleg ist optional |
| V-17 | Verwalter | Nit | «Auslesen»: «Daten» ist mehrdeutig |
| V-18 | Verwalter | Nit | «Mehrsprachigkeit»: Mahnungen in der Sprache des Mieters ist in #106 entschieden (nicht in der Liste), noch nicht umgesetzt, ohne Verweis |
| V-19 | Verwalter | Nit | «Vordefinierte Kategorie»: Die Listen enthalten auch eigene Kategorien; «Vermieter» statt Liegenschaftsverwalter |

---

## Befunde im Einzelnen

### V-1 (Major) Zeitanteil: Formel falsch

**Beleg.** `UBIQUITOUS_LANGUAGE.md:154`: «seine Mietstage geteilt durch die Tage der Abrechnungsperiode, bei einer Rechnung mit Leistungszeitraum durch die Tage dieses Zeitraums; bei Heizkosten der Anteil nach dem Heizprofil.»
Code: `backend/src/services/calculation.service.ts:131-141` (`rentalShare`): Zähler sind die Tage des Mietvertrags *innerhalb* der Tage, die die Rechnung abrechnet. Nenner sind die Tage der Rechnung *in der Periode* (`invoice.service.ts:494-503`, `inPeriod` kürzt den Leistungszeitraum auf die Periode). Bei mehreren Rechnungen in einer Position wird nach Betrag gewichtet. Anforderung: `docs/nebenkostenabrechnung-anforderungen.md:145` (Regel 5): «mit Leistungszeitraum seine Mietstage darin / Tage des Leistungszeitraums in der Periode».

**Nachgerechnet** (Periode 01.01.–31.12.2025, 365 Tage; Einzug 01.07.2025, 184 Mietstage):
- Rechnung mit Leistungszeitraum 01.01.–31.03.2025 (90 Tage): Glossar 184/90 = 204 %. Code und Anforderung: 0/90 = 0 %, weil der Mieter in diesem Zeitraum nicht gemietet hat.
- Leistungszeitraum 01.10.2024–30.09.2025, also teils vor der Periode: Glossar 184/365 = 50,4 %. Code: 92/273 = 33,7 % (Tage 01.01.–30.09. in der Periode; Mietstage darin 01.07.–30.09.).
- Grenzfall ohne Leistungszeitraum, ganze Periode: 365/365 in beiden Fällen, also richtig.

Nach Heizprofil wird nur gerechnet, wenn der Abrechnungslauf ein Heizprofil hat und die Monate der Periode darin nicht zusammen 0 % ergeben; sonst nach Tagen (`calculation.service.ts:318-343`, Anforderung Regel 5, #137).

**Warum falsch.** Mit dem Glossar als Vorgabe würde der Mieter mehr als die tatsächlichen Aufwendungen tragen (Art. 257b Abs. 1 OR, Fedlex: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»). Wer im PDF nachrechnet, findet die Zahlen nicht wieder.

**Vorschlag.** «Anteil eines Mietvertrags an einer Abrechnungsposition nach der Zeit: die Mietstage innerhalb der Tage, die die Rechnung in der Abrechnungsperiode abrechnet, geteilt durch diese Tage (ohne Leistungszeitraum die Tage der Abrechnungsperiode); bei mehreren Rechnungen nach ihren Beträgen gewichtet. Heizkosten mit Heizprofil im Abrechnungslauf: der Anteil nach dem Heizprofil. Mieteranteil = Wohnungsanteil × Zeitanteil.» Code-Spalte: `period_share`. Dazu die Begriffe aus dem Kommentar in #75 (Abgerechnete Tage `billed_days`, Mietstage der Position `position_rental_days`) entscheiden lassen.

### V-2 (Major) Veränderung Tankbestand ist nicht «der Verbrauch»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:134`: «Anfangsbestand minus Endbestand des Heizmaterials im Tank in der Abrechnungsperiode; der Verbrauch, der zu den Heizkosten zählt.» Der Satz steht so in #239, ist aber fachlich falsch. Anforderung `docs/nebenkostenabrechnung-anforderungen.md:56`: «Verbrauch = Anfangsbestand + Lieferungen − Endbestand». Code: `fuel-stock.service.ts:85,98` (opening − closing) wird *zusätzlich* zu den Lieferungsrechnungen in die Heizposition gerechnet.
Rechtsgrundlage: Art. 5 Abs. 2 lit. a VMWG (Fedlex): «die Brennstoffe und die Energie, die verbraucht wurden».

**Nachgerechnet.**
- Anfangsbestand 3'000, Lieferungen 5'000, Endbestand 2'000: Verbrauch 6'000, Veränderung 1'000. Nach dem Glossar wäre der Verbrauch 1'000.
- Aufgefüllter Tank: Anfangsbestand 1'000, Lieferung 4'000, Endbestand 3'500: Veränderung −2'500, Verbrauch 1'500. Nach dem Glossar wäre der Verbrauch negativ.
- Grenzfall ohne Lieferung: Nur hier sind Veränderung und Verbrauch gleich.

Auch das Wort: «im Tank» passt nicht zu Tankbestand und Heizmaterial (Zeilen 131, 133: «im Tank oder Lager»), also nicht zu Pellets und Holz.

**Vorschlag.** «Anfangsbestand minus Endbestand des Heizmaterials im Tank oder Lager. Zusammen mit den Lieferungen der Abrechnungsperiode ergibt sie den Verbrauch, der zu den Heizkosten zählt (Art. 5 Abs. 2 lit. a VMWG). Negativ, wenn der Endbestand höher ist als der Anfangsbestand.» Im PDF-Text von #239 nichts «Verbrauch» nennen, was nur die Veränderung ist.

### V-3 (Minor) Empfangsschein ist nicht Teil des Zahlteils

**Beleg.** `UBIQUITOUS_LANGUAGE.md:190`: «Linker Teil des Zahlteils». Anforderung `docs/nebenkostenabrechnung-anforderungen.md:88`: «Zahlteil 148 × 105 mm (A6 quer), Empfangsschein 62 × 105 mm links davon». Wiedergabe der SIX Implementation Guidelines (Spiegel, pearlsys.ch): «Der Empfangsschein muss links neben dem Zahlteil platziert werden.» Die SIX-Seite selbst war aus der Sandbox nicht erreichbar (Proxy 403).

**Warum falsch.** Nach SIX sind Zahlteil und Empfangsschein zwei Teile der QR-Rechnung. Das Glossar macht den Empfangsschein zum Teil des Zahlteils und widerspricht damit der Anforderung und dem Eintrag «Zahlteil» (Zeile 189).

**Vorschlag.** «Teil der QR-Rechnung links neben dem Zahlteil, den der Zahlende als Quittung behält (Begriff der SIX).»

### M-1 (Minor) Berichtigte Abrechnung: Verjährung und Anrechnung

**Beleg.** `UBIQUITOUS_LANGUAGE.md:155`: «schon Bezahltes wird angerechnet. Nebenkosten verjähren nach fünf Jahren (Art. 128 Ziff. 1 OR).»
Fedlex, Art. 128 OR: «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen;». Art. 130 Abs. 1 OR: «Die Verjährung beginnt mit der Fälligkeit der Forderung.» Art. 67 Abs. 1 OR: «Der Bereicherungsanspruch verjährt mit Ablauf von drei Jahren, nachdem der Verletzte von seinem Anspruch Kenntnis erhalten hat, in jedem Fall aber mit Ablauf von zehn Jahren seit der Entstehung des Anspruchs.»
Anforderung `docs/nebenkostenabrechnung-anforderungen.md:78` und `:160` (offener Punkt 6): Beginn der Frist uneinheitlich; nach Anerkennung des Saldos gilt für eine Rückforderung Art. 67 OR.

**Warum.** «Nebenkosten verjähren nach fünf Jahren» nennt keinen Beginn. Es klingt auch so, als gelte die Frist für jede Forderung, auch für die Rückforderung des Mieters nach einer bezahlten Abrechnung. Dass Art. 128 Ziff. 1 OR Nebenkosten erfasst, stützt sich auf Lehre und Rechtsprechung (BGE 126 III 119, nur aus zweiter Hand), nicht auf den Wortlaut: **unsicher**. «Schon Bezahltes» sagt nicht, wer bezahlt hat; bei einer Rückerstattung ist es der Vermieter.

**Vorschlag.** «… Was Mieter oder Vermieter auf die ersetzte Abrechnung schon bezahlt haben, wird angerechnet. Forderungen aus der Nebenkostenabrechnung verjähren in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR); ab wann die Frist läuft, ist nicht einheitlich geklärt.»

### V-4 (Minor) Fehlender Begriff: Status der ersetzten Abrechnung

**Beleg.** `UBIQUITOUS_LANGUAGE.md:155` («Die alte bleibt unverändert erhalten») gegen `:159-166`: Der Abrechnungsstatus kennt nur Entwurf, Versendet, Bezahlt und Überfällig.

**Warum.** Die alte Abrechnung zeigt nach der Berichtigung weiter «Bezahlt» oder «Überfällig». Bei «Überfällig» löst sie Mahnungen aus (Zeile 175: Mahnung «zu einer versendeten Abrechnung»), und bei einem neuen Abrechnungslauf zählt sie möglicherweise doppelt.

**Vorschlag (Issue, Labels `fachlich`, `entscheiden`).** Neuer Abrechnungsstatus «**Ersetzt** (`replaced`): Durch eine berichtigte Abrechnung ersetzt; wird nicht gemahnt und zählt nicht als Abrechnung der Periode.»

### M-2 (Minor) Nachmieter zu eng; Ersatzmieter fehlt

**Beleg.** `UBIQUITOUS_LANGUAGE.md:43`: «… nach dem Vertragsende eines gekündigten Mietvertrags beginnt.» Dagegen `docs/anforderungen-vertragsende.md:205`, Szenario «Abgelaufener befristeter Mietvertrag ohne Nachmieter», und `:128`: Die Frist «Vertragsende» nennt befristete Verträge und solche, «für die schon ein Nachmieter erfasst ist». Dieselbe Datei, `:100`, braucht «Ersatzmieter», ohne dass es im Glossar steht.
Fedlex, Art. 264 Abs. 1 OR: «Gibt der Mieter die Sache zurück, ohne Kündigungsfrist oder -termin einzuhalten, so ist er von seinen Verpflichtungen gegenüber dem Vermieter nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; dieser muss zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen.»

**Warum.** In der Praxis heisst der «neue Mieter» nach Art. 264 OR meist Nach- oder Ersatzmieter. Er kommt gerade *ohne* ordentliche Kündigung, und der Nachfolger nach einem befristeten Vertrag ist nach der Definition kein Nachmieter. So wie sie dasteht, widerspricht sie der Anforderung A-4. Die Wortwahl des Product Owners in #140 wird damit nicht bemängelt, nur ihre Reichweite.

**Vorschlag (Issue, `fachlich`, `entscheiden`).** «Mieter, dessen Mietvertrag für dieselbe Wohnung nach dem Vertragsende eines gekündigten oder befristeten Mietvertrags beginnt.» Dazu ein eigener Begriff «**Ersatzmieter**: neuer Mieter, den der Mieter bei vorzeitiger Rückgabe vorschlägt und der den Mietvertrag zu den gleichen Bedingungen übernimmt (Art. 264 OR).»

### V-5 (Minor) Gutschrift: Wort und Zeitraum

**Beleg.** `UBIQUITOUS_LANGUAGE.md:68` mit dem Kopf «**Gutschrift**». In #120 entschieden: «‹storniert›, ‹Gutschrift› and ‹Nachtragsabrechnung› are not used». `docs/anforderungen-vertragsende.md:329-331` (A-11) beschreibt noch eine «Gutschrift (Gegenbuchung mit eigener Nummer)» an den Mieter.

**Warum.** Das Wort ohne Zusatz lädt dazu ein, es auch für die Rückerstattung oder Korrektur an den Mieter zu nutzen. Das schliesst #120 aus, und A-11 tut es noch. Die Nachbarbegriffe (Zeilen 69, 70) tragen deshalb «eines Rechnungsstellers». Ausserdem fehlt der häufige Fall, dass die zugehörige Rechnung in einer Periode liegt, die schon versendet ist (z. B. eine Rückvergütung des Heizöllieferanten im Folgejahr). Ein Abzug dort ändert die versendete Abrechnung nicht. Nach #120 bräuchte es dafür eine berichtigte Abrechnung.

**Vorschlag.** Kopf «**Gutschrift (eines Rechnungsstellers)**», ergänzt um «Nicht zu verwechseln mit der Rückerstattung an den Mieter. Ist die zugehörige Rechnung schon abgerechnet, braucht es eine berichtigte Abrechnung.» Dazu A-11 an #120 anpassen (siehe V-10).

### V-6 (Minor) Akontorechnung: Erfassung in Dwello fehlt

**Beleg.** `UBIQUITOUS_LANGUAGE.md:69`. Hinweis `messages/de.json:810` (`invoices_upload_deducted`): «Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt.»

**Warum.** Bei der Gutschrift sagt das Glossar, wie Dwello sie erfasst, bei der Akontorechnung nicht. Wer Akontorechnungen *und* die Schlussrechnung mit dem Total erfasst, rechnet Kosten doppelt ab. Das ginge über die tatsächlichen Aufwendungen hinaus (Art. 257b Abs. 1 OR, Wortlaut siehe V-1).

**Vorschlag.** Ergänzen: «In Dwello wird die Schlussrechnung mit dem Total der Leistungen erfasst; die Akontorechnungen nicht zusätzlich.»

### M-3 (Minor) Umlagefähigkeit ohne vertragliche Vereinbarung

**Beleg.** `UBIQUITOUS_LANGUAGE.md:84`: «Ob die Kosten einer Kategorie in die Nebenkostenabrechnung fliessen dürfen (Art. 257a–257b OR, Art. 4–6c VMWG).» Fedlex, Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Art. 4–6c VMWG gibt es im Stand 1.10.2025 (Art. 6a ausgelagerte Zentrale, 6b Zusammenschluss zum Eigenverbrauch, 6c Energiespar-Contracting); der Verweis stimmt.

**Warum.** Die Kategorie sagt nur, ob Kosten dieser Art überhaupt Nebenkosten sein können. Ob ein Mieter sie zahlt, hängt vom Mietvertrag ab. Zeile 201 sagt das («abschliessende Liste im Mietvertrag»), der neue Eintrag zitiert Art. 257a OR aber ohne diese Voraussetzung. Ein Laie liest «dürfen» als Erlaubnis für jeden Mieter.

**Vorschlag.** «… fliessen können (Art. 257b OR, Art. 4–6c VMWG); bezahlen muss der Mieter sie nur, wenn der Mietvertrag sie vorsieht (Art. 257a Abs. 2 OR). …»

### V-7 (Minor) Abgerechnet bis: Periode über das Datum hinaus

**Beleg.** `UBIQUITOUS_LANGUAGE.md:45`: «übergehen Abrechnungsperioden, die bis dahin enden». Das entspricht #133 («skip periods that end on or before it»).

**Nachgerechnet.** Abgerechnet bis 30.06.2024 (alte Periode Juli bis Juni), neue Abrechnungsperiode Kalenderjahr 2024, also Ende 31.12.2024 > 30.06.2024: Die Periode wird nicht übergangen, und Dwello rechnet 01.01.–30.06.2024 ein zweites Mal ab. Grenzfall: Abgerechnet bis 31.12.2024 = Periodenende, wird übergangen, richtig.

**Warum.** Beim Wechsel zu Dwello wechselt die Abrechnungsperiode oft mit. Eine doppelte Abrechnung verletzt Art. 257b Abs. 1 OR. Das Glossar gibt den Entscheid richtig wieder, der Entscheid lässt den Fall aber offen.

**Vorschlag (Issue, `fachlich`, `entscheiden`).** «Eine Abrechnungsperiode, die über das Datum hinausgeht, rechnet nur die Tage danach ab» (Mietstage ab dem Folgetag), oder der Abrechnungslauf weist auf die Überschneidung hin.

### V-8 (Minor) Korrespondenzadresse: Land nicht als geplant markiert

**Beleg.** `UBIQUITOUS_LANGUAGE.md:24`: «(mit Land, Vorgabe Schweiz)», Code-Spalte «`address`, `postal_code`, `city` Felder». `backend/src/db/schema.ts:86-99`: Die Tabelle `tenants` hat kein Land. Das ist #102, Option 2.

**Warum.** Andere geplante Einträge tragen «geplant (#n)» (Zeilen 45, 81, 155), dieser nicht. Die Code-Spalte widerspricht der Definition. Für die QR-Rechnung ist das Land Pflicht (#102).

**Vorschlag.** Code-Spalte «`address`, `postal_code`, `city` Felder; Land geplant (#102)».

### V-9 (Minor) Mieter ohne Mietvertrag ist nicht «ehemalig»

**Beleg.** `UBIQUITOUS_LANGUAGE.md:23`: «… sonst ehemalig». `backend/src/services/tenant.service.ts:42-45`: ehemalig nur `hasContracts and not isActive`. Ein frisch erfasster Mieter ohne Vertrag hat keinen der beiden Status.

**Vorschlag.** «Aktiv mit laufendem Mietvertrag, künftig mit nur einem künftigen Mietvertrag, ehemalig, wenn alle seine Mietverträge beendet sind.» Der Status für einen Mieter ohne Vertrag wäre zu entscheiden (Issue, `fachlich`, `entscheiden`).

### V-10 (Minor) Anforderungsdokumente nicht nachgeführt

**Beleg.**
- `docs/nebenkostenabrechnung-anforderungen.md:148` (Regel 8): «wird kaufmännisch auf 5 Rappen gerundet, um höchstens 2 Rappen». Ebenso `:94`. Dagegen `UBIQUITOUS_LANGUAGE.md:152-153` nach #79.
- `docs/anforderungen-vertragsende.md:327-333` (A-11): Storno mit Gutschrift. Dagegen `UBIQUITOUS_LANGUAGE.md:155` nach #120.

**Nachgerechnet** (Rundung zugunsten des Mieters = Abrunden des Saldos mit Vorzeichen auf 5 Rappen):
- +123.47 → 123.45 (Rundung −0.02);
- −123.47 → −123.50 (Rundung −0.03);
- +123.49 → 123.45 (Rundung −0.04);
- Grenzfall +0.03 → 0.00;
- Grenzfall −0.01 → −0.05.

Die Rundung beträgt also bis zu 4 Rappen, nicht 2.
Rechtlich unbedenklich: Der Mieter zahlt nie mehr als die tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR).

**Vorschlag.** Beide Dokumente mit der Umsetzung von #79 und #120 nachführen (Regel 8: «zugunsten des Mieters, um höchstens 4 Rappen»). Das Glossar selbst ist hier richtig.

### V-11 (Nit) Vermietet bis: Ausnahme fehlt

`UBIQUITOUS_LANGUAGE.md:22`. `src/lib/apartment.ts:118-119` und `docs/anforderungen-vertragsende.md:128`: «beginnt der nächste Vertrag am Tag danach, bleibt es bei ‹Vermietet›». Vorschlag: «… zeigt das Vertragsende des laufenden Mietvertrags an, solange kein Mietvertrag ab dem Tag danach erfasst ist.»

### V-12 (Nit) Konfidenz-Schwelle in Prozent

`UBIQUITOUS_LANGUAGE.md:103` (Konfidenz «0–100 %») gegen `:105` («ab Konfidenz 0.7»). Vorschlag: «ab Konfidenz 70 %».

### V-13 (Nit) «Ihr Anteil»

`UBIQUITOUS_LANGUAGE.md:154` nutzt «Ihr Anteil», die Spalte des PDF (`pdf.service.ts:43`). Das Glossar nennt denselben Betrag «Mieteranteil» (Zeilen 147, 149). Vorschlag: «Mieteranteil = Wohnungsanteil × Zeitanteil (im PDF: ‹Ihr Anteil›)».

### V-14 (Nit) Brennstoff, Heizmaterial, Tankbestand

Zeile 131 (Tankbestand = «Wert des Brennstoffs»), Zeile 133 (Heizmaterial = «Brennstoff der Heizung») und Zeile 81 (Brennstoff = Kategorie mit «Lieferungen von Heizmaterial») erklären sich gegenseitig, und «Brennstoff» ist jetzt zugleich Merkmal und Stoff. Vorschlag: Tankbestand «Wert des Heizmaterials …». Bei Brennstoff (Kategorie) «einer umlagefähigen Heizkosten-Kategorie», wie es `fuel-stock.service.ts:80` tut. Leitungsgas und Fernwärme fallen richtig heraus, weil Heizmaterial «im Tank oder Lager» liegt.

### V-15 (Nit) Rundung: Vorzeichen und Saldo null

Zeile 153 definiert die Rundung als Differenz mit Vorzeichen. Nach #79 ist sie damit immer ≤ 0. Das PDF zeigt sie aber «vom Betrag aus gesehen» (`nebenkostenabrechnung-anforderungen.md:148`), bei einer Rückerstattung also «+0.03». Ein Saldo von +0.01 bis +0.04 wird 0.00 und ist dann weder Nachzahlung noch Rückerstattung (Zeile 152). Vorschlag: «Saldo 0.00: keine Zahlung, kein Zahlteil» ergänzen und die Anzeige des Vorzeichens festhalten.

### V-16 (Nit) Rechnung

Zeile 58: «Forderung eines Dienstleisters» – Heizöl ist eine Lieferung, und der Glossarbegriff heisst «Lieferant / Rechnungssteller». «Ihre Datei ist der Beleg» unterstellt eine Datei, doch nach Zeile 71 gibt es höchstens eine. Vorschlag: «Forderung eines Rechnungsstellers für Leistungen oder Lieferungen am Gebäude (…); ihre hochgeladene Datei ist der Beleg.»

### V-17 (Nit) Auslesen

Zeile 104: «Daten» kann Datumsangaben oder Angaben allgemein heissen. Vorschlag: «Rechnungsdatum, Fälligkeitsdatum» ausdrücklich nennen, so weit die KI sie liest.

### V-18 (Nit) Mahnungen in der Sprache des Mieters

Zeile 220. Das ist in #106 entschieden, und #106 steht nicht in der Liste dieses Auftrags. `backend/src/services/reminder-letter.ts:20,39,46` schreibt heute nur Deutsch. Gewollt vorlaufend, laut Auftrag zulässig. Zur Nachverfolgung «(geplant, #106)» anfügen, wie in den anderen Einträgen.

### V-19 (Nit) Vordefinierte Kategorie

Zeile 82 verweist auf die «Listen unter ‹Umlagefähig› und ‹Nicht umlagefähig›». Die Liste «Umlagefähig» (Zeile 89) enthält aber auch «eigene Kategorien, die als umlagefähig erfasst sind». Ausserdem heisst es «eigene Kategorie des Vermieters», Zeile 83 sagt «Liegenschaftsverwalter». Vorschlag: «(die mit Namen genannten Kategorien der Listen …)»; «des Liegenschaftsverwalters».

---

## Bestätigt (mit Quelle)

- **Art. 8 Abs. 2 VMWG**, Zitat in «Heizmaterial» (Zeile 133), Fedlex wörtlich: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» Die Wortgruppe stimmt.
- **Gutschrift senkt die tatsächlichen Aufwendungen** und **Mahngebühren/Verzugszinsen sind keine Nebenkosten** (Zeilen 68, 70): Art. 257b Abs. 1 OR (Wortlaut V-1). Verzugsfolgen der eigenen Zahlung des Vermieters sind keine «Aufwendungen … für Leistungen, die mit dem Gebrauch zusammenhängen».
- **Rundung zugunsten des Mieters** (Zeilen 152-153): steht im Einklang mit Art. 257b Abs. 1 OR (Rechnung V-10). Die Wiedergabe von #79 stimmt.
- **Mietstatus «Vermietet ab {Datum}»** (`relet` nur bei einem künftigen Vertrag ohne laufenden): passt zu `backend/src/services/apartment.service.ts:36-50` und zu #58, #140.
- **Mieter «künftig»**: passt zu #58. Im Code noch nicht umgesetzt (`tenant.service.ts:35-39` zählt künftige Verträge zu «aktiv»), gewollt vorlaufend.
- **Mieterwechsel** (Zeile 44): Wortlaut aus #140, passt zu `docs/nebenkostenabrechnung-anforderungen.md:147` (Regel 7) und `:38` sowie zu Art. 4 Abs. 1 VMWG (Fedlex: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»).
- **Monatlich total** ohne Vergleich mit der Bruttomiete (#62), **Abrechnungsperiode** zusammengeführt (#85), Abschnitt **Einstellungen** (#56), **Rätoromanisch entfernt** (#63), **Vordefinierte/Eigene Kategorie, Grund der Umlagefähigkeit, Vorschlag der KI** (#75, #205), **Konfidenz, Auslesen, Rechnung, Akontorechnung, Mahnung eines Rechnungsstellers** (#222), **Brennstoff (Kategorie)** (#100), **Abgerechnet bis** (#133), **Nachmieter** (#140): Wortlaut stimmt mit dem jeweiligen Entscheid überein. Die fachlichen Lücken stehen oben.
- **Art. 4–6c VMWG** im Eintrag «Umlagefähigkeit»: Die Artikel bestehen (Fedlex, Stand 1.10.2025).
- **Art. 128 Ziff. 1 OR**: Der Wortlaut (siehe M-1) ist richtig zitiert, nur seine Anwendung ist unsicher.

## Fehlende Begriffe (Vorschläge; Issues mit Labels `fachlich`, `entscheiden`)

- **Ersetzt** (Abrechnungsstatus, `replaced`), siehe V-4.
- **Ersatzmieter** (Art. 264 OR), siehe M-2.
- **Abgerechnete Tage** (`billed_days`) und **Mietstage der Position** (`position_rental_days`): schon im Kommentar zu #75 vorgeschlagen, im Diff nicht übernommen. Sie gehören zu V-1.
- **Hinweis auf fehlende Abrechnungen** (Zeile 45): Der Begriff ist nicht definiert. Vorschlag: «Hinweis auf der Seite des Mietvertrags, welche beendeten Abrechnungsperioden seit Vertragsbeginn keine Abrechnung haben (#142).»
- **Monatsanteil** und **Anteil nach Heizprofil**: im Kommentar zu #75 vorgeschlagen, nicht übernommen. Der Eintrag «Zeitanteil» stützt sich auf sie.

## Nicht bestätigt

- **SIX-Wortlaut zum Empfangsschein:** Die SIX-PDFs (six-group.com) waren über den Proxy gesperrt (403). Belegt nur über einen Spiegel (pearlsys.ch) und `docs/nebenkostenabrechnung-anforderungen.md:88`.
- **Verjährungsbeginn und Anwendung von Art. 128 Ziff. 1 OR auf Nebenkosten-Nachforderungen** (BGE 126 III 119, BGer 4C.24/2002): Nicht auf Fedlex oder bger.ch im Wortlaut geprüft, nur über `docs/nebenkostenabrechnung-anforderungen.md:78,160`. **unsicher**.
- **Ob ein bezahlter Saldo als Anerkennung gilt**, die eine spätere berichtigte Abrechnung zulasten des Mieters ausschliesst: keine Fedlex-Norm, keine Rechtsprechung geprüft. **unsicher**.
- **Gutschrift aus einer Vorperiode:** Wie die Praxis eine Gutschrift für eine schon abgerechnete Periode behandelt (berichtigen oder in der laufenden Periode gutschreiben), ist nicht recherchiert.
- **«Nachmieter» und «Ersatzmieter» in der Praxis:** Ob beide als Synonyme gelten, ist nicht mit einer Quelle belegt. Der Gesetzestext sagt «neuen Mieter» (Art. 264 OR).
- Die GitHub-Suche über alle Issues war in der Sitzung gesperrt. Doppelte Issues wurden nur in der Liste der offenen Issues (99) nach Stichworten gesucht.
