# Review 424-4 (Abschlussrunde vor dem Push)

Geprüft: Delta 5a53dc38..f59fac44 im Worktree `review-424-code4` (detached f59fac44): 9c6bfe60 (Review 424-3), 89ae0096 (Session archiviert), Merge f59fac44 von `origin/main` (93956d82).

Offene IDs aus 424-1 bis 424-3: keine Blocker/Major offen; C-1, C-6, C-7, C-9, C-11 (Minor/Nit) bleiben unverändert in ihren Berichten, der Merge berührt sie nicht.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

## Geprüft

- **Konfliktauflösung `tests/e2e/questions/language.ts`** (`git show --remerge-diff f59fac44`): Die Auflösung übernimmt die Liste `sameEverywhere` von main unverändert (mit «Mieterinnen- und Mieterverband», «Zulässige und unzulässige Nebenkosten», #292) und das `scenarioRecord` des Branches (12 Hex-Ziffern, optional mit UUID-Präfix, `\b` am Ende). Keine Zeile ging verloren, und nichts kam hinzu. Gegenprobe des Regex mit node: «Eigene Kategorie 0a1b2c3d4e5f», «Elektro <UUID>.pdf» und «Elektro <UUID> unlesbar.pdf» werden maskiert, die umgebenden Wörter bleiben stehen.
- **Abhängigkeit von voller UUID in dem, was main brachte:** `git diff 89ae0096 f59fac44 -- tests/e2e src/__tests__` durchsucht. Main ändert in `tests/e2e/fixtures/backend.ts` nur `flatRateUtilityCharge`, `invoiceWithoutKey` und `supplierInvoice`. Letzteres sucht über `ids.has(categoryName)`, also über den Gherkin-Titel und nicht über den generierten Namen. `unique()` (Zeile 15–20) ist nach dem Merge die Branch-Fassung. `tasks/accessibility.ts` von main (`toRentStep`, `flat-rate-warning`) benutzt keine Namensform. Die übrigen UUID- oder Hex-Muster im Baum betreffen keine Namen, sondern Record-IDs und Rechnungsnummern: `targets/building-detail.ts:24` (`fuel-stock-<id>`), `targets/statements.ts:10` und `questions/statements.ts:25` (`NK-…`). In `src/__tests__` liest kein Test E2E-Namen. Nichts bricht mit dem 12-Hex-Suffix.
- **Automatisch gemergte Dateien, die beide Seiten änderten:** `CostTable.svelte` behält `min-w-0 break-words` (Zeile 183), main änderte dort nur einen TODO-Kommentar. `DocumentItem.svelte` behält `download` (Zeile 64), main entfernte nur den TODO zu #277.
- **Doku-Commits:** Die Session ist vollständig abgehakt und archiviert, `implementation_plan.md` ist leer bis auf den Kopf. `docs/reviews/workflow-notes-issue-424.md` enthält drei Notizen, keine davon ändert Regeln im Diff.

## Nicht bestätigt

- `bun run lint`, `bun run check`, backend `type-check` und `bunx vitest run` von open-work, e2e-screenplay-lint, statement-wizard.dom, ui-button.dom, documents.dom und tenant-detail-page.dom (171 grün) auf f59fac44: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Nach dem Merge lief kein E2E. Die neuen Szenarien von main (contract-new/-edit Nebenkostenpauschale, categories, invoice-detail, statement-generate/-detail, `flat-rate-warning` in accessibility/sprachen-bildschirme) liefen nie in Firefox oder WebKit zusammen mit diesem Branch. Der Archiveintrag «Final shard run … 2706 of 2707» gilt für den Stand vor dem Merge. Durch Lesen bestätigt ist nur, dass sie nicht von der Namensform abhängen. CI des PR läuft nur Chromium und api.
