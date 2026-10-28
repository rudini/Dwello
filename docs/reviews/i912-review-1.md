# Review #912, Runde 1 (Schlussrunde vor dem Push), f34dde55

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|

Keine Befunde.

Geprüft: alle 15 geänderten Dateien gegen #912 «Done means»: `periodQuery`/`periodOf` in `src/lib/accounting-period.ts` an einer Stelle; `AgreedCosts`, `BuildingStep`, `FeeNotAgreed`, `overview.ts`, `generate/+page.server.ts` und die BFF-Routen `agreements`/`billed` nutzen sie; Schlüsselreihenfolge der `URLSearchParams` unverändert (hrefs in `overview.test.ts`, `statement-endpoints.test.ts:322`, `statement-wizard.dom.test.ts:1795` lesen die gleichen Strings); `PreviewChecks`/`PreviewStep` nehmen den Typ aus `WizardSelection`; BFF importierte `$lib/accounting-period` schon vorher (`statement-generation.ts`), keine neue Schichtkante; neuer Test bricht ohne die Helfer (Import fehlt), Titel sagen, was geprüft wird; Commit nennt die gepinnten Tests; das Belassen von `formData.get('periodStart')` in `generationRequest` ist richtig (`periodOf` würde `'null'` zu `''` ändern); Doku, Ratchet und Historie zeigen dieselben Werte (1 / 6 / 14, `periodEnd` 18 → 12). Ponytail-Review: Lean already. Ship. Keine UI-Texte, keine Verträge, keine E2E-Dateien geändert; keine fachfremden Änderungen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run` (3737), E2E statement-generate / statement-agreed-costs / dashboard (180), Prettier, testcheck audit: vom Aufrufer gemeldet. Das erneute Ausführen von `bunx vitest run` im Worktree war nicht möglich (Zugriff auf `node_modules` durch eine Deny-Regel gesperrt).
- `bun run fitness` (1 / 6 / 14) und `tools/arch-baseline/run.sh` (`periodEnd` 18 → 12, `periodStart` 17 → 11; am stärksten gestreut jetzt `rentalContracts.startDate` 14): vom Aufrufer gemeldet, nicht neu ausgeführt (beide schreiben Dateien); nur geprüft, dass Ratchet, `fitness-functions.md`, `baseline.md` und `utility-tree.md` dieselben Werte nennen.
- Die Route `api/statements/agreements` hat keinen eigenen Unit-Test, der die Query liest (gesucht in `src/__tests__`); abgedeckt laut Aufrufer durch E2E statement-agreed-costs.
