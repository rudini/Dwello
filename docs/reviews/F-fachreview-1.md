# Fachreview F, Runde 1: Verwaltungspauschale immer auf die eigenen Nebenkosten

Gegenstand: Commit `1625225` auf `claude/relaxed-ride-tciycq` («feat(statements): fee always of tenant's own costs»).
Produktentscheid: Die Verwaltungspauschale ist immer ein Prozentsatz der eigenen Nebenkosten des Mieters (Zwischensumme seiner Abrechnung). Die Wahl eines Verteilschlüssels für die Pauschale entfällt. Migration `0012_pauschale_eigene_kosten.sql` lässt bei Abrechnungen, die mit Schlüssel erstellt wurden, den Betrag stehen und setzt den Satz auf «Pauschale / eigene Kosten».

Quelle des Eigentümers: Mieterinnen- und Mieterverband, «Merkblatt zulässige und unzulässige Nebenkosten» (2026), S. 4: «Weit verbreitet ist ein fester Prozentsatz der Nebenkosten. Mehr als 2 bis 3% brauchen Mieter*innen nicht zu akzeptieren»; S. 4 auch: «Für den Betrieb der Heizungsanlage und die Warmwasseraufbereitung können sämtliche Verwaltungskosten in Rechnung gestellt werden […] Bei allen anderen Nebenkosten […] muss die Mieterschaft nur für die Erstellung der Abrechnung bezahlen (Art. 4 VMWG)»; S. 6–7 zitieren Art. 4 und 5 VMWG.

**Nicht auf Fedlex gelesen:** Art. 257a/257b OR und Art. 4, 5, 7, 8 VMWG wurden nur über das Zitat im Merkblatt und über `docs/nebenkostenabrechnung-anforderungen.md` geprüft. Jede rechtliche Aussage unten ist darum **unsicher**, bis der Wortlaut auf Fedlex bestätigt ist.

Gelesen: `git show 1625225`, `calculation.service.ts`, `statement.service.ts`, `statement-pdf.service.ts`, `pdf.service.ts`, `migrate.ts`, `0001_schema.sql`, `0002_stammdaten.sql`, `SettingsStep.svelte`, `CostTable.svelte`, `PdfAction.svelte`, `src/lib/server/statement.ts`, `statement-generation.ts`, `src/routes/help/Glossary.svelte`, `src/routes/config/help.ts`, `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/design/offene-punkte.md`, `backend/src/db/demo-data.ts`, das Merkblatt.

## Übersicht

| ID | Rolle | Stufe | Kurz |
|---|---|---|---|
| D-1 | Datenprüfer | **hoch** | Migration 0012 bricht mit «numeric field overflow» ab, wenn Pauschale / eigene Kosten ≥ 1000 % ist; das Backend startet dann nicht |
| M-1 | Mietrecht | **hoch** | Bereits versandte Abrechnungen: Neudruck und Detailseite zeigen einen errechneten Satz (z. B. 24 % oder −15,5 %), den der Mieter nie erhalten hat und der unzulässig hoch wirkt |
| V-1 | Verwalter | **hoch** | Hilfe-Glossar und Einstellungen beschreiben die Pauschale weiterhin als Prozentsatz der Nebenkosten der Liegenschaft mit Verteilschlüssel |
| V-2 | Verwalter / Mietrecht | **hoch** | Ein Vertrag mit anderer Grundlage (nur Heizkosten, fester Betrag, nach Aufwand) lässt sich nicht abbilden; der Hinweis «erstellen Sie die Abrechnungen getrennt» ist im Wizard nicht ausführbar |
| D-2 | Datenprüfer | mittel | Umgerechneter Satz × Zwischensumme ergibt den gespeicherten Betrag in 96 % der Fälle nicht, Abweichung bis CHF 0.40 |
| D-3 | Datenprüfer | mittel | Eigene Kosten 0: Satz wird NULL; PDF druckt dann «Infinity % der Zwischensumme von CHF 0.00», die Detailseite «0 %» bei einer Pauschale > 0 |
| V-3 | Verwalter | mittel | Entwürfe mit Schlüssel behalten den alten Betrag und einen krummen Satz (2.94 %) statt neu gerechnet zu werden |
| M-2 | Mietrecht | mittel | Heizungsverwaltung (Art. 5 Abs. 2 lit. i VMWG) und Abrechnungsaufwand (Art. 4 Abs. 3 VMWG) laufen über einen einzigen Satz; eine separat vereinbarte Heizungsverwaltung ist nicht abbildbar |
| V-4 | Verwalter | niedrig | Wizard-Hilfe nennt nicht, dass «eigene Nebenkosten» die Zwischensumme der Abrechnung ist |
| D-4 | Datenprüfer | niedrig | Satz mit mehr als 2 Nachkommastellen: Betrag mit vollem Satz, gespeichert und gedruckt der gerundete Satz |
| D-5 | Datenprüfer | niedrig | Ältere Abrechnungen ohne gespeicherten Satz: PDF druckt den hergeleiteten Satz ungerundet |

---

## Rolle 1: Verwalter (erfahrene Liegenschaftsverwaltung)

**Gesamturteil:** Die Regel ist praxistauglich und für Mieter am besten nachvollziehbar: Der Satz steht direkt unter der Zwischensumme, auf die er sich bezieht. Für die Zielgruppe (wenig erfahrene private Vermieter) ist der Wegfall der Schlüsselwahl eine Vereinfachung. In der Praxis wird die Pauschale fast immer so gerechnet («x % der Heiz- und Nebenkosten»).

### Geprüft, ohne Befund

- **Leerstand:** Unverändert. Leere Wohnungen erhalten keine Abrechnung; ihr Kostenanteil und damit auch die darauf entfallende Pauschale bleibt beim Vermieter. Das war beim Schlüsselmodell gleich (der Schlüssel rechnete mit allen Wohnungen, der Anteil der leeren blieb liegen). Die Pauschale auf den eigenen Kosten verschiebt nichts zum Mieter.
- **Mieterwechsel während des Jahres:** Jeder Vertrag erhält seine eigene Abrechnung, die Pauschale folgt seinen eigenen Kosten. Mit Heizprofil folgt sie damit auch der Winter-/Sommerverteilung der Heizkosten, was richtiger ist als die frühere Tagesquote. Demo Seepark A2 2025: 42.47 (181 Tage) + 39.21 (184 Tage) = 81.68; 3 % der Summe beider Zwischensummen (2'722.43) wären 81.67. Die Rundungsdifferenz von 1 Rappen ist bedeutungslos.
- **PDF-Wortlaut `feeOwn`** (`pdf.service.ts`): de «{x} % der Zwischensumme von CHF {y}», fr «{x} % du sous-total de CHF {y}», it «{x} % del subtotale di CHF {y}», en «{x} % of the subtotal of CHF {y}». In allen vier Sprachen inhaltlich gleich; die Zeile «Zwischensumme / Sous-total / Subtotale / Subtotal» steht direkt darüber mit demselben Betrag. Im Demo-PDF NK-22222222-2025-0002 geprüft: «Verwaltungspauschale: 3 % der Zwischensumme von CHF 1'415.51 … 42.47». Rätoromanisch druckt deutsch (bekannter offener Punkt).
- **Detailseite `CostTable.svelte`:** «{x} % der Zwischensumme» unter der Zeile «Zwischensumme»; reicht, weil die Basis direkt darüber steht.

### V-1 (hoch): Glossar in der App und Einstellungshilfe widersprechen der neuen Regel

- `src/routes/help/Glossary.svelte:31`: «ein Prozentsatz der Nebenkosten **des Gebäudes**, üblich sind 3 %. Satz **und Verteilschlüssel** wählen Sie beim Erstellen der Abrechnungen.» Den Verteilschlüssel gibt es im Wizard nicht mehr.
- `src/routes/config/help.ts:8`: «ein Prozentsatz der Nebenkosten **der Liegenschaft**».
- Ein unerfahrener Vermieter liest hier eine andere Grundlage als auf dem PDF und sucht im Wizard ein Feld, das es nicht gibt.
- **Fix:** Beide Texte auf «ein Prozentsatz der eigenen Nebenkosten jedes Mieters (Zwischensumme seiner Abrechnung), üblich sind bis 3 %. Den Satz wählen Sie beim Erstellen der Abrechnungen.» ändern. `UBIQUITOUS_LANGUAGE.md` (Zeilen 93, 118, 122) widerspricht ebenfalls; laut Regel nicht editieren, der Vorschlag steht bereits in `docs/design/offene-punkte.md`.

### V-2 (hoch): Vertrag mit anderer Grundlage oder anderem Satz

- **Fall A, andere Grundlage:** Ältere Verträge vereinbaren häufig «Verwaltungskosten 3 % der Heizkosten» (nur Heizung) oder einen festen Frankenbetrag. Dwello rechnet den Satz immer auf alle eigenen Nebenkosten. Beispiel: Heizung 1'800, übrige Nebenkosten 1'200, vereinbart 3 % der Heizkosten = 54.00. Dwello verlangt 3 % von 3'000 = 90.00, also 36.00 zu viel. Nach Art. 257a Abs. 2 OR schuldet der Mieter nur besonders vereinbarte Nebenkosten (**unsicher**, nicht auf Fedlex gelesen); der Vermieter verlangt hier mehr als vereinbart.
- **Fall B, anderer Satz im selben Gebäude:** Die Wizard-Hilfe sagt «Haben Mietverträge verschiedene Sätze, erstellen Sie die Abrechnungen getrennt». Ein Lauf umfasst aber alle Verträge der gewählten Gebäude (`statement-generation.ts`, `contractsInPeriod`); einzelne Verträge lassen sich nicht wählen. Machbar ist das nur über einen Umweg: Lauf mit Satz A erstellen, die Entwürfe der Verträge mit Satz B löschen, zweiten Lauf mit Satz B starten (bereits abgerechnete Verträge werden übersprungen). Das steht nirgends.
- **Fix (kurzfristig, nur Text):** Hilfe ergänzen: «Gilt in einem Vertrag ein anderer Satz, löschen Sie nach dem Erstellen dessen Entwurf und erstellen Sie ihn in einem zweiten Lauf mit seinem Satz. Ist im Vertrag die Pauschale nur auf die Heizkosten oder als fester Betrag vereinbart, kann Dwello sie so nicht berechnen: Geben Sie 0 ein und klären Sie die Pauschale ausserhalb von Dwello.» Dazu ein Eintrag in `docs/design/offene-punkte.md` mit `TODO(fachlich prüfen)`.
- **Fix (später):** Satz und Grundlage der Pauschale am Mietvertrag speichern, der Lauf schlägt sie pro Vertrag vor.

### V-3 (mittel): Entwürfe mit Schlüssel werden nur umetikettiert, nicht neu gerechnet

- Ein Entwurf, der vor 0012 mit Schlüssel erstellt wurde, behält den Schlüsselbetrag und erhält z. B. «2.94 % der Zwischensumme» (Fall F1 unten). Wird er versandt, steht auf dem PDF ein Satz, der in keinem Vertrag steht, und der Betrag ist zusätzlich um Rappen nicht nachrechenbar (D-2).
- **Fix:** In 0012 Entwürfe mit dem ursprünglichen Satz neu rechnen statt den Satz zu ändern, z. B. `management_fee = ROUND((total_costs - management_fee) * management_fee_percent / 100, 2)`, danach `total_costs` und `balance` nachziehen und `pdf_blob` leeren; nur Nicht-Entwürfe (siehe M-1) gesondert behandeln. Alternativ in den Release-Notizen anweisen, solche Entwürfe zu löschen und neu zu erstellen.

### V-4 (niedrig): Wizard-Hilfe

- `SettingsStep.svelte`: «Prozentsatz der eigenen Nebenkosten jedes Mieters, gilt für alle Abrechnungen dieses Laufs. Üblich sind bis 3 % …» ist klar und kurz. Für Anfänger fehlt nur der Bezug zur Zwischensumme, die sie in Vorschau und PDF sehen.
- **Fix:** «… der eigenen Nebenkosten jedes Mieters (Zwischensumme seiner Abrechnung) …».

---

## Rolle 2: Mietrecht

### Geprüft, ohne Befund (unsicher, nicht auf Fedlex gelesen)

- **Art. 4 Abs. 3 VMWG** (laut Merkblatt S. 6: «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden»): Die Verordnung legt keine Basis fest. Das Merkblatt nennt als verbreitete Praxis «einen festen Prozentsatz der Nebenkosten» und hält mehr als 2–3 % für nicht hinzunehmen. Ein Prozentsatz der eigenen Nebenkosten des Mieters ist damit vereinbar. Er ist für den Mieter auch am besten prüfbar: Basis und Satz stehen auf seiner eigenen Abrechnung, und die Summe aller Pauschalen ist nie grösser als der Satz auf die tatsächlich abgerechneten Kosten.
- **Art. 257a/257b OR:** Pauschale nur, wenn im Vertrag besonders vereinbart. Die Wizard-Hilfe sagt das («Verlangen Sie eine Verwaltungspauschale nur, wenn sie im Mietvertrag vereinbart ist. Sonst geben Sie 0 ein.»). Dwello prüft es nicht am Vertrag; das bestand schon vorher. Zur Grundlage siehe V-2.
- **Richtwert:** Hinweis ab mehr als 3 %, keine Sperre: deckt sich mit dem Merkblatt («höchstens 3 % üblich», BWO-Mitteilung und kantonale Entscheide laut Merkblatt, **unsicher**).
- **Leerstand (Art. 7 VMWG, unsicher):** Keine Änderung, siehe Rolle 1.

### M-1 (hoch): Satz bereits versandter Abrechnungen nachträglich umgeschrieben

- **Fall:** Eine Abrechnung wurde vor 0012 mit Schlüssel erstellt und versandt. Der Mieter erhielt «3 % von CHF 25'000.00, verteilt nach Pro Fläche (m²), für Ihre 31 von 365 Tagen». Nach 0012 gilt:
  - Die Detailseite zeigt sofort den neuen Satz (`CostTable.svelte` liest `management_fee_percent`).
  - Das gespeicherte PDF bleibt nur, solange `pdf_blob` gefüllt ist. Es wird neu erzeugt, und zwar mit dem neuen Satz und ohne Schlüssel, wenn (a) nach dem Versand noch kein PDF erzeugt wurde (das Versenden verwirft das alte PDF, `updateStatement`, `pdfOutdated`), (b) Datum oder Zahlungsfrist später geändert werden, oder (c) `POST /:id/generate-pdf` aufgerufen wird (das überschreibt auch bei `sent`/`paid`).
  - Der errechnete Satz kann weit vom vereinbarten abweichen: Fall F4 (Sommermieter mit Heizprofil, eigene Kosten 50.00, Schlüsselpauschale 12.00) ergibt **24.00 %**, Fall F7 (Gutschrift, eigene Kosten −20.00) ergibt **−15.50 %**. Vor einer Schlichtungsbehörde sähe ein Neudruck mit «24 % der Zwischensumme» wie eine klar unzulässige Pauschale aus, obwohl der Betrag dem versandten entspricht.
- **Bewertung:** Der geschuldete Betrag, die Forderung, ändert sich nicht; insofern ist die Umschreibung finanziell neutral. Die Abrechnung ist aber das Dokument, auf das sich der Mieter für seine Prüfung und Einsicht (Art. 8 VMWG, Art. 257b Abs. 2 OR, **unsicher**) stützt. Eine Neuausgabe muss die Berechnung so zeigen, wie sie versandt wurde. Ein neu hergeleiteter Satz ist eine nachträgliche Umdeutung und nicht akzeptabel.
- **Fix:** Für Nicht-Entwürfe mit Schlüssel vor dem `DROP COLUMN` die Grundlage als Text festhalten, z. B. eine Spalte `management_fee_basis text`, die die Migration aus Satz, Liegenschaftskosten (Summe `total_amount` der Positionen), Schlüsselname und Tagen füllt. PDF und Detailseite drucken diesen Text, wenn er gesetzt ist, sonst `feeOwn`. `management_fee_percent` bleibt dabei unverändert (der vereinbarte Satz). Vorher beim Eigentümer zählen: `SELECT status, count(*) FROM utility_statements WHERE management_fee_distribution_key_id IS NOT NULL GROUP BY status;`. Gibt es keine versandten, reicht eine Migration, die nur die Entwürfe nach V-3 neu rechnet.

### M-2 (mittel): Heizungsverwaltung (Art. 5 Abs. 2 lit. i VMWG) und Abrechnungsaufwand in einem Satz

- Laut Merkblatt (S. 4) dürfen für Heizung und Warmwasser sämtliche Verwaltungskosten verrechnet werden (Art. 5 Abs. 2 lit. i, Abs. 3 VMWG), für alle anderen Nebenkosten nur die Erstellung der Abrechnung (Art. 4 Abs. 3 VMWG). Dwello erhebt einen einzigen Satz auf alle eigenen Nebenkosten, die Heizkosten eingeschlossen. Eine Kategorie «Verwaltung Heizung» gibt es nicht (`Verwaltung` ist nicht umlagefähig, `0002_stammdaten.sql`).
- **Folge:** Für den Mieter ist das eher günstig (nie mehr als ein Satz), also kein Rechtsverstoss. Ein Vertrag, der eine Heizungsverwaltung (z. B. 3–4 % der Heizkosten) und eine Pauschale auf die übrigen Nebenkosten getrennt vereinbart, lässt sich aber nicht abbilden (vgl. V-2). Ein Vermieter, der deshalb die Heizungsverwaltung als Rechnung in «Heizung» bucht, erhält darauf zusätzlich die Pauschale: eine Pauschale auf die Pauschale.
- **Fix:** Wizard-Hilfe: «Die Pauschale deckt auch die Verwaltung der Heizung. Buchen Sie dafür keine eigene Rechnung.» Dazu ein Eintrag in `offene-punkte.md` (`TODO(fachlich prüfen)`, Art. 5 Abs. 2 lit. i VMWG auf Fedlex lesen). Ob getrennte Sätze nötig sind, entscheidet der Eigentümer.

---

## Rolle 3: Datenprüfer

Methode: eigenes Python-Skript mit `decimal` und kaufmännischer Rundung, unabhängig vom Code der App. Scratch-Datenbanken `dwello_fach_f1` (Demodaten über `bun scripts/demo-data.ts`, alle Migrationen 0001–0012), `dwello_fach_f1m` und `dwello_fach_f1m2` (Migrationen 0001–0011, `demo/demo-data.sql`, konstruierte Abrechnungen, danach 0012). Alle drei wurden danach gelöscht; `dwello`, `dwello_test`, `dwello_e2e` und `dwello_persona` blieben unberührt.

### (a) Demodaten: 17 Abrechnungen, 0 Abweichungen

Geprüft je Abrechnung: Zwischensumme = Σ `tenant_share`; `management_fee` = round(Zwischensumme × Satz / 100, 2); `total_costs` = Zwischensumme + Pauschale; `balance` = `total_costs` − Akonto. Zusätzlich unabhängig nachgerechnet: Akonto = Monatsakonto × Monatsanteile und `rental_days`.

| Nr. | Status | Tage | Zwischensumme | Satz | Pauschale | Gesamt | Akonto | Saldo |
|---|---|---|---|---|---|---|---|---|
| NK-11111111-2024-0001 | paid | 366 | 2'866.58 | 3.00 | 86.00 | 2'952.58 | 2'880.00 | 72.58 |
| NK-11111111-2024-0002 | paid | 366 | 3'328.48 | 3.00 | 99.85 | 3'428.33 | 3'600.00 | −171.67 |
| NK-11111111-2024-0003 | paid | 366 | 3'132.52 | 3.00 | 93.98 | 3'226.50 | 3'240.00 | −13.50 |
| NK-11111111-2024-0004 | paid | 366 | 4'112.32 | 3.00 | 123.37 | 4'235.69 | 4'200.00 | 35.69 |
| NK-11111111-2025-0001 | sent | 365 | 3'005.65 | 3.00 | 90.17 | 3'095.82 | 2'880.00 | 215.82 |
| NK-11111111-2025-0002 | draft | 365 | 3'488.85 | 3.00 | 104.67 | 3'593.52 | 3'600.00 | −6.48 |
| NK-11111111-2025-0003 | draft | 365 | 3'283.86 | 3.00 | 98.52 | 3'382.38 | 3'240.00 | 142.38 |
| NK-11111111-2025-0004 | draft | 365 | 4'308.85 | 3.00 | 129.27 | 4'438.12 | 4'200.00 | 238.12 |
| NK-22222222-2024-0001 | paid | 366 | 2'261.90 | 3.00 | 67.86 | 2'329.76 | 2'400.00 | −70.24 |
| NK-22222222-2024-0002 | paid | 366 | 2'680.65 | 3.00 | 80.42 | 2'761.07 | 2'640.00 | 121.07 |
| NK-22222222-2024-0003 | paid | 366 | 3'069.48 | 3.00 | 92.08 | 3'161.56 | 3'120.00 | 41.56 |
| NK-22222222-2025-0001 | draft | 365 | 2'296.54 | 3.00 | 68.90 | 2'365.44 | 2'400.00 | −34.56 |
| NK-22222222-2025-0002 | draft | 181 | 1'415.51 | 3.00 | 42.47 | 1'457.98 | 1'320.00 | 137.98 |
| NK-22222222-2025-0003 | draft | 184 | 1'306.92 | 3.00 | 39.21 | 1'346.13 | 1'440.00 | −93.87 |
| NK-22222222-2025-0004 | draft | 365 | 3'117.87 | 3.00 | 93.54 | 3'211.41 | 3'120.00 | 91.41 |
| NK-33333333-2024-0001 | paid | 366 | 2'182.19 | 3.00 | 65.47 | 2'247.66 | 2'280.00 | −32.34 |
| NK-33333333-2024-0002 | paid | 366 | 2'970.20 | 3.00 | 89.11 | 3'059.31 | 3'000.00 | 59.31 |

Alle Sollwerte stimmen auf den Rappen. Grenzfall der Rundung: 2'866.58 × 3 % = 85.9974 → 86.00. Die Demodaten enthalten keine Abrechnung mit Schlüssel; die Migration ist darum an konstruierten Fällen geprüft (b). Nebenbefund ohne Bezug zu dieser Änderung: `tenant_share` weicht in zwei Positionen des Mieterwechsels Seepark A2 um 0.01 von `apartment_share × period_share` ab, weil `period_share` nur mit 4 Stellen gespeichert ist. Kein Handlungsbedarf, das PDF zeigt die Tage.

### (b) Migration 0012 an konstruierten Fällen

Echter Lauf von `0012_pauschale_eigene_kosten.sql` auf einer Datenbank mit Stand 0011:

| Fall | eigene Kosten | Pauschale (Schlüssel) | neuer Satz | Satz × eigene Kosten | Abweichung |
|---|---|---|---|---|---|
| F1 typisch | 3'005.65 | 88.40 | 2.94 | 88.37 | −0.03 |
| F2 gross | 12'345.67 | 380.12 | 3.08 | 380.25 | +0.13 |
| F3 gross | 9'876.54 | 301.99 | 3.06 | 302.22 | +0.23 |
| F4 Sommermieter mit Heizprofil | 50.00 | 12.00 | 24.00 | 12.00 | 0 |
| F5 eigene Kosten 0 | 0.00 | 5.00 | NULL | – | – |
| F6 Satz 0 | 2'000.00 | 0.00 | 0.00 | 0.00 | 0 |
| F7 Gutschrift | −20.00 | 3.10 | −15.50 | 3.10 | 0 |
| F8 ohne Schlüssel (unberührt) | 3'005.65 | 90.17 | 3.00 | 90.17 | 0 |
| F9 eigene Kosten winzig | 0.40 | 5.00 | **Abbruch** | – | – |

### D-1 (hoch): Migration bricht bei Verhältnis ≥ 1000 % ab

- F9: `ERROR: numeric field overflow – A field with precision 5, scale 2 must round to an absolute value less than 10^3`. `migrate.ts` rollt die Datei zurück und wirft; `bun run dev` und der Start nach einem Deploy scheitern, bis die Daten von Hand korrigiert sind.
- Der Fall entsteht, wenn ein Vertrag kaum eigene Kosten hat (z. B. Mietbeginn im Dezember, alle Rechnungen mit Leistungszeitraum bis November), die Schlüsselpauschale aber über die Tage trotzdem anfiel.
- **Fix:** Den Satz nur setzen, wenn er passt, z. B. `CASE WHEN total_costs - management_fee > 0 AND management_fee / (total_costs - management_fee) * 100 < 1000 THEN ROUND(…, 2) END`. Den Rest nach M-1 behandeln (Text der Grundlage festhalten), nicht mit einem erfundenen Satz. Ein pg-Test mit diesem Fall gehört dazu.

### D-2 (mittel): Umgerechneter Satz reproduziert den Betrag nicht

- Weil der Satz auf 2 Stellen gerundet wird (`DECIMAL(5,2)`), weicht `round(Satz × eigene Kosten)` vom gespeicherten Betrag ab. Die Obergrenze ist eigene Kosten × 0.005 % + 0.005.
- Simulation mit 100'000 Fällen (eigene Kosten 500–8'000, Schlüsselpauschale 3 % ± 15 %): 96 % weichen ab, Median 0.08, 95. Perzentil 0.28, Maximum CHF 0.40.
- **Auf dem PDF:** «Verwaltungspauschale: 2.94 % der Zwischensumme von CHF 3'005.65 … 88.40». Der Mieter rechnet 88.37 nach. Der Betrag ist klein, aber genau diese Zeile soll nachrechenbar sein, und eine Differenz lädt zu Rückfragen ein.
- **Fix:** Der Fix aus M-1 und V-3 löst das mit: Entwürfe neu rechnen, bei Versandten die ursprüngliche Grundlage drucken. Den Satz auf mehr Stellen zu speichern (z. B. 2.9411 %) wäre auf dem PDF unverständlich und wird nicht empfohlen.

### D-3 (mittel): Eigene Kosten 0 ergeben einen NULL-Satz, das PDF druckt «Infinity %»

- F5: Die Migration setzt `management_fee_percent` auf NULL (`NULLIF`). `toPdfData` (`statement-pdf.service.ts`, Fallback für «ältere Abrechnungen») rechnet dann `managementFee / subtotal * 100` = 5 / 0 = `Infinity`. Weil die Pauschale > 0 ist, wird die Zeile gedruckt: «Infinity % der Zwischensumme von CHF 0.00». Das ist aus dem Code abgeleitet, ein solches PDF wurde nicht gerendert.
- Die Detailseite (`src/lib/server/statement.ts`, `feePercent`) zeigt «0 % der Zwischensumme» neben CHF 5.00.
- **Fix:** Fallback in `toPdfData` wie im Frontend absichern (`subtotal > 0`); den Fall in der Migration nach D-1 und M-1 behandeln.

### D-4 (niedrig): Satz mit mehr als 2 Nachkommastellen

- `calculateStatementForContract` rechnet mit dem eingegebenen Satz (z. B. 3.125), `generateStatement` speichert ihn in `DECIMAL(5,2)` als 3.13. Das PDF zeigt dann «3.13 % der Zwischensumme von CHF 3'000.00», der Betrag ist aber 93.75 statt 93.90.
- Nicht im Browser geprüft: Das Zahlenfeld hat kein `step`, der Browser lässt Dezimalstellen eventuell gar nicht zu. Das ist eine eigene Unschärfe für Sätze wie 2.5.
- **Fix:** Den Satz vor der Berechnung auf 2 Stellen runden (oder im Formular mit `step="0.01"` begrenzen), damit gerechneter und gedruckter Satz gleich sind.

### D-5 (niedrig): Hergeleiteter Satz ungerundet

- Abrechnungen ohne gespeicherten Satz (vor Migration 0004): `toPdfData` druckt `(fee / subtotal) * 100` ohne Rundung, z. B. «2.9999667 %». Das Frontend rundet auf 2 Stellen. Bestand vor dieser Änderung.
- **Fix:** Im PDF ebenfalls auf 2 Stellen runden.

---

## Ohne Befund

- Rechenweg neuer Abrechnungen (Pauschale = round(Zwischensumme × Satz), Gesamt, Saldo): in allen 17 Demo-Abrechnungen korrekt.
- Leerstand und Mieterwechsel: keine Verschiebung zulasten des Mieters.
- PDF-Wortlaut `feeOwn` in de/fr/it/en: korrekt und gleichlautend.
