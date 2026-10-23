import { formatDate } from './utils/format';

type Range = { start: string; end: string };

/** A range by its two days: after a change of the setting «2025» could also read as 2025/26 (persona Dr. Weber P-5) */
export const periodDays = ({ start, end }: Range) => `${formatDate(start)} – ${formatDate(end)}`;

/** A calendar year by its number, any other range by its two days */
export function periodName({ start, end }: Range) {
	const year = start.slice(0, 4);
	return start === `${year}-01-01` && end === `${year}-12-31` ? year : periodDays({ start, end });
}
