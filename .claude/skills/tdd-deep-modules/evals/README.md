# Trigger evals

`trigger-eval.json`: 5 prompts that should load the skill and 7 near misses that should not (two of them strict TDD on another stack: Django/pytest, Rust/cargo). Run with skill-creator's `run_eval.py` (it calls the model, so it is evidence, not part of the unit suite):

```bash
cd <an empty project dir with a .claude/ folder>
PYTHONPATH=/mnt/skills/examples/skill-creator python3 -m scripts.run_eval \
  --eval-set <skill>/evals/trigger-eval.json --skill-path <skill> \
  --runs-per-query 3 --timeout 120 --num-workers 1
```

Use `--num-workers 1`: with parallel workers every run sees several identical copies of the skill and picks another worker's copy, which `run_eval` counts as "not triggered" (a first parallel run scored 0 of 5 triggers this way).

`trigger-result.json` (2026-10-11, 3 runs per prompt, serial): 12 of 12 passed: every should-trigger prompt triggered in 3 of 3 runs, no near miss triggered in any run. An earlier 1-run pass over the first 10 prompts also scored 10 of 10.
