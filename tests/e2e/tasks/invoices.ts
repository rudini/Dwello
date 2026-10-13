import type { Activity } from '../screenplay/actor';
import { Click, Enter, Navigate, Select, Wait } from '../screenplay/interactions';
import {
	editInvoiceButton,
	invoiceBuildingFilter,
	invoiceYearFilter,
	invoiceSearchButton,
	invoiceSearchInput,
	invoiceValidityFilter,
	newInvoiceButton,
	viewInvoiceButton
} from '../targets/invoices';

export const openInvoiceList = Navigate.to('/invoices');

export const searchInvoices =(term: string): Activity => (actor) =>
	actor.attemptsTo(
		Enter.theValue(term).into(invoiceSearchInput),
		Click.on(invoiceSearchButton),
		// the search navigates on the client; the next step must act on its result, not on the old list
		Wait.forUrl((url) => url.searchParams.get('search') === term)
	);

export const filterInvoices =
	(filter: { buildingId: string; validity?: 'valid' | 'invalid'; year?: string }): Activity =>
	async (actor) => {
		await actor.attemptsTo(Select.option(filter.buildingId).from(invoiceBuildingFilter));
		if (filter.year) await actor.attemptsTo(Select.option(filter.year).from(invoiceYearFilter));
		if (filter.validity) await actor.attemptsTo(Select.option(filter.validity).from(invoiceValidityFilter));
		await actor.attemptsTo(Click.on(invoiceSearchButton));
	};

export const startNewInvoice = Click.on(newInvoiceButton);
export const viewInvoice = (supplier: string) => Click.on(viewInvoiceButton(supplier));
export const editInvoice = (supplier: string) => Click.on(editInvoiceButton(supplier));
