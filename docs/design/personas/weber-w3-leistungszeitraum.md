# Dr. Weber – W3: Leistungszeitraum für mehrjährige Kosten (Boiler entkalken)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Nur angesehen, nichts gespeichert.
Aufgabe: Eine Rechnung über CHF 500 für das Entkalken des Boilers der zentralen Warmwasseranlage (ausgeführt am 01.04.2026, nächstes Mal in 5 Jahren) so erfassen, dass die Kosten gerecht über die Jahre verteilt werden. Geprüft: Hilfe beim Leistungszeitraum auf «Neue Rechnung», dieselbe Hilfe in «Rechnungen hochladen» (Angaben einer Dateizeile geöffnet), Hilfeseite Abschnitt «Rechnungen erfassen»; Jahreszahlen der Beispiele, Rechnung «etwa CHF 100 pro Jahr», Aussage zu Wohnungsboiler und zentraler Warmwasseranlage.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/6050a3a3-7490-5b40-bfeb-092820c8b3e3/scratchpad/weber-w3/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hilfe, «Begriffe kurz erklärt» | Der Begriff «Abrechnungsperiode» sagt weiterhin «Das Rechnungsdatum bestimmt, in welche Abrechnungsperiode eine Rechnung fällt.» Das widerspricht dem neuen Absatz im Abschnitt «Rechnungen erfassen» auf derselben Seite (Verteilung über den Leistungszeitraum) und dem Feldtext «Ohne Leistungszeitraum bestimmt es …». |
| P-2 | Minor | Neue Rechnung, Rechnungen hochladen, Hilfe | Das Beispiel spricht von «Der Boiler wird … entkalkt», der nächste Absatz sagt, beim Boiler in der Wohnung sei das umstritten. Ob das Rechenbeispiel den zentralen Boiler oder einen Wohnungsboiler meint, bleibt offen. |
| P-3 | Minor | Neue Rechnung, Rechnungen hochladen, Hilfe | Der Text zitiert Art. 5 Abs. 2 Bst. e VMWG nur für die zentrale Warmwasseranlage. Soweit ich die Verordnung kenne, nennt genau dieser Buchstabe auch «der Boiler». Wer nachschlägt, liest dort den Boiler und versteht nicht, warum er beim Wohnungsboiler «umstritten» sein soll. Ein Grund wird nicht genannt. |
| P-4 | Minor | Neue Rechnung, Rechnungen hochladen | Der Absatz zur Rechtslage (umlagefähig oder nicht) steht in der Gruppe «Leistungszeitraum», also bei den Datumsfeldern. Beim Kästchen «Umlagefähig», wo ich die Entscheidung treffe, steht nichts dazu. |
| P-5 | Nit | Neue Rechnung, Rechnungen hochladen, Hilfe | «Art. 5 Absatz 2 Bst. e VMWG»: ein Teil ausgeschrieben, ein Teil abgekürzt. Üblich wäre «Art. 5 Abs. 2 Bst. e VMWG». |
| P-6 | Nit | Neue Rechnung, Rechnungen hochladen | Alle Beispiele zu Datum und Zeitraum verwenden das Jahr 2026. Nur das Beispiel bei «Beschreibung» lautet «Heizöllieferung 2025». |

## Beobachtungen

- Die Jahreszahlen sind sonst einheitlich 2026: Rechnungsdatum «Beispiel: 31.12.2026», Quartalsbeispiel «01.10.2026 bis 31.12.2026», Boilerbeispiel «01.04.2026 bis 31.03.2031», Beispiel bei «Beginn» und «Ende» «31.12.2026». Nach «Ende März» im Feld «Ende» und Verlassen des Feldes erscheint rot mit Symbol: «Bitte geben Sie das Datum in Ziffern als TT.MM.JJJJ ein, zum Beispiel 31.12.2026.» Auch das ist 2026. Im Hochladen-Dialog ist es gleich.
- Im Bedienungsbaum steht die Fehlermeldung beim Feld «Ende» zweimal hintereinander, sichtbar ist sie nur einmal (Bildschirmfoto 03). Ein Screenreader liest sie vermutlich doppelt vor (das wäre etwas für Sven).
- Auf «Neue Rechnung» enthält «Kategorie (optional)» auch nach der Wahl von «Musterhaus Zentrum» nur «Kategorie auswählen», ebenso im Hochladen-Dialog. Im Filter der Rechnungsliste stehen 21 Kategorien, darunter «Warmwasser». Ich konnte für meine Rechnung also keine Kategorie wählen. Das gehört nicht zur geprüften Änderung, fällt aber auf, weil die Hilfe sagt: «Jede Rechnung gehört zu einer Kategorie.»
- Der Text auf der Hilfeseite nennt die Felder «Beginn» und «Ende» nicht und sagt nicht, wo der Leistungszeitraum einzugeben ist. Wer den Abschnitt liest, weiss nur, dass es einen «Leistungszeitraum» gibt.
- Eine erfundene PDF-Datei (kein echtes PDF) brachte im Hochladen-Dialog «Die Anfrage war ungültig. Laden Sie die Seite neu und versuchen Sie es erneut.» Neu laden hilft bei einer kaputten Datei nicht. Mit einem PNG ging es. Die KI-Ersatzantwort setzte 01.01.2026 bis 31.03.2026 ein, die Beschreibung «Allgemeinstrom Q1» und als Rechnungssteller den Dateinamen. Das betrifft den Stand-in, nicht die Hilfe.
- Bei einem Leistungszeitraum von 5 Jahren zeigte das Formular nach dem Verlassen des Feldes keinen Hinweis und keine Vorschau, wie viel auf welches Jahr fällt. Die Wochentage («Mittwoch, 1. April 2026», «Montag, 31. März 2031») stimmen.

