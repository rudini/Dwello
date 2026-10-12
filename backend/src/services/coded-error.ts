/**
 * Refusals the UI translates: a stable code and the values in the text, next to the backend's own text
 * (the response body is `{ error, code, params }`; see docs/api-specification.md for the codes)
 */

export type ErrorParams = Record<string, string | number>;

/** One error the UI can name in its language */
export type ErrorCode = { code: string; params: ErrorParams };

/** Body of a refused request: the backend's text with its code */
export type Refusal = ErrorCode & { error: string };

export const refusal = (code: string, error: string, params: ErrorParams = {}): Refusal => ({ error, code, params });

export class CodedError extends Error {
	constructor(
		readonly code: string,
		message: string,
		readonly params: ErrorParams = {}
	) {
		super(message);
	}
}

/** Body for a caught error: its text, with code and params when it has them */
export function errorBody(error: unknown, fallback: string): { error: string } | Refusal {
	if (error instanceof CodedError) return refusal(error.code, error.message, error.params);
	return { error: error instanceof Error ? error.message : fallback };
}
