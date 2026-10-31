import { fail, redirect } from '@sveltejs/kit';
import { backendMessage, type BackendError } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import type { BackupState } from '$lib/types';
import { PROVIDER_NAMES, type OAuthProvider } from './oauth';

type Fetch = typeof globalThis.fetch;
const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

export async function backupState(fetch: Fetch): Promise<BackupState> {
	try {
		const response = await fetch(`${BACKEND}/health`);
		const { backup = 'off', since } = (await response.json()) as BackupState;
		return { backup, since };
	} catch {
		return { backup: 'off' }; // a backend that does not answer: the page that needs it says so
	}
}

/** «Sicherung einrichten»: the code to confirm and the day it was made; once one is confirmed, the Übersicht */
export async function backupSetup(fetch: Fetch) {
	const state = (await (await fetch(`${BACKEND}/api/v1/backup`)).json()) as BackupState & {
		code?: string;
		createdAt?: string;
	};
	if (state.backup !== 'setup' || !state.code) redirect(303, '/dashboard');
	return { code: state.code, createdAt: state.createdAt! };
}

export async function confirmBackup(fetch: Fetch, form: FormData, confirmed = '/dashboard?backup=confirmed') {
	const response = await fetch(`${BACKEND}/api/v1/backup/confirm`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code: String(form.get('code') ?? '') })
	}).catch(() => null);
	if (response?.status === 422)
		return fail(422, {
			error: backendMessage((await response.json()) as BackendError, m.backup_error_failed())
		});
	if (!response?.ok) return fail(502, { error: m.backup_error_failed() });
	redirect(303, confirmed);
}

// «Neuer Wiederherstellungscode» (#718, part 3): with a Konto mit Passwort the password again; with a provider like
// Google a sign-in of the last 10 minutes (the backend checks both), else a new one
const FRESH_SIGN_IN = 10 * 60;
export const NEW_CODE_PAGE = '/config/backup';

export async function newCodePage(fetch: Fetch, user: App.Locals['user']) {
	const state = (await (await fetch(`${BACKEND}/api/v1/backup`)).json()) as BackupState & { code?: string };
	if (state.backup === 'off') redirect(303, '/config');
	if (state.backup === 'setup') redirect(303, '/backup');
	if (state.code) return { code: state.code };
	if (!user || user.provider === 'local') return { step: 'password' as const };
	if (Date.now() / 1000 - user.signedInAt <= FRESH_SIGN_IN) return { step: 'create' as const };
	return {
		step: 'again' as const,
		provider: PROVIDER_NAMES[user.provider as OAuthProvider] ?? user.provider,
		signIn: `/auth/login?${new URLSearchParams({ provider: user.provider, reauth: '1', redirectTo: NEW_CODE_PAGE })}`
	};
}

export async function createNewCode(fetch: Fetch, form: FormData) {
	const password = form.get('password');
	const response = await fetch(`${BACKEND}/api/v1/backup/new-code`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(password === null ? {} : { password: String(password) })
	}).catch(() => null);
	if (response && [403, 422, 423].includes(response.status))
		return fail(response.status, {
			error: backendMessage((await response.json()) as BackendError, m.backup_error_failed())
		});
	if (!response?.ok) return fail(502, { error: m.backup_error_failed() });
	redirect(303, NEW_CODE_PAGE);
}

/** The Notfallblatt in the landlord's language, with the address this installation is opened at */
export const emergencySheet = (fetch: Fetch, origin: string) =>
	fetch(
		`${BACKEND}/api/v1/backup/emergency-sheet?${new URLSearchParams({ language: getLocale(), address: origin })}`
	);
