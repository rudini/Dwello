import { randomUUID } from 'crypto';
import { SignJWT } from 'jose';

// Same default as backend/src/middleware/auth.ts, so the BFF forwards a token the backend accepts.
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production';

// A signed-in Liegenschaftsverwalter: session JWT plus the XSRF cookie the client echoes in X-XSRF-TOKEN.
export async function sessionCookies(url: string) {
	const jwt = await new SignJWT({ email: 'verwalter@example.com', name: 'E2E Verwalter', provider: 'google' })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject('e2e-verwalter')
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(new TextEncoder().encode(JWT_SECRET));
	return [
		{ name: 'dwello_session', value: jwt, url },
		{ name: 'dwello_xsrf', value: randomUUID(), url }
	];
}
