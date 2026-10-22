/**
 * The KI set in the browser (#580): the local KI, a provider or none. The operator's LLM_* variables take precedence
 * and lock it («vom Betreiber festgelegt»). A provider is saved only with its name, country and the confirmed
 * checklist, which the privacy statement needs (Art. 19 DSG); its API key is stored only encrypted with the
 * installation's ENCRYPTION_KEY, never sent back and never sent to another address (domain review 580 F-13, F-16).
 * Every change goes into the Protokoll (F-4).
 */

import { llmConfig, llmRecipient } from '../config/llm';
import { db } from '../db/connection';
import { kiSettings } from '../db/schema';
import { recordAudit } from './audit-log.service';
import { CodedError } from './coded-error';
import { loadModel } from './ki-model.service';

type Mode = 'local' | 'provider' | 'none';

/** The KI the next request goes to */
export type Ki = {
	mode: Mode;
	baseUrl: string;
	apiKey: string;
	model: string;
	provider: string;
	providerCountry: string;
	byOperator: boolean;
};

export type KiInput = {
	mode: Mode;
	baseUrl?: string;
	apiKey?: string;
	model?: string;
	provider?: string;
	providerCountry?: string;
	confirmed?: boolean;
};

// AES-256-GCM with a key derived from ENCRYPTION_KEY (docker/init-secrets.sh makes it); «iv.ciphertext» in base64
const secretKey = async () => {
	const secret = process.env.ENCRYPTION_KEY;
	if (!secret) return null;
	const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
	return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['encrypt', 'decrypt']);
};
const base64 = (bytes: ArrayBuffer | Uint8Array) =>
	Buffer.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)).toString('base64');

async function encrypt(text: string) {
	const key = await secretKey();
	if (!key)
		throw new CodedError(
			'KI_ENCRYPTION_KEY_MISSING',
			'Der Server hat keinen Schlüssel zum Verschlüsseln.'
		);
	const iv = crypto.getRandomValues(new Uint8Array(12));
	return `${base64(iv)}.${base64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text)))}`;
}

/** The stored key, or '' when it cannot be read (another ENCRYPTION_KEY, e.g. after a restore without the keys) */
async function decrypt(stored: string | null) {
	if (!stored) return '';
	const [iv, data] = stored.split('.').map((part) => Buffer.from(part, 'base64'));
	try {
		const key = await secretKey();
		if (!key) throw new Error('ENCRYPTION_KEY missing');
		return new TextDecoder().decode(
			await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
		);
	} catch (error) {
		console.warn('[ki] Der gespeicherte API-Schlüssel lässt sich nicht entschlüsseln', {
			error: String(error)
		});
		return '';
	}
}

const stored = async () => (await db.select().from(kiSettings))[0];

const fromOperator = (mode: Mode): Ki => {
	const { baseUrl, apiKey, model, provider, providerCountry, byOperator } = llmConfig;
	return { mode, baseUrl, apiKey, model, provider, providerCountry, byOperator };
};

/** The KI of the operator when set, else the one saved in the browser */
export async function currentKi(): Promise<Ki> {
	// nothing saved yet: the variables as before #580, by default the local KI
	const row = llmConfig.byOperator ? undefined : await stored();
	if (!row)
		return fromOperator(llmConfig.enabled ? (llmRecipient() ? 'provider' : 'local') : 'none');
	if (row.mode !== 'provider') return fromOperator(row.mode);
	return {
		mode: 'provider',
		baseUrl: row.baseUrl!,
		apiKey: await decrypt(row.apiKeyEncrypted),
		model: row.model!,
		provider: row.provider!,
		providerCountry: row.providerCountry!,
		byOperator: false
	};
}

/** Who receives invoice data, as the privacy statement names it; null for the local KI and for none */
export async function kiRecipient() {
	const ki = await currentKi();
	return ki.mode === 'provider' ? { provider: ki.provider, country: ki.providerCountry } : null;
}

