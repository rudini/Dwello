<!-- Persona rerun I2 on 8286701; screenshots stayed in the session's scratchpad -->

# Persona-Test I2: Sven, 45, blind, Screenreader und Tastatur (Wiederholung)

Datum des Laufs: Sonntag, 11.10.2026. Desktop, nur Tastatur, Seite gelesen über den Accessibility-Tree (Rolle, Name, Beschreibung, Live-Regionen). Kein echter Screenreader; was «angesagt» wird, leite ich aus Fokus, `aria-describedby` und Live-Regionen ab.
Gewählter Mietvertrag: wie beim letzten Mal **Marco Bernasconi, Wohnung B2, Seepark Residenz** (laufend seit 01.07.2023, unbefristet).
Ziel-Vertragsende: letzter Tag des übernächsten Monats = **31.12.2026**.

## Aufgabe geschafft: **ja**

Der Mietvertrag endet jetzt am 31.12.2026 (Detailseite: «Vertragsende 31.12.2026», der Schalter «Beenden» ist weg). Den Löschdialog habe ich geöffnet und mit Escape geschlossen. Bei Thomas Weber (Seepark, A1) habe ich den Dialog «Beenden» nur geöffnet, ein vergangenes Datum mit Enter geprüft und mit Escape abgebrochen; sein Vertrag ist weiterhin unbefristet. Nichts gelöscht.

## Aufwand (Tastendrücke)

| Schritt | Tasten |
|---|---|
| Liste «Mietverträge»: Sprunglink (Tab, Enter), Tab ×8 zu «Marco Bernasconi», Enter | 11 |
| Detailseite → «Beenden» (Tab ×19, Enter) | 20 |
| (1) Tab, Enter ohne Eingabe | 2 |
| (2) Ctrl+A, «30.09.2026», Enter im Feld | 12 |
| (3) Ctrl+A, «15.09.2026», Tab ×3 zu «Mietvertrag beenden», Enter | 15 |
| (4) Ctrl+A, «31.12.2026», Enter im Feld | 12 |
| **Total mit allen Prüfungen** | **72** |
| Kürzester Weg ohne Fehlversuche (Dialog öffnen, Tab ×2, Datum, Enter) | ca. 44 |
| Löschdialog: Tab ×19, Enter, Escape | 21 |

Letztes Mal waren es ca. 83 Tasten mit nur einem Fehlversuch. Der Gewinn kommt vor allem vom Sprunglink, den ich diesmal benutzt habe; am Dialog selbst hat sich die Anzahl Tasten nicht geändert. Auf der Detailseite brauche ich weiterhin 19 Tabs bis «Beenden», weil der Fokus nach dem Seitenwechsel ganz oben liegt.

## Laut gedacht (was angesagt wurde)

