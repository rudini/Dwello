# Fach-Review 1: #250, #254 (Leistungszeitraum über mehrere Jahre)

Gegenstand: Worktree `review-w3-fach`, Commit b9509aa (`git diff b9509aa~1 b9509aa`: @wip-Szenarien in `statement-generate.feature`, `help.feature`, `invoice-new.feature`) und die vorgeschlagenen Hilfetexte in `scratchpad/w3-proposed-texts.md`.

Ergebnis: keine Blocker, keine Major. Die Zahlen der Szenarien stimmen, die Kategorie «Warmwasser» passt, und die Begriffe stehen in `UBIQUITOUS_LANGUAGE.md`. Am Hilfetext gibt es fachliche und sprachliche Punkte (Minor/Nit). Der korrigierte Gesamttext steht am Ende.

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Minor | «Das Entkalken der zentralen Warmwasseranlage ist umlagefähig» wirkt bedingungslos. Art. 257a Abs. 2 OR (Vereinbarung im Mietvertrag) gilt aber auch hier, der Gegensatz zum Wohnungsboiler führt in die Irre. |
| M-2 | Mietrecht | Minor | Wohnungsboiler: Es fehlt «ausdrücklich». Der Satz klingt so, als würde eine Nennung im Mietvertrag den Streit sicher beenden. |
| M-3 | Mietrecht | Nit | Fundstelle «Art. 5 Absatz 2 VMWG» ohne «Bst. e». #254 nennt lit. e, die Hausschreibweise ist «Absatz 2 Bst. d». |
| V-1 | Verwalter | Minor | «Er beginnt am Tag der Arbeit» liest man als 1. Mai (Feiertag). «reicht bis zur nächsten» ist ungenau, richtig ist der Tag davor. |
| V-2 | Verwalter | Minor | Keine Anleitung für den Fall, dass die nächste Arbeit früher oder später als geplant kommt. Dann zählen zwei Rechnungen doppelt, oder es bleibt ein Rest. Vorschlag für ein Issue. |
| V-3 | Verwalter | Nit | «etwa CHF 100 pro Jahr» stimmt im ersten Jahr (75.30) und im letzten (24.64) nicht. Ein Halbsatz verhindert Rückfragen. |
| V-4 | Verwalter | Nit | Die Rundung pro Periode ergibt über sechs Perioden zusammen CHF 500.01. Das Verhalten bestand schon vorher, die Änderung macht es nur sichtbarer. |
| V-5 | Verwalter | Minor | #254 verlangt den Hilfetext auch im Upload-Dialog (und er soll ins Bearbeiten-Formular). Kein Szenario und kein genannter Test deckt diese Stellen ab. |
| V-6 | Verwalter | Minor (Produktentscheid) | `{year}` statt fest 2026: fachlich richtig und besser. Ab 2027 weicht der Text aber vom wörtlich entschiedenen Beispiel in #254 ab, das muss der Product Owner bestätigen. |
| V-7 | Verwalter | Nit | `invoices_service_period_help`: «Geben Sie ihn …» bezieht sich auf nichts, davor steht eine Frage. Der Fehler bestand schon vorher. |
| V-8 | Verwalter | Nit | Der zweite Absatz hat 9 Sätze. Die Rechtslage zum Boiler lässt sich als eigener kurzer Block absetzen. |

## Befunde

### M-1 (Minor): zentrale Warmwasseranlage ohne den Vorbehalt des Mietvertrags

