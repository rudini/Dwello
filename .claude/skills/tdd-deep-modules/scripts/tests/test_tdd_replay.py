import signal
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path

from tests.fixture import (BUN_TEST, RIGHT_ADD_JS, RIGHT_ADD_TS, SCRIPTS, VITEST_TEST, WRONG_ADD_TS, Repo,
                           bun_repo, vitest_repo)

DECIMALS_TEST = 'test("adds decimals", () => {\n  expect(add(0.1, 0.2)).toBe(0.3);\n});\n'
ROUNDING_ADD_TS = "export const add = (a: number, b: number) => Math.round((a + b) * 1e9) / 1e9;\n"
REDUCED_ADD_TS = "export const add = (a: number, b: number) => [a, b].reduce((x, y) => x + y);\n"


def good_history(case):
    """test, red, green, refactor, red, green on a bun project; returns (repo, base commit)."""
    repo = bun_repo(case)
    base = repo.git("rev-parse", "HEAD")
    repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n- [ ] adds decimals\n"}, 1)
    repo.commit_phase("red", {"calc.test.ts": BUN_TEST}, 1)
    repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0)
    repo.commit_phase("refactor", {"calc.ts": REDUCED_ADD_TS}, 0)
    repo.commit_phase("red", {"calc.test.ts": BUN_TEST + "\n" + DECIMALS_TEST}, 1)
    repo.commit_phase("green", {"calc.ts": ROUNDING_ADD_TS}, 0)
    return repo, base


