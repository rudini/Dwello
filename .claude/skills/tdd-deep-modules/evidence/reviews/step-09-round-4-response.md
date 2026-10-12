# Response to step 09 (two-tier suite), round 4

- [minor] mid-range `test:` commit breaking a full-tier test through data: documented in DESIGN.md Known limits (the `test` rules judge the claimed tier, right after a green or refactor only; only task ends and the range end are held to the full suite).
- [minor] empty fast suite: SKILL.md section 3 and DESIGN.md Known limits say to commit the test phase with `--suite full` when the fast suite has no tests.
- [minor] SKILL.md section 3 now names the `test` refusals (failing tests after a green or refactor, right after a fast green) and points to references/tooling.md.
