import { describe, expect, test } from "bun:test";
import { ExpenseFileError, reviewExpenses, type Policy } from "../src/expenseReview";

const policy: Policy = {
  categories: {
    meals: { perItemLimitCents: 8000, dailyLimitCents: 12000 },
    hotel: { perItemLimitCents: 25000 },
    travel: {},
  },
  receiptRequiredAboveCents: 5000,
};
const fx = { EUR: 0.9412, USD: 0.8823 };
const HEADER = "date,employee,category,amount,currency,receipt";

function review(...rows: string[]) {
  return reviewExpenses([HEADER, ...rows].join("\n"), policy, fx);
}

function fileError(csv: string): string {
  try {
    reviewExpenses(csv, policy, fx);
  } catch (error) {
    expect(error).toBeInstanceOf(ExpenseFileError);
    return (error as Error).message;
  }
  throw new Error("expected an ExpenseFileError");
}

describe("reading the file", () => {
  test("an ordinary expense in CHF is approved", () => {
    expect(review("2026-09-01,Anna Meier,meals,45.50,CHF,yes")).toEqual({
      lines: [
        { line: 2, date: "2026-09-01", employee: "Anna Meier", category: "meals", amountChfCents: 4550, violations: [] },
      ],
      rejected: [],
      totals: { "Anna Meier": { approvedCents: 4550, flaggedCents: 0 } },
    });
  });

  test("foreign currencies are converted to CHF cents", () => {
    const report = review(
      "2026-09-01,Anna,travel,100.00,EUR,yes",
      "2026-09-01,Anna,travel,12.34,USD,yes",
      "2026-09-01,Anna,travel,7.5,EUR,yes",
      "2026-09-01,Anna,travel,3,CHF,yes",
    );
    expect(report.lines.map((l) => l.amountChfCents)).toEqual([9412, 1089, 706, 300]);
  });

  test("columns may come in any order with any case and extra columns", () => {
    const csv = ["Receipt, Currency,AMOUNT,Project,Category,Employee,Date", "no,CHF,20.00,P-17,hotel, Beat Huber ,2026-09-03"].join(
      "\n",
    );
    expect(reviewExpenses(csv, policy, fx).lines).toEqual([
      { line: 2, date: "2026-09-03", employee: "Beat Huber", category: "hotel", amountChfCents: 2000, violations: [] },
    ]);
  });

  test("a file without header or with missing columns is refused", () => {
    expect(fileError("")).toBe("Missing header");
    expect(fileError("\n  \n")).toBe("Missing header");
    expect(fileError("date,employee,category,currency")).toBe("Missing column: amount");
    expect(fileError("employee,date,amount,currency,receipt")).toBe("Missing column: category");
  });

  test("blank lines are skipped but still count for line numbers, CRLF is accepted", () => {
    const csv = ["", HEADER, "2026-09-01,Anna,travel,10.00,CHF,yes", "   ", "2026-09-02,Anna,travel,oops,CHF,yes", ""].join("\r\n");
    const report = reviewExpenses(csv, policy, fx);
    expect(report.lines.map((l) => l.line)).toEqual([3]);
    expect(report.rejected).toEqual([{ line: 5, reason: "invalid amount" }]);
  });

  test("quoted fields may contain commas and doubled quotes", () => {
    const report = review(
      '2026-09-02,"Müller, Hans",meals,"12.00",CHF,yes',
      '2026-09-02,"Hans ""Hasi"" Weber",meals,8.00,CHF,"yes"',
    );
    expect(report.lines.map((l) => l.employee)).toEqual(["Müller, Hans", 'Hans "Hasi" Weber']);
    expect(report.lines.map((l) => l.amountChfCents)).toEqual([1200, 800]);
  });
});

describe("rejected rows", () => {
  test("each check has its own reason", () => {
    const report = review(
      "2026-09-01,Anna,meals,10.00,CHF",
      "2026-02-30,Anna,meals,10.00,CHF,yes",
      "2026-9-1,Anna,meals,10.00,CHF,yes",
      "2026-09-01,  ,meals,10.00,CHF,yes",
      "2026-09-01,Anna,Meals,10.00,CHF,yes",
      "2026-09-01,Anna,meals,12.505,CHF,yes",
      "2026-09-01,Anna,meals,-5,CHF,yes",
      "2026-09-01,Anna,meals,0.00,CHF,yes",
      "2026-09-01,Anna,meals,10.00,GBP,yes",
      "2026-09-01,Anna,meals,10.00,CHF,maybe",
      "2026-09-01,Anna,meals,10.00,CHF,yes,extra",
    );
    expect(report.rejected).toEqual([
      { line: 2, reason: "wrong number of fields" },
      { line: 3, reason: "invalid date" },
      { line: 4, reason: "invalid date" },
      { line: 5, reason: "missing employee" },
      { line: 6, reason: "unknown category" },
      { line: 7, reason: "invalid amount" },
      { line: 8, reason: "invalid amount" },
      { line: 9, reason: "invalid amount" },
      { line: 10, reason: "unknown currency" },
      { line: 11, reason: "invalid receipt flag" },
      { line: 12, reason: "wrong number of fields" },
    ]);
    expect(report.lines).toEqual([]);
    expect(report.totals).toEqual({});
  });

  test("only the first failing check is reported", () => {
    expect(review("2026-13-01,,travel,abc,GBP,maybe").rejected).toEqual([{ line: 2, reason: "invalid date" }]);
    expect(review("2026-09-01,Anna,parking,abc,GBP,maybe").rejected).toEqual([{ line: 2, reason: "unknown category" }]);
  });

  test("the receipt flag is case-insensitive and leap days are real dates", () => {
    const report = review("2028-02-29,Anna,travel,1.00,CHF,YES", "2026-09-01,Anna,travel,1.00,CHF,No");
    expect(report.rejected).toEqual([]);
    expect(report.lines).toHaveLength(2);
  });
});

