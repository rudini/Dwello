import { IMPOSSIBLE, impossible } from './contract-wizard';
import { formatCurrency, formatDate } from './utils/format';

/** What the Liegenschaftsverwalter chooses in the first three steps of "Abrechnungen erstellen" */
export interface WizardSelection {
	periodStart: string;
	periodEnd: string;
	heatingProfileId: string;
	managementFeePercent: number;
	managementFeeDistributionKeyId: string;
	buildingIds: string[];
}

export const statementSteps = [
	'Abrechnungsperiode',
	'Gebäude',
	'Heizprofil und Verwaltungspauschale',
	'Vorschau',
	'Erstellen'
];

function periodErrors({ periodStart, periodEnd }: WizardSelection): Record<string, string> {
	if (!periodStart) return { periodStart: 'Bitte wählen Sie den Beginn der Abrechnungsperiode.' };
	if (!periodEnd) return { periodEnd: 'Bitte wählen Sie das Ende der Abrechnungsperiode.' };
	if (impossible(periodStart)) return { periodStart: IMPOSSIBLE };
	if (impossible(periodEnd)) return { periodEnd: IMPOSSIBLE };
	if (periodEnd <= periodStart)
		return { periodEnd: 'Das Ende muss nach dem Beginn der Abrechnungsperiode liegen.' };
	return {};
}

function settingErrors({ heatingProfileId, managementFeePercent }: WizardSelection) {
	return {
		...(!heatingProfileId && { heatingProfileId: 'Bitte wählen Sie ein Heizprofil.' }),
		...(!(managementFeePercent >= 0) && {
			managementFeePercent: 'Bitte geben Sie einen Prozentsatz ab 0 ein, zum Beispiel 3.'
		})
	};
}

/** Errors of the steps the user fills in (1–3), checked when going on */
export function selectionErrors(selection: WizardSelection, step: number): Record<string, string> {
	if (step === 1) return periodErrors(selection);
	if (step === 2 && selection.buildingIds.length === 0)
		return { buildings: 'Bitte wählen Sie mindestens ein Gebäude.' };
	if (step === 3) return settingErrors(selection);
	return {};
}

/** A cost category that may lack invoices, compared with the same dates one year earlier (backend check) */
export interface CategoryFinding {
	categoryId: string | null;
	categoryName: string;
	kind: 'missing' | 'gap' | 'deviation';
	current: { count: number; total: number };
	previous: { count: number; total: number };
	missingParts: string[];
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

const invoices = (count: number) => (count === 1 ? '1 Rechnung' : `${count} Rechnungen`);

/** One finding of the check per category in plain words, with what to look at */
export function findingText({ kind, current, previous, missingParts, changePercent }: CategoryFinding): string {
	if (kind === 'missing')
		return `Keine Rechnung erfasst. Im Vorjahr: ${invoices(previous.count)} über ${formatCurrency(previous.total)}.`;
	if (kind === 'gap') {
		const parts = missingParts.join(' und ');
		const what = missingParts.length === 1 ? `Rechnung für ${parts} fehlt` : `Rechnungen für ${parts} fehlen`;
		return `${what}. Im Vorjahr: ${invoices(previous.count)}.`;
	}
	const direction = (changePercent ?? 0) > 0 ? 'mehr' : 'weniger';
	return `${formatCurrency(current.total)}, ${Math.abs(changePercent ?? 0)} % ${direction} als im Vorjahr (${formatCurrency(previous.total)}). Prüfen Sie Betrag und Rechnungsdatum.`;
}

// TODO(fachlich prüfen): costs more than 30 % above or below the Akonto of the tenant's own rental days are worth a look
const AKONTO_SHARE = 0.3;

/** A statement whose costs are far from the Akonto paid: missing invoices, or an Akonto to adjust */
export function akontoHint({ totalCosts, totalAdvancePayments }: { totalCosts: number; totalAdvancePayments: number }) {
	if (!(totalAdvancePayments > 0)) return null;
	const change = (totalCosts - totalAdvancePayments) / totalAdvancePayments;
	if (Math.abs(change) <= AKONTO_SHARE) return null;
	const percent = Math.round(Math.abs(change) * 100);
	return change < 0
		? `Kosten ${percent} % unter dem Akonto. Fehlen Rechnungen?`
		: `Kosten ${percent} % über dem Akonto. Prüfen Sie, ob das Akonto angepasst werden soll.`;
}

const coverageText = ({ count, first, last }: Coverage) => {
	if (count === 0 || !first || !last) return 'Keine Rechnungen erfasst';
	if (count === 1) return `1 Rechnung vom ${formatDate(first)}`;
	return `${count} Rechnungen vom ${formatDate(first)} bis ${formatDate(last)}`;
};

// TODO(fachlich prüfen): three months without any invoice at the start or end of the period is a hint, not a rule
const GAP_DAYS = 90;
const daysBetween = (from: string, to: string) =>
	(new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;

const partly = ({ count, first, last }: Coverage, { periodStart, periodEnd }: Period) =>
	count > 0 &&
	!!first &&
	!!last &&
	(daysBetween(periodStart, first) > GAP_DAYS || daysBetween(last, periodEnd) > GAP_DAYS);

type Period = { periodStart: string; periodEnd: string };

// Findings per category; missing invoices (not a deviation) need a confirmation
const categoryCheck = (check?: InvoiceCheck) => ({
	findings: check?.findings ?? [],
	incomplete: !!check?.findings.some((f) => f.kind !== 'deviation'),
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
