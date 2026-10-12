import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { writeProject } from './helpers.ts';

const metricsOf = (code: string) => {
	const root = writeProject({ 'src/m.ts': code });
	return analyze({ root, fallow: 'off' }).modules[0].metrics;
};

describe('leaky exports', () => {
	it('reports an exported signature that uses an internal interface', () => {
		const m = metricsOf('interface Row { a: string }\nexport function load(id: string): Row {\n\treturn { a: id };\n}\n');
		expect(m.leakyExports).toEqual([{ name: 'load', line: 2, type: 'Row' }]);
	});

	it('reports leaks through an export list and an anonymous default export', () => {
		const viaList = metricsOf('interface Row { a: string }\nfunction load(id: string): Row {\n\treturn { a: id };\n}\nexport { load as fetchRow };\n');
		expect(viaList.leakyExports).toEqual([{ name: 'fetchRow', line: 5, type: 'Row' }]);
		const viaDefault = metricsOf('interface Row { a: string }\nexport default function (id: string): Row {\n\treturn { a: id };\n}\n');
		expect(viaDefault.leakyExports).toEqual([{ name: 'default', line: 2, type: 'Row' }]);
	});

	it('does not report a local alias of a type callers can name themselves', () => {
		const m = metricsOf(
			'type Fetch = typeof globalThis.fetch;\ntype Json = Record<string, unknown>;\nexport const get = (fetch: Fetch, body: Json) => fetch(String(body));\n'
		);
		expect(m.leakyExports).toEqual([]);
	});

	it('does not report exported or type-parameter names', () => {
		const m = metricsOf('export interface Row { a: string }\nexport function first<Row>(rows: Row[]): Row {\n\treturn rows[0];\n}\n');
		expect(m.leakyExports).toEqual([]);
	});
});

describe('data-only classes', () => {
	it('reports a class made only of fields and accessors', () => {
		const m = metricsOf(
			'export class Point {\n\tx = 0;\n\ty = 0;\n\tget sum() {\n\t\treturn this.x + this.y;\n\t}\n}\n'
		);
		expect(m.dataOnlyClasses).toEqual(['Point']);
	});

	it('does not report a subclass that inherits its behaviour', () => {
		const m = metricsOf("export class MailError extends Error {\n\toverride name = 'MailError';\n}\n");
		expect(m.dataOnlyClasses).toEqual([]);
	});
});

describe('interface of exported object literals', () => {
	const OBJECT_FACADE = `import { store } from './store';
export const names = {
	getName(id: string) {
		return store.get(id);
	},
	setName: (id: string, name: string) => store.set(id, name),
	hasName: function (id: string) {
		return store.has(id);
	},
	deleteName(id: string) {
		return store.delete(id);
	},
	size: 0
};
`;

	it('counts function members and their parameters like exported functions, not data keys', () => {
		const root = writeProject({ 'src/store.ts': 'export const store = new Map<string, string>();\n', 'src/m.ts': OBJECT_FACADE });
		const m = analyze({ root, fallow: 'off' }).modules.find((x) => x.path === 'src/m.ts')!;
		expect(m.metrics.interfaceSize).toBe(10);
		expect(m.metrics.passThroughs.map((p) => p.name)).toEqual(['getName', 'setName', 'hasName', 'deleteName']);
		expect(m.flagged).toBe(true);
	});

	it('counts the members of a default-exported object', () => {
		expect(metricsOf('export default {\n\tload(id: string) {\n\t\treturn id;\n\t},\n\tlimit: 3\n};\n').interfaceSize).toBe(3);
	});
});

describe('minimum interface size', () => {
	const STORE = 'export const store = new Map<string, string>();\n';
	const flagged = (files: Record<string, string>) =>
		analyze({ root: writeProject({ 'deepcheck.config.json': '{ "failThreshold": 50 }', ...files }), fallow: 'off' })
			.modules.filter((m) => m.flagged)
			.map((m) => m.path);

	it('never flags a tiny module even when its score is above the threshold', () => {
		expect(flagged({ 'src/clamp.ts': 'export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));\n' })).toEqual([]);
	});

	it('still flags a tiny pass-through module', () => {
		expect(flagged({ 'src/store.ts': STORE, 'src/get.ts': "import { store } from './store';\nexport const get = (key: string) => store.get(key);\n" })).toEqual(['src/get.ts']);
	});
});

