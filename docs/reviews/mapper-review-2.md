# Code-Review Runde 2 (Delta): ein Mapper für den Mieter im BFF

Range: `git diff 2bc9c70d 88fa6c67 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'`, Worktree detached auf 88fa6c67.

## Status offener IDs

| ID | Schwere | Datei:Zeile | Status |
|----|---------|-------------|--------|
| C-1 | Minor | src/lib/server/tenant.ts:18 | Erledigt. Der JSDoc lautet jetzt «The backend's tenant in the shape of `Tenant`; loads reuse it instead of copying its fields (one mapper per response)». Die falsche Aussage «the one place that maps its fields» ist weg; der Satz nennt jetzt die Regel aus CLAUDE.md und behauptet nicht mehr, dass `src/routes/contracts/[id]/+page.server.ts` sie schon einhält. |

## Neue Befunde im Delta

Keine. Keine Blocker, keine Majors.

Geprüft: Das Delta ändert nur eine Kommentarzeile (src/lib/server/tenant.ts:18) und kein Verhalten; deshalb braucht es keinen Test, kein Szenario und keine Texte.

## Nicht bestätigt

- `bun run lint` auf 88fa6c67: vom Aufrufer gemeldet.
- vitest tenant-detail, tenant-list, tenants-i18n, open-work (41 Tests): vom Aufrufer gemeldet; nicht erneut ausgeführt, weil sich nur ein Kommentar geändert hat.
