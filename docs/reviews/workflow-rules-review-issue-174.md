# Workflow rules review: issue #174 (upload documents to a tenant)

Review of the rules that guided the task (`CLAUDE.md` Workflow step 7). Findings only; no rule, skill, agent or hook was changed.

## W-1: `persona-stack.sh` assumes the clone at `/home/user/Dwello`

- **Rule:** `docs/design/tools/persona-stack.sh:4` (`cd /home/user/Dwello`), named in `CLAUDE.md` Workflow 5.
- **What happened:** this cloud session cloned the repository to `/home/user/dwello` (lower case, the path `add_repo` chose). The script would have failed; a symlink `/home/user/Dwello → /home/user/dwello` worked around it.
- **Proposal:** `cd "$(dirname "$0")/../../.."` (the repository root from the script's place) instead of a fixed path.

## W-2: the session-start hook counts commits behind `main` wrongly in a shallow clone

- **Rule:** `.claude/hooks/session-start.sh:11-15`, `CLAUDE.md` Gotchas «Branches».
- **What happened:** after a resume it reported «801 commits behind origin/main»; the real distance was two merged pull requests (#175, #177). `git rev-list --count HEAD..FETCH_HEAD` counts every commit of `main` the shallow history cannot reach.
- **Proposal:** count with `git rev-list --count $(git merge-base HEAD FETCH_HEAD)..FETCH_HEAD`, or fetch with `--shallow-since` of the merge base first; or say «behind» without a number when the clone is shallow (`git rev-parse --is-shallow-repository`).

## W-3: the fallow duplication gate blocks on code the change only touched

- **Rule:** `CLAUDE.md` Gotchas «Fallow gate» («Fix the reported finding … rather than working around it»).
- **What happened:** adding two lines to `deleteTenant` made fallow report a clone group between the existing active-contract check in `tenant.service.ts` and `apartment.service.ts`, untouched for months. Fixing it meant removing a redundant check outside the task (done, noted in the plan, reviewed). «Surgical changes» and «Stay in scope» pull the other way.
- **Proposal:** say in the gotcha what to do when a finding is in code the change only touches: fix it if small and behaviour-neutral (with a note in the plan), else ask; or let the gate treat a clone group as inherited when neither instance is in the diff's added lines.

## W-4: a glossary term decided in the issue cannot be marked in the same pull request

- **Rule:** `CLAUDE.md` Design-Regeln «Domain terms only from `UBIQUITOUS_LANGUAGE.md` (never edit it); missing terms get `TODO(fachlich prüfen, #<issue>)`»; «Open work»: CI refuses a PR that closes an issue a marker still names.
- **What happened:** the product owner decided the new term «Hochgeladenes Dokument» in #174 itself. A marker naming #174 would block the PR that closes it; a new issue only for the glossary entry would duplicate a decision already taken. The fach-reviewer rated it Major (F-1) and the merge waits for the product owner's glossary edit.
- **Proposal:** when an issue's «Decided» section fixes a term, let the task finish with the glossary edit listed under «Blocked on me» (as now) and say so in the rule; or allow the agent to add a glossary row the product owner has decided verbatim in an issue, quoting the issue.

## W-5: screen states need an entry in `stateMeanings`, which the Process rule does not name

- **Rule:** `CLAUDE.md` Design-Regeln «Process» names `tests/a11y/screens.json`, `accessibility.feature` and `sprachen-bildschirme.feature`.
- **What happened:** two new states failed `tests/unit/a11y-screens.test.ts` («nennt nur Zustände mit festgelegter Bedeutung») until they had a line in `screens.json` → `stateMeanings`.
- **Proposal:** add «and a meaning in `stateMeanings`» to the Process rule.

## W-6: French guillemets need non-breaking spaces; the rule lives only in a test

- **Rule:** `CLAUDE.md` Conventions «UI languages» (formal address, verbs, Swiss terms); `src/__tests__/i18n.test.ts`.
- **What happened:** new French texts with «␣…␣» failed the guard in the full coverage run; the convention is not written anywhere a writer reads first.
- **Proposal:** add to the «UI languages» bullet: «French guillemets with U+00A0 inside (« … »)», or a line in `docs/design/i18n-begriffe.md`.

## W-7: failing a form action in a scenario is not described

- **Rule:** `tests/e2e/CLAUDE.md` «Failure states» (`FailRequests.to(path, query)`).
- **What happened:** a SvelteKit form action is posted to `/<page>?/<action>`; it matches `FailRequests.to('/tenants/<id>', { '/upload': '' })`, found by reading `interactions.ts`. It works, but nothing says how to name an action.
- **Proposal:** one example line in «Failure states»: a form action `?/upload` is the query key `/upload` with the value `''`.

## W-8: reviewers cannot read installed library sources

- **Rule:** the session's permissions (not a repository file); `CLAUDE.md` Workflow 6 asks to check a finding's evidence.
- **What happened:** reading `node_modules/@sveltejs/kit` (why the focus moves to the page after a form action) and `node_modules/@sveltejs/adapter-node` (unit of `BODY_SIZE_LIMIT`) was denied to me and to the fach-reviewer; both points were settled by tests and documentation instead. Persona Anna's first attempt to print a page with tenant names was denied as handling personal data, although the data is the demo's.
- **Proposal:** allow read-only access to `node_modules` in `.claude/settings.json`; say in `docs/design/personas/README.md` that the demo data is invented, so persona output may contain it.

## W-9: the stop hook outside the repository repeats a request the workflow forbids

- **Rule:** `CLAUDE.md` Workflow 9 (its last paragraph already says the hook does not override it).
- **What happened:** the hook asked four times to commit and push while reviews were running; each time the answer was the same.
- **Proposal:** none in the repository; the existing sentence was enough to decide. Noted because it cost turns.
