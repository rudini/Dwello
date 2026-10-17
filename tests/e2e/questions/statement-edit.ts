import { Accessible, Attribute, Count, Text, Visibility } from '../screenplay/questions';
import {
	notesInput,
	paymentDeadlineInput,
	recalculateHint,
	statementNotes,
	statementPaymentDeadline
} from '../targets/statement-edit';

export const paymentDeadline = Text.of(statementPaymentDeadline);
export const deadlineFields = Count.of(paymentDeadlineInput);
export const notesField = Visibility.of(notesInput);
export const notes = Text.of(statementNotes);
export const costsAreRecalculated = Visibility.of(recalculateHint);
export const paymentDeadlineInvalid = Attribute.named('aria-invalid').of(paymentDeadlineInput);
export const paymentDeadlineProblem = Accessible.descriptionOf(paymentDeadlineInput);
