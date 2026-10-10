/**
 * Characterization tests: statement generation pinned against the real PostgreSQL database
 *
 * They record what POST /api/v1/statements/generate computes and stores today, so the move of
 * the settlement logic into modules (phase 22.3/22.4) cannot change any amount unnoticed.
 * The expected values were observed from the code, then checked by hand (see comments).
 *
 * Building "Lindenhof", Abrechnungsperiode 1.1.–31.12.2024 (leap year, 366 days):
 * - 1.01: 80 m², 3.5 rooms. Tenant A 1.1.–30.4. (121 days), vacant 1.5.–15.6., tenant B from 16.6. (199 days)
 * - 1.02: 40 m², 1.5 rooms. Tenant C all year (366 days)
 * - 1.03: 30 m², 2.5 rooms. Empty all year
 * Totals: 150 m², 7.5 rooms, 3 units.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { sendJson } from './helpers/auth';

// Test data goes through the API only, so moving services into modules (phase 22.3) leaves this file untouched
const token = crypto.randomUUID();
const created: string[] = [];
const contracts = { a: '', b: '', c: '' };
let buildingId: string;
let heatingProfileId: string;

/** Creates a record through the API (posted to `post`); afterAll deletes it under `resource`, newest first */
async function create(resource: string, body: object, post = resource) {
	const response = await sendJson('POST', `/api/v1/${post}`, body);
	const record = (await response.json()) as { id: string; error?: string };
	// The resource and error message say which record the API refused
	expect({ resource, status: response.status, error: record.error }).toEqual({
		resource,
		status: 201,
		error: undefined
	});
	const { id } = record;
	created.push(`${resource}/${id}`);
	return id;
}

const get = async <T>(path: string) =>
	(await (await sendJson('GET', `/api/v1/${path}`)).json()) as T;

type StoredStatement = {
	rentalDays: number;
	totalCosts: string;
	totalAdvancePayments: string;
	managementFee: string;
	balance: string;
	lineItems: {
		description: string;
		totalAmount: string;
		tenantShare: string;
		sharePercentage: string;
	}[];
};

/** Generates the statement for 2024 like the UI does and reads back what was stored */
async function generate(contractId: string, heatingProfile?: string) {
	const id = await create(
		'statements',
		{
			contractId,
			buildingId,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			heatingProfileId: heatingProfile,
			// Explicit, so a changed default in the configuration does not change the pinned amounts
			managementFeePercent: 3
		},
		'statements/generate'
	);

	const stored = await get<StoredStatement>(`statements/${id}`);
	return {
		rentalDays: stored.rentalDays,
		totalCosts: stored.totalCosts,
		totalAdvancePayments: stored.totalAdvancePayments,
		managementFee: stored.managementFee,
		balance: stored.balance,
		lines: stored.lineItems.map((l) => [
			l.description,
			l.totalAmount,
			l.tenantShare,
			l.sharePercentage
		])
	};
}

async function rent(
	firstName: string,
	apartmentId: string,
	monthlyAdvancePayment: string,
	startDate: string,
	endDate?: string
) {
	const tenantId = await create('tenants', { firstName, lastName: `Lindenhof ${token}` });
	return create('contracts', {
		apartmentId,
		tenantId,
		startDate,
		endDate,
		baseRent: '1500',
		monthlyAdvancePayment
	});
}

