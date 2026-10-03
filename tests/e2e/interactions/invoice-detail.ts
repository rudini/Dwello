import type { Page } from '@playwright/test';

export const amount = (page: Page) => page.getByTestId('invoice-amount');
export const category = (page: Page) => page.getByTestId('invoice-category');
export const distributionKey = (page: Page) => page.getByTestId('invoice-distribution-key');
export const utilityCost = (page: Page) => page.getByTestId('invoice-utility-cost');
export const legalNote = (page: Page) => page.getByTestId('invoice-legal-note');
export const editButton = (page: Page) => page.getByTestId('invoice-edit-button');
export const deleteButton = (page: Page) => page.getByTestId('invoice-delete-button');
export const deleteConfirm = (page: Page) => page.getByTestId('invoice-delete-confirm');
export const buildingLink = (page: Page) => page.getByTestId('invoice-building-link');
