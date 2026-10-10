# Review B, Runde 2 – Korrekturen am Fachmodell

Vier unabhängige Prüfungen auf Commit 0a10dca (Bereich 794b141..0a10dca): Code-Review (CR2), Fachreview Immobilienverwalter/Treuhänder (IV2), Fachreview Mietrecht (MR2), Datenprüfer (DP2, alle 17 Demo-Abrechnungen mit eigenem Skript nachgerechnet: 16 genau, eine um 1 Rappen anders, siehe DP2-N1).

Während der Prüfung lief das Backend auf Port 3001 kurz mit altem Code (DP2-H1); es wurde neu gestartet, Code-Review und Immobilienverwalter haben ihre Prüfungen über die App danach wiederholt.

Gleiche Befunde mehrerer Prüfer sind zusammengefasst. Alle Behandlungen sind umgesetzt (Commit nach 0a10dca, «fix(statements): …»); jede mit einem Test, der vorher scheiterte. Die Prüfung in Runde 3 bestätigt den Stand.

## Tankbestand

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CR2-H1, MR2-H1, IV2-2 | hoch | Fehlt ein Stand genau am Vortag des Periodenbeginns oder am letzten Tag, rechnet die Abrechnung still nach Einkauf | Prüfung meldet den fehlenden Stichtag (Art «stock»), der Assistent verlangt eine Bestätigung; Stände nur an genauen Stichtagen, der Hinweis nennt das Datum |
| CR2-H2, MR2-H2, IV2-5, DP2-N5 | hoch | Kategorie über den Namen «Heating», Schlüssel der letzten Heizungsrechnung, `isValidUtilityCost` nicht geprüft | Kategorie wird mit dem Stand erfasst (nur Heiz- und Warmwasserkosten, Migration 0009); Schlüssel der letzten umlagefähigen Rechnung dieser Kategorie, sonst der Standard-Verteilschlüssel |
| CR2-M1 | mittel | Ohne Heizungsrechnung fällt der Verbrauch weg | wie CR2-H2: Verbrauch wird immer in der Kategorie des Stands abgerechnet |
| CR2-M2, MR2-M4, IV2-3, DP2-N4 | mittel / hoch | Prüfung vergleicht beim Heizöl Einkäufe statt Verbrauch | Bestandsveränderung zählt in der Prüfung mit (Verbrauch), aber nicht für den Rhythmus |
| MR2-N6 | niedrig | Negativer Verbrauch ohne Hinweis | Prüfung meldet ihn (Art «stock») |
| CR2-M3 (Code) / CR2-M2 (Runde 2b) | mittel | Endpunkte: 30.02. und Nicht-UUID ergeben 500, unbekanntes Gebäude `[]` | Datumsprüfung `isRealDate` (auch für CR2-N4), UUID-Schema am DELETE, 404 für unbekanntes Gebäude, 400 für Kategorie ohne Heizkosten |
| CR2-M4 | mittel | BFF-Löschen: `stockId` ungeprüft in der URL, Antwort ignoriert | UUID-Prüfung, Fehler wird gemeldet |
| CR2-M5 | mittel | Löschen ohne Bestätigung | Bestätigungsdialog mit Folge |
| MR2-M1, IV2-4 | mittel | Bewertung in Franken ohne Anleitung; Auskunft über Anfangs-/Endbestand | Hilfetext zur Bewertung (Liter × Preis der letzten Lieferung, TODO fachlich prüfen); Ausweis im PDF in Schritt D2 |
| IV2-7 | mittel | Vorschau/PDF zeigen Anfangsbestand + Einkauf − Endbestand nicht | Schritt D2 (PDF) |
| DP2-M2 | mittel | Demodaten: Alpenblick heizt mit Öl ohne Stände | Stände für Alpenblick ergänzt |
| IV2-13 | niedrig | Bereich auf jedem Gebäude, Titel nennt nur Heizöl | Titel «Heizöl oder Pellets im Tank»; bleibt sichtbar, damit der Bestand auffindbar ist |
| CR2-N8 | niedrig | Ladefehler als leere Liste, kein Erfolgshinweis | Ladefehler wird angezeigt, Erfolg bestätigt |

