export type BoxOfficeErrorCode =
  | "UNKNOWN_SECTION"
  | "INVALID_QUANTITY"
  | "SOLD_OUT"
  | "CUSTOMER_LIMIT"
  | "UNKNOWN_HOLD"
  | "HOLD_EXPIRED"
  | "UNKNOWN_ORDER";

export class BoxOfficeError extends Error {
  readonly code: BoxOfficeErrorCode;

  constructor(code: BoxOfficeErrorCode, message: string) {
    super(message);
    this.name = "BoxOfficeError";
    this.code = code;
  }
}

export interface SectionConfig {
  id: string;
  capacity: number;
  priceCents: number;
}

export interface BoxOfficeOptions {
  sections: SectionConfig[];
  holdMinutes: number;
  maxTicketsPerCustomer: number;
  /** Current time in epoch milliseconds. */
  now: () => number;
}

export interface Hold {
  holdId: string;
  customerId: string;
  sectionId: string;
  quantity: number;
  expiresAt: number;
}

export interface Order {
  orderId: string;
  customerId: string;
  sectionId: string;
  quantity: number;
  totalCents: number;
}

export interface BoxOffice {
  hold(customerId: string, sectionId: string, quantity: number): Hold;
  confirm(holdId: string): Order;
  release(holdId: string): void;
  cancelOrder(orderId: string): number;
  available(sectionId: string): number;
}

export function createBoxOffice(_options: BoxOfficeOptions): BoxOffice {
  throw new Error("Not implemented");
}
