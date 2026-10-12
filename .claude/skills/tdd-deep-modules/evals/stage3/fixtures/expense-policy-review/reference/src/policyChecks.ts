import type { Expense } from "./expense";
import type { Policy, Violation } from "./expenseReview";

/** Returns the violations of each expense, in file order; earlier expenses influence later ones. */
export function checkPolicy(expenses: Expense[], policy: Policy): Violation[][] {
  const seen = new Set<string>();
  const dailyTotals = new Map<string, number>();

  return expenses.map((e) => {
    const rules = policy.categories[e.category];
    const violations: Violation[] = [];

    const identity = JSON.stringify([e.employee, e.date, e.category, e.amountCents, e.currency]);
    if (seen.has(identity)) violations.push("DUPLICATE");
    seen.add(identity);

    if (rules.perItemLimitCents !== undefined && e.amountChfCents > rules.perItemLimitCents) {
      violations.push("OVER_ITEM_LIMIT");
    }

    const dayKey = JSON.stringify([e.employee, e.date, e.category]);
    const dayTotal = (dailyTotals.get(dayKey) ?? 0) + e.amountChfCents;
    dailyTotals.set(dayKey, dayTotal);
    if (rules.dailyLimitCents !== undefined && dayTotal > rules.dailyLimitCents) {
      violations.push("OVER_DAILY_LIMIT");
    }

    if (!e.hasReceipt && e.amountChfCents > policy.receiptRequiredAboveCents) violations.push("NO_RECEIPT");
    return violations;
  });
}
