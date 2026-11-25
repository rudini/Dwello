# Dr. Weber – Heizöllieferung ohne Tankbestand (#1474)

Desktop 1440 × 900, Maus. Gebäude «Seepark Residenz», Abrechnungsperiode 01.01.2025 – 31.12.2025. Ich habe eine Rechnung gespeichert und die vier Entwürfe 2025 neu berechnet; für Wohnung A2 habe ich beide PDFs erstellt.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Abrechnungsposition Heizung | Unter der Position steht nur «Rechnung vom 02.06.2025, Lieferung in den Tank, gilt für die ganze Abrechnungsperiode: CHF 3'000.00, Anteil nach Heizprofil: 55.80 % (siehe Heiz- und Warmwasserkosten)». Der Verweis führt in einen Abschnitt, in dem kein Wort über Tank oder fehlenden Bestand steht. Den Grund («Für den Tank fehlt der Anfangs- oder der Endbestand …») finde ich nur im langen Erklärtext über dem Abschnitt, mitten in den Erklärungen zum Zeitanteil. |
| P-2 | Minor | PDF, Erklärtext | «Für den Tank fehlt der Anfangs- oder der Endbestand.» Bei diesem Gebäude fehlen beide, es ist gar kein Tankbestand erfasst. «oder» klingt, als gebe es einen der beiden Werte. Was das für die Mieterin heisst, steht nicht da: Auch Öl, das am 31.12.2025 noch im Tank ist, wird 2025 abgerechnet. |
| P-3 | Minor | Abrechnung (Bildschirm), Position Heizung | Auf dem Bildschirm steht «Lieferung in den Tank, gilt für die ganze Abrechnungsperiode: CHF 3’000.00, Anteil nach Heizprofil: 55.80 %». Warum die Lieferung so zählt (kein Tankbestand erfasst) und dass ich das mit einem Tankbestand ändern könnte, sagt die Seite nicht. Das erfahre ich erst aus dem PDF. |
| P-4 | Minor | Rechnung (Detail) | Bei der Rechnung steht nach dem Speichern weiter «Leistungszeitraum 15.05.2025 – 15.05.2025 · Nur die Tage in der Abrechnungsperiode zählen.» Die Abrechnung zählt sie aber über die ganze Abrechnungsperiode. Die zwei Seiten widersprechen sich, und an der Rechnung steht nicht, dass Dwello sie als Lieferung in den Tank behandelt. |

## Beobachtungen

- Der Betrag stimmt, ich habe nachgerechnet. Wohnungsanteil A2: 7'115.00 × 82/320 = 1'823.22. Das Heizprofil «Heizung + Warmwasser» ergibt Jan–Jun 13.6+12.1+11.5+9.3+5.6+3.7 = 55.80 % und Jul–Dez 3.7+3.6+3.7+9.5+10.7+13.0 = 44.20 %, zusammen 100 %. Vom Heizöl tragen Meier 1'823.22 × 1'674/7'115 ≈ 428.97 und Brunner 1'823.22 × 1'326/7'115 ≈ 339.79, zusammen 768.75 = 3'000 × 82/320. Das Öl wird also ganz verteilt, keine Doppelzählung, nichts fehlt. Die Position Heizung: Meier 1'823.22 × (1'520 + 3'000 × 55.80 % + 790)/7'115 = 1'020.90, Brunner 1'823.22 × (3'000 × 44.20 % + 395 + 1'410)/7'115 = 802.32. Beide stimmen mit dem PDF überein.
- Das ist plausibel. Die Lieferung vom 15.05. lastet nicht auf einer Mieterin allein, sondern verteilt sich nach Heizprofil über das ganze Jahr. Ohne die Behandlung als Lieferung in den Tank hätte Meier als Mieterin am 15.05. die ganzen 768.75 getragen.
- Spalte Zeitanteil im PDF: «55.99 %» (Meier) bzw. «44.01 %» (Brunner), darunter «Anteil nach Heizprofil: 55.80 %». Es sind zwei verschiedene Prozentwerte für dieselbe Mieterin. Die Erklärung «Der Prozentwert ist gerundet» passt nicht dazu, denn 55.99 % ist ein Mischwert und keine Rundung von 55.80 %. Das war vor der Ölrechnung schon so (56.14 %).
- Formel im PDF: «Ihr Anteil: 1'823.22 × Zeitanteil (1'520.00 × 100.00 % + …) / 7'115.00». Das Wort «Zeitanteil» mitten in der Formel liest sich wie ein weiterer Faktor. Auf dem Bildschirm fehlt es, dort ist die Formel klarer.
- Im Rechnungsformular gibt es kein Feld für die Rechnungsnummer. Ich habe «HO-25-0815» und das Lieferdatum in die Beschreibung geschrieben. Ein Feld «Lieferdatum» gibt es auch nicht, ich habe es als Leistungszeitraum 15.05.–15.05. eingegeben.
- Als Verteilschlüssel hat Dwello «Pro Fläche (m²)» vorgeschlagen (wie bei den Fernwärme-Rechnungen); ich habe das übernommen. Im Gebäude gibt es schon Fernwärme-Rechnungen. Heizöl und Fernwärme im selben Gebäude ist fachlich ungewöhnlich, das liegt aber an den Demodaten.
- Der Hinweis nach dem Speichern («Abrechnungen nicht aktuell … mit «Neu berechnen» auf ihrer Seite neu») hat mich direkt zu den vier Entwürfen geführt. Der Bestätigungsdialog «Entwurf neu berechnen» nennt den Tankbestand und sagt, was bleibt und was sich ändert. Gut. Eine Möglichkeit, alle vier Entwürfe auf einmal neu zu berechnen, habe ich nicht gefunden. Ich musste jeden einzeln öffnen.
- Die Salden ändern sich stark. Meier hatte eine Nachzahlung von CHF 237.15 und hat jetzt CHF 679.00. Brunner hatte eine Rückerstattung von CHF 97.55 und hat jetzt eine Nachzahlung von CHF 252.45. Das folgt aus der Rechnung und stimmt rechnerisch.
- Der Abschnitt «Tankbestand» auf der Gebäudeseite erklärt die Formel Anfangsbestand + Einkauf − Endbestand verständlich.

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, 8 Schritte: Rechnung erfassen, Hinweis zu den Abrechnungen folgen, 4 × «Neu berechnen» mit Bestätigung, 2 PDFs erstellen und herunterladen, nachrechnen.

