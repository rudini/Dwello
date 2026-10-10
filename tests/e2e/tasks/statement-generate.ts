import type { Actor } from '../fixtures/actor';
import { visit } from '../interactions/navigation';
import { saveStatus } from '../interactions/contract-form';
import {
	backLink,
	buildingCheckbox,
	confirmMissingInvoices,
	generateButton,
	generateMoreButton,
	heatingProfileSelect,
	managementFeeInput,
	managementFeeKeySelect,
	nextButton,
	periodEndInput,
	periodStartInput,
	previewCount,
	showStatementsButton
} from '../interactions/statement-generate';

type RunOptions = { heatingProfileId?: string; managementFeePercent?: number; managementFeeKey?: string };

// Steps "Abrechnungsperiode" (default period) and "Gebäude"
export const chooseBuilding = (buildingId: string) => async (actor: Actor) => {
	await nextButton(actor.page).click();
	await buildingCheckbox(actor.page, buildingId).check();
};

// Step "Heizprofil und Verwaltungspauschale"
export const setManagementFee = (buildingId: string, percent: number) => async (actor: Actor) => {
	await chooseBuilding(buildingId)(actor);
	await nextButton(actor.page).click();
	await managementFeeInput(actor.page).fill(String(percent));
};

export const openPreview =
	(year: number, buildingId: string, options: RunOptions = {}) =>
	async (actor: Actor) => {
		await periodStartInput(actor.page).fill(`${year}-01-01`);
		await periodEndInput(actor.page).fill(`${year}-12-31`);
		await chooseBuilding(buildingId)(actor);
		await nextButton(actor.page).click();
		if (options.heatingProfileId) await heatingProfileSelect(actor.page).selectOption(options.heatingProfileId);
		if (options.managementFeePercent !== undefined)
			await managementFeeInput(actor.page).fill(String(options.managementFeePercent));
		if (options.managementFeeKey) await managementFeeKeySelect(actor.page).selectOption({ label: options.managementFeeKey });
		await nextButton(actor.page).click();
		await previewCount(actor.page).waitFor(); // the preview is calculated on the server
	};

// From the preview to step "Erstellen"; a run without invoices must be confirmed first
export const goToGeneration = async (actor: Actor) => {
	if (await confirmMissingInvoices(actor.page).isVisible()) await confirmMissingInvoices(actor.page).check();
	await nextButton(actor.page).click();
};

export const generateStatements = (year: number, buildingId: string) => async (actor: Actor) => {
	await openPreview(year, buildingId)(actor);
	await goToGeneration(actor);
	await generateButton(actor.page).click();
};

export const tryNextWithoutConfirmation = async (actor: Actor) => {
	await nextButton(actor.page).click();
};

export const reopenStatementWizard = async (actor: Actor) => {
	await saveStatus(actor.page).getByText('Entwurf gespeichert').waitFor();
	await visit(actor.page, '/statements/generate');
};

export const generateMore = async (actor: Actor) => {
	await generateMoreButton(actor.page).click();
};

export const showCreatedStatements = async (actor: Actor) => {
	await showStatementsButton(actor.page).click();
};

export const returnToStatementList = async (actor: Actor) => {
	await backLink(actor.page).click();
};
