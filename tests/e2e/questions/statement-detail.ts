import { throughUiOrApi } from '../screenplay/abilities';
import { type Question, question } from '../screenplay/actor';
import { Accessible, Attribute, Count, Text } from '../screenplay/questions';
import {
	deleteStatementButton,
	paidDateInput,
	pdfRefusalMessage,
	sendDialog,
	sendPdfLink,
	sendRecipient,
	statementHeatingProfile,
	statementHistory,
	lineItemAmount,
	lineItemShare,
	statementStatus
} from '../targets/statement-detail';
import { amountAfter } from './amounts';
import { STATEMENT } from '../tasks/statement-detail';

export const statusOfStatement = Text.of(statementStatus);
/** The sentence the tab shows instead of a PDF the backend refused */
export const pdfRefusalText = Text.of(pdfRefusalMessage);
export const sendConfirmation = Text.of(sendDialog);
export const recipient = Text.of(sendRecipient);
export const pdfToView = Attribute.named('href').of(sendPdfLink);
export const deleteOffers = Count.of(deleteStatementButton);
export const history = Text.of(statementHistory);
export const paidDateInvalid = Attribute.named('aria-invalid').of(paidDateInput);
export const paidDateProblem = Accessible.descriptionOf(paidDateInput);
export const heatingProfileOfStatement = Text.of(statementHeatingProfile);

type LineItem = { description: string; sharePercentage: string; tenantShare: string };

// «50 %» → 50, «33.3 %» → 33.3; the text itself when it shows no share in that form (not «50.00 %»)
const percent = (text: string | null) => (text?.match(/^\d+(?:\.\d*[1-9])? %$/) ? Number.parseFloat(text) : text);

/** The tenant's share of the heating costs and the amount it makes, in percent and francs: on the page, or in the
 * backend's statement */
export const heatingCostsOfTenant = throughUiOrApi<Question<{ share: unknown; amount: unknown }>>(
	question('the share of the heating costs on the statement', async (actor) => ({
		share: percent(await actor.answer(Text.of(lineItemShare('Heizung')))),
		amount: amountAfter('', await actor.answer(Text.of(lineItemAmount('Heizung'))))
	})),
	question('the share of the heating costs in the statement', (actor) => {
		const { lineItems } = actor.recall<{ lineItems: LineItem[] }>(STATEMENT);
		const heating = lineItems.find((item) => item.description === 'Heating')!;
		return { share: Number(heating.sharePercentage), amount: Number(heating.tenantShare) };
	})
);
