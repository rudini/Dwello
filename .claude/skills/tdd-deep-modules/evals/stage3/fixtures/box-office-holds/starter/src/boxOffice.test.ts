import { describe, expect, test } from "bun:test";
import { BoxOfficeError } from "./boxOffice";

describe("BoxOfficeError", () => {
  test("carries a machine-readable code", () => {
    const error = new BoxOfficeError("SOLD_OUT", "Section PARKETT is sold out");
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe("SOLD_OUT");
    expect(error.message).toBe("Section PARKETT is sold out");
  });
});
