/**
 * The statement PDF's heating section: the heating profile's share and, for a tank, the consumption
 */

import { fill } from './pdf-format';
import { monthList, monthSum, noRunShare, ownProfileDays } from './pdf-cost-table';
import { COLORS, FONT, PAGE, amountLine, formatCurrency, formatDate, heading, type Page, type StatementPDFData } from './pdf-layout';

// the run's share; only for invoices without a Leistungszeitraum where a position has invoices with their own (#71),
// none where every position counts its invoices' own months (#509)
const heatingNoteKey = (data: StatementPDFData) =>
	!ownProfileDays(data) ? 'heatingNote' : noRunShare(data) ? 'heatingNoteOwn' : 'heatingNoteParts';

// The heating profile's share, with the months of a tenancy over part of the period
function heatingLines({ t, data }: Page) {
	if (!data.heating) return [];
	const key = heatingNoteKey(data);
	const { profile, percent, months } = data.heating;
	const shown = (Math.round(percent * 100) / 100).toFixed(2);
	const note = fill(t[key], { profile, percent: shown });
	const source = data.heating.source !== undefined ? [fill(t.heatingSource, { source: data.heating.source ?? t.heatingSourceOwn })] : [];
	if (key === 'heatingNoteOwn' || !months?.length || percent >= 100) return [note, ...source];
	return [note, fill(t.heatingMonths, { months: monthList(months, t) }) + periodSums(data.heating, shown, t), ...source];
}

// months that do not carry 100 % (a Heizprofil of 100 % ± 0.1, a statement under a year from before #1088, #1099):
// both sums, from the printed months (#229); since #232 the period's months and the division the share comes from
function periodSums({ months, periodPercent, periodMonths }: NonNullable<StatementPDFData['heating']>, shown: string, t: Record<string, string>) {
	if (periodPercent == null || periodPercent === 100) return '';
	const [tenant, period] = [monthSum(months!), periodPercent.toFixed(2)];
	return periodMonths
		? fill(t.heatingPeriodMonths, { tenant, months: monthList(periodMonths, t), period, percent: shown })
		: fill(t.heatingPeriodSums, { tenant, period });
}

// Heating profile, and for a tank the consumption: opening stock + invoices – closing stock (Art. 5 VMWG); kept on
// one page
export function heatingSection(page: Page, y: number) {
	const { doc, t, data } = page;
	if (!data.heating && !data.fuel) return y;
	const lines = heatingLines(page);
	const fuel = data.fuel;
	const amounts: [string, number][] = fuel
		? [
				[fill(t.fuelOpening, { date: formatDate(fuel.openingDate) }), fuel.opening],
				[fill(t.fuelInvoices, { category: fuel.category }), fuel.invoices],
				[fill(t.fuelClosing, { date: formatDate(fuel.closingDate) }), fuel.closing],
				[t.fuelTotal, fuel.total]
			]
		: [];
	const width = PAGE.right - PAGE.left;
	doc.font(FONT.regular).fontSize(9);
	const height =
		[...lines, fuel ? t.fuelIntro : ''].reduce((sum, line) => sum + doc.heightOfString(line, { width }) + 8, 0) +
		amounts.reduce((sum, [label]) => sum + Math.max(15, doc.heightOfString(label, { width: 340 }) + 4), 0);
	let top = heading(doc, t.heatingSection, y, height + 30);
	for (const line of lines) {
		doc.font(FONT.regular).fontSize(9).fillColor(COLORS.ink).text(line, PAGE.left, top, { width });
		top = doc.y + 8;
	}
	if (!fuel) return top + 10;
	doc.text(t.fuelIntro, PAGE.left, top, { width });
	top = doc.y + 6;
	amounts.forEach(([label, amount], i) => (top = amountLine(doc, label, formatCurrency(amount), top, i === amounts.length - 1)));
	return top + 12;
}
