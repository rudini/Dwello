import { m } from '$lib/paraglide/messages';

type Params = Record<string, string | number>;

/** A refusal as the backend sends it (`error`), or as apiCall passes it on (`message`) */
export type BackendError = { error?: unknown; message?: string; code?: string; params?: Params };

const messages = m as unknown as Record<string, ((params: Params) => string) | undefined>;
const messageOf = (code: unknown) =>
	typeof code === 'string' && /^[A-Z][A-Z0-9_]+$/.test(code)
		? messages[`backend_${code.toLowerCase()}`]
		: undefined;

// A param that is itself a code (the cause of a formula error, a sample apartment) shows as its message
function render(message: (params: Params) => string, params: Params): string {
	const shown = Object.entries(params).map(([key, value]) => {
		const part = messageOf(value);
		if (!part) return [key, value];
		const { [key]: _, ...rest } = params; // each part without itself, so nesting ends
		return [key, render(part, rest)];
	});
	return message(Object.fromEntries(shown));
}

/** The backend's refusal in the UI language: the message of its code, else its own text, else `fallback` */
export function backendMessage(body: BackendError | null | undefined, fallback: string): string {
	const message = messageOf(body?.code);
	if (message) return render(message, body?.params ?? {});
	const text = typeof body?.error === 'string' ? body.error : body?.message;
	return text || fallback;
}

/** Why a document's e-mail was not delivered, in the UI language */
export const deliveryErrorText = (document: {
	deliveryError: string | null;
	deliveryErrorCode?: string | null;
}) =>
	backendMessage(
		{ error: document.deliveryError, code: document.deliveryErrorCode ?? undefined },
		''
	);
