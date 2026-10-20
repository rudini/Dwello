# Datenprüfung #452 (Punkte 7 und 4), Bericht 1

Geprüft: Worktree w8-issue-452 (Commit 2153eca2), Datenbank `dwello_persona` (nur SELECT), PDF `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/weber-452/anna-2025.pdf`, Bildschirmfoto `.../weber-452/24-nach-neu-berechnen.png` (Abrechnungsseite). Eigene Skripte (ohne Dwello-Code):
- `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/r452d/anna.py`
- `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/r452d/laura.py`
- `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/r452d/seepark.py`

Ausführen: `python3 -I <Skript>`. Die Skripte rechnen mit Brüchen und runden je Position auf Rappen.

## Ergebnis

Kein Blocker, kein Major. Alle Beträge stimmen auf den Rappen. Zwei Nits, ein Hinweis zur Erklärung von Punkt 2.

| ID | Schwere | Record | Erwartet | Gefunden |
|---|---|---|---|---|
| D-1 | Nit | `utility_statement_line_items.share_percentage`, NK-11111111-2025-0002 | Anteil in % = Bruch der Verteilung: «Lift» und «Hauswart Q4» 1/6 = 16.6667 % | Gespeichert sind 16.6669 (Lift) und 16.6663 (Hauswart Q4). Der Wert ist aus dem gerundeten Betrag rückgerechnet (281.67 / 1690, 153.33 / 920). Die Seite zeigt auf 2 Stellen «16.67 %» und stimmt. Das PDF zeigt den exakten Bruch «1 / 6 Wohnungen». Keine sichtbare Folge. |
| D-2 | Nit | `utility_statement_line_items`, NK-22222222-2025-0003 (A2 Brunner), Hauswart | Anteil ungerundet: 3060 × 82/320 × 184/365 = 395.28 | Gespeichert 395.29: Dwello rundet erst das Wohnungsanteil auf Rappen (784.13) und multipliziert dann mit dem Zeitanteil. Im PDF ist das nachrechenbar («Ihr Anteil = Wohnungsanteil × Zeitanteil»), aber die Regel steht in keinem der drei Dokumente. Folge: Summe 1553.79 statt 1553.78. Anna und Laura (365/365) sind nicht betroffen. Vorschlag: Regel im Glossar bei «Zeitanteil» festhalten. |

Hinweis (kein Befund): Die Persona hat das gespeicherte Hauswart-Bild von Anna als P-1 gemeldet (zwei Zeilen «Hauswart»). Die Rechnung ist richtig: Die Gruppe heisst Kategorie plus Verteilschlüssel (`calculation.service.ts` Zeile 121: `${categoryId}-${distributionKeyId || 'none'}`), also zwei Positionen.

## 1. Entwurf NK-11111111-2025-0002 (Anna Schmidt, Wohnung 1.02)

Eingaben aus der Datenbank: Wohnung 92.00 m² von 492.50 m² im Gebäude, 6 Wohnungen, Mietvertrag 01.06.2022 bis offen (365 von 365 Tagen), Akonto 300.00 ab 01.06.2022 (12 × = 3600.00), Verwaltungspauschale vereinbart, Satz 3 %, alle 8 Kategorien vereinbart, Heizöl-Stand 31.12.2024 2650.00 und 31.12.2025 2257.20. Rechnungen nach Rechnungsdatum 2025 (die 2024er fehlen zu Recht). Die Q4-Rechnung «Hauswartung Q4 2025» (920.00, Datum 31.12.2025) hat Kategorie Hauswart und keinen Schlüssel.

