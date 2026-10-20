import type { Activity } from '../screenplay/actor';
import { Click, Enter, EnterDate, Navigate, Select } from '../screenplay/interactions';
import {
	amountInput,
	buildingSelect,
	categorySelect,
	descriptionInput,
	invoiceDateInput,
	invoiceNumberInput,
	invoiceSubmitButton,
	keySelect,
	overrideReasonInput,
	supplierInput
} from '../targets/invoice-form';

export type InvoiceData = { buildingId: string; supplier: string; amount: string; description: string; category: string };

export const openNewInvoice = Navigate.to('/invoices/new');
export const openInvoiceEdit = (invoiceId: string) => Navigate.to(`/invoices/${invoiceId}/edit`);

export const chooseCategory = (category: string) => Select.option({ label: category }).from(categorySelect);
export const chooseBuilding = (buildingId: string) => Select.option(buildingId).from(buildingSelect);
export const saveInvoice = Click.on(invoiceSubmitButton);

export const chooseKey = (key: string) => Select.option({ label: key }).from(keySelect);
const clearKey = Select.option('').from(keySelect);

export const chooseCategoryIn = (buildingId: string, category: string): Activity => (actor) =>
	actor.attemptsTo(Select.option(buildingId).from(buildingSelect), chooseCategory(category));

const fillInvoice = (invoice: InvoiceData): Activity => (actor) =>
	actor.attemptsTo(
		Select.option(invoice.buildingId).from(buildingSelect),
		Enter.theValue(invoice.amount).into(amountInput),
		Enter.theValue(invoice.supplier).into(supplierInput),
		Enter.theValue(invoice.description).into(descriptionInput),
		chooseCategory(invoice.category),
		// every invoice has a key (#379); the settings' default is shared by parallel scenarios, so it is chosen here
		chooseKey('Pro Fläche (m²)')
	);

export const registerInvoice = (invoice: InvoiceData): Activity => (actor) => actor.attemptsTo(fillInvoice(invoice), saveInvoice);

export const registerInvoiceWithoutKey = (invoice: InvoiceData): Activity => (actor) =>
	actor.attemptsTo(fillInvoice(invoice), clearKey, saveInvoice);

export const saveWithoutKey: Activity = (actor) => actor.attemptsTo(clearKey, saveInvoice);

export const correctAmount = (amount: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(amount).into(amountInput), saveInvoice);

export const recategorize = (category: string): Activity => (actor) => actor.attemptsTo(chooseCategory(category), saveInvoice);

export const overrideCategory = (category: string, reason: string): Activity => (actor) =>
	actor.attemptsTo(chooseCategory(category), Enter.theValue(reason).into(overrideReasonInput), saveInvoice);

export const clearSupplier: Activity = (actor) => actor.attemptsTo(Enter.theValue('').into(supplierInput), saveInvoice);

// Types key by key, as a person on a phone's number pad does, then leaves the field
export const typeInvoiceDate = (text: string) => Enter.keyByKey(text).intoAndLeave(invoiceDateInput);

export const enterInvoiceDate = (date: string) => EnterDate.of(date).into(invoiceDateInput);
export const correctInvoiceNumber = (number: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(number).into(invoiceNumberInput), saveInvoice);
// the Kategorie emptied, then saved: refused, the Kategorie is required (#245)
export const clearCategory: Activity = (actor) => actor.attemptsTo(Select.option('').from(categorySelect), saveInvoice);
