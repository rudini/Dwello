## Session: workflow review proposals (tools)

- [x] Proposal 3: `tools/arch-baseline/run.sh` takes `ARCH_OUT` (checked by hand: a run into a temporary directory left `out/` unchanged)
- [x] Proposal 4: the literal-set measurement skips the keys of `Pick`/`Omit` (`lib.test.ts`, seen red); ratchet exception `billedUntil|endDate|startDate` removed with `--update`
- [x] Slice review round 1: `docs/reviews/wrr-tools-review-1.md`, Minor C-1 (generic first type argument) fixed with a test seen red
- [x] Closing round: `docs/reviews/wrr-tools-review-2.md`, C-1 closed; Minor C-2 (a union after a `Pick` with non-literal keys) fixed with a test seen red, no re-review (Workflow 7: Minor)
- [x] No scenario: tooling only
- [x] PR: pushed after this archive

## Session: workflow review proposals (rules)

- [x] Proposals 2, 5, 6 (ratchet only), 7, 8, 10, 11, 12, 13 of `workflow-rules-review-2026-10-28.md` in the skills, `CLAUDE.md`, `tests/e2e/CLAUDE.md`, the persona README and `code-reviewer`; 9 and 14 not applied
- [x] No scenario: rules only; no review round: no code changed
- [x] PR: pushed after this archive

## Session: collected workflow review (end of Phase 2)

- [x] `docs/reviews/workflow-rules-review-2026-10-28.md`: the 15 workflow notes since review 6, each point checked against `main` (0efe4eb1); 14 open proposals, 11 applied since
- [x] No scenario: documentation only; no review round: no code changed
- [x] PR: pushed after this archive



## Session: #916 and #917 pin R1 and S2 (Phase 2, from #723)

- [x] #916: an invoice without a category is saved while the KI is unreachable, without a KI category (`invoice-categorization.pg.test.ts`, pins kept behaviour; red with both catches of the KI call removed: 400)
- [x] #917: the session cookie is HttpOnly and SameSite, Secure with COOKIE_SECURE, which production sets (`session-cookie.test.ts`, pins kept behaviour; red with `httpOnly: false`)
- [x] Slice review round 1 (closing): `docs/reviews/i916-review-1.md`, no findings
- [x] No scenario: tests that pin kept behaviour
- [x] PR `Fixes #916`, `Fixes #917`: pushed after this archive