- Beleg: Vorschlag `invoices_service_period_years`, Satz 8: «Das Entkalken der zentralen Warmwasseranlage ist umlagefähig (Art. 5 Absatz 2 VMWG).» Direkt danach: «Bei einem Boiler in der Wohnung … nur, wenn der Mietvertrag es als Nebenkosten nennt.»
- Fedlex, Art. 257a Abs. 2 OR (SR 220, Fassung 01.01.2026): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- `UBIQUITOUS_LANGUAGE.md:84` (Umlagefähigkeit): «bezahlen muss der Mieter sie nur, wenn der Mietvertrag sie vorsieht (Art. 257a Abs. 2 OR)».
- Warum falsch: Weil der Text die Bedingung «Mietvertrag» nur beim Wohnungsboiler nennt, liest ein Laie, dass bei der zentralen Anlage keine Vereinbarung nötig sei. Das stimmt nicht: Auch hier müssen Warmwasserkosten (oder Heiz- und Warmwasserkosten) im Mietvertrag als Nebenkosten stehen.
- Korrektur: «Das Entkalken der zentralen Warmwasseranlage ist umlagefähig (Art. 5 Absatz 2 Bst. e VMWG), wenn der Mietvertrag Warmwasserkosten als Nebenkosten nennt.»

### M-2 (Minor): Wohnungsboiler, «ausdrücklich»

- Beleg: «Umlagefähig ist es nur, wenn der Mietvertrag es als Nebenkosten nennt. Im Zweifel ist es nicht umlagefähig.»
- Fedlex, Art. 5 Abs. 1 VMWG (SR 221.213.11, Fassung 01.10.2025): «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.» Ein Boiler in der Wohnung ist keine zentrale Anlage, Art. 5 trägt ihn also nicht.
- Fedlex, Art. 256 Abs. 2 OR: «Abweichende Vereinbarungen zum Nachteil des Mieters sind nichtig, wenn sie enthalten sind in: … b. Mietverträgen über Wohn- oder Geschäftsräume.» Gilt das Entkalken als Unterhalt (Art. 256 Abs. 1 OR), hilft auch eine Klausel nicht sicher. Daher «umstritten».
- Praxis (keine Gesetzesquelle): Mieterverband, «Wissenswertes rund um die Heiz- und Nebenkosten»: «Nach Ansicht des Mieterinnen- und Mieterverbands handelt es sich bei der Entkalkung des Wohnungsboilers hingegen um eine Unterhaltsarbeit.» Beobachter, «Wer zahlt den Boiler-Service?»: «Das Entkalken des Boilers könnte unter die Nebenkosten fallen. Die schulden Sie dem Vermieter aber nur, wenn die jeweiligen …» Mieterverband, «Heiz- und Nebenkosten»: «nur Nebenkosten …, die im Mietvertrag ausdrücklich und klar erwähnt sind».
- Warum ungenau: «nennt es als Nebenkosten» lässt eine Sammelklausel («übrige Betriebskosten») oder «Warmwasser» allgemein genügen. Der Satz klingt so, als würde die Nennung den Streit sicher beenden. Der Entscheid in #254 («in doubt, not umlagefähig») bleibt gewahrt.
- Korrektur: «Bei einem Boiler in der Wohnung ist das umstritten: Verrechnen Sie es nur, wenn der Mietvertrag das Entkalken des Boilers ausdrücklich als Nebenkosten nennt. Im Zweifel ist es nicht umlagefähig.»

### M-3 (Nit): Fundstelle

- Beleg: «(Art. 5 Absatz 2 VMWG)». In #254 entschieden: «Art. 5 Abs. 2 lit. e VMWG». Hausschreibweise in `messages/de.json:1195`: «Art. 5 Absatz 2 Bst. d VMWG».
- Fedlex, Art. 5 Abs. 2 Bst. e VMWG: «die periodische Revision der Heizungsanlage einschliesslich des Öltanks sowie das Entkalken der Warmwasseranlage, der Boiler und des Leitungsnetzes;»
- Korrektur: «Art. 5 Absatz 2 Bst. e VMWG».

### V-1 (Minor): «Tag der Arbeit», «bis zur nächsten»

- Beleg: «Er beginnt am Tag der Arbeit und reicht bis zur nächsten.»
- Warum falsch: «Tag der Arbeit» ist im Deutschen der 1. Mai. Ein Laie stolpert darüber (Design-Regeln: einfache Wörter). Das Beispiel endet am 31.03., also am Tag vor der nächsten Arbeit, nicht an ihrem Tag. Wer «bis zur nächsten» wörtlich nimmt, gibt 01.04.{end} ein, und dieser Tag zählt dann doppelt.
- Korrektur: «Er beginnt am Tag, an dem die Arbeit gemacht wird, und endet am Tag vor der nächsten.»

