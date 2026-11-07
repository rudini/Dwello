# Helga, 68: Prüfung der vereinbarten Nebenkosten im Assistenten «Abrechnungen erstellen» (#688)

Desktop 1440 × 900, Zoom 150 % (Gegenprobe 200 %), Maus. Persona-App auf :3300, Branch w-688.
Fehler nachgestellt: Die Anfrage `/api/statements/agreements` (in den Netzwerkanfragen des Browsers gesehen) schlägt zweimal mit 500 fehl, beim dritten Mal geht sie durch; der zweite und dritte Versuch sind um 2,5–3 s verzögert, damit ich den Wartezustand sehe.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-688/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| H-1 | Minor | Schritt 3 «Heizprofil und Verwaltungspauschale», Prüfung fehlgeschlagen | Wenn ich auf «Weiter» klicke, während die Prüfung fehlgeschlagen ist, passiert in meinem Bildausschnitt nichts. Die rote Meldung und der neue Satz «Dwello geht weiter, sobald die Mietverträge geprüft sind.» stehen unterhalb, ausserhalb des Bildes. Bei 150 % sehe ich gerade noch den roten Titel am unteren Rand, bei 200 % gar nichts. Ich hätte noch einmal geklickt oder gedacht, Dwello hängt. |
| H-2 | Minor | Schritt 3, nach dem zweiten Fehlschlag | Zwei Meldungen sagen Verschiedenes: Die rote Meldung sagt «Versuchen Sie es in einigen Minuten noch einmal.», der Satz darunter «Wählen Sie «Erneut versuchen». Gelingt die Prüfung, geht es weiter.». Ich weiss nicht, ob ich warten oder gleich wieder klicken soll. |

## Beobachtungen

- Die erste rote Meldung «Vereinbarte Nebenkosten nicht geprüft» ist klar: Dwello konnte nicht prüfen, ohne Prüfung geht es nicht weiter, ich soll «Erneut versuchen» wählen. Der Knopf ist gross und gut lesbar.
- Während des neuen Versuchs bleibt die Meldung stehen, der Knopf wird grau und zeigt «Bitte warten …». Auch «Weiter» zeigt dann «Bitte warten …». Das habe ich verstanden: Dwello arbeitet.
- Oben in der Karte erscheint während des Versuchs «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …». Dieser Satz ist weit oben, ich sehe ihn unten beim Knopf nicht. Der graue Knopf hat mir gereicht.
- Nach dem zweiten Fehlschlag: «Dwello hat es erneut versucht und konnte die Mietverträge wieder nicht prüfen.» Ich verstehe, dass Dwello es noch einmal versucht hat. Titel, Farbe und Knopf bleiben aber gleich; dass sich der Text geändert hat, merke ich nur, wenn ich ihn noch einmal lese.
- Nach dem gelungenen Versuch, ohne dass ich vorher «Weiter» geklickt habe, verschwindet die rote Meldung und unten steht «Die Mietverträge sind geprüft.». Das ist gut verständlich, aber klein und ganz unten, unter dem «Weiter»-Knopf.
- Hatte ich vorher «Weiter» geklickt, springt Dwello nach dem gelungenen Versuch selbst zu «Schritt 4 von 5: Vorschau». Das hatte der Satz unten angekündigt. Mich hat das nicht gestört, ich war nur kurz überrascht.
- Der Fokus bleibt nach einem Fehlschlag auf «Erneut versuchen», nach dem Sprung in Schritt 4 liegt er auf der Überschrift.
- Bei 200 % kein seitliches Scrollen (Seitenbreite 720 = Fensterbreite); die rote Meldung bricht sauber um.
- «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» steht über «Weiter»; die Hinweise stehen aber unter den Knöpfen. Ich hätte sie eher über dem Knopf erwartet.

## Aufgabe geschafft: teilweise

Die Prüfung habe ich nach zwei Fehlschlägen mit «Erneut versuchen» durchgebracht und bin bis «Schritt 4 von 5: Vorschau» gekommen (Alpenblick, 2025, 2 Abrechnungen). Das Erstellen in Schritt 5 habe ich nicht ausgelöst, weil mir kein Gebäude zum Speichern zugeteilt war.

## Aufwand

Etwa 15 Minuten, 6 Durchläufe. Pro Durchlauf: Schritt 1 Weiter, Alpenblick wählen, Weiter, in Schritt 3 nach unten scrollen, «Weiter» (Gegenprobe), zweimal «Erneut versuchen».

## Ablauf

- Schritt 3, Prüfung fehlgeschlagen, Klick auf «Weiter». Erwartet: Dwello sagt mir an dieser Stelle, warum es nicht weitergeht. Gesehen: In meinem Bildausschnitt ändert sich nichts; der Hinweis steht unterhalb, ausserhalb des Bildes (H-1).
- Nach dem zweiten Fehlschlag. Erwartet: ein klarer Rat, was ich jetzt tun soll. Gesehen: zwei Sätze, «in einigen Minuten noch einmal» und «Wählen Sie «Erneut versuchen»» (H-2).
- Nach dem gelungenen Versuch (mit vorherigem «Weiter»). Erwartet: dass ich noch einmal auf «Weiter» klicken muss. Gesehen: Dwello springt selbst zu Schritt 4.

## Vorschläge

- **H-1:** Abrechnungen erstellen, Periode 2025, Alpenblick, Weiter; `/api/statements/agreements` schlägt mit 500 fehl; in Schritt 3 zu «Weiter» scrollen und klicken (150 % oder 200 %). Hilfreich wäre, nach dem Klick zur roten Meldung zu scrollen oder den Fokus dorthin zu setzen, oder den Hinweis direkt beim Knopf «Weiter» zu zeigen.
- **H-2:** Wie H-1, dann zweimal «Erneut versuchen», der zweite Versuch schlägt auch fehl. Hilfreich wäre ein einziger Rat, z. B. auch im Satz unten «Versuchen Sie es in einigen Minuten noch einmal», oder den Satz unten weglassen, solange die rote Meldung dasselbe sagt.

## Nicht geprüft

- Schritt 5 «Erstellen» (Speichern): kein Gebäude zum Speichern zugeteilt, daher nicht ausgelöst.
- Ein Fehlschlag von mehr als zwei Versuchen: nicht nachgestellt; ob der Text beim dritten Fehlschlag gleich bleibt, weiss ich nicht.
- Ein Fehlschlag, bei dem die Prüfung dann tatsächlich nicht vereinbarte Nebenkosten findet: Die Demo-Daten von Alpenblick 2025 liefern nach dem Durchlassen nur «Die Mietverträge sind geprüft.»
