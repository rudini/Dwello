# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end. A session that appears on `main` after this one started makes this one parallel from then on: at the merge before the push take `main`'s plan and move this checklist into the pull request.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: #1166 Kontoinhaber for the QR payment part

- [x] `@wip` scenarios (settings.feature, statement-detail.feature) written, steps seen red
- [x] `fach-reviewer` round on scenarios and texts (de/fr/it/en), findings fixed before the first green test: `docs/reviews/1166-fachreview-1.md`; V-2 and the row «Absender» decided in #1166
- [x] Backend: keys `account_holder_*`, required name/PLZ/Ort with IBAN and separate holder (`config.service`), creditor from the Kontoinhaber (`qr-bill.service`, statement and reminder), data export labels
- [x] BFF and form: block «Konto» with IBAN, checkbox «Kontoinhaber ist der Absender», fields; re-check deletes the fields
- [x] Contract `tests/contracts/` for the config response; texts in `messages/{de,fr,it,en}.json`; `UBIQUITOUS_LANGUAGE.md` row «Kontoinhaber»
- [x] a11y/language screens: `config` states with the cleared checkbox and the refusal
- [ ] Slice review (`code-reviewer`), feature review (persona, `fach-reviewer`, `daten-pruefer`)
- [ ] Before marking complete: lint, check, fitness, backend type-check, affected tests, E2E, Prettier on new files
- [ ] Archive session; PR `Fixes #1166`
