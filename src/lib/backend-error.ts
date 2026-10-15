import { monthName } from '$lib/heating-profile';
import { m } from '$lib/paraglide/messages';

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

// Params that carry a code (the cause of a formula error, a sample apartment) show as its message; others are user data
const codeParams = ['cause', 'reason', 'sample'];
function render(message: (params: Params) => string, params: Params): string {
	const shown = Object.entries(params).map(([key, value]) => {
		if (key === 'month') return [key, monthName(String(value))]; // the backend names a month by its key
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
