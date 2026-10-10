import unittest

from tests.fixture import ADD_TEST, RIGHT_ADD, WRONG_ADD, Repo


class TddStepTest(unittest.TestCase):
    def test_red_with_assertion_failure_commits_phase_and_exit_code(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
        self.assertIn("TDD-Phase: red", repo.trailers())
        self.assertIn("TDD-Exit-Code: 1", repo.trailers())

    def test_red_is_refused_when_the_suite_passes(self):
        repo = Repo(self, {"calc.py": RIGHT_ADD})
        repo.write("test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_red_is_refused_when_the_failure_is_an_import_error(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST.replace("import add", "import multiply as add"))

        result = repo.run("tdd-step", "red", "multiplies")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_red_is_refused_when_no_tests_ran(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("notes.txt", "nothing to test yet")

        result = repo.run("tdd-step", "red", "nothing")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_red_is_refused_when_the_failure_is_a_syntax_error(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST + "\n    def broken(:\n")

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_red_is_refused_when_a_test_raises_a_non_assertion_exception(self):
        repo = Repo(self, {"calc.py": "def add(a):\n    return a\n"})
        repo.write("test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_red_is_refused_when_production_code_changed(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST)
        repo.write("calc.py", WRONG_ADD + "\n\ndef helper():\n    return 1\n")

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("production code changed: calc.py", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_green_is_refused_while_a_test_fails(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.commit_all("red: adds two numbers", {"test_calc.py": ADD_TEST})
        repo.write("calc.py", "def add(a, b):\n    return a - b\n")

        result = repo.run("tdd-step", "green", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("green needs all tests passing", result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")

    def test_refactor_is_refused_while_a_test_fails(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.commit_all("red: adds two numbers", {"test_calc.py": ADD_TEST})
        repo.commit_all("green: adds two numbers", {"calc.py": RIGHT_ADD})
        repo.write("calc.py", "def add(a, b):\n    return a * b\n")

        result = repo.run("tdd-step", "refactor", "tidy add")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("refactor needs all tests passing", result.stderr)
        self.assertEqual(repo.subject(), "green: adds two numbers")

    def test_green_is_refused_unless_the_last_phase_was_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD, "test_calc.py": ADD_TEST})
        repo.write("calc.py", RIGHT_ADD)

        result = repo.run("tdd-step", "green", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("green cannot follow start", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_refactor_is_refused_right_after_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.commit_all("red: adds two numbers", {"test_calc.py": ADD_TEST})
        repo.write("calc.py", RIGHT_ADD)

        result = repo.run("tdd-step", "refactor", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("refactor cannot follow red", result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
