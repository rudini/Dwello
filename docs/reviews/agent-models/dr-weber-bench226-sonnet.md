# Dr. Weber – Leistungszeitraum, Hauswart Seepark Residenz (bench226-sonnet)

Desktop 1440 × 900, Maus. Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/dr-weber-bench226-sonnet/ (das PDF liegt dort als nina.pdf, Bilder pdf-1.png/pdf-2.png).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | PDF Abrechnung, Zeile Hauswart | Die Zeile «01.01.2025 – 31.03.2025: 765.00, 0/90 Tage» erklärt nicht, was «0/90» heisst (Mietstage der Mieterin / Tage des Leistungszeitraums). Frau Brunner muss es raten. Auch fehlen Rechnungssteller und Rechnungsdatum bei den Einzelrechnungen. Die Formel darunter ist in kleiner Schrift, ohne Worte. |
| P-2 | Major | PDF, Spalte «Zeitanteil» | Bei Hauswart steht «50.00 %», bei TV, Kaltwasser und Allgemeinstrom «184/365 Tage» (= 50.41 %). Die Kopfzeile nennt 184 von 365 Tagen. Ein genauer Leser fragt, warum der Hauswart 50.00 % hat statt 50.41 %. Die Erklärung (Tage nach Leistungszeitraum) steht nur indirekt in der Fussnote, die Spalten sind unterschiedlich beschriftet. |
| P-3 | Minor | PDF, «Ihr Anteil» Hauswart | Nachrechnen: 3'060.00 × 82/320 = 784.125, × 50 % = 392.0625, also 392.06. Das PDF zeigt 392.07 (es rechnet vom gerundeten Wohnungsanteil 784.13 weiter). Mit den gedruckten Zahlen stimmt 784.13 × 50 % = 392.065 → 392.07, mit den exakten nicht. Die Rundungsregel steht nirgends. |
| P-4 | Minor | PDF, Hauswart | Quartale mit 0 Tagen (Q1, Q2: 0/90, 0/91) werden voll aufgelistet. Das ist nachvollziehbar, aber ohne Hinweis «Mietverhältnis noch nicht begonnen» wirkt es wie ein Fehler. |
| P-5 | Minor | Bildschirm Abrechnung, Positionen | Der Hauswart zeigt «12.81 %» (vorher «12.92 %»), ohne dass der Bildschirm den Leistungszeitraum erwähnt. Das PDF erklärt es, der Bildschirm nicht. Die Spalte heisst «Anteil», im PDF «Zeitanteil» und «Ihr Anteil». |
| P-6 | Nit | Rechnung bearbeiten, Hilfetext Leistungszeitraum | Beispiel «01.10.2024 bis 31.12.2024», während Rechnungen und Beispiele sonst 2025/2026 sind. Der Text ist lang (6 Zeilen) und beginnt mit «Geben Sie ihn an», ohne dass klar ist, worauf sich «ihn» bezieht. |

## Beobachtungen
- Das PDF sagt «Liegenschaft», die App «Gebäude».
- Wizard-Zeitstempel «Entwurf gespeichert, 15:41», die Abrechnung zeigt «16.10.2026, 17:38»: zwei Stunden Unterschied.
- Nach dem Löschen der alten Entwürfe und dem Neuerstellen bekam Frau Brunner die Nummer NK-22222222-2025-0001 (vorher 0003); Nummern werden wiederverwendet. Für eine versendete Abrechnung wäre das heikel.
- Die Seite /statements/new zeigt «Fehler beim Laden der Abrechnung» (nur beim Raten der URL).
- Das Formular «Rechnung bearbeiten» hat das Feld Kategorie in der Zugriffsstruktur ohne Optionen (nur «Kategorie auswählen»), auf dem Bild ist «Hauswart» korrekt gewählt.
- Die Warnung «Rechnung schon abgerechnet» in der Rechnung ist gut: Sie sagt, dass die Entwürfe gelöscht und neu erstellt werden müssen.
- Beim Eintippen in das Datumsfeld direkt nach dem Laden (vor Hydration) ging die Eingabe verloren, der Speichern-Knopf blieb gesperrt. Mit Wartezeit funktionierte es.

