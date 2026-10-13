import { target } from '../screenplay/target';

export const reminderButton = target('Mahnung senden', (page) => page.getByTestId('statement-reminder-button'));
export const confirmReminderButton = target('Mahnung bestätigen', (page) => page.getByTestId('statement-reminder-confirm'));
export const reminderFeedback = target('Rückmeldung Mahnung', (page) => page.getByTestId('reminder-feedback'));
export const documentRow = (title: string, tenantName = '') =>
	target(`Dokument «${title}» ${tenantName}`.trim(), (page) =>
		page.getByTestId('document-row').filter({ hasText: title }).filter({ hasText: tenantName })
	);
export const documentStatus = (title: string) =>
	target(`Versandstatus «${title}»`, (page) => documentRow(title).locate(page).getByTestId('document-status'));
export const markSentButton = (title: string, tenantName: string) =>
	target(`«${title}» an ${tenantName} als versendet markieren`, (page) =>
		documentRow(title, tenantName).locate(page).getByTestId('document-mark-sent')
	);