/** For the page «KI»: everything but the key */
export async function kiSettingsView() {
	const { apiKey, ...shown } = await currentKi();
	return { ...shown, apiKeyStored: apiKey !== '' };
}

const trimmed = (input: KiInput) => ({
	baseUrl: input.baseUrl?.trim().replace(/\/$/, '') ?? '',
	apiKey: input.apiKey?.trim() ?? '',
	model: input.model?.trim() ?? '',
	provider: input.provider?.trim() ?? '',
	providerCountry: input.providerCountry?.trim() ?? ''
});

/** The key to send to `baseUrl`: the one entered, else the stored one, but only to the address it was saved for */
async function keyFor(baseUrl: string, entered: string) {
	if (entered) return entered;
	const row = await stored();
	if (row?.mode !== 'provider' || !row.apiKeyEncrypted) return '';
	if (row.baseUrl !== baseUrl)
		throw new CodedError(
			'KI_KEY_FOR_NEW_ADDRESS',
			'Für eine neue Adresse ist der API-Schlüssel erneut einzugeben.'
		);
	return decrypt(row.apiKeyEncrypted);
}

const locked = () => new CodedError('KI_SET_BY_OPERATOR', 'Die KI ist vom Betreiber festgelegt.');

export async function saveKiSettings(input: KiInput) {
	if (llmConfig.byOperator) throw locked();
	if (input.mode !== 'provider') {
		await db.transaction(async (tx) => {
			await tx.delete(kiSettings);
			await tx.insert(kiSettings).values({ mode: input.mode });
			await recordAudit('ki_setting_changed', { mode: input.mode }, tx);
		});
		if (input.mode === 'local') void loadModel({ ...llmConfig, local: llmConfig.enabled });
		return kiSettingsView();
	}
	const values = trimmed(input);
	const missing = [
		...(['baseUrl', 'model', 'provider', 'providerCountry'] as const).filter(
			(field) => !values[field]
		),
		...(input.confirmed === true ? [] : ['confirmed'])
	];
	if (missing.length)
		throw new CodedError('KI_PROVIDER_INCOMPLETE', 'Es fehlen Angaben zum Anbieter der KI.', {
			missing: missing.join(',')
		});
	const apiKey = await keyFor(values.baseUrl, values.apiKey);
	const apiKeyEncrypted = apiKey ? await encrypt(apiKey) : null;
	const { provider, providerCountry: country } = values;
	await db.transaction(async (tx) => {
		await tx.delete(kiSettings);
		await tx.insert(kiSettings).values({ mode: 'provider', ...values, apiKeyEncrypted });
		await recordAudit('ki_setting_changed', { mode: 'provider', provider, country }, tx);
	});
	return kiSettingsView();
}

// «Verbindung prüfen» sends only this text and this image (a 1×1 PNG), never recorded data (domain review 580 F-3)
const CHECK_TEXT = 'Verbindungstest von Dwello: Antworten Sie nur mit OK.';
const CHECK_IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/** Whether the entered provider answers, accepts the key and reads images; nothing is saved */
export async function checkKiConnection(
	input: KiInput
): Promise<{ result: 'ok' | 'wrong-key' | 'unreachable' | 'no-images' }> {
	const { baseUrl, model, apiKey: entered } = trimmed(input);
	const apiKey = await keyFor(baseUrl, entered);
	let response: Response;
	try {
		response = await fetch(`${baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(apiKey && { Authorization: `Bearer ${apiKey}` })
			},
			body: JSON.stringify({
				model,
				messages: [
					{
						role: 'user',
						content: [
							{ type: 'text', text: CHECK_TEXT },
							{ type: 'image_url', image_url: { url: CHECK_IMAGE } }
						]
					}
				]
			}),
			signal: AbortSignal.timeout(llmConfig.timeout)
		});
	} catch {
		return { result: 'unreachable' };
	}
	if (response.status === 401 || response.status === 403) return { result: 'wrong-key' };
	return { result: response.ok ? 'ok' : 'no-images' };
}
