# Workflow notes: contributor files and PR checks

| Rule | What happened | Proposed change |
|---|---|---|
| `src/__tests__/open-work.test.ts`, "führt keine Checkliste ausserhalb des Plans" | The new `.github/pull_request_template.md` failed it with a `- [ ]` checklist; the template now lists the checks as plain bullets. | Exempt `.github/pull_request_template.md`: a template checklist is filled per pull request and is no open work. |
| Skill `pull-request`, "Open and drive" (sessions merge their own pull request) | A ruleset with "Require review from Code Owners" (the suggested setup for contributors, `.github/CODEOWNERS`) blocks a pull request the maintainer's account opened, since nobody approves their own. | Say in the skill that the maintainer's account is on the ruleset's bypass list, or that such a merge waits for the product owner. |
| `CLAUDE.md`, Conventions: Commits (50 characters) | Six subjects on `main` have 51 to 53 characters; they were committed with `-F` or a heredoc the hook does not read. CI now checks every subject of a pull request. | None; the CI step closes the gap. |
