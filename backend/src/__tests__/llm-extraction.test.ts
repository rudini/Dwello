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
		heatingMaterial: true,
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

	it('lässt ein Datum mit unmöglichem Monat leer, statt den ganzen Vorschlag zu verwerfen', () => {
		const parsed = parseExtractionResponse(answer({ invoiceDate: '2026-13-01', dueDate: '2026-01-32' }));
		expect(parsed?.fields).toMatchObject({ invoiceDate: null, dueDate: null, billingEntityName: 'Elektro Blitz AG' });
	});

	it('nennt einen unsicheren Betrag und einen unsicheren Leistungszeitraum unter ihren Feldern', () => {
		const parsed = parseExtractionResponse(
			answer({
				servicePeriodStart: '2026-01-01',
				servicePeriodEnd: '2026-03-31',
				confidence: { billingEntityName: 0.95, invoiceNumber: 0.9, invoiceDate: 0.9, totalAmount: 0.5, servicePeriodStart: 0.6, description: 0.9 }
			})
		);
		expect(parsed?.unsure).toEqual(['amount', 'servicePeriodStart', 'servicePeriodEnd']);
	});

	it('nennt einen gelesenen Wert ohne Angabe, wie sicher die KI ist, als unsicher', () => {
		expect(parseExtractionResponse(answer({ confidence: { billingEntityName: 0.95 } }))?.unsure).toEqual([
			'invoiceNumber',
			'invoiceDate',
			'amount',
			'description'
		]);
		expect(parseExtractionResponse(answer({ confidence: undefined }))?.unsure).toContain('billingEntityName');
	});

	it('verwirft einen Leistungszeitraum, der vor seinem Beginn endet, und liest die Zahl der Rechnungen auch als Text', () => {
		const parsed = parseExtractionResponse(
			answer({ servicePeriodStart: '2026-03-31', servicePeriodEnd: '2026-01-01', invoiceCount: '2' })
		);
		expect(parsed?.fields).toMatchObject({ servicePeriodStart: null, servicePeriodEnd: null });
		expect(parsed?.invoiceCount).toBe(2);
		for (const invoiceCount of [-2, 1.5, true]) expect(parseExtractionResponse(answer({ invoiceCount }))?.invoiceCount).toBe(1);
	});

	it('meldet abgezogene Beträge, Mahnungen, Gutschriften und gemischte Kosten', () => {
		expect(parseExtractionResponse(answer({ deductedAmount: 1000, nonAllocableItems: true }))).toMatchObject({
			deductedAmount: '1000.00',
			nonAllocableItems: true
		});
		expect(parseExtractionResponse(answer({ documentType: 'reminder' }))?.documentType).toBe('reminder');
		expect(parseExtractionResponse(answer({ documentType: 'Quittung' }))?.documentType).toBe('invoice');
	});

	// #455 (#262): eine Akontorechnung allein ist eine eigene Dokumentart
	it('erkennt eine Akontorechnung und fragt im Prompt nach ihr', () => {
		expect(parseExtractionResponse(answer({ documentType: 'advance_invoice' }))?.documentType).toBe('advance_invoice');
		expect(buildExtractionPrompt('Werke Akonto.pdf')).toContain('"advance_invoice" für eine Akontorechnung');
	});

	// #1474, as the product owner decided (24.11.2026 second round, 25.11.2026 third round, Fachreview 1474-2): the KI lists
	// the delivery days of heating material, Dwello takes a single one as the Leistungszeitraum
	it('verlangt die Liefertage von Heizmaterial, ohne Rechnungs-, Bestelldatum oder den Tag einer Arbeit', () => {
		expect(buildExtractionPrompt('Heizöl.pdf')).toContain(
			'- deliveryDates: bei einer Rechnung über Heizmaterial (z.B. Heizöl, Flüssiggas, Pellets, Holz) jeder Tag, an dem geliefert wurde (z.B. «Lieferdatum», «geliefert am», «Lieferung vom»), als Liste (JJJJ-MM-TT); Rechnungs-, Bestell-, Auftrags-, Offert- und Fälligkeitsdatum sind kein Liefertag, der Tag einer ausgeführten Arbeit (z.B. «ausgeführt am») auch nicht; sonst []'
		);
	});

	it('übernimmt einen einzelnen Liefertag als eintägigen Leistungszeitraum', () => {
		const parsed = parseExtractionResponse(answer({ deliveryDates: ['2026-06-28'] }));
		expect(parsed?.fields).toMatchObject({ servicePeriodStart: '2026-06-28', servicePeriodEnd: '2026-06-28' });
	});

	// Fachreview 1474-2 V-6: a one-day Leistungszeitraum from the delivery day is as sure as the KI read that day
	it('nennt einen Leistungszeitraum aus dem Liefertag unsicher, wenn die KI den Liefertag unsicher las', () => {
		const sure = { billingEntityName: 0.95, invoiceNumber: 0.9, invoiceDate: 0.9, totalAmount: 0.9, description: 0.9 };
		const unsure = (deliveryDates: number) =>
			parseExtractionResponse(
				answer({ deliveryDates: ['2026-06-28'], confidence: { ...sure, deliveryDates } })
			)?.unsure;
		expect(unsure(0.9)).toEqual([]);
		expect(unsure(0.5)).toEqual(['servicePeriodStart', 'servicePeriodEnd']);
		expect(buildExtractionPrompt('Heizöl.pdf')).toContain('"deliveryDates": <0 bis 1>');
	});

	// PO 25.11.2026 (third round): a delivery of other goods, e.g. Regeneriersalz, keeps no Leistungszeitraum
	it('setzt für den Liefertag anderer Ware als Heizmaterial keinen Leistungszeitraum', () => {
		expect(buildExtractionPrompt('Salz.pdf')).toContain(
			'- heatingMaterial: true, wenn die Rechnung Heizmaterial liefert (Heizöl, Flüssiggas, Pellets, Holz), sonst false (z.B. Salz, Reinigungsmittel, eine Arbeit)'
		);
		const parsed = parseExtractionResponse(
			answer({ heatingMaterial: false, deliveryDates: ['2026-02-10'] })
		);
		expect(parsed?.fields).toMatchObject({ servicePeriodStart: null, servicePeriodEnd: null });
	});

	it('setzt bei mehreren Liefertagen keinen Leistungszeitraum', () => {
		const parsed = parseExtractionResponse(answer({ deliveryDates: ['2026-10-14', '2026-11-18'] }));
		expect(parsed?.fields).toMatchObject({ servicePeriodStart: null, servicePeriodEnd: null });
	});

	it('behält einen genannten Leistungszeitraum neben einem Liefertag', () => {
		const parsed = parseExtractionResponse(
			answer({
				servicePeriodStart: '2026-01-01',
				servicePeriodEnd: '2026-03-31',
				deliveryDates: ['2026-02-10']
			})
		);
		expect(parsed?.fields).toMatchObject({
			servicePeriodStart: '2026-01-01',
			servicePeriodEnd: '2026-03-31'
		});
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
