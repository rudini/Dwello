# Datenprüfung W11: Abrechnung NK-22222222-2025-0005 (Nina Brunner, Seepark Residenz 2025)

Worktree c453a49, Persona-DB `dwello_persona`. Ergebnis: **keine Abweichung gefunden**, alle Beträge stimmen auf den Rappen.

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| (keine) | – | – | – | – |

Ein Hinweis ohne Schweregrad (kein Mangel der Änderung): Die Zeile «Rechnung CHF 765.00» der Q4-Zeile nennt keine Rechnung mit Namen; das entspricht der Regel (Text ist einzigartig, Leistungszeitraum vorhanden).

## Methode

- Skript `/tmp/claude-0/-home-user-Dwello/126557cf-b019-554c-839c-007ca93c5405/scratchpad/w11-recompute.py` (Python, Decimal) liest `invoices`, `categories`, `apartments`, `rental_contracts` aus der DB und rechnet ohne Dwello-Code. Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Thema 6, Punkt 8) und `UBIQUITOUS_LANGUAGE.md`.
- Für fr/it/en habe ich die PDFs mit `/tmp/claude-0/-home-user-Dwello/126557cf-b019-554c-839c-007ca93c5405/scratchpad/w11-render.ts` aus dem Worktree-Renderer erzeugt (nur Rendering, `db.update` im Skript auf eine leere Funktion gesetzt, damit nichts geschrieben wird). Danach geprüft: `pdf_generated_at`, `updated_at`, Länge `pdf_blob` unverändert (2026-10-17 03:50:08, 6980). Ausgaben: `.../scratchpad/w11-out/{de,fr,it,en}.pdf`. Die DE-Neuerzeugung ist textgleich (`pdftotext -layout`, diff leer) mit `nina-new.pdf`.

## Neuberechnung (Skriptausgabe) gegen Datenbank und PDF

Eingaben: Mietdauer 01.07.–31.12.2025 = 184 von 365 Tagen; Wohnung 82.00 m² von 320.00 m² (4 Wohnungen); Akonto 240.00 × 6 = 1'440.00; Verwaltungspauschale 3 %.

| Position | Neu berechnet | `utility_statement_line_items` | PDF (de/fr/it/en) |
|---|---|---|---|
| TV/Kabel: Kosten, Wohnungsanteil (1/4), Ihr Anteil (184/365) | 912.00, 228.00, 114.94 | 912.00, 228.00, 114.94 | gleich |
| Heizung: Kosten 1520+790+395+1410, Wohnungsanteil, Ihr Anteil (Heizprofil 44.20 %; Monate 3.7+3.6+3.7+9.5+10.7+13 = 44.2) | 4'115.00, 1'054.47, 466.08 | gleich | gleich |
| Hauswart: Kosten | 765+765+765+572.20 = 2'867.20 | 2'867.20 | gleich |
| Hauswart: Wohnungsanteil | 734.72 | 734.72 | gleich |
| Hauswart: Zeitanteil | 0.334069 (33.41 %) | period_share 0.3341 | 33.41 % |
| Hauswart: Ihr Anteil | 734.72 × 957.8438 / 2'867.20 = 245.4475 → 245.45 | 245.45 | 245.45 |
| Kaltwasser | 2'060.00, 527.88, 266.11 | gleich | gleich |
| Allgemeinstrom | 499.30, 127.95, 64.50 | gleich | gleich |
| Zwischensumme | 1'157.08 | (total_costs − fee) | 1'157.08 |
| Verwaltungspauschale 3 % | 34.71 (34.7124) | 34.71 | 34.71 |
| Ihre Nebenkosten | 1'191.79 | 1'191.79 | 1'191.79 |
| Akonto | 1'440.00 | 1'440.00 | 1'440.00 |
| Saldo vor Rundung | −248.21 | – | 248.21 Rückerstattung |
| Rundung (Rückerstattung aufgerundet auf 5 Rappen) | −0.04 (vom Betrag aus +0.04) | balance −248.25 | + 0.04 |
| Saldo | −248.25 (Rückerstattung) | −248.25 | 248.25 |

## Zeilen unter «Hauswart»: Zuordnung und Benennung

Q4-Rechnung: 765.00 für 01.10.2025–31.01.2026 (123 Tage); im Jahr 2025 92 Tage; 765 × 92/123 = 572.195 → 572.20; Mietstage 92 von 92.