beforeAll(async () => {
	buildingId = await create('buildings', {
		name: `Lindenhof ${token}`,
		address: 'Lindenweg 3',
		postalCode: '3000',
		city: 'Bern',
		canton: 'BE'
	});
	const apartment = (number: string, area: string, rooms: string) =>
		create('apartments', { buildingId, number, floor: 1, area, rooms });
	const large = await apartment('1.01', '80', '3.5');
	const small = await apartment('1.02', '40', '1.5');
	await apartment('1.03', '30', '2.5');

	contracts.a = await rent('Mieterin A', large, '200', '2024-01-01', '2024-04-30');
	contracts.b = await rent('Mieter B', large, '180', '2024-06-16');
	contracts.c = await rent('Mieterin C', small, '120', '2023-04-01');

	const idByName = (records: { id: string; name: string }[]) =>
		Object.fromEntries(records.map((r) => [r.name, r.id]));
	const category = idByName(
		(await get<{ categories: { id: string; name: string }[] }>('categories')).categories
	);
	const key = idByName(
		(await get<{ data: { id: string; name: string }[] }>('distribution-keys')).data
	);
	const invoice = (
		categoryName: string,
		distributionKeyId: string | null,
		amount: string,
		invoiceDate: string,
		isValidUtilityCost = true
	) =>
		// With the category given, the KI does not run; skipLlm keeps it that way
		create(
			'invoices',
			{
				buildingId,
				categoryId: category[categoryName],
				distributionKeyId,
				billingEntityName: 'Muster AG',
				description: `${categoryName} ${invoiceDate}`,
				amount,
				invoiceDate,
				isValidUtilityCost
			},
			'invoices?skipLlm=true'
		);
	const heatingKey = key['Heating (Area 70% / Unit 30%)'];
	const perArea = key['Per Area (m²)'];
	await invoice('Heating', heatingKey, '3000.00', '2024-02-15');
	await invoice('Caretaker', perArea, '1200.00', '2024-03-31');
	await invoice('Cold Water', key['Per Unit'], '600.00', '2024-05-31');
	await invoice('Waste Disposal', key['Per Rooms'], '450.00', '2024-07-31');
	await invoice('Elevator', null, '330.00', '2024-08-31');
	// Same category and key as the March invoice: both form one line item
	await invoice('Caretaker', perArea, '300.00', '2024-09-30');
	// Not umlagefähig and outside the period: neither appears in the statement
	await invoice('Mortgage Interest', perArea, '5000.00', '2024-10-31', false);
	await invoice('Caretaker', perArea, '999.00', '2023-12-31');

	heatingProfileId = await create('heating-profiles', {
		name: `Lindenhof ${token}`,
		januaryPct: 18,
		februaryPct: 14,
		marchPct: 11,
		aprilPct: 5,
		mayPct: 1,
		junePct: 1,
		julyPct: 0,
		augustPct: 0,
		septemberPct: 2,
		octoberPct: 8,
		novemberPct: 14,
		decemberPct: 26
	});
});

afterAll(async () => {
	for (const path of created.reverse()) {
		const response = await sendJson('DELETE', `/api/v1/${path}`);
		expect({ path, ok: response.ok }).toEqual({ path, ok: true });
	}
});

// Line items: [category, building total, tenant share, tenant share of the building total in %]
const lineC = [
	// Heating key 70 % by area, 30 % per apartment: (0.7 × 40 / 150 + 0.3 / 3) × 3000 = 860.00
	['Heating', '3000.00', '860.00', '28.6667'],
	// Both caretaker invoices (1200 + 300) by area: 40 / 150 × 1500
	['Caretaker', '1500.00', '400.00', '26.6667'],
	// Per unit: 600 / 3
	['Cold Water', '600.00', '200.00', '33.3333'],
	// Per rooms: 1.5 / 7.5 × 450
	['Waste Disposal', '450.00', '90.00', '20.0000'],
	// Invoice without distribution key: split equally, 330 / 3
	['Elevator', '330.00', '110.00', '33.3333']
];

describe('Mehrere Verteilschlüssel', () => {
	it('verteilt jede Kostenart nach ihrem Schlüssel und lässt Hypothekarzins und Vorjahresrechnung weg', async () => {
		expect(await generate(contracts.c)).toEqual({
			// Contract started 2023, counted from the start of the period
			rentalDays: 366,
			lines: lineC,
			// Subtotal 1660.00 + management fee: 3 % of the building's 5880.00 = 176.40, equally per apartment 58.80
			managementFee: '58.80',
			totalCosts: '1718.80',
			// 12 × 120
			totalAdvancePayments: '1440.00',
			balance: '278.80'
		});
	});
});

