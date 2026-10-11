import type { Actor } from '../fixtures/actor';
import type { TestData } from '../fixtures/backend';

type Contract = { id: string; startDate: string; endDate: string | null; tenantName: string };
type RunOptions = { heatingProfileId?: string; managementFeePercent?: number; managementFeeKey?: string };

// API protocol driver for a generation run: the backend calculates the statement of every contract of the building
// in the year without a statement in it, like the generation wizard does through the BFF
async function run(seed: TestData, year: number, buildingId: string, options: RunOptions) {
	const [periodStart, periodEnd] = [`${year}-01-01`, `${year}-12-31`];
	const keys = (await seed.backend.get('distribution-keys?limit=100')).data as { id: string; nameDE: string }[];
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
			managementFeePercent: options.managementFeePercent,
			managementFeeDistributionKeyId: keys.find((k) => k.nameDE === options.managementFeeKey)?.id
		}
	};
}

/** Preview: remembers the total costs per tenant for `previewTotals` */
export const openPreviewViaApi =
	(seed: TestData, year: number, buildingId: string, options: RunOptions = {}) =>
	async (actor: Actor) => {
		const { contracts, body } = await run(seed, year, buildingId, options);
		const totals = new Map<string, number>();
		for (const contract of contracts) {
			const preview = await seed.backend.post('statements/preview', { ...body, contractId: contract.id });
			totals.set(contract.tenantName, Number(preview.totalCosts));
		}
		actor.remember('preview', totals);
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
export const createdStatements = (actor: Actor) => actor.recall<number>('created');

// "CHF 1’250.50" → 1250.5
export const francs = (amount: string) => Number(amount.replace(/[^\d.]/g, ''));
