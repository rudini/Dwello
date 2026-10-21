import { describe, expect, it } from 'vitest';
import { load as categoriesLoad } from '../routes/config/categories/+page.server';
import { load as buildingLoad } from '../routes/buildings/[id]/+page.server';
import { namesById } from '../lib/server/statement';
import categoryList from '../../tests/contracts/categories.json';
import building from '../../tests/contracts/building.json';
import fuelStocks from '../../tests/contracts/fuel-stocks.json';

// #585: the backend sends at most as many categories as asked for, counting every category
const many = Array.from({ length: 150 }, (_, i) => ({
	...categoryList.categories[0],
	id: `c${i}`,
	nameDE: `Kategorie ${i}`,
	isFuel: true
}));

const fetch = (async (url: string) => {
	const { pathname, searchParams } = new URL(url);
	if (pathname.endsWith('/categories'))
		return Response.json({ categories: many.slice(0, Number(searchParams.get('limit') ?? 100)) });
	if (pathname.endsWith('/fuel-stocks'))
		return Response.json([{ ...fuelStocks[0], categoryId: 'c149' }]);
	if (pathname.endsWith('/apartments')) return Response.json({ apartments: [] });
	return Response.json(building);
}) as typeof globalThis.fetch;

describe('Listen mit mehr als 100 Kategorien', () => {
	it('nennt auf der Seite «Kategorien» jede Kategorie', async () => {
		const data = (await categoriesLoad({ fetch } as never)) as { categories: unknown[] };
		expect(data.categories).toHaveLength(150);
	});

	it('nennt auf der Gebäudeseite jede Kategorie für Brennstoff, auch die eines Tankbestands', async () => {
		const data = (await buildingLoad({ params: { id: building.id }, fetch } as never)) as {
			heatingCategories: unknown[];
			fuelStocks: { categoryName: string }[];
		};
		expect(data.fuelStocks[0].categoryName).toBe('Kategorie 149');
		expect(data.heatingCategories).toHaveLength(150);
	});

	it('nennt in den Abrechnungen jede Kategorie beim Namen', async () => {
		expect((await namesById(fetch, 'categories')).get('c149')).toBe('Kategorie 149');
	});
});
