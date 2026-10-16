import { target } from '../screenplay/target';

export const contractApartment = target('Wohnung des Mietvertrags', (page) => page.getByTestId('contract-apartment'));
export const contractTotalRent = target('Monatlicher Mietzins', (page) => page.getByTestId('contract-total-rent'));
export const contractStatus = target('Status des Mietvertrags', (page) => page.getByTestId('contract-status'));
export const contractEndDate = target('Vertragsende', (page) => page.getByTestId('contract-end-date'));
export const endContractButton = target('Mietvertrag beenden', (page) => page.getByTestId('contract-end-button'));
export const confirmEndContractButton = target('Beenden bestätigen', (page) => page.getByTestId('contract-end-confirm'));
export const contractEndInput = target('Letzter Tag', (page) => page.getByTestId('contract-end-date-input'));
export const contractEndPastConfirm = target('Bestätigung Vertragsende in der Vergangenheit', (page) =>
	page.getByTestId('contract-end-past-confirm')
);
// the field's error and a refusal of the server use the same frame: the one with the message counts
export const contractEndError = (message: string) =>
	target(`Meldung im Dialog «${message}»`, (page) =>
		page.getByRole('dialog').getByTestId('form-error').filter({ hasText: message })
	);
export const deleteDialog = target('Dialog «Mietvertrag löschen?»', (page) => page.getByRole('dialog'));
export const deleteDialogStatementLink = (statementId: string) =>
	target('Abrechnung im Dialog «Mietvertrag löschen?»', (page) =>
		page.getByRole('dialog').getByTestId(`contract-delete-statement-${statementId}`)
	);
export const deleteMistakeConfirmation = target('Bestätigung «irrtümlich erfasst»', (page) =>
	page.getByTestId('contract-delete-mistake-confirm')
);
export const deleteContractButton = target('Mietvertrag löschen', (page) => page.getByTestId('contract-delete-button'));
export const confirmDeleteContractButton = target('Löschen bestätigen', (page) =>
	page.getByTestId('contract-delete-confirm')
);
export const contractEditButton = target('Mietvertrag bearbeiten', (page) => page.getByTestId('contract-edit-button'));
export const contractTenantLink = target('Mieter', (page) => page.getByTestId('contract-tenant-link'));
export const contractApartmentLink = target('Wohnung', (page) => page.getByTestId('contract-apartment-link'));
export const contractStatementsLink = target('Nebenkostenabrechnungen', (page) =>
	page.getByTestId('contract-statements-link')
);
export const contractInvoicesLink = target('Rechnungen des Gebäudes', (page) => page.getByTestId('contract-invoices-link'));
export const nextStep = (label: string) =>
	target(`Nächster Schritt «${label}»`, (page) =>
		page.getByTestId('contract-next-steps').getByRole('link', { name: label })
	);
export const refusedStatementLink = target('Genannter Entwurf', (page) =>
	page.getByTestId('refused-statement-link').first()
);
export const deleteDraftAndEndButton = target('Entwurf löschen und Mietvertrag beenden', (page) =>
	page.getByTestId('delete-draft-and-end')
);
// One link per Abrechnungsperiode without a statement, by the period's first day
export const missingStatementLink = (periodStart: string) =>
	target(`Fehlende Abrechnung ab ${periodStart} erstellen`, (page) =>
		page.getByTestId(`contract-missing-statement-link-${periodStart}`)
	);
export const missingStatements = target('Fehlende Abrechnungen', (page) => page.getByTestId('contract-missing-statement'));
export const contractBilledUntil = target('Abgerechnet bis des Mietvertrags', (page) => page.getByTestId('contract-billed-until'));
export const contractManagementFee = target('Verwaltungspauschale des Mietvertrags', (page) =>
	page.getByTestId('contract-management-fee')
);
export const endDialogDeathHint = target('Hinweis zum Tod des Mieters im Dialog «Mietvertrag beenden»', (page) =>
	page.getByTestId('contract-end-death')
);
// A-3 (#112): the day the notice arrived, the hint it gives on a short Kündigungsfrist, and where the contract shows it
export const noticeReceivedInput = target('Kündigung erhalten am', (page) =>
	page.getByTestId('contract-notice-received-input')
);
export const noticePeriodHint = target('Hinweis auf die Kündigungsfrist', (page) =>
	page.getByTestId('contract-notice-period-hint')
);
export const endDialog = target('Dialog «Mietvertrag beenden»', (page) => page.getByRole('dialog'));
export const contractNoticeReceived = target('Kündigung erhalten am', (page) =>
	page.getByTestId('contract-notice-received')
);
