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
import { documents, utilityStatementLineItems, utilityStatements } from '../db/schema';
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
		const [stored] = await storedFor(id);
		expect(Buffer.from(stored.content, 'base64').equals(mail.attachments[0].content)).toBe(true);
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

describe('Abrechnung per Brief', () => {
	it('markiert sie nur als versendet, ohne E-Mail und ohne Dokument', async () => {
		await updateTenant(rental.tenant, { correspondenceChannel: 'letter' });
		const id = await draft();
		const before = mails.length;

		const result = await send(id);

		expect(result.status).toBe(200);
		expect(result.statement).toMatchObject({ status: 'sent', statementDate: swissToday() });
		expect(result.document).toBeUndefined();
		expect(mails.length).toBe(before);
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
		expect(await storedFor(id)).toHaveLength(0);
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
