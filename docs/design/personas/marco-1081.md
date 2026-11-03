# Marco – Bestätigungsmeldungen unten (1081)

Persona: Marco, 38, Smartphone 390 × 844 mit Touch; zusätzlich ein Tablet-ähnliches Fenster 1024 × 768 (Klick statt Tap, die Breakpoints sind dieselben). Gebäude: «Seepark Residenz». Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/marco-1081/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieter «Sarah Meier», Dokumente (Handy) | Nach «Dokument hochladen» liegt die Meldung genau über dem Knopf, den ich gerade angetippt habe, und über dem unteren Rand des Titelfelds. Will ich gleich ein zweites Dokument hochladen, muss ich zuerst schliessen, warten oder scrollen. |
| P-2 | Minor | Abrechnung NK-22222222-2025-0001, «Neu berechnen» (Handy und Tablet) | Nach dem Bestätigen springt die Seite ganz nach oben (vorher war ich bei «Weitere Aktionen», über 4000 px weiter unten). Die Meldung ist auf dem Handy 152 px hoch (5 Zeilen, ca. 18 % des Bildschirms) und liegt genau über dem Anfang der Kostenaufstellung, also über dem, was sich gerade geändert hat. |
| P-3 | Minor | Mieter «Sarah Meier» (Handy), unten auf der Seite | Solange die Meldung da ist, wird die Seite um 112 px länger. Bin ich ganz unten, wenn sie von selbst verschwindet, rutscht der Inhalt um 112 px nach unten (Scrollposition 2329 → 2217). Wenn ich gerade «Dokument hochladen» antippen will, kann ich danebentippen. |

## Beobachtungen

- Die Meldung kommt etwa 0,7 s nach dem Tippen, links ein Häkchen, und der Text nennt, was passiert ist: «Dokument «Hausordnung Marco Test» hochgeladen», «… gelöscht», «Der Entwurf ist neu berechnet. Er rechnet mit den Rechnungen und dem Tankbestand, wie sie jetzt sind.» Gut verständlich.
- Das Schliessen-X («Meldung schliessen») ist 48 × 48 px gross und liegt rechts unten. Mit dem rechten Daumen erreiche ich es sofort, mit links ist es etwas weiter. Ein Tap schliesst die Meldung sofort.
- Die Meldung verschwindet nach etwa 8,7 s von selbst. Für den 5-zeiligen Text nach «Neu berechnen» reicht das knapp.
- Solange die Meldung da ist, kann ich weiter nach unten scrollen. Darunter verdeckte Knöpfe kann ich also hervorholen (Screenshot 80: am Seitenende liegt die Meldung unter der Fusszeile, «Dokument hochladen» ist frei).
- Beim Löschen eines Dokuments (Handy und Tablet) springt die Seite nicht. Wo vorher das Dokument mit «Löschen» stand, steht jetzt «Noch keine Dokumente.», darüber nichts verdeckt. Die Meldung liegt über «Dokument hochladen» (Handy) bzw. über dem Hilfetext zur Datei (Tablet), also nicht über dem, was ich angetippt habe. Der Bestätigungsdialog «Dokument löschen?» nennt den Titel und «lässt sich nicht rückgängig machen» – gut.
- Tablet, Hochladen: Die Meldung liegt rechts unten, verdeckt nichts Wichtiges. Das neue Dokument selbst sehe ich aber nicht, es liegt oberhalb des sichtbaren Bereichs (ca. 140 px über dem oberen Rand). Nur die Meldung sagt mir, dass es geklappt hat.
- Tablet 1024 × 768, Mieterseite «Sarah Meier»: Die Seite scrollt seitlich (Breite 1061 statt 1024 px). Der Betrag «CHF 1’850.00 monatlich total» des Mietvertrags ragt rechts aus der Karte «Mietverträge» heraus (Screenshot 40). Das hat mit den Meldungen nichts zu tun. Auf Übersicht und Abrechnungsliste kein seitliches Scrollen. Auf dem Handy nirgends seitliches Scrollen.
- Tablet, Abrechnung: Die Tabelle der Kostenaufstellung ist rechts abgeschnitten («Wohnungs…»), sie scrollt offenbar in sich. Die Meldung verdeckt dort die erste Zeile mit den Beträgen (CHF 912.00 / CHF 228.00).
- Nach «Neu berechnen» steht oben «PDF erstellen» statt vorher «PDF herunterladen». Das passt zum Dialogtext («Ein schon erstelltes PDF wird verworfen»).
- In der Mieterliste steht bei Sarah Meier «Keine laufende Miete» statt eines Gebäudes. Seepark sehe ich erst in ihrem beendeten Vertrag «Wohnung A2».

