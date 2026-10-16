# Datenprüfung W6b (#63, #105, #106), Commit 62c25c8

Methode: eigene Nachrechnung aus der Datenbank `dwello_persona` (psql), PDFs aus `documents.content` dekodiert (Content-Stream mit zlib gelesen, Bytes als cp1252), mit `pdftotext` und `pdftoppm` gegengeprüft; QR-Decoder `zxing-cpp` in der Scratchpad-venv. Kein Dwello-Code importiert, nichts in der Datenbank verändert.

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| D-1 | Nit | `backend/src/services/pdf.service.ts` Zeile 6 | Kommentar nennt nur DE, FR, IT, EN (Typ `Language` hat kein `rm` mehr) | Kommentar: `Multi-language support (DE, FR, IT, RM, EN)` |

Kein Blocker, kein Major, kein Minor.

Reproduktion D-1: `grep -n "RM" backend/src/services/pdf.service.ts` im Worktree. Nur ein Kommentar, kein Verhalten betroffen.

## Nachrechnung

Statement NK-...-0004 (Rossi, `fabf38c5-...`): Positionen (8) Mieteranteil 4308.85 + Verwaltungsgebühr 129.27 = 4438.12 (= total_costs); minus Akonto 4200.00 = 238.12; auf 5 Rappen gerundet 238.10 = `balance` = Betrag im Mahnschreiben (CHF 238.10). OK.

Statement NK-...-0003 (Dubois, `8a410922-...`): 3283.86 + 98.52 = 3382.38; minus 3240.00 = 142.38; gerundet 142.40 = `balance` = Betrag im Schreiben (CHF 142.40). OK.

Query: `select statement_id, count(*), sum(tenant_share) from utility_statement_line_items where statement_id in (...) group by 1` ergibt 4308.85 und 3283.86.

| Wert | b99d6a40 (Rossi, it) | 622569b4 (Dubois, fr) |
|---|---|---|
| Briefdatum (Schweizer Tag der Erstellung, created_at 2026-10-16 21:04 UTC = 23:04 MESZ) | 16.10.2026 im PDF | 16.10.2026 im PDF |
| Zahlungsfrist = Briefdatum + 10 Tage = 26.10.2026 | `payment_deadline` 2026-10-26, im PDF 26.10.2026 | dito |
| Betrag | 238.10 | 142.40 |
| IBAN (configuration.iban) CH4431999123000889012, Prüfsumme mod 97 = 1, IID 31999 = QR-IBAN | im PDF identisch | identisch |
| QR-Referenz (MOD10 rekursiv über die ersten 20 Hex-Stellen der Statement-ID, eigene Python-Rechnung) | 011841190395813999207755793, = `qr_bill_reference`, im PDF gruppiert `01 18411 90395 81399 92077 55793`, Prüfziffer 3 stimmt | 006528862713225329081525421, im PDF `00 65288 62713 22532 90815 25421`, Prüfziffer 1 stimmt |
| Abrechnungsnummer und Periode | NK-11111111-2025-0004, 01.01.2025 bis 31.12.2025 | NK-11111111-2025-0003, 01.01.2025 bis 31.12.2025 |
| Empfänger | Maria Rossi, Bahnhofstrasse 42, 8001 Zürich (= tenants) | Pierre Dubois, dito |
| Absender | Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich (= configuration) | dito |
| Sprache laut tenants.language | it, Brieftext italienisch | fr, Brieftext französisch |
| Titel/Dateiname | `Promemoria di pagamento` / `Promemoria di pagamento NK-11111111-2025-0004.pdf` | `Rappel de paiement` / `Rappel de paiement NK-11111111-2025-0003.pdf` |
| Status | to_send, sent_at leer | sent, sent_at 2026-10-16 21:06:25 |

Die QR-Referenz erscheint nur bei QR-IBAN (hier der Fall): in beiden Schreiben vorhanden.

Persona-Kopien: `v1-rossi.pdf` hat denselben Text wie die gespeicherte PDF von b99d6a40; `v2-dubois-sent.pdf` denselben Text wie die gespeicherte von 622569b4 (Textdiff leer). `v1-dubois.pdf` hat dieselben Werte.

## Zeichen (Rohbytes im Content-Stream, WinAnsi, Helvetica Standardschrift)

