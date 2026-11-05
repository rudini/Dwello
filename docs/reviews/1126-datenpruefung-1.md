# Datenprüfung 1126-1: Kostenabstimmung (Issue #1126), Commit 2ad4081

Geprüft im Worktree `/tmp/claude-0/-home-user-Dwello/51543c6c-ac44-5d42-b15b-9b485e791c31/scratchpad/review-1126-daten` gegen die laufende Persona-Instanz (Datenbank `dwello_persona`, Backend :3301, Frontend :3300). An den Daten habe ich nichts geändert (Anzahl `utility_statements` vorher/nachher 19; ausser GET-Abfragen nur `POST /statements/preview` und die SvelteKit-Action `?/preview`, beide rechnen nur).

Methode: Eigenes Skript `/tmp/claude-0/-home-user-Dwello/51543c6c-ac44-5d42-b15b-9b485e791c31/scratchpad/mine/recompute.py` (Python, liest per `psql` aus der Datenbank, importiert keinen Dwello-Code). Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 1, 3, 4, 5, 8, 9, 12), `UBIQUITOUS_LANGUAGE.md` (Kostenabstimmung, Veränderung Tankbestand, Verbrauch, Anteil nach Heizprofil, Saldo). Ablauf: (1) Kosten des Gebäudes je Position aus Rechnungen (Leistungszeitraum nach Tagen, sonst Rechnungsdatum; Heizöl mit Anfangs-/Endbestand = Anfangsbestand + Lieferungen − Endbestand), (2) davon Mieter = Summe `tenant_share` der gültigen (nicht ersetzten) Abrechnungen der Periode, (3) davon tragen Sie = Differenz, (4) zusätzlich Mieteranteile aus Verteilschlüssel, Mietstagen, vereinbarten Kategorien und Heizprofil unabhängig neu gerechnet, (5) Verwaltungspauschale, nicht umlagefähige Rechnungen, Hinweise, (6) Vergleich mit API (`/api/v1/reports/reconciliation`), Webseite (SSR-HTML von `/reports/<id>` in de/fr/it/en) und Vorschau (Action `?/preview` des Assistenten). Token: HS256 mit dem Persona-Geheimnis, wie `docs/design/tools/persona-kit.mjs` (Datei `mine/tok.mjs`).

## Ergebnis in einem Satz

Alle Beträge der sechs Kostenabstimmungen (3 Gebäude × 2024/2025) stimmen auf den Rappen mit meiner Neuberechnung überein, in API, Webseite (4 Sprachen) und Vorschau; die Bedingung «Kosten des Gebäudes = davon Mieter + davon tragen Sie» gilt je Position und im Total. Ein Befund (Minor).

## Befunde

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|----|-------------|-----------|----------|-------------|
| D-1 | Minor | Vorschau des Abrechnungslaufs, Gebäude ohne umlagefähige Rechnungen in der Periode, aber mit nicht umlagefähigen (Beispiel Musterhaus Zentrum, Periode 15.02.–25.02.2024, Reparatur Boiler CHF 2350.00) | Issue «Decided»: «Empty: … only the existing hint «Keine Rechnungen»; the row of non-allocable invoices still shows when not zero.» Die Zeile «Nicht umlagefähige Rechnungen (tragen Sie ganz)» mit CHF 2’350.00 erscheint in der Vorschau. | Backend liefert `positions: []`, `nonAllocable: 2350`; `PreviewReconciliations.svelte` Zeile 9 filtert `rows.filter((row) => row.reconciliation?.positions.length)`, das Gebäude fällt ganz heraus, die Zeile mit CHF 2’350.00 erscheint nicht. |

Kein Blocker, kein Major.

### D-1: Nachweis und Reproduktion

Ausgabe (API, Persona-Backend):

```
GET /api/v1/statements/run-reconciliation?buildingId=11111111-1111-1111-1111-111111111111&periodStart=2024-02-15&periodEnd=2024-02-25&managementFeePercent=3
{"positions":[],"total":{"buildingCosts":0,"tenants":0,"landlord":0},"managementFee":0,"nonAllocable":2350}
```

