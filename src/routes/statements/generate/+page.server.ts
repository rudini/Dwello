import type { Building, Category, DistributionKey, HeatingProfile } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface GenerateStatementData {
	buildings: (Building & { apartmentCount: number })[];
	categories: Category[];
	distributionKeys: DistributionKey[];
	heatingProfiles: HeatingProfile[];
	defaultPeriod: {
		start: string;
		end: string;
	};
}

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }): Promise<GenerateStatementData> => {
	try {
		const [buildingsRes, categoriesRes, distributionKeysRes, heatingProfilesRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/categories?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/distribution-keys?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/heating-profiles?limit=100`)
		]);

		const buildingsData = buildingsRes.ok ? await buildingsRes.json() : { buildings: [], data: [] };
		const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { data: [] };
		const distributionKeysData = distributionKeysRes.ok ? await distributionKeysRes.json() : { data: [] };
		const heatingProfilesData = heatingProfilesRes.ok ? await heatingProfilesRes.json() : { data: [] };

		const buildings = (buildingsData.buildings || buildingsData.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: b.name || '',
			address: b.address || '',
			postalCode: b.postalCode || '',
			city: b.city || '',
			apartmentCount: b.apartmentCount ? Number(b.apartmentCount) : (b._count as { apartments: number })?.apartments || 0
		}));

		const categories: Category[] = (categoriesData.data || []).map((c: Record<string, unknown>) => ({
			id: c.id,
			name: c.name || '',
			isAllowedUtilityCost: c.isAllowedUtilityCost ?? true,
			sortOrder: c.sortOrder ? Number(c.sortOrder) : 0
		}));

		const distributionKeys: DistributionKey[] = (distributionKeysData.data || []).map((dk: Record<string, unknown>) => ({
			id: dk.id,
			name: dk.name || '',
			type: dk.type || 'predefined',
			isActive: dk.isActive ?? true
		}));

		const heatingProfiles: HeatingProfile[] = (heatingProfilesData.data || []).map((hp: Record<string, unknown>) => ({
			id: hp.id,
			name: hp.name || '',
			type: hp.type || 'predefined',
			description: hp.description || '',
			isActive: hp.isActive ?? true,
			monthlyPercentages: hp.monthlyPercentages || {
				january: parseFloat(hp.januaryPct as string) || 0,
				february: parseFloat(hp.februaryPct as string) || 0,
				march: parseFloat(hp.marchPct as string) || 0,
				april: parseFloat(hp.aprilPct as string) || 0,
				may: parseFloat(hp.mayPct as string) || 0,
				june: parseFloat(hp.junePct as string) || 0,
				july: parseFloat(hp.julyPct as string) || 0,
				august: parseFloat(hp.augustPct as string) || 0,
				september: parseFloat(hp.septemberPct as string) || 0,
				october: parseFloat(hp.octoberPct as string) || 0,
				november: parseFloat(hp.novemberPct as string) || 0,
				december: parseFloat(hp.decemberPct as string) || 0
			}
		}));

		// Default to previous calendar year
		const currentYear = new Date().getFullYear();
		const defaultPeriod = {
			start: `${currentYear - 1}-01-01`,
			end: `${currentYear - 1}-12-31`
		};

		return {
			buildings,
			categories,
			distributionKeys,
			heatingProfiles,
			defaultPeriod
		};
	} catch (err) {
		console.error('Failed to fetch data for statement generation:', err);
		const currentYear = new Date().getFullYear();
		return {
			buildings: [],
			categories: [],
			distributionKeys: [],
			heatingProfiles: [],
			defaultPeriod: {
				start: `${currentYear - 1}-01-01`,
				end: `${currentYear - 1}-12-31`
			}
		};
	}
};
