import { expect, test } from "bun:test";
import { OrderFormatError } from "./pickList";

test("format errors name the line", () => {
  const error = new OrderFormatError(7, "quantity must be positive");
  expect(error).toBeInstanceOf(Error);
  expect(error.line).toBe(7);
  expect(error.message).toBe("Line 7: quantity must be positive");
});
