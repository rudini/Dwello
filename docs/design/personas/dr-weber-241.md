# Dr. Weber – Leistungszeitraum Hauswart, Abrechnung Nina Brunner 2025 (Runde 241)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
App: http://localhost:3300 (Persona-Stack), gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dr-weber-241/` (PDF: `nina.pdf`, Seiten: `nina-page-1.png`, `nina-page-2.png`).

Bewertet wird nur die Position Hauswart im PDF: die Zeilen darunter, die Rechenzeile zu «Ihr Anteil» und die Erklärung unter der Kostentabelle.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Zeilen unter «Hauswart» | Die Zeilen nennen weder Rechnungsdatum noch Rechnungsnummer noch Rechnungssteller. Alle vier Rechnungen kosten CHF 765.00. Q1, Q2 und Q4 kann ich über den Leistungszeitraum einem Beleg zuordnen, die Zeile «Ohne Leistungszeitraum» nur durch Ausschluss. Auf dem Beleg steht «Hauswartung Q3 2025», also gerade ein Zeitraum. |
| P-2 | Minor | PDF, Zeile Q4 | «davon 01.10.2025 – 31.12.2025: CHF 572.20» zeigt nicht, wie der Betrag entsteht (765.00 × 92/123). Die 123 Tage des Leistungszeitraums stehen nirgends. Ich musste sie selbst zählen, um 572.20 nachzurechnen. |
| P-3 | Minor | PDF, Erklärung unter der Kostentabelle | Den Absatz musste ich zweimal lesen. «zählt mit den Tagen, die in die Periode fallen» und «Hat eine Abrechnungsposition Rechnungen über verschiedene Tage» sind unklar formuliert. Die Rechenzeile «734.72 × ( … ) / 2'867.20» sagt nicht, dass der Teil «( … ) / 2'867.20» der Zeitanteil 33.41 % aus der Spalte ist. |
| P-4 | Nit | PDF, Zeile «Ohne Leistungszeitraum» | «Ohne Leistungszeitraum» ist ein Wort aus der Sicht des Vermieters. Für die Mieterin ist es neben einem Beleg mit der Aufschrift «Q3 2025» irritierend. Nirgends steht, dass diese Rechnung deshalb über das ganze Jahr verteilt wird. |
| P-5 | Nit | PDF, Zeile Q4 | Die Zeile bricht mitten in «Ihre / Mietstage 92 von 92 Tagen» um. Der zweite Teil steht allein auf der nächsten Zeile. |

## Beobachtungen

