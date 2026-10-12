import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import { impossible, impossibleYear } from './contract-wizard';
import { formatCurrency, formatDate } from './utils/format';

/** What the Liegenschaftsverwalter chooses in the first three steps of "Abrechnungen erstellen" */
export interface WizardSelection {
	periodStart: string;
	periodEnd: string;
	heatingProfileId: string;
	managementFeePercent: number;
	buildingIds: string[];
}

// Getters: read when shown, in the language of the request
const stepNames = [
	m.statements_step_period,
	m.statements_step_buildings,
	m.statements_step_settings,
	m.statements_step_preview,
	m.statements_step_create
];
export const statementSteps: string[] = Object.defineProperties(
	[],
	Object.fromEntries(stepNames.map((name, i) => [i, { get: () => name(), enumerable: true }]))
);

function periodErrors({ periodStart, periodEnd }: WizardSelection): Record<string, string> {
	if (!periodStart) return { periodStart: m.statements_error_period_start() };
	if (!periodEnd) return { periodEnd: m.statements_error_period_end() };
	if (impossible(periodStart)) return { periodStart: impossibleYear() };
	if (impossible(periodEnd)) return { periodEnd: impossibleYear() };
	if (periodEnd <= periodStart) return { periodEnd: m.statements_error_period_order() };
	return {};
}

function settingErrors({ heatingProfileId, managementFeePercent }: WizardSelection) {
	return {
		...(!heatingProfileId && { heatingProfileId: m.statements_error_heating_profile() }),
		// a rate emptied and restored from the draft is null, not 0 %
		...(!(Number.isFinite(managementFeePercent) && managementFeePercent >= 0) && {
			managementFeePercent: m.statements_error_fee()
		})
	};
}

/** Errors of the steps the user fills in (1–3), checked when going on */
export function selectionErrors(selection: WizardSelection, step: number): Record<string, string> {
	if (step === 1) return periodErrors(selection);
	if (step === 2 && selection.buildingIds.length === 0)
		return { buildings: m.statements_error_buildings() };
	if (step === 3) return settingErrors(selection);
	return {};
}

/** A cost category that may lack invoices, compared with the same dates one year earlier (backend check) */
export interface CategoryFinding {
	categoryId: string | null;
	categoryName: string;
	kind: 'stock' | 'tank' | 'missing' | 'gap' | 'new' | 'deviation';
	current: { count: number; total: number };
	previous: { count: number; total: number };
	missingParts: { start: string; end: string }[];
	changePercent: number | null;
}

export interface InvoiceCheck {
	buildingId: string;
	comparedWith: { start: string; end: string };
	hasComparison: boolean;
	findings: CategoryFinding[];
}

type Coverage = {
	buildingId: string;
	count: number;
	first: string | null;
	last: string | null;
	statements?: number; // already created for this period
	check?: InvoiceCheck;
};

const invoices = (count: number) =>
	count === 1 ? m.statements_invoices_one() : m.statements_invoices_many({ count });

// "a und b und c", as German said it
const joined = (parts: string[], and: (pair: { first: string; second: string }) => string) =>
	parts.reduce((first, second) => and({ first, second }));

// A whole calendar month, quarter or half-year by its name; null for other slices
function calendarName({ start, end }: { start: string; end: string }) {
	const from = new Date(`${start}T00:00:00Z`);
	const after = new Date(new Date(`${end}T00:00:00Z`).getTime() + 86_400_000);
	const months =
		(after.getUTCFullYear() - from.getUTCFullYear()) * 12 +
		after.getUTCMonth() -
		from.getUTCMonth();
	const month = from.getUTCMonth();
	if (from.getUTCDate() !== 1 || after.getUTCDate() !== 1 || month % months !== 0) return null;
	const names: Record<number, () => string> = {
		1: () =>
			m.statements_part_month({
				month: from.toLocaleDateString(`${getLocale()}-CH`, { month: 'long', timeZone: 'UTC' })
			}),
		3: () => m.statements_part_quarter({ number: month / 3 + 1 }),
		6: () => m.statements_part_half({ number: month / 6 + 1 })
	};
	return names[months]?.() ?? null;
}

// A slice of the period in words: a calendar month, quarter or half-year by its name, otherwise its dates
const partLabel = (slice: { start: string; end: string }) =>
	calendarName(slice) ??
	m.statements_part_dates({ start: formatDate(slice.start), end: formatDate(slice.end) });

function stockText(missingDays: { start: string }[], consumption: number) {
	if (!missingDays.length)
		return m.statements_finding_stock_negative({ amount: formatCurrency(-consumption) });
	const dates = joined(
		missingDays.map((day) => formatDate(day.start)),
		m.statements_stock_dates_and
	);
	const missing =
		missingDays.length > 1
			? m.statements_finding_stock_missing_many({ dates })
			: m.statements_finding_stock_missing_one({ dates });
	return `${missing} ${m.statements_finding_stock_tail()}`;
}

