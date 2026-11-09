---
name: issue-work
description: When a Dwello GitHub issue is ready, how its decisions are recorded and closed, and what working on one means. Load before starting an issue ("Setze #n um", "work on #n"), before opening, labelling or closing an issue, and when a product owner confirms or records a decision.
---

# Issue work

`CLAUDE.md`, "Open work", says what becomes an issue; this skill is how an issue moves from open to done.

- An issue is ready when its decisions are in its text; a `needs-decision` issue is not. An issue whose «Done means» changes a text or step of a scenario that is not `@wip` on `main` is not ready until its «Decided (product owner)» approves that change (`CLAUDE.md`, Workflow 1; to ask for it, list every scenario that holds a sentence or fragment of the text's current value, as skill `grill-me`, step 1, does): until then it carries `needs-decision`; add the label when you find one without it. Before starting a ready issue, look for open `needs-decision` issues on the same data and ask first when one would change the outcome. When the product owner confirms a section "Proposed (confirm before starting)", rename it "Decided (product owner)" and remove the label. A decision issue (template "Decision") loses `needs-decision` once the decision is recorded in it, and is closed once that is so and, if code must change, the decision is implemented (a request to implement it makes the decision the requirement, and its pull request says `Fixes #n`) or its implementation issue exists.
- Working on an issue ("Setze #n um"): its "Done means" plus the workflow's "Done means" is the finish line; its bullets become the plan checklist and the scenarios of step 1. The pull request says `Fixes #n` (`Refs #n` in the KI case, `backend/CLAUDE.md`; split or related issues: skill `pull-request`).
- Read and write issues with the GitHub MCP tools; in cloud sessions `gh issue view` can fail, `gh api repos/rudini/Dwello/issues/<n>` works.
