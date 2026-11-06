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
