import { type GenerationRequest, generateStatements, previewStatements } from '../../../src/lib/server/statement-generation';
import { CallTheApi } from '../screenplay/abilities';
import type { Activity } from '../screenplay/actor';

export type RunOptions = { heatingProfileId?: string; managementFeePercent?: number; periodStart?: string; periodEnd?: string };

// What the API protocol driver remembers for the questions in questions/statement-generate.ts
export const PREVIEW_TOTALS = 'preview';
export const PREVIEW_BALANCES = 'balances';
export const CREATED_STATEMENTS = 'created';

// API protocol driver for a generation run: the BFF's own server code (src/lib/server/statement-generation.ts), the
// one the generation wizard calls, picks the contracts of the building and the year and asks the backend; so the
// API run checks the system's selection, not a copy of it in the test
const run = (year: number, buildingId: string, options: RunOptions) =>
	({
		buildingIds: [buildingId],
		periodStart: `${year}-01-01`,
		periodEnd: `${year}-12-31`,
		...options // a profile or fee the scenario does not name stays out of the request
	}) as GenerationRequest;

/** Preview: remembers the total costs and the Saldo per tenant */
export const openPreviewViaApi =
	(year: number, buildingId: string, options: RunOptions = {}): Activity =>
	async (actor) => {
		const rows = await previewStatements(actor.abilityTo(CallTheApi).fetch, run(year, buildingId, options));
		actor.remember(PREVIEW_TOTALS, new Map(rows.map((row) => [row.tenantName, row.totalCosts])));
		actor.remember(PREVIEW_BALANCES, new Map(rows.map((row) => [row.tenantName, row.balance])));
	};

/** Generation: remembers how many statements the system reports as created */
export const generateStatementsViaApi =
	(year: number, buildingId: string): Activity =>
	async (actor) =>
		actor.remember(
			CREATED_STATEMENTS,
			await generateStatements(actor.abilityTo(CallTheApi).fetch, run(year, buildingId, {}))
		);
