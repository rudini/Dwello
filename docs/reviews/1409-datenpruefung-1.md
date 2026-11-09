# Datenprüfung #1409 Jahresbericht, Runde 1 (Commit 9e19979b, Basis 3ee7579f)

Ergebnis: Keine Abweichung. Alle 9 Berichte (3 Gebäude x 2024, 2025, 2026) stimmen in Seite, CSV und PDF (de, fr, it, en) auf den Rappen mit meiner eigenen Nachrechnung aus der Datenbank überein. Es gibt keinen Befund.

## Befunde

| ID | Schwere | Record | Erwartet | Tatsächlich |
|---|---|---|---|---|
| (keine) | | | | |

## Vorgehen

- Daten: `dwello_persona` (Verträge, Rechnungen, Kategorien, Tankbestände, Abrechnungen und Abrechnungspositionen), nur gelesen. App unverändert, nichts gespeichert.
- Regeln nur aus Issue-Entscheid, `docs/reviews/1409-fachreview-2.md`/`-3.md`, `UBIQUITOUS_LANGUAGE.md` (Kostenabstimmung, Kosten des Gebäudes, Abrechnungsperiode) und `docs/nebenkostenabrechnung-anforderungen.md` (Verbrauch statt Einkauf: Anfangsbestand + Lieferungen - Endbestand). Dwello-Rechencode nicht übernommen.
- Mein Skript: `/tmp/claude-0/-home-user-Dwello/a6e6bb96-96f2-5195-b173-cbbf1ed94f91/scratchpad/dp1409/recompute.py` (Ergebnis `mine.json`).
  - Mietertrag: je Vertrag und Monat; ganzer Monat zum Betrag, angebrochener Monat Betrag x Tage/Tage des Monats, auf Rappen gerundet; Nettomiete, Zusatzmiete, Nebenkostenpauschale; kein Akonto, keine Verwaltungspauschale.
  - Kosten (a): Rechnungen mit `is_valid_utility_cost = false`, `invoice_date` im Jahr, ohne «Mortgage Interest»; «Capital Improvements» getrennt.
  - Kosten (b): Kosten des Gebäudes je Kategorie aus den heutigen Rechnungen der Abrechnungsperiode (Leistungszeitraum nach Tagen, Heizöl nach Verbrauch aus `fuel_stocks`) minus Summe `tenant_share` der gültigen, nicht ersetzten Abrechnungen derselben Periode (Entwürfe eingeschlossen); Zeilen mit genau 0.00 weggelassen; keine Abrechnung gleich keine Zeilen.
- Vergleich: `cmp_api.py` (Backend `GET /api/v1/reports/annual`, JWT der Persona-Stack) und `cmp_all.py` (Seite `/analytics?building=…&year=…`, `/analytics/csv`, `/analytics/pdf` über das BFF mit Cookie `dwello_session`, je Sprache mit Cookie `PARAGLIDE_LOCALE`; PDF mit `pdftotext -layout`). Heruntergeladene Dateien in `…/dp1409/all/` (144 Dateien).
- `cmp_all.py` prüft je Gebäude, Jahr, Sprache und Quelle (Seite, CSV, PDF = 108 Prüfungen): (1) alle Beträge gleich meinen erwarteten (als Menge), (2) jede Kategoriezeile mit ihrem Namen der Sprache (`categories.name_xx`) auf den erwarteten Betrag, (3) die festen Zeilen (Nettomiete, Total Mietertrag, Total Nebenkosten, Total ohne wertvermehrende Investitionen), (4) Zeilen und Reihenfolge in Seite, CSV und PDF gleich, (5) Hinweistexte `analytics_utility_none`, `analytics_utility_notes`, `analytics_utility_outside` genau dann vorhanden, wenn die Regel es verlangt. Ausgabe: `total diffs 0`. Nach `cmp_api.py`: `DIFFS 0`.

## Zahlen im Überblick (Kontrolle gegen Backend, Seite, CSV, PDF: alle gleich)

