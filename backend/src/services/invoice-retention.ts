/**
 * #1410: until when an invoice must be kept, 10 years from the end of the Abrechnungsperiode it belongs to (product
 * owner 09.11.2026; legal basis in the delete confirmation, Fachreview 1410-1 M-1)
 */
import { daysAfter, swissToday } from './today';
import { FIRST_MONTH, month, type AccountingPeriodType } from './period-types';

type Dated = { invoiceDate: string; servicePeriodEnd: string | null };

// type: the building's, from a left join; every invoice has a building, and calendar is a building's default
export function keepUntil(type: AccountingPeriodType | null, invoice: Dated) {
	const day = invoice.servicePeriodEnd ?? invoice.invoiceDate;
	const [year, now] = day.split('-').map(Number);
	const first = FIRST_MONTH[type ?? 'calendar'];
	const end = daysAfter(`${(now >= first ? year : year - 1) + 1}-${month(first)}-01`, -1);
	return `${Number(end.slice(0, 4)) + 10}${end.slice(4)}`;
}

/** The end of the invoice's Aufbewahrungsfrist while it runs, the last day included; null once it has passed */
export function retention(type: AccountingPeriodType | null, invoice: Dated) {
	const until = keepUntil(type, invoice);
	return until >= swissToday() ? until : null;
}
