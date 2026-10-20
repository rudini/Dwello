import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { validateInvoice } from '$lib/invoice';
import { loadDocuments } from '$lib/server/documents';
import { load as listLoad } from '../routes/invoices/+page.server';
import { load as detailLoad } from '../routes/invoices/[id]/+page.server';
import { load as editLoad } from '../routes/invoices/[id]/edit/+page.server';
import { load as newLoad } from '../routes/invoices/new/+page.server';
import backendInvoice from '../../tests/contracts/invoice.json';

afterEach(() => overwriteGetLocale(() => baseLocale));

const API = 'http://localhost:3001/api/v1';

const caretaker = {
	id: 'c1',
	name: 'Caretaker',
	nameDE: 'Hauswart',
	nameFR: 'Concierge',
	nameIT: 'Custode',
	nameEN: 'Caretaker',
	isAllowedUtilityCost: true
};
const perArea = {
	id: 'k1',
	name: 'Per Area (m²)',
	nameDE: 'Pro Fläche (m²)',
	nameFR: 'Par surface (m²)',
	nameIT: 'Per superficie (m²)',
	nameEN: 'Per area (m²)',
	type: 'predefined',
	formula: '{area}'
};

// Fake backend: answers each path (without query) with its JSON
const backend = (answers: Record<string, unknown>) =>
	(async (url: string) =>
		Response.json(
			answers[url.replace(API, '').split('?')[0]] ?? {}
		)) as unknown as typeof globalThis.fetch;

const answers = {
	'/invoices': { invoices: [backendInvoice], total: 1 },
	'/invoices/i1': backendInvoice,
	'/categories': { categories: [caretaker] },
	'/distribution-keys': { data: [perArea] }
};

describe('Rechnungen in der gewählten Sprache', () => {
	it('meldet fehlende Angaben auf Französisch', () => {
		overwriteGetLocale(() => 'fr');
		const errors = validateInvoice({
			buildingId: '',
			invoiceDate: '',
			billingEntity: '',
			description: '',
			amount: '',
			servicePeriodStart: '2026-01-01'
		});
		expect(errors.buildingId).toBe('Veuillez choisir un immeuble.');
		expect(errors.servicePeriodEnd).toBe(
			'Veuillez saisir aussi la fin de la période de prestation.'
		);
	});

	it('nennt die Kategorien in der Liste und im Filter auf Französisch', async () => {
		overwriteGetLocale(() => 'fr');
		const data = (await listLoad({
			url: new URL('http://localhost/invoices'),
			fetch: backend(answers)
		} as never)) as { invoices: { category: { name: string } }[]; categories: { name: string }[] };

		expect(data.invoices[0].category.name).toBe('Concierge');
		expect(data.categories.map((c) => c.name)).toEqual(['Concierge']);
	});

	it('nennt Kategorie und Verteilschlüssel einer Rechnung auf Italienisch', async () => {
		overwriteGetLocale(() => 'it');
		const { invoice } = (await detailLoad({
			params: { id: 'i1' },
			fetch: backend(answers)
		} as never)) as { invoice: { category: { name: string }; distributionKey: { name: string } } };

		expect(invoice.category.name).toBe('Custode');
		expect(invoice.distributionKey.name).toBe('Per superficie (m²)');
	});

	it('bietet beim Erfassen und Bearbeiten Kategorien und Verteilschlüssel auf Englisch an', async () => {
		overwriteGetLocale(() => 'en');
		for (const load of [newLoad, editLoad]) {
			const data = (await load({
				params: { id: 'i1' },
				url: new URL('http://localhost/invoices/new'),
				fetch: backend(answers)
			} as never)) as {
				categories: { name: string }[];
				distributionKeys: { name: string }[];
			};
			expect(data.categories.map((c) => c.name)).toEqual(['Caretaker']);
			expect(data.distributionKeys.map((k) => k.name)).toEqual(['Per area (m²)']);
		}
	});

	it('nennt die ursprüngliche Kategorie der KI beim Bearbeiten auf Französisch', async () => {
		overwriteGetLocale(() => 'fr');
		const data = (await editLoad({
			params: { id: 'i1' },
			url: new URL('http://localhost/invoices/i1/edit'),
			fetch: backend(answers)
		} as never)) as {
			invoice: { llmCategory: { name: string } };
		};
		expect(data.invoice.llmCategory.name).toBe('Concierge');
	});
});

describe('Dokumente in der gewählten Sprache', () => {
	const reminder = (reminderLevel: number) => ({
		id: `d${reminderLevel}`,
		type: 'reminder',
		reminderLevel,
		title: reminderLevel === 1 ? 'Zahlungserinnerung' : `${reminderLevel}. Mahnung`
	});

	it('benennt Zahlungserinnerung und Mahnungen in der Sprache der Oberfläche', async () => {
		overwriteGetLocale(() => 'fr');
		const fetch = (async () =>
			Response.json({
				data: [reminder(1), reminder(2), reminder(3)]
			})) as unknown as typeof globalThis.fetch;

		const documents = await loadDocuments(fetch);

		expect(documents.map((d) => d.title)).toEqual(['Rappel de paiement', '2e rappel', '3e rappel']);
	});

	it('behält auf Deutsch den gespeicherten Titel', async () => {
		const fetch = (async () =>
			Response.json({ data: [reminder(2)] })) as unknown as typeof globalThis.fetch;
		expect((await loadDocuments(fetch))[0].title).toBe('2. Mahnung');
	});
});
