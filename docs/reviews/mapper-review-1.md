# Code-Review Runde 1: Phase 2b, Refactoring-Zyklus 1 «ein Mapper für den Mieter im BFF»

Worktree `review-mapper-code-reviewer` (detached 2bc9c70d), Bereich `61456591..2bc9c70d` (81e1c2e6, 4ced96bd, 2bc9c70d), ohne `docs/reviews`, `implementation_plan.md`, `docs/archive`.

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Minor | src/lib/server/tenant.ts:18 | Der neue JSDoc nennt `toTenant` «the one place that maps its fields». Das stimmt nicht: `src/routes/contracts/[id]/+page.server.ts:130-136` baut den Mieter weiterhin selbst nach (`filled(data.tenant, { firstName: '', …, language: 'de' })`), wie das ADR selbst unter «Noch offen» festhält. Der Kommentar beschreibt ein Ziel, nicht den Stand; bis der Folgeschritt nach #717 kommt, z. B. «the BFF's mapper of the tenant response», ohne «the one place». |

Keine Blocker, keine Majors.

Geprüft: Verhalten für jedes Feld der Liste. Die Backend-Liste (`backend/src/services/tenant.service.ts:56-74`, `:109`, `:155-160`) liefert `firstName`/`lastName`/`language` als NOT NULL (`backend/src/db/schema.ts:90-95`), damit greifen die alten Defaults `|| ''` und `|| 'de'` nie. `email`/`phone`/`address`/`postalCode`/`city` kommen als `null` oder Wert. `''` entsteht nur ausserhalb des Formulars, weil `tenant-form.ts:29-30` leere Werte als `null` schickt. `TenantRow.svelte:10` filtert mit `filter(Boolean)` und zeigt Adresse und Ort nicht. `rentalContractId` liefert die Liste nicht (nur `getTenant`, `:216`), es bleibt also `undefined`. `anonymisableFrom` wird `null`. `isFuture` aus `toTenant` wird von `t.isFuture === true` überschrieben, beides ergibt denselben Wert. `anonymisedOn`, `contractCount` und die Zeitstempel gibt `toTenant` nicht weiter, es entsteht also kein neues Datenleck. Beim neuen Mietvertrag ändert sich nur der Typ: Die Ladefunktion liest dieselben Felder `id`, `firstName`, `lastName`, `city`. `contracts/[id]` ist unberührt. ADR-Aussage «Sprachliste verlässt den BFF»: Die Union steht noch in 5 Produktivdateien (`src/lib/types.ts`, 4 im Backend), keine davon im BFF. Das passt zu `ratchet.json` mit `files: 5`. Ponytail: Der Diff ist minimal, es gibt keinen ungenutzten Export, der Export wird jetzt genutzt. Commits: Ihr Text behauptet keine Rotphase, ein Rotlauf war für ein reines Refactoring ohne neuen Test auch nicht nötig. Kein Text, keine UI, kein Akzeptanztest und kein API-Vertrag geändert.

## Nicht bestätigt

- Lint, Check, `bunx vitest run` (3637), `bun run fitness`, E2E `tenants.feature`/`contract-new.feature` (47, Chromium und API) sowie die Commit-Hooks: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Die Messwerte des ADR (Spiegel 57 → 56, `tenants.firstName`/`lastName` 18 → 16, `tenants.language` 23 → 22, Median/P90/Max 6/19/60, BFF-Fundstellen 8, Zyklen 2): nicht nachgemessen, weil `02-imports.ts`/`05-knowledge.ts`/`fitness` Dateien schreiben. Gelesen habe ich nur den Diff von `tools/fitness/ratchet.json`: einen Spiegel-Eintrag weniger und die Sprachliste 6 → 5. Er stimmt mit den Behauptungen überein.
