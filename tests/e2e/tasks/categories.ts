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
// A predefined category has no seeded id: open it from the list
export const openPredefinedCategory = (name: string): Activity => (actor) =>
	actor.attemptsTo(openCategories, Click.on(editButton(name)));

export const showAllowedCategories = Click.on(allowedFilter);

export const createCategory = (name: string, allowed: boolean): Activity => (actor) =>
	actor.attemptsTo(
		Check.the(allowanceOption(allowed ? 'Umlagefähig' : 'Nicht umlagefähig')),
		Enter.theValue(name).into(nameInput),
		Click.on(submitButton)
	);

export const saveFormAsNotAllowed: Activity = (actor) =>
	actor.attemptsTo(Check.the(allowanceOption('Nicht umlagefähig')), Click.on(submitButton));

export const saveAsNotAllowed = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(editButton(name)), saveFormAsNotAllowed);

export const deleteCategory = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(deleteButton(name)), Click.on(deleteConfirmButton));

// The KI stand-in fails for a category whose name starts with «KI-Ausfall» (backend/scripts/llm-stub.ts)
export const kiFails: Activity = async (actor) => actor.remember('kiFails', true);

export const askKi = (name: string): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(actor.recall('kiFails') ? `KI-Ausfall ${name}` : name).into(nameInput),
		Click.on(proposeButton)
	);

export const saveWithoutChoice = (name: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(name).into(nameInput), Click.on(submitButton));
