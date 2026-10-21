# Dr. Weber – Slice 507: Heizkosten beim Mieterwechsel, Detailseite gegen PDF

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300 mit Demodaten. Nichts gespeichert.

Geprüft: Seepark Residenz, Wohnung A2, Abrechnungsperiode 2025:
- Nina Brunner, NK-22222222-2025-0003 (Mietverhältnis 01.07.–31.12.2025, 184 Mietstage)
- Sarah Meier, NK-22222222-2025-0002 (Mietverhältnis 01.01.–30.06.2025, 181 Mietstage)

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungsdetail, Position Heizung | Die Seite zeigt pro Heizrechnung nur das Ergebnis «Anteil nach Heizprofil: 0.00 %/100.00 %». Die Herleitung (Monatsanteile des Heizprofils im Leistungszeitraum, davon die Monate des Mietverhältnisses, Quotient) steht nur im PDF. Ich kann den Prozentwert auf der Seite nicht nachrechnen, bevor ich das PDF öffne. |
| P-2 | Minor | Abrechnungsdetail, Spalte «Zeitanteil» | Bei Heizung steht 43.86 % bzw. 56.14 % statt «184/365 Tage» wie bei allen anderen Positionen. Die Seite erklärt nicht, dass der Zeitanteil bei Heizkosten nach Heizprofil gewichtet ist; das PDF erklärt es in der Fussnote («Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil …»). |
| P-3 | Nit | PDF, Berechnungszeile Heizung | «Ihr Anteil: 1'054.47 × Zeitanteil (1'520.00 × 0.00 % + …) / 4'115.00 = 462.53»: Das Wort «Zeitanteil» mitten in der Formel liest sich wie ein weiterer Faktor. Auf der Detailseite fehlt es («1’054.47 × (…) / 4’115.00»), dort ist die Formel eindeutig. Die beiden Zeilen sind also nicht wörtlich gleich. |
| P-4 | Nit | PDF, Position Heizung | Die vier Leistungszeiträume stehen als ein durchgehender Kleintext-Block ohne Abstand oder Rechnungsbezeichnung; die Seite nennt jede Rechnung («Fernwärme Q1 2025» usw.). Zeilenweises Abgleichen geht nur über den Leistungszeitraum. |

## Beobachtungen

- Die Zahlen stimmen zwischen Seite und PDF in beiden Abrechnungen überein: Kosten des Gebäudes CHF 4'115.00, Wohnungsanteil CHF 1'054.47 (82/320 m²), Zeitanteil 43.86 % (Brunner) bzw. 56.14 % (Meier), Betrag CHF 462.53 bzw. CHF 591.94; je Rechnung dieselben Leistungszeiträume, Beträge und Anteile nach Heizprofil (Brunner: 0 / 0 / 100 / 100 %, Meier: 100 / 100 / 0 / 0 %).
- Nachgerechnet: (395 + 1'410) / 4'115 = 43.86 %, × 1'054.47 = 462.53; (1'520 + 790) / 4'115 = 56.14 %, × 1'054.47 = 591.94. Die Summe beider Mieter ist 1'054.47, also genau der Wohnungsanteil – beim Mieterwechsel geht nichts verloren und nichts wird doppelt verrechnet.
- Monatsanteile im PDF: Jan 13.60, Feb 12.10, Mär 11.50, Apr 9.30, Mai 5.60, Jun 3.70, Jul 3.70, Aug 3.60, Sep 3.70, Okt 9.50, Nov 10.70, Dez 13.00 = 100.00 %. Die Teilsummen pro Quartal (37.20 / 18.60 / 11.00 / 33.20 %) stimmen.
- Methodisch: Gewichtet wird pro Rechnung (Rechnungsbetrag × Anteil der Mietmonate im Leistungszeitraum), nicht mit dem Jahresprofil. Nach Jahresprofil hätte Frau Brunner 44.20 % statt 43.86 %. Das ist vertretbar, weil die Rechnungen quartalsweise kommen, sollte aber einem Mieter, der nachfragt, erklärt werden können; das PDF tut das in der Fussnote.
- Auf der Detailseite steht «Heizprofil: Heizung + Warmwasser» unten im Summenblock nach Allgemeinstrom, getrennt von der Position Heizung; im PDF steht es im eigenen Abschnitt «Heiz- und Warmwasserkosten».
- Die Rechnungsnamen auf der Seite sind Links zur Rechnung (z. B. «Fernwärme Q1 2025» → /invoices/…), praktisch für die Belegprüfung.
- Die Spalte «Anteil» (11.24 % bzw. 14.38 %) gibt es nur auf der Seite, nicht im PDF.
- PDF-Hinweise nennen Art. 257b Abs. 2 OR (Belegeinsicht) und Art. 8 Abs. 1 VMWG (detaillierte Heizkostenabrechnung) – richtig gewählt.
- Frau Meier bekommt das PDF an ihre neue Adresse (Hirschmattstrasse 21), Frau Brunner an Seeweg 15.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 8 Schritte (Übersicht → Nebenkostenabrechnungen → Detail Brunner → PDF Brunner → Abgleich → Detail Meier → PDF Meier → Abgleich und Nachrechnen).

