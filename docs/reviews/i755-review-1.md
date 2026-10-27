# Review #755, Runde 1 (747e72e6 gegen origin/main, ohne implementation_plan.md)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde. |

Geprüft: `src/__tests__/categories.test.ts:23,50-66` antwortet jetzt mit `tests/contracts/categories.json` und überschreibt nur `name`/`nameDE`; damit prüft der Test weiter, dass `nameDE` statt `name` angezeigt wird (`toCategory` in `src/lib/server/category.ts`), und `usageCount: 3` aus dem String `"3"` prüft die Umwandlung mit `Number()`. `"invoiceCount": "3"` in `tests/contracts/categories.json:15` passt zu `backend/src/api/category.ts:10` (string) und `category.service.ts:59,107` (COUNT(*)); laut `tests/contracts/README.md` gehören gelesene Felder ins Beispiel, Zählungen als String. Die anderen Nutzer des Vertrags (`category-lists.test.ts:11`, `invoices.test.ts:278`) spreizen ihn nur, das neue Feld stört sie nicht. Reine Teständerung ohne Verhaltensänderung: kein Szenario, keine Texte, keine a11y-Einträge nötig; der geänderte Test ist kein neuer Test, ein Rotlauf ist nicht verlangt. Nichts Fremdes im Diff. ponytail-review: Lean already. Ship.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/api-contracts.pg.test.ts` (grün, vorher rot mit `"invoiceCount": 3`): vom Aufrufer gemeldet; nicht erneut gelaufen (braucht PostgreSQL). Gelesen: `api-contracts.pg.test.ts:479-482` vergleicht `categories.json` mit `drift()` gegen `GET /api/v1/categories?limit=1000`.
- Frontend-Test rot ohne `invoiceCount` im Vertrag: vom Aufrufer gemeldet; nach Lesen plausibel (`usageCount` wäre dann 0).
- `bun run lint`, `bun run check`, Backend-Type-Check, Prettier: vom Aufrufer gemeldet.
- Selbst erneut gelaufen: `bunx vitest run src/__tests__/categories.test.ts src/__tests__/category-lists.test.ts src/__tests__/invoices.test.ts` im Worktree, 64 bestanden.
