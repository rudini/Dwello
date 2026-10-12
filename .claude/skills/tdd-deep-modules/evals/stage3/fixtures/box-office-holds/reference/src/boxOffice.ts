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

const MINUTE_MS = 60_000;
const GROUP_MIN_TICKETS = 4;
const GROUP_DISCOUNT_PERCENT = 10;
const CANCELLATION_FEE_PER_TICKET = 200;

function roundToFiveCents(cents: number): number {
  return Math.floor((cents + 2.5) / 5) * 5;
}

function priceOf(quantity: number, priceCents: number): number {
  const gross = quantity * priceCents;
  const discounted =
    quantity >= GROUP_MIN_TICKETS ? (gross * (100 - GROUP_DISCOUNT_PERCENT)) / 100 : gross;
  return roundToFiveCents(discounted);
}

interface Booking {
  customerId: string;
  sectionId: string;
  quantity: number;
}

type HoldRecord = Hold & { open: boolean };
type OrderRecord = Order & { cancelled: boolean };

export function createBoxOffice(options: BoxOfficeOptions): BoxOffice {
  const sections = new Map(options.sections.map((s) => [s.id, s]));
  const holds = new Map<string, HoldRecord>();
  const orders = new Map<string, OrderRecord>();
  let holdCount = 0;
  let orderCount = 0;

  const isExpired = (hold: Hold) => options.now() >= hold.expiresAt;

  function bookings(): Booking[] {
    const activeHolds = [...holds.values()].filter((h) => h.open && !isExpired(h));
    const activeOrders = [...orders.values()].filter((o) => !o.cancelled);
    return [...activeHolds, ...activeOrders];
  }

  function ticketsWhere(match: (b: Booking) => boolean): number {
    return bookings()
      .filter(match)
      .reduce((sum, b) => sum + b.quantity, 0);
  }

  function section(sectionId: string): SectionConfig {
    const found = sections.get(sectionId);
    if (!found) throw new BoxOfficeError("UNKNOWN_SECTION", `Unknown section ${sectionId}`);
    return found;
  }

  function available(sectionId: string): number {
    return section(sectionId).capacity - ticketsWhere((b) => b.sectionId === sectionId);
  }

  function openHold(holdId: string): HoldRecord {
    const hold = holds.get(holdId);
    if (!hold || !hold.open) throw new BoxOfficeError("UNKNOWN_HOLD", `Unknown hold ${holdId}`);
    return hold;
  }

  return {
    available,

    hold(customerId, sectionId, quantity) {
      section(sectionId);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new BoxOfficeError("INVALID_QUANTITY", `Invalid quantity ${quantity}`);
      }
      const owned = ticketsWhere((b) => b.customerId === customerId);
      if (owned + quantity > options.maxTicketsPerCustomer) {
        throw new BoxOfficeError("CUSTOMER_LIMIT", `Customer ${customerId} would exceed the ticket limit`);
      }
      if (quantity > available(sectionId)) {
        throw new BoxOfficeError("SOLD_OUT", `Not enough tickets left in ${sectionId}`);
      }
      holdCount += 1;
      const hold: HoldRecord = {
        holdId: `H${holdCount}`,
        customerId,
        sectionId,
        quantity,
        expiresAt: options.now() + options.holdMinutes * MINUTE_MS,
        open: true,
      };
      holds.set(hold.holdId, hold);
      const { open: _open, ...publicHold } = hold;
      return publicHold;
    },

    confirm(holdId) {
      const hold = openHold(holdId);
      if (isExpired(hold)) throw new BoxOfficeError("HOLD_EXPIRED", `Hold ${holdId} has expired`);
      hold.open = false;
      orderCount += 1;
      const order: OrderRecord = {
        orderId: `O${orderCount}`,
        customerId: hold.customerId,
        sectionId: hold.sectionId,
        quantity: hold.quantity,
        totalCents: priceOf(hold.quantity, section(hold.sectionId).priceCents),
        cancelled: false,
      };
      orders.set(order.orderId, order);
      const { cancelled: _cancelled, ...publicOrder } = order;
      return publicOrder;
    },

    release(holdId) {
      openHold(holdId).open = false;
    },

    cancelOrder(orderId) {
      const order = orders.get(orderId);
      if (!order || order.cancelled) {
        throw new BoxOfficeError("UNKNOWN_ORDER", `Unknown order ${orderId}`);
      }
      order.cancelled = true;
      return Math.max(0, order.totalCents - CANCELLATION_FEE_PER_TICKET * order.quantity);
    },
  };
}