## Aufgabe geschafft: ja

## Aufwand

ca. 30 Minuten, rund 12 Durchläufe mit je 5 bis 12 Schritten. Hochladen und Löschen habe ich auf Handy und Tablet je dreimal gemacht, «Neu berechnen» je einmal auf Handy und Tablet. Alle meine Testdokumente sind wieder gelöscht.

## Ablauf

- Hochladen (Handy): Ich erwartete eine Meldung und weiterhin den Knopf, den ich angetippt hatte. Ich sah das neue Dokument oben, die Meldung aber über «Dokument hochladen» und dem leeren Titelfeld (Screenshot 12).
- Neu berechnen (Handy): Ich erwartete, an derselben Stelle bei «Weitere Aktionen» zu bleiben. Ich sah die Seite ganz oben (Fokus auf der Überschrift «Abrechnung NK-22222222-2025-0001»), die Meldung über der Kostenaufstellung (Screenshot 72-mobile). Kurz habe ich mich gefragt, ob die Seite neu geladen wurde.
- Meldung verschwindet am Seitenende (Handy): Ich erwartete, dass der Inhalt stehen bleibt. Ich sah, wie er um 112 px nach unten rutschte (Screenshots 80/81).
- Tablet, Hochladen: Ich erwartete, das neue Dokument zu sehen. Es lag oberhalb des sichtbaren Bereichs (Screenshot 30-tabletb).

## Vorschläge

- **P-1:** Handy 390 × 844 → Mieter → «Sarah Meier» → bei «Dokument hochladen» eine PDF wählen, einen Titel eingeben → «Dokument hochladen» antippen. Die Meldung liegt über dem Knopf. Hilfreich wäre: die Seite so scrollen, dass das neue Dokument und der Knopf über der Meldung stehen, oder die Meldung kompakter machen bzw. oben anzeigen, wenn der angetippte Knopf im unteren Bereich liegt.
- **P-2:** Handy → Nebenkostenabrechnungen → «Thomas Weber NK-22222222-2025-0001» (Entwurf) → nach unten zu «Weitere Aktionen» → «Neu berechnen» → im Dialog «Neu berechnen». Die Seite springt nach oben, die 5-zeilige Meldung verdeckt den Anfang der Kostenaufstellung. Hilfreich wäre: an der Stelle bleiben oder den Sprung ankündigen («Die neuen Beträge sehen Sie oben»), und den Meldungstext kürzen (z. B. «Entwurf neu berechnet.»), damit er auf 2 Zeilen passt.
- **P-3:** Handy → Dokument hochladen (wie P-1) → ganz nach unten scrollen → etwa 9 s warten. Der Inhalt rutscht beim Verschwinden der Meldung 112 px nach unten. Hilfreich wäre, den Platz unten nicht wegzunehmen, solange man ganz unten ist, oder ihn erst beim nächsten Scrollen wegzunehmen.

## Nicht geprüft

- Zahlung erfassen auf einer versendeten oder bezahlten Abrechnung 2024 von «Seepark Residenz»: In der ersten Listenseite standen nur Seepark-Abrechnungen 2025 (Entwürfe). Ich habe die Aufgabe mit «Neu berechnen» am Entwurf 2025 erfüllt und die zweite Listenseite nicht geöffnet.
- Wischen zum Wegschieben der Meldung und ob sie bei Berührung stehen bleibt: Das kann ich mit dem Werkzeug nicht verlässlich nachstellen. Getestet habe ich nur den Tap auf das X.
- Echte Touch-Eingabe auf dem Tablet: Das Tablet-Fenster lief ohne Touch-Unterstützung, daher habe ich mit Klicks bedient.
- Ein früherer Tablet-Durchlauf sprang nach dem Löschen nach oben (y 785 → 68). Da hatte mein Skript den «Löschen»-Knopf aber unter die feste Kopfzeile gescrollt. Beim normalen Scrollen (Knopf in der Bildschirmmitte) sprang nichts. Das werte ich als Fehler meines Skripts, nicht als Befund.