class TddReplayTest(unittest.TestCase):
    def test_a_good_history_is_accepted(self):
        repo, base = good_history(self)

        result = repo.run("tdd_replay", f"{base}..HEAD")

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("REPLAY: ACCEPT", result.stdout)

    def assert_rejected(self, repo, base, reason):
        result = repo.run("tdd_replay", f"{base}..HEAD")
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("REPLAY: REJECT", result.stdout)
        self.assertIn(reason, result.stdout)

    def test_a_commit_that_only_claims_red_is_rejected(self):
        repo = bun_repo(self, RIGHT_ADD_TS)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST}, 1)
        repo.commit_phase("green", {"calc.ts": REDUCED_ADD_TS}, 0)
        self.assert_rejected(repo, base, "red needs a failing assertion")

    def test_an_import_error_committed_as_red_is_rejected(self):
        repo = bun_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST.replace('"./calc"', '"./missing"')}, 1)
        repo.commit_phase("green", {"missing.ts": RIGHT_ADD_TS}, 0)
        self.assert_rejected(repo, base, "red needs a failing assertion")

    def test_production_code_before_its_red_test_is_rejected(self):
        repo = bun_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST, "calc.ts": WRONG_ADD_TS + "export const sub = () => 0;\n"}, 1)
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0)
        self.assert_rejected(repo, base, "production code changed: calc.ts")

    def test_a_refactor_on_red_is_rejected(self):
        repo, base = good_history(self)
        repo.commit_phase("refactor", {"calc.ts": RIGHT_ADD_TS.replace("a + b", "a - b")}, 1)
        self.assert_rejected(repo, base, "refactor needs all tests passing")

    def test_two_new_tests_in_one_cycle_are_rejected(self):
        passing = 'test("adds zero", () => {\n  expect(add(0, 0)).toBe(0);\n});\n'
        repo = bun_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST + "\n" + passing}, 1)
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0)
        self.assert_rejected(repo, base, "red must add exactly one new test, but adds 2")

    def test_a_test_added_outside_red_is_rejected(self):
        repo, base = good_history(self)
        repo.commit_phase("refactor", {"zero.test.ts": BUN_TEST.replace("toBe(3)", "toBe(3);\n  expect(add(0, 0)).toBe(0)")
                                       .replace('"adds"', '"adds zero"')}, 0)
        self.assert_rejected(repo, base, "only red may add tests, but refactor adds 1")

    def test_a_trailer_exit_code_that_differs_from_the_real_run_is_rejected(self):
        repo, base = good_history(self)
        repo.commit_phase("refactor", {"calc.ts": ROUNDING_ADD_TS.replace("a + b", "b + a")}, 7)
        self.assert_rejected(repo, base, "the trailer says exit code 7, but the tests exit with 0")

    def test_a_history_that_ends_in_red_is_rejected(self):
        repo = bun_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST}, 1)
        self.assert_rejected(repo, base, "the history ends in red: every red needs a green")

    def test_a_commit_without_a_phase_prefix_is_rejected(self):
        repo, base = good_history(self)
        repo.commit_all("tweak add", {"calc.ts": ROUNDING_ADD_TS.replace("a + b", "b + a")})
        self.assert_rejected(repo, base, "not a TDD phase commit: 'tweak add'")

    def test_a_refactor_that_removes_tests_is_rejected(self):
        repo, base = good_history(self)
        repo.commit_phase("refactor", {"calc.test.ts": BUN_TEST}, 0)
        self.assert_rejected(repo, base, "refactor removes tests: calc.test.ts::::adds decimals")

    def test_bad_arguments_and_places_exit_2(self):
        repo, _ = good_history(self)
        cases = {"no range": ([], "usage: tdd_replay <commit-range>"),
                 "unknown revision": (["nope..HEAD"], "tdd_replay: cannot read the range 'nope..HEAD'"),
                 "empty range": (["HEAD..HEAD"], "tdd_replay: the range 'HEAD..HEAD' has no commits")}
        for name, (args, message) in cases.items():
            with self.subTest(name):
                result = repo.run("tdd_replay", *args)

                self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
                self.assertIn(message, result.stderr)
                self.assertNotIn("Traceback", result.stderr)
        with self.subTest("outside git"), tempfile.TemporaryDirectory() as plain:
            result = subprocess.run([sys.executable, str(SCRIPTS / "tdd_replay"), "HEAD"], cwd=plain,
                                    capture_output=True, text=True)

            self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
            self.assertIn("tdd_replay: not inside a git repository", result.stderr)

    def test_a_range_from_the_first_commit_is_replayed(self):
        repo = Repo(self, {})
        repo.git("update-ref", "-d", "HEAD")
        repo.commit_phase("test", {"package.json": '{"scripts": {"test": "bun test"}}\n',
                                   "TESTLIST.md": "- [ ] adds\n"}, 1)
        first_test = ('import { test, expect } from "bun:test";\n\ntest("adds", async () => {\n'
                      '  const calc = await import("./calc").catch(() => ({ add: () => 0 }));\n'
                      '  expect(calc.add(1, 2)).toBe(3);\n});\n')
        repo.commit_phase("red", {"calc.test.ts": first_test}, 1)
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0)  # a task ends all green

        result = repo.run("tdd_replay", "HEAD")

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("REPLAY: ACCEPT", result.stdout)

    def test_a_commit_without_a_test_framework_is_rejected(self):
        repo, base = good_history(self)
        repo.commit_phase("refactor", {}, 0, deleted=["package.json"])
        self.assert_rejected(repo, base, "no supported test framework detected")

    def test_a_vitest_history_is_replayed_with_test_discovery(self):
        repo = vitest_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.js": VITEST_TEST}, 1)
        repo.commit_phase("green", {"calc.js": RIGHT_ADD_JS}, 0)

        result = repo.run("tdd_replay", f"{base}..HEAD")

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("REPLAY: ACCEPT", result.stdout)
        repo.commit_phase("refactor", {"more.test.js": VITEST_TEST.replace('"adds"', '"adds again"')}, 0)
        self.assert_rejected(repo, base, "only red may add tests, but refactor adds 1")

    def test_tests_that_exist_before_the_range_are_not_new(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST})
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.js": VITEST_TEST + 'test("adds numeric strings", () => {\n'
                                  '  expect(add("1", "2")).toBe(3);\n});\n'}, 1)
        repo.commit_phase("green", {"calc.js": "export const add = (a, b) => Number(a) + Number(b);\n"}, 0)

        result = repo.run("tdd_replay", f"{base}..HEAD")

        self.assertIn("REPLAY: ACCEPT", result.stdout, result.stdout + result.stderr)

    def test_the_replay_leaves_the_callers_checkout_untouched(self):
        repo, base = good_history(self)
        repo.write("calc.ts", "// work in progress\n")
        repo.write("notes.md", "untracked\n")
        repo.git("add", "notes.md")
        before = (repo.git("status", "--porcelain"), repo.git("rev-parse", "HEAD"),
                  repo.git("symbolic-ref", "HEAD"), repo.git("worktree", "list", "--porcelain"))

        repo.run("tdd_replay", f"{base}..HEAD")

        after = (repo.git("status", "--porcelain"), repo.git("rev-parse", "HEAD"),
                 repo.git("symbolic-ref", "HEAD"), repo.git("worktree", "list", "--porcelain"))
        self.assertEqual(after, before)
        self.assertEqual((repo.path / "calc.ts").read_text(), "// work in progress\n")

    def test_a_red_whose_failing_test_is_an_old_test_is_rejected(self):
        calc = RIGHT_ADD_TS + "export const mul = (a: number, b: number) => 0;\n"
        repo = bun_repo(self, calc, **{"calc.test.ts": BUN_TEST})
        repo.commit_all("green: seed", {})
        base = repo.git("rev-parse", "HEAD")
        old_now_failing = BUN_TEST.replace('import { add } from "./calc";', 'import { add, mul } from "./calc";') \
            .replace("toBe(3);", "toBe(3);\n  expect(mul(2, 3)).toBe(6);")
        new_passing = 'test("adds zero", () => {\n  expect(add(0, 0)).toBe(0);\n});\n'
        repo.commit_phase("red", {"calc.test.ts": old_now_failing + "\n" + new_passing}, 1)
        repo.commit_phase("green", {"calc.ts": calc.replace("=> 0;", "=> a * b;")}, 0)
        self.assert_rejected(repo, base, "red's failing test must be its new test")

    def test_a_vitest_red_whose_failing_test_is_an_old_test_is_rejected(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS + "export const mul = () => 0;\n",
                                        "calc.test.js": VITEST_TEST})
        base = repo.git("rev-parse", "HEAD")
        old_now_failing = VITEST_TEST.replace("import { add }", "import { add, mul }") \
            .replace("toBe(3);", "toBe(3);\n  expect(mul(2, 3)).toBe(6);")
        new_passing = 'test("adds zero", () => {\n  expect(add(0, 0)).toBe(0);\n});\n'
        repo.commit_phase("red", {"calc.test.js": old_now_failing + "\n" + new_passing}, 1)
        repo.commit_phase("green", {"calc.js": RIGHT_ADD_JS + "export const mul = (a, b) => a * b;\n"}, 0)
        self.assert_rejected(repo, base, "red's failing test must be its new test")

    def test_no_phase_may_remove_tests(self):
        with self.subTest("red replaces an old test"):
            calc = RIGHT_ADD_TS + "export const mul = (a: number, b: number) => 0;\n"
            repo = bun_repo(self, calc, **{"calc.test.ts": BUN_TEST})
            repo.commit_all("green: seed", {})
            base = repo.git("rev-parse", "HEAD")
            muls = BUN_TEST.replace("import { add }", "import { mul }").replace('"adds"', '"muls"') \
                .replace("add(1, 2)).toBe(3)", "mul(2, 3)).toBe(6)")
            repo.commit_phase("red", {"calc.test.ts": muls}, 1)
            repo.commit_phase("green", {"calc.ts": calc.replace("=> 0;", "=> a * b;").replace("a + b", "a - b")}, 0)
            self.assert_rejected(repo, base, "red removes tests: calc.test.ts::::adds")
        with self.subTest("test phase narrows the test command"):
            repo, base = good_history(self)
            repo.commit_phase("test", {"package.json": '{"scripts": {"test": "bun test nothing"}}\n',
                                       "TESTLIST.md": "- [ ] more\n"}, 1)
            self.assert_rejected(repo, base, "test removes tests: calc.test.ts::::adds")

    def test_two_new_tests_with_the_same_name_are_two_tests(self):
        same_name_passing = 'test("adds", () => {\n  expect(add(0, 0)).toBe(0);\n});\n'
        projects = {"bun": (bun_repo(self), "calc.test.ts", BUN_TEST, {"calc.ts": RIGHT_ADD_TS}),
                    "vitest": (vitest_repo(self), "calc.test.js", VITEST_TEST, {"calc.js": RIGHT_ADD_JS})}
        for framework, (repo, name, test, green) in projects.items():
            with self.subTest(framework):
                base = repo.git("rev-parse", "HEAD")
                repo.commit_phase("red", {name: test + "\n" + same_name_passing}, 1)
                repo.commit_phase("green", green, 0)
                self.assert_rejected(repo, base, "red must add exactly one new test, but adds 2")

    def test_a_terminated_replay_removes_its_worktree(self):
        repo, base = good_history(self)
        replay = subprocess.Popen([sys.executable, str(SCRIPTS / "tdd_replay"), f"{base}..HEAD"], cwd=repo.path,
                                  stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        deadline = time.monotonic() + 30
        while repo.git("worktree", "list").count("\n") == 0 and time.monotonic() < deadline:
            time.sleep(0.05)
        replay.send_signal(signal.SIGTERM)
        replay.wait(timeout=30)

        self.assertEqual(repo.git("worktree", "list").count("\n"), 0, repo.git("worktree", "list"))

    def test_a_crash_exits_2_not_1(self):
        repo = vitest_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.js": VITEST_TEST}, 1)
        repo.commit_phase("green", {"calc.js": RIGHT_ADD_JS}, 0)

        result = repo.run("tdd_replay", f"{base}..HEAD", path="/usr/bin:/bin")

        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        self.assertIn("tdd_replay: internal error", result.stderr)
        self.assertNotIn("Traceback", result.stderr)
        self.assertEqual(repo.git("worktree", "list").count("\n"), 0)

    def test_a_test_that_stops_running_counts_as_removed(self):
        mul_stub = "export const mul = (a: number, b: number) => 0;\n"
        muls = 'test("muls", () => {\n  expect(mul(2, 3)).toBe(6);\n});\n'
        bun_with_mul = BUN_TEST.replace("import { add }", "import { add, mul }")
        vitest_with_mul = VITEST_TEST.replace("import { add }", "import { add, mul }")
        js_mul_stub = "export const mul = () => 0;\n"
        cases = {
            "bun red skips an old test": (
                bun_repo(self, RIGHT_ADD_TS + mul_stub, **{"calc.test.ts": BUN_TEST}),
                [("red", {"calc.test.ts": bun_with_mul.replace('test("adds"', 'test.skip("adds"') + muls}, 1),
                 ("green", {"calc.ts": WRONG_ADD_TS + mul_stub.replace("=> 0", "=> a * b")}, 0)]),
            "bun test phase filters by name": (
                bun_repo(self, RIGHT_ADD_TS + mul_stub, **{"calc.test.ts": BUN_TEST}),
                [("test", {"package.json": '{"scripts": {"test": "bun test -t muls"}}\n'}, 1),
                 ("red", {"calc.test.ts": bun_with_mul + muls}, 1),
                 ("green", {"calc.ts": WRONG_ADD_TS + mul_stub.replace("=> 0", "=> a * b")}, 0)]),
            "vitest red skips an old test": (
                vitest_repo(self),
                [("red", {"calc.test.js": vitest_with_mul.replace('test("adds"', 'test.skip("adds"') + muls}, 1),
                 ("green", {"calc.js": "export const add = () => 0;\nexport const mul = (a, b) => a * b;\n"}, 0)]),
            "vitest red turns an old test into a todo": (
                vitest_repo(self),
                [("red", {"calc.test.js": vitest_with_mul.replace('test("adds", () => {', 'test.todo("adds");\n'
                                                                    'test("unused", () => {') + muls}, 1),
                 ("green", {"calc.js": "export const add = () => 0;\nexport const mul = (a, b) => a * b;\n"}, 0)]),
            "vitest red filters by name": (
                vitest_repo(self),
                [("red", {"calc.test.js": vitest_with_mul + muls,
                          "vitest.config.js": 'export default { test: { include: ["*.test.js"], '
                                              'testNamePattern: "muls" } };\n'}, 1),
                 ("green", {"calc.js": "export const add = () => 0;\nexport const mul = (a, b) => a * b;\n"}, 0)]),
        }
        for name, (repo, steps) in cases.items():
            with self.subTest(name):
                if name.startswith("vitest"):
                    repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS + js_mul_stub, "calc.test.js": VITEST_TEST})
                else:
                    repo.commit_all("green: seed", {})
                base = repo.git("rev-parse", "HEAD")
                for phase, files, exit_code in steps:
                    repo.commit_phase(phase, files, exit_code)
                self.assert_rejected(repo, base, "removes tests:")

    def test_the_replay_keeps_the_callers_other_worktrees(self):
        repo, base = good_history(self)
        with tempfile.TemporaryDirectory() as elsewhere:
            other = Path(elsewhere) / "other"
            repo.git("worktree", "add", "-q", "-b", "feature", str(other))
        before = repo.git("worktree", "list", "--porcelain")

        repo.run("tdd_replay", f"{base}..HEAD")

        self.assertEqual(repo.git("worktree", "list", "--porcelain"), before)
