import { target } from '../screenplay/target';

// The setup on the first visit (#577) and the KI model's download on the overview
export const setupCodeInput = target('Einrichtungscode', (page) => page.getByTestId('setup-code-input'));
export const setupEmailInput = target('E-Mail-Adresse des neuen Kontos', (page) => page.getByTestId('setup-email-input'));
export const setupPasswordInput = target('Passwort des neuen Kontos', (page) => page.getByTestId('setup-password-input'));
export const setupPasswordRepeatInput = target('Passwort wiederholen', (page) => page.getByTestId('setup-password-repeat-input'));
export const setupSubmitButton = target('Dwello einrichten', (page) => page.getByTestId('setup-submit'));
export const setupError = target('Fehler der Einrichtung', (page) => page.getByTestId('setup-error'));
export const setupPrivacyLink = target('Datenschutzerklärung der Einrichtung', (page) => page.getByTestId('setup-privacy-link'));
export const setupTermsLink = target('Nutzungsbedingungen der Einrichtung', (page) => page.getByTestId('setup-terms-link'));
export const kiModelLoading = target('Hinweis zum Laden des KI-Modells', (page) => page.getByTestId('ki-model-loading'));
// #620: the KI chosen at the setup, and the overview's way to the page «KI»
export const setupKiChoice = (choice: 'local' | 'none') =>
	target(`Wahl der KI bei der Einrichtung (${choice})`, (page) => page.getByTestId(`setup-ki-${choice}`));
export const overviewKiLink = target('Link zur KI in der Übersicht', (page) => page.getByTestId('ki-settings-link'));
