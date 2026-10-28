# Code-Review 506, Runde 4 (CI-Fix Fitness, Runde 1), 653454e..3c9944f

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geprüft: `src/routes/statements/[id]/+page.svelte:67-77`. Die Zeile von `tools/fitness/ratchet.json:207` steht jetzt wieder wörtlich da. Ohne die Statusprüfung bleibt das Verhalten gleich, denn `carryChanged` (`backend/src/services/carry-over.ts:89`) ist in SQL an `status = 'draft'` gebunden. `statementChanges` (`statement-invoices.service.ts:113`) gibt es als `carryOverChanged` weiter und `src/lib/server/statement.ts:178` als `carryOver`. Der Kommentar «the backend says it of a draft only» stimmt also. Der Satz zu den Rechnungen bzw. zum Tankbestand und der Satz zum Übertrag werden wie vorher zusammengefügt, mit `undefined`, wenn beide fehlen. Das Diff hat nichts, was nicht zur Aufgabe gehört. Kein neuer Text, kein neuer Test (es ist ein Refactoring ohne Verhaltensänderung, der bestehende Test `statement-pages.dom.test.ts:624` deckt den Satz zum Übertrag ab).

## Nicht bestätigt

- `bun run fitness` vor dem Fix rot und danach grün, vom Aufrufer gemeldet.
- `src/__tests__/statement-pages.dom.test.ts` (194 bestanden), vom Aufrufer gemeldet.
- E2E chromium, die Szenarien «Neu berechnen» (3 bestanden), vom Aufrufer gemeldet.
- `bun run lint`, `bun run check` und die Commit-Hooks, vom Aufrufer gemeldet.
