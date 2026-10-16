# Code-Review Slice #96 / #104, Runde 2 (58d49f6..dacc833)

Worktree: Die genannte Worktree `…/scratchpad/review-s2-code` gibt es nicht. Geprüft habe ich in `/tmp/claude-0/-home-user-Dwello/448bd968-db3f-51d5-8b5a-96a95e074d39/scratchpad/review-s2-code2`, detached auf dacc833 (`git worktree list`, `git rev-parse HEAD`).

Gelesen: alle 24 Dateien des Deltas. Dazu habe ich gelesen:
- `pdf.service.ts` (`timeShare`, `formatShare`) und `statement-pdf.service.ts` (`lineItemOf`, `toPdfData`, `byDaysRented`);
- `calculation.service.ts` (Heizanteil, `heatingOfRun`) und `prorating.service.ts` (`handleMidYearMoves`);
- `invoice.service.ts` (`getInvoicesForStatement`);
- die alten BFF-Regeln auf 754542d (`statementPeriods`, `laterInvoices`);
- `tests/e2e/fixtures/backend.ts` (Seed-Helfer), die Szenarien von `statement-detail.feature` und `UBIQUITOUS_LANGUAGE.md` / `i18n-begriffe.md` (Heizprofil, Nachzahlung).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | erledigt | backend/src/services/statement-invoices.service.ts:28-29, 113, 141-144 | Bei Altabrechnungen gilt wieder die frühere Regel nach dem Zeitpunkt des Erfassens. `billedIn` heisst wie auf 754542d `statement.createdAt >= invoice.createdAt`, nur noch für umlagefähige Rechnungen der Periode. Beide Wege sind im pg-Test belegt, und `docs/data-model.md` und `docs/api-specification.md` nennen die Regel |
| C-2 | erledigt | src/routes/statements/[id]/CostTable.svelte:28-43 | Gleiche Regel wie `pdf.service.ts:479-485`: gleiche Toleranz (0.00005), gleiche Tage der Periode, keine Tage bei Heizprofil oder Teilen. Der DOM-Test «366/366 Tage» schlägt ohne den Fix fehl |
| C-3 | erledigt | tests/a11y/screens.json:401, tests/e2e/fixtures/screens.ts:82-93 | Bildschirm `statement-parts-detail` steht in beiden Features. Der Seed erzeugt Teile (Einzug 15.08., Hauswart Q2/Q3) und eine Veränderung des Tankbestands (600 → 100) ohne Heizprofil, also auch die Tankzeile. `default` hat schon eine Bedeutung in `stateMeanings`. Die `<dl>`-Korrektur ist mit einem DOM-Test belegt, der vorher rot war |
| C-4 | erledigt | backend/src/__tests__/statement-invoices.pg.test.ts:126-140 | Ohne `fuelStock` beim Speichern schlägt das erste `expect` fehl, ohne `!billed.fuelStock` das zweite |
| C-5 | erledigt | src/routes/statements/[id]/LineInvoices.svelte:10 | `^CHF\s?`, mit einem DOM-Test belegt, der vorher rot war (Rest siehe C-22) |
| C-6 | erledigt | src/__tests__/statement-pages.dom.test.ts:389-400 | `part_no_period` und `part_beyond` sind jetzt getestet. Der Text ist gleich wie im PDF (`pdf.service.ts:77-78`) |
| C-8 | erledigt | docs/api-specification.md:124, 219 | Beide Endpunkte stehen jetzt in der API-Spezifikation, mit 404-Code und der Regel für Altabrechnungen |
| C-10 | erledigt | backend/src/__tests__/statement-invoices.pg.test.ts:55-60 | Für beide Routen ist die 404-Antwort getestet |
| C-12 | erledigt | backend/src/services/statement-invoices.service.ts:56-57 | `statement.lineItems` aus `listStatements` ersetzt die zweite Abfrage. Die Imports sind entfernt |
| C-17 | Major | tests/e2e/features/statement-detail.feature | Die neuen sichtbaren Regeln haben kein Szenario und kein `No scenario: <Grund>`: der Zeitanteil «366/366 Tage» bei einem Mieter über die ganze Periode (V-16/C-2) und «… nach Heizprofil» (Marco P-1) |
| C-18 | Minor | src/lib/server/statement.ts:27-28 | Die Seite erkennt `byProfile` an der Zahl (`periodShare` ≈ `heatingShare.percent`), das PDF an der Kategorie (`isHeatingCost`) und am Heizanteil des Laufs (`statement-pdf.service.ts:83, 93, 127`). Folgen: Eine andere Position ohne `billedDays` (mit Teilen, oder vor #208) mit demselben Anteil heisst zufällig «nach Heizprofil». Eine Heizposition einer Abrechnung von vor #209 bekommt den Zusatz nicht, obwohl das PDF sie als nach Heizprofil führt |
| C-19 | Minor | tests/e2e/fixtures/screens.ts:82-93 | Der neue Seed (Gebäude Talblick, Mieter Emil, Rechnungen, Tankbestand, Abrechnung) läuft für jeden Bildschirm mit `{id}` und für jeden Zustand in der Liste von Zeile 38, z. B. die Assistentenschritte, `preview-all-billed` und `buildings-billed`. Gemeldet sind aber nur die axe- und Sprachzeilen der Abrechnungs- und Rechnungsbildschirme. Die übrigen Zeilen beider Features sind nach der Seed-Änderung nicht gelaufen («Before marking anything complete»: betroffene E2E) |
| C-20 | Nit | src/routes/statements/[id]/CostTable.svelte:138, 144 | Zwei verschiedene Zeilen tragen dieselbe `data-testid="statement-rounding"`. Eindeutige Namen wären klarer, z. B. `statement-before-rounding` und `statement-rounding` |
| C-21 | Nit | src/routes/statements/[id]/CostTable.svelte:31-34 | Die Seite schaut auf `invoices[].part`, das PDF auf `invoiceParts` (`pdf.service.ts:482`). Eine Abrechnung zwischen #226 und #96 hat `invoiceParts`, aber `invoices = null` und damit keine `part`. Die Seite zeigt dort Tage, wo das PDF Prozent zeigt, aber nur, wenn der gewichtete Anteil zufällig genau Miettage / Tage ist |
| C-22 | Nit | src/routes/statements/[id]/LineInvoices.svelte:14 | `partText` formatiert den Betrag weiter mit `formatCurrency`. Ein negativer Betrag (gestiegener Tankbestand, Gutschrift) steht als «CHF-500.00», im PDF als «CHF -500.00» (`formatCHF`) |
| C-23 | Nit | src/lib/types.ts:284 | ponytail `shrink:` `byProfile?: boolean` ist optional, obwohl der Mapper es immer setzt; als Pflichtfeld wäre es ehrlicher (in den Test-Fixtures dann `false`) |

Text M-3 / Dr. Weber P-1: Die Rückerstattung ist in `invoices_missed_text` und `statements_later_sent` in allen vier Sprachen neu formuliert. Die Begriffe stimmen mit `i18n-begriffe.md` überein (Nachzahlung / montant à payer / importo dovuto / amount due). Die DOM-Tests sind angepasst. Die neue Meldung `statements_time_share_profile` steht in allen vier Sprachen, «Anteil nach Heizprofil» ist ein Begriff aus `UBIQUITOUS_LANGUAGE.md`.

ponytail-Bilanz: Das Delta ist knapp. Nur C-23 bleibt, 0 Zeilen.

## Blocker/Major

### C-17: Die neuen Zeitanteil-Regeln haben kein Szenario

Das Delta ändert zwei Dinge, die der Verwalter auf der Detailseite sieht. Beide sind auf diesem Zweig neu und nur im DOM bzw. im Mapper getestet:
1. Bei einem Mieter über die ganze Periode zeigt eine Position mit Rechnungen über verschiedene Tage «366/366 Tage» statt «100.00 %» (V-16, C-2).
2. Eine Position, die nach dem Heizprofil verteilt wird, zeigt «55.80 % nach Heizprofil» (Persona Marco P-1, dort Major).

Kein Szenario in `tests/e2e/features` prüft eine der beiden Regeln (`grep "nach Heizprofil\|366/366"` findet nur die PDF-Zeile `statement-detail.feature:201`). Der Commit und `implementation_plan.md` nennen auch keinen Grund «No scenario». CLAUDE.md, Workflow Schritt 1 und 6, verlangt für eine Verhaltensänderung (auch die Korrektur eines Befunds) ein Szenario.

Die Regel «nach Heizprofil» ist ausserdem schichtübergreifend: Sie hängt davon ab, dass `heatingShare.percent` aus dem Backend genau zum gespeicherten `periodShare` passt. Das zeigen nur der Mapper-Test mit einer handgebauten Antwort und ein DOM-Test mit `byProfile: true`. Das Zusammenspiel mit der echten Antwort prüft nur ein Szenario.

**Nachweis:** `byProfile` im Mapper auf `false` setzen oder `rentedShare` auf `false`: Alle E2E-Szenarien bleiben grün, auch «Kostenposition nennt Wohnungsanteil und Zeitanteil wie das PDF» (Eva Frei hat gespeicherte Tage) und die Szenarien mit dem Heizprofil «Winter».

**Korrektur:** Mit dem vorhandenen Step «nennt die Position … den Wohnungsanteil …, den Zeitanteil … und den Betrag …»:
- Lea Graf seit 2023 (wie bei Zeile 195) mit zwei Hauswart-Rechnungen über verschiedene Quartale 2024: Zeitanteil «366/366 Tage»;
- Eva Frei mit dem Heizprofil «Winter» und einer Heizungsrechnung: Zeitanteil «<Prozent> nach Heizprofil».

## Nicht bestätigt

- Alle Checks des Aufrufers sind nicht wiederholt, alle «vom Aufrufer gemeldet»:
  - `bun run lint`, `bun run check`, `bunx vitest run` (2669);
  - `cd backend && bun run type-check`, `cd backend && bun run test` (719, Coverage 94.1 %);
  - E2E `-g "statement-parts-detail |Abrechnungsdetail|Rechnungsdetail|Rundung|Rechnung bearbeiten"` (66 grün);
  - die axe- und Sprachzeilen der sechs genannten Bildschirme (27 grün, vor dem letzten Fix).

  `bunx vitest run` für `statement-pages.dom.test.ts` und `statement-mapping.test.ts` wollte ich wiederholen. Der Zugriff auf `node_modules` (Link nach `/home/user/Dwello/node_modules`) ist per Regel gesperrt.
- Ob die Sprachprüfung (fr/it/en) von `statement-parts-detail` die Tankzeile und die Formel wirklich sieht: Laut Seed entstehen sie (Kategorie «Heizung» = `Heating` des Tankbestands, Abrechnung ohne Heizprofil). Den Lauf habe ich nicht gesehen, er ist «vom Aufrufer gemeldet».
- Ob die Seed-Änderung andere Bildschirme verändert (C-19): z. B. die Gebäudeauswahl im Assistenten, `buildings-billed` oder `preview-all-billed` (`tests/e2e/tasks/accessibility.ts:310, 323`). Gelesen habe ich nur die Zustandsbedeutungen, nicht die Tasks im Einzelnen.
- `heatingShare.percent` ist laut `calculation.service.ts:443-447` und `prorating.service.ts:223` auf zwei Stellen gerundet, `periodShare` ist `percentage / 100` auf vier Stellen. Darum passt die Toleranz in C-18 bei echten Daten. Nur gelesen, nicht geprüft.
- Bestätigt durch Code und Test:
  - Fallback für Altabrechnungen in beiden Endpunkten (pg);
  - Tankbestand gespeichert und nie «gelöscht» (pg);
  - 404 beider Routen (pg);
  - Zeitanteil in Tagen für ganze Perioden und «nach Heizprofil» (DOM, Mapper);
  - Teilzeilen ohne Leistungszeitraum und über die Periode hinaus (DOM);
  - negativer Betrag in der Formel (DOM);
  - gültige `<dl>` mit Rundung (DOM);
  - neue und geänderte Texte in allen vier `messages/*.json`;
  - der neue Bildschirm in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`;
  - die Doku in `data-model.md` und `api-specification.md`.
- Issue #307 (C-7) habe ich nicht auf GitHub geöffnet. Bestätigt ist nur, dass der Plan es nennt.
