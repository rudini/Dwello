# Dr. Weber – Slice 509: Abschnitt «Heiz- und Warmwasserkosten» im PDF

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 mit Demodaten. Nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/dr-weber-509/`.

Geprüft: NK-22222222-2025-0003 (Nina Brunner, Seepark Residenz, Wohnung A2, 01.07.–31.12.2025) und als zweite Abrechnung NK-22222222-2025-0002 (Sarah Meier, dieselbe Wohnung, 01.01.–30.06.2025). Zum Vergleich habe ich auch die Heizabschnitte mit Tankbestand gelesen (NK-11111111-2025-0001 Hans Müller, NK-33333333-2024-0002 Kevin Fischer).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Abschnitt «Heiz- und Warmwasserkosten» | «ihr Anteil steht unter der Abrechnungsposition»: Das kleingeschriebene «ihr» meint den Anteil der Monate. Ich habe es zuerst als «Ihr Anteil» gelesen, also meinen Anteil, der in der Tabelle genauso heisst. Der Satz nennt die Position («Heizung») nicht, und auch nicht, dass sie auf Seite 1 steht, während der Abschnitt auf Seite 2 steht. |
| P-2 | Minor | PDF, Heizposition und Abschnitt | Wer die Heizprofil-Anteile der eigenen Monate zusammenzählt, kommt bei Nina Brunner auf 11.00 % + 33.20 % = 44.20 %. In der Spalte Zeitanteil stehen aber 43.86 %, bei Sarah Meier 56.14 % statt 55.80 %. Der Grund: Die Rechnungen werden mit ihren Beträgen gewichtet. Das sieht man nur in der Rechenzeile, weder der Abschnitt noch die Legende sagen es. Für mich sah das zuerst wie ein Widerspruch aus. |
| P-3 | Nit | PDF, Rechenzeile unter «Heizung» | «1'054.47 × Zeitanteil (1'520.00 × 0.00 % + … ) / 4'115.00»: Das Wort «Zeitanteil» steht vor der Klammer. So wirkt der Klammerausdruck schon wie der Zeitanteil, dabei ist es erst der Bruch mit «/ 4'115.00». |
| P-4 | Nit | PDF, Abschnitt «Heiz- und Warmwasserkosten» | Der Abschnitt verwendet «Heizprofil», ohne es zu erklären. Der gute Satz von der Seite Heizprofile fehlt hier: «Verteilt die Heizkosten in Prozent auf die 12 Monate … im Winter wird mehr geheizt als im Sommer». Ausserdem nennt der Abschnitt Warmwasser im Titel, aber das PDF sagt nirgends, dass das Warmwasser in der Position «Heizung» enthalten ist. |

## Beobachtungen

- Alle Zahlen stimmen, siehe «Ablauf». Bei Nina Brunner und Sarah Meier gilt: Die Summe der vier Rechnungen ergibt die Kosten des Gebäudes (1'520 + 790 + 395 + 1'410 = 4'115.00), die Monatsanteile ergeben zusammen genau 100 %, und die beiden Heizanteile zusammen ergeben den Wohnungsanteil (462.53 + 591.94 = 1'054.47). Die Monatswerte im PDF entsprechen dem Heizprofil «Heizung + Warmwasser» unter Einstellungen › Heizprofile.
- Die Detailseite der Abrechnung (Ansicht Vermieter) beschreibt die Heizrechnungen anders als das PDF. Dort steht «Leistungszeitraum 01.01.2025 – 31.03.2025: CHF 1'520.00, Ihre Mietstage 0 von 90 Tagen», also Mietstage. Im PDF stehen dagegen die Monate des Heizprofils, und gerechnet wird mit dem Heizprofil. Hier ergibt beides dasselbe, weil die Mietverhältnisse genau an Quartalsgrenzen beginnen und enden. Bei einem Einzug mitten im Monat würde die Seite Tage zeigen, während mit Monatsanteilen gerechnet wird. Das konnte ich mit den Demodaten nicht zeigen.
- In der Spalte «Anteil» der Detailseite stehen bei Heizung 11.24 % (Anteil an den Kosten des Gebäudes). Im PDF gibt es diese Spalte nicht. Das ist kein Widerspruch, aber noch eine Prozentzahl mehr.
- In den Abrechnungen über die ganze Periode (Thomas Weber, A1) gibt es keinen Abschnitt zu den Heizkosten, nur den Hinweis zu Art. 8 Abs. 1 VMWG. Das ist folgerichtig.
- Die Abschnitte mit Tankbestand (Hans Müller, Kevin Fischer) rechnen richtig. Hans Müller: 2'650.00 + 6'565.00 − 2'257.20 = 6'957.80, mit dem Schlüssel 70 % × 75.50/492.50 + 30 % × 1/6 = 15.731 % ergibt das 1'094.53. Kevin Fischer: 1'536 + 5'120 − 1'792 = 4'864.00, mit 98/255 ergibt das 1'869.30. Diese Abschnitte erklären nur die Kosten des Gebäudes, nicht meinen Anteil. Der folgt aus der Tabelle, und das reicht.
- Auf der Detailseite von Hans Müller steht «Heizprofil: Heizung Mittelland (nicht angewendet: Mietvertrag über die ganze Periode)». Das ist klar. Im PDF fehlt der Satz, was aber nicht stört.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, rund 12 Schritte: Übersicht, Abrechnungsliste, Detailseite, PDF geladen und gelesen, alles nachgerechnet, zweite Abrechnung, Heizprofile, Vergleich mit den Tank-Abrechnungen.

## Ablauf

1. **Übersicht → «Nebenkostenabrechnungen».** Erwartet: eine Liste mit Nina Brunner. Gesehen: «Nina Brunner, NK-22222222-2025-0003, Seepark Residenz, Wohnung A2, 01.01.2025 – 31.12.2025, 184 Mietstage, Rückerstattung CHF 97.55, Entwurf, PDF». Gut.
2. **Detailseite geöffnet** (Screenshot `03-nina-detail.png`). Erwartet: Positionen mit den Rechnungen. Gesehen: «Heizung» mit vier Rechnungen «Fernwärme Q1–Q4 2025», jeweils mit «Ihre Mietstage x von y Tagen», darunter die Rechenzeile und der Eintrag «Heizprofil: Heizung + Warmwasser».
3. **PDF geladen** (2 Seiten, `nina-p-1.png`, `nina-p-2.png`). Seite 1: Kopf mit der Mietdauer «01.07.2025 – 31.12.2025 (184 Mietstage von 365 Tagen)», Kasten «Rückerstattung CHF 97.55», Tabelle. Unter «Heizung» steht pro Rechnung ein Absatz, zum Beispiel «Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 395.00, Anteile der Monate im Heizprofil: Jul 3.70 %, Aug 3.60 %, Sep 3.70 %; zusammen 11.00 %. Anteile der Monate Ihres Mietverhältnisses darin: …; zusammen 11.00 %. Anteil nach Heizprofil: 11.00 % / 11.00 % = 100.00 %». Am Schluss steht die Zeile «Ihr Anteil: … = 462.53». Seite 2: Summen, Legende, Abschnitt «Heiz- und Warmwasserkosten», Hinweise.
4. **Abschnitt gelesen.** Erwartet: eine Erklärung, wie mein Heizanteil zustande kommt. Gesehen: «Heizkosten nach Heizprofil «Heizung + Warmwasser»: Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils darin; ihr Anteil steht unter der Abrechnungsposition.» Der Abschnitt verweist also auf Seite 1, rechnet selbst aber nichts vor. Beim «ihr Anteil» bin ich hängen geblieben (P-1).
5. **Nachgerechnet, Heizung Nina Brunner.** Wohnungsanteil: 4'115.00 × 82/320 = 1'054.47 (genau 1'054.46875), stimmt. Monate: Q1 37.20 %, Q2 18.60 %, Q3 11.00 %, Q4 33.20 %, zusammen 100 %, stimmt mit dem Heizprofil in den Einstellungen überein. Anteil nach Heizprofil: 0 / 0 / 100 / 100 %, stimmt. Zeitanteil: (395 + 1'410) / 4'115 = 43.86 %, stimmt. Ihr Anteil: 1'054.47 × 1'805/4'115 = 462.53, stimmt. Zuerst hatte ich 11 % + 33.2 % = 44.2 % gerechnet und eine Abweichung erwartet (P-2).
6. **Übrige Zahlen Nina Brunner.** TV 228.00 × 184/365 = 114.94; Kaltwasser 527.88 → 266.11; Hauswart 784.13 → 395.29; Allgemeinstrom 127.95 → 64.50. Zwischensumme 1'303.37, 3 % = 39.10, Nebenkosten 1'342.47, Akonto 6 × 240 = 1'440.00, Differenz 97.53, gerundet 97.55. Alles stimmt.
7. **Widersprüche im PDF gesucht.** Die Legende sagt: «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil … Haben diese Monate im Heizprofil zusammen 0 %, zählen stattdessen Ihre Mietstage darin.» Das passt zum Abschnitt und zur Rechnung. In der Spalte Zeitanteil steht bei Heizung ein Prozentwert, bei den anderen Positionen «184/365 Tage». Das ist durch die Legende gedeckt. Einen echten Widerspruch habe ich nicht gefunden.
8. **Zweite Abrechnung: Sarah Meier, NK-22222222-2025-0002** (`sarah-p-1.png`, `sarah-p-2.png`). Gleicher Abschnitt, gleicher Wortlaut. Heizung: 1'054.47 × (1'520 + 790)/4'115 = 591.94, Zeitanteil 56.14 %, stimmt. Übrige Positionen: 113.06, 261.77, 388.84, 63.45. Zwischensumme 1'419.06, 3 % = 42.57, 1'461.63 − 1'320.00 = 141.63, gerundet 141.60. Der QR-Zahlteil auf Seite 2 zeigt CHF 141.60. Alles stimmt, und Nina Brunner und Sarah Meier ergeben zusammen genau den Wohnungsanteil.
9. **Heizprofile in den Einstellungen.** «Heizung + Warmwasser»: Jan 13.6 % … Dez 13 %, gleich wie im PDF. Der Einleitungssatz der Seite erklärt das Heizprofil verständlich (P-4).
10. **Vergleich mit dem Tank (Hans Müller, Kevin Fischer).** Hier steht unter dem gleichen Titel die Rechnung Anfangsbestand + Rechnungen − Endbestand, siehe «Beobachtungen». Die Zahlen stimmen.

## Verwirrung

- «ihr Anteil» (klein) neben «Ihr Anteil» (Spaltentitel), siehe P-1.
- «Abrechnungsposition»: In der Tabelle heisst die Spalte «Kategorie». Welche Zeile gemeint ist, muss ich selbst herausfinden.
- «Zeitanteil» als Prozentwert, der aus Beträgen gewichtet ist. Ich verstehe darunter einen Anteil an der Zeit, nicht an Geld (P-2).
- «Heizprofil» wird im PDF nicht erklärt (P-4).
- Auf der Detailseite «Ihre Mietstage 0 von 90 Tagen», im PDF dagegen Monatsanteile: zwei Erklärungen für dieselbe Rechnung.

## Fehlerrisiken

- Ein Mieter rechnet 11 % + 33.2 % = 44.2 % nach, kommt auf rund CHF 466 statt 462.53 und reklamiert (P-2).
- Ein Mieter liest «ihr Anteil steht unter der Abrechnungsposition» als Hinweis auf seinen eigenen Anteil und sucht auf Seite 2 vergeblich danach (P-1).
- Ein Vermieter prüft auf der Detailseite die Mietstage. Bei einem Einzug mitten im Monat passt der Prozentwert dann nicht zu den angezeigten Tagen (Beobachtung, mit den Demodaten nicht gezeigt).

## Vorschläge

- **P-1:** Abrechnungsliste → Nina Brunner → PDF → Seite 2, Abschnitt «Heiz- und Warmwasserkosten». Besser wäre zum Beispiel: «Bei einer Rechnung mit Leistungszeitraum zählen die Monate des Heizprofils in diesem Zeitraum. Die Berechnung Ihres Anteils steht in der Kostenübersicht unter «Heizung».»
- **P-2:** Gleicher Weg, Seite 1, Position «Heizung», Spalte Zeitanteil 43.86 % gegenüber 11.00 % + 33.20 %. Ein Satz im Abschnitt würde helfen: «Jede Rechnung zählt mit ihrem Betrag; der Zeitanteil ist deshalb nicht die Summe der Monatsanteile.»
- **P-3:** Gleicher Weg, Rechenzeile unter «Heizung». Zum Beispiel: «Ihr Anteil: 1'054.47 × (… ) / 4'115.00 = 462.53 (Zeitanteil 43.86 %)», oder «Zeitanteil = (…) / 4'115.00» in einer eigenen Zeile.
- **P-4:** Gleicher Weg, Abschnitt «Heiz- und Warmwasserkosten». Einen Satz ergänzen wie: «Das Heizprofil verteilt die Heizkosten eines Jahres auf die Monate; im Winter wird mehr geheizt als im Sommer.» Wenn das zutrifft, auch sagen, dass die Position «Heizung» das Warmwasser enthält.

## Nicht geprüft

- Ein Einzug oder Auszug mitten im Monat: Wie ein angebrochener Monat im Heizprofil zählt und ob der Abschnitt das erklärt. Die Demodaten haben nur Wechsel an Quartalsgrenzen, und ich durfte nichts speichern.
- Der Fall «Monate im Heizprofil zusammen 0 %, es zählen die Mietstage» (zum Beispiel Profil «Heizung Tessin» mit einer Sommerrechnung). Diesen Fall gibt es in den Demodaten nicht.
- Eine Abrechnung mit Heizprofil und Tankbestand zugleich (Einzug während der Periode in Musterhaus Zentrum oder Alpenblick). Die gibt es in den Demodaten nicht.
- Andere Sprachen des PDF.
