import hashlib
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from tests.fixture import SCRIPTS

SKILL = SCRIPTS.parent
PASSING_TEST = "import unittest\n\n\nclass T(unittest.TestCase):\n    def test_ok(self):\n        pass\n"
VERIFIERS = ["verify_all", "verify_stage1", "skill_lint", "tddcore/gate.py", "tddcore/verdicts.py",
             "tddcore/selfcheck.py", "tddcore/lint.py"]
ALL_PASS = {f"{n:02d}": ["PASS"] for n in range(1, 9)}


def skill_dir(case, verdicts=ALL_PASS, test=PASSING_TEST, lock=True):
    """A skill-shaped directory: the real SKILL.md and references, reviews, a suite, verifier stand-ins."""
    tmp = tempfile.TemporaryDirectory()
    case.addCleanup(tmp.cleanup)
    root = Path(tmp.name) / SKILL.name
    shutil.copytree(SKILL / "references", root / "references")
    shutil.copy2(SKILL / "SKILL.md", root / "SKILL.md")
    (root / "scripts" / "tddcore").mkdir(parents=True)
    shutil.copy2(SKILL / "scripts" / "tdd-guard", root / "scripts" / "tdd-guard")
    for name in VERIFIERS:
        (root / "scripts" / name).write_text(f"# stand-in for {name}\n")
    reviews = root / "evidence" / "reviews"
    reviews.mkdir(parents=True)
    for step, rounds in verdicts.items():
        for number, verdict in enumerate(rounds, start=1):
            (reviews / f"step-{step}-round-{number}.md").write_text(f"# Review\n\nVERDICT: {verdict}\n")
    tests = root / "scripts" / "tests"
    tests.mkdir()
    (tests / "__init__.py").write_text("")
    (tests / "test_it.py").write_text(test)
    if lock:
        write_lock(root, f"evidence/reviews/step-08-round-{len(verdicts.get('08', ['PASS']))}.md")
    return root


def write_lock(root, review):
    lines = [f"reviewed: {review}"] + [
        f"{hashlib.sha256((root / 'scripts' / name).read_bytes()).hexdigest()}  scripts/{name}"
        for name in VERIFIERS]
    (root / "verifiers.lock").write_text("\n".join(lines) + "\n")


def verify(root):
    return subprocess.run([sys.executable, str(SCRIPTS / "verify_all"), str(root)],
                          capture_output=True, text=True)


class VerifyAllTest(unittest.TestCase):
    def test_everything_passing_is_stage2_pass_with_every_verdict(self):
        root = skill_dir(self)

        result = verify(root)

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        lines = result.stdout.strip().splitlines()
        self.assertEqual(lines[:2], ["tests: OK", "skill_lint: OK"])
        self.assertEqual(lines[2:10], [f"step {n:02d}: VERDICT: PASS (round 1)" for n in range(1, 9)])
        self.assertEqual(lines[10:], ["verifiers.lock: OK", "STAGE2: PASS"])