describe('classitis', () => {
	const tinyFiles = (n: number) =>
		Object.fromEntries(Array.from({ length: n }, (_, i) => [`src/parts/p${i}.ts`, `export const p${i} = () => ${i};\n`]));
	const classitis = (files: Record<string, string>) =>
		analyze({ root: writeProject(files), fallow: 'off' }).modules.map((m) => [m.path, m.metrics.classitis]);

	it('marks tiny single-export files in a directory of at least five such files', () => {
		expect(new Set(classitis(tinyFiles(5)).map(([, c]) => c))).toEqual(new Set([true]));
	});

	it('leaves smaller directories alone', () => {
		expect(new Set(classitis(tinyFiles(4)).map(([, c]) => c))).toEqual(new Set([false]));
	});
});

describe('own complexity', () => {
	it('counts one per function plus each decision point', () => {
		const code = [
			'export function f(a: number, b?: number[]) {',
			'\tif (a > 1 && b) return a ? 1 : 2;',
			'\tfor (const x of b ?? []) {',
			'\t\tswitch (x) {',
			'\t\t\tcase 1:',
			'\t\t\t\tbreak;',
			'\t\t\tdefault:',
			'\t\t\t\ttry { a++; } catch { a--; }',
			'\t\t}',
			'\t}',
			'\treturn [1].map((y) => y || a);',
			'}',
			''
		].join('\n');
		// f + arrow (2), if, &&, ?:, for-of, ??, case, catch, || (8)
		expect(metricsOf(code).complexity).toBe(10);
	});
});

describe('class interface', () => {
	it('counts public members with their parameters and constructor parameters, once per overload set', () => {
		const code = [
			'export class Repo {',
			'\t#cache = new Map<string, string>();',
			'\tprivate secret = 1;',
			'\tprotected base = 2;',
			'\tconstructor(private url: string) {}',
			'\tfind(id: string): string;',
			'\tfind(id: number): string;',
			'\tfind(id: string | number) {',
			'\t\treturn String(id) + this.url;',
			'\t}',
			'\tget size() {',
			'\t\treturn this.#cache.size;',
			'\t}',
			'\tsave(id: string, value: string) {',
			'\t\tthis.#cache.set(id, value);',
			'\t}',
			'}',
			''
		].join('\n');
		const m = analyze({ root: writeProject({ 'src/m.ts': code }), fallow: 'off' }).modules[0];
		// Repo 1 + constructor 1 param + find 1+1 + size 1 + save 1+2
		expect(m.metrics.interfaceSize).toBe(8);
		expect(m.classes).toEqual([{ name: 'Repo', line: 1, interfaceSize: 8, implementationSize: expect.any(Number), depthRatio: expect.any(Number), dataOnly: false }]);
	});
});

describe('review regressions', () => {
	it('does not count callbacks in object literals passed as arguments as pass-throughs', () => {
		const m = metricsOf("declare function on(h: object): void;\nexport function wire(g: (v: number) => void) {\n\ton({ onChange: (v: number) => g(v) });\n}\n");
		expect(m.passThroughs).toEqual([]);
	});

	it('counts the parameters of a public arrow-function class property', () => {
		expect(metricsOf('export class H {\n\thandle = (a: number, b: number) => a + b;\n}\n').interfaceSize).toBe(4);
	});

	it('does not count ambient declarations as implementation', () => {
		expect(metricsOf('declare function on(h: object): void;\nexport const x = 1;\n').implementationSize).toBe(1);
	});

	it('analyzes files with only side-effect imports or no statements instead of calling them type-only', () => {
		const report = analyze({ root: writeProject({ 'src/setup.ts': "import './polyfill';\n", 'src/empty.ts': '' }), fallow: 'off' });
		expect(report.excluded).toEqual([]);
	});
});
