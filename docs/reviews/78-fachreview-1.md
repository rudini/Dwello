# Fachreview #78 (Runde 1): QR-Rechnung gegen SIX IG v2.4

Gegenstand: Worktree `review-78-fach`, Commit d5c354f3: das @wip-Szenario «Der Zahlteil ohne Korrespondenzadresse hat ein Feld für Name und Adresse» (`tests/e2e/features/statement-detail.feature:236-245`), die geplanten Änderungen a–c und die Feldprüfung d.
Quellen: SIX-PDFs sind nicht abrufbar (WebFetch: DNS-Fehler auch für Drittseiten). Deshalb Auszüge über `mmx search` (Snippets). Wo ein Snippet aus dem SIX-PDF v2.4 selbst stammt, steht «IG v2.4 (Snippet)».

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major (besteht schon, #395) | Fehlt die Firmenadresse, nennt die QR-Rechnung einen erfundenen Zahlungsempfänger («Dwello Property Management», 8000 Zürich) |
| V-2 | Verwalter | Minor | Der Payload endet mit LF (`EPD\n`, leeres StrdBkgInf); die IG verbietet einen abschliessenden Zeilenumbruch |
| V-3 | Verwalter | Minor | Der Block «Konto / Zahlbar an» wird aus `config` gedruckt, nicht aus dem Inhalt des Codes; nach Plan a weichen Druck und Code voneinander ab |
| V-4 | Verwalter | Minor | Das Szenario setzt «ohne Korrespondenzadresse» voraus, ohne es zu sagen |
| V-5 | Verwalter | Nit | Plan a: Reihenfolge (erst bereinigen, dann kürzen), weitere Zeichen («„» «‚» «…»), Umschrift vor «.», IBAN in Grossbuchstaben |
| V-6 | Verwalter | Nit | Das leere Feld «Zahlbar durch (Name/Adresse)» erscheint auch im Zahlteil der Mahnung (gemeinsames `paymentPart`); das ist korrekt, aber ungetestet |
| V-7 | Verwalter | Nit | Das Land des Zahlungsempfängers ist fest «CH», obwohl eine LI-IBAN akzeptiert wird |
| V-8 | Verwalter | Nit | Die Proportionen des Schweizerkreuzes sind selbst gezeichnet (Balken 4.2 × 1.33 mm), nicht die SIX-Grafik; nicht geprüft |
| V-9 | Verwalter | Nit | Ein Name über 70 Zeichen wird im Code gekürzt, aber ungekürzt gedruckt |

Mietrecht: kein Befund. Die geplanten Änderungen betreffen nur die Form des Zahlungsbelegs, keine Regel nach OR Art. 257a–257b oder VMWG Art. 4–8. Rechtstexte: nicht betroffen.

## Befunde

### V-1 (Major, besteht schon, verfolgt in #395): erfundener Zahlungsempfänger
- Beleg: `backend/src/services/statement-pdf.service.ts:26-32` (`companyName || 'Dwello Property Management'`, `postalCode || '8000'`, `city || 'Zürich'`). `src/lib/server/settings.ts:45-56` erlaubt eine IBAN ohne Firmenadresse.
- IG v2.3 (Snippet): «"Postal code", "Town" and "Country" must be filled in.» Auch der Name des Zahlungsempfängers ist Pflicht. Ein Platzhalter erfüllt die Form, nennt aber der Bank und dem Mieter einen falschen Empfänger.
- Der Fehler bestand schon vor dieser Änderung und hängt an der Entscheidung in #395 (offen, `entscheiden`). Er gehört nach «Blocked on me» und muss in #78 nicht behoben werden. Im Ergebnis zu #78 aber als nicht konform vermerken.

### V-2 (Minor): abschliessender Zeilenumbruch nach «EPD»
- Beleg: `backend/src/services/qr-bill.service.ts:289-293`. `field(data.billingInfo, 140)` ist leer, `lines.join('\n')` ergibt `…\nEPD\n`.
- IG (v2.1 und qr-invoice.ch; Snippet): «The last data element delivered may not be completed with a concluding carriage return (CR + LF or LF).» Ein Forum (DevExpress) hält fest, dass `EPD` + Zeilenumbruch ein leeres StrdBkgInf-Element erzeugt. swissqrbill und Codecrete lassen das leere StrdBkgInf weg.
- Warum falsch: Je nach Lesart ist entweder ein leeres Element das letzte oder der String endet mit LF. Der zweite Fall verletzt den Wortlaut. Ob ein Scanner das ablehnt, habe ich nicht bestätigt (unsicher).
- Korrektur: Leere StrdBkgInf (und AltPmtInf) am Ende weglassen, sodass der Payload mit `EPD` endet. Zuerst ein Unit-Test, der `qrDataString.endsWith('EPD')` prüft. Bestehende Tests mit 32 Zeilen werden angepasst.

### V-3 (Minor): Gedruckte Angaben und Code stimmen nicht überein
- Beleg: `backend/src/services/pdf.service.ts:962`. `creditor` wird aus `config.companyName/address/postalCode/city` gebaut (ungekürzt, nicht bereinigt). `debtor` dagegen kommt aus `qrData` (Zeile 964).
- Style Guide (Sekundärquelle auditrium.ch, Snippet): die «Werte des Empfangsscheins werden … exakt wie im Zahlteil und im QR-Code wiedergegeben». Ihr Plan a («Printed text stays as stored») bereinigt nur den Payload. Ein «’» oder ein Name mit 80 Zeichen steht dann im Code anders als auf dem Papier.
- Korrektur: Zahlungsempfänger, Zahlungspflichtigen und Mitteilung im Zahlteil und im Empfangsschein aus den bereinigten `qrData` drucken. `winAnsi` bleibt für die Schrift nötig: Zeichen aus Latin Extended-A wie «ő» oder «Ș» druckt Helvetica nicht. Diese Grenze der Schrift besteht schon und ist hinnehmbar.

### V-4 (Minor): Das Szenario nennt seine Voraussetzung nicht
- Beleg: `statement-detail.feature:240-245`. Dass «Eva Frei» keine Korrespondenzadresse hat, ergibt sich nur aus der Grundlage (`fixtures/backend.ts:149-153` legt den Mieter ohne Adresse an). Die nächsten Szenarien (Zeilen 249 ff.) setzen eine Adresse.
- Korrektur: Die Voraussetzung in einem Schritt sagen, z. B. «Und für "Eva Frei" ist keine Korrespondenzadresse erfasst». Wenn ein solcher Schritt fehlt, kann er ein No-op mit Prüfung sein. Titel als Vorschlag: «Ohne Korrespondenzadresse hat der Zahlteil ein Feld für Name und Adresse». Die Begriffe Zahlteil und Korrespondenzadresse sind im Glossar (`UBIQUITOUS_LANGUAGE.md:24,196`).

### V-5 (Nit): Details zu Plan a (Zeichensatz)
- Zeichensatz bestätigt, IG v2.4 de (Snippet): «Basic-Latin (Unicodepoint U+0020 – U+007E). • Latin1-Supplement (Unicodepoint U+00A0 – U+00FF). • Latin Extended-A (Unicodepoint U+0100 – U+017F).» Die Zeichen Ș ș Ț ț und das «€» kenne ich nur aus einer Sekundärquelle (privateinvoice.app: «sowie vier rumänische Sonderzeichen und das Eurozeichen (Kapitel 4.1.1)»).
- Hinweise:
  1. Erst bereinigen (NFC, Ersetzen), dann auf die Feldlänge kürzen. Sonst kann `slice` ein Surrogatpaar teilen.
  2. Auch «„» (U+201E) → `"`, «‚» (U+201A) → `'` und «…» (U+2026) → `...` ersetzen. «« »» sind Latin-1 und bleiben.
  3. Vor dem Ersatz durch «.» die diakritischen Zeichen über NFD entfernen, wie es `winAnsi` in `pdf.service.ts:501-509` tut. Ein Name wie «Nguyễn» (ễ = U+1EC5, nicht erlaubt) wird so zu «Nguyen» statt «Nguy.n».
  4. Zeilenumbrüche und Tabs in einem Wert durch den Ersatz entfernen. Sonst verschiebt ein `\n` alle folgenden Felder. Ihr Plan deckt das ab, aber bitte mit einem eigenen Test.
  5. IBAN im Payload in Grossbuchstaben (`qr-bill.service.ts:257` entfernt nur Leerzeichen). Die BFF schreibt sie schon gross (`settings.ts:28`), `PUT /config` direkt nimmt aber auch Kleinbuchstaben an (`validateIBAN` wandelt intern um).

### V-6 (Nit): Auch die Mahnung bekommt das leere Feld
- Beleg: `pdf.service.ts:996-1006` (`addPaymentPart` → `paymentPart`), aufgerufen in `reminder-pdf.ts:48`. Eine Mahnung per E-Mail an einen Mieter ohne Korrespondenzadresse zeigt danach ebenfalls «Zahlbar durch (Name/Adresse)» mit Feld. Das ist korrekt.
- Korrektur: Im Unit-Test für Slice 2 auch `addPaymentPart` prüfen oder dies im PR erwähnen. Ein eigenes Szenario ist nicht nötig.

### V-7 (Nit): Land des Zahlungsempfängers fest «CH»
- Beleg: `statement-pdf.service.ts:26-32` liefert kein `country`, also gilt `qr-bill.service.ts:351` `'CH'`. Die Einstellungen akzeptieren aber eine LI-IBAN (`settings.ts:50`). Ein Vermieter in Liechtenstein bekäme «CH» als Land.
- Betrifft Ihre Zielnutzer kaum und besteht schon. Falls Sie es nicht beheben: als Punkt in einem Issue (zusammen mit dem Hausnummer-Issue, siehe unten) festhalten.

### V-8 (Nit): Schweizerkreuz
- Beleg: `pdf.service.ts:935-944`: 7 mm weiss, 6.3 mm schwarz, Balken 0.6 × 0.19 der Seite (Verhältnis 3.16). Bestätigt ist nur «Swiss cross 7 x 7 mm» (Sekundärquellen tobill.ch, idautomation). Ob die SIX-Grafik dieselben Masse hat, konnte ich nicht prüfen (unsicher). Besser die von SIX gelieferte Grafik nachbauen oder einbetten.

### V-9 (Nit): Name über 70 Zeichen
- Beleg: `qr-bill.service.ts:238` kürzt auf 70, `pdf.service.ts:964` druckt `qrData.debtorName`, ein String ausserhalb des Payloads, ungekürzt. Mit V-3 erledigt, wenn der gedruckte Wert der Wert im Payload ist.

## Zu Ihren Punkten

**a. Zeichensatz:** Bestätigt (siehe V-5 mit Quelle). Mit V-3: der gedruckte Text soll dem Code entsprechen, nicht dem gespeicherten Wert.

**b. «Zahlbar durch (Name/Adresse)» mit leerem Feld:** Bestätigt.
- IG v2.4 de (Snippet): «… «Zahlbar durch» die Überschrift «Zahlbar durch (Name/Adresse)» verwendet und ein farbloses Feld mit schwarzen Eckmarken mit der Linienstärke von …».
- Style Guide de (Snippet): «… «Zahlbar durch (Name/Adresse)» verwendet, ein farbloses Feld mit den Massen 52 x 20 mm platziert und mit schwarzen Eckmarken …».
- IG v2.2 de (Snippet): «Dieses muss mindestens die Masse 65 x 25 mm aufweisen.»
- Style Guide en (Snippet): «Corner marks. Line thickness 0.75 pt.»
- Die vier Sprachen stehen so in der Begriffstabelle der IG v2.4 (Snippet): «Payable par (nom/adresse). Pagabile da (nome/indirizzo). Payable by (name/address).» Im Fliesstext der fr-Fassung steht «Payable par (nom / adresse)». Bitte die Form aus der Tabelle nehmen, wie geplant.
- Die Bedingung ist richtig: das Feld kommt, wenn der Code keinen Zahlungspflichtigen nennt, nicht schon, wenn der Strasse etwas fehlt.
- Platz geprüft: Auf dem Empfangsschein (12–68 mm) belegen Konto (rund 16 mm), Referenz (rund 7 mm) und Überschrift mit Feld (rund 23 mm) zusammen etwa 46 mm. Das passt.

**c. Hausnummer im Feld der Strasse:** Bestätigt, kein «Stop and ask».
- IG v2.3 (Snippet): «"Postal code", "Town" and "Country" must be filled in.» Die IG v2.4 (Snippet) zählt dieselben Elemente auf: «The elements "Street", "Building number"², "Postal code", "Town" and "Country" are available.» Den Inhalt der Fussnote 2 konnte ich nicht lesen (siehe «Nicht bestätigt»).
- IG v2.4 (Snippet): «Version 2.4 does not result in any technical adjustments for invoicing in Swiss francs (CHF).»
- Banana.ch (Sekundärquelle): «Using the Building Number field is optional. It is still possible to enter street and number on the same line …».
- SIX empfiehlt die getrennte Hausnummer laut core.iq.ch (Sekundärquelle), verlangt sie aber nicht.
- Ich stimme zu: die Adresszeile nicht zerlegen (Postfach, «3a», «Ahornweg 3/5»), sondern ein eigenes Issue anlegen.

**d. Übrige Felder:** Bestätigt mit Quelle:
- Ultimate Creditor leer. IG v2.4 (Snippet): «The element "Ultimate creditor" is intended for use in the future but will not be used for the QR-bill and should therefore not be filled in.»
- Fehlerkorrektur M und 46 × 46 mm (tobill.ch, Telerik; Sekundärquellen).
- Schriften. IG v2.4 (Snippet): «The recommended font size for headings is 8 pt and for the associated values 10 pt. The only exception, in font size 11 pt (bold), is the title …». Style Guide de (Snippet): «Die Schriftgrösse beim Empfangsschein beträgt für die Überschriften 6 pt (fett) und für die dazugehörenden Werte 8 pt.»
- «Annahmestelle» rechtsbündig (pebelive.ch, qr-rechnung.com; Sekundärquellen).
- Betrag. validation.iso-payments.ch: «Der Betrag muss zwischen 0.01 und 999999999.99 liegen. Der Betrag benötigt zwingend den . (Punkt) als Trennzeichen und zwei Dezimalstellen.» Style Guide (Snippet): «… zwei Nachkommastellen … (z.B. CHF 1 590.00)».
- Zeichensatz siehe V-5. Adresstyp S und Pflichtfelder siehe c.
- Zum Payload-Ende siehe V-2: die IG verlangt das Weglassen des Zeilenumbruchs, nicht ein leeres StrdBkgInf.

Nachgerechnet (`qr-bill.service.ts:225-228,338-339`, `pdf.service.ts:490,1035`):
- Saldo 1234.5 ergibt im Payload `1234.50` und gedruckt «1 234.50».
- Saldo 1234567.85 ergibt `1234567.85` und «1 234 567.85».
- Saldo 0 und Rückerstattung −120: `owed()` ist falsch, also gibt es keinen Zahlteil (Glossar «Saldo», `UBIQUITOUS_LANGUAGE.md:156`).
- Saldo 4.95: unter dem Minimum (#94), kein Zahlteil.
- Payload und Druck runden mit demselben `toFixed(2)`.

## Fehlende Begriffe (Issue mit Labels `fachlich`, `entscheiden`)
- **Hausnummer:** «Nummer des Gebäudes in der Korrespondenzadresse des Mieters oder der Firmenadresse, getrennt von der Strasse; leer bei Postfach.» Daten: `house_number` bei `tenants` und Config `company_house_number`. Vorschlag für den Issue-Titel: «Decide separate house-number fields for Korrespondenzadresse and Firmenadresse (QR-bill BldgNb)». Optionen: (1) getrennte Felder mit Migration ohne Zerlegen (bestehende Adressen behalten die Nummer in der Strasse), (2) beim Speichern zerlegen, (3) belassen. Ein Punkt im selben Issue: Land der Firmenadresse (V-7).

## Nicht bestätigt
- Fussnote 2 zu «Building number» in IG v2.3/v2.4: Inhalt nicht gefunden (mmx-Snippets enden vorher, SIX-PDF gesperrt).
- Ob das leere StrdBkgInf mit abschliessendem LF (V-2) von Bank-Apps oder vom SIX-Validator abgelehnt wird: nicht gefunden. Nur der Wortlaut der IG v2.1 ist belegt, für v2.4 nur sinngemäss über qr-invoice.ch.
- Ș ș Ț ț (U+0218–U+021B) und € (U+20AC) im erlaubten Zeichensatz: nur Sekundärquelle (privateinvoice.app), nicht der Wortlaut der IG.
- Länge der Eckmarken 3 mm: Snippet bricht nach «3 x» ab.
- Masse der SIX-Grafik des Schweizerkreuzes (V-8).
- Ob «.» als Ersatzzeichen Praxis bei Codecrete ist: nicht nachgelesen.
- Ob die Bibliothek `qrcode` die Bytes als UTF-8 schreibt: `node_modules` fehlt im Worktree. Die bestehenden Tests prüfen nur die Zeilen des Payloads, kein Bild. Die Prüfung «scannt gültig» bleibt beim daten-pruefer.
- Trennlinie: Code gestrichelt 0.5 pt mit Text «Vor der Einzahlung abzutrennen» in 7 pt. `docs/nebenkostenabrechnung-anforderungen.md:89` beschreibt eine durchgezogene Linie mit Scherensymbol. Die IG erlaubt Scherensymbol oder Text (dort als unsicher-B vermerkt). Strichart, Linienstärke und Schriftgrösse habe ich nicht gegen den Style Guide geprüft.
- Überschriften «Konto / Zahlbar an», «Referenz», «Zusätzliche Informationen», «Währung», «Betrag» und ihre fr/it/en-Fassungen in `pdf.service.ts:55-63,145-153,234-242,323-331`: entsprechen meinem Wissen über die Begriffstabelle der IG. Belegt sind über Snippets nur «Währung/Monnaie/Valuta/Currency», «Conto / Pagabile a» und «Punto di accettazione».
