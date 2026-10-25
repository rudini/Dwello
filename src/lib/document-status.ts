import { m } from '$lib/paraglide/messages';
import type { StatementDocument } from '$lib/types';

/**
 * The Versandstatus of a letter as its row shows it: a reminder whose statement is paid or replaced since no longer
 * goes out, though its status stays «Zu versenden» (#449, decided in #404: V-2 A, N-1 A)
 * TODO(fachlich prüfen, #532): the term «Nicht mehr versenden»
 */
// why the backend says a reminder no longer goes out, as its label
const notToSend = {
	replaced: m.documents_not_to_send_replaced,
	paid: m.documents_not_to_send_paid
};

export function documentStatus(document: Pick<StatementDocument, 'status' | 'notToSend'>) {
	if (document.notToSend)
		return { label: notToSend[document.notToSend](), tone: 'neutral' } as const;
	if (document.status === 'to_send')
		return { label: m.tenants_document_to_send(), tone: 'caution' } as const;
	return { label: m.statements_status_sent(), tone: 'positive' } as const;
}
