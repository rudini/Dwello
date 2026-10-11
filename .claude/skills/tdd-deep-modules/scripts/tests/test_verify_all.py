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
VERIFIERS = ["verify_all", "verify_stage1", "skill_lint", "tddcore/__init__.py", "tddcore/gate.py",
             "tddcore/verdicts.py", "tddcore/selfcheck.py", "tddcore/lint.py"]
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
    """The lock as the documented sha256sum command writes it: every file under scripts/ but tests/."""
    files = sorted(path.relative_to(root).as_posix() for path in (root / "scripts").rglob("*")
                   if path.is_file() and path.relative_to(root / "scripts").parts[0] != "tests"
                   and "__pycache__" not in path.parts)
    lines = [f"reviewed: {review}"] + [
        f"{hashlib.sha256((root / name).read_bytes()).hexdigest()}  {name}" for name in files]
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

        def init_edited(root):
            (root / "scripts" / "tddcore" / "__init__.py").write_text("from tddcore import lint\n")
            return root

        def shadow(root):
            (root / "scripts" / "hashlib.py").write_text("# shadows the standard library\n")
            return root

        cases = {
            "package init edited": (lambda: init_edited(skill_dir(self)),
                                    "verifiers.lock: scripts/tddcore/__init__.py changed since its review"),
            "file added next to the verifiers": (lambda: shadow(skill_dir(self)),
                                                 "verifiers.lock: scripts/hashlib.py is not locked"),
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


class LockFormatTest(unittest.TestCase):
    def test_a_lock_must_hold_exactly_one_well_formed_line_per_file(self):
        def edit(root, change):
            lock = root / "verifiers.lock"
            lock.write_text(change(lock.read_text()))
            return root

        def stale_then_right(text):
            line = next(line for line in text.splitlines() if line.endswith("  scripts/skill_lint"))
            return text.replace(line, "0" * 64 + "  scripts/skill_lint\n" + line)

        cases = {
            "duplicate": (lambda: edit(skill_dir(self), stale_then_right),
                          "verifiers.lock: scripts/skill_lint is locked twice"),
            "junk line": (lambda: edit(skill_dir(self), lambda text: text + "anything\n"),
                          "verifiers.lock: line 'anything' is not '<sha256>  <path>'"),
        }
        for name, (build, line) in cases.items():
            with self.subTest(name):
                result = verify(build())

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(line, result.stdout.splitlines())

    def test_an_unreadable_lock_is_named(self):
        root = skill_dir(self)
        (root / "verifiers.lock").write_bytes(b"reviewed: \xff\n")

        result = verify(root)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("verifiers.lock: not readable as UTF-8 text", result.stdout.splitlines())
        self.assertEqual(result.stdout.strip().splitlines()[-1], "STAGE2: FAIL")

    def test_the_lock_names_the_real_file_of_the_latest_review(self):
        root = skill_dir(self, lock=False)
        reviews = root / "evidence" / "reviews"
        (reviews / "step-08-round-1.md").rename(reviews / "step-08-round-01.md")
        write_lock(root, "evidence/reviews/step-08-round-01.md")
        named_right = verify(root)
        write_lock(root, "evidence/reviews/step-08-round-1.md")
        named_wrong = verify(root)

        self.assertEqual(named_right.returncode, 0, named_right.stdout + named_right.stderr)
        self.assertEqual(named_wrong.returncode, 1, named_wrong.stdout + named_wrong.stderr)


    def test_a_lock_naming_a_failed_latest_review_is_named(self):
        root = skill_dir(self, {**ALL_PASS, "08": ["PASS", "FAIL"]})

        result = verify(root)

        self.assertIn("verifiers.lock: reviewed evidence/reviews/step-08-round-2.md is not step 08's latest "
                      "passing review", result.stdout.splitlines())


def real_copy(case):
    """A skill-shaped directory holding a copy of the real scripts (all but the tests), locked."""
    root = skill_dir(case, lock=False)
    for path in (SKILL / "scripts").rglob("*"):
        relative = path.relative_to(SKILL / "scripts")
        if path.is_file() and relative.parts[0] != "tests" and "__pycache__" not in relative.parts:
            (root / "scripts" / relative).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, root / "scripts" / relative)
    write_lock(root, "evidence/reviews/step-08-round-1.md")
    return root


