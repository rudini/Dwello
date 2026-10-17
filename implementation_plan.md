# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W3e: German wording findings of the native read (#348)

Branch `claude/w3e-de-wording-348`. All findings of the issue checked against `main` (74f223f): all still open. No scenario: wording of existing texts only; rules pinned in `src/__tests__/i18n.test.ts`, pinned texts in unit tests and E2E features updated (red first).

- [x] Rule tests (red first) in `src/__tests__/i18n.test.ts`: no straight quotes in de/en, every `*_error_*` ends with a period; pinned texts in unit tests and E2E updated
- [x] fach-reviewer on the proposed wording before any text turns green: `docs/reviews/w3e-fachreview-1.md` (V-1 «2,5» stays: rejected the finding; V-2, V-3, V-4, V-6 taken; V-5, V-7 stay)
- [x] Texts in `messages/{de,fr,it,en}.json`; gap list with `Intl.ListFormat` («Januar, Februar und März»), keys `statements_part_month`, `statements_list_and` removed; backend German texts of the coded refusals follow de.json («») in `backend/src/services/{category,heating-profile,distribution-key,formula}.service.ts`
- [ ] code-reviewer slice
- [ ] Workflow note; archive the session
- [ ] PR `Fixes #348`, CI, merge
