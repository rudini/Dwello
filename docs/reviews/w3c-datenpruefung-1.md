# Datenprüfung W3c-1: Korrespondenzadresse mit Land (#102), IBAN aus CH oder LI (#191), Entwurfs-PDF frisch

Worktree: `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/review-feature-daten` (a454fa4). Datenbank `dwello_persona`, Backend :3301, Frontend :3300.
Skripte (im Scratchpad, nicht im Repository):
- `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/chk/recompute.py` (Neuberechnung aus der Datenbank)
- `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/chk/langs.py` (PDFs in 4 Sprachen, QR-Decodierung)
- `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/chk/pdfnum.py` (Beträge im PDF-Text)
- `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/chk/ref.py` (Prüfziffer der QR-Referenz)

PDFs und PNGs liegen unter `/tmp/claude-0/-home-user-Dwello/9763c2a5-bde2-588e-97c1-9dbf2545f8c8/scratchpad/pdf/`.

## Ergebnis

Keine Abweichung gefunden. Alle Beträge stimmen auf den Rappen, die Saldi sind richtig auf 5 Rappen gerundet, und die QR-Codes stimmen mit dem gedruckten Zahlteil überein. Die Änderung bewirkt, was beschrieben ist.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| (keine Befunde) | | | | |

Hinweis zur Methode: Mein erster Lauf meldete bei 14 von 17 QR-Referenzen eine falsche Prüfziffer. Das war ein Fehler in meiner Übertragstabelle, kein Befund. Mit der Tabelle 0-9-4-6-8-2-7-1-3-5 und dem SIX-Beispiel (21 00000 00003 13947 14300 09017 gibt Prüfziffer 7) stimmen alle 17 Referenzen.

## Neuberechnung der Beträge

Das Skript `recompute.py` liest Rechnungen, Verteilschlüssel, Wohnungen, Mietverträge, Heizprofile und Tankbestände aus der Datenbank. Es verwendet keinen Dwello-Code. Regeln: `docs/nebenkostenabrechnung-anforderungen.md`, Regeln in Dwello 1 bis 11.

- Wohnungsanteil auf Rappen gerundet, Ihr Anteil = Wohnungsanteil × Zeitanteil, wieder gerundet.
- Heizung Musterhaus: Verbrauch = Anfangsbestand 2650.00 + Lieferung 6565.00 − Endbestand 2257.20 = 6957.80.
- Heizung Seepark: Fernwärme Q4 2024 (Rechnung vom 20.01.2025) zählt nicht, Q4 2025 (Rechnung vom 20.01.2026, Leistungszeitraum) zählt in 2025. Summe 4115.00.
- Teilperioden (Meier, Brunner): Heizung nach Heizprofil (55.8 % und 44.2 %), alles andere nach Mietstagen (181 und 184 von 365).
- Verwaltungspauschale 3 %, bei Bernasconi 2.5 % (eigener Satz).
- Saldo = Ihre Nebenkosten inklusive Pauschale − Akonto, kaufmännisch auf 5 Rappen gerundet.

Ergebnis: `totals_ok` und `lines_ok` sind für alle 17 Abrechnungen True. Verglichen wurden Summe der Anteile, Pauschale, Akonto, Saldo und jede Position (Gesamtkosten, Wohnungsanteil, Ihr Anteil). Das gilt auch für die bezahlten und die versandte Abrechnung.

Entwürfe 2025 (Saldo vor Rundung → Saldo, berechnet = gespeichert):

| Abrechnung | Mieter (Land) | Vor Rundung | Saldo | QR-Rechnung |
|---|---|---|---|---|
| NK-11111111-2025-0002 | Schmidt (CH) | −6.48 | −6.50 | nein (Rückerstattung) |
| NK-11111111-2025-0003 | Dubois (LI) | 142.38 | 142.40 | ja |
| NK-11111111-2025-0004 | Rossi (IT) | 238.12 | 238.10 | ja |
| NK-22222222-2025-0001 | Weber (DE) | −34.56 | −34.55 | nein (Rückerstattung) |
| NK-22222222-2025-0002 | Meier (CH) | 137.98 | 138.00 | ja |
| NK-22222222-2025-0003 | Brunner (CH) | −93.87 | −93.85 | nein (Rückerstattung) |
| NK-22222222-2025-0004 | Bernasconi (CH) | 75.82 | 75.80 | ja |

