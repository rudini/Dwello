import { target } from '../screenplay/target';

export const breadcrumbLink = (label: string) =>
	target(`Breadcrumb «${label}»`, (page) => page.getByTestId('breadcrumb-link').filter({ hasText: label }));
// the buttons and links of the page header (PageHeader's action snippet)
export const pageActions = target('Aktionen der Seite', (page) =>
	page.getByTestId('page-header-actions').locator(':is(a, button)')
);
