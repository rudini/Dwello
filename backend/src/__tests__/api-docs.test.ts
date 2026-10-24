import { describe, expect, it } from 'bun:test';
import { app } from '../app';

const get = (path: string) => app.handle(new Request(`http://localhost${path}`));

// docs/api-specification.md: the interactive documentation and its OpenAPI JSON, without authentication (#790 swaps the plugin)
describe('API-Dokumentation', () => {
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
});
