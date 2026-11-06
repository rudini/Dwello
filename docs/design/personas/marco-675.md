# Marco: öffentliche Demo auf dem Handy und am Desktop (#675)

Persona: Marco, 38, meist am Handy, wenig Zeit. Handy 390 × 844 (Touch), dazu Desktop 1440 × 900 (Maus). Ich habe nur geschaut und nichts gespeichert.
App: http://localhost:3300, öffentliche Demo (DEMO=on, Demodaten). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/marco-675/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| M-1 | Minor | Anmelden (Handy und Desktop) | Der volle Demo-Hinweis (vier Absätze) steht vor «Mit Google anmelden». Die einzige Aktion der Seite liegt auf dem Handy bei y = 1353 px, also gut eineinhalb Bildschirme tiefer, am Desktop bei y = 1065 px und damit auch dort unter dem ersten Bildschirm. Wer nicht scrollt, sieht nur Warntext und keinen Weg hinein. |
| M-2 | Minor | Demo-Zeile auf allen Seiten | Die kurze Zeile sagt «Alle Besucher sehen und ändern dieselben Daten. Jede Nacht werden alle Änderungen gelöscht.». Was ich *nicht* eingeben soll (keine echten Namen, E-Mail-Adressen und Telefonnummern, keinen API-Schlüssel), steht nur noch hinter «Mehr zur Demo». Daraus, dass nachts gelöscht wird, schliesse ich eher «dann ist es ja egal, was ich eingebe». |

Frühere Befunde aus #675:

- **P-1 (voller Hinweis braucht auf dem Handy rund 240 px auf jeder Seite): behoben.** In der App steht jetzt eine Zeile, auf dem Handy 112 px hoch und am Desktop 64 px. Sie scrollt mit dem Inhalt weg und klebt nicht oben. Gemessen auf Übersicht, Gebäude, Mieter, Rechnungen, Nebenkostenabrechnungen, Abrechnungen erstellen, Hilfe und Einstellungen: überall gleich.
- **P-2 (Buttons der Übersicht unter dem ersten Bildschirm): behoben, aber knapp.** Auf dem Handy liegt «Abrechnungen erstellen» bei y = 796 bis 844 und schliesst genau mit dem unteren Rand ab. Am Desktop liegt der Button bei y = 416, gut sichtbar. Siehe N-1.

## Beobachtungen

- N-1: Auf dem Handy passt der Button der ersten Aufgabe nur genau ins Fenster von 844 px. Auf einem echten Handy nehmen Adressleiste und Browserleiste Platz weg, dort läge er wahrscheinlich wieder knapp darunter. Den Link «Rechnungen von Alpenblick für 2025 ansehen» (y = 732) sehe ich dagegen gut.
- N-2: Die Demo-Zeile auf dem Handy hat ungleiche Zeilenabstände: Die dritte Zeile mit «Mehr zur Demo» ist sichtbar höher als die beiden darüber (der Link ist 48 px hoch). Das sieht etwas unruhig aus, stört aber nicht.
- N-3: Die Zeile liegt über der Kopfleiste (Menü, Dwello, Sprache, Benutzer). Sie ist hell-ocker und gut als Hinweis zu erkennen, ohne zu alarmieren. Beim Arbeiten hat sie mich nicht gestört, weil sie wegscrollt.
- N-4: «Mehr zur Demo» (getippt auf «Mieter») öffnet `/help#demo` und springt direkt zum Abschnitt «Öffentliche Demo». Dort steht klar, was ich ausprobieren darf: alles, auch Löschen, Abrechnungen erstellen und «Als versendet markieren». Was ich nicht eingeben soll, steht auch da: nur erfundene Daten, auch bei E-Mail und Telefon, nur erfundene Rechnungen und Dokumente, kein eigener API-Schlüssel unter «Einstellungen» › «KI». Dazu kommt, wohin ich mich für eine eigene Installation wende. Den Weg «Einstellungen» › «KI» gibt es so in der App: Menü › Einstellungen, Abschnitt «KI».
- N-5: Die E-Mail-Adresse des Betreibers (betrieb@muster-hosting.ch) ist im Hilfetext und auf der Anmeldeseite reiner Text, kein Link. Auf dem Handy müsste ich sie abtippen oder kopieren.
- N-6: Nach dem Sprung auf `/help#demo` bleibt der Fokus auf `body`. Für mich am Handy egal, ich erwähne es nur.
- N-7: Fusszeile: «© 2026 Dwello Version unbekannt».
- N-8: `/settings` gibt «Diese Seite gibt es nicht.». Die Einstellungen liegen unter `/config`. Ich hatte die Adresse nur geraten, über das Menü komme ich richtig hin.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, 6 Skriptläufe. In der App: Anmeldeseite angeschaut, Übersicht, 7 weitere Seiten durchgeblättert, «Mehr zur Demo» getippt, Einstellungen über das Menü geöffnet.

## Ablauf

- Anmeldeseite auf dem Handy: Ich habe oben den Button «Mit Google anmelden» erwartet. Gesehen habe ich Haus, «Anmelden», einen Satz und dann den gelben Kasten «Öffentliche Demo», der bis unten reicht. Den Button finde ich erst nach etwa eineinhalb Bildschirmen Scrollen. Am Desktop ist es ähnlich: Die Karte ist schmal, und der Button liegt unter dem Rand (M-1).
- Übersicht auf dem Handy: Ich habe befürchtet, dass der Button wie beim letzten Mal unter dem Rand liegt. Jetzt ist «Abrechnungen erstellen» gerade noch ganz sichtbar, sein unterer Rand liegt auf dem Bildschirmrand (N-1).
- Demo-Zeile: Ich habe einen Hinweis erwartet, was ich nicht eingeben soll. Die Zeile sagt nur, dass alle dieselben Daten sehen und nachts gelöscht wird (M-2).

## Vorschläge

- **M-1:** Abmelden bzw. Cookies löschen, dann `/login` auf 390 × 844 öffnen. «Mit Google anmelden» liegt bei y ≈ 1353. Hilfreich wäre, den Button über den Demo-Kasten zu stellen oder den Kasten auf der Anmeldeseite auf zwei Sätze zu kürzen (gleiche Daten für alle, nur erfundene Daten eingeben) und den Rest mit «Mehr zur Demo» zu verlinken, wie in der App.
- **M-2:** Angemeldet eine beliebige Seite öffnen und die oberste Zeile lesen. Hilfreich wäre, den zweiten Satz durch die Handlungsanweisung zu ersetzen oder sie anzuhängen, z. B. «Geben Sie nur erfundene Daten ein.». Das nächtliche Löschen erklärt dann «Mehr zur Demo».

## Nicht geprüft

- Die echte Anmeldung über Google: Ich bin mit der Sitzung des Persona-Kits angemeldet, den Google-Button habe ich nicht angetippt.
- Ein echtes Handy mit Adressleiste: Ich hatte nur das Fenster mit 390 × 844, deshalb ist N-1 eine Vermutung.
- Andere Sprachen als Deutsch und den dunklen Modus: Ich habe die Sprache nicht umgestellt, weil sie im Konto gespeichert wird und andere Personas dasselbe Konto nutzen.
- Speichern: Laut Auftrag nur geschaut.
