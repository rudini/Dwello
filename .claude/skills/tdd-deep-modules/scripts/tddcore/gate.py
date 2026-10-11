"""Stage 2's pass rule: the skill's own tests, its lint, every step's latest review and the verifier lock."""
import hashlib
import re
from pathlib import Path

from tddcore import lint, selfcheck, verdicts

STEPS = ("01", "02", "03", "04", "05", "06", "07", "08")
LOCK_STEP = "08"  # the review of verify_all; the lock records the verifiers as that review saw them
VERIFIERS = ("scripts/verify_all", "scripts/verify_stage1", "scripts/skill_lint", "scripts/tddcore/gate.py",
             "scripts/tddcore/verdicts.py", "scripts/tddcore/selfcheck.py", "scripts/tddcore/lint.py")


def stage2(skill):
    """(passed, lines to print) for the skill at `skill`."""
    skill = Path(skill)
    steps = [(step, *verdicts.final(skill / "evidence" / "reviews", step)) for step in STEPS]
    stale = _lock(skill)
    passed, summary = selfcheck.own_suite(skill / "scripts")
    problems = lint.problems(skill)
    lines = [f"tests: {summary}"] + [f"skill_lint: {p}" for p in problems or ["OK"]]
    lines += [f"step {step}: {description}" for step, _, description in steps]
    lines += [f"verifiers.lock: {p}" for p in stale or ["OK"]]
    passed = passed and not problems and not stale and all(step_passed for _, step_passed, _ in steps)
    return passed, lines + ["STAGE2: PASS" if passed else "STAGE2: FAIL"]


def _lock(skill):
    """Problems of verifiers.lock: it must name step 08's latest passing review and every verifier's hash."""
    lock = skill / "verifiers.lock"
    if not lock.is_file():
        return ["missing"]
    lines = lock.read_text().splitlines()
    reviewed = lines[0].removeprefix("reviewed: ") if lines else ""
    passed, description = verdicts.final(skill / "evidence" / "reviews", LOCK_STEP)
    latest = re.search(r"\(round (\d+)\)$", description)
    found = []
    if not (passed and latest and reviewed == f"evidence/reviews/step-{LOCK_STEP}-round-{latest[1]}.md"):
        found.append(f"reviewed {reviewed} is not step {LOCK_STEP}'s latest passing review")
    hashes = dict(reversed(line.split("  ", 1)) for line in lines[1:] if "  " in line)
    for path in VERIFIERS:
        file = skill / path
        if path not in hashes:
            found.append(f"{path} is not locked")
        elif not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != hashes[path]:
            found.append(f"{path} changed since its review")
    return found
