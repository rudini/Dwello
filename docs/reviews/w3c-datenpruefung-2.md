# Datenprüfung W3c-2: PDF wie versandt beim Versand (1a936d2)

Worktree 1a936d2, Datenbank `dwello_persona`, Backend :3301. Skripte im Scratchpad (nicht im Repository): `.../scratchpad/chk/recompute.py` (Neuberechnung aus der Datenbank, ohne Dwello-Code), `chk/qr.py`, `chk/ref.py`, `chk2/amt.py`, `chk2/dump.py`. PDFs unter `.../scratchpad/pdf2/`. Vorher/nachher-Stände: `chk2/before.txt`, `chk2/after.txt`.

## Ergebnis

Die Änderung wirkt wie beschrieben. Ein Befund (Minor) an der API, der nicht von der Oberfläche aus erreichbar ist.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| D-1 | Minor | POST `/api/v1/statements/:id/generate-pdf` auf eine versandte Abrechnung (NK-22222222-2025-0001, NK-11111111-2025-0004) | Das beim Versand gespeicherte PDF bleibt, auch bei einem direkten API-Aufruf | Der Aufruf erzeugt das PDF neu und überschreibt `pdf_blob`/`pdf_generated_at` mit dem aktuellen Mieterstand. `generateStatementPdf` prüft den Status nicht |

Beleg D-1: Nach dem Versand änderte ich die Adresse von Weber (SQL) auf «Hauptstr 9, 10115 Berlin» und die von Rossi auf «Via Roma 12, 22100 Como, IT».
- GET `/pdf`: liefert unverändert das gespeicherte PDF (Datei-md5 gleich Blob-md5 b22b16fd… bzw. f532c8c4…, `pdf_generated_at` unverändert 00:04:55.716 / 00:04:55.947). Das ist gut.
- POST `/generate-pdf` (Body `{"language":"de"}`, bzw. `it`): HTTP 200, Blob-md5 neu (c838d878…, efb0c2e8…), `pdf_generated_at` 00:05:17; das PDF zeigt danach «Hauptstr 9 / 10115 Berlin» bzw. «Via Roma 12 / 22100 Como».
- Reproduktion: Abrechnung versenden, Mieteradresse ändern, `curl -X POST -H "Authorization: Bearer <jwt>" -H 'Content-Type: application/json' -d '{"language":"de"}' localhost:3301/api/v1/statements/<id>/generate-pdf`, dann `select md5(pdf_blob) …`.
- Einordnung: Die Oberfläche zeigt für eine Abrechnung mit gespeichertem PDF nur «Herunterladen» (`PdfAction.svelte`, `generated`), der Fehler tritt dort nicht auf. Nur eine API-Nutzung (oder eine Abrechnung ohne gespeichertes PDF, siehe «Nicht bestätigt») erreicht ihn. Der gleiche Code gälte für bezahlte Abrechnungen (nicht ausgeführt, um deren Daten nicht anzutasten). Vorschlag: `generateStatementPdf` für Status ≠ draft ablehnen, wenn ein Blob existiert. Ich habe die Test-Abrechnungen danach wiederhergestellt (siehe unten).

## Versand (Weber, Rossi)

Versendet über PUT `/api/v1/statements/:id/status` `{"status":"sent"}`: NK-22222222-2025-0001 (Thomas Weber, Seepark A1, Rückerstattung) und NK-11111111-2025-0004 (Maria Rossi, Musterhaus, Nachzahlung 238.10; mein Musterhaus-Entwurf).

- Sofort gespeichert: `pdf_generated_at` 00:04:55.716 (Weber) und 00:04:55.947 (Rossi), `now()` 00:04:55.76 bzw. .99, Status `sent`. Der Blob war vorher das Entwurfs-PDF (Weber: noch Seeweg 15, 6003 Luzern; md5 d46c6b0f…) und ist danach ein neuer (b22b16fd…).
- Weber nach dem Versand: Adressblock «Thomas Weber / Marktstätte 3 / 78462 Konstanz / DEUTSCHLAND». Die Entwurfsfassung zeigte noch Luzern, der Versand holt also den Stand beim Versenden. Absender Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich.
- Rossi: Adressblock «Bahnhofstrasse 42 / 8001 Zürich» (ihre Adresse in dieser frisch geladenen Datenbank, CH, keine Länderzeile).
- Beträge (`chk2/amt.py` gegen `recompute.py`): alle Beträge der Abrechnung im PDF-Text vorhanden, nichts fehlt. Weber: Anteile, Pauschale 68.90, Akonto 2400.00, vor Rundung −34.56, Rundung, Saldo −34.55. Rossi: Heizung 6'957.80 (2650.00 + 6565.00 − 2257.20 im Posten «Scorta finale» sichtbar), Pauschale 129.27, Akonto 4200.00, vor Rundung 238.12, Saldo 238.10.
- Weber (Rückerstattung): kein Zahlteil, QR-Decodierung 0 Codes, korrekt.
- Rossi QR (gerendert mit `pdftoppm -png -r 300`, zxing-cpp): IBAN CH4431999123000889012, Gläubiger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH; Betrag 238.10 CHF; Schuldner Typ S, Maria Rossi, Bahnhofstrasse 42, 8001 Zürich, CH; Referenztyp QRR; Referenz 000325567683932452716326010, Prüfziffer 0 stimmt (`ref.py`), gleich `utility_statements.qr_bill_reference`; Zusatzinformation «Conteggio spese accessorie NK-11111111-2025-0004», Trailer EPD. Der gedruckte Zahlteil und der Empfangsschein zeigen dieselben Werte (Konto «CH44 3199 9123 0008 8901 2», Referenz «00 03255 67683 93245 27163 26010», Betrag 238.10, Schuldner).
- Weber: gespeicherte Referenz 009943472947956758627340787, Prüfziffer 7 stimmt (wird für eine Rückerstattung gespeichert, aber nicht gedruckt; unverändert gegenüber Runde 1).
- Wiederholter Versand: PUT `sent` auf eine versandte Abrechnung → 400 «Invalid status transition from sent to sent», Blob unverändert.

