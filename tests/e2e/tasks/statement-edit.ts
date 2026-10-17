import type { Activity } from '../screenplay/actor';
import { Click, Enter, EnterDate, Navigate } from '../screenplay/interactions';
import { notesInput, paymentDeadlineInput, saveStatementButton } from '../targets/statement-edit';

export const openStatementEdit = (statementPath: string) => Navigate.to(`${statementPath}/edit`);

export const extendPaymentDeadline = (deadline: string, note: string): Activity => (actor) =>
	actor.attemptsTo(
		EnterDate.of(deadline).into(paymentDeadlineInput),
		Enter.theValue(note).into(notesInput),
		Click.on(saveStatementButton)
	);

export const clearPaymentDeadline: Activity = (actor) =>
	actor.attemptsTo(Enter.theValue('').into(paymentDeadlineInput), Click.on(saveStatementButton));

export const keepNote = (note: string): Activity => (actor) =>
	actor.attemptsTo(Enter.theValue(note).into(notesInput), Click.on(saveStatementButton));
