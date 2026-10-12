import { beforeEach, describe, expect, test } from "bun:test";
import { BoxOfficeError, createBoxOffice, type BoxOfficeErrorCode } from "../src/boxOffice";

const START = 1_700_000_000_000;
const MINUTE = 60_000;
let time = START;

function office() {
  return createBoxOffice({
    sections: [
      { id: "PARKETT", capacity: 10, priceCents: 4500 },
      { id: "BALKON", capacity: 5, priceCents: 2490 },
      { id: "LOGE", capacity: 20, priceCents: 1995 },
      { id: "STEH", capacity: 100, priceCents: 150 },
    ],
    holdMinutes: 15,
    maxTicketsPerCustomer: 6,
    now: () => time,
  });
}

function codeOf(action: () => unknown): BoxOfficeErrorCode | "no error" {
  try {
    action();
  } catch (error) {
    expect(error).toBeInstanceOf(BoxOfficeError);
    return (error as BoxOfficeError).code;
  }
  return "no error";
}

beforeEach(() => {
  time = START;
});

describe("availability and holds", () => {
  test("a fresh section offers its full capacity", () => {
    expect(office().available("PARKETT")).toBe(10);
  });

  test("a hold takes tickets and returns its details", () => {
    const box = office();
    const hold = box.hold("anna", "PARKETT", 3);
    expect(hold).toEqual({
      holdId: "H1",
      customerId: "anna",
      sectionId: "PARKETT",
      quantity: 3,
      expiresAt: START + 15 * MINUTE,
    });
    expect(box.available("PARKETT")).toBe(7);
    expect(box.available("BALKON")).toBe(5);
  });

  test("unknown sections are rejected", () => {
    const box = office();
    expect(codeOf(() => box.available("FOYER"))).toBe("UNKNOWN_SECTION");
    expect(codeOf(() => box.hold("anna", "FOYER", 1))).toBe("UNKNOWN_SECTION");
  });

  test("quantities must be whole numbers of at least one", () => {
    const box = office();
    expect(codeOf(() => box.hold("anna", "PARKETT", 0))).toBe("INVALID_QUANTITY");
    expect(codeOf(() => box.hold("anna", "PARKETT", -2))).toBe("INVALID_QUANTITY");
    expect(codeOf(() => box.hold("anna", "PARKETT", 1.5))).toBe("INVALID_QUANTITY");
    expect(box.available("PARKETT")).toBe(10);
  });

  test("a hold larger than what is left fails completely", () => {
    const box = office();
    box.hold("anna", "BALKON", 4);
    expect(codeOf(() => box.hold("beat", "BALKON", 2))).toBe("SOLD_OUT");
    expect(box.available("BALKON")).toBe(1);
    expect(box.hold("beat", "BALKON", 1).holdId).toBe("H2");
  });

  test("the customer limit counts holds and orders across all sections", () => {
    const box = office();
    box.confirm(box.hold("anna", "PARKETT", 2).holdId);
    box.hold("anna", "BALKON", 3);
    expect(codeOf(() => box.hold("anna", "STEH", 2))).toBe("CUSTOMER_LIMIT");
    expect(box.hold("anna", "STEH", 1).quantity).toBe(1);
    expect(box.hold("beat", "STEH", 6).quantity).toBe(6);
  });

  test("checks run in the documented order", () => {
    const box = office();
    expect(codeOf(() => box.hold("anna", "FOYER", 0))).toBe("UNKNOWN_SECTION");
    expect(codeOf(() => box.hold("anna", "BALKON", 7))).toBe("CUSTOMER_LIMIT");
    box.hold("beat", "BALKON", 5);
    expect(codeOf(() => box.hold("anna", "BALKON", 0))).toBe("INVALID_QUANTITY");
  });

  test("failed holds do not use up hold numbers", () => {
    const box = office();
    expect(codeOf(() => box.hold("anna", "BALKON", 9))).toBe("CUSTOMER_LIMIT");
    expect(box.hold("anna", "BALKON", 1).holdId).toBe("H1");
    expect(box.hold("beat", "BALKON", 1).holdId).toBe("H2");
  });
});

describe("expiry", () => {
  test("an unconfirmed hold frees its tickets exactly when it expires", () => {
    const box = office();
    box.hold("anna", "PARKETT", 4);
    time = START + 15 * MINUTE - 1;
    expect(box.available("PARKETT")).toBe(6);
    time = START + 15 * MINUTE;
    expect(box.available("PARKETT")).toBe(10);
  });

  test("expired holds no longer count towards the customer limit", () => {
    const box = office();
    box.hold("anna", "PARKETT", 6);
    expect(codeOf(() => box.hold("anna", "STEH", 1))).toBe("CUSTOMER_LIMIT");
    time = START + 20 * MINUTE;
    expect(box.hold("anna", "STEH", 6).expiresAt).toBe(START + 35 * MINUTE);
  });

  test("an expired hold cannot be confirmed", () => {
    const box = office();
    const { holdId } = box.hold("anna", "PARKETT", 2);
    time = START + 15 * MINUTE;
    expect(codeOf(() => box.confirm(holdId))).toBe("HOLD_EXPIRED");
  });
});

