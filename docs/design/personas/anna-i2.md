<!-- Persona run I2 on 7324c57; screenshots stayed in the session's scratchpad -->

# Persona-Test I2: Anna, 29 – Falsche Mietverträge aufräumen, vergangenes Vertragsende eintragen

**Persona:** Anna, 29, vermietet zum ersten Mal, öffnet Dwello nach Monaten wieder, ordnungsliebend, will falsche Einträge aufräumen. Fenster 1024 × 768 (Kit mit `viewport: 'desktop'` geöffnet, danach mit `page.setViewportSize` auf 1024 × 768 gesetzt). Heute: Montag, 12.10.2026.
**Aufgabe 1:** «Ich glaube, ich habe im Musterhaus Zentrum einen Mietvertrag doppelt oder falsch erfasst. Räumen Sie auf: Löschen Sie, was falsch ist.»
**Aufgabe 2:** «Ein Mieter hat mir gesagt, er sei schon im Frühling 2025 ausgezogen. Tragen Sie das Vertragsende auf den 31.03.2025 ein.»
**Gewählte Verträge:** Kevin Fischer, Wohnung 1.01 (beendet 01.06.2018 – 28.02.2021) und Hans Müller, Wohnung 1.01 (laufend) zum Löschen; Pierre Dubois, Wohnung 2.01 (laufend seit 01.01.2023, unbefristet, Nebenkostenabrechnung 2025 als Entwurf) fürs Vertragsende. Im Musterhaus Zentrum gab es keinen künftigen Mietvertrag; für den Test habe ich zweimal einen Mietvertrag für Sarah Meier in Wohnung 3.02 erfasst (einmal ab 01.01.2027, einmal ab 01.09.2026) und beide wieder gelöscht. Pierres Vertrag habe ich nach dem Test wieder auf «Unbefristet» gestellt (siehe Blocker B1).

**Build:** Die neuen Regeln sind sichtbar: Der Dialog «Mietvertrag beenden?» zeigt das Kästchen «Der Mietvertrag ist seit dem … beendet.» und die Ablehnung wegen der Nebenkostenabrechnung; begonnene Mietverträge lassen sich nicht löschen, künftige schon. **Nicht** umgesetzt ist das im Formular «Mietvertrag bearbeiten» (B1).

## Aufgabe geschafft

- **Aufgabe 1: Teilweise.** Den künftigen Mietvertrag konnte ich löschen. Bei den begonnenen Verträgen verstehe ich, *warum* ich nicht löschen darf. Aber was ich mit einem wirklich doppelt erfassten, begonnenen Vertrag tun soll, sagt mir Dwello nicht: «Bearbeiten» korrigiert Angaben, macht aber aus zwei Verträgen keinen. Und für den Vertrag, den ich für doppelt hielt (Kevin Fischer zweimal), sagt mir niemand, dass er gar nicht doppelt ist.
- **Aufgabe 2: Ja, aber nur über den falschen Weg.** Über «Beenden» verweigert Dwello den 31.03.2025 mit einer verständlichen Meldung, nur weiss ich danach nicht, was ich tun soll. Über «Bearbeiten» → «Befristet» → 31.03.2025 wurde das Vertragsende **ohne Kästchen und ohne Prüfung** gespeichert, obwohl die Abrechnung 2025 noch Mietstage bis 31.12.2025 enthält.

## Aufwand

- Aufgabe 1: Gebäude → Musterhaus Zentrum (keine Mietverträge zu sehen) → Mietverträge → Filter «Musterhaus Zentrum» → «Suchen» → Vertrag öffnen → «Löschen» → Dialog lesen → «Abbrechen» → «Bearbeiten». Etwa 8 Klicks und 4 Minuten pro Vertrag, die meiste Zeit fürs Nachdenken, ob Kevin Fischer doppelt ist.
- Künftigen Vertrag löschen: 3 Klicks (öffnen → «Löschen» → «Mietvertrag löschen»), unter 30 Sekunden.
- Aufgabe 2: 6 Klicks bis zur Ablehnung (Vertrag öffnen → «Beenden» → Datum tippen → Kästchen → «Mietvertrag beenden», davor einmal ohne Kästchen). Dazu ca. 3 Minuten, um herauszufinden, welche Mieter eine Abrechnung 2025 haben: Der Knopf «Nebenkostenabrechnungen» im Vertrag zeigt alle 17 Abrechnungen statt nur die des Vertrags.

## Laut gedacht

