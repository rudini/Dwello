/**
 * Statement numbers count up per building and year (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { deleteStatement, generateStatement } from '../services/statement.service';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
const generated: string[] = [];

const generate = async (periodStart: string, periodEnd: string) => {
	const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart, periodEnd });
	generated.push(statement.id);
	return statement;
};

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', monthlyAdvancePayment: '150' });
});

afterAll(async () => {
	for (const id of generated) await deleteStatement(id);
	await rental.remove();
});

describe('Abrechnungsnummer', () => {
	// Die Nummer muss eindeutig sein; eine zufällige Endung kollidierte gelegentlich
	it('zählt pro Gebäude und Jahr hoch und vergibt eine gelöschte Nummer nicht neu', async () => {
		const prefix = `NK-${rental.building.substring(0, 8).toUpperCase()}-2024-`;

		const first = await generate('2024-01-01', '2024-06-30');
		const second = await generate('2024-07-01', '2024-12-31');
		await deleteStatement(first.id);
		const third = await generate('2024-01-01', '2024-06-30');

		expect([first, second, third].map((s) => s.statementNumber)).toEqual([`${prefix}0001`, `${prefix}0002`, `${prefix}0003`]);
	});
});
