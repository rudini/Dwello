# Dr. Weber: Rechnung korrigieren und bezahlte Abrechnung 2024 berichtigen (w2e)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Gebäude: Seepark Residenz (gespeichert nur dort). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/75e5ca16-73bb-53c3-8081-5e81a17d9c45/scratchpad/weber-w2e/`.

Was ich verändert habe: Rechnung «Fernwärme Q1 2024» (ewl Energie Wasser Luzern, SR-2024-003) von CHF 1'480.00 auf CHF 1'280.00 gesenkt; Abrechnung NK-22222222-2024-0001 (Thomas Weber, A1, bezahlt) ersetzt; berichtigte Abrechnung NK-22222222-2024-0004 erstellt, PDF erstellt, als versendet markiert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF der berichtigten Abrechnung | «Rückerstattung vor Rundung 43.77 / Rundung auf 5 Rappen + 0.03 / Rückerstattung 43.80»: auf 5 Rappen gerundet wären es 43.75. Die +0.03 stimmen nur, wenn man die Gesamtrückerstattung 114.02 → 114.05 rundet und 70.25 abzieht; das steht nirgends. Für den Mieter sieht es nach einem Rechenfehler aus. |
| P-2 | Minor | PDF der berichtigten Abrechnung | Das PDF sagt nicht, was berichtigt wurde und warum (Heizung: Kosten Liegenschaft 4'060.00 → 3'860.00). Der Titel bleibt «Nebenkostenabrechnung», nicht «Berichtigte Nebenkostenabrechnung». Thomas Weber muss die beiden PDFs selbst Zeile für Zeile vergleichen. |
| P-3 | Minor | Abrechnungsdetail NK-…-0001 (ersetzt) | Auf der ersetzten Abrechnung steht weiter das gelbe Feld «Rechnungen seit der Abrechnung geändert … berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung». Diesen Knopf gibt es dort nicht mehr, und die Berichtigung ist schon gemacht. |
| P-4 | Minor | Abrechnungsdetail NK-…-0001 (ersetzt) | Im Abschnitt «Zahlung» steht weiter «Sie erstatten dem Mieter CHF 70.25 zurück.» (Gegenwart), obwohl die Abrechnung bezahlt und ersetzt ist. Man könnte meinen, die 70.25 seien noch offen. |
| P-5 | Minor | Bestätigung «Abrechnung berichtigen» / Rechnung bearbeiten | Die Reihenfolge widerspricht sich: Beim Bearbeiten der Rechnung heisst es «Ändern Sie diese Rechnung … berichtigen Sie mit «Abrechnung berichtigen»», also zuerst die Rechnung. Die Bestätigung sagt «Danach können Sie Vertragsdaten und Rechnungen korrigieren», also zuerst ersetzen. Es funktionierte in meiner Reihenfolge, aber ich war unsicher, ob ich etwas falsch gemacht hatte. |
| P-6 | Nit | Bestätigung «Abrechnung berichtigen» | Der Titel lautet «Abrechnung berichtigen», der Knopf «Abrechnung ersetzen». Der Satz «wird ersetzt. Sie bleibt unverändert erhalten.» liest sich zuerst wie ein Widerspruch. Gemeint ist: sie gilt nicht mehr, bleibt aber gespeichert. |
| P-7 | Nit | PDF der berichtigten Abrechnung | «Teilen Sie uns dafür Ihre IBAN mit, falls Sie das noch nicht getan haben» wirkt bei einer Berichtigung seltsam: Die 70.25 wurden ihm schon überwiesen. Die Zeile «Bereits zurückerstattet auf NK-…-0001» nennt kein Datum (die Bestätigung im Programm nannte den 05.05.2025). Seite 2 enthält nur noch die «Hinweise». |

## Beobachtungen

