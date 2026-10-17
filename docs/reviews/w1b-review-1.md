# Code-Review Slice #96 / #104 (754542d..58d49f6)

Worktree: `/tmp/claude-0/-home-user-Dwello/448bd968-db3f-51d5-8b5a-96a95e074d39/scratchpad/review-s1-code` (detached auf 58d49f6). Ich habe alle 46 geänderten Dateien gelesen, dazu `calculation.service.ts`, `statement.service.ts` (`listStatements`, `getStatement`), `fuel-stock.service.ts`, `pdf.service.ts` (`timeShare`, `partLines`), `pdf-format.ts`, `tests/e2e/fixtures/screens.ts`, `tests/a11y/screens.json`, Issue #96 und `docs/reviews/w1b-fachreview-1.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/statement-invoices.service.ts:67 | Abrechnungen von vor der Migration (`invoices` null) fallen aus `billedIn` heraus: «Rechnung schon abgerechnet», die Folge im Löschdialog und der Beleg-Hinweis verschwinden für jede Rechnung, die vor 0008 abgerechnet wurde (auch in versendeten Abrechnungen); kein Test und keine Doku dazu |
| C-2 | Major | src/routes/statements/[id]/CostTable.svelte:26-31 | Der Zeitanteil weicht vom PDF ab: Bei einem Mieter über die ganze Periode, dessen Position Rechnungen über verschiedene Tage hat (und bei Abrechnungen von vor #208), zeigt die Seite «100.00 %», das PDF «366/366 Tage» (pdf.service.ts:479-485) |
| C-3 | Major | tests/a11y/screens.json:393 | Neuer UI-Zustand ohne a11y- und Sprachenprüfung: Rechnungszeilen mit Tagen, «Ihr Anteil: …»-Formel und Zeile «Veränderung Tankbestand» (LineInvoices.svelte). Der Seed (fixtures/screens.ts) hat nur Mieter über die ganze Periode, darum erscheint der Zustand nie |
| C-4 | Major | backend/src/services/statement-invoices.service.ts:41, backend/src/services/calculation.service.ts:371-378 | Kein Backend-Test mit Tankbestand (V-1: «Mindestens ein Test mit Tankbestand»). Ohne `fuelStock` beim Speichern oder ohne `!billed.fuelStock` bleiben alle Tests grün, und jede Abrechnung mit einer Veränderung des Tankbestands meldet dauerhaft «1 Rechnung … gelöscht» |
| C-5 | Minor | src/routes/statements/[id]/LineInvoices.svelte:10 | `number()` schneidet bei negativen Beträgen «CHF» nicht ab (`formatCurrency(-200)` = «CHF-200.00»). Eine Gutschrift oder ein gestiegener Tankbestand steht in der Formel als «CHF-200.00 × 139/365», im PDF als «-200.00» |
| C-6 | Minor | src/routes/statements/[id]/LineInvoices.svelte:16-24 | Die Varianten `statements_part_no_period` und `statements_part_beyond` sind ungetestet: Der DOM-Test prüft nur `part_line` und `part_stock` (V-12 verlangt alle Varianten) |
| C-7 | Minor | backend/src/services/statement-invoices.service.ts:32-44 | Ein danach geänderter Tankbestand zählt im Hinweis nicht, und der Ausschluss ist nirgends als offene Arbeit festgehalten (V-1 verlangt das eine oder das andere; #132 und #96 nennen es nicht) |
| C-8 | Minor | docs/api-specification.md | Die neuen Endpunkte `GET /statements/:id/changed-invoices` und `GET /invoices/:id/statements` fehlen in der API-Spezifikation |
| C-9 | Minor | tests/e2e/targets/statement-detail.ts:20 | Das Target findet die Rechnungen einer Position über die Struktur (`xpath=following-sibling::tr[1]`) statt über `data-testid` oder Rolle/Name, z. B. `getByRole('list', { name: 'Rechnungen zu …' })` |
| C-10 | Minor | backend/src/routes/statements.ts:157, backend/src/routes/invoices.ts:212 | Die 404-Antwort (`STATEMENT_NOT_FOUND` / `INVOICE_NOT_FOUND`) der neuen Routen ist ungetestet |
| C-11 | Minor | src/lib/server/statement.ts:33 | `sharesOf` reicht die Backend-Rechnung ungetypt per Spread an den Client weiter (`invoice: BackendStatement`), statt die Felder zu mappen («One mapper per response») |
| C-12 | Nit | backend/src/services/statement-invoices.service.ts:56-61 | ponytail `reuse:` `listStatements` liefert die `lineItems` schon mit. Die zweite Abfrage und die Imports `inArray` und `utilityStatementLineItems` können wegfallen (`statement.lineItems`), ca. -8 Zeilen |
| C-13 | Nit | backend/src/services/calculation.service.ts:371-378 | ponytail `shrink:` `group.invoices.map(({ noPeriod, whole, ...billed }) => billed)`, 1 Zeile statt 8 |
| C-14 | Nit | tests/e2e/steps/invoice-detail.steps.ts:95-101 | ponytail `yagni:` Zwei gleiche Given-Steps, die sich nur durch «von» unterscheiden; einer reicht |
| C-15 | Nit | tests/e2e/steps/statement-detail.steps.ts:255 | Der Step «nennt die Abrechnung {string}» klingt allgemein, liest aber nur das Mietverhältnis; ein Name wie «nennt die Abrechnung das Mietverhältnis {string}» wäre klarer |
| C-16 | Nit | tests/e2e/features/statement-detail.feature:438 | «Kein Hinweis, solange …» ist schon auf dem Basiscommit grün (Absicherung, kein roter Test); als Gegenprobe in Ordnung |

ponytail-Bilanz: netto ca. -16 Zeilen möglich (C-12, C-13, C-14).

## Blocker/Major

### C-1: Abrechnungen von vor der Migration verlieren «Rechnung schon abgerechnet»

`invoiceStatements` überspringt jede Abrechnung, deren Positionen `invoices = null` haben (`if (!known(positions)) continue;`), und setzt dann weder `billedIn` noch `missedIn`. Vor dem Diff kam `billedIn` aus Zeitstempeln und Überlappung, also auch für alle bestehenden Abrechnungen. Nach der Migration haben alle bestehenden Abrechnungen `null`. Damit fallen weg:
- `BilledWarning` beim Bearbeiten (`src/routes/invoices/[id]/edit/+page.svelte:117`);
- die Folge im Löschdialog (`DeleteConsequences.svelte:15`);
- der Beleg-Hinweis «Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen» (`src/routes/invoices/[id]/+page.svelte:115`).

So kann der Verwalter eine schon versendete Abrechnungsrechnung ohne Warnung ändern oder löschen. Die Vorgabe «statements created before the migration report no change» betrifft den Änderungshinweis, nicht «schon abgerechnet». Issue #96 entscheidet nichts zu Altbeständen, und `docs/data-model.md` sagt nur «report no change».

**Nachweis:** Im pg-Test «meldet nichts bei einer Abrechnung ohne gespeicherte Rechnungen» nach dem Nullsetzen `periodsOf(billed)` abfragen: Ergebnis `{ billedIn: [], missedIn: [] }`. Auf 754542d nannte die BFF-Regel für denselben Fall `billedIn: [year]`.

**Korrektur:** Bei Altabrechnungen auf die frühere Regel zurückfallen (Überlappung mit dem Leistungszeitraum bzw. Rechnungsdatum, `createdAt`-Vergleich) oder zumindest `billedIn` behalten. Ist der Wegfall gewollt, ist das eine Produktentscheidung und gehört unter «Blocked on me».

### C-2: Zeitanteil nicht wie im PDF

Die Anforderung (#104, #240) verlangt, dass die Seite den Zeitanteil einer Position so zeigt wie das PDF. Das PDF zeigt Tage in drei Fällen (`pdf.service.ts:479-485`):
1. mit gespeicherten Tagen;
2. Prozent bei `invoiceParts`;
3. sonst «Miettage / Tage der Periode», wenn `periodShare` genau diesem Verhältnis entspricht.

`CostTable.svelte:26-31` kennt Fall 3 nicht. Ein Mieter über die ganze Periode mit Rechnungen über verschiedene Leistungszeiträume in einer Kategorie (z. B. Hauswart-Rechnungen je Quartal) bekommt `noDays` (`calculation.service.ts`, `daysOf`, `wholePeriod`). Die Seite zeigt dann «100.00 %», das PDF «365/365 Tage». Das ist der häufigste Mieterfall. Abrechnungen von vor #208 weichen genauso ab.

**Nachweis:** Ein DOM-Test mit `line({ shareDays: null, periodShare: 1 })` und `rentalDays` gleich den Tagen der Periode zeigt in Spalte 4 «100.00 %». Das PDF druckt für dieselben Daten «366/366 Tage».

**Korrektur:** Den Rückfall von `timeShare` übernehmen (`statement.rentalDays`; die Tage der Periode aus `periodStart`/`periodEnd` oder über den Mapper); bei einer Position, die nach Heizprofil verteilt wird, keine Tage.

### C-3: Neuer UI-Zustand fehlt in screens.json, accessibility.feature und sprachen-bildschirme.feature

`LineInvoices.svelte` rendert bei Rechnungen über verschiedene Tage einen eigenen Zustand: Zeilen mit «Leistungszeitraum …, Ihre Mietstage …», die Formel «Ihr Anteil: …» und die Zeile «Veränderung Tankbestand» ohne Link. Im Seed von `tests/e2e/fixtures/screens.ts:48-50` laufen alle Verträge über die ganze Periode (seit 2015), darum ist `invoiceParts` immer null. Der Tankbestand hat nur einen Stand (`fuelStock('Seeblick', '2025-12-31', …)`), darum gibt es auch keine Veränderung. axe und die Sprachprüfung sehen diese Texte nie: fr/it/en der Varianten `part_*`, `part_share` und `fuel_stock`, und den Kontrast der Formel.

**Nachweis:** Kein Eintrag in `tests/a11y/screens.json` (statement-detail kennt nur `default`, `send-dialog`, `delete-dialog`), und kein Seed erzeugt `invoiceParts`.

**Korrektur:** Einen Zustand (z. B. `statement-detail` mit Bildschirm `statement-parts-detail`) mit einem Mieterwechsel unter dem Jahr, Rechnungen über verschiedene Leistungszeiträume und zwei Tankständen in den Seed, dazu `stateMeanings` und die Zeilen in beiden Features.

### C-4: Tankbestand im Backend ungetestet

`statement-invoices.pg.test.ts` hat keinen Fall mit Tankbestand. Zwei Stellen hängen daran und sind ohne Test:
- `calculation.service.ts:371-378` speichert `fuelStock` nur, wenn es gesetzt ist;
- `changedInvoices` filtert die gespeicherte Zeile `fuel-stock-<Periodenende>` aus der Liste der gelöschten Rechnungen heraus (`statement-invoices.service.ts:41`).

Fällt eine der beiden Stellen weg (Mutation), bleibt jeder Test grün: Die DOM-Tests bauen `fuelStock` von Hand, und kein E2E-Szenario prüft den Hinweis bei einem Tankbestand. In der App meldet dann jede Abrechnung eines Gebäudes mit Tank für immer «Seit dem Erstellen … wurde 1 Rechnung … gelöscht». Das Fach-Review V-1 verlangt ausdrücklich «Mindestens ein Test mit Tankbestand», und die Anforderungszeile «V-1 Tankbestand stored with fuelStock» ist nur am Frontend belegt.

**Nachweis:** `!billed.fuelStock &&` in Zeile 41 entfernen: `bun test src/__tests__/statement-invoices.pg.test.ts` bleibt grün.

**Korrektur:** Ein pg-Test mit zwei Tankständen: Die Position speichert `{ id: 'fuel-stock-…', fuelStock: true, … }`, und `changed-invoices` meldet `[]`.

## Nicht bestätigt

- Die Checks des Aufrufers, alle «vom Aufrufer gemeldet» (nicht wiederholt): `bun run lint`, `bun run check`, `bunx vitest run` (2663), `cd backend && bun run type-check`, `cd backend && bun run test` (716, Coverage 94.1 %), die E2E-Läufe statement-detail, invoice-detail, invoice-edit, statement-generate und statements.feature (105 grün, 1 Ausfall, der allein wiederholt grün war), die axe- und Sprachzeilen der fünf genannten Bildschirme (24 grün) und der Nachlauf nach der Aufteilung von `toLineItem`. Wiederholen wollte ich `bunx vitest run` für die fünf betroffenen Testdateien; der Zugriff auf `node_modules` (Link ins Haupt-Repo) war gesperrt.
- `invoice-late-detail` zeigt den geänderten Text von `invoices_missed_*`. Laut Aufrufer lief seine axe- und Sprachzeile nicht (accessibility.feature:108, sprachen-bildschirme.feature:109). Ob fr/it/en dort ohne Deutsch bleiben, ist nicht geprüft.
- Ob Altdaten mit `invoices = null` in einer echten Installation vorkommen (Produktivdaten oder nur Demo): Davon hängt das Gewicht von C-1 ab. Ich habe nur `backend/migrations` und den Kommentar der Migration gelesen.
- Ob `pageAddressInApp` nach `openInvoiceOfPosition` (einem einzelnen `Click.on`) auf die Navigation wartet: `tests/e2e/questions/statements.ts` habe ich nicht gelesen; das grüne Szenario spricht dafür.
- Die Gleichheit der Beträge in `billedAsIs` (`amount === invoice.inPeriod.amount`) hält, solange `inPeriod` gleich rechnet. Rechnet es später anders (Codeänderung), gelten alle Abrechnungen als geändert. Das ist nur gelesen, nicht geprüft.
- Bestätigt durch Code und Test: Speichern der Rechnungen je Position (pg); Hinweis bei neuer, geänderter (Betrag, Kategorie), gelöschter und nicht mehr umlagefähiger Rechnung und kein Hinweis ohne Änderung (pg, E2E); `billedIn`/`missedIn` aus der gespeicherten Verknüpfung inkl. M-2 (pg, E2E invoice-detail); Verträge und `api-contracts.pg.test.ts`; `docs/data-model.md`; PRD (V-13); Mietverhältnis, Wohnungsanteil, «Ihre Nebenkosten», Rechnungslinks und Teilzeilen (DOM, E2E); alle neuen Texte in allen vier `messages/*.json` und gleich wie die PDF-Texte in `pdf.service.ts`; Titel V-2/V-3 und Rückerstattungssatz M-1 in allen vier Sprachen.
