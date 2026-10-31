# Datenprüfung 511, Runde 1

Worktree: /tmp/claude/review-511-daten (7261dbb). Laufende App: Persona-Stack (Backend :3301, Frontend :3300), Datenbank `dwello_persona`. Skripte und Zwischenergebnisse: /tmp/claude/511dp (`recompute.py`, `qrchk.py`, `decode.py`, `out/`, `blobs/`).

Hinweis zur Datenbank: Sie wurde seit meiner Runde 534 neu aufgebaut. Abrechnungs-IDs, QR-Referenzen und der Status haben sich geändert (-0003 und -0004 sind jetzt `draft`, nicht `sent`). Ich habe keinen Datensatz angelegt oder geändert. Der PDF-Download einer Entwurfs-Abrechnung erzeugt das PDF jedoch neu (so arbeitet die App); dadurch haben `pdf_blob`, `pdf_generated_at` und `updated_at` von -0002 und -0003 neue Werte (16:07). Abrechnungsdatum (31.10.2026), Zahlungsfrist (30.11.2026) und alle Beträge blieben gleich.

## Ergebnis

Keine Findings. Der Hinweis erscheint bei beiden geprüften Abrechnungen in der Sprache des Mieters genau einmal, direkt unter dem Hinweis zu den vereinbarten Nebenkosten. Bei der einzigen Abrechnung ohne Verwaltungspauschale fehlt er. Alle Beträge stimmen auf den Rappen mit meiner Neuberechnung überein.

| ID | Schwere | Record | Erwartet | Tatsächlich |
|----|---------|--------|----------|-------------|
| (keine) | - | - | - | - |

Geprüft: NK-11111111-2025-0002 (Anna Schmidt, de: PDF, Webseite, API, Positionen, Saldo), NK-11111111-2025-0003 (Pierre Dubois, fr: PDF, Webseite, API, Positionen, Saldo, QR-Rechnung), NK-33333333-2024-0002 (Kevin Fischer, Pauschale 0: gespeichertes PDF ohne Hinweis); zusätzlich das Vorkommen des Hinweises in allen 17 gespeicherten PDFs, darunter it (NK-11111111-2025-0004, Rossi).

## Belege

### 1. Der Hinweis (Download `GET /api/v1/statements/:id/pdf`, `pdftotext -layout`)

-0003 (fr), Abschnitt «Remarques», Reihenfolge: vereinbarte Nebenkosten, dann Hinweis, dann Akonto:
```
Seuls les frais accessoires convenus dans le contrat de bail sont décomptés : Ascenseur, ... Ramonage.
Les frais d’administration sont convenus dans le contrat de bail. Ils couvrent le travail lié à l’établissement de ce
décompte (art. 4 al. 3 OBLF).
Les acomptes déduits sont ceux convenus dans le contrat de bail. ...
```
-0002 (de), Abschnitt «Hinweise»:
```
Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Lift, ... Kaminfeger.
Die Verwaltungspauschale ist im Mietvertrag vereinbart. Sie gilt den Aufwand für das Erstellen dieser Abrechnung ab
(Art. 4 Abs. 3 VMWG).
Abgezogen sind die Akontobeiträge, ...
```
Wortlaut gleich wie `managementFeeAgreed` in `pdf.service.ts` (de, fr). Zähltest über den zusammengezogenen Text (`tr '\n' ' '`, `grep -o`): je 1 Treffer in -0002 und -0003. Die Seite 2 beider PDFs habe ich gerendert (`pdftoppm -r 110`): der Hinweis steht im Hinweis-Block, ohne Überlauf oder Überlagerung; Seitenzahl unverändert (-0002: 2 Seiten, Rückerstattung ohne Zahlteil; -0003: 3 Seiten). Das Italienische steht im gespeicherten PDF von NK-11111111-2025-0004: «Le spese amministrative sono pattuite nel contratto di locazione. Coprono il lavoro per la stesura di questo conteggio (art. 4 cpv. 3 OLAL).», genau einmal, unter «Sono conteggiate solo le spese accessorie pattuite…».

Zur Abfrage: Die Zeile mit Satz, Basis und Betrag der Verwaltungspauschale steht in beiden PDFs auf Seite 2 (nicht auf Seite 1), weil die Positionstabelle Seite 1 füllt. Seite 1 zeigt den Saldo-Kasten und die Kurzformel «Ihre Nebenkosten … – Akontobeiträge …». Die Hinweise ändern daran nichts.

### 2. Neuberechnung (`recompute.py`, liest Rechnungen 2025 mit Verteilschlüssel-Formel, Flächen, Tankbestand, Akonto aus der Datenbank)

Fläche der Liegenschaft 492.50 m², 6 Wohnungen; Heizkosten 2650.00 + 6565.00 − 2257.20 = 6957.80; Mietstage 365/365.

| | -0002 (92.00 m², Akonto 12 × 300.00) | -0003 (85.00 m², Akonto 12 × 270.00) |
|---|---|---|
| Zwischensumme | 3488.85 | 3283.86 |
| Verwaltungspauschale 3 % | 104.67 | 98.52 |
| Ihre Nebenkosten | 3593.52 | 3382.38 |
| Akonto | 3600.00 | 3240.00 |
| Saldo vor Rundung | −6.48 | +142.38 |
| Rundung zugunsten des Mieters | +0.02 (aufgerundet) | −0.03 (abgerundet) |
| Saldo | −6.50 (Rückerstattung) | 142.35 (Nachzahlung) |

