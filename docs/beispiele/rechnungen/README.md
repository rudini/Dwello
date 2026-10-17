# Sample invoices for the invoice upload

Fictitious invoices from fictitious service providers for testing the upload and the KI categorization. Names, addresses, phone numbers, UID numbers, banks and IBANs are invented (IBANs and QR references have valid check digits, so the QR code can be scanned and parsed). The recipient is the fictitious landlord Peter Beispiel; the objects are the buildings of the demo data (`backend/demo/demo-data.sql`).

Layout follows Swiss practice: sender with UID number and "MWST", recipient in the right-hand window, invoice number and date, service period, positions with VAT rate, VAT per rate, total rounded to 5 Rappen, and a QR-bill payment part (receipt and payment part, Swiss cross, QR-IBAN with QR reference or IBAN with creditor reference RF).

## Digital PDFs (with text layer)

| File | Provider | Object | Expected category | Total CHF |
|---|---|---|---|---|
| `01-heizoel-brennstoffe-aaremuehle.pdf` | Brennstoffe Aaremühle AG | Alpenblick, Interlaken | Heizung (heating oil delivery 6'240 L, CO2 levy included in the price) | 7'107.05 |
| `02-hauswart-fellmann-gisler.pdf` | Hauswartservice Fellmann & Gisler GmbH | Seepark Residenz, Luzern | Hauswart (Q3 2026) | 2'250.10 |
| `03-wasser-abwasser-werke-eichmatt.pdf` | Werke Eichmatt | Musterhaus Zentrum, Zürich | Kaltwasser and Abwasser in one invoice, VAT 2.6 % and 8.1 %; contains a stormwater fee (Meteorwasser) | 6'671.35 |
| `04-allgemeinstrom-energie-rotsee.pdf` | Energieversorgung Rotsee AG | Seepark Residenz, Luzern | Allgemeinstrom | 538.00 |
| `05-lift-wartung-kronenberg.pdf` | Aufzüge Kronenberg AG | Musterhaus Zentrum, Zürich | Lift (maintenance contract, no repairs) | 3'046.25 |
| `06-gartenpflege-lindenhof.pdf` | Gartenbau Lindenhof GmbH | Seepark Residenz, Luzern | Gartenpflege | 2'928.45 |
| `07-kaminfeger-russbuehl.pdf` | Kaminfegerei Russbühl | Alpenblick, Interlaken | Kaminfeger | 473.50 |
| `08-tv-kabel-kommunikationsnetz-sihlfeld.pdf` | Kommunikationsnetz Sihlfeld Genossenschaft | Musterhaus Zentrum, Zürich | TV/Kabelanschluss | 1'120.80 |
| `09-reparatur-sanitaer-wyss-bolliger.pdf` | Sanitär Wyss & Bolliger AG | Musterhaus Zentrum, Zürich | Reparaturen (not allocable) | 758.20 |
| `10-feuerloescher-wartung-tellmatt.pdf` | Brandschutztechnik Tellmatt GmbH | Seepark Residenz, Luzern | Feuerlöscher-Wartung (not allocable) | 353.25 |

## Scans (images only, no text layer)

| File | Kind | Provider | Expected category | Total CHF |
|---|---|---|---|---|
| `scan-01-schneeraeumung-winterdienst-rugen.jpg` | Phone photo: paper on a table, perspective, uneven light, JPEG | Winterdienst Rugen GmbH, Alpenblick | Schneeräumung | 2'648.45 |
| `scan-02-kehricht-reusstal-container.png` | Flatbed scan in colour, rotated 1.3°, receipt stamp | Entsorgung Reusstal Container AG, Seepark | Kehricht | 735.50 |
| `scan-03-heizungsservice-waermetechnik-oberhasli.pdf` | Black-and-white copier scan as an image-only PDF, rotated, specks | Wärmetechnik Oberhasli AG, Alpenblick | Mixed: burner service, filter and nozzle are Heizung; replacing the circulation pump (CHF 412.00 + 1.5 h labour) is a repair and not allocable | 1'035.15 |
