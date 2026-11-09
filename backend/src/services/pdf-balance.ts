/**
 * The statement PDF's balance: the box with what the tenant pays or gets back, and the lines from the costs to the Saldo
 */

import { fill, formatCHF, roundToRappen } from './pdf-format';
import { formatCurrency, formatDate, FONT, PAGE, COLORS, row, total, translations, type Doc, type Page, type StatementPDFData } from './pdf-layout';
import type { Language } from '../db/schema';

// Settled when sent: a Saldo of 0, or one below CHF 5 carried over to the next statement (#448), or sent under #94
// neither claimed nor paid out
function settledText(t: Record<string, string>, data: StatementPDFData) {
	if (data.balance === 0) return rounding(data) ? t.balancedRounded : t.balancedNote;
	// Fachreview 448-1 V-6: the reviewer's wording, without «Der Betrag» twice (product owner 2026-10-19)
	if (data.carried) return data.balance < 0 ? t.carriedRefund : t.carriedDue;
	return data.balance < 0 ? t.waivedRefund : t.waivedDue;
}
export const unpaid = (data: StatementPDFData) => data.balance === 0 || data.carried || data.waived;
// what the tenant still pays or gets back: the Saldo less the part payments (#1003), not rounded again to 5 Rappen
export const openOf = (data: StatementPDFData) => roundToRappen(data.balance - (data.paidSoFar ?? 0));

// #1003: after a part payment, the rest to pay or to get back; the tenant gave the IBAN for the first part already
function openText(t: Record<string, string>, balance: number, date: string | undefined) {
	if (balance < 0) return date ? fill(t.refundOpenBy, { date }) : t.refundOpenNoDate;
	return date ? fill(t.payOpenBy, { date }) : t.payOpenNoDate;
}

// What the balance asks the tenant to do: pay with the payment part, wait for the refund, or nothing (also the e-mail, #86)
export function balanceText(data: StatementPDFData, language: Language) {
	const t = translations[language];
	const date = data.paymentDeadline && formatDate(data.paymentDeadline);
	if (unpaid(data)) return settledText(t, data);
	if (data.paidDate) return fill(data.balance < 0 ? t.refundPaidOn : t.paidOn, { date: formatDate(data.paidDate) });
	if (data.paidSoFar) return openText(t, data.balance, date);
	if (data.balance < 0) return `${date ? fill(t.refundBy, { date }) : t.refundNoDate} ${t.refundAccount}`;
	return date ? fill(t.payBy, { date }) : t.payNoDate;
}

// The Saldo is rounded to 5 Rappen. Read top to bottom: the amount before rounding, its rounding as «+ 0.02» or
// «– 0.02» (seen from the amount shown, so a refund that grows gets +), the Saldo; only a real rounding is shown
const priorOf = (data: StatementPDFData) => data.replaces?.priorPayments ?? 0;
const carryOf = (data: StatementPDFData) => data.carryOver?.amount ?? 0;
export const unrounded = (data: StatementPDFData) => roundToRappen(data.totalCosts - data.totalAdvancePayments - priorOf(data) + carryOf(data));
// Rows from the subtotal to the Saldo, kept on one page
export const totalRows = (data: StatementPDFData, t: Record<string, string>) =>
	(rounding(data) ? 6 : 4) + (priorLine(data, t) ? 1 : 0) + (offsetLine(data, t) ? 1 : 0) + (data.carryOver ? 1 : 0) + (data.advanceLines?.length ?? 0);
