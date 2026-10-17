# Code-Review W2d, Runde 2 (Abschlussrunde vor dem Push, #79)

Worktree: `review-w2d-code2`, detached auf `ae523cb0`. Geprüft: `ef0e2328` (Doku), Merge `c460a1dc` (origin/main), `ae523cb0` (Migration 0013 → 0014).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. C-1 aus Runde 1 ist behoben. |

Keine Blocker oder Majors.

## Bestätigt

- **Reihenfolge der Migrationen:** `backend/src/db/migrate.ts:19` sortiert die Dateinamen. `0013_contract_moved_out.sql` (von main) läuft vor `0014_statement_balance_tenant_favour.sql`. Die Saldo-Migration liest nur `total_costs`, `total_advance_payments`, `balance`, `status` und `pdf_blob`, also keine Spalte, die 0013 hinzufügt. Der Filter in `backend/src/__tests__/migrations.pg.test.ts:93` wendet jetzt 0001–0013 an, `moved_out` inklusive. Der Insert in `rental_contracts` danach funktioniert dank `DEFAULT FALSE`. Ausser in `docs/reviews/` verweist nichts mehr auf `0013_statement…` (grep über das Repo).
- **Umbenennung:** Das ist kein Eingriff in eine angewandte Migration, denn der Branch ist nicht gepusht. Eine lokale Datenbank, die die alte `0013_statement…` schon hat, wendet 0014 noch einmal an. Das schadet nicht: Die `WHERE`-Klausel greift nur bei einem abweichenden Saldo, und die Migration ändert dann nichts mehr.
- **Merge:** Sechs Dateien hat sowohl main als auch der Branch geändert (`docs/data-model.md`, die vier `messages/*.json`, `src/__tests__/statement-pages.dom.test.ts`). Ein Drei-Wege-`git merge-file` auf der Merge-Basis ergibt ohne Konflikt genau den Stand von `c460a1dc`. Die vier JSON-Dateien lassen sich parsen. Gegenüber `origin/main` (`c460a1dc^2..ae523cb0`) enthält der Branch nur noch die Dateien von #79.
- **Saldo und QR-Betrag in main:** Der Merge ändert in `backend/src/services` nur `contract.service.ts` (Feld `movedOut`). Die Mahnung (W6c, #59) ändert nur einen Hinweistext in `ReminderModal.svelte` und in den Messages. `reminder.service.ts:61,85` und `reminder-letter.ts:117` nehmen den gespeicherten `statement.balance` und rechnen nicht selbst. Der Saldo wird weiterhin nur an einer Stelle gerundet: `calculation.service.ts:253` → `roundTo5Rappen`. Der QR-Zahlteil (`pdf.service.ts:852,906`) nimmt `data.balance`.
- **Gesendet und bezahlt bleiben unverändert:** `statement.service.ts:471-476` erlaubt keinen Übergang zurück auf `draft`. Damit trifft die Migration nur Abrechnungen, die nie beim Mieter waren.
- **Doku `ef0e2328`:** Der Text von V-8 in `docs/nebenkostenabrechnung-anforderungen.md:148` («vor #79 versendete Abrechnung», «Entwürfe wurden mit der Umstellung neu gerundet») stimmt mit der Migration und mit `design-decisions.md` (Zeile #79, jetzt `0014`) überein. Workflow-Notiz und Plan passen zum Stand. Die Plan-Einträge «Merge main» und «Lint …» sind zu Recht abgehakt, «Session archived» ist noch offen.
- **Ponytail:** Das Delta ist eine reine Umbenennung mit zwei Folgeanpassungen. Es bleibt nichts Unbenutztes zurück.

## Nicht bestätigt

- Diese Checks hat der Aufrufer auf `ae523cb0` gemeldet, ich habe sie nicht erneut laufen lassen («vom Aufrufer gemeldet»): `bun run lint`, `bun run check`, Backend-Typprüfung, `bunx vitest run` (2757), Backend `bun run test` (766, Coverage ok), E2E chromium+api für `statement*.feature` und `help.feature` (140), die Zeilen von `sprachen-bildschirme` zur Hilfe (2).
- Den neuen Fall in `migrations.pg.test.ts` habe ich nur gelesen, nicht ausgeführt (er braucht PostgreSQL). Dass er ohne die Migration rot wird, folgt aus den erwarteten Werten: S-1 bis S-4 haben dann andere Salden und `pdf_blob` ist nicht null.
