import unittest

from tests.fixture import BUN_TEST, RIGHT_ADD_TS, WRONG_ADD_TS, bun_repo

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
