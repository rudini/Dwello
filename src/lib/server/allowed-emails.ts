// Who may sign in (#51): the comma-separated ALLOWED_EMAILS, compared ignoring spaces and case, and only addresses
// Google reports as verified (a session carries no flag: it was checked when it was issued); Microsoft's address is
// not verified, so no Microsoft account. Unset (development) or «*» (the public demo) allows every account. A Konto mit
// Passwort is always allowed: it exists only because the Betreiber created it (#576)
export function isAllowed({
	email,
	provider,
	emailVerified = true
}: {
	email: string;
	provider: string;
	emailVerified?: boolean;
}) {
	if (provider === 'local') return true;
	const normal = (address: string) => address.trim().toLowerCase();
	const list = normal(process.env.ALLOWED_EMAILS ?? '');
	if (!list || list === '*') return true;
	return (
		provider === 'google' && emailVerified && list.split(',').map(normal).includes(normal(email))
	);
}
