# Marco – Runde 1096: Bestätigungen ohne Springen

Handy 390 × 844 mit Touch, Schritt 2 auch auf dem Tablet (1024 × 768). Persona-App auf :3300 mit Demodaten. Skripte und Screenshots liegen in `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/marco-1096/` (alle mit `marco-1096` im Namen).

| ID | Schwere | Bildschirm | Befund |
|----|---------|------------|--------|
| P-1 | Major | Einstellungen › Kategorien (Handy und Tablet) | Ich lösche «Marco Laub», dessen «Löschen» ganz unten im Fenster liegt. Die Meldung «Kategorie «Marco Laub» gelöscht» erscheint trotzdem **unten**, nicht oben. «Marco Rasen» rutscht an die Stelle nach und liegt mit seinem «Löschen» genau unter der Meldung. Tippe ich sofort auf «Löschen» bei «Marco Rasen», treffe ich die Meldung und es passiert nichts. Erst wenn ich die Meldung mit dem X schliesse (oder 8 s warte), geht der Dialog auf. |
| P-2 | Minor | Einstellungen › Kategorien, Löschdialog (Handy) | Nach dem Speichern steht unten noch «Kategorie «Marco Laub» gespeichert». Wenn ich dann bei «Marco Laub» auf «Löschen» tippe, springt diese alte Meldung nach oben über die Kopfzeile. Sie ist nicht abgedunkelt wie der Rest, und direkt darunter steht im Dialog «Kategorie «Marco Laub» löschen?». Einen Moment lang dachte ich, das Löschen sei schon passiert. |
| P-3 | Minor | Mieter «Sarah Meier» › Dokument hochladen (Handy) | Nach «Dokument hochladen» kommt mein Dokument oben in die Liste. Das Formular rutscht dabei um etwa 190 px nach unten, genau unter die Meldung «Dokument «Marco Hausordnung» hochgeladen». Unten in der Meldung verschwinden das Feld «Titel» und der Knopf «Dokument hochladen». Ein zweites Dokument kann ich erst hochladen, wenn die Meldung weg ist oder ich weiterscrolle. |

## Beobachtungen

- **Schritt 1 (Neu berechnen) ging gut:** Ich bleibe genau bei «Weitere Aktionen» (Scrollposition unverändert, nichts springt). Danach liegt der Fokus wieder auf «Neu berechnen». Die Meldung «Der Entwurf ist neu berechnet. Er rechnet mit den Rechnungen und dem Tankbestand, wie sie jetzt sind.» steht unten im Fenster. Sie verdeckt nur die Fusszeile, nicht die Karten «Weitere Aktionen» und «Verlauf», und verschwindet nach etwa 8 s ohne Verschiebung.
- Beim ersten Neu-Berechnen wurde die Seite oberhalb meiner Stelle 32 px länger. Ich habe davon nichts gemerkt, die Ansicht blieb stehen. Beim zweiten Mal änderte sich nichts mehr.
- Der Bestätigungsdialog «Entwurf neu berechnen» erklärt klar, was bleibt und was sich ändert. Er erscheint unten am Rand, gut mit dem Daumen erreichbar.
- **Schritt 2:** Es war immer nur eine Meldung zu sehen. «gespeichert» wurde von «gelöscht» ersetzt, und «Laub gelöscht» von «Rasen gelöscht». Nach jedem Löschen blieb ich an derselben Stelle der Liste. Der Fokus sprang auf den nächsten Eintrag: nach «Marco Laub» auf «Marco Rasen», nach «Marco Rasen» auf «Heizung». Das Nachrücken der Liste ist logisch, weil ein Eintrag wegfällt.
- Auf dem Handy steht die Meldung unten über die ganze Breite (y 748–828). Auf dem Tablet steht sie unten rechts (x 624–1008, y 672–752).
- Nach dem Speichern einer Kategorie lande ich oben in der Liste, der Fokus liegt auf der Überschrift «Kategorien». Meine neue Kategorie sehe ich dort nicht, ich musste etwa 900 px hinunterscrollen, um sie zu finden.
- Auf dem Tablet sind die Kategorie-Karten sehr schmal gesetzt. Die Beschreibungen stehen ein bis zwei Wörter pro Zeile («Brennstoff, / Energie, / Wartung …»), die Seite wird rund 19 600 px lang (auf dem Handy rund 9 000 px). Das hat mit den Meldungen nichts zu tun, kostet aber viel Scrollen.
- **Schritt 3:** Ich habe ganz unten gewartet, bis die Meldung weg war. Nichts hat sich verschoben: Scrollposition, Seitenhöhe und Fusszeile (y 690) blieben gleich, keine Layoutverschiebung gemessen. Während die Meldung stand, verdeckte sie die Fusszeile mit «Datenschutz» und «Nutzungsbedingungen».
- Nach dem Hochladen lag der Fokus auf «Datei auswählen», nach dem Löschen auf der Liste «Dokumente». Beim Löschen kam die Meldung «Dokument «Marco Hausordnung» gelöscht», und die Liste zeigt wieder «Noch keine Dokumente.». Der Löschdialog nennt die Folge klar: «wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.»
- Andere Personas haben gleichzeitig eigene Kategorien («Helga Hecke», «Helga Zaun») angelegt und gelöscht. Einmal lag meine Liste danach 28 px anders. Das ging auf ihr Konto, nicht auf meine Meldung, und zählt nicht als Befund.

