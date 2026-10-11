# Review B, Runde 7, und C, Runde 2

Geprüft: 751c180 (B Runde 6), 6a00491 und df553b9 (C Runde 1).
- **Code-Review (CR7):** vitest 1412 grün, check, lint, Backend 548 grün; im Browser Taste für Taste geprüft.
- **Fachreview Immobilienverwalter (IV7) und Mietrecht (MR7):** in der laufenden App.

Kein Finding ist kritisch oder hoch. Jede Behandlung hat einen Test, der vorher scheiterte. CR7-4 ist ein Test für bestehendes Verhalten.

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CR7-1 | mittel | «TT.MM.JJ» machte ein halb getipptes Jahr zum Datum: «31.12.20» wurde als 2020 angesagt, der Hinweis zum vergangenen Vertragsbeginn blitzte auf | ein zweistelliges Jahr zählt erst beim Verlassen und beim Senden; beim Tippen nur vier Stellen |
| MR7-1 | mittel | versendete oder bezahlte Abrechnung: Aufforderung zu berichtigen ohne Vorbehalt | gleicher Text wie bei der Rechnung: «Versendete Abrechnungen berichtigen Sie ausserhalb von Dwello: Schicken Sie dem Mieter eine berichtigte Abrechnung mit dem Beleg. Ob Sie die Kosten noch nachverlangen können, ist nicht in jedem Fall sicher: Lassen Sie sich im Zweifel beraten.» |
| MR7-2, MR7-3 | niedrig | «Nehmen Sie die Kosten nicht in die nächste Periode» widerspricht der Zuordnung nach Rechnungsdatum; Texte uneinheitlich | Satz entfernt; ein Text für Rechnung und Abrechnung |
| CR7-2 | niedrig | «01.04.99» wurde 2099, «31.12.9999» galt als Datum | bis 20 Jahre voraus 20JJ, sonst 19JJ; Jahre 1900 bis 2199 |
| CR7-3 | niedrig | Bearbeitung mitten im Datum setzte den Cursor ans Ende | nur am Ende werden Punkte ergänzt und doppelte zusammengefasst |
| CR7-4 | niedrig | Prüfung beim Senden per Enter ohne Test | Test: Senden ohne Verlassen meldet den Fehler und sendet «31.12.24» als 2024-12-31 |
| CR7-5 | niedrig | `movedOut` nur bis Periodenende: ein seither ausgezogener Mieter bekam den Akonto-Hinweis | ausgezogen bis heute |
| CR7-6 | niedrig | nach «Entwurf verwerfen» kam der Vorschlag für den Vertragsbeginn nicht mehr | zurückgesetzt |
| IV7-3 | niedrig | Hilfetext Heizprofil zu lang | «Wärme- oder Warmwasserzähler oder Heizkostenverteiler» |
| IV7-4 | niedrig | «Tank» ohne «Lager»; Löschdialog nennt eine Periode, keine versendeten Abrechnungen | «Tank oder Lager»; «die Entwürfe beider Perioden …. Versendete Abrechnungen berichtigen Sie ausserhalb von Dwello.» |
| IV7-5 | niedrig | leere Vorschau sagt nicht, dass Versendete bleiben | «Versendete Abrechnungen lassen sich nicht neu berechnen.» |
| IV7-1 | niedrig | später erfasste Rechnungen zählen für alle Mietverträge, auch wenn ihr Leistungszeitraum das Mietverhältnis nicht berührt | begründet offen: der Hinweis ist eine Aufforderung zu prüfen; eine genaue Zuordnung braucht die Rechnungen je Position (offener Punkt CR4-7) |
| IV7-2 | niedrig | kein Akonto-Hinweis bei einem Vertrag mit Enddatum | begründet offen: ein künftiges Enddatum kann eine feste Laufzeit über Jahre sein; erst ein Auszug bis heute unterdrückt den Hinweis (CR7-5) |

Info aus CR7 ohne Änderung: der Hinweis auf später erfasste Rechnungen bleibt bei einer bezahlten Abrechnung stehen (gehört zum offenen Punkt «Berichtigung versendeter Abrechnungen»); der Link der leeren Vorschau filtert nach Gebäude.
