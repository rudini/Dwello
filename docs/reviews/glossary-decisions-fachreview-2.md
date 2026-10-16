# Fach-Review Glossar, Runde 2 (Delta)

Gegenstand: `git diff 846f8b5 c825422 -- UBIQUITOUS_LANGUAGE.md` (Worktree `review-glossary-fach2`, detached auf c825422) und die Zeile zu Runde 1 in `implementation_plan.md:12`. Vorbericht: `docs/reviews/glossary-decisions-fachreview-1.md`.
Zeilennummern: `UBIQUITOUS_LANGUAGE.md` im Stand c825422.
Product-Owner-Entscheide dieser Sitzung gelesen in den Kommentaren zu #120 und #133 (16.10.2026).

## Status der Befunde aus Runde 1

| ID | Schwere R1 | Status | Beleg |
|----|-----------|--------|-------|
| V-1 | Major | behoben | `:155`; Code-Spalte `period_share` besteht (`backend/src/db/schema.ts:429`). Nachgerechnet siehe unten |
| V-2 | Major | behoben | `:135`; Nachgerechnet siehe unten |
| V-3 | Minor | behoben | `:192` |
| M-1 | Minor | behoben | `:156` |
| V-4 | Minor | behoben | `:156` («erhält den Status ‹Ersetzt›»), `:168`; entspricht dem PO-Kommentar in #120 |
| M-2 | Minor | behoben, mit neuem Befund M-4 | `:43` (befristet), `:44` (Ersatzmieter) |
| V-5 | Minor | behoben | `:69` |
| V-6 | Minor | behoben | `:70` |
| M-3 | Minor | behoben | `:85` |
| V-7 | Minor | behoben, mit neuem Befund V-20 | `:46`; entspricht dem PO-Kommentar in #133 |
| V-8 | Minor | behoben | `:24` |
| V-9 | Minor | behoben | `:23`; passt zu `backend/src/services/tenant.service.ts:42-45` |
| V-10 | Minor | offen (gewollt) | `implementation_plan.md:12`; die Nachführung von A-11 ist im PO-Kommentar zu #120 festgehalten |
| V-11 | Nit | behoben | `:22`; passt zu `docs/anforderungen-vertragsende.md:128` |
| V-12 | Nit | behoben | `:106`; Schwelle 0.7 im Code (`backend/src/config/llm.ts:315,359`) |
| V-13 | Nit | behoben | `:155` |
| V-14 | Nit | behoben | `:82`, `:132` |
| V-15 | Nit | offen (gewollt) | `:154` unverändert |
| V-16 | Nit | behoben | `:59` |
| V-17 | Nit | behoben, mit neuem Befund V-21 | `:105` |
| V-18 | Nit | behoben | `:222` |
| V-19 | Nit | behoben | `:83` |
| Fehlende Begriffe | – | «Ersetzt» und «Ersatzmieter» aufgenommen; die übrigen offen (gewollt, neues Issue) | `implementation_plan.md:12` |

## Neue Befunde aus dem Delta

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-20 | Verwalter | Minor | «Abgerechnet bis»: «nur die Tage danach» sagt nicht, dass auch Akontobeiträge und Mietstage erst ab dem Folgetag zählen; «Geleistete Akontobeiträge» und «Mietstage» sprechen weiter von der ganzen Abrechnungsperiode |
| M-4 | Mietrecht | Minor | «Ersatzmieter»: «übernimmt» geht über Art. 264 Abs. 1 OR hinaus (dort: «bereit sein, … zu übernehmen»); zumutbar und zahlungsfähig fehlen |
| V-21 | Verwalter | Nit | «Auslesen» zählt die Angaben jetzt abschliessend auf, ohne die Beschreibung, die die KI auch liest |
| V-22 | Verwalter | Nit | «Ersetzt» löst «Bezahlt» ab; dass die Zahlung der ersetzten Abrechnung (Zahlungsdatum) erhalten bleibt, steht nirgends, obwohl die berichtigte Abrechnung sie anrechnet |

### V-20 (Minor) Abgerechnet bis: Akontobeiträge und Mietstage

**Beleg.** `UBIQUITOUS_LANGUAGE.md:46`: «reicht eine Abrechnungsperiode darüber hinaus, rechnet sie nur die Tage danach ab.» Dagegen `:152` «Geleistete Akontobeiträge: Summe der monatlichen Vorauszahlungen des Mieters während der Abrechnungsperiode» und `:157` «Mietstage: Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft». PO-Kommentar in #133: «bills only the days after that date (Mietstage from the following day)». Code: `calculation.service.ts:373-377` berechnet die Akontobeiträge aus derselben Überschneidung (`overlapStart`, `overlapEnd`) wie die Mietstage; das ist im Code richtig angelegt, steht aber nicht im Glossar.

