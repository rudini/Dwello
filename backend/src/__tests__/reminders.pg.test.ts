/**
 * Payment reminders: PDF in the documents, sent by e-mail or kept for printing depending on the tenant's
 * correspondence channel (real PostgreSQL database, real local SMTP server)
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it, setSystemTime, spyOn } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { SMTPServer } from 'smtp-server';
import { simpleParser, type ParsedMail } from 'mailparser';
import type { AddressInfo } from 'net';
import { db } from '../db/connection';
import { configuration, documents, utilityStatementLineItems, utilityStatements } from '../db/schema';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { formatQRReferenceForDisplay, statementQRReference } from '../services/qr-bill.service';
import { updateTenant } from '../services/tenant.service';
import { daysAfter, swissToday } from '../services/today';
import { formatSwissDate } from '../services/pdf-format';
import { callApi } from './helpers/auth';
import { readPdf } from './helpers/pdf-text';
import { createRental } from './helpers/rental';

type Document = {
	id: string;
	reminderLevel: number;
	channel: string;
	status: string;
	title: string;
	paymentDeadline: string | null;
};
type ReminderResult = { document: Document & { deliveryErrorCode?: string }; deliveryError?: string; error?: string; code?: string };

const token = crypto.randomUUID();
const mails: ParsedMail[] = [];
const statementIds: string[] = [];
let smtp: SMTPServer;
let rental: Awaited<ReturnType<typeof createRental>>;

const api = async (method: string, path: string, body?: object) =>
	callApi(path, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: body && JSON.stringify(body)
	});

async function statement(status: 'draft' | 'sent') {
	const created = (await (
		await api('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `20${10 + statementIds.length}-01-01`,
			periodEnd: `20${10 + statementIds.length}-12-31`
		})
	).json()) as { id: string };
	statementIds.push(created.id);
	// owes, and the payment deadline has passed
	await db.update(utilityStatements).set({ balance: '120.00' }).where(eq(utilityStatements.id, created.id));
	if (status === 'sent') {
		await api('PUT', `/api/v1/statements/${created.id}/status`, { status: 'sent' });
		await db.update(utilityStatements).set({ paymentDeadline: '2020-01-31' }).where(eq(utilityStatements.id, created.id));
	}
	return created.id;
}

// The statement's reminders are posted and their deadlines have passed, so the next Mahnstufe is possible (#449)
const expireReminders = (statementId: string) =>
	db.update(documents).set({ paymentDeadline: '2020-02-10', status: 'sent' }).where(eq(documents.statementId, statementId));

// The text of a PDF from pdfkit, each piece of text on its own line (the embedded font decoded, #465)
const pdfText = (pdf: Buffer) => readPdf(pdf).text;

const nextReminderFrom = async (statementId: string) =>
	((await (await api('GET', `/api/v1/statements/${statementId}`)).json()) as { nextReminderFrom: string | null })
		.nextReminderFrom;

const remind = async (statementId: string) => {
	const response = await api('POST', `/api/v1/statements/${statementId}/reminders`);
	return { status: response.status, ...((await response.json()) as ReminderResult) };
};

beforeAll(async () => {
	smtp = new SMTPServer({
		authOptional: true,
		disabledCommands: ['STARTTLS'],
		// a mail server that refuses one address, as for a mistyped e-mail address
		onRcptTo(address, _session, callback) {
			callback(address.address.startsWith('abgelehnt@') ? Object.assign(new Error('550 5.1.1 User unknown'), { responseCode: 550 }) : undefined);
		},
		onData(stream, _session, callback) {
			simpleParser(stream).then((mail) => {
				mails.push(mail);
				callback();
			});
		}
	});
	await new Promise<void>((resolve) => smtp.listen(0, '127.0.0.1', resolve));
	rental = await createRental(token, { startDate: '2010-01-01', monthlyAdvancePayment: '0' });
});

beforeEach(() => {
	Object.assign(process.env, {
		MAIL_TRANSPORT: 'smtp',
		MAIL_FROM: 'verwaltung@dwello.ch',
		SMTP_HOST: '127.0.0.1',
		SMTP_PORT: String((smtp.server.address() as AddressInfo).port)
	});
});

afterAll(async () => {
	delete process.env.MAIL_TRANSPORT;
	await db.delete(documents).where(eq(documents.tenantId, rental.tenant));
	if (statementIds.length) {
		await db.delete(utilityStatementLineItems).where(inArray(utilityStatementLineItems.statementId, statementIds));
		await db.delete(utilityStatements).where(inArray(utilityStatements.id, statementIds));
	}
	await rental.remove();
	await new Promise<void>((resolve) => smtp.close(() => resolve()));
});

describe('Mahnung per E-Mail', () => {
	it('sendet die Zahlungserinnerung mit PDF und legt sie als versendet in den Dokumenten ab', async () => {
		await updateTenant(rental.tenant, { email: 'anna.keller@example.com', correspondenceChannel: 'email' });
		const result = await remind(await statement('sent'));

		expect(result.status).toBe(201);
		expect(result.document).toMatchObject({
			reminderLevel: 1,
			title: 'Zahlungserinnerung',
			channel: 'email',
			status: 'sent'
		});
		const mail = mails.at(-1)!;
		expect(mail.to).toMatchObject({ text: 'anna.keller@example.com' });
		expect(mail.subject).toStartWith('Zahlungserinnerung – Nebenkostenabrechnung');
		expect(mail.attachments[0].contentType).toBe('application/pdf');
		expect(mail.attachments[0].content.subarray(0, 4).toString()).toBe('%PDF');
	});

	it('legt die Mahnung zum Versand bereit, wenn die E-Mail nicht versendet werden kann', async () => {
		await updateTenant(rental.tenant, { email: 'anna.keller@example.com', correspondenceChannel: 'email' });
		delete process.env.MAIL_TRANSPORT;
		const before = mails.length;

		const result = await remind(await statement('sent'));

		expect(result.document).toMatchObject({ channel: 'email', status: 'to_send' });
		expect(result.deliveryError).toBe('Der E-Mail-Versand ist nicht eingerichtet.');
		expect(result.document.deliveryErrorCode).toBe('MAIL_NOT_CONFIGURED');
		expect(mails.length).toBe(before);
	});
});

describe('Mahnung per E-Mail, die der Mailserver ablehnt', () => {
	/** A reminder to an address the mail server refuses, and what went to the log */
	async function refusedReminder() {
		await updateTenant(rental.tenant, { email: 'abgelehnt@example.com', correspondenceChannel: 'email' });
		const logged = spyOn(console, 'error').mockImplementation(() => {});
		try {
			return { result: await remind(await statement('sent')), log: String(logged.mock.calls) };
		} finally {
			logged.mockRestore();
		}
	}
	const listed = async (id: string) => {
		const list = (await (await api('GET', `/api/v1/documents?tenantId=${rental.tenant}`)).json()) as {
			data: (Document & { deliveryErrorCode: string })[];
		};
		return list.data.find((d) => d.id === id);
	};

	it('legt die Mahnung mit einem Code statt dem Text des Mailservers zum Versand bereit', async () => {
		const { result, log } = await refusedReminder();

		expect(log).toContain('550 5.1.1 User unknown'); // the mail server's text goes to the log
		expect(result.document).toMatchObject({ status: 'to_send', deliveryErrorCode: 'MAIL_DELIVERY_FAILED' });
		expect(result.deliveryError).not.toContain('550');
		expect(await listed(result.document.id)).toMatchObject({ deliveryErrorCode: 'MAIL_DELIVERY_FAILED' });
	});

	it('nennt auch für eine früher gespeicherte Fehlermeldung des Mailservers den Code', async () => {
		const { result } = await refusedReminder();
		// as stored before every failure had a code
		await db
			.update(documents)
			.set({ deliveryError: 'Can\'t send mail - all recipients were rejected: 550 5.1.1 User unknown' })
			.where(eq(documents.id, result.document.id));

		expect((await listed(result.document.id))?.deliveryErrorCode).toBe('MAIL_DELIVERY_FAILED');
	});

	// #449, persona Dr. Weber P-1/P-2 (Entscheid A): ohne Adresse wird keine E-Mail versucht, die Mahnung ist ein Brief
	it('legt die Mahnung ohne E-Mail-Adresse als Brief an, ohne Zustellfehler', async () => {
		await updateTenant(rental.tenant, { email: '', correspondenceChannel: 'email' });

		const result = await remind(await statement('sent'));

		expect(result.document).toMatchObject({ status: 'to_send', channel: 'letter', deliveryError: null });
		expect(result.deliveryError).toBeUndefined();
	});

	it('nennt einen früher gespeicherten Mieter ohne E-Mail-Adresse mit seinem eigenen Code', async () => {
		const { result } = await refusedReminder();
		// as stored before #449, when Dwello still tried the e-mail without an address
		await db.update(documents).set({ deliveryError: 'Der Mieter hat keine E-Mail-Adresse.' }).where(eq(documents.id, result.document.id));

		expect((await listed(result.document.id))?.deliveryErrorCode).toBe('TENANT_NO_EMAIL');
	});
});

