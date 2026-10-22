/**
 * The KI set in the browser (#580): local KI, a provider or none; the operator's LLM_* variables take precedence and
 * lock it; the provider's API key is stored only encrypted (real PostgreSQL database, provider stand-in via Bun.serve)
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { sql } from 'drizzle-orm';
import { llmConfig } from '../config/llm';
import { db } from '../db/connection';
import { auditLog } from '../db/schema';
import { modelState } from '../services/ki-model.service';
import { callApi, sendJson } from './helpers/auth';

const configured = { ...llmConfig };
const encryptionKey = process.env.ENCRYPTION_KEY;

// A provider that accepts only the key «richtig» and reads images only with a model other than «text-modell»
const requests: {
	authorization: string | null;
	model: string;
	images: number;
	text: string;
	image: string;
}[] = [];
type Part = { type: string; text?: string; image_url?: { url: string } };
const provider = Bun.serve({
	port: 0,
	fetch: async (request) => {
		const { model, messages } = (await request.json()) as {
			model: string;
			messages: { content: string | Part[] }[];
		};
		const { content } = messages[0];
		const parts = typeof content === 'string' ? [{ type: 'text', text: content } as Part] : content;
		const images = parts.filter((part) => part.type === 'image_url');
		requests.push({
			authorization: request.headers.get('authorization'),
			model,
			images: images.length,
			text: parts.map((part) => part.text ?? '').join(''),
			image: images[0]?.image_url?.url ?? ''
		});
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
const recipient = async () =>
	(await (await callApi('/api/v1/invoices/llm-recipient')).json()) as {
		recipient: { provider: string; country: string } | null;
		enabled: boolean;
	};

beforeAll(() => {
	// as on an installation whose operator set no LLM_* variable
	process.env.ENCRYPTION_KEY = 'test-encryption-key';
	llmConfig.byOperator = false;
});
afterEach(async () => {
	requests.length = 0;
	await db.execute(sql`DELETE FROM ki_settings`);
	await db.delete(auditLog);
});
afterAll(() => {
	provider.stop();
	Object.assign(llmConfig, configured);
	if (encryptionKey === undefined) delete process.env.ENCRYPTION_KEY;
	else process.env.ENCRYPTION_KEY = encryptionKey;
});

describe('KI in den Einstellungen', () => {
	// Codereview 580 C-1: ohne Einstellung fragt Dwello nicht nach einem Empfänger; LLM_LOCAL_URL liegt auf dem Server
	// (Fachreview 580 F-23: sonst startet das Backend nicht), hier der Container ollama
	it('gilt ohne Einstellung die lokale KI unter LLM_LOCAL_URL', async () => {
		Object.assign(llmConfig, { baseUrl: 'http://ollama:11434/v1' });
		try {
			expect(await settings()).toMatchObject({ mode: 'local', byOperator: false });
			expect(await recipient()).toEqual({ recipient: null, enabled: true });
		} finally {
			Object.assign(llmConfig, { baseUrl: configured.baseUrl });
		}
	});

	// Codereview 580 C-2: die Übersicht sagt nicht mehr, das Modell lade, und Ollama lädt nichts weiter herunter
	it('beendet das Laden des KI-Modells, sobald ein Anbieter oder keine KI gewählt ist', async () => {
		const ollama = Bun.serve({
			port: 0,
			idleTimeout: 0,
			fetch: (request) =>
				new URL(request.url).pathname === '/api/tags'
					? Response.json({ models: [] })
					: new Response(
							new ReadableStream({
								start: (controller) =>
									controller.enqueue(new TextEncoder().encode(`${JSON.stringify({ status: 'pulling', total: 100, completed: 40 })}\n`))
							})
						)
		});
		Object.assign(llmConfig, { baseUrl: `http://127.0.0.1:${ollama.port}/v1` });
		try {
			await save({ mode: 'local' });
			expect(await (await callApi('/api/v1/ki/model')).json()).toEqual({ state: 'loading', percent: 40 });

			await save({ mode: 'none' });

			expect(await (await callApi('/api/v1/ki/model')).json()).toEqual({ state: 'unknown' });

			// Codereview 580-2 C-12: auch ein Anbieter beendet das Laden
			await save({ mode: 'local' });
			await save(muster);

			expect(await (await callApi('/api/v1/ki/model')).json()).toEqual({ state: 'unknown' });
		} finally {
			ollama.stop(true);
			Object.assign(llmConfig, { baseUrl: configured.baseUrl });
		}
	});

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
		expect(requests).toMatchObject([
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
			params: { missing: 'baseUrl,model,provider,providerCountry,confirmed' }
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

describe('Schlüssel und Protokoll', () => {
	// Fachreview 580 F-13: der gespeicherte Schlüssel geht nie an einen anderen Host
	it('verlangt den API-Schlüssel erneut, wenn sich die Adresse ändert', async () => {
		await save(muster);

		const response = await save({ ...muster, baseUrl: 'http://127.0.0.1:9/v1', apiKey: '' });

		expect(response.status).toBe(422);
		expect(await response.json()).toMatchObject({ code: 'KI_KEY_FOR_NEW_ADDRESS' });
	});

	// Fachreview 580-2 F-16: auch die Prüfung schickt den gespeicherten Schlüssel nie an eine andere Adresse
	it('verlangt den API-Schlüssel erneut, um eine neue Adresse zu prüfen', async () => {
		await save(muster);
		requests.length = 0;

		const response = await check({ ...muster, baseUrl: 'http://127.0.0.1:9/v1', apiKey: '' });

		expect(response.status).toBe(422);
		expect(await response.json()).toMatchObject({ code: 'KI_KEY_FOR_NEW_ADDRESS' });
	});

	// Fachreview 580 F-4: an wen bis wann Rechnungen gingen, bleibt für die Auskunft nach Art. 25 DSG nachvollziehbar
	it('hält jeden Wechsel der KI mit Anbieter und Land im Protokoll fest', async () => {
		await save(muster);
		await save({ mode: 'none' });
		await save({ mode: 'local' });

		const entries = await db.select().from(auditLog).orderBy(auditLog.occurredAt);
		expect(entries.map(({ action, details }) => ({ action, details }))).toEqual([
			{
				action: 'ki_setting_changed',
				details: { mode: 'provider', provider: 'Muster KI AG', country: 'Deutschland' }
			},
			{ action: 'ki_setting_changed', details: { mode: 'none' } },
			{ action: 'ki_setting_changed', details: { mode: 'local' } }
		]);
	});

	it('schreibt nichts ins Protokoll, wenn das Speichern scheitert', async () => {
		await save({ mode: 'provider' });

		expect(await db.select().from(auditLog)).toEqual([]);
	});
});

describe('KI-Modell der lokalen KI', () => {
	// Fachreview 580 F-5: der Liegenschaftsverwalter lädt das Modell auf der Seite «KI» erneut herunter
	it('lädt das KI-Modell auf Wunsch erneut herunter', async () => {
		const pulls: string[] = [];
		const ollama = Bun.serve({
			port: 0,
			fetch: async (request) => {
				const path = new URL(request.url).pathname;
				if (path === '/api/tags') return Response.json({ models: [] });
				pulls.push(((await request.json()) as { model: string }).model);
				return new Response(`${JSON.stringify({ status: 'success' })}\n`);
			}
		});
		Object.assign(llmConfig, {
			baseUrl: `http://127.0.0.1:${ollama.port}/v1`,
			model: 'lokal-modell'
		});
		try {
			const response = await callApi('/api/v1/ki/model', { method: 'POST' });

			expect(response.status).toBe(202);
			await Bun.sleep(50);
			expect(pulls).toEqual(['lokal-modell']);
			expect(modelState()).toEqual({ state: 'ready' });
		} finally {
			ollama.stop(true);
			Object.assign(llmConfig, { baseUrl: configured.baseUrl, model: configured.model });
		}
	});

	// Fachreview 580-3 F-21: ohne lokale KI (Installationsanleitung, Abschnitt 6) antwortet unter der Adresse niemand
	it('meldet keinen Zustand des KI-Modells, wenn die lokale KI nicht antwortet', async () => {
		Object.assign(llmConfig, { baseUrl: 'http://127.0.0.1:9/v1' });
		try {
			await save({ mode: 'local' });
			await Bun.sleep(50);

			expect(await (await callApi('/api/v1/ki/model')).json()).toEqual({ state: 'unknown' });
		} finally {
			Object.assign(llmConfig, { baseUrl: configured.baseUrl });
		}
	});

	it('lädt kein KI-Modell, solange ein Anbieter gewählt ist', async () => {
		await save(muster);

		const response = await callApi('/api/v1/ki/model', { method: 'POST' });

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'KI_NOT_LOCAL' });
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

	// llm:eval setzt nur Adresse, Schlüssel und Modell; den Anbieter verlangt erst der Start des Servers
	it('fragt die KI des Betreibers auch ohne Namen und Land des Anbieters', async () => {
		Object.assign(llmConfig, {
			byOperator: true,
			baseUrl: `http://127.0.0.2:${provider.port}/v1`,
			apiKey: 'richtig',
			model: 'bild-modell'
		});
		try {
			const response = await sendJson('POST', '/api/v1/categories/propose', { name: 'Treppenhausreinigung', description: '' });

			expect(response.status).toBe(200);
		} finally {
			Object.assign(llmConfig, { apiKey: configured.apiKey, model: configured.model });
		}
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

	// Codereview 580 C-7: ein Serverfehler oder zu viele Anfragen sagen nichts über das Modell
	it('meldet einen Anbieter, der mit einem Serverfehler oder «nicht gefunden» antwortet, als nicht erreichbar', async () => {
		for (const status of [503, 404]) {
			const failing = Bun.serve({ port: 0, fetch: () => new Response(null, { status }) });
			try {
				const result = await check({ ...muster, baseUrl: `http://127.0.0.1:${failing.port}/v1` });

				expect(await result.json()).toEqual({ result: 'unreachable' });
			} finally {
				failing.stop(true);
			}
		}
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

	// nur eine Antwort auf ein Bild zeigt, dass das Modell Rechnungsbilder liest; Fachreview 580 F-3: die Datenschutzerklärung
	// nennt den Anbieter noch nicht, darum gehen nur ein festes Testbild und ein fester Text, nie erfasste Daten
	it('schickt nur ein festes Testbild und einen festen Text', async () => {
		// Fachreview 580-2 F-18: eine erfasste Kategorie mit einem Namen darin geht nicht mit
		const name = `Hauswart Meier ${crypto.randomUUID()}`;
		await sendJson('POST', '/api/v1/categories', { name, isAllowedUtilityCost: true });
		await check(muster);
		await check({ ...muster, model: 'anderes-modell' });

		expect(requests.map((request) => request.images)).toEqual([1, 1]);
		expect(requests[0].text).toBe(requests[1].text);
		expect(requests[0].image).toBe(requests[1].image);
		expect(requests[0].text).toContain('Verbindungstest');
		expect(requests[0].image).toStartWith('data:image/png;base64,');
		expect(requests[0].text).not.toContain(name);
		await db.execute(sql`DELETE FROM categories WHERE name = ${name}`);
	});
});
