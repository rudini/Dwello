import { randomUUID } from 'crypto';
import type { CallTheApi } from '../screenplay/abilities';

// A fresh installation (#577): its own frontend without any provider and its own backend on an empty database, which
// starts with this Einrichtungscode and a KI stand-in that is still downloading the model (playwright.config.ts).
// Its scenarios (@einrichtung) take turns (fixtures/test.ts) and delete the one account they create.
export const FRESH_APP = 'http://localhost:3106';
export const FRESH_API = 'http://localhost:3105/api/v1';
export const FRESH_KI_STUB = 'http://127.0.0.1:2530';
// the empty instance (playwright.config.ts): its KI stand-in fails the model download
export const EMPTY_APP = 'http://localhost:3102';
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
		/** The running model download ends with an error, or the local KI answers nothing (#580) */
		modelFailed: () => kiStub.post('stub/ollama', { state: 'failed' }),
		localKiOffline: () => kiStub.post('stub/ollama', { state: 'offline' }),
		/** No KI chosen (#620: «Später entscheiden» at the setup) */
		kiNone: () => api.put('ki-settings', { mode: 'none' }),
		/** A provider of the KI saved through the API (#580); the clean-up returns to the local KI */
		async kiProvider(provider: { address: string; key: string; model: string; provider: string; country: string }) {
			await api.put('ki-settings', {
				mode: 'provider',
				baseUrl: provider.address,
				apiKey: provider.key,
				model: provider.model,
				provider: provider.provider,
				providerCountry: provider.country,
				confirmed: true
			});
		},
		async cleanUp() {
			// every scenario of the KI settings may change it in the browser: back to the local KI of a fresh installation
			await kiStub.post('stub/ollama', { state: 'online' });
			await api.put('ki-settings', { mode: 'local' });
			// the KI changes of this scenario and its clean-up, so the next one finds only its own in the Protokoll
			const { data } = (await api.get('audit-log')) as { data: { id: string; action: string }[] };
			for (const entry of data.filter(({ action }) => action === 'ki_setting_changed'))
				await api.remove(`audit-log/${entry.id}`);
			for (const email of accounts) await api.remove(`local-accounts/${encodeURIComponent(email)}`);
		}
	};
}

export type FreshInstallation = ReturnType<typeof freshInstallation>;
