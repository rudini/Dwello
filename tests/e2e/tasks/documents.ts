import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Navigate, Wait } from '../screenplay/interactions';
import {
	confirmReminderButton,
	deliveryTenantLink,
	feedbackDocumentsLink,
	markSentButton,
	confirmMarkSentButton,
	openDocumentLink,
	reminderButton,
	reminderFeedback,
	rowDocumentsLink
} from '../targets/documents';
import { openTenantDetail } from './tenant-detail';

export const openDocumentsToSend = Navigate.to('/documents?status=to_send');
export const openDocuments = Navigate.to('/documents');

// done once the statement reports how the reminder went
export const sendReminder: Activity = (actor) =>
	actor.attemptsTo(Click.on(reminderButton), Click.on(confirmReminderButton), Wait.until(reminderFeedback));

export const markLetterSent = (title: string, tenantName: string): Activity => (actor) =>
	actor.attemptsTo(Click.on(markSentButton(title, tenantName)), Click.on(confirmMarkSentButton));

export const downloadDocument = (title: string, tenantName: string): Activity => (actor) =>
	actor.attemptsTo(openDocuments, DownloadFrom(openDocumentLink(title, tenantName)));

export const openReminder = Click.on(reminderButton);
// #736: from an undelivered e-mail to the tenant, whose address it went to, and to «Dokumente»
export const checkAddressOfUndelivered = (title: string, tenantName: string): Activity => (actor) =>
	actor.attemptsTo(openDocuments, Click.on(deliveryTenantLink(title, tenantName)));
export const goToDocumentsFromFeedback = Click.on(feedbackDocumentsLink);
export const goToDocumentsFromTenant = (tenantId: string, title: string): Activity => (actor) =>
	actor.attemptsTo(openTenantDetail(tenantId), Click.on(rowDocumentsLink(title)));
