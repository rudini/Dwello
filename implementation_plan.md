# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-17: KI timeouts for installations without a GPU (#419, product owner: 120 s)

- [x] BFF: a request the KI answers (POST `/invoices`, `/invoices/extract`, `/invoices/categorize`, `/invoices/:id/recategorize`) waits 300 s, every other one 30 s
- [x] Backend: `LLM_TIMEOUT` default 120000
- [x] Docs: `.env.example`, README, `docs/tech-stack.md` name the new defaults and the CPU timings
- [x] Checks; closing `code-reviewer` round (`docs/reviews/419-review-2.md`): C-1 Major (no scenario) fixed with «Dwello wartet auf eine KI, die zum Lesen länger als eine halbe Minute braucht», red on be454eb6 (BFF 504, Betrag empty), green now; C-2 to C-5 fixed, C-6 kept
- [ ] Re-review of the C-1 fix
- Files: `src/lib/server/api-proxy.ts`, `tests/unit/api-proxy.test.ts`, `backend/src/config/llm.ts`, `backend/src/__tests__/llm-recipient.test.ts`, `.env.example`, `README.md`, `docs/tech-stack.md`
- Measured on 4 CPU cores without GPU, model loaded: qwen3-vl:8b-instruct categorize 37 s, read 77–90 s; qwen2.5vl:7b 21 s and 75 s
- Files (round 2): `tests/e2e/features/invoices.feature`, `tests/e2e/steps/invoice-upload.steps.ts`, `tests/e2e/tasks/invoice-upload.ts`, `tests/e2e/screenplay/interactions.ts` (`Wait.until` timeout), `backend/scripts/llm-stub.ts`