## Aufgabe geschafft: teilweise
Leistungszeitraum bei allen vier Rechnungen eingetragen und gespeichert (Q1 01.01.–31.03., Q2 01.04.–30.06., Q3 01.07.–30.09., Q4 01.10.–31.12.2025). Abrechnungen 2025 für Seepark Residenz erstellt (4 Entwürfe). Das PDF habe ich nachgerechnet: Der Zeitanteil 50.00 % ist mit den vier Zeilen und der Formel nachvollziehbar ((765×92/92 + 765×92/92)/3060). Ohne Erklärung von «0/90 Tage» und der Rundung geht es für Frau Brunner nicht ohne Raten, daher teilweise.

## Aufwand
Rund 25 Schritte, etwa 30 Minuten (ein Fehlversuch beim Ausfüllen wegen Hydration, ein Umweg, weil Entwürfe schon existierten).

## Ablauf
1. Rechnungen gefiltert: erwartet vier Facility-Service-Rechnungen 2025; gesehen Q1–Q4 je CHF 765.00.
2. Rechnung bearbeiten: erwartet zwei optionale Felder; gesehen Gruppe «Leistungszeitraum (optional)» mit Beginn/Ende und langem Hilfetext. Erstes Ausfüllen (zu früh) ging verloren; danach gespeichert, Detailseite zeigt «Leistungszeitraum 01.01.2025 – 31.03.2025, Nur die Tage in der Abrechnungsperiode zählen.» Gut.
3. Abrechnungen erstellen: erwartet Neuberechnung; gesehen «Alle Mietverträge haben schon eine Abrechnung» (alte Entwürfe, noch ohne Leistungszeitraum). Die Entwürfe der 4 Mieter gelöscht (Dialog nennt die Folge: «lässt sich nicht rückgängig machen»), Wizard neu: Vorschau 4 Abrechnungen, CHF 8'380.96; erstellt.
4. Detail Nina Brunner: Hauswart 12.81 % / CHF 392.07 (alt 12.92 % / 395.29): Änderung plausibel (Mieterin ab 01.07.).
5. PDF: siehe P-1 bis P-4.

## Verwirrung
- «0/90 Tage», «Zeitanteil» als Prozent oder als Tage, «Wohnungsanteil» vs «Anteil» vs «Ihr Anteil».
- Warum 50.00 % und nicht 184/365.

## Fehlerrisiken
- Wer eine Rechnung ändert, muss Entwürfe selbst löschen; neue Nummern werden wiederverwendet.
- Zu früh getippte Eingaben gehen lautlos verloren.
- Rundung (P-3) kann bei Beanstandung des Mieters zu Rückfragen führen.

## Vorschläge
- P-1: Unter der Zeile eine Kopfzeile «Rechnung, Mietstage / Tage des Leistungszeitraums» und Satz «Mietstage = Tage, an denen Sie die Wohnung gemietet hatten»; Rechnungssteller und Rechnungsdatum je Zeile; Schrift nicht kleiner als die Tabelle.
- P-2: Bei Hauswart zusätzlich «= 184/365 Tage entsprechend» vermeiden; stattdessen in der Spalte einheitlich Prozent mit Tagen darunter, und in der Fussnote erklären, warum der Anteil von Tagen/365 abweichen kann.
- P-3: Rundungsregel in die Fussnote («je Position auf 5 Rappen / 2 Stellen gerundet»); oder exakt rechnen.
- P-4: Zeilen mit 0 Tagen mit «nicht gemietet» markieren.
- P-5: Auf dem Bildschirm unter der Position denselben Rechnungs-Aufstellung zeigen oder auf das PDF verweisen.
- P-6: Beispiel mit 2025, kürzerer Text.

## Nicht geprüft
- Zweite Seite des PDFs (Heizung) inhaltlich nur gelesen, nicht nachgerechnet.
- Keine anderen Gebäude, keine Mobilansicht, keine anderen Sprachen.
- Kein Mieterwechsel-Fall innerhalb eines Quartals (Teilquartal).