describe('Mahnung per Brief', () => {
	let statementId: string;
	let letter: Document;

	beforeAll(async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		statementId = await statement('sent');
	});

	it('legt die Mahnung zum Ausdrucken in den Dokumenten ab, ohne E-Mail', async () => {
		const before = mails.length;
		letter = (await remind(statementId)).document;

		expect(letter).toMatchObject({ reminderLevel: 1, channel: 'letter', status: 'to_send' });
		expect(mails.length).toBe(before);
	});

	it('führt die Mahnung in der Liste der zu versendenden Dokumente', async () => {
		const list = (await (await api('GET', `/api/v1/documents?tenantId=${rental.tenant}&status=to_send`)).json()) as {
			data: Document[];
		};

		expect(list.data.map((d) => d.id)).toContain(letter.id);
	});

	it('liefert das PDF zum Ausdrucken', async () => {
		const response = await api('GET', `/api/v1/documents/${letter.id}/pdf`);

		expect(response.headers.get('content-type')).toBe('application/pdf');
		expect(Buffer.from(await response.arrayBuffer()).subarray(0, 4).toString()).toBe('%PDF');
	});

	it('hält fest, dass der Brief versendet wurde', async () => {
		const sent = (await (await api('PUT', `/api/v1/documents/${letter.id}/sent`)).json()) as Document;

		expect(sent.status).toBe('sent');
	});

	it('steigert die Mahnstufe bis zur 3. Mahnung', async () => {
		await expireReminders(statementId);
		expect((await remind(statementId)).document).toMatchObject({ reminderLevel: 2, title: '2. Mahnung' });
		await expireReminders(statementId);
		expect((await remind(statementId)).document).toMatchObject({ reminderLevel: 3, title: '3. Mahnung' });
	});

	it('lehnt eine 4. Mahnung ab', async () => {
		await expireReminders(statementId);
		const result = await remind(statementId);

		expect(result.status).toBe(400);
		expect(result.error).toBe('Es wurden bereits 3 Mahnungen versendet.');
		expect(result.code).toBe('REMINDER_LIMIT');
	});

	// #107: after the 3rd Mahnung no next one
	it('nennt nach der 3. Mahnung keinen Tag für eine nächste Mahnung', async () => {
		await db.update(documents).set({ paymentDeadline: daysAfter(swissToday(), 10) }).where(eq(documents.statementId, statementId));

		expect(await nextReminderFrom(statementId)).toBeNull();
	});
});

