# Review #74 (F-14c), Commit 95b546f (Basis b0c8cef)

Worktree: `/tmp/claude-0/-home-user-Dwello/fb96b225-d7d3-5f60-a70e-544f6e089c40/scratchpad/review-74-code`
Gelesen: `backend/src/__tests__/fuel-stock.pg.test.ts` (ganz), `implementation_plan.md` (Diff), dazu `fuel-stock.service.ts`, `invoice.service.ts` (applyCategory, categorizeWithKi, createInvoice, updateInvoice, recategorizeInvoiceById, getInvoicesForStatement), `category.service.ts` (updateCategory), `llm.service.ts` (categorizeInvoice), `routes/invoices.ts`, `db/migrate.ts`, `migrations/0002_stammdaten.sql`, `demo/demo-data.sql`, `allocable-categories.pg.test.ts`, Issue #74 (über die GitHub-API).

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | implementation_plan.md:8 | Die Herkunft stimmt nicht: Die Prüfung in `applyCategory` und die Kaskade in `updateCategory` kamen mit PR #25 (Commits 8ae5beab, 58c3ce4a, 6b4af813, gemergt am 2026-10-08), also **vor** #74 (erstellt am 2026-10-12). PR #190 ändert weder `invoice.service.ts` noch `category.service.ts` (Dateiliste über die GitHub-API). `git log -S` im flachen Klon zeigt nur deshalb ff8cd79, weil dort die Historie abgeschnitten ist. Die Folgerung (Option A unerreichbar) gilt trotzdem, sogar stärker: Die Ursache im Issue stimmte schon beim Erfassen nicht mehr. Plan und PR-Text auf «seit #25 (2026-10-08)» korrigieren. |
| C-2 | Minor | backend/src/__tests__/fuel-stock.pg.test.ts:177 | Der Status des `POST /api/v1/invoices` wird nicht geprüft. Lehnt die Route die Rechnung später ab (z.B. ein neues Pflichtfeld), bleibt `toEqual([])` leer grün, und der Test schützt nichts mehr. Ein `expect((await sendJson('POST', …)).status).toBe(200)` behebt das (die Route setzt kein 201). Beim PUT ist das unkritisch: Schlägt er fehl, bleibt die Kategorie umlagefähig, und der Test wird rot (Verbrauch 600). |
| C-3 | Nit | backend/src/__tests__/fuel-stock.pg.test.ts:171-192 | ponytail-review, `delete:`: Der Test findet keinen Fehler, den die bestehenden Tests nicht schon finden. Ohne die Prüfung in `applyCategory` wird `allocable-categories.pg.test.ts` «rechnet genau die Rechnungen der umlagefähigen Kategorien ab» rot; ohne `if (!category.isAllowedUtilityCost) return []` wird der Holz-Test (Zeile 156) rot. Als Nachweis für genau den Fall aus #74 vertretbar (Smoke-Minimum). Sonst: net: -23 Zeilen möglich. |
| C-4 | Nit | implementation_plan.md:5 | Doppelte Leerzeile vor `## Session` (die einzige Formatierungsänderung im Diff). |

Keine Blocker und keine Majors.

## Prüfung der Anforderung

1. **Kein verbleibender Pfad (Option A unerreichbar): bestätigt durch Lesen des Codes.**
   - Schreibzugriffe auf `invoices` gibt es nur in `invoice.service.ts` (insert in `createInvoice`, update in `updateInvoice` und `recategorizeInvoiceById`) und in `category.service.ts:187`. Keine Route, kein BFF und kein Skript schreibt direkt.
   - `createInvoice`: `applyCategory` setzt bei nicht umlagefähiger Kategorie `isValidUtilityCost = false`. Ohne Kategorie übernimmt `categorizeWithKi` bei einem sicheren Vorschlag `categorization.isAllowedUtilityCost`. Das ist laut `llm.service.ts:162/194` das Kennzeichen der Kategorie, sobald eine Kategorie gefunden wurde; ohne gefundene Kategorie wird keine gesetzt.
   - `updateInvoice`: `applyCategory` mit neuer oder bestehender Kategorie. Damit ist auch «nur das Häkchen ändern» abgedeckt (Test in `invoice-categorization.pg.test.ts:299`).
   - `recategorizeInvoiceById`: Bei einer sicheren, nicht umlagefähigen Kategorie wird die Rechnung auf `false` gesetzt.
   - `updateCategory`: Wird eine Kategorie nicht umlagefähig, setzt die Kaskade ihre Rechnungen in derselben Transaktion zurück. `createCategory` hat noch keine Rechnungen.
   - Demo-Daten (`backend/demo/demo-data.sql`): Rechnungen nicht umlagefähiger Kategorien gibt es nur bei «Reparaturen», mit `false`. Der Tank liegt auf «Heating» (umlagefähig). `backend/src/db/demo-data.ts` schreibt keine Rechnungen.
   - Altdaten: `db/migrate.ts` verweigert Datenbanken mit Migrationen vor der neuen Basis (Oktober 2026), sie werden neu aufgesetzt. Die frühere Datenkorrektur `0011_non_allocable_invoices.sql` (6b4af813) ist deshalb nicht mehr nötig. Es gibt keinen Import-Pfad.
   - Ein Zweig für Option A in `fuelStockChange` (dort wird nach `isValidUtilityCost = true` gefiltert) wäre also toter Code. Dem Code zu folgen, entspricht CLAUDE.md, «Coding guidelines».
2. **Test:** Er stellt genau den Fall aus #74 nach (eigene Heizkategorie mit Ständen, über die API nicht umlagefähig gemacht, Ölrechnung mit `isValidUtilityCost: true` erfasst) und erwartet keine Abrechnungszeile. Ohne die Prüfung in `applyCategory` liefert `getInvoicesForStatement` (filtert nur auf `isValidUtilityCost`) den Einkauf von CHF 2000, und `fuelStockChange` liefert nichts: rot, wie der Aufrufer schreibt. Das ist durch Lesen nachvollzogen. Das Aufräumen (zuerst die Rechnungen, dann `oil.remove()`, dann die Kategorie) entspricht dem Holz-Test in derselben Datei; dort gibt es ebenfalls kein try/finally. Einschränkungen: C-2, C-3.
3. **ponytail-review:** Siehe C-3, sonst schlank. Es gibt keinen Produktionscode, keine Texte und keine Verträge, also nichts in `messages/*.json`, `tests/contracts`, a11y-Listen oder Features.
4. **Kein Szenario:** Das Verhalten ändert sich nicht, und der Zustand ist über UI und API nicht erreichbar. «No scenario: …» steht im Plan, ist gerechtfertigt und muss auch im PR-Text stehen.
5. **Nichts Fremdes im Diff:** bestätigt, abgesehen von der Leerzeile (C-4).

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check` und `cd backend && bun test src/__tests__/fuel-stock.pg.test.ts` (19 pass): vom Aufrufer gemeldet, nicht erneut ausgeführt (laut Auftrag keine Backend-Tests parallel).
- Das Rot ohne die Prüfung in `applyCategory`: vom Aufrufer gemeldet; nur durch Lesen von `getInvoicesForStatement` und `fuelStockChange` nachvollzogen.
- Selbst ausgeführt: `bunx vitest run src/__tests__/open-work.test.ts` (liest `implementation_plan.md`): 5/5 grün.
- Der PR-Text (`Fixes #74`, Begründung, `No scenario`) liegt noch nicht vor. Er muss C-1 korrigiert übernehmen.
