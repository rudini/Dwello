# Datenprüfung #176, Runde 1

Geprüfter Stand: Commit `194a28a` (Worktree `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/review-176-daten-pruefer`), laufende App mit Demodaten (Datenbank `dwello_persona`, Backend :3301, Frontend :3300). Die Datenbank wurde nur gelesen; die Webseiten wurden nur mit GET abgerufen.

Änderung: In `backend/migrations/0002_stammdaten.sql` sind «Schädlingsbekämpfung» (Pest Control) und «Feuerlöscher-Wartung» (Fire Extinguisher Maintenance) jetzt `is_allowed_utility_cost = false`. Die Statement-, PDF-, QR- und Demodaten-Dienste sind im Diff gegen `origin/main` (Merge-Base `03c7708`) nicht verändert.

Werkzeuge (alle im Scratchpad `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/dp176/`):

- `recompute.py`: eigene Nachrechnung aus Rechnungen, Verteilschlüsseln, Wohnungen, Mietverträgen, Akonto, Perioden, Heizprofilen und Tankbeständen. Die Regeln stammen aus `UBIQUITOUS_LANGUAGE.md` und `docs/nebenkostenabrechnung-anforderungen.md`; kein Dwello-Code wurde importiert oder kopiert.
- `check_pdf.py`: vergleicht den PDF-Text (`pdftotext -layout`) mit der Nachrechnung. Die letzte Seite wird mit `pdftoppm -png -r 300` gerendert und der Swiss QR Code mit `zxing-cpp` decodiert (installiert in `dp176/pylib`).
- `check_web.py`: ruft die Detailseite `/statements/<id>` jeder Abrechnung ab (Sitzung wie `persona-kit.mjs`) und vergleicht sie, in de, fr, it und en.

## Ergebnis

Keine Befunde. Die Prüfpunkte (1) bis (3) sind bestätigt, ebenso das Fehlen von Rechnungen in den beiden umgestellten Kategorien. Alle 17 Abrechnungen stimmen auf den Rappen mit der Nachrechnung überein: in der Datenbank, auf der Webseite (4 UI-Sprachen) und im PDF (de, fr, it). Die 10 QR-Rechnungen sind decodiert und korrekt.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| – | – | – | – | – |

## Belege der Prüfpunkte

### (1) Keine Abrechnungsposition einer nicht umlagefähigen Kategorie

```sql
select count(*) from utility_statement_line_items li join categories c on c.id=li.category_id
where not c.is_allowed_utility_cost;              -- 0
select count(*) from utility_statement_line_items where category_id is null;   -- 0
```

### (2) Keine umlagefähige Rechnung in einer nicht umlagefähigen Kategorie

```sql
select count(*) from invoices i join categories c on c.id=i.category_id
where not c.is_allowed_utility_cost and i.is_valid_utility_cost;     -- 0
-- auch die KI-Kategorie: llm_category_id nicht umlagefähig und is_valid_utility_cost = true: 0
```

Verteilung der 83 Rechnungen: 82 umlagefähig in 10 umlagefähigen Kategorien. Eine Rechnung «Reparaturen» über CHF 2'350.00 ist nicht umlagefähig und erscheint in keiner Abrechnung; die Nachrechnung schliesst sie aus und stimmt mit den gespeicherten Werten überein.

### (3) Keine Rechnung in den beiden umgestellten Kategorien

```sql
select c.name_de, count(i.id) from categories c
left join invoices i on i.category_id=c.id or i.llm_category_id=c.id
where c.name_de in ('Schädlingsbekämpfung','Feuerlöscher-Wartung') group by 1;
-- Feuerlöscher-Wartung 0, Schädlingsbekämpfung 0
```

Beide Kategorien stehen in der Datenbank mit `is_allowed_utility_cost = f`, ebenso im Glossar unter «Nicht umlagefähig». Im Demodaten-Skript `backend/scripts/demo-data.ts` kommen beide nicht vor (grep ohne Treffer). Sie erscheinen nur in `backend/scripts/llm-eval.ts`, als Erwartung «nicht umlagefähig».

### Nachrechnung gegen gespeicherte Werte