// «Bereits verrechnet mit NK-…»: the replaced Saldo the next statement counts as its Übertrag (#448)
export function offsetLine(data: StatementPDFData, t: Record<string, string>) {
	const offset = offsetOf(data);
	if (!offset) return null;
	const numbers = data.replaces!.offsetWith!.map((o) => o.statementNumber).join(', ');
	return {
		label: fill(t.offsetWith, { numbers }),
		short: `${offset > 0 ? '–' : '+'} ${t.offsetShort} ${formatCurrency(offset)}`,
		amount: `${offset > 0 ? '–' : '+'} ${formatCHF(Math.abs(offset))}`
	};
}
// «Übertrag aus Abrechnung NK-…: CHF 3.00»: a Nachzahlung carried over adds, a refund subtracts (#448)
export function carryLine(data: StatementPDFData, t: Record<string, string>) {
	if (!data.carryOver) return null;
	const { statementNumber, amount } = data.carryOver;
	const sign = amount > 0 ? '+' : '–';
	return {
		label: fill(t.carryOver, { number: statementNumber, amount: formatCHF(Math.abs(amount)) }),
		short: `${sign} ${t.carryOverShort} ${formatCurrency(amount)}`,
		amount: `${sign} ${formatCHF(Math.abs(amount))}`
	};
}
export const priorRow = (doc: Doc, prior: ReturnType<typeof priorLine>, top: number) => (prior ? row(doc, total(prior.label, prior.amount), top) : top);
// «Bereits bezahlt auf NK-… und NK-…», or what the landlord already refunded
const offsetOf = (data: StatementPDFData) => roundToRappen((data.replaces?.offsetWith ?? []).reduce((sum, o) => sum + o.amount, 0));
export function priorLine(data: StatementPDFData, t: Record<string, string>) {
	const prior = roundToRappen(priorOf(data) - offsetOf(data));
	if (!prior) return null;
	const paidOn = data.replaces!.paidOn;
	const numbers = paidOn.length > 1 ? `${paidOn.slice(0, -1).join(', ')} ${t.and} ${paidOn.at(-1)}` : paidOn.join('');
	return {
		label: fill(prior > 0 ? t.priorPaid : t.priorRefunded, { numbers }),
		short: `${prior > 0 ? '–' : '+'} ${prior > 0 ? t.priorPaidShort : t.priorRefundedShort} ${formatCurrency(prior)}`,
		amount: `${prior > 0 ? '–' : '+'} ${formatCHF(Math.abs(prior))}`
	};
}
export function rounding(data: StatementPDFData) {
	const difference = roundToRappen(Math.abs(data.balance) - Math.abs(unrounded(data)));
	return Math.abs(data.balance - unrounded(data)) < 0.05 ? difference : 0;
}
export const labelOf = (balance: number, t: Record<string, string>) => (balance === 0 ? t.balanced : balance < 0 ? t.refund : t.amountDue);
export const signed = (amount: number) => `${amount > 0 ? '+' : '–'} ${formatCHF(Math.abs(amount))}`;

const balanceLabel = ({ t, data }: Page) =>
	data.paidSoFar ? (data.balance < 0 ? t.openRefund : t.openAmount) : labelOf(data.balance, t);
// #1003: «Betrag der Abrechnung … – Bereits bezahlt …»; on a corrected statement its own part (Fachreview 1003-1 V-9)
function paidSoFarText({ t, data }: Page) {
	if (!data.paidSoFar) return '';
	const line = data.balance < 0 ? t.refundedSoFarLine : data.replaces ? t.paidSoFarOwnLine : t.paidSoFarLine;
	return fill(line, { amount: formatCurrency(Math.abs(data.balance)), paid: formatCurrency(Math.abs(data.paidSoFar)) });
}

// The result first: what the tenant pays or gets back, and how it comes about
export function balanceBox(page: Page, y: number) {
	const { doc, t, data } = page;
	const width = PAGE.right - PAGE.left;
	const what = [balanceText(page.data, page.language), paidSoFarText(page)].filter(Boolean).join('\n');
	const rounded = rounding(data) ? `, ${t.roundedNote}` : '';
	const prior = priorLine(data, t);
	const offset = offsetLine(data, t);
	const carry = carryLine(data, t);
	const parts = [prior, offset, carry].map((line) => (line ? ` ${line.short}` : '')).join('');
	const how = `${t.yourCosts} ${formatCurrency(data.totalCosts)} – ${t.advancePayments} ${formatCurrency(data.totalAdvancePayments)}${parts}${rounded}`;
	doc.font(FONT.regular).fontSize(9);
	const height = 46 + doc.heightOfString(what, { width: width - 24 }) + doc.heightOfString(how, { width: width - 24 });
	doc.lineWidth(1.5).strokeColor(COLORS.ink).rect(PAGE.left, y, width, height).stroke();
	doc
		.font(FONT.bold)
		.fontSize(13)
		.text(balanceLabel(page), PAGE.left + 12, y + 12)
		.text(formatCurrency(data.paidSoFar ? Math.abs(openOf(data)) : data.balance), PAGE.left + 12, y + 12, { width: width - 24, align: 'right' });
	doc
		.font(FONT.regular)
		.fontSize(9)
		.text(what, PAGE.left + 12, y + 34, { width: width - 24 })
		.fillColor(COLORS.muted)
		.text(how, { width: width - 24 })
		.fillColor(COLORS.ink);
	return y + height + 20;
}
