import { ExpenseFileError } from "./expenseReview";

export const REQUIRED_COLUMNS = ["date", "employee", "category", "amount", "currency", "receipt"] as const;
export type Column = (typeof REQUIRED_COLUMNS)[number];

export type CsvRow =
  | { line: number; ok: true; values: Record<Column, string> }
  | { line: number; ok: false };

function splitFields(text: string): string[] {
  const fields: string[] = [];
  let i = 0;
  for (;;) {
    while (text[i] === " " || text[i] === "\t") i++;
    let value = "";
    if (text[i] === '"') {
      i++;
      while (i < text.length) {
        if (text[i] === '"' && text[i + 1] === '"') {
          value += '"';
          i += 2;
        } else if (text[i] === '"') {
          i++;
          break;
        } else {
          value += text[i++];
        }
      }
      while (i < text.length && text[i] !== ",") i++;
    } else {
      const end = text.indexOf(",", i);
      value = text.slice(i, end < 0 ? text.length : end).trim();
      i = end < 0 ? text.length : end;
    }
    fields.push(value);
    if (i >= text.length) return fields;
    i++; // skip the comma
  }
}

/** Reads the CSV into rows keyed by the required columns, keeping physical line numbers. */
export function readCsv(csv: string): CsvRow[] {
  const lines = csv.split(/\r?\n/).map((text, index) => ({ text, line: index + 1 }));
  const content = lines.filter((l) => l.text.trim() !== "");
  const [header, ...data] = content;
  if (!header) throw new ExpenseFileError("Missing header");

  const names = splitFields(header.text).map((n) => n.trim().toLowerCase());
  const positions = {} as Record<Column, number>;
  for (const column of REQUIRED_COLUMNS) {
    const position = names.indexOf(column);
    if (position < 0) throw new ExpenseFileError(`Missing column: ${column}`);
    positions[column] = position;
  }

  return data.map(({ text, line }) => {
    const fields = splitFields(text);
    if (fields.length !== names.length) return { line, ok: false };
    const values = {} as Record<Column, string>;
    for (const column of REQUIRED_COLUMNS) values[column] = fields[positions[column]];
    return { line, ok: true, values };
  });
}
