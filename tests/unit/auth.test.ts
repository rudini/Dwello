/**
 * Unit Tests for src/lib/server/auth.ts
 * Tests JWT generation, verification, cookie management, and XSRF protection
 */

import { describe, it, expect, vi } from 'vitest';
import type { Cookies } from '@sveltejs/kit';
import {
	generateJwt,
	verifyJwt,
	setSessionCookie,
	setXsrfToken,
	getJwtFromCookie,
	validateXsrfToken,
	clearAuthCookies,
	setOAuthStateCookie,
	validateOAuthState,
	generateOAuthState,
	type JwtPayload
} from '$lib/server/auth';

// Mock cookies helper
function createMockCookies() {
	const cookieStore = new Map<string, string>();

	return {
		get: vi.fn((name: string) => cookieStore.get(name)),
		set: vi.fn((name: string, value: string) => {
			cookieStore.set(name, value);
		}),
		delete: vi.fn((name: string) => {
			cookieStore.delete(name);
		}),
		_store: cookieStore
	} as unknown as Cookies & { _store: Map<string, string> };
}

// Sample user payload for testing
const testUser: JwtPayload = {
	sub: 'user-123',
	email: 'test@example.com',
	name: 'Test User',
	provider: 'google',
	picture: 'https://example.com/photo.jpg'
};

describe('JWT Generation and Verification', () => {
	describe('generateJwt', () => {
		it('should generate a valid JWT token', async () => {
			const token = await generateJwt(testUser);

			expect(token).toBeDefined();
			expect(typeof token).toBe('string');
			expect(token.split('.').length).toBe(3); // JWT has 3 parts
		});

		it('should include user data in the token', async () => {
			const token = await generateJwt(testUser);
			const decoded = await verifyJwt(token);

			expect(decoded.sub).toBe(testUser.sub);
			expect(decoded.email).toBe(testUser.email);
			expect(decoded.name).toBe(testUser.name);
			expect(decoded.provider).toBe(testUser.provider);
			expect(decoded.picture).toBe(testUser.picture);
		});

		it('should set correct issuer and audience', async () => {
			const token = await generateJwt(testUser);
			const decoded = await verifyJwt(token);

			expect(decoded.iss).toBe('dwello');
			expect(decoded.aud).toBe('dwello-app');
		});

		it('should set issued at and expiration timestamps', async () => {
			const before = Math.floor(Date.now() / 1000);
			const token = await generateJwt(testUser);
			const after = Math.floor(Date.now() / 1000);
			const decoded = await verifyJwt(token);

			expect(decoded.iat).toBeGreaterThanOrEqual(before);
			expect(decoded.iat).toBeLessThanOrEqual(after);
			expect(decoded.exp).toBeGreaterThan(decoded.iat);
		});

		it('should handle missing optional picture field', async () => {
			const userWithoutPicture: JwtPayload = {
				sub: 'user-456',
				email: 'nopic@example.com',
				name: 'No Picture',
				provider: 'microsoft'
			};

			const token = await generateJwt(userWithoutPicture);
			const decoded = await verifyJwt(token);

			expect(decoded.picture).toBeUndefined();
		});
	});

	describe('verifyJwt', () => {
		it('should verify a valid token', async () => {
			const token = await generateJwt(testUser);
			const decoded = await verifyJwt(token);

			expect(decoded).toBeDefined();
			expect(decoded.sub).toBe(testUser.sub);
		});

		it('should reject an invalid token', async () => {
			await expect(verifyJwt('invalid.token.here')).rejects.toThrow();
		});

		it('should reject a token with wrong signature', async () => {
			const token = await generateJwt(testUser);
			const tamperedToken = token.slice(0, -10) + 'tampered00';

			await expect(verifyJwt(tamperedToken)).rejects.toThrow();
		});

		it('should reject an empty token', async () => {
			await expect(verifyJwt('')).rejects.toThrow();
		});
	});
});

