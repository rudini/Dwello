# Code-Review 748, Runde 3 (Abschlussrunde vor dem Push)

Delta: `git diff 49b43f66 68eff3be -- . ':!docs/reviews' ':!docs/archive'`, dazu cf6a024b (nur Archiv), f1b341cc (Merge von origin/main ohne Konflikt; `git show --remerge-diff` zeigt nur den Kopf) und 4af6bd27 (nur Workflow-Notizen).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde |

Geschlossen: C-4, C-5

Geprüft: C-4: die Schleife in `src/__tests__/tenant-export.test.ts:88` endet jetzt bei `done`, also schlägt eine Regression an `expect(calls).toHaveLength(2)` fehl, statt den Worker hängen zu lassen. C-5: `exportFile` nimmt `kind: keyof typeof sources` an. Der einzige Aufrufer (`backend/src/routes/tenants.ts:114`) schränkt `kind` per `t.Union` auf die drei Arten ein, deshalb entfällt der Wächter ohne Lücke. Die neue Zeile in `docs/api-specification.md` («422 for another kind») stimmt mit der Elysia-Validierung und mit `tenant-export.pg.test.ts:159` überein.

## Nicht bestätigt

- bun run lint, bun run check, bun run fitness -- --base origin/main, cd backend && bun run type-check, bunx vitest run (4846), Prettier auf den hinzugefügten Dateien: vom Aufrufer gemeldet (auf f1b341cc).
- cd backend && bun test src/__tests__/tenant-export.pg.test.ts (17 pass): vom Aufrufer gemeldet (auf 68eff3be).
