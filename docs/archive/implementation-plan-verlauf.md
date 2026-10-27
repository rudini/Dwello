

## Session: #676 development version on one line

- [x] The footer version does not wrap (`whitespace-nowrap`; `src/__tests__/shell.dom.test.ts`). No scenario: the E2E build bakes in one version, `v1.4.0`, which navigation.feature pins exactly, so a long development version cannot be produced there
- [x] Slice review round 1: `docs/reviews/i676-review-1.md`, no findings; persona `marco-i676.md` at 320 to 1440 px on a build with `v0.12.0-123-gabcdef1`, no findings (`marco-i676-1.md`: the first run's build got the version in the wrong form)
- [x] Workflow note: `docs/reviews/workflow-notes-issue-676.md`
- [x] PR `Fixes #676`: pushed after this archive
