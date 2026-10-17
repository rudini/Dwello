import { throughUiOrApi } from '../screenplay/abilities';
import { type Question, question } from '../screenplay/actor';
import { Accessible, Checked, Count, Text, Value, Visibility } from '../screenplay/questions';
import {
	announcement,
	buildingBilled,
	buildingCheckbox,
	buildingInvoices,
	categoryFinding,
	confirmMissingInvoices,
	hintedInvoice,
	invoicesWithoutServicePeriod,
	lateInvoices,
	draftsOnlyNote,
	feeNotAgreed,
	generationResult,
	heatingProfileSelect,
	managementFeeHint,
	managementFeeInput,
	missingInvoices,
	oldAddress,
	periodStartInput,
	periodRunningWarning,
	previewEmpty,
	previewFee,
	previewRow,
	previewRows,
	tankQuestion,
	wizardChoices,
	wizardPresetNotice
} from '../targets/statement-generate';
import { draftRestored } from '../targets/wizard';
import { CREATED_STATEMENTS, PREVIEW_BALANCES, PREVIEW_TOTALS } from '../tasks/statement-generate-api';
import { amountAfter, signedFrancs } from './amounts';

// The API protocol driver's answers: what the run through the backend API remembered
const remembered = (key: string) =>
	question(`the ${key} per tenant`, (actor) => {
		const answers = actor.recall<Map<string, number> | undefined>(key);
		if (!answers) throw new Error(`no ${key}: the preview was not opened through the API`);
		return answers;
	});

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

// «1 Nebenkostenabrechnung ist als Entwurf erstellt», «3 Nebenkostenabrechnungen sind als Entwurf erstellt»
const CREATED = /(\d+) (Nebenkostenabrechnung ist|Nebenkostenabrechnungen sind) als Entwurf erstellt/;

/** How many statements the run created as drafts; on the page the whole text when it does not say so in good German */
export const createdStatements = throughUiOrApi<Question<number | string | null>>(
	question('how many statements are reported as created', async (actor) => {
		const text = await actor.answer(Text.of(generationResult));
		const [, count, words] = text?.match(CREATED) ?? [];
		return count && (Number(count) === 1) === words.endsWith('ist') ? Number(count) : text;
	}),
	question('how many statements the system created', (actor) => actor.recall<number>(CREATED_STATEMENTS))
);

const rowOf = (tenantName: string) => Text.of(previewRow(tenantName));

/** The Saldo of the tenant's statement in the preview, in francs (a refund negative) */
export const balanceOf = (tenantName: string) =>
	throughUiOrApi<Question<number | string | null | undefined>>(
		question(`the Saldo of ${tenantName} in the preview`, async (actor) =>
			amountAfter('(?:Nachzahlung|Rückerstattung|Ausgeglichen)', await actor.answer(rowOf(tenantName)), signedFrancs)
		),
		question(`the Saldo of ${tenantName} in the preview`, async (actor) =>
			(await actor.answer(remembered(PREVIEW_BALANCES))).get(tenantName)
		)
	);

/** The total costs of the tenant's statement in the preview, in francs */
export const totalCostsOf = (tenantName: string) =>
	throughUiOrApi<Question<number | string | null | undefined>>(
		question(`the costs of ${tenantName} in the preview`, async (actor) =>
			amountAfter('Kosten', await actor.answer(rowOf(tenantName)))
		),
		question(`the costs of ${tenantName} in the preview`, async (actor) =>
			(await actor.answer(remembered(PREVIEW_TOTALS))).get(tenantName)
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
export const billedOfBuilding = (buildingId: string) => Text.of(buildingBilled(buildingId));
export const restoredDraftText = Text.of(draftRestored);
export const buildingChosen = (buildingId: string) => Checked.of(buildingCheckbox(buildingId));
export const categoryFindingOf = (category: string) => Text.of(categoryFinding(category));
export const periodRunning = Text.of(periodRunningWarning);
export const tankQuestions = Count.of(tankQuestion);
export const missingStockFindings = Count.of(categoryFinding('Ohne Anfangs- und Endbestand'));
export const confirmationAsked = Visibility.of(confirmMissingInvoices);
export const lateInvoiceOn = (date: string) => Text.of(hintedInvoice(lateInvoices, date));
export const countOfLateInvoicesOn = (date: string) => Count.of(hintedInvoice(lateInvoices, date));
export const invoiceWithoutServicePeriodOn = (date: string) => Text.of(hintedInvoice(invoicesWithoutServicePeriod, date));
export const countOfInvoicesWithoutServicePeriodOn = (date: string) => Count.of(hintedInvoice(invoicesWithoutServicePeriod, date));
// the option names the profile and its sum, «Winter … (100%)»
export const proposedHeatingProfile = Value.chosenIn(heatingProfileSelect);
export const heatingProfileOffered = Visibility.of(heatingProfileSelect);
export const contractsWithoutFee = Text.of(feeNotAgreed);
export const presetNoticeText = Text.of(wizardPresetNotice);
export const oldAddressWarning = Text.of(oldAddress);
