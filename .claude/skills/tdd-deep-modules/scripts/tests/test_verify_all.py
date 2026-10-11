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

    def test_a_failed_or_missing_review_lint_problem_or_failing_suite_is_stage2_fail(self):
        failing = "import unittest\n\n\nclass T(unittest.TestCase):\n    def test_a(self):\n        self.fail('x')\n"
        no_step_06 = {step: rounds for step, rounds in ALL_PASS.items() if step != "06"}
        cases = {
            "review failed": (lambda: skill_dir(self, {**ALL_PASS, "07": ["PASS", "FAIL"]}),
                              "step 07: VERDICT: FAIL (round 2)"),
            "review missing": (lambda: skill_dir(self, no_step_06), "step 06: no review"),
            "lint problem": (lambda: _broken_lint(skill_dir(self)), "skill_lint: missing section '6. Design note'"),
            "failing suite": (lambda: skill_dir(self, test=failing), "tests: FAILED (failures=1)"),
        }
        for name, (build, line) in cases.items():
            with self.subTest(name):
                result = verify(build())

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(line, result.stdout.splitlines())
                self.assertEqual(result.stdout.strip().splitlines()[-1], "STAGE2: FAIL")


def _broken_lint(root):
    text = (root / "SKILL.md").read_text()
    (root / "SKILL.md").write_text(text[:text.index("## 6. Design note")])
    return root


class VerifiersLockTest(unittest.TestCase):
    def test_a_missing_stale_or_misplaced_lock_is_stage2_fail(self):
        def changed(root):
            (root / "scripts" / "tddcore" / "lint.py").write_text("# edited after the review\n")
            return root

        def old_review(root):
            write_lock(root, "evidence/reviews/step-08-round-1.md")
            return root

        def tampered(root):
            lock = root / "verifiers.lock"
            lock.write_text(lock.read_text().replace("  scripts/skill_lint\n", "  scripts/other\n"))
            return root

        cases = {
            "missing": (lambda: skill_dir(self, lock=False), "verifiers.lock: missing"),
            "verifier changed": (lambda: changed(skill_dir(self)),
                                 "verifiers.lock: scripts/tddcore/lint.py changed since its review"),
            "not the latest review": (lambda: old_review(skill_dir(self, {**ALL_PASS, "08": ["FAIL", "PASS"]})),
                                      "verifiers.lock: reviewed evidence/reviews/step-08-round-1.md is not step 08's "
                                      "latest passing review"),
            "a verifier not locked": (lambda: tampered(skill_dir(self)),
                                      "verifiers.lock: scripts/skill_lint is not locked"),
        }
        for name, (build, line) in cases.items():
            with self.subTest(name):
                result = verify(build())

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(line, result.stdout.splitlines())
                self.assertEqual(result.stdout.strip().splitlines()[-1], "STAGE2: FAIL")


class ThinEntryPointTest(unittest.TestCase):
    def test_verify_all_holds_no_logic(self):
        import ast
        tree = ast.parse((SCRIPTS / "verify_all").read_text())

        logic = [type(node).__name__ for node in ast.walk(tree)
                 if isinstance(node, (ast.If, ast.For, ast.While, ast.Try, ast.With, ast.FunctionDef, ast.ClassDef,
                                      ast.BoolOp, ast.Compare, ast.comprehension))]
        calls = [ast.unparse(node.func) for node in ast.walk(tree) if isinstance(node, ast.Call)]

        self.assertEqual(logic, [])
        self.assertEqual(calls.count("gate.stage2"), 1)
