# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session 37: #180, #185, #186, #216 (decided #184)

Task: «Setze #180, #184, #185 und #186 um». #184 is a decision issue, closed with option B; its implementation is #216. #186 decided by the product owner on 2026-10-15 (reason per predefined category, Kehricht in the help, two KI hints). #180: the product owner asked to implement it, which allows removing the three law rows from `UBIQUITOUS_LANGUAGE.md` (Done means said «updated by the product owner»).

- [x] Branch restarted from `origin/main` (PR #190 merged)
- [x] #186 decisions recorded in the issue, label `entscheiden` removed
- [x] Scenarios `@wip` in `categories.feature`: reason of a predefined category in the list and on its edit page, KI unsure, KI not reachable. Scenario red: `reasonOf("Feuerlöscher-Wartung")` null; `formReasonText` null; proposal «Die KI ist nicht erreichbar oder ist sich nicht sicher …» lacks «Die KI ist sich nicht sicher.» and «Die KI ist nicht erreichbar. Versuchen Sie es später nochmals»
- [x] First lower-layer test while the domain review runs. Test red: `category-allocability.pg.test.ts` «schlägt nichts vor, wenn die KI unsicher ist» / «… nicht erreichbar ist» / «… unbrauchbar ist» – code `KI_NO_PROPOSAL` received, `KI_UNSURE` / `KI_UNAVAILABLE` expected
- [x] `fach-reviewer` on the scenarios and the draft texts (reasons, help, KI hints, #185, #216, glossary rows)
- [x] Scenarios reworked after the review: reason with an allocable example (Lift) and the contract note (H-4, H-14), «Geänderte vordefinierte Kategorie nennt keinen festen Grund» (H-4; passes before the reasons exist, red once they show without the rule), «Angenommen die KI ist nicht erreichbar» (H-13), KI unsure folded into the existing scenario (H-20)
- [x] #180 (product owner confirmed on 2026-10-15: «Ja, lösche die drei Glossarzeilen»): remove the rows «Art. 257a OR», «Art. 257b OR», «Art. 4 Abs. 3 VMWG» from `UBIQUITOUS_LANGUAGE.md`
- [ ] #185: «Gebäudeversicherung» in `invoices_category_not_allocable_text` and `invoices_legal_text` (4 languages), DOM test red first. No scenario: decided in the issue (wording only)
- [ ] #216: privacy text with the KI switched off, README «External LLM provider». No scenario: the E2E stack runs with the KI on and the privacy page loads the KI state server-side
- [x] #186 slice A: codes `KI_PROPOSAL_UNAVAILABLE` and `KI_PROPOSAL_UNSURE` instead of `KI_NO_PROPOSAL` (own codes: `KI_UNAVAILABLE` belongs to invoices, H-3). Test red: `categories.test.ts` «sagt, dass die KI unsicher ist …», «… nicht erreichbar ist …», «… andere Ablehnung …», «… ohne Inhalt …» – got «Die KI ist nicht erreichbar oder ist sich nicht sicher. …». Screen state `ki-unavailable`; contract `category-proposal-refused.json`. Scenarios «Ohne sichere Antwort …», «KI ist nicht erreichbar» green, `@wip` removed. Skills: tdd, ponytail, ponytail-review
- [ ] #186 slice B: reason per predefined category in list and edit form; help text narrowed, Kehricht
- [ ] Screen states (`ki-unavailable`, reasons) in `screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`
- [ ] `code-reviewer` per slice; personas, `fach-reviewer` feature review
- [ ] Before marking complete: coverage, lint, check, backend test + type-check, affected E2E
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-186.md`
- [ ] Archive session, push, PR (Fixes #180, #185, #186, #216), merge when green

Files: `tests/e2e/features/categories.feature`, `tests/e2e/{steps,tasks,questions,targets}/categories*`, `backend/scripts/llm-stub.ts`

Review lines:
- fach-reviewer round 1 (`docs/reviews/186-fachreview-1.md`): open H-1 (Major), H-2 (Major), H-5–H-9, H-14–H-19, H-21; fixed H-3, H-4 (scenario), H-13, H-20; open work H-10, H-11, H-12
