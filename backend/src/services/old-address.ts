import { sql, type SQLWrapper } from 'drizzle-orm';
import { sqlToday } from './today';

// Street and postal code as the landlord may have typed them: case and extra spaces do not count
const normalized = (column: string) => sql.raw(`lower(regexp_replace(btrim(${column}), '\\s+', ' ', 'g'))`);

/**
 * A-5 (#114): the contract's tenant has moved out (the contract ended before today and no contract of the tenant runs
 * today) and his Korrespondenzadresse is still the building's, so a statement would go to the apartment he left. An
 * agreed end counts once given notice or «Mieter ist ausgezogen» (A-6, #115): before, the tenant may have stayed and
 * the contract run on
 */
export const oldAddress = (contractId: SQLWrapper) => sql<boolean>`exists (
	select 1 from rental_contracts c
	join tenants t on t.id = c.tenant_id
	join apartments a on a.id = c.apartment_id
	join buildings b on b.id = a.building_id
	where c.id = ${contractId} and c.end_date < ${sqlToday} and (c.terminated or c.moved_out)
		and not exists (
			select 1 from rental_contracts r
			where r.tenant_id = c.tenant_id and r.start_date <= ${sqlToday} and (r.end_date is null or r.end_date >= ${sqlToday})
		)
		and ${normalized('t.address')} = ${normalized('b.address')}
		and ${normalized('t.postal_code')} = ${normalized('b.postal_code')}
)`;