Code: `src/routes/statements/generate/PreviewReconciliations.svelte:9` (`const reconciled = $derived(rows.filter((row) => row.reconciliation?.positions.length));`). Die Bedingung blendet das ganze Gebäude aus, auch wenn `nonAllocable` ungleich 0 ist. Das Verhalten der Oberfläche habe ich aus dem Code abgeleitet, nicht im Browser gerendert (die Action liefert die Daten, die Komponente blendet sie aus). Im Szenario `tests/e2e/features/*.feature` fand ich keinen Schritt, der diesen Fall abdeckt (`grep -i "nicht umlagefähig\|ohne Rechnungen"` in `reports.feature`, `statement-generate.feature`).

Reproduktion:
1. Token minten: `node /tmp/claude-0/-home-user-Dwello/51543c6c-ac44-5d42-b15b-9b485e791c31/scratchpad/mine/tok.mjs > token.txt`.
2. `curl -H "Authorization: Bearer $(cat token.txt)" "http://localhost:3301/api/v1/statements/run-reconciliation?buildingId=11111111-1111-1111-1111-111111111111&periodStart=2024-02-15&periodEnd=2024-02-25&managementFeePercent=3"`.
3. Im Assistenten «Abrechnungen erstellen» für ein Gebäude, dessen Periode nur nicht umlagefähige Rechnungen hat (im Demo-Bestand nicht vorhanden, daher mit einer Teilperiode über die API gezeigt).

Auf «Berichte» tritt der Fall mit Demo-Daten nicht auf (eine Periode in der Liste hat Abrechnungen, also Positionen).

## Bestätigte Datensätze (Kostenabstimmung, je Position und Total)

Kosten des Gebäudes / davon Mieter / davon tragen Sie, Neuberechnung gegen gespeichert/Seite (alle gleich):

- Alpenblick 2025 (die zwei Entwürfe von Marco): Schneeräumung 1300.00 / 866.67 / 433.33; Allgemeinstrom 378.90 / 252.60 / 126.30; Kaltwasser 470.00 / 313.34 / 156.66; Heizung 5178.00 / 3452.00 / 1726.00 (1792.00 Anfangsbestand 31.12.2024 + Lieferung 4880.00 − 1494.00 Endbestand 31.12.2025 = 5178.00); Total 7326.90 / 4884.61 / 2442.29. Verwaltungspauschale 62.06 (nur Keller, 3 %: 2068.77 × 3 % = 62.06; Fischer ohne Vereinbarung). Nicht umlagefähig: keine Zeile (0.00). Hinweise: 2 Entwürfe, 0 Verträge ohne Abrechnung, 0 nicht aktuelle. Die Vermieterposition entspricht der leeren OG2 (85/255 = 1/3), Rundungsdifferenz 0.01 im Total (7326.90/3 = 2442.30 gegen 2442.29).
- Alpenblick 2024: Total 7728.60 / 5152.39 / 2576.21, Verwaltungspauschale 65.47.
- Musterhaus Zentrum 2025: acht Positionen, Total 19190.60 / 14087.21 / 5103.39; Verwaltungspauschale 422.63; Hinweis «3 Entwürfe» (1 versendet, 3 Entwürfe); Heizung 6957.80 = 2650.00 + 6565.00 − 2257.20.
- Musterhaus Zentrum 2024: Total 18305.20 / 13439.90 / 4865.30; Verwaltungspauschale 403.20; Zeile «Nicht umlagefähige Rechnungen (tragen Sie ganz)» 2350.00 erscheint (Reparatur Boiler, einzige Rechnung mit `is_valid_utility_cost = false`); Heizung 6360.00 = 2120.00 + 6890.00 − 2650.00.
- Seepark Residenz 2025: Total 10646.30 / 8136.84 / 2509.46; Verwaltungspauschale 228.52 (68.90 + 42.57 + 39.10 + 77.95); Heizung 4115.00 = 1520 + 790 + 395 + 1410 (die Rechnung «Fernwärme Q4 2024» vom 20.01.2025 mit Leistungszeitraum 2024 zählt nicht, «Q4 2025» vom 20.01.2026 mit Leistungszeitraum 2025 zählt); Hinweis «4 Entwürfe».
- Seepark Residenz 2024: Total 10483.30 / 8012.03 / 2471.27; Verwaltungspauschale 225.02; Heizung 4060.00 (inkl. «Q4 2024» vom 20.01.2025).

