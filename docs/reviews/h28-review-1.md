# H-28 Code-Review, Runde 1

Geprüft: `git diff d4d508cc2 596539d1c` (Commit 596539d1c) im Worktree `review-h28-code-reviewer`; alle 28 geänderten Dateien gelesen, dazu `listContracts`/`getContract` (`contract.service.ts`), `listStatements`/`statementFilterConditions` (`statement.service.ts`), `getTypedConfig` (`config.service.ts`), `today.ts`, `real-date.ts`, `app.ts` (Auth), `api/statements/billed/+server.ts`, `BuildingStep.svelte`, `FeeNotAgreed.svelte` und die alten Fassungen von `src/lib/accounting-period.ts`, `contract-status.ts`, `statement-generation.ts`, `missing-statements.ts`, `contracts/[id]/+page.server.ts`, `statements/generate/+page.server.ts` und ihren Tests.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `src/routes/statements/generate/+page.server.ts:53-54`; `implementation_plan.md` (ungeändert) | Die einzige gewollte Verhaltensänderung (Fehlerseite, wenn das Backend die Vorgaben nicht liefert) hat weder ein Szenario noch ein festgehaltenes `No scenario: <Grund>`, weder im Commit noch im Plan. |
| C-2 | Minor | `backend/src/services/statement-run.service.ts:149-153` | `isDay` ist eine Kopie von `isRealDate` aus `backend/src/services/real-date.ts:2-3` (gleiche Regex-plus-ISO-Prüfung; nur `undefined` muss der Aufrufer vorher abfangen). |
| C-3 | Minor | `backend/src/routes/contracts.ts:123` | Der Kommentar `// Get single contract` steht jetzt über `/missing-statements` und `/:id/missing-statements` statt über `.get('/:id', …)` (Z. 132). Er sagt damit etwas Falsches. |
| C-4 | Minor | `src/__tests__/dashboard.test.ts:73-85, 336-396` | Die Übersicht-Tests bauen die Antwort von `GET /contracts/missing-statements` selbst (`{ k1: [lastPeriod] }`) und nehmen sie nicht aus `tests/contracts/contracts-missing-statements.json`. Gotcha „API contracts“ verlangt das aber (in `contract-actions.test.ts:201-204` ist es richtig gemacht: `ofFirst(contractsMissing.c1)`). |
| C-5 | Minor | `backend/src/routes/contracts.ts:127-131` | Die 404-Antwort von `GET /contracts/:id/missing-statements` für einen unbekannten Mietvertrag prüft kein Test. `statement-run.pg.test.ts` deckt nur den 200er-Fall ab, `docs/api-specification.md` nennt aber die 404. |

## C-1 (Major): keine Szenario-Begründung für die Fehlerseite des Assistenten

**Warum falsch.** Die Anforderung ändert genau ein Verhalten: Liefert `GET /statements/run-defaults` keine Vorgaben, zeigt `/statements/generate` jetzt die allgemeine Fehlerseite (`throw error(response.status, m.error_unexpected())`). Auf d4d508cc2 startete der Assistent stattdessen mit den Vorgaben aus den Einstellungen, oder mit `calendar`/3 %, wenn `config` nicht lud. Nach `CLAUDE.md` (Workflow 1, „Done means“) braucht so eine Änderung ein Szenario ohne `@wip` oder ein `No scenario: <Grund>` im Plan und im Pull Request (`tests/e2e/CLAUDE.md`, „No scenario“).

Ein Szenario ist hier tatsächlich nicht möglich. Die Anfrage geht vom BFF-`load` an das Backend und nicht vom Browser aus, also erreicht `FailRequests` an der Browsergrenze sie nicht. Über die URL lässt sich auch keine 4xx-Antwort erzwingen: Der BFF schickt nur IDs aus der Gebäudeliste, und unmögliche Tage übergeht das Backend. Die Begründung fehlt aber überall:
- `git show -s 596539d1c` nennt die Änderung, aber kein `No scenario`;
- `grep -n "H-28" implementation_plan.md` findet nichts.

