/**
 * Which seeded categories are umlagefähig (Art. 257a–257b OR, Art. 4–6 VMWG), checked through the statement:
 * one invoice per category, marked umlagefähig, and the Nebenkostenabrechnung shows exactly the allowed ones.
 * The expected values are written out here from the domain review of #176, not read from the seed,
 * so a seed that flips a category fails.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { sendJson } from './helpers/auth';

// English key of each seeded category and whether its costs may be passed on to the tenant
const ALLOWED_BY_LAW: Record<string, boolean> = {
	Heating: true,
	'Hot Water': true,
	'Cold Water': true,
	Wastewater: true,
	'Electricity Common Areas': true,
	Elevator: true,
	Caretaker: true,
	'Garden Maintenance': true,
	'Snow Removal': true,
	'Waste Disposal': true,
	'TV/Cable': true,
	// Preserves the building, not linked to its use (leaflet of the Mieterverband, decided in #176)
	'Pest Control': false,
	// Needed even when the building is empty, so not linked to its use (Art. 257a Abs. 1 OR, decided in #176)
	'Fire Extinguisher Maintenance': false,
	'Chimney Sweep': true,
	Repairs: false,
	'Building Insurance': false,
	'Property Tax': false,
	'Mortgage Interest': false,
	Administration: false,
	Renovation: false,
	'Capital Improvements': false
};

const token = crypto.randomUUID();
const created: string[] = [];
let contractId = '';
let buildingId = '';
let seeded: { id: string; name: string; isAllowedUtilityCost: boolean; type: string }[] = [];

async function create(resource: string, body: object, post = resource) {
	const response = await sendJson('POST', `/api/v1/${post}`, body);
	const record = (await response.json()) as { id: string; error?: string };
	expect({ resource, status: response.status, error: record.error }).toEqual({ resource, status: 201, error: undefined });
	created.push(`${resource}/${record.id}`);
	return record.id;
}

beforeAll(async () => {
	seeded = (
		(await (await sendJson('GET', '/api/v1/categories')).json()) as { categories: typeof seeded }
	)
		// Tests running at the same time add their own, with a UUID in the name
		.categories.filter((c) => c.type === 'predefined' && !/[0-9a-f]{8}-[0-9a-f]{4}-/.test(c.name));
	buildingId = await create('buildings', {
		name: `Umlagehof ${token}`,
		address: 'Gesetzesweg 1',
		postalCode: '8400',
		city: 'Winterthur',
		canton: 'ZH'
	});
	const apartmentId = await create('apartments', { buildingId, number: '1.01', floor: 1, area: '70', rooms: '3.5' });
	const tenantId = await create('tenants', { firstName: 'Ursula', lastName: `Umlage ${token}` });
	contractId = await create('contracts', {
		apartmentId,
		tenantId,
		startDate: '2023-01-01',
		baseRent: '1500',
		monthlyAdvancePayment: '200'
	});
	for (const category of seeded) {
		await create(
			'invoices',
			{
				buildingId,
				categoryId: category.id,
				billingEntityName: 'Muster AG',
				description: category.name,
				amount: '100.00',
				invoiceDate: '2024-06-30',
				// The form's choice; a category that is not umlagefähig overrules it
				isValidUtilityCost: true
			},
			'invoices?skipLlm=true'
		);
	}
});

afterAll(async () => {
	for (const path of created.reverse()) await sendJson('DELETE', `/api/v1/${path}`);
});

describe('Umlagefähigkeit der vordefinierten Kategorien', () => {
	it('stuft jede vordefinierte Kategorie nach Art. 257a–257b OR ein', () => {
		expect(Object.fromEntries(seeded.map((c) => [c.name, c.isAllowedUtilityCost]))).toEqual(ALLOWED_BY_LAW);
	});

	it('rechnet genau die Rechnungen der umlagefähigen Kategorien ab', async () => {
		const id = await create(
			'statements',
			{ contractId, buildingId, periodStart: '2024-01-01', periodEnd: '2024-12-31', managementFeePercent: 3 },
			'statements/generate'
		);
		const { lineItems } = (await (await sendJson('GET', `/api/v1/statements/${id}`)).json()) as {
			lineItems: { description: string }[];
		};
		const allowed = Object.keys(ALLOWED_BY_LAW).filter((name) => ALLOWED_BY_LAW[name]);
		expect(lineItems.map((l) => l.description).sort()).toEqual(allowed.sort());
	});
});
