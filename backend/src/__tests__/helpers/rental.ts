import { createBuilding, deleteBuilding } from '../../services/building.service';
import { createApartment, deleteApartment } from '../../services/apartment.service';
import { createTenant, deleteTenant } from '../../services/tenant.service';
import { createContract, deleteContract } from '../../services/contract.service';

/**
 * Building "Ahornhof <token>" with apartment 2.01 rented to "Anna Keller <token>" in the real database; the
 * Verwaltungspauschale is agreed unless the test says otherwise (#89)
 */
export async function createRental(token: string, contract: {
	startDate: string;
	endDate?: string;
	monthlyAdvancePayment: string;
	managementFeeAgreed?: boolean;
	managementFeePercent?: string;
}) {
	const building = await createBuilding({
		name: `Ahornhof ${token}`,
		address: 'Testweg 1',
		postalCode: '8400',
		city: 'Winterthur',
		canton: 'ZH'
	});
	const apartment = await createApartment({ buildingId: building.id, number: '2.01', floor: 2, area: '70', rooms: '3.5' });
	const tenant = await createTenant({ firstName: 'Anna', lastName: `Keller ${token}` });
	const rental = await createContract({ apartmentId: apartment.id, tenantId: tenant.id, baseRent: '950', managementFeeAgreed: true, ...contract });

	return {
		building: building.id,
		apartment: apartment.id,
		tenant: tenant.id,
		contract: rental.id,
		// a refused delete leaves records in dwello_test, so it fails the test (#684); one the test removed itself is fine
		async remove() {
			for (const [what, removed] of [
				['contract', () => deleteContract(rental.id, true)],
				['tenant', () => deleteTenant(tenant.id)],
				['apartment', () => deleteApartment(apartment.id)],
				['building', () => deleteBuilding(building.id)]
			] as const) {
				const { success, error } = await removed();
				if (!success && !/not found/.test(error ?? '')) throw new Error(`createRental: ${what} not deleted: ${error}`);
			}
		}
	};
}
