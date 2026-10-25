import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { languageLabels } from '$lib/tenant';
import { parseTenantForm } from '$lib/server/tenant-form';
import { refusedFields } from '$lib/backend-error';
import { checkDateRangeOverlap, computeAvailability } from '$lib/utils/contract-availability';
import { load as tenantsLoad } from '../routes/tenants/+page.server';

afterEach(() => overwriteGetLocale(() => baseLocale));

describe('Wohnungen und Mieter in der gewählten Sprache', () => {
	it('nennt die Sprache des Mieters auf Französisch und speichert den Code', () => {
		overwriteGetLocale(() => 'fr');
		expect(languageLabels.it).toBe('Italien');
		const form = new FormData();
		form.set('language', 'it');
		expect(parseTenantForm(form).tenant.language).toBe('it');
	});

	it('meldet fehlende Angaben im Mieterformular auf Italienisch', () => {
		overwriteGetLocale(() => 'it');
		const errors = refusedFields({
			causes: [
				{ code: 'TENANT_FIRST_NAME_REQUIRED', params: { field: 'firstName' } },
				{ code: 'TENANT_ADDRESS_LETTER', params: { field: 'address' } }
			]
		});
		expect(errors.firstName).toBe('Il nome è obbligatorio.');
		expect(errors.address).toBe('Per le lettere è obbligatorio un indirizzo.');
	});

	it('nennt Überschneidung und Verfügbarkeit auf Englisch', () => {
		overwriteGetLocale(() => 'en');
		const contracts = [{ id: 'c1', start_date: '2024-01-01' }];
		expect(checkDateRangeOverlap('2025-01-01', null, contracts).message).toBe(
			'Overlap with an existing contract: from 01.01.2024 (open-ended)'
		);
		expect(computeAvailability({}).message).toBe('Apartment available');
	});

	it('nennt die Wohnung eines Mieters in der Liste auf Französisch', async () => {
		overwriteGetLocale(() => 'fr');
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('/tenants')
					? { tenants: [{ id: 't1', currentApartment: '3.01' }], total: 1 }
					: { contracts: [] }
			)) as typeof globalThis.fetch;
		const data = await tenantsLoad({ url: new URL('http://x/tenants'), fetch } as never);
		expect(data!.tenants[0].currentApartment).toBe('Appartement 3.01');
	});
});

describe('Zimmer in der Mehrzahl der gewählten Sprache', () => {
	it('sagt auf Französisch «1.5 pièce» und «3 pièces», auf Englisch «1 room»', async () => {
		const { roomsLabel } = await import('$lib/apartment');
		overwriteGetLocale(() => 'fr');
		expect([roomsLabel('1.5'), roomsLabel('3')]).toEqual(['1.5 pièce', '3 pièces']);
		overwriteGetLocale(() => 'en');
		expect([roomsLabel('1'), roomsLabel('1.5')]).toEqual(['1 room', '1.5 rooms']);
		overwriteGetLocale(() => 'de');
		expect(roomsLabel('1')).toBe('1 Zimmer');
	});
});