## Ablauf

1. Übersicht geöffnet. Erwartet: Weg zu den Abrechnungen. Gesehen: «7 Entwurf» und Navigation «Nebenkostenabrechnungen». Passt.
2. Liste der Abrechnungen. Erwartet: beide Abrechnungen der Wohnung A2 erkennbar. Gesehen: Nina Brunner 01.07.–31.12.2025, 184 Mietstage, Rückerstattung CHF 97.55; Sarah Meier 01.01.–30.06.2025, 181 Mietstage, Nachzahlung CHF 141.60. Klar.
3. Detail Brunner (Screenshot 03-detail-brunner.png). Erwartet: Bei Heizung eine Begründung, warum sie im Sommer einzieht und trotzdem 43.86 % trägt. Gesehen: vier Fernwärme-Rechnungen mit Leistungszeitraum, Betrag und «Anteil nach Heizprofil», darunter die Formel mit Ergebnis 462.53. Die Formel kann ich nachrechnen, die Prozentwerte 0 % / 100 % sind plausibel, aber nicht hergeleitet (P-1). Der Zeitanteil 43.86 % ist auf der Seite nicht erklärt (P-2).
4. PDF Brunner heruntergeladen (NK-22222222-2025-0003.pdf, 2 Seiten). Erwartet: dieselben Werte. Gesehen: dieselben Werte, zusätzlich Monatsanteile des Heizprofils und die Quotienten «11.00 % / 11.00 % = 100.00 %», Fussnote zum Zeitanteil bei Heizkosten. Formelzeile enthält das Wort «Zeitanteil» (P-3). Block eng gesetzt, ohne Rechnungsnamen (P-4).
5. Zeilenweiser Abgleich Brunner: Kosten, Wohnungsanteil, Zeitanteil, Betrag, alle vier Leistungszeiträume, Beträge und Anteile identisch.
6. Detail Meier. Erwartet: das Spiegelbild. Gesehen: Q1/Q2 100 %, Q3/Q4 0 %, Zeitanteil 56.14 %, CHF 591.94.
7. PDF Meier: identische Werte und Herleitung, Monate Jan–Jun als «Monate Ihres Mietverhältnisses».
8. Nachgerechnet (siehe Beobachtungen): alles stimmt, Summe beider Anteile = Wohnungsanteil.

## Verwirrung

- «Zeitanteil» bedeutet bei Heizung etwas anderes als bei den übrigen Positionen (gewichtet statt Tage); auf der Seite ohne Hinweis.
- «Anteil nach Heizprofil» auf der Seite: Anteil wovon? Erst das PDF zeigt, dass es der Anteil der Mietmonate am Profilgewicht des Leistungszeitraums ist.
- «Anteile der Monate Ihres Mietverhältnisses darin: keine» – verständlich, aber holprig.

## Fehlerrisiken

- Ein Vermieter, der nur die Seite prüft, kann 0 % / 100 % nicht kontrollieren und verlässt sich blind darauf; bei einem Wechsel mitten im Monat oder einem Leistungszeitraum über den Wechsel hinweg wäre der Wert nicht mehr offensichtlich.
- Wer «Zeitanteil» in der PDF-Formel als zusätzlichen Faktor liest, rechnet 1'054.47 × 43.86 % × 43.86 % und hält das Ergebnis für falsch.

## Vorschläge

- **P-1:** Statements → Nina Brunner → Position Heizung. Unter jeder Rechnung dieselbe Herleitung wie im PDF zeigen (Monatsanteile im Leistungszeitraum, davon im Mietverhältnis, Quotient), mindestens für Rechnungen, deren Anteil weder 0 % noch 100 % ist.
- **P-2:** Gleiche Seite, Spalte «Zeitanteil» bei Heizung. Sichtbaren Hilfetext unter der Tabelle oder an der Position, sinngemäss die PDF-Fussnote: «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.»
- **P-3:** PDF herunterladen → Position Heizung, letzte Zeile. «Zeitanteil» aus der Formel nehmen oder als «Zeitanteil = (…) / 4'115.00» schreiben, damit Seite und PDF gleich lauten.
- **P-4:** PDF → Position Heizung. Rechnungsbezeichnung voranstellen oder je Rechnung einen kleinen Abstand setzen.

## Nicht geprüft

- Wechsel mitten im Monat oder ein Leistungszeitraum über den Wechsel hinweg (Anteil zwischen 0 und 100 %): kommt in den Demodaten von A2 nicht vor; ohne Speichern nicht herstellbar.
- Der Fall «Monate im Heizprofil zusammen 0 %» (Rückfall auf Mietstage), den die PDF-Fussnote nennt: in diesen Daten nicht vorhanden.
- Andere Sprachen als Deutsch, Darstellung des PDFs in einem echten PDF-Betrachter (nur Text extrahiert und Seiten als Bild gerendert).
