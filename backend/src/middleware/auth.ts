/**
 * Authentication Middleware
 * JWT validation for protected routes
 */

import { Elysia } from 'elysia';
import * as jose from 'jose';
import { z } from 'zod';
import { localSessionHolds } from '../services/local-account.service';

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

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

/**
 * Verify and decode a JWT token with proper validation
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
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

/**
 * Authentication middleware plugin for Elysia
 * Validates JWT from Authorization header
 */
export const authMiddleware = new Elysia({ name: 'auth' })
	// 'scoped' so the hooks protect the routes of every module that uses this plugin
	.derive({ as: 'scoped' }, async ({ headers, set }) => {
		const authHeader = headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			set.status = 401;
			return {
				user: null,
				error: { message: 'Missing or invalid authorization header' }
			};
		}

		const token = authHeader.substring(7);
		const payload = await verifyJwt(token);

		if (!payload || (payload.provider === 'local' && !(await localSessionHolds(payload.sub, payload.auth_time ?? payload.iat)))) {
			set.status = 401;
			return {
				user: null,
				error: { message: 'Invalid or expired token' }
			};
		}

		return {
			user: {
				id: payload.sub,
				email: payload.email,
				name: payload.name,
				provider: payload.provider
			},
			error: null
		};
	})
	.onBeforeHandle({ as: 'scoped' }, ({ user, error, set }) => {
		if (!user && error) {
			set.status = 401;
			return error;
		}
	});

/**
 * Optional auth middleware - allows unauthenticated requests but still parses token if present
 */
export const optionalAuthMiddleware = new Elysia({ name: 'optional-auth' }).derive(
	async ({ headers }) => {
		const authHeader = headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return { user: null };
		}

		const token = authHeader.substring(7);
		const payload = await verifyJwt(token);

		if (!payload) {
			return { user: null };
		}

		return {
			user: {
				id: payload.sub,
				email: payload.email,
				name: payload.name,
				provider: payload.provider
			}
		};
	}
);
