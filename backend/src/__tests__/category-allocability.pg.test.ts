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
// Whether trying again can help (#186)
const UNAVAILABLE = ['Die KI ist nicht erreichbar.', 'KI_PROPOSAL_UNAVAILABLE'] as const;
const UNSURE = ['Die KI ist sich nicht sicher.', 'KI_PROPOSAL_UNSURE'] as const;
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
				'Den Aufwand für die Erstellung der Nebenkostenabrechnung (Art. 4 Abs. 3 VMWG) rechnet Dwello über die Verwaltungspauschale ab; eine Kategorie dafür, auch ein Honorar für die Heizkostenabrechnung, ist nicht umlagefähig.'
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

	it('gibt der KI die Prüfregeln für kleine Modelle, ohne eine Antwort vorzugeben (#212)', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: true, confidence: 0.9, reasoning: '' });
		try {
			await sendJson('POST', '/api/v1/categories/propose', { name: 'Treppenhausreinigung' });

			// Reparaturen gehen vor, sonst ordnet ein kleines Modell die Liftreparatur dem Lift zu
			expect(llm.prompts[0]).toContain(
				'1. Reparatur, Renovation, Erneuerung, Ersatz und Anschaffung von Anlagen, Geräten und Bauteilen sowie wertvermehrende Investitionen trägt immer der Vermieter'
			);
			// Sonst schiebt ein kleines Modell das gekaufte Heizöl als «Anschaffung» zum Vermieter
			expect(llm.prompts[0]).toContain(
				'Brennstoffe und Energie, die verbraucht werden, sind keine Anschaffung (Art. 5 Abs. 2 Bst. a VMWG).'
			);
			expect(llm.prompts[0]).toContain('2. Die vordefinierten Kategorien sind nicht vollständig.');
			expect(llm.prompts[0]).toContain(
				'3. Art. 5 und 6 VMWG nur anwenden, wenn die Kategorie Heizung oder Warmwasser betrifft.'
			);
			expect(llm.prompts[0]).toContain(
				'öffentliche Abgaben, die sich aus dem Gebrauch ergeben (z.B. Gebühren nach Verbrauch), sind umlagefähig'
			);
			// Ein kleines Modell übernimmt die Werte des Beispiels
			expect(llm.prompts[0]).toContain('"isAllowedUtilityCost": <true oder false>');
			expect(llm.prompts[0]).toContain('"confidence": <Zahl von 0 bis 1>');
			expect(llm.prompts[0]).not.toContain('z.B. (Art. 257a Abs. 1 OR)');
		} finally {
			llm.stop();
		}
	});

	// #452 (PO decision on llm:eval): the new Lift and Kehricht descriptions turned these two heating cases
	it('sagt der KI, wie Service und Abrechnung der Heizung einzustufen sind', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: true, confidence: 0.9, reasoning: '' });
		try {
			await sendJson('POST', '/api/v1/categories/propose', { name: 'Brennerservice' });

			expect(llm.prompts[0]).toContain(
				'Wartung und Service der Heizungsanlage, z.B. der Brennerservice, sind umlagefähig (Art. 5 Abs. 2 Bst. g VMWG); ihre Reparatur nicht (Regel 1).'
			);
			expect(llm.prompts[0]).toContain('eine Kategorie dafür, auch ein Honorar für die Heizkostenabrechnung, ist nicht umlagefähig.');
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
			await expectRejection(await propose(), 503, ...UNSURE);
		} finally {
			llm.stop();
		}
	});

	// Eine abgeschaltete KI wird nie gefragt (#216), auch wenn ein Anbieter antworten würde
	it('schlägt nichts vor, wenn die KI abgeschaltet ist', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: true, confidence: 0.9, reasoning: 'Betrieb' });
		llmConfig.enabled = false;
		try {
			await expectRejection(await propose(), 503, ...UNAVAILABLE);
			expect(llm.prompts).toEqual([]);
		} finally {
			llmConfig.enabled = configured.enabled;
			llm.stop();
		}
	});

	it('schlägt nichts vor, wenn die KI nicht erreichbar ist', async () => {
		await expectRejection(await propose(), 503, ...UNAVAILABLE);
	});

	it('schlägt nichts vor, wenn die Antwort der KI unbrauchbar ist', async () => {
		const llm = openAiCompatible({ category: 'Repairs' });
		try {
			await expectRejection(await propose(), 503, ...UNSURE);
		} finally {
			llm.stop();
		}
	});
});