describe('Mahnbare Abrechnungen', () => {
	it('mahnt keine Abrechnung, die noch nicht versendet wurde', async () => {
		const result = await remind(await statement('draft'));

		expect(result.status).toBe(400);
		expect(result.error).toBe('Nur versendete Abrechnungen können gemahnt werden.');
		expect(result.code).toBe('REMINDER_NOT_SENT');
	});

	// Vor Ablauf der Zahlungsfrist ist eine Mahnung verfrüht, auch über einen alten Tab
	it('mahnt keine Abrechnung, deren Zahlungsfrist noch läuft', async () => {
		const id = await statement('sent');
		await db.update(utilityStatements).set({ paymentDeadline: '2999-12-31' }).where(eq(utilityStatements.id, id));
		const result = await remind(id);

		expect(result.status).toBe(400);
		expect(result.error).toBe('Gemahnt wird erst nach Ablauf der Zahlungsfrist.');
		expect(result.code).toBe('REMINDER_NOT_OVERDUE');
	});

	// Bei einer Rückerstattung schuldet der Vermieter: eine Zahlungsaufforderung an den Mieter wäre falsch
	it('mahnt keine Rückerstattung', async () => {
		const id = await statement('sent');
		await db.update(utilityStatements).set({ balance: '-45.00' }).where(eq(utilityStatements.id, id));
		const result = await remind(id);

		expect(result.status).toBe(400);
		expect(result.error).toBe('Eine Rückerstattung wird nicht gemahnt: Sie schulden dem Mieter den Betrag.');
		expect(result.code).toBe('REMINDER_REFUND');
	});

	// #94: ein Saldo unter CHF 5 wird nicht eingefordert, auch nicht nach dem Zurücksetzen der Zahlung (Fachprüfung V-2)
	it('mahnt keinen Saldo unter CHF 5', async () => {
		const id = await statement('sent');
		await db.update(utilityStatements).set({ balance: '4.95' }).where(eq(utilityStatements.id, id));
		const result = await remind(id);

		expect(result.status).toBe(400);
		expect(result.code).toBe('REMINDER_BELOW_MINIMUM');
	});
});