## Aufgabe geschafft: teilweise

Wie ich die Rechnung erfassen muss (Beginn 01.04.2026, Ende 31.03.2031, Betrag 500.00), habe ich verstanden, und die Erklärung ist rechnerisch richtig. Erfasst habe ich sie nicht, weil Speichern ausgeschlossen war. Eine Kategorie («Warmwasser») hätte ich ohnehin nicht wählen können, weil die Liste leer war. Ob ich die Kosten auf meine Mieter umlegen darf, bleibt beim Wohnungsboiler nach dem Text unklar (P-2, P-3).

## Aufwand

Etwa 15 Minuten, 8 Durchgänge: Übersicht, Neue Rechnung lesen, ungültiges und gültiges Datum eingeben, Hochladen-Dialog mit Datei, Angaben öffnen, Datum ungültig machen, Hilfeseite, Einstellungen (Abrechnungsperiode).

## Ablauf

1. **Übersicht → «Rechnung erfassen».** Erwartet: ein Formular mit einem Feld für den Zeitraum. Gesehen: «Neue Rechnung» mit der Gruppe «Leistungszeitraum (optional)» und drei Absätzen Hilfe: allgemein (Quartal), mehrjährige Kosten mit Boilerbeispiel, Rechtslage. Der Text ist sichtbar am Feld, nicht hinter einem Symbol versteckt. Das schätze ich.
2. **Rechnung nachgerechnet.** Erwartet: «etwa CHF 100 pro Jahr» hält, wenn man die Tage zählt. Gesehen und gerechnet: Vom 01.04.2026 bis 31.03.2031 sind es 1826 Tage (275 + 365 + 366 + 365 + 365 + 90). Bei der Abrechnungsperiode «Kalenderjahr» (Vorschlag in den Einstellungen) ergibt das: 2026 CHF 75.30, 2027 CHF 99.95, 2028 CHF 100.22 (Schaltjahr), 2029 CHF 99.95, 2030 CHF 99.95, 2031 CHF 24.64, zusammen CHF 500.01 (Rundung). «Etwa CHF 100, im ersten und im letzten Jahr weniger» stimmt. Bei «Juli – Juni» wären es CHF 24.92 im ersten und CHF 75.03 im letzten Abschnitt, auch dann stimmt der Satz. «Endet am Tag vor der nächsten» ergibt korrekt den 31.03.2031.
3. **«Ende März» ins Feld «Ende», Feld verlassen.** Erwartet: eine Meldung mit Beispiel im selben Jahr wie die Hilfetexte. Gesehen: rote Umrandung und die Meldung mit «zum Beispiel 31.12.2026». Passt.
4. **31.03.2031 eingegeben.** Erwartet: wird angenommen. Gesehen: «Montag, 31. März 2031», kein Fehler.
5. **Rechtsabsatz gelesen.** Erwartet: eine klare Antwort, ob ich die CHF 500 umlegen darf. Gesehen: zentrale Anlage umlagefähig, wenn der Mietvertrag Warmwasserkosten als Nebenkosten nennt; Wohnungsboiler «umstritten», nur bei ausdrücklicher Nennung im Vertrag; «Im Zweifel ist es nicht umlagefähig». Die Richtung ist vorsichtig und richtig. Aber das Beispiel davor spricht nur von «Der Boiler» (P-2), und die zitierte Bestimmung scheint den Boiler selbst zu nennen (P-3).
6. **Rechnungen → «Rechnungen hochladen», Gebäude gewählt, Datei hinzugefügt, «Angaben prüfen».** Erwartet: dieselbe Hilfe wie im Formular. Gesehen: wortgleich, ebenso die Beispiele und die Fehlermeldung nach ungültigem Ende-Datum.
7. **Hilfe → «Rechnungen erfassen».** Erwartet: dieselbe Erklärung, passend zu den Begriffen weiter unten. Gesehen: Die beiden Absätze sind wortgleich als Listenpunkte. Unten unter «Begriffe kurz erklärt» sagt «Abrechnungsperiode» aber noch, das Rechnungsdatum bestimme die Periode (P-1).