## Aufgabe geschafft: ja

Alle drei Schritte erledigt. Meine Kategorien und mein Dokument sind wieder gelöscht (Kontrolle: 0 Kategorien «Marco …», bei Sarah Meier «Noch keine Dokumente.»).

## Aufwand

Etwa 30 Minuten mit rund 15 Durchläufen. Schritt 1: 4 Schritte (Liste, Entwurf, scrollen, Neu berechnen + bestätigen). Schritt 2: je Durchlauf 2 × Anlegen, 2 × Löschen mit Dialog. Bei P-1 kam ein zusätzlicher Tipp auf das X dazu, weil der erste Tipp auf «Löschen» ins Leere ging. Schritt 3: 5 Schritte zum Hochladen, 3 zum Löschen.

## Ablauf

- Kategorien, «Marco Laub» löschen, während sein «Löschen» unten im Fenster liegt. Erwartet: Die Meldung erscheint oben, weil ich unten gearbeitet habe. Gesehen: Sie steht unten und verdeckt «Marco Rasen», der nachgerückt ist (Screenshot `marco-1096-s2g-mobile-b.png`: Meldung über «Eigene / Umlagefähig» und «Löschen» von «Marco Rasen»; Tablet `marco-1096-s2g-tablet-b.png`: Meldung unten rechts über «Umlagefähig» und «Löschen» von «Marco Rasen»).
- Danach sofort auf «Löschen» bei «Marco Rasen» getippt. Erwartet: Der Löschdialog geht auf. Gesehen: Der Tipp landet auf der Meldung (an der Knopfmitte liegt der Meldungstext), kein Dialog. Erst nach dem X ging er auf.
- Löschdialog öffnen, während «… gespeichert» noch steht (Handy). Erwartet: Die Meldung bleibt, wo sie ist, oder verschwindet. Gesehen: Sie springt nach oben über die Kopfzeile, hell über dem abgedunkelten Hintergrund (Screenshot `marco-1096-s2-mobile-b-dlg.png`).
- «Dokument hochladen» bei Sarah Meier. Erwartet: Formular und Knopf bleiben sichtbar, die Meldung kommt irgendwo, wo sie nicht stört. Gesehen: Das neue Dokument erscheint oben, das Formular rutscht unter die Meldung. «Titel» und «Dokument hochladen» sind verdeckt (Screenshot `marco-1096-s3-b-after.png`).

## Vorschläge

- **P-1:** Handy 390 × 844, Einstellungen › Kategorien. Zwei eigene Kategorien anlegen, die in der Liste aufeinander folgen («Marco Laub», «Marco Rasen»). So scrollen, dass «Löschen» von «Marco Laub» ganz unten im Fenster liegt (etwa y 774). «Löschen» tippen, im Dialog «Löschen» bestätigen. Die Meldung erscheint unten und deckt «Löschen» von «Marco Rasen» zu. Auf dem Tablet ist es genauso. Hilfreich wäre: Wenn der benutzte Knopf im unteren Teil des Fensters lag, erscheint die Meldung oben, wie angekündigt. Beim Löschen aus einer Liste zählt auch der Eintrag, der an seine Stelle nachrückt.
- **P-2:** Handy, eine Kategorie speichern, in der Liste innerhalb von 8 s bei einer Kategorie auf «Löschen» tippen. Die alte Meldung springt nach oben und bleibt hell über dem Dialog-Hintergrund. Hilfreich wäre: Eine alte Bestätigung beim Öffnen eines Dialogs ausblenden oder mit abdunkeln, statt sie zu verschieben.
- **P-3:** Handy, Mieter «Sarah Meier», zum Abschnitt «Dokument hochladen» scrollen, bis der Knopf etwa in der Mitte steht. Datei wählen, Titel eingeben, «Dokument hochladen». Das Formular rutscht um die Höhe des neuen Listeneintrags nach unten unter die Meldung. Hilfreich wäre: Die Meldung erst platzieren, nachdem sich die Seite durch den neuen Eintrag verändert hat, oder sie oben zeigen, wenn der benutzte Knopf danach im unteren Teil liegt.

## Nicht geprüft

- **Das echte Auswahlfenster für Dateien:** Ein Tipp auf «Datei auswählen» öffnete im kopflosen Browser kein Auswahlfenster, auch nach 30 s Warten nicht. Ich habe die Datei deshalb direkt dem Dateifeld übergeben. Ob sich das Fenster auf einem echten Handy öffnet, habe ich nicht gesehen.
- **Schritte 1 und 3 auf dem Tablet:** Laut Auftrag nur Schritt 2 wiederholt.
- **Was ein Screenreader ansagt:** Nicht Teil von Marcos Rolle. Die Meldungen stehen aber in einem `status`-Bereich.