Vergleich mit dem PDF: `pdfnum.py` sucht für jeden der 7 Entwürfe in jeder der Sprachen de, fr, it und en alle berechneten Beträge im PDF-Text (Kosten, Wohnungsanteil, Ihr Anteil, Zwischensumme, Pauschale, Nebenkosten, Akonto, Saldo vor Rundung, Rundungsbetrag, Saldo). 28 von 28 PDFs sind vollständig, nichts fehlt. Die Zeile «Rundung auf 5 Rappen» steht bei Rossi mit −0.02, bei Meier mit +0.02 und bei Weber mit −0.01, das Vorzeichen stimmt mit der Regel 8.

Vergleich mit der Webseite: `/statements/<id>` mit selbst erzeugter Sitzung, Sprache de, für Rossi, Meier, Weber und Dubois. Saldo vor Rundung, Rundung und Saldo sind identisch mit Neuberechnung und PDF. Beispiel Weber: «Rückerstattung vor Rundung CHF 34.56, Rundung − CHF 0.01, Saldo CHF 34.55».

## QR-Rechnungen (Rendern mit `pdftoppm -png -r 300`, Decodieren mit zxing-cpp)

Alle Zahlteile wurden aus dem PDF gerendert und decodiert, in je 4 Sprachen (16 Dateien mit QR-Code) plus die versandte Abrechnung. Alle Zeilen der Nutzlast stimmen.

Mit der konfigurierten IBAN CH44 3199 9123 0008 8901 2 (QR-IBAN, IID 31999):

| Abrechnung | Betrag | Schuldner (Typ S, Name, Strasse, Hausnr. leer, PLZ, Ort, Land) | Referenz |
|---|---|---|---|
| NK-11111111-2025-0003 | 142.40 CHF | Pierre Dubois, Städtle 1, 9490, Vaduz, LI | QRR 006814861342986163717181061, Prüfziffer ok |
| NK-11111111-2025-0004 | 238.10 CHF | Maria Rossi, Via Roma 12, 22100, Como, IT | QRR 006586014053969769479316539, Prüfziffer ok |
| NK-22222222-2025-0002 | 138.00 CHF | Sarah Meier, Seeweg 15, 6003, Luzern, CH | QRR 006232720507278874007780202, Prüfziffer ok |
| NK-22222222-2025-0004 | 75.80 CHF | Marco Bernasconi, Seeweg 15, 6003, Luzern, CH | QRR 010969567848720433674659101, Prüfziffer ok |
| NK-11111111-2025-0001 (versandt) | 215.80 CHF | Hans Müller, Bahnhofstrasse 42, 8001, Zürich, CH | QRR 002721153555334824955452291, Prüfziffer ok |

- Gläubiger in allen Fällen: Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH. IBAN mod-97 gültig. Zusatzinformation = «Nebenkostenabrechnung NK-…» in der Sprache der Datei, Trailer EPD.
- Die gespeicherte Referenz in `utility_statements.qr_bill_reference` ist bei allen 17 Abrechnungen gleich der Referenz im QR-Code (soweit es einen gibt) und hat eine gültige Prüfziffer.
- Die Postleitzahl steht in der Nutzlast im eigenen Feld, ohne Ländercode (SIX-konform). Der Ländercode steht nur im gedruckten Zahlteil.
- Gedruckter Zahlteil und Empfangsschein (`pdftotext`): Dubois «LI-9490 Vaduz», Rossi «IT-22100 Como», Meier und Bernasconi «6003 Luzern» ohne Präfix. Betrag, Konto, Referenz (in 5er-Gruppen) und Zusatzinformation stimmen mit der Nutzlast überein, in fr, it, de und en.
- Schmidt, Weber und Brunner haben Rückerstattungen: kein Zahlteil, korrekt («QR-Rechnung nur bei Nachzahlung»).

## Adressblock (#102)

Unterste Zeile des Empfängerblocks, in Grossbuchstaben, allein: Weber «DEUTSCHLAND», Rossi «ITALIA», Dubois «LIECHTENSTEIN». Bei Weber ist es in allen vier Sprachen «DEUTSCHLAND» (Land in seiner eigenen Sprache, nicht in der Sprache des PDFs). Meier und Bernasconi (CH) zeigen keine Länderzeile.

## IBAN aus Liechtenstein (#191)

