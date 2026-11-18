/**
 * Stand-in for GitHub's newest release and the update service (#1453) in the acceptance tests, served by llm-stub.ts:
 *
 *   GET  /releases/latest   { tag_name: 'v1.4.0', html_url }, the version of the E2E build, until a scenario sets another
 *   POST /update            runs the steps «pulling», «backend» and «frontend», 2 s each, then ends as set
 *   GET  /status            how far it is (backend/src/updater/updater.ts)
 *   POST /stub/update       { release?, outcome?: 'done' | 'failed' | 'restore' | 'hold' } ('hold': stays at «backend»);
 *                           also as GET with the query, so the axe check reaches a state through the browser
 */

import type { UpdateStatus } from '../src/updater/updater';

const STEP_MS = 2000;
let release = '1.4.0';
let outcome: 'done' | 'failed' | 'restore' | 'hold' = 'done';
let status: UpdateStatus = { state: 'idle' };

const steps = ['pulling', 'backend', 'frontend'] as const;
const ending = (): UpdateStatus => (outcome === 'done' ? { state: 'done' } : { state: 'failed', restore: outcome === 'restore' });

export const updateStub: Record<string, (request: Request) => Response | Promise<Response>> = {
	'/releases/latest': () =>
		Response.json({ tag_name: `v${release}`, html_url: `https://github.com/rudini/Dwello/releases/tag/v${release}` }),
	'/status': () => Response.json(status),
	// also while one runs: every look of the axe check starts its own
	'/update': () => {
		if (outcome === 'hold') return (status = { state: 'backend' }), new Response(null, { status: 202 });
		steps.forEach((state, step) => setTimeout(() => (status = { state }), step * STEP_MS));
		setTimeout(() => (status = ending()), steps.length * STEP_MS);
		status = { state: 'pulling' };
		return new Response(null, { status: 202 });
	},
	'/stub/update': async (request) => {
		const query = Object.fromEntries(new URL(request.url).searchParams);
		const wanted = (request.method === 'POST' ? await request.json() : query) as { release?: string; outcome?: typeof outcome };
		release = wanted.release ?? release;
		outcome = wanted.outcome ?? outcome;
		status = { state: 'idle' };
		return Response.json({ release, outcome });
	}
};
