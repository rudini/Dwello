import type { Column } from "./csv";
import type { FxRates, Policy } from "./expenseReview";

export interface Expense {
  line: number;
  date: string;
  employee: string;
  category: string;
  amountCents: number;
  currency: string;
  amountChfCents: number;
  hasReceipt: boolean;
}

export type ParsedExpense = { ok: true; expense: Expense } | { ok: false; reason: string };

function isCalendarDate(text: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function parseCents(text: string): number | undefined {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(text);
  if (!match) return undefined;
  const cents = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
  return cents > 0 ? cents : undefined;
}

/** Validates one CSV row and converts its amount to CHF; reports the first problem found. */
export function toExpense(line: number, values: Record<Column, string>, policy: Policy, fxRates: FxRates): ParsedExpense {
  const fail = (reason: string): ParsedExpense => ({ ok: false, reason });
  const date = values.date.trim();
  const employee = values.employee.trim();
  const category = values.category.trim();
  const currency = values.currency.trim();
  const receipt = values.receipt.trim().toLowerCase();

  if (!isCalendarDate(date)) return fail("invalid date");
  if (employee === "") return fail("missing employee");
  if (!Object.hasOwn(policy.categories, category)) return fail("unknown category");
  const amountCents = parseCents(values.amount.trim());
  if (amountCents === undefined) return fail("invalid amount");
  const rate = currency === "CHF" ? 1 : Object.hasOwn(fxRates, currency) ? fxRates[currency] : undefined;
  if (rate === undefined) return fail("unknown currency");
  if (receipt !== "yes" && receipt !== "no") return fail("invalid receipt flag");

  return {
    ok: true,
    expense: {
      line,
      date,
      employee,
      category,
      amountCents,
      currency,
      amountChfCents: Math.round(amountCents * rate),
      hasReceipt: receipt === "yes",
    },
  };
}
