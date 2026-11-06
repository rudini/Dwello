import type { Activity } from '../screenplay/actor';
import { Browser, Check, Click, Enter, Navigate, Press, Scroll, Uncheck, Wait } from '../screenplay/interactions';
import { viewports } from '../fixtures/screens';
import {
	allocabilityCancel,
	allocabilityConfirm,
	allowanceOption,
	allowedFilter,
	categoryRow,
	deleteButton,
	editButton,
	fuelCheckbox,
	heatingCheckbox,
	nameInput,
	proposeButton,
	sortOrderInput,
	submitButton
} from '../targets/categories';
import { deleteConfirmButton } from '../targets/form';

export const openCategories = Navigate.to('/config/categories');
export const openNewCategory = Navigate.to('/config/categories/new');
export const openCategoryEdit = (categoryId: string) => Navigate.to(`/config/categories/${categoryId}/edit`);
// A predefined category has no seeded id: open it from the list
export const openPredefinedCategory = (name: string): Activity => (actor) =>
	actor.attemptsTo(openCategories, Click.on(editButton(name)), Wait.until(nameInput));

export const usePhone = Browser.resizeTo(viewports.mobile);

export const showAllowedCategories = Click.on(allowedFilter);

export const createCategory = (name: string, allowed: boolean): Activity => (actor) =>
	actor.attemptsTo(
		Check.the(allowanceOption(allowed ? 'Umlagefähig' : 'Nicht umlagefähig')),
		Enter.theValue(name).into(nameInput),
		Click.on(submitButton)
	);

// An allocable category shared like heating whose invoices are fuel deliveries (#100)
export const createFuelCategory = (name: string): Activity => (actor) =>
	actor.attemptsTo(
		Check.the(allowanceOption('Umlagefähig')),
		Check.the(heatingCheckbox),
		Check.the(fuelCheckbox),
		Enter.theValue(name).into(nameInput),
		Click.on(submitButton),
		Wait.until(allowedFilter) // saved: back on the list
	);

export const saveFormAsNotAllowed: Activity = (actor) =>
	actor.attemptsTo(Check.the(allowanceOption('Nicht umlagefähig')), Click.on(submitButton));

export const saveAsNotAllowed = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(editButton(name)), saveFormAsNotAllowed);

export const saveWithoutFuel = (categoryId: string): Activity => (actor) =>
	actor.attemptsTo(openCategoryEdit(categoryId), Uncheck.the(fuelCheckbox), Click.on(submitButton));

// #1081: the delete dialog open, its question not answered yet
// #1096: a confirmation may cover a control at the bottom, so the landlord brings the row to the middle first
export const startDeletingCategory = (name: string): Activity => (actor) =>
	actor.attemptsTo(Scroll.toMiddle(deleteButton(name)), Click.on(deleteButton(name)));
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

// #678: the Enter key in «Name» submits the form, as in every other form
export const saveWithEnter = (name: string, allowed?: boolean): Activity => (actor) =>
	actor.attemptsTo(
		...(allowed === undefined ? [] : [Check.the(allowanceOption(allowed ? 'Umlagefähig' : 'Nicht umlagefähig'))]),
		Enter.theValue(name).into(nameInput),
		Press.theKey('Enter').on(nameInput)
	);
export const askKiWithoutName = Click.on(proposeButton);
export const chooseNotAllowed = Check.the(allowanceOption('Nicht umlagefähig'));
export const rename = (name: string) => Enter.theValue(name).into(nameInput);

export const saveAsAllowed = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(editButton(name)), Check.the(allowanceOption('Umlagefähig')), Click.on(submitButton));

// The answer to the question before the allocability changes (#309)
export const confirmAllocability: Activity = (actor) =>
	actor.attemptsTo(Click.on(allocabilityConfirm), Wait.until(allowedFilter));
export const cancelAllocability = Click.on(allocabilityCancel);
// #1029: the choice on the edit page, not saved
export const chooseAllowed = Check.the(allowanceOption('Umlagefähig'));

/** #1096: the landlord is at the category's row; the page's movement is noted */
export const stayAtCategory = (name: string): Activity => (actor) =>
	actor.attemptsTo(Scroll.toMiddle(categoryRow(name)), Scroll.watch);
/** #1113: the category's row at the bottom edge of the window, where a confirmation stands */
export const bringCategoryToBottomEdge = (name: string): Activity => (actor) =>
	actor.attemptsTo(Scroll.toBottomEdge(categoryRow(name)));

// #672: the number emptied on the edit page
export const saveWithoutSortOrder: Activity = (actor) =>
	actor.attemptsTo(Enter.theValue('').into(sortOrderInput), Click.on(submitButton));
