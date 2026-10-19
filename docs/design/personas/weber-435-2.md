# Dr. Weber, Review #435, Runde 2: «Daten exportieren» nach der Korrektur von P-1

Persona: Dr. Weber, 52, vorsichtig in rechtlichen Fragen, liest alles und rechnet nach. Desktop 1440 × 900, Maus, Zoom 100 %.
App: http://localhost:3300 (Persona-Stack, frische Demo-Daten). Ich habe nichts gespeichert und die Sprache nicht umgestellt.
Skripte, Screenshots und Download: `/tmp/claude-0/-home-user-Dwello/94137d46-12c2-5dda-bd7d-6f5cd855db5e/scratchpad/weber-435-2/` (Skripte in `scripts/`, ZIP in `download/`, entpackt in `unz/`, PDF-Text in `weber-435-2-pdf.txt`). Zum Vergleich diente der Export der ersten Runde in `.../scratchpad/weber-435/unz/`.

## Status der Befunde aus Runde 1

| ID | Schwere (R1) | Status | Kurz |
|---|---|---|---|
| P-1 | Major | **behoben** | Der Entwurf NK-22222222-2025-0001 hat jetzt `"statementDate": null` und `"paymentDeadline": null`, weiterhin `"file": null`. Die bezahlte Abrechnung NK-22222222-2024-0001 hat ihre Daten: `statementDate` 2025-04-14, `paymentDeadline` 2025-05-14, `paidDate` 2025-05-05. Rest: siehe P-7. |
| P-2 | Minor | offen | Der Hilfetext sagt weiterhin «Lädt alles, was Dwello über diesen Mieter speichert». Versanddatum, Verteilschlüssel, Rundung, Heizprofil und Verlauf fehlen weiterhin im JSON. |
| P-3 | Minor | offen | Der Hilfetext ist unverändert: nur Art. 28 DSG, kein Hinweis auf Auskunft nach Art. 25 DSG und keiner auf Kostenlosigkeit. |
| P-4 | Minor | offen | Die Schlüssel und Kategorien sind weiterhin englisch (`Caretaker`, `Heating`, `draft`). Rechnungsbeträge sind Zahlen, alle anderen Beträge Text. |
| P-5 | Nit | offen | Im ZIP liegt keine Erklärung, nur `daten.json` und `abrechnungen/`. |
| P-6 | Nit | offen | Die Datei heisst weiterhin `Daten-Weber-Thomas.zip`, ohne Datum. |

## Neue Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-7 | Minor | ZIP `daten.json` | Der Entwurf trägt weiterhin eine QR-Referenz (`"qrBillReference": "010553456491966343518309976"`) und einen Saldo (`-34.60`). Ausser dem englischen `"status": "draft"` sagt nichts, dass er nicht versandt ist. Bei einer Nachzahlung hätte der Mieter einen Betrag mit Zahlungsreferenz, aber ohne Frist. Das war schon in Runde 1 so (andere Referenz), ich hatte es nicht eigens genannt. Es ist durch die Änderung also nicht schlechter geworden. |

## Beobachtungen

- Das Panel «Daten des Mieters» ist unverändert. Screenshot `03-tenant.png`: Das Panel steht links unter «Aktuelle Miete», mit gleichem Text und dem Knopf «Daten exportieren» (Rahmenknopf mit Download-Symbol).
- Der Download kam nach rund 0,2 s. Die Seite blieb auf dem Mieter stehen. Die Datei `Daten-Weber-Thomas.zip` hat 6,4 KB und enthält wie zuvor `daten.json` und `abrechnungen/NK-22222222-2024-0001.pdf`. Netzwerk: nur Aufrufe an localhost:3300.
- Neu im Vertrag steht `"file": null`. Vermutlich ist das die Vertragsdatei, die bei Thomas Weber fehlt. Das ist konsequent zu den Abrechnungen.
- Der Text des PDFs ist identisch mit Runde 1 (Rückerstattung CHF 70.25, Kostenübersicht mit Verteilschlüssel, Hinweise Art. 257b OR und Art. 8 VMWG). Nur die Datei unterscheidet sich byteweise, wohl wegen der neu erzeugten Demo-Daten.
- Die QR-Referenzen beider Abrechnungen sind andere als in Runde 1. Das liegt an den neu erzeugten Demo-Daten und ist kein Befund.
- Die Reihenfolge der Positionen im Entwurf ist anders als in Runde 1: jetzt «Heating» vor «Caretaker», vorher umgekehrt. Bei der bezahlten Abrechnung blieb sie gleich. Für den Mieter spielt das keine Rolle, beim Vergleich zweier Exporte stört es aber. Die Ursache (neue Demo-Daten oder keine feste Sortierung) kann ich nicht beurteilen.
- Nachgerechnet: Die Beträge sind unverändert. 2024: Saldo -70.25. Entwurf 2025: Gesamtkosten 2'365.44, Pauschale 68.90, Akonto 2'400.00, Saldo -34.60.

