import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { writeProject } from './helpers.ts';

/** The callee module every facade below forwards to. */
const TENANT = `export function getTenant(fetch: typeof globalThis.fetch, id: string, full = false) {
	return fetch(\`/api/tenants/\${id}?full=\${full}\`);
}
export function putTenant(fetch: typeof globalThis.fetch, id: string, data: FormData) {
	return fetch(\`/api/tenants/\${id}\`, { method: 'PUT', body: data });
}
export function dropTenant(fetch: typeof globalThis.fetch, id: string) {
	return fetch(\`/api/tenants/\${id}\`, { method: 'DELETE' });
}
export function listTenants(fetch: typeof globalThis.fetch) {
	return fetch('/api/tenants');
}
`;

const facade = (code: string) => {
	const report = analyze({ root: writeProject({ 'src/tenant.ts': TENANT, 'src/facade.ts': code }), fallow: 'off' });
	return report.modules.find((m) => m.path === 'src/facade.ts')!;
};

describe('pass-through variants that used to slip through the gate (review 3)', () => {
	it('detects forwarders that add a constant argument', () => {
		const m = facade(`import { getTenant, putTenant, dropTenant, listTenants } from './tenant';
export function loadTenant(fetch: typeof globalThis.fetch, id: string) {
	return getTenant(fetch, id, true);
}
export function saveTenant(fetch: typeof globalThis.fetch, id: string, data: FormData) {
	return putTenant(fetch, id, data);
}
export function removeTenant(fetch: typeof globalThis.fetch, id: string) {
	return dropTenant(fetch, id);
}
export function allTenants(fetch: typeof globalThis.fetch) {
	return listTenants(fetch);
}
`);
		expect(m.metrics.passThroughs.map((p) => p.name)).toEqual(['loadTenant', 'saveTenant', 'removeTenant', 'allTenants']);
		expect(m.flagged).toBe(true);
	});

	it('detects forwarders that fix a parameter from a closure, in a factory', () => {
		const m = facade(`import { getTenant, putTenant, dropTenant, listTenants } from './tenant';
export const tenantApi = (fetch: typeof globalThis.fetch) => ({
	load: (id: string) => getTenant(fetch, id),
	save: (id: string, data: FormData) => putTenant(fetch, id, data),
	remove: (id: string) => dropTenant(fetch, id),
	all: () => listTenants(fetch)
});
`);
		expect(m.metrics.passThroughs.map((p) => p.name)).toEqual(['load', 'save', 'remove']);
		expect(m.flagged).toBe(true);
	});

	it.each([
		['a block-bodied arrow', 'export const tenantApi = (fetch: typeof globalThis.fetch) => {\n\tconst base = fetch;\n\treturn {'],
		['a function declaration', 'export function tenantApi(fetch: typeof globalThis.fetch) {\n\tconst base = fetch;\n\treturn {']
	])('counts the members of the object returned by %s as interface', (_, head) => {
		const m = facade(`import { getTenant, putTenant, dropTenant, listTenants } from './tenant';
${head}
		load: (id: string) => getTenant(base, id),
		save: (id: string, data: FormData) => putTenant(base, id, data),
		remove: (id: string) => dropTenant(base, id),
		all: () => listTenants(base)
	};
}
`);
		expect(m.metrics.passThroughs.map((p) => p.name)).toEqual(['load', 'save', 'remove']);
		expect(m.flagged).toBe(true);
	});

	it('detects forwarders that route through a generic private call helper', () => {
		const m = facade(`import { getTenant, putTenant, dropTenant, listTenants } from './tenant';
function call(fn: (...a: unknown[]) => unknown, ...args: unknown[]) {
	return fn(...args);
}
export function loadTenant(fetch: typeof globalThis.fetch, id: string) {
	return call(getTenant, fetch, id, true);
}
export function saveTenant(fetch: typeof globalThis.fetch, id: string, data: FormData) {
	return call(putTenant, fetch, id, data);
}
export function removeTenant(fetch: typeof globalThis.fetch, id: string) {
	return call(dropTenant, fetch, id);
}
export function allTenants(fetch: typeof globalThis.fetch) {
	return call(listTenants, fetch);
}
`);
		expect(m.metrics.passThroughs.map((p) => p.name)).toEqual(['loadTenant', 'saveTenant', 'removeTenant', 'allTenants']);
		expect(m.flagged).toBe(true);
	});

	it('detects forwarders that take a destructured parameter object', () => {
		const m = facade(`import { getTenant, putTenant, dropTenant } from './tenant';
type Args = { fetch: typeof globalThis.fetch; id: string };
export function loadTenant({ fetch, id }: Args) {
	return getTenant(fetch, id);
}
export function saveTenant({ fetch, id }: Args, data: FormData) {
	return putTenant(fetch, id, data);
}
export function removeTenant({ fetch, id }: Args) {
	return dropTenant(fetch, id);
}
`);
		expect(m.metrics.passThroughs.map((p) => p.name)).toEqual(['loadTenant', 'saveTenant', 'removeTenant']);
		expect(m.flagged).toBe(true);
	});

	it('detects plain aliases of another module’s functions', () => {
		const m = facade(`import { getTenant, putTenant, dropTenant, listTenants } from './tenant';
export const loadTenant = getTenant;
export const saveTenant = putTenant;
export const removeTenant = dropTenant;
export const allTenants = listTenants;
`);
		expect(m.metrics.passThroughs.map((p) => p.name)).toEqual(['loadTenant', 'saveTenant', 'removeTenant', 'allTenants']);
		expect(m.flagged).toBe(true);
	});
});

