import type { Locator } from '@playwright/test';
import type { Actor } from '../fixtures/actor';
import {
	confirmDeleteStatementButton,
	confirmMarkPaidButton,
	confirmSendButton,
	deleteStatementButton,
	downloadPdfLink,
	generatePdfButton,
	markPaidButton,
	sendStatementButton,
	statementApartmentLink,
	statementEditButton,
	statementTenantLink
} from '../interactions/statement-detail';
import { downloadFrom } from './download';

const click = (target: (page: Actor['page']) => Locator) => async (actor: Actor) => {
	await target(actor.page).click();
};

export const openSendConfirmation = click(sendStatementButton);

// The confirmation names the recipient and the PDF; the user confirms having delivered it
export const sendStatement = async (actor: Actor) => {
	await sendStatementButton(actor.page).click();
	await confirmSendButton(actor.page).click();
};

export const markStatementPaid = async (actor: Actor) => {
	await markPaidButton(actor.page).click();
	await confirmMarkPaidButton(actor.page).click();
};

export const deleteStatement = async (actor: Actor) => {
	await deleteStatementButton(actor.page).click();
	await confirmDeleteStatementButton(actor.page).click();
};

export const editStatementFromDetail = click(statementEditButton);
export const openStatementTenant = click(statementTenantLink);
export const openStatementApartment = click(statementApartmentLink);

export const generateStatementPdf = click(generatePdfButton);

export const downloadStatementPdf = async (actor: Actor) => {
	await downloadFrom(downloadPdfLink(actor.page))(actor);
};
