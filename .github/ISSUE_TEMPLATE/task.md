---
name: Task
about: A functional point ready to implement ("Setze #n um")
labels: []
---

<!-- Topic label: fachlich, produkt or bug. English; German for UI texts and domain terms (UBIQUITOUS_LANGUAGE.md). -->

## Problem
What is wrong or missing today, with evidence (files, behaviour).

## Decided (product owner)
Decisions this task rests on.

## Proposed (confirm before starting)
Values or rules the author suggests but the product owner has not confirmed (optional). While this section exists, the issue carries the label `entscheiden`. If the whole task depends on an open question, use the "Decision" template instead.

## Done means
- The outcome the landlord sees or the data shows (e.g. «before saving, the Liegenschaftsverwalter knows the overlap was not checked»), not where it shows; the UI placement only where the product owner decided it.
- A prescribed text: the issue states what happens when the landlord follows it, and that this is wanted (e.g. «Laden Sie die Seite neu» loses the input of a form: not wanted).
- Scenario: «<title>» in `tests/e2e/features/<area>.feature`, or `none: <reason>` (e.g. a refactoring without new behaviour).
- Lower-layer tests in addition: unit, DOM or `*.pg.test.ts`, at the lowest layer that shows each rule.
- UI texts in all four languages (`messages/{de,fr,it,en}.json`).
- Markers, workarounds or docs to remove or update.
- Plus the general finish in `CLAUDE.md`, "Workflow".

## Stop and ask
Only real surprises during the work (optional).

## Where
Files.

## Source
Review, persona or domain review.
