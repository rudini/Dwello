/**
 * Client API Helper Unit Tests
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock $app/environment
vi.mock('$app/environment', () => ({
	browser: true
}));

// Mock $app/navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

import { getXsrfTokenFromCookie, apiCall, apiCallPaginated, api } from '../../src/lib/api';
import { goto } from '$app/navigation';

describe('Client API Helper', () => {
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		fetchSpy = vi.spyOn(global, 'fetch');
		vi.clearAllMocks();
		// Clear cookies
		Object.defineProperty(document, 'cookie', {
			writable: true,
			value: ''
		});
	});

	afterEach(() => {
		fetchSpy.mockRestore();
	});

	describe('getXsrfTokenFromCookie', () => {
		it('should return null when no dwello_xsrf cookie exists', () => {
			document.cookie = 'other-cookie=value';
			const token = getXsrfTokenFromCookie();
			expect(token).toBeNull();
		});

		it('should extract dwello_xsrf from cookies', () => {
			document.cookie = 'dwello_xsrf=test-token-123';
			const token = getXsrfTokenFromCookie();
			expect(token).toBe('test-token-123');
		});

		it('should handle URL-encoded token values', () => {
			document.cookie = 'dwello_xsrf=' + encodeURIComponent('token=with=equals');
			const token = getXsrfTokenFromCookie();
			expect(token).toBe('token=with=equals');
		});

		it('should handle multiple cookies', () => {
			document.cookie = 'session=abc; dwello_xsrf=my-token; other=xyz';
			const token = getXsrfTokenFromCookie();
			expect(token).toBe('my-token');
		});
	});

	describe('apiCall', () => {
		it('should make GET request to correct URL', async () => {
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 200,
				json: vi.fn().mockResolvedValue({ buildings: [] })
			} as unknown as Response);

			await apiCall('/buildings');

			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings',
				expect.objectContaining({
					method: 'GET',
					credentials: 'same-origin'
				})
			);
		});

		it('should include query params in URL', async () => {
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 200,
				json: vi.fn().mockResolvedValue({ data: [] })
			} as unknown as Response);

			await apiCall('/buildings', { params: { page: '1', limit: '10' } });

			expect(fetchSpy).toHaveBeenCalledWith('/api/buildings?page=1&limit=10', expect.anything());
		});

		it('should include XSRF token for POST requests', async () => {
			document.cookie = 'dwello_xsrf=csrf-token-123';
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 201,
				json: vi.fn().mockResolvedValue({ id: 1 })
			} as unknown as Response);

			await apiCall('/buildings', {
				method: 'POST',
				body: { name: 'New Building' }
			});

			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings',
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						'X-XSRF-TOKEN': 'csrf-token-123'
					}),
					body: JSON.stringify({ name: 'New Building' })
				})
			);
		});

		it('should include XSRF token for PUT requests', async () => {
			document.cookie = 'dwello_xsrf=csrf-token-456';
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 200,
				json: vi.fn().mockResolvedValue({ id: 1 })
			} as unknown as Response);

			await apiCall('/buildings/1', {
				method: 'PUT',
				body: { name: 'Updated Building' }
			});

			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings/1',
				expect.objectContaining({
					method: 'PUT',
					headers: expect.objectContaining({
						'X-XSRF-TOKEN': 'csrf-token-456'
					})
				})
			);
		});

		it('should include XSRF token for DELETE requests', async () => {
			document.cookie = 'dwello_xsrf=csrf-token-789';
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 204,
				json: vi.fn().mockResolvedValue({})
			} as unknown as Response);

			await apiCall('/buildings/1', { method: 'DELETE' });

			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings/1',
				expect.objectContaining({
					method: 'DELETE',
					headers: expect.objectContaining({
						'X-XSRF-TOKEN': 'csrf-token-789'
					})
				})
			);
		});

		it('should NOT include XSRF token for GET requests', async () => {
			document.cookie = 'dwello_xsrf=csrf-token';
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 200,
				json: vi.fn().mockResolvedValue({ data: [] })
			} as unknown as Response);

			await apiCall('/buildings', { method: 'GET' });

			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings',
				expect.not.objectContaining({
					headers: expect.objectContaining({
						'X-XSRF-TOKEN': expect.any(String)
					})
				})
			);
		});

		it('should redirect to login on 401 response', async () => {
			fetchSpy.mockResolvedValue({
				ok: false,
				status: 401,
				json: vi.fn().mockResolvedValue({
					error: { code: 'UNAUTHORIZED', message: 'Not authenticated' }
				})
			} as unknown as Response);

			const result = await apiCall('/buildings');

			expect(goto).toHaveBeenCalledWith('/login');
			expect(result.error?.code).toBe('UNAUTHORIZED');
		});

		it('should return error for non-OK responses', async () => {
			fetchSpy.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: 'Not Found',
				json: vi.fn().mockResolvedValue({
					error: { code: 'NOT_FOUND', message: 'Building not found' }
				})
			} as unknown as Response);

			const result = await apiCall('/buildings/999');

			expect(result.error?.code).toBe('NOT_FOUND');
			expect(result.error?.message).toBe('Building not found');
		});

		it('should return success data for OK responses', async () => {
			const mockData = { id: 1, name: 'Building 1' };
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 200,
				json: vi.fn().mockResolvedValue(mockData)
			} as unknown as Response);

			const result = await apiCall<typeof mockData>('/buildings/1');

			expect(result.data).toEqual(mockData);
			expect(result.error).toBeUndefined();
		});

		it('accepts "204 No Content" without reading a body, e.g. after a delete', async () => {
			fetchSpy.mockResolvedValue(new Response(null, { status: 204 }));

			const result = await apiCall('/invoices/i1', { method: 'DELETE' });

			expect(result).toEqual({ data: undefined });
		});

		it('should handle network errors', async () => {
			fetchSpy.mockRejectedValue(new Error('Network request failed'));

			const result = await apiCall('/buildings');

			expect(result.error?.code).toBe('NETWORK_ERROR');
			expect(result.error?.message).toBe('Network request failed');
		});

		it('should handle JSON parse errors in error response', async () => {
			fetchSpy.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
			} as unknown as Response);

			const result = await apiCall('/buildings');

			expect(result.error?.code).toBe('UNKNOWN_ERROR');
		});
	});

	describe('apiCallPaginated', () => {
		it('should extract pagination from headers', async () => {
			const headers = new Headers();
			headers.set('X-Total-Count', '100');
			headers.set('X-Page', '2');
			headers.set('X-Page-Size', '10');
			headers.set('X-Total-Pages', '10');

			fetchSpy.mockResolvedValue({
				ok: true,
				status: 200,
				headers,
				json: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }])
			} as unknown as Response);

			const result = await apiCallPaginated('/buildings', {
				params: { page: '2', limit: '10' }
			});

			expect(result.data?.pagination).toEqual({
				totalCount: 100,
				page: 2,
				pageSize: 10,
				totalPages: 10
			});
			expect(result.data?.data).toEqual([{ id: 1 }, { id: 2 }]);
		});

		it('should handle missing pagination headers', async () => {
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers(),
				json: vi.fn().mockResolvedValue([])
			} as unknown as Response);

			const result = await apiCallPaginated('/buildings');

			expect(result.data?.pagination).toEqual({
				totalCount: 0,
				page: 1,
				pageSize: 10,
				totalPages: 1
			});
		});
	});

	describe('api convenience methods', () => {
		beforeEach(() => {
			fetchSpy.mockResolvedValue({
				ok: true,
				status: 200,
				json: vi.fn().mockResolvedValue({ success: true })
			} as unknown as Response);
		});

		it('api.get should make GET request', async () => {
			await api.get('/buildings');
			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings',
				expect.objectContaining({ method: 'GET' })
			);
		});

		it('api.post should make POST request with body', async () => {
			await api.post('/buildings', { name: 'Test' });
			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings',
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({ name: 'Test' })
				})
			);
		});

		it('api.put should make PUT request with body', async () => {
			await api.put('/buildings/1', { name: 'Updated' });
			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings/1',
				expect.objectContaining({
					method: 'PUT',
					body: JSON.stringify({ name: 'Updated' })
				})
			);
		});

		it('api.delete should make DELETE request', async () => {
			await api.delete('/buildings/1');
			expect(fetchSpy).toHaveBeenCalledWith(
				'/api/buildings/1',
				expect.objectContaining({ method: 'DELETE' })
			);
		});
	});
});
