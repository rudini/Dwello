# Marco – Rechnungen hochladen: Hinweise, «Datei gross anzeigen», Abbrechen nach dem Erstellen, Beleg (bench233-opus)

Persona: Marco, 38, Smartphone 390 × 844, Touch. Gebäude: Seepark Residenz (dort gespeichert: 1 Rechnung «Werke Schlussrechnung 2025», CHF 1'250.00, Allgemeinstrom).
Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/8622ed40-8061-58f8-a107-a3f2cfa9096d/scratchpad/marco-bench233-opus/`

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnungen hochladen, Zeile «Werke Gutschrift 2025.pdf» | Der Hinweis sagt «Erstellen Sie daraus keine Rechnung», trotzdem lässt sich «Diese Rechnung erstellen» ankreuzen. Nach der Wahl einer Kategorie heisst der Knopf «1 Rechnung erstellen» und ist aktiv. Die Gutschrift würde dann als normale Rechnung über CHF 1'250.00 (positiv) erfasst, ohne weitere Warnung. |
| P-2 | Minor | Rechnungen hochladen, Hinweis zur Gutschrift | Der Hinweis nennt den Betrag der Gutschrift nicht (beim Akonto-Hinweis steht der Betrag, CHF 1'000.00), und «hier in ihrer Zeile» ist unklar: Gemeint ist wohl die Zeile der zugehörigen Rechnung, gelesen habe ich es zuerst als die Zeile der Gutschrift. Welche Rechnung dazugehört, sagt der Hinweis auch nicht. |
| P-3 | Minor | Rechnungen hochladen, Zeile «Lift Service und Reparatur.pdf» | Der Hinweis sagt: «nur den umlagefähigen Betrag eintragen, den Rest danach mit «Rechnung erfassen»». Er nennt aber weder den nicht umlagefähigen Betrag noch den Anteil; im Feld steht das ganze Total (CHF 1'250.00). Ohne Rechner und Papier geht es auf dem Handy nicht. Warum diese Zeile (anders als die Werke-Schlussrechnung) nicht angekreuzt ist, steht nirgends. |
| P-4 | Minor | Rechnungen hochladen nach «1 Rechnung erstellen» | Nach dem Erstellen gibt es keinen Knopf «Fertig» oder «Schliessen», nur «Abbrechen». Der Dialog danach hat einen roten Knopf «Abbrechen und verwerfen». Das wirkt, als würde ich meine Arbeit wegwerfen. Der Satz «Erstellte Rechnungen bleiben gespeichert» beruhigt, steht aber erst im Dialog. Gleich nach dem Erstellen steht ausserdem «Wählen Sie mindestens eine Rechnung zum Erstellen.» über dem Knopf, als hätte ich etwas falsch gemacht. |
| P-5 | Nit | Rechnung (Detail), Abschnitt «Beleg» | Andere Begriffe am Beleg: Beim Hochladen heisst es «Akontozahlungen», am Beleg «Akontorechnungen». Für mich als Laien sind das zwei verschiedene Dinge. |
| P-6 | Nit | Hochladen («Datei gross anzeigen») und Detail («Beleg anzeigen») | Bei 390 px stehen «Datei gross anzeigen» und «(öffnet in neuem Tab)» in zwei schmalen Spalten nebeneinander, jeder Teil zweizeilig umbrochen. Das sieht aus wie zwei Links. |
| P-7 | Minor | Rechnungen hochladen, «Datei gross anzeigen» | Im (headless) Chromium auf dem Handy wird die PDF heruntergeladen statt angezeigt, unter einem zufälligen Namen (`b9348a33-….pdf`). Der gespeicherte Beleg kommt dagegen mit seinem richtigen Namen («Werke Schlussrechnung 2025.pdf», `inline`). Unter Downloads finde ich die Datei so nicht wieder. |

## Beobachtungen

- Die Werte stammen vom Stand-in, nicht von einer echten KI: Bei allen drei Dateien steht als Rechnungssteller der Dateiname («Werke Schlussrechnung 2025»). Überall stehen dieselbe Rechnungsnummer R-1001, dasselbe Rechnungsdatum 31.03.2026, derselbe Leistungszeitraum 01.01.–31.03.2026 und dieselbe Beschreibung «Allgemeinstrom Q1». Bei einer «Schlussrechnung 2025» hätte ich das Jahr 2025 erwartet. Die Testdateien zeigen nur das Wort «Rechnung», darum konnte ich nichts wirklich mit der Datei vergleichen.
- Die Werke-Schlussrechnung ist von Anfang an angekreuzt, obwohl die Kategorie fehlt (Knopf: «0 Rechnungen erstellen (1 unvollständig)»). Lift und Gutschrift sind nicht angekreuzt.
- Die Doppelerkennung funktioniert gut: Beim zweiten Hochladen der Werke-Schlussrechnung stand «Diese Rechnung ist schon erfasst.» mit dem Link «Erfasste Rechnung ansehen», und die Zeile war nicht angekreuzt.
- Nach «Abbrechen und verwerfen» bleibt die Adresse `/invoices?upload`. Beim Neuladen oder beim Zurückkehren geht der Hochlade-Dialog wieder auf.
- Die Esc-Taste im Hochlade-Dialog öffnet die Rückfrage «Hochladen abbrechen?» (gut, nichts geht verloren).
- Keine seitliche Scrollleiste bei 390 px (scrollWidth 390) im Dialog und im Rechnungsdetail.

## Aufgabe geschafft: teilweise

Hochladen, Erstellen, Abbrechen und den Beleg ansehen habe ich geschafft. Bei der Gutschrift und bei der Lift-Rechnung weiss ich nach den Hinweisen nur ungefähr, was zu tun ist: Mir fehlen die Beträge (P-2, P-3). Der Vergleich mit der Datei ging auf dem Handy nur über die kleine Vorschau, «gross anzeigen» hat heruntergeladen (P-7).

## Aufwand

Etwa 10 Minuten als Marco, rund 25 Taps: Gebäude wählen, Dateien wählen, 3 × «Angaben prüfen», Kategorie wählen, «1 Rechnung erstellen», «Abbrechen», «Abbrechen und verwerfen», Liste, Rechnung, «Beleg anzeigen». Viel Scrollen: Mit allen drei Hinweisen und den aufgeklappten Angaben ist der Dialog sehr lang.

## Ablauf

1. **Übersicht → «Rechnungen hochladen».** Erwartet: ein Hochlade-Schritt. Gesehen: ein Dialog über der Rechnungsliste mit Erklärtext (Beleg wird gespeichert, Original aufbewahren), Gebäude-Auswahl und Dateifeld. Ohne Gebäude ist das Dateifeld gesperrt («Wählen Sie zuerst das Gebäude.»). Klar.
2. **Seepark Residenz wählen, drei Dateien wählen.** Erwartet: kurze Wartezeit, dann eine Liste. Gesehen: «3 von 3 Dateien gelesen. Bitte prüfen: 3.», jede Datei mit dem Etikett «Bitte prüfen» und einem gelben Kasten «Hinweise zu …» (Bildschirmfotos 04-review-1 bis -4).
   - Werke-Schlussrechnung: «Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF 1'000.00). Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich …». Das verstehe ich: Ich nehme das Total, die Akonti erfasse ich nicht noch einmal. Gut, dass der Betrag dabeisteht.
   - Lift: «Die Rechnung enthält Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Tragen Sie hier nur den umlagefähigen Betrag ein …». Was zu tun ist, verstehe ich, aber nicht, wie viel (P-3).
   - Gutschrift: «Das ist eine Gutschrift. Erstellen Sie daraus keine Rechnung. Verringern Sie den Betrag der Rechnung, zu der sie gehört …: hier in ihrer Zeile oder … mit «Rechnung bearbeiten».» Grundsätzlich verstanden, aber: Um welchen Betrag? Welche Zeile? (P-2). Trotzdem steht dort ein Kästchen «Diese Rechnung erstellen» (P-1).
3. **«Angaben prüfen» bei der Werke-Schlussrechnung, «Datei gross anzeigen».** Erwartet: die Rechnung als grosses Bild, um Betrag und Datum zu vergleichen. Gesehen: In der Zeile steht eine kleine Vorschau (Bild 310 × 384, Testdatei mit dem Wort «Rechnung»), darunter der Link «Datei gross anzeigen (öffnet in neuem Tab)» in zwei Spalten (Bildschirmfoto 07-preview, P-6). Antippen: ein neuer Tab geht auf, die PDF wird aber heruntergeladen, Dateiname `b9348a33-….pdf` (P-7). Der Dialog bleibt offen, meine Eingaben bleiben erhalten. Die Felder: Betrag CHF 1250.00, Rechnungsdatum 31.03.2026 mit «Die KI ist unsicher», Fälligkeitsdatum leer mit «Die KI hat diesen Wert nicht gefunden». Diese Markierungen helfen.
4. **Kategorie «Allgemeinstrom» wählen, «1 Rechnung erstellen».** Erwartet: Bestätigung, die Werke-Zeile verschwindet. Gesehen: oben ein grüner Kasten «1 Rechnung erstellt – Werke Schlussrechnung 2025, 31.03.2026». Die Werke-Zeile ist weg, Lift und Gutschrift bleiben («2 von 2 Dateien gelesen»). Unten steht «Wählen Sie mindestens eine Rechnung zum Erstellen.», der Knopf «0 Rechnungen erstellen» ist ausgegraut (08-after-create-0, -3).
5. **«Abbrechen».** Erwartet: Ich verliere die zwei offenen Dateien, die erstellte Rechnung bleibt. Gesehen: Rückfrage «Hochladen abbrechen? Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.» mit «Abbrechen und verwerfen» (rot) und «Weiter prüfen» (08-cancel). Der Text sagt genau, was ich wissen will; der rote Knopf hat mich trotzdem kurz zögern lassen (P-4). Ohne Erstellen lautet die Rückfrage passend «Hochgeladene Dateien und Ihre Eingaben gehen verloren.»
6. **Nach «Abbrechen und verwerfen».** Erwartet: Die Rechnung steht in der Liste. Gesehen: «84 Rechnungen» (vorher 83), ganz oben «Werke Schlussrechnung 2025 · Allgemeinstrom Q1 · Seepark Residenz, 31.03.2026 · CHF 1'250.00». Es bleibt also erhalten, was ich erwartet habe.
7. **Rechnung öffnen.** Erwartet: Angaben und die Datei. Gesehen: Detailseite mit Rechnungsdatum, Leistungszeitraum, Betrag CHF 1'250.00, «Manuell kategorisiert», und ein Abschnitt «Beleg»: Dateiname «Werke Schlussrechnung 2025.pdf», Knopf «Beleg anzeigen (öffnet in neuem Tab)», gelber Kasten «Hinweise zum Beleg: Auf dem Beleg sind bereits bezahlte Beträge abgezogen (CHF 1'000.00). Prüfen Sie, dass sie nur einmal zählen …». Dazu «Bewahren Sie die Originalrechnung auf; Mieter dürfen sie einsehen.» und «Beleg ersetzen» (11-beleg-section). Sehr gut, dass der Akonto-Hinweis hier wieder steht. Nur das Wort ist anders (P-5).
8. **«Beleg anzeigen».** Erwartet: die PDF. Gesehen: Der Server liefert `application/pdf`, `inline`, mit dem richtigen Dateinamen. Headless Chromium lädt sie herunter («Werke Schlussrechnung 2025.pdf»), eine Anzeige konnte ich nicht sehen.

## Verwirrung

- «hier in ihrer Zeile» (Gutschrift): ihre = Zeile der Gutschrift oder der Rechnung?
- «Akontozahlungen» (Hochladen) vs. «Akontorechnungen» (Beleg).
- «umlagefähiger Betrag» bei der Lift-Rechnung: Welcher Teil ist das? Die App schlägt das ganze Total vor.
- «Abbrechen» als einziger Ausgang, nachdem ich schon etwas erstellt habe.
- Warum ist eine unvollständige Zeile angekreuzt, eine andere nicht?

## Fehlerrisiken

- Gutschrift als normale Rechnung erstellt: Die Kosten zählen doppelt statt weniger (P-1).
- Lift-Rechnung mit dem vollen Betrag erstellt, wenn man den Hinweis überliest: Reparaturkosten landen in der Nebenkostenabrechnung (P-3).
- Wer die Rückfrage nicht liest, glaubt, «Abbrechen und verwerfen» lösche auch die erstellte Rechnung, und erfasst sie neu. Die Doppelerkennung fängt das beim Hochladen ab, bei «Rechnung erfassen» habe ich es nicht geprüft.
- Die Gutschrift wird vergessen: Nach «Abbrechen und verwerfen» ist sie weg, und nichts erinnert mich, die Werke-Rechnung zu verringern.

## Vorschläge

- **P-1:** Seepark Residenz, «Rechnungen hochladen», «Werke Gutschrift 2025.pdf» wählen, «Diese Rechnung erstellen» ankreuzen, «Angaben prüfen», Kategorie wählen: Der Knopf heisst «1 Rechnung erstellen» und ist aktiv. Hilfreich: Bei einer erkannten Gutschrift das Kästchen weglassen oder sperren, oder vor dem Erstellen nachfragen («Diese Datei ist eine Gutschrift. Trotzdem als Rechnung erstellen?»).
- **P-2:** Dieselbe Datei hochladen und den Hinweis lesen. Hilfreich: den Betrag der Gutschrift nennen («Gutschrift über CHF …») und klar sagen: «Ziehen Sie ihn in der Zeile der zugehörigen Rechnung vom Betrag ab». Wenn die zugehörige Rechnung in derselben Auswahl liegt, diese nennen.
- **P-3:** «Lift Service und Reparatur.pdf» hochladen. Hilfreich: den erkannten nicht umlagefähigen Betrag nennen (oder den umlagefähigen gleich vorschlagen) und sagen, warum die Zeile nicht angekreuzt ist.
- **P-4:** Eine Rechnung erstellen, dann ans Ende des Dialogs scrollen. Hilfreich: Nach dem Erstellen den sekundären Knopf «Schliessen» oder «Fertig» nennen, solange nichts mehr angekreuzt ist. Die Meldung «Wählen Sie mindestens eine Rechnung …» erst nach einem Versuch zeigen.
- **P-5:** Werke-Schlussrechnung hochladen und danach die Rechnung öffnen. Hilfreich: an beiden Stellen dasselbe Wort.
- **P-6:** 390 px, Zeile aufklappen oder Rechnungsdetail öffnen. Hilfreich: «(öffnet in neuem Tab)» unter oder hinter den Linktext setzen, nicht als eigene Spalte.
- **P-7:** Zeile aufklappen, «Datei gross anzeigen» antippen. Hilfreich: der Download unter dem Originalnamen. Auf echten Telefonen (iOS Safari, Android Chrome) prüfen, ob die Datei angezeigt wird.

## Nicht geprüft

- Wie «Datei gross anzeigen» und «Beleg anzeigen» auf einem echten Telefon aussehen: Headless Chromium hat keinen PDF-Betrachter und lädt PDFs herunter. JPG- oder PNG-Dateien hatte ich nicht.
- Ein echter Vergleich der Angaben mit der Datei: Die Testdateien enthalten nur das Wort «Rechnung».
- Die Gutschrift in der Lift- oder Werke-Zeile tatsächlich abziehen und «Rechnung bearbeiten» zu Ende führen: Ich habe nur die eine verlangte Rechnung gespeichert, damit keine zusätzlichen Datensätze entstehen.
- Die Gutschrift wirklich als Rechnung erstellen (P-1): bewusst nicht gespeichert, nur bis zum aktiven Knopf geprüft.
- Den nicht umlagefähigen Rest der Lift-Rechnung mit «Rechnung erfassen».
