# Code-Review: Workflow-Regeln aus den Reviews angewendet (Runde 3, Delta)

Geprüft: Worktree `review-rules-r3`, Commit `100b8c3` (detached), Delta `git diff 3d41a3a 100b8c3`, 8 Dateien, alle gelesen. Grundlage: `docs/reviews/workflow-rules-apply-review-2.md` (C-19 bis C-25). Massstab: `opus-guidance.md`. Gelesen dazu: `.claude/hooks/commit-msg-gate.mjs` (ganz), `tools/claude-hooks/commit-msg-gate.test.ts:1-70`, `tools/deepcheck/test/helpers.ts:7-34`, `src/__tests__/design-guard.test.ts:1-115`, `src/lib/server/statement.ts:95-115`, `docs/design/token-referenz.md:1-3`, `tests/e2e/CLAUDE.md:16`, `.claude/agents/code-reviewer.md:16`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-26 | Nit | `src/__tests__/design-guard.test.ts:23-26` | Die neue Regel «Farbe im style-Element» erfasst nur Eigenschaften, die auf `color`/`background` enden. Kurzformen mit einer Farbe gehen durch: `<style>a{border: 1px solid red}</style>` und `outline: 2px solid red` ergeben keinen Befund (nachgestellt mit der Regex). `background: red`, `outline-color: red`, `border-top-color: red` werden erkannt |
| C-27 | Nit | `src/__tests__/design-guard.test.ts:25` | Die Ausnahmeliste kennt nur `CanvasText`, `Canvas`, `LinkText`, `currentColor`, `inherit`, `transparent`. `token-referenz.md:3` erlaubt aber «only the browser's system colours». Andere Systemfarben (`ButtonText`, `GrayText`, `Field`) und Nicht-Farben (`background: none`, `border-color: var(--x)`) werden als Befund gemeldet (nachgestellt). Heute trifft das keine Datei, weil nur `statement.ts:109` ein `<style>`-Element hat |

Keine Blocker/Major.

## Gezielt geprüft

- **Design-Guard, neue Regel:** `statement.ts:109-112` (`color: CanvasText`) besteht. Die Regex findet auch eine zweite, verbotene Deklaration nach einer erlaubten (`a{color:CanvasText} b{color:navy}`), dazu ein zweites `<style>`-Element nach anderem Markup. `color-scheme: light dark` wird nicht erfasst. `grep -rn "<style" src` (ohne `__tests__`) findet nur `statement.ts:109`. Svelte-Komponenten haben kein `<style>`-Element, also gibt es dort heute keine Fehltreffer. Die rote Phase stimmt: Ohne die neue Regel greift für `a { color: red }` keine andere Regel (die Palettenregel braucht einen Bindestrich vor `red`).
- **C-20, Mutation:** Den Hook in ein Scratch-Repository kopiert und `!repository ||` entfernt, cwd ausserhalb jedes Repositorys, Betreff `bad.`. Original: Status 2, Mutant: Status 0. Der neue Test erkennt die Mutation also. (Ein erster Versuch mit einem cwd *im* Scratch-Repository war ungültig und wurde wiederholt.)
- **C-24, `stdout?.trim()`:** Hook mit `PATH=/nonexistent` ausgeführt. Er stürzt nicht mehr ab, sondern blockiert `git commit -m bad.` (Status 2): `project` und `repository` sind `undefined`, `!repository` greift. Das ist die sichere Richtung. Ohne `git` läuft ohnehin kein Commit.
- **«code» in Schritt 6 und 9:** In Schritt 6 ist «code» jetzt `src/`, `backend/src/`, `backend/migrations/`, `messages/`, `tests/`, `tools/`, `.claude/hooks/`. Schritt 9 verweist mit «code (as in step 6)» darauf. Die Regel ist widerspruchsfrei. Schritt 3 und `code-reviewer.md:16` («a slice that changes code») verwenden dasselbe Wort ohne Verweis, lassen sich aber im selben Sinn lesen. Kein Befund.
- **Schritt 1:** Die Ausnahme «written with the code … taking the code out» ist entfernt. Der neue Klammersatz passt zu `tests/e2e/CLAUDE.md:16` («a step waiting for a missing element fails after 10 s»). Keine andere Regel verweist auf die alte Ausnahme (`grep` in `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `docs/test-pyramid.md`, `.claude/skills`, `.claude/agents`).
- **`backend/CLAUDE.md:18`:** stimmt jetzt mit `CLAUDE.md:54` überein (nur `proposeAllocability`).

## Status C-19 bis C-25

| ID | Status | Beleg |
|---|---|---|
| C-19 (Minor) | behoben | `backend/CLAUDE.md:18` nennt nur `proposeAllocability`, wie `CLAUDE.md:54` |
| C-20 (Minor) | behoben | Test «checks a commit whose directory is no repository» (`commit-msg-gate.test.ts:63-65`). Mutation nachgestellt: der Test wird rot |
| C-21 (Minor) | behoben | `CLAUDE.md:53`: Die Ausnahme ist entfernt, die Schritte kommen ohne Ausnahme vor dem Code |
| C-22 (Minor) | behoben | `CLAUDE.md:67` schliesst `tests/`, `tools/`, `.claude/hooks/` ein, `CLAUDE.md:73` verweist darauf |
| C-23 (Minor) | behoben | Regel «Farbe im style-Element» (`design-guard.test.ts:23-26`) mit Positiv- und Negativfall. Die Zusammenfassung (`workflow-rules-findings-summary.md:45`) führt 125 R-2 ganz als angewendet, die Ablehnungszeile ist entfernt. Lücken am Rand: C-26, C-27 |
| C-24 (Nit) | behoben | `commit-msg-gate.mjs:15` `stdout?.trim()`, ohne `git` nachgestellt: kein Absturz, Commit blockiert |
| C-25 (Nit) | behoben | `implementation_plan.md:15` nennt 2442, wie der Aufrufer meldet |

## Nicht bestätigt

- **Vom Aufrufer gemeldet, nicht wiederholt:** `bun run lint` (0), `bun run check` (0), `bun run deepcheck:audit` (still), `bunx fallow audit` (keine Befunde), `bun run test:coverage` (152 Dateien, 2442 Tests grün).
- **Selbst wiederholt:** `bunx vitest run src/__tests__/design-guard.test.ts tools/claude-hooks/commit-msg-gate.test.ts`: 2 Dateien, 395 Tests grün.
- **Rote Phase von C-23 und C-20** laut `implementation_plan.md`: C-20 durch die Mutation oben bestätigt. C-23 nur durch Lesen bestätigt (keine andere Regel greift auf das Beispiel), der Test wurde ohne die Regel nicht ausgeführt.

Urteil: mergebar. C-19 bis C-25 sind behoben, das Delta bringt keine Blocker/Major, nur die Nits C-26 und C-27.
