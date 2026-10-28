

## Session: #782 upgrade check (U1), part 2: tables empty in the demo data

- [x] The upgrade check fills `audit_log`, `invoice_documents`, `ki_settings` and `local_accounts` with one row each before migrating, and warns about any table still empty
- [x] Red run: a probe migration that empties `local_accounts` fails the check («local_accounts 1 -> 0»)
- [x] Slice review round 1 (closing): `docs/reviews/i782b-review-1.md`; C-1 (Minor: tags before v0.92.0 lack two of the tables, the fixture fails there with a raw psql error; CI uses the latest tag) stays in the report
- [x] No scenario: tooling only
- [x] PR `Refs #782` (the «unhealthy» decision stays with the product owner): pushed after this archive

## Session: #782 decision recorded (U1, failed migration)

- [x] Product owner decision 28.10.2026 (comment in #782): «Restarting» with the cause in the log is enough; recorded in `docs/architecture/utility-tree.md` (U1) and `fitness-functions.md` §4 (No scenario: documentation only; no review round: no code changed)
- [x] PR `Fixes #782`: pushed after this archive