## Ablauf

- **Rechnung erfassen.** Erwartet: ein Feld für die Rechnungsnummer. Gesehen: keines, ich habe die Nummer in die Beschreibung geschrieben.
- **Rechnung nach dem Speichern.** Erwartet: ein Hinweis, dass Dwello die Rechnung als Lieferung in den Tank behandelt. Gesehen: «Leistungszeitraum 15.05.2025 – 15.05.2025 · Nur die Tage in der Abrechnungsperiode zählen.» (P-4)
- **Abrechnung Meier neu berechnet, Position Heizung.** Erwartet: eine Begründung, warum die Lieferung über das ganze Jahr zählt. Gesehen: nur «Lieferung in den Tank, gilt für die ganze Abrechnungsperiode», ohne Grund. (P-3)
- **PDF, Verweis «(siehe Heiz- und Warmwasserkosten)».** Erwartet: dort die Erklärung zum Tank. Gesehen: nur den Prozentsatz 55.80 % und die Monatsanteile. Die Erklärung zum Tank steht im Erklärtext darüber. (P-1)
- **PDF, Erklärtext.** Erwartet: «Für dieses Gebäude ist kein Tankbestand erfasst». Gesehen: «Für den Tank fehlt der Anfangs- oder der Endbestand.» (P-2)

## Vorschläge

- **P-1.** So nachstellen: Heizungsrechnung mit Leistungszeitraum 15.05.2025 – 15.05.2025 in «Seepark Residenz» erfassen, Entwurf Sarah Meier neu berechnen, PDF erstellen, Position Heizung lesen. Was helfen würde: den Grund direkt unter die Position schreiben, etwa «… gilt für die ganze Abrechnungsperiode, weil kein Tankbestand erfasst ist (siehe Hinweise)». Oder die Sätze zum Tank in den Abschnitt «Heiz- und Warmwasserkosten» verschieben, auf den der Verweis zeigt.
- **P-2.** So nachstellen: wie bei P-1, dann den Erklärtext über «Heiz- und Warmwasserkosten» lesen. Was helfen würde: unterscheiden, ob beide Werte fehlen («Für dieses Gebäude ist kein Tankbestand erfasst.») oder nur einer. Ausserdem ein Satz zur Folge, etwa «Auch Heizmaterial, das am Ende der Periode noch im Tank ist, ist in dieser Abrechnung enthalten.»
- **P-3.** So nachstellen: Entwurf Sarah Meier öffnen, Position Heizung ansehen. Was helfen würde: unter der Zeile ein Hinweis für den Vermieter, etwa «Kein Tankbestand erfasst: Die Lieferung zählt als Verbrauch der ganzen Periode. Erfassen Sie den Tankbestand beim Gebäude, um nach Verbrauch abzurechnen.» mit Link zum Gebäude.
- **P-4.** So nachstellen: die Rechnung Brennstoffe Keller AG öffnen. Was helfen würde: bei einer Lieferung in den Tank statt «Nur die Tage in der Abrechnungsperiode zählen.» den Text, der in der Abrechnung gilt, etwa «Lieferung in den Tank: zählt über die ganze Abrechnungsperiode, solange kein Tankbestand erfasst ist.»

## Nicht geprüft

- Den Vorschlag der KI für den Leistungszeitraum habe ich nicht geprüft. Ich habe keine Datei hochgeladen, sondern die Rechnung von Hand erfasst. Die Daten 15.05.–15.05. habe ich selbst eingetragen.
- Die PDFs der Mieter mit ganzem Jahr (A1 Thomas Weber, B2 Marco Bernasconi) habe ich nicht geöffnet. Auf dem Bildschirm wird dort kein Heizprofil angewendet, und die Rechnung steht ohne Hinweis auf den Tank in der Liste.
- Mit erfasstem Tankbestand habe ich nicht verglichen, das war nicht Teil der Aufgabe.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/5d09ef2c-a4a4-5466-818f-3163ccca8d53/scratchpad/weber-1474/` (u. a. 03-filled.png Formular, 09-heizung-meier.png / 09-heizung-brunner.png Position Heizung auf dem Bildschirm, after-meier.pdf / after-brunner.pdf).
