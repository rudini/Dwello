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

export function reviewExpenses(_csv: string, _policy: Policy, _fxRates: FxRates): ExpenseReport {
  throw new Error("Not implemented");
}
