<!-- Persona run I3 on d4667dc; screenshots stayed in the session's scratchpad -->

# Persona-Test I3: Anna, 29 – Vergangenes Vertragsende eintragen, Abrechnung 2025 richtigstellen

**Persona:** Anna, 29, vermietet zum ersten Mal, öffnet Dwello nach Monaten wieder, ordnungsliebend. Fenster 1024 × 768 (Kit mit `viewport: 'desktop'` geöffnet, danach mit `page.setViewportSize` auf 1024 × 768 gesetzt). Heute: Montag, 12.10.2026.
**Aufgabe:** «Ein Mieter im Musterhaus Zentrum hat mir gesagt, er sei schon Ende März 2025 ausgezogen. Tragen Sie das Vertragsende auf den 31.03.2025 ein, so dass seine Abrechnung 2025 stimmt.»
**Gewählter Vertrag:** Pierre Dubois, Wohnung 2.01, laufend seit 01.01.2023, unbefristet, Nebenkostenabrechnung 2025 NK-11111111-2025-0003 als Entwurf (365 Mietstage, Nachzahlung CHF 142.40).

**Geänderte Daten (bleiben so stehen):**

- Mietvertrag Pierre Dubois (Wohnung 2.01, Musterhaus Zentrum): Vertragsende 31.03.2025 über «Beenden» eingetragen, Status jetzt «Beendet». Wohnung 2.01 ist jetzt «Leer».
- Nebenkostenabrechnung NK-11111111-2025-0003 (Entwurf) gelöscht.
- Neu erstellt über «Abrechnungen erstellen» (Periode 01.01.–31.12.2025, nur Musterhaus Zentrum, Heizprofil «Heizung + Warmwasser» wie vorgeschlagen, Verwaltungspauschale 3 % wie vorgeschlagen, Kästchen «Die Abrechnungen trotzdem erstellen»): **NK-11111111-2025-0005**, Entwurf, 90 Mietstage, Akonto CHF 810.00, Nachzahlung CHF 185.00. Die übrigen Abrechnungen 2025 im Musterhaus (Hans Müller versendet, Anna Schmidt und Maria Rossi Entwurf) blieben unverändert.
- Der Assistent «Abrechnungen erstellen» hat seinen Zwischenstand gespeichert («Entwurf gespeichert, 08:18/08:19»); andere Testende sehen ihn eventuell beim nächsten Öffnen des Assistenten.

## Aufgabe geschafft

**Ja.** Pierres Vertrag endet am 31.03.2025, und seine Abrechnung 2025 rechnet 90 Mietstage statt 365. Der Weg ist jetzt sicher: Weder «Beenden» noch «Bearbeiten» lassen das falsche Vertragsende durch, und beide sagen mir mit derselben Meldung, welchen Entwurf ich zuerst löschen soll. Hängen geblieben bin ich nur kurz: beim Suchen des Entwurfs (kein Link in der Meldung), beim abgeschnittenen Dialog und bei der Frage, welches Heizprofil und welche Pauschale die alte Abrechnung hatte.

## Aufwand

- Vertrag finden: Gebäude → Musterhaus Zentrum → Wohnung 2.01 → Mietvertrag von Pierre Dubois. 4 Klicks. Vorher in «Nebenkostenabrechnungen» nachgesehen, wer einen Entwurf 2025 hat: 1 Klick, Liste lesen.
- Erster Versuch «Beenden»: Datum tippen, Kästchen, «Mietvertrag beenden» → Ablehnung. 4 Aktionen, dazu Scrollen im Dialog, um die Meldung ganz zu lesen.
- Zweiter Versuch «Bearbeiten»: «Befristet», Datum, Kästchen, «Änderungen speichern» → gleiche Ablehnung. 5 Aktionen.
- Entwurf löschen: «Nebenkostenabrechnungen» → Abrechnungsnummer abtippen → «Suchen» → öffnen → nach unten zu «Weitere Aktionen» → «Abrechnung löschen» → bestätigen. 7 Aktionen.
- Vertrag beenden: 5 Aktionen, Erfolgsmeldung «Der Mietvertrag von Pierre Dubois endete am 31.03.2025».
- Abrechnung neu erstellen: Assistent mit 5 Schritten, 1 Gebäude wählen, Kästchen «trotzdem erstellen», «Entwürfe erstellen». Etwa 8 Klicks.
- Gesamt rund 35 Aktionen und etwa 10 Minuten, davon gut 3 Minuten Nachdenken über Heizprofil und Verwaltungspauschale.

