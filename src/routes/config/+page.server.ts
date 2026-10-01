import { toHeatingProfile } from '$lib/server/heating-profile';
import type { SystemConfig, HeatingProfile, DistributionKey, ConfigPageData } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }): Promise<ConfigPageData> => {
	try {
		const [configRes, heatingProfilesRes, distributionKeysRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/config`),
			fetch(`${BACKEND_URL}/api/v1/heating-profiles?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/distribution-keys?limit=100`)
		]);

		const configData = configRes.ok ? await configRes.json() : null;
		const heatingProfilesData = heatingProfilesRes.ok ? await heatingProfilesRes.json() : { data: [] };
		const distributionKeysData = distributionKeysRes.ok ? await distributionKeysRes.json() : { data: [] };

		const config: SystemConfig = configData ? {
			id: configData.id || 'config-001',
			accountingPeriod: configData.accountingPeriod || 'calendar',
			managementFeePercentage: configData.managementFeePercentage ? Number(configData.managementFeePercentage) : 3,
			defaultHeatingProfileId: configData.defaultHeatingProfileId || '',
			defaultDistributionKeyId: configData.defaultDistributionKeyId || '',
			companyName: configData.companyName || '',
			companyAddress: configData.companyAddress || '',
			iban: configData.iban || '',
			updatedAt: configData.updatedAt || new Date().toISOString()
		} : {
			id: 'config-001',
			accountingPeriod: 'calendar',
			managementFeePercentage: 3,
			defaultHeatingProfileId: '',
			defaultDistributionKeyId: '',
			companyName: '',
			companyAddress: '',
			iban: '',
			updatedAt: new Date().toISOString()
		};

		const heatingProfiles: HeatingProfile[] = (heatingProfilesData.data || []).map(toHeatingProfile);

		const distributionKeys: DistributionKey[] = (distributionKeysData.data || []).map((dk: Record<string, unknown>) => ({
			id: dk.id,
			name: dk.name || '',
			type: dk.type || 'predefined',
			formula: dk.formula || undefined,
			description: dk.description || '',
			isActive: dk.isActive ?? true
		}));

		return {
			config,
			heatingProfiles,
			distributionKeys
		};
	} catch (err) {
		console.error('Failed to fetch config:', err);
		return {
			config: {
				id: 'config-001',
				accountingPeriod: 'calendar',
				managementFeePercentage: 3,
				defaultHeatingProfileId: '',
				defaultDistributionKeyId: '',
				companyName: '',
				companyAddress: '',
				iban: '',
				updatedAt: new Date().toISOString()
			},
			heatingProfiles: [],
			distributionKeys: []
		};
	}
};
