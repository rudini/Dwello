# Review t16, Runde 1 (Commit 2a4eff3, nur Regeln)

| ID | Schwere | Datei:Zeile | Fund |
|---|---|---|---|
| C-1 | Minor | `.claude/skills/bdd-acceptance/SKILL.md:16` | Die gestrichene Run-Zeile nannte zwei Fakten, die `tests/e2e/CLAUDE.md`, "Run" (`:20`) nicht enthält: Backend und Frontend laufen mit dem JWT-Secret aus `tests/e2e/fixtures/session.ts` und mit einer Google-Anmeldung, die mit Test-Credentials konfiguriert ist. Auch «die Entwicklungsserver und die Entwicklungsdatenbank werden nie berührt» steht dort nicht ausdrücklich (nur indirekt über `dwello_e2e`; ausdrücklich in `README.md:252`). Der Zeiger führt also für diese Punkte an keine Stelle, die sie enthält. Den `docker compose`-Befehl hat T-1 absichtlich gestrichen, das ist in Ordnung. |
| C-2 | Nit | `CLAUDE.md:23` | Der Satz sagt, `tests/e2e/CLAUDE.md` halte die Regel «development database stays untouched». Dort steht sie nur indirekt (eigene Datenbank `dwello_e2e`). Inhaltlich trotzdem richtig. |
| C-3 | Nit | `CLAUDE.md:71`, `.claude/skills/workflow-review/SKILL.md:3`, `:14`, `:16` | Die Abhakregel für «Workflow note» («in a task that writes no note, under "Found"») steht jetzt nur noch im Skill. Laut `description` und «When» lädt man den Skill aber nicht bei Aufgaben, die nur Docs oder Regeln ändern. Gerade für diese Aufgaben gilt die Regel. Der Zeiger «(skill `workflow-review`)» in Schritt 8 «during» löst das Problem nur, wenn das Modell ihm folgt. So verlangt es T-2, darum kein Defekt. |

Kein Blocker, kein Major.

## Geprüfte Hauptfragen

- **tdd/ponytail:** Der gestrichene Satz in «Process» (`CLAUDE.md:49` alt) galt nur für UI-Änderungen. Workflow 2 (`:62`, «load the skill `tdd` before the first test of a slice») und Workflow 3 (`:63`, «load the skill `ponytail` before writing code») verlangen beide Skills weiter für jede Änderung, ohne Einschränkung auf UI. Es geht nichts verloren.
- **Run-Details von bdd-acceptance:** Folgendes steht in `tests/e2e/CLAUDE.md:20`: `dwello_e2e` wird vor jedem Lauf aus den Migrationen neu angelegt, Backend auf 3101, Frontend auf 3100, nur PostgreSQL auf 5432 muss laufen. Was fehlt, steht unter C-1. Die Selektor-Regel (kebab-case, Komponentenkontext, `building-card-{id}`) steht vollständig in «Conventions» (`CLAUDE.md:34`).
- **Bedingungen für Workflow-Notizen:** Die vier Auslöser (unklar, widersprüchlich, Aufwand ohne Nutzen, umgangen) und die Abhakbedingung stehen jetzt in `workflow-review/SKILL.md:16`. Die alte Ladebedingung (App, Tests oder Tooling geändert; Auftrag über mehrere Issues) steht vollständig in der `description` (`:3`). «when it applies» in Schritt 8 «end» verweist damit auf eine Stelle, die die Regel enthält.
- **T-5:** «the next review or push waits until none of its Blockers/Majors is open» (`CLAUDE.md:64`) blockiert weiter den nächsten Review (also auch Schritt 5 und die Closing Round) und jeden Push. Der Merge bleibt über «Done means» (`:55`) blockiert. Der Text widerspricht `slice-review:31` nicht mehr.
- **T-3/T-4:** `CLAUDE.md:57` passt zu Schritt 8 «end» («before the final commit»): Der letzte Commit gehört zum letzten Pull Request.
- **T-6:** Die Preload-Regel steht einmal in `backend/CLAUDE.md:20`, einschliesslich «from a subdirectory Bun skips `bunfig.toml`». `CLAUDE.md:23` und `docs/test-pyramid.md:105` verweisen nur noch darauf.
- **Umfang:** Alle sechs Dateien gehören zum Auftrag. `docs/reviews/opus55-guide-review-4.md` ist die Quelle von T-1 bis T-6. Es gibt keine fremden Formatierungsänderungen.

## Nicht bestätigt

- `bun run lint` und `bunx vitest run tools/deepcheck/test/readme.test.ts tools/claude-hooks/commit-msg-gate.test.ts src/__tests__/open-work.test.ts tools/open-work/check-issues.test.ts`: vom Aufrufer gemeldet. Mein erneuter Lauf im Worktree brach mit `ERR_MODULE_NOT_FOUND` ab, vermutlich weil dort keine Abhängigkeiten installiert sind.
- Ob das Modell `bdd-acceptance` in Schritt 1 tatsächlich lädt, lässt sich nur im Betrieb zeigen. Ich habe nur den Text gelesen.
