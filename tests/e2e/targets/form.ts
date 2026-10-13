import { target } from '../screenplay/target';

export const cancelButton = target('Abbrechen', (page) => page.getByTestId('form-cancel'));
export const formError = (text: string) =>
	target(`Fehlermeldung «${text}»`, (page) => page.getByTestId('form-error').filter({ hasText: text }));
// Confirm button of any delete dialog (contract-delete-confirm, tenant-delete-confirm, ...)
export const deleteConfirmButton = target('Löschen bestätigen', (page) => page.getByTestId(/-delete-confirm$/));
export const successToast = target('Erfolgsmeldung', (page) => page.getByTestId('toast-success'));
export const errorToast = target('Fehlermeldung', (page) => page.getByTestId('toast-error'));
