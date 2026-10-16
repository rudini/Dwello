# Persona-Lauf: Dr. Weber – Issue 229, Runde 2 (Heizkostenanteil bei kurzer Periode)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: http://localhost:3300 (Version 0.4.11+968-g23a94250), Demo-Daten.
Aufgabe: Für «Seepark Residenz» die Nebenkostenabrechnungen 01.01.2025 – 30.09.2025 mit dem angebotenen Heizprofil als Entwurf erstellen, dann die Abrechnung von Sarah Meier (Auszug 30.06.2025) als PDF erstellen, herunterladen und lesen; den Heizkostenanteil aus dem PDF nachrechnen. Bewertet wird nur die Erklärung des Heizkostenanteils bei einer Periode kürzer als ein Jahr.

Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/weber-issue-229-2/` (PDF und Textauszug in `pdf/`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Seite 2, «Heiz- und Warmwasserkosten» | Die 66.80 % der Abrechnungsperiode lassen sich aus dem PDF nicht nachprüfen: Die Monate der Periode (Jan – Sep) und die Anteile von Jul, Aug, Sep stehen nirgends. Ich kann 55.80 / 66.80 = 83.53 % rechnen, aber den Nenner muss ich glauben. |
| P-2 | Minor | PDF, Seite 2 | Der Satz nach den Monaten hört bei «… zusammen 66.80 %» auf (ohne Punkt) und sagt nicht, was daraus folgt. Den Schritt «55.80 % von 66.80 % = 83.53 %» muss die Mieterin selbst erraten; der Ergebnis-Satz steht davor, nicht danach. |
| P-3 | Nit | PDF, Seite 1, Kostenübersicht | In der Zeile «Heizung» steht als Zeitanteil «83.53 %» statt «181/273 Tage»; die Fussnote sagt nur «bei Heizkosten der Anteil nach dem Heizprofil», ohne Hinweis, dass die Herleitung auf Seite 2 steht. |
| P-4 | Nit | PDF, Seite 2 | Begriffe passen nicht ganz zusammen: «Heizkosten Ihrer Wohnung in der Abrechnungsperiode» meint die Spalte «Wohnungsanteil» (693.16) von Seite 1; die Überschrift sagt «Heiz- und Warmwasserkosten», die Kategorie heisst nur «Heizung». |

## Beobachtungen

- Schritt 2 des Assistenten zeigte bei «Seepark Residenz» «12 Rechnungen in der Abrechnungsperiode», die Vorschau in Schritt 4 «11 Rechnungen vom 31.01.2025 bis 30.09.2025». Welche Zahl stimmt, weiss ich nicht.
- Beim ersten Klick auf «PDF erstellen» (sofort nach dem Laden der Seite) sah ich nach 5 Sekunden keine Reaktion: Der Knopf hiess weiter «PDF erstellen», keine Meldung. Beim zweiten Versuch (etwas später geklickt) erschien «PDF erstellt» und der Link «PDF herunterladen». Im Verlauf steht nur ein «PDF erstellt». Möglicherweise war die Seite beim ersten Klick noch nicht bereit.
- Die Detailseite zeigt für Heizung «Anteil 21.41 %», das PDF «Wohnungsanteil 693.16» und «Zeitanteil 83.53 %». Wer Bildschirm und PDF vergleicht, findet die 21.41 % im PDF nicht (es ist 82/320 × 181/273 bzw. 82/320 × 83.53 %, kombiniert). Auf der Detailseite fehlt jede Erklärung zum Heizprofil-Anteil.
- Das PDF sagt «Liegenschaft» und «Kosten Liegenschaft», die App überall «Gebäude».
- Die Detailseite nennt die Mietstage (181), aber nicht das Datum des Auszugs; das steht nur im PDF («Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 30.06.2025»).
- Die Zahlungsfrist 15.11.2026 ist im Entwurf schon gesetzt, obwohl noch nichts versendet ist.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 12 Schritte: Assistent (5 Schritte), Liste, Detailseite, PDF erstellen (2 Versuche), herunterladen, lesen und nachrechnen.

## Ablauf

1. **Übersicht.** Erwartet: Hinweis auf fällige Abrechnungen. Gesehen: «Nebenkostenabrechnungen erstellen – Noch nicht abgerechnet: Alpenblick, Seepark Residenz», Link «Abrechnungen erstellen». Passt.
2. **Schritt 1 Abrechnungsperiode.** Erwartet: Beginn/Ende frei wählbar. Gesehen: vorgeschlagen 01.01.2025 – 31.12.2025; Ende auf 30.09.2025 geändert, «Weiter» nahm das Datum an. Passt.
3. **Schritt 2 Gebäude.** «Seepark Residenz, 12 Rechnungen in der Abrechnungsperiode, 4 Wohnungen» angekreuzt.
4. **Schritt 3 Heizprofil.** Erwartet: ein Profil zur Auswahl mit seinen Monatswerten. Gesehen: vorgewählt «Heizung + Warmwasser (100%)», darunter die Monatsanteile (Jan 13.6 %, Feb 12.1 %, Mär 11.5 %, Apr 9.3 %, Mai 5.6 %, Jun 3.7 %, Jul 3.7 %, Aug 3.6 %, Sep 3.7 %, Okt 9.5 %, Nov 10.7 %, Dez 13 %). Ich habe diese Werte notiert; ohne sie hätte ich das PDF später nicht ganz nachrechnen können. Verwaltungspauschale 3 % belassen.
5. **Schritt 4 Vorschau.** 4 Abrechnungen, Heizprofil «Heizung + Warmwasser», Sarah Meier Wohnung A2: Kosten CHF 1’467.27, Nachzahlung CHF 147.25.
6. **Schritt 5 Erstellen.** «Entwürfe erstellen» – Meldung «4 Nebenkostenabrechnungen sind als Entwurf erstellt.», Link «Entwürfe ansehen». Passt.
7. **Liste und Detailseite Sarah Meier (NK-22222222-2025-0004).** Erwartet: Hinweis auf das Heizprofil. Gesehen: Zeile «Heizprofil: Heizung + Warmwasser» unter der Kostenaufstellung – derselbe Name wie im Assistenten. Heizung «Pro Fläche (m²), CHF 2’705.00, 21.41 %, CHF 579.02»; «181 Mietstage».
8. **PDF erstellen.** Erster Klick: keine sichtbare Reaktion (siehe Beobachtungen). Zweiter Klick: Meldung «PDF erstellt», Knopf wird zum Link «PDF herunterladen». Download `abrechnung-1b10a47e-….pdf`, 2 Seiten.
9. **PDF Seite 1.** Kopf: «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 30.06.2025 (181 Mietstage von 273 Tagen)» – klar. Kostenübersicht: Heizung 2'705.00, Verteilschlüssel «82.00 / 320.00 m²», Wohnungsanteil 693.16, Zeitanteil 83.53 %, Ihr Anteil 579.02. Nachgerechnet: 2'705.00 × 82/320 = 693.16; die übrigen Zeilen mit 181/273 stimmen (z. B. Hauswart 588.09 × 181/273 = 389.91).
10. **PDF Seite 2, «Heiz- und Warmwasserkosten».** Gelesen: «Heizkosten nach Heizprofil «Heizung + Warmwasser»: 83.53 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode» und «Anteile der Monate Ihres Mietverhältnisses: Jan 13.60 %, Feb 12.10 %, Mär 11.50 %, Apr 9.30 %, Mai 5.60 %, Jun 3.70 %; zusammen 55.80 %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen 66.80 %» (ohne Schlusspunkt).
    Nachgerechnet: Summe Jan–Jun = 55.80 % (stimmt). 55.80 / 66.80 = 0.83533 → 83.53 % (stimmt). 693.16 × 0.83533 = 579.02 (stimmt, = «Ihr Anteil»). Die 66.80 % konnte ich nur mit meinen Notizen aus dem Assistenten (Jul 3.7 + Aug 3.6 + Sep 3.7 = 11.0; 55.8 + 11.0 = 66.8) prüfen; eine Mieterin hat diese Werte nicht.
    Erwartet: eine Rechnung in der Reihenfolge Monate → Summe → Anteil, mit Nennung der Periodenmonate. Gesehen: Ergebnis zuerst, Herleitung danach, der letzte Schritt (Teilen) fehlt.

## Verwirrung

- «Die Monate der Abrechnungsperiode haben im Heizprofil zusammen 66.80 %»: Welche Monate? Die Periode ist im Kopf genannt (01.01. – 30.09.), aber ein Laie verbindet das nicht ohne Weiteres; und warum ist das wichtig? Dass durch diese Zahl geteilt wird, steht nicht da.
- «83.53 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode»: «Heizkosten Ihrer Wohnung» – ist das der «Wohnungsanteil» auf Seite 1? Erst nach Nachrechnen klar.
- «Zeitanteil 83.53 %» in einer Spalte, in der sonst Tage stehen.

## Fehlerrisiken

- Eine Mieterin, die die 66.80 % nicht nachprüfen kann, wird bei einem Auszug Mitte Jahr misstrauisch: Sie trägt 83.53 % der Heizkosten für 66 % der Tage. Ohne nachvollziehbaren Nenner führt das zu Rückfragen oder Einsprachen.
- Liest jemand «55.80 %» als ihren Anteil an den Heizkosten (statt 83.53 %), erscheint der Betrag 579.02 zu hoch.

## Vorschläge

- **P-1** Reproduktion: Abrechnungen «Seepark Residenz» 01.01.2025 – 30.09.2025 mit «Heizung + Warmwasser» erstellen, PDF von Sarah Meier, Seite 2. Hilfreich: auch die Monate der Periode mit ihren Anteilen aufzählen, z. B. «Monate der Abrechnungsperiode: Jan 13.60 % … Sep 3.70 %; zusammen 66.80 %.» Alternativ nur die nicht gemieteten Monate (Jul 3.70 %, Aug 3.60 %, Sep 3.70 %) nennen.
- **P-2** Reproduktion wie P-1. Hilfreich: den Rechenschritt ausschreiben und mit Punkt schliessen, z. B. «Ihr Anteil: 55.80 % ÷ 66.80 % = 83.53 % der Heizkosten Ihrer Wohnung.» und diesen Satz ans Ende stellen.
- **P-3** Reproduktion wie P-1, Seite 1, Zeile «Heizung». Hilfreich: in der Fussnote «… nach dem Heizprofil (siehe «Heiz- und Warmwasserkosten» auf Seite 2)».
- **P-4** Reproduktion wie P-1. Hilfreich: «83.53 % Ihres Wohnungsanteils an den Heizkosten (CHF 693.16)» – derselbe Begriff und Betrag wie in der Tabelle.

## Nicht geprüft

- Andere Heizprofile (Mittelland, Bergregion, Tessin): Aufgabe verlangte das angebotene Profil; Heizprofile durften nicht geändert werden.
- Die Abrechnungen der anderen drei Mietverträge (Nina Brunner, Thomas Weber, Marco Bernasconi) habe ich nicht als PDF gelesen; nur Sarah Meier war verlangt.
- Versenden und Löschen: ausdrücklich ausgeschlossen.
- Ob die Mietstage- und Heizprofil-Rechnung rechtlich die richtige Methode ist (Art. 8 VMWG), kann ich als Nutzerin nicht beurteilen.
