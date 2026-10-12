import { describe, expect, test } from "bun:test";
import { OpeningHoursError, parseOpeningHours, type OpeningHoursErrorCode } from "../src/openingHours";

const closed = { Mo: [], Tu: [], We: [], Th: [], Fr: [], Sa: [], Su: [] };
const r = (from: string, to: string) => ({ from, to });

function failure(text: string): { code: OpeningHoursErrorCode; column: number } {
  try {
    parseOpeningHours(text);
  } catch (error) {
    expect(error).toBeInstanceOf(OpeningHoursError);
    const { code, column } = error as OpeningHoursError;
    return { code, column };
  }
  throw new Error(`expected "${text}" to be rejected`);
}

describe("valid opening hours", () => {
  test("a typical shop week", () => {
    expect(parseOpeningHours("Mo-Fr 08:00-12:00,13:30-18:30; Sa 09:00-16:00; Su off")).toEqual({
      Mo: [r("08:00", "12:00"), r("13:30", "18:30")],
      Tu: [r("08:00", "12:00"), r("13:30", "18:30")],
      We: [r("08:00", "12:00"), r("13:30", "18:30")],
      Th: [r("08:00", "12:00"), r("13:30", "18:30")],
      Fr: [r("08:00", "12:00"), r("13:30", "18:30")],
      Sa: [r("09:00", "16:00")],
      Su: [],
    });
  });

  test("days that no rule names are closed", () => {
    expect(parseOpeningHours("We 14:00-17:00")).toEqual({ ...closed, We: [r("14:00", "17:00")] });
  });

  test("ranges are sorted by start time", () => {
    expect(parseOpeningHours("Sa 13:00-17:00,09:00-12:00").Sa).toEqual([r("09:00", "12:00"), r("13:00", "17:00")]);
  });

  test("day lists and day ranges, including ranges that wrap around the week", () => {
    expect(parseOpeningHours("Fr-Mo 10:00-14:00")).toEqual({
      ...closed,
      Fr: [r("10:00", "14:00")],
      Sa: [r("10:00", "14:00")],
      Su: [r("10:00", "14:00")],
      Mo: [r("10:00", "14:00")],
    });
    expect(parseOpeningHours("Mo,We-Th 07:00-09:00")).toEqual({
      ...closed,
      Mo: [r("07:00", "09:00")],
      We: [r("07:00", "09:00")],
      Th: [r("07:00", "09:00")],
    });
    expect(parseOpeningHours("Mo-Mo 10:00-11:00")).toEqual({ ...closed, Mo: [r("10:00", "11:00")] });
  });

  test("a later rule replaces the hours of the days it names", () => {
    expect(parseOpeningHours("Mo-Su 08:00-20:00; Su off").Su).toEqual([]);
    const week = parseOpeningHours("Mo-Fr 08:00-12:00; We 14:00-18:00");
    expect(week.We).toEqual([r("14:00", "18:00")]);
    expect(week.Tu).toEqual([r("08:00", "12:00")]);
  });

  test("spaces between tokens carry no meaning", () => {
    expect(parseOpeningHours("  Mo , We  08:00 - 12:00 ;Sa off  ")).toEqual({
      ...closed,
      Mo: [r("08:00", "12:00")],
      We: [r("08:00", "12:00")],
    });
  });

  test("ranges may touch and may end at 24:00", () => {
    expect(parseOpeningHours("Th 08:00-12:00,12:00-24:00").Th).toEqual([r("08:00", "12:00"), r("12:00", "24:00")]);
  });
});