## Aufgabe geschafft: ja

## Aufwand

Etwa 5 Minuten, 5 Schritte: Mieterliste, Mieterseite, Export, Entpacken, JSON und PDF mit Runde 1 vergleichen.

## Ablauf

1. **Mieterliste → Thomas Weber.** Erwartet: ein Klick. Gesehen: wie erwartet.
2. **Panel lesen.** Erwartet: vielleicht ein Hinweis auf Entwürfe. Gesehen: Der Text ist unverändert. Ein Hinweis ist auch nicht mehr nötig, weil der Entwurf keine Daten mehr trägt.
3. **«Daten exportieren».** Erwartet: ein ZIP ohne Zwischenschritt. Gesehen: `Daten-Weber-Thomas.zip`, sofort.
4. **Entpacken.** Erwartet: dieselbe Struktur wie in Runde 1. Gesehen: wie erwartet.
5. **JSON prüfen.** Erwartet: beim Entwurf kein Abrechnungsdatum und keine Frist, bei der versandten Abrechnung beides. Gesehen: wie erwartet (siehe P-1). Abweichungen zu Runde 1: das neue `file` im Vertrag, andere QR-Referenzen und die Reihenfolge der Positionen im Entwurf.

## Verwirrung

- `status: "draft"` mit QR-Referenz und Saldo: Ohne Datum ist klarer, dass er nicht gestellt ist. Ein Laie liest «draft» aber nicht als «Entwurf, nicht versandt» (P-4, P-7).
- `statementDate: null`: Für einen Mieter ist «null» kein Wort. Ein Satz wie «noch nicht versandt» wäre verständlicher (gehört zu P-4).

## Fehlerrisiken

- Der Mieter sieht beim Entwurf einen Saldo mit QR-Referenz und hält ihn für eine Forderung oder ein Guthaben (P-7). Dieses Risiko ist deutlich kleiner als vorher, weil Datum und Frist fehlen.
- Weiterhin offen: die Risiken aus P-2 und P-3 (Vollständigkeit bestätigt, Auskunftspflicht nicht erfüllt).

## Vorschläge

- **P-1:** Behoben. Reproduktion: Thomas Weber → «Daten exportieren» → `daten.json` → `NK-22222222-2025-0001`: `statementDate` und `paymentDeadline` sind `null`.
- **P-2 bis P-6:** wie in Runde 1 (`docs/design/personas/weber-435.md`).
- **P-7:** Reproduktion: Thomas Weber → «Daten exportieren» → `daten.json` → Entwurf `NK-22222222-2025-0001` hat `qrBillReference` und `balance`. Hilfreich wäre eines davon:
  - Beim Entwurf die QR-Referenz weglassen, denn sie ist eine Zahlungsangabe.
  - Den Entwurf ausdrücklich in Worten kennzeichnen, etwa «Entwurf, nicht versandt, Beträge können sich ändern».

## Nicht geprüft

- Französisch, Italienisch und Englisch: Ich sollte die Sprache nicht umstellen.
- Andere Mieter (z. B. Marco Bernasconi mit Dokument): Der Auftrag galt Thomas Weber.
- Abrechnungen im Status «versendet, nicht bezahlt», Korrekturen und Mahnungen: Thomas Weber hat keine, und speichern durfte ich nichts.
- Fehlerfall des Exports: Der Auftrag nannte keinen.
