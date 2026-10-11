/**
 * Payment reminders: PDF in the documents, sent by e-mail or kept for printing depending on the tenant's
 * correspondence channel (real PostgreSQL database, real local SMTP server)
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { SMTPServer } from 'smtp-server';
import { simpleParser, type ParsedMail } from 'mailparser';
import type { AddressInfo } from 'net';
import { db } from '../db/connection';
import { documents, utilityStatementLineItems, utilityStatements } from '../db/schema';
import { updateTenant } from '../services/tenant.service';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

type Document = { id: string; reminderLevel: number; channel: string; status: string; title: string };
type ReminderResult = { document: Document; deliveryError?: string; error?: string };

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

const remind = async (statementId: string) => {
	const response = await api('POST', `/api/v1/statements/${statementId}/reminders`);
	return { status: response.status, ...((await response.json()) as ReminderResult) };
};

beforeAll(async () => {
	smtp = new SMTPServer({
		authOptional: true,
		disabledCommands: ['STARTTLS'],
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
		expect(mails.length).toBe(before);
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
		expect((await remind(statementId)).document).toMatchObject({ reminderLevel: 2, title: '2. Mahnung' });
		expect((await remind(statementId)).document).toMatchObject({ reminderLevel: 3, title: '3. Mahnung' });
	});

	it('lehnt eine 4. Mahnung ab', async () => {
		const result = await remind(statementId);

		expect(result.status).toBe(400);
		expect(result.error).toBe('Es wurden bereits 3 Mahnungen versendet.');
	});
});

describe('Mahnbare Abrechnungen', () => {
	it('mahnt keine Abrechnung, die noch nicht versendet wurde', async () => {
		const result = await remind(await statement('draft'));

		expect(result.status).toBe(400);
		expect(result.error).toBe('Nur versendete Abrechnungen können gemahnt werden.');
	});

	// Vor Ablauf der Zahlungsfrist ist eine Mahnung verfrüht, auch über einen alten Tab
	it('mahnt keine Abrechnung, deren Zahlungsfrist noch läuft', async () => {
		const id = await statement('sent');
		await db.update(utilityStatements).set({ paymentDeadline: '2999-12-31' }).where(eq(utilityStatements.id, id));
		const result = await remind(id);

		expect(result.status).toBe(400);
		expect(result.error).toBe('Gemahnt wird erst nach Ablauf der Zahlungsfrist.');
	});

	// Bei einer Rückerstattung schuldet der Vermieter: eine Zahlungsaufforderung an den Mieter wäre falsch
	it('mahnt keine Rückerstattung', async () => {
		const id = await statement('sent');
		await db.update(utilityStatements).set({ balance: '-45.00' }).where(eq(utilityStatements.id, id));
		const result = await remind(id);

		expect(result.status).toBe(400);
		expect(result.error).toBe('Eine Rückerstattung wird nicht gemahnt: Sie schulden dem Mieter den Betrag.');
	});
});
