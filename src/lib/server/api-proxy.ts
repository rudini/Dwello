/**
 * API Proxy Helper Functions
 * Forwards requests from SvelteKit BFF to ElysiaJS backend
 */

import { env } from '$env/dynamic/private';
import { getJwtFromCookie, validateXsrfToken } from './auth';
import { JWTError, ValidationError, AppError, logger } from './error-handler';
import type { Cookies } from '@sveltejs/kit';

/**
 * HTTP methods that require XSRF validation
 */
const MUTATION_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

/**
 * Options for forwarding requests
 */
interface ForwardOptions {
	body?: unknown;
	params?: Record<string, string>;
	headers?: Record<string, string>;
}

/**
 * Response from the backend API
 */
interface ProxyResponse<T = unknown> {
	status: number;
	data: T;
	headers: Headers;
}

/**
 * Get the backend API URL from environment
 */
function getBackendUrl(): string {
	return process.env.BACKEND_URL || 'http://localhost:3001';
}

/**
 * Get the backend API timeout from environment
 */
function getBackendTimeout(): number {
	return parseInt(env.BACKEND_API_TIMEOUT || '30000', 10);
}

/**
 * Build the full backend URL for an API path
 */
export function buildBackendUrl(path: string, params?: Record<string, string>): string {
	const baseUrl = getBackendUrl();
	let url = `${baseUrl}/api/v1${path}`;

	if (params && Object.keys(params).length > 0) {
		const searchParams = new URLSearchParams(params);
		url += `?${searchParams.toString()}`;
	}

	return url;
}

/**
 * Validate XSRF token for mutation requests
 * @param request The incoming request
 * @param cookies SvelteKit cookies object
 * @param method HTTP method
 * @throws ValidationError if XSRF token is invalid for mutation requests
 */
export function validateXsrfForMutation(request: Request, cookies: Cookies, method: string): void {
	if (MUTATION_METHODS.includes(method.toUpperCase())) {
		if (!validateXsrfToken(request, cookies)) {
			throw new ValidationError('Invalid XSRF token');
		}
	}
}

/**
 * Forward a request to the backend API
 * @param path API path (e.g., '/buildings')
 * @param method HTTP method
 * @param cookies SvelteKit cookies object
 * @param options Additional options (body, params, headers)
 * @returns Response from backend
 */
export async function forwardRequest<T = unknown>(
	path: string,
	method: string,
	cookies: Cookies,
	options: ForwardOptions = {}
): Promise<ProxyResponse<T>> {
	// Extract JWT from cookies
	const jwt = getJwtFromCookie(cookies);

	if (!jwt) {
		throw new JWTError('Not authenticated', 401);
	}

	// Build backend URL
	const url = buildBackendUrl(path, options.params);

	// Prepare headers
	const headers: Record<string, string> = {
		Authorization: `Bearer ${jwt}`,
		'Content-Type': 'application/json',
		...options.headers
	};

	// Prepare fetch options
	const fetchOptions: RequestInit = {
		method: method.toUpperCase(),
		headers,
		signal: AbortSignal.timeout(getBackendTimeout())
	};

	// Add body for mutation requests
	if (options.body && MUTATION_METHODS.includes(method.toUpperCase())) {
		fetchOptions.body = JSON.stringify(options.body);
	}

	logger.debug('Forwarding request to backend', {
		url,
		method: method.toUpperCase(),
		hasBody: !!options.body
	});

	try {
		const response = await fetch(url, fetchOptions);

		// Parse response body
		let data: T;
		const contentType = response.headers.get('content-type');

		if (contentType?.includes('application/json')) {
			data = await response.json();
		} else if (contentType?.includes('application/pdf')) {
			// Return raw response for binary data
			data = (await response.arrayBuffer()) as unknown as T;
		} else {
			data = (await response.text()) as unknown as T;
		}

		logger.debug('Backend response received', {
			url,
			status: response.status
		});

		return {
			status: response.status,
			data,
			headers: response.headers
		};
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			logger.error('Backend request timeout', error, { url, method });
			throw new AppError('Backend request timeout', 504, 'GATEWAY_TIMEOUT');
		}

		if (error instanceof Error && error.name === 'TypeError') {
			logger.error('Backend connection failed', error, { url, method });
			throw new AppError('Backend service unavailable', 503, 'SERVICE_UNAVAILABLE');
		}

		throw error;
	}
}

/**
 * Create a JSON response from proxy response
 */
export function createProxyResponse<T>(proxyResponse: ProxyResponse<T>): Response {
	const { status, data, headers: backendHeaders } = proxyResponse;

	// Copy relevant headers from backend
	const responseHeaders = new Headers();
	responseHeaders.set('Content-Type', 'application/json');

	// Copy pagination headers if present
	const paginationHeaders = ['X-Total-Count', 'X-Page', 'X-Page-Size', 'X-Total-Pages'];

	for (const header of paginationHeaders) {
		const value = backendHeaders.get(header);
		if (value) {
			responseHeaders.set(header, value);
		}
	}

	// A response without content may carry no body
	return new Response(status === 204 ? null : JSON.stringify(data), {
		status,
		headers: responseHeaders
	});
}

/**
 * Create a binary response (for PDFs, etc.)
 */
export function createBinaryResponse(
	data: ArrayBuffer,
	contentType: string,
	filename?: string
): Response {
	const headers = new Headers();
	headers.set('Content-Type', contentType);

	if (filename) {
		headers.set('Content-Disposition', `attachment; filename="${filename}"`);
	}

	return new Response(data, {
		status: 200,
		headers
	});
}

/**
 * Handle common proxy errors
 */
export function handleProxyError(error: unknown, operation: string): Response {
	if (error instanceof AppError) {
		logger.error(`Proxy error: ${operation}`, error, { operation });
		return new Response(
			JSON.stringify({
				error: {
					code: error.code,
					message: error.message
				}
			}),
			{
				status: error.statusCode,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	if (error instanceof Error) {
		logger.error(`Proxy error: ${operation}`, error, { operation });
		return new Response(
			JSON.stringify({
				error: {
					code: 'PROXY_ERROR',
					message: 'An error occurred while processing the request'
				}
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	return new Response(
		JSON.stringify({
			error: {
				code: 'UNKNOWN_ERROR',
				message: 'An unexpected error occurred'
			}
		}),
		{
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		}
	);
}

/**
 * Extract query parameters from URL
 */
export function extractQueryParams(url: URL): Record<string, string> {
	const params: Record<string, string> = {};

	url.searchParams.forEach((value, key) => {
		params[key] = value;
	});

	return params;
}

/**
 * Parse request body as JSON
 */
export async function parseRequestBody<T = unknown>(request: Request): Promise<T | null> {
	try {
		const text = await request.text();
		if (!text) return null;
		return JSON.parse(text) as T;
	} catch {
		throw new ValidationError('Invalid JSON body');
	}
}
