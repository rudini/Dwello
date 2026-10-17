# Code-Review W1b, Runde 4: Merge von origin/main (ac9d1e3) und Umnummerierung der Migration (20f5617)

Geprüft im Worktree `review-s4-code` (detached auf ac9d1e3): `git show ac9d1e3 --cc`, `git show 20f5617`, die Dateien, die beide Seiten seit der Merge-Basis f562b75 geändert haben (30 Dateien), und die automatisch zusammengeführten Stellen, an denen W4 (#92/#93/#138) und W8 (#130/#131/#134) auf die Abrechnungsdetailseite und die Rechnungswarnungen dieses Zweigs treffen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | docs/reviews/w1b-review-3.md:14, 34 | Der frühere Bericht nennt noch `0010_line_item_invoices.sql`. Das ist ein historischer Bericht und braucht keine Änderung. Alle aktuellen Stellen (`docs/data-model.md:338`, Verlauf im Archiv) nennen `0011`. |

Kein Blocker, kein Major.

## Was geprüft und bestätigt ist

- **Migration:** `0011_line_item_invoices.sql` ist eine reine Umbenennung (similarity 100 %) und läuft nach `0010_statement_payment_resets.sql`. Die beiden Migrationen ändern verschiedene Tabellen (`utility_statement_line_items.invoices` bzw. `utility_statements.payment_resets`/`payment_recorded_at`). Hat eine Entwicklungsdatenbank noch `0010_line_item_invoices.sql` eingetragen, bricht `migrate.ts:29-35` mit dem Reset-Hinweis ab. Da die Migration nicht auf main ist, betrifft das keine Installation.
- **`src/lib/server/statement.ts`:** `toStatement` übernimmt die `paymentResets` von main und die `lineItems` dieses Zweigs mit dem Prozentsatz des Heizprofils. Es gibt nur einen Mapper, keine Kopie. `src/lib/types.ts` enthält `paymentResets?` von main zusammen mit den Feldern der Positionen aus diesem Zweig.
- **`src/routes/statements/[id]/+page.server.ts`:** Der Import `resetStatementPayment` und die Aktion `resetPayment` von main sind da. `laterInvoices(fetch, id)` aus diesem Zweig ist da. Der Import `StatementWithDetails` ist zu Recht weggefallen, weil ihn nichts mehr nutzt (lint und check sind laut Aufrufer grün).
- **`+page.svelte` (nur main hat die Datei geändert):** `CostTable`, `PartiesPanel`, der Hinweis `statement-later-invoices`, `MetadataCard` mit `paymentResets` und `ResetPaymentDialog` stehen nebeneinander, ohne gegenseitige Abhängigkeit.
- **Backend:** In `statement.service.ts` haben sich die Änderungen nicht überschnitten. `generateStatement` speichert `invoices`, `updateStatementStatus`/`resetPayment` von main lassen die Positionen unberührt. `routes/statements.ts` enthält `payment-reset` und `changed-invoices`. `schema.ts` enthält `BilledInvoice` und `PaymentReset`.
- **W8 (#131/#134):** `invoice-completeness.service.ts`, `PreviewChecks`/`InvoiceHint` (Assistent) und `GET /invoices/:id/statements` mit `statementPeriods` in `src/lib/server/invoice.ts` haben keine gemeinsamen Dateien und keinen gemeinsamen Zustand. Die Links «bearbeiten» aus den W8-Hinweisen führen auf `/invoices/:id/edit`. Dessen Load zeigt seit diesem Zweig die Warnungen MissedWarning/BilledWarning. Das ist gewollt und widerspricht sich nicht.
- **Verträge:** `statement.json` enthält `paymentResets: []`. `statement-changed-invoices.json`, `invoice-statements.json`, `statement-payment-reset.json` und `statement-paid-date-refused.json` sind vorhanden. In `api-contracts.pg.test.ts` laufen die Tests dieses Zweigs (Z. 94, 104) vor dem Block «API-Verträge der Zahlung» (Z. 353), der die Abrechnung versendet und bezahlt. Die neue Rechnung «Kaminfeger Keller» vom 2026-01-20 liegt ausserhalb der Testperiode 2024.
- **docs/api-specification.md:** Die Zeile `GET /:id` hatte dieser Zweig nicht geändert, daher geht durch die Übernahme der Zeile von main nichts verloren. Die Zeile `changed-invoices` ist da.
- **E2E-Konflikte:** `screens.ts` enthält `partsStatement` (Emil 2025, Talblick) und `paidStatement` (Anna 2024, bezahlt). `screens.json` enthält `statement-parts-detail` und `statement-paid-detail` mit `reset-payment-dialog`, beide in `accessibility.feature` und `sprachen-bildschirme.feature`. Steps und Tasks enthalten beide Seiten. Die Steps rufen nur Tasks und Questions auf. Kein Step ist doppelt definiert, und kein `@wip` ist in den Features.
- **Texte:** de/fr/it/en haben je 1521 Schlüssel, keine doppelten Schlüssel nach dem Auto-Merge.
- **Formatierung:** In den konfliktgelösten Zeilen meldet Prettier keine Abweichung. Die Abweichungen, die Prettier in `statement.ts` und `+page.server.ts` meldet, stehen auf Zeilen dieses Zweigs aus früheren Runden, nicht in der Merge-Auflösung.
- **Nichts Unzusammenhängendes:** Die Merge-Auflösung enthält nur die Vereinigung beider Seiten. 20f5617 ändert nur Dateiname und zwei Dokumentverweise.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (2715), `cd backend && bun run type-check`, `cd backend && bun run test` (744, Abdeckung 94.2 %): vom Aufrufer gemeldet, nicht neu ausgeführt.
- E2E der Features Abrechnung, Rechnung, Barrierefreiheit und Sprachen auf ac9d1e3: lief beim Aufrufer noch und ist nicht bestätigt. Besonders zu beachten:
  - `statement-paid-detail` zeigt jetzt die Kostentabelle dieses Zweigs für die bezahlte Abrechnung Anna 2024 (axe hell und dunkel, keine deutschen Texte in fr/it/en).
  - Die Szenarien #92/#138 in `statement-detail.feature` laufen neben den W1b-Szenarien in derselben Datei.
- Der Text `statements_later_sent` für eine *bezahlte* Abrechnung («Ziehen Sie sie von der Nachzahlung ab …»): Er stammt aus diesem Zweig und war vor dem Merge schon so. Fachlich nicht neu beurteilt.