### V-2 (Minor): nächste Arbeit früher oder später als geplant

- Beleg: Der Text geht von einem festen Rhythmus aus («das nächste Mal in 5 Jahren»). Wird nach 3 Jahren wieder entkalkt, laufen zwei Rechnungen 2 Jahre lang gleichzeitig. Wird erst nach 6 Jahren entkalkt, fehlt ein Jahr.
- Warum: Art. 257b Abs. 1 OR (Fedlex): «die tatsächlichen Aufwendungen des Vermieters». Gleichzeitig laufende Teile sind zwar je tatsächliche Aufwendungen, die Verteilung stimmt dann aber nicht mehr mit der Nutzung überein. Wie die Praxis damit umgeht (Rest sofort abrechnen, Leistungszeitraum der alten Rechnung kürzen, sofern noch nicht abgerechnet), habe ich nicht bestätigt.
- Lösung: nicht in diesem Change. Ich schlage ein Issue vor (Labels `fachlich`, `entscheiden`) mit dem Titel «Periodische Kosten: nächste Arbeit früher als der Leistungszeitraum der letzten Rechnung». Mögliche Regel: Der Liegenschaftsverwalter kürzt den Leistungszeitraum der alten Rechnung bis zum Tag vor der neuen Arbeit, sofern die betroffenen Perioden noch nicht abgerechnet sind.

### V-3 (Nit): erstes und letztes Jahr

