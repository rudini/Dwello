# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: subagent models (no issue)

Request: pin `code-reviewer` and `fach-reviewer` to Opus, move `persona` (and `daten-pruefer` if a benchmark shows no loss) to Sonnet, benchmark first. Changes only agent definitions and docs: no scenario, no `code-reviewer` round (`.claude/agents/` is not code in Workflow 6), no workflow review (Workflow 7: not for a task that changes only rules).

- [ ] Benchmark A: `daten-pruefer` Opus vs Sonnet on `cbbaafa` (#137; known D-1 Major, D-2, D-3 Minor)
- [ ] Benchmark B: persona Dr. Weber Opus vs Sonnet on `cf49fa5` (#226; known P-1 Major, P-2, P-3 Minor, P-4 Nit)
- [ ] Benchmark C: persona Marco Opus vs Sonnet on `70fbc67` (#233; known P-1..P-5 Minor, P-6, P-7 Nit)
- [ ] Benchmark report `docs/reviews/agent-models-benchmark.md` with the runs' reports
- [ ] `model:` in `.claude/agents/*.md` as the benchmark decides
- [ ] Before marking complete (CLAUDE.md), push, pull request, CI, merge
