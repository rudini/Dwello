import { describe, it, expect } from 'vitest';
import { load } from '../routes/apartments/[id]/+page.server';
import { load as listLoad } from '../routes/apartments/+page.server';
import { actions as newActions } from '../routes/apartments/new/+page.server';
import { actions as editActions } from '../routes/apartments/[id]/edit/+page.server';
import { monthlyTotal } from '../lib/server/contract-history';
import { floorLabel, occupancyParts, statusHelp, statusLabels, statusText } from '../lib/apartment';
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
	building: {
		id: 'b1',
		name: 'Lindenhof',
		address: 'Lindenweg 4',
		postalCode: '8400',
		city: 'Winterthur'
	},
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
			monthlyTotal: 1430
		});
	});

	it('zeigt alle Verträge der Wohnung in der Vertragshistorie', async () => {
		const data = await loadApartment({ 'apartments/a1': apartment, contracts: { contracts } });

		expect(data.contractHistory).toEqual([
			expect.objectContaining({
				id: 'c2',
				tenantName: 'Beat Huber',
				monthlyTotal: 1430,
				status: 'active'
			}),
			expect.objectContaining({
				id: 'c1',
				tenantName: 'Eva Graf',
				monthlyTotal: 1250,
				status: 'ended'
			})
		]);
	});

	it('nennt bei einer wiedervermieteten Wohnung den künftigen Mieter', async () => {
		const relet = {
			...apartment,
			status: 'relet',
			currentContractId: undefined,
			nextContractStart: '2099-11-01'
		};
		const next = { ...contracts[0], id: 'c3', startDate: '2099-11-01', tenantName: 'Ruth Meier' };
		const data = await loadApartment({
			'apartments/a1': relet,
			contracts: { contracts: [next, contracts[1]] }
		});

		expect(data.currentContract).toBeNull();
		expect(data.nextContract).toEqual({
			tenantId: 't2',
			tenantName: 'Ruth Meier',
			startDate: '2099-11-01'
		});
		expect(data.contractHistory).toEqual([
			expect.objectContaining({ id: 'c3', status: 'future' }),
			expect.objectContaining({ id: 'c1', status: 'ended' })
		]);
	});

	it('zeigt bei einer leeren Wohnung keinen Mieter und keine Kosten', async () => {
		const vacant = { ...apartment, status: 'vacant', currentContractId: undefined };
		const data = await loadApartment({ 'apartments/a1': vacant, contracts: { contracts: [] } });

		expect(data.currentContract).toBeNull();
		expect(data.monthlyCosts).toEqual({
			baseRent: 0,
			additionalRent: 0,
			advancePayment: 0,
			monthlyTotal: 0
		});
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

// «Leer seit» in the apartment list too (#145, review C-2)
describe('Wohnungsliste', () => {
	it('gibt das Ende des letzten Mietvertrags weiter', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('/apartments')
					? { apartments: [{ ...apartment, status: 'vacant', lastContractEnd: '2024-03-31' }], total: 1 }
					: { buildings: [] }
			)) as typeof globalThis.fetch;
		const data = (await listLoad({ url: new URL('http://localhost/apartments'), fetch } as never)) as {
			apartments: { lastContractEnd: string | null }[];
		};

		expect(data.apartments[0].lastContractEnd).toBe('2024-03-31');
	});
});

describe('Monatlich total', () => {
	it('zählt Nettomiete, Zusatzmiete und Akonto zusammen', () => {
		expect(
			monthlyTotal({
				baseRent: '1200.00',
				additionalRent: '50.00',
				monthlyAdvancePayment: '180.00'
			})
		).toBe(1430);
	});
});

describe('Wohnungsstatus', () => {
	it.each([
		['occupied', null, 'Vermietet'],
		['relet', '2026-11-01', 'Vermietet ab 01.11.2026'],
		['vacant', null, 'Leer'],
		['reserved', null, 'Gesperrt']
	] as const)('zeigt %s (nächster Vertrag ab %s) als %s', (status, nextContractStart, text) => {
		expect(statusText({ status, nextContractStart })).toBe(text);
	});

	// A-4: die Kündigungszeit ist sichtbar, nicht erst der Leerstand
	// Review K-4: zieht der Nachmieter am Tag danach ein, droht kein Leerstand
	it('zeigt bei nahtlosem Nachmieter nur «Vermietet»', () => {
		expect(
			statusText({
				status: 'occupied',
				currentContractEnd: '2099-03-31',
				nextContractStart: '2099-04-01'
			})
		).toBe('Vermietet');
		expect(
			statusText({
				status: 'occupied',
				currentContractEnd: '2099-03-31',
				nextContractStart: '2099-05-01'
			})
		).toBe('Vermietet bis 31.03.2099');
	});

	// F-4 (#58): ohne Datum, etwa im Filter, steht der Mietstatus als «Vermietet ab …»
	it('nennt den Mietstatus relet ohne Datum «Vermietet ab …»', () => {
		expect(statusLabels.relet).toBe('Vermietet ab …');
	});

	// P-18 (#145): leer seit dem Tag nach dem Ende des letzten Mietvertrags
	it('zeigt bei einer leeren Wohnung, seit wann sie leer ist', () => {
		expect(statusText({ status: 'vacant', lastContractEnd: '2024-03-31' })).toBe(
			'Leer seit 01.04.2024'
		);
		expect(statusText({ status: 'reserved', lastContractEnd: '2024-03-31' })).toBe('Gesperrt');
	});

	it('zeigt bei einem Vertrag mit Ende, bis wann die Wohnung vermietet ist', () => {
		expect(statusText({ status: 'occupied', currentContractEnd: '2099-03-31' })).toBe(
			'Vermietet bis 31.03.2099'
		);
	});

	it.each([
		['occupied', 'Ein Mietvertrag läuft.'],
		[
			'relet',
			'Ein künftiger Mietvertrag ist abgeschlossen; die Wohnung ist ab seinem Vertragsbeginn'
		],
		['vacant', 'Es läuft kein Mietvertrag'],
		['reserved', 'von Hand gesperrt']
	] as const)('erklärt %s in Worten des Glossars', (status, words) => {
		expect(statusHelp[status]).toContain(words);
	});
});

// F-4 (#58): Gebäudekarten in denselben Worten wie Übersicht und Wohnungsseite
describe('Belegung eines Gebäudes', () => {
	it('nennt künftig vermietete Wohnungen mit ihrem Vertragsbeginn', () => {
		expect(
			occupancyParts({
				occupiedCount: 1,
				reletStarts: ['2099-11-01', '2099-12-01', '2099-11-01'],
				vacantCount: 0
			})
		).toEqual(['1 vermietet', '2 vermietet ab 01.11.2099', '1 vermietet ab 01.12.2099', '0 leer']);
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
				body: {
					buildingId: 'b1',
					number: '4.01',
					floor: 4,
					area: '68',
					rooms: '2.5',
					status: 'vacant'
				}
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
		const { calls, result } = runAction(editActions.default, 'a1', 200, {
			...fields,
			status: 'reserved'
		});

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
