# Collected workflow review (2026-10-19, second)

Collected review per skill `workflow-review`, "Collected review", at the end of the request «Arbeite die offenen GitHub-Issues … nacheinander ab» (Sessions I1 and I2). Only findings and proposals; nothing here is applied. The product owner decides which to apply.

## Files covered

In no collected review yet (the last one is `workflow-rules-review-2026-10-19.md`, groups H1 to H11, which covered Session I1; points it already proposes are cited «as in H…» with only what is new):

- Notes (1): `workflow-notes-issue-464.md` (Session I2 had only #464).
- No per-task review.

## Groups

| # | Rule location | Count | Proposal |
|---|---|---|---|
| J1 | One session in `implementation_plan.md` (Workflow 8, `open-work.test.ts`) | 1 (+3 in I1) | One plan file per branch, or count only the sessions of the current branch |
| J2 | Demo data and new per-row tables (`backend/CLAUDE.md`, "Layout") | 1 | Same rows in the demo data in the same change, checked by `demo-data.pg.test.ts` |
| J3 | Reviewed texts changed after the last domain round (Workflow 6, 7) | 1 | Mark them «not domain-reviewed» in the pull request, or one text-only round |
| J4 | Duplication in code only touched (skill `commit-gates`) | 1 | Skip duplication inherited from the base commit, as for complexity |
| J5 | Stop hook and E2E load | 2 | As in H5 and H8 |

### J1 One session per plan (1, plus 3 in Session I1)

- Files: 464 (Session C1 of another branch, unfinished on `main`, made `open-work.test.ts` fail on this branch; moved by hand below Session I2).
- Cost: a red unit test without a fault in the change, and a hand edit of another session's text that the other branch will meet as a merge conflict.
- What the rule caught: nothing here; it keeps the plan short.
- Proposal: one plan file per branch (`plans/<branch>.md`), each checked for at most one session; or `open-work.test.ts` counts only sessions that name the current branch in their first line.

### J2 Demo data and new per-row tables (1)

- Files: 464 (migration `0026` filled `contract_advance_payments` for existing contracts; `demo/demo-data.sql` inserts contracts after the migrations without these rows; both personas stopped at saving, a whole persona round lost).
- Cost: two Blocker reports, a fix commit and a second persona round.
- What the rule caught: the rule «never part of the migrations» is right; the gap is that nothing checks the demo data against a new invariant.
- Proposal: in `backend/CLAUDE.md`, "Layout": «A migration that fills a table for existing rows needs the same rows in `demo/demo-data.sql` in the same change, checked in `demo-data.pg.test.ts`.»

### J3 Reviewed texts changed after the last domain round (1)

- Files: 464 (two persona Majors changed the reviewed refusal texts in four languages after the third `fach-reviewer` round).
- Cost: the texts the tenant-facing landlord reads went out with only a code review; or a fourth round, which Workflow 7 does not allow.
- What the rule caught: the three rounds found V-1, V-2, V-3 and V-12, all real.
- Proposal: in Workflow 7: «A domain text changed after the last `fach-reviewer` round is listed in the pull request as not domain-reviewed», or one round limited to the changed texts.

### J4 Duplication in code only touched (1)

- Files: 464 (fallow flagged a duplication that was on the base commit, because the file changed; the first fix changed the order of two calls, code review C-3, reverted in round 2).
- Cost: two code-review findings and two fix rounds for code outside the task.
- What the rule caught: nothing new; the duplication was old.
- Proposal: the fallow gate excludes duplication already on the base commit, as it already excludes inherited complexity; the skill then needs no exception for it.

### J5 Stop hook and E2E load (2)

- Files: 464 (stop hook asked six times to push during reviews, as in H8; one E2E failure under load while the persona stack ran, as in H5).
- Proposal: as H5 and H8; add «run a wide E2E run only after the personas are done».
