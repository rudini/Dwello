# Code-Review W7b, Runde 3 (Schlussreview vor dem Push)

Gegenstand: `git show 2cbeb76` im Worktree `review-w7b-code3` (detached auf 2cbeb76), dazu die Umbenennung der Migration im Merge d736cbb (`git diff bc4e49a d736cbb -M -- backend/migrations implementation_plan.md`). Alle acht Dateien des Deltas gelesen, dazu `backend/src/db/migrate.ts`, `backend/src/__tests__/migrations.pg.test.ts`, beide Migrationen und der Baum von origin/main (76424e0).

Ergebnis: keine Blocker, keine Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-12 | Nit | `docs/archive/implementation-plan-verlauf.md:624` | «Plan archived; pull request for #112 opened» ist abgehakt, bevor der Pull Request existiert (der Commit liegt vor dem Push). Erst nach dem Öffnen stimmt der Haken; sonst «(opened at push)» schreiben. |
| C-13 | Nit | Commit 2cbeb76, Nachrichtentext | «migration renumbered after main's 0007» steht in der Nachricht von 2cbeb76, die Umbenennung liegt aber im Merge d736cbb (2cbeb76 berührt `backend/migrations` nicht). Nur irreführend für die Historie. |
| C-14 | Nit | `backend/migrations/0008_contract_notice_received.sql` | Eine lokale Datenbank, die schon `0007_contract_notice_received.sql` angewendet hat (Entwicklungs- oder Persona-Datenbank dieses Branches), bricht jetzt mit «Die Datenbank stammt von Migrationen, die es nicht mehr gibt (0007_contract_notice_received.sql)» ab (`migrate.ts:30-35`) und braucht `bun run db:reset`. Betrifft nur lokale Datenbanken dieses Branches, keine Installation (der alte Name war nie auf main); der Fehler nennt den Ausweg. |

## Bestätigt

- **Umbenennung richtig:** `git diff bc4e49a d736cbb -M` zeigt eine reine Umbenennung (100 %, 0 Zeilen geändert) `0007_contract_notice_received.sql` → `0008_contract_notice_received.sql`. origin/main (76424e0) hat `0001` bis `0007_reminder_payment_deadline.sql` und keine `0007_contract*`/`0008*` (`git ls-tree 76424e0 backend/migrations/`, `git log 76424e0 -- 'backend/migrations/0007_contract*'` leer). `migrate.ts:19` sortiert die Dateinamen; `0007_reminder…` läuft vor `0008_contract…`. Die beiden Migrationen berühren verschiedene Tabellen (`documents` bzw. `rental_contracts`), die Reihenfolge ist also auch fachlich ohne Belang. Keine Journal-/Meta-Datei, die den Namen führt.
- **Verweise:** `grep` nach `0007_contract` findet nur `docs/reviews/w7b-review-1.md:11` (historischer Bericht, zu Recht unverändert); Plan bzw. Archiv (`implementation-plan-verlauf.md:626`) nennen `0008`. `migrations.pg.test.ts:32` liest die Dateien dynamisch, kein Name fest im Test.
- **Merge:** `schema.ts` hat `noticeReceivedOn` (122) und `paymentDeadline` (392, 498) nebeneinander; `src/lib/types.ts` beide Felder. Der Konflikt in `implementation_plan.md` ist so gelöst, dass die W7b-Session bleibt und main's Session im Archiv steht (`implementation-plan-verlauf.md:543`).
- **C-11 behoben:** In `PeriodStep.svelte:45`, `targets/contract-form.ts:53`, `steps/contract-form.steps.ts:353`, `contract-edit.feature:79` ist «F-7» durch den Glossar-Anker «Kündigung aufheben» ersetzt bzw. weggelassen. Die übrigen «F-7»-Treffer (`statement-mapping.test.ts:17`, `statement-detail.feature:248,329`, `calculation.service.ts:436`, `statement-pdf.pg.test.ts:339`) gehören zu #229/#232 und sind nicht Teil dieses Slices. Nur Kommentare, kein Verhalten.
- **Plan:** `implementation_plan.md` hat keine Session mehr (nur Kopf), die W7b-Session steht vollständig abgehakt am Ende des Archivs (`:609`); das passt zu `open-work.test.ts` (höchstens eine Session).
- **Workflow-Notiz** (`docs/reviews/workflow-notes-issue-112-52.md`): drei Zeilen, jede mit Regel, Vorfall und Vorschlag; keine Änderung an Regeldateien.
- `docs/reviews/w7b-review-2.md` ist der Bericht der Runde 2 unverändert übernommen.
- Nichts im Delta ist ohne Bezug zur Anforderung.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-Type-Check, volle vitest-, Backend- und E2E-Läufe auf 2cbeb76: vom Aufrufer gemeldet, nicht neu gelaufen. Insbesondere `migrations.pg.test.ts` (wendet alle Migrationen in Dateireihenfolge auf eine leere Datenbank an) habe ich nur gelesen; das Delta ändert Code nur in Kommentaren, daher kein abweichender Ausgang erwartet.