## Laut gedacht

1. *Gebäude → Musterhaus Zentrum.* Sechs Wohnungen, vier vermietet. Welcher Mieter war es noch? Pierre, Wohnung 2.01. Ich klicke die Wohnung an: «Aktueller Mieter Pierre Dubois, Mietvertrag seit 01.01.2023» und unten «Mietverträge der Wohnung → Mietvertrag von Pierre Dubois, seit 01.01.2023, unbefristet». Toll, so finde ich den Vertrag direkt über die Wohnung.
2. *Hat er eine Abrechnung 2025?* Im Vertrag gibt es «Dazu gehört → Nebenkostenabrechnungen». Ich klicke: wieder alle 17 Abrechnungen, nicht nur seine. Ich lese die Liste: Pierre Dubois, NK-11111111-2025-0003, 01.01.2025 – 31.12.2025, Entwurf.
3. *Vertrag → «Beenden».* Das Datumsfeld ist leer, gut. Ich tippe 31.03.2025, darunter «Montag, 31. März 2025». Dann das Kästchen: «Der Mietvertrag endete am 31.03.2025.» Das ist jetzt genau mein Datum, nicht mehr der 01.04. wie letztes Mal. Viel besser. Darunter: «Das ist über ein Jahr her. Prüfen Sie das Jahr.» Kurz erschrecke ich, aber ja, 2025 stimmt. Ich kreuze an. Der Dialog passt gerade noch ins Fenster, die Knöpfe sind unten sichtbar.
4. *«Mietvertrag beenden».* Unten erscheint eine rote Box «Das hat nicht geklappt», aber ich sehe nur die erste Zeile, der Rest und die Knöpfe sind unter dem Fensterrand. Ich muss im Dialog scrollen. Dann: «Der Entwurf NK-11111111-2025-0003 enthält schon Mietstage nach diesem Tag. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.» Das verstehe ich: Die Abrechnung rechnet ihn noch das ganze Jahr. Und die Meldung sagt mir den Weg, nicht mehr ein falsches Datum. Nur: Wo ist dieser Entwurf? Die Nummer ist kein Link. Ich schreibe sie mir auf.
5. *Plan B: «Bearbeiten».* Mal sehen, ob es dort einfacher geht. «Befristet», 31.03.2025: Dasselbe Kästchen erscheint. Ohne Kästchen speichern: «Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende.» Mit Kästchen: rote Box ganz unten «Der Mietvertrag wurde nicht gespeichert» und derselbe Text wie im Dialog. Gut, Dwello ist konsequent, ich kann es nicht aus Versehen falsch machen. Die Seite springt zur Meldung, ich sehe sie sofort.
   Kleine Irritation: Muss ich «Befristet» wählen, wenn der Mieter einfach früher ausgezogen ist? Der Vertrag war doch unbefristet. «Beenden» passt besser, ich bleibe dabei.
