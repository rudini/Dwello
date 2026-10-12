# UI Redesign Brief

Replace the existing design system of this app completely with a new, professional, extremely understandable UI. Work autonomously without asking questions. When something is unclear, take the most conservative, user-friendly decision and document it. Every stage is verified by independent reviewer agents and an automated accessibility check before the next one begins (see "Review Cycle" and "Automated Checks").

## Context

First read CLAUDE.md, UBIQUITOUS_LANGUAGE.md, the codebase and the current design system. Use the existing stack and conventions. Do not introduce new frameworks or heavy dependencies (exception: @axe-core/playwright as a dev dependency, if not already present). The old design system is replaced, not extended: carry over only functional requirements (components, states, accessibility), not the look.

Target users: private individuals who own a rented-out property and want to create rental contracts and utility bills (Nebenkostenabrechnung) themselves. Little to no experience, unsure about domain terms, afraid of legal/financial mistakes, rare usage (e.g. once a year).

Guiding idea: the app guides like a calm, competent advisor. Users never have to guess what to do next.

## Language and Domain Terms (binding)

All UI copy stays in GERMAN, with the formal address "Sie". This brief is in English only for the agent's convenience.

UBIQUITOUS_LANGUAGE.md in the repo root is the single source for domain terms.

- Use exactly the terms defined there, in the defined spelling, in all texts (navigation, labels, buttons, help texts, error messages, illustration captions, document preview). Do not invent synonyms and do not mix terms.
- Derive plain-language help texts from the definitions in that file without changing their meaning. Only add examples that do not contradict the definition.
- Terms or explanations missing from the file: mark them with TODO(fachlich prüfen) and list them in offene-punkte.md as glossary proposals. Do NOT edit UBIQUITOUS_LANGUAGE.md itself.
- Code identifiers for domain concepts follow the terms of the file where this is already the project convention. Do not rename existing domain identifiers.
- If a term in the current UI deviates from the glossary, correct it in the new UI and record the deviation in 00-analyse.md.

## Environment

- The app can be started (start command from CLAUDE.md or package.json) and seed data exists. Use it for all tests and persona runs. Do not create your own test data except for edge cases.
- CI: GitHub Actions has the job "ui-screenshots" in .github/workflows/cy.yml (trigger: pull_request). It compares screens before/after and attaches the result to the pull request. Before stage 0, read cy.yml and understand: trigger details (event types, branch/path filters, draft condition), which screens/specs are captured, how baseline and comparison are produced, where the result lands (PR comment, artifact). Do NOT change cy.yml or the job. Suggestions go into offene-punkte.md.
- You must trigger the job yourself: after stage 0 create a draft PR from feature/new-design to main (gh pr create --draft) and push to the branch after every stage. If ui-screenshots is skipped for draft PRs, mark the PR ready with gh pr ready.
- After every push wait for the job to finish (gh pr checks, gh run watch / gh run view), read the result and artifacts/PR comment and include deviations in the review. Analyze failed runs (gh run view --log-failed) and fix the cause if it lies in your code.
- Expected deviations: the new design intentionally changes the screenshots. Judge the comparison by content: missing elements, truncated texts, overlaps, broken layouts and empty screens are findings; pure visual change is not.
- If ui-screenshots captures screens that are not in your axe screen list, add them there. New screens the job does not capture go into offene-punkte.md as a suggestion for the job.
- If gh is unavailable or not authenticated, or the job does not run: note it in progress.md, continue with local screenshots and do not block.

## Safety Rules (strict)

- Work on the new branch feature/new-design, never on main. Commit after every stage AND after every incorporated review round. Push only to this branch.
- The app must be buildable and runnable after every commit.
- Do NOT change business/calculation logic, data models, migrations, seed data, UBIQUITOUS_LANGUAGE.md or cy.yml. Only UI, texts, styles, components, assets. Do not invent legal statements; mark neutral help texts without a glossary basis with TODO(fachlich prüfen).
- No external CDNs/tracking: fonts and icons are served locally. No secrets, no network access except package installation and git/gh on the own branch and PR.
- Never disable or delete tests to get green. Never disable axe rules to get green.

## Limit Provisions

- Update progress.md BEFORE starting each stage (status "in progress", next step) and AFTER each commit.
- Prefer frequent small, runnable commits.
- Save all rules needed to resume (review cycle, personas, skills, automated checks, language rules, CI flow) additionally in docs/design/arbeitsregeln.md, so a new session can continue without the original prompt.
- Checkpoint: when stage 6 is complete, update progress.md and write a short summary of the current state (done, open, next step) before continuing.

## Working Method for Code Changes (binding)

