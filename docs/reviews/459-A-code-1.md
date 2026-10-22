# Code-Review #459 Teil A, Runde 1

Gegenstand: `git diff 486c2b8..9b032ee` (8b502c5, 6ef1eef rote Tests; 9b032ee Umsetzung), Worktree `review-459-A-1` (detached bei 9b032ee). Anforderung: #459 «Decided» Punkt 2 und 5, «Done means» Zeilen 1 und 4 (Teil A); schliesst #331.

Keine Blocker, keine Majors.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `src/routes/tenants/[id]/TenantDocumentsCard.svelte:69-87` | Nach erfolgreichem «Als geprüft markieren» verschwindet der fokussierte Knopf (`{#if former.checkedOn}` ersetzt das Formular). Der Fokus fällt auf `body`, und es gibt keine Rückmeldung, die angesagt wird: `Alert` hat bei `info` kein `role`, und es gibt keinen Toast. Vergleichbare Abläufe tun das: Im selben Bauteil setzt das Löschen den Fokus auf die Liste (`list?.focus()`, Z. 140-142), `FixedTermCheck.svelte:34-40` zeigt einen Toast, wenn der Knopf verschwindet. Kein Test deckt das ab. Abhilfe: nach `update()` `tick()` und den Hinweis fokussieren (`Alert` hat `tabindex="-1"`) oder einen Toast zeigen. |
| C-2 | Minor | `docs/api-specification.md:100` | PUT `/contracts/:id` nennt weder das neue Feld `documentsChecked` (nur `true`, speichert den Schweizer Tag) noch dass ein geändertes `endDate` `documentsCheckedOn` löscht. Unter «list and detail carry `movedOut`» fehlt `documentsCheckedOn`. Die Verträge in `tests/contracts` sind nachgeführt, die Spezifikation nicht. |

## Nicht bestätigt

- Die Backend-Tests `contract-documents-checked`, `contract-moved-out` und `api-contracts`, `bun run lint`, `bun run check`, das Backend-`type-check` und der volle `bunx vitest run` (3609): vom Aufrufer gemeldet. Nicht selbst laufen lassen, weil die pg-Tests `dwello_test` neu anlegen. Selbst laufen lassen: `bunx vitest run` mit dashboard, former-tenant-documents, overview, tenant-detail-page.dom und tenant-detail: 116 grün.
- axe (hell/dunkel, drei Grössen) und fr/it/en ohne Deutsch für die zwei neuen Zustände des Hinweises (mit Knopf; `info` mit «Geprüft am»): Keiner der beiden Zustände steht in `tests/a11y/screens.json`, weil die E2E-Umgebung ihn nicht erzeugen kann (siehe unten). Der Kontrast von `text-critical` (Fehlerzeile) innerhalb eines Hinweises mit `caution` ist nicht geprüft.
- Begründung für «No scenario»: Sie hält. Der Upload stempelt `createdAt` mit der Serverzeit. Ein ehemaliger Mieter braucht ein Vertragsende vor heute, und nur Uploads vor diesem Tag zählen (`former-tenant-documents.ts:30-43`). Die Demo-Daten enthalten keine Dokumente (`backend/src/db/demo-data.ts`), und `tests/e2e` hat keinen direkten Zugriff auf die Datenbank. Gleiche Begründung wie bei #178 (`docs/archive/implementation-plan-verlauf.md:1438`). Weil «Done means» von #459 Szenarien in `tenant-documents.feature` und `dashboard.feature` verlangt, muss der Pull Request diese Abweichung nennen.

Geprüft: Migration 0033 mit `schema.ts`, `data-model.md` und Verträgen; `confirmedForEnd` als einziger Weg, der `rental_contracts` ändert (gleiches Ende behält, neues oder `null` löscht, V-3); der letzte Mietvertrag ist auf Mieterseite und in der Übersicht derselbe (V-2); die Aufgabe entfällt bei geprüftem Mietvertrag; Satz zum Endtag auf der Mieterseite und in der Aufgabe (V-1); Ton `info` (V-5); Marker #331/#334 entfernt; vier Sprachen wie in der Fachreview; `data-testid`; Formular-Action mit Fehlerfall; jeder neue Test schlägt beim Lesen ohne die Änderung fehl (auch die zwei in 9b032ee hinzugekommenen: `actions.checkDocuments` fehlt, Fehlerzeile fehlt); ponytail-review: nichts zu kürzen.
