import { allocate } from "./allocation";
import { parseOrders } from "./orders";
import { walkingOrder } from "./route";

export interface StockLot {
  /** Bin code "A-03-2": aisle letter, two-digit rack, one-digit level. */
  bin: string;
  sku: string;
  qty: number;
  /** Best-before date "YYYY-MM-DD", or null for goods that do not expire. */
  expires: string | null;
}

export interface Pick {
  bin: string;
  sku: string;
  qty: number;
  orderId: string;
}

export interface Shortage {
  orderId: string;
  sku: string;
  missing: number;
}

export interface PickList {
  picks: Pick[];
  shortages: Shortage[];
}

export class OrderFormatError extends Error {
  readonly line: number;

  constructor(line: number, description: string) {
    super(`Line ${line}: ${description}`);
    this.name = "OrderFormatError";
    this.line = line;
  }
}

export function buildPickList(ordersText: string, stock: StockLot[]): PickList {
  const { picks, shortages } = allocate(parseOrders(ordersText), stock);
  return { picks: walkingOrder(picks), shortages };
}
