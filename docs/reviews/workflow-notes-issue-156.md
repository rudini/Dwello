# Workflow notes: #156 and #155 (moves within the house, contracts that continue by law)

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 1 and "Done means" («every new test was seen red») | A scenario added after the domain review (death hint in «Beenden», M-1) was seen red only through its DOM test; seeing the E2E scenario red too would have meant one more E2E build for a text-only change. | Say that a scenario added for a review finding may show its red through the lower-layer test of the same text. |
| `.claude/skills/workflow-review`, "Collected review" | The request covered two issues, so the rule asks for a collected review, while nine other sessions of the same coordinator run in parallel and would each write a dated review over the same ~30 per-task files. Not written here. | When a coordinator runs parallel sessions, only the coordinator writes the collected review. |
| `CLAUDE.md`, Gotchas, "Commit gates" (fallow complexity) | Adding one `{#each}` with an Alert to `ContractWizard.svelte` pushed its template over the CRAP threshold; the hint moved into `OpenContracts.svelte`. As in `workflow-rules-review-issue-135.md` for complexity; new is only that a Svelte template counts as one function. | None beyond the earlier proposal. |
| `CLAUDE.md`, "Coding guidelines" (issue text wrong in a detail) | #155 names the message key `contracts_parties_fixed_help`, which #152 had split into `contracts_parties_fixed_open`/`_ended`; followed the code. | None: the rule covered it. |
