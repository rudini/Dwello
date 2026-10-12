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
- Checkable behaviour, and the test that proves it (unit, `*.pg.test.ts` or a scenario in `tests/e2e/features/*.feature`).
- UI texts in all four languages (`messages/{de,fr,it,en}.json`).
- Markers, workarounds or docs to remove or update.
- Plus the general finish in `CLAUDE.md`, "Workflow".

## Stop and ask
Only real surprises during the work (optional).

## Where
Files.

## Source
Review, persona or domain review.
