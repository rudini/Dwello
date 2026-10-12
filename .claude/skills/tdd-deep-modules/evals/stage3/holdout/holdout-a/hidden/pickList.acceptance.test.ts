import { describe, expect, test } from "bun:test";
import { buildPickList, OrderFormatError, type StockLot } from "../src/pickList";

const stock: StockLot[] = [
  { bin: "A-01-1", sku: "OLIVE-500", qty: 4, expires: "2027-03-01" },
  { bin: "C-07-2", sku: "OLIVE-500", qty: 10, expires: "2026-12-01" },
  { bin: "B-02-1", sku: "PASTA-1KG", qty: 5, expires: null },
  { bin: "A-05-3", sku: "PASTA-1KG", qty: 2, expires: "2027-06-30" },
  { bin: "B-09-1", sku: "SALT", qty: 3, expires: null },
  { bin: "B-04-2", sku: "SALT", qty: 3, expires: null },
  { bin: "D-01-1", sku: "RICE", qty: 1, expires: "2027-01-01" },
];

const orders = (...lines: string[]) => lines.join("\n");

function errorLine(text: string): number {
  try {
    buildPickList(text, stock);
  } catch (error) {
    expect(error).toBeInstanceOf(OrderFormatError);
    return (error as OrderFormatError).line;
  }
  throw new Error("expected an OrderFormatError");
}

describe("allocation", () => {
  test("an item is taken from the lot with the earliest best-before date", () => {
    expect(buildPickList(orders("ORDER 1001", "  OLIVE-500 x3"), stock)).toEqual({
      picks: [{ bin: "C-07-2", sku: "OLIVE-500", qty: 3, orderId: "1001" }],
      shortages: [],
    });
  });

  test("an item spreads over several lots", () => {
    expect(buildPickList(orders("ORDER 1001", "OLIVE-500 x12"), stock).picks).toEqual([
      { bin: "A-01-1", sku: "OLIVE-500", qty: 2, orderId: "1001" },
      { bin: "C-07-2", sku: "OLIVE-500", qty: 10, orderId: "1001" },
    ]);
  });

  test("lots without a best-before date are used last", () => {
    const { picks } = buildPickList(orders("ORDER 7", "PASTA-1KG x3"), stock);
    expect(picks.map((p) => [p.bin, p.qty])).toEqual([
      ["A-05-3", 2],
      ["B-02-1", 1],
    ]);
  });

  test("equal dates are broken by bin code", () => {
    const { picks } = buildPickList(orders("ORDER 7", "SALT x4"), stock);
    expect(picks.map((p) => [p.bin, p.qty])).toEqual([
      ["B-04-2", 3],
      ["B-09-1", 1],
    ]);
  });

  test("missing stock is picked as far as possible and reported", () => {
    expect(buildPickList(orders("ORDER 9", "RICE x3", "SAFFRON x2"), stock)).toEqual({
      picks: [{ bin: "D-01-1", sku: "RICE", qty: 1, orderId: "9" }],
      shortages: [
        { orderId: "9", sku: "RICE", missing: 2 },
        { orderId: "9", sku: "SAFFRON", missing: 2 },
      ],
    });
  });

  test("priority orders are served first, then the rest in text order", () => {
    const text = orders("ORDER 1", "OLIVE-500 x8", "ORDER 2 !", "OLIVE-500 x8", "ORDER 3", "OLIVE-500 x1", "ORDER 4  !", "RICE x1");
    const { picks, shortages } = buildPickList(text, stock);
    expect(picks.filter((p) => p.orderId === "2")).toEqual([{ bin: "C-07-2", sku: "OLIVE-500", qty: 8, orderId: "2" }]);
    expect(picks.filter((p) => p.orderId === "1").map((p) => [p.bin, p.qty])).toEqual([
      ["A-01-1", 4],
      ["C-07-2", 2],
    ]);
    expect(shortages).toEqual([
      { orderId: "1", sku: "OLIVE-500", missing: 2 },
      { orderId: "3", sku: "OLIVE-500", missing: 1 },
    ]);
    expect(picks.find((p) => p.orderId === "4")?.qty).toBe(1);
  });

  test("repeated SKUs in one order are added up at their first position", () => {
    const { picks, shortages } = buildPickList(orders("ORDER 5", "RICE x1", "SALT x7", "RICE x1"), stock);
    expect(shortages).toEqual([
      { orderId: "5", sku: "RICE", missing: 1 },
      { orderId: "5", sku: "SALT", missing: 1 },
    ]);
    expect(picks.filter((p) => p.sku === "RICE")).toEqual([{ bin: "D-01-1", sku: "RICE", qty: 1, orderId: "5" }]);
  });

  test("the stock passed in is left untouched", () => {
    const before = structuredClone(stock);
    buildPickList(orders("ORDER 1", "OLIVE-500 x14", "PASTA-1KG x7"), stock);
    expect(stock).toEqual(before);
  });
});

