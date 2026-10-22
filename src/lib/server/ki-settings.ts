import { backendMessage, type BackendError } from '$lib/backend-error';
import { m } from '$lib/paraglide/messages';
import { fail } from '@sveltejs/kit';

const API = () => `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

/** The KI of the settings (#580) as the page «KI» shows it: never the API key, only whether one is stored */
type KiSettings = {
	mode: 'local' | 'provider' | 'none';
	baseUrl: string;
	model: string;
	provider: string;
	providerCountry: string;
	apiKeyStored: boolean;
	byOperator: boolean;
};
type ModelState =
	| { state: 'ready' }
	| { state: 'loading'; percent: number }
	| { state: 'failed' }
	| { state: 'unknown' };

const toKiSettings = (ki: KiSettings): KiSettings => ({
	mode: ki.mode,
	baseUrl: ki.baseUrl,
	model: ki.model,
	provider: ki.provider,
	providerCountry: ki.providerCountry,
	apiKeyStored: ki.apiKeyStored,
	byOperator: ki.byOperator
});

/** Whether «Keine KI» is chosen (also by the operator): nobody reads uploaded invoices (#626) */
export const kiOff = (fetch: typeof globalThis.fetch) =>
	fetch(`${API()}/ki-settings`)
		.then((response) => response.json())
		.then((ki: KiSettings) => ki.mode === 'none')
		.catch(() => false);

export async function loadKiSettings(fetch: typeof globalThis.fetch) {
	const get = (path: string) => fetch(`${API()}/${path}`).then((response) => response.json());
	const [ki, model] = await Promise.all([get('ki-settings'), get('ki/model')]);
	return { ki: toKiSettings(ki), model: model as ModelState };
}

// What the form sends; a provider with its fields and the checkbox, the other choices only themselves
async function entered(request: Request) {
	const form = await request.formData();
	const field = (name: string) => String(form.get(name) ?? '');
	const mode = field('mode');
	if (mode !== 'provider') return { mode };
	return {
		mode,
		baseUrl: field('baseUrl'),
		apiKey: field('apiKey'),
		model: field('model'),
		provider: field('provider'),
		providerCountry: field('providerCountry'),
		confirmed: form.get('confirmed') === 'on'
	};
}

const missingMessage: Record<string, () => string> = {
	baseUrl: m.ki_settings_missing_base_url,
	model: m.ki_settings_missing_model,
	provider: m.ki_settings_missing_provider,
	providerCountry: m.ki_settings_missing_country,
	confirmed: m.ki_settings_missing_confirmed
};

// A refusal at the field it names: what is missing, the key for a new address; anything else for the whole form
function refusalErrors(refused: BackendError): Record<string, string> {
	if (refused.code === 'KI_PROVIDER_INCOMPLETE')
		return Object.fromEntries(
			String(refused.params?.missing ?? '')
				.split(',')
				.filter((field) => missingMessage[field])
				.map((field) => [field, missingMessage[field]()])
		);
	const message = backendMessage(refused, m.ki_settings_not_saved());
	return refused.code === 'KI_KEY_FOR_NEW_ADDRESS' ? { apiKey: message } : { form: message };
}

const send = (fetch: typeof globalThis.fetch, method: string, path: string, body?: object) =>
	fetch(`${API()}/${path}`, {
		method,
		...(body && { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
	});

export async function saveKiSettings(fetch: typeof globalThis.fetch, request: Request) {
	const response = await send(fetch, 'PUT', 'ki-settings', await entered(request));
	if (response.ok) return { saved: true };
	return fail(response.status, { errors: refusalErrors(await response.json().catch(() => ({}))) });
}

const CHECK_RESULT: Record<string, () => string> = {
	ok: m.ki_settings_check_ok,
	'wrong-key': m.ki_settings_check_wrong_key,
	unreachable: m.ki_settings_check_unreachable,
	'no-images': m.ki_settings_check_no_images
};

export async function checkKiConnection(fetch: typeof globalThis.fetch, request: Request) {
	const body = await entered(request);
	// nothing to ask without an address (personas Anna P-5, Sven P-4)
	if (!body.baseUrl?.trim()) return fail(400, { check: m.ki_settings_missing_base_url() });
	const response = await send(fetch, 'POST', 'ki-settings/check', body);
	const answer = await response.json().catch(() => ({}));
	if (!response.ok)
		return fail(response.status, {
			check: backendMessage(answer, m.ki_settings_check_unreachable())
		});
	return { check: CHECK_RESULT[answer.result]?.() ?? m.ki_settings_check_unreachable() };
}

export async function downloadKiModel(fetch: typeof globalThis.fetch) {
	const response = await send(fetch, 'POST', 'ki/model');
	if (response.ok) return { downloading: true };
	return fail(response.status, {
		errors: {
			form: backendMessage(await response.json().catch(() => ({})), m.ki_settings_not_saved())
		}
	});
}