## Verwirrung

- «Der Boiler» im Beispiel und «ein Boiler in der Wohnung» im nächsten Satz: Meint das Beispiel einen Fall, der umstritten ist?
- «umstritten»: Zwischen wem? Ein Grund wird nicht genannt, und die zitierte Bestimmung scheint den Boiler zu nennen.
- «Abrechnungsperiode» auf der Hilfeseite widerspricht dem Leistungszeitraum (P-1).
- «Die Abrechnungen der folgenden Jahre enthalten ihren Teil von selbst»: verständlich. Bei «Wer später einzieht, zahlt nur für seine Zeit» fehlt aber der Teil zum Leerstand: Den trägt der Vermieter, so steht es nur bei «Mietstage».

## Fehlerrisiken

- Ein Vermieter mit Boilern in den Wohnungen liest das Beispiel als Anleitung für genau seinen Fall und legt die Kosten um, obwohl der Mietvertrag das Entkalken nicht ausdrücklich nennt (P-2).
- Wer nur die Begriffserklärung liest, gibt keinen Leistungszeitraum ein. Dann fallen die CHF 500 ganz in das Jahr 2026 (P-1).
- Wer im Formular beim Kästchen «Umlagefähig» entscheidet, sieht die Rechtsfrage dort nicht (P-4).
- Ein Tippfehler im Endjahr (z. B. 31.03.2013) wird erst beim Speichern auffallen, wenn überhaupt. Das konnte ich nicht prüfen.

## Vorschläge

- **P-1:** Hilfe öffnen, «Begriffe kurz erklärt» → «Abrechnungsperiode». Den letzten Satz anpassen, etwa: «Das Rechnungsdatum bestimmt, in welche Abrechnungsperiode eine Rechnung fällt, wenn sie keinen Leistungszeitraum hat. Mit Leistungszeitraum zählen die Tage in der Periode.»
- **P-2:** Neue Rechnung → Gruppe «Leistungszeitraum», zweiter Absatz. Im Beispiel sagen, um welche Anlage es geht: «Die zentrale Warmwasseranlage wird am 01.04.2026 entkalkt …». Dasselbe in Hochladen-Dialog und Hilfe.
- **P-3:** Gleiche Stelle, dritter Absatz. Fachlich prüfen lassen (fach-reviewer): Nennt Art. 5 Abs. 2 Bst. e VMWG «der Boiler»? Wenn ja, kurz den Grund des Vorbehalts nennen. Ein möglicher Grund wäre, dass das Entkalken eines Wohnungsboilers auch als Unterhalt gelten kann, den der Vermieter trägt; das müsste die Fachseite bestätigen. Sonst den Satz so formulieren, dass er dem Gesetzestext nicht zu widersprechen scheint.
- **P-4:** Neue Rechnung → Kästchen «Umlagefähig». Einen kurzen Hinweis dort anbringen oder den Rechtsabsatz dorthin verschieben und beim Leistungszeitraum nur auf ihn verweisen.
- **P-5:** «Art. 5 Abs. 2 Bst. e VMWG» schreiben, an allen drei Stellen.
- **P-6:** Neue Rechnung → «Beschreibung». Beispiel auf «Heizöllieferung 2026» ändern oder ohne Jahr schreiben.

## Nicht geprüft

- Speichern der Rechnung und die tatsächliche Aufteilung in einer Nebenkostenabrechnung (Speichern war ausgeschlossen). Ob Dwello einen Zeitraum von 5 Jahren beim Speichern annimmt, weiss ich daher nicht. Die Beträge pro Jahr habe ich nur selbst gerechnet.
- Ob die zitierte Bestimmung (Art. 5 Abs. 2 Bst. e VMWG) wörtlich den Boiler nennt: aus dem Gedächtnis, nicht nachgeschlagen.
- Andere Sprachen (fr/it/en) und die Ansicht auf dem Telefon: nicht Teil meiner Aufgabe.
- Den Kalender für «Ende» habe ich geöffnet, aber das Bildschirmfoto der ganzen Seite lief in eine Zeitüberschreitung. Wie bequem man darin fünf Jahre weiterblättert, habe ich nicht beurteilt.
