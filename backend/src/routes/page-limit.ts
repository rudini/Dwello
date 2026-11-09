/** A list's `limit` query: `all` lists every record, for a BFF load whose result needs them all (#1337) */
export const pageLimit = (limit?: string) => (limit === 'all' ? null : limit ? parseInt(limit, 10) : undefined);
