import { throughUiOrApi } from '../screenplay/abilities';
import type { Activity } from '../screenplay/actor';
import { Check, Click, DownloadFrom, Enter, EnterDate, FailRequests, Navigate, Select, Wait } from '../screenplay/interactions';
import { Visibility } from '../screenplay/questions';
import {
	offeredPeriodLink,
	consentLetterOf,
	agreementsRetry,
	allBuildingsCheckbox,
	backLink,
	buildingCheckbox,
	buildingInvoiceCount,
	feeNotAgreedLink,
	agreementAnswered,
	agreementFromDate,
	agreementsLoading,
	agreementChoice,
	notAgreedCostsLink,
	confirmMissingInvoices,
	generateButton,
	generateMoreButton,
	hintedInvoiceLink,
	heatingProfileSelect,
	managementFeeInput,
	newInvoiceFromWarning,
	noTankLink,
	periodEndInput,
	existingStatementLink,
	periodStartInput,
	previewCount,
	showStatementsButton,
	downloadZipButton,
	previewSkippedLink,
} from '../targets/statement-generate';
import { closeDraftNotice, discardDraftButton, discardDraftConfirm, finishedStep, nextButton, saveStatus } from '../targets/wizard';
import { generateStatementsViaApi, openPreviewViaApi, type RunOptions } from './statement-generate-api';

const WIZARD = '/statements/generate';
const goToNextStep = Click.on(nextButton);
// From step 3 once it has checked whether the contracts agree the period's Nebenkosten (#91): «Weiter» waits for it
export const leaveSettings: Activity = (actor) => actor.attemptsTo(Wait.forCount(agreementsLoading, 0), goToNextStep);

// The wizard is the UI's way to a run; the API driver needs no page for it
export const openStatementWizard = throughUiOrApi(Navigate.to(WIZARD), async () => {});

// A contract or a refusal links here: building and period chosen, on the settings step
export const openStatementWizardFor = (buildingId: string, year: number) =>
	Navigate.to(`${WIZARD}?building=${buildingId}&start=${year}-01-01&end=${year}-12-31`);

// #199, #408 point 2: step 2's way out of a period that overlaps the building's, into the wizard with that period
export const chooseOfferedPeriod = (buildingId: string, periodStart: string) => Click.on(offeredPeriodLink(buildingId, periodStart));
// #521: the letter for the tenant's consent to a new Abrechnungsperiode, from step 2
export const downloadConsentLetterOf = (buildingId: string, tenantName: string) => DownloadFrom(consentLetterOf(buildingId, tenantName));
// Steps "Abrechnungsperiode" (default period) and "Gebäude"
// once the step has loaded what it tells about each building: later text would move the rows under the click
// (Firefox, #424)
export const chooseBuilding = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(
		goToNextStep,
		Wait.until(buildingInvoiceCount(buildingId)),
		Check.the(buildingCheckbox(buildingId))
	);

// Step "Abrechnungsperiode", on to step "Gebäude"
export const chooseBuildingsForPeriod = (start: string, end: string): Activity => (actor) =>
	actor.attemptsTo(EnterDate.of(start).into(periodStartInput), EnterDate.of(end).into(periodEndInput), goToNextStep);
export const chooseBuildingsFor = (year: number) => chooseBuildingsForPeriod(`${year}-01-01`, `${year}-12-31`);

// Step "Heizprofil und Verwaltungspauschale"
export const setManagementFee = (buildingId: string, percent: number): Activity => (actor) =>
	actor.attemptsTo(chooseBuilding(buildingId), goToNextStep, Enter.theValue(String(percent)).into(managementFeeInput));

// The settings step of a year's run, opened from a link that chose building and period (A-10)
// it waits until the questions about the agreed Nebenkosten are loaded (code review W10c C-1)
export const openSettingsFor = (year: number, buildingId: string, percent: number): Activity => (actor) =>
	actor.attemptsTo(
		openStatementWizardFor(buildingId, year),
		Enter.theValue(String(percent)).into(managementFeeInput),
		Wait.forCount(agreementsLoading, 0)
	);

// Typed key by key, as a user does: what the field keeps while typing matters
export const typeManagementFee = (buildingId: string, text: string): Activity => (actor) =>
	actor.attemptsTo(chooseBuilding(buildingId), goToNextStep, Enter.keyByKey(text).into(managementFeeInput));

const openPreviewThroughUi =
	(year: number, buildingId: string, options: RunOptions): Activity =>
	async (actor) => {
		await actor.attemptsTo(
			EnterDate.of(options.periodStart ?? `${year}-01-01`).into(periodStartInput),
			EnterDate.of(options.periodEnd ?? `${year}-12-31`).into(periodEndInput),
			chooseBuilding(buildingId),
			goToNextStep
		);
		if (options.heatingProfileId) await actor.attemptsTo(Select.option(options.heatingProfileId).from(heatingProfileSelect));
		if (options.managementFeePercent !== undefined)
			await actor.attemptsTo(Enter.theValue(String(options.managementFeePercent)).into(managementFeeInput));
		await actor.attemptsTo(leaveSettings, Wait.until(previewCount)); // the preview is calculated on the server
	};

