# Review W8c-2 (#65, Option A), Runde 2 (Abschluss): `git diff cef3720c b90e1527` und Merge e1d87781

Geprüft im Worktree `review-w8c2-code2` (detached auf e1d87781). Gelesen: der ganze Delta-Diff (4 Dateien), `git show --remerge-diff e1d87781` (beide Konfliktdateien), `git diff b90e1527 e1d87781` für `src/lib/statement-wizard.ts`, `PreviewChecks.svelte`, `StatementWizard.svelte`, `statement-wizard.test.ts`, `tests/e2e/{targets,questions}/statement-generate.ts`, dazu `statement-wizard.dom.test.ts:495-532` und `statement-generate.feature:226-231` im Merge-Stand.

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Nit | docs/archive/implementation-plan-verlauf.md:1395-1405 | Nach der Konfliktlösung steht die Session vom 2026-10-17 (W8c-2) vor der vom 2026-10-16 (W5); das Archiv ist sonst chronologisch. Reine Reihenfolge, kein Inhalt verloren. |

## Bestätigt

- **C-1 behoben:** `statement-wizard.dom.test.ts:530` prüft jetzt `document.body.textContent` gegen «Teil der Periode». Mit dem alten Code (Daten 15.01.–31.03.2024, ohne Vorjahr) hätte der Hinweis «Rechnungen nur für einen Teil der Periode» gezeigt → rot; heute enthält `messages/de.json` den Text nirgends mehr (`grep` leer) → grün. Der Anker greift auch, falls der Hinweis unter anderem Testid zurückkäme. Die Treffer «Teil der Periode» in anderen Tests (`:957`, `:1367`, `statement-generation.test.ts:92` usw.) sind Testnamen oder Kommentare zu `partlyBilled` (#251), nicht UI-Text, und betreffen den #65-Test nicht (dort kein `partlyBilled`).
- **C-2 behoben:** die doppelte Leerzeile in `implementation_plan.md` ist mit der Session weg; die Session steht vollständig und abgehakt im Archiv.
- **Merge, Konflikt DOM-Test:** beide Tests erhalten, Marker sauber aufgelöst; der Test aus main («rät bei einer leeren Vorschau mit offenen Tagen nicht, Entwürfe zu löschen») steht unverändert vor dem #65-Test, dessen Kommentar und Name wie in b90e1527. Keine Konfliktmarker mehr (`grep` leer).
- **Merge, Konflikt Archiv:** beide Sessions vollständig, Trennung durch eine Leerzeile (nur Reihenfolge, C-3).
- **Nichts aus main nutzt das Entfernte:** `grep -rn "statements_partial\|partial-invoices\|GAP_DAYS\|invoiceRows\|\.partial\b\|partial:"` über `src tests messages backend/src`:
  - `invoiceRows` wird überall mit zwei Argumenten aufgerufen (`PreviewStep.svelte:35`, `StatementStep.svelte:95,98`, Unit-Tests); main nutzt es sonst nur als Typ (`StatementWizard.svelte:49`, `CategoryCheck.svelte:16`, `PreviewChecks.svelte:20`). Main fügt der Zeile `partlyBilled` hinzu (`statement-wizard.ts:267`), nicht `partial`; die Unit-Erwartungen in `statement-wizard.test.ts:92-109` enthalten `partlyBilled`, kein `partial`.
  - `statements_partial_*` kommt in keiner `messages/*.json` mehr vor; main fügt `statements_nothing_open` u. a. hinzu, keinen der entfernten Schlüssel.
  - `partial` in `backend/src/services/invoice-completeness.service.ts:138,194` und `invoice-completeness.test.ts:92` ist ein anderes, schon auf der Basis 0f3d5d1d vorhandenes Rechnungsfeld (Leistungszeitraum über die Periode hinaus), unabhängig vom Wizard.
  - `partial-invoices` bleibt nur im E2E-Target (`targets/statement-generate.ts:50`) für die negative Prüfung des Szenarios (`steps/statement-generate.steps.ts:256`), wie in Runde 1 akzeptiert.
- **Szenario:** «Ohne Vorjahr weist die Vorschau nicht auf Monate ohne Rechnung hin» steht im Merge-Stand unverändert ohne `@wip` (`statement-generate.feature:227-231`).
- **Nichts Fremdes im Delta:** nur Testzeile, Plan/Archiv und der Bericht der Runde 1.
- **Selbst nachgelaufen auf e1d87781:** `bunx vitest run src/__tests__/statement-wizard.test.ts src/__tests__/statement-wizard.dom.test.ts` → 2 Dateien, 102 Tests bestanden.

## Ponytail-Review

Lean already. Ship. (Delta: eine Testzeile, Plan verschoben.)

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` von open-work, statements-i18n, i18n: vom Aufrufer gemeldet.
- Rotsehen des geänderten DOM-Tests auf dem alten Code: vom Aufrufer gemeldet; durch Lesen nachvollzogen (alter Hinweistext, Daten > 90 Tage Lücke), nicht ausgeführt.
- E2E `statement-generate.feature` auf e1d87781: lief laut Aufrufer parallel, Ergebnis lag nicht vor; nicht selbst gestartet (Regel). Die neuen main-Szenarien greifen weder auf `partial-invoices` noch auf `statements_partial_*` zu (gelesen in Targets/Questions/Steps).
- Ob #65 Option A trägt und kein Label `entscheiden` mehr hat: Issue nicht gelesen (wie in Runde 1); `check-issues.mjs` übernimmt CI.
