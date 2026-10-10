import type { Actor } from '../fixtures/actor';
import { typeDate } from '../interactions/form';
import {
	notesInput,
	paymentDeadlineInput,
	saveStatementButton
} from '../interactions/statement-edit';

export const extendPaymentDeadline = (deadline: string, note: string) => async (actor: Actor) => {
	await typeDate(paymentDeadlineInput(actor.page), deadline);
	await notesInput(actor.page).fill(note);
	await saveStatementButton(actor.page).click();
};
