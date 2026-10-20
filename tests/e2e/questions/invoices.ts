import { Count, Text, Value, Visibility } from '../screenplay/questions';
import {
	invoiceBuildingFilter,
	invoiceRow,
	invoiceRows,
	invoicePeriodFilter,
	invoicesEmptyNotice,
	invoiceYearFilter,
	rowAmount,
	rowCategory,
	rowStatus
} from '../targets/invoices';

export const listedInvoicesOf = (supplier: string) => Count.of(invoiceRow(supplier));
export const listedInvoiceCount = Count.of(invoiceRows);
export const amountOfListedInvoice = (supplier: string) => Text.of(rowAmount(supplier));
export const categoryOfListedInvoice = (supplier: string) => Text.of(rowCategory(supplier));
export const statusOfListedInvoice = (supplier: string) => Text.of(rowStatus(supplier));
export const invoiceListEmpty = Visibility.of(invoicesEmptyNotice);
export const chosenInvoiceBuilding = Value.chosenIn(invoiceBuildingFilter);
export const chosenInvoiceYear = Value.chosenIn(invoiceYearFilter);
export const invoicePeriodFilterText = Text.of(invoicePeriodFilter);
export const invoiceShown = (description: string) => Visibility.of(invoiceRow(description));
