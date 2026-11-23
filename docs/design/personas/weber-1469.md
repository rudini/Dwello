# Persona-Review Dr. Weber – Tankrevision in der Kategorie Heizung (#1469)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 (Demodaten). Gespeichert habe ich nur in «Alpenblick»: die Rechnung «Tank Service AG» (CHF 700.00) und die zwei Entwürfe 2025 (NK-33333333-2025-0001 Laura Keller, NK-33333333-2025-0002 Kevin Fischer); bei Laura Keller habe ich das PDF erstellt. Die Entwürfe habe ich so gelassen, wie sie sind.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Abschnitt «Heiz- und Warmwasserkosten» | Die Tankrevision steht nur als «+ weitere Rechnungen «Heizung» nach den Tagen ihres Leistungszeitraums CHF 69.94». Weder die Rechnung (Tank Service AG, Tankrevision) noch der Rechnungsbetrag CHF 700.00 noch «365 von 3653 Tagen» stehen da. Die Kostenabstimmung zeigt genau das; die Mieterin sieht es nicht und kann die 69.94 nicht nachrechnen. |
| P-2 | Minor | Kostenabstimmung «Heizung» (Vorschau im Assistenten und Berichte) | Die Zeilen lauten Anfangsbestand, Lieferung, «minus Endbestand», Tankrevision. Eine Zeile «= Verbrauch» fehlt, die Tankrevision hat kein «plus», und ihr Betrag rutscht in eine eigene Zeile. Das PDF hat die Zwischensumme (CHF 5'178.00), der Bericht nicht. Ich musste 1'792 + 4'880 − 1'494 selbst rechnen, um zu sehen, wo die 69.94 dazukommen. |
| P-3 | Minor | Abrechnung (Entwurf) NK-33333333-2025-0001, Kostenaufstellung «Heizung» | Hier gibt es eine dritte Darstellung: zuerst die Tankrevision CHF 69.94, dann «Heizöl EL, 4'900 Liter CHF 4'880.00», dann «Veränderung Tankbestand CHF 298.00» ohne Vorzeichen und ohne «Abnahme». Die Reihenfolge ist eine andere als in der Kostenabstimmung und im PDF, und bei der Tankrevision steht nicht, dass die 69.94 ein Anteil von CHF 700.00 sind. Wer das mit dem PDF vergleicht, kann sich leicht verrechnen. |
| P-4 | Minor | PDF, Erläuterung unter der Kostenübersicht | Dort steht: «Er zählt über die ganze Abrechnungsperiode, auch wenn eine Lieferung einen Leistungszeitraum hat. Weitere Rechnungen derselben Kategorie, zum Beispiel für die Tankrevision, sind keine Lieferung …». Im Rechnungsformular heisst es aber: Eine Rechnung mit einem Leistungszeitraum über mehrere Tage ist keine Lieferung. Für die Mieterin heisst das: Was eine «Lieferung mit Leistungszeitraum» ist, bleibt offen, und woran sie Lieferung und «weitere Rechnung» unterscheidet, sieht sie im PDF nicht. |

## Beobachtungen

- Das Rechnungsformular erklärt den Unterschied gut, sobald Gebäude und Kategorie «Heizung» gewählt sind: Eine Lieferung bekommt als Beginn und als Ende den Tag der Lieferung, die Tankrevision einen Leistungszeitraum über mehrere Tage. Die Tankrevision ist als Beispiel genannt. Das hat mich sicher gemacht.
- Detailseite der Tankrevision: «Nur die Tage in der Abrechnungsperiode zählen.» und «Zählt mit den Tagen ihres Leistungszeitraums, nicht als Lieferung in den Tank.» Das ist klar, sagt aber zweimal fast dasselbe. Wie viel pro Jahr zählt (2025: CHF 69.94), steht nicht da. Bei der Heizöl-Rechnung steht passend dazu «Zählt als Lieferung in den Tank», mit dem Hinweis auf den Leistungszeitraum bei einer Tankrevision. Der Vergleich der beiden Seiten ist verständlich.
- Nach dem Speichern meldet die Detailseite «Abrechnungen nicht aktuell» für 2024. Das stimmt, denn ein Teil der Tankrevision fällt auch auf 2024. Der Text mit Art. 128 OR und der Verjährung ist lang, aber korrekt vorsichtig.
- Der Verteilschlüssel wurde mit «Pro Fläche (m²)» vorgeschlagen, weil die letzte Heizungs-Rechnung des Gebäudes ihn hat. Es gibt auch «Heizung (Fläche 70 % / Einheit 30 %)». Ich habe den Vorschlag übernommen, damit alle Rechnungen der Kategorie gleich verteilt werden.
- Im Filter «Jahr» der Rechnungsliste fehlt 2018. Die Tankrevision mit Rechnungsdatum 09.02.2018 finde ich über den Jahresfilter also nicht.
- Im Assistenten war das Heizprofil «Heizung + Warmwasser» vorgewählt. Für Interlaken hätte ich «Heizung Bergregion» erwartet. Weil beide Mietverträge über die ganze Periode laufen, wird es nicht angewendet (das steht auf der Abrechnung). Ich habe die Vorgabe gelassen.
- Der Hinweis in der Vorschau «Rechnungen, die nicht als Lieferung in den Tank zählen» ist gut: Er nennt die Tankrevision mit Betrag und verlinkt die Rechnung. Dazu die aufklappbaren Zeilen mit «365 von 3653 Tagen in dieser Periode». Ich habe verstanden, was Dwello tut. Die Hinweise auf fehlende Rechnungen (Kaminfeger, Kaltwasser 2. Halbjahr) stimmen mit den Demodaten überein.
- 3653 Tage: 09.02.2018 bis 09.02.2028 zählt beide Endtage mit. Eine nächste Revision ab 09.02.2028 würde sich mit dieser einen Tag überschneiden. Das ist fachlich eine Kleinigkeit, aber erwähnenswert.
- Rundung: Rückerstattung vor Rundung CHF 128.82, «Rundung auf 5 Rappen + 0.03», danach CHF 128.85. Kaufmännisch gerundet wären es CHF 128.80. Bei Kevin Fischer wird aus 157.28 CHF 157.30. Es wird offenbar zugunsten der Mieter gerundet. Das ist vertretbar, aber nirgends erklärt.
- Die Überschrift «Heiz- und Warmwasserkosten» im PDF erscheint, obwohl Alpenblick nur «Heizung» abrechnet.
- Kostenabstimmung 2024 (nicht Teil der Aufgabe, aber wegen der Tankrevision verändert): Bei «Kosten des Gebäudes Heizung» ist der Anteil der Tankrevision 2024 (CHF 70.13, 366 Tage) schon enthalten, «davon Mieter» stammt aber noch aus den alten Abrechnungen. Bis zur Berichtigung erscheint der Mieteranteil deshalb unter «davon tragen Sie». Der Hinweis «2 Abrechnungen … sind nicht aktuell» erklärt das.

## Aufgabe geschafft: ja

## Aufwand

Etwa 20 Minuten, rund 16 Schritte: Rechnung erfassen, 2 Rechnungsseiten, Gebäudeseite (Tankbestand), Assistent mit 5 Schritten, Entwurf, PDF erstellen und lesen, 2 Berichte.

## Ablauf

- **Rechnungsformular, Hilfetext beim Leistungszeitraum.** Erwartet: der allgemeine Text über Quartale. Gesehen: Sobald Gebäude und «Heizung» gewählt sind, erscheint ein eigener Text zu Lieferungen und zur Tankrevision. Das ist besser, als ich erwartet hatte.
- **Vorschau, Kostenabstimmung «Heizung».** Erwartet: Anfangsbestand + Lieferungen − Endbestand = Verbrauch, danach + Tankrevision. Gesehen: Es gibt keine Zeile «Verbrauch», und die Tankrevision steht ohne Rechenzeichen nach «minus Endbestand» (P-2).
- **Entwurf, Kostenaufstellung.** Erwartet: dieselbe Reihenfolge wie in der Vorschau. Gesehen: Die Tankrevision steht zuerst, und der Tankbestand erscheint nur als «Veränderung Tankbestand CHF 298.00» (P-3).
- **PDF, Abschnitt «Heiz- und Warmwasserkosten».** Erwartet: eine Zeile «Tankrevision, CHF 700.00, 365 von 3653 Tagen». Gesehen: «weitere Rechnungen «Heizung» nach den Tagen ihres Leistungszeitraums CHF 69.94» (P-1).
- **PDF, Rückerstattung.** Erwartet: 2'280.00 − 2'151.18 = 128.82, kaufmännisch gerundet 128.80. Gesehen: CHF 128.85 (siehe Beobachtungen).

Nachgerechnet:
- Heizung 2025: 1'792.00 + 4'880.00 − 1'494.00 = 5'178.00; dazu 700.00 × 365 / 3653 = 69.94; zusammen 5'247.94. Das stimmt überall.
- Anteil Laura Keller: 72 / 255 m² × 5'247.94 = 1'481.77. Das stimmt.
- Übrige Kategorien: 367.06, 106.98 und 132.71; Zwischensumme 2'088.52, 3 % = 62.66, total 2'151.18. Das stimmt.
- Kevin Fischer: 98 / 255 × 7'396.84 = 2'842.72. Das stimmt.
- Eine Mieterin kann den Verbrauch im PDF nachvollziehen, die CHF 69.94 nicht (P-1).

## Vorschläge

- **P-1:** Laura Kellers Abrechnung 2025 öffnen, «PDF erstellen», Seite 2 lesen. Hilfreich wäre, die Rechnung zu nennen: «+ Tank Service AG, Tankrevision: CHF 700.00 × 365 / 3653 Tage = CHF 69.94». Bei mehreren Rechnungen gehört jede in eine eigene Zeile.
- **P-2:** Berichte → «Alpenblick, 01.01.2025 – 31.12.2025» → bei Heizung «Rechnungen anzeigen». Hilfreich wäre eine Zeile «= Verbrauch CHF 5'178.00» nach dem Endbestand, «plus» vor der Tankrevision und der Betrag in derselben Zeile wie die Bezeichnung, so wie im PDF.
- **P-3:** Entwurf NK-33333333-2025-0001 öffnen, Kostenaufstellung Heizung. Hilfreich wäre dieselbe Reihenfolge wie in PDF und Kostenabstimmung: Anfangsbestand, Lieferung, Endbestand, Verbrauch, dann die Tankrevision mit «Anteil von CHF 700.00, 365 von 3653 Tagen».
- **P-4:** PDF Seite 1, Erläuterung unter der Kostenübersicht. Den Satz «auch wenn eine Lieferung einen Leistungszeitraum hat» streichen oder für Mieter formulieren, zum Beispiel: «Lieferungen zählen über den Tankbestand. Andere Rechnungen dieser Kategorie, zum Beispiel die Tankrevision, zählen nur mit den Tagen, die in die Periode fallen.»

## Nicht geprüft

- Das PDF von Kevin Fischer habe ich nicht geöffnet, weil die Aufgabe nur Laura Keller nennt. Seine Zahlen habe ich in der Vorschau nachgerechnet.
- Versand und Bezahlt-Status habe ich nicht geprüft, weil die Entwürfe für die Datenprüfung so bleiben sollen.
- Die Kostenabstimmung 2024 habe ich nur gelesen. Ich habe «Neu berechnen» bzw. die Berichtigung dort nicht ausgelöst, weil es nicht zur Aufgabe gehört und es Abrechnungen verändern würde, die ich nicht erstellt habe.
