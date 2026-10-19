/**
 * Unit Tests for src/lib/server/oauth.ts
 * Tests OAuth URL generation, token exchange, and user profile fetching
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after mocking
import {
	generateOAuthUrl,
	exchangeCodeForToken,
	fetchUserProfile,
	isValidProvider,
	validateProviderConfig,
	getConfiguredProviders
} from '$lib/server/oauth';

describe('OAuth URL Generation', () => {
	describe('generateOAuthUrl', () => {
		it('should generate Google OAuth URL with correct parameters', () => {
			const state = 'test-state-123';
			const url = generateOAuthUrl('google', state);

			expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
			expect(url).toContain('client_id=google-client-id');
			expect(url).toContain('redirect_uri=');
			expect(url).toContain('response_type=code');
			expect(url).toContain(`state=${state}`);
			expect(url).toContain('scope=');
		});

		it('should generate Microsoft OAuth URL with correct parameters', () => {
			const state = 'test-state-456';
			const url = generateOAuthUrl('microsoft', state);

			expect(url).toContain('https://login.microsoftonline.com');
			expect(url).toContain('oauth2/v2.0/authorize');
			expect(url).toContain('client_id=microsoft-client-id');
			expect(url).toContain(`state=${state}`);
			expect(url).toContain('response_mode=query');
		});

		it('should include openid scope for Google', () => {
			const url = generateOAuthUrl('google', 'state');
			expect(url).toContain('openid');
		});

		it('should include openid scope for Microsoft', () => {
			const url = generateOAuthUrl('microsoft', 'state');
			expect(url).toContain('openid');
		});

		// #82: Dwello asks for no lasting access to the account
		it('should not request offline access or a forced consent', () => {
			const url = generateOAuthUrl('google', 'state');
			expect(url).not.toContain('access_type');
			expect(url).not.toContain('consent');
			// #51: only the choice of the account, so a refused account is not signed in again at once
			expect(new URL(url).searchParams.get('prompt')).toBe('select_account');
		});
	});
});

describe('OAuth Token Exchange', () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	describe('exchangeCodeForToken', () => {
		it('should exchange code for Google token', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					access_token: 'google-access-token',
					token_type: 'Bearer',
					expires_in: 3600,
					refresh_token: 'google-refresh-token'
				})
			});

			const result = await exchangeCodeForToken('auth-code', 'google');

			expect(result.access_token).toBe('google-access-token');
			expect(result.token_type).toBe('Bearer');
			expect(mockFetch).toHaveBeenCalledWith(
				'https://oauth2.googleapis.com/token',
				expect.objectContaining({
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				})
			);
		});

		it('should exchange code for Microsoft token', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					access_token: 'ms-access-token',
					token_type: 'Bearer',
					expires_in: 3600
				})
			});

			const result = await exchangeCodeForToken('auth-code', 'microsoft');

			expect(result.access_token).toBe('ms-access-token');
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining('login.microsoftonline.com'),
				expect.any(Object)
			);
		});

		it('should throw error on failed token exchange', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				text: async () => 'Invalid authorization code'
			});

			await expect(exchangeCodeForToken('bad-code', 'google')).rejects.toThrow(
				'Token exchange failed'
			);
		});

		it('should include correct grant type', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ access_token: 'token', token_type: 'Bearer', expires_in: 3600 })
			});

			await exchangeCodeForToken('code', 'google');

			const callBody = mockFetch.mock.calls[0][1].body;
			expect(callBody).toContain('grant_type=authorization_code');
		});
	});
});

describe('User Profile Fetching', () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	describe('fetchUserProfile', () => {
		it('should fetch Google user profile', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: 'google-user-123',
					email: 'user@gmail.com',
					verified_email: true,
					name: 'Google User',
					picture: 'https://google.com/photo.jpg'
				})
			});

			const profile = await fetchUserProfile('access-token', 'google');

			expect(profile.sub).toBe('google-user-123');
			expect(profile.email).toBe('user@gmail.com');
			expect(profile.name).toBe('Google User');
			expect(profile.provider).toBe('google');
			// #82: the profile picture Google also sends is not taken over
			expect(profile).not.toHaveProperty('picture');
			expect(profile.emailVerified).toBe(true);
		});

		it('meldet, wenn Google die Adresse nicht bestätigt hat (#51)', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: 'g-1', email: 'neu@gmail.com', verified_email: false, name: 'Neu' })
			});

			expect((await fetchUserProfile('access-token', 'google')).emailVerified).toBe(false);
		});

		it('zählt eine Adresse ohne Angabe von Google als nicht bestätigt (#51)', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: 'g-2', email: 'ohne@gmail.com', name: 'Ohne' })
			});

			expect((await fetchUserProfile('access-token', 'google')).emailVerified).toBe(false);
		});

		it('should fetch Microsoft user profile', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: 'ms-user-456',
					displayName: 'Microsoft User',
					mail: 'user@outlook.com',
					userPrincipalName: 'user@outlook.com'
				})
			});

			const profile = await fetchUserProfile('access-token', 'microsoft');

			expect(profile.sub).toBe('ms-user-456');
			expect(profile.email).toBe('user@outlook.com');
			expect(profile.name).toBe('Microsoft User');
			expect(profile.provider).toBe('microsoft');
		});

		it('should use userPrincipalName if mail is not available', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: 'ms-user-789',
					displayName: 'MS User',
					userPrincipalName: 'msuser@contoso.com'
				})
			});

			const profile = await fetchUserProfile('access-token', 'microsoft');

			expect(profile.email).toBe('msuser@contoso.com');
		});

		it('should throw error on failed profile fetch', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				text: async () => 'Unauthorized'
			});

			await expect(fetchUserProfile('bad-token', 'google')).rejects.toThrow(
				'Failed to fetch user profile'
			);
		});

		it('should include Authorization header', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					id: '123',
					email: 'test@test.com',
					name: 'Test',
					verified_email: true
				})
			});

			await fetchUserProfile('my-access-token', 'google');

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: { Authorization: 'Bearer my-access-token' }
				})
			);
		});
	});
});

describe('Provider Validation', () => {
	describe('isValidProvider', () => {
		it('should return true for google', () => {
			expect(isValidProvider('google')).toBe(true);
		});

		it('should return true for microsoft', () => {
			expect(isValidProvider('microsoft')).toBe(true);
		});

		it('should return false for invalid provider', () => {
			expect(isValidProvider('facebook')).toBe(false);
			expect(isValidProvider('twitter')).toBe(false);
			expect(isValidProvider('')).toBe(false);
		});
	});

	describe('validateProviderConfig', () => {
		it('should return true for configured Google', () => {
			expect(validateProviderConfig('google')).toBe(true);
		});

		it('should return true for configured Microsoft', () => {
			expect(validateProviderConfig('microsoft')).toBe(true);
		});
	});

	describe('getConfiguredProviders', () => {
		it('should return list of configured providers', () => {
			const providers = getConfiguredProviders();

			expect(providers).toContain('google');
			expect(providers).toContain('microsoft');
		});
	});
});

describe('Error Handling', () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	it('should handle network errors in token exchange', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		await expect(exchangeCodeForToken('code', 'google')).rejects.toThrow('Network error');
	});

	it('should handle network errors in profile fetch', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		await expect(fetchUserProfile('token', 'google')).rejects.toThrow('Network error');
	});

	it('should include error details in token exchange failure', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 400,
			text: async () => '{"error": "invalid_grant", "error_description": "Code expired"}'
		});

		await expect(exchangeCodeForToken('expired-code', 'google')).rejects.toThrow(/400/);
	});
});