describe("policy checks", () => {
  test("items above the category limit are flagged, at the limit they are not", () => {
    const report = review(
      "2026-09-01,Anna,meals,80.00,CHF,yes",
      "2026-09-02,Anna,meals,80.01,CHF,yes",
      "2026-09-03,Anna,meals,85.00,EUR,yes",
      "2026-09-04,Anna,travel,900.00,CHF,yes",
    );
    expect(report.lines.map((l) => l.violations)).toEqual([[], ["OVER_ITEM_LIMIT"], [], []]);
  });

  test("the daily limit uses a running total per employee, day and category", () => {
    const report = review(
      "2026-09-01,Anna,meals,50.00,CHF,yes",
      "2026-09-01,Anna,meals,50.00,EUR,yes",
      "2026-09-01,Anna,meals,30.00,CHF,yes",
      "2026-09-01,Anna,meals,5.00,CHF,yes",
      "2026-09-01,Beat,meals,60.00,CHF,yes",
      "2026-09-02,Anna,meals,60.00,CHF,yes",
      "2026-09-01,Anna,hotel,60.00,CHF,yes",
    );
    expect(report.lines.map((l) => l.violations)).toEqual([[], [], ["OVER_DAILY_LIMIT"], ["OVER_DAILY_LIMIT"], [], [], []]);
  });

  test("a missing receipt is flagged only above the threshold", () => {
    const report = review("2026-09-01,Anna,travel,50.00,CHF,no", "2026-09-01,Anna,travel,50.01,CHF,no", "2026-09-01,Anna,travel,55.00,EUR,no");
    expect(report.lines.map((l) => l.violations)).toEqual([[], ["NO_RECEIPT"], ["NO_RECEIPT"]]);
  });

  test("duplicates compare the amount as a value and include the currency", () => {
    const report = review(
      "2026-09-01,Anna,travel,12.5,CHF,yes",
      "2026-09-01,Anna,travel,12.50,CHF,yes",
      "2026-09-01,Anna,travel,12.50,EUR,yes",
      "2026-09-01,Beat,travel,12.50,CHF,yes",
      "2026-09-01, Anna ,travel,12.50,CHF,no",
    );
    expect(report.lines.map((l) => l.violations)).toEqual([[], ["DUPLICATE"], [], [], ["DUPLICATE"]]);
  });

  test("violations are listed in a fixed order", () => {
    const report = review("2026-09-01,Anna,meals,90.00,CHF,no", "2026-09-01,Anna,meals,90.00,CHF,no");
    expect(report.lines.map((l) => l.violations)).toEqual([
      ["OVER_ITEM_LIMIT", "NO_RECEIPT"],
      ["DUPLICATE", "OVER_ITEM_LIMIT", "OVER_DAILY_LIMIT", "NO_RECEIPT"],
    ]);
  });

  test("rejected rows take no part in the checks", () => {
    const report = review(
      "2026-09-01,Anna,meals,100.00,CHF,maybe",
      "2026-09-01,Anna,meals,100.00,CHF,yes",
    );
    expect(report.rejected).toEqual([{ line: 2, reason: "invalid receipt flag" }]);
    expect(report.lines.map((l) => l.violations)).toEqual([["OVER_ITEM_LIMIT"]]);
  });
});

describe("totals", () => {
  test("approved and flagged amounts are summed per employee", () => {
    const report = review(
      "2026-09-01,Anna,travel,10.00,CHF,yes",
      "2026-09-01,Anna,travel,100.00,EUR,no",
      "2026-09-01,Anna,hotel,180.00,CHF,yes",
      "2026-09-01,Beat,meals,20.00,CHF,yes",
      "2026-09-01,Carla,meals,20.00,XYZ,yes",
    );
    expect(report.totals).toEqual({
      Anna: { approvedCents: 19000, flaggedCents: 9412 },
      Beat: { approvedCents: 2000, flaggedCents: 0 },
    });
  });
});
