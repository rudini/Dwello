/**
 * Client-Side API Helper
 * Provides type-safe API calls with automatic XSRF token handling
 */

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { m } from '$lib/paraglide/messages';

/**
 * XSRF cookie name constant - must match server-side cookie name
 */
export const XSRF_COOKIE_NAME = 'dwello_xsrf';

/**
 * HTTP methods that require XSRF token
 */
const MUTATION_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'] as const;

/**
 * API error response structure
 */
interface ApiError {
	code: string;
	message: string;
	params?: Record<string, string | number>;
	details?: Record<string, unknown>; // the backend's whole answer, e.g. the statements behind a refusal
}

/**
 * API response wrapper
 */
interface ApiResponse<T> {
	data?: T;
	error?: ApiError;
}

/**
 * Options for API calls
 */
interface ApiCallOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	headers?: Record<string, string>;
	params?: Record<string, string>;
}

/**
 * Pagination info from response headers
 */
export interface PaginationInfo {
	totalCount: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
	data: T;
	pagination: PaginationInfo;
}

/**
 * Get XSRF token from cookies
 * In the browser, we can read the xsrf-token cookie (not HTTPOnly)
 */
export function getXsrfTokenFromCookie(): string | null {
	if (!browser) return null;

	const cookies = document.cookie.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === XSRF_COOKIE_NAME) {
			return decodeURIComponent(value);
		}
	}
	return null;
}

/**
 * Check if method requires XSRF token
 */
function isMutationMethod(method: string): boolean {
	return MUTATION_METHODS.includes(method as (typeof MUTATION_METHODS)[number]);
}

/**
 * Build request headers with optional XSRF token for mutations
 */
function buildRequestHeaders(
	method: string,
	customHeaders: Record<string, string> = {}
): Record<string, string> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...customHeaders
	};

	// Add XSRF token for mutation requests
	if (isMutationMethod(method)) {
		const xsrfToken = getXsrfTokenFromCookie();
		if (xsrfToken) {
			headers['X-XSRF-TOKEN'] = xsrfToken;
		}
	}

	return headers;
}

/**
 * Build URL with query parameters
 */
function buildUrl(path: string, params?: Record<string, string>): string {
	const url = `/api${path}`;
	if (params && Object.keys(params).length > 0) {
		const searchParams = new URLSearchParams(params);
		return `${url}?${searchParams.toString()}`;
	}
	return url;
}

function requestInit(method: string, body: unknown, headers: Record<string, string>): RequestInit {
	// A form (e.g. with a file) goes as multipart; the browser sets its content type with the boundary
	const form = body instanceof FormData;
	const requestHeaders = buildRequestHeaders(method, headers);
	if (form) delete requestHeaders['Content-Type'];
	return {
		method,
		// XSRF token for mutations
		headers: requestHeaders,
		credentials: 'same-origin', // Include cookies
		// Body only for mutation requests
		body: body && isMutationMethod(method) ? (form ? body : JSON.stringify(body)) : undefined
	};
}

/**
 * The error of a failed response; an expired session also leads to the login
 */
async function failure(response: Response): Promise<ApiError> {
	if (response.status === 401) {
		if (browser) await goto('/login');
		return {
			code: 'UNAUTHORIZED',
			message: m.backend_unauthorized()
		};
	}
	const errorData = await response.json().catch(() => ({
		error: {
			code: 'UNKNOWN_ERROR',
			message: m.backend_unknown_error()
		}
	}));
	// The backend names its error as text, e.g. { error: 'Invoice not found' }, with a code the UI translates
	if (typeof errorData.error === 'string')
		return {
			code: errorData.code ?? `HTTP_${response.status}`,
			message: errorData.error,
			params: errorData.params,
			details: errorData
		};
	return (
		errorData.error || {
			code: `HTTP_${response.status}`,
			message: m.backend_unknown_error()
		}
	);
}

/**
 * Sends a request to the BFF and reads a successful response with `read`
 */
async function request<T>(
	path: string,
	{ method = 'GET', body, headers = {}, params }: ApiCallOptions,
	read: (response: Response) => Promise<T>
): Promise<ApiResponse<T>> {
	try {
		const response = await fetch(buildUrl(path, params), requestInit(method, body, headers));
		if (!response.ok) return { error: await failure(response) };
		return { data: await read(response) };
	} catch (error) {
		// Network or other errors
		const message = error instanceof Error ? error.message : 'Network request failed';
		return { error: { code: 'NETWORK_ERROR', message } };
	}
}

/**
 * Main API call helper
 */
export async function apiCall<T>(
	path: string,
	options: ApiCallOptions = {}
): Promise<ApiResponse<T>> {
	// A response without content has no body
	return request(path, options, async (response) =>
		response.status === 204 ? undefined : response.json()
	);
}

/**
 * API call with pagination support
 * Extracts pagination info from response headers
 */
export async function apiCallPaginated<T>(
	path: string,
	options: ApiCallOptions = {}
): Promise<ApiResponse<PaginatedResponse<T>>> {
	return request(path, options, async (response) => ({
		data: await response.json(),
		pagination: {
			totalCount: parseInt(response.headers.get('X-Total-Count') || '0', 10),
			page: parseInt(response.headers.get('X-Page') || '1', 10),
			pageSize: parseInt(response.headers.get('X-Page-Size') || '10', 10),
			totalPages: parseInt(response.headers.get('X-Total-Pages') || '1', 10)
		}
	}));
}

/**
 * Convenience methods for common operations
 */
export const api = {
	get: <T>(path: string, params?: Record<string, string>) =>
		apiCall<T>(path, { method: 'GET', params }),

	post: <T>(path: string, body?: unknown) => apiCall<T>(path, { method: 'POST', body }),

	put: <T>(path: string, body?: unknown) => apiCall<T>(path, { method: 'PUT', body }),

	delete: <T>(path: string) => apiCall<T>(path, { method: 'DELETE' }),

	getPaginated: <T>(path: string, params?: Record<string, string>) =>
		apiCallPaginated<T>(path, { method: 'GET', params })
};
