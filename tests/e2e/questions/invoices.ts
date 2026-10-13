import { Count, Text, Visibility } from '../screenplay/questions';
import { invoiceRow, invoiceRows, invoicesEmptyNotice, rowAmount, rowCategory, rowStatus } from '../targets/invoices';

export const listedInvoicesOf = (supplier: string) => Count.of(invoiceRow(supplier));
export const listedInvoiceCount = Count.of(invoiceRows);
export const amountOfListedInvoice = (supplier: string) => Text.of(rowAmount(supplier));
export const categoryOfListedInvoice = (supplier: string) => Text.of(rowCategory(supplier));
export const statusOfListedInvoice = (supplier: string) => Text.of(rowStatus(supplier));
export const invoiceListEmpty = Visibility.of(invoicesEmptyNotice);
