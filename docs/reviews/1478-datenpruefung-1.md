# Datenprüfung #1478, Runde 1

Gegenstand: zweite Brennstoff-Kategorie «Holz» zählt wie eine Lieferung (Worktree `review-1478-daten`, Commit e3a39ad). Datenbank `dwello_persona`, Backend :3301, Frontend :3300, nichts geschrieben.

Ergebnis: Alle Beträge der Entwürfe von Anna Schmidt und Pierre Dubois stimmen auf den Rappen mit meiner Nachrechnung überein (gespeicherte Werte, Weboberfläche, PDF, QR-Rechnung). Kein Blocker, kein Major. Ein Minor (D-1, schon vor der Änderung vorhanden).

| ID | Schwere | Datensatz | Erwartet | Tatsächlich |
|----|---------|-----------|----------|-------------|
| D-1 | Minor (vorbestehend, nicht durch #1478 verursacht) | Entwurf Maria Rossi `NK-11111111-2025-0004` (id 202d5811-a80d-4052-a78a-0a895ebadf9c), Wohnung 3.01 | Der Entwurf gilt als «nicht aktuell»: Ihr Mietvertrag vereinbart «Holz», und die Rechnungen d018394e… und 8a8ce8c0… liegen in der Periode. Neu berechnet gäbe er Position Holz 305.25, Zwischensumme 4'614.10, Pauschale 138.42, Ihre Nebenkosten 4'752.52, Saldo 552.50. | Kein Hinweis: `GET /api/v1/statements/outdated` gibt `{"statements":[]}`, die Detailseite zeigt keinen Hinweis «Dieser Entwurf ist nicht aktuell», die Übersicht keine Aufgabe. Der Entwurf zeigt weiter Zwischensumme 4'308.85, Ihre Nebenkosten 4'438.12, Saldo 238.10 (ohne Holz) und lässt sich als versendet markieren. |

## D-1: Entwurf von Maria Rossi gilt nicht als «nicht aktuell»

Beleg (Datenbank, Abfrage nur lesend):

```
select statement_number, agreed_category_ids ? '810732d0-199c-402f-91c9-cef84d3f0eb6' as holz_im_entwurf
from utility_statements where period_start='2025-01-01' and statement_number like 'NK-11111111-%' order by 1;
-- 0001 f | 0002 t | 0003 t | 0004 f
select contract_id, agreed from contract_categories where category_id='810732d0-199c-402f-91c9-cef84d3f0eb6';
-- b0000001-…-0002 t | …-0003 t | …-0005 t   (…-0005 = Maria Rossi)
```

- Ursache: Der Entwurf hat beim Erstellen seine Liste der vereinbarten Kategorien festgehalten (`agreed_category_ids`, Anforderung Thema 6, Regel 12: «Jede Abrechnung hält ihre Liste beim Erstellen fest»). Die Prüfung «nicht aktuell» (`agreedIn` in `backend/src/services/held-invoices.ts`) fragt nur nach dieser festgehaltenen Liste. Dass der Mietvertrag «Holz» erst nach dem Erstellen vereinbart hat, sieht sie nicht.
- Die Zeilen ändern sich mit #1478 nicht (`git diff origin/main e3a39ad` berührt `held-invoices.ts` nicht). Dasselbe geschieht mit jeder Kategorie, die ein Mietvertrag nach dem Erstellen eines Entwurfs vereinbart. Es gehört deshalb nicht zu diesem Merge. Der Auftrag nannte «nicht aktuell» als Erwartung, darum steht es hier.
- Nachrechnung ohne Holz: 4'308.85 + 129.27 = 4'438.12, minus 4'200.00 = 238.12, auf 5 Rappen 238.10. Das passt zum gespeicherten Entwurf und zum QR-Betrag 238.10 seines (alten, italienischen) PDF.
- Reproduktion: `curl -H "Authorization: Bearer <JWT persona-kit>" http://localhost:3301/api/v1/statements/outdated`, danach `http://localhost:3300/statements/202d5811-a80d-4052-a78a-0a895ebadf9c` öffnen und nach «nicht aktuell» suchen (kein Treffer).

## Nachrechnung (unabhängig)

Skript: `/tmp/claude-0/-home-user-Dwello/3efecb5d-a00f-5e1e-a65b-e3d5bb52406c/scratchpad/daten1478/recompute.py` (liest Rechnungen, Verteilschlüssel, Verträge, Akonto, Tankbestände aus der Datenbank; Regeln aus Anforderungen und Glossar; Aufruf `python3 -I recompute.py`). Eingaben: 6 Wohnungen, 492.50 m², 22 Zimmer; Tankbestand Öl 31.12.2024 2'650.00, 31.12.2025 2'257.20; Heizung = 2'650.00 + 6'565.00 − 2'257.20 = 6'957.80; Holz = 1'200.00 (eintägig, 30.09.2025, ganz in der Periode) + 184.00 (01.07.–31.12.2025, ganz in der Periode) = 1'384.00; Schlüssel 0.7 × Fläche/492.5 + 0.3 × 1/6; alle drei Mieter 365/365 Tage; Pauschale 3 %; Saldo auf 5 Rappen zugunsten des Mieters.

| Position | Anna Schmidt (92 m², Akonto 3'600.00) | Pierre Dubois (85 m², Akonto 3'240.00) |
|---|---|---|
| Lift | 281.67 | 281.67 |
| Hauswart | 687.43 | 635.13 |
| Kaltwasser | 717.32 | 662.74 |
| Allgemeinstrom | 142.49 | 131.65 |
| Gartenpflege | 174.66 | 161.37 |
| Kehricht | 165.00 | 165.00 |
| Heizung | 1'257.70 | 1'188.48 |
| Holz (Wohnungsanteil = Ihr Anteil) | 250.17 | 236.40 |
| Kaminfeger | 62.58 | 57.82 |
| Zwischensumme | 3'739.02 | 3'520.26 |
| Pauschale 3 % | 112.17 | 105.61 |
| Ihre Nebenkosten | 3'851.19 | 3'625.87 |
| Saldo vor Rundung | 251.19 | 385.87 |
| Rundung | − 0.04 | − 0.02 |
| Saldo | 251.15 | 385.85 |

Verglichen Zeile für Zeile mit: `utility_statement_line_items` und `utility_statements` (Datenbank), `GET /api/v1/statements/{id}`, Webseite `/statements/{id}` (Kostenaufstellung und Abrechnungspositionen, Anteil in Prozent: Holz 18.08 % und 17.08 %), gespeichertes PDF (`pdftotext -layout`, Annas PDF Deutsch, Pierres PDF Französisch; beide byteidentisch mit `weber-1478/26-anna.pdf` und `27-pierre.pdf`). Alles gleich. Die Teile der Position Holz sind gespeichert als `delivery: "fuel"` für die Lieferung 1'200.00 (Zeitraum 01.01.–31.12.2025, ganze Periode) und ohne Merkmal für die Rechnung 184.00 (01.07.–31.12.2025, nach Tagen). Die Veränderung Tankbestand 392.80 gehört nur zu «Heizung»; das PDF zeigt im Kasten Heiz- und Warmwasserkosten nur das Öl (2'650.00 + 6'565.00 − 2'257.20 = 6'957.80).

Gegenprobe Maria Rossi (alter Stand ohne Holz) und Hans Müller (versendet, ohne Holz im Vertrag): meine Nachrechnung ergibt 4'308.85 / 129.27 / 4'438.12 / 238.10 bzw. 3'005.65 / 90.17 / 3'095.82 / 215.80; gespeichert gleich.

## Teilperiode (aus der Regel, nicht in der App geprüft)

Skript `daten1478/partial.py`. Annahme: Wohnung 1.02 (Wohnungsanteil Holz 250.17), Heizprofil Mittelland (Monatsanteile 17.5 / 14.5 / 13.5 / 9.5 / 3.5 / 0 / 0 / 0 / 1 / 10 / 13.5 / 17). Regel: die Lieferung 1'200.00 zählt über die ganze Periode nach Heizprofil, die Rechnung 184.00 (Juli–Dezember) nach den Monaten ihres Leistungszeitraums auf 100 % gebracht; Ihr Anteil = Wohnungsanteil × (Σ Betrag × Anteil) / 1'384.00.

| Mietverhältnis | Lieferung 1'200.00 | Rechnung 184.00 | Zeitanteil Position | Ihr Anteil |
|---|---|---|---|---|
| 15.08.–31.12.2025 | 41.50 % = 498.00 | 41.50 / 41.50 = 100 % = 184.00 | 49.28 % | 123.28 |
| 01.01.–15.08.2025 | 58.50 % = 702.00 | 0 % | 50.72 % | 126.89 |
| 01.10.–31.12.2025 | 40.50 % = 486.00 | 40.50 / 41.50 = 97.59 % = 179.57 | 48.09 % | 120.31 |

Zum Vergleich: Nach der alten Regel (Lieferung an ihrem Liefertag) hätte der Mieter vom 15.08. die ganzen 1'200.00 getragen (Ihr Anteil 250.17), der Mieter bis 15.08. nichts davon. Die neue Regel verteilt beides über das Heizprofil. Das ist die erwartete Wirkung.

## QR-Rechnungen

Seite 3 jedes PDF mit `pdftoppm -png -r 300` gerendert, mit zxing-cpp (in `daten1478/venv`, Skript `qr.py`) dekodiert. Prüfung der Prüfziffer mit `qrcheck.py`: Modulo 10 rekursiv, geeicht am SIX-Beispiel 21 00000 00003 13947 14300 09017 (Prüfziffer 7).

| Abrechnung | IBAN | Betrag | Referenz (QRR) | Mitteilung | Zahlungspflichtiger |
|---|---|---|---|---|---|
| NK-11111111-2025-0002 (DE) | CH44 3199 9123 0008 8901 2 | 251.15 CHF | 00 82157 86813 29982 51744 66683 | Nebenkostenabrechnung NK-11111111-2025-0002 | Anna Schmidt, Bahnhofstrasse 42, 8001 Zürich |
| NK-11111111-2025-0003 (FR) | gleiche | 385.85 CHF | 00 54482 69544 93513 44237 69631 | Décompte des charges NK-11111111-2025-0003 | Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich |

- IBAN: Prüfsumme mod 97 gültig, Bank-IID 31999 (QR-IBAN, daher Referenztyp QRR richtig), Gläubiger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich gleich den Einstellungen (`configuration`).
- Betrag gleich dem Saldo des Entwurfs und dem im PDF gedruckten Betrag (Empfangsschein und Zahlteil).
- Referenz: 26 Stellen = die ersten 80 Bit der Abrechnungs-UUID als Dezimalzahl (adf9de9b-5f35-45ae-880c → 00821578681329982517446668; 735f20dd-ceee-45cd-bd03 → 00544826954493513442376963), Prüfziffer 3 bzw. 1 stimmt (erwartet 3 bzw. 1), gleich `qr_bill_reference` in der Datenbank.
- Zahlungspflichtiger gleich der Adresse des Mieters.
- Zur Gegenprobe auch die zwei anderen Abrechnungen dekodiert: Hans Müller 215.80, Prüfziffer 2 richtig; Maria Rossi 238.10, Prüfziffer 7 richtig.

Geprüft: Entwürfe NK-11111111-2025-0002 (Anna Schmidt) und NK-11111111-2025-0003 (Pierre Dubois) mit allen Positionen, Anteilen, Pauschale, Saldo und Rundung, Webseite, PDF (DE, FR) und QR-Rechnung; Eingaben der Kategorie «Holz» (Rechnungen d018394e…, 8a8ce8c0…, Teile `delivery: "fuel"`, nur die Lieferung als Lieferung); Heizung (Verbrauch aus dem Tank, ohne Holz); NK-11111111-2025-0001 und -0004 als unverändert (alter Stand, Beträge und QR richtig für ihren Stand).

## Nicht bestätigt

- **PDF auf Italienisch und Englisch.** Es gibt keinen gespeicherten PDF mit dem neuen Text in diesen Sprachen (Marias PDF ist italienisch, aber vor Holz). Ein neues PDF in dieser Sprache zu erzeugen (`POST /statements/{id}/generate-pdf` mit `language`) würde `pdf_blob` der Entwürfe überschreiben; das habe ich nicht getan. Gelesen habe ich nur die Texte `partDeliveryFuel` und `sharesNoteDeliveryFuel` in `backend/src/services/pdf-texts/{it,en}.ts` (Diff 9507aa4..e3a39ad); sie sagen dasselbe wie der deutsche und französische Text. `partDeliveryFuel` und die Texte `statements_part_delivery_fuel*` der Weboberfläche erscheinen nur bei einem Mieter mit Teilperiode (dann zeigt das PDF die Rechnungen einzeln); in den drei Entwürfen (365/365) sind sie nicht erreichbar, also nicht gesehen.
- **Teilperiode in der App.** Nur aus der Regel gerechnet (Tabelle oben), nicht gegen die App geprüft, weil kein Speichern erlaubt ist und kein Mietvertrag mit Teilperiode in Musterhaus Zentrum liegt.
- **Rechnungsseite (Hinweis «Nur die Tage in der Abrechnungsperiode zählen.»).** Die laufende Persona-App (`/tmp/persona-app`, gebaut 21:59:12) ist älter als die Commits 396a597 (22:04:37) und e3a39ad (22:08:34), die diesen Hinweis ändern. Die Seiten `/invoices/d018394e-805c-4795-b7d6-55063a513008` und `/invoices/8a8ce8c0-a092-43bd-91eb-911cf0cc23fa` zeigen darum noch den Hinweis unter dem eintägigen Leistungszeitraum (so wie Dr. Weber P-2 meldet). Das sagt nichts über den Stand e3a39ad. Zur Prüfung braucht es einen neuen Build der Persona-App (`persona-stack.sh --keep-db`, vom Aufrufer). Betrifft keinen Betrag. Das Backend lief aus dem Stand vor diesen Commits; sie ändern im Backend nichts (`git diff 93a7f8e e3a39ad --stat -- backend` leer), die gespeicherten Beträge und PDFs sind darum für e3a39ad gültig.
- **Ohne Tankbestand, Gebäude ohne Tank und weitere Kategorien** (Fachreview V-2): nicht an Daten geprüft; in Musterhaus Zentrum gibt es nur einen Tankbestand Öl.
