# Sven – «Abrechnungen erstellen» per Tastatur, Alpenblick 2025 (#663)

Desktop 1440 × 900, nur Tastatur (Tab, Shift+Tab, Leertaste, Enter), beurteilt über den Accessibility-Tree. Nichts gespeichert, keine Abrechnung erstellt. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/sven-663/`.

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnungen erstellen, Schritt 5 «Erstellen» | Der letzte Schritt vor «Entwürfe erstellen» sagt nur «Es werden 2 Nebenkostenabrechnungen als Entwurf erstellt.» Er nennt weder die Abrechnungsperiode noch das Gebäude noch das Heizprofil. «Alpenblick» höre ich nur nebenbei im Warnhinweis («Alpenblick: Ein Entwurf rechnet nur mit …»), die Periode gar nicht. Um sicher zu sein, muss ich zu Schritt 4 zurück. |
| P-2 | Major | Abrechnungen erstellen, Fortschritt (Schritte 2–5) | Ein erledigter Schritt heisst nur «Abrechnungsperiode (erledigt)», «Gebäude (erledigt)», «Heizprofil und Verwaltungspauschale (erledigt)». Was ich gewählt habe, steht nicht dabei. Auch sichtbar sieht man nur ein Häkchen und den Namen des Schritts (Screenshot step4). |
| P-3 | Minor | Abrechnungen erstellen, Schritte 2 und 3 | Auf Schritt 2 und 3 steht die gewählte Abrechnungsperiode (01.01.2025 – 31.12.2025) nirgends im Accessibility-Tree. Auf Schritt 3 steht auch das gewählte Gebäude nirgends. Ob ich 2025 gewählt habe, kann ich nur prüfen, wenn ich zurück zu Schritt 1 gehe. |
| P-4 | Minor | Abrechnungen erstellen, Schritt 4 «Vorschau» | Die Vorschau hat die Begriffspaare Abrechnungsperiode, Anzahl, Kosten, Heizprofil und Verwaltungspauschale, aber keines «Gebäude». Das Gebäude kommt nur indirekt vor («Alpenblick 6 Rechnungen vom …», die Liste «Alpenblick» mit fehlenden Rechnungen). |
| P-5 | Minor | Abrechnungen erstellen, Schritt 2 «Gebäude» | Ich wähle nur Alpenblick, und der Screenreader meldet trotzdem «Alle Gebäude, Kontrollkästchen, aktiviert». Den Text «1 von 3 gewählt» liest er nicht am Kästchen vor (er hat kein aria-describedby, ist nur Text daneben). Nur der Hinweis weiter unten erklärt, dass «Alle Gebäude» die 2 schon abgerechneten Gebäude auslässt. Beim schnellen Durchtabben könnte ich meinen, ich hätte alle drei Gebäude gewählt. |

## Beobachtungen

- Der Fokus geht nach jedem «Weiter» und «Zurück» auf die Überschrift des neuen Schritts («Schritt 2 von 5: Gebäude» usw.). Das ist gut: Ich weiss immer, wo ich bin.
- Den aktuellen Schritt markiert `aria-current="step"`, die Fortschrittsleiste heisst «Schritt n von 5». Die erledigten Schritte sind Buttons und mit Shift+Tab von der Überschrift aus zu erreichen. «Abrechnungsperiode (erledigt)» bringt mich korrekt zu Schritt 1 zurück, und meine Werte bleiben erhalten.
- Gehe ich zurück, sind spätere Schritte nicht mehr «erledigt». Von Schritt 5 bis Schritt 2 zurück zeigt die Liste nur noch Schritt 1 als erledigt, obwohl die Schritte 3 und 4 schon ausgefüllt waren. Die Werte bleiben trotzdem: Die Bestätigung «Die Abrechnungen trotzdem erstellen» ist nach Zurück aus 5 noch angekreuzt, Alpenblick bleibt gewählt.
- Schritt 4: Drücke ich «Weiter» ohne Bestätigung, springt der Fokus auf «Die Abrechnungen trotzdem erstellen» (als ungültig markiert), und darunter steht der Fehlertext. Gut gelöst.
- Schritt 3: Der Satz «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» steht vor «Zurück» und «Weiter», der Hinweis «Ohne vereinbarte Verwaltungspauschale» mit dem Link «Kevin Fischer, Wohnung OG1» aber erst danach. Per Tab komme ich zuerst zu «Weiter», erst danach zum Hinweis.
- Weggehen: Über den Brotkrümel «Nebenkostenabrechnungen» oder «Abbrechen» (nur auf Schritt 1) komme ich ohne Rückfrage auf die Liste. Der Entwurf bleibt im Browser. «Abbrechen» verwirft also nichts, obwohl das Wort danach klingt.
- Beim erneuten Öffnen gibt es den Hinweis «Angaben wiederhergestellt … zuletzt am 05.11.2026 um 13:56 bearbeitet …» mit «Angaben verwerfen». Der Fokus springt aber gleich auf «Schritt 3 von 5», also an diesem Hinweis vorbei, der keine Live-Region ist. Ohne Shift+Tab höre ich nicht, dass alte Angaben geladen wurden. Der Hinweis sagt auch nicht, welche Periode und welches Gebäude wiederhergestellt sind. Ich hatte den Assistenten auf Schritt 4 verlassen und bin auf Schritt 3 wieder eingestiegen.
- Der Dialog «Angaben verwerfen?» ist gut: Der Fokus geht hinein und bleibt beim Tabben zwischen «Abbrechen» und «Angaben verwerfen». Der Text «Ihre Angaben werden gelöscht.» nennt aber nicht, welche. Nach dem Bestätigen geht der Fokus auf «Schritt 1 von 5: Abrechnungsperiode», der Browser-Entwurf ist weg. Eine Meldung «verworfen» kommt nicht, die Status-Regionen sind leer.
- Die Checkboxen der Gebäude heissen «Alpenblick Bergstrasse 8, 3800 Interlaken». Als Beschreibung kommen die Anzahl Rechnungen und Wohnungen dazu, bei Seepark und Musterhaus auch «Keine neue Abrechnung: Alle …». Das ist gut verständlich.

## Aufgabe geschafft: ja

Ich bin mit der Tastatur bis Schritt 5 gekommen, ohne «Entwürfe erstellen» zu drücken, und mit «Zurück» und über die erledigten Schritte wieder zu Schritt 1. Danach habe ich den Assistenten verlassen und beim erneuten Öffnen die Angaben verworfen. Ob Gebäude und Periode stimmen, konnte ich nur auf Schritt 4 und auf den Schritten 1/2 selbst prüfen.

## Aufwand

Etwa 15 Minuten, 9 Durchläufe. Ein Durchgang bis Schritt 5 braucht rund 45 Tabs, davon 17 durch Kopf und Hauptnavigation bis zum Formular (es gibt einen Link «Zum Inhalt springen»).

## Ablauf

- Schritt 2, nach «Weiter» aus Schritt 1. Erwartet: Ich höre irgendwo «Abrechnungsperiode 01.01.2025 – 31.12.2025». Gesehen: nur «Abrechnungsperiode (erledigt)», die Periode fehlt (P-2, P-3).
- Schritt 2, Leertaste auf Alpenblick. Erwartet: Nur Alpenblick ist angekreuzt, «Alle Gebäude» nicht. Gesehen: «Alle Gebäude» steht auf «aktiviert» (P-5).
- Schritt 3. Erwartet: Periode und Gebäude kann ich nachlesen. Gesehen: Beides fehlt, es gibt nur zwei «(erledigt)»-Buttons (P-2, P-3).
- Schritt 4. Erwartet: eine Zusammenfassung mit Gebäude, Periode und Heizprofil. Gesehen: Periode und Heizprofil stehen da, ein Eintrag «Gebäude» fehlt (P-4).
- Schritt 5. Erwartet: «2 Entwürfe für Alpenblick, 01.01.2025 – 31.12.2025» vor dem Erstellen. Gesehen: nur «Es werden 2 Nebenkostenabrechnungen als Entwurf erstellt.» (P-1).
- Zurück von Schritt 5 bis 2. Erwartet: Die Schritte 3 und 4 bleiben als erledigt markiert. Gesehen: Nur noch Schritt 1 ist erledigt (Beobachtung).
- Weggehen über den Brotkrümel, dann «Abbrechen». Erwartet: Abbrechen verwirft den Entwurf, oder es kommt eine Rückfrage. Gesehen: kein Dialog, der Entwurf bleibt im Browser (Beobachtung).
- Erneutes Öffnen. Erwartet: Ich höre zuerst, dass alte Angaben da sind. Gesehen: Der Fokus geht direkt auf Schritt 3, der Hinweis liegt davor (Beobachtung).

## Vorschläge

- **P-1:** Dashboard → «Abrechnungen erstellen» → Weiter → Alpenblick ankreuzen → Weiter → Weiter → «trotzdem erstellen» ankreuzen → Weiter. Auf Schritt 5 steht nur die Anzahl. Hilfreich wäre ein Satz wie «Es werden 2 Nebenkostenabrechnungen für Alpenblick, Abrechnungsperiode 01.01.2025 – 31.12.2025, als Entwurf erstellt.», gern dazu das Heizprofil.
- **P-2:** Gleicher Weg bis Schritt 3, dann Shift+Tab von der Überschrift aus. Die Buttons heissen nur «… (erledigt)». Hilfreich wäre der Wert im Namen oder als Beschreibung: «Abrechnungsperiode: 01.01.2025 – 31.12.2025 (erledigt)», «Gebäude: Alpenblick (erledigt)», «Heizprofil: Heizung + Warmwasser, Verwaltungspauschale 3 % (erledigt)». Sichtbar unter dem Häkchen hilft das auch Sehenden.
- **P-3:** Gleicher Weg bis Schritt 2 bzw. 3. Hilfreich wäre unter der Schrittüberschrift eine kurze Zeile mit den bisherigen Angaben («Abrechnungsperiode 01.01.2025 – 31.12.2025 · Alpenblick»), die der Screenreader mit der fokussierten Überschrift liest. P-2 würde das ebenfalls lösen.
- **P-4:** Gleicher Weg bis Schritt 4. Hilfreich wäre ein Begriffspaar «Gebäude: Alpenblick» direkt nach «Abrechnungsperiode».
- **P-5:** Schritt 2 → Leertaste auf Alpenblick → Shift+Tab auf «Alle Gebäude»: Er meldet «aktiviert». Hilfreich wäre, «1 von 3 gewählt» mit aria-describedby an «Alle Gebäude» zu hängen und dort zu sagen, dass die 2 schon abgerechneten Gebäude nicht wählbar sind. Oder «Alle Gebäude» heisst dann «Alle offenen Gebäude».

## Nicht geprüft

- «Entwürfe erstellen» und alles danach: Die Aufgabe war ausdrücklich nur Anschauen.
- Ein echter Screenreader (NVDA/VoiceOver): Ich habe den Accessibility-Tree von Chromium gelesen und den Fokus abgefragt. Ob und wann der Screenreader die leeren Status-Regionen vorliest, habe ich nicht gehört.
- Eine andere Periode als die vorgeschlagene: 01.01.2025 – 31.12.2025 war schon eingetragen, ich habe sie nicht geändert und auch die Kalender-Buttons nicht benutzt.
- Andere Sprachen und Mobile: nicht Teil von Svens Profil.

## Nachprüfung

Gleiches Profil: Desktop 1440 × 900, nur Tastatur, beurteilt über den Accessibility-Tree. Weg: Übersicht → «Abrechnungen erstellen» → Abrechnungsperiode 01.01.2025 – 31.12.2025 (vorgeschlagen) → Alpenblick → Heizprofil «Heizung + Warmwasser», Verwaltungspauschale 3 % → «Die Abrechnungen trotzdem erstellen» → Schritt 5. «Entwürfe erstellen» nicht gedrückt. Danach über den Brotkrümel weg, Assistent wieder geöffnet, «Angaben verwerfen» bestätigt. Der Browser-Entwurf ist weg, der Fokus steht auf «Schritt 1 von 5: Abrechnungsperiode». Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/sven-663-recheck/`.

