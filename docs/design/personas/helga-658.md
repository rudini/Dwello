# Helga – Filter auf Mietverträge, Rechnungen, Nebenkostenabrechnungen (#658)

Ich habe mit der Maus gearbeitet: auf 1440 × 900 bei 150 % (960 px Breite), auf 1280 × 800 bei 150 % (853 px) und auf 1280 × 800 bei 200 % (640 px; da wird das Menü zum Knopf mit drei Strichen). Gespeichert habe ich nichts.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Nebenkostenabrechnungen, Kachel «Entwurf» nach dem Klick | Wenn der Filter aktiv ist, läuft «Filter aufheben» unten rechts über den Rand der Kachel hinaus («aufheben» steht halb ausserhalb des Rahmens). Das sehe ich bei 1440 × 900 / 150 % und bei 1280 × 800 / 200 %. Gemessen ist der Inhalt 116 px breit, die Kachel aber nur 105 px. Bei 1280 × 800 / 150 % passt es. |
| P-2 | Minor | Rechnungen, Filter «Kategorie» | Die längste Kategorie wird abgeschnitten: Statt «Wertvermehrende Investitionen» steht «Wertvermehrende Investitior» bei 1440 × 900 / 150 % und bei 1280 × 800 / 200 %. Der Text braucht 237 px, das Feld bietet 235 px. Die übrigen Filter zeigen ihre Wahl ganz. |
| P-3 | Minor | Mietverträge, Liste | Das Abzeichen «Abrechnung fehlt» sagt nicht, für welches Jahr. Bei Marco Bernasconi und Thomas Weber steht es, obwohl beide unter Nebenkostenabrechnungen einen Entwurf für 2025 haben. Erst im Vertrag von Marco Bernasconi steht «Abrechnung 2023 fehlt». Ich hätte fast eine zweite Abrechnung für 2025 erstellt. |

## Beobachtungen

- In keiner der drei Grössen scrollt eine der drei Seiten seitwärts: Die Seite war immer genau so breit wie das Fenster (960/960, 853/853, 640/640).
- Mietverträge: Die Suche «Seepark» findet 4 Verträge. Mit Gebäude «Seepark Residenz» und Vertragsstatus «Laufende Mietverträge» bleiben 3 (Nina Brunner, Marco Bernasconi, Thomas Weber). «Seepark Residenz» und «Laufende Mietverträge» stehen ganz und gut lesbar im Feld; die Felder sind breit genug. Die Liste filtert sofort nach der Auswahl, ohne «Suchen». Das ist angenehm, aber auch etwas überraschend, weil es den Knopf «Suchen» trotzdem gibt.
- Mietverträge: Im Vertragsstatus gibt es keine Wahl «Abrechnung fehlt». Um die Verträge ohne Abrechnung zu finden, musste ich alle 11 Zeilen durchlesen; 8 davon haben das gelbe Abzeichen. Das Abzeichen hat ein Symbol und Text, also nicht nur Farbe. Das ist gut.
- Mietverträge: «Filter zurücksetzen» steht hier ohne Kreuz-Symbol, auf Rechnungen und Nebenkostenabrechnungen mit «×». Eine kleine Ungleichheit.
- Rechnungen: Gebäude «Seepark Residenz» und Jahr «2025» ergeben «15 Rechnungen», beide Wahlen werden ganz angezeigt. Die Filter stehen in zwei Spalten. Weil «Suche» einen zweizeiligen Hilfetext hat, liegt das Suchfeld tiefer als das Feld «Gebäude» daneben. Das sieht unruhig aus, stört aber nicht.
- Nebenkostenabrechnungen: Es gibt kein Auswahlfeld für den Status. Ich habe die Kachel «7 Entwurf» gefunden: Nach einem Klick zeigt die Liste «7 Abrechnungen mit dem Status «Entwurf»», und darüber steht ein erklärender Satz. Das ist klar, nur hätte ich ein Feld «Status» wie auf den anderen Seiten erwartet.
- Nebenkostenabrechnungen: Bei 960 px wird der Titel getrennt («Nebenkostenabrech-» / «nungen»). Er ist lesbar, aber ungewohnt.
- Die Zeilen sind in allen drei Listen gut lesbar: Der Name ist der Link, darunter stehen Wohnung und Gebäude, der Betrag ist fett, die Abzeichen haben Text. Bei 200 % ist alles gross genug. Die Zeilen sind recht hoch, darum muss ich bei Rechnungen viel scrollen (20 pro Seite).
- Auf 1440 × 900 / 150 % fehlen im Seitenmenü auf der ganzen Seite die Einträge unter «Dokumente» (Berichte, Einstellungen, Hilfe). Sie sind erst sichtbar, wenn man im Menü selbst scrollt. Das war nicht Teil der Aufgabe.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten und 25 Schritte (Seiten öffnen, auswählen, vergleichen), alle drei Grössen eingerechnet.

## Ablauf

- Rechnungen, Kategorie: Ich habe erwartet, dass jede Kategorie ganz lesbar ist. Ich sah aber «Wertvermehrende Investitior» (P-2).
- Nebenkostenabrechnungen: Ich habe ein Feld «Status» wie bei den Mietverträgen erwartet. Ich sah nur «Gebäude»; der Statusfilter steckt in den Zahlen-Kacheln.
- Nach dem Klick auf «7 Entwurf» habe ich eine sauber umrahmte Kachel erwartet. Ich sah «Filter aufheben», das über den Rand hinausläuft (P-1).
- Mietverträge: Ich habe erwartet, dass «Abrechnung fehlt» eine Abrechnung meint, die es noch gar nicht gibt. Ich sah das Abzeichen auch bei Mietern mit einem Entwurf für 2025 (P-3).

## Vorschläge

- **P-1:** Bei 1440 × 900 und 150 % `/statements` öffnen, auf «7 Entwurf» klicken: «aufheben» ragt aus der Kachel. Es würde helfen, den Text in der Kachel umbrechen zu lassen, ihn kürzer zu machen (nur das Häkchen und «Aufheben») oder die Kacheln bei wenig Platz in zwei Reihen zu stellen.
- **P-2:** Bei 1440 × 900 und 150 % `/invoices` öffnen, unter Kategorie «Wertvermehrende Investitionen» wählen: Das Wort ist am Ende abgeschnitten. Es würde helfen, das Feld breiter zu machen (zum Beispiel über die ganze Zeile) oder bei diesen Breiten die Filter in eine Spalte zu stellen.
- **P-3:** `/contracts` öffnen: Marco Bernasconi hat «Abrechnung fehlt», unter Nebenkostenabrechnungen gibt es aber den Entwurf NK-22222222-2025-0004. Es würde helfen, das Jahr ins Abzeichen zu schreiben («Abrechnung 2023 fehlt») wie im Vertrag selbst.

## Nicht geprüft

- Das Speichern habe ich nicht geprüft; laut Auftrag sollte ich nichts speichern.
- Wie die Auswahllisten aufgeklappt aussehen, konnte ich nicht prüfen, weil der Browser ohne Fenster die aufgeklappte Liste nicht abbildet. Ich habe nur das geschlossene Feld mit der gewählten Option angesehen und die Breite der Optionen gemessen.
- Den Dunkelmodus habe ich nicht geprüft.
