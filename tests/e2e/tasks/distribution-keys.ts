import type { Actor } from '../fixtures/actor';
import { deleteConfirmButton } from '../interactions/form';
import { deleteButton, editButton, formulaInput, nameInput, submitButton, testButton } from '../interactions/distribution-keys';

export const testFormula = (formula: string) => async (actor: Actor) => {
	await formulaInput(actor.page).fill(formula);
	await testButton(actor.page).click();
};

export const createDistributionKey = (name: string, formula: string) => async (actor: Actor) => {
	await formulaInput(actor.page).fill(formula);
	await nameInput(actor.page).fill(name);
	await submitButton(actor.page).click();
};

export const changeFormula = (name: string, formula: string) => async (actor: Actor) => {
	await editButton(actor.page, name).click();
	await formulaInput(actor.page).fill(formula);
	await submitButton(actor.page).click();
};

export const deleteDistributionKey = (name: string) => async (actor: Actor) => {
	await deleteButton(actor.page, name).click();
	await deleteConfirmButton(actor.page).click();
};
