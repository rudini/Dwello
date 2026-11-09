# Helga – alte Rechnungen löschen (#1410)

Desktop 1440 × 900, Zoom 150 %, Maus. Gebäude: Alpenblick. Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/15dad132-c5e4-5816-82f1-39124f628874/scratchpad/helga-1410/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungsliste (Abrechnungsperiode 2014), Hinweis | Der Knopf «Behalten» sagt nicht, was er behält: alle Rechnungen der Liste, nur die zwei gemeinten, oder blendet er nur den Hinweis aus? Im Text darüber steht «Behalten Sie sie» für die Investitionen. Ich hätte ihn fast für «Fenster-Rechnung behalten» gehalten. |
| P-2 | Minor | Rechnungsliste (Abrechnungsperiode 2014) | Der Hinweis spricht von «2 Rechnungen», darunter stehen «3 Rechnungen». Welche zwei gemeint sind, steht an keiner Zeile; ich musste selbst schliessen, dass die Fenster-Rechnung (Kategorie «Wertvermehrende Investitionen») nicht mitzählt. |
| P-3 | Minor | Bestätigung «Rechnung löschen» (Liftwartung 2014) | Die Bestätigung sagt bei der alten Rechnung nichts zur Aufbewahrung, nur «Das lässt sich nicht rückgängig machen». Dass ich sie löschen darf, muss ich daraus schliessen, dass kein Warnsatz kommt («nennt Dwello das beim Löschen»). Ein Satz wie «Die Aufbewahrungsfrist dieser Rechnung ist abgelaufen» hätte mir Sicherheit gegeben. |
| P-4 | Minor | Bestätigung «Rechnung löschen» (2025er Rechnung) | Bei der Rechnung von 2025 steht «Bewahren Sie die Originalrechnung bis zum 31.12.2035 auf», aber der rote Knopf «Rechnung löschen» ist genau gleich da. Ich war unsicher, ob «Originalrechnung» heisst «das Papier aufheben, hier darf ich löschen» oder «nicht löschen». Der lange Text mit Art. 958f OR, Art. 152 DBG und «Nachsteuerverfahren» ist für mich schwer. |

## Beobachtungen

- Der Hinweis auf der Übersicht ist gut zu finden, Titel «Rechnungen 2014 von Alpenblick können gelöscht werden» ist klar. Der Knopf heisst bei allen drei Hinweisen gleich «Rechnungen ansehen»; ich musste genau auf den Titel daneben schauen.
- Der Hinweis ist auf der Rechnungsliste gelb mit Warndreieck. Das hat mich zuerst erschreckt, als hätte ich etwas falsch gemacht; dabei ist es nur ein Angebot zum Aufräumen.
- «Aufbewahrungsfrist» verstehe ich (wie lange man aufheben muss). «Abrechnungsperiode» verstehe ich dank der Zeile über dem Hinweis («01.01.2014 – 31.12.2014»), allein wäre es mir zu fachlich. «Behalten» siehe P-1. «Wertvermehrende Investitionen» kannte ich nicht, der Satz in der Fenster-Bestätigung (Grundstückgewinnsteuer, bis zum Verkauf) hat es mir dann erklärt.
- Auf der gefilterten Liste steht beim Feld «Jahr» weiterhin «Alle Jahre», und 2014 gibt es in der Auswahl gar nicht (nur 2021–2026). Gezeigt werden trotzdem nur die Rechnungen von 2014. Das passt für mich nicht zusammen.
- Nach dem Löschen landete ich auf der ganzen Rechnungsliste (88 Rechnungen, alle Gebäude), nicht mehr bei Alpenblick 2014. Für die Fenster-Rechnung musste ich über die Übersicht zurück. Die Meldung «Rechnung von Lift AG gelöscht» war gut sichtbar.
- Danach zeigte die Übersicht für 2014 «1 Rechnung» statt 2, und die Liste «2 Rechnungen». Das stimmt.
- In jeder Bestätigung steht «Sie fliesst dann in keine neue Nebenkostenabrechnung mehr ein». Bei einer Rechnung von 2014 hat mich das kurz verwirrt: Wird 2014 noch abgerechnet?
- Abbrechen schliesst die Bestätigung, die Rechnung bleibt (Fenster Keller AG und Winterdienst Oberland sind noch da).