`configuration.iban` kurz auf `LI21088100002324013AA` gesetzt, wieder auf `CH4431999123000889012` zurückgesetzt (geprüft). Alle Nachzahlungs-Entwürfe in 4 Sprachen neu erzeugt.
- IBAN mod 97 gültig, IID 08810 ist keine QR-IID: Referenztyp `NON`, Referenzfeld leer, im Zahlteil keine Zeile «Referenz» (im Text geprüft). Das entspricht der Regel «Referenz nur mit QR-IBAN».
- Gläubigerland bleibt CH (Adresse der Verwaltung), Schuldner und Betrag bleiben richtig.
- Das PDF druckt die IBAN als «LI21 0881 0000 2324 013A A».

## Entwurfs-PDF frisch

Beim Start trugen die gespeicherten Entwurfs-PDFs den Stand vor dem SQL-Update (`pdf_generated_at` 23:15, alle am selben Tag). Ein GET `/api/v1/statements/<id>/pdf` auf alle 7 Entwürfe erzeugte alle neu (`pdf_generated_at` 23:18:56 bis 23:18:57, andere md5). Das PDF zeigt danach die neue Adresse. Die Änderung wirkt also auch am selben Tag. Beobachtung ohne Befund: Jeder Aufruf überschreibt `pdf_blob` und `pdf_generated_at`.

## Versandte und bezahlte Abrechnungen unverändert

- NK-11111111-2025-0001 (versandt): GET `/pdf` lieferte 24'688 Byte mit md5 483d81f3207aca6f5027da2101f2323a, gleich dem gespeicherten Blob (md5 des Blobs vorher und nachher d21a17d6cede0cfe0a08201e92501cf9, `pdf_generated_at` 23:15:58.594 unverändert).
- Alle 10 bezahlten und versandten Abrechnungen: md5 und `pdf_generated_at` vor und nach meinen Läufen identisch (`chk/blobs_before.txt` gegen `chk/blobs_after.txt`).
- NK-11111111-2024-0004 (bezahlt, Maria Rossi, deren Adresse jetzt in Como liegt): GET liefert den gespeicherten Blob (md5 f8ffffd1651e1cd8f663bbc38c8391d0, gleich der Datenbank). Adresse und QR-Schuldner bleiben «Bahnhofstrasse 42, 8001 Zürich, CH», wie versandt.

## Geprüfte und bestandene Datensätze

- Abrechnungen: alle 17 (7 Entwürfe 2025 inklusive der 4 mit Änderung, 1 versandte, 9 bezahlte): Beträge, Positionen, Saldo.
- PDFs: 7 Entwürfe × 4 Sprachen (Beträge), 4 QR-Entwürfe × 4 Sprachen (QR und Zahlteil), 4 QR-Entwürfe × 4 Sprachen mit LI-IBAN, 1 versandte und 1 bezahlte (unverändert).
- Prüfziffer der QR-Referenz: 17 von 17.
- Mieter: Rossi (IT), Dubois (LI), Weber (DE), Meier (Luzern, ausgezogen), Bernasconi, Schmidt, Brunner.

## Nicht bestätigt

- Die versandte Abrechnung wurde nicht mit einer Version vor der Änderung verglichen. Ich habe keinen Stand von vor der Änderung, nur die Gleichheit mit dem gespeicherten Blob, der beim Laden der Demodaten mit diesem Commit entstand. Dass der GET ihn nicht neu erzeugt, ist belegt. Dass er vorher gleich war, nicht.
- Die Webseite habe ich nur auf Deutsch und für 4 Abrechnungen geprüft (Rossi, Meier, Weber, Dubois). Die übrigen Entwürfe und fr, it und en auf der Seite habe ich nicht angesehen. Die Beträge dort kommen aus denselben gespeicherten Werten, die ich gegen meine Neuberechnung geprüft habe.
- Ein Land ausserhalb der Nachbarländer (Länderzeile auf Englisch) ist mit den vorgegebenen Datensätzen nicht prüfbar. Ich habe dafür keinen Mieter geändert.
- Das grafische Layout des Zahlteils (Schriftgrössen, Schweizerkreuz, Mass 210 × 105 mm) habe ich nicht gegen den SIX-Style-Guide geprüft. Geprüft sind Nutzlast und gedruckter Text.
- Zustand nach der Prüfung: Die IBAN ist zurückgesetzt. Die Entwurfs-PDFs sind durch einen letzten GET (Sprache = Sprache des Mieters) neu erzeugt. Ich habe keine anderen Daten verändert.
