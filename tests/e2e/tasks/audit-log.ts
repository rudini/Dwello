import type { Activity } from '../screenplay/actor';
import { Click, Navigate } from '../screenplay/interactions';
import { Attribute, Count } from '../screenplay/questions';
import { auditEntriesOn, auditLogLink, deleteAuditEntryButton } from '../targets/audit-log';
import { nextPageLink } from '../targets/statements';

export const openAuditLog = Click.on(auditLogLink);
export const goToAuditLog = Navigate.to('/config/audit-log');
const nextPage = Attribute.named('href').of(nextPageLink);
/** #746: `onEach` on the page shown, then «Nächste Seite» and `onEach` again, until the last page, which has none */
const throughAuditPages =
	(onEach: Activity = async () => {}): Activity =>
	async (actor) => {
		await actor.attemptsTo(onEach);
		for (let next = await actor.answer(nextPage); next; next = await actor.answer(nextPage))
			await actor.attemptsTo(Navigate.to(next), onEach);
	};
export const turnToLastAuditPage = throughAuditPages();
export const startDeletingAuditEntry = (text: string) => Click.on(deleteAuditEntryButton(text));

/** #496: how often the Protokoll names the text on that day, on all its pages (#746), for a later check */
export const AUDIT_COUNT = 'auditCount';
export const countAuditEntriesOf =
	(text: string, day: string, key = AUDIT_COUNT): Activity =>
	async (actor) => {
		let count = 0;
		await actor.attemptsTo(
			goToAuditLog,
			throughAuditPages(async (on) => {
				count += await on.answer(Count.of(auditEntriesOn(text, day)));
			})
		);
		actor.remember(key, count);
	};
