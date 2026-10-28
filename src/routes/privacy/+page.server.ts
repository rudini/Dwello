import { m } from '$lib/paraglide/messages';
import { fetchRecord } from '$lib/server/save-form';
import { jwtConfig } from '$lib/server/jwt-config';
import { getConfiguredProviders, PROVIDER_NAMES } from '$lib/server/oauth';
import { loadHosting, loadOperator } from '$lib/server/operator';
import { passwordAvailable, setupNeeded } from '$lib/server/password-login';
import { backupState } from '$lib/server/backup';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Who receives invoice data for the KI categorization (null while the model runs on the operator's server, or while
// the KI is switched off), the login providers and the mail provider this installation uses, its operator and how
// long the sign-in cookies last (#82), and where the server and the mail server stand (#458)
export const load: PageServerLoad = async ({
	fetch
}): Promise<
	{
		recipient: { provider: string; country: string } | null;
		enabled?: boolean;
		providers: string[];
		password: boolean; // a Konto mit Passwort exists (#576) or the setup makes it (#577)
		mail: 'smtp' | 'resend' | null;
		operator: ReturnType<typeof loadOperator>;
		sessionSeconds: number;
		backup: boolean; // Dwello backs up once a Wiederherstellungscode is confirmed (#718, Fachreview 718b R-4)
	} & ReturnType<typeof loadHosting>
> => {
	const [[llm, mail], password, backup] = await Promise.all([
		Promise.all(
		['invoices/llm-recipient', 'mail-transport'].map((path) =>
				fetchRecord(fetch, `${BACKEND_URL}/api/v1/${path}`, m.privacy_record())
			)
		),
		// a Konto mit Passwort exists, or is about to be made in the setup (#577, fach review 577 R-1)
		Promise.all([passwordAvailable(fetch), setupNeeded(fetch)]).then((answers) => answers.some(Boolean)),
		backupState(fetch)
	]);
	return {
		...llm,
		providers: getConfiguredProviders().map((id) => PROVIDER_NAMES[id]),
		password,
		mail: mail.transport,
		operator: loadOperator(),
		...loadHosting(),
		sessionSeconds: jwtConfig.expirySeconds,
		backup: backup.backup === 'ok' || backup.backup === 'stale'
	};
};
