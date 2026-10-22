# Persona-Review: Dr. Weber, Kategorie erst ab einem Tag vereinbart (#368, Runde b)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. App: Persona-Stack http://localhost:3300 mit Demodaten. Gespeichert nur in «Musterhaus Zentrum» (Mietvertrag Anna Schmidt, Wohnung 1.02; Entwurf NK-11111111-2025-0002 neu berechnet, PDF erstellt). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/weber-368-b/`.

Gewählte Kategorie: **Gartenpflege**, vereinbart ab **01.07.2025**. Abrechnung: **NK-11111111-2025-0002** (Anna Schmidt, Wohnung 1.02, 01.01.–31.12.2025, Entwurf).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Mietvertrag bearbeiten → Abrechnung (Dialog «Entwurf neu berechnen», Meldung danach) | Die Hilfe bei «Vereinbarte Nebenkosten» sagt nur «Bestehende Abrechnungen ändern sich dadurch nicht.» Dass ein Entwurf mit «Neu berechnen» das neue «Vereinbart ab» übernimmt, steht nirgends: Der Dialog und die Erfolgsmeldung nennen nur «die Rechnungen und den Tankbestand, wie sie jetzt sind». Nach dem Speichern zeigt weder der Mietvertrag noch der Entwurf an, dass der Entwurf veraltet ist. |
| P-2 | Minor | PDF Seite 1, Kostenübersicht | Die Zeile Gartenpflege zeigt «184/365 Tage», direkt darüber steht «365 Mietstage von 365 Tagen». In der Zeile steht nicht, warum. Die Erklärung kommt erst auf Seite 2 im klein gedruckten Absatz und in den Hinweisen («Gartenpflege (ab 01.07.2025)»). |
| P-3 | Minor | Abrechnung (Webansicht), Kostenaufstellung | In der Webansicht steht nirgends, warum Gartenpflege nur 184/365 Tage und 9.42 % hat. Es fehlen das «ab 01.07.2025» und eine Erklärung wie im PDF. Die Mietstage-Angabe rechts sagt 365. |
| P-4 | Minor | PDF Seite 2, Erklärung der Anteile; rechtliche Plausibilität | Die Kategorie wird nach Tagen anteilig verrechnet. So trägt die Mieterin rund die Hälfte der Rechnung «Gartenpflege Frühjahr 2025» (Rechnungsdatum 14.05.2025, also vor der Einführung). Bei der Heizung gilt ab dem Stichtag das Heizprofil, für saisonale Kosten wie Gartenpflege gibt es nichts Vergleichbares. Das ist vertretbar (pro rata temporis), eine Mieterin könnte es aber anfechten. Fachlich prüfen. |

## Beobachtungen

- Nach «Neu berechnen» ist die Reihenfolge der Positionen eine andere (Allgemeinstrom steht jetzt vor Kaltwasser und Hauswart, Gartenpflege nach Hauswart). Das stört beim Vergleich mit der früheren Fassung.
- Die Bearbeitungsseite füllt bei «Akonto, Gültig ab» schon «01.11.2026» vor. Beim Speichern war ich unsicher, ob dadurch ein neuer Akonto-Abschnitt entsteht. Auf der Vertragsseite ist danach nichts davon zu sehen: Akonto weiterhin CHF 300.00.
- Dwello hat 01.07.2025 ohne Rückfrage angenommen. Ob das ein Kündigungstermin ist, prüft die App nicht. Die Hilfe sagt aber deutlich «frühestens auf den nächsten Kündigungstermin» und «mit dem amtlichen Formular». Das finde ich ausreichend.
- Gut: Die Vertragsseite zeigt danach «Gartenpflege (ab 01.07.2025)», die Hinweise im PDF ebenso. Im PDF steht beim Verteilschlüssel zusätzlich die Rechengrundlage «92.00 / 492.50 m²». Damit kann ich nachrechnen.
- Nach dem Neuberechnen ist das alte PDF verworfen: Der Knopf heisst wieder «PDF erstellen». Das stimmt mit dem Dialog überein.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 9 Schritte: Entwürfe-Liste, Abrechnung ansehen, Mieterin, Mietvertrag, Bearbeiten, «Nebenkosten ab einem Tag vereinbaren» aufklappen, Datum eintragen und speichern, Abrechnung «Neu berechnen» mit Bestätigung, «PDF erstellen» und PDF lesen.

## Ablauf