**Nachgerechnet.** Akonto 200.–/Monat, abgerechnet bis 30.06.2024, Abrechnungsperiode 01.01.–31.12.2024:
- Richtig (Mietstage und Akonto ab 01.07.): 184 Mietstage, Akontobeiträge 6 × 200 = 1'200.–.
- Liest man «Geleistete Akontobeiträge» wörtlich (ganze Periode), werden 2'400.– angerechnet: Der Mieter erhält die Akontobeiträge Januar bis Juni ein zweites Mal gutgeschrieben (1'200.– zu viel Rückerstattung), obwohl sie in der Abrechnung ausserhalb von Dwello schon verrechnet sind.
- Grenzfall abgerechnet bis = 31.12.2024 (Periodenende): Periode wird übergangen, keine Abrechnung, richtig.
- Grenzfall abgerechnet bis vor Periodenbeginn (31.12.2023): alle Tage der Periode, richtig.

**Warum.** Eine Abrechnung mit halben Kosten und vollen Akontobeiträgen weist eine falsche Rückerstattung aus. Für die Umsetzung von #133 ist das Glossar die Vorgabe.

**Vorschlag.** `:46`: «… reicht eine Abrechnungsperiode darüber hinaus, zählen Mietstage und geleistete Akontobeiträge erst ab dem Tag danach.» Optional bei `:157` «Mietstage»: «… in der Abrechnungsperiode läuft (ab dem Tag nach ‹Abgerechnet bis›)».

### M-4 (Minor) Ersatzmieter: Wortlaut von Art. 264 OR

**Beleg.** `UBIQUITOUS_LANGUAGE.md:44`: «Neuer Mieter, den der Mieter bei vorzeitiger Rückgabe vorschlägt und der den Mietvertrag zu den gleichen Bedingungen übernimmt (Art. 264 OR).»
Fedlex, Art. 264 Abs. 1 OR (Wortlaut wie in Runde 1 zitiert): «Gibt der Mieter die Sache zurück, ohne Kündigungsfrist oder -termin einzuhalten, so ist er von seinen Verpflichtungen gegenüber dem Vermieter nur befreit, wenn er einen für den Vermieter zumutbaren neuen Mieter vorschlägt; dieser muss zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen.»

**Warum.** Das Gesetz verlangt, dass der neue Mieter zumutbar, zahlungsfähig und *bereit* ist zu übernehmen. Ob er den Vertrag tatsächlich übernimmt, entscheidet der Vermieter; lehnt er einen zumutbaren Ersatzmieter ab, ist der bisherige Mieter trotzdem befreit. «Übernimmt» lässt einen Laien glauben, der Mieter bleibe gebunden, bis jemand tatsächlich einzieht, oder umgekehrt, der Vermieter müsse jeden Vorgeschlagenen nehmen. In Dwello erhält ein übernommener Ersatzmieter ohnehin einen eigenen Mietvertrag (Mieterwechsel, `:45`).

**Vorschlag.** «Neuer Mieter, den der Mieter vorschlägt, wenn er die Wohnung zurückgibt, ohne Kündigungsfrist oder -termin einzuhalten. Er muss für den Vermieter zumutbar, zahlungsfähig und bereit sein, den Mietvertrag zu den gleichen Bedingungen zu übernehmen (Art. 264 Abs. 1 OR). Nimmt der Vermieter ihn, erhält er in Dwello einen eigenen Mietvertrag.»

### V-21 (Nit) Auslesen ohne Beschreibung

**Beleg.** `UBIQUITOUS_LANGUAGE.md:105` nennt jetzt abschliessend «Rechnungssteller, Rechnungsnummer, Rechnungsdatum, Fälligkeitsdatum, Leistungszeitraum und Betrag». Die KI liest auch die Beschreibung (`backend/src/config/llm.ts:275` `description`, mit eigener Konfidenz `:293`). Leistungszeitraum und Fälligkeitsdatum sind richtig (`llm.ts:273-274`).

**Vorschlag.** «… Leistungszeitraum, Betrag und Beschreibung …».

### V-22 (Nit) Ersetzt und die Zahlung der ersetzten Abrechnung

**Beleg.** `UBIQUITOUS_LANGUAGE.md:156` («Was Mieter oder Vermieter auf die ersetzte Abrechnung schon bezahlt haben, wird angerechnet») und `:168` (Status «Ersetzt»). Der Abrechnungsstatus ist ein Wert (`schema.ts:372`); «Bezahlt» (`:166`) geht verloren, das Zahlungsdatum bleibt im Schema (`schema.ts:374`).

