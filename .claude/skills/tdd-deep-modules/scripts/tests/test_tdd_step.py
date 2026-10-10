import unittest

from tests.fixture import ADD_TEST, WRONG_ADD, Repo


class TddStepTest(unittest.TestCase):
    def test_red_with_assertion_failure_commits_phase_and_exit_code(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
        self.assertIn("TDD-Phase: red", repo.trailers())
        self.assertIn("TDD-Exit-Code: 1", repo.trailers())