1. **Übersicht → «Entwürfe ansehen».** Erwartet: die Abrechnung von Anna Schmidt. Gesehen: NK-11111111-2025-0002, Rückerstattung CHF 6.50, Entwurf.
2. **Abrechnung vorher.** Gartenpflege: Kosten des Gebäudes CHF 935.00 (Rechnungen Frühjahr 540.00 und Herbst 395.00), Wohnungsanteil 174.66, 365/365 Tage, 18.68 %, Betrag 174.66. Zwischensumme 3’488.85, Saldo Rückerstattung CHF 6.50. Ich wähle Gartenpflege, weil sie über das Jahr ungleich verteilt ist. So sehe ich, wie Dwello den Stichtag behandelt.
3. **Mieterin → Mietvertrag → «Bearbeiten».** Erwartet: ein Feld für den Beginn einer Kategorie. Gesehen: Die Hilfe bei «Vereinbarte Nebenkosten» erklärt das amtliche Formular, den Kündigungstermin und das Feld «Vereinbart ab». Darunter steht der Knopf «Nebenkosten ab einem Tag vereinbaren».
4. **Aufklappen.** Pro Kategorie gibt es ein Feld «<Kategorie>: Vereinbart ab (optional)» mit der Hilfe «Leer lassen, wenn … seit Beginn des Mietvertrags vereinbart …». Das ist klar.
5. **Gartenpflege: 01.07.2025 eintragen.** Darunter erscheint «Dienstag, 1. Juli 2025». Gespeichert, Weiterleitung zur Vertragsseite. Dort steht bei «Vereinbarte Nebenkosten»: «Gartenpflege (ab 01.07.2025)». Erwartet: ein Hinweis, dass es einen Entwurf 2025 gibt, der neu berechnet werden muss. Gesehen: kein Hinweis (P-1).
6. **Abrechnung erneut geöffnet.** Unverändert, 365/365 Tage. Das passt zur Hilfe («Bestehende Abrechnungen ändern sich dadurch nicht»), aber einen Hinweis, was jetzt zu tun ist, gibt es nicht.
7. **«Neu berechnen».** Dialog: «Dwello berechnet den Entwurf … mit den Rechnungen und dem Tankbestand, wie sie jetzt sind. Nummer, Heizprofil, Verwaltungspauschale, Abrechnungsdatum, Zahlungsfrist und Bemerkung bleiben …». Erwartet: dass auch der geänderte Mietvertrag genannt wird. Gesehen: kein Wort dazu. Ich habe auf Verdacht bestätigt (P-1). Die Erfolgsmeldung wiederholt «mit den Rechnungen und dem Tankbestand».
8. **Ergebnis.** Gartenpflege: CHF 935.00, Wohnungsanteil 174.66, **184/365 Tage, 9.42 %, CHF 88.05**. Zwischensumme 3’402.24, Verwaltungspauschale 3 % 102.07, Nebenkosten 3’504.31, Akonto −3’600.00, Rückerstattung vor Rundung 95.69, Rundung +0.01, **Saldo Rückerstattung CHF 95.70**. In der Webansicht gibt es keine Erklärung für die 184 Tage (P-3).
9. **Nachgerechnet:**
   - Tage 01.07.–31.12.2025: 31+31+30+31+30+31 = 184. Stimmt.
   - Wohnungsanteil: 935.00 × 92.00 / 492.50 = 174.66. Stimmt.
   - Anteil: 174.66 × 184/365 = 88.048, also 88.05. Stimmt. Prozent: 18.68 % × 184/365 = 9.42 %. Stimmt.
   - Zwischensumme: 3’488.85 − 174.66 + 88.05 = 3’402.24. Stimmt. 3 % davon = 102.067, also 102.07. Stimmt. Summe 3’504.31. Stimmt.
   - Saldo: 3’600.00 − 3’504.31 = 95.69, auf 5 Rappen gerundet 95.70. Stimmt.
   - Unterschied zu vorher: 174.66 − 88.05 = 86.61 weniger Kosten, dazu 2.60 weniger Verwaltungspauschale. Saldo von 6.50 auf 95.70. Das ist plausibel.
10. **«PDF erstellen», PDF gelesen.**
    - Seite 1: Kopf «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 31.12.2025 (365 Mietstage von 365 Tagen)». Kostenübersicht: Gartenpflege, Pro Fläche (m²), 92.00 / 492.50 m², 935.00, 174.66, 184/365 Tage, 88.05.
    - Seite 2: dieselben Summen wie in der Webansicht, Akonto «12 Monate × CHF 300.00».
    - Erklärung, klein gedruckt: «… Zeitanteil: Ihre Mietstage in der Abrechnungsperiode. Ihr Anteil ist der Wohnungsanteil mal der Zeitanteil. Ist eine Kategorie erst ab einem Tag vereinbart (unten bei den vereinbarten Nebenkosten mit «ab» genannt), zählen nur Ihre Mietstage ab diesem Tag; bei Heizkosten die Monate des Heizprofils ab diesem Tag.»
    - Hinweise: «Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: … Gartenpflege (ab 01.07.2025) …».
    - Fazit: Mit Seite 2 ist es nachvollziehbar. Auf Seite 1 widerspricht die Zeile scheinbar dem Kopf (P-2).
