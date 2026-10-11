# Review B, Runde 3

Vier unabhängige Prüfungen auf Commit dc44665 (Bereich 0a10dca..dc44665): Code-Review (CR3), Fachreview Immobilienverwalter/Treuhänder (IV3), Fachreview Mietrecht (MR3), Datenprüfer (DP3: alle 17 Demo-Abrechnungen mit eigenem Skript nachgerechnet, alle Positionen und Kopfwerte genau; Prüfung auf fehlende Rechnungen für alle Gebäude 2025 und 2026 wie erwartet).

Bestätigt behoben aus Runde 2: alle Findings kritisch/hoch; offen blieben einzelne mittlere (siehe unten, jetzt behoben). Alle Behandlungen unten sind umgesetzt, jede mit einem Test, der vorher scheiterte.

## Findings

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| CR3-2, MR3-M1 | mittel | PDF nennt bei Periode unter einem Jahr einen anderen Heizanteil als die Berechnung; «Jahreskosten» | PDF nimmt denselben Anteil (`handleMidYearMoves`), Text «der Heizkosten Ihrer Wohnung in der Abrechnungsperiode» (5 Sprachen) |
| CR3-1 | mittel | Kategorie mit Tankbestand: Rhythmus der Einkäufe meldet falsche Lücken | Keine Rhythmusprüfung, wenn eine Bestandsveränderung dabei ist |
| MR3-M2, IV3-4 | mittel | Hilfetext verlangt Anpassung von Hand, die Dwello nicht kann | «Dwello … kann Zählerstände nicht berücksichtigen … Erstellen Sie die Abrechnung dieser Wohnung dann ausserhalb von Dwello.» |
| MR3-M3 | mittel | Fehlender Stichtag: Text nennt die rechtliche Folge nicht | «Abrechnen dürfen Sie aber nur den Verbrauch … Bestätigen Sie nur, wenn der Tank am Anfang und am Ende gleich voll war.» |
| MR3-M4 | mittel | Heizkosten ohne jeden Tankbestand: kein Hinweis | Hinweis «Heizen Sie mit Öl oder Pellets? …» (Art `tank`, ohne Bestätigung, mit Link zum Gebäude) |
| IV3-1, CR3-10 | mittel / niedrig | Kaminfeger als Tank-Kategorie, Anfangs- und Endbestand in verschiedenen Kategorien | Ein Tank, eine Kategorie: abweichende Kategorie wird abgelehnt (409, Meldung im Formular); Kategorie der bisherigen Stände vorgewählt |
| IV3-2 | mittel | Warnung «schon abgerechnet» auch für nicht umlagefähige oder später erfasste Rechnungen | Nur umlagefähige Rechnungen, nur Abrechnungen, die nach dem Erfassen der Rechnung erstellt wurden |
| IV3-3, MR3-N3, MR3-N4 | mittel / niedrig | Warnung nennt nicht alle Felder, nichts zu versendeten Abrechnungen, fehlt beim Löschen | «Ändern Sie diese Rechnung, stimmen diese Abrechnungen nicht mehr. Entwürfe erstellen Sie neu; versendete oder bezahlte Abrechnungen berichtigen Sie gegenüber dem Mieter.»; Warnung auch im Löschdialog mit «Bewahren Sie den Beleg auf: Der Mieter kann Einsicht verlangen.» |
| IV3-5 | mittel | Gebäude ohne Rechnungen: Tank-Hinweis unterdrückt, Text «CHF 0.00 Nebenkosten» falsch | Tank-Hinweise auch dort; Text «Ohne Rechnungen fehlen deren Kosten …, und die Mieter erhalten ihr Akonto weitgehend zurück.» |
| IV3-12 | mittel | Laufende Periode ohne Warnung | Warnung im Schritt 1 «Die Abrechnungsperiode ist noch nicht zu Ende. …» (axe-Zustand `period-not-over`) |
| CR3-7 | niedrig | Doppelter Schlüssel bei gleichem Periodenbeginn | Schlüssel Beginn und Ende (gemeinsame Komponente `BilledWarning.svelte`) |
| CR3-3, DP3-N2, IV3-10 | niedrig | Schlüssel des Tankbestands ohne Datumsgrenze | Letzte umlagefähige Rechnung bis Periodenende, sonst eine spätere |
| CR3-4 | niedrig | Stillgelegter Tank meldet jedes Jahr | Kein Stand ab Vortag der Periode: kein Hinweis |
| CR3-5 | niedrig | Nicht umlagefähige Heizkategorie für den Tank | abgelehnt (400) |
| CR3-6, DP3-N1 | niedrig | Bestandsveränderung zählt als Rechnung | zählt nicht mehr in der Anzahl |
| CR3-8 | niedrig | Gebäudeseite fällt aus, wenn Kategorien fehlen | Seite lädt, Auswahl leer, Hinweis mit Link zu den Kategorien |
| CR3-9 | niedrig | Löschfehler erscheint als «Nicht gespeichert» im Formular | eigene Meldung «Nicht gelöscht» bei der Liste |
| CR3-12 | niedrig | Einrückung | korrigiert |
| IV3-7 | niedrig | Löschdialog «beginnen oder enden» ungenau | «am Tag danach beginnen oder an diesem Tag enden» |
| IV3-8 | niedrig | Linktext und Schlusssatz passen nicht zum Tank | «Tankbestände prüfen» bei negativem Verbrauch, eigener Schlusssatz, kein «Rechnung erfassen» nur für den Tank |
| IV3-11 | niedrig | Bewertung 31.12.2023 mit späterem Preis | Kommentar in den Demodaten nennt die Annahme |
| IV3-13 | niedrig | Englische Positionsnamen? | geprüft: das BFF zeigt den deutschen Kategorienamen (`src/lib/server/statement.ts`, Test `statement-mapping.test.ts`); keine Änderung |
| MR3-N1 | niedrig | Akonto «gilt erst», Nichtigkeit fehlt | «frühestens», «Ohne Formular oder Begründung ist sie nichtig.» |
| MR3-N2 | niedrig | Neue Nebenkosten: Frist, Nettomiete | Text ergänzt (Kündigungstermin, Senkung der Nettomiete) |
| MR3-N6 | niedrig | Bewertung, wenn mehr im Tank als die letzte Lieferung | Hilfetext ergänzt; Liter und Preis im PDF: Schritt D2 |
| MR3-N7 | niedrig | «fehlt» bei zwei Daten | «fehlen» |
| MR3-N5 | niedrig | Profil «Nur Warmwasser» wirkt nicht mehr | Profil entfernt (Migration 0010, Entscheid nach Recherche); Glossar-Abweichung als Vorschlag in `offene-punkte.md` |
| MR3-N7 (PDF Belegeinsicht) | niedrig | Kein Hinweis auf Belegeinsicht im PDF | Schritt D2 |
| IV3-6 | niedrig | Stand in der Zukunft | offen, begründet (`offene-punkte.md`) |
| IV3-9 | niedrig | Negativer Verbrauch über die ganze Kategorie | offen, begründet |
| CR3-11 | niedrig | Migration 0009 über den Namen | offen, ohne Installation harmlos |
| DP3-I1, DP3-I2 | Info | Endbestand einer laufenden Periode; keine Warmwasser-Rechnung in den Demodaten | Warnung zur laufenden Periode (IV3-12); Warmwasser per Test abgedeckt |
