# Code-Review #788 Teil 3a, Runde 2 (Delta 29cc3fd9..ca9873e6)

## Status der offenen IDs aus Runde 1

| ID | Schwere | Status | Beleg |
| --- | --- | --- | --- |
| C-1 | Minor | erledigt | `src/routes/statements/[id]/LaterChanges.svelte:58` entscheidet jetzt mit `statement.correctable && later.correctionDue`, wie `MoreActions`. Der neue DOM-Test (`statement-pages.dom.test.ts:701-705`, `sent`, `correctable: false`, `correctionDue: true`) prüft, dass der Hinweis erscheint und der Button fehlt; mit der alten Bedingung (`status !== 'draft'`) wäre er rot (Helfer `tests/helpers/statement.ts:7` setzt `correctable` für `sent` sonst auf true, darum bleiben die übrigen Hinweis-Tests gleich). |
| C-2 | Minor | erledigt | `statement-mapping.test.ts:8-14` prüft die drei Felder aus `tests/contracts/statement.json` (`true/false/true`) und alle drei `false` ohne die Felder. Ein Mapper mit einer Konstanten `true` fällt bei der zweiten Erwartung durch, eine mit `false` oder vertauschtem `correctable` bei der ersten. |

## Neue Befunde im Delta

Keine.

Geprüft: alle drei geänderten Dateien des Deltas; keine Texte, Testids, Verträge oder E2E-Dateien geändert; nichts Fremdes im Diff.

## Nicht bestätigt

- `bunx vitest run` (3650 Tests), lint, check, Commit-Hooks: vom Aufrufer gemeldet. Mein erneuter Lauf von `bunx vitest run src/__tests__/statement-mapping.test.ts src/__tests__/statement-pages.dom.test.ts` im Worktree brach mit `ERR_MODULE_NOT_FOUND` ab (vermutlich fehlen dort Abhängigkeiten oder das generierte `src/lib/paraglide/`); nicht weiter untersucht, da ich nichts installieren darf.
- Rotlauf der beiden neuen Tests: nur durch Lesen beurteilt (siehe Tabelle), nicht selbst ausgeführt.
