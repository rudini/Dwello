## What and why

Closes #

## Scenario

<!-- The changed scenario in tests/e2e/features/; an app change without one needs a line "No scenario" + ": <reason>" (CI checks it). -->

## Type

<!-- One of: domain, product, bug (functional), or one ISO 25010 category: nfr:security, nfr:reliability, nfr:performance, nfr:usability, nfr:maintainability, nfr:portability, nfr:compatibility. A pull request from a fork closes a ready issue (Closes #n) and names its label. -->

## Decisions

<!-- Each decision taken: the decision, the alternative rejected, the reason. An architecture decision adds a new ADR in docs/architecture/adr/. -->

## Risks

<!-- What could break or behave differently, and for whom; "None" when nothing. -->

## Checked before opening

- `bun run lint`, `bun run check` and `cd backend && bun run type-check` pass
- Tests for the change, seen failing before the code
- New or changed UI texts in all of `messages/{de,fr,it,en}.json`
- Only design tokens and `src/lib/ui` components
- Changed API response: contract in `tests/contracts/` updated
- UI change: screenshots (light and dark, 390 px wide)
