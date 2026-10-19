# Helga – Issue #456: Rechnungen eines Gebäudes ab der Gebäudeseite

Aufgabe: «Ich möchte sehen, welche Rechnungen ich für die Seepark Residenz schon erfasst habe.» Start in der Übersicht, über die Seepark Residenz zu ihren Rechnungen.
Umgebung: Persona-App http://localhost:3300 (Demodaten), Desktop 1440 × 900 bei 150 % (zusätzlich 200 %), Maus; die Gebäudeseite zusätzlich mobil bei 390 × 844. Nichts gespeichert (nur angeschaut).
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/helga-456/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Rechnungen (gefiltert nach Gebäude) | Von der gefilterten Rechnungsliste führt kein Link zurück zur Seepark Residenz (kein Brotkrümel, kein «Zurück zum Gebäude»). Zurück komme ich nur mit der Zurück-Taste des Browsers oder über Menü > Gebäude > Seepark Residenz. Neu, weil die Änderung diesen Weg erst schafft. |
| P-2 | Minor (bestand schon vorher) | Rechnungen (gefiltert nach Gebäude) | Dass die Liste nur die Seepark Residenz zeigt, sehe ich nur im Auswahlfeld «Gebäude (optional)» im Filterbereich. Der Titel heisst «Rechnungen», der Untertitel «Die Rechnungen Ihrer Gebäude», die Zwischenüberschrift «30 Rechnungen»; keines nennt das Gebäude. Die Filteranzeige der Rechnungsliste ist nicht Teil dieser Änderung. |
| P-3 | Nit | Gebäudeseite, mobil 390 px | Der neue Knopf steht mobil allein in einer eigenen Zeile, «Bearbeiten» und «Löschen» rutschen in die zweite Zeile. Dadurch steht «Wohnung erfassen» (der einzige gefüllte Knopf) ganz unten am Rand des ersten Bildschirms (oberer Rand bei 806 von 844 px). Er bleibt sichtbar, ist aber leicht zu übersehen. |

## Beobachtungen

- In der Übersicht unter «Vermietete Wohnungen pro Gebäude» ist «Seepark Residenz» ein Link. Den habe ich sofort gefunden.
- Auf der Gebäudeseite steht «Rechnungen ansehen» oben ganz links, mit Beleg-Symbol und vor «Bearbeiten». Das ist genau mein Wort, ich musste nicht suchen.
- Die Liste zeigt in jeder Zeile «Seepark Residenz, <Datum>». Wenn ich die Zeilen lese, merke ich also, dass nur dieses Gebäude drin ist.
- Seite 2 behält den Filter (Adresse `…?building=…&page=2`, Auswahlfeld weiter «Seepark Residenz», Text «Seite 2 von 2»).
- «Filter zurücksetzen» führt zu allen Rechnungen: Die Zwischenüberschrift springt von «30 Rechnungen» auf «83 Rechnungen», die Adresse ist wieder `/invoices`. Auch Menü > «Rechnungen» geht dorthin.
- Mit der Zurück-Taste des Browsers komme ich zurück. Von Seite 2 brauche ich zwei Klicks, dann bin ich wieder auf der Gebäudeseite.
- Mobil bei 150 % Schriftvergrösserung (260 px Breite) lässt sich die Seite seitwärts schieben (369 px Inhalt). Grund ist die obere Leiste der App: Der Sprachknopf ist bei «De…» abgeschnitten. Die Knöpfe der Gebäudeseite brechen sauber um, auch «Rechnungen ansehen» auf zwei Zeilen. Das liegt ausserhalb der verlangten 390 px und nicht an dieser Änderung.
- Bei 150 % am Desktop steht die Rechnungsliste selbst erst unter dem Filterbereich, unterhalb des ersten Bildschirms. Ich muss scrollen, um die erste Rechnung zu sehen (bestand schon vorher).

## Aufgabe geschafft: ja

## Aufwand

Etwa 1 Minute, 2 Klicks: Übersicht > «Seepark Residenz» > «Rechnungen ansehen». Dazu Rückwege getestet (Seite 2, Zurück-Taste, «Filter zurücksetzen», Menü).

## Ablauf

