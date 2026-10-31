/**
 * A stored document as `GET /documents` lists it: everything but the file, plus whom it is for. The service returns
 * it, the frontend takes its type from it (#837, ADR 0005); only types of `schema.ts` here
 */

import type { Document } from '../db/schema';

export interface DocumentSummary extends Omit<Document, 'content'> {
	// a reminder still to send whose statement is replaced or paid since: it no longer goes out (#449)
	notToSend: 'replaced' | 'paid' | 'redelivered' | null; // redelivered: a reminder from before the statement went again by letter (#534)
	tenantName: string;
	statementNumber: string | null;
	deliveryErrorCode: string | null; // the code of a delivery error the UI names; MAIL_DELIVERY_FAILED for any other
}
