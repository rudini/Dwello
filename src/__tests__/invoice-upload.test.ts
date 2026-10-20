import { describe, expect, it } from 'vitest';
import {
	checkRow,
	fileRefusal,
	invoiceOf,
	newRow,
	openReason,
	selectionHelp,
	proposeKey,
	toDoOf,
	withoutKi,
	withProposal,
	type Proposal,
	type UploadRow
} from '../lib/invoice-upload';
import extraction from '../../tests/contracts/invoice-extraction.json';

const pdf = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 1, 2])], 'blitz.pdf', { type: 'application/pdf' });
const defaults = { distributionKeyId: 'k1' };
// The backend's answer from the API contract (tests/contracts/invoice-extraction.json)
const proposal = (values: Partial<Proposal> = {}): Proposal => ({ ...(extraction as Proposal), ...values });
// everything the row says: what to know about the file, then what is left to do
const said = (row: UploadRow) => [...row.notes, ...toDoOf(row)];

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
		expect(said(row)).toEqual(['Prüfen Sie: Rechnungsdatum.']);
	});

	it('wählt eine schon erfasste Rechnung und eine Datei mit mehreren Rechnungen nicht zum Erstellen', () => {
		expect(withProposal(newRow(1, pdf, defaults), proposal()).selected).toBe(false);
		const several = withProposal(newRow(2, pdf, defaults), proposal({ invoiceCount: 2, duplicateOf: null }));
		expect(several).toMatchObject({ selected: false, several: true });
		// nothing to check or fill in on a file no invoice is created from (persona Anna)
		expect(said(several)).toEqual([
			'Diese Datei enthält mehrere Rechnungen. Erfassen Sie jede mit «Rechnung erfassen» und fügen Sie diese Datei danach auf ihrer Seite mit «Beleg hinzufügen» an, oder laden Sie jede Rechnung als eigene Datei hoch.'
		]);
	});

	it('übernimmt eine unsichere Kategorie (unter 70 %) nicht und nennt bei einer Mahnung nur sie', () => {
		const unsure = proposal({ duplicateOf: null, deductedAmount: null, documentType: 'reminder', nonAllocableItems: true });
		unsure.categorization = { ...unsure.categorization!, confidence: 0.5 };
		const row = withProposal(newRow(1, pdf, defaults), unsure);
		expect(row.values.categoryId).toBe('');
		expect(said(row)).toEqual([
			// a Mahnung becomes no invoice: nothing to fill in (persona Dr. Weber)
			'Das ist eine Mahnung. Mahngebühren und Verzugszinsen sind keine Nebenkosten; erfassen Sie die ursprüngliche Rechnung.'
		]);
		expect(withProposal(newRow(2, pdf, defaults), proposal({ duplicateOf: null, nonAllocableItems: true })).selected).toBe(false);
	});

	it('nennt gemischte Kosten nur, wenn die gewählte Kategorie umlagefähig ist, und wählt die Rechnung nicht (Fachreview V-1)', () => {
		const repairs = { ...proposal().categorization!, category: { id: 'c2', name: 'Repairs', isAllowedUtilityCost: false } };
		const mixed = (categorization: Proposal['categorization']) =>
			withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, nonAllocableItems: true, categorization }));
		expect(said(mixed(repairs)).join(' ')).not.toContain('nicht umlagefähig sind');
		expect(mixed(repairs).selected).toBe(false);
		expect(said(mixed(proposal().categorization)).join(' ')).toContain('nicht umlagefähig sind');
		expect(mixed(proposal().categorization).selected).toBe(false);
	});

	it('folgt mit dem Hinweis auf gemischte Kosten der Kategorie, die der Liegenschaftsverwalter wählt (Fachreview V-8)', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, nonAllocableItems: true }));
		expect(said(row).join(' ')).toContain('nicht umlagefähig sind');
		row.values.isValidUtilityCost = false; // «Reparaturen» chosen
		expect(said(row).join(' ')).not.toContain('nicht umlagefähig sind');
	});

	// #455 (#268): eine kurze Zeile mit dem abgezogenen und dem vorgeschlagenen Betrag; die Regel steht als Hilfetext darunter
	it('nennt abgezogene Akontorechnungen in einer eigenen kurzen Zeile mit dem vorgeschlagenen Total', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null }));
		expect(row.deducted).toBe(
			'Auf der Rechnung sind Akontorechnungen von CHF\u00a01’000.00 abgezogen. Als Betrag ist das Total vor dem Abzug vorgeschlagen: CHF\u00a01’250.00.'
		);
		expect(withProposal(newRow(2, pdf, defaults), proposal({ deductedAmount: null })).deducted).toBeNull();
		// without a total read there is nothing proposed to name (domain review 455 V-5)
		const fields = { ...extraction.fields, amount: null };
		expect(withProposal(newRow(3, pdf, defaults), proposal({ duplicateOf: null, fields })).deducted).toBe(
			'Auf der Rechnung sind Akontorechnungen von CHF 1’000.00 abgezogen. Tragen Sie als Betrag das Total vor dem Abzug ein.'
		);
	});

	// #455 (#262): eine Akontorechnung zählt sonst mit der Schlussrechnung doppelt (Art. 257b Abs. 1 OR)
	it('wählt eine Akontorechnung nicht zum Erstellen und sagt, wann sie zu erfassen ist', () => {
		const row = withProposal(
			newRow(1, pdf, defaults),
			proposal({ duplicateOf: null, documentType: 'advance_invoice', deductedAmount: null, categorization: null })
		);
		expect(row.selected).toBe(false);
		expect(said(row)).toEqual([
			'Das ist eine Akontorechnung: ein Vorschuss, den der Rechnungssteller später mit der Schlussrechnung abrechnet. Erfassen Sie in der Regel nur die Schlussrechnung mit dem Total. Kommt die Schlussrechnung erst nach der Abrechnung dieser Periode, setzen Sie das Häkchen bei «Diese Rechnung erstellen» und erfassen Sie die Akontorechnung; löschen Sie sie, wenn Sie die Schlussrechnung erfassen.'
		]);
	});

	it('nennt bei einer ausgewählten Akontorechnung, was zum Erstellen fehlt', () => {
		const row = withProposal(
			newRow(1, pdf, defaults),
			proposal({ duplicateOf: null, documentType: 'advance_invoice', deductedAmount: null, categorization: null })
		);
		expect(toDoOf({ ...row, selected: true })).toContain('Wählen Sie eine Kategorie.');
	});

	it('sagt bei einer Gutschrift, dass keine Rechnung daraus entsteht und wo sie abgezogen wird', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, documentType: 'credit_note', deductedAmount: null }));
		expect(said(row)[0]).toBe(
			'Das ist eine Gutschrift über CHF\u00a01’250.00. Erstellen Sie daraus keine Rechnung. Verringern Sie den Betrag der Rechnung, zu der sie gehört, um die Gutschrift: in der Zeile dieser Rechnung, wenn ihre Datei hier ausgewählt ist, sonst auf ihrer Seite mit «Rechnung bearbeiten». Bewahren Sie die Gutschrift mit der Originalrechnung auf.'
		);
	});

	// #245, domain review V-6: the total of a Schlussrechnung read as a credit note is no credit note's amount
	it('nennt bei einer Gutschrift mit abgezogenen Beträgen keinen Betrag', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, documentType: 'credit_note', deductedAmount: '1000.00' }));
		expect(said(row)[0]).toMatch(/^Das ist eine Gutschrift\. /);
	});

	it('verlangt bei einer Gutschrift und einer Mahnung nichts zum Ausfüllen, weil keine Rechnung daraus entsteht (Persona Dr. Weber)', () => {
		for (const documentType of ['credit_note', 'reminder']) {
			const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, documentType, categorization: null }));
			expect(toDoOf(row)).toEqual([]);
		}
	});

	it('wählt eine Gutschrift und eine Mahnung nicht zum Erstellen, mit ihrem Hinweis', () => {
		for (const [documentType, note] of [
			['credit_note', 'Das ist eine Gutschrift.'],
			['reminder', 'Das ist eine Mahnung.']
		]) {
			const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, documentType }));
			expect(row.selected).toBe(false);
			expect(said(row).join(' ')).toContain(note);
		}
	});

	it('nennt fehlende Pflichtangaben, unsichere und nicht gefundene freiwillige Felder getrennt (Personas Anna, Helga; Fachreview V-5)', () => {
		const fields = { ...extraction.fields, invoiceNumber: null, dueDate: null, amount: null };
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, deductedAmount: null, fields }));
		expect(row.missing).toEqual(['invoiceNumber', 'amount', 'dueDate']);
		expect(said(row)).toEqual([
			'Füllen Sie aus: Betrag.',
			'Prüfen Sie: Rechnungsdatum.',
			'Ergänzen Sie, wenn auf der Rechnung angegeben: Rechnungsnummer, Fälligkeitsdatum.'
		]);
	});

	it('nennt eine fehlende Kategorie zuerst (Personas Anna, Helga, Dr. Weber)', () => {
		const unsure = proposal({ duplicateOf: null, deductedAmount: null, categorization: null });
		expect(said(withProposal(newRow(1, pdf, defaults), unsure))).toEqual(['Wählen Sie eine Kategorie.', 'Prüfen Sie: Rechnungsdatum.']);
	});

	it('nennt ein selbst ausgefülltes Feld nach erneutem Lesen nicht als unsicher (Code-Review C-42)', () => {
		const typed = newRow(1, pdf, defaults);
		typed.values.invoiceDate = '2026-03-30';
		const row = withProposal(typed, proposal({ duplicateOf: null, deductedAmount: null }));
		expect(row.unsure).toEqual([]);
		expect(said(row)).toEqual([]);
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
		expect(said(row)).toEqual([
			'Die KI hat nur die ersten 3 Seiten gelesen. Prüfen Sie Betrag und Positionen auf den übrigen Seiten.',
			'Prüfen Sie: Rechnungsdatum.'
		]);
	});

	it('nennt ohne KI gleich die Pflichtangaben, die fehlen, und nimmt jede zurück, sobald sie ausgefüllt ist (Persona Helga)', () => {
		const row = withoutKi(newRow(1, pdf, defaults), 'unavailable');
		expect(toDoOf(row)).toEqual([
			'Die KI hat diese Datei nicht gelesen. Füllen Sie die Felder aus.',
			'Wählen Sie eine Kategorie.',
			'Füllen Sie aus: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung.'
		]);
		row.values.amount = '80.00';
		expect(toDoOf(row)).toContain('Füllen Sie aus: Rechnungsdatum, Rechnungssteller, Beschreibung.');
		// what does not count as filled in stays named, as the create button counts it (persona Helga, round 2)
		Object.assign(row.values, { amount: 'abc', billingEntity: '  ', invoiceDate: '2026-03-31', description: 'Hauswartung' });
		expect(toDoOf(row)).toContain('Füllen Sie aus: Betrag, Rechnungssteller.');
	});

	it('lässt die Felder ohne KI leer und sagt, warum, bis die Pflichtfelder ausgefüllt sind (#245, Persona Helga)', () => {
		const row = withoutKi(newRow(1, pdf, defaults), 'unavailable');
		expect(row).toMatchObject({ status: 'check', selected: true });
		expect(row.values.billingEntity).toBe('');
		expect(said(row)).toContain('Die KI hat diese Datei nicht gelesen. Füllen Sie die Felder aus.');
		Object.assign(row.values, { amount: '80.00', billingEntity: 'Elektro Blitz', invoiceDate: '2026-03-31', description: 'Licht' });
		expect(said(row).join(' ')).not.toContain('nicht gelesen');
	});

	// #245 (code review 233-4 C-25): a row whose reading failed names the fields to fill in, as one without KI
	it('nennt bei einer Datei, deren Lesen scheiterte, die Pflichtfelder', () => {
		const row = { ...newRow(1, pdf, defaults), status: 'failed' as const, notes: ['Die Datei wurde nicht gelesen.'] };
		expect(toDoOf(row)).toContain('Füllen Sie aus: Rechnungsdatum, Betrag, Rechnungssteller, Beschreibung.');
	});

	// #245 (Marco of #233): an unticked duplicate asks for nothing; ticked, the to-dos come back
	it('verlangt bei einer schon erfassten Rechnung nichts, solange sie nicht ausgewählt ist', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ deductedAmount: null, categorization: null }));
		expect(row.selected).toBe(false);
		expect(toDoOf(row)).toEqual([]);
		expect(toDoOf({ ...row, selected: true })).toContain('Wählen Sie eine Kategorie.');
	});

	// #245 (Weber P-5, Marco P-3 of #233; product owner: the landlord ticks it himself)
	it('sagt bei einer nicht ausgewählten Gutschrift und gemischten Rechnung, warum', () => {
		const credit = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, documentType: 'credit_note' }));
		expect(selectionHelp(credit)).toBe(
			'Das Häkchen bei «Diese Rechnung erstellen» fehlt, weil aus einer Gutschrift keine Rechnung entsteht. Ist die Datei doch eine Rechnung, setzen Sie es.'
		);
		const mixed = withProposal(newRow(2, pdf, defaults), proposal({ duplicateOf: null, nonAllocableItems: true }));
		expect(selectionHelp(mixed)).toBe(
			'Das Häkchen bei «Diese Rechnung erstellen» fehlt, weil Sie zuerst den Betrag aufteilen müssen. Setzen Sie es danach.'
		);
		expect(selectionHelp({ ...mixed, selected: true })).toBeUndefined();
		// unticked for another reason: several invoices, a duplicate, an Akontorechnung (code review 245 C-1)
		for (const values of [{ invoiceCount: 2 }, { duplicateOf: 'i1' }, { documentType: 'advance_invoice' }])
			expect(selectionHelp(withProposal(newRow(3, pdf, defaults), proposal({ duplicateOf: null, nonAllocableItems: true, ...values })))).toBeUndefined();
	});

	// #245 (Anna P-1 of #233): the result names why a file is still open
	it('nennt als Grund einer offenen Datei ihre erste Aufgabe', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null, deductedAmount: null, categorization: null }));
		expect(openReason(row)).toBe('Wählen Sie eine Kategorie.');
	});
});

// #455 (#268): the key of the building's invoices of the Kategorie, as long as the property manager has not chosen one
describe('Verteilschlüssel einer Datei', () => {
	it('schlägt den Verteilschlüssel der Rechnungen derselben Kategorie vor', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null }));
		expect(proposeKey(row, 'k2').values.distributionKeyId).toBe('k2');
		// none recorded in the Kategorie: the key stays
		expect(proposeKey(row, null).values.distributionKeyId).toBe('k1');
	});

	it('lässt einen Verteilschlüssel, den der Liegenschaftsverwalter selbst gewählt hat', () => {
		const row = withProposal(newRow(1, pdf, defaults), proposal({ duplicateOf: null }));
		const chosen = { ...row, values: { ...row.values, distributionKeyId: 'k3' } };
		expect(proposeKey(chosen, 'k2').values.distributionKeyId).toBe('k3');
		// a key proposed before is no choice of his: the next Kategorie proposes its own
		expect(proposeKey(proposeKey(row, 'k2'), 'k4').values.distributionKeyId).toBe('k4');
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
			llmConfidence: '0.9',
			// what the KI saw on the file, kept with its Beleg (persona Anna)
			beleg: { deductedAmount: '1000.00', nonAllocableItems: false }
		});
	});
});
