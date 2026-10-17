import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import { impossible, impossibleYear } from './contract-form';
import { formatCurrency, formatDate, isFeeRate } from './utils/format';

/** What the Liegenschaftsverwalter chooses in the first three steps of "Abrechnungen erstellen" */
export interface WizardSelection {
	periodStart: string;
	periodEnd: string;
	heatingProfileId: string;
	managementFeePercent: number;
	buildingIds: string[];
}

/** The drafts a run created, among others of the same period: in its building when it had only one */
export function draftsLink({ periodStart, periodEnd, buildingIds }: WizardSelection): string {
	const params = new URLSearchParams({ status: 'draft', periodStart, periodEnd });
	if (buildingIds.length === 1) params.set('building', buildingIds[0]);
	return `/statements?${params}`;
}

/** The PDFs of the statements a run created, as one ZIP named after the period (#356) */
export const zipLink = (ids: string[], { periodStart, periodEnd }: WizardSelection) =>
	`/statements/zip?${new URLSearchParams({ ids: ids.join(','), periodStart, periodEnd })}`;

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
		...(!isFeeRate(managementFeePercent) && {
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
	kind: 'stock' | 'tank' | 'consumption' | 'missing' | 'gap' | 'new' | 'deviation';
	current: { count: number; total: number };
	previous: { count: number; total: number };
	missingParts: { start: string; end: string }[];
	changePercent: number | null;
	partialCount?: number; // invoices whose Leistungszeitraum reaches beyond the period
}

/** An invoice without Leistungszeitraum the preview names: dated shortly after the period, or counted in full */
export interface HintedInvoice {
	id: string;
	billingEntityName: string;
	description: string;
	invoiceDate: string;
	amount: string;
}

export interface InvoiceCheck {
	buildingId: string;
	comparedWith: { start: string; end: string };
	hasComparison: boolean;
	findings: CategoryFinding[];
	lateInvoices?: HintedInvoice[];
	invoicesWithoutServicePeriod?: HintedInvoice[];
}

/** An existing statement of the run's period that misses invoices or was made with other settings (#132) */
export interface ChangedStatement {
	id: string;
	statementNumber: string;
	tenantName: string;
	outdated: boolean; // a draft that misses invoices of its period as they are now (#96)
	profile: { used: string; run: string } | null;
	profileEdited: string | null; // its Heizprofil, edited after it was created
	fee: { used: number; now: number; source: 'run' | 'contract' | 'none' } | null;
}

type Coverage = {
	buildingId: string;
	count: number;
	first: string | null;
	last: string | null;
	statements?: number; // already created for this period
	partlyBilled?: number; // contracts whose statements leave days of the period unbilled
	check?: InvoiceCheck;
	changed?: ChangedStatement[];
	fixedTerm?: boolean; // the run bills a running befristeter Mietvertrag here (#76)
};

const invoices = (count: number) =>
	count === 1 ? m.statements_invoices_one() : m.statements_invoices_many({ count });

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
		1: () => from.toLocaleDateString(`${getLocale()}-CH`, { month: 'long', timeZone: 'UTC' }),
		3: () => m.statements_part_quarter({ number: month / 3 + 1 }),
		6: () => m.statements_part_half({ number: month / 6 + 1 })
	};
	return names[months]?.() ?? null;
}

// A slice of the period in words: a calendar month, quarter or half-year by its name, otherwise its dates
const partLabel = (slice: { start: string; end: string }) =>
	calendarName(slice) ??
	m.statements_part_dates({ start: formatDate(slice.start), end: formatDate(slice.end) });

function stockText(missingDays: { start: string }[]) {
	// "a und am b"
	const dates = missingDays
		.map((day) => formatDate(day.start))
		.reduce((first, second) => m.statements_stock_dates_and({ first, second }));
	const missing =
		missingDays.length > 1
			? m.statements_finding_stock_missing_many({ dates })
			: m.statements_finding_stock_missing_one({ dates });
	return `${missing} ${m.statements_finding_stock_tail()}`;
}

// Lower costs without a gap: an invoice whose Leistungszeitraum reaches beyond the period counts only its days
const partialNote = (count = 0) =>
	count === 0
		? ''
		: ` ${count === 1 ? m.statements_finding_partial_one() : m.statements_finding_partial_many({ count })}`;