## Berechnung

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| IV2-1 | hoch | Periode unter einem Jahr: auch der Mieter der ganzen Periode trägt nur die Profilanteile seiner Monate | Anteil = Profilanteil der Mietmonate ÷ Profilanteil der Periodenmonate |
| DP2-M1 | mittel | Zwischensumme mit ungerundetem Heizanteil, Positionen gerundet | Heizanteil vor der Summe gerundet |
| MR2-M5 | mittel | Separates Warmwasser folgt dem Heizprofil | Warmwasser nach Tagen (Migration 0009); Heizung und Warmwasser zusammen bleiben in «Heizung» mit dem Profil «Heizung + Warmwasser» |
| CR2-N3 / CR2-N4 | niedrig | Anteil mit Leistungszeitraum nicht auf Rappen gerundet | gerundet in `inPeriod` |
| CR2-N1 | niedrig | Gruppe mit Summe 0 (Rechnung und Gutschrift mit verschiedenen Leistungszeiträumen) ergibt Anteil 0 | offen, siehe unten |
| CR2-N2 | niedrig | Heizprofil ignoriert den Leistungszeitraum | offen, siehe unten |
| DP2-N1 | niedrig | Wohnungsanteil wird vor dem Zeitanteil gerundet | dokumentiert in `docs/data-model.md` |
| CR2-M6 (Code) | mittel | Ältere Abrechnungen mit Pauschale «pro Wohnung» bekämen im PDF die neue Erklärung | keine Änderung: es gibt noch keine Installation (CLAUDE.md); alle Demo-Abrechnungen werden mit dem aktuellen Code erzeugt |

## Leistungszeitraum, Texte, Prüfung

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| MR2-M3, IV2-6 | mittel | Rechnungen in bestehenden Abrechnungen lassen sich ändern (doppelt oder gar nicht abgerechnet); Öllieferung mit Leistungszeitraum | Hinweis beim Bearbeiten einer Rechnung, deren Periode schon Abrechnungen hat; Hilfetext «nicht für Heizöl- oder Pelletlieferungen» |
| MR2-M2, IV2-8 | mittel | Hilfetext verspricht Zählerstände beim Mieterwechsel | Text: Dwello verteilt nach Heizprofil, Zwischenablesung von Hand berücksichtigen |
| MR2-M6 | mittel | Akonto-Erhöhung ohne Kündigungstermin, Frist, Begründung | Text ergänzt (Art. 269d OR) |
| MR2-N1 | niedrig | Neue Kategorie: was tun, wenn nicht vereinbart | Text ergänzt |
| MR2-N2 | niedrig | Richtwert 3 % | Glossar nennt 3 % als Richtwert; bleibt, offener Punkt |
| MR2-N3 | niedrig | Ein Satz pro Lauf | Hilfetext ergänzt |
| MR2-N4 | niedrig | Nachforderung klingt immer möglich | Text abgeschwächt, TODO(fachlich prüfen) |
| MR2-N5 | niedrig | Leistungszeitraum freiwillig | Hilfetext ergänzt |
| CR2-N5, IV2-12 | niedrig | Abdeckung nach Rechnungsdatum | Abdeckung nach Leistungszeitraum in der Periode |
| CR2-N6 | niedrig | Warnung nennt Rechnungsdatum, auch wenn der Leistungszeitraum der Grund ist | Text je nach Ursache |
| CR2-N7 | niedrig | Verrutschte Kommentare | korrigiert |
| IV2-9 | niedrig | Abweichung durch anteiligen Leistungszeitraum | offen, siehe unten |
| IV2-10 | niedrig | Wechsel von Monats- zu Quartalsrechnungen meldet Lücken; lange Aufzählung | offen, siehe unten |
| IV2-11 | niedrig | Gutschrift allein ergibt «Neu» | «Neu» nur bei positivem Betrag |
| IV2-14 | niedrig | Glossar-Abweichungen nicht in offenen Punkten | waren schon als Glossar-Vorschläge eingetragen (Leistungszeitraum, Tankbestand, Pauschale, Heizkosten-Eigenschaft) |

## Daten und Dokumentation

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| DP2-H1 | hoch | Backend lief mit altem Code | neu gestartet (Watch-Modus) |
| DP2-N2 | niedrig | Seed-Doku D5, P8, P12 veraltet | nachgeführt |
| DP2-N3 | niedrig | Kein Leistungszeitraum in den Demodaten | eine Demo-Rechnung mit Leistungszeitraum |

## Offene niedrige Findings mit Begründung

- **CR2-N1:** Rechnung und Gutschrift in derselben Kategorie und Gruppe mit genau der Summe 0 und verschiedenen Leistungszeiträumen kommen praktisch nicht vor; eine Korrektur verlangt eine Berechnung pro Rechnung statt pro Gruppe (grösserer Umbau). Kommentar im Code.
- **CR2-N2:** Das Heizprofil verteilt Jahreskosten auf Monate; Heizrechnungen mit kurzem Leistungszeitraum (Quartal) sind mit Profil fachlich offen (TODO(fachlich prüfen) in `offene-punkte.md`).
- **IV2-9, IV2-10:** Hinweise, keine Fehler; der Text fordert zum Prüfen auf. Verfeinerung der Regeln ist ein offener Punkt.
