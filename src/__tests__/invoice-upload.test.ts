import { describe, expect, it } from 'vitest';
import {
	checkRow,
	fileRefusal,
	invoiceOf,
	newRow,
	withoutKi,
	withProposal,
	type Proposal
} from '../lib/invoice-upload';
import extraction from '../../tests/contracts/invoice-extraction.json';

const pdf = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 1, 2])], 'blitz.pdf', { type: 'application/pdf' });
const defaults = { distributionKeyId: 'k1' };
// The backend's answer from the API contract (tests/contracts/invoice-extraction.json)
const proposal = (values: Partial<Proposal> = {}): Proposal => ({ ...(extraction as Proposal), ...values });

describe('Datei für eine Rechnung', () => {
	it('nimmt PDF, JPG und PNG bis 10 MB nach ihren ersten Bytes an', async () => {
		expect(await fileRefusal(pdf)).toBeNull();
		const word = new File([new Uint8Array([0x50, 0x4b, 3, 4])], 'rechnung.pdf');
		expect(await fileRefusal(word)).toContain('PDF-, JPG- und PNG-Dateien');
		const big = new File([new Uint8Array([0xff, 0xd8, 0xff]), new Uint8Array(10 * 1024 * 1024)], 'scan.jpg');
		expect(await fileRefusal(big)).toContain('grösser als 10 MB');
	});
});

describe('Vorschlag der KI für eine Datei', () => {
	it('füllt die Felder, wählt die Kategorie und nennt unsichere Felder und Hinweise', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null }));
		expect(row.values).toMatchObject({
			billingEntity: 'Elektro Blitz AG',
			invoiceNumber: 'R-1001',
			amount: '1250.00',
			invoiceDate: '2026-03-31',
			categoryId: 'c1',
			distributionKeyId: 'k1'
		});
		expect(row.status).toBe('check');
		expect(row.unsure).toEqual(['invoiceDate']);
		expect(row.selected).toBe(true);
		expect(row.notes).toEqual([
			'Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF\u00a01’000.00). Erfassen Sie den Betrag so, dass jede Leistung nur einmal zählt.'
		]);
	});

	it('wählt eine schon erfasste Rechnung und eine Datei mit mehreren Rechnungen nicht zum Erstellen', () => {
		expect(withProposal(newRow(1, pdf, defaults), proposal()).selected).toBe(false);
		const several = withProposal(newRow(2, pdf, defaults), proposal({ invoiceCount: 2, duplicateOf: null }));
		expect(several).toMatchObject({ selected: false, several: true });
		expect(several.notes).toContain('Diese Datei enthält mehrere Rechnungen. Laden Sie jede einzeln hoch.');
	});

	it('übernimmt eine unsichere Kategorie (unter 70 %) nicht und nennt Mahnung, Gutschrift und gemischte Kosten', () => {
		const unsure = proposal({ duplicateOf: null, deductedAmount: null, documentType: 'reminder', nonAllocableItems: true });
		unsure.categorization = { ...unsure.categorization!, confidence: 0.5 };
		const row = withProposal(newRow(1, pdf, defaults), unsure);
		expect(row.values.categoryId).toBe('');
		expect(row.notes).toEqual([
			'Das ist eine Mahnung. Mahngebühren und Verzugszinsen sind keine Nebenkosten; erfassen Sie die ursprüngliche Rechnung.',
			'Die Rechnung enthält Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Erfassen Sie diese als eigene Rechnung.'
		]);
	});

	it('lässt die Felder ohne KI leer und sagt, warum', () => {
		const row = withoutKi(newRow(1, pdf, defaults), 'unavailable');
		expect(row).toMatchObject({ status: 'check', selected: true, notes: ['Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.'] });
		expect(row.values.billingEntity).toBe('');
	});
});

describe('Rechnung aus einer Datei erstellen', () => {
	it('verlangt die Pflichtfelder und eine Kategorie', () => {
		const row = withoutKi(newRow(1, pdf, defaults), 'unavailable');
		expect(checkRow(row)).toMatchObject({ category: 'Wählen Sie eine Kategorie.' });
		expect(Object.keys(checkRow(row))).toEqual(expect.arrayContaining(['invoiceDate', 'billingEntity', 'description', 'amount']));
		const filled = withProposal(newRow(2, pdf, defaults), proposal({ duplicateOf: null }));
		expect(checkRow(filled)).toEqual({});
	});

	it('schickt die Angaben so, wie das Backend eine neue Rechnung nimmt, mit dem Vorschlag der KI', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null }));
		row.values.amount = "1'250.50";
		expect(invoiceOf(row, 'b1')).toEqual({
			buildingId: 'b1',
			invoiceNumber: 'R-1001',
			billingEntityName: 'Elektro Blitz AG',
			description: 'Allgemeinstrom Q1',
			amount: '1250.50',
			invoiceDate: '2026-03-31',
			servicePeriodStart: '2026-01-01',
			servicePeriodEnd: '2026-03-31',
			dueDate: '2026-04-30',
			categoryId: 'c1',
			distributionKeyId: 'k1',
			isValidUtilityCost: true,
			llmCategoryId: 'c1',
			llmConfidence: '0.9'
		});
	});
});
