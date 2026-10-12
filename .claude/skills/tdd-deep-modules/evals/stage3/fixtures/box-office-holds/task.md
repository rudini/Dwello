# Box office: ticket holds, orders and cancellations

Our venue sells tickets for a single event in a few seating sections. When a customer starts checkout, the tickets are put **on hold** so nobody else can buy them while the customer enters payment details. A hold expires after a configurable number of minutes unless it is confirmed. Confirmed holds become **orders**; orders can be cancelled for a partial refund.

Please implement the box office logic behind the existing stub.

## Entry point

`src/boxOffice.ts` (the stub already contains the types and the error class; keep them as they are):

```ts
export type BoxOfficeErrorCode =
  | "UNKNOWN_SECTION" | "INVALID_QUANTITY" | "SOLD_OUT" | "CUSTOMER_LIMIT"
  | "UNKNOWN_HOLD" | "HOLD_EXPIRED" | "UNKNOWN_ORDER";

export class BoxOfficeError extends Error {
  readonly code: BoxOfficeErrorCode;
  constructor(code: BoxOfficeErrorCode, message: string);
}

export interface SectionConfig { id: string; capacity: number; priceCents: number }

export interface BoxOfficeOptions {
  sections: SectionConfig[];
  holdMinutes: number;
  maxTicketsPerCustomer: number;
  now: () => number; // current time in epoch milliseconds
}

export interface Hold { holdId: string; customerId: string; sectionId: string; quantity: number; expiresAt: number }
export interface Order { orderId: string; customerId: string; sectionId: string; quantity: number; totalCents: number }

export interface BoxOffice {
  hold(customerId: string, sectionId: string, quantity: number): Hold;
  confirm(holdId: string): Order;
  release(holdId: string): void;
  cancelOrder(orderId: string): number;
  available(sectionId: string): number;
}

export function createBoxOffice(options: BoxOfficeOptions): BoxOffice;
```

All failures are thrown as `BoxOfficeError` with the `code` named below (the message text is free). A failed call changes nothing.

The box office must read the time through `options.now()` whenever it needs it; time moves between calls.

## Rules

### Availability

`available(sectionId)` returns the section's capacity minus the tickets in **active** holds of that section minus the tickets in **non-cancelled** orders of that section. Unknown section: `UNKNOWN_SECTION`.

A hold is active from its creation until it is confirmed, released or expired. A hold is **expired** as soon as `now() >= expiresAt`; expired holds stop counting automatically, no explicit clean-up call is needed.

### Placing a hold

`hold(customerId, sectionId, quantity)` checks, in this order:

1. The section exists, otherwise `UNKNOWN_SECTION`.
2. `quantity` is a whole number of at least 1, otherwise `INVALID_QUANTITY`.
3. The customer's tickets in active holds plus non-cancelled orders, **across all sections**, plus `quantity` do not exceed `maxTicketsPerCustomer`, otherwise `CUSTOMER_LIMIT`.
4. `quantity` does not exceed `available(sectionId)`, otherwise `SOLD_OUT`. There are no partial holds.

On success it returns the hold. `holdId` values are `"H1"`, `"H2"`, ... in the order holds are successfully created (failed attempts do not use up a number). `expiresAt` is `now() + holdMinutes * 60_000`.

### Confirming a hold

`confirm(holdId)`:

- unknown id, or a hold that was already confirmed or released: `UNKNOWN_HOLD`;
- expired hold: `HOLD_EXPIRED`;
- otherwise the hold ends and an order is created with the same customer, section and quantity. `orderId` values are `"O1"`, `"O2"`, ... in creation order. The tickets stay taken.

`totalCents` is `quantity * priceCents`. An order of **4 or more tickets** gets a 10 % group discount on that amount. The resulting amount is rounded to the nearest multiple of 5 cents (Swiss "Rappen" rounding; exact halves round up). Rounding also applies without discount.

### Releasing a hold

`release(holdId)` ends an active hold and makes its tickets available again. Releasing an expired hold succeeds without effect. An unknown id or a hold that was already confirmed or released: `UNKNOWN_HOLD`.

### Cancelling an order

`cancelOrder(orderId)` cancels a non-cancelled order and returns the refund in cents: `totalCents` minus a cancellation fee of 200 cents per ticket, but never less than 0. The tickets become available again and no longer count towards the customer's limit. Unknown or already cancelled order: `UNKNOWN_ORDER`.
