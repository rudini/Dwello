# Dr. Weber, Runde 451: Mieterwechsel A2 (Seepark Residenz), Heizkosten nach Leistungszeitraum und Heizprofil

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack auf http://localhost:3300, Version 0.65.3+3-g5b5dd2f1. Gespeichert habe ich nur in Seepark Residenz: Entwurf NK-22222222-2025-0003 (Nina Brunner) gelöscht, dann mit dem Assistenten NK-22222222-2025-0005 erstellt und ihr PDF erzeugt. Skripte, Screenshots und PDFs liegen in `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/dr-weber-451/`.

Ausgangslage, wie ich sie vorfand: Die Rechnung «Fernwärme Q1 2025» (SR-2025-003, Rechnungsdatum 31.03.2025, CHF 1'520.00) hat keinen Leistungszeitraum mehr («Zuletzt geändert 19.10.2026, 23:01»). Q2 bis Q4 haben je ihr Quartal als Leistungszeitraum. Die Abrechnung von Sarah Meier (NK-…-0002) ist versendet.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungsseite des neuen Entwurfs NK-22222222-2025-0005 (Nina Brunner), Rechnungen unter «Heizung» | Die Bildschirm-Berechnung lässt sich nicht nachrechnen. Dort steht «Fernwärme Q1 2025 – Ohne Leistungszeitraum: CHF 1’520.00, Ihre Mietstage 184 von 365 Tagen der Abrechnungsperiode» und «Ihr Anteil: 1’054.47 × (1’520.00 × 184/365 + 790.00 × 0/91 + 395.00 × 92/92 + 1’410.00 × 92/92) / 4’115.00 = 634.69». Diese Formel ergibt aber 658.89 (62.49 %), nicht 634.69 (60.19 %). Der Betrag stimmt nur mit dem Heizprofil-Anteil von 44.20 %, und den nennt das PDF («Anteil nach Heizprofil: 44.20 %»). Bildschirm und PDF erklären denselben Betrag also unterschiedlich, und die Erklärung auf dem Bildschirm ist falsch. |
| P-2 | Major | Assistent «Abrechnungen erstellen», Schritt 4 «Vorschau», Block «Es gibt schon Abrechnungen», Eintrag Sarah Meier | Dort steht: «Die Abrechnung von Sarah Meier ist schon versendet. Sie verteilt die Heizkosten noch über die ganze Abrechnungsperiode, nicht nach dem Leistungszeitraum der Heizrechnungen.» Das widerspricht ihrem versendeten PDF NK-22222222-2025-0002. Dort ist jede Fernwärme-Rechnung nach ihrem Leistungszeitraum aufgeteilt (Q1 und Q2 «= 100.00 %», Q3 und Q4 «= 0.00 %», Zeitanteil 56.14 %). Die Behauptung über die versendete Abrechnung stimmt also nicht. |
| P-3 | Major | Vorschau (Schritt 4), Eintrag Sarah Meier, zusammen mit dem Block «Heizkosten: Rechnungen ohne Leistungszeitraum» | Der Rat «Prüfen Sie, ob beide Abrechnungen zusammen mehr als die Heizkosten der Wohnung verrechnen. Wenn ja, erstellen Sie für Sarah Meier eine berichtigte Abrechnung.» führt zur falschen Abrechnung. Die Doppelbelastung ist echt: Sarah CHF 591.94 plus Nina neu CHF 634.69 ergeben CHF 1'226.63, die Wohnung trägt aber nur CHF 1'054.47 Heizkosten. Das sind CHF 172.16 zu viel. Die Ursache ist jedoch der fehlende Leistungszeitraum bei Q1, also die Rechnung und Ninas neuer Entwurf. Sarahs Abrechnung ist richtig. Die Vorschau verbindet beide Hinweise nicht, nennt keine Zahl zum Vergleichen (CHF 1'054.47) und sagt nicht, wo ich «beide zusammen» prüfen soll: Ninas Abrechnung gibt es in der Vorschau ja noch gar nicht. |
| P-4 | Minor | Assistent Schritt 5 «Erstellen» und neue Abrechnungsseite NK-…-0005 | Nach der Vorschau taucht der Hinweis auf die Rechnung ohne Leistungszeitraum und auf die Überschneidung mit Sarah Meier nicht mehr auf. Schritt 5 sagt nur «Es wird 1 Nebenkostenabrechnung als Entwurf erstellt.» Auch der neue Entwurf zeigt keinen Hinweis. Ich kann ihn also prüfen und versenden, ohne noch einmal gewarnt zu werden. |
| P-5 | Minor | PDF NK-…-0005 und NK-…-0003, Heizungsblock unter der Position | Das PDF nennt die Heizrechnungen nicht mit Namen. Es steht nur «Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 790.00 …» oder «Rechnung vom 31.03.2025 (Nr. SR-2025-003) ohne Leistungszeitraum, gilt für die ganze Abrechnungsperiode». Die Bildschirmseite nennt dagegen «Fernwärme Q1 2025». Als Mieterin sehe ich nicht, dass die «ganzjährige» Rechnung eine Q1-Rechnung ist, also vor meinem Einzug. Den Fehler aus P-3 kann ich so als Mieterin nicht erkennen. |
| P-6 | Minor | PDF, Zeile «Ihr Anteil» unter Heizung | «Ihr Anteil: 1'054.47 × Zeitanteil (1'520.00 × 44.20 % + …) / 4'115.00 = 634.69»: Das Wort «Zeitanteil» steht da wie ein eigener Faktor. Richtig gelesen heisst es 1'054.47 × (…) / 4'115.00. Auf dem Bildschirm fehlt das Wort. |
| P-7 | Minor | Erster Entwurf NK-…-0003: Bildschirm gegenüber PDF | Der Bildschirm erklärt die Heizung mit Tagen («Ihre Mietstage 0 von 90 Tagen», «92 von 92 Tagen»), das PDF mit Monatsanteilen des Heizprofils («Jul 3.70 %, Aug 3.60 %, Sep 3.70 %; zusammen 11.00 % … = 100.00 %»). Hier ist das Ergebnis gleich, weil der Einzug auf einen Quartalsbeginn fällt. Es sind aber zwei verschiedene Rechenwege für dieselbe Zahl, und der Bildschirm zeigt das Heizprofil nirgends in Monaten. |
| P-8 | Nit | PDF NK-…-0003, Abschnitt «Heiz- und Warmwasserkosten» | «44.20 % für eine Rechnung ohne Leistungszeitraum» steht auch dann da, wenn es keine solche Rechnung gibt (alle vier hatten damals einen Leistungszeitraum). Neben dem Zeitanteil 43.86 % in der Tabelle verwirrt diese zweite, ähnliche Zahl. |

## Beobachtungen

- Nachgerechnet und stimmig. Erster Entwurf NK-…-0003: TV 912 × 1/4 × 184/365 = 114.94; Heizung 1'054.47 × 1'805/4'115 = 462.53; Kaltwasser 266.11, Hauswart 395.29, Allgemeinstrom 64.50; Zwischensumme 1'303.37; 3 % = 39.10; 1'342.47 − 1'440.00 = −97.53, gerundet 97.55. Neuer Entwurf NK-…-0005: 1'054.47 × (1'520 × 44.20 % + 395 + 1'410)/4'115 = 634.69; Zwischensumme 1'475.53; 3 % = 44.27; 1'519.80 − 1'440.00 = 79.80. Das stimmt mit dem Betrag der Vorschau überein («Nina Brunner Wohnung A2 Kosten CHF 1’519.80 Nachzahlung CHF 79.80»). Die Tage stimmen auch: Q1 90, Q2 91, Q3 92, Q4 92 und 184 Mietstage. Ebenso die Summe des Heizprofils: Jul bis Dez = 44.20 %, alle Monate zusammen 100 %.
- Sarah (56.14 %) und Nina (43.86 %) ergaben im alten Stand zusammen genau 100 % der Heizkosten der Wohnung.
- Sarahs versendete Abrechnung zeigt auf dem Bildschirm unter «Heizung» nur die Rechnungsbeträge, ohne Leistungszeitraum und ohne Berechnung. Ihr PDF hat die Berechnung pro Quartal. Bildschirm und PDF derselben Abrechnung zeigen also unterschiedlich viel.
- Der Hinweis auf dem alten Entwurf, «Wählen Sie «Neu berechnen», dann rechnet er die Rechnungen ab, wie sie jetzt sind.», nennt die geänderte Rechnung nicht. Ausserdem holpert das «er».
- Die Heizprofil-Erklärung im Assistenten (Schritt 3) ist lang, aber klar: Zählerstände, Verbrauchsabrechnung.
- Im neuen Entwurf hat sich die Reihenfolge der Positionen geändert (Hauswart vor Kaltwasser), ebenso die Aufzählung unter «Hinweise». Das schadet nicht, fällt beim Vergleichen aber auf.
- Die Nummer springt von 0004 auf 0005, 0003 ist gelöscht. Eine Mieterin, die beide PDFs hat, fragt sich, welches gilt.
- Der Löschdialog ist klar: «Die Abrechnung NK-22222222-2025-0003 von Nina Brunner wird gelöscht. Das lässt sich nicht rückgängig machen.» Danach kam die Meldung «Abrechnung NK-22222222-2025-0003 gelöscht».
- Das PDF NK-…-0005 hat einen QR-Zahlteil über CHF 79.80. Die Hinweise nach Art. 257b Abs. 2 OR und Art. 8 Abs. 1 VMWG sind vorhanden.
- Der Heizungsblock im PDF ist kleiner grauer Fliesstext mit 14 Zeilen. Er ist vollständig, aber mühsam zu lesen (Screenshot `nina-v2-1.png`).

## Aufgabe geschafft: teilweise

Alle Schritte habe ich ausgeführt: alten Entwurf und PDF prüfen, löschen, Assistent, Vorschau, erstellen, neues PDF. Die Aufgabe «jede Zeile nachrechnen» gelingt nur mit dem PDF. Die Bildschirmformel des neuen Entwurfs geht nicht auf (P-1). Was als Nächstes zu tun ist, sagt die Vorschau nicht richtig (P-2, P-3).

## Aufwand

Etwa 30 Minuten, 16 Schritte: 7 Seitenaufrufe, 3 PDF-Downloads, Löschen mit Bestätigung, 5 Assistentenschritte, PDF erstellen. Dazu rund 10 Minuten Nachrechnen von Hand.

## Ablauf

1. Übersicht. Erwartet: Hinweis auf Entwürfe. Gesehen: «6 Nebenkostenabrechnungen sind noch im Entwurf» und eine Frist für Sarah Meier (18.11.2026). Passt.
2. Liste der Abrechnungen. Erwartet: Nina Brunner, A2, ab 01.07. Gesehen: «Nina Brunner NK-22222222-2025-0003 … 01.07.2025 – 31.12.2025, 184 Mietstage, Rückerstattung CHF 97.55, Entwurf». Sarah Meier ist «Versendet» mit 181 Mietstagen. Passt.
3. Entwurf NK-…-0003 geöffnet. Erwartet: nachvollziehbare Positionen. Gesehen: der Hinweis «Rechnungen seit der Abrechnung geändert … 1 Rechnung», die Heizung mit vier Fernwärme-Rechnungen und Tagen (0/90, 0/91, 92/92, 92/92) und die Formel = 462.53. Nachgerechnet: stimmt. Welche Rechnung sich geändert hat, steht nicht da. Ich fand es selbst: Q1 hat keinen Leistungszeitraum mehr.
4. PDF NK-…-0003. Erwartet: dieselbe Rechnung wie am Bildschirm. Gesehen: dieselben Beträge, aber Heizung nach Monatsanteilen des Heizprofils statt nach Tagen (P-7). Keine Rechnungsnamen (P-5). Die Formel enthält das Wort «Zeitanteil» (P-6). Fussnoten verständlich. «44.20 % für eine Rechnung ohne Leistungszeitraum», obwohl es keine solche gibt (P-8).
5. Sarahs versendete Abrechnung und ihr PDF zum Vergleich. Gesehen: das PDF teilt nach Leistungszeitraum, 56.14 %. Der Bildschirm zeigt keine Berechnung.
6. «Abrechnung löschen» auf NK-…-0003. Erwartet: Bestätigung mit Folge. Gesehen: ein Dialog mit Nummer, Name und «lässt sich nicht rückgängig machen». Nach dem Bestätigen die Liste mit «5 Entwurf». Passt.
7. Assistent Schritte 1 bis 3: Periode 01.01.–31.12.2025 vorgeschlagen, Seepark Residenz gewählt, Heizprofil «Heizung + Warmwasser (100%)» vorausgewählt, 3 %.
8. Schritt 4 Vorschau. Erwartet: ein klarer Hinweis, was mit Sarah und den Heizrechnungen los ist. Gesehen: erstens «Heizkosten: Rechnungen ohne Leistungszeitraum … Tragen Sie bei jeder den Leistungszeitraum ein» mit dem Link «Fernwärme Q1 2025. Rechnungsdatum 31.03.2025, CHF 1’520.00». Das ist gut und konkret. Zweitens bei Sarah Meier die Aussage aus P-2 und der Rat aus P-3. Ich verstehe nicht, ob ich die Rechnung korrigieren oder Sarah berichtigen soll. Die beiden Hinweise wirken unabhängig voneinander.
9. Schritt 5, dann «Entwürfe erstellen» (wie aufgetragen, ohne die Rechnung zu korrigieren). Gesehen: «1 Nebenkostenabrechnung ist als Entwurf erstellt.» Keine Warnung mehr (P-4).
10. Neuer Entwurf NK-…-0005. Erwartet: Q1 ganz oder anteilig, nachvollziehbar. Gesehen: Q1 «Ihre Mietstage 184 von 365 Tagen», aber der Betrag passt nicht zu dieser Formel (P-1).
11. «PDF erstellen», dann herunterladen. Gesehen: Q1 «gilt für die ganze Abrechnungsperiode … Anteil nach Heizprofil: 44.20 %». Damit geht die Rechnung auf: 634.69. Nina bezahlt so CHF 172.16 Heizkosten aus Januar bis März, als sie noch nicht dort wohnte, und Sarah hat diese schon bezahlt (P-3).

## Verwirrung

- «Zeitanteil» bei der Heizung: Am Bildschirm heisst es Tage, im PDF Heizprofil-Monate, im Fliesstext «der Anteil nach dem Heizprofil». Was gilt nun?
- «verteilt die Heizkosten noch über die ganze Abrechnungsperiode» (Vorschau, Sarah): Ich sehe in ihrem PDF das Gegenteil.
- «beide Abrechnungen zusammen»: Welche zwei, und womit vergleichen? Die Heizkosten der Wohnung (CHF 1'054.47) stehen in der Vorschau nicht.
- «gilt für die ganze Abrechnungsperiode» bei einer Rechnung vom 31.03.2025: Für eine Mieterin klingt das nach einer Jahresrechnung.
- «Wohnungsanteil» und «Ihr Anteil» sind gut erklärt. «Kosten des Gebäudes» ebenfalls.

## Fehlerrisiken

- Folge ich dem Rat der Vorschau und berichtige Sarahs Abrechnung, solange Q1 keinen Leistungszeitraum hat, verliert eine richtige versendete Abrechnung ihren Q1-Anteil (nur noch 55.80 % statt 100 %). Ninas falscher Anteil bleibt.
- Versende ich NK-…-0005 so, zahlt Nina CHF 172.16 (vor Verwaltungspauschale) für Heizung vor ihrem Einzug. Aus dem PDF kann sie das kaum erkennen (P-5).
- Wer am Bildschirm nachrechnet, kommt auf 658.89 und hält das System für falsch (oder sich selbst) (P-1).

## Vorschläge

- **P-1:** Seepark Residenz, Rechnung «Fernwärme Q1 2025» ohne Leistungszeitraum. Abrechnung für Nina Brunner 2025 erstellen, ihre Seite öffnen und die Zeile unter «Heizung» lesen. Hilfreich wäre, am Bildschirm dieselbe Rechnung wie im PDF zu zeigen: «Ohne Leistungszeitraum: CHF 1’520.00, Anteil nach Heizprofil 44.20 %» und in der Formel «1’520.00 × 44.20 %». Dann geht die Formel auf.
- **P-2:** Wie P-1, im Assistenten bis Schritt 4 gehen und dann Sarahs PDF NK-…-0002 öffnen. Die Aussage nur zeigen, wenn sie stimmt. Oder konkret sagen, was sich unterscheidet, zum Beispiel «Sie rechnet Fernwärme Q1 2025 noch mit dem Leistungszeitraum 01.01.–31.03.2025 ab».
- **P-3:** Wie P-2. Den Hinweis mit der Rechnung ohne Leistungszeitraum verknüpfen, etwa: «Sarah Meier hat die Heizkosten von Fernwärme Q1 2025 schon ganz bezahlt. Tragen Sie bei dieser Rechnung den Leistungszeitraum 01.01.2025 – 31.03.2025 ein, bevor Sie erstellen, sonst bezahlt Nina Brunner einen Teil davon noch einmal.» Und den Betrag nennen, um den beide zusammen die Heizkosten der Wohnung übersteigen.
- **P-4:** Vorschau mit Warnung, dann «Weiter» und «Entwürfe erstellen», dann den neuen Entwurf öffnen. Die Warnung in Schritt 5 und auf dem neuen Entwurf wiederholen, solange die Rechnung keinen Leistungszeitraum hat.
- **P-5:** PDF NK-…-0005 öffnen. In jeder Heizungszeile die Beschreibung der Rechnung nennen («Fernwärme Q1 2025, Rechnung vom 31.03.2025, Nr. SR-2025-003»), wie am Bildschirm.
- **P-6:** PDF, Zeile «Ihr Anteil» unter Heizung. Das Wort «Zeitanteil» aus der Formel nehmen oder als «Zeitanteil = (…) / 4'115.00» schreiben.
- **P-7:** Erster Entwurf (alle Heizrechnungen mit Leistungszeitraum), Bildschirm und PDF nebeneinander. Am Bildschirm ebenfalls die Heizprofil-Anteile zeigen, wie im PDF.
- **P-8:** PDF eines Entwurfs, in dem jede Heizrechnung einen Leistungszeitraum hat. Den Satz «44.20 % für eine Rechnung ohne Leistungszeitraum» nur drucken, wenn es eine solche Rechnung gibt.

## Nicht geprüft

- Den Leistungszeitraum von Q1 habe ich nicht nachgetragen und die Abrechnung nicht neu erstellt. Das gehörte nicht zur Aufgabe. Ob danach alles auf 100 % aufgeht, ist offen.
- «Abrechnung berichtigen» für Sarah habe ich nicht ausgeführt: nicht Teil der Aufgabe, und es hätte eine versendete Abrechnung verändert.
- Andere Heizprofile, einen Einzug mitten im Monat (geteilte Monate) und Sprachen ausser Deutsch habe ich nicht geprüft. Bei diesem Mieterwechsel gab es keine geteilten Monate.
- Die QR-Referenz und die Beträge des Zahlteils habe ich nicht fachlich geprüft (das ist Sache des daten-pruefer).
