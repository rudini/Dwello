import { target } from '../screenplay/target';

// The address search of «Neues Gebäude» and the Wohnungen it takes from the Gebäuderegister (#479)
export const registerSearchInput = target('Adresse suchen', (page) => page.getByTestId('building-address-search-input'));
export const firstRegisterResult = target('erster Treffer der Adresssuche', (page) =>
	page.getByTestId('building-address-result-0')
);
export const registerSection = target('Angaben aus dem Gebäuderegister', (page) => page.getByTestId('building-register'));
export const registerNotice = target('Hinweis zum Gebäuderegister', (page) => page.getByTestId('building-register-notice'));
export const existingBuildingLink = target('schon erfasstes Gebäude', (page) =>
	page.getByTestId('building-register-existing-link')
);
export const registerApartmentsHelp = target('Hilfe zu den Wohnungen aus dem Gebäuderegister', (page) =>
	page.getByTestId('building-register-apartments-help')
);
export const registerApartmentNumbers = target('Wohnungsnummern aus dem Gebäuderegister', (page) =>
	page.getByTestId(/^register-apartment-number-\d+$/)
);

type ApartmentField = 'number' | 'floor' | 'area' | 'rooms';
export const registerApartmentField = (field: ApartmentField, index: number) =>
	target(`${field} der ${index + 1}. Wohnung aus dem Gebäuderegister`, (page) =>
		page.getByTestId(`register-apartment-${field}-${index}`)
	);
export const registerApartmentNote = (field: ApartmentField, index: number) =>
	target(`Hinweis bei ${field} der ${index + 1}. Wohnung`, (page) =>
		page.getByTestId(`register-apartment-${field}-note-${index}`)
	);
export const registerRoomsHelp = (index: number) =>
	target(`Hilfe zur Zimmeranzahl der ${index + 1}. Wohnung`, (page) =>
		page.getByTestId(`register-apartment-rooms-help-${index}`)
	);
export const registerApartmentIncluded = (index: number) =>
	target(`${index + 1}. Wohnung übernehmen`, (page) => page.getByTestId(`register-apartment-include-${index}`));
export const buildingApartmentRows = target('Wohnungszeilen der Gebäudeseite', (page) =>
	page.getByTestId(/^apartment-row-/)
);
