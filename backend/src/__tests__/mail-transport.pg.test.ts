import { describe, expect, it } from 'bun:test';
import { app } from '../app';

const transport = async () =>
	(await app.handle(new Request('http://localhost/api/v1/mail-transport'))).json();

// The privacy statement names only the mail provider this installation uses (#82)
describe('Mailversand für die Datenschutzerklärung', () => {
	it('nennt den eingerichteten Versandweg, ohne Anmeldung lesbar', async () => {
		const configured = process.env.MAIL_TRANSPORT;
		process.env.MAIL_TRANSPORT = 'resend';
		try {
			expect(await transport()).toEqual({ transport: 'resend' });
		} finally {
			process.env.MAIL_TRANSPORT = configured;
		}
	});

	it('nennt keinen, solange kein Mailversand eingerichtet ist', async () => {
		const configured = process.env.MAIL_TRANSPORT;
		delete process.env.MAIL_TRANSPORT;
		try {
			expect(await transport()).toEqual({ transport: null });
		} finally {
			if (configured !== undefined) process.env.MAIL_TRANSPORT = configured;
		}
	});
});
