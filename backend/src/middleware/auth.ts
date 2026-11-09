/**
 * Authentication Middleware
 * JWT validation for protected routes
 */

import { Elysia } from 'elysia';
import * as jose from 'jose';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db/connection';
import { localAccounts } from '../db/schema';

/** A session of a Konto mit Passwort holds while the account exists and its password was not set again after it began */
async function localSessionHolds(sub: string, issuedAt: number): Promise<boolean> {
	const id = sub.replace(/^local:/, '');
	if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
	const [account] = await db.select({ changed: localAccounts.passwordChangedAt }).from(localAccounts).where(eq(localAccounts.id, id));
	return !!account && Math.floor(account.changed.getTime() / 1000) <= issuedAt;
}

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production';

/**
 * Zod schema for JWT payload validation
 */
const JwtPayloadSchema = z.object({
	sub: z.string(),
	email: z.string().email(),
	name: z.string(),
	provider: z.string(),
	iat: z.number(),
	auth_time: z.number().optional(), // the sign-in, kept by every refresh of the session (code review 576 C-2)
	exp: z.number()
});

type JwtPayload = z.infer<typeof JwtPayloadSchema>;

/**
 * Verify and decode a JWT token with proper validation
 */
async function verifyJwt(token: string): Promise<JwtPayload | null> {
	try {
		const secret = new TextEncoder().encode(JWT_SECRET);
		// Issued by the BFF for this app (src/lib/server/jwt-config.ts)
		const { payload } = await jose.jwtVerify(token, secret, { issuer: 'dwello', audience: 'dwello-app' });

		// Validate payload structure with Zod
		const result = JwtPayloadSchema.safeParse(payload);
		if (!result.success) {
			console.warn('JWT payload validation failed:', result.error.message);
			return null;
		}

		return result.data;
	} catch {
		return null;
	}
}

/** A JWT for one in-process call of the API on behalf of an AI program with a Zugangsschlüssel (#817, ADR 0007) */
export const accessKeyToken = (keyId: string) =>
	new jose.SignJWT({ email: 'ki-programm@dwello.invalid', name: 'KI-Programm', provider: 'access-key' })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(keyId)
		.setIssuer('dwello')
		.setAudience('dwello-app')
		.setIssuedAt()
		.setExpirationTime('1m')
		.sign(new TextEncoder().encode(JWT_SECRET));

/**
 * Authentication middleware plugin for Elysia
 * Validates JWT from Authorization header
 */
export const authMiddleware = new Elysia({ name: 'auth' })
	// 'scoped' so the hooks protect the routes of every module that uses this plugin
	.derive({ as: 'scoped' }, async ({ headers, status }) => {
		const authHeader = headers.authorization;

		// refused here, before the route checks its body or query: without a session every route answers 401 (S1, #936)
		if (!authHeader || !authHeader.startsWith('Bearer '))
			return status(401, { message: 'Missing or invalid authorization header' });

		const token = authHeader.substring(7);
		const payload = await verifyJwt(token);

		if (!payload || (payload.provider === 'local' && !(await localSessionHolds(payload.sub, payload.auth_time ?? payload.iat))))
			return status(401, { message: 'Invalid or expired token' });

		return {
			user: {
				id: payload.sub,
				email: payload.email,
				name: payload.name,
				provider: payload.provider,
				// the sign-in, in seconds: a new Wiederherstellungscode needs a recent one (#718)
				authTime: payload.auth_time ?? payload.iat
			}
		};
	});
