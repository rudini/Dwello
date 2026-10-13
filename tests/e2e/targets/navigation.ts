import { target } from '../screenplay/target';

export const breadcrumbLink = (label: string) =>
	target(`Breadcrumb «${label}»`, (page) => page.getByTestId('breadcrumb-link').filter({ hasText: label }));
