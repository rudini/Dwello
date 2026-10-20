import { describe, it, expect } from 'vitest';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { load } from '../routes/privacy/+page.server';
import answer from '../../tests/contracts/llm-recipient.json';
import mail from '../../tests/contracts/mail-transport.json';

const respond = (status: number, body: object) =>
	(async (url: string) =>
		url === 'http://localhost:3001/api/v1/mail-transport'
			? Response.json(mail)
			: (expect(url).toBe('http://localhost:3001/api/v1/invoices/llm-recipient'),
				Response.json(body, { status }))) as typeof globalThis.fetch;

describe('Datenschutzerklärung laden', () => {
	it('übernimmt den Empfänger der Rechnungsdaten und ob die KI eingeschaltet ist vom Backend', async () => {
		expect(await load({ fetch: respond(200, answer) } as never)).toMatchObject(answer);
	});

	it('nennt nur die eingerichteten Anmeldeanbieter', async () => {
		const clientId = env.OAUTH_MICROSOFT_CLIENT_ID;
		env.OAUTH_MICROSOFT_CLIENT_ID = '';
		try {
			const data = (await load({ fetch: respond(200, { ...answer, recipient: null }) } as never)) as {
				providers: string[];
			};
			expect(data.providers).toEqual(['Google']);
		} finally {
			env.OAUTH_MICROSOFT_CLIENT_ID = clientId;
		}
	});

	// #82: only the configured mail provider, the operator as controller, the cookies' lifetime from JWT_EXPIRY
	it('übernimmt den Mailversand vom Backend, den Betreiber und die Gültigkeit der Anmeldung aus der Konfiguration', async () => {
		const expiry = env.JWT_EXPIRY;
		Object.assign(process.env, { OPERATOR_NAME: 'Beispiel Hosting AG', OPERATOR_ADDRESS: 'Teststrasse 1', OPERATOR_CONTACT: '' });
		env.JWT_EXPIRY = '12h';
		try {
			expect(await load({ fetch: respond(200, answer) } as never)).toMatchObject({
				mail: 'resend',
				operator: { name: 'Beispiel Hosting AG', address: 'Teststrasse 1', contact: '' },
				sessionSeconds: 12 * 3600
			});
		} finally {
			for (const key of ['OPERATOR_NAME', 'OPERATOR_ADDRESS', 'OPERATOR_CONTACT']) delete process.env[key];
			env.JWT_EXPIRY = expiry;
		}
	});

	// #458 (#333): the server's and the mail server's country, named only when set (Art. 19 Abs. 4 DSG)
	it('übernimmt das Land des Servers und Anbieter und Land des Mailservers aus der Konfiguration', async () => {
		Object.assign(process.env, {
			OPERATOR_SERVER_COUNTRY: ' Deutschland ',
			MAIL_PROVIDER_NAME: 'Muster Mail AG',
			MAIL_PROVIDER_COUNTRY: 'Schweiz'
		});
		try {
			expect(await load({ fetch: respond(200, answer) } as never)).toMatchObject({
				serverCountry: 'Deutschland',
				mailProvider: { name: 'Muster Mail AG', country: 'Schweiz' }
			});
		} finally {
			for (const key of ['OPERATOR_SERVER_COUNTRY', 'MAIL_PROVIDER_NAME', 'MAIL_PROVIDER_COUNTRY']) delete process.env[key];
		}
	});

	it('nennt keinen Mailserver-Anbieter, solange Name oder Land fehlt, und kein Land ohne Einstellung', async () => {
		process.env.MAIL_PROVIDER_NAME = 'Muster Mail AG';
		try {
			expect(await load({ fetch: respond(200, answer) } as never)).toMatchObject({
				serverCountry: null,
				mailProvider: null
			});
		} finally {
			delete process.env.MAIL_PROVIDER_NAME;
		}
	});

	// Without the backend's answer the statement could name the wrong recipient
	it('zeigt einen Fehler statt einer möglicherweise falschen Erklärung, wenn das Backend nicht antwortet', async () => {
		await expect(load({ fetch: respond(500, {}) } as never)).rejects.toMatchObject({ status: 500 });
	});
});
