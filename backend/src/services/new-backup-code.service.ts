/**
 * «Neuer Wiederherstellungscode» (#718, part 3): only after the password typed again (a wrong one counts as a failed
 * sign-in), or with a provider like Google after a sign-in of the last 10 minutes
 */

import { replacePendingCode } from './backup.service';
import { CodedError } from './coded-error';
import { checkPassword } from './local-account.service';

const FRESH_SIGN_IN = 10 * 60; // seconds

export async function newBackupCode(user: { email: string; provider: string; authTime: number }, password?: string) {
	if (user.provider === 'local') {
		try {
			await checkPassword(user.email, password ?? '');
		} catch (error) {
			if (error instanceof CodedError && error.code === 'INVALID_CREDENTIALS')
				throw new CodedError('BACKUP_PASSWORD_WRONG', 'The password is wrong');
			throw error;
		}
	} else if (Date.now() / 1000 - user.authTime > FRESH_SIGN_IN)
		throw new CodedError('BACKUP_SIGN_IN_AGAIN', 'A new code needs a recent sign-in');
	return replacePendingCode();
}
