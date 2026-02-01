import type { Category } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface CategoryWithUsage extends Category {
	usageCount: number;
}

interface CategoriesListData {
	categories: CategoryWithUsage[];
	total: number;
}

export const load = async ({ fetch }: { fetch: typeof globalThis.fetch }): Promise<CategoriesListData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/categories?limit=100`);

		if (!response.ok) {
			console.error('Failed to fetch categories:', response.status);
			return { categories: [], total: 0 };
		}

		const data = await response.json();

		const categories: CategoryWithUsage[] = (data.categories || data.data || []).map((c: Record<string, unknown>) => ({
			id: c.id,
			name: c.name || '',
			nameDE: c.nameDE || c.name || '',
			nameFR: c.nameFR || '',
			nameIT: c.nameIT || '',
			nameEN: c.nameEN || '',
			isAllowedUtilityCost: c.isAllowedUtilityCost ?? true,
			description: c.description || '',
			sortOrder: c.sortOrder ? Number(c.sortOrder) : 0,
			usageCount: c.usageCount ? Number(c.usageCount) : 0
		}));

		return {
			categories,
			total: data.total || categories.length
		};
	} catch (err) {
		console.error('Failed to fetch categories:', err);
		return { categories: [], total: 0 };
	}
};