- Every code change (components, UI logic, validation, wizards) is implemented with the skill /tdd: test first (red), then implementation (green), then refactor. For UI: component tests for states, interaction and accessibility assertions (roles, labels, focus).
- Additionally use /ponytail for every code implementation, as the skill prescribes. Invoke both skills via the Skill tool and follow their instructions. If a skill is not found: note it in progress.md, continue with what is available and apply the missing steps manually in the same spirit.
- Pure styles/assets without logic need no unit test, but the automated checks and a visual check.

## Automated Checks (mandatory in every stage from stage 2)

Before every review starts, all of these must be green: build, linter, typecheck, all tests AND the accessibility check.

Accessibility check with axe-core:

- In stage 2 set up a Playwright test based on @axe-core/playwright (tags at least wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa) if not present. Add it to the existing test task / npm script so it also runs in CI.
- It covers all main screens and all relevant states (seed data, empty, error, dialog open, every wizard step) in desktop and mobile viewport and, once available, in dark mode.
- Every screen that is new or changed in a stage is added to the axe check (keep the screen list in a file so nothing is forgotten).
- Violations are blockers and are fixed with /tdd. No blanket disableRules or global exceptions. A single exception is allowed only for a proven false positive, limited to one element, with a comment and an entry in offene-punkte.md.
- Axe does not find everything: keyboard order, meaningful labels and understandability are still checked by reviewers and personas (Sven).

## Review Cycle (binding, after EVERY stage)

Stages: (a) analysis, (b) plan/design decisions, (c) each implementation stage, (d) final.

Procedure per stage:

1. Finish the work, run the automated checks, commit, push, wait for ui-screenshots, update progress.md.
2. Start an independent reviewer via the Agent tool with fresh context (read-only, no write access). Give it: goal of the stage, diff/files, the requirements of this brief, UBIQUITOUS_LANGUAGE.md, the axe report, the results of the ui-screenshots job and the review criteria below. Choose the agent type appropriately: Plan for analysis/plan, general-purpose for code and design reviews, Explore for completeness/remnant searches.
3. WAIT until the reviewer is finished. Do not proceed to the next stage in parallel.
4. The reviewer classifies findings as Blocker, Major, Minor. Fix all Blockers and Majors; Minors if cheap, otherwise into offene-punkte.md. Code fixes again with /tdd and /ponytail, then rerun all automated checks.
5. After large changes start a follow-up review (max. 3 rounds per stage). If Blockers remain after round 3, document them in offene-punkte.md and move on.
6. Document in docs/archive/redesign/reviews/<stage>-review-<n>.md: findings, what was changed, what deliberately was not.

Code reviewers check: correctness, test coverage, readability, adherence to tokens (no hardcoded colors/spacing), accessibility (contrast, focus, roles, keyboard, touch size, axe result), consistency, unintended logic changes, remnants of the old design system, terminology (all domain terms match UBIQUITOUS_LANGUAGE.md, no synonyms, no invented explanations).

## Persona Reviews (from stage 4, after every stage with operable UI)

Start one separate agent per persona who actually operates the running app with the seed data (start dev server, use Playwright/browser tool; if no browser is available, work via component/DOM walkthrough and screenshots and note that). Each persona gets a concrete task, may only see and do what a real user could, and reads NO source code and NO glossary. They report thinking aloud: where they hesitated, where they clicked, what was unclear, which term they did not understand, where they feared mistakes, where they failed, with screenshots.

Personas:

1. Helga, 68, heir of an apartment, little computer experience, large font, unsure about domain terms. Task: create the first tenant and create a rental contract.
2. Marco, 38, employed, mostly uses a smartphone, little time. Task: create the utility bill for the previous year (mobile viewport).
3. Dr. Weber, 52, legally cautious, reads everything carefully, questions plausibility. Task: check the bill, understand warnings, assess the PDF preview.
4. Sven, 45, screen reader and keyboard user. Task: go through the rental contract wizard with keyboard only; check focus, labels, error messages.
5. Anna, 29, first-time landlord, returns to the app after months. Task: without any memory, find out what to do next.

Each persona delivers: task completed (yes/partly/no), rough time/click effort, points of confusion (including incomprehensible terms), error risks, concrete improvement suggestions. Save to docs/design/personas/<persona>-<stage>.md.

Terms that personas do not understand are solved with better help texts (based on the glossary), not by renaming the domain term. Fix all Blockers/Majors from persona reports (with /tdd and /ponytail) before moving on. Repeat the affected persona task after larger fixes (max. 2 repetitions).

## Design Requirements

### UX

- Guided wizards (step by step, progress indicator, intermediate saving, back without data loss) for rental contract and utility bill.
- The dashboard answers "What do I need to do now?" (next task, deadlines, incomplete items).
- Domain terms explained in everyday language directly at the field (visible help text with example, no hidden tooltips), based on the glossary.
- Sensible defaults, prefilling, plausibility checks in plain language with a suggested solution.
- Visible save status, document preview before generating, understandable confirmation for irreversible actions.
- One primary action per screen, max. 2 navigation levels.
- Texts: formal address "Sie", friendly, short, concrete; error messages say what happened and what to do. No filler phrases.

