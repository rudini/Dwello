# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: O-34, upload axe states time out in CI

Request: fix O-34 (`docs/design/offene-punkte.md`): the axe states `invoices upload-dialog` and `invoices upload-discard-created` time out in CI. No issue. No scenario: test reliability only, no app behaviour changes.

- [x] Cause: `startUpload` (`tests/e2e/tasks/accessibility.ts`) picks the first building of the select (`index: 1`), in the shared E2E database often a parallel scenario's «Bergsicht …»/«Seeblick …» that its cleanUp deletes while the files are read (extract 404: row «failed», no unsure hint) or created (no result). The KI 503s in the log are the categorization of the «Werke …» files, expected
- [x] Red: the two states (`--repeat-each=3`) with a parallel churn of buildings «Aarhof …» created and deleted after 4 s: 5 of 6 failed with the CI's timeouts (unsure hint, upload result); without churn, even under CPU load, all pass
- [x] Fix: all five upload states upload into the example's own building (`uploadBelege` of `tasks/invoice-upload.ts`); under the same churn 15 of 15 pass (`invoices upload-.* @a11y`, `--repeat-each=3`), axe and language checks of the upload states 10 of 10
- [x] O-34 removed from `docs/design/offene-punkte.md`
- [x] Checks: lint, check, backend type-check, `open-work.test.ts`, the a11y and language upload states
- [ ] code-reviewer round
- [ ] Push, pull request, CI, merge (CLAUDE.md, Workflow 9)
