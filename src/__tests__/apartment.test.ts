import { describe, it, expect } from 'vitest';
import { load } from '../routes/apartments/[id]/+page.server';
import { actions as newActions } from '../routes/apartments/new/+page.server';
import { actions as editActions } from '../routes/apartments/[id]/edit/+page.server';
import { grossRent } from '../lib/server/contract-history';
import { floorLabel, statusText } from '../lib/apartment';
import { runAction } from './helpers/action';

const API = 'http://localhost:3001/api/v1';

const apartment = {
	id: 'a1',
	buildingId: 'b1',
	number: '3.01',
	floor: 3,
	area: '82.50',
	rooms: '3.5',
	status: 'occupied',
	building: { id: 'b1', name: 'Lindenhof', address: 'Lindenweg 4', postalCode: '8400', city: 'Winterthur' },
	currentContractId: 'c2'
};

const contracts = [
	{
		id: 'c2',
		tenantId: 't2',
		tenantName: 'Beat Huber',
		tenantEmail: 'beat.huber@example.com',
		startDate: '2022-04-01',
		endDate: null,
		baseRent: '1200.00',
		additionalRent: '50.00',
		monthlyAdvancePayment: '180.00'
	},
	{
		id: 'c1',
		tenantId: 't1',
		tenantName: 'Eva Graf',
		tenantEmail: null,
		startDate: '2018-01-01',
		endDate: '2022-03-31',
		baseRent: '1100.00',
		additionalRent: null,
		monthlyAdvancePayment: '150.00'
	}
];

function backend(answers: Record<string, unknown>) {
	const urls: string[] = [];
	const fetch = async (url: string) => {
		urls.push(url);
		const path = Object.keys(answers).find((p) => url.startsWith(`${API}/${p}`));
		return path ? Response.json(answers[path]) : new Response(null, { status: 404 });
	};
	return { urls, fetch: fetch as typeof globalThis.fetch };
}

const loadApartment = (answers: Record<string, unknown>) =>
	load({ params: { id: 'a1' }, fetch: backend(answers).fetch } as never) as Promise<
		Record<string, unknown>
	>;

describe('Wohnungsdetail', () => {
	it('zeigt den aktuellen Mieter mit seinem Vertrag', async () => {
		const data = await loadApartment({ 'apartments/a1': apartment, contracts: { contracts } });

		expect(data.apartment).toMatchObject({ status: 'occupied', nextContractStart: null });
		expect(data.currentContract).toEqual({
			id: 'c2',
			tenantId: 't2',
			tenantName: 'Beat Huber',
			tenantEmail: 'beat.huber@example.com',
			startDate: '2022-04-01'
		});
		expect(data.monthlyCosts).toEqual({
			baseRent: 1200,
			additionalRent: 50,
			advancePayment: 180,
			totalBrutto: 1430
		});
	});

	it('zeigt alle Verträge der Wohnung in der Vertragshistorie', async () => {
		const data = await loadApartment({ 'apartments/a1': apartment, contracts: { contracts } });

		expect(data.contractHistory).toEqual([
			expect.objectContaining({ id: 'c2', tenantName: 'Beat Huber', rentBrutto: 1430, status: 'active' }),
			expect.objectContaining({
				id: 'c1',
				tenantName: 'Eva Graf',
				period: '1.1.2018 - 31.3.2022',
				rentBrutto: 1250,
				status: 'ended'
			})
		]);
	});

	it('zeigt bei einer leeren Wohnung keinen Mieter und keine Kosten', async () => {
		const vacant = { ...apartment, status: 'vacant', currentContractId: undefined };
		const data = await loadApartment({ 'apartments/a1': vacant, contracts: { contracts: [] } });

		expect(data.currentContract).toBeNull();
		expect(data.monthlyCosts).toEqual({ baseRent: 0, additionalRent: 0, advancePayment: 0, totalBrutto: 0 });
	});

	it('lädt die Verträge der Wohnung', async () => {
		const { urls, fetch } = backend({ 'apartments/a1': apartment, contracts: { contracts } });

		await load({ params: { id: 'a1' }, fetch } as never);

		expect(urls).toContain(`${API}/contracts?apartmentId=a1&limit=100`);
	});

	it('meldet eine unbekannte Wohnung als nicht gefunden', async () => {
		await expect(loadApartment({})).rejects.toMatchObject({ status: 404 });
	});
});

