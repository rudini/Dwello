import json
import os
import subprocess
import sys
import tempfile
import unittest

from tests.fixture import (BUN_FILES, BUN_TEST, RIGHT_ADD_JS, RIGHT_ADD_TS, SCRIPTS, VITEST_TEST,
                           WRONG_ADD_TS, Repo, bun_repo, vitest_repo)

TEST_HEAD = 'import { test, expect } from "bun:test";\nimport { add } from "./calc";\n\n'


def bun_test(name, body):
    return TEST_HEAD + f'test("{name}", () => {{\n{body}}});\n'


class TddStepTest(unittest.TestCase):
    def assert_refused(self, repo, phase, reason, *, head="init"):
        result = repo.run("tdd-step", phase, "x")
        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn(reason, result.stderr)
        self.assertEqual(repo.subject(), head)

    # --- red -------------------------------------------------------------------------------

    def test_red_with_assertion_failure_commits_phase_and_exit_code(self):
        repo = bun_repo(self)
        repo.write("calc.test.ts", BUN_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
        self.assertEqual(repo.trailer("TDD-Phase"), "red")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    def test_red_is_refused_when_the_suite_passes(self):
        repo = bun_repo(self, RIGHT_ADD_TS)
        repo.write("calc.test.ts", BUN_TEST)
        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_red_is_refused_for_import_syntax_and_missing_tests(self):
        cases = {"import error": ("calc.test.ts", BUN_TEST.replace('import { add } from "./calc";',
                                                                    'import { add } from "./missing";')),
                 "syntax error": ("calc.test.ts", BUN_TEST.replace("});\n", "}\n")),
                 "no tests": ("notes.md", "nothing to test yet\n")}
        for name, (rel, text) in cases.items():
            with self.subTest(name):
                repo = bun_repo(self)
                repo.write(rel, text)
                self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_red_is_refused_when_production_code_changed(self):
        repo = bun_repo(self)
        repo.write("calc.test.ts", BUN_TEST)
        repo.write("calc.ts", WRONG_ADD_TS + "export const helper = () => 1;\n")
        self.assert_refused(repo, "red", "production code changed: calc.ts")

    def test_red_is_refused_when_more_than_one_test_fails(self):
        second_vitest = VITEST_TEST.replace('"adds"', '"adds again"').replace(
            'import { test, expect } from "vitest";\nimport { add } from "./calc.js";\n', "")
        projects = {
            "bun": (bun_repo(self), {"calc.test.ts": BUN_TEST + 'test("again", () => {\n  expect(add(2, 2)).toBe(4);\n});\n'}),
            "vitest": (vitest_repo(self), {"calc.test.js": VITEST_TEST + second_vitest}),
        }
        for framework, (repo, files) in projects.items():
            with self.subTest(framework):
                for rel, text in files.items():
                    repo.write(rel, text)
                self.assert_refused(repo, "red", "red needs exactly one failing test, but 2 fail")

    def test_untracked_production_code_in_a_new_directory_is_refused_as_red(self):
        repo = bun_repo(self)
        repo.write("calc.test.ts", BUN_TEST)
        repo.write("lib/prod.ts", "export const x = 1;\n")
        self.assert_refused(repo, "red", "production code changed: lib/prod.ts")

    def test_a_staged_rename_of_production_code_is_refused_as_red(self):
        repo = bun_repo(self, **{"lib/tool.ts": "export const x = 1;\n"})
        repo.write("calc.test.ts", BUN_TEST)
        repo.git("mv", "lib/tool.ts", "lib/renamed.ts")
        self.assert_refused(repo, "red", "production code changed: lib/renamed.ts, lib/tool.ts")

    # --- green and refactor ----------------------------------------------------------------

    def test_green_is_refused_while_a_test_fails(self):
        repo = bun_repo(self)
        repo.commit_all("red: adds two numbers", {"calc.test.ts": BUN_TEST})
        repo.write("calc.ts", "export const add = (a: number, b: number) => a - b;\n")
        self.assert_refused(repo, "green", "green needs all tests passing", head="red: adds two numbers")

    def test_refactor_is_refused_while_a_test_fails(self):
        repo = bun_repo(self)
        repo.commit_all("red: adds two numbers", {"calc.test.ts": BUN_TEST})
        repo.commit_all("green: adds two numbers", {"calc.ts": RIGHT_ADD_TS})
        repo.write("calc.ts", "export const add = (a: number, b: number) => a * b;\n")
        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: adds two numbers")

    def test_green_is_refused_when_it_changes_tests(self):
        repo = bun_repo(self)
        repo.commit_all("red: adds two numbers", {"calc.test.ts": BUN_TEST})
        repo.write("calc.test.ts", BUN_TEST.replace("toBe(3)", "toBe(0)"))
        self.assert_refused(repo, "green", "green may only change production code, not tests: calc.test.ts",
                            head="red: adds two numbers")

    def test_a_suite_that_runs_no_tests_does_not_pass(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST})
        repo.write("vitest.config.js",
                   'export default { test: { include: ["nothing/**"], passWithNoTests: true } };\n')
        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_a_suite_whose_tests_are_all_skipped_does_not_pass(self):
        projects = {
            "bun": (bun_repo(self, RIGHT_ADD_TS), {"calc.test.ts": BUN_TEST},
                    {"calc.test.ts": BUN_TEST.replace('test("adds"', 'test.skip("adds"')}),
            "vitest": (vitest_repo(self), {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST},
                       {"calc.test.js": VITEST_TEST.replace('test("adds"', 'test.skip("adds"')}),
        }
        for framework, (repo, seed, skipping) in projects.items():
            with self.subTest(framework):
                repo.commit_all("green: seed", seed)
                for rel, text in skipping.items():
                    repo.write(rel, text)
                self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_a_vitest_suite_of_todo_tests_does_not_pass(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST})
        repo.write("calc.test.js", 'import { test } from "vitest";\n\ntest.todo("adds");\n')
        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_deleting_a_test_file_does_not_crash_detection(self):
        repo = bun_repo(self, RIGHT_ADD_TS, **{"calc.test.ts": BUN_TEST, "old.test.ts": BUN_TEST})
        repo.commit_all("green: seed", {})
        (repo.path / "old.test.ts").unlink()

        result = repo.run("tdd-step", "refactor", "drop duplicate test")

        self.assertEqual(result.returncode, 0, result.stderr)

    # --- test phase, order, empty changes --------------------------------------------------

    def test_test_phase_is_refused_when_code_changed(self):
        repo = bun_repo(self)
        repo.write("TESTLIST.md", "- [ ] adds two numbers\n")
        repo.write("calc.test.ts", BUN_TEST)
        repo.write("calc.ts", RIGHT_ADD_TS)
        self.assert_refused(repo, "test", "test phase may only change the test list, not code: calc.test.ts, calc.ts")

    def test_green_is_refused_unless_the_last_phase_was_red(self):
        repo = bun_repo(self, **{"calc.test.ts": BUN_TEST})
        repo.write("calc.ts", RIGHT_ADD_TS)
        self.assert_refused(repo, "green", "green cannot follow start")

    def test_refactor_is_refused_right_after_red(self):
        repo = bun_repo(self)
        repo.commit_all("red: adds two numbers", {"calc.test.ts": BUN_TEST})
        repo.write("calc.ts", RIGHT_ADD_TS)
        self.assert_refused(repo, "refactor", "refactor cannot follow red", head="red: adds two numbers")

    def test_red_is_refused_right_after_red(self):
        repo = bun_repo(self)
        repo.commit_all("red: adds two numbers", {"calc.test.ts": BUN_TEST})
        repo.write("more.test.ts", BUN_TEST.replace('"adds"', '"adds again"'))
        self.assert_refused(repo, "red", "red cannot follow red", head="red: adds two numbers")

    def test_only_green_may_follow_red(self):
        repo = bun_repo(self)
        repo.commit_all("red: adds two numbers", {"calc.test.ts": BUN_TEST})
        repo.write("TESTLIST.md", "- [ ] more\n")
        self.assert_refused(repo, "test", "test cannot follow red", head="red: adds two numbers")

    def test_refactor_must_follow_green_or_refactor(self):
        for previous in ("init", "test: plan"):
            with self.subTest(previous):
                repo = bun_repo(self, RIGHT_ADD_TS, **{"calc.test.ts": BUN_TEST})
                repo.commit_all(previous, {"TESTLIST.md": "- [ ] adds\n"})
                repo.write("calc.ts", "export const add = (a: number, b: number) => [a, b].reduce((x, y) => x + y);\n")
                self.assert_refused(repo, "refactor", "refactor cannot follow", head=previous)

    def test_a_phase_without_changes_is_refused(self):
        repo = bun_repo(self, RIGHT_ADD_TS, **{"calc.test.ts": BUN_TEST})
        repo.commit_all("green: adds two numbers", {})
        self.assert_refused(repo, "refactor", "nothing changed", head="green: adds two numbers")

    def test_a_full_cycle_commits_every_phase_with_the_real_exit_code(self):
        repo = bun_repo(self)
        steps = [("test", {"TESTLIST.md": "- [ ] adds\n"}, "1"),
                 ("red", {"calc.test.ts": BUN_TEST}, "1"),
                 ("green", {"calc.ts": RIGHT_ADD_TS}, "0"),
                 ("refactor", {"calc.ts": "export const add = (a: number, b: number) => [a, b].reduce((x, y) => x + y);\n"}, "0")]
        for phase, files, exit_code in steps:
            for rel, text in files.items():
                repo.write(rel, text)

            result = repo.run("tdd-step", phase, f"{phase} add")

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(repo.subject(), f"{phase}: {phase} add")
            self.assertEqual(repo.trailer("TDD-Exit-Code"), exit_code)
            self.assertEqual(repo.git("status", "--porcelain"), "")

    def test_the_first_commit_of_a_new_repository_can_be_a_phase(self):
        repo = Repo(self, {})
        repo.git("update-ref", "-d", "HEAD")
        repo.write("package.json", '{"scripts": {"test": "bun test"}}\n')
        repo.write("TESTLIST.md", "- [ ] adds two numbers\n")

        result = repo.run("tdd-step", "test", "plan add")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.git("rev-list", "--count", "HEAD"), "1")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    # --- file classification ---------------------------------------------------------------

    def test_files_in_test_directories_are_test_code(self):
        repo = bun_repo(self)
        repo.write("tests/helpers.ts", "export const pair = [1, 2];\n")
        repo.write("tests/calc.test.ts", BUN_TEST.replace('"./calc"', '"../calc"'))

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")

    def test_files_named_like_tests_are_test_code(self):
        for name in ("calc_test.py", "test_calc.py"):
            with self.subTest(name):
                repo = bun_repo(self)
                repo.write("calc.test.ts", BUN_TEST)
                repo.write(name, "X = 1\n")

                result = repo.run("tdd-step", "red", "adds two numbers")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_spec_files_and_test_directories_are_test_code(self):
        helpers = {".spec. file": "calc.spec.js", "test/ directory": "test/helper.js",
                   "__tests__/ directory": "__tests__/helper.js"}
        for kind, helper in helpers.items():
            with self.subTest(kind):
                repo = bun_repo(self)
                repo.write("calc.test.ts", BUN_TEST)
                repo.write(helper, "export const pair = [1, 2];\n")

                result = repo.run("tdd-step", "red", "adds two numbers")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_test_configuration_is_test_code(self):
        configs = ["conftest.py", "pytest.ini", ".pytest.ini", "pytest.toml", "pyproject.toml", "setup.cfg",
                   "tox.ini"]
        for config in configs:
            with self.subTest(config):
                repo = bun_repo(self)
                repo.commit_all("red: adds", {"calc.test.ts": BUN_TEST})
                repo.write("calc.ts", RIGHT_ADD_TS)
                repo.write(config, "[pytest]\n")
                self.assert_refused(repo, "green", f"not tests: {config}", head="red: adds")

    def test_green_cannot_exclude_the_failing_test_through_javascript_configuration(self):
        repo_files = {"calc.test.js": VITEST_TEST, "backend/calc.test.ts": BUN_FILES["backend/calc.test.ts"]}
        projects = {
            "vitest.config.js": (vitest_repo(self), {"calc.test.js": VITEST_TEST}, "export default {};\n"),
            "vite.config.js": (vitest_repo(self), {"calc.test.js": VITEST_TEST},
                               'export default { test: { exclude: ["calc.test.js", "node_modules/**"] } };\n'),
            "package.json": (vitest_repo(self), {**repo_files, **BUN_FILES}, '{"devDependencies": {}}\n'),
        }
        for config, (repo, red, text) in projects.items():
            with self.subTest(config):
                repo.commit_all("red: adds", red)
                repo.write("calc.js", RIGHT_ADD_JS)
                repo.write(config, text)
                self.assert_refused(repo, "green", f"not tests: {config}", head="red: adds")

    # --- vitest ----------------------------------------------------------------------------

    def test_vitest_assertion_failure_is_committed_as_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "red: adds two numbers")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    def test_vitest_load_config_and_missing_tests_are_refused_as_red(self):
        cases = {"load error": {"calc.test.js": VITEST_TEST.replace("./calc.js", "./missing.js")},
                 "config error": {"calc.test.js": VITEST_TEST, "vitest.config.js": "export default {\n"},
                 "no test files": {"notes.md": "nothing yet\n"}}
        for name, files in cases.items():
            with self.subTest(name):
                repo = vitest_repo(self)
                for rel, text in files.items():
                    repo.write(rel, text)
                self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_vitest_red_is_refused_when_production_code_changed(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST)
        repo.write("calc.js", "export const add = (a, b) => -1;\n")

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("production code changed: calc.js", result.stderr)
        self.assertNotIn("calc.test.js", result.stderr)

    def test_vitest_green_commits_when_all_tests_pass(self):
        repo = vitest_repo(self)
        repo.commit_all("red: adds two numbers", {"calc.test.js": VITEST_TEST})
        repo.write("calc.js", RIGHT_ADD_JS)

        result = repo.run("tdd-step", "green", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.subject(), "green: adds two numbers")
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "0")

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

    def test_vitest_errors_that_are_not_assertions_are_refused_as_red(self):
        bodies = {"TypeError": "  add.nope(1, 2);\n",
                  "thrown Error": '  throw new Error("boom");\n',
                  "thrown Error worded like an assertion": '  throw new Error("expected a widget");\n',
                  "TypeError in a matcher": '  await expect(Promise.resolve(1)).resolves.toSatisfy(() => null.x);\n'}
        for name, body in bodies.items():
            with self.subTest(name):
                repo = vitest_repo(self)
                repo.write("calc.test.js", 'import { test, expect } from "vitest";\nimport { add } from "./calc.js";\n\n'
                           f'test("adds", async () => {{\n{body}}});\n')
                self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_vitest_unhandled_errors_are_refused_as_red(self):
        repo = vitest_repo(self)
        repo.write("calc.test.js", VITEST_TEST.replace(
            "  expect(", "  setTimeout(() => null.x, 0);\n  expect(") + 'test("waits", () => new Promise((r) => setTimeout(r, 50)));\n')
        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_vitest_tests_named_after_unhandled_errors_are_still_red(self):
        for name in ("reports an unhandled error", "Vitest caught 1 unhandled error during the test run"):
            with self.subTest(name):
                repo = vitest_repo(self)
                repo.write("calc.test.js", VITEST_TEST.replace('"adds"', f'"{name}"'))

                result = repo.run("tdd-step", "red", "reports errors")

                self.assertEqual(result.returncode, 0, result.stderr)

    # --- bun -------------------------------------------------------------------------------

    def test_bun_classifies_assertions_and_errors(self):
        cases = {"assertion": (bun_test("adds", "  expect(add(1, 2)).toBe(4);\n"), 0),
                 "thrown error": (bun_test("adds", '  throw new Error("boom");\n'), 1)}
        for name, (text, expected) in cases.items():
            with self.subTest(name):
                repo = Repo(self, BUN_FILES)
                repo.write("backend/more.test.ts", text)

                result = repo.run("tdd-step", "red", "adds")

                self.assertEqual(result.returncode, expected, result.stderr)

    def test_bun_assertion_next_to_a_thrown_error_is_refused_as_red(self):
        repo = Repo(self, BUN_FILES)
        repo.write("backend/more.test.ts", 'import { test, expect } from "bun:test";\n\n'
                   'test("a", () => {\n  expect(1).toBe(2);\n});\n\ntest("b", () => {\n  throw new Error("boom");\n});\n')
        self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_a_bun_file_that_fails_to_load_is_not_red(self):
        head = 'import { test, expect } from "bun:test";\n'
        broken = {"missing import": head + 'import { nope } from "./calc";\n\ntest("b", () => {\n  expect(nope(1)).toBe(1);\n});\n',
                  "top-level throw": head + 'throw new Error("broken setup");\n'}
        for name, text in broken.items():
            with self.subTest(name):
                repo = Repo(self, BUN_FILES)
                repo.write("backend/a.test.ts", head + 'import { add } from "./calc";\n\n'
                           'test("a", () => {\n  expect(add(1, 2)).toBe(4);\n});\n')
                repo.write("backend/b.test.ts", text)
                self.assert_refused(repo, "red", "red needs a failing assertion")

    def test_a_nested_bun_package_is_part_of_the_suite(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST, **BUN_FILES})
        repo.write("backend/calc.ts", "export const add = (a: number, b: number) => a - b;\n")
        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_a_crashed_bun_run_is_not_dropped(self):
        crashing = {**BUN_FILES, "backend/package.json":
                    '{"scripts": {"test": "bun test --preload ./setup.ts && echo done"}}\n',
                    "backend/setup.ts": "export {};\n"}
        repo = vitest_repo(self)
        repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST, **crashing})
        repo.write("backend/setup.ts", "throw new Error('database down');\n")
        self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_bun_test_is_found_in_common_script_shapes(self):
        failing = bun_test("adds more", "  expect(add(2, 2)).toBe(5);\n")
        for script in ("NODE_ENV=test bun test", "bun test || true", "bun test; echo done"):
            with self.subTest(script):
                repo = Repo(self, {**BUN_FILES, "backend/package.json": f'{{"scripts": {{"test": "{script}"}}}}\n'})
                repo.write("backend/more.test.ts", failing)

                result = repo.run("tdd-step", "red", "adds more")

                self.assertEqual(result.returncode, 0, result.stderr)

    def test_bun_missing_from_path_exits_2(self):
        repo = Repo(self, BUN_FILES)
        repo.write("TESTLIST.md", "- [ ] something\n")

        result = repo.run("tdd-step", "test", "plan", path="/usr/bin:/bin")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("bun is not installed", result.stderr)
        self.assertNotIn("Traceback", result.stderr)

    # --- mixed repositories ----------------------------------------------------------------

    def test_green_runs_every_framework_in_a_mixed_repository(self):
        repo = vitest_repo(self)
        repo.commit_all("red: seed", {"calc.js": "export const add = () => 0;\n", "calc.test.js": VITEST_TEST,
                                      **BUN_FILES, "backend/calc.ts": WRONG_ADD_TS})
        repo.write("calc.js", RIGHT_ADD_JS)
        self.assert_refused(repo, "green", "green needs all tests passing", head="red: seed")

    def test_a_broken_vitest_suite_is_not_dropped_in_a_mixed_repository(self):
        breakages = {"test file fails to load": ("calc.test.js", VITEST_TEST.replace("./calc.js", "./missing.js")),
                     "config fails to load": ("vitest.config.js", "export default {\n")}
        for name, (rel, text) in breakages.items():
            with self.subTest(name):
                repo = vitest_repo(self)
                repo.commit_all("green: seed", {"calc.js": RIGHT_ADD_JS, "calc.test.js": VITEST_TEST, **BUN_FILES})
                repo.write(rel, text)
                self.assert_refused(repo, "refactor", "refactor needs all tests passing", head="green: seed")

    def test_a_mixed_repository_records_the_highest_exit_code(self):
        repo = vitest_repo(self)
        repo.commit_all("green: seed", BUN_FILES)
        repo.write("calc.test.js", VITEST_TEST)

        result = repo.run("tdd-step", "red", "adds in js")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")

    # --- setup errors ----------------------------------------------------------------------

    def test_without_a_supported_test_framework_it_exits_2(self):
        repo = Repo(self, {"README.md": "docs only\n"})
        repo.write("TESTLIST.md", "- [ ] something\n")

        result = repo.run("tdd-step", "test", "plan")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("no supported test framework", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_an_unknown_phase_exits_2_with_usage(self):
        repo = bun_repo(self)

        for args in (["blue"], []):
            result = repo.run("tdd-step", *args)

            self.assertEqual(result.returncode, 2, result.stderr)
            self.assertIn("usage: tdd-step <test|red|green|refactor> [message]", result.stderr)

    def test_unsupported_test_scripts_exit_2(self):
        for manifest_path in ("package.json", "web/package.json"):
            with self.subTest(manifest_path):
                repo = bun_repo(self, **{manifest_path: '{"scripts": {"test": "jest"}}\n'})
                repo.write("TESTLIST.md", "- [ ] something\n")

                result = repo.run("tdd-step", "test", "plan")

                self.assertEqual(result.returncode, 2, result.stderr)
                self.assertIn("no supported test framework", result.stderr)
                self.assertIn("jest", result.stderr)

    def test_the_npm_init_placeholder_test_script_means_no_tests(self):
        placeholder = json.dumps({"scripts": {"test": 'echo "Error: no test specified" && exit 1'}})
        repo = bun_repo(self, **{"tools/package.json": placeholder})
        repo.write("calc.test.ts", BUN_TEST)

        result = repo.run("tdd-step", "red", "adds two numbers")

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_broken_or_odd_package_json_files_exit_2(self):
        cases = {"package.json is not valid JSON": "{",
                 "vitest is not installed": '{"devDependencies": {"vitest": "*"}}',
                 "null dependencies": '{"devDependencies": null}',
                 "array": "[]",
                 "string scripts": '{"scripts": "jest"}'}
        for name, manifest in cases.items():
            with self.subTest(name):
                repo = Repo(self, {"package.json": manifest})
                repo.write("TESTLIST.md", "- [ ] something\n")

                result = repo.run("tdd-step", "test", "plan")

                self.assertEqual(result.returncode, 2, result.stderr)
                self.assertIn("package.json", result.stderr if "installed" not in name else "package.json")
                self.assertNotIn("Traceback", result.stderr)

    def test_a_package_json_that_is_not_utf8_exits_2(self):
        repo = Repo(self, {})
        (repo.path / "package.json").write_bytes(b'{"name": "\xff"}')
        repo.write("TESTLIST.md", "- [ ] something\n")

        result = repo.run("tdd-step", "test", "plan")

        self.assertEqual(result.returncode, 2, result.stderr)
        self.assertIn("package.json", result.stderr)
        self.assertNotIn("Traceback", result.stderr)

    # --- git and working tree --------------------------------------------------------------

    def test_run_from_a_subdirectory_checks_and_tests_the_whole_repository(self):
        repo = bun_repo(self, **{"pkg/keep.md": "x\n"})
        repo.write("calc.test.ts", BUN_TEST)
        repo.write("pkg/prod.ts", "export const value = 1;\n")

        result = repo.run("tdd-step", "red", "adds two numbers", cwd="pkg")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("production code changed: pkg/prod.ts", result.stderr)
        self.assertEqual(repo.subject(), "init")

    def test_the_message_cannot_forge_trailers(self):
        repo = bun_repo(self)
        repo.write("calc.test.ts", BUN_TEST)

        result = repo.run("tdd-step", "red", "adds\n\nTDD-Exit-Code: 0")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(repo.trailer("TDD-Exit-Code"), "1")
        self.assertEqual(repo.subject(), "red: adds TDD-Exit-Code: 0")

    def test_a_rejected_git_commit_exits_2_and_leaves_the_index_as_it_was(self):
        repo = bun_repo(self)
        hook = repo.path / ".git" / "hooks" / "pre-commit"
        hook.write_text("#!/bin/sh\necho 'hook says no' >&2\nexit 1\n")
        hook.chmod(0o755)
        repo.write("calc.test.ts", BUN_TEST)

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

    def test_a_test_run_that_changes_the_working_tree_is_refused(self):
        repo = bun_repo(self)
        repo.write("calc.test.ts", 'import { writeFileSync } from "fs";\nwriteFileSync("leftover.txt", "x");\n' + BUN_TEST)
        self.assert_refused(repo, "red", "the test run changed the working tree: leftover.txt")

    def test_bytes_that_are_not_utf8_do_not_crash_it(self):
        with self.subTest("test output"):
            repo = bun_repo(self)
            repo.write("calc.test.ts", BUN_TEST.replace("  expect(", "  process.stderr.write(Buffer.from([0xff, 10]));\n  expect("))

            result = repo.run("tdd-step", "red", "adds two numbers")

            self.assertEqual(result.returncode, 0, result.stderr)
        with self.subTest("file name"):
            repo = bun_repo(self)
            (repo.path / os.fsdecode(b"notes-\xff.txt")).write_text("plan\n")

            result = repo.run("tdd-step", "test", "plan")

            self.assertEqual(result.returncode, 0, result.stderr)
