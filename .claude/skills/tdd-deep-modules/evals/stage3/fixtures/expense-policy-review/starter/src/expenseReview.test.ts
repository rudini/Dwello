import { expect, test } from "bun:test";
import { ExpenseFileError } from "./expenseReview";

test("file errors are recognisable", () => {
  const error = new ExpenseFileError("Missing header");
  expect(error).toBeInstanceOf(Error);
  expect(error.name).toBe("ExpenseFileError");
  expect(error.message).toBe("Missing header");
});
