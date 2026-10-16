# Subagent models: benchmark Opus vs Sonnet

Question: can the reviewer subagents run on a cheaper model without losing findings? Method: each candidate agent ran twice on an old commit whose review findings are known, once with `model: opus` and once with `model: sonnet`, with the current agent definition, the same prompt and a fresh `dwello_persona` database per run (personas one after the other, so neither saw the other's records). The original reports are the reference; a finding counts as found when the run names the same defect, whatever its wording.

Runs' reports: `docs/reviews/agent-models/`.

## A: `daten-pruefer` on `cbbaafa` (#137)

Reference: `docs/reviews/issue-137-datenpruefung-1.md`: D-1 Major (summer period: heating invoice with Leistungszeitraum split by the period's days), D-2 Minor (whole period rented, PDF shows the heating profile), D-3 Minor (Leistungszeitraum share as percent instead of days).

Round 1 ran against the wrong app: the persona stack of `cbbaafa` changed to `/home/user/Dwello` (fixed since), so it served the current `main`. **Both models noticed it** (process cwd, schema columns that `cbbaafa` lacks) and both read D-1 out of the code without data. Round 2 ran on an app built from `cbbaafa`.

| Known finding | Opus | Sonnet |
|---|---|---|
| D-1 Major | found, Major, shown in data (2 statements, QR amounts) | found, Major, shown in data (4 statements, QR amounts) |
| D-2 Minor | not found | found (D-5, Nit) |
| D-3 Minor | found (D-5, Minor) | not found |
| New | D-4 Minor: «3.13 %» instead of «1/32 Tage» at a floating-point boundary; detail page still names the heating profile (Minor) | detail page still names the heating profile (Minor); Akonto of a partial month not specified (Nit) |

Cases built: Opus 10 statements in 4 buildings, Sonnet 28 in 2. Tokens: Opus 175k, Sonnet 189k (round 2 totals). **Result: equal.**

## B: persona Dr. Weber on `cf49fa5` (#226)

Reference: `docs/design/personas/dr-weber-226.md`: P-1 Major (the note under the table does not explain the Hauswart share 50.00 % next to 184/365 elsewhere), P-2 Minor (unlabelled «0/90 Tage»), P-3 Minor (rows do not say they are invoices), P-4 Nit (rounding via the rounded Wohnungsanteil).

| Known finding | Opus | Sonnet |
|---|---|---|
| P-1 Major | found (P-2), as Minor | found (P-2), as Major |
| P-2 Minor | found (P-1) | found (P-1, Major, with P-3) |
| P-3 Minor | found (P-3) | found (in P-1) |
| P-4 Nit | found (P-4, Minor; adds the 1 Rappen over the apartment) | found (P-3, Minor) |

Tokens: Opus 85k, Sonnet 66k. **Result: equal; Sonnet's severity was closer to the reference.**

## C: persona Marco on `70fbc67` (#233)

Reference: `docs/design/personas/marco-233.md`: P-1 Minor (a credit note gets the invoice's to-do list), P-2 Minor («hier in ihrer Zeile» unclear, no amount), P-3 Minor (rows unchecked without a reason), P-4 Minor (on the phone the preview and link sit above the fields, comparing means switching tabs), P-5 Minor (Akontozahlungen vs Akontorechnungen), P-6 Nit (red «Abbrechen und verwerfen» after creating), P-7 Nit (link text in two columns at 390 px).

| Known finding | Opus | Sonnet |
|---|---|---|
| P-1 | found (P-1, Major: the credit note can be created as an invoice) | partly (P-4, Nit) |
| P-2 | found (P-2) | partly (in P-4: no link to the invoice) |
| P-3 | found (P-3) | not found |
| P-4 | not found (P-7 on the download name is related) | not found |
| P-5 | found (P-5) | only as an observation |
| P-6 | found (P-4) | not found |
| P-7 | found (P-6) | found (P-3) |

Sonnet's P-1 («the hint does not name the amounts») does not hold for the 1'000.00, which the hint names. Tokens: Opus 82k, Sonnet 69k. **Result: Opus 6 of 7, Sonnet 2 of 7 plus 2 partly; Sonnet rated the one data risk (a credit note created as a positive invoice) a Nit.**

## Decision

| Agent | Model | Why |
|---|---|---|
| `code-reviewer` | `opus` | Main quality gate; not benchmarked, pinned so a session on another model does not weaken it |
| `fach-reviewer` | `opus` | Tenancy and data protection law, verbatim quotes; not benchmarked, pinned as above |
| `persona` | `opus` | Equal on a reading task (B), clearly worse on an interactive phone task (C); most persona runs are interactive |
| `daten-pruefer` | `sonnet` | Equal in A: the Major found and shown in data, as many known Minors, more cases built |

Limits: one run per model and benchmark, so a single run's luck weighs in; Sonnet used from 8 % more tokens (A) to 22 % fewer (B), so the saving is mainly Sonnet's lower price. The decision for `daten-pruefer` rests on one commit; a `daten-pruefer` that confirms amounts a later review finds wrong is a reason to move it back to `opus`.
