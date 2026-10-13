import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import { buildingLink, deleteButton, deleteConfirm, editButton, recategorizeButton } from '../targets/invoice-detail';

export const openInvoice = (invoiceId: string) => Navigate.to(`/invoices/${invoiceId}`);

export const deleteInvoice: Activity = (actor) => actor.attemptsTo(Click.on(deleteButton), Click.on(deleteConfirm));
export const startEditingInvoice = Click.on(editButton);
export const openBuildingOfInvoice = Click.on(buildingLink);
export const recategorizeInvoice = Click.on(recategorizeButton);
