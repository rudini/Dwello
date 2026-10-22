/**
 * Who receives invoice data for the KI categorization, as the privacy statement names it (DSG Art. 19)
 */

import { describe, expect, it } from 'bun:test';
import { checkLocalKi, llmRecipient } from '../config/llm';

const config = (baseUrl: string, provider = '', providerCountry = '', enabled = true) => ({
	baseUrl,
	provider,
	providerCountry,
	enabled
});

describe('Empfänger der Rechnungsdaten', () => {
	it('gibt niemanden an, wenn das Modell auf dem Server des Betreibers läuft', () => {
		expect(llmRecipient(config('http://localhost:11434/v1'))).toBeNull();
		expect(llmRecipient(config('http://ollama:11434/v1'))).toBeNull();
	});

	it('nennt Anbieter und Land eines externen Anbieters', () => {
		expect(llmRecipient(config('https://api.openai.com/v1', 'OpenAI', 'USA'))).toEqual({
			provider: 'OpenAI',
			country: 'USA'
		});
	});

	// Sonst stünde in der Datenschutzerklärung ein Empfänger ohne Namen oder Land
	it('verlangt Anbieter und Land, sobald ein externer Anbieter konfiguriert ist', () => {
		expect(() => llmRecipient(config('https://api.openai.com/v1', 'OpenAI'))).toThrow(
			'LLM_PROVIDER and LLM_PROVIDER_COUNTRY'
		);
	});

	it('gibt niemanden an, wenn die KI-Kategorisierung ausgeschaltet ist', () => {
		expect(llmRecipient(config('https://api.openai.com/v1', '', '', false))).toBeNull();
	});
});

// Ohne Grafikkarte braucht das Standardmodell zum Kategorisieren rund 40 s, zum Auslesen einer Rechnung rund 80 s (#419)
describe('Wartezeit auf die KI', () => {
	it('wartet ohne LLM_TIMEOUT 120 s auf eine Antwort', async () => {
		const saved = process.env.LLM_TIMEOUT;
		delete process.env.LLM_TIMEOUT;
		try {
			const { llmConfig: fresh } = await import(`../config/llm?timeout=${Date.now()}`);
			expect(fresh.timeout).toBe(120_000);
		} finally {
			if (saved !== undefined) process.env.LLM_TIMEOUT = saved;
		}
	});
});

// #580: setzt der Betreiber eine LLM_*-Variable, gilt seine KI, und der Liegenschaftsverwalter kann sie nicht ändern
describe('Vom Betreiber festgelegte KI', () => {
	const NAMES = [
		'LLM_BASE_URL',
		'LLM_API_KEY',
		'LLM_MODEL',
		'LLM_PROVIDER',
		'LLM_PROVIDER_COUNTRY',
		'LLM_ENABLED',
		'LLM_LOCAL_URL'
	];
	const configWith = async (env: Record<string, string>) => {
		const saved = Object.fromEntries(NAMES.map((name) => [name, process.env[name]]));
		for (const name of NAMES) delete process.env[name];
		Object.assign(process.env, env);
		try {
			return (await import(`../config/llm?operator=${Math.random()}`)).llmConfig;
		} finally {
			for (const name of NAMES) {
				if (saved[name] === undefined) delete process.env[name];
				else process.env[name] = saved[name];
			}
		}
	};

	it('legt die KI fest, sobald eine LLM_*-Variable gesetzt ist', async () => {
		for (const name of NAMES.filter((name) => name !== 'LLM_LOCAL_URL')) {
			expect((await configWith({ [name]: 'x' })).byOperator).toBe(true);
		}
	});

	// docker-compose.prod.yml gibt nicht gesetzte Variablen leer weiter
	it('lässt die KI ohne LLM_*-Variablen oder mit leeren dem Liegenschaftsverwalter', async () => {
		expect((await configWith({})).byOperator).toBe(false);
		expect((await configWith({ LLM_BASE_URL: '', LLM_MODEL: '' })).byOperator).toBe(false);
	});

	// LLM_LOCAL_URL nennt nur, wo die lokale KI läuft, etwa der Container ollama
	it('fragt die lokale KI unter LLM_LOCAL_URL, ohne sie festzulegen', async () => {
		const config = await configWith({ LLM_LOCAL_URL: 'http://ollama:11434/v1' });

		expect(config).toMatchObject({ byOperator: false, baseUrl: 'http://ollama:11434/v1' });
	});
});

// Fachreview 580 F-23: die lokale KI muss auf dem Server laufen, sonst stimmt «verlassen den Server nicht» nicht
describe('Adresse der lokalen KI', () => {
	it('nimmt eine Adresse auf dem Server an', () => {
		expect(() => checkLocalKi('http://ollama:11434/v1')).not.toThrow();
		expect(() => checkLocalKi('http://127.0.0.1:11434/v1')).not.toThrow();
	});

	it('verweigert eine Adresse auf einem anderen Rechner und sagt, was zu tun ist', () => {
		expect(() => checkLocalKi('http://192.168.1.20:11434/v1')).toThrow(
			'LLM_LOCAL_URL is not on this server: point it to localhost or the compose service ollama, or remove it and choose a provider under «Einstellungen» › «KI» after the start'
		);
	});
});
