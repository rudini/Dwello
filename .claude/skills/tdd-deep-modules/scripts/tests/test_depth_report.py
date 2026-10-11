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
