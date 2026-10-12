import unittest

from tests.fixture import BUN_TEST, NO_DATABASE_TEST, RIGHT_ADD_TS, TIERED_PACKAGE, tiered_repo

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


    def test_options_anywhere_but_right_after_the_phase_exit_2_with_usage(self):
        for args in (["sums", "--suite", "full"], ["--suite=full", "sums"], ["tidy", "--suite", "fast"]):
            with self.subTest(args):
                repo = tiered_repo(self)
                repo.write("calc.test.ts", BUN_TEST)

                result = repo.run("tdd-step", "red", *args)

                self.assertEqual(result.returncode, 2, result.stderr)
                self.assertIn("usage: tdd-step", result.stderr)
                self.assertEqual(repo.subject(), "init")


    def test_a_test_list_after_a_green_on_the_fast_suite_is_refused(self):
        repo = tiered_repo(self, **{"db.pg.test.ts": DATABASE_TEST, "calc.test.ts": BUN_TEST})
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST + 'test("adds zero", () => {\n'
                                  '  expect(add(0, 0)).toBe(0);\n});\n'}, 1, suite="fast")
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0, suite="fast")
        repo.write("TESTLIST.md", "- [ ] next task\n")

        result = repo.run("tdd-step", "test", "next task")

        self.assertEqual(result.returncode, 1, result.stderr)
        self.assertIn("a test list after a green on the fast suite starts a new task, but the task before it "
                      "did not end on the full suite: refactor, or redo the green with --suite full", result.stderr)
        self.assertEqual(repo.subject(), "green: green step")


