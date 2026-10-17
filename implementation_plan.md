# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W3e: German wording findings of the native read (#348)

Branch `claude/w3e-de-wording-348`. All findings of the issue checked against `main` (74f223f): all still open. No scenario: wording of existing texts only; rules pinned in `src/__tests__/i18n.test.ts`, pinned texts in unit tests and E2E features updated (red first).

- [ ] Rule tests (red first): no straight quotes in de/en, every `*_error_*` ends with a period, building toasts with «»
- [ ] fach-reviewer on the proposed wording (terms «dem Mieter», «Mietvertrag», «Rechnungssteller», «Freiburg») before any text turns green
- [ ] Texts in `messages/{de,fr,it,en}.json`; gap list with `Intl.ListFormat` («Januar, Februar und März»)
- [ ] code-reviewer slice
- [ ] Workflow note; archive the session
- [ ] PR `Fixes #348`, CI, merge
