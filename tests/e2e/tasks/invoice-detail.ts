import type { Actor } from '../fixtures/actor';
import {
	buildingLink,
	deleteButton,
	deleteConfirm,
	editButton,
	recategorizeButton
} from '../interactions/invoice-detail';

export const deleteInvoice = async (actor: Actor) => {
	await deleteButton(actor.page).click();
	await deleteConfirm(actor.page).click();
};

export const startEditingInvoice = async (actor: Actor) => {
	await editButton(actor.page).click();
};

export const openBuildingOfInvoice = async (actor: Actor) => {
	await buildingLink(actor.page).click();
};

export const recategorizeInvoice = async (actor: Actor) => {
	await recategorizeButton(actor.page).click();
};
