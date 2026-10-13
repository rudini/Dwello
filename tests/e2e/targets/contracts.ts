import { target } from '../screenplay/target';

export const contractRow = (tenantName: string) =>
	target(`Mietvertrag von ${tenantName} in der Liste`, (page) =>
		page.getByTestId(/^contract-row-/).filter({ hasText: tenantName })
	);
export const contractRows = target('Mietverträge in der Liste', (page) => page.getByTestId(/^contract-row-/));
export const contractSearchInput = target('Suche Mietverträge', (page) => page.getByTestId('contract-search-input'));
export const contractSearchButton = target('Suchen', (page) => page.getByTestId('contract-search-submit'));
export const contractBuildingFilter = target('Filter Gebäude', (page) => page.getByTestId('contract-building-filter'));
export const contractStatusFilter = target('Filter Status', (page) => page.getByTestId('contract-status-filter'));
export const newContractButton = target('Neuer Mietvertrag', (page) => page.getByTestId('contract-new-button'));
export const viewContractButton = (tenantName: string) =>
	target(`Mietvertrag von ${tenantName} ansehen`, (page) =>
		contractRow(tenantName).locate(page).getByTestId('contract-view-button')
	);
export const editContractButton = (tenantName: string) =>
	target(`Mietvertrag von ${tenantName} bearbeiten`, (page) =>
		contractRow(tenantName).locate(page).getByTestId('contract-edit-button')
	);
export const contractsEmptyNotice = target('Hinweis keine Mietverträge', (page) => page.getByTestId('contracts-empty'));
// An amount of a listed contract by its label ("Nettomiete", "Monatlich total")
export const contractAmount = (tenantName: string, label: string) =>
	target(`${label} im Mietvertrag von ${tenantName}`, (page) =>
		contractRow(tenantName).locate(page).locator(`dt:text-is("${label}") + dd`)
	);