6. *Entwurf suchen.* Seitenleiste «Nebenkostenabrechnungen», ich tippe die Nummer ins Suchfeld, «Suchen»: genau eine Abrechnung. Öffnen. Oben gibt es nur «PDF herunterladen» und «Als versendet markieren». Löschen finde ich erst ganz unten unter «Weitere Aktionen». Unten steht «365 Mietstage», ja, das ist falsch.
7. *«Abrechnung löschen».* Dialog: «Die Abrechnung NK-11111111-2025-0003 von Pierre Dubois wird gelöscht. Das lässt sich nicht rückgängig machen.» Ich bin etwas nervös, ich soll sie ja neu erstellen, aber der Dialog sagt nicht, dass das geht. Ich lösche. Meldung «Abrechnung NK-11111111-2025-0003 gelöscht», ich lande in der Liste.
8. *Zurück zum Vertrag, «Beenden».* Ich muss den Vertrag wieder suchen (Mietverträge oder über die Wohnung) und alles noch einmal eintippen. Jetzt klappt es: «Der Mietvertrag von Pierre Dubois endete am 31.03.2025». Status «Beendet». Aber: Erinnert mich jemand daran, dass ich die Abrechnung jetzt neu erstellen muss? Nein. Hätte ich mir das nicht aus der Fehlermeldung gemerkt, hätte Pierre jetzt gar keine Abrechnung 2025.
9. *«Abrechnungen erstellen».* Periode 01.01.2025 – 31.12.2025 ist vorgeschlagen, gut. Gebäude: Ich wähle nur Musterhaus Zentrum. Ich fürchte kurz, dass jetzt alle Mieter im Haus neue Abrechnungen bekommen.
10. *Schritt 3: Heizprofil und Verwaltungspauschale.* Ein langer Text über Zähler, Heizkostenverteiler und Mieterwechsel. «Wählen Sie das Profil, das Ihre Mietverträge vorsehen.» Keine Ahnung. Welches hatte die alte Abrechnung? Die habe ich gerade gelöscht, und auf ihr stand es auch nicht. Ich lasse den Vorschlag «Heizung + Warmwasser». Bei der Pauschale steht 3 %, die alte Abrechnung hatte 3 %, das habe ich zum Glück gesehen.
11. *Schritt 4: Vorschau.* «Anzahl Abrechnungen 1», nur Pierre Dubois. Erleichterung. Gelber Hinweis: «Es gibt schon Abrechnungen … Mietverträge mit einer Abrechnung in dieser Periode erhalten keine neue.» Genau das will ich. Aber ich muss «Die Abrechnungen trotzdem erstellen» ankreuzen. «Trotzdem» klingt, als würde ich etwas falsch machen. Pierre: Kosten CHF 995.01, Nachzahlung CHF 185.00, «Kosten CHF 185.01 (23 %) über dem Akonto.» Hm, für drei Monate mehr Nachzahlung als vorher fürs ganze Jahr? Ach, Januar bis März wird viel geheizt. Das erklärt mir aber niemand.
12. *Schritt 5: «Entwürfe erstellen».* «1 Nebenkostenabrechnung ist als Entwurf erstellt.» Ich öffne sie: NK-11111111-2025-0005, 90 Mietstage, Akonto CHF 810.00 (3 × 270). Stimmt! Komisch nur: Oben steht weiterhin «Abrechnungsperiode 01.01.2025 – 31.12.2025», obwohl Pierre nur bis März da war; und die Nummer ist jetzt 0005 statt 0003. Ist das schlimm? Und die Tabelle ist rechts abgeschnitten, die Spalte «Betrag» sehe ich nur halb.
13. *Wohnung 2.01.* «Leer», «Mietvertrag von Pierre Dubois 01.01.2023 – 31.03.2025, Beendet». Alles passt zusammen.

**Versteht Anna die Ablehnung?** Ja, Grund und nächster Schritt sind klar. **Kann sie ihr folgen?** Ja, aber sie muss den Entwurf selbst suchen, sich die Reihenfolge merken (löschen, beenden, neu erstellen) und im Assistenten Einstellungen erraten, die sie nicht kennt.

## Befunde

### Blocker

Keine.

