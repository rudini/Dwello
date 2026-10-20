# Contributing to Dwello

Thank you for helping. Dwello is a web app for Swiss private landlords; this page says how a change gets in. The full
rules, written for the maintainer and the AI agents that work on the code, are in [`CLAUDE.md`](CLAUDE.md); this is the
short version for people.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Security problems are not reported as issues:
see [`SECURITY.md`](SECURITY.md).

## Before you start

- **Open or pick an issue first**, for anything beyond a typo. Use a template; a change to domain rules (amounts,
  Nebenkostenabrechnungen, legal texts, domain terms) needs the product owner's decision in the issue before code is
  written. Issues with `entscheiden` are waiting for that decision; `good first issue` and `help wanted` are open for you.
- Comment on the issue that you take it, so nobody else works on it in parallel.

## Set up

Bun, Node 22 and PostgreSQL on `localhost:5432` (user and password `dwello`); the steps are in the
[README](README.md#quick-start).

```bash
bun install && (cd backend && bun install)
cd backend && bun run dev:demo   # backend with demo data
bun run dev                      # frontend, in a second terminal
```

## Making the change

- **Acceptance test first:** a user-visible change starts with a German scenario in `tests/e2e/features/*.feature`
  ([`tests/e2e/CLAUDE.md`](tests/e2e/CLAUDE.md)); then tests and code, test first ([`docs/test-pyramid.md`](docs/test-pyramid.md)).
- **Languages:** code, comments, commits and the pull request in English; UI texts, scenarios and test names in German
  (Swiss spelling, "ss", formal "Sie").
- **UI texts** live in `messages/{de,fr,it,en}.json`; every new or changed text goes into all four files. Unsure
  of a translation? Say so in the pull request.
- **Domain terms** come from [`UBIQUITOUS_LANGUAGE.md`](UBIQUITOUS_LANGUAGE.md).
- **Design:** only the tokens in [`docs/design/token-referenz.md`](docs/design/token-referenz.md) and the components in
  `src/lib/ui`; no raw colours or arbitrary values. `src/__tests__/design-guard.test.ts` enforces it.
- **Test selectors:** `data-testid` in kebab-case with context (`tenant-name-input`).
- **API changes** update their contract in `tests/contracts/*.json`.
- **Migrations:** never edit an applied one; add a new numbered file in `backend/migrations`.
- **Formatting:** new files under `src/` are Prettier-clean (`bunx prettier --write <file>`); in an existing file, format
  only your own lines.
- Keep the change small and about one issue.

## Commits

[Conventional Commits](https://www.conventionalcommits.org): `<type>(<scope>): <subject>`, at most 50 characters,
imperative, no period, for example `fix(tenants): keep the name after a failed save`. The allowed types and scopes
are listed in `CLAUDE.md`, "Conventions"; CI checks every commit. Check a subject before committing:

```bash
node .claude/hooks/commit-msg-gate.mjs --check "fix(tenants): keep the name after a failed save"
```

## Before you open the pull request

```bash
bun run lint && bun run check
bunx vitest run --changed origin/main
cd backend && bun run type-check && bun run test
bun run test:e2e        # the scenarios your change touches
```

Then open the pull request with the template, name the issue it closes (`Closes #n`) and add screenshots for UI
changes. CI runs the full suites, the coverage floors and the static checks (Fallow, deepcheck); a pull request is
merged when CI is green and the maintainer approved it.

## License

Dwello is licensed under the [AGPL-3.0-or-later](LICENSE). By contributing you agree that your contribution is
licensed under the same terms.