describe('Mieterwechsel in der Abrechnungsperiode', () => {
	it('belastet die ausziehende Mieterin nach Tagen (121 von 366)', async () => {
		expect(await generate(contracts.a)).toEqual({
			rentalDays: 121,
			lines: [
				// Apartment share (0.7 × 80 / 150 + 0.3 / 3) × 3000 = 1420.00, × 121 / 366
				['Heating', '3000.00', '469.45', '15.6483'],
				// 80 / 150 × 1500 = 800, × 121 / 366
				['Caretaker', '1500.00', '264.48', '17.6320'],
				['Cold Water', '600.00', '66.12', '11.0200'],
				// 3.5 / 7.5 × 450 = 210, × 121 / 366
				['Waste Disposal', '450.00', '69.43', '15.4289'],
				['Elevator', '330.00', '36.37', '11.0212']
			],
			// Subtotal 905.85 + management fee 58.80 for 121 of 366 days
			managementFee: '19.44',
			totalCosts: '925.29',
			// January to April, 4 × 200
			totalAdvancePayments: '800.00',
			balance: '125.29'
		});
	});

	it('belastet den einziehenden Mieter nach Tagen (199 von 366) und rechnet den Juni anteilig ab', async () => {
		expect(await generate(contracts.b)).toEqual({
			rentalDays: 199,
			lines: [
				// 1420.00 × 199 / 366
				['Heating', '3000.00', '772.08', '25.7360'],
				['Caretaker', '1500.00', '434.97', '28.9980'],
				['Cold Water', '600.00', '108.74', '18.1233'],
				['Waste Disposal', '450.00', '114.18', '25.3733'],
				['Elevator', '330.00', '59.81', '18.1242']
			],
			// Subtotal 1489.78 + management fee 58.80 for 199 of 366 days
			managementFee: '31.97',
			totalCosts: '1521.75',
			// 16.–30. June = 15 / 30 × 180, plus July to December 6 × 180
			totalAdvancePayments: '1170.00',
			balance: '351.75'
		});
	});
});

describe('Leerstand', () => {
	it('lässt die Kosten der leeren Wohnung und der Lücke zwischen den Mietern beim Vermieter', async () => {
		const charged = [
			await generate(contracts.a),
			await generate(contracts.b),
			await generate(contracts.c)
		];
		const landlord = charged[0].lines.map(([category, total], i) => [
			category,
			(Number(total) - charged.reduce((sum, s) => sum + Number(s.lines[i][2]), 0)).toFixed(2)
		]);

		// Empty apartment 1.03 all year plus apartment 1.01 from 1.5. to 15.6. (46 days)
		expect(landlord).toEqual([
			// 720.00 + 46 / 366 × 1420.00
			['Heating', '898.47'],
			// 300 + 46 / 366 × 800
			['Caretaker', '400.55'],
			['Cold Water', '225.14'],
			// 150 + 46 / 366 × 210
			['Waste Disposal', '176.39'],
			// 110 + 46 / 366 × 110 = 123.83; the tenants' shares are rounded separately
			['Elevator', '123.82']
		]);
	});
});

// Runs in UTC or Swiss time. In time zones behind UTC (e.g. America/New_York) the heating profile shifts by a day
// and the heating shares change (A: the shares of one day more or less); that is today's behavior, not pinned here.
describe('Heizprofil', () => {
	it('belastet die ausziehende Mieterin mit Januar bis April gemäss Heizprofil, die übrigen Kosten nach Tagen', async () => {
		expect(await generate(contracts.a, heatingProfileId)).toEqual({
			rentalDays: 121,
			lines: [
				// 18 + 14 + 11 + 5 = 48 % of 1420.00
				['Heating', '3000.00', '681.60', '22.7200'],
				['Caretaker', '1500.00', '264.48', '17.6320'],
				['Cold Water', '600.00', '66.12', '11.0200'],
				['Waste Disposal', '450.00', '69.43', '15.4289'],
				['Elevator', '330.00', '36.37', '11.0212']
			],
			managementFee: '19.44',
			totalCosts: '1137.44',
			totalAdvancePayments: '800.00',
			balance: '337.44'
		});
	});

	it('belastet den einziehenden Mieter ab 16. Juni gemäss Heizprofil', async () => {
		expect(await generate(contracts.b, heatingProfileId)).toEqual({
			rentalDays: 199,
			lines: [
				// June 1 % × 15 / 30 days + September to December 2 + 8 + 14 + 26 = 50.5 % of 1420.00
				['Heating', '3000.00', '717.10', '23.9033'],
				['Caretaker', '1500.00', '434.97', '28.9980'],
				['Cold Water', '600.00', '108.74', '18.1233'],
				['Waste Disposal', '450.00', '114.18', '25.3733'],
				['Elevator', '330.00', '59.81', '18.1242']
			],
			managementFee: '31.97',
			totalCosts: '1466.77',
			totalAdvancePayments: '1170.00',
			balance: '296.77'
		});
	});

	it('ergibt für ein ganzes Jahr dieselbe Abrechnung wie ohne Heizprofil', async () => {
		expect((await generate(contracts.c, heatingProfileId)).lines).toEqual(lineC);
	});
});
