

## Session: #919 statements/outdated without N+1

- [x] Measured with `bun run fitness:p2`: 1012–1139 ms p95; `getStatement` per statement is ~70 % of the time, the invoices of the period ~25 %
- [x] `outdatedStatements` and `draftsToSend` take the listed statements and load invoices and Tankbestand once per building and period; the full statement only for a correctable one (No scenario: same answer, pinned by `statement-invoices.pg.test.ts`, `dashboard.pg.test.ts`)
- [x] `bun run fitness:p2`: outdated 1100 → 80 ms p95, dashboard 227 → 214 ms; docs (P2)
- [x] Slice review round 1 (closing): `docs/reviews/i919-review-1.md`, no findings
- [x] PR `Fixes #919`: pushed after this archive
