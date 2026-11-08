# Dr. Weber – Review #707 (Demodaten korrigiert)

Desktop 1440 × 900, Maus, Zoom 100 %. Nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/357df375-575f-5bf7-9a62-5d4a4f57a152/scratchpad/weber-707/`.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungsdetail (NK-22222222-2024-0001 und NK-22222222-2025-0001) | Die Gartenpflege-Rechnung erscheint mit CHF 368.00 bzw. CHF 362.00 statt mit ihrem Rechnungsbetrag CHF 730.00, und der Zeitanteil lautet «184/184 Tage» bzw. «181/181 Tage». Auf dem Bildschirm steht nirgends, dass das der Teil der Rechnung ist, der in die Abrechnungsperiode fällt, und von welchem Gesamtbetrag. Die Erklärung («eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen») steht nur im PDF. Ich musste nachrechnen (730 / 365 Tage × 184 = 368), um die Aufteilung zu verstehen. |
| P-2 | Minor | Rechnungsdetail Grünwerk Gartenbau GmbH | «Erfasst 07.11.2026, 19:51» und «Zuletzt geändert 07.11.2026», aber die Rechnung steckt in den 2024er-Abrechnungen, die laut Verlauf am 14.04.2025 erstellt wurden. Eine Rechnung, die erst eineinhalb Jahre nach der Abrechnung erfasst wurde, die sie enthält: Diese Zeitfolge kann nicht stimmen. Sie passt nicht zu den korrigierten Daten im Verlauf. |

## Beobachtungen

- Rechnungsliste: Eine Zeile zeigt nur das Rechnungsdatum, nicht den Leistungszeitraum. Bei Grünwerk steht er zum Glück in der Beschreibung («07/2024–06/2025»). Der Jahresfilter heisst richtig «Jahr des Rechnungsdatums». Mit «2025» würde ich diese Rechnung, die zur Hälfte 2025 betrifft, aber nicht finden.
- Rechnungsdetail: Unter «In Abrechnungen enthalten» stehen sieben Abrechnungen mit Nummer und Status, aber ohne den Betrag, den jede davon trägt. Für die Mieterversammlung hätte ich gern hier schon «2024: CHF 368.00, 2025: CHF 362.00» gesehen. Die Reihenfolge der Liste ist gemischt (2025-0004 … 2025-0001, dann 2024-0002, 2024-0001, 2024-0003).
- Rechnungsdetail: Der Hilfetext «Nur die Tage in der Abrechnungsperiode zählen.» beim Leistungszeitraum ist hilfreich, und das Nachrechnen ging auf: 368 + 362 = 730, 184 + 181 = 365 Tage, je CHF 2.00 pro Tag. Anteil Wohnung A1 21.25 % (68 / 320 m²): 78.20 und 76.93 stimmen.
- In der Abrechnung 2024 steht die Gartenpflege als letzte Position, in der Abrechnung 2025 als erste. Warum die Reihenfolge wechselt, ist nicht ersichtlich.
- Verlauf bei Musterhaus Zentrum 2024 (0001 Hans Müller, 0002 Anna Schmidt, 0003 Pierre Dubois, 0004 Maria Rossi), überall gleich: Erstellt 14.04.2025, 10:00 → PDF erstellt 14.04.2025, 10:00 → Versendet 14.04.2025 → Bezahlt 05.05.2025. Die Reihenfolge ergibt Sinn, bezahlt wurde vor der Frist vom 14.05.2025. «Versendet» und «Bezahlt» stehen ohne Uhrzeit, die beiden ersten Einträge mit Uhrzeit. Der Verlauf sagt nicht, auf welchem Weg versendet wurde (bei Hans Müller 2025 gibt es «Erneut per Brief zustellen», der Verlauf zeigt aber nur «Versendet»).
- Bei einer Rückerstattung (Pierre Dubois, Anna Schmidt) lauten Status und Verlauf «Bezahlt», mit «Bezahlt am 05.05.2025». Gemeint ist wohl, dass ich als Vermieter zurückerstattet habe. Das Wort «Bezahlt» lässt offen, wer bezahlt hat.
- Hans Müller 2025: Abrechnungsdatum 28.09.2026, Frist 28.10.2026, überfällig. Der Verlauf endet bei «Versendet 28.09.2026», das passt.
- Die Abrechnungsliste ist weder nach Jahr noch nach Gebäude durchgehend sortiert (Seite 1 endet mit Müller 2024 und Meier 2024, Seite 2 beginnt mit Alpenblick 2024).
- Kopf von Rechnungs-, Abrechnungs- und Wohnungsdetail: Der Name steht zweimal untereinander, einmal als letztes Glied der Brotkrumen-Navigation und einmal als Überschrift. Visuell ist das klar getrennt und stört nicht.
- Alpenblick: Wohnungen 0.01 (EG), 1.01 (1. OG), 2.01 (2. OG) heissen in der Gebäudeansicht, der Wohnungsliste, der Brotkrumen-Navigation, der Überschrift und dem Seitentitel («Wohnung 0.01, Alpenblick - Dwello») gleich, ohne Doppelung wie «Wohnung Wohnung». Die Stockwerksangabe steht separat. Klar.
- Wohnungsliste: Musterhaus Zentrum, Wohnung 1.01 zeigt «Auszug von Kevin Fischer am 28.02.2021, Schlussabrechnung fällig». Das ist über fünf Jahre her. Kevin Fischer wohnt seit 01.05.2021 im Alpenblick 1.01, das ist plausibel. Dass die Schlussabrechnung so lange offen ist, würde ich an der Versammlung nicht gern erklären müssen. Die Übersicht nennt Musterhaus 2018 bis 2023 ohnehin als nicht abgerechnet.
- Rechnungsfilter: Beim ersten Versuch habe ich Gebäude und Kategorie gleich nach dem Laden gewählt und «Suchen» geklickt. Die Liste blieb ungefiltert (Adresse `/invoices?`). Beim zweiten Versuch, nach vollständigem Laden, ging es. Ein schneller Nutzer könnte meinen, der Filter wirke nicht.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 30 Schritte (Navigation, Filter, 2 Rechnungs-/Abrechnungsdetails für Seepark, 5 Abrechnungen Musterhaus, Gebäude Alpenblick, Wohnungsliste, 3 Wohnungsseiten, ein PDF).

## Ablauf

- Rechnungen filtern (Seepark Residenz, Gartenpflege), erster Versuch. Erwartet: eine gefilterte Liste. Gesehen: dieselbe ungefilterte Liste mit 84 Rechnungen. Der zweite Versuch nach vollständigem Laden zeigte die eine Rechnung.
- Abrechnung 2024 Thomas Weber, Zeile Gartenpflege. Erwartet: CHF 730.00 Rechnungsbetrag mit Hinweis auf den anteiligen Zeitraum. Gesehen: «Kosten des Gebäudes CHF 368.00», darunter die Rechnung ebenfalls mit CHF 368.00, Zeitanteil «184/184 Tage», keine Erklärung auf dem Bildschirm (Screenshot 05-NK-22222222-2024-0001.png).
- Rechnungsdetail Grünwerk. Erwartet: ein Erfassungsdatum vor April 2025. Gesehen: «Erfasst 07.11.2026, 19:51» (Screenshot 04-rechnung.png).

## Vorschläge

- **P-1:** Rechnungen → Gebäude «Seepark Residenz», Kategorie «Gartenpflege» → Suchen → «Grünwerk Gartenbau GmbH» → «NK-22222222-2024-0001, Bezahlt», Zeile Gartenpflege ansehen. Hilfreich wäre bei einer Rechnung mit Leistungszeitraum unter der Position etwa «CHF 368.00 von CHF 730.00 (184 von 365 Tagen des Leistungszeitraums 01.07.2024–30.06.2025)». Dazu dieselbe Legende wie im PDF («eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen») auch auf dem Bildschirm. Im Rechnungsdetail bei «In Abrechnungen enthalten» der Betrag je Abrechnung.
- **P-2:** Dieselbe Rechnung öffnen, «Erfasst» lesen und mit dem Verlauf von NK-22222222-2024-0001 vergleichen («Erstellt 14.04.2025»). Hilfreich wäre, wenn die Demodaten «Erfasst» und «Zuletzt geändert» einer Rechnung vor die erste Abrechnung legen, die sie enthält, etwa auf das Rechnungsdatum oder kurz danach.

## Nicht geprüft

- Die PDFs der Musterhaus-Abrechnungen und die PDF-Gestaltung insgesamt: Aufgabe 2 betraf nur den Verlauf auf dem Bildschirm. Nur beim PDF NK-22222222-2024-0001 habe ich die Gartenpflege-Zeile und die Legende gelesen.
- Die 2025er-Abrechnungen der übrigen Seepark-Mieter (Nina Brunner, Sarah Meier mit Teilperioden): Die Aufgabe verlangte einen Mieter.
- Speichern, Neu berechnen, Zahlung zurücksetzen: Die Aufgabe sah kein Speichern vor.
