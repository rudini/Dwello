import { m } from '$lib/paraglide/messages';
import type { StatementDocument } from '$lib/types';

/**
 * The Versandstatus of a letter as its row shows it: a reminder whose statement is paid or replaced since no longer
 * goes out, though its status stays «Zu versenden» (#449, decided in #404: V-2 A, N-1 A)
 * TODO(fachlich prüfen, #532): the term «Nicht mehr versenden»
 */
export function documentStatus(document: Pick<StatementDocument, 'status' | 'notToSend'>) {
	if (document.notToSend === 'replaced')
		return { label: m.documents_not_to_send_replaced(), tone: 'neutral', toSend: false } as const;
	if (document.notToSend === 'paid')
		return { label: m.documents_not_to_send_paid(), tone: 'neutral', toSend: false } as const;
	if (document.status === 'to_send')
		return { label: m.tenants_document_to_send(), tone: 'caution', toSend: true } as const;
	return { label: m.statements_status_sent(), tone: 'positive', toSend: false } as const;
}
