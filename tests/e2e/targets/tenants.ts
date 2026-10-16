import { target } from '../screenplay/target';

export const tenantSearchInput = target('Mietersuche', (page) => page.getByTestId('tenants-search-input'));
export const tenantSearchButton = target('Mieter suchen', (page) => page.getByTestId('tenants-search-submit'));
export const newTenantButton = target('Neuer Mieter', (page) => page.getByTestId('tenants-new-button'));
export const tenantCards = target('Mieterkarten', (page) => page.getByTestId(/^tenant-card-/));
export const tenantCard = (name: string) =>
	target(`Mieterkarte «${name}»`, (page) => tenantCards.locate(page).filter({ hasText: name }));
export const tenantStatusFilter = target('Statusfilter Mieter', (page) => page.getByTestId('tenants-status-filter'));
export const tenantStatusBadge = (name: string) =>
	target(`Mieterstatus bei «${name}»`, (page) => tenantCard(name).locate(page).getByTestId('tenant-status'));
export const tenantsEmptyNotice = target('Hinweis leere Mieterliste', (page) => page.getByTestId('tenants-empty'));
