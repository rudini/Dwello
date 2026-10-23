---
name: Decision
about: A functional point that needs a product-owner or domain decision before it can be implemented
labels: [needs-decision]
---

<!-- Add the topic label: domain, product, bug, or nfr with its category. English; German for UI texts and domain terms. -->

## Problem
What is open and why it matters to the landlord.

## Options
Each option with its consequence and source (Fedlex wording, code facts).

## Done means
- The product owner's decision is recorded in this issue.
- If the decision is about wording: `UBIQUITOUS_LANGUAGE.md` is updated by the product owner and help texts follow (all four languages); otherwise the decision is implemented (when the product owner asks for it, the decision is the requirement and the pull request closes this issue), or an implementation issue with its own "Done means" is created.
- The issue is closed.
- The related `TODO(fachlich prüfen, #n)` markers are removed, or point to the implementation issue.

## Where
Files.

## Source
Review, persona or domain review.
