import { describe, expect, it } from 'vitest';
import { load as categoriesLoad } from '../routes/config/categories/+page.server';
import { load as buildingLoad } from '../routes/buildings/[id]/+page.server';
import { namesById } from '../lib/server/statement';
import categoryList from '../../tests/contracts/categories.json';
import building from '../../tests/contracts/building.json';
import fuelStocks from '../../tests/contracts/fuel-stocks.json';
import { overLimit, page } from './helpers/paged-list';

// #585, #1337: the backend sends at most as many categories as asked for, counting every category
const many = overLimit((i) => ({
	...categoryList.categories[0],
	id: `c${i}`,
	nameDE: `Kategorie ${i}`,
	isFuel: true
}));

const fetch = (async (url: string) => {
	const { pathname } = new URL(url);
	if (pathname.endsWith('/categories')) return Response.json({ categories: page(url, many) });
	if (pathname.endsWith('/fuel-stocks'))
		return Response.json([{ ...fuelStocks[0], categoryId: 'c1000' }]);
	if (pathname.endsWith('/apartments')) return Response.json({ apartments: [] });
	return Response.json(building);
}) as typeof globalThis.fetch;

describe('Listen mit mehr als 1000 Kategorien', () => {
	it('nennt auf der Seite «Kategorien» jede Kategorie', async () => {
		const data = (await categoriesLoad({ fetch } as never)) as { categories: unknown[] };
		expect(data.categories).toHaveLength(1001);
	});

	it('nennt auf der Gebäudeseite jede Kategorie für Brennstoff, auch die eines Tankbestands', async () => {
		const data = (await buildingLoad({ params: { id: building.id }, fetch } as never)) as {
			heatingCategories: unknown[];
			fuelStocks: { categoryName: string }[];
		};
		expect(data.fuelStocks[0].categoryName).toBe('Kategorie 1000');
		expect(data.heatingCategories).toHaveLength(1001);
	});

	it('nennt in den Abrechnungen jede Kategorie beim Namen', async () => {
		expect((await namesById(fetch, 'categories')).get('c1000')).toBe('Kategorie 1000');
	});
});