describe('Cookie Management', () => {
	describe('setSessionCookie', () => {
		it('should set session cookie with correct name', () => {
			const cookies = createMockCookies();
			const jwt = 'test-jwt-token';

			setSessionCookie(cookies, jwt);

			expect(cookies.set).toHaveBeenCalledWith(
				'dwello_session',
				jwt,
				expect.objectContaining({
					httpOnly: true,
					path: '/'
				})
			);
		});

		it('should set HTTPOnly flag', () => {
			const cookies = createMockCookies();

			setSessionCookie(cookies, 'test-token');

			expect(cookies.set).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String),
				expect.objectContaining({ httpOnly: true })
			);
		});

		it('should set SameSite attribute', () => {
			const cookies = createMockCookies();

			setSessionCookie(cookies, 'test-token');

			expect(cookies.set).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String),
				expect.objectContaining({ sameSite: 'lax' })
			);
		});
	});

	describe('setXsrfToken', () => {
		it('should generate and set XSRF token', () => {
			const cookies = createMockCookies();

			const token = setXsrfToken(cookies);

			expect(token).toBeDefined();
			expect(typeof token).toBe('string');
			expect(token.length).toBe(64); // 32 bytes = 64 hex chars
		});

		it('should NOT set HTTPOnly flag (must be readable by JS)', () => {
			const cookies = createMockCookies();

			setXsrfToken(cookies);

			expect(cookies.set).toHaveBeenCalledWith(
				'dwello_xsrf',
				expect.any(String),
				expect.objectContaining({ httpOnly: false })
			);
		});

		it('should generate unique tokens', () => {
			const cookies1 = createMockCookies();
			const cookies2 = createMockCookies();

			const token1 = setXsrfToken(cookies1);
			const token2 = setXsrfToken(cookies2);

			expect(token1).not.toBe(token2);
		});
	});

	describe('getJwtFromCookie', () => {
		it('should return JWT from session cookie', () => {
			const cookies = createMockCookies();
			cookies._store.set('dwello_session', 'stored-jwt-token');

			const jwt = getJwtFromCookie(cookies);

			expect(jwt).toBe('stored-jwt-token');
		});

		it('should return null if no session cookie', () => {
			const cookies = createMockCookies();

			const jwt = getJwtFromCookie(cookies);

			expect(jwt).toBeNull();
		});
	});

	describe('clearAuthCookies', () => {
		it('should delete session cookie', () => {
			const cookies = createMockCookies();

			clearAuthCookies(cookies);

			expect(cookies.delete).toHaveBeenCalledWith(
				'dwello_session',
				expect.any(Object)
			);
		});

		it('should delete XSRF cookie', () => {
			const cookies = createMockCookies();

			clearAuthCookies(cookies);

			expect(cookies.delete).toHaveBeenCalledWith(
				'dwello_xsrf',
				expect.any(Object)
			);
		});

		it('should delete OAuth state cookie', () => {
			const cookies = createMockCookies();

			clearAuthCookies(cookies);

			expect(cookies.delete).toHaveBeenCalledWith(
				'dwello_oauth_state',
				expect.any(Object)
			);
		});
	});
});

describe('XSRF Token Validation', () => {
	describe('validateXsrfToken', () => {
		it('should return true for matching tokens', () => {
			const cookies = createMockCookies();
			const token = 'matching-xsrf-token-value';
			cookies._store.set('dwello_xsrf', token);

			const request = new Request('http://localhost', {
				headers: { 'X-XSRF-TOKEN': token }
			});

			const result = validateXsrfToken(request, cookies);

			expect(result).toBe(true);
		});

		it('should return false for mismatched tokens', () => {
			const cookies = createMockCookies();
			cookies._store.set('dwello_xsrf', 'cookie-token');

			const request = new Request('http://localhost', {
				headers: { 'X-XSRF-TOKEN': 'different-token' }
			});

			const result = validateXsrfToken(request, cookies);

			expect(result).toBe(false);
		});

		it('should return false if no cookie token', () => {
			const cookies = createMockCookies();

			const request = new Request('http://localhost', {
				headers: { 'X-XSRF-TOKEN': 'header-token' }
			});

			const result = validateXsrfToken(request, cookies);

			expect(result).toBe(false);
		});

		it('should return false if no header token', () => {
			const cookies = createMockCookies();
			cookies._store.set('dwello_xsrf', 'cookie-token');

			const request = new Request('http://localhost');

			const result = validateXsrfToken(request, cookies);

			expect(result).toBe(false);
		});

		it('should return false for different length tokens', () => {
			const cookies = createMockCookies();
			cookies._store.set('dwello_xsrf', 'short');

			const request = new Request('http://localhost', {
				headers: { 'X-XSRF-TOKEN': 'much-longer-token' }
			});

			const result = validateXsrfToken(request, cookies);

			expect(result).toBe(false);
		});
	});
});

describe('OAuth State Management', () => {
	describe('generateOAuthState', () => {
		it('should generate a random state string', () => {
			const state = generateOAuthState();

			expect(state).toBeDefined();
			expect(typeof state).toBe('string');
			expect(state.length).toBe(64); // 32 bytes = 64 hex chars
		});

		it('should generate unique states', () => {
			const state1 = generateOAuthState();
			const state2 = generateOAuthState();

			expect(state1).not.toBe(state2);
		});
	});

	describe('setOAuthStateCookie', () => {
		it('should set state cookie with HTTPOnly', () => {
			const cookies = createMockCookies();

			setOAuthStateCookie(cookies, 'test-state');

			expect(cookies.set).toHaveBeenCalledWith(
				'dwello_oauth_state',
				'test-state',
				expect.objectContaining({ httpOnly: true })
			);
		});

		it('should set short maxAge (10 minutes)', () => {
			const cookies = createMockCookies();

			setOAuthStateCookie(cookies, 'test-state');

			expect(cookies.set).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String),
				expect.objectContaining({ maxAge: 600 })
			);
		});
	});

	describe('validateOAuthState', () => {
		it('should return true for matching state', () => {
			const cookies = createMockCookies();
			const state = 'matching-state-value';
			cookies._store.set('dwello_oauth_state', state);

			const result = validateOAuthState(cookies, state);

			expect(result).toBe(true);
		});

		it('should return false for mismatched state', () => {
			const cookies = createMockCookies();
			cookies._store.set('dwello_oauth_state', 'stored-state');

			const result = validateOAuthState(cookies, 'different-state');

			expect(result).toBe(false);
		});

		it('should return false if no stored state', () => {
			const cookies = createMockCookies();

			const result = validateOAuthState(cookies, 'expected-state');

			expect(result).toBe(false);
		});

		it('should return false for empty expected state', () => {
			const cookies = createMockCookies();
			cookies._store.set('dwello_oauth_state', 'stored-state');

			const result = validateOAuthState(cookies, '');

			expect(result).toBe(false);
		});
	});
});
