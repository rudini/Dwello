/**
 * Prorating a year of costs over the contracts of a flat: tenant moves out at the end of June, the flat stays empty in
 * July, the next tenant moves in on 1 August (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createContract, deleteContract } from '../services/contract.service';
import { getHeatingProfileByName } from '../services/heating-profile.service';
import { calculateApartmentProrating, handleMidYearMoves } from '../services/prorating.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { createRental } from './helpers/rental';

const year = { start: new Date('2024-01-01'), end: new Date('2024-12-31') };
let rental: Awaited<ReturnType<typeof createRental>>;
let nextTenant: string;
let nextContract: string;

beforeAll(async () => {
	const token = crypto.randomUUID();
	rental = await createRental(token, {
		startDate: '2024-01-01',
		endDate: '2024-06-30',
		monthlyAdvancePayment: '150'
	});
	nextTenant = (await createTenant({ firstName: 'Beat', lastName: `Huber ${token}` })).id;
	nextContract = (
		await createContract({
			apartmentId: rental.apartment,
			tenantId: nextTenant,
			startDate: '2024-08-01',
			baseRent: '950',
			monthlyAdvancePayment: '150'
		})
	).id;
});

afterAll(async () => {
	await deleteContract(nextContract, true);
	await deleteTenant(nextTenant);
	await rental.remove();
});

describe('calculateApartmentProrating', () => {
	it('teilt das Jahr nach Tagen auf die beiden Mietverträge auf', async () => {
		const result = await calculateApartmentProrating(rental.apartment, year.start, year.end);

		expect(result.totalPeriodDays).toBe(366);
		expect(result.contracts.map((c) => [c.contract.id, c.overlapDays])).toEqual([
			[rental.contract, 182],
			[nextContract, 153]
		]);
	});

	it('weist den leeren Juli als Leerstand aus', async () => {
		const result = await calculateApartmentProrating(rental.apartment, year.start, year.end);

		expect(result.vacancy.totalVacantDays).toBe(31);
		expect(result.occupancyRate).toBeCloseTo(335 / 366);
	});
});

describe('calculateApartmentProrating (Periode über den Jahreswechsel)', () => {
	it('zählt die Tage vor dem ersten Mietvertrag als Leerstand und nur die Tage in der Periode', async () => {
		const result = await calculateApartmentProrating(
			rental.apartment,
			new Date('2023-07-01'),
			new Date('2024-03-31')
		);

		expect(result.totalPeriodDays).toBe(275);
		expect(result.contracts.map((c) => [c.contract.id, c.overlapDays])).toEqual([[rental.contract, 91]]);
		expect(result.vacancy.vacantPeriods).toEqual([
			{ start: new Date('2023-07-01'), end: new Date('2023-12-31') }
		]);
		expect(result.vacancy.totalVacantDays).toBe(184);
	});
});

describe('calculateApartmentProrating (Auszug ohne Nachmieter in der Periode)', () => {
	it('weist die Tage nach dem Auszug bis zum Periodenende als Leerstand aus', async () => {
		const result = await calculateApartmentProrating(
			rental.apartment,
			new Date('2024-01-01'),
			new Date('2024-07-15')
		);

		expect(result.contracts.map((c) => [c.contract.id, c.overlapDays])).toEqual([[rental.contract, 182]]);
		expect(result.vacancy.vacantPeriods).toEqual([
			{ start: new Date('2024-07-01'), end: new Date('2024-07-15') }
		]);
		expect(result.vacancy.totalVacantDays).toBe(15);
	});
});

describe('handleMidYearMoves', () => {
	it('verteilt die Heizkosten nach dem Heizprofil statt nach Tagen', async () => {
		const mittelland = (await getHeatingProfileByName('Heating Mittelland'))!;

		const result = await handleMidYearMoves(
			mittelland.id,
			new Date('2024-01-01'),
			new Date('2024-06-30'),
			year.start,
			year.end,
			10000
		);

		// Januar bis Juni im Mittelland: 17.5 + 14.5 + 13.5 + 9.5 + 3.5 + 0 = 58.5 % der Heizkosten
		expect(result).toMatchObject({ byDays: false, share: 5850 });
	});

	it('sagt, dass es nach Tagen geteilt hat, wenn die Monate der Periode im Heizprofil 0 % tragen (Sommer)', async () => {
		const mittelland = (await getHeatingProfileByName('Heating Mittelland'))!;

		// Juni bis August: 0 % im Mittelland; die Tage teilt die Berechnung wie bei jeder anderen Rechnung
		const result = await handleMidYearMoves(
			mittelland.id,
			new Date('2024-07-15'),
			new Date('2024-08-31'),
			new Date('2024-06-01'),
			new Date('2024-08-31'),
			9200
		);

		expect(result).toEqual({ byDays: true });
	});

	// Periode Juli bis Dezember, Einzug am 1. Oktober, Mittelland: Oktober bis Dezember 10 + 13.5 + 17 = 40.5 % des Jahres,
	// von den 41.5 % der Periode (Juli 0, August 0, September 1): 97.59 % der Heizkosten der Periode
	it('teilt bei einem Einzug in einer Periode unter einem Jahr durch die Anteile der Periode', async () => {
		const mittelland = (await getHeatingProfileByName('Heating Mittelland'))!;

		const result = await handleMidYearMoves(
			mittelland.id,
			new Date('2024-10-01'),
			null,
			new Date('2024-07-01'),
			new Date('2024-12-31'),
			10000
		);

		expect(result).toMatchObject({ byDays: false });
		expect((result as { share: number }).share).toBeCloseTo(9759.04, 2);
	});

	// Regel 5: das Heizprofil nur bei Ein- oder Auszug; wer die ganze Periode mietet, trägt nach Tagen (#208, D-2)
	it('sagt, dass nach Tagen geteilt wird, wenn der Mietvertrag die ganze Periode läuft', async () => {
		const mittelland = (await getHeatingProfileByName('Heating Mittelland'))!;

		const result = await handleMidYearMoves(mittelland.id, new Date('2023-01-01'), null, year.start, year.end, 10000);

		expect(result).toEqual({ byDays: true });
	});

	it('sagt, dass nach Tagen geteilt wird, wenn das Heizprofil nicht existiert', async () => {
		const result = await handleMidYearMoves(
			crypto.randomUUID(),
			new Date('2024-01-01'),
			new Date('2024-06-30'),
			year.start,
			year.end,
			10000
		);

		expect(result).toEqual({ byDays: true });
	});
});
