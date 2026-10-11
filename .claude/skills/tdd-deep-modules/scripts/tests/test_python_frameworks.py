"""Python (unittest, pytest) detection and classification."""
import unittest

from tests.fixture import (ADD_TEST, PYTEST_MARKERS, PYTEST_TEST, RIGHT_ADD, RIGHT_ADD_JS,
                           VITEST_TEST, WRONG_ADD, Repo, vitest_repo)


class PythonFrameworksTest(unittest.TestCase):
    def assert_refused(self, repo, phase, reason, *, head="init"):
        result = repo.run("tdd-step", phase, "x")
        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn(reason, result.stderr)
        self.assertEqual(repo.subject(), head)

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

    def test_pytest_assertion_failure_is_committed_as_red(self):
        for marker, text in PYTEST_MARKERS.items():
            with self.subTest(marker=marker):
                repo = Repo(self, {"calc.py": WRONG_ADD, marker: text})
                repo.write("test_calc.py", PYTEST_TEST)

                result = repo.run("tdd-step", "red", "adds two numbers")

                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(repo.subject(), "red: adds two numbers")
                self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    def test_pytest_non_assertion_exception_is_refused_as_red(self):
        repo = Repo(self, {"calc.py": "def add(a):\n    return a\n", "pytest.ini": "[pytest]\n"})
        repo.write("test_calc.py", PYTEST_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_pytest_running_unittest_assertions_accepts_them_as_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"})
        repo.write("test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")

    def test_pytest_fixture_error_next_to_an_assertion_failure_is_refused_as_red(self):
        broken_fixture = ("import pytest\n\n\n@pytest.fixture\ndef broken():\n    raise OSError('db down')\n\n\n"
                          "def test_uses_db(broken):\n    assert broken\n")
        repo = Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"})
        repo.write("test_calc.py", PYTEST_TEST + "\n\n" + broken_fixture)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_unittest_failure_next_to_an_error_is_refused_as_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST + "\n    def test_breaks(self):\n        add(1)\n")
        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_output_after_the_unittest_summary_does_not_hide_the_result(self):
        noisy = "import atexit\nimport sys\natexit.register(lambda: print('bye', file=sys.stderr))\n"
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", noisy + ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_a_framework_that_finds_no_tests_is_left_out_when_another_one_has_tests(self):
        repo = vitest_repo(self)
        repo.commit_all("red: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST,
                                      "tool.py": "X = 1\n"})
        repo.write("calc.js", "// add\n" + RIGHT_ADD_JS)

        result = repo.run("tdd-step", "green", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "5")  # unittest ran and found nothing

    def test_pytest_raises_and_fail_count_as_red(self):
        bodies = {"raises": "    with pytest.raises(ValueError):\n        add(1, 2)\n",
                  "fail": "    if add(1, 2) != 3:\n        pytest.fail('wrong sum')\n"}
        for name, body in bodies.items():
            with self.subTest(name):
                repo = Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"})
                repo.write("test_calc.py", f"import pytest\nfrom calc import add\n\n\ndef test_it():\n{body}")

                result = repo.run("tdd-step", "red", "behaves")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_plain_pytest_test_functions_are_detected_without_config(self):
        for name in ("test_calc.py", "tests/calc_test.py"):
            with self.subTest(name):
                repo = Repo(self, {"calc.py": WRONG_ADD})
                repo.write(name, PYTEST_TEST)

                result = repo.run("tdd-step", "red", "adds two numbers")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_a_crashed_suite_is_not_dropped_in_a_mixed_repository(self):
        repo = vitest_repo(self)
        repo.commit_all("red: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST,
                                      "pymod.py": "def f():\n    return 1\n",
                                      "conftest.py": "import pymod\n",
                                      "test_py.py": "import pymod\n\n\ndef test_f():\n    assert pymod.f() == 1\n"})
        repo.write("pymod.py", "def f(:\n")

        self.assert_refused(repo, "green", "green needs all tests passing", head="red: seed")

    def test_non_ascii_test_file_names_are_detected(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_rechnung_ü.py", PYTEST_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_pytest_is_detected_from_its_config_section_alone(self):
        configs = {"pytest.ini": "[pytest]\npython_files = check_*.py\n",
                   "pyproject.toml": '[tool.pytest.ini_options]\npython_files = "check_*.py"\n',
                   "setup.cfg": "[tool:pytest]\npython_files = check_*.py\n",
                   "tox.ini": "[pytest]\npython_files = check_*.py\n"}
        for config, text in configs.items():
            with self.subTest(config):
                repo = Repo(self, {"calc.py": WRONG_ADD, config: text})
                repo.write("tests/check_calc.py", PYTEST_TEST)

                result = repo.run("tdd-step", "red", "adds two numbers")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_a_pytest_run_without_a_report_is_an_error_even_with_exit_0(self):
        repo = vitest_repo(self)
        repo.commit_all("red: seed", {"calc.js": "export const add = () => 0;\n", "calc.test.js": VITEST_TEST,
                                      "calc.py": RIGHT_ADD, "test_calc.py": PYTEST_TEST})
        repo.write("calc.js", RIGHT_ADD_JS)
        repo.write("calc.py", "import os\nos._exit(0)\n" + RIGHT_ADD)

        self.assert_refused(repo, "green", "green needs all tests passing", head="red: seed")

    def test_an_interrupted_pytest_run_is_not_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"})
        repo.write("test_calc.py", PYTEST_TEST + "\n\ndef test_stop():\n    import pytest\n    pytest.exit('stop', returncode=2)\n")

        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_the_trailer_counts_a_dropped_framework_exit_code(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST,
                                        "calc.py": RIGHT_ADD, "test_calc.py": PYTEST_TEST})
        (repo.path / "calc.test.js").unlink()

        result = repo.run("tdd-step", "refactor", "drop js test")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")
