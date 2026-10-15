# Blog review 1: migrations frozen (origin/main..8600563)

Reviewer: independent, fresh context. Worktree: `/tmp/claude-0/-home-user-Dwello/31270cf6-5120-5ece-bac9-5cda8f7c3e49/scratchpad/review-migrations-blog` (read only).
Commits: `dd10ec0 fix(db): keep applied migrations unchanged`, `8600563 docs(db): add workflow review on migrations`.

## Step 1: the article

Source: https://claude.dev/blog/getting-the-most-out-of-opus-5-5/ ("Getting the most out of Opus 5.5 in Claude and Claude Code", Addy Osmani, 2026-09-22). WebFetch returned only a summary, so the page was fetched with `curl -sL` and converted to text; the quotes below come from that text.

The recommendations that apply to written rules for agents:

| # | Section | Quote |
|---|---------|-------|
| A1 | 1. How to ask / "Say what 'done' looks like, then let it run" | "Give the whole task in one message. Name the finish line, like 'the tests pass' or 'every endpoint is migrated.'" ... "With a clear finish line, it knows when it's done." |
| A2 | 2. Steering a long run / "Tell it which stops you want" | "Put a short rule in your CLAUDE.md file about when to stop and ask, and when to keep going." ... "It follows instructions that name these stops. Name the stops you want, too." |
| A3 | same section | "Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside this repository." / "A rule to keep going means fewer stops, so keep your own check before anything risky or hard to undo." / "Keep permission prompts on for destructive commands too." |
| A4 | 1. How to ask / "For design work, name the styles you don't want" | "A general instruction like 'avoid a generic look' mostly swaps one default for another. A list of specific patterns works much better." |
| A5 | 3. Checking the result / "Ask it to mark what it couldn't confirm" | "Mark anything you couldn't confirm, and say where you looked" |
| A6 | 4. In Claude apps / "Ask it to check a long document" | "Check this deck for anything that contradicts itself: numbers, dates and names. Quote each problem and say where it is." |
| A7 | 1. How to ask / "Stop telling it to 'think hard'" | "Remove 'think carefully,' 'think step by step,' and similar lines from your prompts and your saved instructions." |
| A8 | 5. When a message is flagged | "Remove requests to reproduce its internal reasoning in the reply from your prompts and instructions." |

What the article does **not** cover: it says nothing about stating the reason ("the why") behind a rule, about positive versus negative phrasing, or about rule length or format in general. A4 (specific patterns beat general instructions) is given for design work; I apply it by analogy only where noted. Findings below rely only on A1 to A8; nothing is reported on the grounds of "why" or phrasing polarity.

Checks with no finding: the changed lines contain no "think carefully" lines (A7) and no request to show reasoning (A8). The rule in `backend/CLAUDE.md:24` names the prohibited actions specifically ("edited, renamed, deleted or merged into a new baseline"), which matches A4, and it names a checkable gate (CI "Migrations unchanged"), which matches A1. `db:reset` refuses non-local hosts and the refusal texts in `migrate.ts` now separate local databases from installations, which matches A3 ("keep your own check before anything risky"). The CI job checks out with `fetch-depth: 0` (`.github/workflows/ci.yml:65`), so the three-dot diff against the base branch works.

## Step 2: findings

### B-1 (Major): `docs/data-model.md` still allows editing `0001`/`0002` "until the first installation"

Evidence: `docs/data-model.md:405-407`: "Until the first installation, changes go into these two files (baselines of October 2026, last merged in session 12); afterwards a schema change is a new numbered file." Root `CLAUDE.md` lists `docs/data-model.md` under "Documentation (read when relevant)", and `backend/CLAUDE.md:24` itself tells the agent to update `docs/data-model.md` with every schema change, so an agent working on a migration reads both. The change rewrote the same rule in `backend/CLAUDE.md`, `README.md` and `design-decisions.md` but left this copy. It now contradicts `backend/CLAUDE.md:24` and leaves open whether "the first installation" has happened, which is the gap W-1 says caused the three edits on 2026-10-14. CI would catch an edit, but only after the agent has done the work.
Also stale, but lower risk because it describes the past: `docs/anforderungen-vertragsende.md:42` ("Eine Datenmigration ist nicht nötig, solange es keine produktive Datenbank gibt; die Spalte kommt in `0001_schema.sql`").

Article basis: A6 ("Check this deck for anything that contradicts itself ... Quote each problem and say where it is."), and A1: with two documents that disagree, the agent has no single finish line for the question "which file do I change?".