Weitere Prüfungen:

- Alle 117 gespeicherten Positionszeilen der 19 Abrechnungen: `total_amount` = meine Kosten des Gebäudes (0 Abweichungen, `mine/lines.py`).
- Mieteranteile aller Positionen unabhängig aus Fläche/Einheit/70-30-Schlüssel, Mietstagen, vereinbarten Kategorien und Heizprofil «Heizung + Warmwasser» (Seepark A2 Meier 181 Tage / Brunner 184 Tage, Heizung je Rechnung nach Profil) gerechnet: Abweichung zur gespeicherten Summe höchstens 0.01 je Position (Rundung je Wohnung), Ausgabe `mine/out.txt`.
- Vorschau: Die Action `?/preview` des Assistenten für Seepark Residenz 2025 (Heizprofil «Heizung + Warmwasser», 3 %) liefert dieselben Zahlen wie «Berichte» (nur ohne Hinweise, wie vom Product Owner entschieden). Was ein Lauf abrechnen würde (`POST /statements/preview` je Vertrag der Periode, vier Verträge): Summe der Mieteranteile je Position gleich «davon Mieter» (684.00, 2342.82, 3150.55, 1577.19, 382.28) und Verwaltungspauschale 228.52 gleich (39.10 + 77.95 + 68.90 + 42.57). Der Lauf erstellt nichts Neues, weil alle Verträge schon Abrechnungen haben.
- Seite gegen API: je 6 Datensätze × 4 Sprachen (de/fr/it/en), Tabelle und mobile Karten: Zeilenfolge, Beträge, Zusatzzeilen (nur bei Betrag ≠ 0) und Anzahl Hinweise gleich (`mine/pagecheck.py`: «BAD 0»). Spaltenköpfe «Kosten des Gebäudes / davon Mieter / davon tragen Sie» und Übersetzungen fr/it/en enthalten kein Deutsch. Liste auf «Berichte»: 6 Zeilen, neueste zuerst, Link mit Gebäude und Periode.
- Saldo-Rundung auf 5 Rappen zugunsten des Mieters und Akonto aller 19 Abrechnungen neu gerechnet (Eigene Nebenkosten + Verwaltungspauschale − Akonto, Nachzahlung abgerundet, Rückerstattung aufgerundet): 19 von 19 gleich dem gespeicherten `balance`, u.a. Alpenblick 2025: Keller 2130.83 − 2280.00 = −149.17 → −149.20; Fischer 2815.84 − 3000.00 = −184.16 → −184.20 (`mine/saldo.py`). Der Change berührt den Saldo nicht.
- «Nicht aktuell»: höchste `invoices.updated_at` und `fuel_stocks.created_at` (16:50:53) liegt vor jeder Abrechnung (frühestens 16:50:54), `GET /api/v1/statements/outdated` leer; Hinweis leer ist richtig.

Geprüft: Kostenabstimmung Alpenblick 2024/2025, Musterhaus Zentrum 2024/2025, Seepark Residenz 2024/2025 (API, Webseite de/fr/it/en, mobile Ansicht); Vorschau Seepark Residenz 2025; Liste «Berichte»; Abrechnungen NK-33333333-2025-0001/0002, NK-11111111-2024/2025-0001…0004, NK-22222222-2024-0001…0003, NK-22222222-2025-0001…0004, NK-33333333-2024-0001/0002 (Positionen, Verwaltungspauschale, Akonto, Saldo, QR-Referenzprüfziffer).

## QR-Rechnungen

Der Change fasst keine PDF- oder QR-Datei an (`git diff bde3a70 HEAD --name-only | grep -i "pdf\|qr"` leer; die Kostenabstimmung steht laut Issue nicht in Abrechnung und PDF). Die betroffenen Alpenblick-Entwürfe sind Rückerstattungen (−149.20, −184.20) und haben weder PDF noch QR-Rechnung (`pdf_blob` und `qr_bill_reference` leer). Stichprobe an einer unbeteiligten Abrechnung mit Zahlteil, NK-11111111-2025-0001 (Müller, versendet), PDF `mine/stm-88a33e92.pdf`, Seite 3 mit `pdftoppm -png -r 200` gerendert und mit `zxing-cpp` (installiert in `mine/pylib`) dekodiert:

