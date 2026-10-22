/**
 * The KI set in the browser (#580): local KI, a provider or none; the operator's LLM_* variables take precedence and
 * lock it; the provider's API key is stored only encrypted (real PostgreSQL database, provider stand-in via Bun.serve)
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { sql } from 'drizzle-orm';
import { llmConfig } from '../config/llm';
import { db } from '../db/connection';
import { callApi, sendJson } from './helpers/auth';

const configured = { ...llmConfig };
const encryptionKey = process.env.ENCRYPTION_KEY;

// A provider that accepts only the key «richtig» and reads images only with a model other than «text-modell»
const requests: { authorization: string | null; model: string; images: number }[] = [];
type Part = { type: string };
const provider = Bun.serve({
	port: 0,
	fetch: async (request) => {
		const { model, messages } = (await request.json()) as {
			model: string;
			messages: { content: string | Part[] }[];
		};
		const { content } = messages[0];
		const images =
			typeof content === 'string' ? 0 : content.filter((part) => part.type === 'image_url').length;
		requests.push({ authorization: request.headers.get('authorization'), model, images });
		if (request.headers.get('authorization') !== 'Bearer richtig')
			return new Response(null, { status: 401 });
		if (model === 'text-modell')
			return Response.json({ error: { message: 'image input not supported' } }, { status: 400 });
		const reply = { isAllowedUtilityCost: true, confidence: 0.9, reasoning: 'Betrieb.' };
		return Response.json({ choices: [{ message: { content: JSON.stringify(reply) } }] });
	}
});
const address = `http://127.0.0.1:${provider.port}/v1`;
const muster = {
	mode: 'provider',
	baseUrl: address,
	apiKey: 'richtig',
	model: 'bild-modell',
	provider: 'Muster KI AG',
	providerCountry: 'Deutschland',
	confirmed: true
};

const settings = async () => (await callApi('/api/v1/ki-settings')).json();
const save = (body: object) => sendJson('PUT', '/api/v1/ki-settings', body);
const check = (body: object) => sendJson('POST', '/api/v1/ki-settings/check', body);
const recipient = async () => (await callApi('/api/v1/invoices/llm-recipient')).json();

beforeAll(() => {
	// as on an installation whose operator set no LLM_* variable
	process.env.ENCRYPTION_KEY = 'test-encryption-key';
	llmConfig.byOperator = false;
});
afterEach(async () => {
	requests.length = 0;
	await db.execute(sql`DELETE FROM ki_settings`);
});
afterAll(() => {
	provider.stop();
	Object.assign(llmConfig, configured);
	if (encryptionKey === undefined) delete process.env.ENCRYPTION_KEY;
	else process.env.ENCRYPTION_KEY = encryptionKey;
});

describe('KI in den Einstellungen', () => {
	it('gilt ohne Einstellung die lokale KI', async () => {
		expect(await settings()).toMatchObject({
			mode: 'local',
			byOperator: false,
			apiKeyStored: false
		});
	});

	it('speichert einen Anbieter, den die Datenschutzerklärung nennt', async () => {
		expect((await save(muster)).status).toBe(200);

		expect(await settings()).toMatchObject({
			mode: 'provider',
			baseUrl: address,
			model: 'bild-modell',
			provider: 'Muster KI AG',
			providerCountry: 'Deutschland',
			apiKeyStored: true
		});
		expect(await recipient()).toEqual({
			recipient: { provider: 'Muster KI AG', country: 'Deutschland' },
			enabled: true
		});
	});

	// Der Liegenschaftsverwalter nennt den Empfänger, auch wenn die Adresse im eigenen Netz liegt
	it('nennt den Anbieter auch bei einer Adresse auf dem Server', async () => {
		await save({ ...muster, baseUrl: 'http://localhost:11434/v1' });

		expect((await recipient()).recipient).toEqual({
			provider: 'Muster KI AG',
			country: 'Deutschland'
		});
	});

	it('zeigt den API-Schlüssel nie wieder und speichert ihn nur verschlüsselt', async () => {
		await save(muster);

		expect(JSON.stringify(await settings())).not.toContain('richtig');
		const rows = await db.execute(sql`SELECT * FROM ki_settings`);
		expect(JSON.stringify(rows.rows ?? rows)).not.toContain('richtig');
	});

	it('behält den gespeicherten Schlüssel, wenn das Feld leer bleibt', async () => {
		await save(muster);
		await save({ ...muster, apiKey: '' });

		await sendJson('POST', '/api/v1/categories/propose', {
			name: 'Treppenhausreinigung',
			description: ''
		});

		expect(requests.at(-1)?.authorization).toBe('Bearer richtig');
	});

	it('fragt ab dem Speichern ohne Neustart den neuen Anbieter', async () => {
		await save(muster);

		const response = await sendJson('POST', '/api/v1/categories/propose', {
			name: 'Treppenhausreinigung',
			description: ''
		});

		expect(response.status).toBe(200);
		expect(requests).toEqual([
			{ authorization: 'Bearer richtig', model: 'bild-modell', images: 0 }
		]);
	});

	it('fragt mit «Keine KI» niemanden und nennt keinen Empfänger', async () => {
		await save(muster);
		await save({ mode: 'none' });

		const response = await sendJson('POST', '/api/v1/categories/propose', {
			name: 'Treppenhausreinigung',
			description: ''
		});

		expect(response.status).toBe(503);
		expect(requests).toEqual([]);
		expect(await recipient()).toEqual({ recipient: null, enabled: false });
	});

	it('kehrt zur lokalen KI zurück', async () => {
		await save(muster);
		await save({ mode: 'local' });

		expect(await settings()).toMatchObject({ mode: 'local', apiKeyStored: false });
		expect(await recipient()).toEqual({ recipient: null, enabled: true });
	});

	// Sonst nennt die Datenschutzerklärung nicht, wer die Rechnungen erhält (Art. 19 DSG)
	it('verweigert einen Anbieter ohne Bestätigung, Anbieter, Land, Adresse oder Modell und nennt, was fehlt', async () => {
		const response = await save({ mode: 'provider', apiKey: 'richtig' });

		expect(response.status).toBe(422);
		expect(await response.json()).toMatchObject({
			code: 'KI_PROVIDER_INCOMPLETE',
			params: { missing: ['baseUrl', 'model', 'provider', 'providerCountry', 'confirmed'] }
		});
		expect(await settings()).toMatchObject({ mode: 'local' });
	});

	it('verweigert einen Schlüssel, solange der Server keinen Schlüssel zum Verschlüsseln hat', async () => {
		delete process.env.ENCRYPTION_KEY;
		try {
			const response = await save(muster);

			expect(response.status).toBe(422);
			expect(await response.json()).toMatchObject({ code: 'KI_ENCRYPTION_KEY_MISSING' });
		} finally {
			process.env.ENCRYPTION_KEY = 'test-encryption-key';
		}
	});

	it('liest einen Schlüssel, den ein anderer Schlüssel zum Verschlüsseln verschlüsselt hat, nicht als Klartext', async () => {
		await save(muster);
		process.env.ENCRYPTION_KEY = 'ein-anderer-schluessel';
		try {
			await sendJson('POST', '/api/v1/categories/propose', {
				name: 'Treppenhausreinigung',
				description: ''
			});

			expect(requests.map((request) => request.authorization)).not.toContain('Bearer richtig');
		} finally {
			process.env.ENCRYPTION_KEY = 'test-encryption-key';
		}
	});
});

describe('Vom Betreiber festgelegte KI', () => {
	afterEach(() => {
		Object.assign(llmConfig, {
			byOperator: false,
			baseUrl: configured.baseUrl,
			provider: '',
			providerCountry: ''
		});
	});

	it('zeigt die Werte der Umgebungsvariablen ohne den Schlüssel und sperrt sie', async () => {
		Object.assign(llmConfig, {
			byOperator: true,
			baseUrl: 'https://api.example.ch/v1',
			apiKey: 'geheim',
			provider: 'Beispiel AG',
			providerCountry: 'Schweiz'
		});

		const shown = await settings();

		expect(shown).toMatchObject({
			mode: 'provider',
			byOperator: true,
			baseUrl: 'https://api.example.ch/v1',
			provider: 'Beispiel AG',
			providerCountry: 'Schweiz',
			apiKeyStored: true
		});
		expect(JSON.stringify(shown)).not.toContain('geheim');
		const response = await save({ mode: 'none' });
		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'KI_SET_BY_OPERATOR' });
	});

	it('geht einer gespeicherten Einstellung vor', async () => {
		await save(muster);
		Object.assign(llmConfig, {
			byOperator: true,
			baseUrl: 'http://localhost:11434/v1',
			apiKey: ''
		});

		expect(await settings()).toMatchObject({ mode: 'local', byOperator: true });
		expect((await recipient()).recipient).toBeNull();
	});
});

describe('Verbindung prüfen', () => {
	it('meldet eine Verbindung zu einem Modell, das Bilder liest', async () => {
		expect(await (await check(muster)).json()).toEqual({ result: 'ok' });
	});

	it('meldet einen falschen Schlüssel', async () => {
		expect(await (await check({ ...muster, apiKey: 'falsch' })).json()).toEqual({
			result: 'wrong-key'
		});
	});

	it('meldet eine Adresse, unter der niemand antwortet', async () => {
		expect(await (await check({ ...muster, baseUrl: 'http://127.0.0.1:9/v1' })).json()).toEqual({
			result: 'unreachable'
		});
	});

	it('meldet ein Modell, das keine Bilder liest', async () => {
		expect(await (await check({ ...muster, model: 'text-modell' })).json()).toEqual({
			result: 'no-images'
		});
	});

	it('prüft mit dem gespeicherten Schlüssel, wenn das Feld leer bleibt', async () => {
		await save(muster);

		expect(await (await check({ ...muster, apiKey: '' })).json()).toEqual({ result: 'ok' });
	});

	// nur eine Antwort auf ein Bild zeigt, dass das Modell Rechnungsbilder liest
	it('schickt dem Modell ein Bild', async () => {
		await check(muster);

		expect(requests.map((request) => request.images)).toEqual([1]);
	});
});
