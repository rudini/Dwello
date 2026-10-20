# Code-Review Slice C2 (Runde 1): weniger CI pro Änderung, Lauf 634

Bereich: `git diff a50d72e3 e0e3c712` (ein Commit `e0e3c712`), Worktree `review-c2-code`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | implementation_plan.md:9 | Punkt A sagt «pushes to `main` run build, lint and unit tests only». Das stimmt nicht: Fallow läuft bei einem Push weiterhin (ci.yml:257), und die Anforderung verlangt das auch. Der Commit-Text sagt dasselbe Falsche. |

Keine Blocker oder Major.

## Geprüft

- **A, Push auf `main`:** `changes` gibt bei `push` `backend=true`, `app=false` und `ui=false` aus (ci.yml:38-40). Damit wird `e2e-tests` übersprungen. `e2e-results` läuft trotzdem (`!cancelled()`, ein übersprungenes `needs` zählt nicht als Abbruch): `changes.result == success` und danach `app != true` ergibt `exit 0`, beide Checks sind also grün. Build, Lint and types, Unit tests (mit Backend wegen `backend=true`) und Fallow (`github.event.before`) laufen. Deepcheck und ui-screenshots laufen wie bisher nur bei Pull Requests.
- **A, schedule und workflow_dispatch:** Diese Ereignisse fallen in den Zweig `!= pull_request`, also alles `true`: E2E in allen Browsern, axe, Backend-Tests. Fallow wird über das neue `if` übersprungen (es gibt kein `event.before`). «Migrations unchanged» läuft nur bei PRs. `check-issues.mjs` läuft ohne `PR_BODY`/`BASE_REF` wie bisher beim Push (Zeile 36-37 prüft dann nur die Marker). `release.yml` hängt nicht von CI ab.
- **Concurrency:** Die Gruppe `ci-<ref>-<event>` ändert für PRs nichts: ein Ref, ein Ereignis, `cancel-in-progress` bleibt. Auf `main` haben push, schedule und workflow_dispatch je eine eigene Gruppe. Der nächtliche Lauf verdrängt also keinen wartenden Push und wird auch von keinem verdrängt, wie der Kommentar sagt.
- **Matrix:** GitHub wendet `exclude` vor `include` an. Es bleiben e2e 1-5 und a11y 1-3. Die `include`-Einträge passen über `suite` und fügen `shards` hinzu, ohne einen Matrixwert zu überschreiben. Die Job-Namen sind «Accessibility (axe) (1/3)» bis «(3/3)», `--shard=n/3`. `e2e-results` erwartet 3. Die geforderten Namen «E2E tests» und «Accessibility (axe)» bleiben.
- **Lauf 634:** `e2e-results` hat jetzt `fail-fast: false`. Die Schleife `passed=$(gh api …) && break` beendet sich unter `bash -e` nicht, wenn `gh` scheitert, weil das Scheitern Teil einer `&&`-Liste ist. Nach drei Fehlversuchen ist `$passed` nicht gleich `shards`, das ergibt `exit 1`. Das passt zur gemeldeten Simulation.
- **D:** `.claude/skills/pull-request/SKILL.md:19` verlangt, Berichte, Plan und Archiv vor dem ersten Push zu committen. Die Begründung «each later push cancels the CI run in progress» stimmt für PRs (`cancel-in-progress` bei `pull_request`).
- **Docs:** `docs/test-pyramid.md:101-103` und `docs/tech-stack.md:429-439` stimmen mit ci.yml überein: Push ohne E2E/axe, nächtlich 02:17 UTC, axe in 3 Shards, Fallow nicht nächtlich. In anderen Docs, Skills und CLAUDE.md gibt es keine weiteren veralteten Hinweise auf «push to main runs E2E» (grep).
- **Plan und Archiv:** Session C1 steht vollständig abgehakt im Archiv, inklusive PR #473 merged. Session C2 ist die einzige Session im Plan.
- **Tests:** `tools/deepcheck/test/workflows.test.ts` liest ci.yml. Die Job-Schlüssel und der Inhalt von deepcheck/fallow, die es prüft, sind unverändert vorhanden. Szenario: «No scenario: CI only» ist für eine reine CI-Änderung zutreffend. Weder TS- noch Svelte-Dateien noch `messages/` sind geändert.
- **Ponytail:** Der Diff ist minimal. Es gibt keinen ungenutzten Code und keine Kopie eines Helpers. `sleep 15` nach dem dritten Fehlversuch ist harmlos.
- Keine fremden Änderungen im Diff.

## Nicht bestätigt

- actionlint auf ci.yml: vom Aufrufer gemeldet. Ich habe es nicht erneut ausgeführt.
- `bunx vitest run src/__tests__/open-work.test.ts src/__tests__/commit-msg-gate.test.ts tools/deepcheck/test/workflows.test.ts`: vom Aufrufer gemeldet. Mein erneuter Lauf scheiterte, weil `node_modules` des Worktrees auf `/home/user/Dwello/node_modules` verweist und eine Deny-Regel den Zugriff sperrt. Bestätigt habe ich nur durch Lesen, dass die geprüften Stellen in ci.yml unverändert sind.
- Simulation des Retry-Schritts mit falschem `gh`: vom Aufrufer gemeldet. Durch Lesen ist sie plausibel (siehe oben).
- Branch Protection: Ob dort Shard-Checks einzeln verlangt werden (z. B. «Accessibility (axe) (4/5)»), die nach der Änderung nie mehr berichten und PRs blockieren würden, konnte ich nicht prüfen. Die Einstellungen des Repos lagen nicht vor. Vor dem Merge sollten die required checks nachgesehen werden. Dorthin gehört auch, dass «Require branches to be up to date» durch den Product Owner eingeschaltet wird. Ohne diese Einstellung stimmt die Begründung in `docs/test-pyramid.md:102` («was up to date with `main`») nicht.
- Echtes Verhalten von schedule und workflow_dispatch auf GitHub: Das zeigt erst ein Lauf nach dem Merge.
