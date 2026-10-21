/**
 * Server-side Authentication Utilities
 * Handles JWT generation/verification, cookie management, and XSRF protection
 */

import * as jose from 'jose';
import { jwtConfig, cookieConfig } from './jwt-config';
import type { Cookies } from '@sveltejs/kit';
import { randomBytes } from 'crypto';

/**
 * User payload stored in JWT
 */
export interface JwtPayload {
	sub: string; // User ID
	email: string;
	name: string;
	provider: 'google' | 'microsoft' | 'swisseid' | 'local'; // local: Konto mit Passwort (#576)
	auth_time?: number; // the sign-in, kept by every refresh: a new password ends the sessions from before (code review 576 C-2)
}

/**
 * Decoded JWT with standard claims
 */
export interface DecodedJwt extends JwtPayload {
	iss: string;
	aud: string;
	iat: number;
	exp: number;
}

/**
 * Generate a JWT token for a user
 * @param user User payload to encode in the token
 * @returns Signed JWT string
 */
export async function generateJwt(user: JwtPayload): Promise<string> {
	const secret = new TextEncoder().encode(jwtConfig.secret);

	const jwt = await new jose.SignJWT({
		sub: user.sub,
		email: user.email,
		name: user.name,
		provider: user.provider,
		auth_time: user.auth_time ?? Math.floor(Date.now() / 1000)
	})
		.setProtectedHeader({ alg: jwtConfig.algorithm })
		.setIssuedAt()
		.setIssuer(jwtConfig.issuer)
		.setAudience(jwtConfig.audience)
		.setExpirationTime(Math.floor(Date.now() / 1000) + jwtConfig.expirySeconds)
		.sign(secret);

	return jwt;
}

/**
 * Verify and decode a JWT token
 * @param token JWT string to verify
 * @returns Decoded payload if valid
 * @throws JWTVerificationError if invalid or expired
 */
export async function verifyJwt(token: string): Promise<DecodedJwt> {
	const secret = new TextEncoder().encode(jwtConfig.secret);

	const { payload } = await jose.jwtVerify(token, secret, {
		issuer: jwtConfig.issuer,
		audience: jwtConfig.audience
	});

	return payload as unknown as DecodedJwt;
}

/**
 * Set the session cookie with JWT
 * @param cookies SvelteKit cookies object
 * @param jwt JWT token to store
 */
export function setSessionCookie(cookies: Cookies, jwt: string): void {
	cookies.set(cookieConfig.sessionName, jwt, {
		path: cookieConfig.path,
		httpOnly: true,
		secure: cookieConfig.secure,
		sameSite: cookieConfig.sameSite,
		domain: cookieConfig.domain,
		maxAge: jwtConfig.expirySeconds
	});
}

/**
 * Generate and set XSRF token cookie
 * @param cookies SvelteKit cookies object
 * @returns Generated XSRF token
 */
export function setXsrfToken(cookies: Cookies): string {
	const token = randomBytes(32).toString('hex');

	cookies.set(cookieConfig.xsrfName, token, {
		path: cookieConfig.path,
		httpOnly: false, // Must be readable by JavaScript
		secure: cookieConfig.secure,
		sameSite: cookieConfig.sameSite,
		domain: cookieConfig.domain,
		maxAge: jwtConfig.expirySeconds
	});

	return token;
}

/**
 * Get JWT from session cookie
 * @param cookies SvelteKit cookies object
 * @returns JWT string or null if not present
 */
export function getJwtFromCookie(cookies: Cookies): string | null {
	return cookies.get(cookieConfig.sessionName) || null;
}

/**
 * Validate XSRF token from request header against cookie
 * @param request Request object with headers
 * @param cookies SvelteKit cookies object
 * @returns true if valid, false otherwise
 */
export function validateXsrfToken(request: Request, cookies: Cookies): boolean {
	const cookieToken = cookies.get(cookieConfig.xsrfName);
	const headerToken = request.headers.get('X-XSRF-TOKEN');

	if (!cookieToken || !headerToken) {
		return false;
	}

	// Constant-time comparison to prevent timing attacks
	if (cookieToken.length !== headerToken.length) {
		return false;
	}

	let result = 0;
	for (let i = 0; i < cookieToken.length; i++) {
		result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
	}

	return result === 0;
}

/**
 * Clear all authentication cookies
 * @param cookies SvelteKit cookies object
 */
export function clearAuthCookies(cookies: Cookies): void {
	cookies.delete(cookieConfig.sessionName, {
		path: cookieConfig.path,
		domain: cookieConfig.domain
	});

	cookies.delete(cookieConfig.xsrfName, {
		path: cookieConfig.path,
		domain: cookieConfig.domain
	});

	cookies.delete(cookieConfig.oauthStateName, {
		path: cookieConfig.path,
		domain: cookieConfig.domain
	});
}

/**
 * Set OAuth state cookie for CSRF protection
 * @param cookies SvelteKit cookies object
 * @param state State parameter value
 */
export function setOAuthStateCookie(cookies: Cookies, state: string): void {
	cookies.set(cookieConfig.oauthStateName, state, {
		path: cookieConfig.path,
		httpOnly: true,
		secure: cookieConfig.secure,
		sameSite: cookieConfig.sameSite,
		domain: cookieConfig.domain,
		maxAge: 600 // 10 minutes - short lived for OAuth flow
	});
}

/**
 * Get and validate OAuth state from cookie
 * @param cookies SvelteKit cookies object
 * @param expectedState State parameter from OAuth callback
 * @returns true if state matches, false otherwise
 */
export function validateOAuthState(cookies: Cookies, expectedState: string): boolean {
	const cookieState = cookies.get(cookieConfig.oauthStateName);

	if (!cookieState || !expectedState) {
		return false;
	}

	// Constant-time comparison
	if (cookieState.length !== expectedState.length) {
		return false;
	}

	let result = 0;
	for (let i = 0; i < cookieState.length; i++) {
		result |= cookieState.charCodeAt(i) ^ expectedState.charCodeAt(i);
	}

	return result === 0;
}

/**
 * Generate a cryptographically secure state parameter
 * @returns Random state string
 */
export function generateOAuthState(): string {
	return randomBytes(32).toString('hex');
}
