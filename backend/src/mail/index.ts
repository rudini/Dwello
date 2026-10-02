/**
 * Mail module: the only way the app sends e-mail.
 *
 * The provider is chosen by environment variables (credentials never live in the database):
 *   MAIL_TRANSPORT  smtp | resend
 *   MAIL_FROM       sender address, e.g. "Verwaltung Muster <verwaltung@example.ch>"
 * plus the provider's own variables (see smtp.ts, resend.ts). To add a provider, implement
 * MailTransport in its own file and register it in `providers`.
 */

import { resendTransport } from './resend';
import { smtpTransport } from './smtp';
import { MailConfigError, required, type MailEnv, type MailTransport } from './types';

export { MailConfigError, type MailMessage, type MailTransport } from './types';

const providers: Record<string, (env: MailEnv, from: string) => MailTransport> = {
	smtp: smtpTransport,
	resend: resendTransport
};

export function createMailTransport(env: MailEnv = process.env): MailTransport {
	const name = env.MAIL_TRANSPORT;
	if (!name) throw new MailConfigError('E-mail delivery is not configured (MAIL_TRANSPORT)');
	const provider = providers[name];
	if (!provider) throw new MailConfigError(`Unknown MAIL_TRANSPORT "${name}"`);
	return provider(env, required(env, 'MAIL_FROM'));
}