// Each reminder sets a new payment deadline; the next Mahnstufe only from the day after it (#107)
describe('Zahlungsfrist der Mahnung', () => {
	let statementId: string;

	beforeAll(async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		statementId = await statement('sent');
	});

	it('speichert die Zahlungsfrist, die die Mahnung druckt', async () => {
		const deadline = daysAfter(swissToday(), 10);
		const { document } = await remind(statementId);
		const pdf = Buffer.from(await (await api('GET', `/api/v1/documents/${document.id}/pdf`)).arrayBuffer());

		expect(document.paymentDeadline).toBe(deadline);
		expect(pdfText(pdf)).toContain(formatSwissDate(deadline));
	});

	it('nennt bei der Abrechnung den Tag, ab dem die nächste Mahnung möglich ist', async () => {
		expect(await nextReminderFrom(statementId)).toBe(daysAfter(swissToday(), 11));
	});

	it('lehnt die nächste Mahnstufe ab, solange die Zahlungsfrist der letzten Mahnung läuft', async () => {
		// the last day of the deadline of the posted reminder (one still to send is refused first, #449)
		await db.update(documents).set({ paymentDeadline: swissToday(), status: 'sent' }).where(eq(documents.statementId, statementId));
		const result = await remind(statementId);

		expect(result.status).toBe(400);
		expect(result.code).toBe('REMINDER_TOO_EARLY');
		expect((result as { params?: object }).params).toEqual({ date: daysAfter(swissToday(), 1), deadline: swissToday() });
	});

	it('nennt bei einer bezahlten Abrechnung keinen Tag für eine nächste Mahnung', async () => {
		await db.update(utilityStatements).set({ status: 'paid', paidDate: swissToday(), paidAmount: '120.00' }).where(eq(utilityStatements.id, statementId)); // #448: as recorded

		expect(await nextReminderFrom(statementId)).toBeNull();
		await db.update(utilityStatements).set({ status: 'sent', paidDate: null }).where(eq(utilityStatements.id, statementId));
	});

	// #449 (Entscheid in #404, Punkt 2): erst wenn die vorige Mahnung als versendet markiert ist
	// Fachreview V-1: die Übersicht schlägt dann keine Mahnung vor
	it('sagt bei der Abrechnung, dass eine Mahnung noch zu versenden ist', async () => {
		const reminderToSend = async () =>
			((await (await api('GET', `/api/v1/statements/${statementId}`)).json()) as { reminderToSend: boolean }).reminderToSend;
		await db.update(documents).set({ status: 'to_send' }).where(eq(documents.statementId, statementId));

		expect(await reminderToSend()).toBe(true);
	});

	it('lehnt die nächste Mahnstufe ab, solange die vorige Mahnung nicht versendet ist, auch nach ihrer Zahlungsfrist', async () => {
		await db
			.update(documents)
			.set({ paymentDeadline: daysAfter(swissToday(), -1), status: 'to_send' })
			.where(eq(documents.statementId, statementId));
		const result = await remind(statementId);

		expect(result.status).toBe(400);
		expect(result.code).toBe('REMINDER_PREVIOUS_NOT_SENT');
		expect((result as { params?: object }).params).toEqual({ reminderLevel: 1 });
	});

	it('erlaubt die nächste Mahnstufe ab dem Tag nach der Zahlungsfrist der versendeten Mahnung', async () => {
		await db
			.update(documents)
			.set({ paymentDeadline: daysAfter(swissToday(), -1), status: 'sent' })
			.where(eq(documents.statementId, statementId));

		expect((await remind(statementId)).document).toMatchObject({ reminderLevel: 2 });
	});
});

