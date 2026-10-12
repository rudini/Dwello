import { expect, test } from "bun:test";
import { BoardError } from "./board";

test("board errors carry a code", () => {
  const error = new BoardError("WIP_LIMIT", "Column Review is full");
  expect(error).toBeInstanceOf(Error);
  expect(error.code).toBe("WIP_LIMIT");
});
