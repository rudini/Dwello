/** The records a backend list answers for the url's `limit`, paged as the routes page: `all` every one, else the first `limit` (#1337) */
export function page<T>(url: string, records: T[]) {
	const limit = new URL(url).searchParams.get('limit');
	return limit === 'all' ? records : records.slice(0, Number(limit ?? 20));
}

/** 1001 records, one more than the BFF's former `limit=1000` (#1337) */
export const overLimit = <T>(record: (i: number) => T) =>
	Array.from({ length: 1001 }, (_, i) => record(i));
