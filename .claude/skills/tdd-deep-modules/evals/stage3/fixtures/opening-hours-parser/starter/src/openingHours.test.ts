import { expect, test } from "bun:test";
import { OpeningHoursError } from "./openingHours";

test("errors report the column in their message", () => {
  const error = new OpeningHoursError("UNKNOWN_DAY", 4, 'Unknown day "Fx"');
  expect(error).toBeInstanceOf(Error);
  expect(error.code).toBe("UNKNOWN_DAY");
  expect(error.column).toBe(4);
  expect(error.message).toBe('Unknown day "Fx" (column 4)');
});
