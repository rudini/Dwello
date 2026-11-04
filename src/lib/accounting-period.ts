import { m } from '$lib/paraglide/messages';
import { formatDate } from './utils/format';
import type { BuildingWithStats } from '../../backend/src/api/building';

type Range = { start: string; end: string };

/** A range by its two days: after a change of the setting «2025» could also read as 2025/26 (persona Dr. Weber P-5) */
const periodDays = ({ start, end }: Range) => `${formatDate(start)} – ${formatDate(end)}`;

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

/** #1088: a building's own Abrechnungsperiode, as the backend stores it */
export type AccountingPeriodType = BuildingWithStats['accountingPeriod'];

/** #1088: the Abrechnungsperioden a building can have, by their labels in the building form */
export const accountingPeriods = (): { value: AccountingPeriodType; label: string }[] => [
	{ value: 'calendar', label: m.buildings_period_calendar() },
	{ value: 'july-june', label: m.buildings_period_july() },
	{ value: 'november-october', label: m.buildings_period_november() }
];

/** #1098: the Tankbestand help, naming the last day of the building's own Abrechnungsperiode as the Stichtag */
export const fuelStockIntro = (type: AccountingPeriodType) =>
	({
		calendar: m.buildings_fuel_intro,
		'july-june': m.buildings_fuel_intro_july_june,
		'november-october': m.buildings_fuel_intro_november_october
	})[type]();

/** #1088 (Fachreview 1088-1 V-6): a building that bills another Abrechnungsperiode, with what to choose in step 1 */
export function otherPeriodText(type: AccountingPeriodType, building: string) {
	const text = {
		calendar: m.statements_building_other_period_calendar,
		'july-june': m.statements_building_other_period_july,
		'november-october': m.statements_building_other_period_november
	}[type];
	return text({ building });
}

/** Code review 1088-2 C-7: the older statements of a building that a chosen period overlaps, as the backend refuses it */
export const overlapText = (periods: Range[], building: string) =>
	m.backend_statement_period_overlaps({ building, periods: periods.map(periodDays).join(', ') });
