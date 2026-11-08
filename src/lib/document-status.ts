import { m } from '$lib/paraglide/messages';
import type { StatementDocument } from '$lib/types';

/**
 * The Versandstatus of a letter as its row shows it: a reminder whose statement is paid or replaced since no longer
 * goes out, though its status stays «Zu versenden» (#449, decided in #404: V-2 A, N-1 A)
 */
// why the backend says a reminder no longer goes out, as its label
const notToSend = {
	replaced: m.documents_not_to_send_replaced,
	paid: m.documents_not_to_send_paid,
	redelivered: m.documents_not_to_send_redelivered // #534
};

export function documentStatus(document: Pick<StatementDocument, 'status' | 'notToSend'>) {
	if (document.notToSend)
		return { label: notToSend[document.notToSend](), tone: 'neutral' } as const;
	if (document.status === 'to_send')
		return { label: m.tenants_document_to_send(), tone: 'caution' } as const;
	return { label: m.statements_status_sent(), tone: 'positive' } as const;
}

/**
 * The documents with a running number after the title of each upload whose tenant has another upload of that title,
 * in upload order: «Ausweiskopie (1 von 2)», so rows, buttons and the delete question tell them apart (#1181)
 */
export function numberedUploads<
	T extends Pick<StatementDocument, 'type' | 'tenantId' | 'title' | 'createdAt'>
>(documents: T[]) {
	const key = (d: T) => `${d.tenantId}\u0000${d.title}`;
	const uploads = documents
		.filter((d) => d.type === 'upload')
		.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
	return documents.map((d) => {
		const same = uploads.filter((u) => key(u) === key(d));
		return d.type !== 'upload' || same.length < 2
			? d
			: {
					...d,
					title: m.documents_upload_number({
						title: d.title,
						number: same.indexOf(d) + 1,
						count: same.length
					})
				};
	});
}