describe("confirming", () => {
  test("confirming turns a hold into an order and keeps the tickets taken", () => {
    const box = office();
    const { holdId } = box.hold("anna", "PARKETT", 2);
    time = START + 14 * MINUTE;
    expect(box.confirm(holdId)).toEqual({
      orderId: "O1",
      customerId: "anna",
      sectionId: "PARKETT",
      quantity: 2,
      totalCents: 9000,
    });
    time = START + 60 * MINUTE;
    expect(box.available("PARKETT")).toBe(8);
  });

  test("a hold can only be confirmed once and unknown holds are rejected", () => {
    const box = office();
    const { holdId } = box.hold("anna", "PARKETT", 2);
    box.confirm(holdId);
    expect(codeOf(() => box.confirm(holdId))).toBe("UNKNOWN_HOLD");
    expect(codeOf(() => box.confirm("H99"))).toBe("UNKNOWN_HOLD");
  });

  test("prices are rounded to 5 cents and groups of four or more get 10 percent off", () => {
    const box = office();
    expect(box.confirm(box.hold("a", "BALKON", 3).holdId).totalCents).toBe(7470);
    expect(box.confirm(box.hold("b", "BALKON", 2).holdId).totalCents).toBe(4980);
    expect(box.confirm(box.hold("c", "LOGE", 1).holdId).totalCents).toBe(1995);
    expect(box.confirm(box.hold("d", "LOGE", 3).holdId).totalCents).toBe(5985);
    expect(box.confirm(box.hold("e", "PARKETT", 4).holdId).totalCents).toBe(16200);
  });

  test("discounted amounts round to the nearest 5 cents with halves going up", () => {
    const box = office();
    const balkon = office();
    expect(balkon.confirm(balkon.hold("a", "BALKON", 4).holdId).totalCents).toBe(8965);
    expect(box.confirm(box.hold("a", "LOGE", 5).holdId).totalCents).toBe(8980);
    expect(box.confirm(box.hold("b", "LOGE", 6).holdId).totalCents).toBe(10775);
  });

  test("order numbers count up independently of hold numbers", () => {
    const box = office();
    const first = box.hold("anna", "PARKETT", 1);
    const second = box.hold("beat", "PARKETT", 1);
    expect(box.confirm(second.holdId).orderId).toBe("O1");
    expect(box.confirm(first.holdId).orderId).toBe("O2");
  });
});

describe("releasing", () => {
  test("releasing a hold returns its tickets once", () => {
    const box = office();
    const { holdId } = box.hold("anna", "BALKON", 5);
    box.release(holdId);
    expect(box.available("BALKON")).toBe(5);
    expect(codeOf(() => box.release(holdId))).toBe("UNKNOWN_HOLD");
    expect(codeOf(() => box.confirm(holdId))).toBe("UNKNOWN_HOLD");
    expect(codeOf(() => box.release("H42"))).toBe("UNKNOWN_HOLD");
  });

  test("releasing an expired hold is accepted without effect", () => {
    const box = office();
    const { holdId } = box.hold("anna", "BALKON", 2);
    time = START + 16 * MINUTE;
    expect(codeOf(() => box.release(holdId))).toBe("no error");
    expect(box.available("BALKON")).toBe(5);
  });

  test("a confirmed hold cannot be released", () => {
    const box = office();
    const { holdId } = box.hold("anna", "BALKON", 2);
    box.confirm(holdId);
    expect(codeOf(() => box.release(holdId))).toBe("UNKNOWN_HOLD");
    expect(box.available("BALKON")).toBe(3);
  });
});

describe("cancelling orders", () => {
  test("cancelling refunds the total minus 2 francs per ticket and frees the seats", () => {
    const box = office();
    const order = box.confirm(box.hold("anna", "PARKETT", 6).holdId);
    expect(codeOf(() => box.hold("anna", "STEH", 1))).toBe("CUSTOMER_LIMIT");
    expect(box.cancelOrder(order.orderId)).toBe(24300 - 1200);
    expect(box.available("PARKETT")).toBe(10);
    expect(box.hold("anna", "STEH", 6).quantity).toBe(6);
  });

  test("the refund never goes below zero", () => {
    const box = office();
    const order = box.confirm(box.hold("anna", "STEH", 4).holdId);
    expect(order.totalCents).toBe(540);
    expect(box.cancelOrder(order.orderId)).toBe(0);
  });

  test("an order can be cancelled only once", () => {
    const box = office();
    const order = box.confirm(box.hold("anna", "BALKON", 1).holdId);
    box.cancelOrder(order.orderId);
    expect(codeOf(() => box.cancelOrder(order.orderId))).toBe("UNKNOWN_ORDER");
    expect(codeOf(() => box.cancelOrder("O7"))).toBe("UNKNOWN_ORDER");
    expect(box.available("BALKON")).toBe(5);
  });
});
