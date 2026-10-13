import { target } from '../screenplay/target';

export const buildingCards = target('Gebäudekarten', (page) => page.getByTestId(/^building-card-/));
export const buildingCard = (name: string) =>
	target(`Gebäudekarte «${name}»`, (page) => buildingCards.locate(page).filter({ hasText: name }));
export const searchInput = target('Gebäudesuche', (page) => page.getByTestId('building-search-input'));
export const searchButton = target('Gebäude suchen', (page) => page.getByTestId('building-search-submit'));
export const cityFilterInput = target('Ortsfilter', (page) => page.getByTestId('building-city-filter'));
export const emptyListNotice = target('Hinweis leere Gebäudeliste', (page) => page.getByTestId('buildings-empty'));
export const newBuildingButton = target('Neues Gebäude', (page) => page.getByTestId('building-new-button'));
export const routeLink = (name: string) =>
	target(`Route zu «${name}»`, (page) => buildingCard(name).locate(page).getByTestId('building-route-link'));
