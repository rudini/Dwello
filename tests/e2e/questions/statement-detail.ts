import type { Actor } from '../fixtures/actor';
import {
	deleteStatementButton,
	sendDialog,
	sendPdfLink,
	sendRecipient,
	statementLineItem,
	statementStatus
} from '../interactions/statement-detail';

export const statusOfStatement = (actor: Actor) => statementStatus(actor.page);
export const heatingCosts = (actor: Actor) => statementLineItem(actor.page, 'Heizung');
export const sendConfirmation = (actor: Actor) => sendDialog(actor.page);
export const recipient = (actor: Actor) => sendRecipient(actor.page);
export const pdfToView = (actor: Actor) => sendPdfLink(actor.page);
export const deleteOffer = (actor: Actor) => deleteStatementButton(actor.page);
