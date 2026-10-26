# testcheck validation

How often testcheck is right (precision) and how much it finds (recall), measured on Dwello and 15 open-source TypeScript repositories that test with Vitest. Reproduce with `bun run testcheck:measure -- <cache dir>` and `bun run testcheck:seed -- src backend/src tools <cache dir>/*` (`README.md`, "Measuring").

## Target

Set before measuring, from what a gate needs to be trusted rather than ignored:

- **Gate rules** (fail a change): precision at least 90 % on every corpus, the pooled 95 % lower bound at least 85 %. A rule below that becomes a hint or is dropped.
- **Hints** (shown, never failing): precision at least 70 %.
- **Recall on planted defects**: at least 95 % per gate rule; every miss explained by a documented exemption.

All three hold (below). What the numbers cannot say is at the end.

## Corpus

| Corpus | Repositories | Test files | Tests |
|---|---|---|---|
| Dwello (tuning) | this repository: `src`, `backend/src`, `tools`, `tests` | 310 | 3,968 |
| Tuning | excalidraw, h3, hono, TanStack Query, ufo, unstorage, valibot, VueUse, zod, zustand | 1,342 | 18,016 |
| Holdout | remeda, SvelteKit, tRPC, unhead, Vue core | 879 | 8,845 |

Pinned commits: `eval/corpus.json`. The rules were developed and tuned on Dwello and the tuning repositories; the holdout repositories were added only after that, to see how the rules do on code they were not fitted to.

## Method

- **Precision:** every finding on all corpora was labelled `tp` (the finding is right) or `fp` by reviewers (subagents with fresh context) who got the code, the rule and a fixed rubric per rule, but not the tool's reasoning: 678 labels with a reason each, of the findings of every run including the dropped rules, in `eval/labels.json`. A spot check of 12 random labels by hand agreed on all 12. Labelled by hand: the 295 `tautology` findings of the first holdout run (two patterns, below) and two findings a rule change moved to another rule.
- **Recall:** real tests got a defect planted into their own code (`eval/seed.ts`): the body wrapped in a `try` with an empty `catch`, in a `catch`, in a loop over a function result, in an unawaited `then`; the first matcher call dropped; the expected value copied into `expect(…)` (only one without a call: two calls compared are accepted on purpose); an `await` before `expect(…).resolves/rejects` removed; the body or the title of the next test copied. Up to three tests per file without findings, 44,000 planted defects in all. A defect counts as found when its rule reports that test.

## Precision

| Rule | Dwello + tuning | Holdout, first run | Holdout, final |
|---|---|---|---|
| `catch-only-assertion` | 50 / 50 | 2 / 2 | 2 / 2 |
| `duplicate-title` | 50 / 50 | 11 / 11 | 11 / 11 |
| `duplicate-body` | 25 / 25 | 4 / 4 | 4 / 4 |
| `dangling-expect` | 8 / 8 | 2 / 2 | 2 / 2 |
| `tautology` | 11 / 11 (first 11 / 12) | 5 / 295 | 5 / 5 |
| `empty-test` | 4 / 4 | – | – |
| `callback-only-assertion` | 1 / 1 | – | – |
| `unawaited-assertion`, `swallowed-assertion` | no findings | – | – |
| **Gate rules pooled** | **149 / 149 = 100 % (lower bound 97.5 %)** | 24 / 314 = 7.6 % | **24 / 24 = 100 % (lower bound 86.2 %)** |
| `loop-only-assertion` (hint) | 13 / 20 | 19 / 20 | 19 / 20 |

Right findings / all findings; lower bound: Wilson 95 % interval. Dwello itself has no gate finding (the baseline is empty) and one hint: `statement-pages.dom.test.ts`, «gliedert die Summen mit Rundung als gültige Beschreibungsliste» loops over `document.querySelectorAll('dl')` without asserting that there is one.

The first holdout run shows why the holdout was worth it: `tautology` treated every literal as `actual` as a tautology, but Vue asserts logged warnings with a custom matcher, `expect('<warning text>').toHaveBeenWarned()` (290 findings), and tRPC marks unreachable code with `expect(true).toBe(false)`, which always fails. The rule now only judges built-in matchers on literals and reports them only when they always hold. That fix was made after seeing the holdout, so the final holdout column is no longer out of sample for `tautology`; for every other gate rule the first run is the final run.