1. *Gebäude «Musterhaus Zentrum».* Sechs Wohnungen, vier vermietet. Aber wo sind die Mietverträge? Hier sehe ich keine. Ich gehe links auf «Mietverträge».
2. *Mietverträge.* Elf Stück, gemischt aus allen Gebäuden. Die Filter «Alle Geb…» und «Alle Mietv…» sind abgeschnitten, ich muss raten. Ich wähle «Musterhaus Zentrum», «Suchen»: fünf Verträge.
3. *Doppelt?* Kevin Fischer steht zweimal in der Gesamtliste, einmal Wohnung 1.01 im Musterhaus (Beendet, 01.06.2018 – 28.02.2021), einmal OG1 Alpenblick. Und in Wohnung 1.01 gibt es zwei Verträge: Kevin Fischer und Hans Müller. Ist das der doppelte? Ah, die Daten überschneiden sich nicht, Kevin ist wohl 2021 umgezogen. Aber sicher bin ich nicht, Dwello sagt es mir nicht.
4. *Kevin Fischer, Wohnung 1.01 → «Löschen».* Dialog: «Ein Mietvertrag, der begonnen hat, kann nicht gelöscht werden: Die Nebenkostenabrechnung braucht seine Mietstage. Ist er falsch erfasst, korrigieren Sie ihn unter «Bearbeiten».» Klar und freundlich. Der rote Knopf «Mietvertrag löschen» ist blass, also gesperrt. Warum zeigt man ihn dann überhaupt? Und «Bearbeiten» ist im Dialog kein Knopf: ich muss «Abbrechen» drücken und oben «Bearbeiten» suchen. Ging, weil es direkt dahinter liegt.
   Kleine Frage: Kevin ist 2021 ausgezogen, welche Abrechnung braucht denn seine Mietstage? Ich sehe für ihn keine im Musterhaus.
5. *Hans Müller (laufend) → «Löschen».* Gleicher Text. Gut, den will ich ja eigentlich auch nicht löschen.
6. *«Bearbeiten».* Ich kann Mieter, Wohnung, Beginn, Dauer und Miete ändern. Wenn ich aber wirklich *zwei* Verträge für dieselbe Person erfasst hätte, was korrigiere ich dann? Ich kann den zweiten ja nicht verschwinden lassen. Ich versuche es (Testvertrag Sarah Meier in 3.02 ab 01.09.2026, also «Laufend»): Löschen geht nicht. Erst als ich unter «Bearbeiten» den Vertragsbeginn auf 01.01.2027 schiebe, wird er «Künftig», und dann kann ich ihn löschen. Das ist ein Trick, auf den ich ohne Zufall nicht gekommen wäre, und es fühlt sich an, als würde ich Dwello austricksen.
7. *Künftiger Vertrag (Sarah Meier ab 01.01.2027) → «Löschen».* «Der Mietvertrag von Sarah Meier hat noch nicht begonnen und wird endgültig gelöscht.» Klar. Gelöscht, Meldung «Mietvertrag von Sarah Meier gelöscht» unten rechts. Perfekt.
8. *Aufgabe 2: wer hat eine Abrechnung 2025?* Im Vertrag von Pierre Dubois klicke ich «Dazu gehört → Nebenkostenabrechnungen». Es kommen alle 17 Abrechnungen, auch Seepark und Alpenblick. Ich suche Pierre von Hand: NK-11111111-2025-0003, 01.01.2025 – 31.12.2025, Entwurf. Gut, alle vier laufenden Verträge im Musterhaus haben eine Abrechnung 2025.
9. *Pierre Dubois → «Beenden».* Das Datumsfeld ist leer (gut, letztes Mal war heute vorbelegt). Ich tippe 31.03.2025, darunter «Montag, 31. März 2025». Dann erscheint ein Kästchen: «Der Mietvertrag ist seit dem 01.04.2025 beendet.» Moment, ich habe doch 31.03. geschrieben? Ach so, ab dem 1. April ist er weg. Der Satz darunter («Ab diesem Tag gilt die Wohnung als leer … Das Akonto des Mieters zählt nur bis zum Vertragsende.») erklärt es. Gut, dass Dwello merkt, dass das Datum in der Vergangenheit liegt.
10. *Ohne Kästchen auf «Mietvertrag beenden».* Rote Zeile: «Bitte bestätigen Sie, dass der Mietvertrag seit dem 01.04.2025 beendet ist.» Verstanden, ich kreuze an.
11. *Mit Kästchen.* Rote Box «Das hat nicht geklappt – Die Nebenkostenabrechnung bis 31.12.2025 enthält schon Mietstage nach diesem Tag. Wählen Sie den 31.12.2025 oder einen späteren Tag.» Ich verstehe den Grund: Die Abrechnung 2025 rechnet Pierre das ganze Jahr. Aber was soll ich jetzt tun? Den 31.12.2025 eintragen? Das stimmt doch nicht, er ist im März ausgezogen! Dann stimmt auch seine Abrechnung nicht, er zahlt Nebenkosten für neun Monate, in denen er nicht mehr dort war. Welche Abrechnung genau? Ein Link fehlt. Dass ich den Entwurf der Abrechnung löschen und nach dem Vertragsende neu erstellen könnte (unter der Abrechnung gibt es «Abrechnung löschen»), sagt mir die Meldung nicht. Ich bleibe ratlos. Bei 768 px Höhe muss ich im Dialog scrollen, die Meldung steht unten, der Titel rutscht weg.
12. *Plan B: «Bearbeiten».* Der Löschdialog hat mir ja «Bearbeiten» empfohlen. Ich stelle «Befristet» ein, tippe 31.03.2025, «Änderungen speichern». **Gespeichert.** Kein Kästchen, keine Meldung wegen der Abrechnung, kein Hinweis. Der Vertrag zeigt «Beendet, 01.01.2023 – 31.03.2025». Die Abrechnung 2025 steht unverändert als Entwurf mit dem ganzen Jahr da. Jetzt widersprechen sich Vertrag und Abrechnung, und ich merke es nicht. (Ich habe den Vertrag danach wieder auf «Unbefristet» gestellt.)