11. **Rechtliche Plausibilität.** Abgerechnet sind nur vereinbarte Nebenkosten (Art. 257a OR). Der Hinweis nennt die Kategorie mit Stichtag, das genügt für die Transparenz. Die Aufteilung nach Tagen belastet die Mieterin aber mit 184/365 aller Gartenkosten 2025. Dazu gehört auch die Frühjahrsrechnung vom 14.05.2025, deren Leistung vor der Einführung erbracht wurde. Nur nach Rechnungen ab dem Stichtag wären es 395.00 × 92/492.5 = 73.79 statt 88.05 (P-4).

## Verwirrung

- «Bestehende Abrechnungen ändern sich dadurch nicht»: Ist ein Entwurf eine «bestehende Abrechnung»? Ich las es zuerst als «Ihr Entwurf bleibt falsch, erstellen Sie ihn neu», nicht als «drücken Sie Neu berechnen».
- Im Dialog «Entwurf neu berechnen» bleibt offen, ob der Mietvertrag neu gelesen wird. Genannt sind nur Rechnungen und Tankbestand. Beim Heizprofil und bei der Verwaltungspauschale steht ausdrücklich «bleiben», für «vereinbarte Nebenkosten» steht nichts.
- «Zeitanteil» ist laut PDF-Erklärung «Ihre Mietstage». Bei Gartenpflege sind es aber 184, nicht die 365 Mietstage. Erst der nächste Satz löst das auf.

## Fehlerrisiken

- Ein Vermieter, der der Hilfe glaubt, versendet den unveränderten Entwurf. Die Mieterin zahlt dann Gartenpflege für das ganze Jahr: CHF 89.20 zu viel, ein Fehler, den sie anfechten kann. Oder er löscht den Entwurf und erstellt ihn neu, mit neuer Nummer und ohne Bemerkungen.
- Saisonale Kosten werden nach Tagen verteilt, auch wenn die Rechnung klar vor dem Stichtag liegt. Die Mieterin könnte einwenden, die Frühjahrspflege sei vor der Vereinbarung erbracht worden.

## Vorschläge

- **P-1:** Mietvertrag Anna Schmidt bearbeiten, bei Gartenpflege «Vereinbart ab» 01.07.2025 eintragen und speichern. Dann den Entwurf NK-11111111-2025-0002 öffnen: Er zeigt keinen Hinweis. «Neu berechnen» öffnen: Der Text nennt nur Rechnungen und Tankbestand. Was hilft:
  - In der Hilfe bei «Vereinbarte Nebenkosten»: «Versendete Abrechnungen ändern sich dadurch nicht. Einen Entwurf berechnen Sie mit «Neu berechnen» auf seiner Seite neu.»
  - Im Dialog und in der Meldung «… mit den Rechnungen, dem Tankbestand und dem Mietvertrag, wie sie jetzt sind».
  - Nach dem Speichern eines Mietvertrags mit Entwurf: ein Hinweis mit Link zum Entwurf.
- **P-2:** PDF von NK-11111111-2025-0002 öffnen, Seite 1. Was hilft: In der Zeile unter «184/365 Tage» klein «ab 01.07.2025», wie der Verteilschlüssel seine Rechengrundlage zeigt.
- **P-3:** Abrechnungsseite NK-11111111-2025-0002, Zeile Gartenpflege. Was hilft: dasselbe «ab 01.07.2025» in der Spalte Zeitanteil, dazu ein kurzer Erklärungssatz wie im PDF.
- **P-4:** Zeile Gartenpflege mit den Rechnungen vom 14.05.2025 und 27.10.2025 vergleichen. Was hilft: Fach-Review, ob nach Tagen anteilig für ab-Datum-Kategorien rechtlich genügt. Falls ja, einen Satz im PDF, dass die Kosten des ganzen Jahres zeitanteilig verteilt sind, auch Rechnungen vor dem Stichtag. Falls nein, nur Rechnungen und Leistungszeiträume ab dem Stichtag zählen.

## Nicht geprüft

- Eine Heizkosten-Kategorie mit «Vereinbart ab» (Heizprofil-Monate): Ich habe nur eine Kategorie gewählt, wie die Aufgabe verlangt.
- Versand per E-Mail: Das hätte den Entwurf versendet und gehört nicht zur Aufgabe.
- Fehlerfälle beim Speichern: Ein ungültiges Datum oder ein Datum vor dem Vertragsbeginn habe ich nicht eingegeben, um den Datensatz nicht zu verfälschen.
- Andere Sprachen des PDF: Die Mieterin hat Deutsch.