- In der Rechnungsliste blieb der Filter beim ersten Versuch ohne Wirkung: Gebäude «Seepark Residenz» und Kategorie «Hauswart» gewählt, dann «Suchen». Es kamen 83 Rechnungen aus allen Gebäuden und Jahren, auch der Jahresfilter 2025 war weg. Beim zweiten Versuch mit etwas Wartezeit nach dem Laden ging es (4 Rechnungen). Vermutlich habe ich gewählt, bevor die Seite fertig geladen war.
- Die Zeitangaben stimmen nicht überein: Der Assistent zeigt «Entwurf gespeichert, 15:03». Dieselbe Abrechnung zeigt unter «Verlauf» «Erstellt 16.10.2026, 17:03», die Rechnung zeigt «Zuletzt geändert 17:02». Der Assistent scheint eine andere Zeitzone zu verwenden.
- Begriffe: Der Bildschirm sagt «Kosten des Gebäudes», das PDF sagt «Kosten Liegenschaft» und im Kopf «Liegenschaft».
- Die Detailseite der Abrechnung zeigt für Hauswart nur «Anteil 8.56 %», ohne die Aufteilung nach Rechnungen. Das PDF zeigt «Wohnungsanteil 734.72» und «Zeitanteil 33.41 %». Als Vermieter kann ich die Rechnung vor dem Versand nur im PDF prüfen, und die beiden Prozentwerte bedeuten etwas anderes.
- Im Hilfetext zum Leistungszeitraum steht als Beispiel «01.10.2024 bis 31.12.2024», beim Datumsformat aber «31.12.2026». Beides stimmt, wirkt aber uneinheitlich.
- Gut: Auf der Bearbeitungsseite warnt Dwello «Rechnung schon abgerechnet». Schritt 4 des Assistenten sagt klar, dass bestehende Abrechnungen nicht neu berechnet werden und nur Nina Brunner eine neue erhält. Die vorhandenen Entwürfe von Thomas Weber, Sarah Meier und Marco Bernasconi wurden aber vor meiner Änderung berechnet und stimmen jetzt nicht mehr. Ich habe sie nicht angerührt, weil sie nicht von mir sind.
- Das PDF nennt das Recht auf Belegeinsicht (Art. 257b Abs. 2 OR), sauber.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 14 Schritte: Filter (2 Versuche), 3 Rechnungen bearbeiten und speichern, Assistent mit 5 Schritten, PDF erstellen, herunterladen, nachrechnen.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis auf die fällige Abrechnung 2025. Gesehen: «Noch nicht abgerechnet: Alpenblick, Seepark Residenz», dazu ein Link «Abrechnungen erstellen».
2. **Rechnungen nach Seepark und Hauswart filtern.** Erwartet: 4 Rechnungen. Gesehen: Der erste Versuch ergab 83 Rechnungen (siehe Beobachtungen), der zweite die vier Rechnungen von Facility Service AG, je CHF 765.00, datiert 31.03., 30.06., 30.09. und 31.12.2025 (`03-hauswart-filter.png`).
3. **Q1 bearbeiten.** Erwartet: ein Feld für den Leistungszeitraum. Gesehen: die Gruppe «Leistungszeitraum (optional)» mit Beginn und Ende und einem ausführlichen Hilfetext, dazu oben die Warnung «Rechnung schon abgerechnet». 01.01.2025 und 31.03.2025 eingegeben. Die Wochentage erscheinen darunter («Mittwoch, 1. Januar 2025»), das beruhigt. Gespeichert, Meldung «Rechnung von Facility Service AG gespeichert». Die Detailseite zeigt «Leistungszeitraum 01.01.2025 – 31.03.2025 / Nur die Tage in der Abrechnungsperiode zählen.»
4. **Q2** 01.04.–30.06.2025: wie bei Q1, gespeichert.
5. **Q4** 01.10.2025–31.01.2026: akzeptiert, ohne Warnung über das Jahresende hinaus, gespeichert. Q3 habe ich nicht angerührt.
6. **Assistent «Abrechnungen erstellen».** Schritt 1 schlägt 01.01.–31.12.2025 vor. Schritt 2: Seepark Residenz gewählt («15 Rechnungen in der Abrechnungsperiode»). Schritt 3: Heizprofil «Heizung + Warmwasser», Verwaltungspauschale 3 %, unverändert gelassen. Schritt 4 «Vorschau»: «Es gibt schon Abrechnungen … Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue», darunter nur «Nina Brunner Wohnung A2 Kosten CHF 1’191.79 Rückerstattung CHF 248.20». Häkchen «Die Abrechnungen trotzdem erstellen» gesetzt. Schritt 5: «Entwürfe erstellen», Ergebnis «1 Nebenkostenabrechnung ist als Entwurf erstellt.»
7. **Detail NK-22222222-2025-0005.** Hauswart: Gebäude CHF 2’867.20, Anteil 8.56 %, Betrag CHF 245.45. 184 Mietstage (`14-nina-detail.png`).
8. **PDF erstellen.** Der Knopf wird zum Link «PDF herunterladen», das PDF hat 2 Seiten.
9. **PDF als Nina Brunner lesen, Hauswart** (`nina-page-1.png`). Die Tabellenzeile lautet «Hauswart, Pro Fläche (m²), 82.00 / 320.00 m², 2'867.20, 734.72, 33.41 %, 245.45». Darunter stehen:
   - «Leistungszeitraum 01.01.2025 – 31.03.2025: CHF 765.00, Ihre Mietstage 0 von 90 Tagen»
   - «Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 765.00, Ihre Mietstage 0 von 91 Tagen»
   - «Ohne Leistungszeitraum: CHF 765.00, Ihre Mietstage 184 von 365 Tagen der Abrechnungsperiode»
   - «Leistungszeitraum 01.10.2025 – 31.01.2026 (Rechnung CHF 765.00), davon 01.10.2025 – 31.12.2025: CHF 572.20, Ihre Mietstage 92 von 92 Tagen»
   - «Ihr Anteil: 734.72 × (765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 184/365 + 572.20 × 92/92) / 2'867.20 = 245.45»
10. **Nachrechnen allein aus dem PDF:**
    - Kosten Liegenschaft: 765 + 765 + 765 + 572.20 = 2'867.20 ✓
    - Wohnungsanteil: 2'867.20 × 82/320 = 734.72 ✓
    - Tage: Q1 90 ✓, Q2 91 ✓, Q4 im Jahr 2025 92 ✓
    - Q4-Teilbetrag: 765 × 92/123 = 572.195, gerundet 572.20 ✓. Die 123 Tage musste ich selbst zählen (P-2).
    - Klammer: 0 + 0 + 385.64 + 572.20 = 957.84. Geteilt durch 2'867.20 ergibt 33.41 % ✓
    - 734.72 × 957.84 / 2'867.20 = 245.447, also 245.45 ✓
    - 734.72 × 33.41 % ergäbe 245.47. Die Abweichung erklärt der Satz «Der Prozentwert ist gerundet; Ihr Anteil folgt aus der Berechnung unter der Position» ✓

    Ergebnis: «Ihr Anteil» lässt sich vollständig nachrechnen.
