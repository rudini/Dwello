/**
 * Who receives invoice data for the KI categorization, as the privacy statement names it (DSG Art. 19)
 */

import { describe, expect, it } from 'bun:test';
import { llmRecipient } from '../config/llm';

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
