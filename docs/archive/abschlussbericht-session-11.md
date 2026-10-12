# Abschlussbericht Session 11 – offene Punkte, fehlende Rechnungen, Datumsfeld, PDF der Nebenkostenabrechnung

Stand: Branch `claude/relaxed-ride-tciycq`, Oktober 2026. Reihenfolge wie verlangt: A → B → C → D1 → D2. Danach kamen Persona-Lauf und Nachrunden.

Nach jedem Schritt prüften unabhängige Reviewer mit frischem Kontext:
- **Code-Review:** Diff, Tests, laufende App bzw. PDF.
- **Fachreview für B und D:** Immobilienverwalter/Treuhänder und Mietrecht.
- **Datenprüfer:** rechnet mit eigenem Skript aus der Datenbank nach.

Findings mit Schwere kritisch, hoch oder mittel wurden behoben. Offene niedrige sind schriftlich begründet. Jede Runde ist in `docs/reviews/` festgehalten.

## Abnahme

| Prüfung | Ergebnis |
|---|---|
| Frontend `npm run test:coverage` | 1450 Tests grün, Abdeckung über der Untergrenze |
| `npm run lint`, `npm run check` | 0 Fehler, 0 Warnungen |
| Backend `bun run test`, `bun run type-check` | 588 Tests grün, 89.4 % Zeilen (Minimum 82 %), Type-Check sauber |
| E2E (`npm run test:e2e`, chromium und api) | 433 von 433 grün, Barrierefreiheit (axe) in allen Ansichten ohne Verstösse |
| `fallow audit` | keine neuen Findings |
| PDF | erzeugt und angesehen; Beispiele in `docs/beispiele/` |
| Datumsfelder | überall TT.MM.JJJJ, unabhängig von der Sprache des Browsers |

## Änderungen je Aufgabe

### A – Seed-Daten und PDF-Inhalt (`A-review-1.md`, `A-review-2.md`)
- **Demodaten:** je Gebäude und Jahr alle Mietverträge, insgesamt 17 Abrechnungen, davon 2024 bezahlt und Musterhaus 2025 teils versendet. Mieterwechsel in Seepark A2, Tank im Musterhaus, Postadressen aller Mieter.
- **Gespeichert mit der Abrechnung:** Verteilschlüssel der Verwaltungspauschale und Heizprofil.
- **QR-Adressen** wie im QR-Code.
- **Deutsche Beschreibungen** der Stammdaten.

### B – Prüfung fehlender Rechnungen je Kategorie (`B-review-1.md` … `B-review-7.md`)
- **Vergleich mit dem Vorjahr** je Kategorie, mit Rhythmus (Quartal, Halbjahr), Leistungszeitraum und Gutschriften. Ergebnis: weniger Fehlalarme, verständliche Hinweise im Assistenten.
- **Tank:** «Brennstoff im Tank oder Lager» mit Stichtagen. Abgerechnet wird der Verbrauch (Anfang + Einkauf − Ende).
- **Nur Mietverträge ohne Abrechnung** werden erstellt.
- **Später erfasste Rechnungen:** Hinweis auf der Abrechnung und an der Rechnung, mit dem gleichen vorsichtigen Text zur Berichtigung versendeter Abrechnungen.
- **Leistungszeitraum** auf Rechnungen, tagesgenau anteilig.
- **Heizprofil «Nur Warmwasser»** entfernt (Recherche: keine Verteilung nur für Warmwasser).

### C – Schweizer Datumsfeld TT.MM.JJJJ (`C-review-1.md`, `B-review-7.md`, `R3-review.md`)
- **Eingabe:** ein gemeinsames `DateInput` für alle Datumsfelder. Textfeld mit Zifferntastatur; die Punkte kommen von selbst.
- **Gelesen werden** «1.1.2025», «01012025», «31.12.24» und eingefügtes «2024-12-31». Ein zweistelliges Jahr gilt erst beim Verlassen, beim Senden oder bei Enter. Bis 20 Jahre voraus heisst es 20JJ, sonst 19JJ.
- **Unter dem Feld** steht das Datum in Worten, mit dem Feld verbunden (`aria-describedby`).
- **Meldungen** sagen, was falsch ist: «Dieses Datum gibt es nicht», «Es fehlt das Jahr», «Bitte geben Sie das Datum in Ziffern … ein». Sie erscheinen beim Verlassen bzw. Senden und werden angesagt.
- **Kalender** des Browsers über einen Knopf.
- **Geprüft** mobil bei 390 px und in den Browsersprachen en-US und de-DE. Das Formular sendet JJJJ-MM-TT.

### D1 – Anforderungen (`docs/nebenkostenabrechnung-anforderungen.md`, `D1-review-1.md`)
- **Je Anforderung:** Quelle, Umsetzung im PDF, Sicherheit.
- **Rechtsgrundlagen:** Art. 257a/b OR, VMWG Art. 4–8, SIX-Richtlinien QR-Rechnung. Keine ist erfunden. Fedlex war nicht erreichbar; alles Nicht-Nachgelesene ist als «unsicher» gekennzeichnet.

