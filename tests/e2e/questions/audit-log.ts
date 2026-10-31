import { Count, Text } from '../screenplay/questions';
import { auditEntries, auditEntryDate, auditLogCard, deleteAuditEntryMessage } from '../targets/audit-log';

export const auditEntryDay = (text: string) => Text.of(auditEntryDate(text));
export const auditEntryCount = (text: string) => Count.of(auditEntries(text));
export const deleteAuditEntryConsequence = Text.of(deleteAuditEntryMessage);
export const auditLogDescription = Text.of(auditLogCard);
