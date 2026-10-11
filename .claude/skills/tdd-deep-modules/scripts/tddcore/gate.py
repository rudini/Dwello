"""Stage 2's pass rule: the skill's own tests, its lint, every step's latest review and the verifier lock."""
import hashlib
import re
from pathlib import Path

from tddcore import lint, selfcheck, verdicts

STEPS = ("01", "02", "03", "04", "05", "06", "07", "08")
LOCK_STEP = "08"  # the review of verify_all; the lock records the verifiers as that review saw them


def stage2(skill=Path(__file__).resolve().parents[2]):
    """(passed, lines to print) for the skill at `skill` (default: the skill this file belongs to)."""
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
    try:
        lines = lock.read_text(encoding="utf-8").splitlines()
    except UnicodeDecodeError:
        return ["not readable as UTF-8 text"]
    reviewed = lines[0].removeprefix("reviewed: ") if lines else ""
    passed, description = verdicts.final(skill / "evidence" / "reviews", LOCK_STEP)
    latest = re.search(r"\(round (\d+)\)$", description)
    found = []
    if not (passed and latest and reviewed == f"evidence/reviews/step-{LOCK_STEP}-round-{latest[1]}.md"):
        found.append(f"reviewed {reviewed} is not step {LOCK_STEP}'s latest passing review")
    hashes = {}
    for line in lines[1:]:
        entry = re.fullmatch(r"([0-9a-f]{64})  (\S+)", line)
        if not entry:
            found.append(f"line {line!r} is not '<sha256>  <path>'")
        elif entry[2] in hashes:
            found.append(f"{entry[2]} is locked twice")
        else:
            hashes[entry[2]] = entry[1]
    present = _verifiers(skill)
    for path in sorted(set(present) | set(hashes)):
        if path not in hashes:
            found.append(f"{path} is not locked")
        elif path not in present or hashlib.sha256((skill / path).read_bytes()).hexdigest() != hashes[path]:
            found.append(f"{path} changed since its review")
    return found


def _verifiers(skill):
    """Every file the scripts can load: all of scripts/ except the test suite and bytecode caches."""
    scripts = skill / "scripts"
    return [path.relative_to(skill).as_posix() for path in scripts.rglob("*")
            if path.is_file() and not {"tests", "__pycache__"} & set(path.relative_to(scripts).parts)]
