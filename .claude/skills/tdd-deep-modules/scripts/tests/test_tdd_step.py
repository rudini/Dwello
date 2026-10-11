import os
import subprocess
import sys
import tempfile
import unittest

from tests.fixture import ADD_TEST, BUN_FILES, RIGHT_ADD_JS, SCRIPTS, PYTEST_MARKERS, PYTEST_TEST, RIGHT_ADD, VITEST_TEST, WRONG_ADD, Repo, vitest_repo


class TddStepTest(unittest.TestCase):
    def test_red_with_assertion_failure_commits_phase_and_exit_code(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
        self.assertEqual(repo.trailer("TDD-Phase"), "red")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

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

    def test_red_is_refused_right_after_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.commit_all("red: adds two numbers", {"test_calc.py": ADD_TEST})
        repo.write("test_more.py", ADD_TEST.replace("test_adds", "test_adds_again"))

        result = repo.run("tdd-step", "red", "adds again")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red cannot follow red", result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")

    def test_test_phase_is_refused_when_code_changed(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("TESTLIST.md", "- [ ] adds two numbers\n")
        repo.write("test_calc.py", ADD_TEST)
        repo.write("calc.py", RIGHT_ADD)

        result = repo.run("tdd-step", "test", "plan add")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("test phase may only change the test list, not code: calc.py, test_calc.py",
                      result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_a_full_cycle_commits_every_phase_with_the_real_exit_code(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        steps = [("test", {"TESTLIST.md": "- [ ] adds\n"}, "5"),
                 ("red", {"test_calc.py": ADD_TEST}, "1"),
                 ("green", {"calc.py": RIGHT_ADD}, "0"),
                 ("refactor", {"calc.py": "def add(a, b):\n    return sum((a, b))\n"}, "0")]
        for phase, files, exit_code in steps:
            for rel, text in files.items():
                repo.write(rel, text)

            result = repo.run("tdd-step", phase, f"{phase} add")

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(repo.subject(), f"{phase}: {phase} add")
            self.assertEqual(repo.trailer("TDD-Exit-Code"), exit_code)
            self.assertEqual(repo.git("status", "--porcelain"), "")

    def test_without_a_supported_test_framework_it_exits_2(self):
        repo = Repo(self, {"README.md": "docs only\n"})
        repo.write("TESTLIST.md", "- [ ] something\n")

        result = repo.run("tdd-step", "test", "plan")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("no supported test framework", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_an_unknown_phase_exits_2_with_usage(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})

        for args in (["blue"], []):
            result = repo.run("tdd-step", *args)

            self.assertEqual(result.returncode, 2, result.stderr)
            self.assertIn("usage: tdd-step <test|red|green|refactor> [message]", result.stderr)

    def test_vitest_assertion_failure_is_committed_as_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    def test_vitest_load_error_is_refused_as_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST.replace("./calc.js", "./missing.js"))

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_vitest_red_is_refused_when_production_code_changed(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST)
        repo.write("calc.js", "export const add = (a, b) => -1;\n")

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("production code changed: calc.js", result.stderr)
        self.assertNotIn("calc.test.js", result.stderr)

    def test_files_in_test_directories_are_test_code(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("tests/__init__.py", "")
        repo.write("tests/helpers.py", "PAIR = (1, 2)\n")
        repo.write("tests/test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")

    def test_vitest_config_error_is_refused_as_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST)
        repo.write("vitest.config.js", "export default {\n")

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("red needs a failing assertion", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_vitest_green_commits_when_all_tests_pass(self):
        repo = vitest_repo(self)
        repo.commit_all("red: adds two numbers", {"calc.test.js": VITEST_TEST})
        repo.write("calc.js", "export const add = (a, b) => a + b;\n")

        result = repo.run("tdd-step", "green", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "green: adds two numbers")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "0")

    def test_run_from_a_subdirectory_checks_and_tests_the_whole_repository(self):
        repo = Repo(self, {"calc.py": WRONG_ADD, "pkg/__init__.py": ""})
        repo.write("test_calc.py", ADD_TEST)
        repo.write("pkg/prod.py", "VALUE = 1\n")

        result = repo.run("tdd-step", "red", "adds two numbers", cwd="pkg")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("production code changed: pkg/prod.py", result.stderr)
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

    def test_an_unsupported_package_json_test_command_exits_2(self):
        repo = Repo(self, {"package.json": '{"scripts": {"test": "jest"}}\n', "tool.py": "X = 1\n"})
        repo.write("TESTLIST.md", "- [ ] something\n")

        result = repo.run("tdd-step", "test", "plan")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("no supported test framework", result.stderr)
        self.assertIn("jest", result.stderr)

    def test_broken_or_uninstalled_javascript_setups_exit_2(self):
        cases = {"package.json is not valid JSON": "{",
                 "vitest is not installed": '{"devDependencies": {"vitest": "*"}}'}
        for message, manifest in cases.items():
            with self.subTest(message):
                repo = Repo(self, {"package.json": manifest})
                repo.write("TESTLIST.md", "- [ ] something\n")

                result = repo.run("tdd-step", "test", "plan")

                self.assertEqual(result.returncode, 2, result.stderr)
                self.assertIn(message, result.stderr)

    def assert_refused(self, repo, phase, reason, *, head="init"):
        result = repo.run("tdd-step", phase, "x")
        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn(reason, result.stderr)
        self.assertEqual(repo.subject(), head)

    def test_vitest_type_error_is_refused_as_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST.replace("add(1, 2)", "add.nope(1, 2)"))
        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_vitest_without_test_files_is_refused_as_red(self):
        repo = vitest_repo(self)
        repo.write("notes.md", "nothing yet\n")
        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_unittest_failure_next_to_an_error_is_refused_as_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST + "\n    def test_breaks(self):\n        add(1)\n")
        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_files_named_like_tests_are_test_code(self):
        for name in ("calc_test.py", "test_calc.py"):
            with self.subTest(name):
                repo = Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"})
                repo.write(name, PYTEST_TEST)

                result = repo.run("tdd-step", "red", "adds two numbers")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_only_green_may_follow_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.commit_all("red: adds two numbers", {"test_calc.py": ADD_TEST})
        repo.write("TESTLIST.md", "- [ ] more\n")
        self.assert_refused(repo, "test", "test cannot follow red", head="red: adds two numbers")

    def test_refactor_must_follow_green_or_refactor(self):
        for previous in ("init", "test: plan"):
            with self.subTest(previous):
                repo = Repo(self, {"calc.py": RIGHT_ADD, "test_calc.py": ADD_TEST})
                repo.commit_all(previous, {"TESTLIST.md": "- [ ] adds\n"})
                repo.write("calc.py", "def add(a, b):\n    return sum((a, b))\n")
                self.assert_refused(repo, "refactor", "refactor cannot follow", head=previous)

    def test_output_after_the_unittest_summary_does_not_hide_the_result(self):
        noisy = "import atexit\nimport sys\natexit.register(lambda: print('bye', file=sys.stderr))\n"
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", noisy + ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_a_phase_without_changes_is_refused(self):
        repo = Repo(self, {"calc.py": RIGHT_ADD, "test_calc.py": ADD_TEST})
        repo.commit_all("green: adds two numbers", {})
        self.assert_refused(repo, "refactor", "nothing changed", head="green: adds two numbers")

    def test_the_first_commit_of_a_new_repository_can_be_a_phase(self):
        repo = Repo(self, {})
        repo.git("update-ref", "-d", "HEAD")
        repo.write("pytest.ini", "[pytest]\n")
        repo.write("TESTLIST.md", "- [ ] adds two numbers\n")

        result = repo.run("tdd-step", "test", "plan add")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.git("rev-list", "--count", "HEAD"), "1")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "5")

    def test_a_staged_rename_of_production_code_is_refused_as_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD, "lib/__init__.py": "", "lib/tool.py": "X = 1\n"})
        repo.write("test_calc.py", ADD_TEST)
        repo.git("mv", "lib/tool.py", "lib/renamed.py")

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("production code changed: lib/renamed.py, lib/tool.py", result.stderr)

    def test_the_message_cannot_forge_trailers(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds\n\nTDD-Exit-Code: 0")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")
        self.assertEqual(repo.subject(), "red: adds TDD-Exit-Code: 0")

    def test_green_is_refused_when_it_changes_tests(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.commit_all("red: adds two numbers", {"test_calc.py": ADD_TEST})
        repo.write("test_calc.py", ADD_TEST.replace("3)", "0)"))
        self.assert_refused(repo, "green", "green may only change production code, not tests: test_calc.py",
                            head="red: adds two numbers")

    def test_red_is_refused_when_more_than_one_test_fails(self):
        second_vitest = VITEST_TEST.replace('"adds"', '"adds again"').replace(
            'import { test, expect } from "vitest";\nimport { add } from "./calc.js";\n', "")
        projects = {
            "unittest": (Repo(self, {"calc.py": WRONG_ADD}),
                         {"test_calc.py": ADD_TEST + "\n    def test_again(self):\n        self.assertEqual(add(2, 2), 4)\n"}),
            "pytest": (Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"}),
                       {"test_calc.py": PYTEST_TEST + "\n\ndef test_again():\n    assert add(2, 2) == 4\n"}),
            "vitest": (vitest_repo(self), {"calc.test.js": VITEST_TEST + second_vitest}),
        }
        for framework, (repo, files) in projects.items():
            with self.subTest(framework):
                for rel, text in files.items():
                    repo.write(rel, text)
                self.assert_refused(repo, "red", "red needs exactly one failing test, but 2 fail")

    def test_a_rejected_git_commit_exits_2_and_leaves_the_index_as_it_was(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        hook = repo.path / ".git" / "hooks" / "pre-commit"
        hook.write_text("#!/bin/sh\necho 'hook says no' >&2\nexit 1\n")
        hook.chmod(0o755)
        repo.write("test_calc.py", ADD_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("hook says no", result.stderr)
        self.assertNotIn("Traceback", result.stderr)
        self.assertEqual(repo.git("diff", "--cached", "--name-only"), "")

    def test_outside_a_git_repository_it_exits_2(self):
        with tempfile.TemporaryDirectory() as plain:
            result = subprocess.run([sys.executable, str(SCRIPTS / "tdd-step"), "red", "x"],
                                    cwd=plain, capture_output=True, text=True)

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("not inside a git repository", result.stderr)
        self.assertNotIn("Traceback", result.stderr)

    def test_green_runs_every_framework_in_a_mixed_repository(self):
        repo = vitest_repo(self)
        repo.commit_all("red: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST,
                                      "calc.py": WRONG_ADD, "test_calc.py": ADD_TEST})
        repo.write("calc.js", "// add\n" + RIGHT_ADD_JS)

        self.assert_refused(repo, "green", "green needs all tests passing", head="red: seed")

    def test_a_framework_that_finds_no_tests_is_left_out_when_another_one_has_tests(self):
        repo = vitest_repo(self)
        repo.commit_all("red: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST,
                                      "tool.py": "X = 1\n"})
        repo.write("calc.js", "// add\n" + RIGHT_ADD_JS)

        result = repo.run("tdd-step", "green", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "0")

    def test_a_suite_that_runs_no_tests_does_not_pass(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST})
        repo.write("vitest.config.js",
                   'export default { test: { include: ["nothing/**"], passWithNoTests: true } };\n')

        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_a_suite_whose_tests_are_all_skipped_does_not_pass(self):
        skip_all = ("import pytest\n\n\ndef pytest_collection_modifyitems(items):\n"
                    "    for item in items:\n        item.add_marker(pytest.mark.skip)\n")
        projects = {
            "unittest": (Repo(self, {"calc.py": RIGHT_ADD}), {"test_calc.py": ADD_TEST},
                         {"test_calc.py": ADD_TEST.replace("class AddTest", "@unittest.skip('x')\nclass AddTest")}),
            "pytest": (Repo(self, {"calc.py": RIGHT_ADD, "pytest.ini": "[pytest]\n"}),
                       {"test_calc.py": PYTEST_TEST}, {"conftest.py": skip_all}),
            "vitest": (vitest_repo(self), {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST},
                       {"calc.test.js": VITEST_TEST.replace('test("adds"', 'test.skip("adds"')}),
        }
        for framework, (repo, seed, skipping) in projects.items():
            with self.subTest(framework):
                repo.commit_all("green: seed", seed)
                for rel, text in skipping.items():
                    repo.write(rel, text)
                self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_test_configuration_is_test_code(self):
        projects = {
            "vitest.config.js": (vitest_repo(self), {"calc.test.js": VITEST_TEST},
                                 {"calc.js": RIGHT_ADD_JS, "vitest.config.js": "export default {};\n"}),
            "conftest.py": (Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"}),
                            {"test_calc.py": PYTEST_TEST}, {"calc.py": RIGHT_ADD, "conftest.py": "X = 1\n"}),
        }
        for config, (repo, red, green) in projects.items():
            with self.subTest(config):
                repo.commit_all("red: adds", red)
                for rel, text in green.items():
                    repo.write(rel, text)
                self.assert_refused(repo, "green", f"not tests: {config}", head="red: adds")

    def test_vitest_unhandled_errors_are_refused_as_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST.replace(
            "  expect(", "  setTimeout(() => null.x, 0);\n  expect(") + 'test("waits", () => new Promise((r) => setTimeout(r, 50)));\n')
        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_pytest_raises_and_fail_count_as_red(self):
        bodies = {"raises": "    with pytest.raises(ValueError):\n        add(1, 2)\n",
                  "fail": "    if add(1, 2) != 3:\n        pytest.fail('wrong sum')\n"}
        for name, body in bodies.items():
            with self.subTest(name):
                repo = Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"})
                repo.write("test_calc.py", f"import pytest\nfrom calc import add\n\n\ndef test_it():\n{body}")

                result = repo.run("tdd-step", "red", "behaves")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_bytes_that_are_not_utf8_do_not_crash_it(self):
        with self.subTest("test output"):
            repo = Repo(self, {"calc.py": WRONG_ADD})
            repo.write("test_calc.py", "import sys\nsys.stderr.buffer.write(b'\\xff\\n')\n" + ADD_TEST)

            result = repo.run("tdd-step", "red", "adds two numbers")

            self.assertEqual(result.returncode, 0, result.stderr)
        with self.subTest("file name"):
            repo = Repo(self, {"calc.py": WRONG_ADD})
            (repo.path / os.fsdecode(b"notes-\xff.txt")).write_text("plan\n")

            result = repo.run("tdd-step", "test", "plan")

            self.assertEqual(result.returncode, 0, result.stderr)

    def test_unexpected_package_json_shapes_exit_2(self):
        for manifest in ('{"devDependencies": null}', "[]", '{"scripts": "jest"}'):
            with self.subTest(manifest):
                repo = Repo(self, {"package.json": manifest})
                repo.write("TESTLIST.md", "- [ ] something\n")

                result = repo.run("tdd-step", "test", "plan")

                self.assertEqual(result.returncode, 2, result.stderr)
                self.assertIn("package.json", result.stderr)
                self.assertNotIn("Traceback", result.stderr)

    def test_a_test_run_that_changes_the_working_tree_is_refused(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", "open('leftover.txt', 'w').write('x')\n" + ADD_TEST)

        self.assert_refused(repo, "red", "the test run changed the working tree: leftover.txt")

    def test_plain_pytest_test_functions_are_detected_without_config(self):
        for name in ("test_calc.py", "tests/calc_test.py"):
            with self.subTest(name):
                repo = Repo(self, {"calc.py": WRONG_ADD})
                repo.write(name, PYTEST_TEST)

                result = repo.run("tdd-step", "red", "adds two numbers")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_deleting_a_test_file_does_not_crash_detection(self):
        repo = Repo(self, {"calc.py": RIGHT_ADD, "test_calc.py": ADD_TEST, "test_old.py": ADD_TEST})
        repo.commit_all("green: seed", {})
        (repo.path / "test_old.py").unlink()

        result = repo.run("tdd-step", "refactor", "drop duplicate test")

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_untracked_production_code_in_a_new_directory_is_refused_as_red(self):
        repo = Repo(self, {"calc.py": WRONG_ADD})
        repo.write("test_calc.py", ADD_TEST)
        repo.write("lib/prod.py", "X = 1\n")
        self.assert_refused(repo, "red", "production code changed: lib/prod.py")

    def test_spec_files_and_test_directories_are_test_code(self):
        helpers = {".spec. file": "calc.spec.js", "test/ directory": "test/helper.js",
                   "__tests__/ directory": "__tests__/helper.js"}
        for kind, helper in helpers.items():
            with self.subTest(kind):
                repo = Repo(self, {"calc.py": WRONG_ADD})
                repo.write("test_calc.py", ADD_TEST)
                repo.write(helper, "export const pair = [1, 2];\n")

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

    def test_green_cannot_exclude_the_failing_test_through_configuration(self):
        deselect = "--deselect test_calc.py::test_adds"
        projects = {
            "vite.config.js": (vitest_repo(self), {"calc.test.js": VITEST_TEST},
                               'export default { test: { exclude: ["calc.test.js", "node_modules/**"] } };\n'),
            "pytest.ini": (Repo(self, {"calc.py": WRONG_ADD, "pytest.ini": "[pytest]\n"}),
                           {"test_calc.py": PYTEST_TEST}, f"[pytest]\naddopts = {deselect}\n"),
            "pyproject.toml": (Repo(self, {"calc.py": WRONG_ADD, "pyproject.toml": "[tool.pytest.ini_options]\n"}),
                               {"test_calc.py": PYTEST_TEST},
                               f'[tool.pytest.ini_options]\naddopts = "{deselect}"\n'),
            "setup.cfg": (Repo(self, {"calc.py": WRONG_ADD, "setup.cfg": "[tool:pytest]\n"}),
                          {"test_calc.py": PYTEST_TEST}, f"[tool:pytest]\naddopts = {deselect}\n"),
            "tox.ini": (Repo(self, {"calc.py": WRONG_ADD, "tox.ini": "[pytest]\n"}),
                        {"test_calc.py": PYTEST_TEST}, f"[pytest]\naddopts = {deselect}\n"),
        }
        for config, (repo, red, text) in projects.items():
            with self.subTest(config):
                repo.commit_all("red: adds", red)
                repo.write(config, text)
                self.assert_refused(repo, "green", f"not tests: {config}", head="red: adds")

    def test_a_test_named_after_unhandled_errors_is_still_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST.replace('"adds"', '"reports an unhandled error"'))

        result = repo.run("tdd-step", "red", "reports errors")

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_a_package_json_that_is_not_utf8_exits_2(self):
        repo = Repo(self, {})
        (repo.path / "package.json").write_bytes(b'{"name": "\xff"}')
        repo.write("TESTLIST.md", "- [ ] something\n")

        result = repo.run("tdd-step", "test", "plan")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("package.json", result.stderr)
        self.assertNotIn("Traceback", result.stderr)

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

    def test_a_mixed_repository_records_the_highest_exit_code(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.py": RIGHT_ADD, "test_calc.py": PYTEST_TEST})
        repo.write("calc.test.js", VITEST_TEST)

        result = repo.run("tdd-step", "red", "adds in js")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    def test_vitest_async_matcher_failures_are_red(self):
        bodies = {"resolves": "  await expect(Promise.resolve(add(1, 2))).resolves.toBe(3);\n",
                  "rejects": "  await expect(Promise.reject({ status: add(1, 2) })).rejects.toMatchObject({ status: 3 });\n"}
        for name, body in bodies.items():
            with self.subTest(name):
                repo = vitest_repo(self)
                repo.write("calc.test.js", 'import { test, expect } from "vitest";\nimport { add } from "./calc.js";\n\n'
                           f'test("adds", async () => {{\n{body}}});\n')

                result = repo.run("tdd-step", "red", "adds two numbers")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_a_nested_bun_package_is_part_of_the_suite(self):
        repo = Repo(self, {"calc.py": RIGHT_ADD, "test_calc.py": PYTEST_TEST, **BUN_FILES})
        repo.commit_all("green: seed", {})
        repo.write("backend/calc.ts", "export const add = (a: number, b: number) => a - b;\n")

        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_bun_classifies_assertions_and_errors(self):
        test_head = 'import { test, expect } from "bun:test";\nimport { add } from "./calc";\n\n'
        cases = {"assertion": ('test("adds", () => {\n  expect(add(1, 2)).toBe(4);\n});\n', 0),
                 "thrown error": ('test("adds", () => {\n  throw new Error("boom");\n});\n', 1)}
        for name, (body, expected) in cases.items():
            with self.subTest(name):
                repo = Repo(self, BUN_FILES)
                repo.write("backend/more.test.ts", test_head + body)

                result = repo.run("tdd-step", "red", "adds")

                self.assertEqual(result.returncode, expected, result.stderr)

    def test_a_crashed_bun_run_is_not_dropped(self):
        crashing = {**BUN_FILES, "backend/package.json":
                    '{"scripts": {"test": "bun test --preload ./setup.ts && echo done"}}\n',
                    "backend/setup.ts": "export {};\n"}
        repo = Repo(self, {"calc.py": RIGHT_ADD, "test_calc.py": PYTEST_TEST, **crashing})
        repo.commit_all("green: seed", {})
        repo.write("backend/setup.ts", "throw new Error('database down');\n")

        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_an_unsupported_nested_test_script_exits_2(self):
        repo = Repo(self, {"calc.py": RIGHT_ADD, "test_calc.py": PYTEST_TEST,
                           "web/package.json": '{"scripts": {"test": "jest"}}\n'})
        repo.write("TESTLIST.md", "- [ ] something\n")

        result = repo.run("tdd-step", "test", "plan")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("jest", result.stderr)

    def test_a_pytest_run_without_a_report_is_an_error_even_with_exit_0(self):
        repo = vitest_repo(self)
        repo.commit_all("red: seed", {"calc.js": "export const add = () => 0;\n", "calc.test.js": VITEST_TEST,
                                      "calc.py": RIGHT_ADD, "test_calc.py": PYTEST_TEST})
        repo.write("calc.js", RIGHT_ADD_JS)
        repo.write("calc.py", "import os\nos._exit(0)\n" + RIGHT_ADD)

        self.assert_refused(repo, "green", "green needs all tests passing", head="red: seed")

    def test_a_vitest_test_named_like_the_unhandled_error_summary_is_still_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST.replace(
            '"adds"', '"Vitest caught 1 unhandled error during the test run"'))

        result = repo.run("tdd-step", "red", "adds")

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_a_broken_vitest_suite_is_not_dropped_in_a_mixed_repository(self):
        breakages = {"test file fails to load": ("calc.test.js", VITEST_TEST.replace("./calc.js", "./missing.js")),
                     "config fails to load": ("vitest.config.js", "export default {\n")}
        for name, (rel, text) in breakages.items():
            with self.subTest(name):
                repo = vitest_repo(self)
                repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST,
                                                "calc.py": RIGHT_ADD, "test_calc.py": PYTEST_TEST})
                repo.write(rel, text)
                self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_a_vitest_suite_of_todo_tests_does_not_pass(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST})
        repo.write("calc.test.js", 'import { test } from "vitest";\n\ntest.todo("adds");\n')

        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")
    def test_more_test_configuration_files_are_test_code(self):
        deselect = '[pytest]\naddopts = ["--deselect", "test_calc.py::test_adds"]\n'
        projects = {
            "pytest.toml": (Repo(self, {"calc.py": WRONG_ADD, "test_one.py": "def test_one():\n    pass\n"}),
                            {"test_calc.py": PYTEST_TEST}, deselect),
            ".pytest.ini": (Repo(self, {"calc.py": WRONG_ADD, "test_one.py": "def test_one():\n    pass\n"}),
                            {"test_calc.py": PYTEST_TEST},
                            "[pytest]\naddopts = --deselect test_calc.py::test_adds\n"),
            "package.json": (vitest_repo(self), {"calc.test.js": VITEST_TEST, "calc.py": RIGHT_ADD,
                                                 "test_calc.py": PYTEST_TEST}, '{"devDependencies": {}}\n'),
        }
        for config, (repo, red, text) in projects.items():
            with self.subTest(config):
                repo.commit_all("red: adds", red)
                repo.write(config, text)
                self.assert_refused(repo, "green", f"not tests: {config}", head="red: adds")

