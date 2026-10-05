import type { Actor } from '../fixtures/actor';
import { deleteConfirmButton } from '../interactions/form';
import {
	allowedCheckbox,
	allowedFilter,
	deleteButton,
	editButton,
	nameInput,
	submitButton
} from '../interactions/categories';

export const showAllowedCategories = async (actor: Actor) => {
	await allowedFilter(actor.page).click();
};

export const createCategory = (name: string, allowed: boolean) => async (actor: Actor) => {
	await allowedCheckbox(actor.page).setChecked(allowed);
	await nameInput(actor.page).fill(name);
	await submitButton(actor.page).click();
};

export const saveAsNotAllowed = (name: string) => async (actor: Actor) => {
	await editButton(actor.page, name).click();
	await allowedCheckbox(actor.page).uncheck();
	await submitButton(actor.page).click();
};

export const deleteCategory = (name: string) => async (actor: Actor) => {
	await deleteButton(actor.page, name).click();
	await deleteConfirmButton(actor.page).click();
};
