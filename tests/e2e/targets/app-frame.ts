import { target } from '../screenplay/target';

// The link text also holds the icon name, so match the label element exactly
export const mainNavLink = (label: string) =>
	target(`Hauptnavigation «${label}»`, (page) =>
		page.getByTestId('main-nav-link').filter({ has: page.getByText(label, { exact: true }) })
	);
export const currentNavItem = target('Markierter Eintrag der Hauptnavigation', (page) =>
	page.getByRole('navigation', { name: 'Hauptnavigation' }).locator('[aria-current="page"]')
);
export const logo = target('Logo', (page) => page.getByTestId('header-logo'));
export const userMenuButton = target('Benutzermenü', (page) => page.getByTestId('user-menu-button'));
export const userMenuSettings = target('Einstellungen', (page) => page.getByTestId('user-menu-settings'));
export const footerLink = (label: string) =>
	target(`Fusszeile «${label}»`, (page) => page.getByTestId('footer-link').filter({ hasText: label }));
export const footerVersion = target('Version in der Fusszeile', (page) => page.getByTestId('footer-version'));
export const pageSection = (heading: string) =>
	target(`Abschnitt «${heading}»`, (page) =>
		page.getByTestId('page-section').filter({ has: page.getByRole('heading', { name: heading, exact: true }) })
	);
const inSection = (heading: string, description: string, testId: string) =>
	target(`${description} im Abschnitt «${heading}»`, (page) => pageSection(heading).locate(page).getByTestId(testId));
/** Who receives invoice data for the KI categorization, as the privacy statement names it */
export const llmRecipient = (heading: string) => inSection(heading, 'Empfänger der Rechnungsdaten', 'llm-recipient');
/** Where unsaved wizard input stays, as the privacy statement says */
export const draftNotice = (heading: string) => inSection(heading, 'Hinweis auf Entwürfe', 'draft-notice');
/** Who runs this installation, as the terms of use name them */
export const operatorNotice = (heading: string) => inSection(heading, 'Betreiber', 'terms-operator');
export const pageTitle = target('Seitentitel', (page) => page.getByRole('heading', { level: 1 }));
export const termsLinkOnLogin = target('Nutzungsbedingungen', (page) => page.getByTestId('login-terms-link'));
export const publicLoginLink = target('Zur Anmeldung', (page) => page.getByTestId('public-login-link'));
export const publicHelpLink = target('Zur Hilfe', (page) => page.getByTestId('public-help-link'));
