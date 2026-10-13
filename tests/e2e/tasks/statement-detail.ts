import { CallTheApi, throughUiOrApi } from '../screenplay/abilities';
import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, EnterDate, Navigate } from '../screenplay/interactions';
import {
	confirmDeleteStatementButton,
	confirmMarkPaidButton,
	confirmSendButton,
	deleteStatementButton,
	downloadPdfLink,
	generatePdfButton,
	markPaidButton,
	paidDateInput,
	sendStatementButton,
	statementApartmentLink,
	statementEditButton,
	statementTenantLink
} from '../targets/statement-detail';

/** The API path keeps the statement as the backend returns it for `heatingCostsShared` */
export const STATEMENT = 'statement';

export const openStatementDetail = (statementPath: string) =>
	throughUiOrApi(Navigate.to(statementPath), async (actor) =>
		actor.remember(STATEMENT, await actor.abilityTo(CallTheApi).get(statementPath.slice(1)))
	);

export const openSendConfirmation = Click.on(sendStatementButton);

// The confirmation names the recipient and the PDF; the user confirms having delivered it
export const sendStatement: Activity = (actor) =>
	actor.attemptsTo(Click.on(sendStatementButton), Click.on(confirmSendButton));

export const markStatementPaid: Activity = (actor) =>
	actor.attemptsTo(Click.on(markPaidButton), Click.on(confirmMarkPaidButton));

// The day the money came in, typed into the dialog's date field
export const markStatementPaidOn = (isoDate: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(markPaidButton), EnterDate.of(isoDate).into(paidDateInput), Click.on(confirmMarkPaidButton));

export const deleteStatement: Activity = (actor) =>
	actor.attemptsTo(Click.on(deleteStatementButton), Click.on(confirmDeleteStatementButton));

export const editStatementFromDetail = Click.on(statementEditButton);
export const openStatementTenant = Click.on(statementTenantLink);
export const openStatementApartment = Click.on(statementApartmentLink);

export const generateStatementPdf = Click.on(generatePdfButton);
export const downloadStatementPdf = DownloadFrom(downloadPdfLink);
