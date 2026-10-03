import type { Page } from '@playwright/test';

export const buildingCard = (page: Page, name: string) =>
	page.getByTestId(/^building-card-/).filter({ hasText: name });
export const buildingCards = (page: Page) => page.getByTestId(/^building-card-/);
export const searchInput = (page: Page) => page.getByTestId('building-search-input');
export const searchButton = (page: Page) => page.getByTestId('building-search-submit');
export const cityFilterInput = (page: Page) => page.getByTestId('building-city-filter');
export const emptyListNotice = (page: Page) => page.getByTestId('buildings-empty');
export const newBuildingButton = (page: Page) => page.getByTestId('building-new-button');
export const routeLink = (page: Page, name: string) =>
	buildingCard(page, name).getByTestId('building-route-link');