## Aufgabe geschafft: ja

Nur «Liftwartung 2014» gelöscht; «Neue Fenster» und «Schneeräumung Dezember 2025» (Winterdienst Oberland) abgebrochen; «Behalten» nicht gedrückt.

## Aufwand

Etwa 10 Minuten, rund 14 Schritte (Übersicht, Liste, Lift-Rechnung, Löschen, Bestätigen, zurück über Übersicht, Fenster-Rechnung, Löschen, Abbrechen, Liste filtern auf Alpenblick und 2025, Rechnung öffnen, Löschen, Abbrechen).

## Ablauf

- Liste 2014: erwartet, dass die zwei löschbaren Rechnungen markiert sind; gesehen: drei Rechnungen ohne Markierung, Hinweis sagt «2» (P-2).
- Hinweis auf der Liste: erwartet einen Knopf «Rechnungen löschen» oder nichts; gesehen: nur «Behalten», ohne Erklärung, was dann geschieht (P-1).
- Bestätigung Liftwartung 2014: erwartet einen Satz, dass die Frist abgelaufen ist und ich löschen darf; gesehen: nur der allgemeine Text mit Lieferant und Betrag (CHF 950.00) und «nicht rückgängig» (P-3). Ich habe trotzdem gelöscht, weil die Übersicht es so sagte; ganz sicher fühlte ich mich nicht.
- Nach dem Löschen: erwartet, wieder auf der Liste Alpenblick 2014 zu sein; gesehen: die ganze Rechnungsliste.
- Bestätigung «Neue Fenster»: erwartet dieselbe Bestätigung; gesehen: zusätzlich «Rechnungen für wertvermehrende Investitionen bewahren Sie auf, bis Sie das Gebäude verkaufen: Sie belegen die Anlagekosten bei der Grundstückgewinnsteuer.» Das war klar und hat erklärt, warum sie im Hinweis nicht mitzählt. Ein deutlicher Unterschied, gut.
- Bestätigung 2025er Rechnung: erwartet, dass Dwello das Löschen verhindert oder deutlich abrät; gesehen: Aufbewahren bis 31.12.2035 mit Gesetzesartikeln, Löschen aber ohne Weiteres möglich (P-4).

## Vorschläge

- **P-1:** Übersicht → «Rechnungen 2014 von Alpenblick …» → «Rechnungen ansehen». Hilfreich: ein Knopftext, der sagt, was passiert (z. B. «Alle behalten und Hinweis ausblenden»), oder ein Satz darunter.
- **P-2:** Gleicher Weg, Liste ansehen. Hilfreich: an den Zeilen, deren Frist abgelaufen ist, ein Vermerk («Aufbewahrungsfrist abgelaufen»), oder im Hinweis «2 von 3 Rechnungen».
- **P-3:** Liste 2014 → «Lift AG Liftwartung 2014» → «Rechnung löschen». Hilfreich: ein Satz in der Bestätigung, dass die Aufbewahrungsfrist am 31.12.2024 endete.
- **P-4:** Rechnungen, Gebäude Alpenblick, Jahr 2025, «Suchen» → «Winterdienst Oberland» → «Rechnung löschen». Hilfreich: zuerst ein kurzer Satz in einfachen Worten («Diese Rechnung müssen Sie noch bis 31.12.2035 aufbewahren. Löschen Sie sie nur, wenn Sie das Original anderswo aufbewahren.»), die Gesetzesartikel danach.

## Nicht geprüft

- 200 % Zoom: nicht gemacht, nur 150 %.
- «Behalten»: auftragsgemäss nicht gedrückt, daher weiss ich nicht, was es tut.
- Die Hinweise zu Alpenblick 2015 und Seepark Residenz 2013: nur auf der Übersicht gelesen, nicht geöffnet.
