import { mockBuildings } from '$lib/server/mockData';

interface NewApartmentPageData {
	buildings: Array<{ id: string; name: string; address: string }>;
	presetBuildingId: string | null;
}

export const load = async ({ url }): Promise<NewApartmentPageData> => {
	const presetBuildingId = url.searchParams.get('building');

	// Transform buildings for the dropdown
	const buildings = mockBuildings.map((b) => ({
		id: b.id,
		name: b.name || `${b.address}, ${b.city}`,
		address: `${b.address}, ${b.postalCode} ${b.city}`
	}));

	return {
		buildings,
		presetBuildingId
	};
};
