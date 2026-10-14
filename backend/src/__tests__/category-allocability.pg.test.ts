/**
 * The KI proposes whether a new category is umlagefähig (#176): only a sure answer becomes a proposal,
 * otherwise the Liegenschaftsverwalter chooses alone (real PostgreSQL database, KI stand-in via Bun.serve)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { llmConfig } from '../config/llm';
import { sendJson } from './helpers/auth';
import { openAiCompatible } from './helpers/llm';
import { expectRejection } from './helpers/records';

const configured = { ...llmConfig };
const NO_PROPOSAL = 'Die KI ist nicht erreichbar oder ist sich nicht sicher.';
const propose = () =>
	sendJson('POST', '/api/v1/categories/propose', { name: 'Dachsanierung', description: 'Neues Ziegeldach' });

beforeAll(() => {
	// Nothing listens on port 9: no KI unless a test starts one
	llmConfig.baseUrl = 'http://127.0.0.1:9';
});

afterAll(() => {
	Object.assign(llmConfig, configured);
});

describe('Vorschlag der KI für eine neue Kategorie', () => {
	it('übernimmt eine sichere Einstufung mit Begründung', async () => {
		const reasoning = 'Erneuerung des Gebäudes, nicht Gebrauch (Art. 257a Abs. 1 OR).';
		const llm = openAiCompatible({ isAllowedUtilityCost: false, confidence: 0.9, reasoning });
		try {
			const response = await propose();

			expect(response.status).toBe(200);
			expect(await response.json()).toEqual({ isAllowedUtilityCost: false, reasoning });
		} finally {
			llm.stop();
		}
	});

	it('fragt mit Name, Beschreibung und dem Gesetzestext nach Fedlex', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: false, confidence: 0.9, reasoning: '' });
		try {
			await propose();

			expect(llm.prompts[0]).toContain('Kategorie: Dachsanierung\n');
			expect(llm.prompts[0]).toContain('Beschreibung: Neues Ziegeldach\n');
			expect(llm.prompts[0]).toContain(
				'Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.'
			);
		} finally {
			llm.stop();
		}
	});

	it('verlangt die Begründung in der Sprache der Oberfläche', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: false, confidence: 0.9, reasoning: '' });
		try {
			await sendJson('POST', '/api/v1/categories/propose', { name: 'Toiture', language: 'fr' });

			expect(llm.prompts[0]).toContain('Sprache der Begründung: Französisch\n');
		} finally {
			llm.stop();
		}
	});

	it('schlägt ab einer Konfidenz von 0.7 vor', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: true, confidence: 0.7, reasoning: 'Betrieb' });
		try {
			expect((await propose()).status).toBe(200);
		} finally {
			llm.stop();
		}
	});

	it('schlägt nichts vor, wenn die KI unsicher ist', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: true, confidence: 0.69, reasoning: 'Vielleicht' });
		try {
			await expectRejection(await propose(), 503, NO_PROPOSAL, 'KI_NO_PROPOSAL');
		} finally {
			llm.stop();
		}
	});

	it('schlägt nichts vor, wenn die KI nicht erreichbar ist', async () => {
		await expectRejection(await propose(), 503, NO_PROPOSAL, 'KI_NO_PROPOSAL');
	});

	it('schlägt nichts vor, wenn die Antwort der KI unbrauchbar ist', async () => {
		const llm = openAiCompatible({ category: 'Repairs' });
		try {
			await expectRejection(await propose(), 503, NO_PROPOSAL, 'KI_NO_PROPOSAL');
		} finally {
			llm.stop();
		}
	});
});
