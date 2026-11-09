import { successToast } from '../targets/form';
import { Attribute, Count, Text, Value, Visibility } from '../screenplay/questions';
import {
	invoiceBuildingFilter,
	invoiceGroupOf,
	invoiceRow,
	invoiceRows,
	invoicePeriodFilter,
	invoicesEmptyNotice,
	invoiceYearFilter,
	rowAmount,
	rowCategory,
	rowInPeriod,
	rowStatus,
	rowUtilityCost,
	retentionHint
} from '../targets/invoices';

export const listedInvoicesOf = (supplier: string) => Count.of(invoiceRow(supplier));
export const listedInvoiceCount = Count.of(invoiceRows);
export const amountOfListedInvoice = (supplier: string) => Text.of(rowAmount(supplier));
export const categoryOfListedInvoice = (supplier: string) => Text.of(rowCategory(supplier));
export const utilityCostOfListedInvoice = (supplier: string) => Text.of(rowUtilityCost(supplier));
export const toneOfListedUtilityCost = (supplier: string) => Attribute.named('data-tone').of(rowUtilityCost(supplier));
export const statusOfListedInvoice = (supplier: string) => Text.of(rowStatus(supplier));
export const invoiceListEmpty = Visibility.of(invoicesEmptyNotice);
export const chosenInvoiceBuilding = Value.chosenIn(invoiceBuildingFilter);
export const chosenInvoiceYear = Value.chosenIn(invoiceYearFilter);
export const invoicePeriodFilterText = Text.of(invoicePeriodFilter);
export const groupOfListedInvoice = (supplier: string) => Text.of(invoiceGroupOf(supplier));
export const inPeriodOfListedInvoice = (supplier: string) => Text.of(rowInPeriod(supplier));
export const invoiceShown = (description: string) => Visibility.of(invoiceRow(description));
export const retentionHintText = Text.of(retentionHint);
export const keptMessage = Text.of(successToast);
