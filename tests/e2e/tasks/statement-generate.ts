import type { Actor } from '../fixtures/actor';
import {
	backLink,
	buildingCheckbox,
	generateButton,
	generateMoreButton,
	heatingProfileSelect,
	managementFeeInput,
	nextButton,
	periodEndInput,
	periodStartInput,
	previewCount,
	showStatementsButton
} from '../interactions/statement-generate';

type RunOptions = { heatingProfileId?: string; managementFeePercent?: number };

export const setManagementFee = (percent: number) => async (actor: Actor) => {
	await managementFeeInput(actor.page).fill(String(percent));
};

export const openPreview =
	(year: number, buildingId: string, options: RunOptions = {}) =>
	async (actor: Actor) => {
		await periodStartInput(actor.page).fill(`${year}-01-01`);
		await periodEndInput(actor.page).fill(`${year}-12-31`);
		if (options.heatingProfileId)
			await heatingProfileSelect(actor.page).selectOption(options.heatingProfileId);
		if (options.managementFeePercent !== undefined)
			await setManagementFee(options.managementFeePercent)(actor);
		await nextButton(actor.page).click();
		await buildingCheckbox(actor.page, buildingId).check();
		await nextButton(actor.page).click();
		await previewCount(actor.page).waitFor(); // the preview is calculated on the server
	};

export const generateStatements = (year: number, buildingId: string) => async (actor: Actor) => {
	await openPreview(year, buildingId)(actor);
	await nextButton(actor.page).click();
	await generateButton(actor.page).click();
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
