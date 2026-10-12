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
	if (impossible(periodStart)) return { periodStart: impossibleYear() };
	if (impossible(periodEnd)) return { periodEnd: impossibleYear() };
	if (periodEnd <= periodStart)
		return { periodEnd: 'Das Ende muss nach dem Beginn der Abrechnungsperiode liegen.' };
	return {};
}

function settingErrors({ heatingProfileId, managementFeePercent }: WizardSelection) {
	return {
		...(!heatingProfileId && { heatingProfileId: 'Bitte wählen Sie ein Heizprofil.' }),
		// a rate emptied and restored from the draft is null, not 0 %
		...(!(Number.isFinite(managementFeePercent) && managementFeePercent >= 0) && {
			managementFeePercent: 'Bitte geben Sie einen Prozentsatz ab 0 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
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

const invoices = (count: number) => (count === 1 ? '1 Rechnung' : `${count} Rechnungen`);

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
	const names: Record<number, string> = {
		1: `den ${from.toLocaleDateString('de-CH', { month: 'long', timeZone: 'UTC' })}`,
		3: `das ${month / 3 + 1}. Quartal`,
		6: `das ${month / 6 + 1}. Halbjahr`
	};
	return names[months] ?? null;
}

// A slice of the period in words: a calendar month, quarter or half-year by its name, otherwise its dates
const partLabel = (slice: { start: string; end: string }) =>
	calendarName(slice) ?? `die Zeit vom ${formatDate(slice.start)} bis ${formatDate(slice.end)}`;

// TODO(fachlich prüfen): "Tankbestand" is not in the glossary
const stockText = (missingDays: { start: string }[], consumption: number) =>
	missingDays.length
		? `Tankbestand am ${missingDays.map((day) => formatDate(day.start)).join(' und am ')} ${missingDays.length > 1 ? 'fehlen' : 'fehlt'}. Ohne Anfangs- und Endbestand rechnet Dwello den Einkauf ab, nicht den Verbrauch. Abrechnen dürfen Sie aber nur den Verbrauch: Erfassen Sie den Bestand auf der Seite des Gebäudes. Bestätigen Sie nur, wenn der Tank am Anfang und am Ende gleich voll war.`
		: `Der Endbestand ist ${formatCurrency(-consumption)} höher als Anfangsbestand und Einkauf zusammen, der Verbrauch wäre negativ. Prüfen Sie die Tankbestände.`;

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
		return `Keine Rechnung in dieser Kategorie erfasst. Im Vorjahr: Kosten von ${formatCurrency(previous.total)}.`;
	if (kind === 'new')
		return `Neu: ${formatCurrency(current.total)}, im Vorjahr keine Kosten. Ist diese Kategorie im Mietvertrag vereinbart? Nur vereinbarte Nebenkosten dürfen Sie abrechnen. Wenn nicht, markieren Sie die Rechnungen als nicht umlagefähig. Neue Nebenkosten führen Sie nur für die Zukunft ein, frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist die Änderung nichtig. Waren die Kosten bisher in der Nettomiete enthalten, senken Sie diese entsprechend.`;
	if (kind === 'gap') {
		const parts = missingParts.map(partLabel).join(' und ');
		const what =
			missingParts.length === 1 ? `Rechnung für ${parts} fehlt` : `Rechnungen für ${parts} fehlen`;
		return `${what}. Im Vorjahr: ${invoices(previous.count)}.`;
	}
	const direction = (changePercent ?? 0) > 0 ? 'mehr' : 'weniger';
	return `${formatCurrency(current.total)}, ${Math.abs(changePercent ?? 0)} % ${direction} als im Vorjahr (${formatCurrency(previous.total)}). Prüfen Sie den Betrag und den Zeitraum, für den die Rechnung gilt.`;
}

// TODO(fachlich prüfen): costs 15 % above the Akonto suggest raising it, 30 % below suggest missing invoices;
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
	if (change > AKONTO_ABOVE && movedOut) return `Kosten ${amount} (${percent} %) über dem Akonto.`;
	if (change > AKONTO_ABOVE)
		return `Kosten ${amount} (${percent} %) über dem Akonto. Prüfen Sie, ob Sie das Akonto erhöhen. Eine Erhöhung gilt frühestens auf den nächsten Kündigungstermin: begründet, mit dem amtlichen Formular, beim Mieter mindestens 10 Tage vor Beginn der Kündigungsfrist. Ohne Formular oder Begründung ist sie nichtig.`;
	// part of the period: the months rented may carry little heating, low costs are no sign of missing invoices
	const wholePeriod = !rentalDays || !totalPeriodDays || rentalDays >= totalPeriodDays;
	if (change < -AKONTO_BELOW && wholePeriod)
		return `Kosten ${amount} (${percent} %) unter dem Akonto. Fehlen Rechnungen?`;
	return null;
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
