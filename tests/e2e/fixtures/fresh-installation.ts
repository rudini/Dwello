import { randomUUID } from 'crypto';
import type { CallTheApi } from '../screenplay/abilities';

// A fresh installation (#577): its own frontend without any provider and its own backend on an empty database, which
// starts with this Einrichtungscode and a KI stand-in that is still downloading the model (playwright.config.ts).
// Its scenarios (@einrichtung) take turns (fixtures/test.ts) and delete the one account they create.
export const FRESH_APP = 'http://localhost:3106';
export const FRESH_API = 'http://localhost:3105/api/v1';
export const FRESH_KI_STUB = 'http://127.0.0.1:2530';
export const SETUP_CODE = 'E2E7-K4QX';

export function freshInstallation(api: CallTheApi, kiStub: CallTheApi) {
	const accounts: string[] = [];
	const account = { email: '', password: '' };
	return {
		account,
		/** The account the setup creates, removed afterwards */
		newAccount() {
			account.email = `einrichtung-${randomUUID().replaceAll('-', '').slice(0, 12)}@dwello.test`;
			account.password = `Passwort-${randomUUID()}`;
			accounts.push(account.email);
			return account;
		},
		/** Dwello after its setup: the account exists */
		async setUp() {
			const { email, password } = this.newAccount();
			await api.put('local-accounts', { email, password });
		},
		/** How far the KI stand-in reports the model download */
		modelLoaded: (percent: number) => kiStub.post('stub/pull', { percent }),
		async cleanUp() {
			for (const email of accounts) await api.remove(`local-accounts/${encodeURIComponent(email)}`);
		}
	};
}

export type FreshInstallation = ReturnType<typeof freshInstallation>;