| Zeile im PDF | Rechnung in der DB | Tage / Betrag stimmen | Benennung nach Regel | PDF |
|---|---|---|---|---|
| LZ 01.01.–31.03.2025: 765.00, 0 von 90 | SR-2025-002, Hauswartung Q1 2025 | ja | Text einzigartig, mit LZ: unbenannt | unbenannt, richtig |
| LZ 01.04.–30.06.2025: 765.00, 0 von 91 | SR-2025-005, Q2 | ja | unbenannt | unbenannt, richtig |
| Ohne LZ: 765.00, 184 von 365 | SR-2025-009, Hauswartung Q3 2025 (`invoices[2]`, `invoice_parts[2].noPeriod`) | ja | ohne LZ: immer benannt | «Rechnung «Hauswartung Q3 2025»», richtig |
| LZ 01.10.2025–31.01.2026 (Rechnung 765.00), davon 01.10.–31.12.: 572.20, 92 von 92 | SR-2025-012, Q4 (`invoices[3]`) | ja | Text einzigartig: unbenannt | unbenannt, richtig |

Die Indexpaarung `invoice_parts[i]` ↔ `invoices[i]` stimmt für alle vier Teile (Betrag und Datum: part 3 = 765.00 ohne Periode ↔ Q3; part 4 = 572.20 ↔ Q4). Kein Tankbestand in dieser Abrechnung. Die Formelzeile «Ihr Anteil: 734.72 × (765.00 × 0/90 + 765.00 × 0/91 + 765.00 × 184/365 + 572.20 × 92/92) / 2'867.20 = 245.45» rechnet im Taschenrechner auf (245.4475 → 245.45). Der Zeilenumbruch vor «Q3 2025» (en: «Hauswartung Q3 / 2025») ist nur Layout.

Die Texte sind in fr, it und en inhaltlich gleich und enthalten kein Deutsch ausser dem Rechnungsnamen (Eigenname): fr «(facture « Hauswartung Q3 2025 »)», it «(fattura «Hauswartung Q3 2025»)», en «(invoice ‘Hauswartung Q3 2025’)». Keine Beträge ändern sich zwischen den Sprachen.

Keine Betragsänderung durch #236: Alle Beträge stimmen mit der unabhängigen Rechnung überein; die Pfade der Datenbankwerte (Zeilen, `balance`, `total_costs`) liegen vor der PDF-Erzeugung.

## Geprüft und bestanden

- NK-22222222-2025-0005, alle 5 Positionen (TV/Kabel, Heizung, Hauswart, Kaltwasser, Allgemeinstrom), Zwischensumme, Pauschale, Nebenkosten, Akonto, Rundung, Saldo.
- Hauswart-Zeilen (4): Beträge, Tage, Rechnungszuordnung, benannt/unbenannt.
- Stored PDF (DE) = Neuerzeugung (DE) textgleich; fr, it, en neu erzeugt und verglichen.
- Heizprofil-Seite 2: Monatsanteile Jul–Dez summieren auf 44.20 %.

## Nicht bestätigt

- **QR-Rechnung:** Die Abrechnung ist eine Rückerstattung (Saldo −248.25); das PDF hat korrekt keinen Zahlteil (2 Seiten, `pdfimages -list` leer, kein QR-Code). Es gibt daher keinen QR-Code, dessen IBAN, Betrag, Referenz oder Prüfziffer zu entschlüsseln wäre. `qr_bill_reference` 005774562379134743330512445 ist in der DB gesetzt, wird aber nicht gedruckt; ihre Prüfziffer habe ich nicht geprüft. Eine QR-Rechnung mit Nachzahlung wurde in dieser Änderung nicht erzeugt und ist hier nicht geprüft.
- **Web-Seite:** Die Detailseite in der Oberfläche (:3300) habe ich nicht gegen die PDF-Werte verglichen (Anmeldung per OAuth nötig, ohne Änderung der Daten nicht erreichbar). Die Betragswerte der Seite stammen aus denselben Datenbankwerten, die ich bestätigt habe.
- **fr/it/en über die API:** `POST /generate-pdf` und `GET /pdf` einer Entwurfsabrechnung überschreiben `pdf_blob`; ich habe darum den Renderer des Worktrees mit gesperrtem Schreibzugriff benutzt (siehe Methode), nicht die laufende App.
- Die Regel «Text gleich einer anderen Zeile derselben Position» (Zeilen mit gleichem Leistungszeitraum, Betrag und Tagen) kommt in diesem Datensatz nicht vor; der benannte Fall mit Leistungszeitraum ist hier nicht geprüft.
