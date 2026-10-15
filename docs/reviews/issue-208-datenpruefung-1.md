# Datenprüfung #208, Runde 1

Geprüft: Commit `0d49b67` (Worktree `review-208-daten`), Diff `c91aa8e..0d49b67`. App laut Aufrufer mit Demodaten gestartet; Datenbank `dwello_persona` nur gelesen, nichts geändert, keine Abrechnung versandt, kein PDF neu erzeugt.

Werkzeuge (alle im Scratchpad, nicht im Repository):

- `recompute.py`: rechnet jede Abrechnung aus den Rohdaten neu (Rechnungen, Kategorien, Verteilschlüssel, Wohnungen, Mietverträge, Akonto, Heizprofile, Tankbestände). Grundlage sind die Regeln 1–10 in `docs/nebenkostenabrechnung-anforderungen.md` und `UBIQUITOUS_LANGUAGE.md`, kein Dwello-Code. Zum Vergleich rechnet es jede Position auch nach der alten Regel (Heizprofil auch bei einem Mietvertrag über die ganze Periode).
- `checkpdf.py`: vergleicht jede Zeile der Kostenübersicht (Kosten Liegenschaft, Wohnungsanteil, Zeitanteil, Ihr Anteil) und die Summen im PDF-Text (`pdftotext -layout`) mit der Neuberechnung.
- `qr.py` / `qrcheck.py`: rendert die Seiten mit `pdftoppm -png -r 300`, decodiert den QR-Code mit `zxing-cpp` (venv im Scratchpad) und prüft den SPC-Inhalt.

