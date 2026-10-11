import unittest

from tests.fixture import BUN_TEST, NO_DATABASE_TEST, RIGHT_ADD_TS, tiered_repo

DATABASE_TEST = NO_DATABASE_TEST.replace('"no database"', '"rows"')
SQL_TEST = ('import { test, expect } from "bun:test";\n\n'
            'test("sums in SQL", () => {\n  expect("no sum").toBe("sum");\n});\n')


def green_tiered_repo(case):
    """A tiered bun project whose fast and full suites both pass."""
    return tiered_repo(case, RIGHT_ADD_TS, **{"calc.test.ts": BUN_TEST, "db.pg.test.ts": DATABASE_TEST})


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