// A letter posted days after it was made still gives the tenant the full deadline (#193)
describe('Brief, der später versendet wird', () => {
	const created = daysAfter(swissToday(), -7);
	let statementId: string;
	let letter: Document;

	beforeAll(async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		statementId = await statement('sent');
		setSystemTime(new Date(`${created}T12:00:00Z`));
		try {
			letter = (await remind(statementId)).document;
		} finally {
			setSystemTime();
		}
	});

	it('erhält beim Versand das heutige Datum und eine Zahlungsfrist ab heute', async () => {
		const sent = (await (await api('PUT', `/api/v1/documents/${letter.id}/sent`)).json()) as Document;
		const pdf = Buffer.from(await (await api('GET', `/api/v1/documents/${letter.id}/pdf`)).arrayBuffer());

		expect(letter.paymentDeadline).toBe(daysAfter(created, 10));
		expect(sent.paymentDeadline).toBe(daysAfter(swissToday(), 10));
		expect(pdfText(pdf)).toContain(formatSwissDate(swissToday()));
		expect(pdfText(pdf)).toContain(formatSwissDate(daysAfter(swissToday(), 10)));
		expect(pdfText(pdf)).not.toContain(formatSwissDate(created));
	});

	it('gilt als heute gemahnt', async () => {
		const statement = (await (await api('GET', `/api/v1/statements/${statementId}`)).json()) as {
			reminderSentDate: string;
		};

		expect(statement.reminderSentDate).toBe(swissToday());
	});

	it('ändert einen bereits versendeten Brief nicht mehr', async () => {
		setSystemTime(new Date(`${daysAfter(swissToday(), 1)}T12:00:00Z`));
		try {
			const again = (await (await api('PUT', `/api/v1/documents/${letter.id}/sent`)).json()) as Document;

			expect(again.paymentDeadline).toBe(daysAfter(created, 17));
		} finally {
			setSystemTime();
		}
	});
});

// The e-mail did not arrive, the letter went by post: the record names the letter (#194)
describe('Mahnung nach gescheiterter E-Mail per Post versendet', () => {
	it('hält den Brief als Versandweg fest', async () => {
		await updateTenant(rental.tenant, { email: '', correspondenceChannel: 'email' });
		const { document: made } = await remind(await statement('sent'));
		// as an e-mail the mail server refused leaves it (since #449 a reminder without an address is a letter at once)
		const [document] = await db.update(documents).set({ channel: 'email', deliveryError: 'MAIL_DELIVERY_FAILED' }).where(eq(documents.id, made.id)).returning();

		const sent = (await (await api('PUT', `/api/v1/documents/${document.id}/sent`)).json()) as Document;

		expect(document.channel).toBe('email');
		expect(sent).toMatchObject({ channel: 'letter', status: 'sent' });
	});
});

// #106: die Mahnung folgt der Sprache des Mieters, auch der später ausgedruckte Brief
describe('Mahnung in der Sprache des Mieters', () => {
	it('schreibt E-Mail und PDF auf Italienisch', async () => {
		await updateTenant(rental.tenant, { email: 'anna.keller@example.com', correspondenceChannel: 'email', language: 'it' });
		const statementId = await statement('sent');
		const result = await remind(statementId);

		expect(result.document.title).toBe('Promemoria di pagamento');
		const mail = mails.at(-1)!;
		expect(mail.subject).toStartWith('Promemoria di pagamento – Conteggio spese accessorie');
		expect(mail.text).toContain('Gentile');
		expect(pdfText(mail.attachments[0].content)).toContain('Cordiali saluti');

		// Fachreview W6b V-4: «2° sollecito» bleibt im Dateinamen lesbar
		await expireReminders(statementId);
		await remind(statementId);
		expect(mails.at(-1)!.attachments[0].filename).toStartWith('2° sollecito ');
	});

	it('macht den Brief beim Versand wieder auf Französisch', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'fr' });
		const letter = (await remind(await statement('sent'))).document;
		await api('PUT', `/api/v1/documents/${letter.id}/sent`);
		const pdf = Buffer.from(await (await api('GET', `/api/v1/documents/${letter.id}/pdf`)).arrayBuffer());

		expect(pdfText(pdf)).toContain('Meilleures salutations');
	});
});

