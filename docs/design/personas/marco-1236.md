# Marco – Alte Seitenlinks der Nebenkostenabrechnungen (#1237)

Handy 390 × 844, Touch, Demodaten. Nur angeschaut, nichts gespeichert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde zur Änderung. |

## Beobachtungen

- `/statements?status=draft&page=5`: Ich lande auf `?status=draft&page=1`. Die Karte «7 Entwurf» ist markiert, darunter steht «Die Liste unten zeigt 7 Abrechnungen mit dem Status «Entwurf».», die Überschrift der Liste heisst ebenfalls «7 Abrechnungen mit dem Status «Entwurf»». Ich habe 7 Einträge gezählt, alle mit dem Abzeichen «Entwurf». Zahl und Liste stimmen.
- `/statements?page=9`: Ich lande auf `?page=2`. Überschrift «Abrechnungen 11–17 von 17, Seite 2 von 2», 7 Einträge (alle «Bezahlt»), unten «Vorherige Seite» und «Seite 2 von 2». Die Statusfelder ergeben zusammen 7 + 0 + 9 + 0 + 1 = 17, das passt zu «von 17».
- Ohne Filter steht unter den Statusfeldern kein Satz wie «Die Liste unten zeigt …». Die Gesamtzahl 17 sehe ich erst in der Überschrift der Liste, nach einmal Scrollen am Suchfeld vorbei. Die 17 musste ich aus den Karten selbst zusammenzählen. Gestört hat es mich nicht.
- Dass mein Link auf eine Seite zeigte, die es nicht mehr gibt, sagt mir die App nicht. Bei den Entwürfen fällt das nicht auf, weil alles auf eine Seite passt. Ohne Filter verrät es nur «Seite 2 von 2». Für mich reicht das: Ich sehe eine echte Liste und keine leere Seite.
- Kein seitliches Scrollen (Seitenbreite 390 px).

## Aufgabe geschafft: ja

## Aufwand

Etwa 2 Minuten, 2 Links geöffnet und je einmal gescrollt.

## Ablauf

- Link mit `page=5` (Entwürfe). Erwartet: eine leere Seite oder «keine Abrechnungen», weil es Seite 5 nicht gibt. Gesehen: die eine vorhandene Seite mit allen 7 Entwürfen, die Adresse wurde zu `page=1`.
- Link mit `page=9`. Erwartet: dasselbe Problem. Gesehen: die letzte Seite «Seite 2 von 2» mit den Abrechnungen 11–17.

## Vorschläge

Keine (keine Tabellenbefunde).

## Nicht geprüft

- Querformat und Dunkelmodus nicht angeschaut, weil die Aufgabe danach nicht fragte.
- Alte Links mit Gebäudefilter oder Suchbegriff (z. B. `?q=…&page=5`) nicht geprüft, weil sie nicht zu meiner Aufgabe gehörten.
