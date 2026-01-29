import type { BuildingsListData } from '$lib/types';
import { mockBuildings } from '$lib/server/mockData';

export const load = async ({ url }: { url: URL }): Promise<BuildingsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
	const search = url.searchParams.get('search') || '';
	const city = url.searchParams.get('city') || '';

	// In production, this would fetch from the backend API via the proxy
	// const response = await fetch(`/api/buildings?page=${page}&pageSize=${pageSize}&search=${search}&city=${city}`);
	// const data = await response.json();

	// Filter by search term
	let filteredBuildings = [...mockBuildings];
	if (search) {
		const searchLower = search.toLowerCase();
		filteredBuildings = filteredBuildings.filter(
			(b) =>
				b.name?.toLowerCase().includes(searchLower) ||
				b.address.toLowerCase().includes(searchLower) ||
				b.city.toLowerCase().includes(searchLower)
		);
	}

	// Filter by city
	if (city) {
		filteredBuildings = filteredBuildings.filter((b) =>
			b.city.toLowerCase().includes(city.toLowerCase())
		);
	}

	// Paginate
	const start = (page - 1) * pageSize;
	const paginatedBuildings = filteredBuildings.slice(start, start + pageSize);

	return {
		buildings: paginatedBuildings,
		total: filteredBuildings.length,
		page,
		pageSize
	};
};
