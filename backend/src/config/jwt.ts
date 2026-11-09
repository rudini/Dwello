/**
 * Refuses the secret session JWTs are signed and checked with, as the BFF refuses it (src/lib/server/jwt-config.ts):
 * an installation brings its own (docker/init-secrets.sh), development without one uses the fallback of
 * middleware/auth.ts (#1376)
 */
export function checkJwtSecret(env: Record<string, string | undefined> = process.env) {
	if (!env.JWT_SECRET && env.NODE_ENV === 'production')
		throw new Error('JWT_SECRET environment variable is required');
	if (env.JWT_SECRET && env.JWT_SECRET.length < 32)
		throw new Error('JWT_SECRET must be at least 32 characters long');
}
