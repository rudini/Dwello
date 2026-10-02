import type { Actor } from '../fixtures/actor';
import { confirmReminderButton, markSentButton, reminderButton } from '../interactions/documents';

export const sendReminder = async (actor: Actor) => {
	await reminderButton(actor.page).click();
	await confirmReminderButton(actor.page).click();
};

export const markLetterSent = (title: string, tenantName: string) => async (actor: Actor) => {
	await markSentButton(actor.page, title, tenantName).click();
};