/** One finding of the check per category in plain words, with what to look at; fixedTerm: the building bills a running befristeter Mietvertrag (#76) */
export const findingText = (finding: CategoryFinding, fixedTerm = false) =>
	`${findingBody(finding, fixedTerm)}${finding.kind === 'gap' || finding.kind === 'deviation' ? partialNote(finding.partialCount) : ''}`;

function findingBody(
	{ kind, current, previous, missingParts, changePercent }: CategoryFinding,
	fixedTerm: boolean
): string {
	if (kind === 'stock') return stockText(missingParts);
	// a hint on the readings: a negative consumption, or one far from the year before (#73)
	if (kind === 'consumption' && changePercent === null)
		return m.statements_finding_stock_negative({ amount: formatCurrency(-current.total) });
	if (kind === 'missing')
		return m.statements_finding_missing({ amount: formatCurrency(previous.total) });
	if (kind === 'new') return newCostsText(current.total, fixedTerm);
	if (kind === 'gap') {
		const gap = {
			parts: new Intl.ListFormat(`${getLocale()}-CH`).format(missingParts.map(partLabel)),
			invoices: invoices(previous.count)
		};
		return missingParts.length === 1
			? m.statements_finding_gap_one(gap)
			: m.statements_finding_gap_many(gap);
	}
	return changeText(kind === 'consumption', current.total, previous.total, changePercent ?? 0);
}

// The category is the building's: the unbefristete contracts keep the Kündigungstermin, a befristeter waits for its end
const newCostsText = (total: number, fixedTerm: boolean) =>
	m.statements_finding_new({
		amount: formatCurrency(total),
		fixedTerm: fixedTerm ? ` ${m.statements_finding_new_fixed_term()}` : ''
	});

// Costs, or the consumption of the Tankbestand (#73), far from the year before
function changeText(consumption: boolean, total: number, previous: number, percent: number) {
	const change = {
		amount: formatCurrency(total),
		percent: Math.abs(percent),
		previous: formatCurrency(previous)
	};
	const [more, less] = consumption
		? [m.statements_finding_consumption_more, m.statements_finding_consumption_less]
		: [m.statements_finding_more, m.statements_finding_less];
	return percent > 0 ? more(change) : less(change);
}

// Costs more than 15 % above the Akonto suggest raising it, more than 30 % below suggest missing invoices: UX choices, hints only (#65)
const AKONTO_ABOVE = 0.15;
const AKONTO_BELOW = 0.3;

type AkontoRow = {
	totalCosts: number;
	totalAdvancePayments: number;
	rentalDays?: number;
	totalPeriodDays?: number;
	movedOut?: boolean; // the contract ends in the period: no Akonto left to raise
	fixedTerm?: boolean; // befristet, its end not reached: no Kündigungstermin before it (#76)
};

