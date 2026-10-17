# Helga – Hinweise zu Rechnungen in der Vorschau des Abrechnungsassistenten

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom, Maus. Persona-App auf http://localhost:3300 mit Demodaten. Ich habe nur geschaut: nichts gespeichert, keine Abrechnung erstellt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/527f7d77-0112-5cce-90a1-4063e5ce2c7e/scratchpad/helga-invoice-hints/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Assistent Schritt 4 (Vorschau), 01.01.–30.06.2025, Hinweis «Rechnungen kurz nach der Abrechnungsperiode» → Rechnung bearbeiten | Der Hinweis nennt die Heizöl-Rechnung (Heizöl Oberland AG, 25.08.2025) und sagt «erfassen Sie ihren Leistungszeitraum». Das Formular sagt bei genau dieser Rechnung: Leistungszeitraum «Nicht für Lieferungen von Heizöl …». Ich weiss nicht, wem ich glauben soll. |
| P-2 | Major | Assistent Schritt 4, Periode 01.01.–31.12.2024, Alpenblick | Bei der Periode aus Aufgabe 1 erscheint kein Hinweis zu Rechnungen kurz nach der Periode. Die Vorschau sagt nur, dass alle Mietverträge schon eine Abrechnung haben. Ich habe den Hinweis dort nie gesehen (ob Absicht oder Demodaten, kann ich nicht beurteilen). |
| P-3 | Minor | Schritt 4 → Rechnungslink → Rechnung bearbeiten → zurück | Der Link öffnet die Rechnung im selben Tab. «Abbrechen» führt zur Rechnung, nicht zurück zum Assistenten. Mit «Zurück» im Browser lande ich in Schritt 1 und muss dreimal «Weiter» klicken, bis ich wieder bei den Hinweisen bin. |
| P-4 | Minor | Schritt 4, Hinweis «Rechnungen ohne Leistungszeitraum» | Die Liste zeigt nur Rechnungssteller, ein Datum und einen Betrag, nicht die Beschreibung. Ob eine Rechnung «für mehr als diese Abrechnungsperiode» gilt, sehe ich erst, wenn ich jede Rechnung einzeln öffne. Dabei stünde es in der Beschreibung («Allgemeinstrom H1 2025», «Schneeräumung Januar bis März 2025»). |
| P-5 | Nit | Schritt 4, beide blauen Hinweise | Das Datum in der Liste (31.03.2025) ist nicht beschriftet. Ich habe es zuerst für das Ende der Leistung gehalten, es ist aber das Rechnungsdatum. |

## Beobachtungen

- Unter den Hinweisen steht das Kästchen «Die Abrechnungen trotzdem erstellen». Ich weiss nicht, ob ich es wegen des gelben Hinweises (Tankbestand) ankreuzen muss oder auch wegen der beiden blauen. Das «trotzdem» klingt, als hätte ich etwas falsch gemacht.
- Der gelbe Hinweis «Möglicherweise fehlen Rechnungen» enthält für das erste Halbjahr 2025 nur den Satz zum Tankbestand. Die Überschrift passt nicht zum Inhalt: Es fehlt ja keine Rechnung, sondern ein Tankbestand.
- Bei Laura Keller und Kevin Fischer steht «Kosten … (60 %) unter dem Akonto. Fehlen Rechnungen?». Bei einem halben Jahr mit Heizöl im August wundert mich das nicht. Trotzdem macht es mir Angst, dass ich etwas vergessen habe.
- In Schritt 2 (Periode 2024) steht bei allen drei Gebäuden ein langer Satz, dass schon Abrechnungen bestehen. Ich verstehe ihn, aber erst beim zweiten Lesen.
- Der Assistent hat meine Angaben behalten («Entwurf wiederhergestellt»). Das hat mich beruhigt.
- Ein Darstellungsfehler, nur auf ganzseitigen Screenshots: Die Kopfzeile liegt mitten über dem Inhalt (bei «Abrechnungen erstellen»). Das kommt wohl von der festen Kopfzeile auf dem Screenshot und ist für mich am Bildschirm kein Problem.

## Aufgabe geschafft: teilweise

Teil 2 ganz. Teil 1 nur zum Teil: Bei der Periode 2024 gab es den Hinweis zu Rechnungen kurz nach der Periode nicht (P-2). Ich habe ihn deshalb in der Periode 01.01.–30.06.2025 gelesen und von dort die Rechnung über ihren Link geöffnet und bin zurückgekehrt.

## Aufwand

Etwa 15 Minuten, rund 30 Schritte: 3 Durchgänge durch den Assistenten (2024, erstes Halbjahr 2025, zum Vergleich ganzes Jahr 2025 und erstes Halbjahr 2024), 1 Rechnung geöffnet, 2 Wege zurück ausprobiert, die Rechnungsliste von Alpenblick angeschaut.

