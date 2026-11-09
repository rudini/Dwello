# Dr. Weber – Aufbewahrung von Rechnungen (#1410)

Desktop 1440 × 900, Maus. Persona-App auf :3300, Demodaten plus die vom Aufrufer per SQL eingefügten alten Rechnungen (Alpenblick 2014 und 2015, Seepark Residenz 2013). Ich habe nichts gespeichert, weder «Behalten» noch «Rechnung löschen» gedrückt; jeden Löschdialog habe ich mit «Abbrechen» geschlossen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Löschdialog einer Rechnung vom Jahresende (z. B. Facility Service AG, Hauswartung Q4 2024, Rechnungsdatum 31.12.2024) | Das Aufbewahrungsende «31.12.2034» rechnet ab dem Jahr des Rechnungsdatums. Als Privatperson ziehe ich die Kosten aber in der Steuerperiode ab, in der sie fällig oder bezahlt werden. Eine Rechnung vom 31.12.2024, die ich im Januar 2025 bezahle, gehört zur Steuerperiode 2025. Nach Art. 152 DBG, den der Text selbst nennt, endet das Recht auf ein Nachsteuerverfahren dann erst am 31.12.2035. Für die vielen Rechnungen mit Datum 31.12. ist der Satz «Auch als Privatperson brauchen Sie die Rechnung bis dann» also möglicherweise ein Jahr zu kurz. |
| P-2 | Minor | Rechnungsliste mit Hinweis «Rechnungen 2014 von Alpenblick können gelöscht werden» | Die Schaltfläche «Behalten» sagt nicht, was sie tut: Behält sie alle Rechnungen der Liste, auch die Investition? Blendet sie nur den Hinweis aus, für immer oder bis zum nächsten Jahr? Lässt sich das zurücknehmen? Daneben steht kein Hilfetext. Als vorsichtiger Nutzer habe ich sie deshalb nicht gedrückt. |
| P-3 | Minor | Rechnungsliste Alpenblick 2014 | Der Hinweis nennt 2 löschbare Rechnungen, die Überschrift der Liste darunter aber «3 Rechnungen». Die Investition «Neue Fenster» (CHF 24'000.00) steht ohne eigene Markierung in derselben Liste. Erst der Fliesstext erklärt, dass sie nicht mitgezählt ist. Wer die Liste von oben nach unten abarbeitet, kommt leicht auf die Idee, alle drei zu löschen. Der Löschdialog der Investition warnt zwar, aber das ist die letzte Hürde. |

## Beobachtungen

- **Daten im Löschdialog, nachgerechnet:**
  - Facility Service AG, Hauswartung Q4 2024, Rechnungsdatum 31.12.2024, ohne Leistungszeitraum: angezeigt 31.12.2034, selbst gerechnet 31.12.2034 (Ende 2024 + 10 Jahre).
  - Heizöl Brunner AG, 18.09.2024, ohne Leistungszeitraum: angezeigt 31.12.2034, stimmt.
  - BKW Energie AG, Allgemeinstrom H2 2024, 31.12.2024: angezeigt 31.12.2034, stimmt.
  - Heizöl Oberland AG, 25.08.2025: angezeigt 31.12.2035, stimmt.
  - ewl, Fernwärme Q3 2025, Rechnungsdatum 30.09.2025, Leistungszeitraum 01.07.–30.09.2025: angezeigt 31.12.2035, stimmt.
  - ewl, Fernwärme Q4 2025, Rechnungsdatum **20.01.2026**, Leistungszeitraum 01.10.–31.12.2025: angezeigt **31.12.2036**. Richtig so: Der Beleg gehört buchhalterisch ins Jahr 2026 und wird 2026 bezahlt. Dwello nimmt hier das spätere Jahr und nicht das Jahr des Leistungszeitraums. Das finde ich vorsichtig und gut.
- **Rechtsgrundlagen:** Art. 958f OR (10 Jahre ab Ende des Geschäftsjahres) ist richtig zitiert und richtig eingeschränkt auf «Wer zur Buchführung verpflichtet ist». Als privater Vermieter ohne Handelsregistereintrag bin ich das meist nicht. Art. 152 DBG (Einleitung der Nachsteuer innert 10 Jahren nach Ende der Steuerperiode) ist inhaltlich richtig wiedergegeben; zum Zeitpunkt siehe P-1. Nicht erwähnt ist die 20-jährige Frist für Unterlagen zu Immobilien nach Art. 70 Abs. 3 MWSTG. Sie betrifft nur Vermieter, die für die Mehrwertsteuer optiert haben, also selten jemanden aus der Zielgruppe. Ein Satz dazu wäre trotzdem korrekt.
- **Löschdialog «Neue Fenster»** (Wertvermehrende Investitionen, 15.09.2014): «Rechnungen für wertvermehrende Investitionen bewahren Sie auf, bis Sie das Gebäude verkaufen: Sie belegen die Anlagekosten bei der Grundstückgewinnsteuer.» Das ist sachlich richtig. Genau genommen braucht man sie bis zur rechtskräftigen Veranlagung der Grundstückgewinnsteuer nach dem Verkauf, nicht nur bis zum Verkauf selbst. Ein Gesetzesartikel fehlt hier, anders als im Dialog der übrigen Rechnungen (z. B. Art. 12 StHG). Abgebrochen.
- **Löschdialog Hauswart Meier 2014** (Frist abgelaufen): Dort steht nur der allgemeine Satz zum Löschen, kein Hinweis «Aufbewahrungsfrist endete am 31.12.2024». Das passt zur Aussage im Hinweis («nennt Dwello das beim Löschen», nur wenn es länger ist). Eine positive Bestätigung hätte mich als Vorsichtigen aber beruhigt.
- **Übersicht, zu Beginn:** Drei Aufgaben zeigten Daten, die ich nachgerechnet habe und die stimmen:
  - Alpenblick 2014: 2 Rechnungen, Frist endete 31.12.2024 (Hauswart Meier und Lift AG; die Investition ist nicht gezählt).
  - Alpenblick 2015: 1 Rechnung, Frist endete 31.12.2025.
  - Seepark Residenz 2013: 1 Rechnung, Frist endete 31.12.2023.
- **Während meines Laufs:** Die Rechnung Lift AG 2014 verschwand (404), und die Aufgaben 2015 und 2013 waren weg. Danach zeigten Übersicht und Liste «1 Rechnung» und 2 Einträge (Hauswart Meier und Neue Fenster). Das waren andere Personas in derselben Datenbank, nicht ich, und das zähle ich nicht als Befund. Die Zählung blieb dabei in sich stimmig.
- **Satzbau:** Der Satz «Muss eine Rechnung der Liste länger aufbewahrt werden, nennt Dwello das beim Löschen» ist richtig, aber abstrakt. Wann das zutrifft (z. B. Rechnungsdatum im Folgejahr), erfahre ich nicht.
- **Filter der verlinkten Liste:** Die Liste zeigt nur die Abrechnungsperiode 2014, aber der Jahresfilter steht auf «Alle Jahre». Die Auswahl reicht nur bis 2021, 2014 lässt sich dort gar nicht wählen. Ein Satz über der Liste erklärt die Periode. Trotzdem widersprechen sich Filter und Inhalt.
- Grammatik «von 1 Rechnung dieser Abrechnungsperiode» ist korrekt, aber hölzern.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, 11 Skripte. Ich habe 9 Löschdialoge geöffnet und abgebrochen, 2 Übersichten und 2 Listen gelesen.

## Ablauf

- Rechnungsliste über «Rechnungen ansehen» (Alpenblick 2014): Erwartet hatte ich 2 Rechnungen, wie im Hinweis. Gesehen habe ich «3 Rechnungen», die Investition eingeschlossen (P-3).
- Rechnungsliste, Filter: Erwartet hatte ich «Jahr: 2014». Gesehen habe ich «Alle Jahre», ohne 2014 in der Auswahl.
- Schaltfläche «Behalten»: Erwartet hatte ich einen Text, was sie bewirkt. Gesehen habe ich nur das Wort (P-2).
- Löschdialog der Rechnung vom 31.12.2024: Erwartet hatte ich, dass die Steuerperiode der Zahlung berücksichtigt ist. Gesehen habe ich 31.12.2034 (P-1).
- Lift AG 2014 öffnen: Erwartet hatte ich die Detailseite. Gesehen habe ich «Diese Seite gibt es nicht» (von einer anderen Persona gelöscht, kein Befund).

## Vorschläge

- **P-1:** Rechnungen › Facility Service AG, Hauswartung Q4 2024 (31.12.2024) › «Rechnung löschen». Der Dialog nennt 31.12.2034. Mögliche Abhilfe: einen Satz ergänzen wie «Haben Sie die Rechnung erst im Folgejahr bezahlt, bewahren Sie sie ein Jahr länger auf», oder die Frist vorsichtshalber ab dem Jahr nach dem Rechnungsdatum rechnen, wenn das Rechnungsdatum im Dezember liegt. Das sollte ein Fach-Review klären.
- **P-2:** Übersicht › «Rechnungen 2014 von Alpenblick können gelöscht werden» › «Rechnungen ansehen» › «Behalten». Hilfe wäre ein sichtbarer Satz unter der Schaltfläche, etwa «Dwello zeigt diesen Hinweis für Alpenblick 2014 nicht mehr; Ihre Rechnungen bleiben unverändert». Oder eine Beschriftung, die das Objekt nennt, etwa «Hinweis ausblenden, Rechnungen behalten».
- **P-3:** Gleicher Weg wie P-2. Hilfe wäre, Rechnungen für wertvermehrende Investitionen in dieser Ansicht sichtbar zu kennzeichnen (z. B. «Aufbewahren bis zum Verkauf») oder getrennt unter einer eigenen Überschrift aufzuführen. Die Überschrift könnte etwa «2 von 3 Rechnungen können gelöscht werden» lauten.

## Nicht geprüft

- **Eine Rechnung, deren Leistungszeitraum in einer früheren Periode liegt als ihr Rechnungsdatum, unter den abgelaufenen Rechnungen** (z. B. Leistung 2014, Rechnung Januar 2015). Dafür hätte ich eine Rechnung speichern müssen, und das war nicht erlaubt. Ob Übersicht und Löschdialog dann dasselbe Datum nennen, bleibt offen. Für die neuere Rechnung ewl Fernwärme Q4 2025 / 20.01.2026 stimmt der Dialog.
- **Die Aufgaben Alpenblick 2015 und Seepark Residenz 2013 in der Liste und im Löschdialog:** Sie verschwanden während meines Laufs durch andere Personas. Die Daten auf der Übersicht habe ich vorher nachgerechnet.
- **Was «Behalten» bewirkt:** Laut Auftrag nicht gedrückt.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/15dad132-c5e4-5816-82f1-39124f628874/scratchpad/weber-1410/`.
