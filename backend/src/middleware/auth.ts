/**
 * Authentication Middleware
 * JWT validation for protected routes
 */

import { Elysia } from 'elysia';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production';

export interface JwtPayload {
	sub: string;
	email: string;
	name: string;
	provider: string;
	iat: number;
	exp: number;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
	try {
		const secret = new TextEncoder().encode(JWT_SECRET);
		const { payload } = await jose.jwtVerify(token, secret);
		return payload as unknown as JwtPayload;
	} catch {
		return null;
	}
}

/**
 * Authentication middleware plugin for Elysia
 * Validates JWT from Authorization header
 */
export const authMiddleware = new Elysia({ name: 'auth' })
	.derive(async ({ headers, set }) => {
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

		if (!payload) {
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
	.onBeforeHandle(({ user, error, set }) => {
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
