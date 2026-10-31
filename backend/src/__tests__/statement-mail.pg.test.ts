/**
 * Sending a statement (#86): by e-mail with its PDF for a tenant who wants e-mail, stored as a Dokument; manual for a
 * letter; a failed e-mail leaves it a draft (real PostgreSQL database, real local SMTP server)
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { SMTPServer } from 'smtp-server';
import { simpleParser, type ParsedMail } from 'mailparser';
import type { AddressInfo } from 'net';
import { db } from '../db/connection';
import { configuration, documents, utilityStatementLineItems, utilityStatements } from '../db/schema';
import { deleteConfig, getConfig, getTypedConfig, setConfig } from '../services/config.service';
import { updateTenant } from '../services/tenant.service';
import { daysAfter, swissToday } from '../services/today';
import { formatSwissDate } from '../services/pdf-format';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

type Sent = {
	status: number;
	code?: string;
	statement?: { status: string; statementDate: string; paymentDeadline: string };
	document?: { type: string; channel: string; status: string; title: string; paymentDeadline: string | null };
};

const token = crypto.randomUUID();
const mails: ParsedMail[] = [];
const statementIds: string[] = [];
let smtp: SMTPServer;
let rental: Awaited<ReturnType<typeof createRental>>;
let iban: Awaited<ReturnType<typeof getConfig>>; // as configured before, restored afterwards

const api = async (method: string, path: string, body?: object) =>
	callApi(path, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });

// A draft owing CHF 120, dated in the past with an old Zahlungsfrist, so sending must date it anew
async function draft() {
	const created = (await (
		await api('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `20${10 + statementIds.length}-01-01`,
			periodEnd: `20${10 + statementIds.length}-12-31`
		})
	).json()) as { id: string };
	statementIds.push(created.id);
	await db
		.update(utilityStatements)
		.set({ balance: '120.00', statementDate: '2020-01-01', paymentDeadline: '2020-01-31' })
		.where(eq(utilityStatements.id, created.id));
	return created.id;
}

const send = async (id: string, body: object = {}) => {
	const response = await api('POST', `/api/v1/statements/${id}/send`, body);
	return { status: response.status, ...((await response.json()) as Omit<Sent, 'status'>) };
};

const statusOf = async (id: string) =>
	((await (await api('GET', `/api/v1/statements/${id}`)).json()) as { status: string }).status;

const storedFor = (id: string) => db.select().from(documents).where(eq(documents.statementId, id));

// the PDF as sent, made at sending and kept with the statement (W3c, closing review C-1)
const pdfKept = async (id: string) =>
	!!(await db.select({ pdf: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, id)))[0].pdf;

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
	iban = await getConfig('iban');
	await setConfig('iban', 'CH93 0076 2011 6238 5295 7'); // the PDF needs one for its QR-bill
});

beforeEach(async () => {
	Object.assign(process.env, {
		MAIL_TRANSPORT: 'smtp',
		MAIL_FROM: 'verwaltung@dwello.test',
		SMTP_HOST: '127.0.0.1',
		SMTP_PORT: String((smtp.server.address() as AddressInfo).port)
	});
	await updateTenant(rental.tenant, { email: 'nora.beispiel@dwello.test', correspondenceChannel: 'email', language: 'de' });
});

afterAll(async () => {
	delete process.env.MAIL_TRANSPORT;
	if (iban) await setConfig('iban', iban);
	else await deleteConfig('iban');
	await db.delete(documents).where(eq(documents.tenantId, rental.tenant));
	if (statementIds.length) {
		await db.delete(utilityStatementLineItems).where(inArray(utilityStatementLineItems.statementId, statementIds));
		await db.delete(utilityStatements).where(inArray(utilityStatements.id, statementIds));
	}
	await rental.remove();
	await new Promise<void>((resolve) => smtp.close(() => resolve()));
});

describe('Abrechnung per E-Mail versenden', () => {
	it('sendet das PDF an den Mieter, datiert die Abrechnung auf heute und legt sie als Dokument ab', async () => {
		const id = await draft();

		const result = await send(id);

		expect(result.status).toBe(200);
		const today = swissToday();
		expect(result.statement).toMatchObject({
			status: 'sent',
			statementDate: today,
			paymentDeadline: daysAfter(today, await getTypedConfig('payment_deadline_days'))
		});
		const mail = mails.at(-1)!;
		expect(mail.to).toMatchObject({ text: 'nora.beispiel@dwello.test' });
		expect(mail.subject).toStartWith('Nebenkostenabrechnung – ');
		// what the Saldo asks for, as the PDF says it (fach-review V-3)
		expect(mail.text).toContain(`Bitte bezahlen Sie den Betrag bis ${formatSwissDate(result.statement!.paymentDeadline)} mit dem Zahlteil.`);
		expect(mail.attachments[0].contentType).toBe('application/pdf');
		expect(mail.attachments[0].content.subarray(0, 4).toString()).toBe('%PDF');
		expect(result.document).toMatchObject({ type: 'statement', channel: 'email', status: 'sent', title: 'Nebenkostenabrechnung', paymentDeadline: null });
		// #449 (Punkt 7): the Verlauf names the address it went to
		expect(result.document).toMatchObject({ recipient: 'nora.beispiel@dwello.test' });
		const [stored] = await storedFor(id);
		expect(Buffer.from(stored.content, 'base64').equals(mail.attachments[0].content)).toBe(true);
		expect(await pdfKept(id)).toBe(true);
	});

	it('schreibt die E-Mail in der Sprache des Mieters', async () => {
		await updateTenant(rental.tenant, { language: 'fr' });

		await send(await draft());

		expect(mails.at(-1)!.subject).toStartWith('Décompte des charges – ');
	});

	it('zählt das Dokument der Abrechnung nicht als Mahnung: die erste Mahnung ist die Zahlungserinnerung', async () => {
		const id = await draft();
		await send(id);
		await db.update(utilityStatements).set({ paymentDeadline: '2020-01-31' }).where(eq(utilityStatements.id, id));

		const reminder = (await (await api('POST', `/api/v1/statements/${id}/reminders`)).json()) as { document: { reminderLevel: number } };

		expect(reminder.document.reminderLevel).toBe(1);
	});
});

describe('Abrechnung per E-Mail, die nicht versendet werden kann', () => {
	it('bleibt ein Entwurf ohne Dokument, wenn der Mieter keine E-Mail-Adresse hat', async () => {
		await updateTenant(rental.tenant, { email: null });
		const id = await draft();
		const before = mails.length;

		const result = await send(id);

		expect(result).toMatchObject({ status: 400, code: 'STATEMENT_TENANT_NO_EMAIL' });
		expect(await statusOf(id)).toBe('draft');
		expect(await storedFor(id)).toHaveLength(0);
		expect(mails.length).toBe(before);
	});

	it('bleibt ein Entwurf, wenn der E-Mail-Versand nicht eingerichtet ist', async () => {
		delete process.env.MAIL_TRANSPORT;
		const id = await draft();

		expect(await send(id)).toMatchObject({ status: 400, code: 'STATEMENT_MAIL_NOT_CONFIGURED' });
		expect(await statusOf(id)).toBe('draft');
	});

	it('bleibt ein Entwurf, wenn der Mailserver die E-Mail ablehnt', async () => {
		await updateTenant(rental.tenant, { email: 'abgelehnt@dwello.test' });
		const id = await draft();
		const logged = spyOn(console, 'error').mockImplementation(() => {});

		const result = await send(id).finally(() => logged.mockRestore());

		expect(result).toMatchObject({ status: 400, code: 'STATEMENT_MAIL_FAILED' });
		expect(await statusOf(id)).toBe('draft');
		expect(await storedFor(id)).toHaveLength(0);
	});
});

describe('Abrechnung, die nicht gesendet werden kann (code review C-4)', () => {
	it('kennt keine Abrechnung mit dieser ID', async () => {
		expect(await send(crypto.randomUUID())).toMatchObject({ status: 404, code: 'STATEMENT_NOT_FOUND' });
	});

	it('bleibt ein Entwurf ohne IBAN: ohne sie gibt es keine QR-Rechnung', async () => {
		const id = await draft();
		await deleteConfig('iban');
		const before = mails.length;

		const result = await send(id).finally(() => setConfig('iban', 'CH93 0076 2011 6238 5295 7'));

		expect(result).toMatchObject({ status: 400, code: 'IBAN_MISSING' });
		expect(await statusOf(id)).toBe('draft');
		expect(mails.length).toBe(before);
	});
});

describe('Abrechnung per Brief', () => {
	// #449 (Entscheid in #404, Punkt 7): auch der Brief ist ein Dokument, mit dem PDF, wie es versendet wurde
	it('markiert sie als versendet und legt das PDF als Dokument per Brief ab, ohne E-Mail', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		const before = mails.length;

		const result = await send(id);

		expect(result.status).toBe(200);
		expect(result.statement).toMatchObject({ status: 'sent', statementDate: swissToday() });
		expect(result.document).toMatchObject({ type: 'statement', channel: 'letter', status: 'sent', recipient: null });
		expect(mails.length).toBe(before);
		const [stored] = await storedFor(id);
		const [{ pdf }] = await db.select({ pdf: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, id));
		expect(stored.content).toBe(pdf!);
		expect(await pdfKept(id)).toBe(true);
	});

	// #491 (entschieden): ohne PDF kein Brief; sonst liefe die Zahlungsfrist ab einem Tag, an dem nichts zu drucken war
	it('lehnt den Brief ab, solange das PDF nicht entstehen kann', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		const city = await getConfig('company_city');
		await db.delete(configuration).where(eq(configuration.key, 'company_city'));
		try {
			const result = await send(id);

			expect(result).toMatchObject({ status: 400, code: 'CREDITOR_ADDRESS_MISSING' });
			expect(await statusOf(id)).toBe('draft');
			expect(await storedFor(id)).toHaveLength(0);
		} finally {
			if (city) await setConfig('company_city', city);
		}
	});

	// #491, code review C-4/C-5: ohne IBAN auch kein Brief
	it('lehnt den Brief ohne IBAN ab', async () => {
		const id = await draft();
		await deleteConfig('iban');

		const result = await send(id, { byLetter: true }).finally(() => setConfig('iban', 'CH93 0076 2011 6238 5295 7'));

		expect(result).toMatchObject({ status: 400, code: 'IBAN_MISSING' });
		expect(await statusOf(id)).toBe('draft');
		expect(await storedFor(id)).toHaveLength(0);
	});

	it('stellt sie nach einer gescheiterten E-Mail per Brief zu', async () => {
		await updateTenant(rental.tenant, { email: null });
		const id = await draft();
		await send(id);

		const result = await send(id, { byLetter: true });

		// the Zahlungsfrist from the day it went out (fach-review V-1)
		const today = swissToday();
		expect(result.statement).toMatchObject({
			status: 'sent',
			statementDate: today,
			paymentDeadline: daysAfter(today, await getTypedConfig('payment_deadline_days'))
		});
		expect(await storedFor(id)).toMatchObject([{ channel: 'letter', status: 'sent' }]);
	});

	it('verweigert eine bereits versendete Abrechnung', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		await send(id);
		const before = mails.length;
		await updateTenant(rental.tenant, { correspondenceChannel: 'email' });

		expect((await send(id)).status).toBe(400);
		expect(mails.length).toBe(before);
	});
});

// #534: a sent statement whose e-mail did not reach the tenant goes again by letter, dated anew
describe('Versendete Abrechnung erneut per Brief zustellen', () => {
	const redeliver = async (id: string) => {
		const response = await api('POST', `/api/v1/statements/${id}/redeliver`);
		return { status: response.status, ...((await response.json()) as Omit<Sent, 'status'>) };
	};

	it('datiert die Abrechnung auf heute, rechnet die Zahlungsfrist ab heute und legt das PDF als Brief ab', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		await send(id);
		// sent long ago, its Zahlungsfrist passed
		await db
			.update(utilityStatements)
			.set({ statementDate: '2021-01-15', paymentDeadline: '2021-02-14' })
			.where(eq(utilityStatements.id, id));

		const result = await redeliver(id);

		const today = swissToday();
		expect(result.statement).toMatchObject({
			status: 'sent',
			statementDate: today,
			paymentDeadline: daysAfter(today, await getTypedConfig('payment_deadline_days'))
		});
		const stored = await storedFor(id);
		expect(stored.map(({ channel, status }) => [channel, status])).toEqual([
			['letter', 'sent'],
			['letter', 'sent']
		]);
		expect(stored[1].content).not.toBe(stored[0].content); // the PDF made anew, with the new date
		// Persona Dr. Weber 534 P-1: «Dokumente» names a Zahlungsfrist only for a reminder, not for the statement's letters
		const listed = (await (await api('GET', `/api/v1/documents?statementId=${id}`)).json()) as { data: { paymentDeadline: string | null }[] };
		expect(listed.data.map((document) => document.paymentDeadline)).toEqual([null, null]);
	});

	// Code-Review 534-1 C-2: without the PDF nothing changes, the statement keeps its date and Zahlungsfrist
	it('lässt die Abrechnung unverändert, wenn das PDF nicht entstehen kann', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		await send(id);
		await db.update(utilityStatements).set({ statementDate: '2021-01-15', paymentDeadline: '2021-02-14' }).where(eq(utilityStatements.id, id));
		await deleteConfig('iban');

		const result = await redeliver(id).finally(() => setConfig('iban', 'CH93 0076 2011 6238 5295 7'));

		expect(result).toMatchObject({ status: 400, code: 'IBAN_MISSING' });
		const [kept] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, id));
		expect([kept.statementDate, kept.paymentDeadline, !!kept.pdfBlob]).toEqual(['2021-01-15', '2021-02-14', true]);
		expect(await storedFor(id)).toHaveLength(1);
	});

	it('verweigert einen Entwurf und eine bezahlte Abrechnung', async () => {
		const id = await draft();
		expect(await redeliver(id)).toMatchObject({ status: 409, code: 'STATEMENT_NOT_REDELIVERABLE' });
		await send(id, { byLetter: true });
		await api('PUT', `/api/v1/statements/${id}/status`, { status: 'paid' });
		expect(await redeliver(id)).toMatchObject({ status: 409, code: 'STATEMENT_NOT_REDELIVERABLE' });
		expect(await storedFor(id)).toHaveLength(1);
	});
});

// #534 (Fachreview 534-1 M-1): reminders from before the redelivery no longer count or go out
describe('Mahnungen nach dem erneuten Zustellen', () => {
	it('zählt eine frühere Mahnung nicht mehr und schickt eine noch zu versendende nicht mehr ab', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		await send(id);
		await db.update(utilityStatements).set({ paymentDeadline: '2021-02-14' }).where(eq(utilityStatements.id, id));
		const reminder = (await (await api('POST', `/api/v1/statements/${id}/reminders`)).json()) as { document: { id: string } };

		await api('POST', `/api/v1/statements/${id}/redeliver`);

		const posted = await api('PUT', `/api/v1/documents/${reminder.document.id}/sent`);
		expect([posted.status, ((await posted.json()) as { code: string }).code]).toEqual([400, 'REMINDER_STATEMENT_REDELIVERED']);
		const detail = (await (await api('GET', `/api/v1/statements/${id}`)).json()) as { reminderToSend: boolean };
		expect(detail.reminderToSend).toBe(false);
		const toSend = (await (await api('GET', `/api/v1/documents?status=to_send&tenantId=${rental.tenant}`)).json()) as { data: { id: string }[] };
		expect(toSend.data.map((document) => document.id)).not.toContain(reminder.document.id);
	});
});

// Code-Review 534-1 C-3, C-1: a reminder sent before the redelivery counts no more for the next Mahnstufe
describe('Mahnstufe nach dem erneuten Zustellen', () => {
	it('beginnt nach dem erneuten Zustellen wieder bei der Zahlungserinnerung', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		await send(id);
		await db.update(utilityStatements).set({ paymentDeadline: '2021-02-14' }).where(eq(utilityStatements.id, id));
		const reminder = (await (await api('POST', `/api/v1/statements/${id}/reminders`)).json()) as { document: { id: string } };
		await api('PUT', `/api/v1/documents/${reminder.document.id}/sent`);
		const before = (await (await api('GET', `/api/v1/statements/${id}`)).json()) as { remindersCounted: number };

		await api('POST', `/api/v1/statements/${id}/redeliver`);

		const after = (await (await api('GET', `/api/v1/statements/${id}`)).json()) as { remindersCounted: number; nextReminderFrom: string | null };
		expect([before.remindersCounted, after.remindersCounted, after.nextReminderFrom]).toEqual([1, 0, null]);
	});
});

// #968: the new PDF after a change of a statement whose PDF went out waits under «Dokumente»
describe('Neues PDF nach einer Änderung', () => {
	const newPdfs = async (id: string) => (await storedFor(id)).filter((document) => document.type === 'new_pdf');

	it('legt das neue PDF zum Versand bereit, ersetzt es bei einer weiteren Änderung und hält den Versand ohne neues Datum fest', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		const { statement } = await send(id);
		await api('PUT', `/api/v1/statements/${id}`, { notes: 'Ratenzahlung' });
		await api('PUT', `/api/v1/statements/${id}`, { notes: 'Ratenzahlung bis März' });
		const [pending] = await newPdfs(id);
		expect(await newPdfs(id)).toHaveLength(1);
		expect(pending).toMatchObject({ status: 'to_send', channel: 'letter', title: 'Nebenkostenabrechnung, neues PDF' });

		expect((await api('PUT', `/api/v1/documents/${pending.id}/sent`)).status).toBe(200);

		expect(await newPdfs(id)).toMatchObject([{ status: 'sent', paymentDeadline: statement!.paymentDeadline }]);
		const after = (await (await api('GET', `/api/v1/statements/${id}`)).json()) as { statementDate: string; paymentDeadline: string };
		expect(after).toMatchObject({ statementDate: statement!.statementDate, paymentDeadline: statement!.paymentDeadline });
	});

	it('schickt das neue PDF einer inzwischen bezahlten Abrechnung nicht mehr ab', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		await send(id);
		await api('PUT', `/api/v1/statements/${id}`, { notes: 'Ratenzahlung' });
		await api('PUT', `/api/v1/statements/${id}/status`, { status: 'paid' });
		const [pending] = await newPdfs(id);

		const posted = await api('PUT', `/api/v1/documents/${pending.id}/sent`);

		expect([posted.status, ((await posted.json()) as { code: string }).code]).toEqual([400, 'NEW_PDF_STATEMENT_PAID']);
	});

	it('legt kein neues PDF an, wenn die Abrechnung ohne Dokument versendet wurde (vor #449, #969)', async () => {
		const id = await draft();
		await api('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' });
		await api('PUT', `/api/v1/statements/${id}`, { notes: 'Ratenzahlung' });
		expect(await newPdfs(id)).toHaveLength(0);
	});
});