11. **Belege zuordnen.** Q1, Q2 und Q4 gehen über den Zeitraum, die dritte Zeile nur durch Ausschluss (P-1).
12. **Erklärung lesen.** Nach dem zweiten Lesen verstanden (P-3).

## Verwirrung

- «Ohne Leistungszeitraum» (P-4): Als Mieterin weiss ich nicht, was ein fehlender Leistungszeitraum bei einer Rechnung bedeutet, die auf dem Papier «Q3» heisst.
- Spalte «Zeitanteil»: Sie zeigt «184/365 Tage» (Tage), «44.20 %» (Heizprofil) und «33.41 %» (gewichtet über die Rechnungen), drei Bedeutungen in einer Spalte. Der letzte Satz der Erklärung hilft nur bei der Heizung.
- «Rechnungen über verschiedene Tage»: gemeint sind Rechnungen für verschiedene Zeiträume.
- «Kosten Liegenschaft» im PDF und «Kosten des Gebäudes» auf dem Bildschirm.

## Fehlerrisiken

- Gibt es mehrere Rechnungen ohne Leistungszeitraum mit gleichem Betrag, kann die Mieterin eine Zeile keinem Beleg mehr zuordnen. Das gibt Rückfragen bei der Belegeinsicht.
- Eine Mieterin, die das Q3 vollständig bewohnt hat, sieht nur 184/365 dieser Rechnung angerechnet. Hier ist das zu ihren Gunsten, umgekehrt (Auszug am 30.06.) zu ihren Lasten. Ohne einen Hinweis versteht sie nicht, warum.
- Nach dem Setzen der Leistungszeiträume stimmen die bestehenden Seepark-Entwürfe nicht mehr. Dwello warnt zwar, wer aber nicht löscht und neu erstellt, verschickt veraltete Beträge.

## Vorschläge

- **P-1.** Reproduktion: Die Leistungszeiträume wie oben setzen, die Abrechnung für Nina Brunner 2025 erstellen und das PDF öffnen: Die Zeilen unter Hauswart enthalten kein Rechnungsmerkmal. Was helfen würde: in jeder Zeile Rechnungsdatum und Rechnungsnummer, zum Beispiel «Rechnung SR-2025-… vom 30.09.2025, ohne Leistungszeitraum: CHF 765.00, …».
- **P-2.** Reproduktion: wie bei P-1, Zeile Q4. Was helfen würde: «davon 01.10.2025 – 31.12.2025 (92 von 123 Tagen): CHF 572.20».
- **P-3.** Reproduktion: wie bei P-1, Absatz unter der Tabelle. Was helfen würde: kürzere Sätze, «Rechnungen für verschiedene Zeiträume» statt «über verschiedene Tage», «zählt nur mit den Tagen in der Periode» statt «zählt mit den Tagen …». In der Rechenzeile den Zeitanteil benennen, zum Beispiel «Zeitanteil = (…) / 2'867.20 = 33.41 %».
- **P-4.** Reproduktion: wie bei P-1, dritte Zeile. Was helfen würde: «Ohne Leistungszeitraum, auf das ganze Jahr verteilt: …» oder ein Satz dazu in der Erklärung.
- **P-5.** Reproduktion: wie bei P-1, Zeile Q4 bei A4. Was helfen würde: die Zeile kürzen, zum Beispiel ohne «(Rechnung CHF 765.00)» oder mit diesem Teil in einer eigenen Zeile, damit «Ihre Mietstage …» nicht getrennt wird.

## Nicht geprüft

- Wie das PDF mehrere Rechnungen ohne Leistungszeitraum in einer Position darstellt, einzeln oder zusammengefasst: In Seepark gibt es nur eine.
- Ob sich ein Leistungszeitraum mit Ende vor Beginn speichern lässt: nicht verlangt, und ich wollte keine fehlerhaften Daten anlegen.
- Die übrigen Positionen (Heizung, Kaltwasser usw.), die QR-Rechnung und die Beträge über Hauswart hinaus: nicht Teil des Auftrags.
- Die Entwürfe der anderen Seepark-Mieter: nicht von mir angelegt, daher nicht angerührt.
