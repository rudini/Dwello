import { throughUiOrApi } from '../screenplay/abilities';
import type { Activity } from '../screenplay/actor';
import { Check, Click, Enter, EnterDate, Navigate, Select, Wait } from '../screenplay/interactions';
import { Visibility } from '../screenplay/questions';
import {
	backLink,
	buildingCheckbox,
	confirmMissingInvoices,
	generateButton,
	generateMoreButton,
	heatingProfileSelect,
	managementFeeInput,
	newInvoiceFromWarning,
	periodEndInput,
	periodStartInput,
	previewCount,
	showStatementsButton
} from '../targets/statement-generate';
import { finishedStep, nextButton, saveStatus } from '../targets/wizard';
import { generateStatementsViaApi, openPreviewViaApi, type RunOptions } from './statement-generate-api';

const WIZARD = '/statements/generate';
const goToNextStep = Click.on(nextButton);

// The wizard is the UI's way to a run; the API driver needs no page for it
export const openStatementWizard = throughUiOrApi(Navigate.to(WIZARD), async () => {});

// A contract or a refusal links here: building and period chosen, on the settings step
export const openStatementWizardFor = (buildingId: string, year: number) =>
	Navigate.to(`${WIZARD}?building=${buildingId}&start=${year}-01-01&end=${year}-12-31`);

// Steps "Abrechnungsperiode" (default period) and "Gebäude"
export const chooseBuilding = (buildingId: string): Activity => (actor) =>
	actor.attemptsTo(goToNextStep, Check.the(buildingCheckbox(buildingId)));

// Step "Abrechnungsperiode" with a whole year, on to step "Gebäude"
export const chooseBuildingsFor = (year: number): Activity => (actor) =>
	actor.attemptsTo(
		EnterDate.of(`${year}-01-01`).into(periodStartInput),
		EnterDate.of(`${year}-12-31`).into(periodEndInput),
		goToNextStep
	);

// Step "Heizprofil und Verwaltungspauschale"
export const setManagementFee = (buildingId: string, percent: number): Activity => (actor) =>
	actor.attemptsTo(chooseBuilding(buildingId), goToNextStep, Enter.theValue(String(percent)).into(managementFeeInput));

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
		await actor.attemptsTo(goToNextStep, Wait.until(previewCount)); // the preview is calculated on the server
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

// The draft is kept in the browser; the wizard says when it is saved
export const reopenStatementWizard: Activity = (actor) =>
	actor.attemptsTo(Wait.until(saveStatus('Entwurf gespeichert')), Navigate.to(WIZARD));

export const generateMore = Click.on(generateMoreButton);
export const showCreatedStatements = Click.on(showStatementsButton);
export const returnToStatementList = Click.on(backLink);
export const confirmDespiteWarnings = Check.the(confirmMissingInvoices);

// Back to step "Heizprofil und Verwaltungspauschale" and "Weiter": the server calculates a new preview
export const recalculatePreview: Activity = (actor) =>
	actor.attemptsTo(Click.on(finishedStep('Heizprofil')), goToNextStep, Wait.until(previewCount));

// "Rechnung erfassen" in the preview's warning about missing invoices
export const recordInvoiceFromWarning: Activity = (actor) =>
	actor.attemptsTo(
		Click.on(newInvoiceFromWarning),
		Wait.forUrl((url) => /\/invoices\/new/.test(url.href))
	);
