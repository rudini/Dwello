/**
 * The local KI model (#577): on start the backend asks the local Ollama for the model and downloads it when missing,
 * so no command is needed; the overview shows how far the download is. A local Bun.serve stands in for Ollama.
 */

import { afterEach, describe, expect, it } from 'bun:test';
import { loadModel, modelState } from '../services/ki-model.service';

type Server = ReturnType<typeof Bun.serve>;
let ollama: Server | undefined;
afterEach(() => ollama?.stop(true));

const MODEL = 'qwen3-vl:8b-instruct';

function standIn(models: string[], pull: object[] = [], calls: string[] = [], bodies: unknown[] = []) {
	ollama = Bun.serve({
		port: 0,
		fetch: async (request) => {
			const path = new URL(request.url).pathname;
			calls.push(`${request.method} ${path}`);
			if (request.method === 'POST') bodies.push(await request.json());
			if (path === '/api/tags') return Response.json({ models: models.map((name) => ({ name })) });
			if (path === '/api/pull') return new Response(pull.map((line) => `${JSON.stringify(line)}\n`).join(''));
			return new Response(null, { status: 404 });
		}
	});
	return { baseUrl: `http://127.0.0.1:${ollama.port}/v1`, model: MODEL, local: true };
}

describe('KI-Modell der lokalen KI', () => {
	it('lädt nichts, wenn das Modell schon da ist', async () => {
		const calls: string[] = [];
		await loadModel(standIn([MODEL], [], calls));

		expect(modelState()).toEqual({ state: 'ready' });
		expect(calls).toEqual(['GET /api/tags']);
	});

	it('lädt ein fehlendes Modell und meldet es danach bereit', async () => {
		const calls: string[] = [];
		const config = standIn(['anderes:latest'], [{ status: 'pulling manifest' }, { status: 'pulling x', total: 200, completed: 80 }, { status: 'success' }], calls);

		await loadModel(config);

		expect(calls).toEqual(['GET /api/tags', 'POST /api/pull']);
		expect(modelState()).toEqual({ state: 'ready' });
	});

	// fach review 577 R-2: Ollama learns the server's IP address and the model's name, nothing from Dwello
	it('schickt Ollama nur den Namen des Modells', async () => {
		const bodies: unknown[] = [];
		await loadModel(standIn([], [{ status: 'success' }], [], bodies));

		expect(bodies).toEqual([{ model: MODEL, stream: true }]);
	});

	it('meldet, wenn das Modell nicht geladen werden konnte', async () => {
		await loadModel(standIn([], [{ status: 'pulling x', total: 200, completed: 20 }, { error: 'no space left on device' }]));

		expect(modelState()).toEqual({ state: 'failed' });
	});

	// fach review 577 V-8: Ollama reports each layer of the model on its own; the notice counts the whole model
	it('rechnet den Fortschritt über alle Schichten des Modells', async () => {
		await loadModel(
			standIn([], [
				{ status: 'pulling a', digest: 'a', total: 6000, completed: 6000 },
				{ status: 'pulling b', digest: 'b', total: 100, completed: 0 }
			])
		);

		expect(modelState()).toEqual({ state: 'loading', percent: 98 });
	});

	it('meldet ein Modell erst mit «success» als geladen, nicht schon mit seiner ersten fertigen Schicht', async () => {
		await loadModel(standIn([], [{ status: 'pulling a', digest: 'a', total: 6000, completed: 6000 }]));

		expect(modelState()).toEqual({ state: 'loading', percent: 99 });
	});

	it('liest auch eine letzte Zeile ohne Zeilenumbruch', async () => {
		ollama = Bun.serve({
			port: 0,
			fetch: (request) =>
				new URL(request.url).pathname === '/api/tags' ? Response.json({ models: [] }) : Response.json({ error: 'pull failed' })
		});

		await loadModel({ baseUrl: `http://127.0.0.1:${ollama.port}/v1`, model: MODEL, local: true });

		expect(modelState()).toEqual({ state: 'failed' });
	});

	it('meldet während des Ladens, wie weit es ist', async () => {
		const config = standIn([], [{ status: 'pulling x', total: 200, completed: 80 }]);

		await loadModel(config);

		// the stream ended without «success»: the download stopped at 40 %
		expect(modelState()).toEqual({ state: 'loading', percent: 40 });
	});

	it('fragt keinen externen Anbieter nach dem Modell', async () => {
		const calls: string[] = [];
		const config = { ...standIn([], [], calls), local: false };

		await loadModel(config);

		expect(calls).toEqual([]);
		expect(modelState()).toEqual({ state: 'unknown' });
	});

	it('meldet nichts, wenn die lokale KI nicht antwortet', async () => {
		await loadModel({ baseUrl: 'http://127.0.0.1:9/v1', model: MODEL, local: true });

		expect(modelState()).toEqual({ state: 'unknown' });
	});
});
