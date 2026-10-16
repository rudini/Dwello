# Code-Review #226, Runde 4 (Delta vor dem Push: Merge von origin/main und Umnummerierung der Migration)

Worktree: `review-226-merge` (detached auf 23cd2f35). Geprüft: `git show e6d88e55` (Merge von 0d970be0, PR #238), `git show 23cd2f35`, `git diff 0d970be0 23cd2f35` (die ganze Änderung des Branches gegen das neue main).

## Ergebnis

Kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-12 | Minor | `docs/archive/implementation-plan-verlauf.md:135-171` | Die archivierte Session #226 nennt weder den Merge von origin/main (e6d88e55) noch die Umnummerierung als eigenen Schritt noch diese code-reviewer-Runde 4 (Skill `slice-review`: eine Zeile je Reviewer und Runde). Nur der Plan-Satz und die Dateilisten sagen `0006`. Den Merge, die Prüfungen auf 23cd2f35 und diese Runde nachtragen. |
| C-13 | Nit | `docs/archive/implementation-plan-verlauf.md:2`, `:135` | Nach dem Merge gibt es zwei «Session 2026-10-16 (15)» (#217 oben, #226 unten); die Reihenfolge war schon vorher gemischt (zwei «(14)» auf fee5c0e9). Die Nummer von #226 auf (16) setzen oder es so lassen. |

## Geprüft und bestätigt

- **Reihenfolge der Migrationen:** `backend/migrations` enthält `0001` bis `0006`. `migrate()` (`backend/src/db/migrate.ts:18`) sortiert nach Dateiname und wendet `0005_invoice_documents.sql` (neue Tabelle `invoice_documents`, `DROP COLUMN invoices.invoice_pdf`) vor `0006_line_item_invoice_parts.sql` an (nur `ALTER TABLE utility_statement_line_items ADD COLUMN invoice_parts JSONB`). Die beiden betreffen verschiedene Tabellen und hängen nicht voneinander ab.
- **Inhalt von 0006:** Die Datei ist byte-gleich mit `0005_line_item_invoice_parts.sql` auf 8ad4b41f (`diff` ohne Ausgabe; Rename mit 0 Zeilen Änderung).
- **CI «Migrations unchanged»** (`.github/workflows/ci.yml:79-86`): Ich habe `git diff --name-status --diff-filter=a 0d970be0...23cd2f35 -- backend/migrations` nachgestellt: keine Ausgabe. Ohne Filter steht nur `A backend/migrations/0006_line_item_invoice_parts.sql` da. `origin/main` ist 0d970be0 (im Worktree und in `/home/user/dwello`). Keine Migration von main ist geändert oder umbenannt.
- **Nichts zeigt mehr auf den alten Namen:** `grep` nach `0005_line_item` / `line_item_invoice_parts` findet ausserhalb von `docs/archive` und `docs/reviews` nichts. Die `0005`, die in `docs/reviews/226-*.md` steht, ist der Stand zur Zeit dieser Reviews und bleibt so.
- **`backend/src/db/schema.ts`** passt zu beiden Migrationen: `invoicePdf` ist entfernt und `invoiceDocuments` dazugekommen (aus #238, passend zu 0005); `InvoicePart` und `invoiceParts: jsonb('invoice_parts')` auf `utilityStatementLineItems` (aus #226, passend zu 0006). Der Merge hat die Hunks nur verschoben (+10 Zeilen).
- **Kein inhaltlicher Konflikt zwischen #238 und #226:** Die Änderung des Branches gegen das neue main ist Zeile für Zeile dieselbe wie gegen die alte Basis fee5c0e9. Ausnahmen sind nur die Zeilennummern der Hunks in `schema.ts` sowie der Rename und die Dokumente aus 23cd2f35. #238 hat `calculation`, `statement`, `statement-pdf` und `pdf.service.ts` nicht angefasst. Die einzige Berührung ist `getInvoicesForStatement` (`backend/src/services/invoice.service.ts:510`), das `calculation.service.ts:16` nutzt. Es läuft jetzt über `selectWithDetails()` mit `leftJoin(invoiceDocuments)` auf deren Primärschlüssel `invoice_id`. Das ergibt höchstens eine Zeile je Rechnung, verdoppelt also keine Rechnung in der Abrechnung. `beleg` wird nicht in das Ergebnis gespreizt. `invoicePdf` nutzt im Backend-Code niemand mehr.
- **`docs/data-model.md`:** `:211` nennt `0005_invoice_documents.sql` (#217), `:312` und `:316` nennen `invoice_parts` mit Migration `0006` (#226). Das stimmt.

## Nicht bestätigt

- Backend-Tests (darunter `migrations.pg.test.ts`, das alle Dateien aus `backend/migrations` auf eine leere Datenbank anwendet), type-check, lint, check, coverage und die ganze E2E-Suite auf 23cd2f35: vom Aufrufer als laufend gemeldet, Ergebnis lag nicht vor. Ich habe sie nicht wiederholt, weil das Backend-Datenbanken schreibt und E2E einen Build braucht.
- Lokale Datenbanken, die den alten Namen `0005_line_item_invoice_parts.sql` in `schema_migrations` eingetragen haben, brechen bei `migrate()` mit «Die Datenbank stammt von Migrationen, die es nicht mehr gibt» ab (`migrate.ts:30-35`). Das trifft nur Entwicklungsdatenbanken dieses Branches; `dwello_test`, `dwello_e2e` und `dwello_persona` werden neu angelegt. Ob die eigene Entwicklungsdatenbank `dwello` des Aufrufers betroffen ist, habe ich nicht geprüft (ein `bun run db:reset` behebt es).
- Fallow- und Deepcheck-Gates auf dem Merge: nicht ausgeführt (nur über Commit- oder Push-Hooks bzw. CI).
