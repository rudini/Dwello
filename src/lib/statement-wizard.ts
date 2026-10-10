import { IMPOSSIBLE, impossible } from './contract-wizard';
import { formatDate } from './utils/format';

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

type Coverage = { buildingId: string; count: number; first: string | null; last: string | null };

const coverageText = ({ count, first, last }: Coverage) => {
	if (count === 0 || !first || !last) return 'Keine Rechnungen erfasst';
	if (count === 1) return `1 Rechnung vom ${formatDate(first)}`;
	return `${count} Rechnungen vom ${formatDate(first)} bis ${formatDate(last)}`;
};

/** The invoices each building brings into the statements, in words; a building without any is flagged */
export const invoiceRows = (coverage: Coverage[], buildings: { id: string; name: string }[]) =>
	coverage.map((c) => ({
		buildingId: c.buildingId,
		name: buildings.find((b) => b.id === c.buildingId)?.name ?? '',
		text: coverageText(c),
		missing: c.count === 0
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
