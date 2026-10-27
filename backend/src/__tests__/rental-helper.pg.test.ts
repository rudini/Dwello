/**
 * #684: the test helper createRental().remove() fails when a delete is refused, so a test that leaves records
 * behind in dwello_test says so (real PostgreSQL database)
 */

import { describe, expect, it } from 'bun:test';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { deleteBuilding } from '../services/building.service';
import { createRental } from './helpers/rental';

describe('createRental().remove()', () => {
	it('scheitert, wenn das Löschen eines Datensatzes abgelehnt wird', async () => {
		const rental = await createRental(crypto.randomUUID(), { startDate: '2099-01-01', monthlyAdvancePayment: '200' });
		const other = await createApartment({ buildingId: rental.building, number: '3.01', floor: 3, area: '60', rooms: '2.5' });

		await expect(rental.remove()).rejects.toThrow(/building/i);

		await deleteApartment(other.id);
		await deleteBuilding(rental.building);
	});
});