| ID | Stand | Was ich jetzt höre |
|---|---|---|
| P-1 | behoben | Schritt 5 hat jetzt vor «Es werden 2 Nebenkostenabrechnungen als Entwurf erstellt.» eine Liste mit Begriffspaaren: «Abrechnungsperiode: 01.01.2025 – 31.12.2025», «Gebäude: Alpenblick», «Heizprofil: Heizung + Warmwasser», «Verwaltungspauschale: 3 % der eigenen Nebenkosten jedes Mieters mit vereinbarter Verwaltungspauschale. Ein eigener Satz im Mietvertrag geht vor.» Ich lese sie direkt nach der fokussierten Überschrift «Schritt 5 von 5: Erstellen» und vor «Zurück» und «Entwürfe erstellen». Sichtbar sind es vier Kacheln (Screenshot step5). |
| P-2 | behoben | Die erledigten Schritte heissen jetzt «Abrechnungsperiode 01.01.2025 – 31.12.2025 (erledigt)» (ab Schritt 2), «Gebäude Alpenblick (erledigt)» (ab Schritt 3), «Heizprofil und Verwaltungspauschale Heizung + Warmwasser (erledigt)» (ab Schritt 4) und «Vorschau (erledigt)». Mit Shift+Tab von der Schrittüberschrift aus höre ich sie der Reihe nach. Sichtbar steht der Wert unter dem Namen des Schritts. Auch nach dem Wiederherstellen (Einstieg auf Schritt 3) nennen die Buttons Periode und Gebäude. |

