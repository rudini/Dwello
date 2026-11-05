# Helga, Runde 1096: Bestätigungen am Fensterrand (Kategorien, Zugangsschlüssel)

Desktop 1440 × 900 mit 150 % Zoom (Seite 960 × 600), wichtige Schritte wiederholt mit 200 % (Seite 720 × 450), Maus. Persona-Stack auf :3300, Demodaten, angemeldet als Vera Verwalter.
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/0c9ef516-5912-5d44-89b7-95aec4e547cc/scratchpad/helga-1096/` (Dateien `helga-1096-*`).

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen › Kategorien (150 % und 200 %) | Nach «Änderungen speichern» steht «Kategorie «Helga Hecke» gespeichert» unten rechts genau über dem «Löschen» der nächsten Zeile, sobald ich ein wenig nach unten scrolle (150 %: ein Mausrad-Schritt; 200 %: die Zeile «Helga Zaun» kommt am unteren Rand ins Bild). Mein Klick auf «Löschen» traf die Meldung, es ging kein Fenster auf, nichts geschah. Erst nach etwa 8 Sekunden (oder mit dem Kreuz) war der Knopf wieder erreichbar. |
| P-2 | Minor | Einstellungen › Zugangsschlüssel für KI-Programme (150 % und 200 %) | Nach «Schlüssel kopieren» erscheint «Der Schlüssel ist kopiert.» unten rechts, obwohl die Knöpfe am unteren Rand stehen. Sie deckt die Knöpfe daneben zu, die ich als Nächstes brauche: bei 150 % «Schliessen» (nur «Sc…» sichtbar), bei 200 % «Adresse kopieren» und «Schliessen» und das Ende der Zeile «Adresse für das KI-Programm: http://localhost:3300/mcp». Den Knopf, den ich gerade geklickt habe, deckt sie nicht zu. |
| P-3 | Minor | Zugangsschlüssel für KI-Programme, Liste (150 %) | Nach dem Widerrufen von «Helga Test B» steht «Zugangsschlüssel «Helga Test B» widerrufen» unten rechts genau über dem «Widerrufen» des nächsten Schlüssels «Helga Test». Mein Klick darauf traf die Meldung, das Bestätigungsfenster ging nicht auf. Gleiches Muster wie P-1. |
| P-4 | Minor | Kategorien, Löschen am unteren Rand (150 %) | Lösche ich eine Kategorie, deren «Löschen» am unteren Rand steht, kommt «Kategorie «Helga Zaun B» gelöscht» trotzdem unten rechts (bei 200 % kam sie in derselben Lage oben). Sie liegt dann über der nächsten Zeile («Marco Rasen»), auf die Dwello den Fokus setzt, und über deren «Löschen». Es wirkt, als wäre dort nichts mehr; ich musste warten, bis die Meldung weg war. |

## Beobachtungen

- Die Seite hat sich in keinem Fall bewegt: kein Springen beim Erscheinen, kein Rutschen beim Verschwinden der Meldung (Scrollposition gleich, gemessene Layoutverschiebung 0, bei 150 % und 200 %).
- Es stand immer nur eine Meldung da. «Kategorie «Helga Hecke» gespeichert» verschwand, als ich «Helga Zaun» löschte; danach kam nur «… gelöscht». Bei zwei schnellen Klicks auf «Adresse kopieren» kam nur eine Meldung.
- Nach dem Löschen einer Kategorie blieb die Liste an derselben Stelle stehen (bei 200 % war ich weit unten, 783 px, und blieb dort). Der Fokus lag danach auf der nächsten Kategorie («Marco Rasen» bzw. «Heizung»). Mit der Maus sehe ich davon keinen Rahmen; die Zeile «Heizung» hatte danach einen etwas dunkleren Rand.
- Beim Widerrufen eines Zugangsschlüssels blieb die Seite ebenfalls stehen, der Fokus ging aber auf die Überschrift «Zugangsschlüssel für KI-Programme» ganz oben (bei 200 % ausserhalb des Bildes), nicht auf den nächsten Schlüssel, obwohl es bei 150 % noch einen gab («Helga Test»).
- Bei 200 % ist die Meldung über die halbe Breite (384 von 720 px) und 80 px hoch. Oben deckt sie die Sprache und das Benutzermenü in der Kopfzeile zu, unten nach dem letzten Widerrufen den Titel «Noch kein Zugangsschlüssel».
- Bei 200 % kam «Die Adresse ist kopiert.» oben, «Der Schlüssel ist kopiert.» unten: zwei Knöpfe in derselben Zeile, die Meldung an zwei verschiedenen Orten. Das ist etwas verwirrend, wenn man sie sucht.
- Gleich nach dem Speichern einer neuen Kategorie deckt die Meldung (150 %) die Kennzeichen «Eigene / Umlagefähig» der obersten Zeile teilweise zu.
- Die Meldungen bleiben etwa 8 Sekunden stehen; sie haben ein Kreuz zum Schliessen («Meldung schliessen»). Das Kreuz ist gross genug.
- Die Bestätigungsfenster sagen klar, was passiert («Die Kategorie verschwindet aus der Auswahl beim Erfassen von Rechnungen.», «… erhält danach keine Daten mehr. Das lässt sich nicht rückgängig machen.»). Gut.
- Neue Kategorien und die Zähler «Alle (n)» stimmten nach dem Löschen bei 200 % sofort (24 → 23). Bei 150 % sah ich nach einem Löschen kurz einen Zähler, der nicht zu den Zeilen passte; dort haben gleichzeitig andere Personas Kategorien angelegt und gelöscht, das zähle ich nicht.

## Aufgabe geschafft: ja

Beide Kategorien angelegt (150 %: «Helga Hecke», «Helga Zaun»; 200 %: «Helga Hecke 200», «Helga Zaun 200»), eine geändert, die andere gelöscht. Zusätzlich «Helga Zaun B» / «Helga Zaun B200» angelegt und gelöscht, um das Löschen am unteren Rand zu prüfen. Zugangsschlüssel «Helga Test» (und «Helga Test B») erstellt, beide Kopier-Knöpfe am unteren Rand geklickt, alle Schlüssel wieder widerrufen. «Helga Hecke» und «Helga Hecke 200» stehen noch in der Liste.

## Aufwand

Etwa 40 Minuten, rund 30 Schritte (je Zoomstufe: 2 × Kategorie anlegen, 1 × ändern, 1–2 × löschen, Schlüssel erstellen, 2 × kopieren, 1–2 × widerrufen). Zwei Klicks gingen ins Leere (P-1, P-3).

## Ablauf

- Einstellungen finden (150 %): erwartet einen Link in der Navigation; gesehen: «Einstellungen» steckt im Benutzermenü unter «Vera Verwalter» oben rechts.
- Kategorien, nach dem Speichern von «Helga Hecke» ein wenig nach unten gescrollt und auf «Löschen» bei «Helga Zaun B» geklickt: erwartet das Bestätigungsfenster; gesehen: nichts, die Meldung «… gespeichert» lag auf dem Knopf (P-1).
- Kategorien, «Löschen» bei «Helga Zaun B» am unteren Rand (150 %): erwartet die Meldung oben; gesehen: unten rechts, über der nächsten Zeile (P-4).
- Zugangsschlüssel, «Schlüssel kopieren» am unteren Rand: erwartet die Meldung oben; gesehen: unten rechts, neben dem Knopf, über «Schliessen» (und bei 200 % über «Adresse kopieren») (P-2).
- Zugangsschlüssel, «Widerrufen» bei «Helga Test» kurz nach dem ersten Widerrufen: erwartet das Bestätigungsfenster; gesehen: nichts, die Meldung lag darauf (P-3).
- Nach dem Widerrufen von «Helga Test B»: erwartet den Fokus beim nächsten Schlüssel; gesehen: Fokus auf der Seitenüberschrift.

## Vorschläge

- **P-1:** 150 %, Einstellungen › Kategorien › eigene Kategorie öffnen, Beschreibung ändern, «Änderungen speichern». Zurück in der Liste einen Mausrad-Schritt nach unten scrollen, sodass das «Löschen» der nächsten eigenen Kategorie unten rechts steht, und darauf klicken: Der Klick trifft die Meldung. Hilfreich: die Meldung dort nicht über Knöpfe legen (z. B. oben anzeigen, wenn unten ein Knopf darunter liegt, auch nach dem Scrollen), oder sie für Klicks durchlässig machen, ausser dem Kreuz.
- **P-2:** 150 % oder 200 %, Zugangsschlüssel erstellen, so scrollen, dass die Knöpfe «Schlüssel kopieren / Adresse kopieren / Schliessen» am unteren Rand stehen, «Schlüssel kopieren» klicken: Die Meldung deckt «Schliessen» (200 %: auch «Adresse kopieren») zu. Hilfreich: bei der Wahl des Ortes die ganze Knopfreihe beachten, nicht nur den geklickten Knopf, oder die Meldung direkt beim Knopf als Text zeigen («Kopiert»).
- **P-3:** 150 %, zwei Zugangsschlüssel anlegen, den oberen widerrufen, gleich danach beim verbleibenden auf «Widerrufen» klicken: Der Klick trifft die Meldung. Hilfreich: wie P-1.
- **P-4:** 150 %, Kategorienliste so scrollen, dass das «Löschen» einer eigenen Kategorie am unteren Rand steht (bei mir 100 px gescrollt, Knopf bei 549–597 von 600), löschen und bestätigen: Die Meldung kommt unten und liegt auf der nächsten Zeile, die den Fokus bekommt. Hilfreich: für den Ort der Meldung die Stelle der gelöschten Zeile bzw. der Zeile mit dem Fokus nehmen, nicht das Bestätigungsfenster.

## Nicht geprüft

- Wie die Meldung mit Tastatur oder Bildschirmleser wirkt: nicht meine Art zu arbeiten (Sven).
- Zwei schnelle Kopier-Klicks bei 200 % auf «Adresse kopieren» oben: mein Klick lag ausserhalb des sichtbaren Bereichs und zählte nicht; das Ersetzen einer Meldung durch die nächste habe ich bei 150 % gesehen (Kategorien und Kopieren).
- Dunkler Modus: nicht Teil der Aufgabe.
