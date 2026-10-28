import { formatDate } from './utils/format';

type Range = { start: string; end: string };

/** A range by its two days: after a change of the setting «2025» could also read as 2025/26 (persona Dr. Weber P-5) */
export const periodDays = ({ start, end }: Range) => `${formatDate(start)} – ${formatDate(end)}`;

/** A calendar year by its number, any other range by its two days */
export function periodName({ start, end }: Range) {
	const year = start.slice(0, 4);
	return start === `${year}-01-01` && end === `${year}-12-31` ? year : periodDays({ start, end });
}

/** The period in the query names of the backend's routes: the one place the frontend spells them (Ä1, #912) */
export const periodQuery = ({ start, end }: Range) => ({ periodStart: start, periodEnd: end });

/** The period of a query in those names; a missing day stays empty */
export const periodOf = (query: URLSearchParams) =>
	periodQuery({ start: query.get('periodStart') ?? '', end: query.get('periodEnd') ?? '' });
