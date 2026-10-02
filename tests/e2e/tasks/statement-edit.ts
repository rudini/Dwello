import type { Actor } from '../fixtures/actor';
import {
	notesInput,
	paymentDeadlineInput,
	saveStatementButton
} from '../interactions/statement-edit';

export const extendPaymentDeadline = (deadline: string, note: string) => async (actor: Actor) => {
	await paymentDeadlineInput(actor.page).fill(deadline);
	await notesInput(actor.page).fill(note);
	await saveStatementButton(actor.page).click();
};
