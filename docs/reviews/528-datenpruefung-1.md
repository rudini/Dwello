# Datenprüfung #528, Runde 1: NK-11111111-2025-0003 (Pierre Dubois)

Stand: Worktree /tmp/claude/review-528-daten (23f44db), laufende App aus 7e22d79, Datenbank `dwello_persona`.
Eigenes Skript: /tmp/claude/scratch-528d/recompute.py (liest Rechnungen, Verteilschlüssel, Wohnungen, Mietvertrag, Tankbestände, Kategorien aus der Datenbank; kein Dwello-Code).

## Ergebnis

Keine Findings. Kein Blocker, kein Major, kein Minor.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| (keine) | | | | |

## Nachrechnung (unabhängig, auf den Rappen)

Eingaben: Gebäude Musterhaus Zentrum, 6 Wohnungen, Fläche gesamt 492.50 m², Wohnung 2.01 mit 85.00 m²; Mietvertrag 01.01.2023 unbefristet, Mietstage 365/365; Akonto 12 × 270.00 = 3240.00; Verwaltungspauschale vereinbart, Satz 3 %.

| Position | Kosten Gebäude | Schlüssel | Anteil Mieter (eigen) | gespeichert | Web | PDF |
|---|---|---|---|---|---|---|
| Lift | 1690.00 | Pro Einheit 1/6 | 281.67 | 281.67 | gleich | gleich |
| Hauswart | 2760.00 (3 × 920.00) | Pro Fläche 85/492.5 | 476.35 | 476.35 | gleich | gleich |
| Hauswart | 920.00 (Q4 2025) | Pro Einheit 1/6 | 153.33 | 153.33 | gleich | gleich |
| Kaltwasser | 3840.00 | Pro Fläche | 662.74 | 662.74 | gleich | gleich |
| Allgemeinstrom | 762.80 | Pro Fläche | 131.65 | 131.65 | gleich | gleich |
| Gartenpflege | 935.00 | Pro Fläche | 161.37 | 161.37 | gleich | gleich |
| Kehricht | 990.00 | Pro Einheit | 165.00 | 165.00 | gleich | gleich |
| Heizung | 6957.80 (2650.00 + 6565.00 − 2257.20) | 70 % Fläche / 30 % Einheit | 1188.48 | 1188.48 | gleich | gleich |
| Kaminfeger | 335.00 | Pro Fläche | 57.82 | 57.82 | gleich | gleich |

- Zwischensumme: 3278.41 (gespeicherte Positionen summieren auf 3278.41).
- Verwaltungspauschale 3 %: 98.35. Ihre Nebenkosten (`total_costs`): 3376.76.
- Saldo vor Rundung: 3376.76 − 3240.00 = 136.76. Rundung auf 5 Rappen zugunsten des Mieters (Nachzahlung abgerundet): −0.01. Saldo: 136.75. Gespeichert `balance` = 136.75.
- Die Summe der beiden Hauswart-Positionen (2760.00 + 920.00 = 3680.00) entspricht den vier Hauswart-Rechnungen 2025; Hauswartung Q4 2024 (31.12.2024) liegt ausserhalb der Periode und ist nicht enthalten, richtig.
- Alle 12 vereinbarten Kategorien sind im Mietvertrag; keine umlagefähige Rechnung der Periode fehlt; Rechnungen mit Leistungszeitraum gibt es nur im Gebäude 22222222.
- Der Prozentwert `share_percentage` ist Anteil/Kosten (z. B. 476.35/2760.00 = 17.2591 %); die Web-Ansicht zeigt ihn gerundet (17.26 % / 16.67 %); das ist die bestehende Darstellung, kein Befund.

## Web-Seite (/statements/856c4f57-…, de und fr, mit Sitzungs-JWT abgerufen)

- Beide Hauswart-Positionen stehen direkt untereinander (Lift, Hauswart, Hauswart, Kaltwasser …). Pro Fläche: 3 Rechnungen Q1–Q3 mit 920.00; Pro Einheit: Rechnung «Hauswartung Q4 2025» 920.00. Beträge gleich wie gespeichert.
- Hinweis «Verschiedene Verteilschlüssel in einer Kategorie» / «Plusieurs clés de répartition dans une catégorie» nennt die richtige Rechnung (Hauswartung Q4 2025) und die richtigen Schlüssel.
- Zwischensumme 3'278.41, Verwaltungspauschale 98.35, Ihre Nebenkosten 3'376.76, vor Rundung 136.76, Rundung −0.01 (fr: «Arrondi à 5 centimes»), Saldo 136.75.

