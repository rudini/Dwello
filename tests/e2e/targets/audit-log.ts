import { target } from '../screenplay/target';

export const auditLogLink = target('Link zum Protokoll', (page) => page.getByTestId('quick-link-audit-log').getByRole('link'));
export const auditLogCard = target('Karte zum Protokoll', (page) => page.getByTestId('quick-link-audit-log'));
const entry = (text: string) => (page: Parameters<Parameters<typeof target>[1]>[0]) =>
	page.getByTestId('audit-entry').filter({ has: page.getByTestId('audit-entry-text').getByText(text, { exact: true }) });
export const auditEntries = (text: string) => target(`Protokolleintrag «${text}»`, entry(text));
export const auditEntryDate = (text: string) =>
	target(`Datum des Protokolleintrags «${text}»`, (page) => entry(text)(page).getByTestId('audit-entry-date'));
export const deleteAuditEntryButton = (text: string) =>
	target(`Protokolleintrag «${text}» löschen`, (page) => entry(text)(page).getByTestId('audit-entry-delete-button'));
export const deleteAuditEntryMessage = target('Bestätigung Protokolleintrag löschen', (page) =>
	page.getByTestId('audit-entry-delete-message')
);
// the entries with this text on that day («01.11.2026»)
export const auditEntriesOn = (text: string, day: string) =>
	target(`Protokolleinträge «${text}» vom ${day}`, (page) =>
		entry(text)(page).filter({ has: page.getByTestId('audit-entry-date').getByText(day) })
	);
