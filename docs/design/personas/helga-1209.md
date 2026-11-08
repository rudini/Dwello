# Helga – Wartezustand beim Hochladen und Löschen eines Dokuments (Mieter Hans Müller)

Persona: Helga, 68. Desktop 1440 × 900 mit 150 % Zoom, Maus. Hell und dunkel geprüft, einmal mit reduzierter Bewegung (prefers-reduced-motion: reduce).
Aufgabe: Auf der Seite von Hans Müller (Musterhaus Zentrum, Wohnung 1.01) ein PDF mit eigenem Titel hochladen und wieder löschen. Die Anfragen `?/upload` und `?/deleteDocument` habe ich jeweils rund 10 Sekunden zurückgehalten (page.route, danach route.continue()), um zu sehen, wie Dwello während der Arbeit aussieht.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieter Hans Müller, Dialog «Dokument löschen?» während des Wartens | «Abbrechen» sieht während des Wartens wie der Knopf zum Drücken aus (weiss, blaue Schrift, Handzeiger), «Bitte warten …» daneben grau. Ich habe «Abbrechen» geklickt: Nichts geschah. Der Dialog blieb offen, es kam kein Hinweis, Escape ging auch nicht. Etwa 8 Sekunden später war das Dokument trotzdem gelöscht. Ich hätte gemeint, ich hätte das Löschen gestoppt. |

## Beobachtungen

- **Knopf «Bitte warten …» beim Hochladen:** Er sieht auf den ersten Blick wie «wird gerade bearbeitet» aus. Der Hintergrund ist hellgrau statt weiss, daneben dreht sich ein kleiner Kreis und der Mauszeiger zeigt «beschäftigt». Bei 150 % lese ich den Text gut: dunkelgrau auf hellgrau, hell rund 8:1. Im Dunkelmodus ist er hellgrau auf dunkelgrau, ebenfalls gut lesbar. Der Knopf bleibt 48 px hoch und der Text ist gleich gross wie vorher.
- Klicke ich noch einmal auf «Bitte warten …», geschieht nichts und es wird keine zweite Anfrage geschickt. Das ist gut, so habe ich das Dokument nicht doppelt.
- Während des Hochladens kann ich Titel und Datei noch ändern. Ich weiss dann nicht, ob meine Änderung noch zählt. Getestet habe ich das nicht.
- **Dialog vor dem Klick:** «Abbrechen» ist weiss mit blauer Schrift, «Dokument löschen» rot gefüllt (dunkel: hellrot). Ich sehe klar, welcher Knopf löscht. Der Text nennt das Dokument mit seinem Titel und sagt «lässt sich nicht rückgängig machen». Das ist gut.
- **Dialog während des Wartens** (hell und dunkel gleich): Beide Knöpfe sind gleich gross und haben den gleichen grauen Rand. Das Rot ist weg, «Bitte warten …» ist grau mit Drehkreis. Wer wartet, sieht man. Aber «Abbrechen» wirkt nun als einziger noch lebendiger Knopf (siehe P-1). Den Fokus hat «Bitte warten …».
- Nach dem Ende verschwindet der Dialog. Oben rechts erscheint «Dokument «…» gelöscht», beim Hochladen «Dokument «…» hochgeladen». Die Liste stimmt danach.
- **Reduzierte Bewegung:** Der Kreis dreht sich nicht mehr. Er steht still als offener Ring. Das wirkt immer noch wie «warten», weil «Bitte warten …» dabeisteht. Sonst sieht alles gleich aus wie ohne die Einstellung.
- Lade ich eine Datei mit demselben Namen noch einmal hoch, warnt Dwello in Gelb: «Eine Datei «Hausordnung.pdf» haben Sie schon am … hochgeladen, als Dokument «…». Laden Sie sie nur hoch, wenn es eine neue Fassung ist.» Das finde ich hilfreich.
- Als ich gleich nach dem Laden der Seite auf «Dokument hochladen» klickte (mein Skript wartete nicht, bis die Seite fertig war), erschien kein «Bitte warten …». Die Seite blieb einfach ohne Zeichen stehen, bis die Antwort kam. Wartet man kurz nach dem Laden, kommt «Bitte warten …» jedes Mal. Wahrscheinlich war die Seite noch nicht ganz bereit. Einmal zeigte mein erster Bildschirmabzug das neue Dokument schon nach 1,5 s in der Liste, obwohl die Anfrage noch zurückgehalten war. Das kann ich mir nicht erklären und konnte es auch nicht wiederholen.
- Die Ganzseiten-Bildschirmabzüge mit offenem Dialog zeigen die Seite verschoben (Kopfzeile in der Mitte). Das kommt vom Abzugswerkzeug, nicht von Dwello. Im normalen Bildausschnitt sieht alles richtig aus.