`python3 -I recompute.py expected.json` vergleicht je Position Kosten Liegenschaft, Wohnungsanteil, Zeitanteil und Ihr Anteil; je Abrechnung Mietstage, Mietbeginn und -ende, Verwaltungspauschale, Total, Akonto und Saldo. Keine Abweichung in einem Betragsfeld.

Die einzigen Meldungen des Skripts betreffen `share_percentage`. Mein erster Ansatz war «Anteil gemäss Schlüssel». Das Feld ist aber Ihr Anteil / Kosten Liegenschaft × 100, auf 4 Stellen gerundet; das gilt für alle 109 Positionen:

```sql
select count(*), count(*) filter (where share_percentage = round(tenant_share/total_amount*100,4))
from utility_statement_line_items;   -- 109 | 109
```

So zeigt es die Webseite als «Anteil» (z. B. 12.4 % = 113.06 / 912.00). Das PDF zeigt dafür Schlüsseleinheiten und Zeitanteil. Das ist kein Befund.

| Abrechnung | Sprache | Zwischensumme | Pauschale 3 % | Ihre Nebenkosten | Akonto | vor Rundung | Rundung | Saldo |
|---|---|---|---|---|---|---|---|---|
| NK-11111111-2024-0001 | de | 2866.58 | 86.00 | 2952.58 | 2880.00 | 72.58 | +0.02 | 72.60 |
| NK-11111111-2024-0002 | de | 3328.48 | 99.85 | 3428.33 | 3600.00 | -171.67 | +0.02 | -171.65 |
| NK-11111111-2024-0003 | fr | 3132.52 | 93.98 | 3226.50 | 3240.00 | -13.50 | 0.00 | -13.50 |
| NK-11111111-2024-0004 | it | 4112.32 | 123.37 | 4235.69 | 4200.00 | 35.69 | +0.01 | 35.70 |
| NK-11111111-2025-0001 | de | 3005.65 | 90.17 | 3095.82 | 2880.00 | 215.82 | -0.02 | 215.80 |
| NK-11111111-2025-0002 | de | 3488.85 | 104.67 | 3593.52 | 3600.00 | -6.48 | -0.02 | -6.50 |
| NK-11111111-2025-0003 | fr | 3283.86 | 98.52 | 3382.38 | 3240.00 | 142.38 | +0.02 | 142.40 |
| NK-11111111-2025-0004 | it | 4308.85 | 129.27 | 4438.12 | 4200.00 | 238.12 | -0.02 | 238.10 |
| NK-22222222-2024-0001 | de | 2261.90 | 67.86 | 2329.76 | 2400.00 | -70.24 | -0.01 | -70.25 |
| NK-22222222-2024-0002 | de | 2680.65 | 80.42 | 2761.07 | 2640.00 | 121.07 | -0.02 | 121.05 |
| NK-22222222-2024-0003 | it | 3069.48 | 92.08 | 3161.56 | 3120.00 | 41.56 | -0.01 | 41.55 |
| NK-22222222-2025-0001 | de | 2296.54 | 68.90 | 2365.44 | 2400.00 | -34.56 | +0.01 | -34.55 |
| NK-22222222-2025-0002 | de | 1415.51 | 42.47 | 1457.98 | 1320.00 | 137.98 | +0.02 | 138.00 |
| NK-22222222-2025-0003 | de | 1306.92 | 39.21 | 1346.13 | 1440.00 | -93.87 | +0.02 | -93.85 |
| NK-22222222-2025-0004 | it | 3117.87 | 93.54 | 3211.41 | 3120.00 | 91.41 | -0.01 | 91.40 |
| NK-33333333-2024-0001 | de | 2182.19 | 65.47 | 2247.66 | 2280.00 | -32.34 | -0.01 | -32.35 |
| NK-33333333-2024-0002 | de | 2970.20 | 89.11 | 3059.31 | 3000.00 | 59.31 | -0.01 | 59.30 |

In der Tabelle steht die Rundung als Differenz Saldo minus Saldo vor Rundung, mit Vorzeichen. Gespeichert ist `total_costs` = Zwischensumme + Pauschale.

