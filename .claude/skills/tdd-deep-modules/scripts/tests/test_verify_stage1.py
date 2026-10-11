import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from tests.fixture import SCRIPTS

PASSING_TEST = "import unittest\n\n\nclass T(unittest.TestCase):\n    def test_ok(self):\n        pass\n"


def skill_dir(case, verdicts, test=PASSING_TEST):
    """A skill-shaped directory: reviews per step ({step: [verdicts per round]}) and a test suite."""
    tmp = tempfile.TemporaryDirectory()
    case.addCleanup(tmp.cleanup)
    root = Path(tmp.name)
    for step, rounds in verdicts.items():
        for number, verdict in enumerate(rounds, start=1):
            review = root / "evidence" / "reviews" / f"step-{step}-round-{number}.md"
            review.parent.mkdir(parents=True, exist_ok=True)
            review.write_text(f"# Review\n\nfindings\n\nVERDICT: {verdict}\n")
    tests = root / "scripts" / "tests"
    tests.mkdir(parents=True)
    (tests / "__init__.py").write_text("")
    (tests / "test_it.py").write_text(test)
    return root


def verify(root):
    return subprocess.run([sys.executable, str(SCRIPTS / "verify_stage1"), str(root)],
                          capture_output=True, text=True)


class VerifyStage1Test(unittest.TestCase):
    def test_all_steps_passed_and_a_passing_suite_is_stage1_pass(self):
        root = skill_dir(self, {"01": ["FAIL", "PASS"], "02": ["PASS"], "03": ["PASS"]})

        result = verify(root)

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("step 01: VERDICT: PASS (round 2)", result.stdout)
        self.assertIn("step 02: VERDICT: PASS (round 1)", result.stdout)
        self.assertIn("step 03: VERDICT: PASS (round 1)", result.stdout)
        self.assertEqual(result.stdout.strip().splitlines()[-1], "STAGE1: PASS")

    def test_a_step_whose_latest_round_failed_is_stage1_fail(self):
        root = skill_dir(self, {"01": ["PASS"], "02": ["PASS", "FAIL"], "03": ["PASS"]})

        result = verify(root)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("step 02: VERDICT: FAIL (round 2)", result.stdout)
        self.assertEqual(result.stdout.strip().splitlines()[-1], "STAGE1: FAIL")

    def test_a_missing_step_review_is_stage1_fail(self):
        root = skill_dir(self, {"01": ["PASS"], "02": ["PASS"]})

        result = verify(root)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("step 03: no review", result.stdout)
        self.assertEqual(result.stdout.strip().splitlines()[-1], "STAGE1: FAIL")