Alle 16 Positionen (`utility_statement_line_items.tenant_share`) stimmen: -0002: 281.67, 687.43, 717.32, 142.49, 174.66, 165.00, 1257.70, 62.58; -0003: 281.67, 635.13, 662.74, 131.65, 161.37, 165.00, 1188.48, 57.82. Gleich in `utility_statements` (`total_costs`, `management_fee` 104.67 / 98.52, `management_fee_percent` 3.00, `total_advance_payments`, `balance` −6.50 / 142.35), in der API-Antwort (`out/api-000{2,3}.json`) und im PDF (Zwischensumme, Pauschalenzeile, Ihre Nebenkosten, Akonto, Vor-Rundung, Rundungszeile, Saldo, Heizkosten-Herleitung, Saldo-Kasten auf Seite 1 «CHF 142.35»). Webseite `/statements/:id` (200, Cookie `dwello_session`): -0002 «Rückerstattung vor Rundung CHF 6.48, Rundung auf 5 Rappen + CHF 0.02, Saldo: Rückerstattung CHF 6.50, bis 30.11.2026»; -0003 «Nachzahlung vor Rundung CHF 142.38, Rundung − CHF 0.03, Saldo: Nachzahlung CHF 142.35, Zahlungsfrist 30.11.2026». Die Webseite zeigt den neuen Hinweis nicht (er betrifft nur das PDF).

### 3. QR-Rechnung von -0003 (Seite 3, `pdftoppm -png -r 300`, Decoder zxing-cpp im Scratchpad-venv, `decode.py`)

Dekodiert (SPC 0200):
```
CH4431999123000889012 | Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH | 142.35 CHF
Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich, CH | QRR 007333367228783096451247625
Mitteilung: Décompte des charges NK-11111111-2025-0003 | EPD
```
- IBAN: QR-IBAN (IID 31999), Modulo 97 = 1.
- Betrag 142.35 = Saldo.
- Referenz (27 Stellen): Prüfziffer 5, stimmt (`qrchk.py`, Modulo 10 rekursiv; Gegenprobe SIX-Beispiel 2100…0901 → 7). Aus der Abrechnungs-ID neu berechnet (erste 80 Bit als Dezimalzahl, auf 26 Stellen aufgefüllt, plus Prüfziffer): gleich, und gleich `qr_bill_reference` in der Datenbank.
- Schuldner und Mitteilung stimmen. Der gedruckte Zahlteil (Referenz «00 73333 67228 78309 64512 47625», IBAN, 142.35, Pierre Dubois) stimmt mit dem QR-Inhalt überein.
- -0002 ist eine Rückerstattung (−6.50) und hat keinen Zahlteil (2 Seiten), wie die Anforderungen es vorsehen.

### 4. Abrechnung ohne Verwaltungspauschale

Nur eine von 17: `NK-33333333-2024-0002` (Kevin Fischer, de, Liegenschaft Alpenblick), `management_fee` 0.00, Mietvertrag `management_fee_agreed = false`, Status `paid`. Alle anderen 16 haben eine Pauschale > 0 und einen Vertrag mit vereinbarter Pauschale. Es gibt keinen Entwurf ohne Pauschale. Die gespeicherten PDFs der Demodaten sind beim Seed (`pdf_generated_at` 16:05:53–16:05:56) vom laufenden Build erzeugt worden: alle 16 PDFs mit Pauschale enthalten den Hinweis, genau einmal; das PDF von NK-33333333-2024-0002 enthält ihn nicht und nirgends das Wort «Pauschale»:
```
NK-11111111-2024-0001 fee=86.00 note=1 ... NK-22222222-2025-0004 fee=77.95 note=1   (16 Abrechnungen, je 1)
NK-33333333-2024-0002 fee=0.00 note=0
```
Das Hinweis-Kapitel dieses PDFs: vereinbarte Nebenkosten, Akonto, Belege, Heizkosten-Auskünfte, ohne Pauschale.

## Nicht bestätigt

- **PDF in en, und die en-Zeile des Hinweises**: Kein Mieter in `dwello_persona` hat die Sprache en (tenants: de 7, it 2, fr 1). Den englischen Wortlaut («The management fee is agreed in the rental contract. It covers the work of preparing this statement (Art. 4 para. 3 VMWG).») habe ich nur im Diff gelesen, nicht in einem PDF gesehen. Ein PDF in en liesse sich nur mit `POST /generate-pdf` und `language: "en"` erzeugen, das ein bestehendes PDF überschreibt; das habe ich nicht getan.
- **Fr- und de-PDF der Abrechnung ohne Pauschale mit dem Hinweis neu erzeugt**: NK-33333333-2024-0002 ist `paid`, deshalb liefert der Download das gespeicherte PDF; ein Neu-Erzeugen hätte einen Datensatz verändert. Ich stütze mich darauf, dass der Seed dieses PDF mit demselben Build erzeugt hat (die anderen 16 PDFs derselben Seed-Läufe enthalten den Hinweis).
- **Abrechnung mit Pauschale im Entwurf und `managementFee` = 0 durch einen Vertrag ohne vereinbarte Pauschale in einer Liegenschaft mit anderen Verträgen**: nicht im Datenbestand; nur NK-33333333-2024-0002 hat 0.
- **Betrags-Neuberechnung von NK-33333333-2024-0002 und der übrigen 14 Abrechnungen**: nicht Gegenstand dieser Runde (die Änderung berührt keine Beträge); ich habe nur den Hinweis dort gezählt.
- **Browser-Rendering**: nur den serverseitig gelieferten HTML-Text gelesen, keine Screenshots der Webseite.