## Befunde

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | NK-22222222-2025-0001 (Thomas Weber), Position Heizung; NK-22222222-2025-0004 (Marco Bernasconi), Position Riscaldamento | Regel 5 (in diesem Commit neu): «Eine Position aus Rechnungen über verschiedene Tage … zeigen den Anteil in Prozent» → Zeitanteil `100.00 %`, zu den gespeicherten `position_rental_days`/`billed_days` = NULL passend | Das PDF druckt `365/365 Tage` bzw. `365/365 giorni`. Der Betrag ist richtig (874.44 bzw. 1'221.64). |

### D-1 (Minor): Gemischte Position über die ganze Periode steht als Bruch statt in Prozent

Die Position Heizung in Seepark Residenz besteht aus SR-2025-003, -007 und -010 (ohne Leistungszeitraum, also 365 Tage) und SR-2025-014 (Leistungszeitraum 01.10.–31.12.2025, 92 Tage). Die Rechnungen rechnen also verschiedene Tage ab. Die Berechnung speichert deshalb richtig keine Tage. `timeShare` in `backend/src/services/pdf.service.ts:438-439` fällt dann aber auf den Weg für ältere Abrechnungen zurück: `periodShare` (1.0000) = `rentalDays/periodDays` (365/365) und `byProfile` ist falsch, also druckt sie `rentalDays/periodDays`. Bei einem Mietvertrag über die ganze Periode trifft das auf jede gemischte Position zu. Bei einem Ein- oder Auszug nur, wenn der gewichtete Anteil zufällig gleich gross ist wie Mietstage/Periode. Der Bruch 365/365 ist für sich nicht falsch: Die Rechnungen decken zusammen das ganze Jahr ab. Er widerspricht aber der Regel 5, die derselbe Commit schreibt, und dem Kommentar in `schema.ts` («null when not a ratio of days»). Der Betrag ändert sich nicht. Zu entscheiden ist eines von beiden: die Regel 5 um diesen Fall ergänzen, oder für neue Abrechnungen ohne gespeicherte Tage nur noch Prozent drucken.

Beleg (Datenbank):

```
select s.statement_number, li.description, li.period_share, li.position_rental_days, li.billed_days, li.tenant_share
from utility_statement_line_items li join utility_statements s on s.id=li.statement_id
where s.statement_number in ('NK-22222222-2025-0001','NK-22222222-2025-0004') and li.description='Heating';
 NK-22222222-2025-0001 | Heating | 1.0000 |  |  |  874.44
 NK-22222222-2025-0004 | Heating | 1.0000 |  |  | 1221.64
```

Beleg (PDF, `checkpdf.py`):

```
== NK-22222222-2025-0001 (de)
  XX Heizung: expected '4'115.00 874.44 100.00 % 874.44' pdf Zeitanteil ['365/365 Tage']
== NK-22222222-2025-0004 (it)
  XX Heizung: expected '4'115.00 1'221.64 100.00 % 1'221.64' pdf Zeitanteil ['365/365 giorni']
```

PDF-Zeile (Thomas Weber): `Heizung   Pro Fläche (m²)   4'115.00   874.44   365/365 Tage   874.44`

Nachvollziehen: Das gespeicherte PDF aus `utility_statements.pdf_blob` von NK-22222222-2025-0001 base64-decodieren, `pdftotext -layout`, Zeile «Heizung» lesen. Oder in der App die Detailseite der Abrechnung 2025 von Thomas Weber öffnen und das PDF herunterladen.

## Geprüft und bestanden

Neuberechnung (`recompute.py`, Ausgabe `recompute.out`): 0 Abweichungen in 8 Abrechnungen 2025 mit 52 Positionen. Geprüft je Position: Kosten Liegenschaft, Wohnungsanteil, `period_share` (4 Stellen), Ihr Anteil (auf den Rappen), `position_rental_days`, `billed_days` sowie «gleich wie nach alter Regel». Geprüft je Abrechnung: Mietstage, geleistete Akontobeiträge, Verwaltungspauschale, Ihre Nebenkosten, Saldo auf 5 Rappen und Prüfziffer der QR-Referenz.

| Abrechnung | Mieter | Mietstage | Zwischensumme | Pauschale 3 % | Nebenkosten | Akonto | vor Rundung | Rundung | Saldo |
|---|---|---|---|---|---|---|---|---|---|
| NK-11111111-2025-0001 (versandt) | Hans Müller | 365 | 3'005.65 | 90.17 | 3'095.82 | 2'880.00 | 215.82 | −0.02 | Nachzahlung 215.80 |
| NK-11111111-2025-0002 | Anna Schmidt | 365 | 3'488.85 | 104.67 | 3'593.52 | 3'600.00 | −6.48 | +0.02 | Rückerstattung 6.50 |
| NK-11111111-2025-0003 | Pierre Dubois (fr) | 365 | 3'283.86 | 98.52 | 3'382.38 | 3'240.00 | 142.38 | +0.02 | Nachzahlung 142.40 |
| NK-11111111-2025-0004 | Maria Rossi (it) | 365 | 4'308.85 | 129.27 | 4'438.12 | 4'200.00 | 238.12 | −0.02 | Nachzahlung 238.10 |
| NK-22222222-2025-0001 | Thomas Weber | 365 | 2'296.54 | 68.90 | 2'365.44 | 2'400.00 | −34.56 | −0.01 | Rückerstattung 34.55 |
| NK-22222222-2025-0002 | Sarah Meier (bis 30.06.) | 181 | 1'415.51 | 42.47 | 1'457.98 | 1'320.00 | 137.98 | +0.02 | Nachzahlung 138.00 |
| NK-22222222-2025-0003 | Nina Brunner (ab 01.07.) | 184 | 1'306.92 | 39.21 | 1'346.13 | 1'440.00 | −93.87 | −0.02 | Rückerstattung 93.85 |
| NK-22222222-2025-0004 | Marco Bernasconi (it) | 365 | 3'117.87 | 93.54 | 3'211.41 | 3'120.00 | 91.41 | −0.01 | Nachzahlung 91.40 |

Die Rundungsspalte zeigt die Änderung des Betrags, so wie das PDF sie druckt (Regel 8).

Einzelpunkte:

- **D-2 (Betrag bleibt gleich):** Bei allen sechs Mietverträgen über die ganze Periode (Hans Müller, Anna Schmidt, Pierre Dubois, Maria Rossi, Thomas Weber, Marco Bernasconi) ist jede Heizkosten-Position (Heizung, Kaminfeger) nach Tagen gleich wie nach dem Heizprofil. Das Profil ergibt bei zwölf von zwölf Monaten 100 %, nach Tagen sind es 365/365 bzw. 92/92 für SR-2025-014. Die Prüfung «tenant_share == old rule» ist in allen 52 Positionen OK. Das PDF zeigt bei diesen Mietverträgen keinen Heizprofil-Hinweis und keinen Abschnitt nach Heizprofil (`heizprofil=0`), der Hinweis auf Art. 8 Abs. 1 VMWG steht in allen 8 PDFs.
- **Ein- und Auszug:** Bei Sarah Meier und Nina Brunner geht die Heizung weiter nach dem Profil «Heizung + Warmwasser». Jan–Jun ergibt 55.80 % (13.6+12.1+11.5+9.3+5.6+3.7), Jul–Dez 44.20 %, zusammen 100 %. Die Anteile sind 588.39 + 466.08 von 1'054.47; der Rest ist ein Rappen Rundung. Es sind keine Tage gespeichert und das PDF zeigt `55.80 %` / `44.20 %` mit Heizprofil-Satz und Monatsanteilen. Alle übrigen Positionen gehen nach Tagen: 181/365 bzw. 184/365, gespeichert und gedruckt.
- **D-3 (gespeicherte Tage):** In allen 52 Positionen entsprechen `position_rental_days`/`billed_days` den Tagen, die die Rechnungen der Position in 2025 abrechnen (bei allen Positionen mit gleichen Tagen sind es 365), und den Mietstagen darin. Bei der Heizung Seepark (gemischt: 365 und 92 Tage) und bei Positionen nach dem Heizprofil sind sie richtig NULL. SR-2024-014 (Leistungszeitraum 01.10.–31.12.2024, Rechnungsdatum 20.01.2025) zählt richtig nicht in 2025.
- **Tank Musterhaus Zentrum:** Heizung 2'650.00 + 6'565.00 − 2'257.20 = 6'957.80. Gespeichert (`fuel_stock`) und gedruckt («Heiz- und Warmwasserkosten») sind gleich. Verteilt wird nach «Heizung (Fläche 70 % / Einheit 30 %)», z. B. Hans Müller 0.7×75.5/492.5 + 0.3/6 → 1'094.53.
- **PDF, Kostenübersicht (`checkpdf.py`):** Alle 52 Zeilen stimmen in Kosten, Wohnungsanteil und Ihr Anteil, ebenso Zwischensumme, Verwaltungspauschale, Nebenkosten, Akonto, Saldo vor Rundung, Rundung mit Vorzeichen und Saldo in allen 8 PDFs (de: 5, fr: 1, it: 2). Der Zeitanteil stimmt in 50 Zeilen, die zwei anderen sind D-1. Der Satz zum Bruch eines Leistungszeitraums (`sharesNoteDays`) fehlt in allen 8 PDFs richtig, weil keine gespeicherte Position einen Nenner ungleich 365 hat. Der Heizprofil-Satz steht nur bei Sarah Meier und Nina Brunner.
- **QR-Rechnungen (decodiert):** NK-11111111-2025-0001, -0003, -0004, NK-22222222-2025-0002 und -0004. Geprüft: SPC/0200/1; IBAN CH4431999123000889012 (Mod-97 gültig, QR-IID 31999); Kreditor «Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH»; Betrag gleich dem Saldo (215.80 / 142.40 / 238.10 / 138.00 / 91.40) in CHF; Debitor gleich dem Mieter mit Adresse aus `tenants`; Referenz QRR mit 27 Ziffern, gleich `qr_bill_reference` und mit gültiger Mod-10-Prüfziffer (rekursiv); Mitteilung «Nebenkostenabrechnung / Décompte des charges / Conteggio spese accessorie NK-…» in der Sprache des PDFs; Trailer EPD. Die Rückerstattungen (Anna Schmidt, Thomas Weber, Nina Brunner) haben richtig keinen Zahlteil und keinen QR-Code.
- **Zusätzlich (nicht verlangt):** Die 9 Abrechnungen 2024 (366 Tage, darunter SR-2024-014 mit Leistungszeitraum in der Heizung Seepark), die mit demselben Code erzeugt wurden, ergeben 0 Abweichungen in Positionen, Tagen und Summen (`recompute2024.out`).

## Nicht bestätigt

- **Webseite (Detailseite der Abrechnungen):** nicht geprüft. Ich habe keine Anmeldung für die App. Eine selbst signierte Sitzung (JWT mit dem Secret des Persona-Stacks) hat die Berechtigungsprüfung abgelehnt, und ich habe sie nicht umgangen. Aus demselben Grund konnte ich auch das Backend-API nicht aufrufen.
- **PDFs in weiteren Sprachen:** geprüft sind nur die gespeicherten PDFs in der Sprache des Mieters (de, fr, it). Englisch (kein Demo-Mieter hat Englisch) und z. B. eine Abrechnung mit Heizprofil (Sarah Meier, Nina Brunner) auf fr/it/en sind nicht geprüft. Dafür müsste ich `POST /api/statements/:id/generate-pdf` mit `language` aufrufen; das braucht eine Sitzung (siehe oben) und überschreibt das gespeicherte PDF.
- **`sharesNoteDays` und ein Bruch mit einem Nenner ungleich den Tagen der Periode (z. B. 31/62):** Die Demodaten haben keine solche Position. Gesehen ist dieser Fall nur im Backend-Test `statement-pdf.pg.test.ts` und im Szenario des Commits, nicht in der laufenden App.
- **«Gleich wie vor der Änderung»:** belegt mit meinem eigenen Modell der alten Regel (Heizprofil für jede Heizkosten-Position, wenn ein Profil gewählt ist). Ich habe den Code von `c91aa8e` nicht laufen lassen, weil das eine zweite Datenbank und einen zweiten Backend-Start gebraucht hätte. Es gibt keine gespeicherten Werte von vor der Änderung, die Demo-Abrechnungen wurden beim Start mit dem neuen Code erzeugt.
