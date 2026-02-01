const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface NewApartmentPageData {
	buildings: Array<{ id: string; name: string; address: string }>;
	presetBuildingId: string | null;
}

export const load = async ({ url, fetch }): Promise<NewApartmentPageData> => {
	const presetBuildingId = url.searchParams.get('building');

	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`);
		const data = await response.json();

		const buildings = (data.buildings || data.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: (b.name as string) || `${b.address}, ${b.city}`,
			address: `${b.address}, ${b.postalCode} ${b.city}`
		}));

		return {
			buildings,
			presetBuildingId
		};
	} catch (error) {
		console.error('Failed to fetch buildings:', error);
		return {
			buildings: [],
			presetBuildingId
		};
	}
};