The one wrong `tautology` of the first tuning run: excalidraw `expect(getSeriesLineColors(0.125)).toEqual(getSeriesLineColors(0.125))`, which checks that the colours are deterministic. Since the code review (`docs/reviews/testcheck-review-1.md`, C-2) two calls compared with each other are no tautology. The same review found that calls named `check…` counted as assertions also for `checker()` or `checkout()` (C-3); with that fixed, one more right `catch-only-assertion` showed up in zod.

## Recall on planted defects

| Planted defect | Planted | Found | Recall | Missed |
|---|---|---|---|---|
| `swallowed-assertion` | 5,731 | 5,731 | 100.0 % | |
| `catch-only-assertion` | 5,731 | 5,728 | 99.9 % | 3 reported as `loop-only-assertion` (an inner loop is the closer guard) |
| `callback-only-assertion` | 5,731 | 5,728 | 99.9 % | 3 reported as `loop-only-assertion` |
| `loop-only-assertion` | 5,731 | 5,731 | 100.0 % | |
| `dangling-expect` | 6,049 | 6,049 | 100.0 % | |
| `tautology` | 4,993 | 4,859 | 97.3 % | 134 by design: `expect(a.b).toBe(a.b)` checks identity (a getter returning the same object) and is not reported |
| `unawaited-assertion` | 77 | 77 | 100.0 % | |
| `duplicate-body` | 4,956 | 4,926 | 99.4 % | by design: 28 tests in a loop, which are not compared (one of them reported as `loop-only-assertion`); 2 reported as `duplicate-title`, since the two tests also share their title |
| `duplicate-title` | 4,956 | 4,929 | 99.5 % | by design: 27 tests in a loop (one reported as `loop-only-assertion`) |

The wrapping defects were planted only into tests with a runtime `expect` and none of what the rules accept on purpose: a `throw`, `expect.assertions`, a type assertion, a `done` parameter. Planted defects are of the shapes the rules look for, so this recall shows that the rules find them in real code of every style, not how many of all bad tests they find.

## Measured and dropped

| Approach | Result | Decision |
|---|---|---|
| `no-assertion`: a test that runs code but asserts nothing | 29 / 94 right on the tuning corpus, 23 / 45 after two rounds of fixes, 1 / 50 on the holdout. Most were deliberate: "parses without throwing" tests, type-only tests, tests whose helper from another file asserts, Playwright `waitForSelector` | dropped; `empty-test` keeps the case that is always wrong |
| `conditional-assertion`: every assertion under an `if`, `&&`, `?:` or `switch` | 8 / 20 right on the tuning corpus | dropped |
| Title words vs body words: a title that fits another test's body better than its own (idf-weighted, German and English, inflections) | on unchanged tests 20–45 % flagged at margins that found 50–70 % of swapped titles; 25 % of real tests share no telling word with their own body | dropped |
| Concrete anchors of a title (quoted text, numbers, code names) missing in the body | 1.5–8 % of unchanged tests flagged, mostly "without X", "nicht X", translated labels, unit conversions (70 % vs `0.7`) | dropped |
| The same, only when the anchor is in another test's body | 0.7 % of tests flagged, few right on inspection; 6 % of swapped titles found | dropped |
| A title claiming "throws" without a throw assertion | 38 findings, about 40 % right (HTTP errors and validation results were "throws" in prose) | dropped |

## Not measured, open

- Recall on natural defects: bad tests are rare (the 31,000 tests of the corpus had about 170 gate findings), so a random sample cannot estimate it; only planted defects were measured.
- Small samples: `empty-test`, `callback-only-assertion`, `unawaited-assertion` and `swallowed-assertion` have few or no natural findings; their precision rests on the planted defects and on being mechanical (the lower bounds per rule are wide, see `bun run testcheck:measure`).
- JavaScript test files (`.js`) are not analysed; Jest projects were not in the corpus.
