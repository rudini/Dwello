import { describe, expect, it } from 'vitest';
import { affectedRoutes } from '../ui-screenshots/affected-routes';

const sources: Record<string, string> = {
	'src/app.html': '',
	'src/routes/+layout.svelte': "import '../styles/app.css';",
	'src/routes/+page.svelte': '',
	'src/routes/buildings/+page.svelte': "import Card from '$lib/components/Card.svelte';",
	'src/routes/buildings/[id]/+page.svelte':
		"import BuildingForm from '$lib/components/BuildingForm.svelte';",
	'src/routes/buildings/[id]/+page.server.ts': '',
	'src/routes/tenants/+layout.svelte': '',
	'src/routes/tenants/+page.svelte': "import { formatName } from '$lib/stores';",
	'src/routes/tenants/new/+page.svelte': '',
	'src/lib/components/Card.svelte': '',
	'src/lib/components/BuildingForm.svelte':
		"import Card from './Card.svelte'; import { label } from '$lib/building';",
	'src/lib/building.ts': '',
	'src/lib/stores/index.ts': '',
	'src/styles/app.css': '',
	'src/__tests__/card.test.ts': "import Card from '$lib/components/Card.svelte';"
};
const routes = (...changed: string[]) =>
	affectedRoutes(changed, Object.keys(sources), (file) => sources[file]);
const all = ['/', '/buildings', '/buildings/[id]', '/tenants', '/tenants/new'];

describe('affectedRoutes', () => {
	it('captures a changed page and the page its load function belongs to', () => {
		expect(
			routes('src/routes/buildings/+page.svelte', 'src/routes/buildings/[id]/+page.server.ts')
		).toEqual(['/buildings', '/buildings/[id]']);
	});

	it('captures every page importing a changed component, also through other components', () => {
		expect(routes('src/lib/components/Card.svelte')).toEqual(['/buildings', '/buildings/[id]']);
	});

	it('captures pages importing a changed module by its extensionless or index path', () => {
		expect(routes('src/lib/building.ts')).toEqual(['/buildings/[id]']);
		expect(routes('src/lib/stores/index.ts')).toEqual(['/tenants']);
	});

	it('captures every page below a changed layout', () => {
		expect(routes('src/routes/tenants/+layout.svelte')).toEqual(['/tenants', '/tenants/new']);
	});

	it('captures every page when the app shell or global styles change', () => {
		expect(routes('src/app.html')).toEqual(all);
		expect(routes('src/styles/app.css')).toEqual(all);
	});

	it('ignores tests and files outside the frontend', () => {
		expect(routes('src/__tests__/card.test.ts', 'backend/src/index.ts', 'README.md')).toEqual([]);
	});
});
