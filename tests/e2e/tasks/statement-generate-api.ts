import type { Actor } from '../fixtures/actor';
import type { TestData } from '../fixtures/backend';

type Contract = { id: string; startDate: string; endDate: string | null; tenantName: string };
type RunOptions = { heatingProfileId?: string; managementFeePercent?: number };

// API protocol driver for a generation run: the backend calculates the statement of every contract of the building
// in the year without a statement in it, like the generation wizard does through the BFF
async function run(seed: TestData, year: number, buildingId: string, options: RunOptions) {
	const [periodStart, periodEnd] = [`${year}-01-01`, `${year}-12-31`];
	const { contracts } = (await seed.backend.get(`contracts?buildingId=${buildingId}&limit=1000`)) as {
		contracts: Contract[];
	};
	const { data: statements } = (await seed.backend.get(`statements?buildingId=${buildingId}&limit=1000`)) as {
		data: { contractId: string; periodStart: string; periodEnd: string }[];
	};
	const billed = new Set(
		statements.filter((s) => s.periodStart <= periodEnd && s.periodEnd >= periodStart).map((s) => s.contractId)
	);
	return {
		contracts: contracts.filter(
			(c) => c.startDate <= periodEnd && (!c.endDate || c.endDate >= periodStart) && !billed.has(c.id)
		),
		body: {
			periodStart,
			periodEnd,
			heatingProfileId: options.heatingProfileId,
			managementFeePercent: options.managementFeePercent
		}
	};
}

/** Preview: remembers the total costs and the Saldo per tenant for `previewTotals` and `previewBalances` */
export const openPreviewViaApi =
	(seed: TestData, year: number, buildingId: string, options: RunOptions = {}) =>
	async (actor: Actor) => {
		const { contracts, body } = await run(seed, year, buildingId, options);
		const totals = new Map<string, number>();
		const balances = new Map<string, number>();
		for (const contract of contracts) {
			const preview = await seed.backend.post('statements/preview', { ...body, contractId: contract.id });
			totals.set(contract.tenantName, Number(preview.totalCosts));
			balances.set(contract.tenantName, Number(preview.balance));
		}
		actor.remember('preview', totals);
		actor.remember('balances', balances);
	};

/** Generation: remembers how many statements were created for `createdStatements` */
export const generateStatementsViaApi =
	(seed: TestData, year: number, buildingId: string) => async (actor: Actor) => {
		const { contracts, body } = await run(seed, year, buildingId, {});
		for (const contract of contracts) {
			await seed.backend.post('statements/generate', { ...body, contractId: contract.id, buildingId });
		}
		actor.remember('created', contracts.length);
	};

export const previewTotals = (actor: Actor) => actor.recall<Map<string, number>>('preview');
export const previewBalances = (actor: Actor) => actor.recall<Map<string, number>>('balances');
export const createdStatements = (actor: Actor) => actor.recall<number>('created');

// "CHF 1’250.50" → 1250.5
export const francs = (amount: string) => Number(amount.replace(/[^\d.]/g, ''));
