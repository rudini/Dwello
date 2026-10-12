import { readCsv } from "./csv";
import { toExpense, type Expense } from "./expense";
import { checkPolicy } from "./policyChecks";

export interface CategoryPolicy {
  perItemLimitCents?: number;
  dailyLimitCents?: number;
}

export interface Policy {
  categories: Record<string, CategoryPolicy>;
  receiptRequiredAboveCents: number;
}

/** CHF per one unit of the foreign currency, e.g. { EUR: 0.9412 }. */
export type FxRates = Record<string, number>;

export type Violation = "DUPLICATE" | "OVER_ITEM_LIMIT" | "OVER_DAILY_LIMIT" | "NO_RECEIPT";

export interface ReviewedLine {
  line: number;
  date: string;
  employee: string;
  category: string;
  amountChfCents: number;
  violations: Violation[];
}

export interface RejectedLine {
  line: number;
  reason: string;
}

export interface ExpenseReport {
  lines: ReviewedLine[];
  rejected: RejectedLine[];
  totals: Record<string, { approvedCents: number; flaggedCents: number }>;
}

export class ExpenseFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExpenseFileError";
  }
}

export function reviewExpenses(csv: string, policy: Policy, fxRates: FxRates): ExpenseReport {
  const rejected: RejectedLine[] = [];
  const expenses: Expense[] = [];
  for (const row of readCsv(csv)) {
    if (!row.ok) {
      rejected.push({ line: row.line, reason: "wrong number of fields" });
      continue;
    }
    const parsed = toExpense(row.line, row.values, policy, fxRates);
    if (parsed.ok) expenses.push(parsed.expense);
    else rejected.push({ line: row.line, reason: parsed.reason });
  }

  const violations = checkPolicy(expenses, policy);
  const lines = expenses.map(({ line, date, employee, category, amountChfCents }, i) => ({
    line,
    date,
    employee,
    category,
    amountChfCents,
    violations: violations[i],
  }));

  const totals: ExpenseReport["totals"] = {};
  for (const l of lines) {
    const total = (totals[l.employee] ??= { approvedCents: 0, flaggedCents: 0 });
    if (l.violations.length === 0) total.approvedCents += l.amountChfCents;
    else total.flaggedCents += l.amountChfCents;
  }
  return { lines, rejected, totals };
}
