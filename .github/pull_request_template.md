## What and why

Closes #

## Scenario

<!-- The changed scenario in tests/e2e/features/; an app change without one needs a line "No scenario" + ": <reason>" (CI checks it). -->

## Checked before opening

- `bun run lint`, `bun run check` and `cd backend && bun run type-check` pass
- Tests for the change, seen failing before the code
- New or changed UI texts in all of `messages/{de,fr,it,en}.json`
- Only design tokens and `src/lib/ui` components
- Changed API response: contract in `tests/contracts/` updated
- UI change: screenshots (light and dark, 390 px wide)
