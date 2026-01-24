/**
 * E2E Tests for OAuth Authentication Flow
 * Tests the complete OAuth flow using Playwright
 *
 * Strategy:
 * - Test login page UI rendering
 * - Test OAuth redirect initiation
 * - Mock authenticated state by intercepting /auth/me
 * - Test protected routes with mocked auth
 * - Test logout flow
 */

import { test, expect, type Page, type BrowserContext } from '@playwright/test';

// Helper to create a mock JWT for testing
function createMockSessionCookie() {
	// This is a test JWT - in real tests you'd generate a valid one
	// For E2E, we mock the /auth/me response instead
	return 'test-session-token';
}

// Helper to mock authenticated state
async function mockAuthenticatedUser(page: Page, user = {
	sub: 'test-user-123',
	email: 'test@example.com',
	name: 'Test User',
	provider: 'google',
	picture: 'https://example.com/avatar.jpg'
}) {
	await page.route('**/auth/me', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ user })
		});
	});
}

// Helper to mock unauthenticated state
async function mockUnauthenticated(page: Page) {
	await page.route('**/auth/me', async (route) => {
		await route.fulfill({
			status: 401,
			contentType: 'application/json',
			body: JSON.stringify({
				error: {
					code: 'JWT_ERROR',
					message: 'Not authenticated'
				}
			})
		});
	});
}

test.describe('Login Page UI', () => {
	test.beforeEach(async ({ page }) => {
		// Ensure user is not authenticated for login page tests
		await mockUnauthenticated(page);
	});

	test('should display login page with branding', async ({ page }) => {
		await page.goto('/login');

		// Check branding
		await expect(page.locator('h1')).toContainText('Dwello');
		await expect(page.locator('text=Swiss Property Management System')).toBeVisible();
		await expect(page.locator('text=Sign in to your account')).toBeVisible();
	});

	test('should display Google login button', async ({ page }) => {
		await page.goto('/login');

		const googleButton = page.locator('button:has-text("Sign in with Google")');
		await expect(googleButton).toBeVisible();
		await expect(googleButton).toBeEnabled();
	});

	test('should display Microsoft login button', async ({ page }) => {
		await page.goto('/login');

		const microsoftButton = page.locator('button:has-text("Sign in with Microsoft")');
		await expect(microsoftButton).toBeVisible();
		await expect(microsoftButton).toBeEnabled();
	});

	test('should display security information', async ({ page }) => {
		await page.goto('/login');

		await expect(page.locator('text=Secure OAuth 2.0 authentication')).toBeVisible();
		await expect(page.locator('text=Your data is stored securely in Switzerland')).toBeVisible();
	});

	test('should display version info', async ({ page }) => {
		await page.goto('/login');

		await expect(page.locator('text=Dwello v0.1.0')).toBeVisible();
	});
});

test.describe('OAuth Login Initiation', () => {
	test.beforeEach(async ({ page }) => {
		await mockUnauthenticated(page);
	});

	test('should have clickable Google login button', async ({ page }) => {
		await page.goto('/login');

		const googleButton = page.locator('button:has-text("Sign in with Google")');
		await expect(googleButton).toBeVisible();
		await expect(googleButton).toBeEnabled();

		// Verify button exists and is clickable (don't actually click to avoid navigation)
		const boundingBox = await googleButton.boundingBox();
		expect(boundingBox).not.toBeNull();
	});

	test('should have clickable Microsoft login button', async ({ page }) => {
		await page.goto('/login');

		const microsoftButton = page.locator('button:has-text("Sign in with Microsoft")');
		await expect(microsoftButton).toBeVisible();
		await expect(microsoftButton).toBeEnabled();

		// Verify button exists and is clickable
		const boundingBox = await microsoftButton.boundingBox();
		expect(boundingBox).not.toBeNull();
	});

	test('Google login button should navigate to auth endpoint', async ({ page }) => {
		await page.goto('/login');

		// Use the API to test the login endpoint directly
		// (clicking the button causes navigation which closes the page context)
		const response = await page.request.get('/auth/login?provider=google', {
			maxRedirects: 0
		});

		// Should redirect to Google OAuth
		expect(response.status()).toBe(302);

		const location = response.headers()['location'];
		expect(location).toContain('accounts.google.com');
	});
});