1. **Liste → Detailseite:** Seitentitel assertiv: «Mietvertrag - Marco Bernasconi - Dwello». Der Fokus liegt danach auf dem Seitenanfang (nicht auf der Überschrift). Auf der Detailseite: «Mietvertrag von Marco Bernasconi, Überschrift Ebene 1», «Wohnung B2 · Seepark Residenz», «Bearbeiten», «Beenden», «Löschen». Wie letztes Mal.
2. **Dialog öffnen:** «Mietvertrag beenden?, Dialog. Vertragsende. Der letzte Tag des Mietverhältnisses, zum Beispiel der Tag, auf den gekündigt ist. Bis und mit diesem Tag läuft der Mietvertrag. Format TT.MM.JJJJ. Beispiel: 31.12.2025.» Das sind **26 Wörter statt über 60**. Keine zweite Ansage aus einer Live-Region mehr. Fokus: **«Abbrechen, Schalter»**. Tab-Reihenfolge: Abbrechen → Mietvertrag beenden → Vertragsende → Kalender öffnen → wieder Abbrechen.
3. **Das Feld:** «Vertragsende, Eingabefeld, leer», Beschreibung 25 Wörter (vorher rund 60). **Es ist kein Datum mehr vorgeschlagen.**
4. **(1) Tab + Enter direkt nach dem Öffnen:** Tab landet auf «Mietvertrag beenden», Enter. Es wird **nichts gespeichert**. Der Fokus springt ins Feld: «Vertragsende, Eingabefeld, ungültig, leer. Der letzte Tag des Mietverhältnisses … Format TT.MM.JJJJ. Beispiel: 31.12.2025. **Bitte geben Sie das Vertragsende ein, zum Beispiel 31.03.2027.**» Der Fehler kommt nach 25 Wörtern Hilfe, die Beschreibung hat jetzt 34 Wörter.
5. **Beim Tippen:** Sobald das Datum vollständig ist, sagt die Live-Region höflich den Wochentag an («Mittwoch, 30. September 2026»). Weiterhin eine gute Kontrolle.
6. **(2) Vergangenes Datum (30.09.2026), Enter im Feld:** Der Dialog bleibt offen. Das Feld verliert kurz den Fokus und bekommt ihn sofort zurück (blur, focus). Deshalb liest der Screenreader das Feld neu vor: «Vertragsende, Eingabefeld, ungültig, 30.09.2026. Der letzte Tag … Beispiel: 31.12.2025. **Das Vertragsende kann nicht vor heute liegen. Ein früheres Vertragsende tragen Sie unter «Bearbeiten» ein.** Mittwoch, 30. September 2026.» Die Wochentag-Live-Region meldet sich dabei **nicht** mehr. Die Beschreibung hat 44 Wörter; der Fehler beginnt nach Wort 25. Ob NVDA, JAWS und VoiceOver das Neufokussieren desselben Felds wirklich neu ansagen, konnte ich ohne echten Screenreader nicht prüfen; im Tree passiert das Richtige.
7. **(3) Vergangenes Datum (15.09.2026), Schalter «Mietvertrag beenden»:** Der Fokus springt zurück ins Feld, dieselbe Ansage wie bei (2) mit «Dienstag, 15. September 2026» am Schluss. Auch hier 44 Wörter, der Fehler nach 25 Wörtern Hilfe.
8. **(4) Richtiges Datum (31.12.2026), Enter im Feld:** Live-Region: «Donnerstag, 31. Dezember 2026». Nach Enter schliesst sich der Dialog, die Seite lädt neu, der **Fokus liegt auf der Überschrift** «Mietvertrag von Marco Bernasconi, Ebene 1», und höflich kommt **«Der Mietvertrag von Marco Bernasconi endet am 31.12.2026»** (mit Schalter «Meldung schliessen»). Der Seitentitel wird diesmal **nicht** zusätzlich assertiv angesagt. Unter «Vertragsdauer» steht weiterhin «Laufend», darunter «Vertragsende 31.12.2026».
9. **Löschdialog:** «Mietvertrag löschen?, Dialog. Der Mietvertrag läuft bis am 31.12.2026 und kann bis dahin nicht gelöscht werden. Behalten Sie ihn auch danach: Die Nebenkostenabrechnung braucht seine Mietstage.» Fokus auf «Abbrechen»; Tab und Shift+Tab bleiben auf «Abbrechen», weil «Mietvertrag löschen» deaktiviert ist. Escape schliesst, der Fokus kehrt auf «Löschen» zurück.

## Besser als beim letzten Mal

- **Behoben (war Major):** Tab+Enter direkt nach dem Öffnen beendet den Mietvertrag nicht mehr auf heute. Das Feld ist leer, und der Fehler sagt, was zu tun ist, mit einem Beispiel in der Zukunft (31.03.2027).
- **Behoben (war Major):** Der Fehler nach Enter im Feld ist nicht mehr stumm. Das Feld wird neu fokussiert und mit «ungültig» und der Fehlermeldung vorgelesen. Die irreführende Wochentag-Ansage nach dem Absenden ist weg.
- **Deutlich besser (war Major):** Die Hilfe ist von rund 60 auf 25 Wörter geschrumpft. Bis zum Fehler höre ich jetzt 25 statt 60 Wörter.
- **Behoben (war Minor):** Beim Öffnen wird nicht mehr doppelt angesagt (keine zusätzliche Live-Region).
- **Behoben (war Minor):** Nach dem Speichern konkurriert keine assertive Seitentitel-Ansage mehr mit der Bestätigung.
- **Besser (war Minor):** Der Löschdialog sagt jetzt klar: «kann bis dahin nicht gelöscht werden» und empfiehlt, den Vertrag auch danach zu behalten.

## Gleich geblieben oder schlechter

