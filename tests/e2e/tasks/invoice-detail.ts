import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import {
	billedInLink,
	buildingLink,
	deleteButton,
	deleteConfirm,
	editButton,
	missedStatementsLink,
	recategorizeButton
} from '../targets/invoice-detail';

export const openInvoice = (invoiceId: string) => Navigate.to(`/invoices/${invoiceId}`);

export const deleteInvoice: Activity = (actor) => actor.attemptsTo(Click.on(deleteButton), Click.on(deleteConfirm));
export const startEditingInvoice = Click.on(editButton);
export const openBuildingOfInvoice = Click.on(buildingLink);
export const recategorizeInvoice = Click.on(recategorizeButton);
export const openMissedStatements = Click.on(missedStatementsLink);
export const openStatementOfInvoice = (statementNumber: string) => Click.on(billedInLink(statementNumber));
