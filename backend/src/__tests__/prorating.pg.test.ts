/**
 * Prorating a year of costs over the contracts of a flat: tenant moves out at the end of June, the flat stays empty in
 * July, the next tenant moves in on 1 August (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createContract, deleteContract } from '../services/contract.service';
import { createHeatingProfile, deleteHeatingProfile, getHeatingProfileByName } from '../services/heating-profile.service';
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

		expect(result).toEqual({ byDays: true, reason: 'noHeatingMonths' });
	});

	// Periode Juli bis Dezember, Einzug am 1. Oktober, Mittelland: Oktober bis Dezember 10 + 13.5 + 17 = 40.5 % des Jahres,
	// von den 41.5 % der Periode (Juli 0, August 0, September 1): 97.59 % der Heizkosten der Periode, auf zwei
	// Stellen wie gedruckt (#232)
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

		expect(result).toMatchObject({ byDays: false, percentage: 97.59, share: 9759 });
	});

	// Regel 5: das Heizprofil nur bei Ein- oder Auszug; wer die ganze Periode mietet, trägt nach Tagen (#208, D-2)
	it('sagt, dass nach Tagen geteilt wird, wenn der Mietvertrag die ganze Periode läuft', async () => {
		const mittelland = (await getHeatingProfileByName('Heating Mittelland'))!;

		const result = await handleMidYearMoves(mittelland.id, new Date('2023-01-01'), null, year.start, year.end, 10000);

		expect(result).toEqual({ byDays: true, reason: 'wholePeriod' });
	});

	// Einzug am 5. Januar, Periode Januar bis Juni, «Winter»: Januar 18 × 27/31 = 15.677… gerundet 15.68 %, zusammen 47.68 %
	// von 50.00 %; aus den gedruckten Monaten 95.36 % (ungerundet 95.35 %) (#232)
	it('rechnet den Anteil aus den auf zwei Stellen gerundeten Monatsanteilen', async () => {
		const pct = [18, 14, 11, 5, 2, 0, 0, 0, 2, 8, 14, 26];
		const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
		const shares = Object.fromEntries(months.map((month, i) => [`${month}Pct`, String(pct[i])]));
		const winter = await createHeatingProfile({ name: `Winter ${crypto.randomUUID()}`, type: 'custom', ...shares } as Parameters<typeof createHeatingProfile>[0]);

		const result = await handleMidYearMoves(winter.id, new Date('2024-01-05'), null, year.start, new Date('2024-06-30'), 1000);
		await deleteHeatingProfile(winter.id);

		expect(result).toMatchObject({ byDays: false, percentage: 95.36, share: 953.6, periodPercentage: 50 });
		// the split January with its share in the profile and its days, for the PDF (#451, point 3)
		expect((result as { monthBreakdown: unknown[] }).monthBreakdown.slice(0, 2)).toEqual([{ month: 1, percentage: 15.68, full: 18, days: 27, total: 31 }, { month: 2, percentage: 14 }]);
	});

	// Ein Profil darf 100 % ± 0.1 ergeben: bei 100.10 % teilt auch ein ganzes Jahr, 50.10 / 100.10 = 50.05 % (#232, M-2)
	it('teilt auch über ein ganzes Jahr durch die Summe der Periode, wenn das Profil nicht genau 100 % ergibt', async () => {
		const pct = [10, 10, 10, 10, 10, 0, 0, 0, 0.1, 10, 20, 20];
		const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
		const shares = Object.fromEntries(months.map((month, i) => [`${month}Pct`, String(pct[i])]));
		const near = await createHeatingProfile({ name: `Fast ${crypto.randomUUID()}`, type: 'custom', ...shares } as Parameters<typeof createHeatingProfile>[0]);

		const result = await handleMidYearMoves(near.id, new Date('2024-07-01'), null, year.start, year.end, 1000);
		await deleteHeatingProfile(near.id);

		expect(result).toMatchObject({ byDays: false, percentage: 50.05, periodPercentage: 100.1 });
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
