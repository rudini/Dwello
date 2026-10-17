# Code-Review W1c (#132), Runde 4: Merge e861330 (origin/main in claude/w1c-outdated-drafts-132)

Worktree: `/tmp/claude-0/-home-user-Dwello/e2b820b1-99c9-50ff-9309-d5cdef855e91/scratchpad/review-w1c-merge` (detached, e861330; Eltern ea75092 = Branch, f900e5b = main mit #68/#102/#191/#114).

Geprüft: `git show --cc e861330`, `git diff e861330^2 e861330` (alle 39 Dateien des Slice gegenüber main), `git diff ea75092 e861330` für die Slice-Dateien (was main dort geändert hat), zusätzlich die Wechselwirkung mit main ausserhalb der Konfliktstellen (`PreviewStep.svelte`, `toStatement`, `backend/src/services/statement.service.ts`, `tests/e2e/fixtures/backend.ts`, Seed in `tests/e2e/fixtures/screens.ts`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Auflösung der Konflikte

- `src/lib/server/statement-generation.ts:18-19`: `Contract` hat beide Felder (`managementFeePercent` des Branch, `oldAddress` von main). `previewStatements` setzt `oldAddress` wie auf main; `changedStatements`/`feeDifference` nutzen `managementFeePercent` wie auf dem Branch. Kein Feld ging verloren, nichts doppelt.
- `src/routes/statements/[id]/+page.server.ts`: mains `tenantAddress` mit Land (#102) bleibt; die lokale `laterInvoices` ist wie auf dem Branch durch das geteilte `changedInvoiceCount` (`src/lib/server/statement.ts:112`) ersetzt, gleiche Logik (Hinweis, 0 bei Fehler).
- `tests/e2e/questions/statement-generate.ts`, `tests/e2e/targets/statement-generate.ts`, `tests/e2e/steps/statement-generate.steps.ts`: beide Seiten additiv übernommen (`oldAddressWarning`/`oldAddress` von main, `existingStatements*` des Branch); Imports vollständig, keine Duplikate.
- `tests/e2e/fixtures/screens.ts:38`: Liste von main plus `preview-outdated`; `old-address-task`, `old-address-preview` erhalten.
- `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`: `old-address-preview` (main) und `preview-outdated` (Branch) beide da, gleiche Reihenfolge in allen drei Dateien.
- `tests/contracts/statements.json`: `managementFeePercent`, `heatingProfileId` (Branch) und `oldAddress` (main) nebeneinander.
- `docs/archive/implementation-plan-verlauf.md`: beide Sessions erhalten, die W1c-Session nach der von main.

## Wechselwirkung mit mains Änderungen

- `toStatement` setzt seit main `oldAddress`; `changedStatements` nimmt daraus nur `id`, `statementNumber`, `tenantName`, `status`, also unberührt.
- Backend-Liste `GET /statements` ergänzt bei main nur die Spalte `oldAddress`; `heatingProfileId`, `managementFeePercent`, `heatingShare`, `createdAt`, auf die sich `profileDifference`/`feeDifference` stützen, bleiben.
- `PreviewStep.svelte`: mains Warnung `preview-old-address` steht in der Zeilenliste, die Branch-Komponenten (`PreviewChecks`, `PreviewEmpty`, `ChangedStatements`) erhalten weiter `rows`/`billed` aus `invoiceRows` mit `changed`; keine Überschneidung.
- Mains neuer Seed (Ida mit Entwurf 2024 in Bergsicht) liegt im Gebäude des Zustands `old-address-preview`; dort kann jetzt zusätzlich der Hinweis auf bestehende Abrechnungen erscheinen. Das ist das gewollte Verhalten von #132 und kein Defekt; der Zustand `preview-outdated` nutzt Seeblick 2025 und ist vom neuen Seed nicht betroffen.

## Nicht bestätigt

- Vom Aufrufer gemeldet (nicht von mir wiederholt): `bun run lint`, `bun run check`, `bunx vitest run` (2823), `cd backend && bun run type-check`, E2E `statement-generate.feature` (58), axe-/Sprachzeilen `preview-outdated`, `tank-question`, `preview-all-billed`, `old-address-preview` (8).
- Von mir wiederholt: `bunx vitest run src/__tests__/statement-generation.test.ts src/__tests__/statement-wizard.dom.test.ts`: 85 bestanden.
- `backend/src/__tests__/api-contracts.pg.test.ts` gegen den zusammengeführten `statements.json`-Vertrag (Felder beider Seiten) wurde laut Meldung nicht ausgeführt und von mir nicht gestartet (schreibt die Testdatenbank); die Prüfung stützt sich auf das Lesen von `statement.service.ts` (`statementColumns` enthält alle Vertragsfelder). CI führt ihn aus.
- Die fachliche Anforderung von #132 selbst ist in Runden 1 bis 3 (`docs/reviews/w1c-review-1.md` bis `-3.md`) geprüft; diese Runde prüft nur die Merge-Auflösung. Gegenüber ea75092 ändert der Merge in den Slice-Dateien nur die oben genannten Stellen.
