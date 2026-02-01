import type { DistributionKey } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface DistributionKeysData {
	keys: DistributionKey[];
	total: number;
}

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }): Promise<DistributionKeysData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/distribution-keys?limit=100`);

		if (!response.ok) {
			console.error('Failed to fetch distribution keys:', response.status);
			return { keys: [], total: 0 };
		}

		const data = await response.json();

		const keys: DistributionKey[] = (data.data || []).map((d: Record<string, unknown>) => ({
			id: d.id,
			name: d.name || '',
			type: d.type || 'predefined',
			formula: d.formula || undefined,
			description: d.description || '',
			isActive: d.isActive ?? true
		}));

		return {
			keys,
			total: data.total || keys.length
		};
	} catch (err) {
		console.error('Failed to fetch distribution keys:', err);
		return { keys: [], total: 0 };
	}
};
