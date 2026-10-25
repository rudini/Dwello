import { describe, expect, it } from 'bun:test';
import { app } from '../app';
import { callApi } from './helpers/auth';

const get = (path: string) => app.handle(new Request(`http://localhost${path}`));

/** The status of each path in a backend started as in production, in its own process (the app is built at import) */
function statusesInProduction(paths: string[]): number[] {
	const script = `const { app } = await import('./src/app.ts');
for (const path of ${JSON.stringify(paths)}) console.log((await app.handle(new Request('http://localhost' + path))).status);`;
	const run = Bun.spawnSync(['bun', '-e', script], {
		cwd: `${import.meta.dir}/../..`,
		env: { ...process.env, NODE_ENV: 'production' }
	});
	return run.stdout.toString().trim().split('\n').map(Number);
}

// docs/api-specification.md: the interactive documentation and its OpenAPI JSON, without authentication (#790 swaps the plugin)
describe('API-Dokumentation', () => {
	// #720: an installation does not show its API to everyone
	it('gibt es in der Produktion nicht', () => {
		expect(statusesInProduction(['/swagger', '/swagger/json', '/health'])).toEqual([404, 404, 200]);
	});

	it('zeigt die Seite unter /swagger ohne Anmeldung', async () => {
		const response = await get('/swagger');
		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('text/html');
	});

	it('liefert das OpenAPI-JSON mit den Endpunkten, aber ohne die Dokumentation selbst', async () => {
		const spec = (await (await get('/swagger/json')).json()) as {
			info: { title: string };
			paths: object;
		};
		expect(spec.info.title).toBe('Dwello API');
		expect(Object.keys(spec.paths)).toContain('/api/v1/buildings/{id}');
		expect(Object.keys(spec.paths)).not.toContain('/swagger');
	});

	// The plugin brings its own strict formats; the ids of the demo data are no RFC uuids (code review 790a C-1)
	it('lässt die Prüfung der Eingaben, wie sie war', async () => {
		const demoBuilding = '11111111-1111-1111-1111-111111111111';
		const period = 'periodStart=2025-01-01&periodEnd=2025-12-31';
		expect(
			(await callApi(`/api/v1/invoices/completeness/${demoBuilding}?${period}`)).status
		).not.toBe(422);
		expect(
			(
				await callApi(
					`/api/v1/invoices/completeness/${demoBuilding}?periodStart=2025-02-30&periodEnd=2025-12-31`
				)
			).status
		).toBe(400);
	});
});