| Position | Kosten | Schlüssel | Meine Rechnung | PDF | Seite | Datenbank |
|---|---|---|---|---|---|---|
| Lift | 1'690.00 | 1/6 | 281.67 | 281.67 | 281.67 | 281.67 |
| Allgemeinstrom | 762.80 (198.70+171.20+162.80+230.10) | 92/492.5 | 142.49 (142.4926) | 142.49 | 142.49 | 142.49 |
| Kaltwasser | 3'840.00 | 92/492.5 | 717.32 (717.3198) | 717.32 | 717.32 | 717.32 |
| Hauswart Q1–Q3 | 2'760.00 | 92/492.5 | 515.57 (515.5736) | 515.57 | 515.57 | 515.57 |
| Gartenpflege | 935.00 | 92/492.5 | 174.66 (174.6599) | 174.66 | 174.66 | 174.66 |
| Kehricht | 990.00 | 1/6 | 165.00 | 165.00 | 165.00 | 165.00 |
| Heizung | 6'957.80 (2650 + 6565 − 2257.20) | 0.7 × 92/492.5 + 0.3 × 1/6 = 18.0761 % | 1'257.70 (1257.7018) | 1'257.70 | 1'257.70 | 1'257.70 |
| Kaminfeger | 335.00 | 92/492.5 | 62.58 (62.5787) | 62.58 | 62.58 | 62.58 |
| Hauswart Q4 «Pro Einheit» | 920.00 | 1/6 | 153.33 (153.3333) | 153.33 | 153.33 | 153.33 |

- Zwischensumme: 3'470.32 (PDF, Seite, `total` = Summe der gerundeten Positionen). Die ungerundete Summe wäre 3'470.3264, gleiche Rundung.
- Verwaltungspauschale 3 %: 104.11 (104.1096). PDF 104.11, Datenbank `management_fee` 104.11.
- Nebenkosten 3'574.43 (`total_costs` 3574.43). Akonto 3'600.00 (12 × 300.00).
- Saldo vor Rundung: −25.57. Rundung zugunsten des Mieters (Rückerstattung aufrunden auf 25.60), Rundung +0.03, Saldo −25.60. Datenbank `balance` −25.60, PDF «Rückerstattung 25.60, + 0.03», Seite «CHF 25.60».
- Zeitanteil 365/365 überall. Bruch «1 / 6 Wohnungen» für die Q4-Zeile entspricht der Regel «gleichmässig pro Wohnung, durch alle 6 Wohnungen inkl. leere» (Anforderungen Thema 3: Geteilt wird durch alle Wohnungen des Gebäudes). Bezeichnung «Pro Einheit» in PDF und Seite wie verlangt.
- Rückerstattung: kein Zahlteil, daher keine QR-Rechnung. Das PDF hat zwei Seiten und keinen Zahlteil.
- Das PDF ist nur deutsch (Sprache von Anna Schmidt), siehe «Nicht bestätigt».

Ergebnis: bestanden.

## 2. Laura Keller (Alpenblick, EG), Vorschau 2025

