import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
// The pages the KI reads: rendering needs a canvas, which jsdom lacks
vi.mock('$lib/file-pages', () => ({ pagesOf: vi.fn(async () => ['data:image/jpeg;base64,/9j/']) }));

import { pagesOf } from '$lib/file-pages';
import InvoiceUploadDialog from '../routes/invoices/InvoiceUploadDialog.svelte';
import { allByTestId, byTestId, click, fakeBff, fireEvent, settle, show } from './helpers/dom';
import extraction from '../../tests/contracts/invoice-extraction.json';

// jsdom's Blob lacks arrayBuffer(), which the browser has and the check of a file's first bytes uses
Blob.prototype.arrayBuffer ??= function (this: Blob) {
	return new Promise<ArrayBuffer>((resolve) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer);
		reader.readAsArrayBuffer(this);
	});
};

const buildings = [
	{ id: 'b1', name: 'Seeblick', address: 'Seeweg 1' },
	{ id: 'b2', name: 'Lindenhof', address: 'Lindenweg 2' }
];
const categories = [{ id: 'c1', name: 'Allgemeinstrom', isAllowedUtilityCost: true }];
const pdf = (name: string) => new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 1])], name);
const word = new File([new Uint8Array([0x50, 0x4b, 3, 4])], 'notizen.docx');
const read = { ...extraction, duplicateOf: null, deductedAmount: null };

function open(answer: Parameters<typeof fakeBff>[0]) {
	const calls = fakeBff(answer);
	const oncreated = vi.fn();
	show(InvoiceUploadDialog, {
		open: true,
		buildings,
		categories: categories as never,
		distributionKeys: [{ id: 'k1', name: 'Nach Fläche' }],
		defaultDistributionKeyId: 'k1',
		oncreated
	});
	return { calls, oncreated };
}

async function upload(...files: File[]) {
	const input = byTestId<HTMLInputElement>('invoice-upload-file-input')!;
	Object.defineProperty(input, 'files', { value: files, configurable: true });
	input.dispatchEvent(new Event('change', { bubbles: true }));
	await settle();
	await settle();
}

const chooseBuilding = () =>
	fireEvent(byTestId<HTMLSelectElement>('invoice-upload-building-select')!, 'change', 'b1');
const rowText = () => allByTestId('invoice-upload-row').map((row) => row.textContent?.replace(/\s+/g, ' '));

describe('Rechnungen hochladen', () => {
	it('nimmt Dateien erst, wenn das Gebäude gewählt ist, und erinnert an die Originalrechnung', () => {
		open(() => [200, read]);
		expect(byTestId<HTMLInputElement>('invoice-upload-file-input')!.disabled).toBe(true);
		chooseBuilding();
		expect(byTestId<HTMLInputElement>('invoice-upload-file-input')!.disabled).toBe(false);
		expect(byTestId('invoice-keep-original')!.textContent).toContain('Bewahren Sie die Originalrechnung auf');
	});

	it('liest jede Datei sofort aus und erstellt die gewählten Rechnungen mit ihrem Beleg', async () => {
		const { calls, oncreated } = open((call) => (call.path === '/invoices' ? [201, { id: 'i9' }] : [200, read]));
		chooseBuilding();
		await upload(pdf('blitz.pdf'));

		expect(calls[0]).toMatchObject({
			method: 'POST',
			path: '/invoices/extract',
			body: { buildingId: 'b1', fileName: 'blitz.pdf', pages: ['data:image/jpeg;base64,/9j/'] }
		});
		expect(byTestId('invoice-upload-create-button')!.textContent).toContain('1 Rechnung erstellen');
		click('invoice-upload-row-toggle');
		expect(byTestId<HTMLInputElement>('invoice-amount-input')!.value).toBe('1250.00');
		expect(byTestId('invoice-upload-unsure-invoiceDate')!.textContent).toContain('Die KI ist unsicher');

		click('invoice-upload-create-button');
		await settle();
		const sent = calls.find((call) => call.path === '/invoices')!.body as FormData;
		expect(JSON.parse(String(sent.get('invoice')))).toMatchObject({ buildingId: 'b1', categoryId: 'c1', amount: '1250.00' });
		expect((sent.get('file') as File).name).toBe('blitz.pdf');
		expect(oncreated).toHaveBeenCalledWith([{ id: 'i9', name: 'Elektro Blitz AG' }]);
	});

	it('lehnt eine Datei ab, die weder PDF noch Bild ist, ohne sie der KI zu zeigen', async () => {
		const { calls } = open(() => [200, read]);
		chooseBuilding();
		await upload(word);
		expect(rowText()[0]).toContain('Dwello nimmt nur PDF-, JPG- und PNG-Dateien an.');
		expect(calls).toEqual([]);
	});

	it('lässt die Felder ausfüllen, wenn die KI nicht verfügbar ist, und verlangt eine Kategorie', async () => {
		const { calls } = open(() => [503, { error: 'x', code: 'EXTRACTION_UNAVAILABLE', params: {} }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		expect(rowText()[0]).toContain('Die KI ist nicht verfügbar. Bitte füllen Sie die Felder aus.');

		click('invoice-upload-create-button');
		await settle();
		expect(rowText()[0]).toContain('Wählen Sie eine Kategorie.');
		expect(calls.filter((call) => call.path === '/invoices')).toEqual([]);
	});

	it('bietet erneutes Auslesen an, wenn Dwello nicht geantwortet hat', async () => {
		let answer: [number, unknown] = [500, {}];
		open(() => answer);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		expect(rowText()[0]).toContain('Die Datei wurde nicht gelesen, weil Dwello nicht geantwortet hat.');
		answer = [200, read];
		click('invoice-upload-row-retry');
		await settle();
		expect(rowText()[0]).not.toContain('nicht gelesen');
	});

	it('lässt eine Datei, die Dwello nicht öffnen kann, von Hand ausfüllen', async () => {
		vi.mocked(pagesOf).mockRejectedValueOnce(new Error('kaputt'));
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('kaputt.pdf'));
		expect(rowText()[0]).toContain('Dwello kann diese Datei nicht öffnen.');
	});

	it('nimmt höchstens 20 Dateien und sagt es', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(...Array.from({ length: 21 }, (_, i) => pdf(`r${i}.pdf`)));
		for (let i = 0; i < 10; i++) await settle(); // each file is checked in turn
		expect(allByTestId('invoice-upload-row')).toHaveLength(20);
		expect(document.body.textContent).toContain('Sie können höchstens 20 Dateien auf einmal hochladen.');
	});

	it('fragt vor dem Abbrechen, dass die Dateien verloren gehen', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('dialog-cancel');
		expect(byTestId('invoice-upload-discard-message')!.textContent).toBe(
			'Hochgeladene Dateien und Ihre Eingaben gehen verloren.'
		);
		click('invoice-upload-discard-confirm');
		expect(byTestId('invoice-upload-row')).toBeNull();
	});

	it('behält eine Rechnung mit ihrem Grund, wenn das Erstellen scheitert', async () => {
		open((call) => (call.path === '/invoices' ? [500, {}] : [200, read]));
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-create-button');
		await settle();
		expect(rowText()[0]).toContain('Die Rechnung wurde nicht erstellt, weil Dwello nicht geantwortet hat.');
	});
});
