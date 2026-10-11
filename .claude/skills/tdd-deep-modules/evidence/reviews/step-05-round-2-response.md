# Response to step 05 (SKILL.md), round 2

- [major] false claim about `tdd_replay`: red "SKILL.md honest replay claims" (asserts the sentence is gone and that section 4 says a refactor may change how a test calls the module, never what it expects, and that `tdd_replay` does not catch a weakened assertion), green after it. The "rejects anything that broke the protocol" sentence now names what the replay checks; section 6's proof says what ACCEPT does and does not prove (red/green "depth_report and proof"). Section 5's "update the calls inside the tests" no longer contradicts section 4.
- [minor] way back without stashing: the way back now starts with `git stash push -u -- <files>` and ends with `git stash pop` (same red/green as the major).
- [minor] droppable required elements: pinned "one-sentence reason", "One test per cycle" and "no second test before the first is green"; mutation log `evidence/mutations/step-05-round-2-pins.txt`, 3/3 KILLED.
- [minor] `depth_report <changed files>`: now "changed production .ts/.js files" (red/green "depth_report and proof").
- [nit] tooling.md refusal list now includes refactor after a `test:` or non-phase commit; replay list includes "red's failing test must be its new test".
- [nit] a test found wrong right after its green: "A test found wrong after its green (this cycle or an earlier one) is a question for the user."
- [nit] untested text in green c243e46: the new wording is pinned by the red above.
