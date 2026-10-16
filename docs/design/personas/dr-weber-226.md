# Persona-Lauf: Dr. Weber, Hauswart mit Leistungszeitraum (#226)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus, Zoom 100 %.
App: http://localhost:3300 (Persona-Stack, Version 0.4.11+979-gcf49fa58). Gespeichert nur in «Seepark Residenz».
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/dr-weber-226/` (PDF: `nina.pdf`, Seite 1 gerendert: `hi-1.png`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | PDF Seite 1, Erklärung unter der Tabelle | Die Erklärung sagt «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode; bei Heizkosten der Anteil nach dem Heizprofil». Beim Hauswart steht als Zeitanteil aber «50.00 %», nicht «184/365 Tage» (= 50.41 %), und die Erklärung nennt diesen dritten Fall nicht. Wer der Erklärung folgt, rechnet 784.13 × 184/365 = 395.28 und hält 392.07 für falsch. |
| P-2 | Minor | PDF Seite 1, Zeilen unter «Hauswart» | «0/90 Tage», «92/92 Tage» ist nicht beschriftet: Es steht nirgends, dass die erste Zahl die Mietstage von Frau Brunner im Leistungszeitraum ist. Laut Erklärung («eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen») müsste das 1. Quartal 90/90 zählen, denn es liegt ganz in der Abrechnungsperiode. Die Zeilen und die Erklärung meinen also zwei verschiedene Tage. |
| P-3 | Minor | PDF Seite 1, Zeilen unter «Hauswart» | Die Zeilen sagen nicht, was sie sind: kein Wort «Rechnung» oder «Leistungszeitraum», keine Währung. «01.01.2025 – 31.03.2025: 765.00, 0/90 Tage» erkennt eine Mieterin nicht als «Rechnung für das 1. Quartal, CHF 765.00, davon 0 von 90 Tagen in Ihrem Mietverhältnis». |
| P-4 | Nit | PDF Seite 1, Hauswart «Ihr Anteil» | Wer mit der Formel ohne Zwischenrundung rechnet (3'060.00 × 82/320 × 50 %), kommt auf 392.06, das PDF zeigt 392.07 (gerundeter Wohnungsanteil 784.13 × 50 % = 392.065). Mit den gedruckten Zwischenwerten geht es auf, aber nirgends steht, dass mit dem gerundeten Wohnungsanteil weitergerechnet wird. |

## Beobachtungen

- Die Bearbeitungsmaske der Hauswart-Rechnungen zeigte den Hinweis «Rechnung schon abgerechnet … Für die Abrechnungsperiode 01.01.2025 – 31.12.2025 gibt es schon Abrechnungen mit dieser Rechnung». Die Übersicht sagte zugleich «Noch nicht abgerechnet: Alpenblick, Seepark Residenz», obwohl in Seepark schon 3 Abrechnungen 2025 bestanden (Thomas Weber A1, Sarah Meier A2, Marco Bernasconi B2). Für mich widersprüchlich: abgerechnet oder nicht?
- Die bestehenden Entwürfe/Abrechnungen von Thomas Weber, Sarah Meier und Marco Bernasconi wurden nach meiner Änderung nicht neu berechnet (so kündigt es der Hinweis an). Bei Sarah Meier (A2, vermutlich bis 30.06.2025) wirkt sich der Leistungszeitraum genauso aus; das muss der Vermieter selbst merken.
- Abrechnungsliste: Bei Nina Brunner steht «01.01.2025 – 31.12.2025», obwohl sie erst seit 01.07.2025 wohnt. Erst in der Detailansicht steht «184 Mietstage».
- Detailansicht der Abrechnung (Web): Der Hauswart hat «Anteil 12.81 %», Kaltwasser und Allgemeinstrom bei gleichem Verteilschlüssel «12.92 %». Die Quartalsaufteilung, die im PDF steht, zeigt die Web-Ansicht nicht; der Vermieter sieht den Grund für den Unterschied erst im PDF.
- Begriffe: Die App sagt «Gebäude» und «Kosten des Gebäudes», das PDF «Liegenschaft» und «Kosten Liegenschaft».
- Hilfetext zum Leistungszeitraum nennt als Beispiel das 4. Quartal 2024, die Feldbeispiele «31.12.2026»: verständlich, aber drei verschiedene Jahre in einem Block.
- Heizung: Zeitanteil 44.20 % nach Heizprofil, auf Seite 2 mit Monatsanteilen erklärt (3.70 + 3.60 + 3.70 + 9.50 + 10.70 + 13.00 = 44.20). Gut nachrechenbar.
- Assistent Schritt 4 verlangte das Häkchen «Die Abrechnungen trotzdem erstellen», obwohl nur für Nina Brunner eine neue entsteht; der Satz «Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue» hat mich aber beruhigt.

## Aufgabe geschafft: ja

## Aufwand

Rund 15 Minuten, etwa 25 Schritte: 4 Rechnungen öffnen, je Beginn und Ende eintragen und speichern; Assistent mit 5 Schritten; Abrechnung öffnen, PDF erstellen, herunterladen, lesen und nachrechnen.

## Ablauf

1. **Übersicht, dann Rechnungen 2025.** Erwartet: die vier Hauswart-Rechnungen von Facility Service AG finden. Gesehen: Q3 und Q4 auf Seite 1, Q1 und Q2 auf Seite 2 (mit Kategorie-Filter «Hauswart»), je CHF 765.00, «Hauswartung Qn 2025», Seepark Residenz.
2. **Rechnung Q4 bearbeiten.** Erwartet: Felder für den Leistungszeitraum. Gesehen: Gruppe «Leistungszeitraum (optional)» mit Beginn und Ende sowie einem ausführlichen Hilfetext; oben ein gelber Hinweis «Rechnung schon abgerechnet» (siehe Beobachtungen). Verteilschlüssel «Pro Fläche (m²)», umlagefähig.
3. **Vier Mal Beginn und Ende eintragen und speichern.** Erwartet: Bestätigung und den Zeitraum in der Detailansicht. Gesehen: jedes Mal «Rechnung von Facility Service AG gespeichert», die Detailansicht zeigt «Leistungszeitraum 01.01.2025 – 31.03.2025» usw. (Bildschirmfotos `06-017-saved.png` bis `06-027-saved.png`).
4. **Abrechnungen erstellen, Schritt 1–3.** Periode 01.01.–31.12.2025 vorgeschlagen; Gebäude «Seepark Residenz, 15 Rechnungen»; Heizprofil «Heizung + Warmwasser», Verwaltungspauschale 3 % vorgegeben. Alles belassen.
5. **Schritt 4, Vorschau.** Erwartet: nur Nina Brunner. Gesehen: «Anzahl Abrechnungen 1», «Nina Brunner Wohnung A2 Kosten CHF 1'342.81 Rückerstattung CHF 97.20», Hinweis auf 3 bestehende Abrechnungen mit dem Häkchen «trotzdem erstellen».
6. **Schritt 5, Entwürfe erstellen.** Gesehen: «1 Nebenkostenabrechnung ist als Entwurf erstellt.» Abrechnung NK-22222222-2025-0005.
7. **Detailansicht.** Hauswart: Kosten des Gebäudes CHF 3'060.00, Anteil 12.81 %, Betrag CHF 392.07; «184 Mietstage».
8. **PDF erstellen und herunterladen.** Der Knopf wurde nach dem Klick zum Link «PDF herunterladen»; Datei `abrechnung-39da2ca2-….pdf`, 2 Seiten.
9. **PDF lesen wie Nina Brunner.** Kopf: «Ihr Mietverhältnis in dieser Periode: 01.07.2025 – 31.12.2025 (184 Mietstage von 365 Tagen)». Hauswart-Zeile: Kosten Liegenschaft 3'060.00, Wohnungsanteil 784.13, Zeitanteil 50.00 %, Ihr Anteil 392.07. Darunter, kleiner und grau, eingerückt:
   ```
   01.01.2025 – 31.03.2025: 765.00, 0/90 Tage
   01.04.2025 – 30.06.2025: 765.00, 0/91 Tage
   01.07.2025 – 30.09.2025: 765.00, 92/92 Tage
   01.10.2025 – 31.12.2025: 765.00, 92/92 Tage
   (765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 92/92 + 765.00 × 92/92) / 3'060.00 = 50.00 %
   ```
10. **Nachrechnen nur aus dem PDF.**
    - Wohnungsanteil: 3'060.00 × 82.00 / 320.00 = 784.125 → 784.13. Stimmt.
    - Tage je Quartal: 90 (Jan–Mär 2025), 91, 92, 92. Stimmt. Mietstage darin 0, 0, 92, 92: stimmt mit Einzug 01.07.2025.
    - Zeitanteil: (0 + 0 + 765 + 765) / 3'060 = 50.00 %. Stimmt; die Formelzeile macht das sehr gut nachvollziehbar.
    - Ihr Anteil: 784.13 × 50.00 % = 392.065 → 392.07. Stimmt mit den gedruckten Werten (P-4 zur Zwischenrundung).
    - Gegenprobe mit der Erklärung unter der Tabelle: «Zeitanteil: Ihre Mietstage» → 184/365 → 395.28. Passt nicht (P-1).
    Ergebnis: Ja, Zeitanteil und «Ihr Anteil» lassen sich allein aus dem PDF nachrechnen, aber nur mit den Zeilen, nicht mit der Erklärung.

## Verwirrung

- «0/90 Tage»: 0 von 90 was? Ich habe es erst durch die Formelzeile und den Einzug am 01.07. als «Mietstage im Leistungszeitraum» erkannt (P-2).
- «Zeitanteil 50.00 %» beim Hauswart neben «184/365 Tage» bei den anderen Positionen, obwohl die Erklärung den Zeitanteil als Mietstage definiert (P-1).
- Die Erklärung «eine Rechnung mit Leistungszeitraum zählt mit den Tagen, die in die Periode fallen» bezieht sich auf die Spalte «Kosten Liegenschaft» (alle vier Quartale voll, 3'060.00). Die Zeilen darunter zählen aber Tage des Mietverhältnisses. Zwei Arten von «Tagen» ohne Unterscheidung.
- «Liegenschaft» im PDF, «Gebäude» in der App (Beobachtung).

## Fehlerrisiken

- Eine Mieterin, die die Erklärung wörtlich nimmt, rechnet 395.28 statt 392.07 und bestreitet die Abrechnung, oder der Vermieter kann die Differenz nicht erklären, weil auch er nur die Erklärung liest (P-1).
- In anderen Fällen (Auszug mitten im Quartal) wird «45/92 Tage» ohne Beschriftung noch schwerer lesbar (P-2).
- Der Vermieter ändert Rechnungen, die schon in Entwürfen anderer Mieter stecken, und vergisst, diese neu zu erstellen; Sarah Meiers Abrechnung für A2 enthält dann noch den Hauswart ohne Leistungszeitraum (Beobachtung).

## Vorschläge

- **P-1** Reproduktion: Hauswart-Rechnungen von Seepark Residenz 2025 mit Leistungszeitraum je Quartal versehen, Abrechnung 2025 für Nina Brunner erstellen, PDF erstellen, Seite 1: Erklärung unter der Tabelle mit der Hauswart-Zeile vergleichen. Hilfreich: die Erklärung um den Fall ergänzen, z. B. «bei Rechnungen mit Leistungszeitraum: Ihre Mietstage in jedem Leistungszeitraum, gewichtet mit dem Betrag (siehe Zeilen unter der Position)». Die Erklärung nur dann so zu erweitern, wenn eine solche Position vorkommt, hielte das PDF kurz.
- **P-2** Reproduktion wie P-1, Zeilen unter «Hauswart». Hilfreich: die Tage beschriften, z. B. «0 von 90 Tagen in Ihrem Mietverhältnis» oder «Ihre Mietstage 0 von 90».
- **P-3** Reproduktion wie P-1. Hilfreich: eine kurze Einleitung über den Zeilen, etwa «Rechnungen nach Leistungszeitraum:» und «CHF 765.00» oder ein Hinweis, dass die Beträge in CHF sind (die Tabellenüberschrift sagt «(CHF)», die Zeilen stehen aber ausserhalb der Spalten).
- **P-4** Reproduktion wie P-1, 3'060.00 × 82/320 × 50 % ohne Zwischenrundung rechnen. Hilfreich: in der Erklärung ein Satz «Ihr Anteil = Wohnungsanteil × Zeitanteil», dann ist klar, dass mit dem gedruckten Wohnungsanteil gerechnet wird.

## Nicht geprüft

- Ein Leistungszeitraum, der über die Abrechnungsperiode hinausreicht (z. B. 01.10.2024 – 31.12.2024 im Januar 2025 verrechnet): nicht in der Aufgabe, und ich durfte nur die vier genannten Rechnungen ändern.
- Ein Ein- oder Auszug mitten in einem Quartal (Teiltage wie «45/92»): kein solcher Mietvertrag in Seepark Residenz, den ich ändern durfte.
- Abrechnungen der anderen Mieter in Seepark Residenz neu erstellen: Datensätze, die ich nicht angelegt habe, habe ich nicht gelöscht.
- Andere Sprachen und dunkler Modus: das PDF und die Aufgabe betreffen Deutsch.
