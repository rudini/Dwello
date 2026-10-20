import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
// The pages the KI reads: rendering needs a canvas, which jsdom lacks
vi.mock('$lib/file-pages', () => ({
	pagesOf: vi.fn(async () => ({ pages: ['data:image/jpeg;base64,/9j/'], morePages: false }))
}));

import { pagesOf } from '$lib/file-pages';
import InvoiceUploadDialog from '../routes/invoices/InvoiceUploadDialog.svelte';
import { allByTestId, byTestId, click, fakeBff, fireEvent, settle, show } from './helpers/dom';
import { reactiveProps } from './helpers/reactive-props.svelte';
import extraction from '../../tests/contracts/invoice-extraction.json';
import listed from '../../tests/contracts/invoice-list.json';
import unreadable from '../../tests/contracts/invoice-extraction-unreadable.json';

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
		// only files invoices are created from are kept (persona Dr. Weber)
		expect(byTestId('invoice-keep-original')!.textContent).toContain(
			'Dwello speichert die Datei jeder erstellten Rechnung als Beleg. Dateien, aus denen Sie keine Rechnung erstellen, speichert Dwello nicht.'
		);
	});

	it('zählt auf dem Knopf nur Rechnungen, die sich erstellen lassen, und nennt die unvollständigen', async () => {
		open((call) => [200, (call.body as { fileName: string }).fileName === 'werke.pdf' ? { ...read, categorization: null } : read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'), pdf('werke.pdf'));
		expect(byTestId('invoice-upload-create-button')!.textContent?.trim()).toBe('1 Rechnung erstellen (1 unvollständig)');
	});

	it('nennt im Hinweis einer Datei ihren Namen, auch wenn er ohne die Zeile vorgelesen wird (Persona Sven)', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(word);
		expect(byTestId('invoice-upload-row-message')!.textContent).toContain('Hinweise zu notizen.docx');
	});

	it('nennt nach einem Teil-Erfolg die offenen Dateien und behält beim Verwerfen die erstellten Rechnungen (Persona Anna, C-39)', async () => {
		const proposals: Record<string, object> = {
			'werke.pdf': { ...read, categorization: null },
			'gutschrift.pdf': { ...read, documentType: 'credit_note' }
		};
		const answers = (call: { path: string; body: unknown }) =>
			call.path === '/invoices' ? [201, { id: 'i9' }] : [200, proposals[(call.body as { fileName: string }).fileName] ?? read];
		const { oncreated } = open(answers as never);
		chooseBuilding();
		await upload(pdf('blitz.pdf'), pdf('werke.pdf'), pdf('gutschrift.pdf'));
		click('invoice-upload-create-button');
		await settle();
		// open: what was chosen but not created; not a Gutschrift, which is not to be created (C-4)
		// with its reason (#245, Anna P-1 of #233)
		expect(byTestId('invoice-upload-result')!.textContent).toContain('werke.pdf: Wählen Sie eine Kategorie.');
		expect(byTestId('invoice-upload-result')!.textContent).not.toContain('gutschrift.pdf');
		expect(byTestId('invoice-upload-result')!.querySelector('a')!.textContent).toBe('Elektro Blitz AG, 31.03.2026');

		click('dialog-cancel');
		await settle();
		expect(byTestId('invoice-upload-discard-message')!.textContent).toBe(
			'Erstellte Rechnungen bleiben gespeichert. Die übrigen Dateien und Ihre Eingaben gehen verloren.'
		);
		// the created invoices stay: the button discards only the others (#245, Marco P-6 of #233)
		expect(byTestId('invoice-upload-discard-confirm')!.textContent!.trim()).toBe('Übrige Dateien verwerfen');
		click('invoice-upload-discard-confirm');
		await settle();
		expect(oncreated).toHaveBeenCalledWith([{ id: 'i9', name: 'Elektro Blitz AG, 31.03.2026' }]);
	});

	it('bietet erneutes Lesen an, wenn die KI nichts Lesbares antwortet (Fachreview V-14)', async () => {
		open(() => [502, unreadable]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		expect(byTestId('invoice-upload-row-message')!.textContent).toContain(
			'Die KI hat keine lesbare Antwort gegeben. Wählen Sie «Erneut versuchen» oder füllen Sie die Felder aus.'
		);
		expect(byTestId('invoice-upload-row-message')!.textContent).not.toContain('nicht geantwortet');
		expect(byTestId('invoice-upload-row-retry')).not.toBeNull();
	});

	it('beschreibt sich mit seinem ersten Satz, nicht mit dem ganzen Inhalt (Persona Sven)', () => {
		open(() => [200, read]);
		const described = document.getElementById(document.querySelector('[role=dialog]')!.getAttribute('aria-describedby') ?? '');
		expect(described?.textContent).toBe(
			'Wählen Sie das Gebäude und die Dateien Ihrer Rechnungen. Die KI liest die Angaben aus; Sie prüfen sie, bevor Dwello die Rechnungen erstellt.'
		);
	});

	it('sagt nach dem Lesen, was zu tun ist, und meldet jede entfernte Datei, auch die letzte (Persona Sven)', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'), word);
		const status = () => byTestId('invoice-upload-progress')!.textContent?.trim();
		expect(status()).toBe('Fertig: 1 von 1. Bitte prüfen: 1. Nicht möglich: 1.');
		allByTestId('invoice-upload-row-remove')[1].click();
		await settle();
		expect(status()).toBe('notizen.docx entfernt.');
		click('invoice-upload-row-remove');
		await settle();
		expect(status()).toBe('blitz.pdf entfernt.');
	});

	// dieselbe Hilfe wie im Formular «Neue Rechnung» (#254)
	it('erklärt beim Leistungszeitraum Kosten über mehrere Jahre', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('boiler.pdf'));
		click('invoice-upload-row-toggle');
		expect(byTestId('invoice-service-period-help')!.textContent).toContain(
			'Kosten, die nur alle paar Jahre anfallen, verteilen Sie mit dem Leistungszeitraum über diese Jahre.'
		);
	});

	it('liest den Hinweis der KI vor der Hilfe des Feldes vor (Persona Sven)', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-toggle');
		const [first] = byTestId('invoice-date-input')!.getAttribute('aria-describedby')!.split(' ');
		expect(document.getElementById(first)!.textContent).toContain('Die KI ist unsicher');
	});

	it('öffnet die Datei gross in einem neuen Tab, zum Vergleichen mit den Feldern (Personas Helga, Marco)', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-toggle');
		await settle();
		const link = byTestId<HTMLAnchorElement>('invoice-upload-file-link')!;
		expect(link.getAttribute('href')).toMatch(/^blob:/);
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.textContent).toContain('Datei gross anzeigen');
	});

	it('nimmt eine Aufforderung zurück, sobald das Feld ausgefüllt ist (Code-Review C-1)', async () => {
		const fields = { ...read.fields, amount: null };
		open(() => [200, { ...read, categorization: null, fields }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		const message = () => byTestId('invoice-upload-row-message')?.textContent ?? '';
		expect(message()).toContain('Wählen Sie eine Kategorie.');
		expect(message()).toContain('Füllen Sie aus: Betrag.');
		click('invoice-upload-row-toggle');
		fireEvent(byTestId<HTMLSelectElement>('invoice-category-select')!, 'change', 'c1');
		fireEvent(byTestId<HTMLInputElement>('invoice-amount-input')!, 'input', '80.00');
		await settle();
		expect(message()).not.toContain('Wählen Sie eine Kategorie.');
		expect(message()).not.toContain('Füllen Sie aus');
		expect(message()).toContain('Prüfen Sie: Rechnungsdatum.');
	});

	it('sagt die fehlende Kategorie nach dem Erstellen nur einmal (Code-Review C-3)', async () => {
		open(() => [200, { ...read, categorization: null, duplicateOf: null }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-create-button');
		await settle();
		expect(byTestId('invoice-upload-row-message')!.textContent!.split('Wählen Sie eine Kategorie.').length).toBe(2);
	});

	// chosen after creating, the Kategorie is no longer asked for (#245, persona Helga P-1)
	it('nimmt die fehlende Kategorie zurück, sobald sie nach dem Erstellen gewählt ist', async () => {
		open(() => [200, { ...read, categorization: null, duplicateOf: null }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-create-button');
		await settle();
		fireEvent(byTestId<HTMLSelectElement>('invoice-category-select')!, 'change', 'c1');
		await settle();
		expect(byTestId('invoice-upload-row-message')?.textContent ?? '').not.toContain('Wählen Sie eine Kategorie.');
	});

	it('zeigt eine Datei gross nur als das, was ihre ersten Bytes sagen, nie als Webseite (Code-Review C-7)', async () => {
		const made = vi.spyOn(URL, 'createObjectURL');
		open(() => [200, read]);
		chooseBuilding();
		await upload(new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 1])], 'rechnung.html', { type: 'text/html' }));
		click('invoice-upload-row-toggle');
		await settle();
		expect((made.mock.calls.at(-1)![0] as Blob).type).toBe('application/pdf');
		made.mockRestore();
	});

	it('beginnt nach dem Schliessen wieder ohne alte Meldung (Code-Review C-9)', async () => {
		fakeBff(() => [200, read]);
		const props = reactiveProps({
			open: true,
			buildings,
			categories: categories as never,
			distributionKeys: [{ id: 'k1', name: 'Nach Fläche' }],
			defaultDistributionKeyId: 'k1',
			oncreated: vi.fn()
		});
		show(InvoiceUploadDialog, props);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-remove');
		await settle();
		click('dialog-cancel');
		await settle();
		props.open = true;
		await settle();
		expect(byTestId('invoice-upload-progress')!.textContent).toBe('');
	});

	it('zeigt den Link auf die grosse Datei erst, wenn die Datei bereit ist (Code-Review C-12)', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-toggle');
		expect(byTestId('invoice-upload-file-link')).toBeNull();
		await settle();
		expect(byTestId('invoice-upload-file-link')!.getAttribute('href')).toMatch(/^blob:/);
	});

	it('nennt beim Link auf die grosse Datei, welche Datei er öffnet (Code-Review C-10)', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-toggle');
		await settle();
		const describedby = byTestId('invoice-upload-file-link')!.getAttribute('aria-describedby') ?? '';
		expect(document.getElementById(describedby)?.textContent).toBe('blitz.pdf');
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
		expect(oncreated).toHaveBeenCalledWith([{ id: 'i9', name: 'Elektro Blitz AG, 31.03.2026' }]);
	});

	it('markiert unsichere und nicht gefundene Werte mit Text, den der Screenreader beim Feld ansagt', async () => {
		const fields = { ...extraction.fields, dueDate: null };
		open(() => [200, { ...read, fields, unsure: ['invoiceNumber', 'invoiceDate'] }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-toggle');

		for (const [testid, field, text] of [
			['invoice-upload-unsure-invoiceNumber', 'invoice-upload-invoice-number-input', 'Die KI ist unsicher'],
			['invoice-upload-unsure-invoiceDate', 'invoice-date-input', 'Die KI ist unsicher'],
			['invoice-upload-missing-dueDate', 'invoice-upload-due-date-input', 'Die KI hat diesen Wert nicht gefunden']
		]) {
			const hint = byTestId(testid)!;
			expect(hint.textContent).toContain(text);
			expect(byTestId(field)!.getAttribute('aria-describedby')).toContain(hint.id);
		}
	});

	// two files of one name, both still open, are both named (code review 245 C-2)
	it('nennt zwei offene Dateien mit demselben Namen beide', async () => {
		const answers = (call: { path: string; body: unknown }) =>
			call.path === '/invoices'
				? [201, { id: 'i9' }]
				: [200, (call.body as { fileName: string }).fileName === 'scan.pdf' ? { ...read, categorization: null } : read];
		open(answers as never);
		chooseBuilding();
		await upload(pdf('blitz.pdf'), pdf('scan.pdf'), pdf('scan.pdf'));
		click('invoice-upload-create-button');
		await settle();
		const items = [...byTestId('invoice-upload-result')!.querySelectorAll('li')].map((li) => li.textContent);
		expect(items.filter((text) => text?.startsWith('scan.pdf:'))).toHaveLength(2);
	});

	// #245 (Helga P-4 of #233): a value not found in an optional field is no warning, only a hint
	it('zeigt «nicht gefunden» unter einem freiwilligen Feld als Hinweis, nicht als Warnung', async () => {
		open(() => [200, { ...read, fields: { ...extraction.fields, dueDate: null } }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-toggle');
		const missing = byTestId('invoice-upload-missing-dueDate')!;
		expect(missing.className).toContain('text-ink-muted');
		expect(missing.className).not.toContain('font-semibold');
		expect(byTestId('invoice-upload-unsure-invoiceDate')!.className).toContain('text-caution');
	});

	// #245 (domain review 233 V-10): the summary does not borrow the row's button-like status
	it('nennt eine Datei, deren Lesen scheiterte, in der Zusammenfassung «Nicht gelesen»', async () => {
		open(() => [500, {}]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		expect(byTestId('invoice-upload-progress')!.textContent!.trim()).toBe('Fertig: 1 von 1. Nicht gelesen: 1.');
	});

	// #245 (Weber P-5 of #217 round 2, Marco P-3): an unticked row says why, at its checkbox
	it('sagt bei einer nicht ausgewählten Gutschrift an ihrem Häkchen, warum', async () => {
		open(() => [200, { ...read, documentType: 'credit_note' }]);
		chooseBuilding();
		await upload(pdf('gutschrift.pdf'));
		expect(byTestId('invoice-upload-row-select-help')!.textContent).toContain('fehlt, weil aus einer Gutschrift keine Rechnung entsteht');
		click('invoice-upload-row-select');
		expect(byTestId('invoice-upload-row-select-help')).toBeNull();
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
		expect(rowText()[0]).toContain('Die KI hat diese Datei nicht gelesen. Füllen Sie die Felder aus.');

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

	// #455 (#268): the short line names both amounts; the rule follows as help, after what is to do
	it('nennt abgezogene Akontorechnungen nach den Aufgaben, mit der Regel als Hilfetext darunter', async () => {
		open(() => [200, { ...read, deductedAmount: '1000.00', categorization: null }]);
		chooseBuilding();
		await upload(pdf('werke.pdf'));
		const message = byTestId('invoice-upload-row-message')!.textContent!.replace(/\s+/g, ' ');
		const line = 'Auf der Rechnung sind Akontorechnungen von CHF\u00a01’000.00 abgezogen. Als Betrag ist das Total vor dem Abzug vorgeschlagen: CHF\u00a01’250.00.'.replace(/\s+/g, ' ');
		expect(message.indexOf('Wählen Sie eine Kategorie.')).toBeGreaterThan(-1);
		expect(message.indexOf(line)).toBeGreaterThan(message.indexOf('Wählen Sie eine Kategorie.'));
		expect(byTestId('invoice-upload-deducted-rule')!.textContent).toBe(
			'Haben Sie die Akontorechnungen schon erfasst, löschen Sie sie auf ihrer Seite mit «Rechnung löschen», auch wenn sie schon abgerechnet sind. Sind ihre Dateien hier ausgewählt, entfernen Sie diese mit «Datei entfernen». Sonst zählen sie doppelt. Übernehmen Sie den Leistungszeitraum der Rechnung. War eine Akontorechnung schon abgerechnet, führen Sie danach die Abrechnungen mit ihr nach: Entwürfe mit «Neu berechnen», versendete oder bezahlte mit «Abrechnung berichtigen». So trägt jede Abrechnungsperiode ihre tatsächlichen Kosten.'
		);
	});

	// #455 (#268): the browser's own file button speaks the browser's language
	it('bietet die Dateien mit einem eigenen Knopf in der Sprache der Oberfläche an', () => {
		open(() => [200, read]);
		const input = byTestId<HTMLInputElement>('invoice-upload-file-input')!;
		const choose = byTestId('invoice-upload-file-choose')!;
		expect(choose.textContent!.trim()).toBe('Dateien auswählen');
		expect(choose.closest('label')!.htmlFor).toBe(input.id);
		expect(input.classList).toContain('sr-only');
		// what the button shows is in the field's name, for speech control (WCAG 2.5.3, code review 455 C-4)
		expect(choose.closest('[aria-hidden]')).toBeNull();
	});

	// #455 (#268): Escape closes the open list of a select, not the dialog
	it('fragt bei Escape in der Kategorie nicht, ob das Hochladen abgebrochen werden soll', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-toggle');
		byTestId('invoice-category-select')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await settle();
		expect(byTestId('invoice-upload-discard-message')).toBeNull();
		expect(byTestId('invoice-upload-row')).not.toBeNull();
	});

	// #455 (#268): the building's invoices of the Kategorie are distributed by another key than the default one
	it('schlägt den Verteilschlüssel der Rechnungen derselben Kategorie im Gebäude vor', async () => {
		const calls = fakeBff((call) =>
			call.path.startsWith('/invoices?')
				? [200, { ...listed, invoices: [{ ...listed.invoices[0], distributionKeyId: null }, { ...listed.invoices[0], distributionKeyId: 'k2' }] }]
				: [200, read]
		);
		show(InvoiceUploadDialog, {
			open: true,
			buildings,
			categories: categories as never,
			distributionKeys: [
				{ id: 'k1', name: 'Nach Fläche' },
				{ id: 'k2', name: 'Pro Wohnung' }
			],
			defaultDistributionKeyId: 'k1',
			oncreated: vi.fn()
		});
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		await settle();
		// the newest one without a key does not hide the key of the one before (domain review 455 V-15)
		expect(calls.map((call) => call.path)).toContain('/invoices?buildingId=b1&categoryId=c1&limit=20');
		click('invoice-upload-row-toggle');
		expect(byTestId<HTMLSelectElement>('invoice-distribution-key-select')!.value).toBe('k2');
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

	it('nimmt auch bei zwei schnellen Auswahlen höchstens 20 Dateien', async () => {
		open(() => [200, read]);
		chooseBuilding();
		const input = byTestId<HTMLInputElement>('invoice-upload-file-input')!;
		for (const offset of [0, 15]) {
			Object.defineProperty(input, 'files', { value: Array.from({ length: 15 }, (_, i) => pdf(`r${offset + i}.pdf`)), configurable: true });
			input.dispatchEvent(new Event('change', { bubbles: true }));
		}
		for (let i = 0; i < 15; i++) await settle();
		expect(allByTestId('invoice-upload-row')).toHaveLength(20);
	});

	it('meldet nichts als erstellt, wenn abgebrochen wird', async () => {
		const { oncreated } = open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('dialog-cancel');
		click('invoice-upload-discard-confirm');
		expect(oncreated).not.toHaveBeenCalled();
	});

	it('zeigt das Ergebnis und gibt ihm den Fokus, wenn Dateien im Dialog bleiben', async () => {
		open((call) => (call.path === '/invoices' ? [201, { id: 'i9' }] : [200, read]));
		chooseBuilding();
		await upload(pdf('blitz.pdf'), word);
		click('invoice-upload-create-button');
		await settle();
		expect(document.activeElement).toBe(byTestId('invoice-upload-result'));
		expect(byTestId('invoice-upload-result')!.textContent).toContain('1 Rechnung erstellt');
	});

	it('sagt an, wie viele Dateien gelesen sind', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('a.pdf'), pdf('b.pdf'));
		const status = byTestId('invoice-upload-progress')!;
		expect(status.getAttribute('role')).toBe('status');
		expect(status.textContent).toContain('Fertig: 2 von 2');
	});

	it('gibt nach dem Entfernen einer Datei den Fokus der Dateiauswahl', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-row-remove');
		await settle();
		expect(document.activeElement).toBe(byTestId('invoice-upload-file-input'));
	});

	it('erklärt, warum das Gebäude gesperrt ist, sobald Dateien da sind', async () => {
		open(() => [200, read]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		expect(byTestId<HTMLSelectElement>('invoice-upload-building-select')!.disabled).toBe(true);
		expect(document.body.textContent).toContain('Das Gebäude gilt für alle Dateien.');
	});

	it('nennt bei jedem Knopf einer Zeile ihre Datei und ihren Stand', async () => {
		open(() => [200, { ...read, invoiceCount: 1 }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		const described = (testid: string) =>
			byTestId(testid)!.getAttribute('aria-describedby')!.split(' ').map((id) => document.getElementById(id)?.textContent?.trim());
		for (const testid of ['invoice-upload-row-toggle', 'invoice-upload-row-remove'])
			expect(described(testid)).toEqual(['blitz.pdf', 'Bitte prüfen']);
		expect(byTestId('invoice-upload-row-toggle')!.getAttribute('aria-expanded')).toBe('false');
		click('invoice-upload-row-toggle');
		expect(byTestId('invoice-upload-row-toggle')!.getAttribute('aria-expanded')).toBe('true');
	});

	it('bietet bei einer Datei mit mehreren Rechnungen keine Angaben zum Prüfen an', async () => {
		open(() => [200, { ...read, invoiceCount: 2 }]);
		chooseBuilding();
		await upload(pdf('sammel.pdf'));
		expect(byTestId('invoice-upload-row-toggle')).toBeNull();
	});

	it('verlinkt eine schon erfasste Rechnung im selben Tab', async () => {
		open(() => [200, { ...read, duplicateOf: 'i1' }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		const link = byTestId('invoice-upload-row-message')!.querySelector('a')!;
		expect(link.getAttribute('href')).toBe('/invoices/i1');
		expect(link.hasAttribute('target')).toBe(false);
	});

	it('gibt nach dem Erstellen dem ersten Feld, das noch fehlt, den Fokus, wenn nichts erstellt wurde', async () => {
		open(() => [503, { error: 'x', code: 'EXTRACTION_UNAVAILABLE', params: {} }]);
		chooseBuilding();
		await upload(pdf('blitz.pdf'));
		click('invoice-upload-create-button');
		await settle();
		expect(document.activeElement?.getAttribute('aria-invalid')).toBe('true');
	});
});

