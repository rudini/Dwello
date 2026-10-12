# Morning pick list for the warehouse

Every morning the shop exports the open orders as a small text file. The warehouse needs one pick list for the whole batch: which bin to take how many of which article for which order, in the order a picker walks through the warehouse. Stock is allocated so that goods with the earliest best-before date leave first. If there is not enough stock, the list reports what is missing.

## Entry point

`src/pickList.ts` (the stub already contains the types and the error class; keep them as they are):

```ts
export interface StockLot { bin: string; sku: string; qty: number; expires: string | null }
export interface Pick { bin: string; sku: string; qty: number; orderId: string }
export interface Shortage { orderId: string; sku: string; missing: number }
export interface PickList { picks: Pick[]; shortages: Shortage[] }

export class OrderFormatError extends Error {
  readonly line: number; // 1-based line number in the orders text
  constructor(line: number, description: string);
}

export function buildPickList(ordersText: string, stock: StockLot[]): PickList;
```

`buildPickList` must not modify the `stock` array or its objects.

## Orders text

```
# export 2026-10-12 06:00
ORDER 1001
  OLIVE-500 x3
  PASTA-1KG x1
ORDER 1002 !
  OLIVE-500 x2
```

- Each line is trimmed. Empty lines and lines starting with `#` are ignored (but count for line numbers).
- `ORDER <id>` starts an order; `<id>` consists of letters, digits and `-`. An optional ` !` after the id (separated by at least one space) marks a **priority** order.
- Item lines have the form `<sku> x<qty>`: the SKU consists of uppercase letters, digits and `-`; the quantity is a positive whole number without leading zeros. Spaces between SKU and `x<qty>`: one or more.
- If the same SKU appears more than once in an order, the quantities are added up (the item keeps the position of its first appearance).

Problems are thrown as `OrderFormatError` with the line number of the offending line; the first problem from the top is reported:

- an item line before the first `ORDER` line;
- an `ORDER` line whose id was already used;
- an `ORDER` without any item lines (reported at its `ORDER` line);
- any other line that matches neither form (e.g. `x0`, `x03`, lowercase SKU, missing `x`).

## Allocation

1. Priority orders are served first, in the order they appear in the text; then all other orders, in text order.
2. Within an order, items are served in the order of their (first) appearance.
3. An item takes stock from the lots of its SKU that still have stock left, **earliest `expires` first**; lots with `expires: null` come after all dated lots; ties are broken by bin code (plain string comparison). Stock taken by an earlier item or order is no longer available to later ones.
4. If the lots do not cover the item, everything that is available is still picked and a shortage `{ orderId, sku, missing }` is reported. Shortages are listed in the order the items are served.

Each lot an item takes from yields one pick with the quantity taken from that lot.

## Walking order of the picks

Bin codes look like `A-03-2`: aisle `A`, rack `03`, level `2`. Pickers walk the warehouse in a serpentine:

- aisles are visited in alphabetical order; only aisles that contain at least one pick count;
- in the 1st, 3rd, 5th, ... visited aisle racks are walked in ascending order, in the 2nd, 4th, ... visited aisle in descending order;
- within a rack, levels are visited in ascending order;
- several picks at the same bin keep the order in which they were allocated.

`picks` is returned in this walking order.
