import * as jose from 'jose';
import { app } from '../../app';

const devSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret-key-change-in-production');

/** JWT for the signed-in property manager, signed like the BFF does */
export const signToken = (key = devSecret) =>
	new jose.SignJWT({ email: 'verwalter@example.com', name: 'Verwalter', provider: 'google' })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject('verwalter')
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(key);

/** Call the API as the signed-in property manager */
export const callApi = async (path: string, init: RequestInit = {}) =>
	app.handle(
		new Request(`http://localhost${path}`, {
			...init,
			headers: { ...init.headers, authorization: `Bearer ${await signToken()}` }
		})
	);