## PDF (erzeugt über POST /api/v1/statements/{id}/generate-pdf je Sprache de, fr, it, en; PDF aus `pdf_blob` gelesen)

- Alle vier Sprachen: Positionen in der Reihenfolge Lift, Hauswart (Pro Fläche), Hauswart (Pro Einheit), Kaltwasser, …; die zwei Hauswart-Zeilen stehen nebeneinander.
- Zeile nach «Pro Einheit»: de «Hauswart (Hauswartung Q4 2025)», fr «Conciergerie (Hauswartung Q4 2025)», it «Custode (Hauswartung Q4 2025)», en «Caretaker (Hauswartung Q4 2025)» (Rechnungsbeschreibung bleibt wie erfasst auf Deutsch). Die Zeile nach Fläche trägt nur «Hauswart» / «Conciergerie» / «Custode» / «Caretaker».
- Beträge in der Tabelle (1'690.00 / 2'760.00 / 920.00 / … und Anteile 281.67 / 476.35 / 153.33 / …) gleich wie gespeichert; Zwischensumme, Pauschale, Akonto-Zeile «12 Monate × CHF 270.00», Saldo vor Rundung 136.76, Rundung − 0.01, Saldo 136.75 in allen vier Sprachen. Alle Beträge der vier Sprachversionen sind zeichengleich (Vergleich der Betragsmuster, gleicher Hash).
- Hinweis «Abgerechnet sind nur die vereinbarten Nebenkosten»: Hauswart steht einmal.

## QR-Rechnungen (4 Seiten 3, `pdftoppm -png -r 200`, Dekoder zxing-cpp im Scratchpad, /tmp/claude/scratch-528d/dec.py)

Alle vier (de, fr, it, en) dekodiert, je 1 QR-Code, Inhalt gleich ausser der Mitteilung:
- IBAN CH4431999123000889012 (Prüfsumme mod 97 = 1; IID 31999 = QR-IBAN; gleich wie `configuration.iban`)
- Betrag 136.75 CHF (= Saldo)
- Referenztyp QRR, Referenz 006300727077885013986303076: 27 Stellen, Prüfziffer 6 nach Modulo 10 rekursiv; unabhängig aus der Abrechnungs-ID berechnet, gleich wie `qr_bill_reference`
- Zahlungspflichtiger Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich, CH
- Zahlungsempfänger Muster Immobilien AG, Bahnhofstrasse 1, 8001 Zürich, CH
- Mitteilung: de «Nebenkostenabrechnung NK-11111111-2025-0003», fr «Décompte des charges …», it «Conteggio spese accessorie …», en «Utility Cost Statement …»
- Betrag im gedruckten Zahlteil und Empfangsschein 136.75, passend zum QR.

Geprüft: NK-11111111-2025-0003 (Zeilen, Zwischensumme, Verwaltungspauschale, Saldo mit Rundung, Web de/fr, PDF de/fr/it/en, 4 QR-Rechnungen)

## Nicht bestätigt

- Web-Seite nur in de und fr abgerufen (HTML des Servers, ohne Browser-Rendering); it und en der Seite nicht angesehen. Die PDF-Texte aller vier Sprachen sind geprüft.
- Layout des PDF (Seitenumbruch, optische Nähe) nur aus dem Text mit Layout-Modus beurteilt (pdftotext -layout), die Seiten 1–2 nicht als Bild angeschaut; Seite 3 (QR) als Bild gerendert und dekodiert.
- NK-11111111-2025-0002 (Anna Schmidt) auftragsgemäss nicht angefasst und nicht geprüft.

## Nebenwirkung auf die Daten (zur Kenntnis)

Das Erzeugen der PDFs hat am Entwurf 856c4f57-… `pdf_blob` und `pdf_generated_at` überschrieben (zuletzt die englische Fassung); ein Entwurf erzeugt sein PDF beim Herunterladen ohnehin neu in der Sprache des Mieters (fr). Beträge, Positionen, Status, Referenz sind unverändert (Status `draft`, Saldo 136.75).

## Reproduktion

```
python3 /tmp/claude/scratch-528d/recompute.py          # Nachrechnung gegen die Datenbank
python3 /tmp/claude/scratch-528d/gen.py                # JWT (Geheimnis aus persona-stack.sh)
# POST http://localhost:3301/api/v1/statements/856c4f57-995d-4bd8-afa3-a95ccca8b528/generate-pdf {"language":"de"}
/tmp/claude/scratch-528d/v/bin/python /tmp/claude/scratch-528d/dec.py   # QR dekodieren
```
