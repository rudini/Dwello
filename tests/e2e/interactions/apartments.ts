import type { Page } from '@playwright/test';

export const apartmentBuildingFilter = (page: Page) => page.getByTestId('apartments-building-filter');
export const apartmentStatusFilter = (page: Page) => page.getByTestId('apartments-status-filter');
export const apartmentSearchButton = (page: Page) => page.getByTestId('apartments-search-submit');
export const newApartmentButton = (page: Page) => page.getByTestId('apartments-new-button');
export const apartmentCards = (page: Page) => page.getByTestId(/^apartment-card-/);
export const apartmentCard = (page: Page, number: string) =>
	apartmentCards(page).filter({ hasText: `Wohnung ${number}` });
export const apartmentStatus = (page: Page, number: string) =>
	apartmentCard(page, number).getByTestId('apartment-status');
// The filter navigates on the client; the list is filtered once the URL carries the building
export const filteredBy = (page: Page, buildingId: string) =>
	page.waitForURL((url) => url.searchParams.get('building') === buildingId);
