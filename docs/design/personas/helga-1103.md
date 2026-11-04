# Helga – Feature-Review #1103 (Tankbestand bei Abrechnungsperiode Juli – Juni)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (zusätzlich 200 %), Maus. App: http://localhost:3300 (Persona-Stack, Demodaten), Datum der App: 04.11.2026.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/helga-1103/`

Aufgabe: Gebäude «Ahornblick» in Winterthur (ZH) mit Abrechnungsperiode «Juli – Juni» erfassen, im Abschnitt «Tankbestand» herausfinden, an welchem Tag ich jetzt den Wert erfassen muss und für welche Periode er End- bzw. Anfangsbestand ist, die Hilfe mit dem Beispiel bei «Stichtag» vergleichen und einen Wert erfassen.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Gebäudeseite, Abschnitt «Tankbestand» | Die Hilfe ist ein einziger Absatz mit sieben Sätzen (bei 200 % zehn Zeilen). Die Antwort auf meine Frage («Der Wert vom 30.06.2026 ist der Endbestand … und der Anfangsbestand …») steht erst im vierten Satz, mitten zwischen Allgemeinem und der Rechenanleitung. Ich musste zweimal lesen, bis ich sie gefunden hatte. |
| P-2 | Minor | Gebäudeseite, Abschnitt «Tankbestand» | Der letzte Satz «Lesen Sie erst Anfang Juli ab, erfassen Sie den Wert trotzdem per 30.06.» liest sich für mich zuerst wie eine Anweisung («Lesen Sie erst im Juli ab»), nicht wie «Falls Sie erst Anfang Juli ablesen, …». Ich war kurz unsicher, ob ich bis Juli warten soll. |

## Beobachtungen

- Hilfe und Beispiel sagen dasselbe Datum: In der Hilfe steht «bei diesem Gebäude am 30.06.» und «Der Wert vom 30.06.2026 ist der Endbestand der Abrechnungsperiode 01.07.2025 – 30.06.2026 und der Anfangsbestand der Abrechnungsperiode 01.07.2026 – 30.06.2027». Beim Feld «Stichtag» steht «Format TT.MM.JJJJ. Beispiel: 30.06.2026». Beides passt zu meiner Periode Juli – Juni und zum heutigen Datum (November 2026: die letzte abgeschlossene Periode endete am 30.06.2026). Ich hätte das richtige Datum erfasst.
- Auch der Hilfetext bei «Kein Tank oder Tank stillgelegt» im Formular «Neues Gebäude» spricht vom «Endbestand am letzten Tag der Abrechnungsperiode»; das widerspricht der Hilfe auf der Gebäudeseite nicht.
- Dwello nimmt einen Stichtag, der nicht auf das Periodenende fällt, ohne Rückfrage an: Ich habe zum Ausprobieren 02.07.2026 gespeichert («Bestand gespeichert.»), es kam kein Hinweis, dass für dieses Gebäude der 30.06. gilt. Wer die Hilfe nicht liest und das Ablesedatum einträgt, merkt den Fehler nicht. Ich habe diesen Eintrag danach selbst wieder gelöscht.
- Der Lösch-Dialog («Bestand vom 02.07.2026 löschen?») erklärt die Folgen ausführlich (Einkauf statt Verbrauch, «Neu berechnen», «Abrechnung berichtigen»); für mich etwas viel, aber verständlich.
- In der Liste der gespeicherten Bestände steht nur «30.06.2026 · Heizung · CHF 2’070.00», ohne Spaltentitel und ohne Hinweis «Endbestand 2025/26 / Anfangsbestand 2026/27». Ich verstehe es dank der Hilfe darüber, sähe es aber gern direkt in der Zeile.
- «Stichtag» und «Ster» sind für mich Fachwörter; «Stichtag» wird durch das Beispiel klar, «Ster» kenne ich nicht (bei Öl brauche ich es nicht).
- Das Feld «Stichtag» und der Kalender-Knopf haben beide «Stichtag» im Namen («Kalender für Stichtag öffnen»); für mich mit der Maus kein Problem.
- Bei 200 % Zoom kein seitliches Scrollen (Seitenbreite 720 = Fensterbreite); alles lesbar, Felder untereinander bzw. nebeneinander gut gross.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 8 Schritte (Gebäudeliste, Formular «Neues Gebäude» ausfüllen und speichern, Hilfe lesen, Wert erfassen, Kontrolle bei 200 %, Ausprobieren eines falschen Datums, Löschen dieses Probe-Eintrags).

## Ablauf

- Hilfe «Tankbestand» lesen. Erwartet: ein kurzer Satz «Erfassen Sie jetzt den Wert vom 30.06.2026». Gesehen: die Antwort steht im vierten von sieben Sätzen eines langen Absatzes; ich musste suchen (P-1).
- Letzter Satz der Hilfe. Erwartet: ein Hinweis für den Fall, dass ich später ablese. Gesehen: «Lesen Sie erst Anfang Juli ab, …» – zuerst als Anweisung verstanden (P-2).
- Probe mit Stichtag 02.07.2026. Erwartet: ein Hinweis, dass bei diesem Gebäude der 30.06. gilt. Gesehen: «Bestand gespeichert.» ohne Hinweis (siehe Beobachtungen).
- Kalender-Knopf neben «Stichtag» angeklickt. Erwartet: ein Kalender. Gesehen: im Screenshot kein Kalender sichtbar (siehe «Nicht geprüft»).

Erfasst habe ich gemäss Hilfe: Stichtag 30.06.2026, Wert CHF 2070.00, Kategorie Heizung. Dwello zeigte «Bestand gespeichert.» und die Zeile «30.06.2026 · Heizung · CHF 2’070.00».

## Vorschläge

- **P-1:** Gebäude mit «Juli – Juni» erfassen, Gebäudeseite öffnen, Abschnitt «Tankbestand». Hilfe: die Antwort zuerst und abgesetzt, z. B. eine eigene Zeile «Jetzt erfassen: Wert vom 30.06.2026 (Endbestand 01.07.2025 – 30.06.2026, Anfangsbestand 01.07.2026 – 30.06.2027)», die Rechenanleitung in einen zweiten Absatz.
- **P-2:** Gleicher Ort, letzter Satz. Hilfe: «Lesen Sie den Tank erst Anfang Juli ab, erfassen Sie den Wert trotzdem per 30.06.» oder «Wenn Sie erst Anfang Juli ablesen, …».

## Nicht geprüft

- Den Kalender hinter «Kalender für Stichtag öffnen»: nach dem Klick zeigte der Screenshot keinen Kalender und das Zugänglichkeits-Abbild keinen Dialog (vermutlich der Datumswähler des Browsers, den der kopflose Browser nicht zeichnet). Ich habe das Datum getippt.
- Wie Dwello den Wert in einer Abrechnung verwendet: «Ahornblick» hat keine Wohnungen und keine Abrechnung; das gehörte nicht zur Aufgabe.
- Andere Gebäude habe ich nicht geöffnet oder geändert.