Proposed replacement for `docs/data-model.md:403-407`:

> `src/db/migrate.ts` applies the `.sql` files in file order, each in its own transaction, and records them in
> `schema_migrations`. It refuses a database that was set up without this table, or one that has records of
> migrations that no longer exist (databases from before the October 2026 baseline); set up a local one anew with
> `bun run db:reset`, never an installation (it deletes all records). Dwello is installed: every change to the schema or
> the master data is a new numbered file; a migration on `main` is never edited (`backend/CLAUDE.md`, CI "Migrations unchanged").

and in `docs/anforderungen-vertragsende.md:42`, replace "Eine Datenmigration ist nicht nötig, solange es keine produktive Datenbank gibt; die Spalte kommt in `0001_schema.sql`." with "Die Spalte kam vor der ersten Installation in `0001_schema.sql`; seither braucht jede solche Änderung eine neue Migration (`backend/CLAUDE.md`)."

### B-2 (Minor): the rule names what is forbidden but not what to do when a change seems to need an edit of an applied migration

Evidence: `backend/CLAUDE.md:24`: "A migration on `main` is never edited, renamed, deleted or merged into a new baseline ... CI ("Migrations unchanged") refuses a pull request that does." The typical temptation is a bug in an applied migration: a wrong seed value in `0002_stammdaten.sql`, or a constraint in `0001_schema.sql` that turns out to be wrong. The rule does not say whether the agent writes a corrective migration and continues, or stops and asks. The CI gate has no override, so an agent that decides an edit is necessary gets stuck at the pull request instead of asking early.

Article basis: A2 ("It follows instructions that name these stops. Name the stops you want, too.") and A3 ("Stop and ask only when you can't continue without me ...").

Proposed text, appended after "CI ("Migrations unchanged") refuses a pull request that does.":

> To fix a mistake in an applied migration, write a new migration that corrects it and keep going; if no new migration can fix it (the old one fails on an empty database, for example), stop and ask before you change the old file.

### B-3 (Minor): "leaves rows the landlord changed as they are" gives no way to tell which rows those are

Evidence: `backend/CLAUDE.md:24`: "A master data migration leaves rows the landlord changed as they are." The landlord can change categories, distribution keys and heating profiles (`backend/src/services/category.service.ts`, `distribution-key.service.ts`, `heating-profile.service.ts`), and the tables have `updated_at` columns, but no column marks a row as changed by the landlord, and the rule does not say how a migration should tell. An agent has to invent the test (compare with the seeded values? `updated_at > created_at`?), and two runs may pick different ones. No test or check verifies the rule.

Article basis: A4 by analogy ("A general instruction ... mostly swaps one default for another. A list of specific patterns works much better.") and A1 (a rule the agent can check has a clear finish line). The article gives this advice for design prompts, not for data rules; the transfer is my judgement.

Proposed replacement:

> A master data migration adds rows with `ON CONFLICT DO NOTHING` and updates or deletes a seeded row only `WHERE` all its columns still hold the values seeded for it, so a row the landlord changed stays as it is.

(If the team prefers another test, name that one. The point is to name a single test the agent can write.)

### B-4 (Nit): the workflow review does not name who records the installation in this task

Evidence: `docs/reviews/workflow-rules-review-migrations-frozen.md:7` (W-1) proposes that "Rules that end with an outside event should name who records the event and where". The new rule in `backend/CLAUDE.md:24` ("Dwello is installed") follows that proposal, but the review does not say what records the installation now (the decision row of 2026-10-15 in `docs/design/design-decisions.md`), so a reader cannot check that W-1 is met.

Article basis: A5 ("Mark anything you couldn't confirm, and say where you looked").

Proposed addition to the W-1 "What happened" cell: "Now recorded in `backend/CLAUDE.md` ("Dwello is installed") and the decision row of 2026-10-15 in `docs/design/design-decisions.md`."

## Not confirmed

- I did not run the CI step. I read `.github/workflows/ci.yml:79-86` and the checkout depth only. The plan (`implementation_plan.md`) reports a local red/green check of the step, which I did not repeat.
- I searched for other copies of the old rule with `grep -i "migrat|db:reset|baseline|first installation"` over the root and e2e `CLAUDE.md`, `.claude/agents`, `.claude/skills/*/SKILL.md` and `docs/*.md` (not `docs/archive`). B-1 lists every stale copy that search found.
