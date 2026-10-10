import type { Actor } from '../fixtures/actor';
import {
	editInvoiceButton,
	invoiceBuildingFilter,
	invoiceYearFilter,
	invoiceSearchButton,
	invoiceSearchInput,
	invoiceValidityFilter,
	newInvoiceButton,
	viewInvoiceButton
} from '../interactions/invoices';

export const searchInvoices = (term: string) => async (actor: Actor) => {
	await invoiceSearchInput(actor.page).fill(term);
	await invoiceSearchButton(actor.page).click();
	// the search navigates on the client; the next step must act on its result, not on the old list
	await actor.page.waitForURL((url) => url.searchParams.get('search') === term);
};

export const filterInvoices = (filter: { buildingId: string; validity?: 'valid' | 'invalid'; year?: string }) => async (actor: Actor) => {
	await invoiceBuildingFilter(actor.page).selectOption(filter.buildingId);
	if (filter.year) await invoiceYearFilter(actor.page).selectOption(filter.year);
	if (filter.validity) await invoiceValidityFilter(actor.page).selectOption(filter.validity);
	await invoiceSearchButton(actor.page).click();
};

export const startNewInvoice = async (actor: Actor) => {
	await newInvoiceButton(actor.page).click();
};

export const viewInvoice = (supplier: string) => async (actor: Actor) => {
	await viewInvoiceButton(actor.page, supplier).click();
};

export const editInvoice = (supplier: string) => async (actor: Actor) => {
	await editInvoiceButton(actor.page, supplier).click();
};
