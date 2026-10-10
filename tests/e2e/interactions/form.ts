import type { Page } from '@playwright/test';

export const cancelButton = (page: Page) => page.getByTestId('form-cancel');
export const formError = (page: Page, text: string) => page.getByTestId('form-error').filter({ hasText: text });
// Confirm button of any delete dialog (contract-delete-confirm, tenant-delete-confirm, ...)
export const deleteConfirmButton = (page: Page) => page.getByTestId(/-delete-confirm$/);
import type { Locator } from '@playwright/test';

/** Types a date the Swiss way (TT.MM.JJJJ) into a date field; scenarios keep JJJJ-MM-TT, or '' to empty the field */
export async function typeDate(field: Locator, isoDate: string) {
	const [year, month, day] = isoDate.split('-');
	await field.fill('');
	if (isoDate) await field.pressSequentially(`${day}.${month}.${year}`); // key by key, as a user types it
	await field.blur();
}
