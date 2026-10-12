# Bug: wrong amounts on till receipts (rounding, coupons, VAT)

**Reported by:** shop staff, Filiale Bern
**Component:** checkout (`src/checkout.ts`, `src/receipt.ts` and the modules they use)

The till computes receipts with `checkout(...)` from `src/checkout.ts` and prints them with `renderReceipt(...)` from `src/receipt.ts`. Prices in the catalog include Swiss VAT. Since the last release staff have reported several wrong receipts. Please fix them, and add the small coupon feature at the end that marketing asked for in the same area.

The existing signatures stay as they are:

```ts
// src/checkout.ts
export function checkout(cart: CartLine[], catalog: Catalog, promotions?: Promotion[], couponCode?: string): Receipt;
// src/receipt.ts
export function renderReceipt(receipt: Receipt): string;
// src/catalog.ts (used to build the catalog)
export function createCatalog(products: Product[]): Catalog;
```

## Observed problems

### 1. "Buy 3, pay 2" gives away items too early

Promotion `{ kind: "multibuy", sku: "TASSE", buy: 3, pay: 2 }`.

- Cart with **2** cups: observed one cup free. Expected: no discount, the customer has not bought 3.
- Cart with **4** cups: observed two cups free. Expected: one cup free.

Expected rule: for every **complete** group of `buy` items of that product, `buy - pay` items are free.

### 2. Line amounts are rounded to 5 Rappen

3 chewing gums at CHF 0.99 each: the receipt line shows CHF 3.00 and the total is CHF 3.00.
Expected: the line shows CHF 2.97 (`lineCents` 297, `subtotalCents` 297) and the customer pays CHF 2.95.

Expected rule: line amounts, the subtotal and the discount are exact to the cent. Only the amount to pay, `totalCents`, is rounded to the nearest 5 Rappen.

### 3. Negative totals with large vouchers

A CHF 50 voucher (`kind: "fixed"`, `amountCents: 5000`) on a cart worth CHF 5.80 gives a total of **-CHF 44.20**.
Expected: the discount is capped at the subtotal (`discountCents` 580) and the customer pays CHF 0.00. The rest of the voucher is lost; that is intended.

### 4. VAT ignores the coupon

With a 10 % coupon on 4 cups at CHF 15.00 (standard rate), the customer pays CHF 54.00 but the receipt says "inkl. MWST 8.1% CHF 4.50", which is the VAT on CHF 60.00.
Expected: CHF 4.05.

Expected rule (confirmed by accounting):

- The discount (of any coupon kind) is split between the VAT rates in proportion to each rate's share of the subtotal. The reduced-rate share is rounded to the nearest cent (halves up); the standard-rate share is the rest of the discount.
- `vat[rate]` is the VAT contained in that rate's subtotal minus its share of the discount (`gross * rate / (100 + rate)`, rounded to the nearest cent). It is computed before the 5-Rappen rounding of the total.
- Without a coupon, VAT stays as it is today.

## Feature: minimum order value for coupons

Marketing wants coupons that are only valid from a certain order value. Any promotion may have an optional `minSubtotalCents`. When a coupon with this field is used and `subtotalCents` is **below** it:

- no discount is given (`discountCents` is 0), `couponCode` is still set on the receipt;
- the receipt carries `notice: "Coupon <code> requires a minimum order of <amount>"`, with the amount formatted like other amounts on the receipt, e.g. `"Coupon ZEHN50 requires a minimum order of CHF 50.00"`;
- `renderReceipt` prints the notice text as the last line of the receipt.

At or above the minimum the coupon works as usual. `notice` is absent (`undefined`) whenever there is nothing to report. An unknown coupon code still throws as today.