- Nachgerechnet (Tage inklusive, 01.04.2026–31.03.2031 = 1'826 Tage, mit 29.02.2028): 2026 275 Tage = 75.30; 2027 365 = 99.95; 2028 366 = 100.22; 2029 und 2030 je 99.95; 2031 90 Tage = 24.64.
- Korrektur: «Von CHF 500 zählen so etwa CHF 100 pro Jahr, im ersten und im letzten Jahr weniger.»

### V-4 (Nit, bestand schon vorher): Rundung

- `backend/src/services/invoice.service.ts:516` rundet den Teil jeder Periode auf Rappen. Über alle sechs Perioden ergibt das 75.30 + 99.95 + 100.22 + 99.95 + 99.95 + 24.64 = 500.01, also 1 Rappen mehr als die tatsächlichen Aufwendungen (Art. 257b Abs. 1 OR). Dieser Change führt das Verhalten nicht ein, macht es aber bei Rechnungen über viele Jahre etwas wahrscheinlicher. Wirtschaftlich ist das bedeutungslos. Es reicht, das Verhalten zu kennen, ein Issue braucht es nur, wenn der Product Owner Restausgleich will.

### V-5 (Minor): Upload-Dialog und Bearbeiten-Formular ohne Abdeckung

- Beleg: #254, «Done means»: «Help text at the Leistungszeitraum (invoice form, upload dialog) and on the help page». Der Diff hat Szenarien nur für `invoice-new.feature` (Formular) und `help.feature`. Laut dem Vorschlag erscheint der Text auch im Bearbeiten-Formular und im Upload-Dialog.
- Lösung: Den Upload-Dialog (und das Bearbeiten-Formular) mit einem Szenario oder einem DOM-Test belegen, der den ersten Satz prüft. Sonst kann die Hilfe dort fehlen, ohne dass es auffällt.

### V-6 (Minor, Produktentscheid): `{year}` statt 2026

- Fachlich bestätigt: Mit `{year}` stimmt das Beispiel immer mit den Datumsbeispielen überein («31.12.<aktuelles Jahr>», `src/lib/ui/DateInput.svelte:35`), und genau das entscheidet #250 («The examples use one year»). Mit `{end} = {year} + 5` und dem Ende 31.03. entsteht immer ein gültiges Datum. «etwa CHF 100 pro Jahr» bleibt in jedem Jahr richtig, auch bei 1'827 Tagen, wenn zwei 29. Februare im Zeitraum liegen (z. B. 2027–2032). Heute (2026) liest sich der Text wörtlich wie in #254 entschieden.
- Abweichung: #254 entscheidet «with exactly this example» (01.04.2026 – 31.03.2031). Ab 2027 zeigt der Text andere Jahre. Nach `CLAUDE.md` («any other change to a decided text or value is mine») muss der Product Owner das bestätigen. Andernfalls gehört es in den Pull Request als Abweichung mit Begründung «#250 verlangt ein Jahr». Meine Empfehlung: `{year}` behalten.

### V-7 (Nit, bestand schon vorher): «Geben Sie ihn»

- Beleg: `messages/de.json:721`: «Für welche Zeit gilt die Rechnung? Geben Sie ihn bei Rechnungen …». «ihn» bezieht sich auf das Label, nicht auf den Satz davor.
- Korrektur: «Für welche Zeit gilt die Rechnung? Geben Sie den Leistungszeitraum bei Rechnungen für einen Zeitraum an, zum Beispiel ein Quartal oder ein Jahr. Für das 4. Quartal also 01.10.{year} bis 31.12.{year}, auch wenn die Rechnung erst im Januar kommt. Dann zählen nur die Tage, die in die Abrechnungsperiode fallen. Nicht für Lieferungen von Heizöl, Flüssiggas, Pellets oder Holz: Deren Verbrauch zählt über den Tankbestand des Gebäudes.»

### V-8 (Nit): Länge

- Der Absatz hat 9 Sätze an einem Formularfeld. Vorschlag: Die beiden Sätze zur Rechtslage am Feld als eigenen Absatz absetzen. Auf der Hilfeseite kann der ganze Text bleiben.

## Korrigierter Gesamttext `invoices_service_period_years` (de)

Kosten, die nur alle paar Jahre anfallen, verteilen Sie mit dem Leistungszeitraum über diese Jahre. Er beginnt am Tag, an dem die Arbeit gemacht wird, und endet am Tag vor der nächsten. Ein Beispiel: Der Boiler wird am 01.04.{year} entkalkt, das nächste Mal in 5 Jahren. Geben Sie dann 01.04.{year} bis 31.03.{end} ein. Von CHF 500 zählen so etwa CHF 100 pro Jahr, im ersten und im letzten Jahr weniger. Die Abrechnungen der folgenden Jahre enthalten ihren Teil von selbst. Wer später einzieht, zahlt nur für seine Zeit.

Das Entkalken der zentralen Warmwasseranlage ist umlagefähig (Art. 5 Absatz 2 Bst. e VMWG), wenn der Mietvertrag Warmwasserkosten als Nebenkosten nennt. Bei einem Boiler in der Wohnung ist das umstritten: Verrechnen Sie es nur, wenn der Mietvertrag das Entkalken des Boilers ausdrücklich als Nebenkosten nennt. Im Zweifel ist es nicht umlagefähig.

(Der erste Satz bleibt unverändert, die Szenarien in `help.feature` und `invoice-new.feature` prüfen ihn mit `toContain`.)

## Bestätigt

- **Zahlen des Szenarios** (`statement-generate.feature`, neues Szenario): Grundlage ist das Gebäude «Lindenhof» mit einer Wohnung 3.01. Marc Huber mietet seit 2024-05-01 und hat damit 2026 und 2027 je die ganze Periode, Eva Frei ist 2024 ausgezogen. Ein Mieter allein bedeutet Wohnungsanteil 100 %, die Verwaltungspauschale ist 0 %. 500 × 275/1'826 = 75.301 → 75.30, 500 × 365/1'826 = 99.945 → 99.95 (nachgerechnet). Formel: `inPeriod`, `invoice.service.ts:516`, Regel 1 und 5 in `docs/nebenkostenabrechnung-anforderungen.md`. Der Kommentar von rudini in #254 (75.30 statt 75.27) stimmt.
- **Randfall Mieterwechsel:** Zieht ein Mieter am 01.07.2027 ein, zahlt er 99.95 × 184/365 = 50.39 (Regel 5: Mietstage im Leistungszeitraum der Periode / dessen Tage in der Periode). Der Satz «Wer später einzieht, zahlt nur für seine Zeit» gilt also. Die Tage eines Leerstands trägt der Vermieter.
- **Kategorie «Warmwasser»:** Für das Entkalken einer separaten zentralen Warmwasseranlage ist sie richtig: `UBIQUITOUS_LANGUAGE.md:91` (umlagefähig), `backend/migrations/0002_stammdaten.sql:16` («Kosten für die Aufbereitung von Warmwasser»), keine Heizkosten-Kategorie und deshalb nach Tagen verteilt (`UBIQUITOUS_LANGUAGE.md:82`, Regel 5). Bei einer gemeinsamen Anlage für Heizung und Warmwasser gehört die Rechnung zu «Heizung» (Profil «Heizung + Warmwasser», Anforderungen Z. 131). Für das Szenario ändert das nichts.
- **Mehrjährige Verteilung in der Praxis:** Laut #254 (Orion, «Zulässige und unzulässige Nebenkosten»): «Periodische, d.h. alle paar Jahre anfallende Kosten (Boilerservice), sind jedes Jahr anteilsmässig in Rechnung zu stellen». Das Merkblatt von Rickenbach Engineering (Treffer) bestätigt das: «periodischer Boilerservice (nicht jährlich anfallende Kosten anteilmässig)».
- **Belegeinsicht:** Art. 257b Abs. 2 OR (Fedlex): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Das PDF nennt den ganzen Beleg mit Leistungszeitraum (Regel 5, #241). Der Mieter findet die Rechnung über CHF 500.
- **Begriffe:** Leistungszeitraum, Abrechnungsperiode, Abrechnung bzw. Nebenkostenabrechnung, Mietvertrag, Nebenkosten, umlagefähig, Kategorie, Gebäude und Liegenschaftsverwalter stehen in `UBIQUITOUS_LANGUAGE.md`. «Boiler», «Entkalken» und «Warmwasseranlage» sind Wörter aus Art. 5 Abs. 2 Bst. e VMWG, keine Domänenbegriffe der App. Es fehlen keine Begriffe, ein Issue für Begriffe braucht es nicht.
- **Schreibweise:** Schweizer Rechtschreibung ohne «ß», durchgehend formelles «Sie».

## Nicht bestätigt

- Wie die Praxis eine Rechnung behandelt, deren Leistungszeitraum durch eine frühere neue Arbeit überholt wird (V-2). Gesucht habe ich nicht gezielt. Weder die Anforderungsdokumente noch #254 regeln das.
- Ob eine ausdrückliche Klausel im Mietvertrag das Entkalken eines Wohnungsboilers wirksam zu Nebenkosten macht oder als Unterhalt nach Art. 256 Abs. 2 OR nichtig ist: Ein Gerichtsentscheid fehlt. Belegt ist nur, dass die Frage umstritten ist (Mieterverband, Beobachter, SRF «Espresso»: «gehört das Entkalken eines Boilers nicht zum ‹kleinen Unterhalt›»). Die Aussage gilt deshalb als **unsicher**. Der Text sagt «umstritten» und «im Zweifel nicht», das ist vorsichtig genug.
- Absatznummern von Art. 5 VMWG: aus dem Fedlex-HTML (Filestore, Fassung 20251001; `<sup>1</sup>` vor «Als Heizungs- und Warmwasserkosten …»). Abs. 2 ist der Satz «Darunter fallen insbesondere …». Bestätigt.
- Ob eine Vorschau für die laufende Periode 2026 und die künftige Periode 2027 im E2E-Stack erlaubt ist: In `statement.service.ts` habe ich keine Sperre gefunden. Ausgeführt habe ich das Szenario nicht, es ist ohnehin @wip.
