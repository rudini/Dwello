import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import { Attribute, Count } from '../screenplay/questions';
import { auditEntriesOn, auditLogLink, deleteAuditEntryButton } from '../targets/audit-log';
import { nextPageLink } from '../targets/statements';

export const openAuditLog = Click.on(auditLogLink);
export const goToAuditLog = Navigate.to('/config/audit-log');
/** #746: «Nächste Seite» until the last page, which has none */
export const turnToLastAuditPage: Activity = async (actor) => {
	for (let next = await actor.answer(Attribute.named('href').of(nextPageLink)); next; next = await actor.answer(Attribute.named('href').of(nextPageLink)))
		await actor.attemptsTo(Navigate.to(next));
};
export const startDeletingAuditEntry = (text: string) => Click.on(deleteAuditEntryButton(text));

/** #496: how often the Protokoll names the text today, for a later count */
export const AUDIT_COUNT = 'auditCount';
export const countAuditEntriesOf = (text: string, day: string): Activity => async (actor) => {
	await actor.attemptsTo(goToAuditLog);
	actor.remember(AUDIT_COUNT, await actor.answer(Count.of(auditEntriesOn(text, day))));
};