**Versteht Anna, warum ein begonnener Vertrag nicht gelöscht werden kann?** Ja, der Satz mit den Mietstagen ist klar. **Findet sie «Bearbeiten»?** Ja, aber nur ausserhalb des Dialogs, und «Bearbeiten» hilft nur bei falschen Angaben, nicht bei einem doppelten Vertrag.
**Versteht Anna die Ablehnung in Aufgabe 2?** Den Grund ja, den nächsten Schritt nein: Die Meldung schlägt ein falsches Datum vor statt den richtigen Weg (Abrechnung zuerst ändern).

## Befunde

### Blocker

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| B1 | Mietvertrag bearbeiten (`/contracts/{id}/edit`) | «Befristet» + Vertragsende 31.03.2025 wird ohne Kästchen und ohne Prüfung gegen die Nebenkostenabrechnung 2025 gespeichert (Pierre Dubois, Abrechnung NK-11111111-2025-0003 bis 31.12.2025). Die neuen Regeln gelten nur im Dialog «Beenden». Gerade dieser Weg wird im Löschdialog empfohlen. Ergebnis: Vertrag «Beendet 31.03.2025», Abrechnung rechnet weiter das ganze Jahr. | Gleiche Regeln im Bearbeiten-Formular: Kästchen «Der Mietvertrag ist seit dem … beendet.» bei einem vergangenen Vertragsende und dieselbe Ablehnung wegen Abrechnungen; am besten serverseitig für jede Änderung des Vertragsendes. Dasselbe für eine Verschiebung des Vertragsbeginns hinter eine bestehende Abrechnung. |

### Major

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| M1 | Dialog «Mietvertrag beenden?», Ablehnung | «Wählen Sie den 31.12.2025 oder einen späteren Tag.» schlägt ein Datum vor, das nicht stimmt, wenn der Mieter wirklich früher ausgezogen ist. Der richtige Weg (Abrechnung prüfen, Entwurf löschen und neu erstellen) und welche Abrechnung es ist, fehlen. | Meldung ergänzen: «Ist der Mieter wirklich früher ausgezogen, löschen Sie zuerst die Nebenkostenabrechnung NK-…-2025-0003 (Entwurf) und erstellen Sie sie nach dem Vertragsende neu.» mit Link auf die Abrechnung. Bei versendeter Abrechnung: Hinweis auf Korrektur der Abrechnung. |
| M2 | Löschdialog bei begonnenem Vertrag | Für einen wirklich doppelt erfassten, begonnenen Vertrag gibt es keinen Weg. «Bearbeiten» korrigiert Angaben, entfernt aber keine Doppelung. Der einzige Ausweg ist ein Trick (Vertragsbeginn in die Zukunft schieben, dann löschen), der die Regel aushebelt. | Entweder Löschen erlauben, solange keine Nebenkostenabrechnung den Vertrag enthält (mit Bestätigung «Dieser Mietvertrag ist doppelt oder irrtümlich erfasst»), oder im Dialog den Fall «doppelt erfasst» ausdrücklich erklären. Den Trick über den Vertragsbeginn serverseitig unterbinden (siehe B1). |
| M3 | Mietverträge-Liste, Gebäude | Anna hält Kevin Fischer (zweimal in der Liste, zweimal in Wohnung 1.01 neben Hans Müller) für doppelt. Nichts zeigt, dass es ein früherer, korrekt beendeter Vertrag ist. | In der Vertragsliste beendete Verträge gruppieren oder mit «früherer Mietvertrag» kennzeichnen; auf der Gebäudeseite pro Wohnung die Verträge mit Zeitraum zeigen. Hilfetext bei «Beendet»: «Beendete Mietverträge bleiben gespeichert. Sie sind kein Fehler.» |

