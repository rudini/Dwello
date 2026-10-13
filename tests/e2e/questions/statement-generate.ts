import { throughUiOrApi } from '../screenplay/abilities';
import { question } from '../screenplay/actor';
import { Accessible, Checked, Count, Text, Value, Visibility } from '../screenplay/questions';
import {
	announcement,
	buildingCheckbox,
	buildingInvoices,
	categoryFinding,
	draftsOnlyNote,
	generationResult,
	heatingProfileSelect,
	managementFeeHint,
	managementFeeInput,
	missingInvoices,
	periodStartInput,
	previewEmpty,
	previewFee,
	previewRow,
	previewRows,
	wizardChoices
} from '../targets/statement-generate';
import { CREATED_STATEMENTS, francs, PREVIEW_BALANCES, PREVIEW_TOTALS } from '../tasks/statement-generate-api';

// The API protocol driver's answers: what the run through the backend API remembered
const remembered = (key: string) =>
	question(`the ${key} per tenant`, (actor) => {
		const answers = actor.recall<Map<string, number> | undefined>(key);
		if (!answers) throw new Error(`no ${key}: the preview was not opened through the API`);
		return answers;
	});

// The amounts a preview row shows, in francs: "Kosten CHF 1’250.50" and the Saldo "Nachzahlung/Rückerstattung CHF 12.50"
const amountAfter = (text: string | null, label: string) => {
	const found = text?.match(new RegExp(`${label}\\s*CHF\\s*([\\d’'.]+)`));
	return found ? francs(found[1]) : null;
};
const saldoIn = (text: string | null) => {
	if (text?.includes('Ausgeglichen')) return 0;
	const due = amountAfter(text, 'Nachzahlung');
	const refund = amountAfter(text, 'Rückerstattung');
	return due ?? (refund === null ? null : -refund);
};

/** A Saldo as the scenario writes it ("Rückerstattung CHF 3.00"), in signed francs as the questions answer it */
export const signedFrancs = (saldo: string) => (saldo.startsWith('Rückerstattung') ? -1 : 1) * francs(saldo);

export const previewHasStatementOf = (tenantName: string) =>
	throughUiOrApi(
		Visibility.of(previewRow(tenantName)),
		question(`whether the preview has ${tenantName}`, async (actor) =>
			(await actor.answer(remembered(PREVIEW_TOTALS))).has(tenantName)
		)
	);

export const statementsInPreview = throughUiOrApi(
	Count.of(previewRows),
	question('how many statements the preview has', async (actor) => (await actor.answer(remembered(PREVIEW_TOTALS))).size)
);

export const noContractsInPeriod = throughUiOrApi(
	Visibility.of(previewEmpty),
	question('whether the preview is empty', async (actor) => (await actor.answer(remembered(PREVIEW_TOTALS))).size === 0)
);

/** How many statements the run created as drafts */
export const statementsCreated = throughUiOrApi(
	question('how many statements are reported as created', async (actor) => {
		const found = (await actor.answer(Text.of(generationResult)))?.match(
			/(\d+) Nebenkostenabrechnungen? (?:ist|sind) als Entwurf erstellt/
		);
		return found ? Number(found[1]) : null;
	}),
	question('how many statements were created', (actor) => actor.recall<number>(CREATED_STATEMENTS))
);

/** The Saldo of the tenant's statement in signed francs: positive for a Nachzahlung, negative for a Rückerstattung */
export const saldoOf = (tenantName: string) =>
	throughUiOrApi(
		question(`the Saldo of ${tenantName} in the preview`, async (actor) =>
			saldoIn(await actor.answer(Text.of(previewRow(tenantName))))
		),
		question(`the Saldo of ${tenantName}`, async (actor) =>
			(await actor.answer(remembered(PREVIEW_BALANCES))).get(tenantName) ?? null
		)
	);

/** The total costs of the tenant's statement in francs */
export const totalCostsOf = (tenantName: string) =>
	throughUiOrApi(
		question(`the costs of ${tenantName} in the preview`, async (actor) =>
			amountAfter(await actor.answer(Text.of(previewRow(tenantName))), 'Kosten')
		),
		question(`the costs of ${tenantName}`, async (actor) =>
			(await actor.answer(remembered(PREVIEW_TOTALS))).get(tenantName) ?? null
		)
	);

export const generationOutcomeShown = Visibility.of(generationResult);
export const generationOutcomeCount = Count.of(generationResult);
export const feeAboveGuideline = Visibility.of(managementFeeHint);
export const feeOfRun = Text.of(previewFee);
export const feeFieldValue = Value.of(managementFeeInput);
export const feeFieldShown = Visibility.of(managementFeeInput);
export const feeFieldDescription = Accessible.descriptionOf(managementFeeInput);
export const announcedFeeHint = Visibility.of(announcement('Über dem üblichen Richtwert'));
// Step 3 offers one choice, the Heizprofil: the fee has no distribution key
export const settingsChoiceCount = Count.of(wizardChoices);
export const settingsChoiceName = Accessible.nameOf(wizardChoices);
export const periodChoiceShown = Visibility.of(periodStartInput);
export const missingInvoicesWarning = Text.of(missingInvoices);
export const missingInvoicesWarnings = Count.of(missingInvoices);
export const invoicesOfBuilding = (buildingName: string) => Text.of(buildingInvoices(buildingName));
export const draftsOnly = Text.of(draftsOnlyNote);
export const buildingChosen = (buildingId: string) => Checked.of(buildingCheckbox(buildingId));
export const categoryFindingOf = (category: string) => Text.of(categoryFinding(category));
// the option names the profile and its sum, «Winter … (100%)»
export const proposedHeatingProfile = Value.chosenIn(heatingProfileSelect);
export const heatingProfileOffered = Visibility.of(heatingProfileSelect);
