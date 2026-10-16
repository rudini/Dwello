# Marco – Gebäudeseite auf dem Handy (map129)

Persona: Marco, 38, Handy 390 × 844, Touch. App: Persona-Stack (http://localhost:3300, Demodaten). Nichts gespeichert.
Aufgabe: Vor dem Haus stehend die Gebäudeliste öffnen, «Musterhaus Zentrum» öffnen und Adresse, Gebäudetyp, Baujahr und Anzahl vermieteter Wohnungen finden; zurück zur Liste und dasselbe für ein zweites Gebäude («Seepark Residenz»).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Gebäude-Detail (`/buildings/<id>`) | Die Detailseite hat keinen Link «Route planen» / Karte, obwohl die Liste ihn für jedes Gebäude zeigt. Wer vor dem Haus steht und schon auf der Detailseite ist, muss zurück in die Liste, um die Route zu öffnen. |
| P-2 | Nit | Gebäudeliste (`/buildings`) | Der Knopf «Route planen (öffnet in neuem Tab)» bricht auf 390 px in zwei Spalten um: links «Route / planen», rechts «(öffnet in neuem / Tab)». Wirkt wie zwei Beschriftungen nebeneinander, Knopf 68 px hoch. |
| P-3 | Nit | Gebäudeliste | Bei «Musterhaus Zentrum» rutscht «2 leer» allein auf eine neue Zeile («6 Wohnungen · 4 vermietet» / «2 leer»), bei den anderen Karten passt alles auf eine Zeile. Liest sich unruhig. |

## Beobachtungen

- Die Detailseite liest sich auf dem Handy gut: Brotkrümel «Gebäude › Musterhaus Zentrum», Titel, darunter Karte «Angaben zum Gebäude» mit Adresse, Gebäudetyp, Baujahr und «Wohnungen: 6, davon 4 vermietet und 2 leer». Alles, was ich suchte, steht im ersten Bildschirm ohne Scrollen. Bezeichnung über dem Wert, gut lesbar.
- Die ganze Gebäudekarte in der Liste ist antippbar (auch Adresse oder Typzeile), nicht nur der Name. Ebenso öffnet in der Wohnungsliste der Detailseite ein Tipp auf das Status-Abzeichen die Wohnung.
- Die Listenkarten zeigen schon dieselben Angaben (Adresse, «Mehrfamilienhaus, Baujahr 1968», «6 Wohnungen, 4 vermietet, 2 leer»). Für meine Frage hätte die Liste allein gereicht.
- Untertitel «Angaben und Wohnungen des Gebäudes» und Kartentitel «Angaben zum Gebäude» direkt untereinander wiederholen sich etwas.
- «Löschen» steht oben direkt neben «Bearbeiten», gut erreichbar mit dem Daumen. Antippen öffnet aber nur den Dialog «Gebäude löschen?» mit «Löschen nicht möglich … enthält noch Wohnungen» und gesperrtem Knopf – nichts passiert versehentlich.
- Die Detailseite ist lang (ca. 3800 px): nach den Wohnungen kommen die Erklärung «Was bedeutet der Mietstatus?» und der Block «Brennstoff im Tank oder Lager» mit Formular. Für meine Aufgabe störte das nicht, weil alles Gesuchte oben steht.
- Reihenfolge der Liste: Alpenblick, Seepark Residenz, Musterhaus Zentrum – weder alphabetisch noch nach Ort; mir unklar, wonach sortiert wird.
- Im Accessibility-Baum der Liste sind «3 Gebäude» und jeder Gebäudename beide Überschrift Ebene 2 (die Namen müssten eher Ebene 3 sein).
- Kein seitliches Scrollen (scrollWidth 390 auf Liste und Detail). Bearbeiten/Löschen/Brotkrümel je 48 px hoch.
- Netzwerk im Browser: Liste und Detail sprechen nur mit localhost:3300; der Routenlink zeigt auf `https://www.google.com/maps/dir/?api=1&destination=…` mit `target=_blank rel=noopener`, es wird erst beim Antippen etwas an Google geschickt.

## Aufgabe geschafft: ja

## Aufwand

Ca. 1 Minute für beide Gebäude, 7 Tipps: Menü → Gebäude → Musterhaus Zentrum (alles oben sichtbar) → Brotkrümel «Gebäude» → Seepark Residenz → Browser-Zurück.

## Ablauf

1. Übersicht geöffnet. Erwartet: Weg zu den Gebäuden. Gesehen: Burger-Menü «Menü öffnen» oben links, im Drawer «Gebäude». Zusätzlich auf der Übersicht unten «3 Gebäude» und die Gebäudenamen als Links.
2. «Gebäude» getippt. Erwartet: Liste meiner Häuser. Gesehen: «Gebäude», Knopf «Gebäude erfassen», Suche (Name/Adresse, Ort), «3 Gebäude» als Karten mit Adresse, Typ und Baujahr, Wohnungszahlen und Knopf «Route planen (öffnet in neuem Tab)» (siehe P-2, P-3). Screenshot 03-list.png.
3. Karte «Musterhaus Zentrum» getippt. Erwartet: Detail mit Adresse usw. Gesehen: im ersten Bildschirm Karte «Angaben zum Gebäude»: Adresse «Bahnhofstrasse 42, 8001 Zürich (ZH)», Gebäudetyp «Mehrfamilienhaus», Baujahr «1968», Wohnungen «6, davon 4 vermietet und 2 leer». Screenshot 05-detail-top.png. Darunter Wohnungen nach Stockwerk (1.–3. OG) mit Zimmern, m² und Status-Abzeichen mit Symbol und Text (06-detail-2.png).
4. Gesucht: Route/Karte auf der Detailseite, weil ich vor dem Haus stehe. Gesehen: keine (P-1).
5. Brotkrümel «Gebäude» getippt. Erwartet: zurück zur Liste. Gesehen: Liste, wie erwartet.
6. «Seepark Residenz» getippt. Gesehen: Adresse «Seeweg 15, 6003 Luzern (LU)», «Mehrfamilienhaus», «2009», «4, davon 3 vermietet und 1 leer». Gleicher Aufbau, sofort gefunden (07-seepark-top.png).
7. Browser-Zurück. Erwartet: Liste. Gesehen: Liste, oben.

## Verwirrung

- «Wiedervermietet» als Status kannte ich nicht; die Erklärung «Was bedeutet der Mietstatus?» weiter unten auf der Seite hilft, ist aber weit vom Abzeichen entfernt.
- «(ZH)» hinter der Ortschaft ist klar (Kanton).
- Der Block «Brennstoff im Tank oder Lager» ist für mich als Handy-Nutzer vor dem Haus ein langer Text mit Formular – nicht verwirrend, aber hier fehl am Platz für einen schnellen Blick.

## Fehlerrisiken

- «Löschen» oben neben «Bearbeiten» ist leicht anzutippen; der Dialog verhindert hier aber das Löschen (Gebäude mit Wohnungen). Bei einem Gebäude ohne Wohnungen nicht geprüft.
- Auf der Detailseite stehen im Brennstoff-Block mehrere «Löschen»-Knöpfe für Bestände; beim Scrollen mit dem Daumen könnte man einen treffen (nicht ausprobiert, Bestätigung ungeprüft).

## Vorschläge

- **P-1:** Liste öffnen → «Musterhaus Zentrum» tippen → auf der Detailseite gibt es keinen Routen-/Kartenlink. Hilfreich: denselben Link «Route planen» bei der Adresse in «Angaben zum Gebäude» zeigen.
- **P-2:** Liste auf 390 px öffnen → Knopf «Route planen (öffnet in neuem Tab)» ansehen. Hilfreich: Hinweis «(öffnet in neuem Tab)» als Fliesstext hinter dem Knopftext oder kleiner unter «Route planen», nicht als eigene Spalte; oder nur ein Symbol für «externer Link» plus Text für Screenreader.
- **P-3:** Liste auf 390 px → Karte «Musterhaus Zentrum»: «2 leer» bricht allein um. Hilfreich: Zahlen als ein Satz wie auf der Detailseite («6 Wohnungen, davon 4 vermietet und 2 leer») oder untereinander.

## Nicht geprüft

- Was Google Maps nach dem Tippen auf «Route planen» zeigt (externe Seite, nicht geöffnet).
- Querformat, Dunkelmodus, andere Sprachen.
- Löschdialog bei einem Gebäude ohne Wohnungen und die Löschen-Knöpfe im Brennstoff-Block (hätte Daten verändert; ich sollte nicht speichern).
- Alpenblick nicht geöffnet (Aufgabe verlangte ein zweites Gebäude).

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/012cff12-39ac-5ff5-abe7-180db4ea5c25/scratchpad/marco-map129/`.