- Französisch: `n’est` = Byte 0x92 (’ U+2019), `Montant dû<0xA0>:` und `suivant<0xA0>:` = U+00A0 vor dem Doppelpunkt, `Décompte`, `période`, `Référence`, `à`, `peut-être`, `échappé`, `déjà`, `considérer`, Gedankenstrich im Titel = 0x96 (–). Gerendert (pdftoppm, 80 dpi) sichtbar richtig, kein Ersatzzeichen. Zeilen brechen nicht vor dem «:».
- Italienisch: `l’importo` = 0x92, `contabilità`, `è`, `già`, `Zürich`, Gedankenstrich. Gerendert richtig. Titel umbricht auf zwei Zeilen, ohne Überlappung.
- Nicht belegbar in den zwei Datensätzen: «», ù (kommen im Stufe-1-Text beider Sprachen nicht vor; Quelle `reminder-letter.ts` hat sie nicht, nur «:»-Raum, ’, è, é, à, û, ê).
- Stichprobe Code: Dateinamen-Bereinigung `/[\\/:*?"<>|]/g` lässt `°` unberührt. Mit node simuliert: `2° sollecito NK-1.pdf` bleibt in `file_name`; Header `filename="2_ sollecito NK-1.pdf"; filename*=UTF-8''2%C2%B0%20sollecito%20NK-1.pdf` (ASCII-Rückfall `_`, echter Name per RFC 5987). Dies ist Code- und Simulationsprüfung, keine Stufe-2-Datensatzprüfung (keiner vorhanden).

## Rätoromanisch

- `select language,count(*) from tenants group by 1`: de 7, it 2, fr 1; kein `rm`.
- `tenants_language_check` erlaubt de, fr, it, en; Migration `0008_tenant_language_without_rm.sql` angewendet (schema_migrations 2026-10-16 21:02:25). `configuration` hat keinen Eintrag `default_language`.
- Typ `Language` = de | fr | it | en.

## QR-Rechnungen

Die Mahnschreiben enthalten keine QR-Rechnung (eine A4-Seite, nur Text mit IBAN und Referenz); es gibt nichts zu dekodieren.
Zusätzlich, ausserhalb des Slice-Umfangs: Abrechnungs-PDF `weber-w6b/pdf/statement-dubois.pdf` (Seite 2, 200 dpi, zxing-cpp) dekodiert: IBAN CH4431999123000889012, Betrag 142.40 CHF, Referenz QRR 006528862713225329081525421 (Prüfziffer stimmt), Mitteilung «Décompte des charges NK-11111111-2025-0003», Schuldner Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich, Gläubiger Muster Immobilien AG. Stimmt mit der Datenbank überein.

## Geprüft und bestanden

- Dokument b99d6a40-6452-4e0d-ab4c-2d9ab96ea050 (alle Werte der Tabelle).
- Dokument 622569b4-54c9-4a38-8a72-2db9695e2852 (alle Werte der Tabelle).
- Abrechnungen NK-11111111-2025-0004 und -0003: Saldo und Rundung auf 5 Rappen.
- Tenants ohne `rm`, Check-Constraint, Migration 0008.
- Abrechnungs-QR-Rechnung Dubois.

## Nicht bestätigt

- Web-Seite und HTTP-Download-Header: `GET /api/documents/<id>/download` ergab 404 (Pfad geraten, keine Anmeldung); das Frontend ist anmeldepflichtig und ich habe keine Sitzung erzeugt. Die Seitenanzeige der beiden Mahnungen und den echten Content-Disposition-Header habe ich daher nicht geprüft; Header-Verhalten nur über Code und Simulation.
- E-Mail-Text (`letter.text`/`subject`) der beiden Dokumente: beide Mieter haben Kanal `letter`, es wurde keine E-Mail versendet; nur der Code (`reminder-letter.ts`) gelesen, keine gespeicherten Werte.
- Sprachen Deutsch und Englisch sowie Mahnstufen 2 und 3: keine Datensätze vorhanden, nur Code gelesen.
- Stand der App: gebaut aus 758b220; der Worktree 62c25c8 unterscheidet sich im Brief nur durch den englischen Satz «please disregard this reminder» (Diff 758b220..62c25c8 auf `reminder-letter.ts`), den ich nicht an einer Datenbank-PDF prüfen konnte.
