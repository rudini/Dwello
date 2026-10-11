/** A YYYY-MM-DD date that exists: Elysia's format 'date' lets 2025-02-30 and 2025-1-1 through */
export const isRealDate = (date: string) =>
	/^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(`${date}T00:00:00Z`).toISOString().startsWith(date);
