/**
 * #1201: a text longer than its varchar column, refused at its field as the invoice forms do since #743; without the
 * check the database refused it and the form showed only its general save error
 */
import { getTableColumns, type Table } from 'drizzle-orm';
import { fieldsRefused, type ErrorCode } from './coded-error';

/** Each entered text longer than its column of `table`, as `field` names it; characters as PostgreSQL counts them */
export function tooLongErrors(table: Table, entered: object, field = (key: string) => key): ErrorCode[] {
	const values = entered as Record<string, unknown>;
	return Object.entries(getTableColumns(table)).flatMap(([key, column]) => {
		const max = (column as { length?: number }).length;
		const value = values[key];
		return max && typeof value === 'string' && [...value].length > max
			? [{ code: 'TEXT_TOO_LONG', params: { field: field(key), max } }]
			: [];
	});
}

/** The form's `errors`, then each text too long for its column at a field without an error: one per field, as before */
export const withTooLong = (errors: ErrorCode[], table: Table, entered: object, field?: (key: string) => string) => [
	...errors,
	...tooLongErrors(table, entered, field).filter((long) => !errors.some((error) => error.params.field === long.params.field))
];

/** A route's beforeHandle: refuses a body with a text longer than its column, every such field at once */
export const refuseTooLong =
	(table: Table) =>
	({ body, set }: { body: unknown; set: { status?: number | string } }) => {
		const errors = tooLongErrors(table, body as object);
		if (!errors.length) return;
		set.status = 400;
		return fieldsRefused(errors);
	};
