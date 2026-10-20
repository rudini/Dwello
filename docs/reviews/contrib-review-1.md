# Review contributor files and PR checks, Runde 1 (fc77921)

Worktree: `review-contrib-code` (detached an fc77921), Diff `git diff origin/main fc77921`, alle 11 Dateien gelesen.

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | `.github/CODEOWNERS:1` | Der Kommentar sagt, mit «Require review from Code Owners» brauche jeder Pull Request das Review des Maintainers. Es gibt nur einen Code Owner (`@rudini`), und GitHub lässt Autoren ihren eigenen Pull Request nicht freigeben. Mit dieser Regel bleiben die eigenen Pull Requests des Maintainers (auch die der Claude-Sessions unter seinem Konto, die der Skill `pull-request` selbst mergt) blockiert, ausser er steht auf der Bypass-Liste des Rulesets. Der Kommentar empfiehlt eine Einstellung, die so den eigenen Merge-Ablauf blockiert, und nennt die Ausnahme nicht. |
| C-2 | Minor | `CODE_OF_CONDUCT.md:40` | Als Meldeweg steht «by a private message (the contact on the GitHub profile)». GitHub hat keine privaten Nachrichten, und ob das Profil einen Kontakt zeigt, ist ausserhalb des Repos nicht festgelegt. Damit gibt es für Meldungen keinen sicheren Kanal (README «Contact» nennt nur einen Namen). Eine E-Mail-Adresse oder ein anderer Kanal, den es wirklich gibt, fehlt. |

Keine Blocker, keine Major.

Geprüft: Schritt «Commit subjects» (Bash mit Process Substitution, `--no-merges` lässt den synthetischen Merge-Commit `HEAD` und Merges von `main` aus, `fetch-depth: 0` ist im Job gesetzt, `node` ist vor dem Schritt eingerichtet, die Ausnahme für Dependabot über `pull_request.user.login` ist nicht fälschbar, Exit-Codes von `commit-msg-gate.mjs --check` 0/2); Schritt «Prettier on new files» (eigener Trockenlauf über diesen Commit und `.github/dependabot.yml`: Exit 0; `.prettierignore` begrenzt auf `src/`, ignorierte explizite Pfade passen); Fork-PRs (nur Lese-Token nötig, `ui-screenshots` schliesst Forks schon aus, CI nutzt keine `secrets.*`); Job `dependency-review` (Bedingung `!repository.private`, ein übersprungener Job zählt als erfolgreich); `dependabot.yml` (`bun` mit `bun.lock` in `/` und `backend/`, `directories`, Dockerfiles in `/` und `backend/`, Präfixe `chore(build|ci|docker)` sind erlaubte Scopes, Dependabot setzt nach `)` einen Doppelpunkt); `CONTRIBUTING.md` gegen das Repo (Anker `#quick-start`, `dev:demo`, `type-check`, `test`, `design-guard.test.ts`, `commit-msg-gate.mjs --check`, die Labels `good first issue`/`help wanted`/`entscheiden` gibt es im Repo); PR-Vorlage (keine Checkboxen, «No scenario» + «:» getrennt, `check-issues.mjs` braucht `#\d+`); ponytail-review: nichts zu kürzen; keine App-Änderung, also kein Szenario, keine Texte und keine a11y-Einträge nötig.

## Nicht bestätigt

- `bun run lint`, YAML-Parse von `ci.yml`, `dependabot.yml`, `bug.yml`, `config.yml`, `bunx vitest run tools/deepcheck/test/workflows.test.ts src/__tests__/open-work.test.ts tools/claude-hooks/commit-msg-gate.test.ts tools/ci` (39 bestanden) und der Trockenlauf des Commit-Schritts über `origin/main~40..origin/main`: vom Aufrufer gemeldet (selbst nur den Prettier-Schritt auf fc77921 nachgeprüft).
- Ob GitHub `.github/dependabot.yml` annimmt (Ecosystem `bun`, `directories`): lässt sich nur auf GitHub prüfen; nach der Dokumentation, die ich kenne, gültig.
- `SECURITY.md` und `config.yml` verweisen auf «Report a vulnerability» bzw. `/security/advisories/new`. Das gibt es erst, wenn Private Vulnerability Reporting in den Repo-Einstellungen eingeschaltet ist (das Repo ist laut `gh api` noch privat). Nicht im Repo prüfbar.
- Das Ruleset (Code-Owner-Review, Pflicht-Checks) ist eine Einstellung auf GitHub, nicht im Diff; in den Repo-Einstellungen ist Squash-Merge noch erlaubt (`allow_squash_merge: true`). Der Wegfall des PR-Titel-Checks gilt nur, solange niemand squasht.
