import { target } from '../screenplay/target';

export const cancelButton = target('Abbrechen', (page) => page.getByTestId('form-cancel'));
// the one error message of a refused save, with its title (#667)
export const formErrors = target('Fehlermeldung', (page) => page.getByTestId('form-error'));
export const formError = (text: string) =>
	target(`Fehlermeldung «${text}»`, (page) => page.getByTestId('form-error').filter({ hasText: text }));
// Confirm button of any delete dialog (contract-delete-confirm, tenant-delete-confirm, ...)
export const deleteConfirmButton = target('Löschen bestätigen', (page) => page.getByTestId(/-delete-confirm$/));
export const successToast = target('Erfolgsmeldung', (page) => page.getByTestId('toast-success'));
export const errorToast = target('Fehlermeldung', (page) => page.getByTestId('toast-error'));
export const errorToastClose = target('Meldung schliessen', (page) => errorToast.locate(page).getByRole('button'));
export const successToastClose = target('Meldung schliessen der Erfolgsmeldung', (page) => successToast.locate(page).getByRole('button'));
export const warningToast = target('Warnung', (page) => page.getByTestId('toast-warning'));
// #669: what «Erneut versuchen» says once the contracts are loaded, a success or, for an overlap, a warning
export const loadedToast = target('Meldung nach dem Laden', (page) => page.getByTestId(/^toast-(success|warning)$/));
export const warningToastClose = target('Meldung schliessen der Warnung', (page) => warningToast.locate(page).getByRole('button'));
