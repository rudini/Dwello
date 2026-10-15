# Blog review 2: migrations frozen (delta 8600563..c93bdac)

Reviewer: independent, fresh context. Worktree: `/tmp/claude-0/-home-user-Dwello/31270cf6-5120-5ece-bac9-5cda8f7c3e49/scratchpad/review-migrations-blog-2` (read only).
Delta: `a14ced9 docs(db): close article review findings`, `c93bdac fix(db): close code review findings`.
Article: https://claude.dev/blog/getting-the-most-out-of-opus-5-5/, fetched again with `curl -sL`. The round 1 quotes A1 to A8 are still on the page (checked by grep on the text: "Name the finish line", "Name the stops you want, too", "keep your own check before anything risky or hard to undo", "A list of specific patterns works much better", "Mark anything you couldn't confirm, and say where you looked", "Quote each problem and say where it is").

## Round 1 findings

| ID | Severity (r1) | Status | Evidence |
|----|---------------|--------|----------|
| B-1 | Major | **Fixed** | `docs/data-model.md:403-407` now says "Dwello is installed: every change to the schema or the master data is a new numbered file; a migration on `main` is never edited (`backend/CLAUDE.md`, CI "Migrations unchanged")" and no longer advises `db:reset` for an installation. `docs/anforderungen-vertragsende.md:42` uses the proposed sentence. `grep` for "until the first installation", "solange es keine produktive" over `*.md` outside `docs/archive` and `docs/reviews` finds only the Session 12 row in `docs/design/design-decisions.md:53`, which is dated history next to a newer decision row (the plan line says so on purpose); no contradiction left (A6). |
| B-2 | Minor | **Fixed** | `backend/CLAUDE.md:24`: "To fix a mistake in an applied migration, write a new migration that corrects it; if no new migration can fix it, stop and ask before touching the old file." This names the stop (A2 "Name the stops you want, too"; A3 "Stop and ask only when you can't continue without me"). "and keep going" from my proposal was dropped; the root `CLAUDE.md` already says to keep going while no input is needed, so nothing is lost. |
| B-3 | Minor | **Fixed (adaptation accepted)** | `backend/CLAUDE.md:24`: "adds a row only where it is missing and changes or deletes a seeded row only `WHERE` its columns still hold the seeded values". The adaptation is correct: `categories`, `distribution_keys` and `heating_profiles` have no unique constraint (`backend/migrations/0001_schema.sql:100-150`), so `ON CONFLICT DO NOTHING` would never fire. The change/delete test is now a single checkable pattern (A4 by analogy, A1). Residual point on "missing" see N-1. |
| B-4 | Nit | **Fixed** | `docs/reviews/workflow-rules-review-migrations-frozen.md:7` (W-1) now says the installation "is now recorded in `backend/CLAUDE.md` ("Dwello is installed") and the decision row of 2026-10-15 in `docs/design/design-decisions.md`" (A5). |

## New findings in the delta

### N-1 (Nit): "where it is missing" does not name what identifies a seeded row

Evidence: `backend/CLAUDE.md:24` "adds a row only where it is missing". The master data tables have only a UUID key (`0001_schema.sql:100-117`), so "missing" needs a natural key the rule does not name. For categories the service keeps `name` and `name_de` unique (`backend/src/services/category.service.ts:153-157`, "English and German names identify a category"), so an agent will likely pick `WHERE NOT EXISTS (… name = …)`, but for distribution keys and heating profiles it has to look. Low risk: a wrong pick produces a duplicate row, which a pg test of the migration would show.
Article: A4 by analogy, "A list of specific patterns works much better." (design advice transferred by my judgement, as in round 1).
Proposed: "adds a row only `WHERE NOT EXISTS` a row with the same name (categories: `name`; …)", naming the column per table, or leave as is.

### N-2 (Nit): the plan line claims a confirmation that had not happened yet

Evidence: `implementation_plan.md` (Reviews, first line): "fixed B-1 … B-4 …; no behavior change, confirmed by delta review", committed in c93bdac before this delta review ran. This report now confirms it, so the line becomes true; it should name this report (`migrations-frozen-blogreview-2.md`) as the CLAUDE.md Workflow 7 asks ("name … the delta review's report in the plan line") and add a "round 2" line.
Article: A5, "Mark anything you couldn't confirm, and say where you looked".

### Checked, no finding

- `backend/src/db/migrate.ts:12` refusal: "Eine Installation nicht zurücksetzen (alle Daten gingen verloren), sondern mit der Version starten, mit der sie zuletzt lief." It now names the consequence and the safe alternative instead of only a prohibition, matching A3 ("keep your own check before anything risky or hard to undo"). Tests updated in `migrations.pg.test.ts:54,64`.
- `.github/workflows/ci.yml:82-84`: `--diff-filter=a` (everything but added files) is a stricter, still checkable gate (A1 "Name the finish line"); the error message names the fix ("Put the change into a new numbered file"). The article says nothing further about CI.
- No "think carefully" lines (A7) or requests to reproduce reasoning (A8) in the delta.

## Not confirmed

- I did not run the CI step, the pg tests or bash's `${changed//$'\n'/, }` expansion; I read the diff only (GitHub's `run` defaults to bash on ubuntu, where the expansion is valid).
- I checked for remaining stale copies only with the grep above (`*.md`, excluding `docs/archive` and `docs/reviews`).

## Result

B-1 to B-4 closed. New: N-1 (Nit), N-2 (Nit). No Blocker or Major open.
