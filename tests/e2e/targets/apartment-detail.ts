import { target } from '../screenplay/target';

export type ApartmentInfo = 'status' | 'rooms' | 'floor' | 'area';

export const infoCard = (info: ApartmentInfo) =>
	target(`Angabe ${info} der Wohnung`, (page) => page.getByTestId(`apartment-info-${info}`));
export const currentTenantName = target('Aktueller Mieter', (page) => page.getByTestId('current-tenant-name'));
export const tenantProfileButton = target('Profil des Mieters', (page) => page.getByTestId('current-tenant-profile'));
export const monthlyTotal = target('Monatliche Kosten brutto', (page) => page.getByTestId('monthly-costs-total'));
export const vacancyNote = target('Hinweis nicht vermietet', (page) => page.getByTestId('apartment-vacant'));
export const nextTenantNote = target('Hinweis nächster Mieter', (page) => page.getByTestId('apartment-next-tenant'));
export const editButton = target('Wohnung bearbeiten', (page) => page.getByTestId('apartment-edit-button'));
export const currentContracts = target('Laufende und künftige Mietverträge', (page) =>
	page.getByTestId('contract-history-current')
);
export const earlierContracts = target('Frühere Mietverträge', (page) => page.getByTestId('contract-history-earlier'));
export const earlierContract = (name: string) =>
	target(`Früherer Mietvertrag von ${name}`, (page) =>
		earlierContracts.locate(page).getByTestId('contract-history-row').filter({ hasText: name })
	);
export const historyRows = target('Vertragshistorie', (page) => page.getByTestId('contract-history-row'));
export const historyLink = (label: string) =>
	target(`Mietvertrag «${label}» in der Historie`, (page) =>
		page.getByTestId('contract-history-link').filter({ hasText: label })
	);
