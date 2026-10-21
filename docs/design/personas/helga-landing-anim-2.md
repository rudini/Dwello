# Helga, 68: Nachprüfung der Animation «Rechnungen per Drag & Drop»

Persona: Helga, 68, wenig Computererfahrung, braucht grosse Schrift.
Seite: http://localhost:3310/index.html (öffentliche Webseite, nicht die App), Desktop 1440 × 900 bei 150 % und bei 200 % Zoom, Maus.
Nichts gespeichert. Geprüft habe ich nur meine früheren Befunde P-1, P-2 und P-3 (`helga-landing-anim.md`) und «Verteilung abspielen» einmal zum Vergleich.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/85153f7a-2aaa-560a-b0b0-dad45152fc6d/scratchpad/helga-landing-anim-2/`.

## Frühere Befunde

| ID | Behoben? | Was ich gesehen habe |
|---|---|---|
| P-1 (Major) | ja | Der Knopf «Ablauf abspielen» steht jetzt **über** der Karte, und die Karte ist niedriger (bei 150 % 360 von 600 Pixeln Fensterhöhe). Ich scrolle so weit, bis ich die Karte ganz sehe: Knopf und ganze Karte sind zusammen im Fenster (`c15-0-vorher.png`). Nach dem Drücken scrollt nichts weg. Ich sehe den ganzen Ablauf von Anfang an, auch wie «Wasserversorgung Zürich» und «CHF 930.00» erscheinen. Bei 200 % ebenso: Knopf oben, Karte darunter ganz im Fenster, bis «Kaltwasser» unten (`z2-1000.png`, `z2-6000.png`). Höre ich auf zu scrollen, sobald der Knopf auftaucht, steht er unten im Fenster und die Karte liegt noch darunter (`a15-1000.png`); dann scrolle ich aber von selbst weiter, weil ich das Bild sehen will. |
| P-2 (Minor) | teilweise | Ruhiger als vorher. Der Ablauf dauert jetzt etwa 5½ Sekunden statt knapp 4, die Werte kommen etwa eine Sekunde nacheinander: nach 2 s «Wasserversorgung Zürich» (`c15-2000.png`), nach 3 s «CHF 930.00», das Datum blendet gerade blass ein (`c15-3000.png`), nach 4½ s Datum und «Kaltwasser» (`c15-4500.png`), nach 6 s «Bitte prüfen» und «Nochmals abspielen» (`c15-6000.png`). Dem konnte ich folgen. Geblieben ist: Beim Drücken wird die Karte zuerst leer, nur noch die grauen Bezeichnungen (`c15-1000.png`). Ich habe kurz gedacht, ich hätte etwas gelöscht. |
| P-3 (Minor) | teilweise | Das Blatt kommt jetzt sichtbar von links in die Karte hinein: nach 0.1 s steht es halb ausserhalb am linken Rand und ist blass, nach 0.8 s ist es an seinem Platz und kräftig (`c15-300.png`, Bildreihe `slide-sheet.png`). Das habe ich als «hineinziehen» verstanden, auch wenn es schnell geht (unter einer Sekunde) und der Weg kurz ist. Eine Fläche, auf die man zieht, oder eine Hand gibt es nicht. Weiterhin nicht: Schritt 3 «Sie prüfen die Angaben und bestätigen» kommt in der Animation nicht vor (kein Knopf «Bestätigen»), und die Schritte 1, 2, 3 darüber leuchten während des Ablaufs nicht mit. Bei 150 % ist Schritt 1 beim Abspielen ohnehin schon über dem Fensterrand. |

## Neue Befunde

Keine.

## Beobachtungen

- «Verteilung abspielen» (Abschnitt «Gerecht verteilt, auch im Winter.»): Der Knopf steht jetzt auch über der Karte. Bei 150 % passen Text, Knopf, Lift-Balken und die sechs Wohnungen zusammen ins Fenster. Nach 1 s ist der Lift-Balken da und die Wohnung 1.01 (`v15-1000.png`), nach etwa 3½ s alle sechs, 1.01 hellblau umrandet, Knopf «Nochmals abspielen» (`v15-6000.png`). Gleich gut wie vorher; P-4 und P-5 habe ich nicht neu beurteilt (nicht Teil der Aufgabe), sie sehen unverändert aus.
- Der Knopf beschriftet sich weiterhin klar: «Ablauf abspielen», «Anhalten», «Nochmals abspielen».
- Dass der Knopf jetzt oben steht, ist für mich logischer: erst drücken, dann darunter zuschauen.

## Aufgabe geschafft

Ja. Beide Animationen abgespielt, die erste bei 150 % und 200 %, Bilder nach etwa 1, 3 und 6 Sekunden und dazwischen.

## Aufwand

Etwa 10 Minuten, 6 Durchgänge (150 % bis zum Knopf gescrollt, 150 % bis die Karte ganz zu sehen ist, 150 % das Hineinkommen des Blatts in Zehntelsekunden, 200 % zweimal, «Verteilung abspielen» einmal).

## Ablauf

1. **Bis zum Knopf scrollen.** Erwartet: Knopf unter der Karte wie beim letzten Mal. Gesehen: Der Knopf steht jetzt unter den drei Schritten und über der Karte; sobald er auftaucht, ist die Karte noch unten ausserhalb (`a15-1000.png`).
2. **Weiter scrollen, bis die Karte ganz zu sehen ist.** Gesehen: Schritte 2 und 3, Knopf, ganze Karte mit allen Werten in einem Fenster (`c15-0-vorher.png`).
3. **Drücken.** Erwartet: Ich sehe den Ablauf ganz. Gesehen: Karte wird leer, das Blatt gleitet von links herein (0.1 bis 0.8 s), dann kommen die Werte eins nach dem anderen, etwa je eine Sekunde; nach etwa 5½ s fertig. Nichts verschwindet aus dem Fenster.
4. **200 %.** Gesehen: Knopf und Karte passen gerade zusammen ins Fenster, der Ablauf ist ganz zu sehen; die drei Schritte stehen darüber ausserhalb.
5. **«Verteilung abspielen».** Gesehen: wie oben unter Beobachtungen, alles im Fenster.

## Verwirrung

- Dass die Karte beim Drücken zuerst leer wird (P-2), hat mich wieder kurz erschreckt.
- Welcher der drei Schritte gerade gezeigt wird, sehe ich immer noch nicht (P-3).

## Fehlerrisiken

- Wer nur die Animation anschaut, sieht weiterhin nicht, dass man am Schluss selber bestätigen muss (P-3).

## Vorschläge

- **P-2**: «Ablauf abspielen» drücken: Die Karte wird sofort leer. Hilfreich wäre, die Werte erst nach einer kurzen Pause auszublenden oder sie blass stehen zu lassen.
- **P-3**: «Ablauf abspielen» drücken und auf die Schritte 1 bis 3 achten. Hilfreich wären ein Knopf «Bestätigen», der am Ende sichtbar gedrückt wird, eine Fläche, in die das Blatt fällt, und die jeweils laufende Nummer hervorgehoben, am besten neben der Karte, damit sie auch bei 150 % im Bild ist.

## Nicht geprüft

- Dunkelmodus, Handy-Ansicht und «weniger Bewegung»: nicht Teil der Aufgabe.
- Was ein Bildschirmleser ansagt.
- Anhalten und «Weiter abspielen»: diesmal nicht erneut probiert.
- P-4 und P-5 (zweite Animation): nur angesehen, nicht neu bewertet.
