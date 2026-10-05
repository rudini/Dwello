import type { Page } from '@playwright/test';

export const profileCard = (page: Page, name: string) =>
	page.getByTestId('heating-profile-card').filter({ hasText: name });
export const nameInput = (page: Page) => page.getByTestId('heating-profile-name-input');
export const monthInput = (page: Page, month: string) =>
	page.getByTestId(`heating-profile-month-${month}`);
export const submitButton = (page: Page) => page.getByTestId('heating-profile-submit');
export const monthShare = (page: Page, month: string) =>
	page.getByTestId(`heating-profile-share-${month}`);
export const profileTotal = (page: Page) => page.getByTestId('heating-profile-total');
export const editButton = (page: Page) => page.getByTestId('heating-profile-edit-button');
export const deleteButton = (page: Page) => page.getByTestId('heating-profile-delete-button');
export const confirmDeleteButton = (page: Page) =>
	page.getByTestId('heating-profile-delete-confirm');
