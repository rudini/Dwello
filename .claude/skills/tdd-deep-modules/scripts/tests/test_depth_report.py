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
        repo = Repo(self, {"src/amount.ts": fixture("deep"), "README.md": "# x\n", "src/dir.ts/keep": ""})
        outside = Repo(self, {})
        (outside.path / ".git").rename(outside.path / "no-git")
        outside.write("amount.ts", fixture("deep"))

        for name, where, args, message in (
                ("no file", repo, (), "usage: depth_report <file>..."),
                ("missing file", repo, ("src/nope.ts",), "src/nope.ts: no such file"),
                ("a directory", repo, ("src",), "src: not a TypeScript or JavaScript file"),
                ("a directory named like a module", repo, ("src/dir.ts",), "src/dir.ts: not a file"),
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

    def test_repeated_comment_lines_are_not_duplicates(self):
        doc = "/**\n * Reads the session from the cookies.\n * @param cookies SvelteKit cookies object\n */\n"
        module = (doc + "export function read(cookies: string): string {\n  return cookies.trim();\n}\n"
                  + doc + "export function clear(cookies: string): string {\n  return cookies.slice(1);\n}\n")
        repo = Repo(self, {"src/session.ts": module})

        line = report_line(repo.run("depth_report", "src/session.ts"), "src/session.ts")

        self.assertIn(", duplicate 0 ->", line)

    def test_wrapped_and_generic_signatures_count_towards_the_surface(self):
        module = ("export async function load(\n  id: string,\n  limit: number\n): Promise<string[]> {\n"
                  "  return [id, String(limit)];\n}\n\n"
                  "export function pair<T>(a: T, b: T): T[] {\n  return [a, b];\n}\n")
        repo = Repo(self, {"src/load.ts": module})

        line = report_line(repo.run("depth_report", "src/load.ts"), "src/load.ts")

        # load 1+2, pair 1+2
        self.assertTrue(line.startswith("src/load.ts: surface 6,"), line)

    def test_nothing_in_comments_counts(self):
        module = ("/**\n * Base class for application errors { see below }.\n"
                  " * old: export function legacy(a) { return run(a); }\n */\n"
                  "// export function dead(a) { return run(a); }\n"
                  "// function helper() { return 1; }\n"
                  "export function run(a: number): number {\n  return a * 2 + 1;\n}\n")
        repo = Repo(self, {"src/run.ts": module})

        line = report_line(repo.run("depth_report", "src/run.ts"), "src/run.ts")

        self.assertTrue(line.startswith("src/run.ts: surface 2, size 3, ratio 1.5, classitis no, "
                                        "pass-through 0, tests 0, unused 0,"), line)
        self.assertNotIn("for", line.split(" -> ", 1)[1])

    def test_arrow_and_awaiting_forwards_are_pass_throughs(self):
        module = ("export const get = (id: string) => fetchIt(id);\n"
                  "export async function load(id: string) {\n  return await fetchIt(id);\n}\n"
                  "function fetchIt(id: string) {\n  return id.trim().toUpperCase();\n}\n")
        repo = Repo(self, {"src/get.ts": module})

        line = report_line(repo.run("depth_report", "src/get.ts"), "src/get.ts")

        self.assertIn("pass-through: get, load", line.split(" -> ", 1)[1])

    def test_repeated_object_literal_members_are_not_duplicates(self):
        columns = "    id: apartments.id,\n    number: apartments.number,\n    floor: apartments.floor,\n"
        module = (f"export function list(db: Db) {{\n  return db.select({{\n{columns}  }}).from(apartments);\n}}\n"
                  f"export function one(db: Db, id: string) {{\n  return db.select({{\n{columns}  }}).where(id);\n}}\n")
        repo = Repo(self, {"src/list.ts": module})

        line = report_line(repo.run("depth_report", "src/list.ts"), "src/list.ts")

        self.assertIn(", duplicate 0 ->", line)

    def test_classes_without_methods_are_not_classitis(self):
        module = ("export class OAuthError extends Error {\n  constructor(message: string) {\n    super(message);\n  }\n}\n"
                  "export class JWTError extends Error {\n  constructor(message: string) {\n    super(message);\n  }\n}\n")
        repo = Repo(self, {"src/errors.ts": module})

        line = report_line(repo.run("depth_report", "src/errors.ts"), "src/errors.ts")

        self.assertIn(", classitis no,", line)

    def test_a_require_in_a_test_counts(self):
        test = 'const { parseAmount } = require("./amount");\n'
        repo = Repo(self, {"src/amount.ts": fixture("deep"), "src/amount.test.js": test})

        line = report_line(repo.run("depth_report", "src/amount.ts"), "src/amount.ts")

        self.assertIn(", tests 1,", line)

    def test_an_unused_function_expression_is_bloat(self):
        module = ("export function run(a: number): number {\n  let total = a;\n  total = total * 3;\n"
                  "  total = total + 1;\n  return total;\n}\n"
                  "const legacy = function (a: number): number {\n  return a * 2;\n};\n")
        repo = Repo(self, {"src/run.ts": module})

        line = report_line(repo.run("depth_report", "src/run.ts"), "src/run.ts")

        self.assertIn("bloat: unused legacy", line.split(" -> ", 1)[1])

    def test_pins_the_remaining_export_forms_and_import_kinds(self):
        module = ("// caf\xe9\nexport enum Kind {\n  A,\n  B,\n}\nexport declare const VERSION: string;\n"
                  "export abstract class Shape {\n  get size(): number {\n    return 1;\n  }\n}\n"
                  'export * from "./other";\nexport let counter = 0;\nexport var legacy = 1;\n'
                  "export function* ids(start: number) {\n  yield start;\n}\n"
                  "export const load = async (id: string) => id;\n").encode("latin-1")
        repo = Repo(self, {})
        (repo.path / "src").mkdir()
        (repo.path / "src" / "shape.ts").write_bytes(module)
        repo.write("src/shape.test.ts", 'const shape = await import("./shape");\n')  # untracked

        line = report_line(repo.run("depth_report", "src/shape.ts"), "src/shape.ts")

        # Kind, VERSION, Shape + size, *, counter, legacy, ids + start, load + id
        self.assertTrue(line.startswith("src/shape.ts: surface 11,"), line)
        self.assertIn(", tests 1,", line)

    def test_only_an_arrow_whose_whole_body_is_the_call_is_a_pass_through(self):
        module = ("export const up = (s: string) => trim(s).toUpperCase();\n"
                  "export const inc = (n: number) => count(n) + 1;\n"
                  "export const ok = (n: number) => count(n) > 0 ? 'yes' : 'no';\n"
                  "export const groupIban = (iban: string) => compact(iban).replace(/(.{4})(?=.)/g, '$1 ');\n"
                  "function inner(a: number, b: number) {\n  return a - b;\n}\n"
                  "export const m = (a: string) => obj.method(a);\n")
        repo = Repo(self, {"src/fmt.ts": module})

        line = report_line(repo.run("depth_report", "src/fmt.ts"), "src/fmt.ts")

        self.assertIn(", pass-through 1,", line)
        self.assertIn("pass-through: m;", line.split(" -> ", 1)[1])

    def test_a_call_that_changes_an_argument_is_not_a_pass_through(self):
        module = ("export const amount = (value: unknown) => Number(value ?? 0);\n"
                  "export const half = (x: number) => round(x / 2);\n"
                  "export function pick(a: string, b: string) {\n  return choose(a ? b : a, b);\n}\n")
        repo = Repo(self, {"src/amount.ts": module})

        line = report_line(repo.run("depth_report", "src/amount.ts"), "src/amount.ts")

        self.assertIn(", pass-through 0,", line)
