import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Navigate, Wait } from '../screenplay/interactions';
import { confirmReminderButton, markSentButton, openDocumentLink, reminderButton, reminderFeedback } from '../targets/documents';

export const openDocumentsToSend = Navigate.to('/documents?status=to_send');
export const openDocuments = Navigate.to('/documents');

// done once the statement reports how the reminder went
export const sendReminder: Activity = (actor) =>
	actor.attemptsTo(Click.on(reminderButton), Click.on(confirmReminderButton), Wait.until(reminderFeedback));

export const markLetterSent = (title: string, tenantName: string) => Click.on(markSentButton(title, tenantName));

export const downloadDocument = (title: string, tenantName: string): Activity => (actor) =>
	actor.attemptsTo(openDocuments, DownloadFrom(openDocumentLink(title, tenantName)));