describe("walking order", () => {
  const lots: StockLot[] = [
    { bin: "A-02-1", sku: "S1", qty: 1, expires: null },
    { bin: "A-10-1", sku: "S2", qty: 1, expires: null },
    { bin: "B-01-1", sku: "S3", qty: 1, expires: null },
    { bin: "B-12-1", sku: "S4", qty: 1, expires: null },
    { bin: "C-03-2", sku: "S5", qty: 1, expires: null },
    { bin: "C-03-1", sku: "S6", qty: 1, expires: null },
    { bin: "C-11-1", sku: "S7", qty: 1, expires: null },
    { bin: "D-04-1", sku: "S8", qty: 1, expires: null },
    { bin: "D-09-1", sku: "S9", qty: 1, expires: null },
  ];
  const all = orders("ORDER 1", ...["S9", "S1", "S5", "S3", "S7", "S2", "S6", "S8", "S4"].map((s) => `${s} x1`));

  test("aisles alphabetically, racks in a serpentine, levels upwards", () => {
    expect(buildPickList(all, lots).picks.map((p) => p.bin)).toEqual([
      "A-02-1",
      "A-10-1",
      "B-12-1",
      "B-01-1",
      "C-03-1",
      "C-03-2",
      "C-11-1",
      "D-09-1",
      "D-04-1",
    ]);
  });

  test("only aisles with picks count for the serpentine", () => {
    const text = orders("ORDER 1", "S1 x1", "S2 x1", "S5 x1", "S7 x1");
    expect(buildPickList(text, lots).picks.map((p) => p.bin)).toEqual(["A-02-1", "A-10-1", "C-11-1", "C-03-2"]);
  });

  test("picks at the same bin keep their allocation order", () => {
    const shared: StockLot[] = [
      { bin: "A-01-1", sku: "TEA", qty: 5, expires: null },
      { bin: "A-01-1", sku: "COCOA", qty: 5, expires: null },
    ];
    const text = orders("ORDER 1", "TEA x1", "ORDER 2 !", "COCOA x1", "ORDER 3", "TEA x1");
    expect(buildPickList(text, shared).picks.map((p) => `${p.orderId}:${p.sku}`)).toEqual(["2:COCOA", "1:TEA", "3:TEA"]);
  });
});

describe("orders text", () => {
  test("comments, blank lines, indentation and CRLF are accepted", () => {
    const text = ["# export 2026-10-12", "", "ORDER A-17", "   # olives first", "\tOLIVE-500   x2  ", ""].join("\r\n");
    expect(buildPickList(text, stock).picks).toEqual([{ bin: "C-07-2", sku: "OLIVE-500", qty: 2, orderId: "A-17" }]);
  });

  test("an item before the first order", () => {
    expect(errorLine(orders("# header", "OLIVE-500 x1", "ORDER 1", "RICE x1"))).toBe(2);
  });

  test("an order id used twice", () => {
    expect(errorLine(orders("ORDER 1", "RICE x1", "", "ORDER 1", "SALT x1"))).toBe(4);
  });

  test("an order without items", () => {
    expect(errorLine(orders("ORDER 1", "# nothing", "ORDER 2", "RICE x1"))).toBe(1);
    expect(errorLine(orders("ORDER 1", "RICE x1", "ORDER 2", ""))).toBe(3);
  });

  test("lines that match neither form", () => {
    expect(errorLine(orders("ORDER 1", "RICE x0"))).toBe(2);
    expect(errorLine(orders("ORDER 1", "RICE x1", "SALT x03"))).toBe(3);
    expect(errorLine(orders("ORDER 1", "rice x1"))).toBe(2);
    expect(errorLine(orders("ORDER 1", "RICE 2"))).toBe(2);
    expect(errorLine(orders("ORDER 1", "RICEx2"))).toBe(2);
    expect(errorLine(orders("ORDER 7!", "RICE x1"))).toBe(1);
    expect(errorLine(orders("ORDER", "RICE x1"))).toBe(1);
  });
});
