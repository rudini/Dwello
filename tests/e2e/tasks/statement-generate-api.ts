import type { Actor } from '../fixtures/actor';
import type { TestData } from '../fixtures/backend';

type Contract = { id: string; startDate: string; endDate: string | null; tenantName: string };

/**
 * API protocol driver for the preview of a generation run: the statement of every contract of the building in the
 * year, calculated by the backend. Remembers the total costs per tenant for `previewTotalOf`.
 */
export const openPreviewViaApi =
	(seed: TestData, year: number, buildingId: string, managementFeePercent: number, keyName: string) =>
	async (actor: Actor) => {
		const [periodStart, periodEnd] = [`${year}-01-01`, `${year}-12-31`];
		const keys = (await seed.backend.get('distribution-keys?limit=100')).data as { id: string; nameDE: string }[];
		const { contracts } = (await seed.backend.get(`contracts?buildingId=${buildingId}&limit=1000`)) as {
			contracts: Contract[];
		};
		const totals = new Map<string, number>();
		for (const contract of contracts.filter((c) => c.startDate <= periodEnd && (!c.endDate || c.endDate >= periodStart))) {
			const preview = await seed.backend.post('statements/preview', {
				contractId: contract.id,
				periodStart,
				periodEnd,
				managementFeePercent,
				managementFeeDistributionKeyId: keys.find((k) => k.nameDE === keyName)?.id
			});
			totals.set(contract.tenantName, Number(preview.totalCosts));
		}
		actor.remember('preview', totals);
	};

export const previewTotalOf = (actor: Actor, tenantName: string) =>
	actor.recall<Map<string, number>>('preview').get(tenantName);
