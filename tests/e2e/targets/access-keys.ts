import { target } from '../screenplay/target';

export const accessKeysLink = target('Link zu den Zugangsschlüsseln', (page) =>
	page.getByTestId('quick-link-access-keys').getByRole('link')
);
export const createAccessKeyButton = target('Zugangsschlüssel erstellen', (page) => page.getByTestId('access-key-create-button'));
export const accessKeyNameInput = target('Name des Zugangsschlüssels', (page) => page.getByTestId('access-key-name-input'));
export const confirmCreateAccessKey = target('Erstellen bestätigen', (page) => page.getByTestId('access-key-create-confirm'));
export const newAccessKey = target('Neuer Zugangsschlüssel', (page) => page.getByTestId('access-key-new'));
export const newAccessKeyValue = target('Wert des neuen Zugangsschlüssels', (page) => page.getByTestId('access-key-new-value'));
export const newAccessKeyHint = target('Hinweis zum neuen Zugangsschlüssel', (page) => page.getByTestId('access-key-new-hint'));
export const closeNewAccessKey = target('Neuen Zugangsschlüssel schliessen', (page) => page.getByTestId('access-key-new-close'));
const row = (name: string) => (page: Parameters<Parameters<typeof target>[1]>[0]) =>
	page.getByTestId('access-key-row').filter({ has: page.getByTestId('access-key-name').getByText(name, { exact: true }) });
export const accessKeyRows = (name: string) => target(`Zugangsschlüssel «${name}»`, row(name));
export const revokeAccessKeyButton = (name: string) =>
	target(`Zugangsschlüssel «${name}» widerrufen`, (page) => row(name)(page).getByTestId('access-key-revoke-button'));
export const revokeAccessKeyMessage = target('Bestätigung Widerrufen', (page) => page.getByTestId('access-key-revoke-message'));
export const confirmRevokeAccessKey = target('Widerrufen bestätigen', (page) => page.getByTestId('access-key-revoke-confirm'));
export const newAccessKeySecret = target('Warnung zum neuen Zugangsschlüssel', (page) => page.getByTestId('access-key-new-secret'));
export const createAccessKeyRefusal = target('Ablehnung im Dialog zum Erstellen', (page) =>
	page.getByRole('dialog').getByTestId('form-error')
);
export const copyNewAccessKey = target('Neuen Zugangsschlüssel kopieren', (page) => page.getByTestId('access-key-new-copy'));
export const copyNewAccessKeyAddress = target('Adresse beim neuen Zugangsschlüssel kopieren', (page) =>
	page.getByTestId('access-key-new-address-copy')
);
// each copy adds a toast: the newest says what was copied last
export const lastSuccessToast = target('Letzte Erfolgsmeldung', (page) => page.getByTestId('toast-success').last());