Belegt ist die Änderung nur durch den Load-Test `statement-generate-actions.test.ts:193-197` («meldet einen Fehler, wenn das Backend die Vorgaben nicht liefert»).

**Wie zeigen.** `grep -rn "No scenario" implementation_plan.md` bringt keinen Eintrag zu H-28, und `git diff d4d508cc2 596539d1c -- tests/e2e/features` ist leer. **Behebung:** einen Plan-Eintrag ergänzen und den Grund auch im Pull Request nennen, etwa: „No scenario: die Vorgaben lädt der Server, `FailRequests` erreicht die Anfrage nicht; der Load-Test zeigt es“.

## Nicht bestätigt

- E2E (chromium + api): lief laut Aufrufer noch, ist nicht Teil dieser Runde. Ich habe ihn nicht gestartet. Damit ist nicht bestätigt, dass die Szenarien zu fehlenden Abrechnungen (`contract-detail`, Übersicht, Mietvertragsliste) und zum Assistenten (Schritt 2, Überschneidung, Links von der Mietvertragsseite) unverändert grün sind.
- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx fallow audit`, alle FE-Unit-Tests, `cd backend && bun run test` (1 Fehlschlag in `heating-distribution.pg.test.ts`, laut Aufrufer auch auf der Basis) und der Coverage-Check: vom Aufrufer gemeldet. Selbst wiederholt habe ich nur `bunx vitest run` auf den sechs geänderten FE-Testdateien (155 grün) und `bun test` auf `statement-run.test.ts` und `accounting-period.test.ts` (53 grün). `statement-run.pg.test.ts` und `api-contracts.pg.test.ts` habe ich nicht laufen lassen.
- Die „Architektur-Baseline“ mit den gekoppelten Paaren #5/#16/#18 gibt es im Repo nicht (`grep -rli "coupled pair\|gekoppelte" docs` findet nichts). Den Zuschnitt (ohne #16) habe ich nur an der Anforderung des Aufrufers geprüft: Die Heizungshinweise in `statement-generation.ts:300-311` behalten `billsIn`/`billingStart` im BFF, das passt.
- Ob jeder Test, den der Commit als „rot gesehen“ nennt, auf d4d508cc2 wirklich rot ist: Für die neuen Routen und die Fehlerseite ist das beim Lesen klar, weil es Routen und `error()` vorher nicht gab. Für die übrigen portierten Regeltests habe ich nur geprüft, dass die Basis dasselbe Verhalten zeigt, wie der Commit sagt.

Geprüft: Die portierten Regeln verhalten sich wie auf d4d508cc2. Das gilt für `lastCompletedPeriod`, `endedPeriodsSince` (auch am 29.02.), `uncovered`, `missingPeriods`, `missingWays`, `billsIn`, `overlapOf`/`planRun` (`replacedHere`, `billed`, `skipped`, Reihenfolge von `rest`) und `runDefaults` samt `apartmentProfile`. Die Datumsfelder sind Drizzle-`date` im String-Modus, deshalb fällt `.slice(0, 10)` folgenlos weg. `today` ist jetzt überall `swissToday` statt der lokalen Serverzeit; das ist höchstens ein bis zwei Stunden um Mitternacht anders, und `overlapOf` nutzte schon vorher `localToday`. Der Periodenfilter `gte`/`lte` aus `listStatements` entspricht dem neuen `others`-Filter. Die Konfig-Defaults (`calendar`, 3, `null`) sind dieselben. Weiter geprüft: Auth über `authMiddleware` für beide Routengruppen; die vier API-Verträge samt Prüfung in `api-contracts.pg.test.ts` und Doku in `docs/api-specification.md`; keine neuen UI-Texte; keine neuen Bildschirme (die Fehlerseite ist schon `server-error`); die BFF-Mapper übernehmen alle Felder wie vorher; die Objektidentität bei `billed.includes(c)` bleibt erhalten.