- Die Warnung beim Bearbeiten der Rechnung ist gut: «Rechnung schon abgerechnet» erscheint schon vor dem Speichern und sagt richtig, dass sich bestehende Abrechnungen nicht von selbst ändern. Es fehlt ein Link zu den betroffenen Abrechnungen. Nach dem Speichern sagt «Abrechnungen nicht aktuell» nur noch «Versendete Abrechnungen berichtigen Sie …», obwohl vorher «versendete oder bezahlte» stand.
- Nach dem Speichern der Rechnung kam keine Meldung «Gespeichert». Nur der neue Betrag und «Zuletzt geändert» zeigten, dass es geklappt hatte.
- Die Abrechnung zeigt nach der Rechnungsänderung den Hinweis «1 Rechnung … erfasst, geändert oder gelöscht», sagt aber nicht welche. Ich wusste es, ein anderer Vermieter nach Monaten vielleicht nicht.
- Auf der ersetzten Abrechnung bleibt der Kasten «Weitere Aktionen» leer stehen. Der Verlauf hält das Ersetzen nicht fest (nur Erstellt/PDF/Versendet/Bezahlt).
- Die Rechnungslinks unter der ersetzten Abrechnung zeigen den alten Betrag (1'480.00), führen aber zur Rechnung mit dem heutigen Stand (1'280.00). Das ist nachvollziehbar, wird aber nirgends erklärt.
- In der berichtigten Abrechnung steht Heizung jetzt nach Kaltwasser, in der alten davor. Die Reihenfolge der Kategorien ist also nicht fest.
- In der Übersicht der Abrechnungen hat «Ersetzt» keine eigene Kachel (10 + 1 + 6 + 0 = 17 von 20 Abrechnungen). In der Liste ist die ersetzte Abrechnung mit dem Status «Ersetzt» richtig beschriftet, die neue Abrechnung aber nicht als Berichtigung erkennbar (nur «Entwurf», Betrag 43.80).
- Die Suche `?q=Weber` filterte nicht. Wahrscheinlich heisst der URL-Parameter anders; über das Suchfeld habe ich es nicht versucht.
- Der Verlauf der alten Abrechnung zeigt «Erstellt 17.10.2026», aber «Versendet 14.04.2025». Das liegt an den Demodaten.
- Der Text zur Verjährung (Art. 128 Ziff. 1 OR, fünf Jahre, Beginn nicht einheitlich geklärt, im Zweifel beraten) ist vorsichtig und korrekt formuliert. Für meinen Fall, eine Rückerstattung an den Mieter mit Abrechnung vom 14.04.2025, ist er ohnehin unkritisch. Er unterscheidet aber nicht, ob der Vermieter nachfordert oder zurückzahlt.
- Das alte PDF NK-…-0001 bleibt unverändert, wie die Bestätigung es versprach (archivtauglich). Es trägt keinen Vermerk «ersetzt». Das ist vertretbar, weil das neue PDF die Ungültigkeit erklärt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten Bedienzeit, 9 Schritte: Abrechnung öffnen, Rechnung öffnen, Rechnung bearbeiten und speichern, Abrechnung erneut öffnen, «Abrechnung berichtigen», «Abrechnung ersetzen», «Berichtigte Abrechnung erstellen», «PDF erstellen», «Als versendet markieren». Dazu kam das Nachrechnen.

## Ablauf

