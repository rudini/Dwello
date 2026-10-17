import { Click, Navigate } from '../screenplay/interactions';
import { auditLogLink, deleteAuditEntryButton } from '../targets/audit-log';

export const openAuditLog = Click.on(auditLogLink);
export const goToAuditLog = Navigate.to('/config/audit-log');
export const startDeletingAuditEntry = (text: string) => Click.on(deleteAuditEntryButton(text));
