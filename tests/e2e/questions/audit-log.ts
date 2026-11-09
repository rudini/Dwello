import { question } from '../screenplay/actor';
import { Count, Text } from '../screenplay/questions';
import { auditEntries, auditEntryDate, auditLogCard, deleteAuditEntryMessage } from '../targets/audit-log';

export const auditEntryDay = (text: string) => Text.of(auditEntryDate(text));
export const auditEntryCount = (text: string) => Count.of(auditEntries(text));
export const deleteAuditEntryConsequence = Text.of(deleteAuditEntryMessage);
export const auditLogDescription = Text.of(auditLogCard);

// #746: what countAuditEntriesOf counted on all pages of the Protokoll
export const countedAuditEntries = (key: string) => question(`the entries counted as ${key}`, (actor) => actor.recall<number>(key));
