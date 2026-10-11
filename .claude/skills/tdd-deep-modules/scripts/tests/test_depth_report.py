import unittest
from pathlib import Path

from tests.fixture import Repo

FIXTURES = Path(__file__).resolve().parent / "depth_fixtures"  # .txt: not part of the project's own TypeScript
AMOUNT_TEST = 'import { expect, test } from "vitest";\nimport { parseAmount } from "./amount";\n\n' \
              'test("parses", () => {\n  expect(parseAmount("CHF 1\'234.50")).toBe(123450);\n});\n'


def fixture(name):
    return (FIXTURES / f"{name}.ts.txt").read_text()


def report_line(result, path):
    return next(line for line in result.stdout.splitlines() if line.startswith(f"{path}:"))


class DepthReportTest(unittest.TestCase):
    def test_a_deep_module_is_reported_deep(self):
        repo = Repo(self, {"src/amount.ts": fixture("deep"), "src/amount.test.ts": AMOUNT_TEST})

        result = repo.run("depth_report", "src/amount.ts")

        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        line = report_line(result, "src/amount.ts")
        self.assertTrue(line.startswith("src/amount.ts: surface 2, size 34, ratio 17.0"), line)
        self.assertTrue(line.endswith("-> deep"), line)

    def test_a_shallow_module_is_a_finding(self):
        repo = Repo(self, {"src/amount.ts": fixture("shallow")})

        result = repo.run("depth_report", "src/amount.ts")

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertRegex(report_line(result, "src/amount.ts"), r"-> .*shallow: ratio \d+\.\d < 4")

    def test_pass_through_wrappers_are_counted_and_named(self):
        repo = Repo(self, {"src/amount.ts": fixture("shallow")})

        result = repo.run("depth_report", "src/amount.ts")

        line = report_line(result, "src/amount.ts")
        self.assertIn(", pass-through 4", line)
        self.assertIn("pass-through: toNumber, parse, clean, convert", line.split(" -> ", 1)[1])

    def test_two_tiny_classes_are_classitis(self):
        shallow = Repo(self, {"src/amount.ts": fixture("shallow")})
        deep = Repo(self, {"src/amount.ts": fixture("deep"), "src/amount.test.ts": AMOUNT_TEST})

        tiny = report_line(shallow.run("depth_report", "src/amount.ts"), "src/amount.ts")
        none = report_line(deep.run("depth_report", "src/amount.ts"), "src/amount.ts")

        self.assertIn(", classitis yes,", tiny)
        self.assertIn("classitis: Cleaner, Converter", tiny.split(" -> ", 1)[1])
        self.assertIn(", classitis no,", none)

    def test_the_test_boundary_counts_test_files_importing_the_module(self):
        spec = 'import { parseAmount } from "../src/amount.js";\n'
        other = 'import { parseAmount } from "./amounts";\n'
        tested = Repo(self, {"src/amount.ts": fixture("deep"), "src/amount.test.ts": AMOUNT_TEST,
                             "tests/amount.spec.ts": spec, "src/other.test.ts": other})
        untested = Repo(self, {"src/amount.ts": fixture("deep"), "src/amount.md": other})

        two = tested.run("depth_report", "src/amount.ts")
        none = untested.run("depth_report", "src/amount.ts")

        self.assertIn(", tests 2", report_line(two, "src/amount.ts"))
        self.assertEqual(two.returncode, 0, two.stdout + two.stderr)
        line = report_line(none, "src/amount.ts")
        self.assertIn(", tests 0", line)
        self.assertIn("untested: no test file imports it", line.split(" -> ", 1)[1])
        self.assertEqual(none.returncode, 1, none.stdout + none.stderr)

    def test_unused_functions_and_duplicated_lines_are_bloat(self):
        bloated = Repo(self, {"src/total.ts": fixture("bloated"),
                              "src/total.test.ts": 'import { total } from "./total";\n'})
        deep = Repo(self, {"src/amount.ts": fixture("deep"), "src/amount.test.ts": AMOUNT_TEST})

        result = bloated.run("depth_report", "src/total.ts")
        clean = report_line(deep.run("depth_report", "src/amount.ts"), "src/amount.ts")

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        line = report_line(result, "src/total.ts")
        self.assertIn(", unused 3, duplicate 6 ->", line)
        self.assertIn("bloat: unused totalWithDiscount, totalOfPositive, formatTotal; 6 duplicated lines",
                      line.split(" -> ", 1)[1])
        self.assertIn(", unused 0, duplicate 1 -> deep", clean)

    def test_every_export_form_counts_towards_the_surface(self):
        module = """export type Rappen = number;
export interface Line {
  amount: Rappen;
}
export const VAT = 8.1;
export const net = (gross: number, rate = VAT) => gross / (1 + rate / 100);

export default function sum(lines: Line[]): number {
  return lines.reduce((total, line) => total + line.amount, 0);
}

const half = (x: number) => x / 2;
function round(x: number): number {
  return Math.round(x);
}
export { half, round as roundRappen };

export class Ledger {
  #entries: number[] = [];
  constructor(owner: string, currency: string) {
    this.audit(owner, currency);
  }
  add(amount: number): void {
    this.#entries.push(amount);
    this.#check();
  }
  private audit(owner: string, currency: string): void {
    console.log(owner, currency);
  }
  #check(): void {
    console.log(this.#entries.length);
  }
}
"""
        repo = Repo(self, {"src/ledger.ts": module})

        result = repo.run("depth_report", "src/ledger.ts")

        # Rappen, Line, VAT 3 + net 1+2 + sum 1+1 + half, roundRappen 2 + Ledger 1+2 (constructor)
        # + add 1+1; audit and #check are private
        self.assertTrue(report_line(result, "src/ledger.ts").startswith("src/ledger.ts: surface 15,"),
                        result.stdout)

    def test_usage_errors_exit_2_with_a_message(self):
        repo = Repo(self, {"src/amount.ts": fixture("deep"), "README.md": "# x\n"})
        outside = Repo(self, {})
        (outside.path / ".git").rename(outside.path / "no-git")
        outside.write("amount.ts", fixture("deep"))

        for name, where, args, message in (
                ("no file", repo, (), "usage: depth_report <file>..."),
                ("missing file", repo, ("src/nope.ts",), "src/nope.ts: no such file"),
                ("not a module", repo, ("README.md",), "README.md: not a TypeScript or JavaScript file"),
                ("outside git", outside, ("amount.ts",), "amount.ts: not inside a git repository")):
            with self.subTest(name):
                result = where.run("depth_report", *args)

                self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
                self.assertIn(f"depth_report: {message}", result.stderr)
                self.assertNotIn("Traceback", result.stderr)

    def test_block_comments_are_not_code(self):
        module = ("/**\n * Doubles a value.\n * @param x the value\n */\n"
                  "export function double(x: number): number {\n  /* no rounding */\n  return x * 2;\n}\n")
        repo = Repo(self, {"src/double.ts": module})

        line = report_line(repo.run("depth_report", "src/double.ts"), "src/double.ts")

        self.assertTrue(line.startswith("src/double.ts: surface 2, size 3,"), line)

    def test_a_dotted_module_name_is_matched_whole(self):
        test = "import { createApartment } from '../services/apartment.service';\n"
        repo = Repo(self, {"src/services/apartment.service.ts": fixture("deep"),
                           "src/services/apartment.ts": fixture("deep"),
                           "src/__tests__/apartment.pg.test.ts": test})

        dotted = repo.run("depth_report", "src/services/apartment.service.ts")
        plain = repo.run("depth_report", "src/services/apartment.ts")

        self.assertIn(", tests 1,", report_line(dotted, "src/services/apartment.service.ts"))
        self.assertIn(", tests 0,", report_line(plain, "src/services/apartment.ts"))

    def test_a_sveltekit_lib_import_counts(self):
        test = "import { parseAmount } from '$lib/server/amount';\n"
        repo = Repo(self, {"src/lib/server/amount.ts": fixture("deep"),
                           "src/__tests__/amount.test.ts": test})

        result = repo.run("depth_report", "src/lib/server/amount.ts")

        self.assertIn(", tests 1,", report_line(result, "src/lib/server/amount.ts"))
