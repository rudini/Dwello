# Review i837c3, Runde 1 (#837 Zyklus 3, Rechnungen)

Bereich: `git diff 294f77f6 4957f253 -- . ':!implementation_plan.md'` (Commit 4957f253), Worktree `review-i837c3-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde |

Ponytail-Review: Schlank, kann so ausgeliefert werden. (`invoiceRow` in `src/__tests__/helpers/invoice.ts` ist kein Duplikat: Unter `src/__tests__/helpers` und `tests/unit` gibt es keinen gleichwertigen Cast-Helfer.)

Geprüft: alle 11 Dateien des Diffs. `backend/src/api/invoice.ts` importiert nur Typen aus `schema.ts`. `InvoiceWithDetails` passt Feld für Feld zu `selectWithDetails()` (`invoice.service.ts:49-82`) und zur `llmCategory`-Abfrage in `getInvoice`. Der Service nimmt den Typ als Rückgabetyp (`:89`, `:161`, `:184`), `inPeriod` hat den Rückgabetyp `InPeriod`. `toInvoice` nimmt `Json<…>`, `Invoice` kommt per `Pick`/`Amounts`. Von Hand deklariert bleiben nur `billingEntity` (umbenannt) und Felder, die der Mapper zusammensetzt (`buildingName`, `category`, `categorizationStatus`, `inPeriodAmount` …), wie ADR 0005 Punkt 3 es verlangt.

Die weggefallenen Rückfälle habe ich gegen die Tabelle `invoices` (`schema.ts:299-338`) geprüft. Für eine echte Backend-Antwort ändert keiner einen angezeigten Wert:
- Diese Spalten sind `NOT NULL`, ihr Rückfall griff also nie: `billingEntityName`, `description`, `amount` (`Number("x.xx")` ist nie NaN, und für 0 liefert der Rückfall `0` gleich), `isValidUtilityCost`.
- `building` ist über einen `NOT NULL`-Fremdschlüssel verbunden. Bei `name` und `address` ergibt `??` dasselbe wie `||`.
- `billingEntity` sendet das Backend nirgends (in `backend/src` nicht vorhanden). Die drei entfernten Tests deckten also nur toten Code ab.
- `invoiceNumber` und `llmConfidence` sind jetzt `null` statt `undefined`. Alle Leser kommen mit `null` zurecht: `InvoiceFacts.svelte:34` (`{#if}`), `edit/+page.svelte:52` (`?? ''`), `:72`/`:163` (Wahrheitswert), `CategorizationPanel.svelte:75`, `OriginalSuggestion.svelte:17` (`?? 0`). Eine Prüfung auf `=== undefined` gibt es in `src/routes/invoices` und `src/lib` nicht.
- `toCategory`/`toDistributionKey` lesen nur Felder, die mitkommen, und füllen die übrigen wie bisher.

Die Ratchet-Änderung (Entity-Spiegel ohne `types.ts`) entspricht dem Diff. Reiner Umbau: Es kommen keine neuen Tests oder Szenarien dazu, also ist kein Rot nötig.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (44 Dateien, 1195 Tests), Backend-`bun test` (19 Dateien, 269 Tests), `bun run fitness` (P90 13→12, Entity-Spiegel 49→47) und die Commit-Hooks: alles vom Aufrufer gemeldet. Mein eigener Lauf von `bunx vitest run` auf `invoice-mapping`, `invoices` und `invoice-pages.dom` scheiterte schon beim Zugriff auf `node_modules`, eine Deny-Regel blockiert ihn. Nachgeprüft habe ich die Typ-Verträglichkeit nur durch Lesen.
- Ob `bun run fitness` P90 = 12 wirklich so misst, habe ich nicht nachgerechnet. Den Befehl habe ich nicht gestartet, weil er Dateien schreiben kann.
- Die Tabelle für Zyklus 3 in ADR 0005 fehlt noch. Der Plan führt sie als offenen Punkt (`implementation_plan.md:19`), sie gehört nicht zu diesem Slice.
