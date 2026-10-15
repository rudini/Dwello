# Workflow rules review: issue #142

Task: bug #142, «Contract page reports a missing statement only for the last period». The contract page now lists every ended Abrechnungsperiode since the Vertragsbeginn that has no statement in Dwello. Reviewed against `CLAUDE.md`, `tests/e2e/CLAUDE.md`, the skills, the agents, the hooks and the documents they make binding.

## Findings

### W-1: An issue's «Done means» can produce a Major the personas find, with no rule for who decides first

- **Rules:**
  - `CLAUDE.md`, Workflow step 7: a Major that needs a product decision becomes open work.
  - «Open work»: an issue is ready when its decisions are in its text.
- **What happened:**
  - #142 decided «from the Vertragsbeginn on». On the demo data this lists years a landlord billed before Dwello, with no way to dismiss them. Personas Helga and Anna both rated it a Major.
  - The issue was ready by the rules, but its decision conflicted with an open `entscheiden` issue (#133, contracts billed outside Dwello).
  - I had to stop and ask before merging.
- **Proposed change:** before starting an issue, check its «Where» and «Done means» against open `entscheiden` issues that touch the same data, and ask first if one would change the outcome.

### W-2: A new page state and the a11y list

- **Rule:** `CLAUDE.md`, Design-Regeln, Process: «new screens or states go into `tests/a11y/screens.json` … one entry per place a state appears».
- **What happened:**
  - I first relied on the `default` state of `contract-detail`, whose seeded contract happens to show several missing periods.
  - The code reviewer flagged it (C-3): a seed change would drop the state silently.
  - I added an explicit `missing-statements` state.
- **Proposed change:** add «a state that the default seed happens to show still gets its own named entry».

### W-3: Commit made before running the full unit suite

- **Rule:** `CLAUDE.md`, Workflow step 4: commit once lint, the affected tests and `deepcheck:audit` are clean.
- **What happened:**
  - I ran the affected test files, then `test:coverage` in the same command as `git commit`.
  - The commit went in although coverage showed three failures, in other files that render the same page. A second commit fixed them.
- **Proposed change:** the commit hook could run `vitest related` on the staged files, or the rule could say «affected tests» means every test that imports a changed module.