## Ablauf

1. **Übersicht → Menü (☰) → Nebenkostenabrechnungen → «Abrechnungen erstellen».** Erwartet: Assistent. Gesehen: Bei 150 % ist das Menü hinter ☰ versteckt, danach ging es leicht. Schritt 1 schlägt 01.01.–31.12.2025 vor (Screenshot `03-wizard-step1.png`).
2. **Periode 01.01.2024 – 31.12.2024, Weiter.** Erwartet: Gebäudewahl. Gesehen: Alle drei Gebäude, bei jedem der Satz, dass alle Mietverträge schon eine Abrechnung haben, «Sie müssen es nicht wählen» (`05-step2.png`). Ich habe Alpenblick trotzdem angekreuzt.
3. **Schritt 3, Weiter.** Heizprofil und Verwaltungspauschale: viel Text, aber ich habe nichts geändert.
4. **Vorschau 2024.** Erwartet: Hinweise, besonders zu Rechnungen kurz nach der Periode. Gesehen: «Anzahl Abrechnungen 0», «8 Rechnungen vom 31.03.2024 bis 31.12.2024», «Alle Mietverträge haben in dieser Periode schon eine Abrechnung …», ein Link «Abrechnungen von Alpenblick ansehen». Kein Hinweis zu Rechnungen (`10-p2024-step4.png`). In der Rechnungsliste von Alpenblick gibt es aber eine Rechnung vom 31.03.2025 «Schneeräumung Januar bis März 2025», also kurz nach der Periode (`20-invoices-alpenblick.png`).
5. **Zurück zu Schritt 1, Periode 01.01.2025 – 30.06.2025, Alpenblick, bis zur Vorschau.** Gesehen (`30-h2025-step4.png`): 2 Abrechnungen, CHF 1'079.86; ein gelber Hinweis zum Tankbestand; der blaue Hinweis «Rechnungen ohne Leistungszeitraum» mit 3 Rechnungen; der blaue Hinweis «Rechnungen kurz nach der Abrechnungsperiode» mit Heizöl Oberland AG, 25.08.2025, CHF 4'880.00; das Kästchen «Die Abrechnungen trotzdem erstellen».
6. **Hinweis «kurz nach» gelesen.** Verstanden: Die Rechnung hat kein «Von–Bis», darum zählt Dwello sie nach dem Rechnungsdatum zum zweiten Halbjahr. Wenn sie eigentlich ins erste Halbjahr gehört, soll ich das «Von–Bis» eintragen. Das verstehe ich. Bei Heizöl, das im August geliefert wurde, würde ich sagen: gehört nicht ins erste Halbjahr, also nichts tun. Sicher bin ich nicht.
7. **Link «Heizöl Oberland AG …» angeklickt.** Erwartet: die Rechnung, vielleicht in einem neuen Fenster. Gesehen: «Rechnung bearbeiten» im selben Fenster (`40-invoice-edit.png`). Beim Leistungszeitraum steht: «Nicht für Lieferungen von Heizöl, Flüssiggas, Pellets oder Holz: Deren Verbrauch zählt über den Tankbestand des Gebäudes.» Der Hinweis hat mich also zu einer Rechnung geschickt, bei der ich das Verlangte gerade nicht tun darf (P-1).
8. **Ohne Speichern zurück.** Zuerst «Abbrechen»: Erwartet: zurück zum Assistenten. Gesehen: die Ansicht der Rechnung (`41-after-return.png`). Dann mit «Zurück» im Browser: Assistent in Schritt 1 mit «Entwurf wiederhergestellt», Periode 01.01.–30.06.2025 noch da (`42-browser-back.png`). Bis zu den Hinweisen musste ich dreimal «Weiter» klicken. Über das Menü (Nebenkostenabrechnungen → Abrechnungen erstellen) landete ich ebenfalls in Schritt 1 (`43-menu-return.png`).
9. **Hinweis «Rechnungen ohne Leistungszeitraum» gelesen.** Verstanden: Weil mein halbes Jahr kürzer ist als ein Jahr, zählt eine Rechnung ohne «Von–Bis» ganz. Etwas tun muss ich nur, wenn eine Rechnung für eine längere Zeit gilt, zum Beispiel für das ganze Jahr. Dann trage ich ihren Zeitraum ein, und es zählt nur der Teil. Wenn sie nur mein halbes Jahr betrifft, muss ich nichts tun. Das ist klar geschrieben. Ob das bei den drei Rechnungen so ist, sehe ich aber nicht in der Liste (P-4). Ich habe in der Rechnungsliste nachgeschaut: «Januar bis März 2025», «H1 2025», «H1 2025». Also muss ich hier nichts tun.
10. **Vergleich ganzes Jahr 2025.** Kein blauer Hinweis, nur «Kaminfeger fehlt» und «Kaltwasser 2. Halbjahr fehlt». Das zeigt mir: Der Hinweis ohne Leistungszeitraum kommt nur bei kürzeren Perioden, wie er selbst sagt.

