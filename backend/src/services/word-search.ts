import { and, ilike, or, type Column } from 'drizzle-orm';

// Every word of the term is contained in one of the columns, so «Seepark B1» finds B1 in Seepark (#160)
export function everyWordIn(term: string, columns: Column[]) {
	const words = term.split(/\s+/).filter(Boolean);
	return and(...words.map((word) => or(...columns.map((column) => ilike(column, `%${word}%`)))));
}