Teilperiode (Mieterwechsel A2 Seepark 2025): Meier 181/365 Tage, Heizung 55.80 % nach «Heizung + Warmwasser» (Jan–Jun 13.6+12.1+11.5+9.3+5.6+3.7); Brunner 184/365 Tage. Akonto 6 × 220.00 bzw. 6 × 240.00. Tankbestand: Musterhaus 2024: 2120.00 + 6890.00 − 2650.00 = 6360.00. Die Snapshots `key_values` und `fuel_stock` aller 17 Abrechnungen stimmen mit `apartments` und `fuel_stocks` überein (Abfrage mit 0 Abweichungen).

### PDF (de, fr, it)

`python3 -I check_pdf.py expected.json pdf png`: Positionen (Kosten, Wohnungsanteil, Ihr Anteil), Zwischensumme, Pauschale, Ihre Nebenkosten, Akonto, Saldo vor Rundung, Rundung mit Vorzeichen, Saldo und der Saldo im Kopf stimmen bei allen 17 PDFs. Ohne Rundung (NK-11111111-2024-0003) fehlt die Rundungszeile, wie das Glossar verlangt. Die Rückerstattungen (7) haben keinen Zahlteil.

### Webseite (UI de, fr, it, en)

`python3 -I check_web.py expected.json <token> web [fr|it|en]`: Kartenansicht und Tabelle (Kosten, Betrag), Zwischensumme, Pauschale, Gesamtkosten, Akonto, vor Rundung, Rundung, Saldo stimmen in allen vier Sprachen, 0 Abweichungen. Das Vorzeichen der Rundung ist auf allen 16 Seiten mit Rundung richtig: «+», wenn der Betrag grösser wird.

### QR-Rechnungen (10 Nachzahlungen)

Decodiert mit zxing-cpp aus `pdftoppm -png -r 300` der letzten Seite:

| Abrechnung | IBAN | Betrag | Referenz (QRR) | Prüfziffer Mod 10 | Mitteilung | Zahlbar durch |
|---|---|---|---|---|---|---|
| NK-11111111-2024-0001 | CH4431999123000889012 | 72.60 | 001508961279255880039595148 | ok | Nebenkostenabrechnung NK-11111111-2024-0001 | Hans Müller, Bahnhofstrasse 42, 8001 Zürich |
| NK-11111111-2024-0004 | CH4431999123000889012 | 35.70 | 001866446575843498690313717 | ok | Conteggio spese accessorie NK-11111111-2024-0004 | Maria Rossi, Bahnhofstrasse 42, 8001 Zürich |
| NK-11111111-2025-0001 | CH4431999123000889012 | 215.80 | 005506277328058340555872728 | ok | Nebenkostenabrechnung NK-11111111-2025-0001 | Hans Müller, Bahnhofstrasse 42, 8001 Zürich |
| NK-11111111-2025-0003 | CH4431999123000889012 | 142.40 | 010262805170763783312233108 | ok | Décompte des charges NK-11111111-2025-0003 | Pierre Dubois, Bahnhofstrasse 42, 8001 Zürich |
| NK-11111111-2025-0004 | CH4431999123000889012 | 238.10 | 001673307226632784313491127 | ok | Conteggio spese accessorie NK-11111111-2025-0004 | Maria Rossi, Bahnhofstrasse 42, 8001 Zürich |
| NK-22222222-2024-0002 | CH4431999123000889012 | 121.05 | 009200501332283759880905444 | ok | Nebenkostenabrechnung NK-22222222-2024-0002 | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern |
| NK-22222222-2024-0003 | CH4431999123000889012 | 41.55 | 003996416468788164044865332 | ok | Conteggio spese accessorie NK-22222222-2024-0003 | Marco Bernasconi, Seeweg 15, 6003 Luzern |
| NK-22222222-2025-0002 | CH4431999123000889012 | 138.00 | 005346112181048190932435081 | ok | Nebenkostenabrechnung NK-22222222-2025-0002 | Sarah Meier, Hirschmattstrasse 21, 6003 Luzern |
| NK-22222222-2025-0004 | CH4431999123000889012 | 91.40 | 008180546686702410533808545 | ok | Conteggio spese accessorie NK-22222222-2025-0004 | Marco Bernasconi, Seeweg 15, 6003 Luzern |
| NK-33333333-2024-0002 | CH4431999123000889012 | 59.30 | 009015367411977975856257465 | ok | Nebenkostenabrechnung NK-33333333-2024-0002 | Kevin Fischer, Bergstrasse 8, 3800 Interlaken |