## Spätere Adressänderung

Nach dem Versand Adresse in `tenants` geändert (Weber → Berlin, Rossi → Como/IT), danach:
- GET `/pdf`: unverändert (siehe oben, Hash gleich).
- GET `/pdf?language=fr`: Der Parameter wirkt nicht; liefert das gespeicherte PDF.
- Nur POST `/generate-pdf` ändert es (D-1).

## Wiederherstellung

Adressen von Weber (Marktstätte 3, 78462 Konstanz, DE) und Rossi (Bahnhofstrasse 42, 8001 Zürich, CH) zurückgesetzt, beide PDFs neu per POST erzeugt (de bzw. it) und geprüft: Adressblock wieder Konstanz/DEUTSCHLAND bzw. Zürich, QR wie oben (Datei `pdf2/final-*.pdf`). Beide Abrechnungen stehen jetzt auf `sent` (mein Test); ihr Blob hat nicht mehr genau die Bytes vom Versand (Zeitstempel 00:05:47), aber denselben Inhalt. Sarah Meiers Abrechnung habe ich nicht angefasst; ihr Entwurfs-PDF wurde zwischenzeitlich (00:05:18) von einer anderen Sitzung neu erzeugt, das ist normal für einen Entwurf.

## Bezahlte und früher versandte Abrechnungen unverändert

`chk2/before.txt` gegen `chk2/after.txt` (statement_number, status, pdf_generated_at, md5 des Blobs, alle 17): einziger Unterschied sind meine zwei versandten Abrechnungen und Meiers Entwurf (andere Sitzung). Die 9 bezahlten (NK-11111111-2024-0001..0004, NK-22222222-2024-0001..0003, NK-33333333-2024-0001..0002) und die bereits versandte NK-11111111-2025-0001 haben gleiche `pdf_generated_at` (00:03:01 bis 00:03:02) und gleiche md5. Die übrigen 4 Entwürfe (NK-11111111-2025-0002/0003, NK-22222222-2025-0003/0004) sind unverändert.

## Beträge aller 17 Abrechnungen

`recompute.py` (Regeln aus `docs/nebenkostenabrechnung-anforderungen.md`): `totals_ok` und `lines_ok` True für alle 17, Saldi auf 5 Rappen kaufmännisch gerundet, identisch mit Runde 1 (z. B. 238.12 → 238.10, −34.56 → −34.55, 137.98 → 138.00, 75.82 → 75.80, −93.87 → −93.85, 142.38 → 142.40, −6.48 → −6.50). Prüfziffer der QR-Referenz: alle 17 gültig (`ref.py`). Die Beträge haben sich seit Runde 1 nicht geändert.

## Geprüfte und bestandene Datensätze

- Abrechnungen: alle 17 (Beträge, Positionen, Saldo, Referenz-Prüfziffer).
- Versand: NK-22222222-2025-0001 (Weber), NK-11111111-2025-0004 (Rossi): sofort gespeichert, Adresse, Beträge, QR/Zahlteil (Rossi).
- Unverändert: 9 bezahlte, NK-11111111-2025-0001 (versandt), 4 weitere Entwürfe.

## Nicht bestätigt

- Weber hat eine Rückerstattung, also keinen QR-Zahlteil; QR und Zahlteil des Versands habe ich deshalb nur an Rossi (Musterhaus) geprüft, nicht an einer Abrechnung mit Auslandsadresse. Ein Versand mit Auslandsadresse und Nachzahlung (Länderzeile «DE-78462» im Zahlteil) ist mit den vorhandenen Daten nicht möglich, ohne Webers Saldo zu ändern.
- Sprachen: Versand nur in der Sprache des Mieters (de für Weber, it für Rossi) geprüft, nicht fr/en.
- Saldo 0 beim Versand: `updateStatementStatus` setzt solche Abrechnungen sofort auf `paid`; `changeStatementStatus` erzeugt das PDF nur bei `sent` (`statement?.status === 'sent'`), also dann nicht beim Versand, sondern erst bei der ersten Anfrage (mit dem Mieterstand dann). Aus dem Code gelesen, in den Demodaten gibt es keine Abrechnung mit Saldo 0, daher nicht ausgeführt.
- Übergang `sent` → `paid`: nicht ausgeführt, um keine weiteren Daten zu verändern; dass Bezahlen das PDF nicht neu erzeugt, ist nur aus den vorhandenen bezahlten Abrechnungen (Hash unverändert) und dem Code (`updateStatementStatus` setzt `pdfBlob: null` nur bei `sentToday`) belegt.
- Webseite und alle vier Sprachen des versandten PDFs habe ich in dieser Runde nicht erneut durchgesehen (Runde 1 deckte das ab; die Beträge kommen aus den gleichen gespeicherten Werten).
- Grafisches Layout des Zahlteils gegen den SIX-Style-Guide: nicht geprüft.