### D2 – PDF neu gestaltet (`D2-review-1.md`, `D2-review-2.md`, `R3-review.md`)
- **Seitenaufbau:** A4, mehrseitig. Kopfzeile mit Absender und «Seite x von y», Fusszeile mit Liegenschaft und Periode.
- **Saldo zuerst** in einem Kasten: Nachzahlung mit Frist, Rückerstattung mit Termin, Ausgeglichen, Bezahlt am / Überwiesen am.
- **Kostentabelle je Kategorie:**
  - Verteilschlüssel mit Bruch (z. B. «75.50 / 492.50 m²»); ein gemischter Schlüssel als Rechnung, «70 % × 75.50 / 492.50 m² + 30 % × 1 / 6 Wohnungen».
  - Kosten Liegenschaft, Wohnungsanteil, Zeitanteil («181/365 Tage» oder Heizprofil), Ihr Anteil.
  - Zwischensumme, Verwaltungspauschale mit Grundlage, Akonto, Saldo.
  - Werte zum Zeitpunkt der Erstellung gespeichert (Migration 0011).
- **Heiz- und Warmwasserkosten:** Heizprofil mit Monatsanteilen. Tankherleitung aus den gespeicherten Ständen.
- **Hinweise:** Belegeinsicht (Art. 257b Abs. 2 OR), detaillierte Heizkostenabrechnung und Auskunft zum Bestand (Art. 8 VMWG). Keine Einsprachefrist.
- **QR-Zahlteil nach SIX:**
  - 62 mm Empfangsschein und 148 mm Zahlteil, QR-IBAN mit QR-Referenz.
  - Die Mitteilung steht in der Sprache des PDF, gedruckt wie im QR-Code.
  - Nur bei offener Nachzahlung.
- **Sprachen:** de, fr, it, en. Rätoromanisch vorerst ganz deutsch, mit Hinweis im Mieterformular.
- **Datum und Frist** gelten ab dem Versand. Das PDF eines Entwurfs von einem früheren Tag wird neu erstellt. Das PDF wie versendet bleibt nach der Zahlung erhalten.

### Nachrunden (Personas und Reviews 3–8, `R3-review.md`)
- **Mahnung:** nur für eine überfällige Nachzahlung, in App und Backend. Der Mahnbrief nennt die QR-Referenz.
- **«Als bezahlt markieren»** mit Feld «Bezahlt am»:
  - im Dialog geprüft, bevor gesendet wird;
  - Enter bestätigt;
  - Bestätigung und Fokus auf den Titel danach.
- **Übersicht:** Zahlungsfristen bis 30 Tage voraus.
- **Verwaltungspauschale** in App und PDF gleich erklärt.
- **Blättern:** stabile Sortierung der Listen (Rechnungen, Abrechnungen, Mieter, Dokumente, Gebäude, Verträge).
- **«Heute»** ist der Tag in der Schweiz.
- **Beträge** «1'450.-» werden verstanden.
- **Mieter:** PLZ bei «Per Brief» Pflicht; Ort neben dem Namen in der Mieterauswahl.
- **Verlauf** mit «Versendet» und «Bezahlt»; Knopf «Als versendet markieren».
- **Fokus nach einem Fehler:** wird neu gesetzt, auch wenn das Feld ihn schon hat. Der Screenreader liest den Fehler nach Enter vor.

## Findings und Status

Jedes Finding steht mit Schwere und Behandlung in der Tabelle seiner Runde.

| Runde | Dokument | Status kritisch, hoch, mittel | Niedrig |
|---|---|---|---|
| A 1–2 | `A-review-1.md`, `A-review-2.md` | alle behoben | behoben oder begründet offen |
| B 1–7 | `B-review-1.md` … `B-review-7.md` | alle behoben | behoben oder begründet offen |
| C 1–2 | `C-review-1.md`, `B-review-7.md` | alle behoben (darunter ein kritisches: «31..12.2024») | behoben oder begründet offen |
| D1 1–2 | `D1-review-1.md`, Runde 2 in `D2-review-1.md` | alle behoben | behoben |
| D2 1–2 | `D2-review-1.md`, `D2-review-2.md` | alle behoben | behoben oder begründet offen |
| Review 3 (B8, C3, D2R3), Personas | `R3-review.md` | alle behoben | behoben oder begründet offen |
| Reviews 4–8, Persona-Wiederholungen | `R3-review.md` | alle behoben (darunter ein kritisches im Bezahlt-Dialog) | behoben oder begründet offen |

Die letzte Runde (Review 8, im echten Chromium geprüft) fand nichts über «niedrig». Ihr einziges Finding, ein fehlender Test für den Fokus in der Liste, ist ergänzt.

