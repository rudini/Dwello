import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/apartments/[id]/+page.server';
import { load as listLoad } from '../routes/apartments/+page.server';
import { actions as newActions } from '../routes/apartments/new/+page.server';
import { actions as editActions } from '../routes/apartments/[id]/edit/+page.server';
import { monthlyTotal } from '../lib/server/contract-history';
import {
	floorLabel,
	floorOptions,
	moveOutText,
	occupancyParts,
	statusHelp,
	statusLabels,
	statusText
} from '../lib/apartment';
import apartmentsResponse from '../../tests/contracts/apartments.json';
import moveOutsResponse from '../../tests/contracts/apartment-move-outs.json';
import { runAction } from './helpers/action';
import numberTaken from '../../tests/contracts/building-apartment-number-taken.json';
import apartmentResponse from '../../tests/contracts/apartment.json';
import deleteRefused from '../../tests/contracts/apartment-delete-refused.json';
import contractRuns from '../../tests/contracts/apartment-contract-runs.json';

const API = 'http://localhost:3001/api/v1';

// as the backend answers (tests/contracts/apartment.json)
const apartment = apartmentResponse;

const contracts = [
	{
		id: 'c2',
		tenantId: 't2',
		tenantName: 'Beat Huber',
		tenantEmail: 'beat.huber@example.com',
		startDate: '2022-04-01',
		endDate: null,
		status: 'active',
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
		status: 'ended',
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
			flatRateUtilityCharge: 0,
			monthlyTotal: 1430
		});
	});

	// #1284: «Aufgehoben ab» for the facts and the edit form
	it('gibt den Tag weiter, ab dem es die Wohnung nicht mehr gibt', async () => {
		const data = await loadApartment({ 'apartments/a1': apartment, contracts: { contracts } });
		expect(data.apartment).toMatchObject({ discontinuedFrom: '2099-07-01' });
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
			nextContractId: 'c3',
			nextContractStart: '2099-11-01'
		};
		const next = {
			...contracts[0],
			id: 'c3',
			startDate: '2099-11-01',
			tenantName: 'Ruth Meier',
			status: 'future'
		};
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

	// H-28 (#717): the backend names the contract the next tenant moves in with
	it('nennt den künftigen Mieter des Vertrags, den das Backend nennt', async () => {
		const relet = { ...apartment, status: 'relet', currentContractId: undefined, nextContractId: 'c4' };
		const after = { ...contracts[0], id: 'c4', startDate: '2101-01-01', tenantName: 'Ruth Meier', status: 'future' };
		const next = { ...contracts[0], id: 'c3', startDate: '2099-11-01', tenantName: 'Paul Frei', status: 'future' };
		const data = await loadApartment({
			'apartments/a1': relet,
			contracts: { contracts: [after, next, contracts[1]] }
		});

		expect(data.nextContract).toMatchObject({ tenantName: 'Ruth Meier', startDate: '2101-01-01' });
	});

	it('zeigt bei einer leeren Wohnung keinen Mieter und keine Kosten', async () => {
		const vacant = { ...apartment, status: 'vacant', currentContractId: undefined };
		const data = await loadApartment({ 'apartments/a1': vacant, contracts: { contracts: [] } });

		expect(data.currentContract).toBeNull();
		expect(data.monthlyCosts).toEqual({
			baseRent: 0,
			additionalRent: 0,
			advancePayment: 0,
			flatRateUtilityCharge: 0,
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

	// #664: the backend decides the move-out until the Schlussabrechnung exists, on its own route (P2)
	const withMoveOuts = (moveOuts: () => Response) =>
		(async (url: string) =>
			url.includes('/apartments/move-outs')
				? moveOuts()
				: Response.json(url.includes('/apartments') ? apartmentsResponse : { buildings: [] })) as typeof globalThis.fetch;
	const listed = async (fetch: typeof globalThis.fetch) =>
		(await listLoad({ url: new URL('http://localhost/apartments'), fetch } as never)) as {
			apartments: { id: string; moveOut: unknown }[];
		};

	it('gibt den Auszug bis zur Schlussabrechnung weiter', async () => {
		const data = await listed(withMoveOuts(() => Response.json(moveOutsResponse)));

		expect(data.apartments[0].moveOut).toEqual(moveOutsResponse.moveOuts[0].moveOut);
	});

	it('zeigt die Wohnungen ohne Auszug, wenn er nicht geladen werden kann', async () => {
		const failed = await listed(
			withMoveOuts(() => Response.json({ error: 'kaputt' }, { status: 500 }))
		);
		const unreachable = await listed(
			withMoveOuts(() => {
				throw new TypeError('fetch failed');
			})
		);

		expect(failed.apartments.map((a) => [a.id, a.moveOut])).toEqual([['a1', null]]);
		expect(unreachable.apartments.map((a) => [a.id, a.moveOut])).toEqual([['a1', null]]);
	});
});

// #664 (Persona Helga M4): until the end of the Abrechnungsperiode of the Vertragsende, then due while it is missing
describe('Auszug bis zur Schlussabrechnung', () => {
	const period = { start: '2025-01-01', end: '2025-12-31' };
	const tenantName = 'Kevin Fischer'; // Persona Helga 664-2 P-2: whose move-out, not the tenant living there now

	it('nennt bis zum Ende der Abrechnungsperiode, ab wann die Schlussabrechnung kommt', () => {
		expect(moveOutText({ endDate: '2025-06-30', tenantName, period, due: false, outside: false })).toBe(
			'Auszug von Kevin Fischer am 30.06.2025, Schlussabrechnung nach dem 31.12.2025'
		);
	});

	it('nennt danach die fällige Schlussabrechnung', () => {
		expect(moveOutText({ endDate: '2025-06-30', tenantName, period, due: true, outside: false })).toBe(
			'Auszug von Kevin Fischer am 30.06.2025, Schlussabrechnung fällig'
		);
	});

	// Fachreview 664-1 V-2: an older statement of the building overlaps the period: Dwello cannot bill it
	it('sagt, dass die Schlussabrechnung ausserhalb von Dwello fällig ist', () => {
		expect(moveOutText({ endDate: '2025-06-30', tenantName, period, due: true, outside: true })).toBe(
			'Auszug von Kevin Fischer am 30.06.2025, Schlussabrechnung ausserhalb von Dwello fällig'
		);
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

	// #429: die Nebenkostenpauschale bezahlt der Mieter jeden Monat, abgerechnet wird sie nicht
	it('zählt die Nebenkostenpauschale dazu', () => {
		expect(
			monthlyTotal({
				baseRent: '1200.00',
				additionalRent: '50.00',
				monthlyAdvancePayment: '180.00',
				flatRateUtilityCharge: '100.00'
			})
		).toBe(1530);
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
		expect(statusLabels.relet).toBe('Vermietet ab\u00a0…');
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
		// #597: the first floor below ground has no number, from the second on it is counted
		[-1, 'UG'],
		[-2, '2. UG'],
		[0, 'EG'],
		[3, '3. OG']
	])('zeigt Stockwerk %i als %s', (floor, label) => {
		expect(floorLabel(floor)).toBe(label);
	});
});

// #597 (persona Dr. Weber P-1): a second floor below ground can be chosen, not only taken from the Gebäuderegister
describe('Auswahl der Stockwerke', () => {
	it('bietet zwei Untergeschosse an', () => {
		expect(floorOptions().slice(0, 3).map((option) => option.label)).toEqual(['2. UG', 'UG', 'EG']);
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
					buildingId: 'Bitte wählen Sie ein Gebäude aus.',
					number: 'Wohnungsnummer ist erforderlich.',
					floor: 'Stockwerk ist erforderlich.',
					area: 'Fläche ist erforderlich.',
					rooms: 'Zimmeranzahl ist erforderlich.'
				}
			}
		});
		expect(calls).toEqual([]);
	});

	it('zeigt die Meldung des Backends, wenn die Nummer vergeben ist', async () => {
		const { result } = runAction(newActions.default, '', 409, fields, numberTaken);

		expect(await result).toMatchObject({
			status: 409,
			data: { errors: { form: 'Die Wohnungsnummer 101 existiert bereits in diesem Gebäude.' } }
		});
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

// #1284: «Aufgehoben ab», empty: the apartment exists
describe('Wohnung aufheben', () => {
	it('speichert den Tag, ab dem es die Wohnung nicht mehr gibt, und leer keinen', async () => {
		const day = runAction(editActions.default, 'a1', 200, { ...fields, discontinuedFrom: '2025-07-01' });
		await expect(day.result).rejects.toMatchObject({ status: 303 });
		expect(day.calls[0].body).toMatchObject({ discontinuedFrom: '2025-07-01' });
		const none = runAction(editActions.default, 'a1', 200, { ...fields, discontinuedFrom: '' });
		await expect(none.result).rejects.toMatchObject({ status: 303 });
		expect(none.calls[0].body).toMatchObject({ discontinuedFrom: null });
	});

	it('nennt den Grund, wenn ein Mietvertrag an dem Tag noch läuft', async () => {
		const { result } = runAction(editActions.default, 'a1', 409, { ...fields, discontinuedFrom: '2025-07-01' }, contractRuns);
		expect(await result).toMatchObject({
			status: 409,
			data: {
				errors: {
					form: 'Die Wohnung kann nicht ab 01.07.2025 aufgehoben werden: Der Mietvertrag mit Anna Keller endet nicht vor diesem Tag. Erfassen Sie zuerst ein Vertragsende vor dem 01.07.2025, oder wählen Sie einen späteren Tag.'
				}
			}
		});
	});
});

describe('Wohnung löschen', () => {
	const building = '7d9f3c1e-2b4a-4c8d-9e6f-1a2b3c4d5e6f';

	it('löscht eine Wohnung und kehrt zur Seite ihres Gebäudes zurück', async () => {
		const { calls, result } = runAction(actions.delete, 'a1', 204, { buildingId: building });

		await expect(result).rejects.toMatchObject({ status: 303, location: `/buildings/${building}` });
		expect(calls).toEqual([{ method: 'DELETE', url: `${API}/apartments/a1`, body: undefined }]);
	});

	it('leitet nur auf eine Gebäudeseite weiter, auch mit einem fremden Gebäude im Formular', async () => {
		const { result } = runAction(actions.delete, 'a1', 204, { buildingId: '../config' });

		await expect(result).rejects.toMatchObject({ status: 303, location: '/buildings/..%2Fconfig' });
	});

	// #1257: ein Mietvertrag kam nach dem Laden der Seite dazu; das Backend lehnt mit Code ab
	it('nennt den Grund, wenn das Backend eine Wohnung mit Mietverträgen ablehnt', async () => {
		const { result } = runAction(actions.delete, 'a1', 409, { buildingId: building }, deleteRefused);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				deleteError:
					'Diese Wohnung kann nicht gelöscht werden, weil sie Mietverträge hat. Auch ein beendeter Mietvertrag bleibt als Historie der Wohnung erhalten. Löschen Sie einen Mietvertrag auf seiner Seite nur, wenn er irrtümlich erfasst wurde, nicht damit sich die Wohnung löschen lässt. Hat er eine versendete oder bezahlte Abrechnung, bleiben er und die Wohnung erhalten.',
				deleteImpossible: true
			}
		});
	});

	// #1257 (Code-Review C-2): in einem anderen Fenster gelöscht; die Wohnung ist weg, wie gewünscht
	it('kehrt zum Gebäude zurück, wenn es die Wohnung schon nicht mehr gibt', async () => {
		const { result } = runAction(actions.delete, 'a1', 404, { buildingId: building }, { error: 'Apartment not found' });

		await expect(result).rejects.toMatchObject({ status: 303, location: `/buildings/${building}` });
	});

	// ein Fehler ohne Code: der eigene Text, nicht die englische Meldung des Backends
	it('meldet einen Fehler ohne Code als nicht gelöscht', async () => {
		const { result } = runAction(actions.delete, 'a1', 500, { buildingId: building }, { error: 'Internal error' });

		expect(await result).toMatchObject({
			status: 500,
			data: {
				deleteError: 'Die Wohnung konnte nicht gelöscht werden. Versuchen Sie es erneut.',
				deleteImpossible: false
			}
		});
	});
});
