import nodemailer from 'nodemailer';
import { required, type MailEnv, type MailTransport } from './types';

/**
 * SMTP server (own mail server or provider such as Infomaniak, Microsoft 365)
 * SMTP_HOST, SMTP_PORT (587), SMTP_SECURE ("true" for implicit TLS on 465), SMTP_USER, SMTP_PASSWORD
 */
export function smtpTransport(env: MailEnv, from: string): MailTransport {
	const transporter = nodemailer.createTransport({
		host: required(env, 'SMTP_HOST'),
		port: Number(env.SMTP_PORT ?? 587),
		secure: env.SMTP_SECURE === 'true',
		auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined
	});

	return {
		async send({ to, subject, text, attachments = [] }) {
			const info = await transporter.sendMail({ from, to, subject, text, attachments });
			return { id: info.messageId };
		}
	};
}