1. **Bezahlte Abrechnungen** (`/statements?status=paid`). Erwartet: Thomas Weber, 2024, bezahlt. Gesehen: NK-22222222-2024-0001, Rückerstattung CHF 70.25, Bezahlt.
2. **Abrechnung 0001 geprüft.** Nachgerechnet: 228.00 + 637.50 + 862.75 + 428.19 + 105.46 = 2'261.90; 3 % = 67.86; 2'329.76; 2'400.00 − 2'329.76 = 70.24, gerundet 70.25. Alles stimmt, auch im PDF.
3. **Rechnung Fernwärme Q1 2024 → Bearbeiten.** Erwartet: ein Hinweis, dass sie schon abgerechnet ist. Gesehen: gelbes Feld «Rechnung schon abgerechnet» mit dem Weg über «Abrechnung berichtigen». Gut.
4. **Betrag 1480.00 → 1280.00, «Änderungen speichern».** Erwartet: eine Bestätigung. Gesehen: Rückkehr zur Rechnung mit CHF 1'280.00 und dem Hinweis «Abrechnungen nicht aktuell», einschliesslich Verjährung. Keine Meldung «Gespeichert».
5. **Abrechnung 0001 erneut geöffnet.** Erwartet: ein Hinweis auf die geänderte Rechnung. Gesehen: «Rechnungen seit der Abrechnung geändert». Die Beträge sind richtigerweise unverändert.
6. **«Abrechnung berichtigen».** Erwartet: die Folgen, die Anrechnung der Zahlung und die Verjährung. Gesehen: ein Dialog (Screenshot `09-confirm-dialog.png`, roter Knopf «Abrechnung ersetzen»). Er nennt die Nummer, «bleibt unverändert erhalten», die Anrechnung der CHF 70.25 vom 05.05.2025, den Satz «Senden Sie sie dem Mieter», die Verjährung und «Das lässt sich nicht rückgängig machen». Inhaltlich vollständig, sprachlich siehe P-5 und P-6.
7. **«Abrechnung ersetzen».** Gesehen: Status «Ersetzt», blaues Feld «Diese Abrechnung ist ersetzt» mit dem Knopf «Berichtigte Abrechnung erstellen». Das alte gelbe Feld bleibt stehen (P-3), dazu der Zahlungssatz in der Gegenwart (P-4).
8. **«Berichtigte Abrechnung erstellen».** Erwartet: ein Entwurf mit dem neuen Heizungsbetrag. Gesehen: NK-22222222-2024-0004, Entwurf, «Ersetzt die Abrechnung NK-22222222-2024-0001 vom 14.04.2025» (verlinkt). Heizung 3'860.00 → 820.25. Nachgerechnet: 3'860 × 68/320 = 820.25; Zwischensumme 2'219.40; 3 % = 66.58; 2'285.98; 2'285.98 − 2'400.00 + 70.25 = −43.77, also Rückerstattung 43.77, gerundet 43.80 (P-1). Probe: 70.25 + 43.80 = 114.05 = Gesamtrückerstattung 114.02, zugunsten des Mieters gerundet. Bei anderen Abrechnungen fand ich Rundungen von +0.04 und −0.03; die Regel ist also offenbar «zugunsten des Mieters», nicht «nächste 5 Rappen». Die ersetzte Abrechnung zeigt jetzt «Ersetzt durch NK-22222222-2024-0004» (verlinkt).
9. **«PDF erstellen», PDF geladen** (Rendering `15-corrected-pdf-1.png`). Gesehen: fett unter dem Titel «Diese Abrechnung ersetzt die Abrechnung NK-22222222-2024-0001 vom 14.04.2025. Diese gilt nicht mehr.» Unklar ist für Thomas Weber also nicht, ob die alte noch gilt. Kasten «Rückerstattung CHF 43.80 – Wir überweisen Ihnen den Betrag bis 16.11.2026». Damit ist klar, was er zurückbekommt. Kurzformel: «Ihre Nebenkosten 2'285.98 – Geleistete Akontobeiträge 2'400.00 + bereits zurückerstattet 70.25, auf 5 Rappen gerundet». In der Tabelle die Zeile «Bereits zurückerstattet auf NK-22222222-2024-0001 + 70.25». Es fehlen der Grund der Berichtigung (P-2) und eine Erklärung der Rundung (P-1). Seite 2 enthält nur die Hinweise (Art. 257b OR, Art. 8 VMWG).
10. **«Als versendet markieren».** Dialog mit Empfänger und Kanal (E-Mail) und dem Hinweis zur Datierung. Danach Status «Versendet», Abrechnungsdatum 17.10.2026. Auf der neuen Abrechnung ist «Abrechnung berichtigen» wieder verfügbar.

## Verwirrung

