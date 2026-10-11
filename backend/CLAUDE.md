# Backend (Elysia on Bun)

## Commands (run in `backend/`)

```bash
bun run dev:demo        # load demo data into the dev database, then start with hot reload
bun run dev             # migrate the dev database, then start with hot reload
bun run test            # all backend tests (unit + *.pg.test.ts) with coverage floor, as in CI
bun run test:pg         # only the database tests
bun test --preload ./scripts/test-db.ts src/__tests__/x.test.ts   # one file
bun run type-check
bun run db:migrate      # apply new files from migrations/
bun run db:reset        # recreate the local dev database (refuses non-local hosts)
bun run db:demo         # load demo data; running it twice adds nothing
```

Never run `bun test` without the preload: `*.pg.test.ts` would write into the dev database. One backend test run at a time: each run drops and recreates `dwello_test` (`TEST_DATABASE_URL` overrides it).

## Layout

- `src/routes/*.ts`: HTTP only (validation, status codes); logic goes into `src/services/*.service.ts`.
- `src/db/schema.ts`: Drizzle schema. Only the pg tests catch drift from `migrations/`, and only in the columns they use; keep both in sync by hand.
- `migrations/`: plain SQL, applied in file order by `src/db/migrate.ts` and recorded in `schema_migrations`. `0001_schema.sql` is the schema, `0002_stammdaten.sql` the master data (cost categories, distribution keys, heating profiles). Schema changes go into a new numbered SQL file written by hand (`db:generate` has no snapshots and would emit the whole schema again; `db:push` bypasses `schema_migrations`); also update `src/db/schema.ts` and `docs/data-model.md`. Until the first installation, changes go into `0001_schema.sql` and `0002_stammdaten.sql` instead of a new file; local databases then need `bun run db:reset`.
- `demo/demo-data.sql` and `src/db/demo-data.ts`: demo data, never part of the migrations. Demo statements are generated through the real statement service.

## Tests

- `src/__tests__/*.test.ts`: unit tests of pure service functions.
- `src/__tests__/*.pg.test.ts`: against a real PostgreSQL database `dwello_test`, which the preload (`scripts/test-db.ts`) recreates from the migrations. The app runs in-process; reuse the helpers in `src/__tests__/helpers/` (`auth.ts`: `callApi`, `sendJson`; `records.ts`, `rental.ts`: test data). Never mock the database.
- Each test creates its own data with unique names (`crypto.randomUUID()`) and removes it in `afterAll`; tests run against a shared database.
- External systems are replaced at the boundary: a local `Bun.serve` stands in for the OpenAI-compatible LLM provider and Resend, a local SMTP server for mail.

## Swiss domain rules

- **Allocable costs (OR 257a):** a category that is not allocable (`categories.is_allowed_utility_cost`, seeded in `0002_stammdaten.sql`) always makes its invoices non-allocable, whatever the form or the LLM sends; an invoice in an allocable category can still be excluded.
- **Management fee:** 3 % is the customary guideline, not a cap; statements apply the percentage that is set (`management-fee*.test.ts`).
- **Prorating:** by days rented; heating costs by the heating profile's monthly shares (`prorating.service.ts`).
- **QR-bill (SIX):** a QR reference (MOD10) only with a QR-IBAN (IID 30000–31999); with a normal IBAN no reference. The debtor block is written only when name, postal code and town are all present; otherwise it stays empty. IBANs are checked with MOD-97.

## Troubleshooting

- `bun run dev` refuses with "Migrationen, die es nicht mehr gibt" or "ohne diese Migrationen": the dev database predates the current migrations; run `bun run db:reset`.
- Invoice categorization fails: the provider in `LLM_BASE_URL` (any OpenAI-compatible API, default the local Ollama, see `src/config/llm.ts`) is not running, `LLM_API_KEY` is wrong, or the model in `LLM_MODEL` is missing; for Ollama with Docker: `docker exec dwello-ollama-dev ollama pull <model>`.