### Minor

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| m1 | Löschdialog bei begonnenem Vertrag | Gesperrter roter Knopf «Mietvertrag löschen» ohne Funktion; «Bearbeiten» ist nur Text, kein Knopf. | Titel «Mietvertrag kann nicht gelöscht werden», Knöpfe «Schliessen» und «Mietvertrag bearbeiten» (Link). |
| m2 | Löschdialog, Kevin Fischer 2018–2021 | «Die Nebenkostenabrechnung braucht seine Mietstage», obwohl Anna keine Abrechnung für diesen Vertrag sieht. | Text allgemeiner: «Abrechnungen dieser Jahre brauchen seine Mietstage.» oder die betroffenen Jahre nennen. |
| m3 | Mietvertrag → «Dazu gehört → Nebenkostenabrechnungen» | Link `/statements?contract=…` zeigt alle 17 Abrechnungen, der Filter wird nicht angewendet. | Liste nach Vertrag filtern und «Abrechnungen von Pierre Dubois» als Überschrift zeigen. |
| m4 | Dialog «Mietvertrag beenden?», Kästchen | Anna tippt 31.03.2025, das Kästchen sagt «seit dem 01.04.2025 beendet». Kurz verwirrend. | «Der Mietvertrag endete am 31.03.2025. Seit dem 01.04.2025 ist die Wohnung leer.» |
| m5 | Dialog «Mietvertrag beenden?» bei 1024 × 768 | Mit Kästchen und Fehlermeldung ist der Dialog höher als das Fenster; Titel rutscht weg, die Meldung steht unten. | Fehlermeldung direkt unter das Datumsfeld setzen oder den Hinweis zur Kündigungsfrist einklappen. |
| m6 | Mietverträge-Liste bei 1024 px | Filter-Auswahlen abgeschnitten («Alle Geb…», «Alle Mietv…»), Namen und Wohnungen umbrechen über 4 Zeilen. | Filter umbrechen lassen (Labels über volle Breite) oder Suche in eigene Zeile. |
| m7 | Assistent «Neuer Mietvertrag», Schritt 3 | Vergangener Vertragsbeginn: Bestätigung durch nochmaliges «Weiter», Text steht dreimal auf dem Bildschirm. Im Beenden-Dialog dagegen ein Kästchen. Zwei Muster für dieselbe Frage. | Auch hier das Kästchen «Der Mietvertrag läuft seit dem …» verwenden, Text einmal. |
| m8 | Mietvertrag bearbeiten | Nach «Änderungen speichern» keine sichtbare Bestätigung (beim Löschen gibt es eine). | Meldung «Mietvertrag von … gespeichert». |

## Was gut ist

- Begonnene Verträge lassen sich nicht löschen, und der Grund steht in einem Satz, den Anna versteht («Die Nebenkostenabrechnung braucht seine Mietstage»). Der frühere Satz «Danach können Sie ihn löschen» ist weg.
- Künftige Verträge löschen geht schnell und eindeutig: «hat noch nicht begonnen und wird endgültig gelöscht», danach Erfolgsmeldung.
- Der Beenden-Dialog ist nicht mehr mit heute vorbelegt; das Datum wird als Wochentag bestätigt.
- Das neue Kästchen bei vergangenem Vertragsende fängt ein Versehen ab und erklärt die Folgen (Wohnung leer, Akonto nur bis Vertragsende); ohne Kästchen kommt eine klare Aufforderung.
- Die Ablehnung wegen der Abrechnung erklärt den Grund verständlich, ist als Fehlerbox mit Symbol und Text (nicht nur Farbe) gestaltet und wird als `role="alert"` vorgelesen.
- Der Hilfetext zum Vertragsende («Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht») und der Hinweis zur Kündigungsfrist helfen einer Laiin.
