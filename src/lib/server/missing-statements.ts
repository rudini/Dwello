const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Row = Record<string, unknown>;
type Range = { start: string; end: string };

/**
 * Per contract id, the parts of ended Abrechnungsperioden without a statement, as on the contract page (#211); the
 * backend decides them (H-28). Null when they cannot be read: better no hint than a wrong one
 */
export async function missingByContract(
	fetch: typeof globalThis.fetch,
	contracts: Row[]
): Promise<Map<string, Range[]> | null> {
	const response = await fetch(`${BACKEND_URL}/api/v1/contracts/missing-statements`).catch(
		() => null
	);
	if (!response?.ok) return null;
	const missing: Record<string, Range[]> = await response.json();
	return new Map(contracts.map((c) => [String(c.id), missing[String(c.id)] ?? []]));
}
