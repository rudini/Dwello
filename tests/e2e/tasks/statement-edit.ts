import type { Activity } from '../screenplay/actor';
import { Click, Enter, EnterDate, Navigate, Wait } from '../screenplay/interactions';
import { statementStatus } from '../targets/statement-detail';
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
	// done once the detail page is back: a next step that navigates would cut the redirect off (WebKit, main a3b5743)
	actor.attemptsTo(Enter.theValue(note).into(notesInput), Click.on(saveStatementButton), Wait.until(statementStatus));
