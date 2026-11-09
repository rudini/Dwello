/**
 * The secret session JWTs are signed and checked with, refused as the BFF refuses it (src/lib/server/jwt-config.ts):
 * an installation brings its own (docker/init-secrets.sh), development falls back to a public one (#1376)
 */
export function jwtSecret(env: Record<string, string | undefined> = process.env): string {
	const secret =
		env.JWT_SECRET ||
		(env.NODE_ENV === 'production' ? '' : 'development-secret-key-change-in-production');
	if (!secret) throw new Error('JWT_SECRET environment variable is required');
	if (secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters long');
	return secret;
}
