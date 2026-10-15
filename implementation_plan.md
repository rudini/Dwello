# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 37: #180, #185, #186, #216 (decided #184)

Task: «Setze #180, #184, #185 und #186 um». #184 is a decision issue, closed with option B; its implementation is #216. #186 decided by the product owner on 2026-10-15 (reason per predefined category, Kehricht in the help, two KI hints). #180: the product owner asked to implement it, which allows removing the three law rows from `UBIQUITOUS_LANGUAGE.md` (Done means said «updated by the product owner»).

- [x] Branch restarted from `origin/main` (PR #190 merged)
- [x] #186 decisions recorded in the issue, label `entscheiden` removed
- [x] Scenarios `@wip` in `categories.feature`: reason of a predefined category in the list and on its edit page, KI unsure, KI not reachable. Scenario red: `reasonOf("Feuerlöscher-Wartung")` null; `formReasonText` null; proposal «Die KI ist nicht erreichbar oder ist sich nicht sicher …» lacks «Die KI ist sich nicht sicher.» and «Die KI ist nicht erreichbar. Versuchen Sie es später nochmals»
- [ ] `fach-reviewer` on the scenarios and the draft texts (reasons, help, KI hints, #185, #216, glossary rows)
- [ ] #180: remove the rows «Art. 257a OR», «Art. 257b OR», «Art. 4 Abs. 3 VMWG» from `UBIQUITOUS_LANGUAGE.md`
- [ ] #185: «Gebäudeversicherung» in `invoices_category_not_allocable_text` and `invoices_legal_text` (4 languages), DOM test red first. No scenario: decided in the issue (wording only)
- [ ] #216: privacy text with the KI switched off, README «External LLM provider». No scenario: the E2E stack runs with the KI on and the privacy page loads the KI state server-side
- [ ] #186 slice A: codes `KI_UNAVAILABLE` and `KI_UNSURE` instead of `KI_NO_PROPOSAL`
- [ ] #186 slice B: reason per predefined category in list and edit form; help text narrowed, Kehricht
- [ ] Screen states (`ki-unavailable`, reasons) in `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] `code-reviewer` per slice; personas, `fach-reviewer` feature review
- [ ] Before marking complete: coverage, lint, check, backend test + type-check, affected E2E
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-186.md`
- [ ] Archive session, push, PR (Fixes #180, #185, #186, #216), merge when green

Files: `tests/e2e/features/categories.feature`, `tests/e2e/{steps,tasks,questions,targets}/categories*`, `backend/scripts/llm-stub.ts`
