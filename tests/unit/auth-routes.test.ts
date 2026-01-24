/**
 * Integration Tests for Auth Routes
 * Tests the auth endpoints with mocked OAuth providers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally before imports
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the auth module functions
vi.mock('$lib/server/auth', async () => {
	const actual = await vi.importActual<typeof import('$lib/server/auth')>('$lib/server/auth');
	return {
		...actual,
		generateOAuthState: vi.fn(() => 'mock-state-abc123'),
		setOAuthStateCookie: vi.fn(),
		validateOAuthState: vi.fn(() => true),
		setSessionCookie: vi.fn(),
		setXsrfToken: vi.fn(() => 'mock-xsrf-token'),
		getJwtFromCookie: vi.fn(),
		validateXsrfToken: vi.fn(() => true),
		clearAuthCookies: vi.fn()
	};
});

// Mock oauth module
vi.mock('$lib/server/oauth', async () => {
	const actual = await vi.importActual<typeof import('$lib/server/oauth')>('$lib/server/oauth');
	return {
		...actual,
		validateProviderConfig: vi.fn(() => true),
		generateOAuthUrl: vi.fn(
			(provider: string, state: string) =>
				`https://mock-oauth.com/authorize?provider=${provider}&state=${state}`
		),
		exchangeCodeForToken: vi.fn(async () => ({
			access_token: 'mock-access-token',
			token_type: 'Bearer',
			expires_in: 3600
		})),
		fetchUserProfile: vi.fn(async () => ({
			sub: 'user-123',
			email: 'test@example.com',
			name: 'Test User',
			provider: 'google' as const,
			picture: 'https://example.com/photo.jpg'
		}))
	};
});

import * as authModule from '$lib/server/auth';
import * as oauthModule from '$lib/server/oauth';

// Helper to create mock cookies
function createMockCookies() {
	const store = new Map<string, string>();
	return {
		get: vi.fn((name: string) => store.get(name)),
		set: vi.fn((name: string, value: string) => store.set(name, value)),
		delete: vi.fn((name: string) => store.delete(name)),
		_store: store
	};
}

// Helper to create mock request event
function createMockRequestEvent(options: {
	url: string;
	method?: string;
	headers?: Record<string, string>;
	cookies?: ReturnType<typeof createMockCookies>;
}) {
	const url = new URL(options.url);
	const cookies = options.cookies || createMockCookies();

	return {
		url,
		request: new Request(url, {
			method: options.method || 'GET',
			headers: options.headers || {}
		}),
		cookies,
		locals: {},
		params: {},
		platform: undefined,
		route: { id: null },
		setHeaders: vi.fn(),
		isDataRequest: false,
		isSubRequest: false,
		fetch: vi.fn()
	};
}

describe('Auth Routes Integration Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockFetch.mockReset();
	});

	describe('GET /auth/login', () => {
		it('should redirect to OAuth provider for valid provider', async () => {
			const { GET } = await import('$lib/../routes/auth/login/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/login?provider=google'
			});

			try {
				await GET(event as any);
				expect.fail('Should have thrown redirect');
			} catch (error: any) {
				expect(error.status).toBe(302);
				expect(error.location).toContain('mock-oauth.com');
				expect(error.location).toContain('google');
			}
		});

		it('should set OAuth state cookie before redirect', async () => {
			const { GET } = await import('$lib/../routes/auth/login/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/login?provider=google'
			});

			try {
				await GET(event as any);
			} catch {
				// Expected redirect
			}

			expect(authModule.setOAuthStateCookie).toHaveBeenCalled();
		});

		it('should return 400 for missing provider', async () => {
			const { GET } = await import('$lib/../routes/auth/login/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/login'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(400);

			const data = await response.json();
			expect(data.error.code).toBe('VALIDATION_ERROR');
		});

		it('should return 400 for invalid provider', async () => {
			const { GET } = await import('$lib/../routes/auth/login/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/login?provider=facebook'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(400);

			const data = await response.json();
			expect(data.error.message).toContain('Invalid provider');
		});

		it('should support Microsoft provider', async () => {
			const { GET } = await import('$lib/../routes/auth/login/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/login?provider=microsoft'
			});

			try {
				await GET(event as any);
				expect.fail('Should have thrown redirect');
			} catch (error: any) {
				expect(error.status).toBe(302);
				expect(error.location).toContain('microsoft');
			}
		});
	});

	describe('GET /auth/callback', () => {
		it('should exchange code and create session on valid callback', async () => {
			const { GET } = await import('$lib/../routes/auth/callback/+server');
			const cookies = createMockCookies();
			cookies._store.set('dwello_oauth_state', 'mock-state-abc123');

			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/callback?code=auth-code-123&state=mock-state-abc123',
				cookies
			});

			try {
				await GET(event as any);
				expect.fail('Should have thrown redirect');
			} catch (error: any) {
				expect(error.status).toBe(302);
				expect(error.location).toBe('/dashboard');
			}

			expect(oauthModule.exchangeCodeForToken).toHaveBeenCalled();
			expect(oauthModule.fetchUserProfile).toHaveBeenCalled();
			expect(authModule.setSessionCookie).toHaveBeenCalled();
			expect(authModule.setXsrfToken).toHaveBeenCalled();
		});

		it('should return 400 for missing code', async () => {
			const { GET } = await import('$lib/../routes/auth/callback/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/callback?state=some-state'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(400);

			const data = await response.json();
			expect(data.error.code).toBe('VALIDATION_ERROR');
		});

		it('should return 400 for missing state', async () => {
			const { GET } = await import('$lib/../routes/auth/callback/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/callback?code=some-code'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(400);
		});

		it('should return 400 for state mismatch', async () => {
			vi.mocked(authModule.validateOAuthState).mockReturnValueOnce(false);

			const { GET } = await import('$lib/../routes/auth/callback/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/callback?code=auth-code&state=wrong-state'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(400);

			const data = await response.json();
			expect(data.error.message).toContain('state');
		});

		it('should handle OAuth provider error response', async () => {
			const { GET } = await import('$lib/../routes/auth/callback/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/callback?error=access_denied&error_description=User%20denied%20access'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(400);

			const data = await response.json();
			expect(data.error.message).toContain('denied');
		});
	});

	describe('GET /auth/me', () => {
		it('should return user info for valid session', async () => {
			vi.mocked(authModule.getJwtFromCookie).mockReturnValue('valid-jwt-token');

			// Mock verifyJwt to return user data
			const mockVerifyJwt = vi.spyOn(authModule, 'verifyJwt');
			mockVerifyJwt.mockResolvedValue({
				sub: 'user-123',
				email: 'test@example.com',
				name: 'Test User',
				provider: 'google',
				picture: 'https://example.com/photo.jpg',
				iss: 'dwello',
				aud: 'dwello-app',
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 3600
			});

			const { GET } = await import('$lib/../routes/auth/me/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/me'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.user.sub).toBe('user-123');
			expect(data.user.email).toBe('test@example.com');
			expect(data.user.name).toBe('Test User');
		});

		it('should return 401 for missing session', async () => {
			vi.mocked(authModule.getJwtFromCookie).mockReturnValue(null);

			const { GET } = await import('$lib/../routes/auth/me/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/me'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(401);
		});

		it('should return 401 for expired token', async () => {
			vi.mocked(authModule.getJwtFromCookie).mockReturnValue('expired-jwt-token');

			const mockVerifyJwt = vi.spyOn(authModule, 'verifyJwt');
			mockVerifyJwt.mockRejectedValue(new Error('Token expired'));

			const { GET } = await import('$lib/../routes/auth/me/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/me'
			});

			const response = await GET(event as any);
			expect(response.status).toBe(401);
		});
	});

	describe('POST /auth/refresh', () => {
		it('should refresh token for valid session', async () => {
			vi.mocked(authModule.getJwtFromCookie).mockReturnValue('valid-jwt-token');
			vi.mocked(authModule.validateXsrfToken).mockReturnValue(true);

			const mockVerifyJwt = vi.spyOn(authModule, 'verifyJwt');
			mockVerifyJwt.mockResolvedValue({
				sub: 'user-123',
				email: 'test@example.com',
				name: 'Test User',
				provider: 'google',
				iss: 'dwello',
				aud: 'dwello-app',
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 3600
			});

			const mockGenerateJwt = vi.spyOn(authModule, 'generateJwt');
			mockGenerateJwt.mockResolvedValue('new-jwt-token');

			const { POST } = await import('$lib/../routes/auth/refresh/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/refresh',
				method: 'POST',
				headers: { 'X-XSRF-TOKEN': 'valid-xsrf-token' }
			});

			const response = await POST(event as any);
			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.success).toBe(true);
			expect(authModule.setSessionCookie).toHaveBeenCalled();
			expect(authModule.setXsrfToken).toHaveBeenCalled();
		});

		it('should return 400 for invalid XSRF token', async () => {
			vi.mocked(authModule.validateXsrfToken).mockReturnValue(false);

			const { POST } = await import('$lib/../routes/auth/refresh/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/refresh',
				method: 'POST'
			});

			const response = await POST(event as any);
			expect(response.status).toBe(400);
		});

		it('should return 401 for missing session', async () => {
			vi.mocked(authModule.validateXsrfToken).mockReturnValue(true);
			vi.mocked(authModule.getJwtFromCookie).mockReturnValue(null);

			const { POST } = await import('$lib/../routes/auth/refresh/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/refresh',
				method: 'POST'
			});

			const response = await POST(event as any);
			expect(response.status).toBe(401);
		});
	});

	describe('POST /auth/logout', () => {
		it('should clear cookies and return success', async () => {
			vi.mocked(authModule.validateXsrfToken).mockReturnValue(true);
			vi.mocked(authModule.getJwtFromCookie).mockReturnValue('valid-jwt-token');

			const mockVerifyJwt = vi.spyOn(authModule, 'verifyJwt');
			mockVerifyJwt.mockResolvedValue({
				sub: 'user-123',
				email: 'test@example.com',
				name: 'Test User',
				provider: 'google',
				iss: 'dwello',
				aud: 'dwello-app',
				iat: Math.floor(Date.now() / 1000),
				exp: Math.floor(Date.now() / 1000) + 3600
			});

			const { POST } = await import('$lib/../routes/auth/logout/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/logout',
				method: 'POST',
				headers: { 'X-XSRF-TOKEN': 'valid-xsrf-token' }
			});

			const response = await POST(event as any);
			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.success).toBe(true);
			expect(authModule.clearAuthCookies).toHaveBeenCalled();
		});

		it('should still logout without valid XSRF token', async () => {
			vi.mocked(authModule.validateXsrfToken).mockReturnValue(false);
			vi.mocked(authModule.getJwtFromCookie).mockReturnValue(null);

			const { POST } = await import('$lib/../routes/auth/logout/+server');
			const event = createMockRequestEvent({
				url: 'http://localhost:3000/auth/logout',
				method: 'POST'
			});

			const response = await POST(event as any);
			expect(response.status).toBe(200);

			const data = await response.json();
			expect(data.success).toBe(true);
			expect(authModule.clearAuthCookies).toHaveBeenCalled();
		});
	});
});
