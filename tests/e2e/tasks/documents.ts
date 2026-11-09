import type { Activity } from '../screenplay/actor';
import { Click, DownloadFrom, Focus, Navigate, Select, Wait } from '../screenplay/interactions';
import {
	confirmReminderButton,
	deliveryTenantLink,
	documentTenantLink,
	documentsTenantFilter,
	documentsView,
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
// #677: the filter applies on change (#662); done once the address holds it
// by id: the choice names the town too, when the tenant has one
export const showDocumentsOf = (tenantId: string): Activity => (actor) =>
	actor.attemptsTo(
		Select.option(tenantId).from(documentsTenantFilter),
		Wait.forUrl((url) => url.searchParams.has('tenant'))
	);
// #677 (persona Sven S-1): from the keyboard, the focus on the filter as it chooses
export const showDocumentsByKeyboardOf = (tenantId: string): Activity => (actor) =>
	actor.attemptsTo(Focus.on(documentsTenantFilter), showDocumentsOf(tenantId));
export const openTenantOf = (title: string, tenantName: string) => Click.on(documentTenantLink(title, tenantName));
// done once the address shows the chosen view
export const chooseView = (view: 'Alle' | 'Zu versenden'): Activity => (actor) =>
	actor.attemptsTo(
		Click.on(documentsView(view)),
		Wait.forUrl((url) => (url.searchParams.get('status') === 'to_send') === (view === 'Zu versenden'))
	);

// done once the statement reports how the reminder went; from the open dialog, after a warning in it (#1403)
export const confirmReminder: Activity = (actor) => actor.attemptsTo(Click.on(confirmReminderButton), Wait.until(reminderFeedback));
export const sendReminder: Activity = (actor) => actor.attemptsTo(Click.on(reminderButton), confirmReminder);

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