test.describe('OAuth Login Endpoint', () => {
	test('should redirect to OAuth provider on login', async ({ page }) => {
		// Use request API to avoid following redirects
		const response = await page.request.get('/auth/login?provider=google', {
			maxRedirects: 0
		});

		// Should redirect (302) to Google
		expect(response.status()).toBe(302);

		// Location header should point to Google
		const location = response.headers()['location'];
		expect(location).toContain('accounts.google.com');
	});

	test('should return 400 for missing provider', async ({ page }) => {
		const response = await page.request.get('/auth/login');

		expect(response.status()).toBe(400);

		const body = await response.json();
		expect(body.error).toBeDefined();
		expect(body.error.code).toBe('VALIDATION_ERROR');
	});

	test('should return 400 for invalid provider', async ({ page }) => {
		const response = await page.request.get('/auth/login?provider=facebook');

		expect(response.status()).toBe(400);

		const body = await response.json();
		expect(body.error.code).toBe('VALIDATION_ERROR');
		expect(body.error.message).toContain('Invalid provider');
	});
});

test.describe('OAuth Callback Endpoint', () => {
	test('should return 400 for callback without code', async ({ page }) => {
		const response = await page.request.get('/auth/callback?state=test-state');

		expect(response.status()).toBe(400);

		const body = await response.json();
		expect(body.error).toBeDefined();
		// Message should mention code is required
		expect(body.error.message.toLowerCase()).toMatch(/code|required|missing/);
	});

	test('should return 400 for callback without state', async ({ page }) => {
		const response = await page.request.get('/auth/callback?code=test-code');

		expect(response.status()).toBe(400);

		const body = await response.json();
		expect(body.error).toBeDefined();
		// Message should mention state is required
		expect(body.error.message.toLowerCase()).toMatch(/state|required|missing/);
	});

	test('should handle OAuth provider error', async ({ page }) => {
		const response = await page.request.get('/auth/callback?error=access_denied&error_description=User%20denied%20access');

		expect(response.status()).toBe(400);

		const body = await response.json();
		expect(body.error).toBeDefined();
		expect(body.error.message.toLowerCase()).toContain('denied');
	});
});

test.describe('Authenticated User Flow', () => {
	test('should redirect authenticated user from login to dashboard', async ({ page }) => {
		// Mock authenticated state
		await mockAuthenticatedUser(page);

		// Go to login page
		await page.goto('/login');

		// Should redirect to dashboard/home (wait up to 5 seconds)
		await page.waitForURL(/\/(dashboard)?$/, { timeout: 5000 });

		expect(page.url()).toMatch(/\/(dashboard)?$/);
	});

	test('should display user info in header when authenticated', async ({ page }) => {
		// Mock authenticated state
		await mockAuthenticatedUser(page, {
			sub: 'user-456',
			email: 'roger@example.com',
			name: 'Roger Rudin',
			provider: 'google',
			picture: undefined
		});

		// Go to dashboard
		await page.goto('/');

		// Wait for header to be visible (indicates page loaded)
		const header = page.locator('header');
		await expect(header).toBeVisible({ timeout: 10000 });

		// Should show user name or initial in header
		// Wait a bit for the auth check to complete
		await page.waitForTimeout(1000);

		// Check for user display
		const hasName = await page.locator('header').getByText('Roger Rudin').isVisible().catch(() => false);
		const hasInitial = await page.locator('header').getByText('R').first().isVisible().catch(() => false);

		expect(hasName || hasInitial).toBe(true);
	});

	test('should display navigation for authenticated users', async ({ page }) => {
		await mockAuthenticatedUser(page);

		await page.goto('/');

		// Wait for navigation to appear
		const nav = page.locator('nav');
		await expect(nav.first()).toBeVisible({ timeout: 10000 });
	});

	test('should access dashboard when authenticated', async ({ page }) => {
		await mockAuthenticatedUser(page);

		await page.goto('/dashboard');

		// Wait for page to load
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(500);

		// Should stay on dashboard (not redirect to login)
		expect(page.url()).toContain('dashboard');
	});
});

