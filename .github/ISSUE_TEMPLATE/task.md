---
name: Task
about: A functional point ready to implement ("Setze #n um")
labels: []
---

<!-- Topic label: domain, product or bug (non-functional points: template nfr.md). English; German for UI texts and domain terms (UBIQUITOUS_LANGUAGE.md). -->

## Problem
What is wrong or missing today, with evidence (files, behaviour), and how a landlord reaches the state (the screen or data that produces it), or that only the API does.

## Decided (product owner)
Decisions this task rests on.

## Proposed (confirm before starting)
Values or rules the author suggests but the product owner has not confirmed (optional). While this section exists, the issue carries the label `needs-decision`. If the whole task depends on an open question, use the "Decision" template instead.

## Done means
- The outcome the landlord sees or the data shows (e.g. «before saving, the Liegenschaftsverwalter knows the overlap was not checked»), not where it shows; the UI placement only where the product owner decided it.
- A prescribed text: the issue states what happens when the landlord follows it, and that this is wanted (e.g. «Laden Sie die Seite neu» loses the input of a form: not wanted).
- Scenario: «<title>» in `tests/e2e/features/<area>.feature`, or `none: <reason>` (e.g. a refactoring without new behaviour).
- Lower-layer tests in addition: unit, DOM or `*.pg.test.ts`, at the lowest layer that shows each rule; existing tests that pin the old behaviour, by name.
- A list of claims about the system (servers called, cookies set): the source that makes it complete («every request the browser sends to another server»), not only the cases known today.
- UI texts in all four languages (`messages/{de,fr,it,en}.json`).
- Markers, workarounds or docs to remove or update.
- Plus the general finish in `CLAUDE.md`, "Workflow".

## Stop and ask
Only real surprises during the work (optional).

## Where
Files. A schema or master data change is a new migration (`backend/CLAUDE.md`, `migrations/`).

## Source
Review, persona or domain review.
