import { CallTheApi } from '../screenplay/abilities';
import type { Activity, Actor } from '../screenplay/actor';

type Contract = { id: string; startDate: string; endDate: string | null; tenantName: string };
export type RunOptions = { heatingProfileId?: string; managementFeePercent?: number };

// What the API protocol driver remembers for the questions in questions/statement-generate.ts
export const PREVIEW_TOTALS = 'preview';
export const PREVIEW_BALANCES = 'balances';
export const CREATED_STATEMENTS = 'created';

// API protocol driver for a generation run: the backend calculates the statement of every contract of the building
// in the year without a statement in it, like the generation wizard does through the BFF
async function run(actor: Actor, year: number, buildingId: string, options: RunOptions) {
	const { backend } = actor.abilityTo(CallTheApi);
	const [periodStart, periodEnd] = [`${year}-01-01`, `${year}-12-31`];
	const { contracts } = (await backend.get(`contracts?buildingId=${buildingId}&limit=1000`)) as {
		contracts: Contract[];
	};
	const { data: statements } = (await backend.get(`statements?buildingId=${buildingId}&limit=1000`)) as {
		data: { contractId: string; periodStart: string; periodEnd: string }[];
	};
	const billed = new Set(
		statements.filter((s) => s.periodStart <= periodEnd && s.periodEnd >= periodStart).map((s) => s.contractId)
	);
	return {
		backend,
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

/** Preview: remembers the total costs and the Saldo per tenant */
export const openPreviewViaApi =
	(year: number, buildingId: string, options: RunOptions = {}): Activity =>
	async (actor) => {
		const { backend, contracts, body } = await run(actor, year, buildingId, options);
		const totals = new Map<string, number>();
		const balances = new Map<string, number>();
		for (const contract of contracts) {
			const preview = await backend.post('statements/preview', { ...body, contractId: contract.id });
			totals.set(contract.tenantName, Number(preview.totalCosts));
			balances.set(contract.tenantName, Number(preview.balance));
		}
		actor.remember(PREVIEW_TOTALS, totals);
		actor.remember(PREVIEW_BALANCES, balances);
	};

/** Generation: remembers how many statements were created */
export const generateStatementsViaApi =
	(year: number, buildingId: string): Activity =>
	async (actor) => {
		const { backend, contracts, body } = await run(actor, year, buildingId, {});
		for (const contract of contracts) {
			await backend.post('statements/generate', { ...body, contractId: contract.id, buildingId });
		}
		actor.remember(CREATED_STATEMENTS, contracts.length);
	};

// "CHF 1’250.50" → 1250.5
export const francs = (amount: string) => Number(amount.replace(/[^\d.]/g, ''));
