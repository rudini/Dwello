# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 35 - October 2026: upload documents to a tenant (#174)

From issue #174 (decisions confirmed by the product owner on 2026-10-14): the Liegenschaftsverwalter adds own files (PDF, JPG, PNG, at most 10 MB, with a title) to a tenant, opens and deletes them; uploads show no Versandstatus. Assumptions: the upload form sits inline in the card «Dokumente» (works without JavaScript, secondary action next to the page's primary «Mietvertrag erfassen»); delete only on the tenant page; the schema change goes into `0001_schema.sql` (no installation yet, README); the glossary entries **Dokument** (extended) and **Hochgeladenes Dokument** (new) are added by the product owner before the merge (fach-reviewer F-1; wording in `docs/reviews/upload-scenarios-fachreview-1.md`).

- [x] `@wip` scenarios in `tests/e2e/features/tenant-documents.feature` and `documents.feature`; Scenario red: upload scenarios `locator.setInputFiles: waiting for getByTestId('tenant-document-file-input')`; seeded ones `…/tenants/<id>/documents antwortet 404`; «Eine Mahnung lässt sich nicht löschen» green before the change (a guard: no delete exists yet)
- [x] fach-reviewer on the scenarios (domain term Dokument); scenarios changed after it: photo upload (F-5), delete confirmation (F-3), message of a failed upload (F-4), «Zu {name}, hochgeladen am …» on `/documents` (F-10), example in the description (F-12), privacy scenario (F-2, `privacy.feature`); Scenario red again: `privacy.feature` «Hochgeladene Dokumente der Mieter»: expected substring «Dokumente, die Sie zu Mietern hochladen»
- [x] Test red: `tenant-documents.pg.test.ts` «liegt beim Mieter ohne Versandstatus …» – Expected 201, Received 404
- [ ] Privacy statement `privacy_stored_1` names uploaded documents, all four languages (F-2)
- [ ] Help text at the file field: kinds, 10 MB, delete copies of ID and Betreibungsauszüge once no longer needed (F-6, F-7); demo notice at the upload in the public demo (F-8)
- [ ] Limit 10 × 1024 × 1024 bytes, tests at 10,485,760 and 10,485,761 bytes; body limits with headroom for Base64 (F-9)
- [ ] Texts on `/documents` for uploads: row «Zu {name}, hochgeladen am {date}», empty text, «Datei herunterladen» instead of «PDF herunterladen» for uploads (F-5, F-10)
- [ ] Backend: schema (`content`, `mime_type`, nullable `channel`/`status`), create upload (type and size check by content, coded refusals), delete upload (Mahnung refused), list without content, tenant delete takes uploads along; `*.pg.test.ts`
- [ ] BFF and UI: upload form and delete in `TenantDocumentsCard`, rows without Versandstatus on the tenant page and `/documents`, failing request kept in the form, `BODY_SIZE_LIMIT`; DOM/unit tests; texts in de/fr/it/en
- [ ] API contracts in `tests/contracts/`
- [ ] Demo data: one uploaded PDF for one demo tenant
- [ ] a11y and language rows for the new states (`tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`)
- [ ] Docs: `docs/data-model.md`, `docs/api-specification.md`, help text
fach-reviewer round 1 (`docs/reviews/upload-scenarios-fachreview-1.md`): open F-1 (Major, product owner: glossary), F-2 (Major), F-3, F-4, F-5, F-6, F-7, F-8, F-9, F-10 (Minor), F-12 (Nit); rejected F-11: `formatDate` already shows a point in time in Europe/Zurich (`src/lib/utils/format.ts:50`)

- [ ] Slice review (code-reviewer), feature review (personas, fach-reviewer)
- [ ] Before marking complete: coverage, lint, check, backend test and type-check, affected E2E
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-174.md`
- [ ] Session archived, pull request
