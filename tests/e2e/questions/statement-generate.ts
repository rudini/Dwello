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
import { CREATED_STATEMENTS, PREVIEW_BALANCES, PREVIEW_TOTALS } from '../tasks/statement-generate-api';

// The API protocol driver's answers: what the run through the backend API remembered
const remembered = (key: string) =>
	question(`the ${key} per tenant`, (actor) => actor.recall<Map<string, number>>(key) ?? new Map<string, number>());

const textOfRowContains = (tenantName: string, text: string) =>
	question(`whether the preview row of ${tenantName} says ${text}`, async (actor) =>
		Boolean((await actor.answer(Text.of(previewRow(tenantName))))?.includes(text))
	);

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

/** Whether the run created that many statements as drafts */
export const statementsCreated = (count: number) =>
	throughUiOrApi(
		question(`whether ${count} statements are reported as created`, async (actor) =>
			Boolean(
				(await actor.answer(Text.of(generationResult)))?.includes(
					count === 1
						? '1 Nebenkostenabrechnung ist als Entwurf erstellt'
						: `${count} Nebenkostenabrechnungen sind als Entwurf erstellt`
				)
			)
		),
		question(`whether ${count} statements were created`, (actor) => actor.recall<number>(CREATED_STATEMENTS) === count)
	);

/** The Saldo as the preview shows it ("Nachzahlung CHF 12.50", "Rückerstattung CHF 3.00"); signed francs for the API */
export const balanceShown = (tenantName: string, saldo: string, signedFrancs: number) =>
	throughUiOrApi(
		textOfRowContains(tenantName, saldo),
		question(`whether the Saldo of ${tenantName} is ${signedFrancs}`, async (actor) =>
			(await actor.answer(remembered(PREVIEW_BALANCES))).get(tenantName) === signedFrancs
		)
	);

export const totalCostsShown = (tenantName: string, amount: string, inFrancs: number) =>
	throughUiOrApi(
		textOfRowContains(tenantName, amount),
		question(`whether the statement of ${tenantName} costs ${inFrancs}`, async (actor) =>
			(await actor.answer(remembered(PREVIEW_TOTALS))).get(tenantName) === inFrancs
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
