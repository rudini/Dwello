import type { PgSelect } from 'drizzle-orm/pg-core';

/** A page of the query's rows; `limit` null or undefined: every row, for a service whose result needs them all (#705, #1229) */
export const paged = <T extends PgSelect>(query: T, limit: number | null | undefined, offset: number) =>
	(limit == null ? query : query.limit(limit)).offset(offset);
