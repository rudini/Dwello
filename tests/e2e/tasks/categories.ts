import type { Activity } from '../screenplay/actor';
import { Browser, Check, Click, Enter, Navigate, Uncheck, Wait } from '../screenplay/interactions';
import { viewports } from '../fixtures/screens';
import {
	allocabilityCancel,
	allocabilityConfirm,
	allowanceOption,
	allowedFilter,
	deleteButton,
	editButton,
	fuelCheckbox,
	heatingCheckbox,
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

export const saveAsAllowed = (name: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(editButton(name)), Check.the(allowanceOption('Umlagefähig')), Click.on(submitButton));

// The answer to the question before the allocability changes (#309)
export const confirmAllocability: Activity = (actor) =>
	actor.attemptsTo(Click.on(allocabilityConfirm), Wait.until(allowedFilter));
export const cancelAllocability = Click.on(allocabilityCancel);