1. **Übersicht öffnen.** Erwartet: irgendwo meine Gebäude. Gesehen: unten «Gebäude auf einen Blick», darin «Vermietete Wohnungen pro Gebäude» mit dem unterstrichenen Link «Seepark Residenz». (Screenshot 01: ganze Übersicht, der Link ist ziemlich weit unten, nach einigem Scrollen.)
2. **«Seepark Residenz» anklicken.** Erwartet: die Seite des Hauses. Gesehen: Brotkrümel «Gebäude › Seepark Residenz», Titel «Seepark Residenz», daneben drei Knöpfe «Rechnungen ansehen», «Bearbeiten» und «Löschen» (rot, ohne Rahmen). (Screenshot 02: alles auf dem ersten Bildschirm, gut lesbar bei 150 %.)
3. **«Rechnungen ansehen» anklicken.** Erwartet: die Rechnungen dieses Hauses mit einem Titel wie «Rechnungen der Seepark Residenz». Gesehen: die allgemeine Seite «Rechnungen» mit «Rechnungen hochladen» und «Rechnung erfassen»; im Filter steht bei «Gebäude (optional)» schon «Seepark Residenz». Darunter «30 Rechnungen», alle mit «Seepark Residenz» in der Zeile. (Screenshot 03.) Kurz habe ich mich gefragt, ob das jetzt alle Rechnungen sind. Erst am Auswahlfeld habe ich gesehen, dass nur das eine Haus gezeigt wird (P-2).
4. **Zurück zum Haus.** Erwartet: oben ein «Gebäude › Seepark Residenz › Rechnungen» oder ein Zurück-Link. Gesehen: nichts davon. Erst mit der Browser-Taste «Zurück» war ich wieder auf der Gebäudeseite (P-1).
5. **Alle Rechnungen.** Erwartet: ein Weg, den Filter wegzunehmen. Gesehen: «Filter zurücksetzen» zeigt danach «83 Rechnungen» aller Häuser. Klar.
6. **Seite 2.** «Nächste Seite» zeigt weiter nur die Seepark Residenz, «Seite 2 von 2». Gut.
7. **200 % Zoom am Desktop (Screenshot 07).** Die drei Knöpfe stehen in einer Reihe, alle 48 px hoch, nichts abgeschnitten, kein Seitwärtsschieben (Inhalt 720 von 720 px).
8. **Mobil 390 × 844 (Screenshot 08).** Erwartet: Knöpfe passen, kein Seitwärtsschieben. Gesehen: Inhalt 390 von 390 px breit, also kein Seitwärtsschieben. «Rechnungen ansehen» steht allein in der ersten Reihe, «Bearbeiten» und «Löschen» in der zweiten. Alle Knöpfe sind 48 px hoch. Der gefüllte Hauptknopf «Wohnung erfassen» steht ganz unten am Bildschirmrand (P-3).
9. **Rechnungsliste mobil (Screenshot 10).** Kein Seitwärtsschieben. Das Gebäude steht im Auswahlfeld, die Liste kommt erst nach den Filtern.

## Verwirrung

- «Gebäude (optional)» mit «Seepark Residenz» als Filter: Ich habe es nicht sofort als «hier sehen Sie nur dieses Haus» gelesen, sondern zuerst als Eingabefeld, das ich ausfüllen soll.
- «Umlagefähigkeit», «Umlagefähig», «Manuell» bei jeder Rechnung: «Umlagefähig» erklärt der Untertitel halbwegs. Was «Manuell» bedeutet (von Hand eingetragen statt von der KI?), weiss ich nicht. Das gehört nicht zu dieser Änderung.

## Fehlerrisiken

- Wer die Seite später wieder aufruft oder auf «Rechnungen erfassen» geht und zurückkommt, merkt vielleicht nicht mehr, dass gefiltert ist, und meint, es gebe nur 30 Rechnungen (P-2).
- Auf der Gebäudeseite steht «Löschen» gleich neben dem neuen Knopf. Mobil liegt es in der zweiten Reihe direkt unter «Rechnungen ansehen»; ein Fehltipp wäre unangenehm. Ich habe nicht geprüft, ob danach eine Bestätigung kommt (nichts gelöscht).

## Vorschläge

- **P-1:** Übersicht > «Seepark Residenz» > «Rechnungen ansehen». Oben auf der Rechnungsseite gibt es keinen Weg zurück zum Gebäude. Hilfreich wäre ein Brotkrümel «Gebäude › Seepark Residenz › Rechnungen» oder ein Link «Zurück zu Seepark Residenz», wenn die Liste über den Gebäudelink geöffnet wurde.
- **P-2 (bestand vorher):** Dieselben Schritte. Titel und Zwischenüberschrift nennen das Gebäude nicht. Hilfreich wäre ein Satz über der Liste wie «30 Rechnungen der Seepark Residenz» oder ein sichtbarer Hinweis «Gefiltert: Seepark Residenz» mit dem Knopf «Alle Rechnungen zeigen».
- **P-3:** Gebäudeseite auf 390 × 844 öffnen. «Wohnung erfassen» steht erst am unteren Rand. Man könnte die drei Kopfknöpfe enger zusammenfassen (z. B. «Bearbeiten» und «Löschen» in eine Reihe mit kleinerem Abstand) oder es so lassen; es ist nur ein Schönheitsfehler.

## Nicht geprüft

- Löschen und Bearbeiten des Gebäudes: kein Auftrag zum Speichern, nichts verändert.
- Ein Gebäude ohne Rechnungen (leere gefilterte Liste): Alle Demo-Gebäude haben Rechnungen, und ich sollte nichts anlegen.
- Dunkler Modus und andere Sprachen: nicht Teil des Auftrags.
- Wie die Seiten auf dem Stand vor der Änderung aussahen: Die alte Version konnte ich nicht öffnen. P-2 halte ich für älter, weil die Filterauswahl in der Rechnungsliste mit dem Gebäudelink nichts zu tun hat.
