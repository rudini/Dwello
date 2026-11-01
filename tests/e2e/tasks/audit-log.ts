import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import { Count } from '../screenplay/questions';
import { auditEntriesOn, auditLogLink, deleteAuditEntryButton } from '../targets/audit-log';

export const openAuditLog = Click.on(auditLogLink);
export const goToAuditLog = Navigate.to('/config/audit-log');
export const startDeletingAuditEntry = (text: string) => Click.on(deleteAuditEntryButton(text));

/** #496: how often the Protokoll names the text today, for a later count */
export const AUDIT_COUNT = 'auditCount';
export const countAuditEntriesOf = (text: string, day: string): Activity => async (actor) => {
	await actor.attemptsTo(goToAuditLog);
	actor.remember(AUDIT_COUNT, await actor.answer(Count.of(auditEntriesOn(text, day))));
};
