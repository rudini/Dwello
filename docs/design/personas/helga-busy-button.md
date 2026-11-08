# Helga – «Bitte warten …» beim Hochladen und Löschen eines Dokuments

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (CSS-Breite 960 × 600, deviceScaleFactor 1.5), Maus. Zuerst hell, dann dunkel.
Gespeichert nur bei Hans Müller (Musterhaus Zentrum, 1.01): Dokumente «Übergabeprotokoll light», «Übergabeprotokoll dark» und für die Doppelklick-Proben «Übergabeprotokoll Doppelklick/click2/dbl/enter/combo». Alle habe ich wieder gelöscht, am Ende stand dort wieder «Noch keine Dokumente.».
Langsame Antwort nachgestellt: Die POST-Anfrage `?/upload` und die POST-Anfrage `?/deleteDocument` der Mieterseite habe ich mit `page.route` 10 Sekunden lang zurückgehalten und dann mit `route.continue()` durchgelassen.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieter Hans Müller, «Dokument hochladen» und Dialog «Dokument löschen?» (hell und dunkel) | Der wartende Knopf «Bitte warten …» sieht aus wie ein gewöhnlicher grauer Knopf: nicht blass, kräftiger Rahmen, kein drehendes Zeichen oder Ähnliches. Dass ich ihn nicht nochmals drücken kann, sehe ich ihm nicht an, nur dem Text. Und dass Dwello noch arbeitet, zeigt sich nicht, solange sich nichts bewegt. |
| P-2 | Minor | Dialog «Dokument löschen?» während des Löschens (hell und dunkel) | Im Dialog sieht der gesperrte «Abbrechen» blass aus (halb durchsichtig), «Bitte warten …» daneben dagegen voll und kräftig. So wirkt gerade der wartende Knopf wie der, den man jetzt drücken soll. Hell ist «Abbrechen» so blass, dass ich ihn kaum noch lesen kann (etwa 3:1). |

## Beobachtungen

- **Lesbarkeit gut:** «Bitte warten …» ist halbfett und bei 150 % gross genug (16 px CSS, auf dem Bildschirm etwa 24 px). Kontrast hell: dunkelgrauer Text auf hellgrauem Grund, 7.8:1. Dunkel: hellgrauer Text auf dunkelgrauem Grund, 7.6:1. Ich konnte es in beiden Modi ohne Mühe lesen (Screenshots `light-11-upload-busy.png`, `dark-11-upload-busy.png`, `light-21-delete-busy.png`, `dark-21-delete-busy.png`).
- **Wechsel sichtbar:** Vorher zeigt der Upload-Knopf «+ Dokument hochladen» in Blau auf hellblauem Grund. Beim Warten wird er grau, und das Plus verschwindet. Der rote Knopf «Dokument löschen» wird beim Warten ebenfalls grau. Dass sich etwas geändert hat, merke ich also. Dass das «gesperrt» heisst, merke ich nicht (P-1).
- **Mauszeiger:** Über dem wartenden Knopf erscheint der Warte-Zeiger (Pfeil mit Sanduhr), nicht die Hand. Das hilft ein wenig, falls man es bemerkt.
- **Nochmals drücken passiert nichts Schlimmes:** Ich habe den wartenden Upload-Knopf ein zweites Mal geklickt, doppelgeklickt und Enter gedrückt (der Fokus bleibt auf «Bitte warten …»). Jedes Mal ging nur eine Anfrage hinaus, und es entstand nur ein Dokument. Beim Löschen schickten ein zweiter Klick und Enter ebenfalls nur eine Anfrage.
- **Ein Rätsel:** Beim allerersten Versuch mit mehreren Klicks hintereinander, Doppelklick und Enter zeigte die Netzwerkliste zwei `?/upload`-Anfragen, und trotzdem stand danach nur ein Dokument da. Mit derselben Folge konnte ich das danach nicht mehr erzeugen (siehe «Nicht geprüft»).
- **Bildschirmleser:** Der wartende Knopf heisst «Bitte warten …» und ist gesperrt (`aria-disabled`, `aria-busy`). Daneben meldet eine Statuszeile «Bitte warten …».
- Während des Hochladens bleiben «Datei auswählen» und das Feld «Titel (optional)» bedienbar. Ich könnte also die Datei wechseln, während die alte noch unterwegs ist. Ausprobiert habe ich das nicht.
- Im Löschdialog lässt sich der Dialog während des Wartens weder mit «Abbrechen» noch mit Escape schliessen. Das finde ich richtig.
- Nach dem Hochladen erscheint unten rechts «Dokument «Übergabeprotokoll …» hochgeladen». Sie ist noch zu sehen, wenn ich den Löschdialog öffne.
- Nach dem Absenden scrollt die Seite so, dass die Überschrift «Dokument hochladen» halb unter der festen Kopfleiste steckt.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten. Pro Modus 6 Schritte: Seite öffnen, Datei wählen, Titel eingeben, hochladen, auf «Löschen» klicken, im Dialog bestätigen. Dazu 5 Proben mit wiederholtem Klicken.

