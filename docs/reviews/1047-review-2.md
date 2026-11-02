# Code-Review 1047, Runde 2 (Delta 9ea54f24c..1b3d9e22b, zugleich Abschlussrunde)

Geschlossen: C-1, C-2

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | src/lib/ui/ActionDialog.svelte:71 | Das neue `true` (Mieter und Vertrag löschen ersetzen den Verlaufseintrag) hat keinen Test. Ohne das Argument bleiben alle Tests grün: `ui-action-dialog.dom.test.ts:62-66` prüft bei `redirect` nur `onsuccess`, `tenant-detail-page.dom.test.ts:164` und `contract-detail-page.dom.test.ts:918` spielen die Weiterleitung ohne `location` und prüfen `goto` nicht. Das gilt nur für FormDialog (`statement-pages.dom.test.ts:1552-1562`). |

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run --changed origin/main` (436 passed), `bun run lint` (0), `bun run check` (0), Prettier auf den eigenen Zeilen, E2E chromium statements/statement-detail/tenants/contract-detail/contracts (227 passed, mit dem neuen Szenario ohne `@wip`), Rotlauf des neuen DOM-Tests vor der Korrektur.
- Wie in Runde 1 offen: Wenn `hooks.server.ts:59` bei abgelaufener Sitzung eine Dialog-Aktion mit 303 auf `/login?redirectTo=…` beantwortet und das als `redirect`-Ergebnis ankommt, ersetzen jetzt alle Aktionen von ActionDialog und FormDialog die Detailseite im Verlauf, nicht nur die Löschaktionen. Ich habe das nicht verfolgt, weil der Worktree keine `node_modules` (SvelteKit-Quelltext) hat.

Geprüft: Bei ActionDialog leiten nur `?/delete` des Mieters (`tenants/[id]/+page.server.ts:104`) und des Vertrags (`contracts/[id]/+page.server.ts:344`) weiter. `end`, `movedOut`, `deleteAdvance`, `deleteDocument`, `anonymise`, `create`/`revoke` (Zugangsschlüssel) und `markSent` antworten ohne `redirect`. Bei FormDialog leitet nur `?/delete` weiter, denn `?/correct` läuft über ein eigenes `enhance` (`Correction.svelte:103-112`). `endDeletingDraft` und `continueDeletingDraft` nutzen den Standardwert und rufen `update()` auf. Der neue DOM-Test schlägt ohne die Korrektur fehl. In `statement-pages.dom.test.ts` wurden nur Zeilen dieses Pull Requests umformatiert. `@wip` ist entfernt, und das Szenario ist neu, also ohne Freigabe erlaubt.