- **Major (geblieben, abgeschwächt):** Die Fehlermeldung steht in der Beschreibung weiterhin **hinter** der Hilfe. Ich höre zuerst 25 Wörter, die ich schon kenne, dann den Fehler. Wer nach «ungültig» weitertippt oder die Ansage unterbricht, hört den Grund nicht. Es gibt kein `aria-errormessage` und keine `role="alert"`; die Ansage hängt allein am Neufokussieren.
- **Minor (geblieben):** Der Fokus startet auf «Abbrechen», und «Mietvertrag beenden» kommt vor dem einzigen Feld. Weil das Feld jetzt leer ist, ist das nicht mehr gefährlich, kostet aber einen unnötigen Fehlversuch.
- **Minor (geblieben):** «Beispiel: 31.12.2025» in der Hilfe liegt in der Vergangenheit. Wer es abtippt, bekommt sofort «kann nicht vor heute liegen». Die Fehlermeldung für das leere Feld nennt dagegen 31.03.2027; die zwei Beispiele widersprechen sich.
- **Minor (geblieben):** Der Löschdialog heisst weiterhin «Mietvertrag löschen?», obwohl es keine Wahl gibt.
- **Minor (geblieben):** Nach dem Speichern sagt die Detailseite «Laufend» ohne Hinweis, dass der Vertrag gekündigt ist; das Vertragsende steht erst eine Zeile tiefer.
- **Minor (geblieben):** In der Mietvertragsliste heisst der Link nur wie der Mieter; Wohnung und Gebäude fehlen im Linknamen. «Kevin Fischer» kommt weiterhin zweimal vor.

## Neue Befunde

- **Minor:** Nach einem Fehler endet die Beschreibung des Felds mit dem Wochentag des falschen Datums («… tragen Sie unter «Bearbeiten» ein. Dienstag, 15. September 2026»). Das Letzte, was ich höre, klingt wie eine Bestätigung. Bei einem ungültigen Wert gehört der Wochentag vor den Fehler oder ganz weg.
- **Minor:** Im Löschdialog steht «Mietstage». Gemeint ist wohl «Miettage»; beim Vorlesen stolpere ich darüber.
- **Minor:** Nach dem Wechsel von der Liste auf die Detailseite liegt der Fokus am Seitenanfang, nach dem Speichern dagegen auf der Überschrift. Ich muss auf der Detailseite 19 Tabs (oder Sprunglink plus 3 Tabs) bis «Beenden» drücken.
- **Beobachtung:** In der Liste stand bei «Kevin Fischer, Wohnung OG1, Alpenblick» schon vor meinem Speichern «Laufend 01.05.2021 – 31.03.2027». Das war nicht ich; vermutlich lief parallel ein anderer Test auf denselben Demodaten.

## Vorschläge

- **Major:** Die Fehlermeldung an den Anfang der Beschreibung stellen (`aria-describedby="endDate-error endDate-help …"`) oder sie über `aria-errormessage` verbinden, damit «ungültig» und der Grund direkt hintereinander kommen.
- **Minor:** Beim Öffnen den Fokus ins Feld «Vertragsende» setzen oder das Feld in der Tab-Reihenfolge vor die Schalter stellen.
- **Minor:** Das Beispiel in der Hilfe vom heutigen Datum ableiten (z. B. dasselbe 31.03.2027 wie in der Fehlermeldung).
- **Minor:** Bei einem Fehler den Wochentag nicht ans Ende der Beschreibung hängen, oder als «Sie haben Dienstag, 15. September 2026 eingegeben» vor den Fehler stellen.
- **Minor:** «Mietstage» prüfen (wohl «Miettage»).
- **Minor:** Den Löschdialog bei laufenden Verträgen anders betiteln («Mietvertrag kann noch nicht gelöscht werden»).
- **Minor:** Auf der Detailseite «Laufend, gekündigt auf 31.12.2026» o. ä. zeigen; im Listenlink Wohnung und Gebäude ergänzen.

## Blocker und Majors (Kurzfassung)

- Blocker: keine.
- Major: Fehlermeldung steht in der Feldbeschreibung hinter 25 Wörtern Hilfe (früher 60) und hat keine eigene Ansage (`aria-errormessage`/`alert`); sie wird nur durch das Neufokussieren hörbar.
- Die drei Majors vom letzten Mal (heute vorgeschlagen und mit Tab+Enter gespeichert, stummer Fehler nach Enter, 60 Wörter vor dem Fehler) sind behoben bzw. stark abgeschwächt.
