import { beforeEach, describe, expect, test } from "bun:test";
import { BoardError, createBoard, type BoardErrorCode, type ColumnConfig } from "../src/board";

let time = 0;
const COLUMNS: ColumnConfig[] = [{ name: "Backlog" }, { name: "Doing", wipLimit: 2 }, { name: "Review", wipLimit: 1 }, { name: "Done" }];

function board(columns: ColumnConfig[] = COLUMNS) {
  return createBoard({ columns, now: () => time });
}

function codeOf(action: () => unknown): BoardErrorCode | "no error" {
  try {
    action();
  } catch (error) {
    expect(error).toBeInstanceOf(BoardError);
    return (error as BoardError).code;
  }
  return "no error";
}

function snapshot(b: ReturnType<typeof board>) {
  return COLUMNS.map((c) => b.cardsIn(c.name));
}

beforeEach(() => {
  time = 1_000;
});

describe("cards and columns", () => {
  test("new cards arrive at the end of the first column", () => {
    const b = board();
    expect(b.addCard("Printer im 2. Stock")).toBe("C1");
    expect(b.addCard("VPN für Lea")).toBe("C2");
    expect(snapshot(b)).toEqual([["C1", "C2"], [], [], []]);
  });

  test("a card needs a title", () => {
    const b = board();
    expect(codeOf(() => b.addCard("   "))).toBe("EMPTY_TITLE");
    expect(b.addCard("Laptop")).toBe("C1");
  });

  test("the first column's WIP limit applies to new cards", () => {
    const b = board([{ name: "Inbox", wipLimit: 1 }, { name: "Done" }]);
    b.addCard("a");
    expect(codeOf(() => b.addCard("b"))).toBe("WIP_LIMIT");
    b.move("C1", "Done");
    expect(b.addCard("b")).toBe("C2");
  });

  test("moved cards go to the end of the target column", () => {
    const b = board();
    b.addCard("a");
    b.addCard("b");
    b.addCard("c");
    b.move("C2", "Doing");
    b.move("C1", "Doing");
    expect(snapshot(b)).toEqual([["C3"], ["C2", "C1"], [], []]);
    b.move("C2", "Review");
    b.move("C2", "Doing");
    expect(b.cardsIn("Doing")).toEqual(["C1", "C2"]);
  });

  test("cards move forward one column at a time but may go back any distance", () => {
    const b = board();
    b.addCard("a");
    expect(codeOf(() => b.move("C1", "Review"))).toBe("SKIP_NOT_ALLOWED");
    b.move("C1", "Doing");
    b.move("C1", "Review");
    b.move("C1", "Done");
    b.move("C1", "Backlog");
    expect(snapshot(b)).toEqual([["C1"], [], [], []]);
  });

  test("WIP limits count blocked cards too", () => {
    const b = board();
    for (const t of ["a", "b", "c"]) b.addCard(t);
    b.move("C1", "Doing");
    b.move("C2", "Doing");
    b.block("C1", "waiting for supplier");
    expect(codeOf(() => b.move("C3", "Doing"))).toBe("WIP_LIMIT");
    expect(snapshot(b)).toEqual([["C3"], ["C1", "C2"], [], []]);
    b.move("C2", "Review");
    b.move("C3", "Doing");
    expect(b.cardsIn("Doing")).toEqual(["C1", "C3"]);
  });

  test("blocked cards cannot move until unblocked", () => {
    const b = board();
    b.addCard("a");
    b.block("C1", "question to customer");
    expect(codeOf(() => b.move("C1", "Doing"))).toBe("BLOCKED");
    b.unblock("C1");
    b.move("C1", "Doing");
    expect(b.cardsIn("Doing")).toEqual(["C1"]);
  });

  test("move checks run in the documented order", () => {
    const b = board();
    b.addCard("a");
    b.addCard("b");
    b.move("C2", "Doing");
    b.move("C2", "Review");
    expect(codeOf(() => b.move("C9", "Nowhere"))).toBe("UNKNOWN_CARD");
    expect(codeOf(() => b.move("C1", "Nowhere"))).toBe("UNKNOWN_COLUMN");
    b.block("C1", "x");
    expect(codeOf(() => b.move("C1", "Backlog"))).toBe("SAME_COLUMN");
    expect(codeOf(() => b.move("C1", "Review"))).toBe("BLOCKED");
    b.unblock("C1");
    expect(codeOf(() => b.move("C1", "Review"))).toBe("SKIP_NOT_ALLOWED");
    b.move("C1", "Doing");
    expect(codeOf(() => b.move("C1", "Review"))).toBe("WIP_LIMIT");
    expect(snapshot(b)).toEqual([[], ["C1"], ["C2"], []]);
  });

  test("blocking errors", () => {
    const b = board();
    b.addCard("a");
    expect(codeOf(() => b.unblock("C1"))).toBe("NOT_BLOCKED");
    b.block("C1", "x");
    expect(codeOf(() => b.block("C1", "y"))).toBe("ALREADY_BLOCKED");
    expect(codeOf(() => b.block("C7", "y"))).toBe("UNKNOWN_CARD");
    expect(codeOf(() => b.unblock("C7"))).toBe("UNKNOWN_CARD");
    expect(codeOf(() => b.cardsIn("Archive"))).toBe("UNKNOWN_COLUMN");
  });
});

describe("cycle time", () => {
  function walkToDone(b: ReturnType<typeof board>, id: string, times: number[]) {
    const targets = ["Doing", "Review", "Done"];
    targets.forEach((column, i) => {
      time = times[i];
      b.move(id, column);
    });
  }

  test("is null until the card is done, and for unknown cards an error", () => {
    const b = board();
    b.addCard("a");
    expect(b.cycleTime("C1")).toBeNull();
    time = 2_000;
    b.move("C1", "Doing");
    expect(b.cycleTime("C1")).toBeNull();
    expect(codeOf(() => b.cycleTime("C5"))).toBe("UNKNOWN_CARD");
  });

  test("runs from leaving the first column to arriving in the last", () => {
    const b = board();
    b.addCard("a");
    walkToDone(b, "C1", [2_000, 3_000, 5_000]);
    time = 9_000;
    expect(b.cycleTime("C1")).toEqual({ totalMs: 3_000, blockedMs: 0 });
  });

  test("counts only the blocked time between start and finish", () => {
    const b = board();
    b.addCard("a");
    time = 1_200;
    b.block("C1", "not yet clear");
    time = 1_500;
    b.unblock("C1");
    time = 2_000;
    b.move("C1", "Doing");
    time = 2_500;
    b.block("C1", "waiting");
    time = 2_800;
    b.unblock("C1");
    time = 3_000;
    b.move("C1", "Review");
    time = 3_100;
    b.block("C1", "reviewer ill");
    time = 3_600;
    b.unblock("C1");
    time = 4_000;
    b.move("C1", "Done");
    time = 4_500;
    b.block("C1", "reopened?");
    time = 6_000;
    expect(b.cycleTime("C1")).toEqual({ totalMs: 2_000, blockedMs: 800 });
  });

  test("a card taken back out of done has no cycle time until it returns", () => {
    const b = board();
    b.addCard("a");
    walkToDone(b, "C1", [2_000, 3_000, 4_000]);
    time = 5_000;
    b.move("C1", "Backlog");
    expect(b.cycleTime("C1")).toBeNull();
    walkToDone(b, "C1", [6_000, 7_000, 10_000]);
    expect(b.cycleTime("C1")).toEqual({ totalMs: 8_000, blockedMs: 0 });
  });
});
