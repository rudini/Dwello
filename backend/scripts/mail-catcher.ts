/**
 * Development mail catcher: a real SMTP server that keeps received mail in memory.
 * E2E tests point the backend at it (MAIL_TRANSPORT=smtp, SMTP_PORT=2525) and read the mail via HTTP.
 *
 *   bun scripts/mail-catcher.ts      SMTP on 2525, GET http://localhost:2526/messages
 */

import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';

const SMTP_PORT = Number(process.env.MAIL_CATCHER_SMTP_PORT ?? 2525);
const HTTP_PORT = Number(process.env.MAIL_CATCHER_HTTP_PORT ?? 2526);

const messages: { to: string; subject: string; text: string; attachments: string[] }[] = [];

new SMTPServer({
	authOptional: true,
	disabledCommands: ['STARTTLS'],
	onData(stream, _session, callback) {
		simpleParser(stream).then((mail) => {
			messages.push({
				to: [mail.to ?? []].flat().map((address) => address.text).join(', '),
				subject: mail.subject ?? '',
				text: mail.text ?? '',
				attachments: mail.attachments.map((a) => a.filename ?? '')
			});
			callback();
		}, callback);
	}
}).listen(SMTP_PORT, '127.0.0.1');

Bun.serve({ port: HTTP_PORT, fetch: () => Response.json(messages) });

console.log(`Mail catcher: SMTP ${SMTP_PORT}, messages on http://localhost:${HTTP_PORT}/messages`);
