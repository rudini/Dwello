# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 2026-10-17: default KI model qwen3-vl:8b-instruct (#419)

- [x] Default model `qwen3-vl:8b-instruct` in `backend/src/config/llm.ts`, `.env.example`, Compose files, README, demo README, `docs/tech-stack.md`, `docs/PRD-Dwello.md`
- [x] README: upgrade note for installations that relied on the old default
- [x] `backend/CLAUDE.md`: `llm:eval` through OpenRouter counts as the default model's run
- [x] `llm:eval` with the new default through OpenRouter (baseline 43/47, #415): the run of #415 measured this model on unchanged prompts; no new run
- [x] Manual check: reading of a sample invoice through OpenRouter with the new model: a quarterly invoice and a Schlussrechnung with two deducted Akontorechnungen, every field right (amount 1'250.00 before the deduction, deducted 500.00), about 7 s each
- [ ] Lint, check, type-check, affected tests; `code-reviewer`
- [ ] Session to the archive; pull request
- Files: `backend/src/config/llm.ts`, `.env.example`, `docker-compose.dev.yml`, `docker-compose.prod.yml`, `README.md`, `deploy/demo/README.md`, `docs/tech-stack.md`, `docs/PRD-Dwello.md`, `backend/CLAUDE.md`
