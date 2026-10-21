# Code-Review #454, Runde 3 (Schlussrunde vor dem Push)

Worktree: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/review-454-code` (6bd12287, detached). Geprüft wurden das Delta `git diff a96fc0a0 469b5981` (f5feabf8, 469b5981) und die Konfliktlösung `git show --remerge-diff 6bd12287`, jeweils ohne docs/reviews, docs/design/personas, implementation_plan.md und docs/archive. Vorbericht: `docs/reviews/454-review-2.md`.

## Status der offenen IDs aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| C-7 (Minor) | teilweise behoben | Im Fliesstext von api-specification.md:246 stehen jetzt `overdue`, «due by the change alone» und `correctionLowers`, bei `decline-correction` (Zeile 248) steht `STATEMENT_CORRECTION_NOT_RECALCULABLE`. Die Antwortform am Zeilenanfang `→ { invoiceIds, fuelStockChanged, correctionDue, correctionDeclinable }` nennt `correctionLowers` aber weiterhin nicht. Rest bleibt Minor. |
| C-8 (Major) | behoben | Das Szenario «Versendete Abrechnung mit danach gelöschter Rechnung berichtigen» (statement-detail.feature:750–759) hat kein `@wip`. Es prüft den Satz `statements_later_lowers`, das Fehlen von «Nicht berichtigen» (nach der positiven Prüfung auf derselben Seite) und den Knopf im Hinweis bis zur Bestätigung. Ohne LaterChanges.svelte:55–60 scheitert es, weil der Satz und `statement-later-correct-button` fehlen. Die Schritte rufen nur Tasks, Questions und `seed` auf. `deleteInvoice` nutzt den Schlüssel `Rechnung <Kategorie> <Datum>` aus `invoiceOn` (backend.ts:453). |
| C-9 (Minor) | behoben | Der Bildschirm `statement-lowered-detail` steht in screens.json, accessibility.feature und sprachen-bildschirme.feature, der Seed «Olga/Ried» steht in `correctionStates`. Seit dem Merge hat er wegen tests/unit/a11y-screens.test.ts:26 nur den Zustand `default` (siehe «Nicht bestätigt»). |
| C-10 (Minor) | behoben | Die Commit-Nachricht von f5feabf8 nennt beide DOM-Tests als Pins von bestehendem Verhalten. Auf 5dde9bb9 gibt es den Knopf nicht, und der Ton ist dort immer `caution`. Beides ist kein Bugfix. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | Minor | backend/src/services/statement-invoices.service.ts:74, 96; backend/src/__tests__/statement-invoices.pg.test.ts:445–446 | Seit V-30 A gilt `raises: after >= before` «wie eingefordert» (statement.service.ts:602–604). Drei Texte sagen trotzdem noch das Gegenteil: der Kommentar «whether he may: only when it would raise the Saldo», der Kommentar «refused unless the recalculation raises the Saldo» und der Testname «erlaubt «Nicht berichtigen» nur, wenn die Neuberechnung den Saldo erhöht» samt Kommentar «only when the Saldo would rise». Ein gleichbleibender Saldo ist jetzt auch ablehnbar. |
| C-12 | Minor | backend/src/services/statement.service.ts:602 | Die Ausnahme «but in a Schlussabrechnung» (`!statement.final &&`) hat keinen Test. Der neue pg-Test nimmt bewusst einen Vertrag ohne Ende (nicht final). Die übrigen Tests von «Abrechnung berichtigen fällig» nutzen den finalen Vertrag bis 31.03.2024, aber nie mit Saldi unter CHF 5. Lässt man `!statement.final &&` weg, bleiben alle Tests grün. Eine Schlussabrechnung mit 4.00 → 3.00 müsste `correctionDeclinable: false` und `correctionLowers: true` liefern. |

Keine Blocker, keine Major.

## Geprüft und in Ordnung

- **V-30 A** (statement.service.ts:596–605): `claimed` setzt einen Saldo unter CHF 5 auf 0, ausser bei einer Schlussabrechnung. Dieselbe Regel gilt bei `belowMinimum` in `markSent` (Zeile 756) und im Reminder-Service. `raises` und `lowers` schliessen sich jetzt aus und ergänzen sich. Damit ist «Nicht berichtigen» auch bei gleichem Saldo und nur geändertem Anteil möglich, wie entschieden. `correctionDue` vergleicht weiter die rohen Werte. Der neue pg-Test (4.00 → 3.00) scheitert ohne den Fix, weil `3 > 4` falsch ist. Auf dem geprüften Commit ist er grün.
- **V-33**: de.json:284 hat den entschiedenen Wortlaut. fr, it und en hatten die Satzform schon, eine Änderung war dort nicht nötig. overview.test.ts und dashboard.feature:126 folgen dem neuen Text.
- **D-1** (invoices/+page.server.ts:24–28): Mit gültiger Periode gibt es kein `dateFrom`/`dateTo` mehr. Der Test in invoices.test.ts scheitert ohne das `else`. Ein Szenario fehlt, ist aber nicht nötig: Kein Link der App verbindet Periode und Jahr. overview.ts:126 setzt nur building und Periode, und `InvoiceSearch` baut die Adresse ohne `periodStart` neu (InvoiceSearch.svelte:31–43). Die Kombination entsteht also nur in einer von Hand geschriebenen Adresse.
- **Migration** 0029 → 0031: Die Datei ist nur umbenannt. Es gibt kein Drizzle-Journal. Der pg-Lauf setzt 31 Migrationen auf.
- **Konfliktlösung des Merge:**
  - invoice.service.ts: `getUncategorizedInvoices` aus main ist übernommen und nutzt das unveränderte `getInvoicesForStatement`.
  - statement.service.ts: `recalculateStatement` hat `refuseUncategorized` aus main und `recalculated()` aus dem Branch. `recalculated()` rechnet den Saldo genau wie main (`totalCosts + carryOver`, `totalAdvancePayments + priorPayments`).
  - statement-generation.ts: In `notes` stehen nur Boolesche Werte oder `null`/Objekt (`outdated`, `fuelStock`, `profile`, `profileEdited`, `fee`, `oldRule`). `Object.values(notes).some(Boolean)` entspricht also der früheren Oder-Kette plus `oldRule`. `HintedInvoice` wird genutzt (Zeile 399).
  - statement-wizard.ts: `changedNotes` nimmt `fuelStock`, `oldRule` und `tenantName` auf.
  - +page.server.ts und +page.svelte: Es gibt `delivery` und `later`. `laterInvoices` kommt in `src` nicht mehr vor.
  - MetadataCard.svelte: Beide Props sind da.
  - questions/statement-detail.ts: Alle drei Questions sind da.
  - invoices.test.ts: Beide Imports sind da.
  - a11y: Die drei neuen Bildschirme haben `default` als ersten Zustand, wie tests/unit/a11y-screens.test.ts:26 verlangt. Die entfernten `stateMeanings` und die Wait-Funktionen sind nirgends mehr referenziert.
- **E2E-Schichten**: `openCorrectionFromHint` folgt dem Muster von `openCorrectConfirmation`. Die nächste Prüfung (`correctConfirmation`) wartet auf den Dialog. Der Target-Testid ist kebab-case.
- **Ponytail-Review (Delta und Merge)**: Es bleibt kein ungenutzter Code und keine Kopie eines bestehenden Helfers zurück. `claimed` nutzt das vorhandene `belowMinimum`, `deleteInvoice` das vorhandene `remove`. Die Konfliktlösung in `changedStatements` ist kürzer als beide Seiten.

## Nicht bestätigt

- Selbst gelaufen auf 6bd12287:
  - `bun test src/__tests__/statement-invoices.pg.test.ts` (TEST_DATABASE_URL `dwello_test_r454f`): 42 grün.
  - `bunx vitest run` mit invoices.test.ts, overview.test.ts, tests/unit/a11y-screens.test.ts, tests/unit/i18n-screens.test.ts und statement-pages.dom.test.ts: 246 grün.
- Vom Aufrufer gemeldet, nicht wiederholt: lint, check, `cd backend && bun run type-check`, fallow audit, alle 1234 Backend-Tests (Coverage 94.5 %), alle 3503 vitest-Tests.
- E2E: Vom Aufrufer als grün gemeldet sind statement-detail, dashboard, invoices, accessibility und sprachen-bildschirme auf f5feabf8. Der Lauf auf 6bd12287 lief noch. Ich habe E2E gemäss Auftrag nicht gestartet.
- Seit dem Merge prüfen die Zeilen `statement-unaffected-detail`, `statement-declined-detail` und `statement-lowered-detail` nur noch `default`, also `async () => {}` (tasks/accessibility.ts:185). Vorher stellte `Wait.until(on.shown(…))` sicher, dass der Hinweis wirklich erscheint. Ob der Seed «Olga/Ried» den Satz `statements_later_lowers` zeigt, und damit, ob axe und der Sprachlauf ihn tatsächlich sehen, belegt auf 6bd12287 nur der noch laufende E2E-Lauf. Gelesen habe ich tests/e2e/fixtures/screens.ts:25–51 und tests/unit/a11y-screens.test.ts:20–27. Der Hinweis kommt serverseitig (`later` in +page.server.ts), er ist also beim Laden schon da.
- Ob das zusätzliche Gebäude «Ried» im gemeinsamen Bildschirm-Seed andere Zustände ändert (Übersicht mit einer weiteren Berichtigungs-Aufgabe, Listen), belegt nur der gemeldete grüne Lauf auf f5feabf8.