- «berichtigen» und «ersetzen» stehen im selben Dialog für dieselbe Handlung (P-6).
- «Danach können Sie … korrigieren»: Ich hatte die Rechnung schon korrigiert und fragte mich, ob das zu früh war (P-5).
- «Rundung auf 5 Rappen + 0.03» (P-1).
- Bei der ersetzten Abrechnung: Ist «Sie erstatten dem Mieter CHF 70.25 zurück» noch eine Aufgabe? (P-4)

## Fehlerrisiken

- Ein Vermieter könnte nach P-4 die 70.25 ein zweites Mal überweisen und dazu die 43.80, also zu viel.
- Ein Mieter, der nachrechnet, beanstandet die Rundung (P-1) oder verlangt eine Begründung der Berichtigung (P-2). Das kostet Vertrauen bei einem Dokument, das ohnehin eine frühere Abrechnung aufhebt.
- Wer nach «Abrechnung ersetzen» aufhört (der Knopf «Berichtigte Abrechnung erstellen» ist ein separater Schritt), hat eine ersetzte Abrechnung ohne Nachfolger. Ob die Übersicht das als offene Arbeit zeigt, habe ich nicht geprüft.

## Vorschläge

- **P-1:** Rechnung Fernwärme Q1 2024 senken, Abrechnung 0001 berichtigen, PDF öffnen: «vor Rundung 43.77, Rundung + 0.03». Hilfreich wäre, die Rundung in der Berichtigung offen zu zeigen (zum Beispiel «Rückerstattung insgesamt 114.02, gerundet 114.05; bereits erstattet 70.25; noch zu erstatten 43.80») oder die Rundungsregel zu nennen («zu Ihren Gunsten auf 5 Rappen gerundet»).
- **P-2:** Gleicher Weg, PDF Seite 1. Hilfreich wären der Titel «Berichtigte Nebenkostenabrechnung» und ein Satz, was sich geändert hat (Kategorie, alter und neuer Betrag der Liegenschaft), oder ein Bemerkungsfeld, das ins PDF übernommen wird.
- **P-3:** Nach dem Ersetzen die alte Abrechnung öffnen: Das gelbe Feld mit «Abrechnung berichtigen» steht noch da. Auf ersetzten Abrechnungen sollte es ausgeblendet oder umformuliert werden («In der berichtigten Abrechnung NK-…-0004 berücksichtigt»).
- **P-4:** Gleiche Seite, Abschnitt «Zahlung». Auf bezahlten und ersetzten Abrechnungen besser in der Vergangenheit: «Sie haben dem Mieter am 05.05.2025 CHF 70.25 zurückerstattet.»
- **P-5:** Rechnung bearbeiten (Hinweis) und den Dialog vergleichen. Im Dialog: «Haben Sie Vertragsdaten oder Rechnungen schon korrigiert, erstellen Sie danach direkt die berichtigte Abrechnung; sonst korrigieren Sie sie zuerst.»
- **P-6:** Im Dialog: «Die Abrechnung NK-… gilt danach nicht mehr. Sie bleibt zur Ansicht gespeichert.» Knopf und Titel mit demselben Verb.
- **P-7:** Im PDF einer Berichtigung den IBAN-Satz weglassen oder anpassen. «Bereits zurückerstattet am 05.05.2025 auf NK-…-0001». Die Hinweise wenn möglich auf Seite 1 halten.

## Nicht geprüft

- Eine Berichtigung mit Nachzahlung des Mieters (QR-Rechnung im PDF): Meine Korrektur senkte die Kosten.
- Den Fall, dass die Abrechnung ersetzt, aber keine berichtigte erstellt wird (Anzeige in der Übersicht).
- Andere Sprachen des PDFs (nur «PDF auf Deutsch»).
- Den Zustand «Als bezahlt markieren» der berichtigten Abrechnung: Das hätte die Rückerstattung als erledigt erfasst, war aber nicht Teil der Aufgabe.
- Die Beträge im Detail für `daten-pruefer`: Ich habe nur die Abrechnung von Thomas Weber nachgerechnet, nicht die anderen Wohnungen der Seepark Residenz, deren Abrechnungen 2024 durch die Rechnungsänderung jetzt ebenfalls nicht mehr stimmen.
