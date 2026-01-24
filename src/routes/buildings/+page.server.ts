import type { BuildingsListData, BuildingWithStats } from '$lib/types';

export const load = async ({ url }: { url: URL }): Promise<BuildingsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
	const search = url.searchParams.get('search') || '';
	const city = url.searchParams.get('city') || '';

	// Mock data - in production, this would fetch from the backend API via the proxy
	// const response = await fetch(`/api/buildings?page=${page}&pageSize=${pageSize}&search=${search}&city=${city}`);
	// const data = await response.json();

	// Mock buildings for development
	const mockBuildings: BuildingWithStats[] = [
		{
			id: 'building-001',
			name: 'Musterhaus Zentrum',
			address: 'Musterstraße 12',
			postalCode: '8000',
			city: 'Zürich',
			canton: 'ZH',
			country: 'Switzerland',
			latitude: 47.3769,
			longitude: 8.5417,
			buildingType: 'Mehrfamilienhaus',
			yearBuilt: 1985,
			apartmentCount: 8,
			occupiedCount: 7,
			vacantCount: 1
		},
		{
			id: 'building-002',
			name: 'Seepark Residenz',
			address: 'Seestrasse 45',
			postalCode: '6004',
			city: 'Luzern',
			canton: 'LU',
			country: 'Switzerland',
			latitude: 47.0502,
			longitude: 8.3093,
			buildingType: 'Mehrfamilienhaus',
			yearBuilt: 2010,
			apartmentCount: 12,
			occupiedCount: 12,
			vacantCount: 0
		},
		{
			id: 'building-003',
			name: 'Alpenblick',
			address: 'Bergweg 7',
			postalCode: '3012',
			city: 'Bern',
			canton: 'BE',
			country: 'Switzerland',
			latitude: 46.9480,
			longitude: 7.4474,
			buildingType: 'Mehrfamilienhaus',
			yearBuilt: 1972,
			apartmentCount: 6,
			occupiedCount: 5,
			vacantCount: 1
		},
		{
			id: 'building-004',
			name: 'Sonnenhof',
			address: 'Bahnhofstrasse 88',
			postalCode: '4051',
			city: 'Basel',
			canton: 'BS',
			country: 'Switzerland',
			latitude: 47.5596,
			longitude: 7.5886,
			buildingType: 'Geschäftshaus',
			yearBuilt: 1995,
			apartmentCount: 4,
			occupiedCount: 3,
			vacantCount: 1
		}
	];

	// Filter by search term
	let filteredBuildings = mockBuildings;
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