| Gebäude | Jahr | Total Mietertrag | Nebenkosten, die Sie tragen | Unterhalt und Verwaltung | Total ohne wertvermehrende |
|---|---|---|---|---|---|
| Musterhaus Zentrum | 2024 | 92'640.00 | 4'865.30 | 2'350.00 | 7'215.30 |
| Musterhaus Zentrum | 2025 | 92'640.00 | 5'103.39 | - | 5'103.39 |
| Musterhaus Zentrum | 2026 | 92'640.00 | keine Abrechnungen | - | 0.00 |
| Seepark Residenz | 2024 | 56'160.00 | 2'557.52 | - | 2'557.52 |
| Seepark Residenz | 2025 | 56'580.00 | 2'594.30 | - | 2'594.30 |
| Seepark Residenz | 2026 | 57'000.00 | keine Abrechnungen | - | 0.00 |
| Alpenblick | 2024 | 39'840.00 | 2'576.21 | - | 2'576.21 |
| Alpenblick | 2025 | 39'840.00 | keine Abrechnungen | - | 0.00 |
| Alpenblick | 2026 | 39'840.00 | keine Abrechnungen | - | 0.00 |

Die Zeilen je Kategorie (z.B. Musterhaus 2024: Heizung 1'720.75 = Verbrauch 2'120.00 + 6'890.00 - 2'650.00 = 6'360.00 minus Mieteranteile 4'639.25) stehen in `…/dp1409/mine.json` und in den `api-*.json`. Zusätzlich stimmen die Landlord-Beträge je Position mit der Kostenabstimmung (`GET /api/v1/reports/reconciliation`, Musterhaus 2025 stichprobenhaft) überein.

Weitere Kontrollen:
- Einzige nicht umlagefähige Rechnung der Demo-Daten: Reparaturen 2'350.00 (Musterhaus, Rechnungsdatum 2024-02-20). Sie erscheint nur in 2024. Rechnungen mit Rechnungsdatum 2026-01-20 (Seepark, Fernwärme Q4 2025, umlagefähig) erscheinen weder in (a) noch fälschlich in 2026.
- Seepark: Gartenpflege 730.00 (2024-07-01 bis 2025-06-30) zählt 2024 mit 184 Tagen, 2025 mit 181 Tagen; Heizung Q4 2024 (Rechnungsdatum 2025-01-20) zählt in 2024, nicht in 2025.
- Seepark 2025: Vertragswechsel A2 am 2025-07-01 (1'550/1'620 je 6 Monate) ergibt Nettomiete 54'420.00; 2026 volle 1'620: 54'840.00.
- Hinweis `notes`: in 2025 (Musterhaus, Seepark; Entwürfe) vorhanden, in 2024 (alle bezahlt) nicht; `outside`: nirgends (kein `billed_until` gesetzt). Hinweis «keine Abrechnungen» in 2026 (alle drei), Alpenblick 2025.
- CSV: Dezimalpunkt, keine Tausendertrennung, Hinweise als Zeilen ohne Betrag; PDF: «CHF 1’882.49» in allen Sprachen.

Geprüft: Jahresberichte Musterhaus Zentrum (11111111-…), Seepark Residenz (22222222-…), Alpenblick (33333333-…) für 2024, 2025 und 2026 in Backend-Antwort, Seite, CSV und PDF (de, fr, it, en); Mietertrag, Kosten (a), «davon tragen Sie» (b), Summen, Hinweise.

## Nicht bestätigt

- Angebrochene Monate, Abrechnungsperioden «Juli – Juni» / «November – Oktober», «Wertvermehrende Investitionen», «Hypothekarzinsen», negative oder 0.00-Zeilen und Nebenkostenpauschale ungleich 0.00: Die Demo-Daten enthalten keinen solchen Fall (alle Verträge beginnen am Monatsersten und enden am Monatsende, alle Gebäude «Kalenderjahr», alle Pauschalen 0.00, keine Rechnung dieser beiden Kategorien). Mein Skript enthält diese Regeln, aber ohne Datenbasis ist die Umsetzung dafür hier nicht geprüft; ich durfte die Daten nicht ändern. Wo ich gesucht habe: `rental_contracts`, `invoices`, `categories`, `buildings` in `dwello_persona`. Diese Fälle decken die Unit- und E2E-Szenarien der Änderung ab (`src/__tests__/annual-report.test.ts`, `tests/e2e/features/analytics.feature`), die ich nicht gegen mein Skript gerechnet habe.
- QR-Rechnungen: keine betroffen (der Jahresbericht enthält keinen QR-Zahlteil).
- Die Bruchteilsrundung bei mehreren Rechnungen mit Leistungszeitraum pro Kategorie (Rundung je Rechnung oder je Kategorie) kann ich mit diesen Daten nicht unterscheiden: alle Teilbeträge sind ohne Rappenrest.
