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
	statementLineItemCells,
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
/** The heating costs of the statement: the tenant's share in % and in francs */
export const heatingCosts = throughUiOrApi(
	question('the heating costs of the statement', async (actor) => {
		// the cells one by one: the row's text runs them together ("CHF 1’000.0043 %")
		const [, , , share, amount] = await actor.answer(Text.ofAll(statementLineItemCells('Heizung')));
		return share && amount ? { share: Number(share.replace(/[^\d.]/g, '')), amount: francs(amount) } : null;
	}),
	question('the heating costs the statement charges', (actor) => {
		const { lineItems } = actor.recall<{ lineItems: LineItem[] }>(STATEMENT);
		const heating = lineItems.find((item) => item.description === 'Heating');
		return heating ? { share: Number(heating.sharePercentage), amount: Number(heating.tenantShare) } : null;
	})
);
