# Marco – Protokoll mit mehreren Seiten (#746)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Persona-Stack auf http://localhost:3300, Demo-Daten plus 60 eingefügte Anmeldungen (alle drei Tage, zurück bis etwa Mitte Mai 2026). Heute: 09.11.2026. Nur angeschaut, nichts gespeichert oder gelöscht.

| ID | Schwere | Screen | Befund |
|----|---------|--------|--------|
| P-1 | Minor | Protokoll, Seite 1 (`/config/audit-log`) | Dass es ältere Einträge gibt, sehe ich erst ganz unten: «Seite 1 von 2» und «Nächste Seite» stehen nur nach den 50 Einträgen, auf dem Handy rund elf Bildschirme Wischen (Seite 9016 px hoch). Oben unter dem Titel steht nichts von mehreren Seiten und auch nicht, wie weit die Liste zurückreicht. |
| P-2 | Minor | Protokoll, Seite 2 (`?page=2`) | Nach dem Tippen auf «Nächste Seite» lande ich oben auf einer Seite, die genau gleich aussieht wie Seite 1 (gleicher Titel, gleicher Text, gleicher Seitentitel «Protokoll - Dwello»). Dass ich auf Seite 2 bin, sehe ich nur an den Daten oder ganz unten bei «Seite 2 von 2». Einen Moment dachte ich, das Tippen habe nichts bewirkt. |

## Beobachtungen

- Die Blätter-Knöpfe selbst sind gut: «Nächste Seite» und «Vorherige Seite» sind 48 px hoch, gut mit dem Daumen zu treffen, mit Pfeil und Text, daneben «Seite 1 von 2» bzw. «Seite 2 von 2». Auf Seite 2 gibt es nur «Vorherige Seite», auf Seite 1 nur «Nächste Seite», das ist eindeutig.
- Nichts abgeschnitten, kein seitliches Scrollen: Seitenbreite 390 px auf beiden Seiten, auch bei 320 px Breite (Seite 2) passt alles. Dunkler Modus auf Seite 2 sieht sauber aus.
- Nach «Nächste Seite» und «Vorherige Seite» beginnt die neue Seite oben, so wie ich es erwarte. Mit der Zurück-Geste des Browsers komme ich auch zurück, dann sogar an die Stelle, wo ich war (unten bei den Knöpfen). Beides passt.
- Seite 1 hat 50 Einträge, Seite 2 die restlichen 10 (09.06.2026 bis 13.05.2026).
- Jeder Eintrag hat einen grossen roten «Löschen»-Knopf. Beim langen Wischen durch 50 Karten hatte ich etwas Respekt, aus Versehen einen zu erwischen; ob das Löschen nachfragt, habe ich nicht ausprobiert (nur schauen).
- Der Weg Menü → «Einstellungen» → «Protokoll» ist klar; der Protokoll-Link steht in den Einstellungen unter einer eigenen Überschrift. Die Einstellungsseite ist allerdings lang; der Link kommt zum Glück vor dem Formular.
- Die Fusszeile zeigt «Version unbekannt» (Persona-Build, nicht Teil der Änderung).

## Aufgabe geschafft: ja

Die Anmeldung von vor rund 150 Tagen: 12.06.2026, 06:22, «Anmeldung mit Google». Sie ist der letzte Eintrag auf Seite 1; die nächstältere (09.06.2026, 05:22) steht zuoberst auf Seite 2. Zurück zu den neuesten mit «Vorherige Seite» (oder Zurück-Geste), dort steht wieder 06.11.2026, 09:22 zuoberst.

## Aufwand

Etwa 10 Minuten, rund 9 Schritte: Menü öffnen, Einstellungen, Protokoll, elf Bildschirme nach unten wischen, «Nächste Seite», auf Seite 2 nach unten wischen, «Vorherige Seite», zusätzlich Zurück-Geste zweimal ausprobiert.

## Ablauf

- Protokoll geöffnet. Erwartet: oben ein Hinweis, wie viele Einträge es gibt oder dass es mehrere Seiten sind. Gesehen: Titel, Erklärtext, dann direkt die Liste; der erste Hinweis auf weitere Seiten kommt erst ganz unten nach 50 Karten (P-1).
- «Nächste Seite» getippt. Erwartet: deutlich sichtbar «Seite 2» oder «Ältere Einträge». Gesehen: oben genau dieselbe Ansicht wie vorher, nur andere Daten in den Karten (P-2).

## Vorschläge

- **P-1:** Auf dem Handy (390 × 844) Menü → Einstellungen → Protokoll öffnen, mit mehr als 50 Einträgen. Oben ist nicht zu sehen, dass es weitere Seiten gibt. Hilfreich wäre eine kurze Zeile über der Liste, z. B. «Seite 1 von 2 – die neuesten 50 Einträge. Ältere finden Sie unten mit «Nächste Seite».», oder die Blätter-Knöpfe zusätzlich oben.
- **P-2:** Auf Seite 1 ganz unten «Nächste Seite» tippen. Die neue Seite beginnt oben und sieht aus wie Seite 1. Hilfreich wäre «Seite 2 von 2» oben bei der Überschrift (und im Seitentitel), ggf. mit dem Zeitraum der Einträge auf dieser Seite.

## Nicht geprüft

- Löschen eines Eintrags und was danach mit den Seiten passiert (Auftrag: nur schauen).
- Mehr als zwei Seiten (mittlere Seite mit beiden Knöpfen): es gab nur 60 Einträge.
- Eine Seitenzahl ausserhalb des Bereichs (z. B. `?page=5`): ein Nutzer kommt dort mit Tippen nicht hin, darum nicht versucht.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/4648d2d9-f67a-523e-be64-fb96373c5762/scratchpad/marco-746/` (10-p1-viewport.png: Seitenanfang Seite 1; 11-p1-end-viewport.png: Ende Seite 1 mit «Seite 1 von 2» und «Nächste Seite»; 20-p2-top.png: Anfang Seite 2, gleich wie Seite 1; 13-p2-end.png: Ende Seite 2 mit «Vorherige Seite»; 22/23: dunkler Modus, 320 px).
