/**
 * Reading a Beleg: what the KI's answer becomes (proposals the property manager checks before saving)
 */

import { describe, expect, it } from 'bun:test';
import { buildExtractionPrompt, parseExtractionResponse } from '../config/llm';

const answer = (fields: object) =>
	JSON.stringify({
		invoiceCount: 1,
		documentType: 'invoice',
		billingEntityName: 'Elektro Blitz AG',
		invoiceNumber: 'R-1001',
		invoiceDate: '2026-03-31',
		totalAmount: 1250,
		deductedAmount: null,
		servicePeriodStart: null,
		servicePeriodEnd: null,
		dueDate: null,
		description: 'Allgemeinstrom Q1',
		nonAllocableItems: false,
		confidence: { billingEntityName: 0.95, invoiceNumber: 0.9, invoiceDate: 0.4, totalAmount: 0.9, description: 0.8 },
		...fields
	});

describe('Antwort der KI zu einem Beleg', () => {
	it('liefert die Angaben als Vorschläge und nennt die unsicheren', () => {
		expect(parseExtractionResponse(`Hier: ${answer({})}`)).toEqual({
			invoiceCount: 1,
			documentType: 'invoice',
			fields: {
				billingEntityName: 'Elektro Blitz AG',
				invoiceNumber: 'R-1001',
				invoiceDate: '2026-03-31',
				amount: '1250.00',
				servicePeriodStart: null,
				servicePeriodEnd: null,
				dueDate: null,
				description: 'Allgemeinstrom Q1'
			},
			deductedAmount: null,
			nonAllocableItems: false,
			unsure: ['invoiceDate']
		});
	});

	it('verwirft Angaben, die keine Daten oder Beträge sind, und einen halben Leistungszeitraum', () => {
		const parsed = parseExtractionResponse(
			answer({ invoiceDate: '31.03.2026', totalAmount: "1'250.-", servicePeriodStart: '2026-01-01', dueDate: '2026-02-30' })
		);
		expect(parsed?.fields).toMatchObject({
			invoiceDate: null,
			amount: null,
			servicePeriodStart: null,
			servicePeriodEnd: null,
			dueDate: null
		});
	});

	it('meldet abgezogene Beträge, Mahnungen, Gutschriften und gemischte Kosten', () => {
		expect(parseExtractionResponse(answer({ deductedAmount: 1000, nonAllocableItems: true }))).toMatchObject({
			deductedAmount: '1000.00',
			nonAllocableItems: true
		});
		expect(parseExtractionResponse(answer({ documentType: 'reminder' }))?.documentType).toBe('reminder');
		expect(parseExtractionResponse(answer({ documentType: 'Quittung' }))?.documentType).toBe('invoice');
	});

	it('gibt nichts zurück, wenn die Antwort kein JSON ist', () => {
		expect(parseExtractionResponse('Ich kann das Bild nicht lesen.')).toBeNull();
	});

	it('nennt die Datei im Prompt mit ihrem Namen und verlangt die Felder als JSON', () => {
		const prompt = buildExtractionPrompt('Werke Q1.pdf');
		expect(prompt).toContain('«Werke Q1.pdf»');
		expect(prompt).toContain('totalAmount');
		expect(prompt).toContain('deductedAmount');
	});
});
