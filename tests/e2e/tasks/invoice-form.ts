import type { Actor } from '../fixtures/actor';
import {
	amountInput,
	buildingSelect,
	categorySelect,
	descriptionInput,
	invoiceSubmitButton,
	overrideReasonInput,
	supplierInput
} from '../interactions/invoice-form';

export type InvoiceData = { buildingId: string; supplier: string; amount: string; description: string; category: string };

export const chooseCategory = (category: string) => async (actor: Actor) => {
	await categorySelect(actor.page).selectOption({ label: category });
};

export const saveInvoice = async (actor: Actor) => {
	await invoiceSubmitButton(actor.page).click();
};

export const registerInvoice = (invoice: InvoiceData) => async (actor: Actor) => {
	await buildingSelect(actor.page).selectOption(invoice.buildingId);
	await amountInput(actor.page).fill(invoice.amount);
	await supplierInput(actor.page).fill(invoice.supplier);
	await descriptionInput(actor.page).fill(invoice.description);
	await actor.perform(chooseCategory(invoice.category));
	await actor.perform(saveInvoice);
};

export const correctAmount = (amount: string) => async (actor: Actor) => {
	await amountInput(actor.page).fill(amount);
	await actor.perform(saveInvoice);
};

export const recategorize = (category: string) => async (actor: Actor) => {
	await actor.perform(chooseCategory(category));
	await actor.perform(saveInvoice);
};

export const overrideCategory = (category: string, reason: string) => async (actor: Actor) => {
	await actor.perform(chooseCategory(category));
	await overrideReasonInput(actor.page).fill(reason);
	await actor.perform(saveInvoice);
};

export const clearSupplier = async (actor: Actor) => {
	await supplierInput(actor.page).fill('');
	await actor.perform(saveInvoice);
};
