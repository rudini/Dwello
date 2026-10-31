/**
 * The answer of `GET /statements/:id` and the rows of `GET /statements`: the services check theirs against it, the BFF
 * maps it and the frontend takes its types from it (#837, ADR 0005). Only types of `schema.ts` here: the frontend's
 * type check reads this file and cannot read the services, which reach Bun-only code
 */

import type { CorrespondenceChannel, Language, StoredStatementStatus, UtilityStatement, UtilityStatementLineItem } from '../db/schema';
import type { SplitKey } from '../services/split-keys';

/** A statement's status as the API says it: a sent one past its payment deadline is `overdue` */
export type StatementStatus = StoredStatementStatus | 'overdue';

/** After a change of a sent statement, what only the new PDF prints (#524) */
export type PdfChange = 'notes' | 'deadline' | 'refund_by';

/** What a statement's Saldo asks of whom, by the Swiss day (#815, `paymentOf`) */
export interface StatementPayment {
	unpaid: boolean;
	claimed: boolean;
	noPayment: boolean;
	waived: boolean;
	carried: boolean;
	reminderWaitsUntil: string | null;
	reminderToPost: boolean; // an overdue statement's reminder waits to be marked sent (#545)
	deadlinePassed: boolean;
}

export interface StatementWithDetails extends Omit<UtilityStatement, 'pdfBlob' | 'status'>, StatementPayment {
	status: StatementStatus;
	nextReminderFrom: string | null;
	reminderToSend: boolean; // a reminder still to send holds the next Mahnstufe (#449)
	final: boolean; // a Schlussabrechnung (#448)
	oldAddress: boolean; // A-5: a moved-out tenant still has the building's address
	openCarry: boolean; // #506: an Übertrag no statement counts or will; the landlord settles it by hand
	carryChanged: boolean; // #506 C: a draft that would count another Übertrag now
	// an overdue one: whether a Mahnung is to propose now; null for any other; only in the list (#788)
	reminderDue?: boolean | null;
	tenant: {
		id: string;
		firstName: string;
		lastName: string;
		email: string | null;
		correspondenceChannel?: CorrespondenceChannel;
		language?: Language;
		address?: string | null;
		postalCode?: string | null;
		city?: string | null;
		country?: string | null;
	} | null;
	apartment: { id: string; number: string; floor: number; area: string } | null;
	building: { id: string; name: string; address: string; postalCode?: string; city?: string } | null;
	// otherKey: the line of a Kategorie with several Verteilschlüssel whose key is not the Kategorie's (#528), in the detail
	lineItems: (UtilityStatementLineItem & { otherKey?: boolean })[];
	splitKeys?: SplitKey[]; // #528: the lines' invoices of another key than their Kategorie's, in the detail
	// a berichtigte Abrechnung and the statement it replaces, and the replaced ones of its chain paid on (#120); only
	// in the detail
	replaces?: { id: string; statementNumber: string; statementDate: string; totalAdvancePayments: string } | null;
	replacedBy?: { id: string; statementNumber: string } | null;
	priorPaidOn?: string[];
	offsetWith?: { statementNumber: string; amount: string }[]; // «Bereits verrechnet mit NK-…» (#448)
	carriedFrom?: { id: string; statementNumber: string; balance: string } | null; // the Übertrag (#448); only in the detail
	editable?: boolean; // what it allows (#788); only in the detail
	correctable?: boolean;
	redeliverable?: boolean; // #534: sent or overdue, not replaced: «Erneut per Brief zustellen»
	refund?: boolean; // the Saldo is paid out: its Zahlungsfrist is «Rückerstattung bis» (Fachreview 534-1 V-6)
	resent?: { id: string; newPdf: boolean; sentAt: Date | null }[]; // sendings after the first (#534, #968), in the detail
	newPdfToSend?: string | null; // the Dokument of the new PDF still to send (#968)
	asksPayment?: boolean;
	superseded?: boolean; // replaced by a berichtigte Abrechnung (#120): the page names it instead of the status
	advanceChanged?: boolean; // a draft counting another Akonto than the replaced one (#464); only in the detail
	heatingProfile?: {
		id: string;
		name: string;
		nameDE: string | null;
		nameFR: string | null;
		nameIT: string | null;
		nameEN: string | null;
		type: string; // with its sources: the PDF of a statement created before #465
		sourceDE: string | null;
		sourceFR: string | null;
		sourceIT: string | null;
		sourceEN: string | null;
	} | null;
}