/** A statement whose costs are far from the Akonto paid: missing invoices, or an Akonto to raise */
export function akontoHint({
	totalCosts,
	totalAdvancePayments,
	rentalDays,
	totalPeriodDays,
	movedOut,
	fixedTerm
}: AkontoRow) {
	if (!(totalAdvancePayments > 0)) return null;
	const change = (totalCosts - totalAdvancePayments) / totalAdvancePayments;
	const amount = formatCurrency(Math.abs(totalCosts - totalAdvancePayments));
	const percent = Math.round(Math.abs(change) * 100);
	const above = m.statements_akonto_above({ amount, percent });
	if (change > AKONTO_ABOVE && movedOut) return above;
	// #76, #388: a befristeter Mietvertrag raises only after its end, unless agreed; a raise still needs the form
	if (change > AKONTO_ABOVE)
		return `${above} ${fixedTerm ? m.statements_akonto_raise_fixed_term() : m.statements_akonto_raise()}`;
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

const lacksInvoices = (check?: InvoiceCheck) =>
	!!check?.findings.some((f) => f.kind === 'missing' || f.kind === 'gap' || f.kind === 'stock');

/** No invoices, invoices missing in a category or statements that leave days unbilled: going on needs a confirmation;
 *  a contract whose statement covers its days gets no new one, which alone is no finding (#251) */
export const needsConfirmation = (coverage: Coverage[]) =>
	coverage.some((c) => c.count === 0 || (c.partlyBilled ?? 0) > 0 || lacksInvoices(c.check));

// Findings per category; missing invoices (not a hint on new or changed costs) need a confirmation
const categoryCheck = (check?: InvoiceCheck) => ({
	findings: check?.findings ?? [],
	lateInvoices: check?.lateInvoices ?? [],
	invoicesWithoutServicePeriod: check?.invoicesWithoutServicePeriod ?? [],
	incomplete: lacksInvoices(check),
	comparedWith: check?.hasComparison ? check.comparedWith : null
});

/** The invoices each building brings into the statements, in words; a building without any is flagged */
export const invoiceRows = (coverage: Coverage[], buildings: { id: string; name: string }[]) =>
	coverage.map((c) => ({
		buildingId: c.buildingId,
		name: buildings.find((b) => b.id === c.buildingId)?.name ?? '',
		text: coverageText(c),
		missing: c.count === 0,
		existing: c.statements ?? 0,
		changed: c.changed ?? [],
		partlyBilled: c.partlyBilled ?? 0,
		fixedTerm: !!c.fixedTerm,
		...categoryCheck(c.check)
	}));

/** A draft from this browser, without buildings or heating profiles deleted meanwhile, and what it lost */
export const restoredSelection = (
	draft: WizardSelection,
	known: { buildingIds: string[]; heatingProfileIds: string[] }
) => {
	const buildingIds = draft.buildingIds.filter((id) => known.buildingIds.includes(id));
	const heatingProfileId = known.heatingProfileIds.includes(draft.heatingProfileId)
		? draft.heatingProfileId
		: '';
	return {
		selection: { ...draft, buildingIds, heatingProfileId },
		dropped: {
			buildings: draft.buildingIds.length - buildingIds.length,
			heatingProfile: heatingProfileId !== draft.heatingProfileId
		}
	};
};

// a step by its number and name, both from the list of steps (code review C-12, C-13)
const step = (name: (typeof stepNames)[number]) => ({
	number: stepNames.indexOf(name) + 1,
	step: name()
});

const feeNotes = {
	run: m.statements_existing_fee_run,
	contract: m.statements_existing_fee_contract,
	none: m.statements_existing_fee_none
};

/** What changed since an existing statement was made, or what it does differently from the run, in words (#132) */
export const changedNotes = ({ outdated, profile, profileEdited, fee }: ChangedStatement) =>
	[
		outdated && m.statements_existing_outdated(),
		profile && m.statements_existing_profile(profile),
		profileEdited && m.statements_existing_profile_edited({ profile: profileEdited }),
		fee && feeNotes[fee.source](fee)
	].filter(Boolean) as string[];

/** Where the run can choose the settings of the existing statements, when it differs from them in one it chooses */
export const sameSettingsNote = (changed: ChangedStatement[]) =>
	changed.some((s) => s.profile || s.fee?.source === 'run')
		? m.statements_existing_same_settings(step(m.statements_step_settings))
		: null;

/** The step a restored draft opens in: the one it was left in, at most the step before the preview (the server
 *  calculates it anew), or the first step that no longer holds; a building gone meanwhile is checked in step 2 */
export function restoredStep(
	saved: number | undefined,
	selection: WizardSelection,
	dropped: { buildings: number }
) {
	const target = Math.min(saved ?? 1, 3);
	const invalid = [1, 2].find(
		(n) =>
			n < target &&
			(Object.keys(selectionErrors(selection, n)).length > 0 || (n === 2 && dropped.buildings > 0))
	);
	return invalid ?? target;
}

/** What the restored draft named and is gone meanwhile, in words for the draft notice */
export const droppedNotes = (dropped: { buildings: number; heatingProfile: boolean }) => {
	const buildings = step(m.statements_step_buildings);
	return [
		dropped.buildings > 0 &&
			(dropped.buildings === 1
				? m.statements_draft_dropped_building_one(buildings)
				: m.statements_draft_dropped_building_many({ count: dropped.buildings, ...buildings })),
		dropped.heatingProfile &&
			m.statements_draft_dropped_heating_profile(step(m.statements_step_settings))
	].filter((note) => note !== false);
};

/** The wizard with one building and one period chosen, opened on the settings (A-10) */
export const wizardLink = (building: string, start: string, end: string) =>
	`/statements/generate?building=${building}&start=${start}&end=${end}`;
