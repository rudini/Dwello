import type { Activity } from '../screenplay/actor';
import { Check, Click, Enter, Navigate, Uncheck } from '../screenplay/interactions';
import { allowedCheckbox, allowedFilter, deleteButton, editButton, nameInput, submitButton } from '../targets/categories';
import { deleteConfirmButton } from '../targets/form';

export const openCategories = Navigate.to('/config/categories');
export const openNewCategory = Navigate.to('/config/categories/new');
export const openCategoryEdit = (categoryId: string) => Navigate.to(`/config/categories/${categoryId}/edit`);

export const showAllowedCategories = Click.on(allowedFilter);

export const createCategory = (name: string, allowed: boolean): Activity => (actor) =>
	actor.attemptsTo(
		allowed ? Check.the(allowedCheckbox) : Uncheck.the(allowedCheckbox),
		Enter.theValue(name).into(nameInput),
		Click.on(submitButton)
	);

export const saveAsNotAllowed = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(editButton(name)), Uncheck.the(allowedCheckbox), Click.on(submitButton));

export const deleteCategory = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(deleteButton(name)), Click.on(deleteConfirmButton));