## Verwirrung

- «Leistungszeitraum»: Im Hinweis steht das Wort ohne Erklärung. Erst auf der Rechnung steht «Für welche Zeit gilt die Rechnung?». Diesen Satz hätte ich gern schon im Hinweis.
- «zählen mit dem ganzen Betrag» / «zählen zur Abrechnungsperiode ihres Rechnungsdatums»: «zählen» ist für mich unklar. Gemeint ist wohl «kommt in diese Abrechnung».
- Heizöl: Der Hinweis «kurz nach» sagt «Leistungszeitraum erfassen», das Formular sagt «nicht für Heizöl», der gelbe Hinweis sagt «Tankbestand erfassen». Drei Stellen, drei Anweisungen zur selben Rechnung.
- «Die Abrechnungen trotzdem erstellen»: trotz welcher Hinweise?
- «Möglicherweise fehlen Rechnungen», obwohl darunter nur der Tankbestand fehlt.

## Fehlerrisiken

- Folge ich dem Hinweis «kurz nach» bei der Heizöl-Rechnung und trage einen Leistungszeitraum ein (zum Beispiel 01.01.–30.06.2025), wird eine Lieferung vom August im ersten Halbjahr abgerechnet. Das Formular sagt, das sei falsch. Die Mieter zahlen dann zu viel oder zu wenig.
- Ich muss die Rechnungen einzeln öffnen, um zu entscheiden. Dabei bin ich aus dem Assistenten gefallen. Wer «Abbrechen» drückt, landet auf der Rechnung und findet den Weg zurück vielleicht nicht, oder klickt beim Zurückkommen schnell durch und übersieht die Hinweise.
- Ich hätte Alpenblick für 2024 neu abrechnen wollen, obwohl dort schon bezahlte Abrechnungen sind. Der Assistent hat das gut abgefangen.

## Vorschläge

- **P-1:** Assistent → Periode 01.01.2025–30.06.2025 → Alpenblick → bis Vorschau → Hinweis «Rechnungen kurz nach der Abrechnungsperiode» → «Heizöl Oberland AG, 25.08.2025» öffnen → beim Leistungszeitraum steht «Nicht für Lieferungen von Heizöl …». Hilfe: Rechnungen der Kategorie Heizöl (Brennstoff mit Tankbestand) nicht im Hinweis «kurz nach» aufführen, oder dort einen eigenen Satz zeigen: «Heizöl zählt über den Tankbestand, nicht über den Leistungszeitraum.»
- **P-2:** Assistent → Periode 01.01.2024–31.12.2024 → Alpenblick → bis Vorschau: kein Hinweis, obwohl es eine Rechnung vom 31.03.2025 ohne Leistungszeitraum gibt. Hilfe: Klären, ob der Hinweis bei 0 Abrechnungen bewusst fehlt. Wenn ja, ist das für diesen Fall in Ordnung. Für die Prüfung von Aufgabe 1 braucht es dann ein Gebäude ohne Abrechnung für 2024.
- **P-3:** Vorschau → Rechnungslink → «Abbrechen» oder «Zurück» im Browser. Hilfe: «Abbrechen» und «Speichern» auf der Rechnung führen zurück zur Vorschau des Assistenten, wenn man von dort kam. Oder der Link öffnet die Rechnung in einem neuen Tab, und das steht dabei.
- **P-4:** Vorschau erstes Halbjahr 2025 → Hinweis «Rechnungen ohne Leistungszeitraum». Hilfe: In der Liste die Beschreibung zeigen, zum Beispiel «BKW Energie AG – Allgemeinstrom H1 2025, Rechnungsdatum 30.06.2025, CHF 182.60».
- **P-5:** Gleiche Stelle. Hilfe: «Rechnungsdatum» vor das Datum schreiben.

## Nicht geprüft

- Nicht gespeichert und nicht erstellt (Auftrag: nur schauen). Ich weiss also nicht, wie sich ein eingetragener Leistungszeitraum auf die Vorschau auswirkt.
- Bei der Periode 2024 konnte ich den Hinweis «kurz nach» nicht sehen, weil Alpenblick 2024 schon abgerechnet ist (P-2).
- 200 % Zoom, andere Sprachen und dunkle Darstellung habe ich nicht geprüft.