Damit ist auch P-3 erledigt: Auf Schritt 2 und 3 stehen Periode und Gebäude jetzt in den Buttons der Fortschrittsliste. P-4 gilt weiter, die Vorschau auf Schritt 4 hat kein Begriffspaar «Gebäude». P-5 habe ich nicht neu geprüft.

### Beobachtungen der Nachprüfung

- Der Button des dritten Schritts nennt nur das Heizprofil, nicht die Verwaltungspauschale, obwohl der Schritt «Heizprofil und Verwaltungspauschale» heisst. Vorgelesen klingt das wie ein Satz: «Heizprofil und Verwaltungspauschale Heizung + Warmwasser». Ohne Trennzeichen könnte ich kurz meinen, die Verwaltungspauschale heisse «Heizung + Warmwasser». Mit einem Doppelpunkt oder Komma («…: Heizung + Warmwasser, 3 %») wäre das klar. Die 3 % höre ich sicher auf Schritt 5.
- Auf Schritt 5 springt Tab von der Überschrift direkt zu «Zurück» und «Entwürfe erstellen», weil die Zusammenfassung nicht fokussierbar ist. Mit dem Lesecursor kommt sie aber vor den Buttons. Das ist in Ordnung.
- Sichtbar trennt die Fortschrittsliste bei 1440 px die Wörter mitten im Wort («Abrech-nungsperi-ode», «Warmwass er»). Für mich spielt das keine Rolle, sehenden Nutzern fällt es auf.
- Der Hinweis «Angaben wiederhergestellt» nennt weiterhin keine Periode und kein Gebäude, und der Fokus geht beim Wiedereinstieg an ihm vorbei auf «Schritt 3 von 5» (wie in der ersten Runde). Mit P-2 höre ich Periode und Gebäude jetzt aber per Shift+Tab in der Fortschrittsliste.

Aufgabe der Nachprüfung geschafft: ja. Aufwand: etwa 5 Minuten, 3 Durchläufe. Ein Durchlauf ist an einem neuen Browser-Kontext gescheitert, weil der Entwurf dort nicht mehr da war. Danach habe ich Weggehen und Verwerfen in einem Durchlauf gemacht.