describe('Bruttomiete', () => {
	it('zählt Nettomiete, Zusatzmiete und Akontozahlung zusammen', () => {
		expect(grossRent({ baseRent: '1200.00', additionalRent: '50.00', monthlyAdvancePayment: '180.00' })).toBe(
			1430
		);
	});
});

describe('Wohnungsstatus', () => {
	it.each([
		['occupied', null, 'Vermietet'],
		['relet', '2026-11-01', 'Vermietet ab 1.11.2026'],
		['vacant', null, 'Leer'],
		['reserved', null, 'Gesperrt']
	] as const)('zeigt %s (nächster Vertrag ab %s) als %s', (status, nextContractStart, text) => {
		expect(statusText({ status, nextContractStart })).toBe(text);
	});
});

describe('Stockwerk', () => {
	it.each([
		[-1, 'UG'],
		[0, 'EG'],
		[3, '3. OG']
	])('zeigt Stockwerk %i als %s', (floor, label) => {
		expect(floorLabel(floor)).toBe(label);
	});
});

const fields = { buildingId: 'b1', number: ' 4.01 ', floor: '4', area: '68', rooms: '2.5' };

describe('Neue Wohnung', () => {
	it('erfasst die Wohnung als leer und öffnet sie', async () => {
		const { calls, result } = runAction(newActions.default, '', 201, fields);

		await expect(result).rejects.toMatchObject({ status: 303 });
		expect(calls).toEqual([
			{
				method: 'POST',
				url: `${API}/apartments`,
				body: { buildingId: 'b1', number: '4.01', floor: 4, area: '68', rooms: '2.5', status: 'vacant' }
			}
		]);
	});

	it('verlangt Gebäude, Nummer, Stockwerk, Fläche und Zimmer', async () => {
		const { calls, result } = runAction(newActions.default, '', 201, {});

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					buildingId: 'Bitte wählen Sie ein Gebäude aus',
					number: 'Wohnungsnummer ist erforderlich',
					floor: 'Stockwerk ist erforderlich',
					area: 'Fläche ist erforderlich',
					rooms: 'Zimmeranzahl ist erforderlich'
				}
			}
		});
		expect(calls).toEqual([]);
	});

	it('zeigt die Meldung des Backends, wenn die Nummer vergeben ist', async () => {
		const message = 'Die Wohnungsnummer 4.01 existiert bereits in diesem Gebäude.';
		const { result } = runAction(newActions.default, '', 409, fields, { error: message });

		expect(await result).toMatchObject({ status: 409, data: { errors: { form: message } } });
	});
});

describe('Wohnung bearbeiten', () => {
	it('speichert Nummer, Stockwerk, Fläche, Zimmer und Status und öffnet die Wohnung', async () => {
		const { calls, result } = runAction(editActions.default, 'a1', 200, { ...fields, status: 'reserved' });

		await expect(result).rejects.toMatchObject({ status: 303, location: '/apartments/a1' });
		expect(calls).toEqual([
			{
				method: 'PUT',
				url: `${API}/apartments/a1`,
				body: { number: '4.01', floor: 4, area: '68', rooms: '2.5', status: 'reserved' }
			}
		]);
	});

	it('lässt den Status einer vermieteten Wohnung unverändert', async () => {
		const { calls, result } = runAction(editActions.default, 'a1', 200, fields);

		await expect(result).rejects.toMatchObject({ status: 303 });
		expect(calls[0].body).toEqual({ number: '4.01', floor: 4, area: '68', rooms: '2.5' });
	});
});
