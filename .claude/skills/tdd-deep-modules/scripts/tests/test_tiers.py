import unittest

from tests.fixture import BUN_TEST, NO_DATABASE_TEST, RIGHT_ADD_TS, tiered_repo

DATABASE_TEST = NO_DATABASE_TEST.replace('"no database"', '"rows"')
SQL_TEST = ('import { test, expect } from "bun:test";\nimport { sum } from "./sum";\n\n'
            'test("sums in SQL", () => {\n  expect(sum([1, 2, 3])).toBe(6);\n});\n')
RIGHT_SUM_TS = "export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);\n"


def green_tiered_repo(case):
    """A tiered bun project whose fast and full suites both pass."""
    return tiered_repo(case, RIGHT_ADD_TS, **{"calc.test.ts": BUN_TEST, "db.pg.test.ts": DATABASE_TEST,
                                           "sum.ts": "export const sum = (xs: number[]) => 0;\n"})


class TddStepTierTest(unittest.TestCase):
    def test_red_runs_the_fast_suite_by_default_and_records_it(self):
        repo = tiered_repo(self)
        repo.write("calc.test.ts", BUN_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
        self.assertEqual(repo.trailer("TDD-Suite"), "fast")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    def test_red_with_suite_full_runs_the_full_suite_and_records_it(self):
        repo = green_tiered_repo(self)
        repo.write("sum.pg.test.ts", SQL_TEST)

        result = repo.run("tdd-step", "red", "--suite", "full", "sums in SQL")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: sums in SQL")
        self.assertEqual(repo.trailer("TDD-Suite"), "full")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    def test_green_runs_the_fast_suite_by_default_and_the_full_suite_on_request(self):
        fast = tiered_repo(self)
        fast.write("calc.test.ts", BUN_TEST)
        self.assertEqual(fast.run("tdd-step", "red", "adds").returncode, 0)
        fast.write("calc.ts", RIGHT_ADD_TS)

        result = fast.run("tdd-step", "green", "adds")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(fast.trailer("TDD-Suite"), "fast")
        full = green_tiered_repo(self)
        full.write("sum.pg.test.ts", SQL_TEST)
        self.assertEqual(full.run("tdd-step", "red", "--suite", "full", "sums").returncode, 0)
        full.write("sum.ts", RIGHT_SUM_TS)

        result = full.run("tdd-step", "green", "--suite", "full", "sums")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(full.trailer("TDD-Suite"), "full")

    def test_green_after_a_red_on_the_full_suite_must_run_the_full_suite(self):
        repo = green_tiered_repo(self)
        repo.write("sum.pg.test.ts", SQL_TEST)
        self.assertEqual(repo.run("tdd-step", "red", "--suite", "full", "sums").returncode, 0)
        repo.write("sum.ts", RIGHT_SUM_TS)

        result = repo.run("tdd-step", "green", "sums")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("green must run the full suite, like its red", result.stderr)
        self.assertEqual(repo.subject(), "red: sums")

    def test_refactor_runs_the_full_suite_and_refuses_the_fast_one(self):
        broken = tiered_repo(self, RIGHT_ADD_TS, **{"calc.test.ts": BUN_TEST})
        broken.commit_phase("green", {"calc.ts": RIGHT_ADD_TS + "// green\n"}, 0)
        broken.write("calc.ts", RIGHT_ADD_TS)
        self.assertEqual(broken.subject(), "green: green step")

        default = broken.run("tdd-step", "refactor", "tidy")
        fast = broken.run("tdd-step", "refactor", "--suite", "fast", "tidy")

        self.assertEqual(default.returncode, 1, default.stderr)
        self.assertIn("refactor needs all tests passing", default.stderr)
        self.assertEqual(fast.returncode, 1, fast.stderr)
        self.assertIn("refactor must run the full suite", fast.stderr)
        self.assertEqual(broken.subject(), "green: green step")
        repo = green_tiered_repo(self)
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS + "// green\n"}, 0)
        repo.write("calc.ts", RIGHT_ADD_TS)

        result = repo.run("tdd-step", "refactor", "tidy")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.trailer("TDD-Suite"), "full")

    def test_an_unknown_or_missing_suite_exits_2_with_usage(self):
        for args in (["--suite", "slow", "x"], ["--suite"]):
            with self.subTest(args):
                repo = tiered_repo(self)
                repo.write("calc.test.ts", BUN_TEST)

                result = repo.run("tdd-step", "red", *args)

                self.assertEqual(result.returncode, 2, result.stderr)
                self.assertIn("usage: tdd-step <test|red|green|refactor> [--suite fast|full] [message]",
                              result.stderr)
                self.assertNotIn("Traceback", result.stderr)
                self.assertEqual(repo.subject(), "init")
