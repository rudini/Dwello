# Dr. Weber – Rechnungszeilen unter «Hauswart» im PDF, Abrechnung Nina Brunner 2025 (Runde W11, Wiederholung von #241 P-1)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
App: http://localhost:3300 (Persona-Stack), gespeichert nur in «Seepark Residenz».
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/126557cf-b019-554c-839c-007ca93c5405/scratchpad/dr-weber-w11/` (neues PDF: `pdf-in/nina-new.pdf`, Seite 1 als `nina-0005-page-1.png`; Skripte dieser Runde `r1.mjs` bis `r6.mjs`).

Runde 1 kam nur bis Schritt 3, weil der Demo-Entwurf NK-22222222-2025-0003 von Nina Brunner den Assistenten blockierte. Der Auftraggeber hat ihn danach per SQL entfernt.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Zeilen unter «Hauswart» mit Leistungszeitraum | Nur die Zeile ohne Leistungszeitraum nennt ihre Rechnung («Hauswartung Q3 2025»). Die drei anderen Zeilen nennen nur Zeitraum und Betrag, und alle Beträge sind CHF 765.00. Q1 und Q2 ordne ich über «Q1 = Januar bis März» zu. Das ist ein Schluss, kein Abgleich mit dem Wortlaut des Belegs. Bei Q4 widerspricht der Zeitraum 01.10.2025 – 31.01.2026 der Aufschrift «Q4 2025». Ich ordne die Zeile nur über den Beginn 01.10. zu. Auf dem Bildschirm nennt dagegen jede Zeile ihre Rechnung. |
| P-2 | Minor | PDF, Zeile ohne Leistungszeitraum | Die Zeile beginnt mit «Ohne Leistungszeitraum:», dann folgen Betrag und Mietstage. Der Name des Belegs hängt in Klammern am Ende, «(Rechnung «Hauswartung Q3 2025»)», und bricht auf die nächste Zeile um. Er wirkt wie ein Nachtrag. Auch steht nirgends, dass die Rechnung deshalb auf die ganze Abrechnungsperiode verteilt wird. «184 von 365 Tagen der Abrechnungsperiode» zeigt es nur indirekt. |
| P-3 | Nit | PDF, Zeilen Q3 und Q4 | Das gleiche Muster «(Rechnung …)» bedeutet einmal den Betrag («(Rechnung CHF 765.00)», Zeile Q4) und einmal den Namen («(Rechnung «Hauswartung Q3 2025»)», Zeile Q3). Beim Lesen stolpere ich darüber. |

## Beobachtungen

- **Das Kernziel von #241 P-1 ist erreicht:** Die Zeile ohne Leistungszeitraum kann ich jetzt direkt dem Beleg «Hauswartung Q3 2025» zuordnen, ohne Ausschluss. Jede der vier Zeilen passt zu genau einem Beleg, keine bleibt übrig, keine doppelt.
- Die Beträge stimmen. Q1 hat 90 Tage, Q2 91 Tage. Für Q4 gilt 765.00 × 92/123 = 572.20, Oktober bis Dezember sind 92 Tage, der Leistungszeitraum hat 123 Tage. Die Kosten des Gebäudes sind 3 × 765.00 + 572.20 = 2'867.20, der Wohnungsanteil 2'867.20 × 82/320 = 734.72. In der Rechenzeile ergibt (385.64 + 572.20) / 2'867.20 = 33.41 %, × 734.72 = 245.45. Alles nachgerechnet, alles stimmt.
- Die 123 Tage für Q4 stehen weiterhin nirgends im PDF (#241 P-2). Ich musste sie wieder selbst zählen.
- Zeile Q4 bricht weiterhin in «Ihre / Mietstage 92 von 92 Tagen» um (#241 P-5). Neu bricht auch die Zeile Q3 um, mitten im Belegnamen: «(Rechnung / «Hauswartung Q3 2025»)» (Seite 1, Screenshot `nina-0005-page-1.png`).
- Die Detailseite der Abrechnung zeigt jede Rechnung als Link mit Namen, z. B. «Hauswartung Q4 2025 – Leistungszeitraum 01.10.2025 – 31.01.2026 (Rechnung CHF 765.00), davon … CHF 572.20, Ihre Mietstage 92 von 92 Tagen». Für mich als Vermieter ist das eindeutig.
- Der Assistent bietet in Schritt 4 jetzt «Die Abrechnungen trotzdem erstellen» an. Dabei steht der Hinweis «Für Seepark Residenz gibt es in dieser Abrechnungsperiode schon 3 Nebenkostenabrechnungen» mit Link. Darunter folgt «Nina Brunner Wohnung A2 Kosten CHF 1'191.79 Rückerstattung CHF 248.25». Klar geführt.
- Nach «Entwürfe erstellen» muss ich auf der Detailseite zuerst «PDF erstellen» drücken, erst dann erscheint «PDF herunterladen». In der Liste heisst es entsprechend «PDF noch nicht erstellt». Mein erstes Skript wartete vergeblich auf einen Download. Als Mensch hätte ich den Knopf gesehen.
- Die Uhrzeiten weichen weiter voneinander ab: Der Assistent zeigt «Entwurf gespeichert, 03:48», die Abrechnung «Erstellt 17.10.2026, 05:49». Das sind zwei Stunden, wie in den Runden 241 und W11-1.
- Im Datumsfeld des Assistenten steht weiterhin «Beispiel: 31.12.2026», obwohl die Periode 2025 vorgeschlagen ist. Das ist harmlos.

## Aufgabe geschafft: ja

Abrechnung 2025 für Nina Brunner erstellt (NK-22222222-2025-0005), PDF erstellt und heruntergeladen, alle Zeilen unter «Hauswart» einem Beleg zugeordnet. Bei Q1, Q2 und Q4 musste ich dafür Schlüsse ziehen (P-1).

## Aufwand

Etwa 8 Minuten, 9 Schritte: 4 Rechnungen prüfen, Assistent Schritte 1 bis 5, Entwurfsliste, Detailseite, «PDF erstellen», Download, PDF lesen und nachrechnen. Ein Fehlversuch beim Download, weil das PDF noch nicht erstellt war.

## Ablauf

1. **Rechnungen prüfen (nicht neu bearbeiten).** Erwartet: die Stände aus Runde 1. Gesehen: Filter Seepark Residenz, Hauswart, 2025 ergibt 4 Rechnungen von Facility Service AG. Die Detailseiten zeigen: Q1 SR-2025-002, Leistungszeitraum 01.01.2025 – 31.03.2025. Q2 SR-2025-005, 01.04.2025 – 30.06.2025. Q3 SR-2025-009, kein Leistungszeitraum, nur das Rechnungsdatum 30.09.2025. Q4 SR-2025-012, 01.10.2025 – 31.01.2026. Alle mit CHF 765.00. Q1, Q2 und Q4 zeigen «Abrechnungen nicht aktuell» (`r1-filter.png`, `r1-invoice-1.png` … `-4.png`). Wie erwartet.
2. **Assistent, Schritt 1.** Erwartet: Periode 2025. Gesehen: 01.01.2025 – 31.12.2025 vorgeschlagen (`r2-wizard-1.png`).
3. **Schritt 2.** Seepark Residenz gewählt: «15 Rechnungen in der Abrechnungsperiode, 4 Wohnungen» (`r2-wizard-2.png`).
4. **Schritt 3.** Heizung + Warmwasser, Verwaltungspauschale 3 %, unverändert (`r2-wizard-3.png`).
5. **Schritt 4.** Erwartet: diesmal Nina Brunner. Gesehen: «Anzahl Abrechnungen 1», CHF 1'191.79, Hinweis auf die schon vorhandenen 3 Abrechnungen, Häkchen «Die Abrechnungen trotzdem erstellen», Liste «Nina Brunner Wohnung A2 … Rückerstattung CHF 248.25» (`r2-wizard-4.png`). Häkchen gesetzt.
6. **Schritt 5.** «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt. Es wird nichts verschickt.» Mit «Entwürfe erstellen» erschien «1 Nebenkostenabrechnung ist als Entwurf erstellt.», dazu die Links «Entwürfe ansehen», «Alle als ZIP herunterladen» und «Weitere Abrechnungen erstellen» (`r3-wizard-5.png`, `r4-after-create.png`).
7. **Entwürfe ansehen.** In der Liste stehen 4 Entwürfe. Meiner ist «Nina Brunner NK-22222222-2025-0005, 01.07.2025 – 31.12.2025, 184 Mietstage, Rückerstattung CHF 248.25, PDF noch nicht erstellt» (`r5-drafts.png`).
8. **Detailseite.** Hauswart: Kosten des Gebäudes CHF 2'867.20, Zeitanteil 33.41 %, Betrag CHF 245.45. Darunter stehen die vier Rechnungen als Links mit Namen, dazu die Rechenzeile (`r5-nina-new.png`). Mein erster Download-Versuch scheiterte, weil es noch kein PDF gab. «PDF erstellen» gedrückt, danach erschien «PDF herunterladen» und lieferte die Datei `NK-22222222-2025-0005.pdf` (`r6-after-pdf.png`).
9. **PDF als Nina Brunner lesen.** Erwartet: jede Zeile genau einem Beleg zuordenbar. Gesehen unter «Hauswart»:
   - «Leistungszeitraum 01.01.2025 – 31.03.2025: CHF 765.00, Ihre Mietstage 0 von 90 Tagen» → Beleg Q1, über das Quartal erschlossen.
   - «Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 765.00, Ihre Mietstage 0 von 91 Tagen» → Beleg Q2, ebenso.
   - «Ohne Leistungszeitraum: CHF 765.00, Ihre Mietstage 184 von 365 Tagen der Abrechnungsperiode (Rechnung «Hauswartung Q3 2025»)» → Beleg Q3, wörtlich.
   - «Leistungszeitraum 01.10.2025 – 31.01.2026 (Rechnung CHF 765.00), davon 01.10.2025 – 31.12.2025: CHF 572.20, Ihre Mietstage 92 von 92 Tagen» → Beleg Q4, nur über den Beginn 01.10., das Ende 31.01.2026 passt nicht zu «Q4».
   - «Ihr Anteil: 734.72 × (765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 184/365 + 572.20 × 92/92) / 2'867.20 = 245.45»; nachgerechnet, stimmt.

## Verwirrung

- «Ohne Leistungszeitraum»: Als Mieterin halte ich einen Beleg «Hauswartung Q3 2025» in der Hand, der für mich klar einen Zeitraum hat. Die Zeile sagt mir, er habe keinen, aber nicht, was daraus folgt (P-2).
- «(Rechnung CHF 765.00)» gegenüber «(Rechnung «Hauswartung Q3 2025»)»: dasselbe Wort in Klammern, zwei Bedeutungen (P-3).
- Warum nennt nur eine Zeile ihre Rechnung? Ich würde vermuten, dass die anderen drei absichtlich anonym sind (P-1).

## Fehlerrisiken

- Eine Mieterin mit dem Beleg «Hauswartung Q4 2025» sieht im PDF den Zeitraum bis 31.01.2026. Sie könnte annehmen, der Vermieter habe sich vertan, und die Abrechnung beanstanden. Ohne den Namen des Belegs in der Zeile muss sie nachfragen.
- Q3 ohne Leistungszeitraum wird über das ganze Jahr verteilt. Nina zahlt so nur 184/365 der Hauswartung Juli bis September, obwohl sie das ganze Quartal dort wohnte. Die Vormieterin trägt den Rest. Das liegt an den Daten des Vermieters, nicht an Dwello. Die Zeile macht es aber nicht sichtbar: «auf die ganze Abrechnungsperiode verteilt» würde einen aufmerksamen Vermieter darauf stossen, dass er den Leistungszeitraum nachtragen sollte.

## Vorschläge

- **P-1.** Reproduktion: Seepark Residenz, Hauswart-Rechnungen Q1, Q2 und Q4 mit Leistungszeitraum, Q3 ohne. Abrechnung 2025 für Nina Brunner erstellen, «PDF erstellen», PDF öffnen, Zeilen unter «Hauswart». Was helfen würde: Jede Zeile beginnt mit dem Namen der Rechnung, wie auf dem Bildschirm, z. B. «Hauswartung Q4 2025, Leistungszeitraum 01.10.2025 – 31.01.2026: …». Dann ordnet die Mieterin über den Wortlaut zu und nicht über Schlüsse.
- **P-2.** Reproduktion: wie P-1, dritte Zeile. Was helfen würde: den Namen nach vorne stellen und die Folge nennen, z. B. «Hauswartung Q3 2025, ohne Leistungszeitraum, auf die ganze Abrechnungsperiode verteilt: CHF 765.00, Ihre Mietstage 184 von 365 Tagen».
- **P-3.** Reproduktion: wie P-1, Zeilen drei und vier. Was helfen würde: Ist der Name vorne (P-1), fällt «(Rechnung «…»)» weg. In Zeile Q4 «(Rechnungsbetrag CHF 765.00)» statt «(Rechnung CHF 765.00)».

## Nicht geprüft

- Wie das PDF mehrere Rechnungen ohne Leistungszeitraum in einer Position zeigt: In Seepark gibt es nur eine.
- Ob die Abrechnungen der anderen Mieter (Sarah Meier, Marco Bernasconi, Thomas Weber) die geänderten Leistungszeiträume schon spiegeln: Diese Entwürfe stammen nicht von mir, ich habe sie nicht angerührt.
- Die Beträge über «Hauswart» hinaus und die QR-Rechnung: nicht Teil des Auftrags (Rückerstattung, daher ohnehin kein Einzahlungsschein).
- PDF in anderen Sprachen: nicht verlangt.
