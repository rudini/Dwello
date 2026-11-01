import { target } from '../screenplay/target';

// The link text also holds the icon name, so match the label element exactly
export const mainNavLink = (label: string) =>
	target(`Hauptnavigation «${label}»`, (page) =>
		page.getByTestId('main-nav-link').filter({ has: page.getByText(label, { exact: true }) })
	);
/** A link of the main menu in the drawer of a narrow window */
export const mobileNavLink = (label: string) =>
	target(`Menü «${label}»`, (page) =>
		page
			.getByRole('dialog', { name: 'Hauptnavigation' })
			.getByTestId('main-nav-link')
			.filter({ has: page.getByText(label, { exact: true }) })
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
/** The links of a section, e.g. to a provider's privacy policy */
export const sectionLinks = (heading: string) =>
	target(`Links im Abschnitt «${heading}»`, (page) => pageSection(heading).locate(page).getByRole('link'));
/** Where unsaved wizard input stays, as the privacy statement says */
export const draftNotice = (heading: string) => inSection(heading, 'Hinweis auf Entwürfe', 'draft-notice');
/** Who runs this installation, as the terms of use name them */
export const operatorNotice = (heading: string) => inSection(heading, 'Betreiber', 'terms-operator');
export const pageTitle = target('Seitentitel', (page) => page.getByRole('heading', { level: 1 }));
export const pagePurpose = target('Zweck der Seite unter dem Titel', (page) => page.getByTestId('page-purpose'));
/** When the privacy statement or the terms of use last changed */
export const legalAsOf = target('Stand der Seite', (page) => page.getByTestId('legal-as-of'));
/** A link in the terms of use to a section of the privacy statement the landlord passes on */
export const privacySectionLinkInTerms = (heading: string) =>
	target(`Link auf den Abschnitt «${heading}»`, (page) =>
		page.getByTestId('terms-privacy-section-link').filter({ hasText: heading })
	);
export const termsLinkOnLogin = target('Nutzungsbedingungen', (page) => page.getByTestId('login-terms-link'));
export const privacyLinkOnLogin = target('Datenschutz', (page) => page.getByTestId('login-privacy-link'));
export const publicLoginLink = target('Zur Anmeldung', (page) => page.getByTestId('public-login-link'));
export const publicHelpLink = target('Zur Hilfe', (page) => page.getByTestId('public-help-link'));
export const helpContentsLink = (label: string) =>
	target(`Inhalt der Hilfe «${label}»`, (page) =>
		page.getByTestId('help-contents').getByRole('link', { name: label, exact: true })
	);
export const glossaryExplanation = (term: string) =>
	target(`Erklärung von «${term}» in den Begriffen`, (page) =>
		page
			.getByTestId('glossary-entry')
			.filter({ has: page.getByTestId('glossary-term').getByText(term, { exact: true }) })
			.getByTestId('glossary-explanation')
	);

export const errorPageToOverview = target('Zur Übersicht auf der Fehlerseite', (page) =>
	page.getByTestId('error-to-overview')
);