## Aufgabe geschafft: ja

Ich habe hochgeladen und wieder gelöscht, in hell, dunkel und mit reduzierter Bewegung. Alles, was ich hochgeladen hatte, ist wieder entfernt. Die Seite zeigt wieder «Noch keine Dokumente.».

## Aufwand

Etwa 20 Minuten. Pro Durchgang gab es 6 Schritte: Datei wählen, Titel eingeben, «Dokument hochladen», «Löschen», «Dokument löschen», «Abbrechen» während des Wartens. Es waren 3 gültige Durchgänge, dazu 3 Fehlversuche meines Skripts (falsches Warten, gleicher Titel zweimal). Die dabei entstandenen Dokumente habe ich am Ende gelöscht.

## Ablauf

- Dialog während des Wartens, Klick auf «Abbrechen». Erwartet: Das Löschen wird gestoppt, oder Dwello sagt mir, dass es nicht mehr geht. Gesehen: Der Knopf wird kurz hellblau, sonst geschieht nichts. Der Dialog bleibt, auch Escape schliesst ihn nicht. Nach dem Warten ist das Dokument gelöscht.
- Dialog während des Wartens. Erwartet: Der rote Knopf bleibt erkennbar als «läuft gerade». Gesehen: Er wird grau mit Drehkreis. Neben ihm sieht «Abbrechen» aktiver aus.
- Schneller Klick gleich nach dem Laden der Seite. Erwartet: «Bitte warten …». Gesehen: kein Zeichen, bis die Antwort kam (siehe Beobachtungen).

## Vorschläge

- **P-1:** Seite von Hans Müller öffnen, ein PDF hochladen, bei diesem Dokument «Löschen» und dann «Dokument löschen» klicken. Die Anfrage `?/deleteDocument` 10 s zurückhalten und währenddessen «Abbrechen» klicken: Nichts geschieht, danach ist das Dokument gelöscht. Es würde helfen, «Abbrechen» während des Wartens genauso grau und sichtbar unbenutzbar zu machen wie den anderen Knopf. Oder es könnte ein kurzer Satz im Dialog stehen, etwa «Das Dokument wird gelöscht, bitte warten Sie.», damit klar ist, dass Abbrechen nicht mehr geht.

## Nicht geprüft

- 200 % Zoom: Nicht verlangt, nur 150 % geprüft.
- Ein Fehler beim Hochladen oder Löschen (Antwort 500): Nicht Teil der Aufgabe.
- Ob eine Änderung des Titels während des Hochladens noch zählt: Nicht ausprobiert, nur bemerkt, dass das Feld offen bleibt.
- Die Ursache für den fehlenden Wartezustand beim sehr schnellen Klick: Ich habe nur gesehen, dass er nach dem Abwarten der fertig geladenen Seite immer kam.

Bildschirmabzüge und Skripte: `/tmp/claude-0/-home-user-Dwello/77de8f00-a636-5786-b8e4-81081a7b37d0/scratchpad/helga-1209/` (unter anderem `r2-light-no-preference-dialog-wait.png`, `r2-dark-no-preference-dialog-wait.png`, `r2-light-no-preference-after-cancel-view.png`, `r2-light-reduce-upload-btn.png`).
