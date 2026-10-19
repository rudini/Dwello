/**
 * #199, #408 point 2: one Abrechnungsperiode per day and building. The example of the domain review
 * (https://github.com/rudini/Dwello/issues/408#issuecomment-6249569443, «Punkt 2»): one apartment, Eva 01.01.–31.03.2024,
 * Marc from 01.05.2024; the setting changes from July–June to the calendar year after the period 2023/24.
 * - CHF 600, 15.03.2024, period 01.07.2023–30.06.2024 (366 days): Eva 91/366 = 149.18, Marc 61/366 = 100.00
 * - CHF 1'000, 15.11.2024: only in the short period 01.07.–31.12.2024, Marc 184/184 = 1'000.00
 * A run for 2024 would take the CHF 1'000 again at 91/366 for Eva: 1'248.63 for 1'000. It is refused.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { sendJson } from './helpers/auth';

const token = crypto.randomUUID();
const created: string[] = [];
let buildingId: string;
const contracts = { eva: '', marc: '' };

async function create(resource: string, body: object, post = resource) {
	const response = await sendJson('POST', `/api/v1/${post}`, body);
	const record = (await response.json()) as { id: string; error?: string };
	expect({ resource, status: response.status, error: record.error }).toEqual({ resource, status: 201, error: undefined });
	created.push(`${resource}/${record.id}${resource === 'contracts' ? '?confirmMistake=true' : ''}`);
	return record.id;
}

const get = async <T>(path: string) => (await (await sendJson('GET', `/api/v1/${path}`)).json()) as T;

const run = (contractId: string, periodStart: string, periodEnd: string) =>
	sendJson('POST', '/api/v1/statements/generate', { contractId, buildingId, periodStart, periodEnd, managementFeePercent: 0 });

/** The tenant's share of each invoice line of the stored statement */
async function generate(contractId: string, periodStart: string, periodEnd: string) {
	const response = await run(contractId, periodStart, periodEnd);
	const { id } = (await response.json()) as { id: string };
	expect(response.status).toBe(201);
	created.push(`statements/${id}`);
	const stored = await get<{ lineItems: { totalAmount: string; tenantShare: string }[] }>(`statements/${id}`);
	return stored.lineItems.map((line) => [line.totalAmount, line.tenantShare]);
}

beforeAll(async () => {
	buildingId = await create('buildings', { name: `Lindenhof ${token}`, address: 'Lindenweg 3', postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
	const apartmentId = await create('apartments', { buildingId, number: '3.01', floor: 3, area: '70', rooms: '3.5' });
	const rent = async (firstName: string, startDate: string, endDate?: string) =>
		create('contracts', {
			apartmentId,
			tenantId: await create('tenants', { firstName, lastName: `Lindenhof ${token}` }),
			startDate,
			endDate,
			baseRent: '950',
			monthlyAdvancePayment: '100'
		});
	contracts.eva = await rent('Eva', '2024-01-01', '2024-03-31');
	contracts.marc = await rent('Marc', '2024-05-01');

	const { categories } = await get<{ categories: { id: string; name: string }[] }>('categories');
	const { data: keys } = await get<{ data: { id: string; name: string }[] }>('distribution-keys');
	const invoice = (amount: string, invoiceDate: string) =>
		create(
			'invoices',
			{
				buildingId,
				categoryId: categories.find((c) => c.name === 'Caretaker')!.id,
				distributionKeyId: keys.find((k) => k.name === 'Per Unit')!.id,
				billingEntityName: 'Muster AG',
				description: `Hauswart ${invoiceDate}`,
				amount,
				invoiceDate,
				isValidUtilityCost: true
			},
			'invoices?skipLlm=true'
		);
	await invoice('600.00', '2024-03-15');
	await invoice('1000.00', '2024-11-15');
});

afterAll(async () => {
	for (const path of created.reverse()) {
		const response = await sendJson('DELETE', `/api/v1/${path}`);
		expect({ path, ok: response.ok }).toEqual({ path, ok: true });
	}
});

describe('Eine Abrechnungsperiode pro Tag und Gebäude', () => {
	it('verteilt die Rechnung der Periode 2023/24 nach Mietstagen, zusammen nicht über ihren Betrag', async () => {
		expect(await generate(contracts.eva, '2023-07-01', '2024-06-30')).toEqual([['600.00', '149.18']]);
		expect(await generate(contracts.marc, '2023-07-01', '2024-06-30')).toEqual([['600.00', '100.00']]);
	});

	it('lehnt einen Lauf ab, dessen Periode die bestehende des Gebäudes schneidet, ohne gleich zu sein', async () => {
		const response = await run(contracts.marc, '2024-01-01', '2024-12-31');

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({
			code: 'STATEMENT_PERIOD_OVERLAPS',
			params: { building: `Lindenhof ${token}`, periodStart: '2023-07-01', periodEnd: '2024-06-30' }
		});
	});

	it('rechnet die übrigen Tage in der kurzen Abrechnungsperiode ab, die Rechnung genau einmal', async () => {
		expect(await generate(contracts.marc, '2024-07-01', '2024-12-31')).toEqual([['1000.00', '1000.00']]);
	});
	// Fachreview 199-1 V-1, product owner: statements made before this rule may overlap; a period equal to one of
	// them is allowed, a period that overlaps and equals none is refused
	it('lässt bei überschneidenden Altdaten eine Periode zu, die einer bestehenden gleicht', async () => {
		// Marc's short period stored as 2024, as a run before this rule could: it overlaps 2023/24
		await db
			.update(utilityStatements)
			.set({ periodStart: '2024-01-01' })
			.where(and(eq(utilityStatements.contractId, contracts.marc), eq(utilityStatements.periodStart, '2024-07-01')));

		expect((await run(contracts.marc, '2024-07-01', '2025-06-30')).status).toBe(400);
		// both invoices of 2024 in one line: 1'600 × 91/366
		expect(await generate(contracts.eva, '2024-01-01', '2024-12-31')).toEqual([['1600.00', '397.81']]);
	});
});
