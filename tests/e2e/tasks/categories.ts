import type { Activity } from '../screenplay/actor';
import { Check, Click, Enter, Navigate } from '../screenplay/interactions';
import {
	allowanceOption,
	allowedFilter,
	deleteButton,
	editButton,
	nameInput,
	proposeButton,
	submitButton
} from '../targets/categories';
import { deleteConfirmButton } from '../targets/form';

export const openCategories = Navigate.to('/config/categories');
export const openNewCategory = Navigate.to('/config/categories/new');
export const openCategoryEdit = (categoryId: string) => Navigate.to(`/config/categories/${categoryId}/edit`);

export const showAllowedCategories = Click.on(allowedFilter);

export const createCategory = (name: string, allowed: boolean): Activity => (actor) =>
	actor.attemptsTo(
		Check.the(allowanceOption(allowed ? 'Umlagefähig' : 'Nicht umlagefähig')),
		Enter.theValue(name).into(nameInput),
		Click.on(submitButton)
	);

export const saveAsNotAllowed = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(editButton(name)), Check.the(allowanceOption('Nicht umlagefähig')), Click.on(submitButton));

export const deleteCategory = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(deleteButton(name)), Click.on(deleteConfirmButton));

export const askKi = (name: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(name).into(nameInput), Click.on(proposeButton));

export const saveWithoutChoice = (name: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(name).into(nameInput), Click.on(submitButton));

export const saveAsAllowed: Activity = (actor) =>
	actor.attemptsTo(Check.the(allowanceOption('Umlagefähig')), Click.on(submitButton));
