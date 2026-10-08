/**
 * API Proxy Helper Unit Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Cookies } from '@sveltejs/kit';

import {
	buildBackendUrl,
	validateXsrfForMutation,
	forwardRequest,
	createProxyResponse,
	createBinaryResponse,
	handleProxyError,
	extractQueryParams,
	parseRequestBody
} from '../../src/lib/server/api-proxy';
import { cookieConfig } from '../../src/lib/server/jwt-config';
import { AppError, JWTError, ValidationError } from '../../src/lib/server/error-handler';

describe('API Proxy Helper Functions', () => {
	// The request's cookies; the proxy only reads them
	const createMockCookies = (cookieValues: Record<string, string> = {}) =>
		({ get: (name: string) => cookieValues[name] }) as unknown as Cookies;

	describe('buildBackendUrl', () => {
		it('should build URL without params', () => {
			const url = buildBackendUrl('/buildings');
			expect(url).toBe('http://localhost:3001/api/v1/buildings');
		});

		it('should build URL with query params', () => {
			const url = buildBackendUrl('/buildings', { page: '1', limit: '10' });
			expect(url).toBe('http://localhost:3001/api/v1/buildings?page=1&limit=10');
		});

		it('should handle empty params object', () => {
			const url = buildBackendUrl('/buildings', {});
			expect(url).toBe('http://localhost:3001/api/v1/buildings');
		});

		it('should handle special characters in params', () => {
			const url = buildBackendUrl('/tenants', { search: 'John Doe' });
			expect(url).toBe('http://localhost:3001/api/v1/tenants?search=John+Doe');
		});
	});

	describe('validateXsrfForMutation', () => {
		// The XSRF cookie and the header the page sends with it
		const xsrfCookies = () => createMockCookies({ [cookieConfig.xsrfName]: 'xsrf-token' });
		const withHeader = (token: string) => new Request('http://localhost', { headers: { 'X-XSRF-TOKEN': token } });

		it.each(['POST', 'PUT', 'DELETE', 'PATCH'])('should accept %s with the XSRF token of the cookie', (method) => {
			expect(() => validateXsrfForMutation(withHeader('xsrf-token'), xsrfCookies(), method)).not.toThrow();
		});

		it('should skip XSRF validation for GET request', () => {
			expect(() => validateXsrfForMutation(new Request('http://localhost'), createMockCookies(), 'GET')).not.toThrow();
		});

		it('should throw ValidationError for a token other than the cookie', () => {
			expect(() => validateXsrfForMutation(withHeader('evil-token'), xsrfCookies(), 'POST')).toThrow(ValidationError);
		});

		it('should throw ValidationError without a token', () => {
			expect(() => validateXsrfForMutation(new Request('http://localhost'), xsrfCookies(), 'POST')).toThrow(ValidationError);
		});
	});

	describe('forwardRequest', () => {
		let fetchSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			fetchSpy = vi.spyOn(global, 'fetch');
		});

		afterEach(() => {
			fetchSpy.mockRestore();
		});

		it('should throw JWTError when not authenticated', async () => {
			const mockCookies = createMockCookies();

			await expect(forwardRequest('/buildings', 'GET', mockCookies)).rejects.toThrow(JWTError);
		});

		it('should forward GET request with JWT', async () => {
			const mockCookies = createMockCookies({ [cookieConfig.sessionName]: 'valid-jwt-token' });

			const mockResponse = {
				status: 200,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Building 1' }] })
			};
			fetchSpy.mockResolvedValue(mockResponse as unknown as Response);

			const result = await forwardRequest('/buildings', 'GET', mockCookies);

			expect(result.status).toBe(200);
			expect(result.data).toEqual({ data: [{ id: 1, name: 'Building 1' }] });
			expect(fetchSpy).toHaveBeenCalledWith(
				'http://localhost:3001/api/v1/buildings',
				expect.objectContaining({
					method: 'GET',
					headers: expect.objectContaining({
						Authorization: 'Bearer valid-jwt-token'
					})
				})
			);
		});

		it('should forward POST request with body', async () => {
			const mockCookies = createMockCookies({ [cookieConfig.sessionName]: 'valid-jwt-token' });

			const mockResponse = {
				status: 201,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: vi.fn().mockResolvedValue({ id: 1, name: 'New Building' })
			};
			fetchSpy.mockResolvedValue(mockResponse as unknown as Response);

			const body = { name: 'New Building', address: '123 Main St' };
			const result = await forwardRequest('/buildings', 'POST', mockCookies, { body });

			expect(result.status).toBe(201);
			expect(fetchSpy).toHaveBeenCalledWith(
				'http://localhost:3001/api/v1/buildings',
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(body)
				})
			);
		});

		it('should handle query params', async () => {
			const mockCookies = createMockCookies({ [cookieConfig.sessionName]: 'valid-jwt-token' });

			const mockResponse = {
				status: 200,
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: vi.fn().mockResolvedValue({ data: [] })
			};
			fetchSpy.mockResolvedValue(mockResponse as unknown as Response);

			await forwardRequest('/buildings', 'GET', mockCookies, {
				params: { page: '1', limit: '10' }
			});

			expect(fetchSpy).toHaveBeenCalledWith(
				'http://localhost:3001/api/v1/buildings?page=1&limit=10',
				expect.anything()
			);
		});

		it('should handle binary response (PDF)', async () => {
			const mockCookies = createMockCookies({ [cookieConfig.sessionName]: 'valid-jwt-token' });

			const mockArrayBuffer = new ArrayBuffer(8);
			const mockResponse = {
				status: 200,
				headers: new Headers({ 'Content-Type': 'application/pdf' }),
				arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer)
			};
			fetchSpy.mockResolvedValue(mockResponse as unknown as Response);

			const result = await forwardRequest<ArrayBuffer>('/statements/1/pdf', 'GET', mockCookies);

			expect(result.status).toBe(200);
			expect(result.data).toBe(mockArrayBuffer);
		});

		it('should handle text response', async () => {
			const mockCookies = createMockCookies({ [cookieConfig.sessionName]: 'valid-jwt-token' });

			const mockResponse = {
				status: 200,
				headers: new Headers({ 'Content-Type': 'text/plain' }),
				text: vi.fn().mockResolvedValue('Hello World')
			};
			fetchSpy.mockResolvedValue(mockResponse as unknown as Response);

			const result = await forwardRequest<string>('/health', 'GET', mockCookies);

			expect(result.status).toBe(200);
			expect(result.data).toBe('Hello World');
		});

		it('should throw AppError on timeout', async () => {
			const mockCookies = createMockCookies({ [cookieConfig.sessionName]: 'valid-jwt-token' });

			const timeoutError = new Error('Timeout');
			timeoutError.name = 'TimeoutError';
			fetchSpy.mockRejectedValue(timeoutError);

			await expect(forwardRequest('/buildings', 'GET', mockCookies)).rejects.toThrow(AppError);
		});

		it('should throw AppError on connection error', async () => {
			const mockCookies = createMockCookies({ [cookieConfig.sessionName]: 'valid-jwt-token' });

			const connectionError = new TypeError('fetch failed');
			fetchSpy.mockRejectedValue(connectionError);

			await expect(forwardRequest('/buildings', 'GET', mockCookies)).rejects.toThrow(AppError);
		});
	});

	describe('createProxyResponse', () => {
		it('should create JSON response with correct status', () => {
			const proxyResponse = {
				status: 200,
				data: { buildings: [] },
				headers: new Headers()
			};

			const response = createProxyResponse(proxyResponse);

			expect(response.status).toBe(200);
			expect(response.headers.get('Content-Type')).toBe('application/json');
		});

		it('should copy pagination headers', async () => {
			const headers = new Headers();
			headers.set('X-Total-Count', '100');
			headers.set('X-Page', '1');
			headers.set('X-Page-Size', '10');
			headers.set('X-Total-Pages', '10');

			const proxyResponse = {
				status: 200,
				data: { buildings: [] },
				headers
			};

			const response = createProxyResponse(proxyResponse);

			expect(response.headers.get('X-Total-Count')).toBe('100');
			expect(response.headers.get('X-Page')).toBe('1');
			expect(response.headers.get('X-Page-Size')).toBe('10');
			expect(response.headers.get('X-Total-Pages')).toBe('10');
		});

		it('should serialize data as JSON', async () => {
			const proxyResponse = {
				status: 200,
				data: { id: 1, name: 'Test' },
				headers: new Headers()
			};

			const response = createProxyResponse(proxyResponse);
			const body = await response.json();

			expect(body).toEqual({ id: 1, name: 'Test' });
		});

		it('passes on "204 No Content" without a body, e.g. after a delete', async () => {
			const response = createProxyResponse({ status: 204, data: '', headers: new Headers() });

			expect(response.status).toBe(204);
			expect(await response.text()).toBe('');
		});
	});

	describe('createBinaryResponse', () => {
		it('should create binary response with correct content type', () => {
			const data = new ArrayBuffer(8);
			const response = createBinaryResponse(data, 'application/pdf');

			expect(response.status).toBe(200);
			expect(response.headers.get('Content-Type')).toBe('application/pdf');
		});

		it('should set Content-Disposition header with filename', () => {
			const data = new ArrayBuffer(8);
			const response = createBinaryResponse(data, 'application/pdf', 'statement-1.pdf');

			expect(response.headers.get('Content-Disposition')).toBe(
				'attachment; filename="statement-1.pdf"'
			);
		});

		it('should not set Content-Disposition without filename', () => {
			const data = new ArrayBuffer(8);
			const response = createBinaryResponse(data, 'application/pdf');

			expect(response.headers.get('Content-Disposition')).toBeNull();
		});
	});

	describe('handleProxyError', () => {
		it('should handle AppError', async () => {
			const error = new AppError('Service unavailable', 503, 'SERVICE_UNAVAILABLE');
			const response = handleProxyError(error, 'GET /buildings');

			expect(response.status).toBe(503);
			const body = await response.json();
			expect(body.error.code).toBe('SERVICE_UNAVAILABLE');
			expect(body.error.message).toBe('Service unavailable');
		});

		it('should handle JWTError', async () => {
			const error = new JWTError('Not authenticated', 401);
			const response = handleProxyError(error, 'GET /buildings');

			expect(response.status).toBe(401);
			const body = await response.json();
			expect(body.error.code).toBe('JWT_ERROR');
		});

		it('should handle ValidationError', async () => {
			const error = new ValidationError('Invalid XSRF token');
			const response = handleProxyError(error, 'POST /buildings');

			expect(response.status).toBe(400);
			const body = await response.json();
			expect(body.error.code).toBe('VALIDATION_ERROR');
		});

		it('should handle generic Error', async () => {
			const error = new Error('Something went wrong');
			const response = handleProxyError(error, 'GET /buildings');

			expect(response.status).toBe(500);
			const body = await response.json();
			expect(body.error.code).toBe('PROXY_ERROR');
			expect(body.error.message).toBe('An error occurred while processing the request');
		});

		it('should handle unknown error', async () => {
			const error = 'string error';
			const response = handleProxyError(error, 'GET /buildings');

			expect(response.status).toBe(500);
			const body = await response.json();
			expect(body.error.code).toBe('UNKNOWN_ERROR');
		});
	});

	describe('extractQueryParams', () => {
		it('should extract all query params', () => {
			const url = new URL('http://localhost?page=1&limit=10&sort=name');
			const params = extractQueryParams(url);

			expect(params).toEqual({
				page: '1',
				limit: '10',
				sort: 'name'
			});
		});

		it('should return empty object for no params', () => {
			const url = new URL('http://localhost/buildings');
			const params = extractQueryParams(url);

			expect(params).toEqual({});
		});

		it('should handle special characters', () => {
			const url = new URL('http://localhost?search=John%20Doe');
			const params = extractQueryParams(url);

			expect(params).toEqual({
				search: 'John Doe'
			});
		});
	});

	describe('parseRequestBody', () => {
		it('should parse valid JSON body', async () => {
			const body = JSON.stringify({ name: 'Test', value: 123 });
			const request = new Request('http://localhost', {
				method: 'POST',
				body
			});

			const result = await parseRequestBody(request);

			expect(result).toEqual({ name: 'Test', value: 123 });
		});

		it('should return null for empty body', async () => {
			const request = new Request('http://localhost', {
				method: 'POST',
				body: ''
			});

			const result = await parseRequestBody(request);

			expect(result).toBeNull();
		});

		it('should throw ValidationError for invalid JSON', async () => {
			const request = new Request('http://localhost', {
				method: 'POST',
				body: 'not valid json'
			});

			await expect(parseRequestBody(request)).rejects.toThrow(ValidationError);
		});
	});
});