describe("rejected opening hours", () => {
  test("empty text", () => {
    expect(failure("")).toEqual({ code: "EMPTY", column: 1 });
    expect(failure("   ")).toEqual({ code: "EMPTY", column: 1 });
  });

  test("unknown days, including wrong case", () => {
    expect(failure("Mo-Fx 08:00-12:00")).toEqual({ code: "UNKNOWN_DAY", column: 4 });
    expect(failure("mo 08:00-12:00")).toEqual({ code: "UNKNOWN_DAY", column: 1 });
    expect(failure("Sa off; Sun 10:00-12:00")).toEqual({ code: "UNKNOWN_DAY", column: 9 });
  });

  test("invalid times", () => {
    expect(failure("Mo 8:00-12:00")).toEqual({ code: "INVALID_TIME", column: 4 });
    expect(failure("Mo 08:00-12:60")).toEqual({ code: "INVALID_TIME", column: 10 });
    expect(failure("Mo 10:00-25:00")).toEqual({ code: "INVALID_TIME", column: 10 });
    expect(failure("Mo 08:000-12:00")).toEqual({ code: "INVALID_TIME", column: 4 });
  });

  test("24:00 is only allowed as an end time", () => {
    expect(failure("Mo 24:00-24:00")).toEqual({ code: "INVALID_TIME", column: 4 });
    expect(failure("Mo 10:00-24:30")).toEqual({ code: "INVALID_TIME", column: 10 });
  });

  test("ranges must end after they start", () => {
    expect(failure("Tu 18:00-09:00")).toEqual({ code: "END_BEFORE_START", column: 4 });
    expect(failure("Tu 09:00-09:00")).toEqual({ code: "END_BEFORE_START", column: 4 });
  });

  test("overlapping ranges are reported at the later-written range", () => {
    expect(failure("We 08:00-12:00,11:00-13:00")).toEqual({ code: "OVERLAP", column: 16 });
    expect(failure("We 11:00-13:00,08:00-12:00")).toEqual({ code: "OVERLAP", column: 16 });
    expect(failure("We 08:00-18:00,10:00-11:00")).toEqual({ code: "OVERLAP", column: 16 });
  });

  test("a day named twice in one rule", () => {
    expect(failure("Mo-We,Tu 08:00-12:00")).toEqual({ code: "DUPLICATE_DAY", column: 7 });
    expect(failure("Tu,Mo-We 09:00-10:00")).toEqual({ code: "DUPLICATE_DAY", column: 4 });
    expect(failure("Sa-Mo,Su off")).toEqual({ code: "DUPLICATE_DAY", column: 7 });
  });

  test("text that ends too early", () => {
    expect(failure("Mo")).toEqual({ code: "UNEXPECTED", column: 3 });
    expect(failure("Mo 08:00-")).toEqual({ code: "UNEXPECTED", column: 10 });
    expect(failure("Mo off;")).toEqual({ code: "UNEXPECTED", column: 8 });
  });

  test("tokens that do not fit the format", () => {
    expect(failure("Mo 08:00 12:00")).toEqual({ code: "UNEXPECTED", column: 10 });
    expect(failure("Mo 08:00-12:00 Tu off")).toEqual({ code: "UNEXPECTED", column: 16 });
    expect(failure("Mo 08:00-12:00,Tu 09:00-10:00")).toEqual({ code: "UNEXPECTED", column: 16 });
    expect(failure("Mo Off")).toEqual({ code: "UNEXPECTED", column: 4 });
    expect(failure("Mo-Fr-Sa off")).toEqual({ code: "UNEXPECTED", column: 6 });
    expect(failure(";Mo off")).toEqual({ code: "UNEXPECTED", column: 1 });
    expect(failure("Mo 08:00-12:00;;Tu off")).toEqual({ code: "UNEXPECTED", column: 16 });
  });

  test("characters that belong to no token", () => {
    expect(failure("Mo 08:00-12:00!")).toEqual({ code: "UNEXPECTED", column: 15 });
    expect(failure("Mo\t08:00-12:00")).toEqual({ code: "UNEXPECTED", column: 3 });
  });

  test("columns count from the start of the whole text", () => {
    expect(failure("Mo-Fr 08:00-12:00; Sa 09:00-08:00")).toEqual({ code: "END_BEFORE_START", column: 23 });
  });

  test("the first problem from the left is reported", () => {
    expect(failure("Xx 25:00-10:00")).toEqual({ code: "UNKNOWN_DAY", column: 1 });
    expect(failure("Mo 12:00-10:00 @")).toEqual({ code: "END_BEFORE_START", column: 4 });
  });

  test("the message names the column", () => {
    try {
      parseOpeningHours("Mo-Fx 08:00-12:00");
      throw new Error("expected a failure");
    } catch (error) {
      expect((error as Error).message).toContain("(column 4)");
    }
  });
});