class TddReplayTierTest(unittest.TestCase):
    def replay(self, repo, base):
        return repo.run("tdd_replay", f"{base}..HEAD")

    def test_each_commit_is_replayed_with_the_suite_of_its_trailer(self):
        repo = tiered_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST}, 1, suite="fast")
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0, suite="fast")  # full: exit 1
        repo.commit_phase("refactor", {"db.pg.test.ts": DATABASE_TEST}, 0)  # the database is up

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("REPLAY: ACCEPT", result.stdout)

    def test_a_commit_without_a_suite_trailer_is_rejected(self):
        repo = green_tiered_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("refactor", {"calc.ts": RIGHT_ADD_TS + "// tidy\n"}, 0, suite=None)

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("the TDD-Suite trailer must say fast or full, but says nothing", result.stdout)

    def test_a_refactor_verified_only_against_the_fast_suite_is_rejected(self):
        repo = tiered_repo(self, RIGHT_ADD_TS, **{"calc.test.ts": BUN_TEST})
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("refactor", {"calc.ts": RIGHT_ADD_TS + "// tidy\n"}, 0, suite="fast")
        repo.commit_phase("refactor", {"db.pg.test.ts": DATABASE_TEST}, 0)

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("refactor must run the full suite", result.stdout)

    def test_a_final_commit_verified_only_against_the_fast_suite_is_rejected(self):
        repo = tiered_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST}, 1, suite="fast")
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0, suite="fast")

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("the final commit must run the full suite", result.stdout)

    def test_a_final_commit_that_fails_the_full_suite_is_rejected(self):
        repo = tiered_repo(self, RIGHT_ADD_TS, **{"calc.test.ts": BUN_TEST})
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] sums in SQL\n"}, 1)

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("the final commit must pass the full suite, but it says: bun: 1 of 2 tests failed",
                      result.stdout)

    def test_a_red_on_the_fast_suite_for_a_test_only_in_the_full_suite_is_rejected(self):
        repo = green_tiered_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("red", {"sum.pg.test.ts": SQL_TEST}, 0, suite="fast")
        repo.commit_phase("green", {"sum.ts": RIGHT_SUM_TS}, 0)

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("red's new test is not in the fast suite: sum.pg.test.ts::::sums in SQL",
                      result.stdout)

    def test_a_green_that_skips_red_s_test_is_rejected(self):
        skipping = ('import { test, expect } from "bun:test";\nimport { add } from "./calc";\n\n'
                    'test.skipIf(process.env.CALC_DONE === "yes")("adds", () => {\n'
                    '  expect(add(1, 2)).toBe(3);\n});\n')
        cases = {"skipped by production code": (
                     {"calc.test.ts": skipping}, "fast",
                     {"calc.ts": 'process.env.CALC_DONE = "yes";\n' + RIGHT_ADD_TS}, "fast",
                     "green removes tests: calc.test.ts::::adds"),
                 "a tier without red's test": (
                     {"sum.pg.test.ts": SQL_TEST}, "full", {"sum.ts": RIGHT_SUM_TS}, "fast",
                     "green must run the full suite, like its red")}
        for name, (red, red_suite, green, green_suite, reason) in cases.items():
            with self.subTest(name):
                repo = tiered_repo(self, **{"db.pg.test.ts": DATABASE_TEST,
                                            "sum.ts": "export const sum = (xs: number[]) => 0;\n"})
                base = repo.git("rev-parse", "HEAD")
                repo.commit_phase("red", red, 1, suite=red_suite)
                repo.commit_phase("green", green, 0, suite=green_suite)
                repo.commit_phase("refactor", {"calc.ts": RIGHT_ADD_TS}, 0)

                result = self.replay(repo, base)

                self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
                self.assertIn(reason, result.stdout)

    def test_every_task_must_end_on_the_full_suite(self):
        multiplies = ('import { test, expect } from "bun:test";\n\ntest("multiplies", async () => {\n'
                      '  const m = await import("./mul").catch(() => ({ mul: () => 0 }));\n'
                      '  expect(m.mul(2, 3)).toBe(6);\n});\n')
        repo = green_tiered_repo(self)
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] multiplies\n"}, 0, suite="fast")
        repo.commit_phase("red", {"mul.test.ts": multiplies}, 1, suite="fast")
        task_end = repo.commit_phase("green", {"mul.ts": "export const mul = (a: number, b: number) => a * b;\n"},
                                     0, suite="fast")
        repo.commit_phase("test", {"TESTLIST.md": "- [x] multiplies\n- [ ] sums in SQL\n"}, 0)
        repo.commit_phase("red", {"sum.pg.test.ts": SQL_TEST}, 1)
        repo.commit_phase("green", {"sum.ts": RIGHT_SUM_TS}, 0)

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn(f"{task_end[:7]} green    pass  exit=0 REJECT\n"
                      "    - the final commit must run the full suite\n", result.stdout)

    def test_a_commit_that_drops_a_test_from_the_fast_suite_is_rejected(self):
        repo = green_tiered_repo(self)
        base = repo.git("rev-parse", "HEAD")
        narrowed = TIERED_PACKAGE.replace("**/*.pg.test.ts", "**/*.pg.test.ts --path-ignore-patterns=calc.test.ts")
        repo.commit_phase("red", {"package.json": narrowed, "sum.pg.test.ts": SQL_TEST}, 1)
        repo.commit_phase("green", {"sum.ts": RIGHT_SUM_TS}, 0)

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("red removes tests from the fast suite: calc.test.ts::::adds", result.stdout)

    def test_test_commits_after_the_task_s_last_full_step_are_accepted(self):
        repo = tiered_repo(self, **{"db.pg.test.ts": DATABASE_TEST})
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1, suite="fast")  # no fast tests yet
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST}, 1, suite="fast")
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0, suite="fast")
        repo.commit_phase("refactor", {"calc.ts": RIGHT_ADD_TS + "// tidy\n"}, 0)
        repo.commit_phase("test", {"DESIGN.md": "design note\n"}, 0, suite="fast")

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("REPLAY: ACCEPT", result.stdout)

    def test_a_trailing_test_commit_that_breaks_the_suite_is_rejected(self):
        repo = tiered_repo(self, **{"db.pg.test.ts": DATABASE_TEST.replace('expect("rows")', 'expect(rows())')
                                    .replace('import { test, expect } from "bun:test";\n',
                                             'import { test, expect } from "bun:test";\nimport data from "./data.json";\n'
                                             'const rows = () => data.rows;\n'),
                                    "data.json": '{"rows": "rows"}\n'})
        base = repo.git("rev-parse", "HEAD")
        repo.commit_phase("test", {"TESTLIST.md": "- [ ] adds\n"}, 1, suite="fast")  # no fast tests yet
        repo.commit_phase("red", {"calc.test.ts": BUN_TEST}, 1, suite="fast")
        repo.commit_phase("green", {"calc.ts": RIGHT_ADD_TS}, 0, suite="fast")
        repo.commit_phase("refactor", {"calc.ts": RIGHT_ADD_TS + "// tidy\n"}, 0)
        repo.commit_phase("test", {"DESIGN.md": "design note\n", "data.json": '{"rows": "none"}\n'}, 0, suite="fast")

        result = self.replay(repo, base)

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("the range must end with the full suite passing, but it says: bun: 1 of 2 tests failed",
                      result.stdout)