// #108: jede Mahnung trägt einen Zahlteil für den offenen Saldo, mit der Referenz der Abrechnung
describe('Zahlteil der Mahnung', () => {
	const QR_IBAN = 'CH4431999123000889012'; // the sample QR-IBAN of SIX
	let iban: string | null;

	beforeAll(async () => {
		iban = await getConfig('iban');
		await setConfig('iban', QR_IBAN);
	});

	afterAll(async () => {
		if (iban) await setConfig('iban', iban);
		else await deleteConfig('iban');
	});

	const reminderPdf = async (statementId: string) => {
		const { document } = await remind(statementId);
		return pdfText(Buffer.from(await (await api('GET', `/api/v1/documents/${document.id}/pdf`)).arrayBuffer()));
	};

	it('druckt den Zahlteil mit dem offenen Saldo und der QR-Referenz der Abrechnung', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const statementId = await statement('sent');
		const text = await reminderPdf(statementId);

		expect(text).toContain('Empfangsschein');
		expect(text).toContain('Zahlteil');
		// in the letter, on the receipt and on the payment part
		expect(text.split('120.00').length - 1).toBe(3);
		expect(text.split(formatQRReferenceForDisplay(statementQRReference(statementId))).length - 1).toBe(3);
	});

	// Review W6c C-1/V-6/C-13: Brief und Zahlteil auf einem Blatt, jede Mahnstufe in jeder Sprache
	it('druckt jede Mahnstufe mit dem Zahlteil auf eine Seite', async () => {
		for (const language of ['de', 'fr', 'it', 'en'] as const) {
			await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language });
			const statementId = await statement('sent');
			for (let level = 1; level <= 3; level++) {
				const { document } = await remind(statementId);
				const pdf = Buffer.from(await (await api('GET', `/api/v1/documents/${document.id}/pdf`)).arrayBuffer());
				expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)?.length).toBe(1);
				await expireReminders(statementId);
			}
		}
	});

	it('beschriftet den Zahlteil in der Sprache des Mieters', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'fr' });
		const text = await reminderPdf(await statement('sent'));

		expect(text).toContain('Section paiement');
		expect(text).toContain('Récépissé');
	});

	// #449 (Entscheid in #404, Punkt 3, #322): eine Mahnung nach der Zahlung geht nicht mehr hinaus; der Brief bleibt
	// Entscheid V-2 A: der Brief bleibt unter «Dokumente», zählt aber nicht mehr als «Zu versenden»
	it('zählt die Mahnung einer bezahlten Abrechnung nicht mehr als zu versenden', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const statementId = await statement('sent');
		const letter = (await remind(statementId)).document;
		await db.update(utilityStatements).set({ status: 'paid', paidDate: swissToday(), paidAmount: '120.00' }).where(eq(utilityStatements.id, statementId)); // #448: as recorded
		const toSend = (await (await api('GET', '/api/v1/documents?status=to_send')).json()) as { data: { id: string }[] };
		const all = (await (await api('GET', `/api/v1/documents?statementId=${statementId}`)).json()) as {
			data: { id: string; status: string; notToSend: string | null }[];
		};

		expect(toSend.data.map((document) => document.id)).not.toContain(letter.id);
		// no new status: the letter stays as it was, the row knows its statement is paid
		expect(all.data.find((document) => document.id === letter.id)).toMatchObject({ status: 'to_send', notToSend: 'paid' });
	});

	// Entscheid V-4: eine ersetzte Abrechnung wird nicht gemahnt
	it('lehnt das Markieren als versendet ab, wenn die Abrechnung inzwischen ersetzt ist', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const statementId = await statement('sent');
		const letter = (await remind(statementId)).document;
		await db.update(utilityStatements).set({ status: 'replaced' }).where(eq(utilityStatements.id, statementId));
		const response = await api('PUT', `/api/v1/documents/${letter.id}/sent`);

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'REMINDER_STATEMENT_REPLACED' });
		await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, statementId));
	});

	// Entscheid N-1 A: ersetzt vor bezahlt, auch für eine bezahlte Abrechnung, die danach ersetzt wird
	it('zählt die Mahnung einer ersetzten Abrechnung nicht mehr als zu versenden', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const statementId = await statement('sent');
		const letter = (await remind(statementId)).document;
		await db.update(utilityStatements).set({ status: 'replaced', paidDate: swissToday() }).where(eq(utilityStatements.id, statementId));
		const toSend = (await (await api('GET', '/api/v1/documents?status=to_send')).json()) as { data: { id: string }[] };
		const all = (await (await api('GET', `/api/v1/documents?statementId=${statementId}`)).json()) as {
			data: { id: string; notToSend: string | null }[];
		};
		await db.update(utilityStatements).set({ status: 'sent', paidDate: null }).where(eq(utilityStatements.id, statementId));

		expect(toSend.data.map((document) => document.id)).not.toContain(letter.id);
		expect(all.data.find((document) => document.id === letter.id)?.notToSend).toBe('replaced');
	});

	// Fachreview N-5: nach «Zahlung zurücksetzen» ist die Forderung wieder offen, der Brief wieder zu versenden
	it('zählt die Mahnung nach dem Zurücksetzen der Zahlung wieder als zu versenden', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const statementId = await statement('sent');
		const letter = (await remind(statementId)).document;
		await db.update(utilityStatements).set({ status: 'paid', paidDate: swissToday(), paidAmount: '120.00' }).where(eq(utilityStatements.id, statementId)); // #448: as recorded
		await api('POST', `/api/v1/statements/${statementId}/payment-reset`, {});
		const toSend = (await (await api('GET', '/api/v1/documents?status=to_send')).json()) as { data: { id: string }[] };
		const marked = await api('PUT', `/api/v1/documents/${letter.id}/sent`);

		expect(toSend.data.map((document) => document.id)).toContain(letter.id);
		expect(marked.status).toBe(200);
	});

	it('lehnt das Markieren als versendet ab, wenn die Abrechnung inzwischen bezahlt ist', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const statementId = await statement('sent');
		const letter = (await remind(statementId)).document;
		await db.update(utilityStatements).set({ status: 'paid', paidDate: swissToday(), paidAmount: '120.00' }).where(eq(utilityStatements.id, statementId)); // #448: as recorded
		const response = await api('PUT', `/api/v1/documents/${letter.id}/sent`);
		const [after] = await db.select().from(documents).where(eq(documents.id, letter.id));

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual(await Bun.file(`${import.meta.dir}/../../../tests/contracts/reminder-paid-refused.json`).json());
		expect(after.status).toBe('to_send');
	});

	it('druckt ohne IBAN keinen Zahlteil', async () => {
		await deleteConfig('iban');
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const text = await reminderPdf(await statement('sent'));
		await setConfig('iban', QR_IBAN);

		expect(text).toContain('Freundliche Grüsse');
		expect(text).not.toContain('Zahlteil');
	});

	// #450 (Entscheid in #404, Punkt 8): ohne Ort der Firmenadresse nennt der Zahlteil keinen erfundenen Zahlungsempfänger
	it('erstellt ohne vollständige Firmenadresse keine Mahnung mit Zahlteil', async () => {
		const city = await getConfig('company_city');
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const statementId = await statement('sent');
		await db.delete(configuration).where(eq(configuration.key, 'company_city'));
		try {
			const refused = await remind(statementId);

			expect(refused).toMatchObject({ status: 400, code: 'CREDITOR_ADDRESS_MISSING' });
		} finally {
			if (city) await setConfig('company_city', city);
		}
	});

	// Fachreview V-1: eine Mahnung von vorher, noch «Zu versenden», entsteht beim Markieren neu; die Ablehnung sagt, was fehlt
	it('lehnt das Markieren einer Mahnung ohne vollständige Firmenadresse mit dem Code ab', async () => {
		const city = await getConfig('company_city');
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter', language: 'de' });
		const letter = (await remind(await statement('sent'))).document;
		await db.delete(configuration).where(eq(configuration.key, 'company_city'));
		try {
			const response = await api('PUT', `/api/v1/documents/${letter.id}/sent`);

			expect(response.status).toBe(400);
			expect(await response.json()).toEqual(await Bun.file(`${import.meta.dir}/../../../tests/contracts/statement-pdf-creditor-refused.json`).json());
		} finally {
			if (city) await setConfig('company_city', city);
		}
	});
});
