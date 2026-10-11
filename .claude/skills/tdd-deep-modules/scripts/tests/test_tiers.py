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
