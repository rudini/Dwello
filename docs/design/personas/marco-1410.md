# Marco – Alte Rechnungen löschen (Aufgabe #1410), Handy 390 × 844

Ich bin Marco, 38, Handy, wenig Zeit. Ich will nur schnell sehen, welche alten Rechnungen von Alpenblick weg können, und nichts kaputt machen. Gespeichert habe ich nichts: kein «Behalten», kein Löschen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen (Liste, Filter 2014 Alpenblick) | Ich komme von der Aufgabe auf der Übersicht, sehe aber zuerst nur «Rechnungen hochladen», «Rechnung erfassen» und das ganze Filterformular. Der Hinweis «Rechnungen 2014 von Alpenblick können gelöscht werden» beginnt erst bei etwa 1270 px, also anderthalb Bildschirme weiter unten. Ich musste suchen, ob ich überhaupt am richtigen Ort bin. |
| P-2 | Minor | Rechnungen (Liste), Hinweis | Was der Knopf «Behalten» macht, steht nirgends. Behalte ich damit alle Rechnungen von 2014? Verschwindet nur die Aufgabe, und für wie lange? Direkt davor steht im Text «Behalten Sie sie, bis Sie das Gebäude verkaufen», und das ist auf die Investitionsrechnungen bezogen. Ich hätte den Knopf fast als «die Fensterrechnung behalten» gelesen und gedrückt, ohne zu wissen, was dann passiert. |

## Beobachtungen

- Hinweis und «Behalten» sind auf dem Handy gut lesbar. Auf der Liste gibt es kein seitliches Scrollen (Seitenbreite 390 = Fensterbreite, kein Element ragt hinaus). Der Knopf ist 48 px hoch und gut zu treffen. Der Hinweis steht in einem gelben Kasten mit Warn-Symbol.
- Im Hinweis steht «Aufbewahrungsfrist von 2 Rechnungen», in der Liste darunter aber «3 Rechnungen». Erklärt ist das (die Investition «Neue Fenster» zählt nicht), aber erst nach zweimal Lesen.
- Der Filter «Jahr» zeigt «Alle Jahre» und bietet 2014 gar nicht an (nur 2021–2026), obwohl die Liste auf 2014 gefiltert ist. Den Filter auf 2014 macht der Satz «Abrechnungsperiode 01.01.2014 – 31.12.2014» darüber. Wenn ich hier etwas antippe, weiss ich nicht, ob ich den Filter auf 2014 verliere.
- Der Brotkrümel «Rechnungen» auf der Detailseite führt zu `/invoices` ohne Filter. Zurück zur Liste von 2014 komme ich nur über den Zurück-Knopf des Browsers.
- Auf der Übersicht stehen drei fast gleiche Karten («2014 Alpenblick», «2015 Alpenblick», «2013 Seepark»), jede mit demselben langen Absatz. Der Link heisst in allen dreien nur «Rechnungen ansehen», auf dem Handy ist das viel Text zum Scrollen.
- Die Bestätigung für «Hauswartung 2014» (Hauswart Meier) ist kurz und klar: Betrag CHF 1’800.00, «fliesst in keine neue Nebenkostenabrechnung mehr ein», «lässt sich nicht rückgängig machen». Es kommt kein Hinweis zur Aufbewahrung, weil die Frist abgelaufen ist. Das passt.
- In der Bestätigung für «Neue Fenster» 2014 (wertvermehrende Investition) steht, dass ich sie bis zum Verkauf des Gebäudes aufbewahren soll (Grundstückgewinnsteuer). So hält Dwello, was der Hinweis auf der Liste verspricht.
- Die Bestätigung für eine neue Rechnung (BKW Energie AG, Allgemeinstrom H2 2025, CHF 196.30) nennt: «Bewahren Sie die Originalrechnung bis zum 31.12.2035 auf, auf Papier oder als Datei …» und erklärt das mit Art. 958f OR und Art. 152 DBG. Der Dialog ist 633 px hoch und passt noch ganz auf den Bildschirm, ohne Scrollen und ohne seitliches Scrollen. Für mich als Eiligen ist der Text lang, aber die Frist mit Datum steht im ersten Satz, das reicht mir.
- «Abbrechen» schliesst den Dialog jedes Mal. Ich bleibe auf der Detailseite, der Fokus liegt wieder auf «Rechnung löschen», und es wurde keine Anfrage ausser GET gesendet.
- Im Dialog steht der rote Knopf «Rechnung löschen» oben und «Abbrechen» darunter. Mit dem Daumen liegt «Abbrechen» unten, wo man ohnehin hintippt. Das ist gut.

## Aufgabe geschafft: ja

## Aufwand

Etwa 3 Minuten, 8 Schritte (Übersicht, Karte 2014 «Rechnungen ansehen», zum Hinweis scrollen, «Hauswartung 2014» öffnen, «Rechnung löschen», «Abbrechen», neue Rechnung öffnen, «Rechnung löschen», «Abbrechen»).

## Ablauf

- Liste nach «Rechnungen ansehen» (Karte 2014). Erwartet: oben der Hinweis zu 2014. Gesehen: oben Knöpfe und das Filterformular, der Hinweis erst nach anderthalb Bildschirmen Scrollen (P-1).
- Hinweis gelesen. Erwartet: klar, was «Behalten» bewirkt. Gesehen: keine Erklärung beim Knopf (P-2).
- Hinweis gegen die Liste gelesen. Erwartet: gleiche Anzahl. Gesehen: 2 im Hinweis, 3 in der Liste (im Text erklärt).

## Vorschläge

- **P-1**: Übersicht, Karte «Rechnungen 2014 von Alpenblick können gelöscht werden», «Rechnungen ansehen» antippen, auf 390 × 844 landet man am Seitenanfang. Hilfreich wäre, den Hinweis über das Filterformular zu stellen oder beim Kommen von der Aufgabe direkt zum Hinweis zu springen.
- **P-2**: Liste wie bei P-1, Hinweis lesen, Knopf «Behalten». Hilfreich wäre ein sichtbarer Satz am Knopf, was er bewirkt (z. B. dass die Aufgabe für 2014 verschwindet und keine Rechnung gelöscht wird), oder ein Knopftext, der das sagt, damit man ihn nicht auf die Investitionsrechnung bezieht.

## Nicht geprüft

- Was «Behalten» und das Löschen tatsächlich bewirken: Laut Auftrag sollte ich nichts speichern, also habe ich weder «Behalten» noch das Löschen bestätigt.
- Die Karten 2015 Alpenblick und 2013 Seepark: Ich habe nur die Texte auf der Übersicht gelesen und sie nicht geöffnet.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/15dad132-c5e4-5816-82f1-39124f628874/scratchpad/marco-1410/`