Für alle 10 gilt:
- Kopf `SPC/0200/1` und Trailer `EPD` sind korrekt.
- Die IBAN ist eine QR-IBAN (IID 31999), passend zum Referenztyp QRR.
- Der Betrag entspricht dem gespeicherten und nachgerechneten Saldo.
- Die Referenz entspricht `qr_bill_reference`, und die Prüfziffer nach Modulo 10 rekursiv stimmt.
- Die Mitteilung steht in der Sprache des Mieters.
- Der Schuldner ist der Mieter der Abrechnung, mit Adresstyp S und Land CH.

## Geprüft und bestanden

Alle 17 Abrechnungen: NK-11111111-2024-0001 bis -0004, NK-11111111-2025-0001 bis -0004, NK-22222222-2024-0001 bis -0003, NK-22222222-2025-0001 bis -0004, NK-33333333-2024-0001 und -0002. Geprüft wurden alle 109 Positionen, die Summenwerte und der Saldo in Datenbank, PDF und Webseite (UI de, fr, it, en) sowie die 10 QR-Rechnungen. Dazu kommen die Prüfpunkte (1), (2), (3), die Kategorie-Flags in der Datenbank und die Snapshots `key_values` und `fuel_stock`.

## Beobachtungen (vorbestehend, nicht durch #176 verursacht)

- Im QR-Code steht die Hausnummer im Feld Strasse, das Feld Hausnummer bleibt leer. Das gilt für den Gläubiger («Bahnhofstrasse 1» / «») und für alle Schuldner (z. B. «Bahnhofstrasse 42» / «»). Bei Adresstyp S sind Strasse und Hausnummer optional, und der Decoder akzeptiert es. Die SIX-Richtlinie sieht aber getrennte Felder vor. Der QR- und Abrechnungscode ist im Diff von #176 nicht verändert; Einordnung: offene Arbeit, nicht Teil dieser Änderung.
- `utility_statement_line_items.description` ist englisch gespeichert (z. B. «Elevator»). Webseite und PDF zeigen den Kategorienamen in der jeweiligen Sprache; keine sichtbare Wirkung.

## Nicht bestätigt

- **Vergleich mit dem Basis-Commit:** Die Beträge habe ich nicht gegen eine Datenbank des Basis-Commits verglichen; es lief nur `dwello_persona` aus `194a28a`. Weil keine Rechnung in den beiden umgestellten Kategorien liegt, kann die Änderung die Demo-Beträge nicht verändern. Die Aussage des Auftrags, die Beträge hätten sich geändert, ist darum für die Demodaten nicht belegt.
- **Regelpfade ohne Demodaten:** Diese Regeln konnte ich nicht an echten Daten prüfen:
  - Akonto- und Heizprofilanteil bei Ein- oder Auszug mitten im Monat: alle Verträge beginnen am 1. und enden am Monatsletzten.
  - Verteilschlüssel «Pro Zimmer» und Rechnungen ohne Verteilschlüssel: keine solche Rechnung.
  - PDFs in Englisch und Rätoromanisch: keine Mieter mit `en` oder `rm`.

  Rechnungen mit Leistungszeitraum (2) sind abgedeckt und stimmen.
- **SIX-Konformität des Zahlteils:** Masse und Schriften des Zahlteils sowie die Feldbelegung Strasse/Hausnummer habe ich nicht gegen die SIX Implementation Guidelines geprüft; die SIX-Dokumente lagen nicht vor. Der Inhalt des QR-Codes ist bestätigt.
- **Nachrechnung beim Neuerstellen:** Eine Abrechnung, die nach der Änderung über den Assistenten neu erstellt wird, mit einer Rechnung in einer der beiden Kategorien, habe ich nicht geprüft. Dafür hätte ich in die gemeinsam genutzte Datenbank schreiben müssen, was der Auftrag ausschliesst.
