import unittest

from tests.fixture import BUN_TEST, tiered_repo


class TddStepTierTest(unittest.TestCase):
    def test_red_runs_the_fast_suite_by_default_and_records_it(self):
        repo = tiered_repo(self)
        repo.write("calc.test.ts", BUN_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
        self.assertEqual(repo.trailer("TDD-Suite"), "fast")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")
