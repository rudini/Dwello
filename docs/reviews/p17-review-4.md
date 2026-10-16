# Review Merge-Commit 5bd6f29 (origin/main in claude/w10-wizard-detour-144, #144)

Geprüft: `git show --remerge-diff 5bd6f29`, `git diff <Parent> 5bd6f29` gegen beide Parents (b77ac3a = #144, f562b75 = main) und gegen die Merge-Basis 754542d für alle Dateien, die beide Seiten geändert haben.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. Die Konfliktauflösung behält beide Seiten vollständig und ohne Duplikate. |

Kein Blocker, kein Major.

## Was bestätigt ist

- `tests/e2e/targets/contract-form.ts`: `rentTakenOver` (#144) und `withdrawNoticeOption` mit Kommentar (main) je genau einmal; `git diff f562b75 HEAD` zeigt nur die #144-Zeile, `git diff b77ac3a HEAD` nur den main-Block.
- `tests/e2e/questions/contract-form.ts`: Imports `advancePaymentInput`, `rentTakenOver`, `withdrawNoticeOption` je einmal; `enteredAdvancePayment`, `rentTakenOverText`, `withdrawNoticeHelp` je einmal exportiert.
- `tests/e2e/steps/contract-form.steps.ts`: Imports `enteredAdvancePayment`, `rentTakenOverText`, `withdrawNoticeHelp`, `goToRentWith`, `openNewContractFor` vollständig; die drei #144-Steps und der main-Step «Kündigung aufheben» je einmal, Klammern der beiden `Then(...)` korrekt geschlossen (die Auflösung ergänzt das bei der Konfliktgrenze fehlende `}\n);`).
- `docs/archive/implementation-plan-verlauf.md`: Sessions W7b (#112, #52) und #97/#101 von main sowie die #144-Session je einmal, #144 am Ende; keine Konfliktmarker. `implementation_plan.md` hat keine offene Session.
- Automatisch gemergte gemeinsame Dateien: `messages/{de,fr,it,en}.json` (je 1491 Schlüssel, die #144-Schlüssel `contracts_rent_taken_over_*` und die main-Schlüssel `contracts_notice_*` in allen vier), `tests/a11y/screens.json` (`rent-taken-over` und `end-dialog-notice-hint` mit `stateMeanings`, Zustandslisten und Adresse), `accessibility.feature`, `sprachen-bildschirme.feature` (beide Zeilen je einmal), `tests/e2e/tasks/accessibility.ts` (beide Zustände, Import `noticeReceivedInput`).
- Kein Verhaltenskonflikt mit #144: main ändert in `src/routes/contracts/new/` nur einen Kommentar in `PeriodStep.svelte` (TODO #52 entfernt) und den Text `contracts_withdraw_notice_help`; `ContractWizard`, `RentStep`, `TenantStep`, `contract-wizard.ts` fasst main nicht an. Das neue Feld `noticeReceivedOn` (Backend, `RentalContract`, `tests/contracts/contract.json`) berührt die Übernahme der Beträge nicht: `contract-wizard.ts` typisiert `ListedContract` selbst, die #144-Tests lesen `tests/contracts/contracts.json`, das main nicht ändert. main ändert keine E2E-Seeds/Fixtures; `noticedApartment` (2.01, frei ab 01.04.2099) gilt für `rent-taken-over` weiter. `end-dialog-notice-hint` läuft auf `contract-detail`, nicht im Wizard.
- Selbst ausgeführt auf 5bd6f29: `bunx vitest run src/__tests__/contract-wizard.test.ts src/__tests__/contract-wizard.dom.test.ts src/__tests__/tenant-form.test.ts src/__tests__/tenant-new-page.test.ts`: 76/76 grün.

## Nicht bestätigt

- `bun run lint` sauber, `bun run check` 0 Fehler: vom Aufrufer gemeldet.
- E2E (contract-new, contract-edit, tenants, axe-/Sprachzeilen dieser Bildschirme) und `bun run test:coverage`: vom Aufrufer als laufend gemeldet, Ergebnis unbekannt; E2E darf ich nicht starten. Ob `rent-taken-over` und `end-dialog-notice-hint` zusammen in derselben axe-/Sprachen-Ausführung grün sind, zeigt erst dieser Lauf.
- Backend-Tests und `cd backend && bun run type-check` nach dem Merge (main bringt Migrationen 0008/0009): nicht gelaufen, nicht gemeldet. #144 ändert aber kein Backend.
