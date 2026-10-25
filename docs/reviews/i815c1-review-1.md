# Review i815c1, Runde 1 (f430a98b..a4f34a88)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Blocker (bekannt, laut Aufrufer behoben in 96f50c68) | src/__tests__/helpers/statement.ts:3 | Laufzeit-Import `../../../backend/src/services/statement-payment` aus `src/` über die HTTP-Grenze; die Fitness-Funktion `boundary-import` kennt keine Ausnahme und lässt den CI-Job «Architecture fitness» scheitern |
| C-2 | Minor | backend/src/services/statement-payment.ts:15 | `belowMinimum` kopiert `belowMinimum` aus `backend/src/services/pdf-format.ts:23` (gleicher Körper), statt es zu importieren (ponytail `reuse`) |

## C-1 (Blocker): Test-Fixture importiert Backend-Code zur Laufzeit

Laut Aufrufer bekannt und in 96f50c68 behoben (nicht in diesem Worktree, von mir nicht geprüft): Die Fixture setzt die Felder der Standard-Nachzahlung jetzt als feste Werte, die Seitentests geben andere Fälle selbst an. Auf a4f34a88 nachgewiesen: `ARCH_OUT=<scratchpad>/i815c1-arch bun tools/arch-baseline/02-imports.ts` liefert die Kante `src/__tests__/helpers/statement.ts,backend/src/services/statement-payment.ts,no,...`. `tools/fitness/fitness.ts:289-291` filtert keine Tests heraus, kennt keine Ausnahme und endet mit Exit 1 (Z. 364).

## Nicht bestätigt

- Die Korrektur von C-1 in 96f50c68 (nicht im Worktree). `bun run fitness` habe ich nicht selbst gestartet.
- Vom Aufrufer gemeldet, nicht wiederholt: `bunx vitest run` (3649), `bun run lint`, `bun run check`, Backend `type-check` und `bun run test` (1632, 96.5 %), die roten Läufe der neuen Backend-Tests und des advanceChanged-pg-Tests, E2E `statement*.feature` (279), Prettier auf neuen Dateien, `bun run fitness` (19 → 9; siehe C-1).
- `api-contracts.pg.test.ts` habe ich nicht laufen lassen. Ich habe nur gelesen, dass er `statement.json` und `statements.json` gegen GET `/statements/:id`, GET `/statements` und POST `/correction` prüft (Z. 105, 795, 898).

Geprüft: Das Verhalten stimmt mit dem entfernten Frontend-Code überein. Das gilt für `paidAmount` 0 gegenüber `null` (Mapper `amountOrNull`), die Grenzen ±5 und 0 bei `unpaid`, `claimed`, `waived` und `carried` (-5 < Saldo < 0 entspricht `belowMinimum && <0`), den effektiven Status in Liste und Detail, `nextReminderFrom` gleich heute (`>`), `paymentDeadline` null (früher `null < 'YYYY…'` → false, jetzt `!!null` → false) und für `advanceChanged` (gespeicherter statt effektiver Status, bei draft gleich; `replaces.totalAdvancePayments` wird selektiert). `swissToday` und `localToday` sind dieselbe Zürcher Tagesberechnung. Alle Aufrufer laufen über `toStatement` (Liste, `loadStatement` für Detail und Bearbeiten; `statement-generation.ts:262` nutzt nur id, Nummer und Name), es bleiben keine Verweise. Verträge, API-Doku und Mapper-Test sind nachgeführt. Die drei nach `display` verschobenen Ausnahmen verzweigen nur auf den Statuswert, Backend-Felder (`carried`, `claimed`, `reminderWaitsUntil`) und ob ein Bezahldatum vorhanden ist; keine kombiniert den Status mit einem Betrag oder Datumsvergleich. Keine UI-Texte, keine E2E-Dateien, keine neuen Zustände.
