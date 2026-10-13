import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import { confirmReminderButton, markSentButton, reminderButton } from '../targets/documents';

export const openDocumentsToSend = Navigate.to('/documents?status=to_send');
export const openDocuments = Navigate.to('/documents');

export const sendReminder: Activity = (actor) => actor.attemptsTo(Click.on(reminderButton), Click.on(confirmReminderButton));

export const markLetterSent = (title: string, tenantName: string) => Click.on(markSentButton(title, tenantName));
