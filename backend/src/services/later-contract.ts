import { and, eq, gt } from 'drizzle-orm';
import { db } from '../db/connection';
import { rentalContracts } from '../db/schema';

/** Whether the apartment has a contract starting after the day (YYYY-MM-DD): the tenant moved out by then (A-4, A-6) */
export async function laterContract(apartmentId: string, day: string) {
	const [later] = await db
		.select({ id: rentalContracts.id })
		.from(rentalContracts)
		.where(and(eq(rentalContracts.apartmentId, apartmentId), gt(rentalContracts.startDate, day)))
		.limit(1);
	return Boolean(later);
}
