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
