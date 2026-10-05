import type { Actor } from '../fixtures/actor';
import { invoiceRow, invoiceRows, rowAmount, rowCategory, rowStatus } from '../interactions/invoices';

export const listedInvoice = (actor: Actor, supplier: string) => invoiceRow(actor.page, supplier);
export const allListedInvoices = (actor: Actor) => invoiceRows(actor.page);
export const amountOfListedInvoice = (actor: Actor, supplier: string) => rowAmount(actor.page, supplier);
export const categoryOfListedInvoice = (actor: Actor, supplier: string) => rowCategory(actor.page, supplier);
export const statusOfListedInvoice = (actor: Actor, supplier: string) => rowStatus(actor.page, supplier);
