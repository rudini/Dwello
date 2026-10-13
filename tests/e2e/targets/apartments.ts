import { target } from '../screenplay/target';

export const apartmentBuildingFilter = target('Gebäudefilter', (page) => page.getByTestId('apartments-building-filter'));
export const apartmentStatusFilter = target('Statusfilter', (page) => page.getByTestId('apartments-status-filter'));
export const apartmentSearchButton = target('Wohnungen suchen', (page) => page.getByTestId('apartments-search-submit'));
export const newApartmentButton = target('Neue Wohnung', (page) => page.getByTestId('apartments-new-button'));
export const apartmentCards = target('Wohnungskarten', (page) => page.getByTestId(/^apartment-card-/));
export const apartmentCard = (number: string) =>
	target(`Wohnungskarte «${number}»`, (page) => apartmentCards.locate(page).filter({ hasText: `Wohnung ${number}` }));
export const apartmentStatus = (number: string) =>
	target(`Status der Wohnung «${number}»`, (page) => apartmentCard(number).locate(page).getByTestId('apartment-status'));