Eingaben: EG 72 m² von 255 m² (72 + 98 + 85), 3 Wohnungen, Vertrag ab 01.11.2022 (ganze Periode), Akonto 190.00 (12 × = 2'280.00), Verwaltungspauschale vereinbart, Satz 3 % (aus dem Lauf), Heizprofil nicht angewandt (ganze Periode), Heizöl-Stand 1'792.00 (31.12.2024) und 1'494.00 (31.12.2025). Rechnungen 2025: Allgemeinstrom H1 182.60, Kaltwasser H1 470.00, Heizöl 4'880.00 (Verbrauch 1'792 + 4'880 − 1'494 = 5'178.00), Schneeräumung 920.00 (31.03., Kategorie neu) und 380.00 (31.12.). Die Rechnung «Allgemeinstrom H2 2025» (196.30) steht jetzt auf «Nicht umlagefähig» (Persona-Schritt 6) und zählt nicht mit.

Beide Werte stimmen, jeder für seinen Zustand. Der Unterschied kommt von der Gruppierung:

| Zustand | Positionen (je Position auf Rappen gerundet) | Summe | Verwaltungspauschale | Nebenkosten | Saldo vor / nach Rundung |
|---|---|---|---|---|---|
| Vorher: 920.00 ohne Kategorie, eigene Position | Strom 51.56; Wasser 132.71; Heizung 1'462.02; Schnee 380.00 → 107.29; ohne Kategorie 920.00 → 259.76 | 2'013.34 | 60.40 | **2'073.74** | −206.26 / **−206.30** |
| Nachher: 920.00 + 380.00 = 1'300.00 in der Kategorie Schneeräumung, eine Position | Strom 51.56; Wasser 132.71; Heizung 1'462.02; Schnee 1'300.00 → 367.06 | 2'013.35 | 60.40 | **2'073.75** | −206.25 / **−206.25** |

Erklärung: Die Gruppe ist Kategorie plus Schlüssel (`uncategorized-<Schlüssel>` gegen `<Kategorie>-<Schlüssel>`). Ohne Kategorie rechnet Dwello 380.00 und 920.00 als zwei Positionen: 107.2941 → 107.29 und 259.7647 → 259.76, zusammen 367.05. Mit Kategorie ist es eine Position: 1'300 × 72/255 = 367.0588 → 367.06. Der Unterschied ist genau 1 Rappen Rundung, in der Summe, die Verwaltungspauschale bleibt bei 60.40 (60.4002 gegen 60.4005). Die Rückerstattung 2'280.00 − 2'073.74 = 206.26 rundet zugunsten des Mieters auf 206.30; 2'280.00 − 2'073.75 = 206.25 bleibt 206.25. Es ist also nicht die Rundung des Saldos, die hier springt, sondern der eine Rappen davor. Der Betrag nach der Zuordnung (2'073.75 / 206.25) ist der richtige Endwert der Regel «je Kategorie und Schlüssel eine Position». Der vorherige Wert ist nur ein Zwischenstand, der ohnehin nicht abgerechnet werden kann: Die Vorschau hält an, bis jede Rechnung eine Kategorie hat (Punkt 4).

Weitere Kontrollrechnungen, die nicht zu den Werten passen und damit ausgeschlossen sind: 920.00 «Pro Einheit» (2'122.06), alles «Pro Einheit» (2'142.01), 920.00 ausgeschlossen (1'806.19).

Die Vorschau-Seite selbst konnte ich nicht öffnen (kein Login), die Werte stammen aus dem Persona-Bericht. Es gibt für Alpenblick 2025 keinen gespeicherten Entwurf (nur 2024er Abrechnungen).

Ergebnis: bestanden. Kein Befund über D-1/D-2 hinaus.

## 3. Seepark Residenz, Fernwärme Q4 2025 mit «Pro Fläche (m²)»

Rechnung: Datum 20.01.2026, Leistungszeitraum 01.10.–31.12.2025, 1'410.00, Kategorie Heizung, Schlüssel Pro Fläche (gespeichert 10:21:03). Sie zählt voll in 2025 (Leistungszeitraum in der Periode, Datum nicht). «Fernwärme Q4 2024» (1'350.00, Datum 20.01.2025, Leistungszeitraum 2024) zählt nicht in 2025, «Treppenhausreinigung Februar» (380.00, 28.02.2026) auch nicht. Heizung 2025: 1'520 + 790 + 395 + 1'410 = 4'115.00 (kein Tank, keine Heizöl-Stände, daher Rechnungsbetrag statt Verbrauch).

Eingaben: 4 Wohnungen, 320 m² (68 + 82 + 75 + 95). Mietverträge: A1 Weber ganzes Jahr, A2 Meier 01.01.–30.06. (181 Tage), A2 Brunner ab 01.07. (184 Tage), B2 Bernasconi ganzes Jahr (Satz 2.5 %), B1 leer. Heizprofil «Heizung + Warmwasser» (Meier Jan–Jun 55.8 %, Brunner Jul–Dec 44.2 %). Die Q1–Q3-Rechnungen haben keinen Leistungszeitraum (ganze Periode, nach Profil), Q4 nur Oktober bis Dezember (nur Brunner, Meier 0).

