export type Day = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";

export interface TimeRange {
  from: string;
  to: string;
}

export type WeeklyHours = Record<Day, TimeRange[]>;

export type OpeningHoursErrorCode =
  | "EMPTY"
  | "UNKNOWN_DAY"
  | "INVALID_TIME"
  | "END_BEFORE_START"
  | "OVERLAP"
  | "DUPLICATE_DAY"
  | "UNEXPECTED";

export class OpeningHoursError extends Error {
  readonly code: OpeningHoursErrorCode;
  readonly column: number;

  constructor(code: OpeningHoursErrorCode, column: number, description: string) {
    super(`${description} (column ${column})`);
    this.name = "OpeningHoursError";
    this.code = code;
    this.column = column;
  }
}

export function parseOpeningHours(_text: string): WeeklyHours {
  throw new Error("Not implemented");
}
