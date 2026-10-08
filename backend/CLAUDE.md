# Backend (Elysia on Bun)

## Commands (run in `backend/`)

```bash
bun run dev:demo        # load demo data into the dev database, then start with hot reload
bun run dev             # migrate the dev database, then start with hot reload
bun run test            # all backend tests (unit + *.pg.test.ts) with coverage floor, as in CI
bun run test:pg         # only the database tests
bun test --preload ./scripts/test-db.ts src/__tests__/x.test.ts   # one file; the preload is required for *.pg.test.ts
bun run type-check
bun run db:migrate      # apply new files from migrations/
bun run db:reset        # recreate the local dev database (refuses non-local hosts)
bun run db:demo         # load demo data; running it twice adds nothing
```

## Layout

- `src/routes/*.ts`: HTTP only (validation, status codes); logic goes into `src/services/*.service.ts`.
- `src/db/schema.ts`: Drizzle schema; it must match `migrations/`.
- `migrations/`: plain SQL, applied in file order by `src/db/migrate.ts` and recorded in `schema_migrations`. `0001_schema.sql` is the schema, `0002_stammdaten.sql` the master data (cost categories, distribution keys, heating profiles). Schema changes go into a new numbered file; also update `src/db/schema.ts` and `docs/data-model.md`.
- `demo/demo-data.sql` and `src/db/demo-data.ts`: demo data, never part of the migrations. Demo statements are generated through the real statement service.

## Tests

- `src/__tests__/*.test.ts`: unit tests of pure service functions.
- `src/__tests__/*.pg.test.ts`: against a real PostgreSQL database `dwello_test`, which the preload (`scripts/test-db.ts`) recreates from the migrations. The app runs in-process; call it with `callApi`/`sendJson` from `helpers/auth.ts`. Never mock the database.
- Each test creates its own data with unique names (`crypto.randomUUID()`) and removes it in `afterAll`; tests run against a shared database.
- External systems are replaced at the boundary: a local `Bun.serve` stands in for Ollama and Resend, a local SMTP server for mail.

## Swiss domain rules

- **Allocable costs (OR 257a):** whether an invoice may go into a statement comes from its category (`categories.is_allowed_utility_cost`, seeded in `0002_stammdaten.sql`), also when the category is chosen by hand. Repairs, insurance, taxes and financing are never allocable.
- **Management fee:** at most 3 % (`MAX_MANAGEMENT_FEE_PERCENT` in `utility-validation.service.ts`).
- **Prorating:** by days rented; heating costs by the heating profile's monthly shares (`prorating.service.ts`). Example: Oct–Dec with 8 % + 10 % + 12 % of CHF 10,000 heating costs is CHF 3,000.
- **QR-bill (SIX):** a QR reference (MOD10) only with a QR-IBAN (IID 30000–31999); with a normal IBAN no reference. The debtor appears only with postal code and town. IBANs are checked with MOD-97.

## Troubleshooting

- `bun run dev` refuses with "Migrationen, die es nicht mehr gibt" or "ohne diese Migrationen": the dev database predates the current migrations; run `bun run db:reset`.
- Invoice categorization fails: Ollama is not running or the model in `OLLAMA_MODEL` (default in `src/config/llm.ts`) is missing; with Docker: `docker exec dwello-ollama-dev ollama pull <model>`.
