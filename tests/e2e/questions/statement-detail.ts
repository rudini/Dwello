import { throughUiOrApi } from '../screenplay/abilities';
import { question } from '../screenplay/actor';
import { Accessible, Attribute, Count, Text } from '../screenplay/questions';
import {
	deleteStatementButton,
	paidDateInput,
	sendDialog,
	sendPdfLink,
	sendRecipient,
	statementHeatingProfile,
	statementHistory,
	statementLineItem,
	statementStatus
} from '../targets/statement-detail';
import { francs } from '../tasks/statement-generate-api';
import { STATEMENT } from '../tasks/statement-detail';

export const statusOfStatement = Text.of(statementStatus);
export const sendConfirmation = Text.of(sendDialog);
export const recipient = Text.of(sendRecipient);
export const pdfToView = Attribute.named('href').of(sendPdfLink);
export const deleteOffers = Count.of(deleteStatementButton);
export const history = Text.of(statementHistory);
export const paidDateInvalid = Attribute.named('aria-invalid').of(paidDateInput);
export const paidDateProblem = Accessible.descriptionOf(paidDateInput);
export const heatingProfileOfStatement = Text.of(statementHeatingProfile);

type LineItem = { description: string; sharePercentage: string; tenantShare: string };

/** Whether the tenant bears the share of the heating costs, i.e. the amount: on the page, or in the backend's statement */
export const heatingCostsShared = (share: number, amount: string) =>
	throughUiOrApi(
		question(`whether the heating costs show ${share} %, ${amount}`, async (actor) => {
			const text = await actor.answer(Text.of(statementLineItem('Heizung')));
			return text !== null && text.includes(`${share} %`) && text.includes(amount);
		}),
		question(`whether the statement charges ${share} % of the heating costs, ${amount}`, (actor) => {
			const { lineItems } = actor.recall<{ lineItems: LineItem[] }>(STATEMENT);
			const heating = lineItems.find((item) => item.description === 'Heating')!;
			return Number(heating.sharePercentage) === share && Number(heating.tenantShare) === francs(amount);
		})
	);
