import type { Actor } from '../fixtures/actor';
import {
	backLink,
	buildingCheckbox,
	generateButton,
	nextButton,
	periodEndInput,
	periodStartInput,
	previewCount,
	showStatementsButton
} from '../interactions/statement-generate';

export const openPreview = (year: number, buildingId: string) => async (actor: Actor) => {
	await periodStartInput(actor.page).fill(`${year}-01-01`);
	await periodEndInput(actor.page).fill(`${year}-12-31`);
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

export const showCreatedStatements = async (actor: Actor) => {
	await showStatementsButton(actor.page).click();
};

export const returnToStatementList = async (actor: Actor) => {
	await backLink(actor.page).click();
};
