import { randomUUID } from 'crypto';
import { SignJWT } from 'jose';

// Same default as backend/src/middleware/auth.ts, so the BFF forwards a token the backend accepts.
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production';

// Session JWT of the signed-in Liegenschaftsverwalter
export const sessionToken = () =>
	new SignJWT({ email: 'verwalter@example.com', name: 'E2E Verwalter', provider: 'google' })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject('e2e-verwalter')
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(new TextEncoder().encode(JWT_SECRET));

// Session JWT plus the XSRF cookie the client echoes in X-XSRF-TOKEN
export async function sessionCookies(url: string) {
	return [
		{ name: 'dwello_session', value: await sessionToken(), url },
		{ name: 'dwello_xsrf', value: randomUUID(), url }
	];
}
