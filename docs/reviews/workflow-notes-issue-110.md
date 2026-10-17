# Workflow notes: issue #110 (login and header follow the browser language)

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Done means" / "Working on an issue"; #110 written as a decision issue | "Done means" asked for an implementation issue; the coordinator said to implement the decision directly. Same as in `workflow-notes-issue-144.md`. | as in `workflow-notes-issue-144.md` |
| `docs/design/personas/README.md`, "Running a review", Language | «The interface language is stored on the account, so a persona in another language than German runs alone.» The language is only the browser cookie `PARAGLIDE_LOCALE` (Anna and Dr. Weber both saw it); two personas in different languages ran in parallel without interfering. | Drop the sentence, or say: the language is a cookie of the persona's own browser, so personas in different languages may run in parallel. |
| `docs/design/tools/persona-kit.mjs` (`locale: 'de-CH'` fixed) | Both personas needed a browser in another language and copied the kit's session into their own context. | Let the kit's `open()` take a `locale`. |
| `CLAUDE.md`, "Done means" (every new test seen red) | Two guard scenarios (Spanish falls back to German; the chosen language wins) cannot fail on the base commit; their red was shown in the unit test by swapping the strategy order, not in E2E (a separate build). | Say that a guard test may show its red at a lower layer that covers the same rule. |