| Wohnung | Rechnung | Anteil Heizung (mein Wert) | Gespeichert (Entwurf) |
|---|---|---|---|
| A1 Weber | 4'115.00 × 68/320 | 874.44 (874.4375) | 874.44 |
| A2 Meier | 2'705.00 × 55.8 % × 82/320 | 386.78 (386.7812) | 386.78 |
| A2 Brunner | (2'705.00 × 44.2 % + 1'410.00) × 82/320 | 667.69 (667.6876) | 667.69 |
| B2 Bernasconi | 4'115.00 × 95/320 | 1'221.64 (1'221.6406) | 1'221.64 |

Die Anteile der Q4-Rechnung allein bei «Pro Fläche»: A1 68/320 = 21.25 %, B2 29.69 %, A2 25.63 %. Summe aller vier Wohnungen A1 + Brunner/Meier-Wohnung + B2 + leere B1 (75/320 = 23.44 %) = 100 %: stimmt.

Auch die übrigen Positionen und Summen stimmen mit den vier gespeicherten Entwürfen (Nebenkosten 2'365.44 / 1'250.32 / 1'553.79 / 3'195.82, Saldo −34.60 / −69.70 / +113.75 / +75.80; Akonto 2'400 / 1'320 / 1'440 / 3'120; Satz 3 % und 2.5 %). Einzige Abweichung 1 Rappen bei Brunner, siehe D-2.

Die Entwürfe sind vom 10:12 und wurden danach nicht neu berechnet (`updated_at` 10:12:28 bis 10:12:29). Sie enthalten den Q4-Schlüssel «Pro Fläche», wie er jetzt wieder gespeichert ist. Ich habe die Vorschau nicht geöffnet; sie rechnet dieselben Daten, und mein Skript kommt auf dieselben Werte.

Ergebnis: bestanden.

## Geprüfte Records (bestanden)

- NK-11111111-2025-0002: 9 Positionen, Zwischensumme, Verwaltungspauschale, Nebenkosten, Akonto, Saldo, Rundung (PDF, Seite, Datenbank).
- Alpenblick 2025, Laura Keller: beide Zustände (2'073.74 / 206.30 und 2'073.75 / 206.25).
- Seepark 2025: Heizung (Fernwärme Q4 2025) für A1, A2 (Meier), A2 (Brunner), B2; Gesamtsummen der vier Entwürfe NK-22222222-2025-0001 bis -0004.
- Abgrenzung der Rechnungen nach Leistungszeitraum (Fernwärme Q4 2024 und Q4 2025) und nach Datum.

## Nicht bestätigt

- QR-Rechnungen: keine. Anna Schmidts Saldo ist eine Rückerstattung (kein Zahlteil im PDF), für die Seepark-Entwürfe und Laura gibt es kein PDF. Ich habe daher keinen QR-Code dekodiert (kein Zahlteil, nichts zu prüfen).
- Französische, italienische und englische PDFs: Anna Schmidt hat Deutsch, es gibt kein PDF in einer anderen Sprache. Nicht geprüft.
- Vorschau-Seite im Assistenten (Laura, Seepark): Ich habe mich nicht angemeldet. Die Werte für Laura stammen aus dem Persona-Bericht `/home/user/Dwello/.claude/worktrees/agent-a1d974ca8cb01e683/docs/design/personas/weber-452.md`, die Seepark-Anteile aus den gespeicherten Entwürfen und meiner eigenen Rechnung aus der Datenbank. Abweichungen der Seite selbst kann ich daher nicht ausschliessen.
- Die Seite der Abrechnung von Anna Schmidt habe ich nur über das Bildschirmfoto `24-nach-neu-berechnen.png` verglichen (alle Zeilen, Zwischensumme, Saldo gleich wie im PDF), nicht live.
- Backend-Tests liefen nicht (nicht nötig).
