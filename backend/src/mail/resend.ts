import { required, type MailEnv, type MailTransport } from './types';

/**
 * Resend mail API (https://resend.com/docs/api-reference/emails/send-email), example of an API provider
 * RESEND_API_KEY, RESEND_BASE_URL (optional, defaults to https://api.resend.com)
 */
export function resendTransport(env: MailEnv, from: string): MailTransport {
	const apiKey = required(env, 'RESEND_API_KEY');
	const baseUrl = env.RESEND_BASE_URL ?? 'https://api.resend.com';

	return {
		async send({ to, subject, text, attachments = [] }) {
			const response = await fetch(`${baseUrl}/emails`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({
					from,
					to: [to],
					subject,
					text,
					attachments: attachments.map((a) => ({ filename: a.filename, content: a.content.toString('base64') }))
				})
			});
			const result = (await response.json()) as { id?: string; message?: string };
			if (!response.ok) throw new Error(`Resend: ${result.message ?? response.status}`);
			return { id: String(result.id) };
		}
	};
}
