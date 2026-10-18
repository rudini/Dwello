# Helga – Issue #222: Hinweise zu Akontorechnungen

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (einzelne Bildschirme auch bei 200 %), Maus.
App: Persona-Stack auf http://localhost:3300, Demodaten, KI-Stellvertreter.
Gespeichert im Gebäude «Seepark Residenz»: eine Rechnung «Werke Schlussrechnung 2025» (Allgemeinstrom, CHF 1'250.00).
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/helga-222/`

Bewertet werden nur die beiden Hinweise und der Weg dorthin.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnungen hochladen (Dialog), Karte der Datei | «… löschen oder entfernen Sie sie, sonst zählen sie doppelt.» steht direkt über dem roten Knopf «Datei entfernen» der Schlussrechnung selbst. Der Hinweis sagt nicht, wo ich eine schon erfasste Akontorechnung lösche (Rechnung öffnen, «Rechnung löschen»). Ich hätte beinahe die Schlussrechnung entfernt. |
| P-2 | Minor | Rechnungen hochladen (Dialog) | Das Wort «Akontorechnungen» wird nicht erklärt, und ich erfahre nicht, woran ich sie erkenne. Die Suche nach «Akonto» bei Seepark Residenz findet «Keine Rechnungen gefunden». Ob «ewl … Allgemeinstrom H1 2025 / H2 2025» solche sind, weiss ich nicht. |
| P-3 | Minor | Rechnungen hochladen (Dialog) | «Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab.»: Ich weiss nicht, ob «abgerechnet» «bezahlt» heisst oder «in einer Nebenkostenabrechnung enthalten», und wie ich das prüfe. Auch steht nicht, wo ich abziehe (im Feld «Betrag», das erst unter «Angaben prüfen» sichtbar wird). |
| P-4 | Minor | Rechnung (Detail), «Hinweise zum Beleg» | «Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen.» Nach dem Doppelpunkt klingt das, als stelle Dwello fest, dass schon alles stimmt. Erst beim zweiten Lesen merke ich, dass ich das selbst prüfen soll. Inhaltlich passt es zum ersten Hinweis. |
| P-5 | Nit | beide Hinweise | Im ersten Hinweis steht «Auf der Rechnung», im zweiten «Auf dem Beleg». Ich habe kurz überlegt, ob das zwei verschiedene Dinge sind. |

## Beobachtungen

- Auf der Seite des Gebäudes «Seepark Residenz» gibt es keinen Link «Rechnungen». Ich musste über das Menü gehen, und dort sind alle Gebäude gemischt.
- Im Dialog und auf der Detailseite ist das Dateifeld des Browsers zu sehen, auf Englisch: «Choose Files / No file chosen» bzw. «Choose File». Dazu kommt der deutsche Knopf «Dateien hierher ziehen oder auswählen».
- Der KI-Stellvertreter schlägt für eine «Schlussrechnung 2025» folgende Werte vor: Rechnungsdatum 31.03.2026, Leistungszeitraum 01.01.–31.03.2026, Beschreibung «Allgemeinstrom Q1», Rechnungssteller «Werke Schlussrechnung 2025». Das passt nicht zu einer Jahresschlussrechnung (die Werte kommen vom Stellvertreter). Eine Kategorie hat er nicht vorgeschlagen.
- Im Hinweiskasten stehen der lange Akonto-Text, «Wählen Sie eine Kategorie.», «Prüfen Sie: Rechnungsdatum.» und «Ergänzen Sie …» untereinander. Der lange Text drückt die kurzen Aufgaben nach unten.
- Escape bei geöffneter Kategorie-Auswahl öffnet die Rückfrage «Hochladen abbrechen?» (ich habe sie nicht bestätigt).
- Nach «1 Rechnung erstellen» erscheint «1 Rechnung erstellt» mit einem Link zur neuen Rechnung. Das war gut.

## Aufgabe geschafft: ja

Hochgeladen, mit Kategorie «Allgemeinstrom» erstellt, geöffnet, beide Hinweise gelesen. Ob ich Akontorechnungen löschen müsste, konnte ich nicht entscheiden (siehe P-2).

## Aufwand

Etwa 15 Minuten, rund 14 Schritte: Übersicht → Gebäude → Menü → Rechnungen → Hochladen → Gebäude wählen → Datei wählen → Hinweis lesen → Angaben prüfen → Kategorie → Erstellen → Rechnung öffnen → Hinweis lesen → Liste nach Akonto durchsuchen.

## Ablauf

1. **Übersicht → «Seepark Residenz».** Erwartet: Beim Gebäude finde ich «Rechnungen». Gesehen: Angaben, Wohnungen und Tankbestand, aber keine Rechnungen.
2. **Menü → «Rechnungen».** Erwartet: die Rechnungsliste. Gesehen: die Liste aller Gebäude (83 Rechnungen) mit dem Knopf «Rechnungen hochladen». In Ordnung.
3. **«Rechnungen hochladen».** Gesehen: ein Dialog mit der Auswahl «Gebäude». Ich wähle «Seepark Residenz – Seeweg 15, 6003 Luzern», danach lässt sich «Dateien hierher ziehen oder auswählen» anklicken.
4. **Datei «Werke Schlussrechnung 2025.pdf» gewählt.** Erwartet: Dwello liest sie. Gesehen: «1 von 1 Dateien gelesen. Bitte prüfen: 1.», ein gelber Kasten «Hinweise zu Werke Schlussrechnung 2025.pdf» mit dem Text:
   «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Vorgeschlagen ist das Total vor dem Abzug. Haben Sie die Akontorechnungen schon erfasst oder hier ausgewählt, löschen oder entfernen Sie sie, sonst zählen sie doppelt. Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab.»
   Darunter stehen «Diese Rechnung erstellen», «Angaben prüfen» und, in Rot, «Datei entfernen» (Screenshot 07).
   - Was ich verstehe: Die Werke haben meine Teilzahlungen von CHF 1'000 schon abgezogen, Dwello schlägt aber den ganzen Betrag vor. Ich darf die Teilzahlungen nicht noch einmal haben.
   - Was ich nicht verstehe: Was genau ist eine «Akontorechnung»? Sind das die Rechnungen, die ich unter dem Jahr bezahlt habe? «Hier ausgewählt» heisst wohl: in diesem Fenster mit hochgeladen. «Entfernen» verbinde ich sofort mit dem roten Knopf «Datei entfernen» gleich darunter. Den will ich aber gerade nicht drücken, sonst ist ja meine Schlussrechnung weg. Wo ich «löschen» soll, steht nirgends. «Abgerechnet» kann für mich «bezahlt» heissen. Dann wären alle abgerechnet, und ich dürfte keine löschen?
5. **«Angaben prüfen».** Gesehen: Betrag 1250.00 (= 250 + 1'000, also das Total vor dem Abzug, wie angekündigt). Die Kategorie ist leer. Ich wähle «Allgemeinstrom», den Rest lasse ich wie vorgeschlagen.
6. **«1 Rechnung erstellen».** Erwartet: eine Bestätigung. Gesehen: «1 Rechnung erstellt» mit dem Link «Werke Schlussrechnung 2025, 31.03.2026».
7. **Rechnung geöffnet.** Gesehen: Betrag CHF 1’250.00, Kategorie Allgemeinstrom. Im Abschnitt «Beleg» steht ein gelber Kasten «Hinweise zum Beleg»:
   «Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen.»
   (Screenshot 13.) Er passt zum ersten Hinweis: gleiche CHF 1’000.00, gleiche Regel. Beim ersten Lesen dachte ich aber: «Gut, Dwello sagt, sie sind nicht zusätzlich erfasst.» Erst danach habe ich verstanden, dass das meine Aufgabe ist. Ganz unten auf der Seite steht unter «Weitere Aktionen» «Rechnung löschen». Hier wüsste ich jetzt, wie man eine Rechnung löscht: man öffnet sie.
8. **Liste nach Akontorechnungen durchsucht.** Mit der Suche «Akonto» und dem Gebäude Seepark Residenz: «Keine Rechnungen gefunden». Mit «Allgemeinstrom»: 5 Rechnungen, darunter «ewl Energie Wasser Luzern Allgemeinstrom H1 2025» und «H2 2025». Ob das Akontorechnungen der Werke sind, kann ich nicht sagen. Ich habe nichts gelöscht.

## Verwirrung

- **«Akontorechnung»**: Das Wort kenne ich vom Hörensagen, aber Dwello erklärt es nicht. Ich hätte gerne einen Satz wie «Rechnungen, die Sie unter dem Jahr als Teilzahlung bezahlt haben».
- **«abgerechnet»**: Ich verstehe es als «bezahlt». Gemeint ist vermutlich «schon in einer Nebenkostenabrechnung an die Mieter».
- **«entfernen» und «löschen»**: Zwei Wörter für fast dasselbe. «Entfernen» steht gleich daneben als roter Knopf an der falschen Rechnung.
- **«vom Total abziehen»**: Von welchem Total, und in welchem Feld?
- **«Beleg» und «Rechnung»**: Die beiden Hinweise sagen es unterschiedlich.

## Fehlerrisiken

- Ich drücke «Datei entfernen» auf der Schlussrechnung, weil der Hinweis «entfernen Sie sie» sagt (P-1).
- Ich lösche nichts, weil ich die Akontorechnungen nicht erkenne, und die CHF 1'000 zählen doppelt (P-2).
- Ich lösche eine Akontorechnung, die schon in einer Abrechnung steckt, weil ich «abgerechnet» als «bezahlt» lese und meine, das betreffe mich nicht (P-3).
- Ich lese den zweiten Hinweis als Entwarnung und prüfe nichts (P-4).

## Vorschläge

- **P-1**: Rechnungen → «Rechnungen hochladen» → Gebäude «Seepark Residenz» → Datei «Werke Schlussrechnung 2025.pdf». Der Hinweis sagt «löschen oder entfernen Sie sie», darunter liegt «Datei entfernen» der Schlussrechnung. Hilfreich wäre, beide Fälle getrennt und mit dem Ort zu nennen. Etwa: «Haben Sie Akontorechnungen in diesem Fenster ausgewählt, entfernen Sie dort deren Datei. Sind sie schon erfasst, öffnen Sie sie unter Rechnungen und wählen Sie «Rechnung löschen».» Dazu ein klarer Satz: «Diese Schlussrechnung behalten Sie.»
- **P-2**: Gleicher Weg, dann in der Liste «Akonto» suchen: kein Treffer. Hilfreich wäre ein Halbsatz zum Begriff, etwa: «Akontorechnungen sind die Teilrechnungen desselben Rechnungsstellers, die Sie im gleichen Zeitraum schon bezahlt haben.» Noch besser wäre ein Link zur Rechnungsliste, gefiltert nach Gebäude und Kategorie.
- **P-3**: Gleicher Weg, letzter Satz des Hinweises. Hilfreich wäre: «schon abgerechnet» → «schon in einer versendeten Nebenkostenabrechnung enthalten», dazu «ziehen Sie ihren Betrag im Feld «Betrag» vom Total ab».
- **P-4**: Die erstellte Rechnung öffnen, Abschnitt «Beleg», «Hinweise zum Beleg». Hilfreich wären Prüfschritte statt Aussagesätzen, etwa: «Prüfen Sie: Ist der Betrag das Total vor dem Abzug? Sind die Akontorechnungen gelöscht? Eine schon abgerechnete Akontorechnung bleibt erfasst; ziehen Sie dann ihren Betrag vom Total ab.»
- **P-5**: Beide Hinweise. In beiden dasselbe Wort verwenden, «Rechnung» oder «Beleg».

## Nicht geprüft

- Was passiert, wenn ich die Akontorechnungen im selben Fenster mit hochlade. Es gibt keine Testdatei für eine Akontorechnung der Werke.
- Ob eine der ewl-Rechnungen schon in einer versendeten Abrechnung steckt («abgerechnet»). Gelöscht habe ich keine, weil die Rechnungen nicht von mir erfasst sind.
- Den Hinweis im Dunkelmodus und auf dem Handy. Das gehört nicht zu Helgas Gerät.
