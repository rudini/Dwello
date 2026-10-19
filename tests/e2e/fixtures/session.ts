import { randomUUID } from 'crypto';
import { SignJWT } from 'jose';

// Frontend and backend of the E2E stack get this secret (playwright.config.ts), so they accept the sessions below
export const E2E_JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production';

// Session JWT of the signed-in Liegenschaftsverwalter, as /auth/callback issues it; `expires` lets it run out
// (#51: only verwalter@example.com is in the stack's ALLOWED_EMAILS)
export const sessionToken = (expires: string | number = '1h', email = 'verwalter@example.com') =>
	new SignJWT({ email, name: 'Vera Verwalter', provider: 'google' })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject('e2e-verwalter')
		.setIssuer('dwello')
		.setAudience('dwello-app')
		.setIssuedAt()
		.setExpirationTime(expires)
		.sign(new TextEncoder().encode(E2E_JWT_SECRET));

// Session JWT plus the XSRF cookie the client echoes in X-XSRF-TOKEN
export async function sessionCookies(url: string, expires?: string | number, email?: string) {
	return [
		{ name: 'dwello_session', value: await sessionToken(expires, email), url },
		{ name: 'dwello_xsrf', value: randomUUID(), url }
	];
}
