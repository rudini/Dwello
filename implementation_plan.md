# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-21: open bugs, then ready issues (one pull request each)

- [x] #568 test first: `backend/src/__tests__/compose-prod.test.ts` red (8 mail keys missing in the backend service)
- [x] #568 `docker-compose.prod.yml` passes `MAIL_TRANSPORT`, `MAIL_FROM`, `SMTP_*`, `RESEND_API_KEY`; `docker compose config` with `.env.example` shows them; No scenario: the E2E stack does not run `docker-compose.prod.yml`
- [x] #568 slice review round 1: `docs/reviews/568-review-1.md`; Minors C-1 (comment), C-2 (test of the SMTP_PORT default, seen red) fixed
- [x] #568 closing review round 2: `docs/reviews/568-review-2.md`
- [x] #568 PR #569 merged
- [x] #566 DOM test red (`date-input.dom.test.ts`: form with the calendar below its min fails checkValidity); `DateInput` keeps its calendar out of every form (`form=""`), green
- [x] #566 scenario «Ein Tankbestand ohne Stichtag nennt den fehlenden Stichtag» (`building-detail.feature`), green in Chromium; no red run of its own (the DOM test was seen red)
- [x] #566 slice review round 1: `docs/reviews/566-review-1.md` (no findings; no closing round, no code since)
- [x] #566 PR #571 merged (subject reworded after CI «Commit subjects», force-push approved by the product owner)
- [ ] Workflow note: the local commit-msg hook let `git commit -F -` through with a 53-character subject; only CI caught it
- [x] #548 DOM test red (`invoice-upload-dialog.dom.test.ts`: sentence stays after the Verteilschlüssel is chosen); `UploadRowNotes.svelte` shows it only while a marked field is still open (`checkRow`), green
- [x] #548 scenario «Rechnung ohne KI aus einer Datei erfassen» checks the sentence and that the note goes (new step «hat die Datei von … keinen Hinweis mehr»); no red run of its own (the DOM test was seen red)
- [x] #548 slice review round 1: `docs/reviews/548-review-1.md`; Minor C-1 fixed (test: one of two marked fields filled, sentence stays; pins kept behaviour, fails with `every` instead of `some`)
- [x] #548 persona Helga: `docs/design/personas/helga-548.md`; Major P-1 (key field stays red after the Kategorie brought a Verteilschlüssel, pre-existing, met in the task) fixed with a DOM test seen red; Minors P-2, P-3 stay in the report (pre-existing, not trivial)
- [x] #548 closing review round 2: `docs/reviews/548-review-2.md`; Major C-2 (no scenario for P-1) fixed: scenario «Die Kategorie bringt den Verteilschlüssel und nimmt seinen Fehler zurück», new step «… die Fehlermeldung … nicht mehr»; its note on new/edit invoice became #573
- [x] #548 review round 3: `docs/reviews/548-review-3.md` (C-2 closed, no new findings)
- [x] #548 PR #574 merged
- [x] #575 (main red after #571): Firefox «Suche ohne Treffer» (`buildings.feature`), not #571's (no DateInput there); not reproduced locally in 225 Firefox runs; analysis in #575; cause open
- [x] #573 DOM tests red (`invoice-pages.dom.test.ts`, new and edit page: key error stays after the Kategorie brought a key); `InvoiceCategoryFields.svelte` shows the key error only while no key is set (the #548 condition in `UploadRowFields.svelte` moved there), green
- [x] #573 scenario «Die Kategorie bringt den Verteilschlüssel und nimmt seinen Fehler zurück» (`invoice-new.feature`), green; no red run of its own (the DOM tests were seen red); No scenario for the edit page: it shares the field component, covered by its DOM test
- [x] #573 slice review round 1: `docs/reviews/573-review-1.md` (no findings)
- [x] #573 persona Helga: `docs/design/personas/helga-573.md` (no findings; observations pre-existing, stay in the report)
- [x] #573 PR #582 merged
- [x] #522 BFF load test red: `agreeableCategories` reads `/categories/allowed` (every umlagefähige category, no limit); contract `tests/contracts/categories-allowed.json` with its check in `api-contracts.pg.test.ts`
- [x] #522 `contractBody` test red: the body always names the shown and ticked categories (no click: every box), a category the form does not list is neither agreed nor kept; `flatRateNotice` test red: counts only shown boxes
- [x] #522 No scenario: it needs more than 100 categories in the shared E2E database or a change in another tab while the form loads; contract E2E features (145) green
- [x] #522 slice review round 1: `docs/reviews/522-review-1.md`; Minor C-2 fixed (one helper `ticked`); Minor C-1 (a category changed in another tab while the form loads is answered without a word; needs the backend to answer only shown ids) stays in the report, named in the PR; the invoice form limit became #583
- [x] #522 closing review round 2: `docs/reviews/522-review-2.md` (no new findings)
- [x] #522 PR #584 merged
- [x] #583 BFF test red (`invoices.test.ts`: 150 categories, the form got 100); `invoiceChoices` asks for `categories?limit=1000` (the backend's own «all»), green; No scenario: it needs more than 100 categories in the shared E2E database; the other loads with the same limit became #585
- [x] #583 slice review round 1: `docs/reviews/583-review-1.md`; Minor C-1 fixed (contract `tests/contracts/categories.json` with its check in `api-contracts.pg.test.ts`, used by the new test)
- [x] #583 closing review round 2: `docs/reviews/583-review-2.md` (C-1 closed, no new findings)
- [ ] #583 PR merged
