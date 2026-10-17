# Code-Review W1c (#132), Runde 5: Merge-Commit a6b9aee7

Geprüft im Worktree `review-w1c-merge2` (detached auf a6b9aee7): `git show --cc a6b9aee7` (alle Konfliktauflösungen), `git diff a6b9aee7^2 a6b9aee7` (was der Branch gegenüber dem neuen `main` noch hinzufügt), dazu die Stellen, an denen `main` dieselben Abläufe geändert hat: `src/lib/server/statement-generation.ts` (fixedTerm #76, `contractsOf` mit ersetzten Abrechnungen #120), `src/routes/statements/generate/+page.server.ts` (Vorlage #119), `src/routes/statements/[id]/+page.server.ts` (Dokumente #86, Berichtigung #120), `backend/src/services/statement.service.ts` (Status `replaced`, Berichtigung übernimmt Heizprofil und Satz der ersetzten Abrechnung), `tests/e2e/tasks/accessibility.ts` (`previewOf` mit `leaveSettings` #91), `tests/e2e/fixtures/screens.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/server/statement-generation.ts:191-205 | Seit `main` (#120) gibt es den Status `replaced`. `changedStatements` vergleicht auch ersetzte Abrechnungen derselben Periode mit dem Lauf: eine ersetzte Abrechnung mit anderem Heizprofil oder Satz erscheint in der Vorschau mit Hinweis und löst `sameSettingsNote` aus («wählen Sie … dasselbe Heizprofil … wie bei den bestehenden Abrechnungen»), auch wenn ihre berichtigte Abrechnung schon mit anderen Einstellungen besteht. Die Detailseite zeigt für eine ersetzte Abrechnung bewusst keinen Hinweis (`+page.svelte:70`), `contractsOf` zählt sie nicht. Kein Merge-Blocker: die Vorlage #119 auf `main` behandelt ersetzte Abrechnungen ebenso wie andere, und die direkte Berichtigung (`statement.service.ts:665`) übernimmt die Einstellungen der ersetzten Abrechnung, sodass der Rat dort stimmt. Vorschlag: `status !== 'replaced'` in `changedStatements` herausfiltern (mit Test) oder als Issue zu #120/#132 erfassen. |
| C-2 | Nit | tests/e2e/features/statement-generate.feature:47-55 | Kein Szenario zeigt die Vorschau mit einer ersetzten Abrechnung in der Periode (Zusammenspiel #120 und #132). Gehört zu C-1. |

Keine Blocker, keine Major.

## Konfliktauflösungen (bestätigt)

- `src/lib/statement-wizard.ts`: `Coverage` hat `changed?` und `fixedTerm?`, `invoiceRows` liefert `changed: c.changed ?? []` und `fixedTerm: !!c.fixedTerm`. Beide Felder kommen weiterhin aus `invoicesInPeriod` (`changed`, Zeile 297-303) bzw. aus der Mietvertragsliste (`fixedTerm`, Zeile 150). Keine Seite geht verloren.
- `src/__tests__/statement-generation.test.ts`: die Imports beider Seiten bleiben erhalten (`statement`, `contractAgreements`, `category` aus `main`; `statements`, `statementChangedInvoices`, `heatingProfiles` aus dem Branch). In der describe-Gruppe #132 verdeckt die lokale Funktion `statement` den Import `statement` aus `statement.json`. Das ist zulässig und schadet der #91-Gruppe nicht, weil diese den Import nicht nutzt; lint und check sind laut Aufrufer grün. Beide describe-Gruppen sind vollständig.
- `statement-wizard.test.ts` und `statement-generate-actions.test.ts`: die erwarteten Zeilen enthalten beide Felder. Selbst nachgeprüft: 4 Dateien, 138 Tests grün.
- `src/routes/statements/[id]/+page.server.ts` (ohne Konflikt zusammengeführt): `changedInvoiceCount` aus `$lib/server/statement` ersetzt `laterInvoices`; der Filter `documents.filter(type === 'reminder')` aus `main` bleibt erhalten.
- `tests/e2e/features/statement-generate.feature`: der Block #132 (8 Szenarien) steht vor dem #119-Szenario von `main`. Beide sind vollständig, kein `@wip`.
- `tests/e2e/questions` und `targets`: die Exporte beider Seiten sind vorhanden, keine Duplikate.
- `tests/e2e/tasks/accessibility.ts`: `preview-outdated` nutzt `previewOf`, das auf `main` jetzt `leaveSettings` enthält (#91). Der Zustand `generation-result` von `main` ist unverändert.
- `tests/e2e/fixtures/screens.ts`: die Liste von `main` (mit `generation-result` und dem Rückgabefeld `heatingProfile`) ist um `preview-outdated` ergänzt. Die Seed-Daten für den Zustand (Lift-Rechnung vom 30.06.2025 nach den Entwürfen 2025) gibt es weiterhin (Zeile 64, 88).
- `tests/a11y/screens.json`: die `stateMeanings` beider Seiten sind vorhanden, `preview-outdated` steht in der Liste von `statement-generate`. `accessibility.feature` und `sprachen-bildschirme.feature` haben die Zeile.
- `docs/archive/implementation-plan-verlauf.md`: beide Sessions sind erhalten. `git grep` findet im Commit keine Konfliktmarker.
- Der Diff gegenüber `main` (`a6b9aee7^2..a6b9aee7`) enthält nur W1c-Inhalte: Texte in allen vier `messages/*.json`, `heating-profiles.json` mit einem Contract-Test in `api-contracts.pg.test.ts`, die Felder in `statements.json`. Durch den Merge kommt nichts Fremdes hinzu.

## Nicht bestätigt

- lint, `bun run check`, Backend-type-check: vom Aufrufer gemeldet.
- `bunx vitest run` komplett (2968 grün, 1 rot in `tools/claude-hooks/fallow-gate.test.ts`, einzeln grün): vom Aufrufer gemeldet. Selbst erneut ausgeführt habe ich nur `statement-generation`, `statement-wizard`, `statement-generate-actions` und `statement-wizard.dom` (138 grün).
- E2E `statement-generate.feature` (68 grün), die axe- und Sprachzeilen `preview-outdated`, `tank-question`, `preview-all-billed`, `generation-result` (8 grün) und `api-contracts.pg.test.ts` (39 grün): vom Aufrufer gemeldet, nicht selbst ausgeführt (E2E und Backend nicht erlaubt bzw. nicht gestartet).
- C-1 habe ich nur durch Lesen festgestellt (`listStatements` filtert nicht nach Status, `changedStatements` auch nicht). Es gibt keinen Test, der es zeigt.