## Ablauf

- Upload, hell: Ich erwartete einen blassen, deutlich «ausgeschalteten» Knopf, vielleicht mit einem Drehsymbol. Ich sah einen normalen grauen Knopf mit dunklem Rahmen und gut lesbarem «Bitte warten …», ohne Bewegung. Ausser am Text erkenne ich nicht, dass er gesperrt ist (P-1).
- Upload, dunkel: wie hell. Der Knopf ist etwas heller als die Karte und hat einen hellen Rahmen, er sieht eher hervorgehoben als gesperrt aus (P-1).
- Löschen, hell: Ich erwartete, dass der wartende Knopf am stärksten «ausgeschaltet» aussieht. Gesehen habe ich das Umgekehrte: «Abbrechen» ist blass, «Bitte warten …» kräftig (P-2).
- Löschen, dunkel: wie hell. «Bitte warten …» hat den hellsten Rahmen im Dialog (P-2).

## Vorschläge

- **P-1:** Mieter Hans Müller öffnen, eine PDF wählen, «Dokument hochladen» klicken und `?/upload` 10 s zurückhalten (hell oder dunkel). Dasselbe im Löschdialog mit `?/deleteDocument`. Was mir helfen würde: ein kleines drehendes Zeichen vor «Bitte warten …» (für Leute, die keine Bewegung wollen, ein stehendes Sanduhr-Symbol). Und den wartenden Knopf so zeichnen, dass er sichtbar «ausser Betrieb» wirkt. Der Text muss dabei so gut lesbar bleiben wie jetzt, also nicht einfach durchsichtig machen.
- **P-2:** Wie P-1, Löschdialog. Was mir helfen würde: Beide Knöpfe im Dialog sollten beim Warten gleich «ausgeschaltet» aussehen, und der wartende Knopf soll nicht der auffälligste sein. «Abbrechen» sollte dabei lesbar bleiben (hell jetzt etwa 3:1).

## Nicht geprüft

- 200 % Zoom: Die Aufgabe nannte 150 %.
- Die doppelte `?/upload`-Anfrage beim ersten Versuch. Ich habe zweiten Klick, Doppelklick, Enter und dieselbe Folge wie beim ersten Mal je einzeln wiederholt. Jedes Mal ging nur eine Anfrage hinaus, und es gab immer nur ein Dokument. Woher die zweite Anfrage kam, konnte ich nicht klären. Ein doppeltes Dokument habe ich nie gesehen.
- Datei wechseln während des Hochladens: nicht ausprobiert, das gehörte nicht zur Aufgabe.

Screenshots und Skripte liegen in `/tmp/claude-0/-home-user-Dwello/d16ce5a2-988c-533e-bc03-042a2f86bb52/scratchpad/helga-busy-button/`.
