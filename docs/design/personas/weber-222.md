# Dr. Weber – Hinweise zu abgezogenen Akontobeträgen (Issue #222)

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles und rechnet nach. Desktop 1440 × 900, Maus.
App: Persona-Stack auf http://localhost:3300 (Version 0.5.4+82-g017fd97d), KI-Stand-in.
Gespeichert: eine Rechnung im Gebäude «Musterhaus Zentrum» (Werke Schlussrechnung 2025, CHF 1’250.00, Allgemeinstrom).
Skripte und Screenshots: `/tmp/claude-0/-home-user-dwello/42225c72-2497-5110-b437-fe1c26488178/scratchpad/weber-222/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnungen hochladen (Hinweis) und Rechnungsdetail «Hinweise zum Beleg» | Beide Hinweise sagen beim schon abgerechneten Fall nur «ziehen Sie ihren Betrag vom Total ab» bzw. «ihr Betrag ist vom Total abgezogen». Sie sagen nichts zum Leistungszeitraum. Weil Dwello nur «die Tage in der Abrechnungsperiode» zählt, landet ein Teil des Restbetrags in der schon abgerechneten Periode und erreicht die Mieter nie. Wer den Hinweis genau befolgt, rechnet zu wenig ab (Rechenbeispiel unten: rund CHF 187 zu wenig). |
| P-2 | Minor | beide Hinweise | «schon abgerechnet» ist nicht erklärt, und Dwello zeigt es an keiner Rechnung. Eine Rechnung aus einer bezahlten Abrechnung (ewz Allgemeinstrom Q1 2024) sieht im Detail genau gleich aus wie jede andere. Im Musterhaus ist die Abrechnung 2025 für Hans Müller «Versendet», die für drei andere Mieter ist noch «Entwurf». Ist eine Akontorechnung 2025 nun «abgerechnet» oder nicht? Ich konnte es nicht entscheiden. |
| P-3 | Minor | Rechnungsdetail «Hinweise zum Beleg» | Zwei Sätze widersprechen sich ohne Verbindungswort. Zuerst: «Der Betrag ist das Total vor dem Abzug», danach: «Ist eine davon schon abgerechnet, bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen.» Ausserdem steht «abgezogen» für zwei verschiedene Abzüge: die Akontozahlungen des Werks und meinen eigenen Abzug. Beim Nachprüfen weiss ich nicht, welcher Satz für meinen Fall gilt. |
| P-4 | Minor | Rechnungen hochladen (Hinweis) | Der Hinweis nennt nur den Abzug (CHF 1’000.00), nicht den vorgeschlagenen Betrag. «Vorgeschlagen ist das Total vor dem Abzug» lässt sich nur prüfen, wenn ich «Angaben prüfen» öffne; dort steht 1250.00. Solange die Angaben zugeklappt sind, ist der Betrag nicht zu sehen. |
| P-5 | Minor | beide Hinweise | Welche Rechnungen die «Akontorechnungen» sind, sagt der Hinweis nicht: kein Link, kein Lieferant, kein Zeitraum. In der Liste «Musterhaus Zentrum / Allgemeinstrom» stehen die Quartalsrechnungen «ewz Allgemeinstrom Q1–Q4 2025». Ob das Akontorechnungen sind, sehe ich nirgends. Wer die falschen löscht, verliert echte Kosten. |
| P-6 | Nit | Rechnungen hochladen (Hinweis) | «löschen oder entfernen Sie sie» gehört der Reihe nach zu «schon erfasst oder hier ausgewählt». Das versteht man erst beim zweiten Lesen. Dass «entfernen» die Schaltfläche «Datei entfernen» meint (oder das Häkchen «Diese Rechnung erstellen»), steht nicht da. |
| P-7 | Nit | Rechnungsdetail | Der Hinweis zum Betrag steht in der Karte «Beleg» rechts, der Betrag in der Karte «Rechnung» links. Den Zusammenhang muss ich selbst herstellen. |

## Beobachtungen

- Der Stand-in liest aus «Werke Schlussrechnung 2025.pdf» den Rechnungssteller «Werke Schlussrechnung 2025» (den Dateinamen), die Beschreibung «Allgemeinstrom Q1», den Leistungszeitraum 01.01.2026–31.03.2026 und das Rechnungsdatum 31.03.2026. Das passt nicht zu einer Jahresschlussrechnung 2025. Die PDF enthält nur das Wort «Rechnung». Das betrifft den Stand-in.
- Die neue Rechnung trägt «Manuell kategorisiert» bzw. in der Liste «Manuell», obwohl die Angaben von der KI kamen. Ich habe nur die Kategorie gewählt.
- Auf der Seite «Rechnung bearbeiten» fehlt der Hinweis zu den abgezogenen Beträgen. Gerade dort korrigiere ich aber den Betrag, wenn eine Akontorechnung schon abgerechnet ist. Dort steht nur «Bestehende Abrechnungen ändern sich dadurch nicht.»
- Im Hochlade-Dialog und im Detail «Datei des Belegs» erscheint das Browser-Element «Choose Files / No file chosen» auf Englisch, mitten in der deutschen Oberfläche.
- Der Verteilschlüssel blieb leer («Keiner – die Kosten werden gleichmässig pro Wohnung verteilt»). Die übrigen Allgemeinstrom-Rechnungen im Musterhaus laufen «Pro Fläche (m²)». Im Dialog weist nichts auf diese Abweichung hin.
- Die Schaltfläche «Rechnungen hochladen» reagierte bei mir erst nach einer Sekunde Wartezeit nach dem Laden der Seite. Ein Klick direkt nach dem Laden bewirkte nichts.
- Auch in den anderen Gebäuden stehen Rechnungen «Werke Schlussrechnung 2025». Sie stammen von anderen Personas und sind nicht meine.

## Aufgabe geschafft: ja

## Aufwand

Etwa 25 Minuten, 12 Durchgänge (Gebäude, Rechnungsliste, Dialog öffnen, Gebäude wählen, Datei wählen, Angaben prüfen, Kategorie wählen, erstellen, Detail, Bearbeiten-Seite, alte Rechnung, Abrechnungsliste). Sieben Klicks in der App bis zur erstellten Rechnung.

## Ablauf

1. **Gebäude «Musterhaus Zentrum» öffnen.** Erwartet: dort einen Bereich «Rechnungen». Gesehen: Angaben, Wohnungen, Mietstatus, Brennstoffbestand, aber keine Rechnungen. Ich ging über die Hauptnavigation «Rechnungen» (`/invoices`).
2. **«Rechnungen hochladen».** Erwartet: ein Dialog. Gesehen: der Dialog «Rechnungen hochladen» mit Gebäudewahl. Die Dateiwahl ist gesperrt mit «Wählen Sie zuerst das Gebäude.» Klar.
3. **Gebäude wählen und Datei hochladen.** Gesehen: «1 von 1 Dateien gelesen. Bitte prüfen: 1.» Darunter ein gelber Kasten «Hinweise zu Werke Schlussrechnung 2025.pdf», wörtlich:
   > Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Vorgeschlagen ist das Total vor dem Abzug. Haben Sie die Akontorechnungen schon erfasst oder hier ausgewählt, löschen oder entfernen Sie sie, sonst zählen sie doppelt. Ist eine davon schon abgerechnet, löschen Sie sie nicht, sondern ziehen Sie ihren Betrag vom Total ab.

   Dazu «Wählen Sie eine Kategorie.», «Prüfen Sie: Rechnungsdatum.» und «Ergänzen Sie, wenn auf der Rechnung angegeben: Fälligkeitsdatum.» (Screenshot `06b-dialog.png`: gelber Kasten mit Warndreieck, gut lesbar, oberhalb der Felder.)
   Mein Urteil: Für die drei Fälle steht jeweils ein Satz da, das ist gut. Abzug genannt, Total vorgeschlagen, schon erfasste löschen, hier ausgewählte entfernen, abgerechnete behalten und abziehen. Es fehlen der Leistungszeitraum (P-1), eine Erklärung von «abgerechnet» (P-2) und der vorgeschlagene Betrag (P-4).
4. **«Angaben prüfen».** Gesehen: Betrag 1250.00, Rechnungsdatum 31.03.2026 (mit «Die KI ist unsicher»), Leistungszeitraum 01.01.2026–31.03.2026, Kategorie leer. Das Total vor Abzug stimmt also: 1’250 = 250 Rest + 1’000 Abzug.
5. **Kategorie «Allgemeinstrom» wählen, «1 Rechnung erstellen».** Die Schaltfläche hiess vorher «0 Rechnungen erstellen (1 unvollständig)», danach «1 Rechnung erstellen». Gesehen: «1 Rechnung erstellt» mit einem Link. In der Liste steht «Werke Schlussrechnung 2025 Allgemeinstrom Q1 Musterhaus Zentrum, 31.03.2026, CHF 1’250.00».
6. **Rechnung öffnen.** Gesehen (`11-rechnung-detail.png`): In der Karte «Beleg» rechts ein gelber Kasten «Hinweise zum Beleg», wörtlich:
   > Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1’000.00). Prüfen Sie, dass sie nur einmal zählen: Der Betrag ist das Total vor dem Abzug, und die Akontorechnungen sind nicht zusätzlich erfasst. Ist eine davon schon abgerechnet, bleibt sie erfasst, und ihr Betrag ist vom Total abgezogen.

   Vergleich mit Hinweis 1: Die Regel ist inhaltlich dieselbe. Hinweis 1 ist eine Anleitung, Hinweis 2 eine Prüfliste. Das passt, weil die Rechnung dann schon erstellt ist. Die Aussagen widersprechen sich nicht. Hinweis 2 ist aber in sich missverständlich (P-3), und beiden fehlt dasselbe (P-1, P-2, P-5).
7. **Nachprüfen, was «abgerechnet» ist.** Ich öffnete «ewz Allgemeinstrom Q1 2024» aus einer bezahlten Abrechnung. Das Detail zeigt keinen Hinweis darauf, dass sie abgerechnet ist. Unter «Nebenkostenabrechnungen» steht für Musterhaus 2025: Hans Müller «Versendet», Maria Rossi, Pierre Dubois und Anna Schmidt «Entwurf» (P-2).
8. **«Rechnung bearbeiten».** Hier würde ich den Betrag nach Hinweis 2 korrigieren. Der Hinweis fehlt dort (siehe Beobachtungen).

### Nachrechnung mit eigenem Beispiel

Werke Schlussrechnung Allgemeinstrom, Ableseperiode 01.10.2024–30.09.2025, Total 1’250.00. Abzüglich Akonto 4 × 250.00 = 1’000.00, Zahlbetrag 250.00. Die Abrechnungsperiode ist das Kalenderjahr. Die Akontorechnung Q4 2024 (250.00) ist erfasst und mit der Abrechnung 2024 versendet. Q1–Q3 2025 (750.00) sind erfasst, die Abrechnung 2025 ist noch nicht erstellt.

- **Hinweis befolgt:** Q1–Q3 2025 löschen. Q4 2024 bleibt, also 1’250 − 250 = 1’000.00 erfassen, mit Leistungszeitraum wie auf der Rechnung 01.10.2024–30.09.2025.
- **Was Dwello dann tut** («Nur die Tage in der Abrechnungsperiode zählen»): 1’000 × 92/365 = 252.05 fallen in 2024. Diese Periode ist schon versendet, der Betrag erreicht niemanden. 1’000 × 273/365 = 747.95 fallen in 2025.
- **Richtig für 2025** wäre der Kostenanteil 01.01.–30.09.2025: 1’250 × 273/365 = 934.93. 2024 hat mit dem Akonto Q4 nur 250.00 getragen, nicht 315.07. Insgesamt müsste 2025 also 1’250 − 250 = 1’000.00 tragen.
- **Ergebnis:** In der Abrechnung 2025 fehlen 1’000.00 − 747.95 = 252.05, im zeitanteiligen Vergleich mindestens 934.93 − 747.95 = 186.98. Der Vermieter verliert das Geld, und die Abrechnung ist nicht korrekt.
- **Richtig wäre:** 1’000.00 mit dem Leistungszeitraum 01.01.2025–30.09.2025 erfassen, also den noch nicht abgerechneten Teil. Das sagt keiner der beiden Hinweise.

Gegenprobe ohne abgerechnete Akontorechnung (alle vier im offenen Jahr erfasst): Ich lösche alle vier und erfasse 1’250.00. Das ergibt 1’250, richtig. Behalte ich alle vier und erfasse 250.00, ergibt das ebenfalls 1’250. Das wäre auch richtig, aber Hinweis 2 würde mir dann sagen, der Betrag sei falsch («Der Betrag ist das Total vor dem Abzug»).

Fazit: Im einfachen Fall (nichts abgerechnet, Zeitraum innerhalb einer Periode) führen beide Hinweise zu korrekten Nebenkosten. Im Fall, den der dritte Satz eigens regelt, führen sie ohne Angabe zum Leistungszeitraum zu falschen Nebenkosten.

## Verwirrung

- «abgerechnet»: Heisst das in einer versendeten Abrechnung, in irgendeiner Abrechnung (auch Entwurf) oder bezahlt? Und gilt das pro Mieter oder fürs ganze Gebäude?
- «Akontorechnungen»: Gemeint sind Rechnungen des Werks über Vorauszahlungen. Für Laien liegt eine Verwechslung mit den Akontozahlungen der Mieter nahe (Nebenkosten-Akonto im Mietvertrag). Der Hinweis grenzt das nicht ab.
- «Total vor dem Abzug» gegenüber «vom Total abgezogen» in Hinweis 2: Hier sind zwei verschiedene Abzüge gemeint, beide heissen gleich.
- «löschen oder entfernen»: Welches Verb gehört zu welchem Fall?

## Fehlerrisiken

- Restbetrag mit dem Leistungszeitraum der Werksrechnung erfasst: Ein Teil fällt in eine abgeschlossene Periode und geht verloren (P-1).
- Akontorechnungen gelöscht, obwohl sie in einer versendeten Abrechnung stecken, weil «abgerechnet» nicht erkennbar ist: Der Betrag zählt doppelt bzw. die Abrechnung lässt sich nicht nachvollziehen (P-2).
- Falsche Quartalsrechnungen als «Akontorechnungen» gelöscht: echte Kosten fehlen (P-5).
- Wer alle Akontorechnungen behält und nur den Zahlbetrag erfasst, macht es richtig. Hinweis 2 verleitet ihn aber, den Betrag auf das Total zu erhöhen, und dann zählt der Abzug doppelt (P-3).

## Vorschläge

- **P-1**
  - Nachstellen: Rechnungen > Rechnungen hochladen > Musterhaus Zentrum > «Werke Schlussrechnung 2025.pdf». Den Hinweis lesen, dann im Detail «Hinweise zum Beleg» lesen. Mit dem Beispiel oben nachrechnen.
  - Hilfreich: im dritten Satz ergänzen, etwa «… ziehen Sie ihren Betrag vom Total ab und setzen Sie den Leistungszeitraum auf die Zeit, die noch nicht abgerechnet ist.» Im Detail sinngemäss gleich.
- **P-2**
  - Nachstellen: ewz Allgemeinstrom Q1 2024 öffnen, dann Nebenkostenabrechnungen, Filter «Versendet» (Hans Müller, Musterhaus 2025).
  - Hilfreich: «abgerechnet» im Hinweis erklären, etwa «in einer versendeten Nebenkostenabrechnung». Am besten zeigt die Rechnung selbst, in welcher Abrechnung sie steckt.
- **P-3**
  - Nachstellen: Detail der neuen Rechnung, Hinweis lesen.
  - Hilfreich: die Ausnahme ausdrücklich machen, etwa «Der Betrag ist das Total vor dem Abzug, ausser eine Akontorechnung ist schon abgerechnet: Dann bleibt sie erfasst, und der Betrag ist das Total ohne ihren Betrag.»
- **P-4**
  - Nachstellen: Hochlade-Dialog, Angaben zugeklappt lassen, Hinweis lesen.
  - Hilfreich: «Vorgeschlagen ist das Total vor dem Abzug (CHF 1’250.00).»
- **P-5**
  - Nachstellen: Rechnungsliste mit Filter Musterhaus Zentrum / Allgemeinstrom.
  - Hilfreich: im Hinweis sagen, woran man sie erkennt («gleicher Rechnungssteller, Zeitraum der Schlussrechnung»). Wenn möglich auf die gefilterte Rechnungsliste verlinken.
- **P-6**
  - Hilfreich: «Löschen Sie schon erfasste Akontorechnungen; entfernen Sie hier ausgewählte mit «Datei entfernen».»
- **P-7**
  - Hilfreich: Hinweis 2 beim Betrag zeigen oder in der Karte «Rechnung» darauf verweisen.

## Nicht geprüft

- Ob Dwello eine Rechnung aus einer versendeten Abrechnung löschen lässt oder das verweigert. Ich habe keine fremden Datensätze gelöscht.
- Die tatsächliche Wirkung meines Beispiels in einer Abrechnung. Ich habe keine Akontorechnungen angelegt und keine Abrechnung erzeugt, weil die Aufgabe nur das Erstellen der einen Rechnung vorsah. Die Zahlen stützen sich auf den Text «Nur die Tage in der Abrechnungsperiode zählen.» und auf «Bestehende Abrechnungen ändern sich dadurch nicht.»
- Den Fall, dass eine Akontorechnung im selben Hochladen ausgewählt ist: Ich hatte nur die eine Datei.
- Ob Dwello andere Abrechnungsperioden als das Kalenderjahr kennt.
