# Datenprüfung #1469 (Tankrevision in Kategorie mit Tankbestand), Bericht 1

Geprüfter Stand: Worktree `/tmp/claude-0/-home-user-Dwello/97de64da-cebf-5507-bd93-a79a29388482/scratchpad/review-1469-daten`, Commit 73c3828.
Datenbank `dwello_persona` (nur gelesen, keine Änderung; vor und nach der Prüfung gleicher Stand: `pdf_generated_at` Laura Keller 22:02:32.933, Kevin Fischer leer).

## Ergebnis

Keine Findings. Alle Beträge stimmen auf den Rappen mit meiner unabhängigen Neuberechnung überein, in Datenbank, Webseite (de, fr, it, en) und PDF (de, fr, it, en, beide Abrechnungen).

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| (keine) | – | – | – | – |

Geprüft: Rechnung b708a90c (Tank Service AG), Tankbestand 31.12.2024 und 31.12.2025, Lieferung «Heizöl Oberland AG» 2025, Abrechnungen NK-33333333-2025-0001 (Laura Keller, 55905c25) und NK-33333333-2025-0002 (Kevin Fischer, 39e6e722): Positionen, Heizprofil, Verwaltungspauschale, Akonto, Rundung auf 5 Rappen, Webseite, PDF-Abschnitt «Heiz- und Warmwasserkosten» in vier Sprachen.

## Vorgehen

