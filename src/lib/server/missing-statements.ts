import { missingPeriods, type AccountingPeriodType } from '$lib/accounting-period';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Row = Record<string, unknown>;
type Range = { start: string; end: string };

/** The kind of Abrechnungsperiode the settings define; null when they cannot be read */
export async function periodType(fetch: typeof globalThis.fetch) {
	const config = await fetch(`${BACKEND_URL}/api/v1/config`).catch(() => null);
	if (!config?.ok) return null;
	return (
		((await config.json()).data?.accounting_period as AccountingPeriodType | undefined) ??
		'calendar'
	);
}

/**
 * Per contract id, the parts of ended Abrechnungsperioden without a statement, as on the contract page (#211); null
 * when the settings or the statements cannot be read: better no hint than a wrong one
 */
export async function missingByContract(
	fetch: typeof globalThis.fetch,
	contracts: Row[]
): Promise<Map<string, Range[]> | null> {
	// ponytail: every statement in one list; under 50 apartments that stays far below the limit
	const [type, response] = await Promise.all([
		periodType(fetch),
		fetch(`${BACKEND_URL}/api/v1/statements?limit=1000`).catch(() => null)
	]);
	if (!type || !response?.ok) return null;
	const statements: Row[] = (await response.json()).data ?? [];
	type Statements = Parameters<typeof missingPeriods>[2];
	return new Map(
		contracts.map((c) => [
			String(c.id),
			missingPeriods(
				type,
				c as Parameters<typeof missingPeriods>[1],
				statements.filter((s) => s.contractId === c.id) as Statements
			)
		])
	);
}
