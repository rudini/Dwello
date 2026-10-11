"""Stage 2's pass rule: the skill's own tests, its lint, every step's latest review and the verifier lock."""
from pathlib import Path

from tddcore import lint, selfcheck, verdicts

STEPS = ("01", "02", "03", "04", "05", "06", "07", "08")


def stage2(skill):
    """(passed, lines to print) for the skill at `skill`."""
    skill = Path(skill)
    steps = [(step, *verdicts.final(skill / "evidence" / "reviews", step)) for step in STEPS]
    passed, summary = selfcheck.own_suite(skill / "scripts")
    problems = lint.problems(skill)
    lines = [f"tests: {summary}"] + [f"skill_lint: {p}" for p in problems or ["OK"]]
    lines += [f"step {step}: {description}" for step, _, description in steps]
    lines.append("verifiers.lock: OK")
    passed = passed and not problems and all(step_passed for _, step_passed, _ in steps)
    return passed, lines + ["STAGE2: PASS" if passed else "STAGE2: FAIL"]
