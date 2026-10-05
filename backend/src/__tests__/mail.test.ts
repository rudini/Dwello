/**
 * Mail module: SMTP against a real local SMTP server, Resend against a local HTTP server speaking its API
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { SMTPServer } from 'smtp-server';
import { simpleParser, type ParsedMail } from 'mailparser';
import type { AddressInfo } from 'net';
import { createMailTransport, MailConfigError, type MailMessage } from '../mail';

const message: MailMessage = {
	to: 'anna.keller@example.com',
	subject: '1. Mahnung NK-2024-1',
	text: 'Guten Tag Frau Keller',
	attachments: [{ filename: 'mahnung.pdf', content: Buffer.from('%PDF-1.4 test'), contentType: 'application/pdf' }]
};

describe('Versand über SMTP', () => {
	const received: ParsedMail[] = [];
	let server: SMTPServer;
	let port: number;

	beforeAll(async () => {
		server = new SMTPServer({
			authOptional: true,
			disabledCommands: ['STARTTLS'],
			onData(stream, _session, callback) {
				simpleParser(stream).then((mail) => {
					received.push(mail);
					callback();
				});
			}
		});
		await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
		port = (server.server.address() as AddressInfo).port;
	});

	afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

	it('stellt die Nachricht mit Anhang an den Empfänger zu', async () => {
		const transport = createMailTransport({
			MAIL_TRANSPORT: 'smtp',
			MAIL_FROM: 'verwaltung@dwello.ch',
			SMTP_HOST: '127.0.0.1',
			SMTP_PORT: String(port)
		});

		await transport.send(message);

		const [mail] = received;
		expect(mail.to).toMatchObject({ text: 'anna.keller@example.com' });
		expect(mail.from).toMatchObject({ text: 'verwaltung@dwello.ch' });
		expect(mail.subject).toBe('1. Mahnung NK-2024-1');
		expect(mail.attachments.map((a) => a.filename)).toEqual(['mahnung.pdf']);
		expect(mail.attachments[0].content.toString()).toBe('%PDF-1.4 test');
	});
});

describe('Versand über Resend', () => {
	const requests: { authorization: string | null; body: Record<string, unknown> }[] = [];
	let api: ReturnType<typeof Bun.serve>;
	let reject = false;

	beforeAll(() => {
		api = Bun.serve({
			port: 0,
			async fetch(request) {
				requests.push({
					authorization: request.headers.get('authorization'),
					body: (await request.json()) as Record<string, unknown>
				});
				return reject
					? Response.json({ message: 'Invalid `to` field' }, { status: 422 })
					: Response.json({ id: 'email-1' });
			}
		});
	});

	afterAll(() => api.stop());

	const transport = () =>
		createMailTransport({
			MAIL_TRANSPORT: 'resend',
			MAIL_FROM: 'verwaltung@dwello.ch',
			RESEND_API_KEY: 're_test',
			RESEND_BASE_URL: `http://localhost:${api.port}`
		});

	it('übergibt Empfänger, Betreff, Text und Anhang an die API', async () => {
		expect(await transport().send(message)).toEqual({ id: 'email-1' });

		expect(requests[0]).toEqual({
			authorization: 'Bearer re_test',
			body: {
				from: 'verwaltung@dwello.ch',
				to: ['anna.keller@example.com'],
				subject: '1. Mahnung NK-2024-1',
				text: 'Guten Tag Frau Keller',
				attachments: [{ filename: 'mahnung.pdf', content: Buffer.from('%PDF-1.4 test').toString('base64') }]
			}
		});
	});

	it('meldet einen Fehler, wenn die API die Nachricht ablehnt', async () => {
		reject = true;
		await expect(transport().send(message)).rejects.toThrow('Invalid `to` field');
	});
});

describe('Konfiguration', () => {
	it('verlangt einen Versandweg', () => {
		expect(() => createMailTransport({})).toThrow(MailConfigError);
	});

	it('lehnt unbekannte Versandwege ab', () => {
		expect(() => createMailTransport({ MAIL_TRANSPORT: 'fax', MAIL_FROM: 'a@b.ch' })).toThrow(MailConfigError);
	});

	it('verlangt die Zugangsdaten des gewählten Versandwegs', () => {
		expect(() => createMailTransport({ MAIL_TRANSPORT: 'resend', MAIL_FROM: 'a@b.ch' })).toThrow(
			'RESEND_API_KEY'
		);
		expect(() => createMailTransport({ MAIL_TRANSPORT: 'smtp', MAIL_FROM: 'a@b.ch' })).toThrow('SMTP_HOST');
	});
});
