import { monthName } from '$lib/heating-profile';
import { m } from '$lib/paraglide/messages';
import { formatDate } from '$lib/utils/format';

type Params = Record<string, string | number>;

/** A refusal as the backend sends it (`error`), or as apiCall passes it on (`message`) */
export type BackendError = {
	error?: unknown;
	message?: string;
	code?: string;
	params?: Params;
	causes?: { code: string; params?: Params }[]; // every error of an invalid formula, joined as the backend does
};

const messages = m as unknown as Record<string, ((params: Params) => string) | undefined>;
const messageOf = (code: unknown) =>
	typeof code === 'string' && /^[A-Z][A-Z0-9_]+$/.test(code)
		? messages[`backend_${code.toLowerCase()}`]
		: undefined;

const reminderName = (level: number) =>
	[m.documents_reminder_1, m.documents_reminder_2, m.documents_reminder_3][level - 1]?.() ?? String(level);

// Params that carry a code (the cause of a formula error, a sample apartment) show as its message; others are user data
const codeParams = ['cause', 'reason', 'sample'];
function render(message: (params: Params) => string, params: Params): string {
	const shown = Object.entries(params).map(([key, value]) => {
		if (key === 'month') return [key, monthName(String(value))]; // the backend names a month by its key
		if (key === 'reminderLevel') return [key, reminderName(Number(value))]; // a Mahnstufe by its number (#449)
		if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return [key, formatDate(String(value))]; // and a day as YYYY-MM-DD
		const part = codeParams.includes(key) ? messageOf(value) : undefined;
		if (!part) return [key, value];
		const { [key]: _, ...rest } = params; // each part without itself, so nesting ends
		return [key, render(part, rest)];
	});
	return message(Object.fromEntries(shown));
}

/** The backend's refusal in the UI language: the message of its code, else its own text, else `fallback` */
export function backendMessage(body: BackendError | null | undefined, fallback: string): string {
	const message = messageOf(body?.code);
	const causes = body?.causes?.map(({ code, params = {} }) => {
		const cause = messageOf(code);
		return cause && render(cause, params);
	});
	// a part without a known code: the backend's own text says it all
	if (message && !causes?.some((cause) => !cause))
		return render(message, { ...body?.params, ...(causes && { cause: causes.join(' ') }) });
	const text = typeof body?.error === 'string' ? body.error : body?.message;
	return text || fallback;
}

/** Why a document's e-mail was not delivered, in the UI language */
export const deliveryErrorText = (document: {
	deliveryError: string | null;
	deliveryErrorCode?: string | null;
}) =>
	// never the stored text: a mail server's own error reads as MAIL_DELIVERY_FAILED
	document.deliveryError === null
		? ''
		: backendMessage({ code: document.deliveryErrorCode ?? 'MAIL_DELIVERY_FAILED' }, '');

/**
 * The backend's refusal of the form, each message at the field it names (H-28, #717); an apartment's field
 * (`apartments.<index>.<field>`, building form) at the form row it came from
 */
export function refusedFields(refused: BackendError, rows: string[] = []): Record<string, string> {
	return Object.fromEntries(
		(refused.causes ?? []).map((cause) => {
			const field = String(cause.params?.field ?? 'form').replace(
				/^apartments\.(\d+)\./,
				(_, index) => `apartments.${rows[Number(index)]}.`
			);
			return [field, backendMessage(cause, '')];
		})
	);
}
