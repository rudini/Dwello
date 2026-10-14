# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 35 - October 2026: upload documents to a tenant (#174)

From issue #174 (decisions confirmed by the product owner on 2026-10-14): the Liegenschaftsverwalter adds own files (PDF, JPG, PNG, at most 10 MB, with a title) to a tenant, opens and deletes them; uploads show no Versandstatus. Assumptions: the upload form sits inline in the card «Dokumente» (works without JavaScript, secondary action next to the page's primary «Mietvertrag erfassen»); delete only on the tenant page; the schema change goes into `0001_schema.sql` (no installation yet, README); the UI texts say «Dokument» and «Hochgeladen am …», so no term outside the glossary is shown until the product owner extends **Dokument** in `UBIQUITOUS_LANGUAGE.md`.

- [x] `@wip` scenarios in `tests/e2e/features/tenant-documents.feature` and `documents.feature`; Scenario red: upload scenarios `locator.setInputFiles: waiting for getByTestId('tenant-document-file-input')`; seeded ones `…/tenants/<id>/documents antwortet 404`; «Eine Mahnung lässt sich nicht löschen» green before the change (a guard: no delete exists yet)
- [ ] fach-reviewer on the scenarios (domain term Dokument)
- [ ] Backend: schema (`content`, `mime_type`, nullable `channel`/`status`), create upload (type and size check by content, coded refusals), delete upload (Mahnung refused), list without content, tenant delete takes uploads along; `*.pg.test.ts`
- [ ] BFF and UI: upload form and delete in `TenantDocumentsCard`, rows without Versandstatus on the tenant page and `/documents`, failing request kept in the form, `BODY_SIZE_LIMIT`; DOM/unit tests; texts in de/fr/it/en
- [ ] API contracts in `tests/contracts/`
- [ ] Demo data: one uploaded PDF for one demo tenant
- [ ] a11y and language rows for the new states (`tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`)
- [ ] Docs: `docs/data-model.md`, `docs/api-specification.md`, help text
- [ ] Slice review (code-reviewer), feature review (personas, fach-reviewer)
- [ ] Before marking complete: coverage, lint, check, backend test and type-check, affected E2E
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-174.md`
- [ ] Session archived, pull request