### Major

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| M1 | Dialog «Mietvertrag beenden?» und Formular «Mietvertrag bearbeiten», Ablehnung | Die Meldung nennt den Entwurf NK-11111111-2025-0003, aber ohne Link. Anna muss die Nummer abschreiben, in «Nebenkostenabrechnungen» suchen, die Abrechnung öffnen und «Abrechnung löschen» ganz unten unter «Weitere Aktionen» finden. Danach muss sie den Vertrag wieder suchen und alles neu eintippen. | Nummer als Link auf den Entwurf («Entwurf NK-… öffnen»), besser direkt ein Knopf «Entwurf löschen und Mietvertrag beenden», der beides in einem Schritt tut und danach auf «Abrechnungen erstellen» (Periode und Gebäude vorbelegt) führt. |
| M2 | Nach dem Beenden (Erfolgsmeldung, Vertragsseite) | Nach «Der Mietvertrag von Pierre Dubois endete am 31.03.2025» erinnert nichts daran, dass seine Abrechnung 2025 jetzt fehlt. Wer die Fehlermeldung von vorher vergessen hat, hat danach keine Abrechnung für Pierre. | Wenn für die Periode des Vertragsendes keine Abrechnung mehr existiert, auf der Vertragsseite (und in der Aufgabenliste der Übersicht) einen Hinweis «Für 2025 fehlt die Nebenkostenabrechnung von Pierre Dubois. Abrechnung erstellen» zeigen. |
| M3 | Assistent «Abrechnungen erstellen», Schritt 3 | Beim Neu-Erstellen einer einzelnen Abrechnung muss Anna Heizprofil und Verwaltungspauschale wieder wählen. Welche die gelöschte Abrechnung hatte, stand dort nicht (nur «3 % der Zwischensumme», kein Heizprofil). Sie nimmt den Vorschlag und hofft. | Heizprofil auf der Abrechnung anzeigen; im Assistenten vorschlagen, was die übrigen Abrechnungen derselben Periode und desselben Gebäudes verwenden («Wie die anderen Abrechnungen 2025 im Musterhaus Zentrum: Heizung + Warmwasser, 3 %»). |

### Minor

| # | Bildschirm | Beobachtung | Vorschlag |
|---|---|---|---|
| m1 | Dialog «Mietvertrag beenden?» bei 1024 × 768 | Ohne Fehlermeldung passt der Dialog knapp (unterer Rand bei 752 px). Mit der Ablehnung ist er 909 px hoch: Von der roten Box ist nur die Überschrift zu sehen, der Text und die Knöpfe liegen unter dem Fensterrand, Anna muss im Dialog scrollen. Unverändert gegenüber I2. | Meldung oben im Dialog oder direkt unter dem Datumsfeld zeigen und dorthin scrollen; den Absatz zur Kündigungsfrist einklappen («Kündigungsfrist prüfen» als aufklappbare Hilfe). |
| m2 | Mietvertrag → «Dazu gehört → Nebenkostenabrechnungen» | `/statements?contract=…` zeigt weiter alle 17 Abrechnungen, nicht die des Vertrags (wie I2 m3). | Liste nach Vertrag filtern, Überschrift «Abrechnungen von Pierre Dubois». |
| m3 | Dialog «Abrechnung löschen» (Entwurf) | «Das lässt sich nicht rückgängig machen.» macht Anna nervös, obwohl der Entwurf jederzeit neu erstellt werden kann. | Bei Entwürfen: «Sie können die Abrechnung danach unter «Abrechnungen erstellen» neu erstellen.» |
| m4 | Assistent, Schritt 4 «Vorschau» | Kästchen «Die Abrechnungen trotzdem erstellen» klingt nach Fehler, obwohl Anna genau das Fehlende ergänzen will. Die Vorschau sagt zwar «Anzahl Abrechnungen 1», aber nicht, für wen bei bestehenden Abrechnungen. | Text: «Nur fehlende Abrechnungen erstellen (1: Pierre Dubois)». |
| m5 | Assistent, Schritt 4, Pierre Dubois | Nachzahlung für 3 Monate (CHF 185.00) ist höher als vorher für 12 Monate (CHF 142.40) – Warnung «23 % über dem Akonto» ohne Erklärung. | Hinweis bei kurzen Mietdauern: «Januar bis März fallen nach dem Heizprofil 37 % der Heizkosten an.» |
| m6 | Abrechnung NK-…-2025-0005 | Kopf zeigt «Abrechnungsperiode 01.01.2025 – 31.12.2025», obwohl Pierre nur bis 31.03.2025 Mieter war; die 90 Mietstage stehen weit unten. Neue Nummer 0005 statt 0003, Anna fragt sich, ob die Lücke ein Problem ist. | Im Kopf zusätzlich «Mietdauer 01.01.2025 – 31.03.2025 (90 Mietstage)». Lücke in den Nummern in der Hilfe kurz erklären. |
| m7 | Formular «Mietvertrag bearbeiten» | Um ein früheres Vertragsende einzutragen, muss Anna «Befristet» wählen, obwohl der Vertrag unbefristet war und gekündigt wurde. | Unter «Vertragsdauer» Hinweis: «Wurde der Mietvertrag gekündigt? Nutzen Sie «Beenden» auf der Vertragsseite.» |
| m8 | Abrechnungsdetail bei 1024 px | Tabelle «Abrechnungspositionen» rechts abgeschnitten, Spalte «Betrag» nur halb sichtbar. Seitentitel «Nebenkostenabrechnungen» bricht mitten im Wort um («Nebenkostenabrechnu / ngen»). | Tabelle unter 1100 px als Liste pro Position darstellen; Titel mit `hyphens: auto` bzw. Silbentrennung. |
| m9 | Kästchen bei vergangenem Vertragsende | «Das ist über ein Jahr her. Prüfen Sie das Jahr.» erschreckt, wenn das Jahr stimmt. | «Das ist über ein Jahr her. Stimmt das Jahr 2025?» |

