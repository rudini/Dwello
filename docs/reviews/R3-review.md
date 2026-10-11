# Review B Runde 8, C Runde 3, D2 Runde 3 – und Persona-Lauf Session 11

Geprüft wurde 7890141, der Merge von B7/C2 und D2 Runde 1–2. Drei unabhängige Prüfungen liefen:
- **Code-Review (CR8):** Mutationstests, eigene Szenario-Tests, PDFs.
- **Fachreview Immobilienverwalter und Mietrecht (R8):** 17 gespeicherte und neu erzeugte PDFs in allen Sprachen, App im Browser.
- **Datenprüfer (DP8):** alle 17 Demo-Abrechnungen mit eigenem Skript nachgerechnet, QR-Codes dekodiert. Alle Beträge sind auf den Rappen genau.

Dazu kam der Persona-Lauf mit Helga, Marco, Dr. Weber, Sven und Anna auf derselben Version; die Berichte stehen in `docs/design/personas/*-s11.md`. Kein Finding war kritisch.

Jede Behandlung hat einen Test, der vorher scheiterte. Ausnahme ist die Rechnungsliste: Der Fehler zeigte sich mit den Persona-Daten, in der Testdatenbank liess ihn PostgreSQL nicht nachstellen (siehe unten).

## Reviews

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| R8-01 | hoch | Mahnung für eine Rückerstattung angeboten; der Brief verlangte «CHF -149.40» | Mahnung nur bei einer Nachzahlung: im Backend abgelehnt («Eine Rückerstattung wird nicht gemahnt …»), in der App nicht angeboten; die Übersicht sagt bei überfälligen Rückerstattungen, dass der Vermieter überweist |
| R8-02 | hoch | Mahnbrief nennt die QR-IBAN ohne QR-Referenz | mit QR-IBAN: «Referenz … (bitte bei der Zahlung angeben)» |
| R8-03 | mittel | Mahnung am Versandtag, Mahnfrist vor der Zahlungsfrist | «Mahnung senden» erst nach Ablauf der Zahlungsfrist (überfällig); Szenario «Keine Mahnung vor Ablauf der Zahlungsfrist» |
| CR8-N1, R8-05 | mittel | Im Versand-Dialog wurde das PDF eines früheren Tages zugestellt; das Versenden verwarf es | Backend: Das PDF eines Entwurfs von einem früheren Tag wird beim Abrufen neu erstellt, mit heutigem Datum; am selben Tag bleibt es beim Versenden |
| CR8-N2 | mittel | Nach dem Versenden bot die Seite ein verworfenes PDF an (404, englisches JSON) | Ein fehlendes PDF wird beim Abrufen erstellt; die Seite übernimmt den Stand des PDF vom Server |
| CR8-N3 | mittel | Als bezahlt markiert: das PDF behielt den Zahlteil | «bezahlt» verwirft das PDF; neu erstellt ohne Zahlteil, mit «Bezahlt am» |
| R8-06 | mittel | App und PDF erklären die Verwaltungspauschale verschieden | App wie PDF: «3 % der Zwischensumme», mit Schlüssel «… der Nebenkosten der Liegenschaft, verteilt nach dem Verteilschlüssel …» |
| DP8-F1, R8-10 | niedrig | «Jun 3.70» und «%» auf zwei Zeilen | geschützte Leerzeichen innerhalb eines Monatsanteils |
| CR8-N4 | niedrig | CD2-5 und DIV2-08 ohne scheiternden Test | offen: visuell geprüft (lange Kategorie im Tankblock bricht um), Texte fr im Review bestätigt |
| R8-04 | niedrig | Mahnungen immer deutsch | offen, `offene-punkte.md` |
| R8-07, R8-08, R8-09, R8-11, R8-13 | niedrig | Hinweis nach dem Speichern einer Rechnung, «Tankbestand» in Assistent und Rechnung, leere Vorschau, en-Begriffe, Hausnummer im QR | offen, `offene-punkte.md` |
| R8-12, DP8-F2, DP8-F3 | niedrig | Demodaten: gespeicherte PDFs bezahlter Abrechnungen, `paid_amount`, kein anteiliger Leistungszeitraum | offen (Demodaten); der Leistungszeitraum über die Jahresgrenze ist in den pg-Tests der Berechnung abgedeckt |

## Persona-Lauf: hohe Findings

| Persona | Finding | Behandlung |
|---|---|---|
| Helga | «1'450.-» abgelehnt, obwohl das Total es mitrechnete | ganze Franken «.-» und «.–» in allen Beträgen (eine gemeinsame Funktion statt zwei) |
| Anna | Kein Feld «Bezahlt am» | Dialog «Als bezahlt markieren» (Detail und Liste) mit Datumsfeld TT.MM.JJJJ, heute vorgeschlagen; ein Datum in der Zukunft wird abgelehnt |
| Anna | Übersicht zeigt eine Zahlungsfrist in 17 Tagen nicht | Fristen: Zahlungsfristen bis 30 Tage voraus (die Frist der App) |
| Marco, Dr. Weber, R8-03 | «Mahnung senden» vor Fristablauf | erst bei überfälliger Nachzahlung |
| Dr. Weber | Verwaltungspauschale in App und PDF verschieden | wie R8-06 |
| Dr. Weber | Rechnungsliste: beim Blättern fehlte eine Rechnung, eine andere stand doppelt | Sortierung mit der ID als letztem Kriterium (Rechnungen, Abrechnungen, Mieter, Dokumente, Gebäude). Ursache: zwei Rechnungen mit gleichem Datum und gleicher Erfassungszeit (Demodaten in einem Zug geladen). Der pg-Test `invoice-paging.pg.test.ts` sichert das Blättern; scheitern liess er sich in der Testdatenbank nicht, PostgreSQL ordnete die gleichen Werte dort stabil |
| Sven | Fehler nach Enter stumm: der Fokus stand schon im fehlerhaften Feld | `focusFirstError` setzt den Fokus neu, auch wenn das Feld ihn schon hat (alle Formulare) |

## Persona-Lauf: mittlere Findings

Behoben:
- **Helga:** Datum ohne Jahr meldet «Es fehlt das Jahr …» statt «Dieses Datum gibt es nicht»; PLZ bei «Per Brief» Pflicht; Ort neben dem Namen in der Mieterauswahl.
- **Anna, Marco:** «Versendet» und «Bezahlt» im Verlauf; Knopf «Als versendet markieren» statt «Versenden» (auch in der Hilfe); Versand-Dialog ohne «Zahlungsfrist» bei Rückerstattungen («Dwello datiert die Abrechnung auf den Tag …»).

Offen, mit Begründung in `offene-punkte.md`:
- Anna: kein Feld «Versendet am» (die App datiert auf den Tag der Markierung, gewollt); bestehende Abrechnungen in Schritt 2 des Assistenten.
- Marco: Hinweis «Entwurf wiederhergestellt» nach dem Erstellen; Heizprofil-Hilfe lang; Pauschale mit 3 % vorbelegt (Einstellung); Rechnung aus der Warnung ohne Kategorie.
- Dr. Weber: Mietzeitraum, Bruch und Heizprofil nur im PDF; Rundung der Spalte «Anteil» in der App; Kaminfeger nach Heizprofil; gespeichertes PDF wird nach dem Bezahlen neu erstellt (kein unveränderliches Archiv).
- Sven: keine Fehlerzusammenfassung; «Abbrechen» vor «Weiter» in Schritt 1; Akonto-Hinweis nicht mit dem Feld verbunden.