**Warum.** Die Anrechnung braucht die Angabe, ob und wann bezahlt wurde. Das Glossar sagt nicht, woher sie kommt, wenn der Status nicht mehr «Bezahlt» lautet.

**Vorschlag.** `:168` ergänzen: «Zahlungsdatum und Saldo der ersetzten Abrechnung bleiben erhalten.»

## Nachgerechnet (Formeln im Delta)

**Zeitanteil (`:155`)**, Periode 01.01.–31.12.2025 (365 Tage), Einzug 01.07.2025 (184 Mietstage):
- Rechnung ohne Leistungszeitraum: 184/365 = 50,41 %.
- Rechnung mit Leistungszeitraum 01.01.–31.03.2025: 0/90 = 0 % (vorher im Glossar 204 %).
- Position aus beiden, 1'000.– ohne und 200.– mit Leistungszeitraum, nach Beträgen gewichtet: (1'000 × 0,5041 + 200 × 0) / 1'200 = 42,01 %. Entspricht `calculation.service.ts:130-140` (`rentalShare`).
- Grenzfall Positionssumme 0 (Rechnung und Gutschrift gleich hoch): Code gibt 0 zurück (`:132`); das Glossar sagt dazu nichts, bei Betrag 0 bleibt der Mieteranteil aber 0, also folgenlos.

**Veränderung Tankbestand (`:135`)**, Verbrauch = Veränderung + Lieferungen:
- Anfang 3'000, Lieferungen 5'000, Ende 2'000: Veränderung 1'000, Verbrauch 6'000.
- Aufgefüllt: Anfang 1'000, Lieferung 4'000, Ende 3'500: Veränderung −2'500 («negativ»), Verbrauch 1'500.
- Grenzfall ohne Lieferung: Verbrauch = Veränderung.
Deckt sich mit `docs/nebenkostenabrechnung-anforderungen.md:56` und Art. 5 Abs. 2 lit. a VMWG (Fedlex, wie Runde 1: «die Brennstoffe und die Energie, die verbraucht wurden»).

## Bestätigt (mit Quelle)

- **Umlagefähigkeit** (`:85`): Art. 257a Abs. 2 OR, Fedlex: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Wiedergabe sinngemäss richtig.
- **Berichtigte Abrechnung** (`:156`): Verjährungssatz übernimmt den Vorschlag aus M-1 und den PO-Kommentar in #120 wörtlich; Art. 128 Ziff. 1 OR richtig zitiert (Anwendung auf Nebenkosten weiter **unsicher**, siehe Runde 1).
- **Nachmieter** (`:43`): passt jetzt zu `docs/anforderungen-vertragsende.md:128` und `:205`.
- **Mieter** (`:23`): «ehemalig, wenn alle seine Mietverträge beendet sind; ein Mieter ohne Mietvertrag hat keinen dieser Status» entspricht dem Code (`tenant.service.ts:42-45`). Grenzfall beendeter und künftiger Vertrag: nicht alle beendet, also «künftig», widerspruchsfrei.
- **Gutschrift (eines Rechnungsstellers)**, **Akontorechnung**, **Rechnung**, **Empfangsschein**, **Brennstoff (Kategorie)**, **Tankbestand**, **Vordefinierte Kategorie**, **Vermietet bis**, **Korrespondenzadresse**, **Vorschlag der KI**, **Mehrsprachigkeit**: Wortlaut wie in Runde 1 vorgeschlagen; keine neuen Widersprüche zu den Anforderungsdokumenten oder zum Code.
- **Kategorie** (`:80`, «Bestimmt, ob Kosten auf Mieter umgelegt werden dürfen»): nicht Teil des Deltas; dieselbe Unschärfe wie M-3, jetzt durch `:85` aufgelöst. Kein Befund dieses Deltas.

## Nicht bestätigt

- **Randtitel von Art. 264 OR** («Vorzeitige Rückgabe der Sache»), der das Wort «vorzeitig» in `:44` stützt: nur über Sekundärquellen gefunden (`mmx search`: law.ch, rwi.uzh.ch), nicht auf Fedlex nachgelesen. Der Wortlaut von Abs. 1 stammt aus Runde 1 (Fedlex).
- **Dass ein abgelehnter zumutbarer Ersatzmieter den Mieter trotzdem befreit**: Lehre und Rechtsprechung, nicht im Gesetzeswortlaut geprüft. **unsicher**; M-4 stützt sich in erster Linie auf den Wortlaut «bereit sein».
- **Wie #133 die Akontobeiträge umsetzen wird** (V-20): Der PO-Kommentar nennt nur die Mietstage. Ob er die Akontobeiträge mitmeint, ist nicht entschieden, aber aus dem Code (`calculation.service.ts:373-377`) naheliegend.
