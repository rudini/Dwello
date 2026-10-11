# Review B, Runde 4

Vier unabhängige Prüfungen auf den Commits fc6171d und d2431ea (Bereich dc44665..d2431ea): Code-Review (CR4), Fachreview Immobilienverwalter/Treuhänder (IV4), Fachreview Mietrecht (MR4), Datenprüfer (DP4: alle 17 Demo-Abrechnungen mit eigenem Skript nachgerechnet, alle Positionen und Kopfwerte genau; Prüfung auf fehlende Rechnungen in 9 Fällen, Vorschau unter einem Jahr, Heizhinweis im PDF und Heizprofile wie erwartet).

Kein Finding kritisch oder hoch. Alle Findings der Runde 3 bestätigt behoben oder begründet offen; zwei teilweise (CR3-5, IV3-1), jetzt behoben (CR4-1, CR4-2). Jede Behandlung mit einem Test, der vorher scheiterte.

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CR4-1 | mittel | Tankbestand einer Kategorie, die später nicht umlagefähig wird, wird weiter abgerechnet (OR 257a) | `fuelStockChange` rechnet ihn dann nicht ab (Test) |
| CR4-2, IV4-4 | mittel / niedrig | Kaminfeger als erste Tank-Kategorie wählbar | API (400) und Auswahl schliessen den Kaminfeger aus; Rest (Meldung nennt die Kategorie nicht) offen, Vorauswahl ist die Kategorie der bisherigen Stände |
| MR4-1 | mittel | Zähler in den Wohnungen (verbrauchsabhängige Abrechnung) nicht erwähnt | Hilfetext: «Hat Ihr Gebäude Zähler für Heizung oder Warmwasser in den Wohnungen, müssen Sie meist nach Verbrauch abrechnen. Das kann Dwello nicht …»; offener Punkt nachgeführt |
| IV4-1, MR4-8 | mittel / niedrig | Nachzügler: Rechnung nach den Abrechnungen ihrer Periode erfasst, kein Hinweis | Hinweis «Nicht in den Abrechnungen» auf Detail- und Bearbeitungsseite (`MissedWarning.svelte`, `statementPeriods`) |
| DP4-N1 | niedrig | Periode nur mit 0-%-Monaten im Profil: Heizkosten fallen weg | Verteilung nach Tagen (Test) |
| CR4-3 | niedrig | «1 Rechnung über CHF 6'957.80» enthält den Tankverbrauch | Text «Im Vorjahr: Kosten von CHF …» |
| CR4-4, IV4-5 | niedrig | Tank-Frage im Rahmen des Vorjahresvergleichs | eigener Hinweis «Heizen Sie mit Öl, Pellets oder Holz?» (`TankQuestion.svelte`); jährliche Wiederholung bei Fernwärme offen |
| CR4-5 | niedrig | BFF bietet nicht umlagefähige Heizkategorie an | gefiltert |
| CR4-6 | niedrig | Ladefehler als «keine Kategorie» gemeldet | eigene Meldung «konnten nicht geladen werden» |
| CR4-7 | niedrig | Heuristik über Erfassungszeit | offener Punkt (Bezug über Positionen wäre belastbar) |
| CR4-8 | niedrig | Kein Szenario für neue Warnungen | Szenario «Warnung beim Bearbeiten einer schon abgerechneten Rechnung»; die übrigen Warnungen über DOM-Tests und axe-Zustand `period-not-over` |
| CR4-9, MR4-5 | niedrig | Migration 0010: Profil-Bezug alter Abrechnungen NULL | offener Punkt, ohne Installation harmlos |
| MR4-2 | niedrig | Löschdialog ohne Berichtigung | «Löschen Sie nur falsch erfasste Rechnungen. Versendete oder bezahlte Abrechnungen berichtigen Sie gegenüber dem Mieter.» |
| MR4-3 | niedrig | Neue Nebenkosten: «frühestens», 10 Tage, Nichtigkeit | ergänzt |
| MR4-4 | niedrig | Befristeter Vertrag | TODO(fachlich prüfen), offener Punkt |
| MR4-6 | niedrig | PDF: Hinweis auf detaillierte Heizkostenabrechnung (Art. 8 Abs. 1 VMWG) | Muss-Anforderung für Schritt D2 |
| MR4-7 | niedrig | Holz fehlt | «Öl, Pellets oder Holz» |
| IV4-2 | niedrig | Gebäude mit Tankverbrauch ohne Rechnungen: «Keine Rechnungen erfasst» | offener Punkt (selten) |
| IV4-3 | niedrig | Warnung laufende Periode nur in Schritt 1 | auch in der Vorschau |
| IV4-6 | niedrig | Vergessener Stichtag gilt nach einem Jahr als stillgelegter Tank | offener Punkt |
| IV4-7 | niedrig | Zählerstände: was mit dem Entwurf? | «… und löschen Sie ihren Entwurf.»; Ergänzung zur Ablesung Anfang Januar fachlich unsicher, nicht übernommen |
| IV4-8, DP4-I1 | niedrig / Info | Doku veraltet (offene Punkte, P9) | nachgeführt |
| DP4-I2 | Info | Literpreis gerundet | Kommentar in den Demodaten |
| DP4-I3 | Info | Tank-Frage bei Fernwärme jedes Jahr | eigener Hinweis, offener Punkt («kein Tank» am Gebäude) |
