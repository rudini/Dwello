/**
 * Who receives invoice data for the KI categorization, as the privacy statement names it (DSG Art. 19)
 */

import { describe, expect, it } from 'bun:test';
import { llmRecipient } from '../config/llm';

const config = (baseUrl: string, provider = '', providerCountry = '') => ({ baseUrl, provider, providerCountry });

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
});