## Was gut ist

- **I2-Blocker behoben:** «Bearbeiten» prüft das Vertragsende jetzt wie «Beenden»: dasselbe Kästchen, dieselbe Aufforderung ohne Kästchen und dieselbe Ablehnung wegen des Entwurfs. Die Seite springt zur Fehlermeldung (`role="alert"`, Fokus auf der Box).
- Die Ablehnung nennt den betroffenen Entwurf mit Nummer und sagt, was zu tun ist («Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu»), statt ein falsches Datum vorzuschlagen.
- Das Kästchen sagt jetzt «Der Mietvertrag endete am 31.03.2025.», also das Datum, das Anna eingetippt hat.
- Die Suche in «Nebenkostenabrechnungen» findet die Abrechnungsnummer exakt.
- Auf der Wohnungsseite gibt es «Mietverträge der Wohnung» mit Zeitraum und Status; der Vertrag ist direkt über die Wohnung erreichbar.
- Der Assistent erstellt nur die fehlende Abrechnung und rührt die anderen (auch die versendete von Hans Müller) nicht an; die Vorschau zeigt «Anzahl Abrechnungen 1» und den Namen.
- Die neue Abrechnung stimmt: 90 Mietstage, Akonto 3 × CHF 270.00.
- Erfolgsmeldungen nach Löschen und Beenden sind klar und nennen Nummer bzw. Datum.

## Vergleich zu I2

| I2 | Jetzt (I3) |
|---|---|
| B1: «Bearbeiten» speicherte 31.03.2025 ohne Kästchen und ohne Prüfung | **Behoben.** Kästchen und Ablehnung wie im Dialog. |
| M1: Ablehnung schlug «31.12.2025 oder später» vor, kein Weg, keine Nummer | **Weitgehend behoben.** Nummer und Weg stehen in der Meldung; es fehlt nur der Link (neu M1). |
| m4: Kästchen sagte «seit dem 01.04.2025 beendet» | **Behoben.** «Der Mietvertrag endete am 31.03.2025.» |
| m5: Dialog bei 768 px zu hoch | **Unverändert** (m1): ohne Fehler passt er knapp, mit Ablehnung nicht. |
| m3: Link «Nebenkostenabrechnungen» im Vertrag filtert nicht | **Unverändert** (m2). |
| Aufgabe 2 nur über den falschen Weg «geschafft», Vertrag und Abrechnung widersprachen sich | Aufgabe **geschafft**, Vertrag und Abrechnung stimmen überein. |

Neu sichtbar geworden, weil Anna diesmal bis zum Ende kam: die fehlende Erinnerung nach dem Beenden (M2) und die Rätselei um Heizprofil und Pauschale beim Neu-Erstellen (M3). M2 und M3 aus I2 (doppelt erfasste Verträge, Kevin Fischer) wurden in dieser Aufgabe nicht geprüft.
