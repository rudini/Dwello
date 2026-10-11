# Step 04 (verify_stage1), round 1: response to findings

| Finding | Severity | Fix |
|---|---|---|
| duplicate round numbers (`round-2`, `round-02`) -> false PASS | major | 5c492b0 -> 3deb890 |
| `os._exit(0)` after a failure -> false PASS | major | 181c43e -> 9f6e339: `tddcore/selfcheck.own_suite` requires exit 0, an `OK` summary and at least one executed test (also covers the fully skipped suite and empty stderr) |
| empty review crashes | major | c4f0d7c -> a75950a: empty and non-UTF-8 reviews (and directories) read as "unreadable review" |
| subdirectories without `__init__.py` not discovered | minor | documented |
| fully skipped suite passes | minor | fixed with the os._exit pair (second subtest) |
| empty stderr crash | minor | fixed in `own_suite` |
| earlier `VERDICT: FAIL` line ignored | minor | documented (the contract is the last line) |
| gaming cases unpinned; TESTLIST unticked | minor | e5ae07d pins (round 10, .bak, -response.md, caveats; 3/3 mutations killed); TESTLIST ticked |
| green feba2ef speculative filter / None branch | minor TDD | acknowledged; both are now pinned |
| red 7f8900e failed via a crash | nit | acknowledged |
| slow real run | nit | acknowledged (it runs the full suite by design) |
| PASS rule in the CLI; suite logic in the CLI | assessment | a8772a1: `verdicts.final` returns (passed, description); suite judging moved to `tddcore/selfcheck.own_suite` |