### Visual

- Typography: very readable sans-serif (Inter, Source Sans 3 or IBM Plex Sans, served locally), body text and inputs at least 16 px, line height 1.5, tabular figures for amounts, defined type scale.
- Color: neutral base, one calm accent color, semantic colors, all as tokens. Contrast at least WCAG AA, aim for AAA for text. Color never the sole carrier of information. Trustworthy administration/finance look, no startup look.
- Layout: 8 px grid, generous whitespace, max. 2 radius values, max. 2 shadow levels, responsive (desktop, tablet, mobile).
- Operability: click targets at least 44x44 px, full keyboard operation, visible focus, labels above fields, inline validation, prefers-reduced-motion, animations only functional (<= 200 ms).
- Icons: one consistent set (Lucide or Phosphor), same stroke width, text label for non-obvious actions.
- Illustrations: meaningful and functional, themeable SVGs (colors from tokens), consistent line style, motifs from the domain (house, apartment, key, meter, receipts, document), for empty states, onboarding, errors, completion, each with a clear next step. Decorative SVGs with aria-hidden, meaningful ones with a text alternative. No generic human figures, no gradient blobs.
- Forbidden: purple-blue gradients, glow, glassmorphism, emoji as icons, shadow cards everywhere, bento grids without purpose, decoration without function, lorem ipsum (use the seed data or realistic content such as Musterstrasse, Grundsteuer, Wasser, Müll).

## Stages (each with commit, push, checks and review cycle)

0. Analysis: docs/archive/redesign/00-analyse.md (inventory of all screens, components, states, core flows, 5 biggest comprehension barriers, term inventory: terms used in the UI checked against UBIQUITOUS_LANGUAGE.md, deviations and gaps, summary of cy.yml/ui-screenshots). Create the screen list for the axe check. Then create the draft PR. -> Review
1. Plan: docs/archive/redesign/01-plan.md (design decisions with rationale, token proposal, migration strategy, test strategy incl. axe, concept for help texts and term usage). -> Review
2. Tokens + base components (Button, Input, Select, Checkbox, Radio, Textarea, Table, Modal, Toast, Tabs, Navigation, Alert, Empty State, Stepper, Progress indicator, field help text component) with all states. Set up axe test. -> Axe + Code review
3. Icon and illustration system (at least 8 motifs). -> Axe + Design/Code review
4. App shell, navigation, dashboard. -> Axe + Code review + personas Anna, Helga
5. Rental contract wizard. -> Axe + Code review + all personas
6. Utility bill wizard. -> Axe + Code review + all personas. Then write the checkpoint summary (see Limit Provisions).
7. Migrate all remaining screens. -> Axe + Code review + personas
8. Remove the old design system (only if referenced nowhere), clean up dead styles/dependencies. -> Axe + Review (Explore: remnant search)
9. Final: docs/design/design-decisions.md, token-referenz.md, offene-punkte.md (incl. glossary gaps); add a section "Design-Regeln" to CLAUDE.md (target users, "Sie" address, tokens mandatory, terms only from UBIQUITOUS_LANGUAGE.md, anti-patterns, obligation for /tdd, review and axe check). -> Final review + final run of all personas + axe over all screens

## Logging

Maintain docs/archive/redesign/progress.md: per stage status, decisions with rationale, axe result, ui-screenshots result, review rounds, open points. Update after every stage.

## Definition of Done (ALL must be true)

1. All screens use only the new tokens and components; a search for remnants of the old design system finds nothing.
2. Build, linter, typecheck and all tests are green; new components and wizard logic are tested with /tdd.
3. The axe check runs in CI and covers all screens and states, with zero violations and no blanket exceptions.
4. All domain terms in the UI match UBIQUITOUS_LANGUAGE.md; gaps are marked with TODO(fachlich prüfen) and listed in offene-punkte.md.
5. Every stage has a review report; all Blockers and Majors are fixed or justified in offene-punkte.md.
6. All 5 personas completed their task in the final run (or the deviation is justified in offene-punkte.md).
7. Rental contract and utility bill run end-to-end as guided wizards.
8. The dashboard shows next tasks and deadlines; at least 8 illustrations and a consistent icon set are in use.
9. No hardcoded colors/spacing outside tokens; body text and inputs >= 16 px; touch targets >= 44 px; none of the forbidden patterns (gradients, glow, glassmorphism, emoji icons) are present.
10. All documents under docs/design/ and the CLAUDE.md section exist.
11. Everything is committed and pushed, working tree clean, draft PR open, and ui-screenshots has passed for the latest commit (green, or deviations justified in offene-punkte.md).

If you get stuck (e.g. missing domain information), note it in offene-punkte.md and continue with the next stage. Do not stop early.
