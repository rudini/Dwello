import type { Page } from '@playwright/test';

export const invoiceRow = (page: Page, supplier: string) => page.getByTestId(/^invoice-row-/).filter({ hasText: supplier });
export const invoiceRows = (page: Page) => page.getByTestId(/^invoice-row-/);
export const invoiceSearchInput = (page: Page) => page.getByTestId('invoice-search-input');
export const invoiceSearchButton = (page: Page) => page.getByTestId('invoice-search-submit');
export const invoiceBuildingFilter = (page: Page) => page.getByTestId('invoice-building-filter');
export const invoiceValidityFilter = (page: Page) => page.getByTestId('invoice-validity-filter');
export const newInvoiceButton = (page: Page) => page.getByTestId('invoice-new-button');
export const viewInvoiceButton = (page: Page, supplier: string) => invoiceRow(page, supplier).getByTestId('invoice-view-button');
export const editInvoiceButton = (page: Page, supplier: string) => invoiceRow(page, supplier).getByTestId('invoice-edit-button');
export const rowAmount = (page: Page, supplier: string) => invoiceRow(page, supplier).getByTestId('invoice-amount');
export const rowCategory = (page: Page, supplier: string) => invoiceRow(page, supplier).getByTestId('invoice-category');
export const rowStatus = (page: Page, supplier: string) => invoiceRow(page, supplier).getByTestId('invoice-status');
export const invoicesEmptyNotice = (page: Page) => page.getByTestId('invoices-empty');
