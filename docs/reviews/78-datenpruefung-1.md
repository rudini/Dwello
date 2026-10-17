# Datenprüfung #78 (QR-Rechnung SIX IG v2.4), Commit 31a6c3d9

Geprüft gegen die laufende Persona-Stack-Instanz (Backend :3301, DB `dwello_persona`). Eigene Skripte liegen ausserhalb des Repositorys in `/tmp/claude-0/-home-user-Dwello/944a679c-a383-5496-9d09-90f0e164b810/scratchpad/dec/` (`token.mjs`, `fetch.mjs`, `decode.mjs`, `verify.mjs`). Decoder: jsQR (npm, im Scratchpad installiert), Seite 2 des PDFs mit `pdftoppm -png -r 300`.

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| (keine) | - | - | - | Kein Blocker, Major, Minor oder Nit. |

Es gibt keine Befunde. Alle geprüften Datensätze stimmen auf den Rappen.

## Geprüft und bestanden

### 1. NK-11111111-2025-0003 (Pierre Dubois, fr, Entwurf, Nachzahlung)
PDF über `GET /api/v1/statements/3d921222-016f-4195-adf8-ee1b8fd8c60c/pdf` (HTTP 200, application/pdf, 2 Seiten). QR-Code von Seite 2 mit jsQR decodiert. Prüfung mit `verify.mjs`, alle Punkte OK:
- 31 Elemente, letztes Element `EPD`, kein Zeilenumbruch am Ende, kein `\r`. Kopf `SPC`, `0200`, `1`.
- IBAN `CH4431999123000889012`: Grossbuchstaben, 21 Zeichen, Modulo 97 gleich 1, entspricht der Einstellung `iban` in `configuration`. IID 31999 liegt im QR-IID-Bereich (30000-31999), deshalb Referenztyp `QRR`.
- Betrag `142.35` gleich gespeichertem `balance` und gleich dem Betrag im PDF-Text. Währung `CHF`.
- Referenz `002907588866982291967626168` gleich `qr_bill_reference` in der DB. 27 Ziffern, rekursive MOD10-Prüfziffer selbst berechnet: 8, wie in der Referenz.
- Nachricht `Décompte des charges NK-11111111-2025-0003`.
- Zahlungsempfänger `S|Muster Immobilien AG|Bahnhofstrasse 1||8001|Zürich|CH` gleich den Einstellungen. Die 7 Elemente des endgültigen Zahlungsempfängers sind leer.
- Zahlungspflichtiger `S|Pierre Dubois|Bahnhofstrasse 42||8001|Zürich|CH`, entspricht der Mieter-Zeile.
- Nur zulässige Zeichen (IG 4.1.1, eigener Regex), Text in NFC.
- Zahlteil und Empfangsschein drucken Konto, Zahlungsempfänger, Referenz (Gruppen zu 5, `00 29075 88866 98229 19676 26168`), Nachricht, Zahlbar durch, CHF und 142.35. Das gilt in beiden Teilen und stimmt mit dem QR-Inhalt überein.
- Saldo: Summe der Positionen 3283.86 + Pauschale 3 % = 98.52 (98.5158) = 3382.38. Minus Akonto 3240.00 (12 × 270.00 aus dem Vertrag) = 142.38. Nachzahlung wird zugunsten des Mieters abgerundet (Anforderungen Thema 6/8, #79): 142.35. Das PDF zeigt «Arrondi à 5 centimes – 0.03».

### 2. NK-11111111-2025-0004 (Maria Rossi, it, Entwurf, Nachzahlung)
PDF über `GET /api/v1/statements/95f8acf0-3e82-4062-bd03-9644db526c84/pdf`. Alle Punkte OK:
- 31 Elemente, `EPD`, IBAN wie oben. Betrag `238.10` gleich `balance`.
- Referenz `007082198600067551866872357` gleich DB, MOD10-Prüfziffer 7 selbst berechnet.
- Nachricht `Conteggio spese accessorie NK-11111111-2025-0004`.
- Zahlungspflichtiger `S|Maria Rossi|Bahnhofstrasse 42||8001|Zürich|CH`.
- Zahlteil, Empfangsschein und QR-Inhalt stimmen visuell überein (Seite gerendert und angesehen). «Informazioni supplementari» endet etwa 7 mm vor dem rechten Seitenrand, also innerhalb der Seite.
- Saldo: Summe der Positionen 4308.85 + Pauschale 129.27 = 4438.12. Minus Akonto 4200.00 (12 × 350.00) = 238.12, abgerundet auf 238.10.

### 3. Rechnung ohne Zahlungspflichtigen (Pierre Dubois ohne Adresse)
Ablauf: `UPDATE tenants SET address = NULL, postal_code = NULL, city = NULL WHERE first_name = 'Pierre' AND last_name = 'Dubois'` (1 Zeile). Dann PDF neu geholt (`n3b.pdf`) und Seite 2 decodiert.
- QR-Element 21-27 sind 7 leere Elemente (Ausgabe von `verify.mjs`: `["","","","","","",""]`), zwischen Währung `CHF` und `QRR`. Insgesamt weiterhin 31 Elemente, Betrag 142.35, Referenz und Nachricht unverändert.
- Gedruckt in Empfangsschein und Zahlteil: «Payable par (nom/adresse)» (fr), mit leerem Feld und Eckmarken (`pdftotext` zeigt die Überschrift zweimal, und «Pierre Dubois» steht nirgends). Gemessen im 300-dpi-Bild: Feld im Empfangsschein 52 × 20 mm, im Zahlteil 65 × 25 mm, Eckmarken 3 mm. Das entspricht SIX (Empfangsschein 52 × 20, Zahlteil 65 × 25). Das Feld im Empfangsschein endet über «Monnaie/Montant».
- Daten danach wiederhergestellt: `UPDATE tenants SET address = 'Bahnhofstrasse 42', postal_code = '8001', city = 'Zürich' ...` (1 Zeile), PDF des Entwurfs danach neu erzeugt (`n3c.pdf`, HTTP 200), damit der gespeicherte Blob wieder zur Adresse passt. Die Adresse war vorher laut Abfrage `Bahnhofstrasse 42 / 8001 / Zürich`.

## Nicht bestätigt
- Die Positionen (Summe der Anteile je Kategorie) habe ich nicht aus Rechnungen, Schlüsseln und Heizstand neu berechnet. Das war nicht Teil des Auftrags, der den QR-Teil und den Betrag betrifft. Ich habe nur geprüft: Summe `tenant_share` + Pauschale − Akonto, Rundung auf 5 Rappen, Gleichheit mit dem Betrag im QR-Code.
- Nicht geprüft: deutsche und englische PDFs und die vier Sprachen der neuen Zeile «Zahlbar durch (Name/Adresse)». fr wurde am PDF geprüft, it nur mit Adresse (nicht ohne), de und en nur im Quelltext (`pdf.service.ts`).
- Nicht geprüft: Zeichen-Ersatzregeln mit Sonderzeichen (typografische Anführungszeichen, kombinierte Diakritika) in der Demo-Datenbank. Die Demo-Daten enthalten keine; das deckt nur der Unit-Test des Commits ab, den ich nicht ausgeführt habe.
- Nicht geprüft: Annahme durch eine echte Bank oder den SIX-Validator, nur die eigene Prüfung gegen die IG-Regeln.
- Die Web-Seite (:3300) habe ich nicht aufgerufen, weil sie die Betragswerte aus derselben `balance`-Spalte liest und keine QR-Daten zeigt. Ein Abgleich mit der Seite fehlt deshalb.