def run_copy(root):
    """The copy's own verify_all, run without arguments from another directory, as "Done when" runs it."""
    return subprocess.run([sys.executable, str(root / "scripts" / "verify_all")], cwd=tempfile.gettempdir(),
                          capture_output=True, text=True)


class RealVerifiersTest(unittest.TestCase):
    def test_a_copy_of_the_real_verifiers_run_without_arguments_checks_its_own_skill(self):
        result = run_copy(real_copy(self))

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(result.stdout.strip().splitlines()[-1], "STAGE2: PASS")

    def test_a_module_added_to_scripts_cannot_shadow_an_import(self):
        root = real_copy(self)
        for name in ("hashlib", "pathlib", "re"):
            (root / "scripts" / f"{name}.py").write_text('print("STAGE2: PASS")\nraise SystemExit(0)\n')

        result = run_copy(root)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("verifiers.lock: scripts/hashlib.py is not locked", result.stdout.splitlines())

    def test_a_symbolic_link_under_scripts_is_named(self):
        root = real_copy(self)
        outside = root.parent / "hidden"
        outside.mkdir()
        (outside / "__init__.py").write_text("")
        (root / "scripts" / "extra").symlink_to(outside, target_is_directory=True)

        result = run_copy(root)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("verifiers.lock: scripts/extra is a symbolic link", result.stdout.splitlines())

    def test_crafted_bytecode_next_to_a_verifier_is_never_loaded(self):
        import importlib.util
        import py_compile
        root = real_copy(self)
        skill_md = root / "SKILL.md"
        skill_md.write_text(skill_md.read_text().split("## 6. Design note")[0])
        lint = root / "scripts" / "tddcore" / "lint.py"
        forged = root.parent / "forged_lint.py"
        forged.write_text("def problems(skill):\n    return []\n")
        py_compile.compile(str(forged), cfile=importlib.util.cache_from_source(str(lint)), doraise=True,
                           invalidation_mode=py_compile.PycInvalidationMode.UNCHECKED_HASH)

        result = run_copy(root)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("skill_lint: missing section '6. Design note'", result.stdout.splitlines())


    def test_only_the_top_level_test_suite_is_left_out_of_the_lock(self):
        root = real_copy(self)
        nested = root / "scripts" / "tddcore" / "tests"
        nested.mkdir()
        (nested / "a.py").write_text("# loadable as tddcore.tests.a\n")
        locked = run_copy(root)
        write_lock(root, "evidence/reviews/step-08-round-1.md")
        relocked = run_copy(root)

        self.assertIn("verifiers.lock: scripts/tddcore/tests/a.py is not locked", locked.stdout.splitlines())
        self.assertEqual(relocked.returncode, 0, relocked.stdout + relocked.stderr)

    def test_crafted_bytecode_for_the_test_suite_is_never_loaded(self):
        import importlib.util
        import py_compile
        root = real_copy(self)
        test = root / "scripts" / "tests" / "test_it.py"
        test.write_text("import unittest\n\n\nclass T(unittest.TestCase):\n    def test_a(self):\n        self.fail('x')\n")
        forged = root.parent / "forged_test.py"
        forged.write_text(PASSING_TEST)
        py_compile.compile(str(forged), cfile=importlib.util.cache_from_source(str(test)), doraise=True,
                           invalidation_mode=py_compile.PycInvalidationMode.UNCHECKED_HASH)

        result = run_copy(root)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("tests: FAILED (failures=1)", result.stdout.splitlines())
