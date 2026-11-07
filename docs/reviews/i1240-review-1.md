# Review #1240, Runde 1: Schnelle CI-Checks in einem Job (`origin/main..6d42916`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `.claude/skills/commit-gates/SKILL.md:22`, `:26` | Nennt noch «CI runs the same check (job "Deep modules")» und «(job "Test checks")». Diese Jobs gibt es nach dem Diff nicht mehr, es sind jetzt Schritte des Jobs «Lint and types». Die Commit-Message sagt, die Doku zu den alten Jobs sei nachgeführt. Diese Stelle wurde aber übersehen, und Agenten lesen sie beim Commit-Gate. |
| C-2 | Minor | `docs/tech-stack.md:436`, `:441` | Die Tabelle «CI/CD Pipeline», Spalte «Job», führt «Fallow audit» weiter als eigenen Job, und «Lint and types» nennt nur lint/check/type-check. Beides stimmt nach dem Diff nicht mehr. Fallow muss als Zeile weg und in die Zeile «Lint and types». |

Keine Blocker oder Majors.

Geprüft: Für jeden verschobenen Check sind die Bedingungen pro Ereignis gleich geblieben. Fallow läuft wie vorher auf `pull_request`/`push`, fitness auf allen vier Ereignissen mit demselben `case`, deepcheck und testcheck nur auf `pull_request`. Der Job `static-checks` hat kein eigenes `if`. Gleich geblieben sind auch Befehle, `fetch-depth: 0`, Node-Setup, Installation und `svelte-kit sync`. Die Rechte sind nur um `issues/pull-requests: read` gewachsen, die der Job schon hatte und die zum Lesen reichen.

Das Schrittmuster `!cancelled() && steps.deps.outcome == 'success'` lässt jeden Check auch nach einem fehlgeschlagenen anderen laufen. Die Bedingung hängt nur am Ergebnis von `deps`, nicht am Jobstatus. Schlägt die Installation fehl, wird `deps` übersprungen und alle Checks mit ihm, der Job wird trotzdem rot. «Failed checks» filtert `toJSON(steps)`, dort stehen nur Schritte mit `id`. Gelesen ist es richtig, und `<<<` läuft in der Standard-Shell bash.

Von den entfernten Job-IDs hängen nur die `needs` von `ci-duration` und `main-status` ab. `main-status` erkennt eine fehlgeschlagene Fallow- oder Fitness-Prüfung über `static-checks` weiter. `docs-only-since.mjs`, der Rest der Workflows und andere Tests lesen keine Jobnamen.

Die Tests `workflows.test.ts` und `wiring.test.ts` schlagen auf dem Basis-Commit fehl. Die Zählung prüft: elf geschützte Schritte plus «Failed checks» ergeben zwölf. Nach `ponytail-review` gibt es keinen Befund: `deps` als Ankerschritt und «Failed checks» verlangt die Anforderung, «each still reports its own failure in the summary».

## Nicht bestätigt

- Ob «Fallow audit», «Architecture fitness», «Deep modules» oder «Test checks» im Ruleset von `main` als Required Check stehen, konnte ich nicht prüfen. Ohne Zugriff auf das Ruleset ist das offen, und der Aufrufer meldet API 403. Stehen sie dort, wartet jeder Pull Request ewig auf diese Checks. Anforderungszeile 2 hängt deshalb am Text des Pull Requests, der nicht im Diff liegt. Dieser Text muss die vier wegfallenden Namen und «Lint and types» als Ersatz nennen.
- Ein echter GitHub-Actions-Lauf fehlt: Wird `toJSON(steps)` gefüllt, wird «Failed checks» im Summary angezeigt, ist actionlint grün? Kein Runner, actionlint nicht verfügbar. Gelesen habe ich nur `.github/workflows/ci.yml:146-254`.
- Die Wanduhrzeit (T1, Ziel 15 min) ist nicht gemessen. Die Checks laufen jetzt nacheinander in einem Job statt parallel. Ob «Lint and types» damit länger braucht als die E2E-Shards, zeigt erst ein Lauf.
- Vom Aufrufer gemeldet: `bunx vitest run tools/deepcheck/test tools/testcheck/test src/__tests__/open-work.test.ts` (235 Tests), `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, Prettier auf neuen Dateien (keine), YAML-Parse mit python yaml, jq-Filter auf Beispiel-JSON, neue Tests vor der Änderung rot gesehen.