## Fachreview

- **Immobilienverwalter/Treuhänder und Mietrecht (Runde 8):**
  - Das PDF ist in de, fr, it und en versandbereit, bei Nachzahlung wie bei Rückerstattung. Rechnung, Schlüssel, Tank, Mieterwechsel und QR-Rechnung sind korrekt.
  - Die Pflichthinweise stehen drin, eine unzulässige Einsprachefrist gibt es nicht.
  - Die hohen Findings zur Mahnung (Rückerstattung gemahnt, QR-IBAN ohne Referenz) sind behoben.
- **Datenprüfer (Runde 8):** Alle 17 Demo-Abrechnungen gehen auf den Rappen auf. Grundlage sind die DB-Werte, die gedruckte Taschenrechner-Probe (auch der gemischte Schlüssel) und die dekodierten QR-Codes (IBAN, Betrag, QRR-Prüfziffer, Referenz von rechts gruppiert, Mitteilung, Debitor).

## Persona-Lauf (`docs/design/personas/*-s11.md`)

| Persona | Aufgabe | Ergebnis | Wiederholung |
|---|---|---|---|
| Helga, 68 | Mieterin und Mietvertrag erfassen (Zoom 200 %) | geschafft; hoch: «1'450.-» abgelehnt | geschafft, alles behoben |
| Marco, 38 | Abrechnungen 2025 Alpenblick mobil | geschafft; hoch: «Mahnung senden» sofort nach dem Versand | geschafft, alle hohen behoben |
| Dr. Weber, 52 | Abrechnungen und PDF prüfen, nachrechnen | alle Zahlen auf den Rappen; hoch: Pauschale App ≠ PDF, Rechnungsliste beim Blättern | behoben |
| Sven, 45 | Mietvertrag nur mit Tastatur, Screenreader | geschafft; hoch: Fehler nach Enter stumm | behoben; drei weitere Läufe für den Bezahlt-Dialog, zuletzt im echten Chromium bestätigt |
| Anna, 29 | nach Monaten: was ist zu tun? | geschafft; hoch: kein «Bezahlt am», Frist nicht in der Übersicht | geschafft, behoben |

## Beispiel-PDFs (`docs/beispiele/`)

- `nebenkostenabrechnung-musterhaus-mueller-2025.pdf`: versendet, gemischter Heizschlüssel, Tank, QR-Zahlteil
- `nebenkostenabrechnung-seepark-meier-2025.pdf`: Mieterwechsel (181/365 Tage, Heizprofil mit Monaten)
- `decompte-musterhaus-dubois-2025.pdf`: französisch, QR-Mitteilung französisch
- `nebenkostenabrechnung-seepark-weber-2024-bezahlt.pdf`: bezahlte Rückerstattung, «Überwiesen am»

## Offene Punkte

Alle Punkte stehen mit Begründung in `docs/design/offene-punkte.md`, Abschnitte «Session 11». Die wichtigsten:

- **Rechtliches nachlesen:** Die Normen auf Fedlex und die SIX-Richtlinien vor der ersten Installation nachlesen (alles «unsicher»). Zu prüfen: Herkunft der Monatsanteile der Heizprofile, Glossar-Vorschläge (Zeitanteil, Anfangs-/Endbestand, Empfangsschein/Zahlteil), Basis der Verwaltungspauschale ohne Schlüssel – TODO(fachlich prüfen).
- **Fehlt fachlich:**
  - Liter, Lieferdaten und Bewertung des Tankbestands (nur CHF).
  - Telefon und E-Mail des Vermieters in der Konfiguration (Rückerstattung bittet um IBAN).
  - Mitmieter.
  - Akonto je Monat bei Änderungen.
  - Rätoromanische Übersetzung (Muttersprachige).
- **Zeit:** «Überfällig» rechnet das Backend in UTC, bis zu zwei Stunden hinter dem Schweizer Tag.
- **Mahnung:** Die 2. Mahnung ist sofort nach der 1. möglich. Mahnungen gibt es nur auf Deutsch.
- **Zahlungsdatum:** Es gibt keine Untergrenze (ein sehr altes Datum wird angenommen).
- **Bedienung:**
  - Am Desktop verschiebt der Fehler beim Verlassen des Datumsfelds den Knopf im zentrierten Dialog; der erste Klick geht verloren.
  - Tab-Reihenfolge im Bezahlt-Dialog: Knopf vor Feld.
  - Kein Feld «Versendet am»: die App datiert auf den Tag des Markierens, so gewollt.
- **Mittlere Persona-Punkte ohne Änderung:** Mietzeitraum, Bruch und Heizprofil nur im PDF, nicht in der App; Hilfetext Heizprofil lang; Pauschale mit 3 % vorbelegt; Entwurfskasten im Assistenten; keine Fehlerzusammenfassung.
