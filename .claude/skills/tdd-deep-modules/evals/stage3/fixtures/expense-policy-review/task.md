# Monthly expense review from the CSV export

Employees record their expenses in a travel app that exports a CSV file once a month. Finance wants an automatic first review: convert every expense to CHF, reject rows that cannot be read, flag expenses that break the company policy, and total the result per employee. Finance reviews the flagged lines by hand afterwards.

## Entry point

`src/expenseReview.ts` (the stub already contains the types and the error class; keep them as they are):

```ts
export interface CategoryPolicy { perItemLimitCents?: number; dailyLimitCents?: number }
export interface Policy {
  categories: Record<string, CategoryPolicy>; // the known categories, e.g. "meals", "hotel"
  receiptRequiredAboveCents: number;
}
export type FxRates = Record<string, number>; // CHF per 1 unit of the currency, e.g. { EUR: 0.9412 }

export type Violation = "DUPLICATE" | "OVER_ITEM_LIMIT" | "OVER_DAILY_LIMIT" | "NO_RECEIPT";
export interface ReviewedLine {
  line: number; date: string; employee: string; category: string;
  amountChfCents: number; violations: Violation[];
}
export interface RejectedLine { line: number; reason: string }
export interface ExpenseReport {
  lines: ReviewedLine[];
  rejected: RejectedLine[];
  totals: Record<string, { approvedCents: number; flaggedCents: number }>;
}
export class ExpenseFileError extends Error { constructor(message: string) }

export function reviewExpenses(csv: string, policy: Policy, fxRates: FxRates): ExpenseReport;
```

## The CSV file

- Lines end with `\n` or `\r\n`. Lines that are empty or contain only whitespace are skipped, but every physical line counts for line numbers (the first line of the file is line 1).
- The first non-blank line is the header. It must contain the columns `date`, `employee`, `category`, `amount`, `currency`, `receipt`, in any order; names are matched case-insensitively after trimming spaces. Additional columns are allowed and ignored.
- Fields are separated by `,`. A field may be enclosed in double quotes; inside quotes a comma is part of the value and `""` stands for one `"`. Spaces around unquoted values are trimmed.
- If there is no header line at all, throw `ExpenseFileError` with message `Missing header`. If a required column is missing, throw `ExpenseFileError` with message `Missing column: <name>`, naming the first missing one in the order listed above.

## Reading a row

Each data row is checked in this order; the first failing check rejects the row with the given `reason` and the row takes no further part in the review:

| Check | `reason` |
|---|---|
| the row has as many fields as the header | `wrong number of fields` |
| `date` is a real calendar date written `YYYY-MM-DD` | `invalid date` |
| `employee` is not empty | `missing employee` |
| `category` is a key of `policy.categories` (exact match) | `unknown category` |
| `amount` is digits with an optional `.` and one or two decimals, and greater than zero | `invalid amount` |
| `currency` is `CHF` or a key of `fxRates` | `unknown currency` |
| `receipt` is `yes` or `no` (case-insensitive) | `invalid receipt flag` |

The CHF amount of an accepted row is `amount * rate` in cents, rounded to the nearest cent (halves up), where the rate of `CHF` is always 1.

## Policy checks

Each accepted row gets a list of violations, always in this order:

1. `DUPLICATE`: an earlier accepted row has the same employee, date, category, amount (as written, compared as a value: `12.5` equals `12.50`) and currency.
2. `OVER_ITEM_LIMIT`: the category has `perItemLimitCents` and the CHF amount is above it.
3. `OVER_DAILY_LIMIT`: the category has `dailyLimitCents` and the running total of CHF amounts of this employee, date and category, over the accepted rows from the top of the file down to and including this row, is above it. (Duplicates count towards the running total like any other row.)
4. `NO_RECEIPT`: `receipt` is `no` and the CHF amount is above `policy.receiptRequiredAboveCents`.

## Result

- `lines`: the accepted rows in file order, with `date`, `employee` and `category` as read (trimmed).
- `rejected`: the rejected rows in file order.
- `totals`: one entry per employee who has at least one accepted row. `approvedCents` sums the CHF amounts of their rows without violations, `flaggedCents` those with at least one violation.