describe('what must stay unflagged after widening the detection', () => {
	it('does not count calls that transform their arguments or callbacks passed to other calls', () => {
		const m = facade(`import { getTenant } from './tenant';
export function loadTrimmed(fetch: typeof globalThis.fetch, id: string) {
	return getTenant(fetch, id.trim());
}
export function loadAll(fetch: typeof globalThis.fetch, ids: string[]) {
	return Promise.all(ids.map((id) => getTenant(fetch, id, true)));
}
`);
		expect(m.metrics.passThroughs.map((p) => p.name)).toEqual([]);
	});

	it('does not flag a utility module whose few default-adding helpers sit beside real logic', () => {
		const formats = `const money = (value: number, currency: string) =>
	new Intl.NumberFormat('de-CH', { style: 'currency', currency }).format(Math.round(value * 20) / 20);
export const formatCHF = (value: number) => money(value, 'CHF');
export const formatEUR = (value: number) => money(value, 'EUR');
export function formatArea(m2: number): string {
	if (!Number.isFinite(m2) || m2 <= 0) return '–';
	const rounded = m2 >= 100 ? Math.round(m2) : Math.round(m2 * 10) / 10;
	return \`\${rounded.toLocaleString('de-CH')} m²\`;
}
export function formatPeriod(from: Date, to: Date | null): string {
	const f = (d: Date) => d.toLocaleDateString('de-CH');
	return to ? \`\${f(from)} – \${f(to)}\` : \`ab \${f(from)}\`;
}
`;
		const m = analyze({ root: writeProject({ 'src/format.ts': formats }), fallow: 'off' }).modules[0];
		expect(m.flagged).toBe(false);
	});

	it('does not count renamed constants or classes as aliases', () => {
		const lib = 'export const LIMIT = 50;\nexport class Client {}\n';
		const code = `import { LIMIT, Client } from './lib';
export const MAX_ROWS = LIMIT;
export const MAX_UNITS = LIMIT;
export const Api = Client;
`;
		const report = analyze({ root: writeProject({ 'src/lib.ts': lib, 'src/limits.ts': code }), fallow: 'off' });
		const m = report.modules.find((x) => x.path === 'src/limits.ts')!;
		expect(m.metrics.passThroughs).toEqual([]);
		expect(m.flagged).toBe(false);
	});

	it('does not count entry points into the module’s own hidden helper (ky type-guards.ts)', () => {
		const guards = [
			"import { HTTPError, NetworkError, TimeoutError, RetryError, SizeError } from './errors';",
			'const isErrorType = (error: unknown, cls: { name: string }): boolean =>',
			"\terror instanceof (cls as never) || ((error as { isKy?: boolean })?.isKy === true && (error as { name?: string })?.name === cls.name);",
			'export function isHTTPError(error: unknown) {\n\treturn isErrorType(error, HTTPError);\n}',
			'export function isNetworkError(error: unknown) {\n\treturn isErrorType(error, NetworkError);\n}',
			'export function isTimeoutError(error: unknown) {\n\treturn isErrorType(error, TimeoutError);\n}',
			'export function isRetryError(error: unknown) {\n\treturn isErrorType(error, RetryError);\n}',
			'export function isSizeError(error: unknown) {\n\treturn isErrorType(error, SizeError);\n}',
			''
		].join('\n');
		const errors = ['HTTPError', 'NetworkError', 'TimeoutError', 'RetryError', 'SizeError'].map((n) => `export class ${n} extends Error {}`).join('\n');
		const report = analyze({ root: writeProject({ 'src/errors.ts': `${errors}\n`, 'src/type-guards.ts': guards }), fallow: 'off' });
		const m = report.modules.find((x) => x.path === 'src/type-guards.ts')!;
		expect(m.metrics.passThroughs).toEqual([]);
		expect(m.flagged).toBe(false);
	});
});
