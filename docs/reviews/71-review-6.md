# Code-Review Runde 6 (Abschluss), PR #354 (#71)

Umfang: `git diff 5827fe50 HEAD -- backend/src src tests`, also der Merge d490a85c (origin/main 0f3d5d1d) und der Test-Fix 5e60256c.
Worktree: `/tmp/claude-0/-home-user-Dwello/80f6c78d-4176-5c5e-b0cf-a0f1691f2996/scratchpad/review-71-r6`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/invoice.service.ts:556 | `getInvoicesForStatement` sortiert nur nach `invoiceDate`. Bei zwei Rechnungen mit demselben Datum ist die Reihenfolge der `invoiceParts` (und damit der Rechnungen unter der Position und der Summenformel «Ihr Anteil: … × (a + b) / …» im PDF) nicht festgelegt. Ein zweites Sortierkriterium (`invoices.id`, wie bei der Liste in Zeile 149) würde das beheben. Der Fehler bestand schon vor dem Branch (#226), der Branch zeigt ihn nicht deutlicher. |
| C-2 | Nit | backend/src/__tests__/heating-distribution.pg.test.ts:299 | `find(...)!`: findet der Test den Teil nicht, bricht er mit einem TypeError auf `undefined` ab statt mit einem Vergleich der Werte. Für einen Test genügt das. |

Keine Blocker oder Majors.

## Geprüft

- **Merge d490a85c:** Laut `git show --remerge-diff` gab es nur in `docs/archive/implementation-plan-verlauf.md` einen Konflikt. Im Code von `backend/src/services` ändert sich zwischen 5827fe50 und HEAD nur `category.service.ts` (#166). `calculation.service.ts`, `invoice.service.ts`, `fuel-stock.service.ts`, das Schema und die Migrationen sind unverändert. Mit dem Merge kam also keine Änderung in die Rechnung, die mit der Teilung nach Heizprofil pro Rechnung zusammenwirken könnte.
- **#289 (#250/#254, Leistungszeitraum) zusammen mit der Teilung pro Rechnung:** Der Merge bringt nur Texte (`InvoiceDataFields.svelte`, Hilfeseite), einen pg-Test (`service-period.pg.test.ts:79`) und das E2E-Szenario «Eine Rechnung über mehrere Jahre …» (`statement-generate.feature:87`). Beide verwenden die Kategorie Warmwasser, und die ist laut `backend/migrations/0002_stammdaten.sql:16` mit `is_heating_cost = false` angelegt. Weder `byRunProfile` noch `byProfile` greifen deshalb, und die erwarteten Beträge nach Tagen gelten auch auf diesem Branch. Bei einer Heizrechnung über mehrere Jahre rechnet `byProfile` mit `invoice.start`/`invoice.end`, also mit dem Teil in der Periode (`inPeriod` in `invoice.service.ts:530-537`). Das ist dieselbe Regel, die der Test «teilt den Teil einer Rechnung über die Periode hinaus …» (`heating-distribution.pg.test.ts:306`) abdeckt. Ich finde keinen Widerspruch.
- **Test-Fix 5e60256c:** Die Ursache stimmt. Beide Rechnungen haben über den Helfer `invoice()` (Zeile 228) das Datum `2024-04-10`, und die Sortierung nur nach Datum legt die Reihenfolge nicht fest. Der Fix sucht den Teil jetzt über `start === '2024-06-01'`. Der Teil der Jahresrechnung beginnt am `2024-01-01`, die Suche ist also eindeutig. Was der Test prüft, ist unverändert (62/92, kein Profil, 1120).
- **Weitere Tests, die von der Reihenfolge abhängen könnten:**
  - `heating-distribution.pg.test.ts:275, 312, 313` legen nur eine Rechnung an. Zeile 339 (stillgelegter Tank) hat ebenfalls nur eine Rechnung: Für 2024 fehlt der Endstand, deshalb liefert `fuelStockChange` keinen Teil (`fuel-stock.service.ts:76`). Hängt `fuelStockChange` einen Teil an, steht er immer nach den Rechnungen (`calculation.service.ts:372-373`). Zeile 325 hat keine Teile (Summe null).
  - `statement-pdf.pg.test.ts:395-425`: Im ersten Test gibt es eine Heizrechnung, im zweiten ergibt die Position null, es gibt also keine Teile.
  - `statement-pdf-render.test.ts` arbeitet mit festen Arrays.
  - E2E `statement-detail.feature:422-433` (Summenzeile `1'000.00 × 0.00 % + 1'000.00 × 52.00 %`): Die Rechnung des Szenarios ist vom `2024-04-10`, die Heizölrechnung der Fixture vom `2024-06-30` (`tests/e2e/fixtures/backend.ts:378`). Die Daten unterscheiden sich, die Reihenfolge ist also festgelegt. Die Zeilen pro Rechnung prüft der Test einzeln mit «steht im PDF», sie hängen nicht von der Reihenfolge ab.
  - Fazit: Kein weiterer Test des Branches hängt von einer nicht festgelegten Reihenfolge ab.
- Die übrigen Dateien im Diff (Datenschutz #82/#178, Kategorien #166/#219, Auth/Login, Mieterdetail) kommen unverändert aus main und wurden in deren eigenen PRs reviewt. Ich habe sie nur daraufhin geprüft, ob sie Code dieses Branches berühren. Das tun sie nicht.

## Nicht bestätigt

- lint, check, type-check, Backend-Gesamtlauf mit 949 bestandenen Tests, vitest mit 3005 bestandenen Tests, E2E chromium+api `-g "Leistungszeitraum|Heizprofil|Heizkosten|Tank"` mit 51 bestandenen Tests: vom Aufrufer gemeldet, nicht von mir wiederholt (Backend-Tests waren ausdrücklich ausgeschlossen, E2E darf ich nicht starten).
- Der Filter `-g` erfasst das mit main gekommene Szenario «Eine Rechnung über mehrere Jahre zählt in jeder Periode mit ihrem Teil» (`statement-generate.feature:90`) nicht, sein Titel enthält keinen der Begriffe. Dass es auf diesem Branch grün ist, habe ich nur durch Lesen abgeleitet (Kategorie Warmwasser, kein Heizprofil), nicht durch einen Lauf.
- Dass der Test-Fix das sporadische Scheitern beseitigt, folgt aus dem Code. Belegen ließe es sich nur mit wiederholten Gesamtläufen, und die habe ich nicht gemacht.
