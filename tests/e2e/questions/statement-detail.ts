import { throughUiOrApi } from '../screenplay/abilities';
import { type Question, question } from '../screenplay/actor';
import { Accessible, Attribute, Count, Gap, Text } from '../screenplay/questions';
import { successToast } from '../targets/form';
import {
	advanceDiffers,
	costBreakdown,
	statementAdvancePaid,
	correctDialog,
	paymentDeadline,
	paymentSummary,
	correctStatementButton,
	markPaidButton,
	priorPayments,
	reminderButton,
	replacesLink,
	resetPaymentButton,
	statementBalance,
	statementEditButton,
	deleteStatementButton,
	paidDateInput,
	pdfLanguage,
	pdfRefusalMessage,
	resetPaymentDialog,
	sendDialog,
	sendPdfLink,
	sendRecipient,
	statementHeatingProfile,
	statementHistory,
	lineItemAmount,
	lineItemApartmentShare,
	lineItemInvoice,
	lineItemInvoices,
	lineItemShare,
	lineItemTimeShare,
	statementLaterInvoices,
	statementTenancy,
	statementTotalLabel,
	statementStatus,
	oldAddressWarning
} from '../targets/statement-detail';
import { amountAfter } from './amounts';
import { STATEMENT } from '../tasks/statement-detail';

export const statusOfStatement = Text.of(statementStatus);
/** The sentence the tab shows instead of a PDF the backend refused */
export const pdfRefusalText = Text.of(pdfRefusalMessage);
export const sendConfirmation = Text.of(sendDialog);
export const resetConfirmation = Text.of(resetPaymentDialog);
export const recipient = Text.of(sendRecipient);
export const pdfToView = Attribute.named('href').of(sendPdfLink);
export const deleteOffers = Count.of(deleteStatementButton);
export const history = Text.of(statementHistory);
export const paidDateInvalid = Attribute.named('aria-invalid').of(paidDateInput);
export const paidDateProblem = Accessible.descriptionOf(paidDateInput);
export const heatingProfileOfStatement = Text.of(statementHeatingProfile);
export const tenancyOfStatement = Text.of(statementTenancy);
export const totalLabelOfStatement = Text.of(statementTotalLabel);
export const laterInvoicesHint = Text.of(statementLaterInvoices);
export const laterInvoicesHints = Count.of(statementLaterInvoices);
export const invoicesOfPosition = (category: string) => Text.of(lineItemInvoices(category));
export const invoiceOfPosition = (category: string, description: string) => Text.of(lineItemInvoice(category, description));

/** Wohnungsanteil, Zeitanteil and amount of a position as the page shows them */
export const sharesOfPosition = (category: string) =>
	question(`the shares of the position «${category}»`, async (actor) => ({
		apartment: await actor.answer(Text.of(lineItemApartmentShare(category))),
		time: await actor.answer(Text.of(lineItemTimeShare(category))),
		amount: await actor.answer(Text.of(lineItemAmount(category)))
	}));

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
export const languageOfPdf = Text.of(pdfLanguage);

// #120
export const correctConfirmation = Text.of(correctDialog);
export const replacedDone = Text.of(successToast);
export const deadlineShown = Count.of(paymentDeadline);
export const paymentText = Text.of(paymentSummary);
export const replacedStatementLink = Attribute.named('href').of(replacesLink);
export const priorPaymentsAmount = question('the amount already paid on the replaced statement', async (actor) =>
	amountAfter('', await actor.answer(Text.of(priorPayments)))
);
export const balanceAmount = question('the Saldo of the statement', async (actor) =>
	amountAfter('', await actor.answer(Text.of(statementBalance)))
);
/** The actions a replaced statement must no longer offer: mark paid, reset the payment, remind, edit, correct */
export const changeOffers = question('the offers to pay, remind, edit or correct', async (actor) =>
	[markPaidButton, resetPaymentButton, reminderButton, statementEditButton, correctStatementButton].reduce(
		async (sum, button) => (await sum) + (await actor.answer(Count.of(button))),
		Promise.resolve(0)
	)
);
export const oldAddressWarningText = Text.of(oldAddressWarning);

// The page's usual spacing between the status line and the first panel, no empty items in between
export const gapAboveCostBreakdown = Gap.between(statementStatus, costBreakdown);

// #464: the Akonto the statement deducts, e.g. «− CHF 400.00»
export const advancePaidOfStatement = Text.of(statementAdvancePaid);
export const advanceDiffersText = Text.of(advanceDiffers);