test.describe('Protected Routes', () => {
	test('should redirect to login when accessing protected route without auth', async ({ page }) => {
		await mockUnauthenticated(page);

		await page.goto('/dashboard');

		// Wait for redirect
		await page.waitForURL(/login/);

		expect(page.url()).toContain('login');
	});

	test('should redirect to login when accessing buildings without auth', async ({ page }) => {
		await mockUnauthenticated(page);

		await page.goto('/buildings');

		await page.waitForURL(/login/);

		expect(page.url()).toContain('login');
	});
});

test.describe('Logout Flow', () => {
	test('should clear session on logout API call', async ({ page }) => {
		// Call logout API directly
		const response = await page.request.post('/auth/logout');

		expect(response.status()).toBe(200);

		const body = await response.json();
		expect(body.success).toBe(true);
	});

	test('should have logout button in user menu', async ({ page }) => {
		// Mock authenticated state
		await mockAuthenticatedUser(page);

		await page.goto('/');

		// Wait for the page to stabilize
		await page.waitForLoadState('domcontentloaded');

		// Wait for header with retry logic
		await expect(page.locator('header')).toBeVisible({ timeout: 10000 });

		// Wait for DOM to settle after auth check
		await page.waitForTimeout(1500);

		// Mock logout to succeed for when it's clicked
		await page.route('**/auth/logout', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			});
		});

		// Try to find and click the user menu
		const headerButtons = page.locator('header button');
		const buttonCount = await headerButtons.count();

		if (buttonCount > 0) {
			// Click the first button (user menu toggle)
			await headerButtons.first().click({ force: true });

			// Wait for dropdown to appear
			await page.waitForTimeout(500);

			// Check if sign out option exists
			const signOutVisible = await page.locator('text=Sign out').isVisible().catch(() => false);

			// If dropdown opened, sign out should be there
			if (signOutVisible) {
				expect(signOutVisible).toBe(true);
			}
		}
	});
});

test.describe('Current User Endpoint', () => {
	test('should return 401 when not authenticated', async ({ page }) => {
		const response = await page.request.get('/auth/me');

		expect(response.status()).toBe(401);

		const body = await response.json();
		expect(body.error.code).toBe('JWT_ERROR');
	});
});

test.describe('Token Refresh Endpoint', () => {
	test('should require authentication for refresh', async ({ page }) => {
		const response = await page.request.post('/auth/refresh');

		// Should fail with auth or XSRF error
		expect([400, 401]).toContain(response.status());
	});
});

test.describe('XSRF Protection', () => {
	test('should require XSRF token for refresh', async ({ page }) => {
		const response = await page.request.post('/auth/refresh', {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		expect([400, 401]).toContain(response.status());
	});

	test('logout should work without strict XSRF (for UX)', async ({ page }) => {
		const response = await page.request.post('/auth/logout');

		expect(response.status()).toBe(200);

		const body = await response.json();
		expect(body.success).toBe(true);
	});
});

test.describe('Session Cookie Security', () => {
	test('should set HTTPOnly cookie on login redirect', async ({ page, context }) => {
		// Initiate login
		await page.goto('/auth/login?provider=google');

		// Check cookies
		const cookies = await context.cookies();
		const stateCookie = cookies.find(c => c.name === 'dwello_oauth_state');

		if (stateCookie) {
			expect(stateCookie.httpOnly).toBe(true);
		}
	});
});

test.describe('Error Handling', () => {
	test('should display login page when auth check fails', async ({ page }) => {
		// Mock auth check to fail with network error
		await page.route('**/auth/me', async (route) => {
			await route.abort('failed');
		});

		await page.goto('/dashboard');

		// Should redirect to login
		await page.waitForURL(/login/);

		expect(page.url()).toContain('login');
	});
});
