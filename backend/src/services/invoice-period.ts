/**
 * Which invoices fall into an Abrechnungsperiode, and each one's part in it (#241, #454)
 */
import { and, gte, isNull, lte, or } from 'drizzle-orm';
import { invoices } from '../db/schema';
import { roundToRappen } from './pdf-format';
import type { InPeriod } from '../api/invoice';

const DAY = 86_400_000;
const daysFrom = (start: string, end: string) => (Date.parse(end) - Date.parse(start)) / DAY + 1;

/**
 * An invoice's part in a period: the days of its Leistungszeitraum within the period (without one, the whole period
 * when the Rechnungsdatum lies in it) and the amount of those days
 */
export function inPeriod(
	invoice: { amount: string; servicePeriodStart: string | null; servicePeriodEnd: string | null },
	periodStart: string,
	periodEnd: string
): InPeriod {
	const amount = parseFloat(invoice.amount);
	if (!invoice.servicePeriodStart || !invoice.servicePeriodEnd) return { start: periodStart, end: periodEnd, amount, noPeriod: true as const };
	const start = invoice.servicePeriodStart > periodStart ? invoice.servicePeriodStart : periodStart;
	const end = invoice.servicePeriodEnd < periodEnd ? invoice.servicePeriodEnd : periodEnd;
	const part = { start, end, amount: roundToRappen((amount * daysFrom(start, end)) / daysFrom(invoice.servicePeriodStart, invoice.servicePeriodEnd)) };
	// a Leistungszeitraum reaching beyond the period: the receipt's dates and amount, so the tenant finds it (#241)
	const beyond = start !== invoice.servicePeriodStart || end !== invoice.servicePeriodEnd;
	return beyond ? { ...part, whole: { start: invoice.servicePeriodStart, end: invoice.servicePeriodEnd, amount } } : part;
}

// Rule 1: in the period by its Leistungszeitraum, without one by its Rechnungsdatum
export const inPeriodOf = (periodStart: string, periodEnd: string) =>
	or(
		and(isNull(invoices.servicePeriodStart), gte(invoices.invoiceDate, periodStart), lte(invoices.invoiceDate, periodEnd)),
		and(lte(invoices.servicePeriodStart, periodEnd), gte(invoices.servicePeriodEnd, periodStart))
	);
