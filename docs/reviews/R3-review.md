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

## Runde 4 (Code-Review R4 auf c1dd4a4) und Wiederholung der Personas

| # | Schwere | Finding | Behandlung |
|---|---|---|---|
| R4-N1 | mittel | Ungültiges oder leeres «Bezahlt am» im Detaildialog wurde still zu «heute» | ein gesendetes, aber leeres Datum wird abgelehnt («Bitte geben Sie das Zahlungsdatum als TT.MM.JJJJ ein.»); «heute» nur, wenn kein Feld gesendet wurde |
| R4-N2 | niedrig | «heute» in der Zeitzone des Servers (UTC) | `localToday` ist der Tag in der Schweiz (Europe/Zurich), für alle Prüfungen und Vorschläge |
| R4-N3 | niedrig | Listendialog: Meldung zum Datum fehlte, Datum blieb vom letzten Öffnen | Meldung der Prüfung im Dialog; beim Öffnen wieder heute |
| R4-N5 | niedrig | Mahnung vor Fristablauf nur in der App gesperrt | auch im Backend: «Gemahnt wird erst nach Ablauf der Zahlungsfrist.» |
| R4-N8 | niedrig | Vertragsliste ohne ID als letztes Sortierkriterium | ergänzt |
| R4-N9 | niedrig | Bezahlt-Dialoge bei Rückerstattung: Mahnung und «Geld eingegangen» | ohne Satz zur Mahnung; Hilfe «Der Tag, an dem Sie den Betrag überwiesen haben.» |
| R4-N11 | niedrig | Verdrahtung ungetestet | Tests für Dialog → Formulardaten und für `managementFeeKeyed`; Referenz im Mahnbrief über `reminderLetter` getestet |
| Anna-N1, Weber-N1 | mittel | Nach «bezahlt» war das PDF wie versendet weg; ein Download erzeugte es neu | Entscheid wie von CR8-N3 als Alternative vorgeschlagen: das PDF wie versendet bleibt (Archiv), «bezahlt» verwirft es nicht mehr; nur ein fehlendes PDF entsteht neu, dann ohne Zahlteil. Demodaten erzeugen das PDF vor dem Bezahlen (R8-12) |
| Helga-N1 | mittel | «1. Dezember 2026» und «1/12/2026» hiessen «Dieses Datum gibt es nicht» | «Bitte geben Sie das Datum in Ziffern als TT.MM.JJJJ ein …»; «gibt es nicht» nur für einen unmöglichen Tag |
| R4-N4, R4-N6, R4-N7, R4-N10 | niedrig | sehr alte Zahlungsdaten, Download datiert einen Entwurf (gewollt) und alte PDFs ohne IBAN, Beispiele im Design-Guard, fester Zeitraum der Fristen | offen, `offene-punkte.md` |

| Sven-N1 (kritisch), Sven-N2, Sven-N3 | kritisch / hoch | Dialog «Als bezahlt markieren»: ein unmögliches Datum wurde angesagt und trotzdem mit leerem Datum gespeichert (wie R4-N1); Enter im Feld ohne Wirkung; Zukunftsdatum ohne Grund am Feld | Das Datum wird im Dialog geprüft, bevor etwas gesendet wird (dieselbe Regel wie im Server, `paidDateError` in `$lib/statement`): Fehler am Feld, Fokus ins Feld, Dialog bleibt offen; der Server lehnt ein leeres Datum zusätzlich ab. Enter in einem Feld eines Dialogs bestätigt ihn |
| Sven-N4 | mittel | Fokusfalle hielt auf dem versteckten Kalenderfeld | Felder mit `tabindex="-1"` sind kein Tabstopp im Dialog |
| Sven-N6 | niedrig | Nach «Abbrechen» stand beim nächsten Öffnen das alte Datum | beim Öffnen wieder heute (Detail und Liste) |
| Sven-N5, N7, N8 | mittel / niedrig | Fokus startet auf «Abbrechen» vor dem Feld; lange Beschreibung des Dialogs; Fehler nach dem Hilfetext | offen, `offene-punkte.md` |

Hinweis: Im Lauf von Sven wurde in der Persona-Datenbank `dwello_persona` die Abrechnung NK-33333333-2025-0002 ungewollt als bezahlt gespeichert (der Fehler Sven-N1). Die Datenbank wird bei jedem Persona-Lauf neu aufgesetzt.

Wiederholung der Personas auf c1dd4a4: Helga, Anna, Marco und Dr. Weber haben ihre Aufgaben geschafft; Sven den Assistenten (seine Fehler nach Enter werden jetzt angesagt), nicht aber den Bezahlt-Dialog (siehe oben). Alle früheren hohen Findings sind behoben. Offen bleiben die schon begründeten mittleren (Mietzeitraum, Heizprofil und Rundung nur im PDF; Entwurfskasten im Assistenten; Hilfetext Heizprofil; Vorbelegung der Pauschale; Rechnung aus der Warnung).
