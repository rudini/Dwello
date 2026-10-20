import { and, ilike, or, type Column } from 'drizzle-orm';

// Every word of the term is contained in one of the columns, so «Seepark B1» finds B1 in Seepark (#160)
export function everyWordIn(term: string, columns: Column[]) {
	const words = term.split(/\s+/).filter(Boolean);
	return and(...words.map((word) => or(...columns.map((column) => ilike(column, `%${word}%`)))));
}

// The cards name an apartment «Wohnung / Appartement / Appartamento / Apartment 3.02»: the word finds nothing (#160, #376)
const APARTMENT_WORDS = ['wohnung', 'appartement', 'appartamento', 'apartment'];
export const withoutApartmentWord = (term: string) =>
	term
		.split(/\s+/)
		.filter((word) => !APARTMENT_WORDS.includes(word.toLowerCase()))
		.join(' ');