- IBAN `CH4431999123000889012`: Prüfziffer ISO 7064 (mod 97) = 1, QR-IBAN (IID 31999).
- Betrag `215.80` CHF, gleich dem Saldo in der Datenbank.
- Referenztyp QRR, Referenz `006452531698009647270159035`, 27 Stellen, Prüfziffer (Modulo 10 rekursiv, SIX-Tabelle 0 9 4 6 8 2 7 1 3 5) stimmt; die Referenzen aller 17 gespeicherten Abrechnungen mit Referenz haben eine gültige Prüfziffer.
- Zusätzliche Information `Nebenkostenabrechnung NK-11111111-2025-0001`; Zahlungspflichtiger «Hans Müller», Bahnhofstrasse 42, 8001 Zürich (Mieter Hans Müller in der Datenbank).

## Nicht bestätigt

- **Lauf, der Abrechnungen neu erstellt** (`plan.contracts.filter(!billed)` nicht leer): Im Demo-Bestand hat jeder Vertrag der Perioden mit Rechnungen schon eine Abrechnung, und ich darf die Daten nicht ändern. Indirekt bestätigt: `POST /statements/preview` je Vertrag stimmt mit den gespeicherten Zeilen überein (Seepark 2025). Die Zusammenführung «gültige Abrechnungen + neu erstellte» habe ich nicht mit echten neuen Abrechnungen geprüft. Nebenbefund dazu: Für eine Periode, die bestehende Abrechnungen nur teilweise überdeckt (Alpenblick 01.07.2024–30.06.2025, nur über die API versucht), gelten die Verträge als «billed», aber nur Abrechnungen mit genau dieser Periode zählen, «davon Mieter» ist 0.00 und «davon tragen Sie» ist 8058.80. Der Assistent bietet eine solche Periode nach meinem Verständnis nicht an (Abrechnungsperiode des Gebäudes bleibt fest); ich habe das im Assistenten nicht geprüft.
- **Negatives «davon tragen Sie» und Hinweis «nicht aktuell» mit Einträgen**: im Bestand nicht vorhanden (keine Rechnung nach dem Erstellen geändert) und ohne Datenänderung nicht herstellbar. Formatierung negativer Beträge (`CHF -177.05`) nur aus dem Code und den Tests gelesen (`src/lib/utils/format.ts`, `src/__tests__/format-currency.test.ts`), nicht an Daten gesehen.
- **Vorschau-Rendering im Browser**: die Zahlen der Vorschau habe ich aus der Antwort der Action `?/preview` gelesen (entpackt mit `mine/devalue.py`), nicht aus dem gerenderten DOM; die Webseite von «Berichte» aus dem SSR-HTML. Kein Browserlauf (Layout und Barrierefreiheit gehören nicht zu dieser Datenprüfung).
- **Risiko ohne Reproduktion**: `CostReconciliation.svelte` schlüsselt die Zeilen mit `(row.label)`. Zwei Positionen mit gleichem Namen (zwei benutzerdefinierte Kategorien gleichen Namens, oder eine Kategorie namens «Total») ergäben doppelte Schlüssel; mit den Demo-Daten tritt das nicht auf, ich habe es nicht ausgelöst.
- **QR-Rechnungen der Abrechnungen mit Nachzahlung ausser NK-11111111-2025-0001**: nicht dekodiert, weil der Change sie nicht berührt und die betroffenen Entwürfe keine haben.

## Dateien

- Neuberechnung: `/tmp/claude-0/-home-user-Dwello/51543c6c-ac44-5d42-b15b-9b485e791c31/scratchpad/mine/recompute.py` (Ausgabe `out.txt`), `lines.py`, `saldo.py`, `compare_run.py` (Ausgabe `run-compare.txt`), `pages.py` / `pagecheck.py` (Ausgabe `pages-out.txt`), `devalue.py`
- API-Antworten: `api-33-2025.json`, `api-33-2024.json`, `api-11-2025.json`, `api-11-2024.json`, `api-22-2025.json`, `api-22-2024.json`, `run-22-2025.json`, `action-de.json`
- Ausführen: `cd .../mine && python3 recompute.py` (liest `dwello_persona` mit `psql`, braucht `token.txt` und die `api-*.json`).