/** One finding of the check per category in plain words, with what to look at */
export function findingText({
	kind,
	current,
	previous,
	missingParts,
	changePercent
}: CategoryFinding): string {
	if (kind === 'stock') return stockText(missingParts, current.total);
	if (kind === 'missing')
		return m.statements_finding_missing({ amount: formatCurrency(previous.total) });
	if (kind === 'new') return m.statements_finding_new({ amount: formatCurrency(current.total) });
	if (kind === 'gap') {
		const gap = {
			parts: joined(missingParts.map(partLabel), m.statements_list_and),
			invoices: invoices(previous.count)
		};
		return missingParts.length === 1
			? m.statements_finding_gap_one(gap)
			: m.statements_finding_gap_many(gap);
	}
	const change = {
		amount: formatCurrency(current.total),
		percent: Math.abs(changePercent ?? 0),
		previous: formatCurrency(previous.total)
	};
	return (changePercent ?? 0) > 0
		? m.statements_finding_more(change)
		: m.statements_finding_less(change);
}

// TODO(fachlich prüfen, #65, #76): costs 15 % above the Akonto suggest raising it, 30 % below suggest missing invoices;
// a fixed-term contract has no termination date before its end, for the Akonto and new costs alike (review B, MR4-4, MR5-2)
const AKONTO_ABOVE = 0.15;
const AKONTO_BELOW = 0.3;

type AkontoRow = {
	totalCosts: number;
	totalAdvancePayments: number;
	rentalDays?: number;
	totalPeriodDays?: number;
	movedOut?: boolean; // the contract ends in the period: no Akonto left to raise
};

/** A statement whose costs are far from the Akonto paid: missing invoices, or an Akonto to raise */
export function akontoHint({
	totalCosts,
	totalAdvancePayments,
	rentalDays,
	totalPeriodDays,
	movedOut
}: AkontoRow) {
	if (!(totalAdvancePayments > 0)) return null;
	const change = (totalCosts - totalAdvancePayments) / totalAdvancePayments;
	const amount = formatCurrency(Math.abs(totalCosts - totalAdvancePayments));
	const percent = Math.round(Math.abs(change) * 100);
	const above = m.statements_akonto_above({ amount, percent });
	if (change > AKONTO_ABOVE && movedOut) return above;
	if (change > AKONTO_ABOVE) return `${above} ${m.statements_akonto_raise()}`;
	// part of the period: the months rented may carry little heating, low costs are no sign of missing invoices
	const wholePeriod = !rentalDays || !totalPeriodDays || rentalDays >= totalPeriodDays;
	if (change < -AKONTO_BELOW && wholePeriod) return m.statements_akonto_below({ amount, percent });
	return null;
}

const coverageText = ({ count, first, last }: Coverage) => {
	if (count === 0 || !first || !last) return m.statements_coverage_none();
	if (count === 1) return m.statements_coverage_one({ date: formatDate(first) });
	return m.statements_coverage_many({ count, first: formatDate(first), last: formatDate(last) });
};

// TODO(fachlich prüfen, #65): three months without any invoice at the start or end of the period is a hint, not a rule
const GAP_DAYS = 90;
const daysBetween = (from: string, to: string) =>
	(new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;

const partly = ({ count, first, last }: Coverage, { periodStart, periodEnd }: Period) =>
	count > 0 &&
	!!first &&
	!!last &&
	(daysBetween(periodStart, first) > GAP_DAYS || daysBetween(last, periodEnd) > GAP_DAYS);

type Period = { periodStart: string; periodEnd: string };

const lacksInvoices = (check?: InvoiceCheck) =>
	!!check?.findings.some((f) => f.kind === 'missing' || f.kind === 'gap' || f.kind === 'stock');

/** No invoices, invoices missing in a category or statements that exist already: going on needs a confirmation */
export const needsConfirmation = (coverage: Coverage[]) =>
	coverage.some((c) => c.count === 0 || (c.statements ?? 0) > 0 || lacksInvoices(c.check));

// Findings per category; missing invoices (not a hint on new or changed costs) need a confirmation
const categoryCheck = (check?: InvoiceCheck) => ({
	findings: check?.findings ?? [],
	incomplete: lacksInvoices(check),
	comparedWith: check?.hasComparison ? check.comparedWith : null
});

/** The invoices each building brings into the statements, in words; none or only part of the period is flagged */
export const invoiceRows = (
	coverage: Coverage[],
	buildings: { id: string; name: string }[],
	period: Period
) =>
	coverage.map((c) => ({
		buildingId: c.buildingId,
		name: buildings.find((b) => b.id === c.buildingId)?.name ?? '',
		text: coverageText(c),
		missing: c.count === 0,
		// With the year before to compare, the check per category replaces the look at start and end of the period
		partial: !c.check?.hasComparison && partly(c, period),
		existing: c.statements ?? 0,
		...categoryCheck(c.check)
	}));

/** A draft from this browser, without buildings or heating profiles deleted meanwhile */
export const restoredSelection = (
	draft: WizardSelection,
	known: { buildingIds: string[]; heatingProfileIds: string[] }
): WizardSelection => ({
	...draft,
	buildingIds: draft.buildingIds.filter((id) => known.buildingIds.includes(id)),
	heatingProfileId: known.heatingProfileIds.includes(draft.heatingProfileId)
		? draft.heatingProfileId
		: ''
});

/** The wizard with one building and one period chosen, opened on the settings (A-10) */
export const wizardLink = (building: string, start: string, end: string) =>
	`/statements/generate?building=${building}&start=${start}&end=${end}`;
