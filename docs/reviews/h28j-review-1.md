# Code-Review H-28 (#717) Schritt 3, Runde 1

Bereich: `git diff 868aef918 c0536fd86` (ein Commit `c0536fd86`), Worktree `review-h28j-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/tenant.service.ts:138-142 | Die Regel «der laufende, zuletzt begonnene» hat keinen Test: Im Backend-Test (`contract.routes.pg.test.ts:69-85`) hat jeder Mieter höchstens einen laufenden Vertrag. Streicht man den zweiten `orderBy`-Schlüssel (`desc(case …)`), bleiben alle Tests grün. Ausserdem fehlt ein Tiebreak: Der BFF wählte bei gleichem Vertragsbeginn nach `desc(id)` (Listenreihenfolge, `contract.service.ts:159`), jetzt entscheidet Postgres beliebig. Das trifft zum Beispiel Wohnung und Einstellplatz ab demselben Tag. |
| C-2 | Minor | backend/src/services/contract.service.ts:406; src/routes/contracts/ContractForm.svelte:213, 252 | `CONTRACT_DRAFT_NOT_AFFECTED` trifft auch «Entwurf löschen und speichern» im Bearbeiten-Formular (`put(next, draft.id)`), nicht nur «Mietvertrag beenden». Beispiel: Ein veraltetes Fenster nennt einen Entwurf, der inzwischen anderswo gelöscht wurde. Früher hat das Backend den Entwurf übergangen und gespeichert. Jetzt zeigt das Formular «Der Mietvertrag wurde nicht gespeichert» mit «Mietvertrag konnte nicht beendet werden.», auch wenn die Änderung nichts beendet (etwa ein neuer Vertragsbeginn). Der Text ist dort falsch und sagt nicht, was zu tun ist. |
| C-3 | Minor | src/__tests__/apartment.test.ts:114-155 | `GET /apartments/:id` hat das neue Feld `nextContractId`. Der BFF-Test liest die Antwort aber weiter aus einem Inline-Objekt statt aus `tests/contracts/` (CLAUDE.md, Gotchas: «add a contract when there is none»). Der Backend-Test prüft das Feld direkt. Eine Umbenennung fiele trotzdem nur dort auf, nicht im Vertrags-Abgleich. |
| C-4 | Minor | backend/src/services/statement-run.service.ts:90, 102 | Der Tankbestand-Zweig von `run-differences` (`fuelStockChanged` im Filter und `fuelStock: true`) hat keinen Backend-Test; `statement-run.pg.test.ts:170-185` deckt nur Rechnungen ab. Streicht man `\|\| changes.fuelStockChanged`, bleiben alle Tests grün; der BFF-Test bekommt den Wert nur aus dem Fixture. |

Keine Blocker und keine Major.

## Antworten auf die Prüfpunkte des Aufrufers

- **SQL gegen die alten BFF-Regeln.** `status` in `contract.service.ts:55` entspricht `contractStatusOn`: Beginn > heute ergibt `future`, Ende < heute `ended`. Ein Vertrag, der heute endet oder heute beginnt, ist `active`; ohne Ende ist er `active`. `rentalContractId` filtert beendete Verträge aus (`end_date >= heute`) und stellt laufende vor künftige. Laufende kommen nach Beginn absteigend, künftige nach Beginn aufsteigend, wie zuvor. Offen ist nur der Gleichstand bei gleichem Beginn (C-1). `isFuture` (nicht aktiv, aber ein späterer Vertrag) passt in jedem Fall zum gewählten Vertrag. `nextContractId` (Beginn > heute, aufsteigend) entspricht dem alten `.at(-1)` der absteigenden Liste. Gleicher Beginn bei zwei künftigen Verträgen einer Wohnung schliesst die Überlappungsprüfung aus.
- **`statementChanges` in `runDifferencesOf`.**
  - Kosten: pro Entwurf `getStatement`, `changedInvoices` und `fuelStockChanged`. Das sind dieselben Abfragen wie zuvor über `/changed-invoices`, jetzt ohne den HTTP-Weg. `recalculation` läuft für Entwürfe nicht (`CORRECTED` enthält `draft` nicht).
  - Korrektheit: Das Backend nimmt nur Abrechnungen, deren Periode in der Lauf-Periode liegt (`gte`/`lte`, `statement.service.ts:151-152`). Der BFF hat früher jede überlappende Abrechnung geprüft (`statement-generation.ts:282`). Gleichwertig ist das nur, weil ein Lauf über eine überlappende, ungleiche Periode verweigert wird (siehe «Nicht bestätigt»).
  - Neu ist: Wirft `statementChanges` für einen einzigen Entwurf, fehlen alle Hinweise des Gebäudes, auch Heizprofil und Pauschale. Früher fiel nur der Hinweis dieses Entwurfs weg. Das ist nur ein Hinweis und passt zum bekannten Unterschied.
- **Andere Aufrufer.**
  - `status` erscheint jetzt auch in `GET /statements/run` (`contracts`, Spread in `statement-run.service.ts:69`) und in den Gebäude-Verträgen; dort gibt es keinen Namenskonflikt. `drift` prüft nur die erwarteten Schlüssel, die Fixtures bleiben gültig.
  - `rentalContractId` und `isFuture` gehen über `toTenant` auch an die übrigen Mieter-Ladevorgänge; das ist unkritisch.
  - `run-differences` hat nur einen Aufrufer.
  - `laterChanges` bleibt in Gebrauch (`statements/[id]/+page.server.ts:34`).
  - `deleteDraft` sendet ausser der Vertragsseite auch `ContractForm.svelte` (C-2).
- **Status-Vergleiche im BFF.** Das Muster von `tools/arch-baseline/05-knowledge.ts` (`[!=]== '<status>'`) findet in `src/lib/server` und `src/routes/**/*.server.ts` keinen Treffer mehr. `dashboard/+page.server.ts:204` (`a.status === 'vacant'`) prüft nur einen vom Backend gelieferten Status und steht nicht in der Baseline. Eine Statusentscheidung im BFF bleibt in anderer Form, siehe «Nicht bestätigt».

Geprüft: alle 30 geänderten Dateien. Red durch Lesen bestätigt für die neuen Tests in `contract.routes`, `contract-end`, `statement-run`, `api-contracts`, `tenant-detail`, `apartment`, `contract-actions` und `statement-generation`: Jeder schlägt ohne die Änderung fehl. Ausserdem geprüft: der neue Code in vier Sprachen (gleicher Text wie `contracts_end_failed`), `api-specification.md`, keine UI- oder Screen-Änderung, kein E2E-Code im Diff.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - die neuen Backend- und BFF-Tests rot vor der Änderung;
  - `cd backend && bun run test` (1553 grün, Coverage erfüllt);
  - `bunx vitest run --changed origin/main` (827 grün);
  - `bun run lint`, `bun run check`, Backend-Type-Check und `bunx fallow audit`;
  - der Vertrags-Abgleich in `api-contracts.pg.test.ts`.

  Backend und E2E habe ich auf Wunsch nicht gestartet, die BFF-Tests nicht erneut.
- **«No scenario»-Begründung.** Die neue Ablehnung `CONTRACT_DRAFT_NOT_AFFECTED` ändert sichtbar, was ein veraltetes Fenster erlebt. Ob der Pull-Request-Text dafür `No scenario: <reason>` nennt, war nicht prüfbar (kein PR im Bereich).
- **Statusentscheidung im BFF ausserhalb dieses Schritts.** `src/lib/former-tenant-documents.ts:32` vergleicht `contractStatusOn(...) !== 'ended'` mit `localToday()`. Die Datei läuft serverseitig im Ladevorgang `src/routes/tenants/[id]/+page.server.ts:59`. Die Baseline zählt sie als FE (`m4-decisions-outside-backend.csv`), deshalb taucht sie im M4-Ziel «BFF 0» nicht auf. Ob H-28 sie mitmeinen sollte, steht nicht in der Anforderung. Die übrigen `contractStatusOn`-Aufrufe (`ContractRow.svelte`, `ContractForm.svelte`, `contracts/[id]/+page.svelte`, `ContractWizard.svelte`) sind Client-Anzeige.
- **Lauf über eine überlappende, ungleiche Periode.** Dass ein solcher Lauf vor der Vorschau mit Rechnungen immer verweigert wird (sonst fehlt dort jetzt der Hinweis «veraltet»), habe ich nur aus `contractsInPeriod` (`statement-generation.ts:88-108`) und dem Kommentar zu Schritt 2 gelesen, nicht im Assistenten geprüft.
