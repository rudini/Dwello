# Review Slice 1245, Runde 1 (`origin/main..3c7a8ae`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Ponytail-review: Lean already. Ship.

Geprüft: `tools/ci/ui-screenshots.test.ts` (einzige Datei im Diff) gegen `.github/workflows/ci.yml:520-522` (Schritt «Take screenshots» enthält `bunx svelte-kit sync && bunx playwright test -c playwright.screenshots.config.ts`); der Test wird ohne `svelte-kit sync && ` rot (Regex verlangt die Folge in derselben Zeile; fehlt die Zeile ganz, scheitert `toMatch` auf `undefined`); liegt unter `tools/**/*.test.ts` (in `vitest.config.ts` eingeschlossen); Testtitel deutsch und sagt, was geprüft wird; Commit-Betreff 46 Zeichen, Typ/Scope zulässig; keine Workflow-, UI-, Text- oder Szenarioänderung, also keine Pflicht für `messages/*.json`, `screens.json` oder ein Feature (`No scenario: CI only` passt). Ursachenbefund plausibel: `backend/scripts/llm-stub.ts:203` liefert bei `LLM_STUB_PULL=fail` genau `no space left on device`, `backend/src/services/ki-model.service.ts:59` loggt es; `src/lib/server/statement-generation.ts:1-5` importiert `$lib/...`, das ohne `svelte-kit sync` nicht aufgelöst wird.

## Nicht bestätigt

- Dass «UI screenshots» auf Pull Requests seit 4b7af7c wieder grün läuft (Job 128843243285, Ausfallfenster 04:05–05:28 UTC am 2026-11-08): keine CI-Läufe eingesehen, nur `git log -1 4b7af7c` («fix(ci): sync SvelteKit before UI screenshots») und den Workflow-Text.
- Dass `tests/ui-screenshots/screenshots.spec.ts` über seine Importkette tatsächlich `statement-generation.ts` erreicht: Kette nicht vollständig verfolgt (direkte `$lib`-Importe in `tests/ui-screenshots` nicht gefunden; der Weg läuft vermutlich über Fixtures/BFF-Code).
- Commit-Text nennt den Test «pins kept behaviour», obwohl 4b7af7c ein Bugfix ist; da der Rot-Lauf laut Aufrufer trotzdem gesehen wurde, ohne Folge.
- Vom Aufrufer gemeldet: `bun run lint` grün; `bunx vitest run tools/ci` 64/64 grün; neuer Test rot ohne `svelte-kit sync && ` in ci.yml, grün mit; Prettier-Check der neuen Datei grün.
