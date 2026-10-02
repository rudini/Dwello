import type { Actor } from '../fixtures/actor';
import {
	recalculateHint,
	statementNotes,
	statementPaymentDeadline
} from '../interactions/statement-edit';

export const paymentDeadline = (actor: Actor) => statementPaymentDeadline(actor.page);
export const notes = (actor: Actor) => statementNotes(actor.page);
export const costsAreRecalculated = (actor: Actor) => recalculateHint(actor.page);
