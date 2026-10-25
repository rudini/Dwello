# Code-Review #788 Teil 4a, Runde 1

Commit `dc80c37b` (Worktree `review-p2-code-reviewer`), Diff `95461d8b..dc80c37b` ohne `implementation_plan.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `backend/src/__tests__/dashboard-tasks.pg.test.ts:38-57`, `src/__tests__/dashboard.test.ts:74-87` | Zwei Fälle der verschobenen Regel «Kündigung ohne Nachmieter» sind nach dem Diff auf keiner Schicht mehr geprüft: (a) die Kündigung bleibt auch nach dem Vertragsende eine Aufgabe (K-6), (b) nur ein späterer Mietvertrag **derselben** Wohnung zählt als Nachmieter |

## C-1 (Major): verschobene Regel hat ihre Tests verloren

Bis zum Basis-Commit prüfte `dashboard.test.ts` die Regel selbst. Das BFF rechnete `noticed()` aus der Fixture `contracts`. Dort ist `n2` gekündigt und vor heute beendet (Ende `2026-09-30`, heute `2026-10-10`) und blieb erwartete Aufgabe `successor-n2`. Die Paare `n3`/`n4` und `n6`/`n7` liegen in eigenen Wohnungen (`a9`, `a6`). Hätte `later` die Wohnung nicht beachtet, wäre `n2` über `n7` (Beginn `2026-11-21`) weggefallen.

Jetzt liefert die Fixture die Entscheidung selbst (`contractTasks` = `pick('n1', 'n2', 'n5')`, `dashboard.test.ts:76-86`). Damit prüft der BFF-Test nur noch, dass das BFF die Liste weiterreicht. Die neue Regel in `backend/src/services/contract-tasks.service.ts:16` prüft nur:
- eine Kündigung mit Ende `2099-03-31`, also in der Zukunft;
- einen Nachfolger in derselben Wohnung (`dashboard-tasks.pg.test.ts:38-57`).

Auch `dashboard.feature` (Z. 272-289) nennt nur Kündigungen mit künftigem Ende. Das Szenario A-5 (Z. 291) prüft nur «Neue Adresse eintragen».

So zeigt sich der Fehler:
- (a) In `contract-tasks.service.ts:16` `&& c.endDate >= swissToday()` ergänzen. Alle Tests bleiben grün, auch die E2E-Szenarien `dashboard`. Die Übersicht verliert dann die Aufgabe «Nachmieter suchen» nach dem Ende (A-4.1, review K-6).
- (b) In `later-contract.ts:10` `eq(rentalContracts.apartmentId, apartmentId)` streichen. `dashboard-tasks.pg.test.ts` bleibt grün, denn im Testlauf beginnt kein anderer Vertrag nach `2099-03-31`, der Nachfolger wird im `finally` gelöscht. Ob `contract-next-steps.pg.test.ts:73` den Fehler fängt, hängt davon ab, welche Fremddaten zufällig in der geteilten Datenbank liegen.

Fix: In `dashboard-tasks.pg.test.ts` zwei Fälle ergänzen:
- eine Kündigung mit Ende vor heute (z. B. `2025-12-31`), die in `noticedContracts` steht;
- eine Kündigung, nach deren Ende ein Mietvertrag in einer anderen Wohnung beginnt, und die trotzdem in `noticedContracts` steht.

Den zweiten Mietvertrag legt der Test selbst an und räumt ihn auf, wie im Nachfolger-Test.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht wiederholt:
  - `bunx vitest run` (3650) und `test:coverage`;
  - lint, check, backend type-check;
  - `dashboard-tasks.pg.test.ts` (4, rot gesehen);
  - `api-contracts` (82);
  - `bun run fitness` (bffDates 0, BFF-Entscheidungen 8, Zyklen 2);
  - E2E `dashboard` und `tenant-detail` (62).
- `bunx vitest run src/__tests__/dashboard.test.ts` habe ich im Worktree versucht. Er brach mit `ERR_MODULE_NOT_FOUND` ab, vermutlich fehlen dort Abhängigkeiten. Die Rotphase der zwei neuen BFF-Tests (`dashboard.test.ts:172`, `:193`) habe ich nur durch Lesen beurteilt:
  - vor der Änderung fragte das BFF `/documents`, das der Test-Backend-Stub mit «unexpected» abweist, sodass `former-documents-*` fehlt;
  - das BFF rechnete `successor-n1/n2/n5` und `fixed-term-f1` selbst aus `contracts`.
  Beide wären also rot.
- Abfragekosten: nicht gemessen. Gelesen: Die Abfragen laufen sequenziell, eine `laterContract` je gekündigtem Mietvertrag und eine je abgelaufenem Mietvertrag ohne Kündigung (über `fixedTermCheck`). Dazu kommen je Mieter 1 bis 3 Abfragen in `formerTenantDocuments`. Bei unter 50 Wohnungen mit einigen Mietverträgen Verlauf sind das wenige hundert Abfragen über Indizes (`contracts_apartment_id_idx`, `contracts_tenant_id_idx`, `documents_tenant_id_idx`, `schema.ts:154-155, 604`). Ob das Ziel «API < 500 ms p95» (`docs/tech-stack.md:462`) hält, ist ungemessen (P2 in `utility-tree.md:188`: «Nicht gemessen»).

Geprüft:
- Regelgleichheit mit dem alten BFF:
  - Reihenfolge der Listen: Vertragsliste `startDate desc, id desc`; `successorTasks`/`fixedTermTasks` sortieren ohnehin nach Ende; `formerTenants` in Mieterreihenfolge der Liste.
  - Ende heute: kein `fixed-term` (`fixedTermCheck`: `end >= swissToday()`); `ended` nur bei Ende vor heute.
  - Gekündigte Verträge fallen nicht in `expiredContracts`.
  - Mietername: für alle Verträge eines Mieters gleich.
  - Nur ungeprüfte; Uploads nach Schweizer Tag.
  - Beginn in der Zukunft mit Ende vor heute: nur bei einem Ende vor dem Beginn, das das Backend ablehnt.
- Die Löschung von `src/lib/former-tenant-documents.ts` verliert nichts. Es gibt keinen weiteren Import. Alle 11 Fälle stehen in `tenant-former-documents.pg.test.ts`. Den alten «geprüft»-Fall und den Fall «befristet mit Nachmieter, keine Frage» decken jetzt `dashboard-tasks.pg.test.ts:71-80` und `contract-next-steps.pg.test.ts:92` ab.
- Das BFF füllt `endingContracts` aus der Backend-Liste `noticedContracts`. Die Felder `id` sind gleich.
- `allContracts` bleibt für `missingStatements` in Gebrauch. Die Dokumentenliste wird nicht mehr geladen.
- Vertrag `dashboard.json` und api-contracts-Test mit Aufräumen im `finally`.
- Isolation der pg-Tests: zufällige Namen, `toContainEqual`/`not.toContain` nur auf eigene IDs, `afterAll` löscht Dokumente und Mietverträge.
- Doku, Ratchet und keine fremden Änderungen; keine UI-Texte, keine Szenario- oder E2E-Änderung.
- ponytail-review ohne Befund.
