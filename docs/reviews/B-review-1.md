# Review B, Runde 1 – Prüfung auf fehlende Rechnungen pro Kategorie

Vier unabhängige Prüfungen auf Commit 794b141: Code-Review, Fachreview Immobilienverwalter/Treuhänder, Fachreview Mietrecht, Datenprüfer (alle 17 Demo-Abrechnungen mit eigenem Skript nachgerechnet: übereinstimmend bis auf einen Rundungsrappen; Prüfung in 18 Fällen identisch mit eigener Nachrechnung).

Kürzel: CR = Code-Review, IV = Immobilienverwalter, MR = Mietrecht, DP = Datenprüfer.

## Prüflogik und Anzeige (Schritt B)

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CR-H1 | hoch | Perioden über ein Jahr vergleichen sich mit sich selbst | Periode länger als 12 Monate: kein Vergleich |
| CR-H2, IV-M1 | hoch / mittel | Fehlalarme im Rhythmus (Rechnung kurz nach Quartalsende, verschobene Jahresrechnung, Gutschrift als eigener Teil) | Lücke nur, wenn weniger Rechnungen als im Vorjahr; Gutschriften zählen nicht für den Rhythmus |
| DP-M2 | mittel | Vorjahr nur teilweise erfasst (erstes Jahr mit Dwello) ergibt falsche Abweichungen | Kein Vergleich, wenn die erste Rechnung des Gebäudes nach Beginn des Vergleichszeitraums liegt |
| CR-M3 | mittel | Titel «fehlen Rechnungen» auch bei reiner Abweichung | Eigener Titel für Hinweise ohne fehlende Rechnung |
| CR-M4 | mittel | «Keine Rechnung erfasst» trotz Rechnungen; Gruppe «Nicht kategorisiert» | Text «Keine Rechnung in dieser Kategorie»; nicht kategorisierte Rechnungen nicht vergleichen |
| CR-M5 | mittel | Ungültiges Datum (30.02.) ergibt HTTP 500 mit SQL | 400 bei ungültigem Datum |
| CR-M6 | mittel | Randfälle dünn getestet (Mieterwechsel nur Zahlen, Periode ab 16., > 12 Rechnungen …) | Tests ergänzt |
| CR-M7 | mittel | Backend liefert deutsche Satzteile und eigenes Datumsformat | Backend liefert Zeitabschnitte (von–bis), das Frontend formuliert |
| MR-N2, IV-M4 | niedrig / mittel | Folge fehlender Rechnungen nicht genannt | Satz zur Folge ergänzt |
| IV-M2, MR-N1 | mittel / niedrig | Akonto-Hinweis: Fehlalarm bei Teilperiode, Schwelle, Erhöhung braucht amtliches Formular | Unterschreitung nur bei ganzer Periode, getrennte Schwellen, Betrag in CHF, Hinweis auf Formular |
| IV-H4 | hoch | Kategorie, die neu dazukommt, ohne Frage nach der vertraglichen Vereinbarung | Neue Kategorie wird gemeldet: «Ist sie im Mietvertrag vereinbart?» (Vollmodell vereinbarter Kategorien: offener Punkt) |
| CR-N8–N12 | niedrig | Regel doppelt, Doppelwarnung, Abstände, Liste pro Gebäude, Fehler der Prüfung bricht die Vorschau | behoben |

## Fachmodell (über Schritt B hinaus, ausdrücklich erlaubt)

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| IV-K1, MR-H2 | kritisch / hoch | Heizöl nach Einkauf statt Verbrauch | behoben: Tankbestand pro Gebäude (Migration 0008, Gebäudeseite «Heizöl im Tank»); Heizkosten = Anfangsbestand + Einkauf − Endbestand; Szenario «Heizöl wird nach Verbrauch abgerechnet» |
| MR-H1, IV-H1 | hoch | Rechnungsdatum statt Leistungszeitraum | behoben: Leistungszeitraum (von–bis) pro Rechnung (Migration 0007, Rechnungsformular und -detail), Zuteilung nach Tagen; ohne Angabe gilt das Rechnungsdatum; Szenario «Eine Rechnung gilt für ihren Leistungszeitraum» |
| IV-H2, MR-M3 | hoch / mittel | Heizkosten über den Kategorienamen erkannt | behoben: Eigenschaft «Heiz- und Warmwasserkosten» an der Kategorie (Migration 0006) |
| MR-M1, IV-M3 | mittel | Verwaltungspauschale gleichmässig pro Wohnung | behoben: ohne Verteilschlüssel Prozentsatz der eigenen Nebenkosten des Mieters |
| MR-M2 | mittel | Pauschale und Heizprofil nur bei vertraglicher Vereinbarung | behoben: Hilfetexte im Assistenten |
| IV-H3 | hoch | Akonto als Soll statt bezahlt, ohne Verlauf | offen (Produktentscheid): Glossar definiert «Geleistete Akontobeiträge» als Summe der Monatsbeträge; Zahlungserfassung und Akonto-Verlauf sind neue Funktionen |
| MR-M4, DP-M1 | mittel | PDF: Verteilschlüssel und Zeitanteil, Belegeinsicht | Schritt D2 (Neugestaltung PDF) |
| DP-N1 | niedrig | Rundungsrappen (784.125 → 784.12) | behoben: kaufmännische Rundung (`roundToRappen`) |
| DP-N2 | niedrig | Datum/Apostroph UI vs. PDF | Schritt C (Datumsformat) |
| DP-N3 | niedrig | Stockwerk FR/IT | Schritt D2 |
| DP-N4–N6 | niedrig | paid_amount, Dokument-Kleinigkeiten, Stepper-Umbruch | siehe Runde 2 |
