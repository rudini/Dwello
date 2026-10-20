# Datenprüfung #199 / #408 Punkt 2 (Commit 571d2481), Runde 1

Skript: /tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/recompute199.py (liest dwello_persona, kein Dwello-Code). Aufruf: `python3 -I recompute199.py`.

## Befunde
| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| (keine) | | | | |

## Geprüft und bestanden
Periode 01.01.2026 - 30.06.2026 = 181 Tage (Einstellung july-june; die Abrechnungen 2025 decken 01.01.-31.12.2025, Lücke = 01.01.-30.06.2026).
| Abrechnung | Mietvertrag | Mietstage | Akonto | Kosten | Saldo |
|---|---|---|---|---|---|
| NK-11111111-2026-0001 | Dubois, ab 01.01.2023, 270/Mt | 181 = 181 | 6 x 270 = 1'620.00 | 0.00 | -1'620.00 |
| NK-11111111-2026-0002 | Schmidt, ab 01.06.2022, 300/Mt | 181 = 181 | 1'800.00 | 0.00 | -1'800.00 |
| NK-11111111-2026-0003 | Müller, ab 01.03.2021, 240/Mt | 181 = 181 | 1'440.00 | 0.00 | -1'440.00 |
| NK-11111111-2026-0004 | Rossi, ab 01.09.2020, 350/Mt | 181 = 181 | 2'100.00 | 0.00 | -2'100.00 |
- Alle vier Verträge laufen unbefristet, «Abgerechnet bis» ist leer, kein Vertrag wurde ausgelassen (das Gebäude hat genau diese vier laufenden Verträge; Fischer endete 2021).
- Keine Rechnung des Gebäudes mit Rechnungsdatum oder Leistungszeitraum in der Periode (Abfrage ergibt 0; letzte Rechnung 31.12.2025, keine hat einen Leistungszeitraum). Kosten 0.00, Verwaltungspauschale 0.00 (3 % von 0), keine Positionen: stimmt mit der Neuberechnung überein. Saldo ohne Rundung (ganze Franken).
- 100 %-Prüfung: Die 2026-Entwürfe verteilen keine Rechnung (0 Positionen). Keine Rechnung mit Leistungszeitraum über den Jahreswechsel vorhanden. Die 2025-Abrechnungen verteilen je Kategorie zwischen 66.67 % und 75.64 % der Gesamtsumme (nie über 100 %). Heizung 6'957.80 = 6'565.00 + 2'650.00 - 2'257.20 (Verbrauch aus Tankbestand) stimmt.
- Tankbestand: Anfangsbestand 31.12.2025 (2'257.20) vorhanden, Endbestand 30.06.2026 fehlt; Entwurf hat daher fuel_stock leer und keine Heizkosten (Regel 10: Einkauf der Periode = 0). Konsistent.

## Nicht bestätigt
- Webseite der Entwürfe: Anmeldung nötig, auf Anweisung nicht umgangen; Anzeige nicht mit den gespeicherten Werten verglichen.
- PDFs und QR-Rechnungen: für die vier Entwürfe nicht erzeugt (pdf_blob leer, pdf_generated_at leer); Erzeugen war nicht erlaubt. Damit kein QR-Code dekodiert, keine Sprachen geprüft. Hinweis: Alle vier Salden sind Rückerstattungen, also ohnehin kein Zahlteil.
- Hinweis (kein Befund): Die Entwürfe zeigen Kosten 0.00 und Rückerstattung des vollen Akontos, weil für das Halbjahr keine Rechnungen und kein Endbestand erfasst sind; ob die App das vor dem Versand deutlich warnt, habe ich ohne Web-Zugriff nicht geprüft.
