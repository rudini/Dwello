export interface MailAttachment {
	filename: string;
	content: Buffer;
	contentType: string;
}

export interface MailMessage {
	to: string;
	subject: string;
	text: string;
	attachments?: MailAttachment[];
}

/** A way of delivering mail (SMTP server, mail API, ...). New providers implement this. */
export interface MailTransport {
	send(message: MailMessage): Promise<{ id: string }>;
}

/** Mail delivery is not (correctly) configured */
export class MailConfigError extends Error {
	override name = 'MailConfigError';
}

export type MailEnv = Record<string, string | undefined>;

export function required(env: MailEnv, key: string): string {
	const value = env[key];
	if (!value)
		throw new MailConfigError(`${key} is required for MAIL_TRANSPORT=${env.MAIL_TRANSPORT}`);
	return value;
}
