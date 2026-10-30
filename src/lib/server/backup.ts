import { fail, redirect } from '@sveltejs/kit';
import { backendMessage, type BackendError } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';
import type { BackupState } from '$lib/types';

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

export async function confirmBackup(fetch: Fetch, form: FormData) {
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
	redirect(303, '/dashboard?backup=confirmed');
}

/** The Notfallblatt in the landlord's language, with the address this installation is opened at */
export const emergencySheet = (fetch: Fetch, origin: string) =>
	fetch(
		`${BACKEND}/api/v1/backup/emergency-sheet?${new URLSearchParams({ language: getLocale(), address: origin })}`
	);
