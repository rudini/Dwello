import { Accessible, Attribute, Text, Visibility } from '../screenplay/questions';
import {
	paymentDeadlineInput,
	recalculateHint,
	statementNotes,
	statementPaymentDeadline
} from '../targets/statement-edit';

export const paymentDeadline = Text.of(statementPaymentDeadline);
export const notes = Text.of(statementNotes);
export const costsAreRecalculated = Visibility.of(recalculateHint);
export const paymentDeadlineInvalid = Attribute.named('aria-invalid').of(paymentDeadlineInput);
export const paymentDeadlineProblem = Accessible.descriptionOf(paymentDeadlineInput);
