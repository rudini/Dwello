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
	await deleteContract(nextContract);
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

		// Januar bis Juni im Mittelland: 28 + 14 + 11 + 5 + 0 + 0 = 58 % der Heizkosten
		expect(result.share).toBeCloseTo(5800);
	});

	it('teilt nach Tagen, wenn das Heizprofil nicht existiert', async () => {
		const result = await handleMidYearMoves(
			crypto.randomUUID(),
			new Date('2024-01-01'),
			new Date('2024-06-30'),
			year.start,
			year.end,
			10000
		);

		expect(result.share).toBeCloseTo((10000 * 182) / 366);
	});
});
