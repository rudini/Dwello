import { target } from '../screenplay/target';

export const apartmentBuildingFilter = target('Gebäudefilter', (page) => page.getByTestId('apartments-building-filter'));
export const apartmentStatusFilter = target('Statusfilter', (page) => page.getByTestId('apartments-status-filter'));
export const apartmentSearchInput = target('Wohnungssuche', (page) => page.getByTestId('apartments-search-input'));
export const apartmentSearchHelpText = target('Hilfe zur Wohnungssuche', (page) => page.getByTestId('apartments-search-help'));
export const apartmentSearchButton = target('Wohnungen suchen', (page) => page.getByTestId('apartments-search-submit'));
export const newApartmentButton = target('Neue Wohnung', (page) => page.getByTestId('apartments-new-button'));
export const apartmentCards = target('Wohnungskarten', (page) => page.getByTestId(/^apartment-card-/));
export const apartmentCard = (number: string) =>
	target(`Wohnungskarte «${number}»`, (page) => apartmentCards.locate(page).filter({ hasText: `Wohnung ${number}` }));
export const apartmentStatus = (number: string) =>
	target(`Status der Wohnung «${number}»`, (page) => apartmentCard(number).locate(page).getByTestId('apartment-status'));
export const apartmentEmptyNotice = target('Hinweis leere Wohnungsliste', (page) => page.getByTestId('apartments-empty'));
export const showAllApartmentsLink = target('Alle Wohnungen anzeigen', (page) => page.getByTestId('apartments-show-all'));
// #664: the move-out of the apartment's latest ended contract until its final statement exists
export const apartmentMoveOut = (number: string) =>
	target(`Auszug der Wohnung «${number}»`, (page) => apartmentCard(number).locate(page).getByTestId('apartment-move-out'));
// #670: the heading above the list that names the apartments shown and the page
export const apartmentResultsHeading = target('Überschrift der Wohnungsliste', (page) => page.getByTestId('list-results'));
export const apartmentBuildingOptions = target('Gebäude zur Wahl', (page) => apartmentBuildingFilter.locate(page).getByRole('option'));
