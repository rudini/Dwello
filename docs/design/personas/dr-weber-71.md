# Dr. Weber – Heizkosten bei Mieterwechsel (Seepark Residenz, Wohnung A2)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Nur angesehen, nichts gespeichert.
Aufgabe: Die Entwürfe 2025 von Sarah Meier (bis 30.06.2025) und Nina Brunner (ab 01.07.2025) öffnen, ihre PDFs (Deutsch) erstellen und herunterladen, den Heizkostenanteil allein aus dem PDF nachrechnen, die beiden Anteile zusammen prüfen; Ninas PDF auf Französisch, falls ohne Speichern möglich.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/80f6c78d-4176-5c5e-b0cf-a0f1691f2996/scratchpad/dr-weber-71/` (PDFs und Textauszüge in `pdf/`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | PDF, Position Heizung (beide Abrechnungen) | Die Rechnung lässt sich nachrechnen, das Ergebnis ist aber nicht plausibel: Sarah Meier trägt 36.68 % der Heizkosten der Wohnung, obwohl ihre Monate im Heizprofil 55.80 % ausmachen; Nina Brunner trägt 63.32 % statt 44.20 %. Grund: die Rechnungen ohne Leistungszeitraum werden nach dem ganzen Jahresprofil verteilt, als enthielten sie Oktober bis Dezember, und die Rechnung Okt–Dez geht zusätzlich ganz an Nina. Die Wintermonate Okt–Dez zählen für Nina damit doppelt. |
| P-2 | Minor | PDF, Zeilen unter Heizung | Die Rechnungen «Ohne Leistungszeitraum» stehen nur mit ihrem Betrag da (CHF 1'520.00, 790.00, 395.00), ohne Beschreibung, Rechnungsdatum oder Nummer. Als Mieterin kann ich nicht erkennen, dass CHF 1'520.00 «Fernwärme Q1 2025» ist, und weiss nicht, welchen Zeitraum die Abrechnung bei «ohne Leistungszeitraum» annimmt (offenbar die ganze Abrechnungsperiode). |
| P-3 | Minor | PDF, Erklärung unter der Kostentabelle | Der letzte Satz lässt sich kaum lesen: «… bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin, haben sie dort zusammen 0 %, Ihre Mietstage darin.» Es fehlt das Verb des zweiten Teils («… zählen stattdessen Ihre Mietstage darin»). |
| P-4 | Nit | PDF, «Heiz- und Warmwasserkosten» | Die Liste «Anteile der Monate Ihres Mietverhältnisses» steht ohne Summe da; die 55.80 % bzw. 44.20 % stehen im Satz davor, ohne Hinweis, dass sie die Summe dieser Monate sind. Das ganze Heizprofil (alle 12 Monate, zusammen 100 %) ist nicht abgedruckt; ich kann also nicht prüfen, ob meine Monate auf 100 % bezogen sind. |

## Beobachtungen

- In der App (Seite der Abrechnung, Zeile Heizung) steht der Anteil als «9.4 %» (Meier) bzw. «16.23 %» (Brunner) der Gebäudekosten; die anderen Zeilen zeigen zwei Nachkommastellen («12.71 %»). Das PDF zeigt dagegen den Zeitanteil 36.68 % / 63.32 % der Wohnungskosten. Zwei verschiedene Prozentwerte für dieselbe Position, ohne Erklärung auf der App-Seite; dort steht unter der Tabelle nur «Heizprofil: Heizung + Warmwasser».
- Die App weist den Vermieter nirgends darauf hin, dass drei von vier Heizrechnungen 2025 keinen Leistungszeitraum haben, obwohl in der Wohnung A2 ein Mieterwechsel stattfand. Bei den Rechnungen Q1–Q3 zeigt die Detailseite gar kein Feld «Leistungszeitraum» an, nur bei Q4.
- Die Rechenzeilen unter Heizung und die Erklärung unter der Tabelle sind im PDF sehr klein und hellgrau gedruckt (Screenshot `pdf/brunner-1.png`); ausgedruckt dürfte das schwer lesbar sein.
- Die Fernwärme Q4 2024 (Rechnungsdatum 20.01.2025, Leistungszeitraum 01.10.–31.12.2024) ist korrekt nicht in den Kosten 2025 enthalten: CHF 4'115.00 = 1'520 + 790 + 395 + 1'410.
- Sarah Meiers PDF geht an ihre neue Adresse (Hirschmattstrasse 21), Nina Brunners an die Wohnung; Meier bekommt keinen Zahlteil (Rückerstattung), Brunner einen QR-Zahlteil über CHF 113.80. Stimmig.
- Hinweis auf Art. 8 Abs. 1 VMWG (detaillierte Heizkostenabrechnung) und Art. 257b Abs. 2 OR (Belegeinsicht) ist vorhanden.

## Aufgabe geschafft: teilweise

Beide PDFs erstellt, heruntergeladen und nachgerechnet; die französische Fassung konnte ich nicht ansehen, ohne zu speichern (siehe «Nicht geprüft»).

## Aufwand

Etwa 15 Minuten, 8 Durchgänge im Browser (Übersicht, Entwürfe, Rechnungen, 5 Rechnungsdetails, Heizprofile, Gebäude, 2 Abrechnungen, 2 Downloads, Mieterseite).

## Ablauf

1. **Übersicht → «Entwürfe ansehen».** Erwartet: die Entwürfe 2025. Gesehen: 7 Entwürfe, darunter Sarah Meier (NK-22222222-2025-0002, 181 Mietstage, Rückerstattung CHF 69.70) und Nina Brunner (NK-22222222-2025-0003, 184 Mietstage, Nachzahlung CHF 113.80). 181 + 184 = 365, passt.
2. **Rechnungen, Filter Seepark Residenz + Heizung.** Erwartet: die Heizrechnungen 2025. Gesehen: Fernwärme Q1 CHF 1'520.00 (31.03.2025), Q2 CHF 790.00 (30.06.2025), Q3 CHF 395.00 (30.09.2025), Q4 CHF 1'410.00 (Rechnungsdatum 20.01.2026, Leistungszeitraum 01.10.2025 – 31.12.2025). Nur Q4 hat einen Leistungszeitraum.
3. **Einstellungen → Heizprofile.** «Heizung + Warmwasser»: Jan 13.6, Feb 12.1, Mär 11.5, Apr 9.3, Mai 5.6, Jun 3.7, Jul 3.7, Aug 3.6, Sep 3.7, Okt 9.5, Nov 10.7, Dez 13.0 % (Summe 100 %). Jan–Jun = 55.8 %, Jul–Dez = 44.2 %, Okt–Dez = 33.2 %.
4. **Gebäude Seepark Residenz.** Flächen A1 68, A2 82, B1 75, B2 95 m² = 320 m². A2 = 25.625 %.
5. **Abrechnung Sarah Meier öffnen.** Erwartet: Heizung mit Heizprofil. Gesehen: Heizung, Pro Fläche, CHF 4'115.00, Anteil «9.4 %», CHF 386.78; darunter «Heizprofil: Heizung + Warmwasser». Keine Aufschlüsselung auf der Seite.
6. **«PDF herunterladen» (Meier).** Erwartet: PDF wird erstellt und geladen. Gesehen: Download `NK-22222222-2025-0002.pdf`, 2 Seiten, Deutsch.
7. **Nachrechnen Meier, nur aus dem PDF.** Wohnungsanteil 4'115.00 × 82/320 = 1'054.47 (gedruckt 1'054.47). Zeilen: 1'520 × 55.80 % = 848.16; 790 × 55.80 % = 440.82; 395 × 55.80 % = 220.41; 1'410 × 0.00 % = 0 (Okt–Dez 33.20 %, ihre Monate darin keine). Summe 1'509.39 / 4'115.00 = 36.68 %; × 1'054.47 = **386.78**. Stimmt mit dem PDF überein. Die 55.80 % finde ich in «Heiz- und Warmwasserkosten» als Summe Jan–Jun wieder.
8. **Abrechnung Nina Brunner öffnen und PDF laden.** Seite: Heizung «16.23 %», CHF 667.69. Download `NK-22222222-2025-0003.pdf`, 2 Seiten mit QR-Zahlteil.
9. **Nachrechnen Brunner.** 1'520 × 44.20 % = 671.84; 790 × 44.20 % = 349.18; 395 × 44.20 % = 174.59; 1'410 × 100.00 % (33.20 % / 33.20 %) = 1'410.00. Summe 2'605.61 / 4'115.00 = 63.32 %; × 1'054.47 = **667.69**. Stimmt.
10. **Beide zusammen.** 386.78 + 667.69 = 1'054.47 = Wohnungsanteil, 36.68 % + 63.32 % = 100 %. Formal vollständig verteilt. Aber: Nach Heizprofil hätte Meier 55.80 % zu tragen (≈ CHF 588.39), Brunner 44.20 % (≈ CHF 466.08). Rechnete man stattdessen jede Rechnung nach ihrem echten Quartal, käme Meier auf Q1 + Q2 = (1'520 + 790) × 25.625 % ≈ CHF 591.94. Beide üblichen Lesarten liegen bei rund CHF 590 für Meier; die Abrechnung ergibt CHF 386.78. Als Nina Brunner würde ich die rund CHF 200 Mehrbelastung beanstanden (P-1).
11. **Französisch.** Erwartet: eine Sprachwahl beim PDF. Gesehen: keine auf der Abrechnung; die Sprache steht auf der Mieterseite («Sprache für Abrechnung und Mahnungen: Deutsch») und liesse sich nur durch Bearbeiten und Speichern ändern. Übersprungen.

## Verwirrung

- «Ohne Leistungszeitraum»: Als Mieterin verstehe ich nicht, für welchen Zeitraum so eine Rechnung dann gilt. Erst aus den 55.80 % schliesse ich, dass das ganze Jahr gemeint ist.
- «Anteil nach Heizprofil» heisst in den Zeilen einmal der Prozentsatz meiner Monate (55.80 %), einmal ein Verhältnis («0.00 % / 33.20 % = 0.00 %»). Nachvollziehbar, aber man muss zweimal lesen.
- «Zeitanteil» ist bei Heizung ein Prozentwert, bei allen anderen Positionen «181/365 Tage». Die Erklärung sagt das, aber erst im letzten, schwer lesbaren Satz (P-3).
- In der App ist der Heizanteil 9.4 %, im PDF 36.68 %: zwei Zahlen, zwei Bezugsgrössen (Gebäude vs. Wohnung), nirgends erklärt.

## Fehlerrisiken

- Ein Vermieter erfasst Quartalsrechnungen ohne Leistungszeitraum und nur die letzte mit; bei einem Mieterwechsel verschiebt das stillschweigend Heizkosten vom ausgezogenen zum neuen Mieter (hier rund CHF 200). Die App warnt nicht.
- Der Mieter kann aus dem PDF nicht erkennen, welche Rechnung welche ist (P-2), und muss für jede Rückfrage die Belege anfordern.
- Wer die kleine graue Schrift ausdruckt, liest die Rechenzeilen womöglich gar nicht.

## Vorschläge

- **P-1:** Reproduktion: Seepark Residenz, Abrechnungen 2025 von Sarah Meier und Nina Brunner öffnen, PDFs laden, Zeile Heizung: Zeitanteil 36.68 % / 63.32 % gegenüber Heizprofil 55.80 % / 44.20 %. Hilfreich: fachlich klären lassen (fach-reviewer), wie Rechnungen ohne Leistungszeitraum neben Rechnungen mit Leistungszeitraum derselben Position verteilt werden, etwa die Rechnungen ohne Leistungszeitraum nur über die Monate verteilen, die keine Rechnung mit Leistungszeitraum abdeckt, oder den Vermieter vor dem Erstellen warnen, wenn bei einem Mieterwechsel Heizrechnungen ohne Leistungszeitraum vorliegen.
- **P-2:** Reproduktion: eines der beiden PDFs, Zeilen «Ohne Leistungszeitraum: CHF …». Hilfreich: Beschreibung und Rechnungsdatum der Rechnung in die Zeile («Fernwärme Q1 2025, 31.03.2025: CHF 1'520.00 …») und einmal sagen, dass eine Rechnung ohne Leistungszeitraum für die ganze Abrechnungsperiode gilt.
- **P-3:** Reproduktion: PDF, Absatz unter der Kostentabelle, letzter Satz. Hilfreich: «Haben diese Monate im Heizprofil zusammen 0 %, zählen stattdessen Ihre Mietstage darin.»
- **P-4:** Reproduktion: PDF, Abschnitt «Heiz- und Warmwasserkosten». Hilfreich: «…; zusammen 55.80 %» an die Monatsliste anhängen, und das ganze Profil (12 Monate, 100 %) einmal abdrucken.

## Nicht geprüft

- Französisches PDF von Nina Brunner: die Sprache lässt sich nur auf der Mieterseite durch Speichern ändern; ich sollte nichts speichern.
- Eine Heizrechnung, deren Leistungszeitraum über die Periodengrenze reicht, oder ein Profil mit 0 % in den betroffenen Monaten (der Fall «Ihre Mietstage darin»): in den Demo-Daten dieses Gebäudes nicht vorhanden.
- Beträge im Einzelnen über die Heizung hinaus (Sache des daten-pruefer); nur stichprobenartig Hauswart 784.13 × 181/365 = 388.84 und 184/365 = 395.29 geprüft, stimmt.
