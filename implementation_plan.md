# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (7): bug #212, small KI model still rejects Treppenhausreinigung

- [x] Stub reproduces the small model's answer unless the prompt carries the new rules; scenario «KI beurteilt eine neue Kategorie wie die vordefinierten» red. Scenario red: `schlägt die KI vor, die Kategorie als umlagefähig zu erfassen` – allowedChosen false (categories.steps.ts:171)
- [x] fach-reviewer on the proposed rule wording before implementing
- [x] Unit test: prompt carries the rules and an answer-neutral JSON example, red then green. Test red: «sagt der KI, dass die Listen nicht abschliessend sind, …» (renamed «… die vordefinierten Kategorien nicht vollständig sind …» after V-1) – expect(received).toContain(expected)
- [x] Prompt rules (fach-reviewer's corrected wording, without the unsure «Gebäudeversicherung» example) + neutral JSON example (`backend/src/config/llm.ts`)
- fach-reviewer round 1 (docs/reviews/212-fachreview-1.md): open –, fixed M-1, M-2, M-3, M-4, M-5, V-1, V-2, M-6 (stub cites Art. 256 Abs. 1 OR; scenario «KI schlägt vor, ob eine neue Kategorie umlagefähig ist» asserts «Art. 256»), rejected V-3: an invalid JSON copied by the model gives no proposal, the safe outcome
- Skills: tdd, ponytail, ponytail-review
- Files: `backend/src/config/llm.ts`, `backend/scripts/llm-stub.ts`, `backend/src/__tests__/category-allocability.pg.test.ts`, `tests/e2e/features/categories.feature`
- [ ] code-reviewer round 1
- [ ] Before marking complete: coverage, lint, check, backend test + type-check, categories E2E
- [ ] `llm:eval` with qwen2.5:3b: product owner (not reachable here)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-212.md`
- [ ] PR `Fixes #212`, CI green, merge
