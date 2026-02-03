/**
 * Client-Side API Helper
 * Provides type-safe API calls with automatic XSRF token handling
 */

import { browser } from '$app/environment';
import { goto } from '$app/navigation';

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

/**
 * Main API call helper
 * Automatically includes XSRF token for mutation requests
 * Handles 401 errors by redirecting to login
 */
export async function apiCall<T>(
	path: string,
	options: ApiCallOptions = {}
): Promise<ApiResponse<T>> {
	const { method = 'GET', body, headers = {}, params } = options;

	// Build request headers with XSRF token for mutations
	const requestHeaders = buildRequestHeaders(method, headers);

	// Build fetch options
	const fetchOptions: RequestInit = {
		method,
		headers: requestHeaders,
		credentials: 'same-origin' // Include cookies
	};

	// Add body for mutation requests
	if (body && isMutationMethod(method)) {
		fetchOptions.body = JSON.stringify(body);
	}

	try {
		const url = buildUrl(path, params);
		const response = await fetch(url, fetchOptions);

		// Handle 401 - redirect to login
		if (response.status === 401) {
			if (browser) {
				await goto('/login');
			}
			return {
				error: {
					code: 'UNAUTHORIZED',
					message: 'Session expired. Please log in again.'
				}
			};
		}

		// Handle other error responses
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				error: {
					code: 'UNKNOWN_ERROR',
					message: 'An unexpected error occurred'
				}
			}));

			return {
				error: errorData.error || {
					code: `HTTP_${response.status}`,
					message: response.statusText || 'Request failed'
				}
			};
		}

		// Parse successful response
		const data = await response.json();
		return { data };
	} catch (error) {
		// Network or other errors
		return {
			error: {
				code: 'NETWORK_ERROR',
				message: error instanceof Error ? error.message : 'Network request failed'
			}
		};
	}
}

/**
 * API call with pagination support
 * Extracts pagination info from response headers
 * SECURITY: Now properly includes XSRF token for mutation requests
 */
export async function apiCallPaginated<T>(
	path: string,
	options: ApiCallOptions = {}
): Promise<ApiResponse<PaginatedResponse<T>>> {
	const { params = {}, body } = options;
	const method = options.method || 'GET';

	// Build URL and make request
	const url = buildUrl(path, params);

	// Build request headers with XSRF token for mutations
	const requestHeaders = buildRequestHeaders(method, options.headers);

	// Build fetch options
	const fetchOptions: RequestInit = {
		method,
		headers: requestHeaders,
		credentials: 'same-origin'
	};

	// Add body for mutation requests
	if (body && isMutationMethod(method)) {
		fetchOptions.body = JSON.stringify(body);
	}

	try {
		const response = await fetch(url, fetchOptions);

		// Handle 401 - redirect to login
		if (response.status === 401) {
			if (browser) {
				await goto('/login');
			}
			return {
				error: {
					code: 'UNAUTHORIZED',
					message: 'Session expired. Please log in again.'
				}
			};
		}

		// Handle other error responses
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({
				error: {
					code: 'UNKNOWN_ERROR',
					message: 'An unexpected error occurred'
				}
			}));

			return {
				error: errorData.error || {
					code: `HTTP_${response.status}`,
					message: response.statusText || 'Request failed'
				}
			};
		}

		// Parse data
		const data = await response.json();

		// Extract pagination from headers
		const pagination: PaginationInfo = {
			totalCount: parseInt(response.headers.get('X-Total-Count') || '0', 10),
			page: parseInt(response.headers.get('X-Page') || '1', 10),
			pageSize: parseInt(response.headers.get('X-Page-Size') || '10', 10),
			totalPages: parseInt(response.headers.get('X-Total-Pages') || '1', 10)
		};

		return {
			data: {
				data,
				pagination
			}
		};
	} catch (error) {
		return {
			error: {
				code: 'NETWORK_ERROR',
				message: error instanceof Error ? error.message : 'Network request failed'
			}
		};
	}
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
