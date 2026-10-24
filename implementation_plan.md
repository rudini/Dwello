# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #790 code scanning and security alerts

- [x] Read the 33 CodeQL alerts (local CodeQL 2.27.3 run, the alert API answers 403) and the dependency alerts (`bun audit`)
- [x] Dependencies: zod, nodemailer (backend); vite, fallow, postcss-selector-parser (frontend) to fixed versions
- [x] `actions/missing-workflow-permissions` (7): least `permissions` in `ci.yml` and `deepcheck-scan.yml`
- [x] Nightly workflow: new CodeQL alerts become `nfr:security` issues
- [x] `SECURITY.md`: deadlines, who, dismiss rule for tests and tooling
- [ ] Remaining CodeQL alerts (tests, tools, one false positive): reasons for dismissal, dismissed by the product owner
- [x] Review 790a (dependencies): `docs/reviews/790a-review-1.md`
- [x] Review 790b (workflows, SECURITY.md): `docs/reviews/790b-review-1.md`
- [x] Re-review 790a and 790b: `docs/reviews/790a-review-2.md`, `docs/reviews/790b-review-2.md`
- [ ] SvelteKit < 3.0 advisories (2 low): not reachable (no prerendering, no catch-all route, no setHeaders); the fix needs SvelteKit 3
- [ ] Reviews, checks, PR
