import subprocess
import sys
import tempfile
import unittest

from tests.fixture import BUN_TEST, RIGHT_ADD_TS, SCRIPTS, WRONG_ADD_TS, Repo, bun_repo

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

        result = repo.run("tdd_replay", "HEAD")

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("REPLAY: ACCEPT", result.stdout)