export const openPreview = (year: number, buildingId: string, options: RunOptions = {}) =>
	throughUiOrApi(openPreviewThroughUi(year, buildingId, options), openPreviewViaApi(year, buildingId, options));

// From the preview to step "Erstellen"; a run without invoices must be confirmed first
export const goToGeneration: Activity = async (actor) => {
	if (await actor.answer(Visibility.of(confirmMissingInvoices))) await actor.attemptsTo(Check.the(confirmMissingInvoices));
	await actor.attemptsTo(goToNextStep);
};

export const generateStatements = (year: number, buildingId: string, options: RunOptions = {}) =>
	throughUiOrApi(
		(actor) => actor.attemptsTo(openPreviewThroughUi(year, buildingId, options), goToGeneration, Click.on(generateButton)),
		generateStatementsViaApi(year, buildingId, options)
	);

export const tryNextWithoutConfirmation = goToNextStep;

// The input is kept in the browser; the wizard says when
export const reopenStatementWizard: Activity = (actor) =>
	actor.attemptsTo(Wait.until(saveStatus('Noch nicht gespeichert')), Navigate.to(WIZARD));

export const generateMore = Click.on(generateMoreButton);
export const showCreatedStatements = Click.on(showStatementsButton);
export const downloadCreatedStatementsZip = DownloadFrom(downloadZipButton);
/** Follows the ZIP link in the tab, as a browser does when the answer is no file */
export const requestCreatedStatementsZip = Click.on(downloadZipButton);
export const returnToStatementList = Click.on(backLink);
export const confirmDespiteWarnings = Check.the(confirmMissingInvoices);

// Back to step "Heizprofil und Verwaltungspauschale" and "Weiter": the server calculates a new preview
export const recalculatePreview: Activity = (actor) =>
	actor.attemptsTo(Click.on(finishedStep('Heizprofil')), leaveSettings, Wait.until(previewCount));

// "Rechnung erfassen" in the preview's warning about missing invoices
export const recordInvoiceFromWarning: Activity = (actor) =>
	actor.attemptsTo(
		Click.on(newInvoiceFromWarning),
		Wait.forUrl((url) => /\/invoices\/new/.test(url.href))
	);
// the contract page loads before the next step looks: its data can take longer than an expectation waits (#494)
export const openContractWithoutFee = (contractId: string): Activity => (actor) =>
	actor.attemptsTo(
		Click.on(feeNotAgreedLink(contractId)),
		Wait.forUrl((url) => url.pathname === `/contracts/${contractId}`)
	);

// The edit link of an invoice a hint of the preview names
export const editHintedInvoice = (date: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(hintedInvoiceLink(date)), Wait.forUrl((url) => /\/invoices\/[^/]+\/edit/.test(url.href)));

export const openExistingStatement = (statementId: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(existingStatementLink(statementId)), Wait.forUrl((url) => url.pathname === `/statements/${statementId}`));

// From the question about the Heizmaterial to the building's form, to record that it has no tank
export const recordNoTankFromQuestion = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(noTankLink(buildingId)), Wait.forUrl((url) => url.pathname.endsWith(`/buildings/${buildingId}/edit`)));

// #91, step «Einstellungen»: the answer whether the contract agrees a category; stored at once
export const answerAgreement = (contractId: string, categoryId: string, agreed: boolean): Activity => (actor) =>
	actor.attemptsTo(Click.on(agreementChoice(contractId, categoryId, agreed)), Wait.until(agreementAnswered(contractId, categoryId)));
// #368: «Vereinbart ab» a day, stored once the day is entered
export const answerAgreementFrom = (contractId: string, categoryId: string, isoDate: string): Activity => (actor) =>
	actor.attemptsTo(
		Click.on(agreementChoice(contractId, categoryId, 'from')),
		EnterDate.of(isoDate).into(agreementFromDate(contractId, categoryId)),
		Wait.until(agreementAnswered(contractId, categoryId))
	);
// waits for the contract page, as `openContractWithoutFee` (#494)
export const openContractWithNotAgreedCosts = (contractId: string): Activity => (actor) =>
	actor.attemptsTo(
		Click.on(notAgreedCostsLink(contractId)),
		Wait.forUrl((url) => url.pathname === `/contracts/${contractId}`)
	);
// saving an answer fails (the BFF route the browser calls)
export const agreementsCannotBeChecked = FailRequests.to('/api/statements/agreements', {});
export const agreementsCheckAgain: Activity = (actor) => actor.attemptsTo(FailRequests.noLonger, Click.on(agreementsRetry));
export const agreementsCannotBeSaved = (contractId: string) => FailRequests.to(`/api/contracts/${contractId}/agreements`, {});

export const chooseAllBuildings = Check.the(allBuildingsCheckbox);
export const discardInput = Click.on(discardDraftButton);
export const confirmDiscarding = Click.on(discardDraftConfirm);
export const closeRestoredNotice = Click.on(closeDraftNotice);

// #453 (#327): the link of a contract «Abgerechnet bis» covers in full
export const openSkippedContract = (contractId: string) => Click.on(previewSkippedLink(contractId));
