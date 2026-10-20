# Datenprüfung Issue #448, Runde 1

Stand: Worktree `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-448-daten` (Commit b6e07917). Datenbank `dwello_persona` nur gelesen. Eigene Rechnung: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/check/recompute.py` (aufrufen mit `python3 -I recompute.py`; liest Rechnungen, Verteilschlüssel, Verträge, Akonto, Heizprofile, Brennstoffbestände aus der Datenbank, nutzt keinen Dwello-Code). PDFs: `pdf_blob` aus der Datenbank, abgelegt unter `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/pdf/`.

## Ergebnis in Kürze

Kein Blocker, kein Major. Alle Beträge der drei betroffenen Abrechnungen stimmen auf den Rappen mit meiner Rechnung überein, ebenso alle übrigen 14 Abrechnungen (Kontrolle). Es gibt zwei Minor/Nit-Befunde zu den von Hand vorbereiteten Daten und zur Darstellung. Web-Seite und PDFs in fr/it/en konnte ich ohne Anmeldung nicht prüfen (siehe «Nicht bestätigt»).

Antwort auf die Rundungsfrage: Der Saldo −37.56 wird zu −37.60. Das ist die Regel. `docs/nebenkostenabrechnung-anforderungen.md`, Thema Betragsformat und Nr. 8 «Saldo und Rundung»: «nur zugunsten des Mieters auf 5 Rappen gerundet (#79): eine Nachzahlung ab-, eine Rückerstattung aufgerundet». Kaufmännisch wäre −37.55 (zugunsten des Vermieters). Der Wert −37.55 wäre also falsch. Die Zeile im PDF «Rundung auf 5 Rappen + 0.04» folgt der Vorzeichenregel der Anforderungen («vom Betrag aus gesehen: wird er grösser, steht +»).

## Befunde

| ID | Schwere | Datensatz | Erwartet | Ist |
|---|---|---|---|---|
| D-1 | Nit | NK-22222222-2024-0001 (Daten) | `total_advance_payments` = Akonto aus dem Vertrag: 12 × CHF 200.00 = 2'400.00 (Vertrag b0000002-…-0001, gültig ab 01.04.2022); `advance_lines` gefüllt; Saldo dann −70.25 | von Hand 2'332.76, `advance_lines` NULL. Saldo −3.00 stimmt nur mit diesem Handwert (2'329.76 − 2'332.76). Das PDF zeigt deshalb «Akontobeiträge – 2'332.76» ohne Zeile «12 Monate × CHF …». Berechnet Dr. Weber die Abrechnung 2024 neu, wird der Saldo −70.25, sie ist nicht mehr «Erledigt», und der Übertrag in NK-22222222-2025-0001 hängt an einem Saldo, den es dann nicht mehr gibt. Kein Fehler der App, sondern der Testdaten; bei der Persona-Auswertung vermerken. |
| D-2 | Nit | NK-22222222-2025-0001, PDF Seite 1 | Zeile «Übertrag aus Abrechnung NK-22222222-2024-0001: CHF 3.00 / – 3.00» | Der Beschriftungstext bricht in der linken Spalte auf drei Zeilen um («Übertrag aus Abrechnung / NK-22222222-2024-0001: / CHF 3.00»); der Betrag steht doppelt (im Text und rechts). Inhalt und Betrag richtig, nur das Layout. |
| D-3 | Nit | NK-11111111-2025-0001 (Daten) | Bemerkung passt zur Zahlung | Bemerkung «Teilzahlung von Hans Müller im Januar 2026 erhalten.» steht unter «Hinweise», während der Kopfkasten «Bezahlt am 15.01.2026. Vielen Dank.» und `paid_amount` = 215.80 (voller Saldo) zeigen. Das ist ein Freitext der Persona, die App gibt ihn unverändert wieder; ein Hans Müller, der das PDF liest, sieht aber «Teilzahlung» bei voll bezahlter Rechnung. Kein Fehler, nur zur Kenntnis. |

## Nachweise

### 1. NK-22222222-2024-0001 (Erledigt, Saldo −3.00)

Rechnung (Rappen genau):

- Kategorien: TV 912.00 × 1/4 = 228.00. Hauswart 3'000.00 (4 × 750.00) × 68/320 = 637.50. Heizung 4'060.00 (1'480 + 820 + 410 vom Jahr 2024, plus 1'350.00 aus der Rechnung vom 20.01.2025 mit Leistungszeitraum 01.10.–31.12.2024) × 68/320 = 862.75. Kaltwasser 2'015.00 × 68/320 = 428.1875 → 428.19. Allgemeinstrom 496.30 × 68/320 = 105.46375 → 105.46.
- Zwischensumme 2'261.90; Verwaltungspauschale 3 % = 67.857 → 67.86; Ihre Nebenkosten 2'329.76 (= `total_costs`).
- Akonto laut Datenbank 2'332.76 → Saldo −3.00 (keine Rundung nötig: 3.00 ist ein Vielfaches von 0.05).
- Gespeichert: `balance` −3.00, `status` settled, `paid_date` NULL, `paid_amount` NULL, `carried_from_id` NULL. Gespeichertes `settled` passt: Saldo < 5.00, keine Schlussabrechnung (Vertrag läuft, `end_date` NULL).

PDF (2024, 1 Seite, deutsch): «Rückerstattung CHF 3.00 / Der Betrag ist kleiner als CHF 5.00. Wir verrechnen ihn mit der nächsten Nebenkostenabrechnung.» Kein Zahlteil (Text «Zahlteil/Empfangsschein» nicht vorhanden, keine Grafik auf der Seite, Seite als PNG angesehen). Positionen, Zwischensumme, Pauschale, Saldo 3.00 stimmen mit der Rechnung. Akonto und Kostenübersicht sind konsistent (Saldo = Kosten − Akonto). Siehe D-1 zum Handwert.

### 2. NK-22222222-2025-0001 (Entwurf, Übertrag, Rundung)

- `carried_from_id` = cacafe8a-09bf-4ce6-9a99-bb5b1aa5f8e4 = NK-22222222-2024-0001 (Abfrage: `select id from utility_statements where statement_number='NK-22222222-2024-0001'`). Derselbe Mietvertrag b0000002-…-0001 ✓. Es ist die einzige Abrechnung mit `carried_from_id` (Abfrage: `count(*) filter (where carried_from_id is not null)` = 1).
- Kategorien: TV 228.00. Heizung 4'115.00 (1'520 + 790 + 395 des Jahres 2025, plus 1'410.00 aus der Rechnung vom 20.01.2026 mit Leistungszeitraum 01.10.–31.12.2025; die 1'350.00 vom 20.01.2025 gehören zu 2024 und zählen nicht) × 68/320 = 874.4375 → 874.44. Hauswart 3'060.00 → 650.25. Kaltwasser 2'060.00 → 437.75. Allgemeinstrom 499.30 → 106.10125 → 106.10.
- Zwischensumme 2'296.54; Pauschale 68.8962 → 68.90; Nebenkosten 2'365.44 ✓.
- Akonto 12 × 200.00 = 2'400.00 ✓ (`advance_lines`: 01.01.–31.12.2025, 200 × 12).
- Saldo vor Rundung: 2'365.44 − 2'400.00 − 3.00 (Übertrag einer Rückerstattung zählt zugunsten des Mieters) = −37.56. Rundung auf 5 Rappen zugunsten des Mieters: −37.60 ✓ (gespeichert −37.60). Der Übertrag wird vor der Rundung eingerechnet, wie Nr. 11 verlangt.
- PDF (2 Seiten): Kopfkasten «Rückerstattung CHF 37.60 / Wir überweisen Ihnen den Betrag bis 19.11.2026. Teilen Sie uns dafür Ihre IBAN mit …»; Untertitel «Ihre Nebenkosten CHF 2'365.44 – Akontobeiträge CHF 2'400.00 – Übertrag CHF 3.00, auf 5 Rappen gerundet»; Kostenübersicht, Akontozeile «12 Monate × CHF 200.00», «Übertrag aus Abrechnung NK-22222222-2024-0001: CHF 3.00 / – 3.00», «Rückerstattung vor Rundung 37.56», «Rundung auf 5 Rappen + 0.04», «Rückerstattung 37.60». Alle Beträge stimmen. Frist 19.11.2026 = Abrechnungsdatum 20.10.2026 + 30 Tage ✓ (`payment_deadline` 2026-11-19). Kein QR-Teil (Rückerstattung): kein Zahlteil im Text, keine Grafik.

### 3. NK-11111111-2025-0001 (bezahlt)

- Kategorien (Musterhaus, 75.50/492.50 m², 1/6 Einheiten): Lift 1'690.00/6 = 281.67; Hauswart 564.14; Kaltwasser 588.67; Allgemeinstrom 116.94; Garten 143.34; Kehricht 165.00; Kaminfeger 51.36; Heizung nach Verbrauch 2'650.00 + 6'565.00 − 2'257.20 = 6'957.80, Schlüssel 0.7 × 75.5/492.5 + 0.3 × 1/6 → 1'094.53. Zwischensumme 3'005.65, Pauschale 90.17, Nebenkosten 3'095.82, Akonto 2'880.00, Saldo vor Rundung 215.82 → 215.80 (Nachzahlung abgerundet) ✓.
- `status` paid, `paid_date` 2026-01-15 (nach Periodenende 31.12.2025, vor Abrechnungsdatum 28.09.2026: laut UBIQUITOUS_LANGUAGE «Abrechnungsdatum» nach Bestätigung zulässig), `paid_amount` 215.80 = Saldo ✓, `payment_recorded_at` 2026-10-20 08:23:07, PDF danach erstellt (08:23:51) ✓, `notes` gesetzt.
- PDF (2 Seiten): «Nachzahlung CHF 215.80 / Bezahlt am 15.01.2026. Vielen Dank.»; «Nachzahlung vor Rundung 215.82 / Rundung auf 5 Rappen – 0.02 / Nachzahlung 215.80»; Heizkostenblock 2'650.00 + 6'565.00 − 2'257.20 = 6'957.80 ✓; die Bemerkung steht als erster Absatz unter «Hinweise» ✓. Kein Zahlteil (Text und Grafik geprüft). Siehe D-3.

### 4. Kontrolle: übrige Abrechnungen

Ausgabe von `python3 -I recompute.py` (Auszug, `OK` = Kosten, Akonto, Saldo, Übertrag und jede Zeile stimmen):

```
OK  NK-11111111-2024-0001 costs=2952.58 akonto=2880 saldo=72.55
OK  NK-11111111-2024-0002 costs=3428.33 akonto=3600 raw=-171.67 saldo=-171.70
OK  NK-11111111-2024-0003 / -0004, NK-22222222-2024-0002 / -0003, NK-33333333-2024-0001 / -0002 (Pauschale 0.00, nicht vereinbart)
OK  NK-11111111-2025-0001 .. -0004, NK-22222222-2025-0002 (181 Tage, Heizprofil), -0003 (184 Tage), -0004 (Pauschale 2.5 %)
OK  NK-22222222-2025-0001 carry=-3.00 raw=-37.56 saldo=-37.60 carried=yes
DIFF NK-22222222-2024-0001 akonto=2400 (stored 2332.76)   <- Handwert, siehe D-1
```

- Nur NK-22222222-2025-0001 hat `carried_from_id`; genau eine Abrechnung ist `settled`, keine `replaced`.
- Keine andere Abrechnung hat einen Saldo unter CHF 5.00 (kleinster Betrag: −6.50 bei NK-11111111-2025-0002), also entsteht kein ungewollter Übertrag.
- `updated_at`/`pdf_generated_at` der 14 übrigen Abrechnungen liegen in der Seed-Zeit (08:17:06–08:17:10); nur die drei betroffenen wurden später geändert (08:21:55, 08:23:02, 08:23:51).
- Teilperioden-Heizung geprüft: NK-22222222-2025-0002/-0003 nach Heizprofil (Rechnungen ohne Leistungszeitraum zählen die Monate der ganzen Periode: 55.8 % / 44.2 %; die Rechnung 1'410.00 mit Leistungszeitraum Okt–Dez gehört ganz dem zweiten Mieter): 386.78 / 667.69 stimmen.

## Geprüft und bestanden

- NK-22222222-2024-0001: Kosten, Saldo −3.00 = Kosten − (gespeichertes) Akonto, Status settled, kein Zahlungsdatum, PDF-Text und fehlender Zahlteil.
- NK-22222222-2025-0001: Kostenübersicht, Übertrag (Verknüpfung und Betrag), Saldo vor Rundung −37.56, Rundung auf −37.60, Rundungszeile mit Vorzeichen, Kopfkasten, Frist, kein Zahlteil.
- NK-11111111-2025-0001: Kosten, Rundung 215.82 → 215.80, `paid_amount`, `paid_date`, PDF «Bezahlt am», Bemerkung unter «Hinweise», kein Zahlteil.
- Kontrolle: alle 14 übrigen Abrechnungen (Beträge) und `carried_from_id` nur bei NK-22222222-2025-0001.

## Nicht bestätigt

- **QR-Rechnungen:** Keine der drei betroffenen Abrechnungen hat einen Zahlteil (Rückerstattung, erledigt, bezahlt), also gibt es nichts zu dekodieren. Ich habe die Abwesenheit im Text und auf den gerenderten Seiten geprüft (`pdftoppm -png`, 60 dpi; angesehen: 2024-0001 S. 1, 2025-0001 S. 1, Müller S. 2). Die übrigen Seiten (Weber 2025 S. 2, Müller S. 1) nur im Text. Einen QR-Decoder habe ich nicht installiert, weil kein Zahlteil vorkommt. Ein QR-Zahlteil mit Übertrag (Nachzahlung mit eingerechnetem Übertrag, Reihenfolge Betrag/Referenz) ist mit diesen Daten nicht prüfbar: kein Datensatz dafür.
- **Web-Seite (Statusanzeige «Erledigt», «Bereits bezahlt»/«Bereits verrechnet», Übertragszeile) und PDFs in fr/it/en:** Die Seiten verlangen eine Anmeldung (Frontend leitet mit 303 weiter, Backend gibt 404 ohne Token); ich habe laut Auftrag kein JWT erzeugt. In der Datenbank liegen nur deutsche PDFs. Gelesen, nicht gerendert: die Texte `carriedDue`, `carriedRefund`, `carryOver`, `carryOverShort` in `backend/src/services/pdf.service.ts` für fr/it/en (Platzhalter `{number}`, `{amount}` vorhanden und sinngemäss gleich). Auch `offsetWith`/`offsetShort` («Bereits verrechnet», «Déjà compensé», «Già compensato», «Already offset») sind in allen vier Sprachen vorhanden (Zeilen 82–83, 189–190, 295–296, 401–402). Nur gelesen, nicht gerendert.
- **Berichtigen mit «Bereits bezahlt»/«Bereits verrechnet», Schlussabrechnung ohne Mindestbetrag:** In den Demo-Daten gibt es keine berichtigte Abrechnung (`replaces_id` überall NULL, `prior_payments` 0.00, kein Status `replaced`) und keine Schlussabrechnung mit Saldo unter CHF 5.00 (NK-22222222-2025-0002 ist die einzige Schlussabrechnung, Saldo −69.70). Diese Regeln lassen sich ohne Datensatz nicht an der Datenbank nachrechnen.
- **Abrechnungsdatum/Zahlungsfrist im Entwurf:** das Datum 20.10.2026 ist der Erstellungstag; die Frist im Entwurf nicht weiter geprüft.