Skript: `/tmp/claude-0/-home-user-Dwello/97de64da-cebf-5507-bd93-a79a29388482/scratchpad/d1469/recompute.py` (Python, liest Rechnungen, Kategorien, Tankbestände, Wohnungen aus der Datenbank; Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` Regeln 1, 5, 8, 10, `UBIQUITOUS_LANGUAGE.md` «Brennstoff (Kategorie)», «Verbrauch (Heizmaterial)», «Saldo», «Rundung auf 5 Rappen» und den Entscheiden in #1469; kein Import von Dwello-Code). Aufruf: `python3 -I recompute.py`. Ergebnis in `recomputed.json`.

### Neuberechnung (Periode 01.01.2025 – 31.12.2025, 365 Tage, Mietstage beider Mieter 365/365)

Rechnung b708a90c «Tank Service AG», Leistungszeitraum 09.02.2018 – 09.02.2028 = 3653 Tage (beide Tage eingerechnet, wie im Doku-Beispiel Boiler 75.30 / 99.95), in der Periode 365 Tage: 700.00 × 365 / 3653 = 69.94. Mehrtägig, daher keine Lieferung.

Heizung (Kategorie mit Tankbestand):
- Anfangsbestand 1'792.00 + Lieferung 4'880.00 (Heizöl Oberland AG, 25.08.2025, ohne Leistungszeitraum) − Endbestand 1'494.00 = Verbrauch 5'178.00
- + Tankrevision 69.94 = Kosten des Gebäudes 5'247.94 (gespeichert: 69.94 `notDelivery` + 4'880.00 + «Veränderung Tankbestand» 298.00 = 5'247.94)

Weitere Positionen: Schneeräumung 920.00 + 380.00 = 1'300.00; Allgemeinstrom 182.60 + 196.30 = 378.90; Kaltwasser 470.00; Kaminfeger hat 2025 keine Rechnung (nur 2024). Verteilschlüssel «Pro Fläche (m²)», Gesamtfläche 255 m².

| Position | Gebäude | Laura Keller (72/255) Wohnungsanteil = Ihr Anteil | Kevin Fischer (98/255) Wohnungsanteil = Ihr Anteil |
|---|---|---|---|
| Heizung | 5'247.94 | 1'481.77 | 2'016.86 |
| Schneeräumung | 1'300.00 | 367.06 | 499.61 |
| Allgemeinstrom | 378.90 | 106.98 | 145.62 |
| Kaltwasser | 470.00 | 132.71 | 180.63 |
| Zwischensumme | | 2'088.52 | 2'842.72 |
| Verwaltungspauschale | | 3 % = 62.66 (Vertrag vereinbart) | keine (nicht vereinbart) |
| Ihre Nebenkosten | | 2'151.18 | 2'842.72 |
| Akonto | | 12 × 190.00 = 2'280.00 | 12 × 250.00 = 3'000.00 |
| Saldo vor Rundung | | −128.82 | −157.28 |
| Saldo auf 5 Rappen (Rückerstattung aufgerundet) | | −128.85 (Rundung +0.03) | −157.30 (Rundung +0.02) |

Heizprofil: beide Mietverträge laufen die ganze Periode, daher Heizprofil «nicht angewendet», Zeitanteil 365/365 (gespeichert `heating_share` `wholePeriod`).

### Vergleich

- Gespeichert (`utility_statements`, `utility_statement_line_items`): `total_costs`, `management_fee`, `balance` und alle 8 Positionen (total_amount, apartment_share, tenant_share) stimmen mit der Neuberechnung überein (Ausgabe des Skripts: alle Zeilen «OK», `True`).
- Webseite `/statements/{id}` (SSR, mit Session-Cookie abgerufen, nur lesend): Positionen, Heizung mit «Tankrevision Öltank (alle 10 Jahre) CHF 69.94», «Heizöl EL, 4'900 Liter CHF 4’880.00», «Veränderung Tankbestand CHF 298.00», Zwischensumme, Pauschale, Rundung, Saldo gleich wie gespeichert. Geprüft de (beide Abrechnungen), fr, it, en (Laura Keller: Kategorien, Schlüssel, Beträge, «365/365 jours/giorni/days», Heizprofil-Hinweis übersetzt).
- PDF Laura Keller aus `utility_statements.pdf_blob` (de): Kostenübersicht, Rückerstattung CHF 128.85, «Rückerstattung vor Rundung 128.82», «Rundung + 0.03»; Abschnitt «Heiz- und Warmwasserkosten»: Anfangsbestand am 31.12.2024 CHF 1'792.00, + Lieferungen «Heizung» CHF 4'880.00, – Endbestand am 31.12.2025 CHF 1'494.00, = Verbrauch CHF 5'178.00, + weitere Rechnungen «Heizung» nach den Tagen ihres Leistungszeitraums CHF 69.94, = Kosten des Gebäudes «Heizung» CHF 5'247.94. Gleich der Position «Heizung» (5'247.94). Die Erläuterung unter der Kostenübersicht («Weitere Rechnungen derselben Kategorie, zum Beispiel für die Tankrevision, sind keine Lieferung …») steht da.
- PDF fr, it, en und Kevin Fischer (de, fr, it, en): siehe «Nicht bestätigt» zur Herkunft; alle Beträge (Positionen, Zwischensumme, Pauschale, Saldo, Rundung, Bestand, Verbrauch, weitere Rechnungen, Kosten des Gebäudes) kommen in jedem der 8 Dokumente vor und stimmen (Skript-Ausgabe «missing: []»). Texte in fr/it/en vollständig übersetzt (Zeilen «Stock initial … / + Autres factures «Chauffage» selon les jours de leur période de prestation / = Coûts de l’immeuble «Chauffage»», «Scorta iniziale … / + Altre fatture … / = Costi dell’immobile …», «Opening stock … / + Other invoices for ‘Heating’ by the days of their service period / = Building costs for ‘Heating’»), kein deutscher Text.

### QR-Rechnung

Beide Abrechnungen sind eine Rückerstattung (Saldo −128.85 bzw. −157.30); das PDF hat keinen Zahlteil und kein QR-Bild (`pdfimages -list`: 0 Bilder, 2 Seiten, im Text kein «Zahlteil/QR»). Es gibt also keine QR-Rechnung zu decodieren. Die gespeicherte Referenz von Laura Keller (004040641219069347035031588) ist formal gültig (Modulo-10-Prüfziffer 8 stimmt); Kevin Fischer hat keine gespeicherte Referenz, weil sein PDF noch nicht erzeugt wurde.

## Nicht bestätigt

- **QR-Rechnung (IBAN, Betrag, Referenz, Mitteilung, Zahlungspflichtiger):** nicht prüfbar, weil beide Abrechnungen eine Rückerstattung sind und das PDF keinen Zahlteil druckt (siehe oben). Geschaut: `pdftotext`, `pdfimages -list` an allen acht erzeugten PDFs. Ein Zahlteil für eine Nachzahlung im Zusammenhang mit einer Tankrevision ist mit diesen Datensätzen nicht erreichbar. Um das zu prüfen, braucht es eine Abrechnung mit Nachzahlung in einem Gebäude mit Tankrevision.
- **PDF in fr, it, en (Laura Keller) und PDF Kevin Fischer (alle Sprachen) aus der Persona-Datenbank:** `utility_statements.pdf_blob` von Kevin Fischer ist leer, und ein Download einer Entwurfs-Abrechnung (`GET /api/v1/statements/:id/pdf`) erzeugt und speichert das PDF (`getStatementPdf` in `statement-pdf.service.ts`); `generate-pdf` mit `language` speichert ebenfalls. Beides hätte einen Datensatz der laufenden Persona-Umgebung verändert. Ich habe stattdessen eine Kopie der Datenbank (`pg_dump` in eine Scratch-Datenbank, inzwischen gelöscht) mit einer Kopie des Backends aus dem Worktree (Commit 73c3828, eigener Port 3391, inzwischen beendet) benutzt und dort die PDFs in vier Sprachen erzeugt. Die Kopie ist belegt als gleichwertig: der Text des deutschen PDFs von Laura Keller ist Zeichen für Zeichen gleich dem gespeicherten PDF der Persona-Datenbank (`diff laura-db.txt laura-de.txt`). Die PDFs der übrigen Sprachen und von Kevin Fischer in der Persona-Datenbank selbst sind damit nicht gesehen; sie entstehen aus den gleichen Daten durch den gleichen Code.
- **Web-Seite in der Browser-Ansicht:** geprüft als vom Server gerenderter Text (HTML mit `curl`, Textauszug), nicht als Screenshot; Layout, Kontrast und Darstellung am Handy sind nicht Teil dieser Prüfung.
- **Zahlenbeispiel Rundung bei Teilzeit-Mietern, mehreren Rechnungen mit Leistungszeitraum, Heizprofil-Anteil:** mit diesen Datensätzen nicht erreichbar (beide Mieter mieten die ganze Periode, Heizprofil «nicht angewendet»). Der Fall «Tankrevision × Mieterwechsel mit Heizprofil» ist deshalb nicht bestätigt.
- Die früheren, schon bezahlten Abrechnungen NK-33333333-2024-0001/-0002 (die Tankrevision zählt auch dort mit ihren Tagen von 2024) habe ich nicht geprüft; sie gehörten nicht zu den genannten Datensätzen.

## Hinweis (kein Finding)

Das PDF druckt unter «weitere Rechnungen» nur den Betrag 69.94, nicht die Rechnung mit Leistungszeitraum und Tagen (700.00 für 3653 Tage, davon 365 in der Periode). Nach Regel 5 der Anforderungen steht die Aufstellung je Rechnung nur, wenn der Mieter nicht die ganze Periode mietet; hier mietet er sie. Der Betrag ist richtig und aus dem Beleg nachvollziehbar, daher kein Finding.
