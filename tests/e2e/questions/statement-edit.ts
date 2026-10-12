import type { Actor } from '../fixtures/actor';
import {
	paymentDeadlineInput,
	recalculateHint,
	statementNotes,
	statementPaymentDeadline
} from '../interactions/statement-edit';

export const paymentDeadline = (actor: Actor) => statementPaymentDeadline(actor.page);
export const notes = (actor: Actor) => statementNotes(actor.page);
export const costsAreRecalculated = (actor: Actor) => recalculateHint(actor.page);
export const paymentDeadlineField = (actor: Actor) => paymentDeadlineInput(actor.page);
