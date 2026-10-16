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
			'Auf der Rechnung sind bereits bezahlte Beträge abgezogen (CHF\u00a01’000.00). Vorgeschlagen ist das Total der Leistungen vor dem Abzug. Erfassen Sie die Akontozahlungen nicht zusätzlich als eigene Rechnungen, sonst zählen sie doppelt.',
			'Prüfen Sie: Rechnungsdatum.'
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
			'Die Rechnung enthält Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Tragen Sie hier nur den umlagefähigen Betrag ein und erfassen Sie den Rest danach mit «Rechnung erfassen» in der Kategorie Reparaturen.',
			'Prüfen Sie: Rechnungsdatum, Kategorie.'
		]);
		expect(withProposal(newRow(2, pdf, defaults), proposal({ duplicateOf: null, nonAllocableItems: true })).selected).toBe(false);
	});

	it('wählt eine Gutschrift und eine Mahnung nicht zum Erstellen, mit ihrem Hinweis', () => {
		for (const [documentType, note] of [
			['credit_note', 'Das ist eine Gutschrift.'],
			['reminder', 'Das ist eine Mahnung.']
		]) {
			const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, documentType }));
			expect(row.selected).toBe(false);
			expect(row.notes.join(' ')).toContain(note);
		}
	});

	it('nennt die Felder, die die KI nicht gefunden hat', () => {
		const fields = { ...extraction.fields, invoiceNumber: null, dueDate: null };
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, fields }));
		expect(row.missing).toEqual(['invoiceNumber', 'dueDate']);
		expect(row.notes).toContain('Prüfen Sie: Rechnungsnummer, Rechnungsdatum, Fälligkeitsdatum.');
	});

	it('nennt eine fehlende Kategorie bei dem, was zu prüfen ist (Personas Anna, Helga, Dr. Weber)', () => {
		const unsure = proposal({ duplicateOf: null, deductedAmount: null, categorization: null });
		expect(withProposal(newRow(1, pdf, defaults), unsure).notes).toEqual(['Prüfen Sie: Rechnungsdatum, Kategorie.']);
	});

	it('nennt ein selbst ausgefülltes Feld nach erneutem Lesen nicht mehr als nicht gefunden', () => {
		const typed = newRow(1, pdf, defaults);
		typed.values.invoiceNumber = 'X-7';
		const fields = { ...extraction.fields, invoiceNumber: null };
		expect(withProposal(typed, proposal({ duplicateOf: null, fields })).missing).not.toContain('invoiceNumber');
	});

	it('behält mit der gewählten Kategorie auch, ob die Kosten umlagefähig sind', () => {
		const typed = newRow(1, pdf, defaults);
		typed.values.categoryId = 'c7';
		typed.values.isValidUtilityCost = true;
		const repairs = { ...proposal({ duplicateOf: null }).categorization!, category: { id: 'c2', name: 'Repairs', isAllowedUtilityCost: false } };
		expect(withProposal(typed, proposal({ duplicateOf: null, categorization: repairs })).values).toMatchObject({
			categoryId: 'c7',
			isValidUtilityCost: true
		});
	});

	it('behält, was der Liegenschaftsverwalter schon eingetragen hat, wenn die KI die Datei erneut liest', () => {
		const typed = newRow(1, pdf, defaults);
		typed.values.amount = '99.00';
		expect(withProposal(typed, proposal({ duplicateOf: null })).values).toMatchObject({ amount: '99.00', invoiceNumber: 'R-1001' });
	});

	it('sagt, dass die KI nur die ersten 3 Seiten gelesen hat', () => {
		const row = withProposal({ ...newRow(1, pdf, defaults), morePages: true }, proposal({ duplicateOf: null, deductedAmount: null }));
		expect(row.notes).toEqual([
			'Die KI hat nur die ersten 3 Seiten gelesen. Prüfen Sie Betrag und Positionen auf den übrigen Seiten.',
			'Prüfen Sie: Rechnungsdatum.'
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
