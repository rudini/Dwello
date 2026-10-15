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
			// Sonst würde der Aufwand neben der Verwaltungspauschale doppelt verrechnet (F-19)
			expect(llm.prompts[0]).toContain(
				'Den Aufwand für die Erstellung der Nebenkostenabrechnung (Art. 4 Abs. 3 VMWG) rechnet Dwello über die Verwaltungspauschale ab; eine Kategorie dafür ist nicht umlagefähig.'
			);
			expect(llm.prompts[0]).toContain(
				'Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.'
			);
		} finally {
			llm.stop();
		}
	});

	it('zeigt der KI die vordefinierten Kategorien mit ihrer Umlagefähigkeit (#202)', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: true, confidence: 0.9, reasoning: '' });
		const own = `Eigene Reinigung ${crypto.randomUUID()}`;
		const { id } = (await (
			await sendJson('POST', '/api/v1/categories', { name: own, nameDE: own, isAllowedUtilityCost: false })
		).json()) as { id: string };
		try {
			await sendJson('POST', '/api/v1/categories/propose', { name: 'Treppenhausreinigung' });

			const [allowed, notAllowed] = llm.prompts[0].split('VORDEFINIERTE NICHT UMLAGEFÄHIGE KATEGORIEN');
			expect(allowed).toContain(
				'- Caretaker (Hauswart): Lohn für Reinigung, Bedienung der Heizung und kleine Instandhaltung'
			);
			expect(notAllowed).toContain('- Repairs (Reparaturen): Reparaturen und Unterhalt (trägt der Vermieter)');
			// Eine eigene Einstufung des Vermieters ist nicht geprüft und soll sich nicht fortpflanzen
			expect(llm.prompts[0]).not.toContain(own);
		} finally {
			llm.stop();
			await sendJson('DELETE', `/api/v1/categories/${id}`);
		}
	});

	it('sagt der KI, dass die vordefinierten Kategorien nicht vollständig sind, ohne eine Antwort vorzugeben (#212)', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: true, confidence: 0.9, reasoning: '' });
		try {
			await sendJson('POST', '/api/v1/categories/propose', { name: 'Treppenhausreinigung' });

			expect(llm.prompts[0]).toContain('Die vordefinierten Kategorien sind nicht vollständig.');
			// Reparaturen gehen vor, sonst ordnet ein kleines Modell die Liftreparatur dem Lift zu
			expect(llm.prompts[0]).toContain(
				'1. Reparatur, Ersatz, Erneuerung, Renovation, Anschaffung und wertvermehrende Investitionen trägt immer der Vermieter'
			);
			// Ein kleines Modell übernimmt die Werte des Beispiels
			expect(llm.prompts[0]).toContain('"isAllowedUtilityCost": <true oder false>');
			expect(llm.prompts[0]).not.toContain('z.B. (Art. 257a Abs. 1 OR)');
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
