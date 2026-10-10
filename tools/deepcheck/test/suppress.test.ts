import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { SHALLOW_MODULE, writeProject } from './helpers.ts';

const STORE = 'export const store = new Map<string, string>();\n';
const analyzeShallow = (header: string, body = SHALLOW_MODULE) =>
	analyze({ root: writeProject({ 'src/store.ts': STORE, 'src/shallow.ts': header + body }), fallow: 'off' });

describe('suppressions', () => {
	it('excludes a module suppressed with a reason', () => {
		const report = analyzeShallow('// deepcheck-ignore-file -- thin facade required by the plugin API\n');
		expect(report.excluded).toContainEqual({ path: 'src/shallow.ts', reason: 'suppressed' });
		expect(report.modules.map((m) => m.path)).not.toContain('src/shallow.ts');
	});

	it('reports a suppression without reason as a finding and does not apply it', () => {
		const report = analyzeShallow('// deepcheck-ignore-file\n');
		expect(report.modules.map((m) => m.path)).toContain('src/shallow.ts');
		expect(report.suppressionFindings).toEqual([
			{ path: 'src/shallow.ts', line: 1, message: 'deepcheck-ignore-file needs a reason: add "-- <why this is shallow by design>"' }
		]);
	});

	it('drops a pass-through suppressed on the line above, with a reason', () => {
		const body = SHALLOW_MODULE.replace(
			'export function getName',
			'// deepcheck-ignore-next-line pass-through -- mirrors the Map API on purpose\nexport function getName'
		);
		const shallow = analyzeShallow('', body).modules.find((m) => m.path === 'src/shallow.ts')!;
		expect(shallow.metrics.passThroughs.map((p) => p.name)).toEqual(['setName', 'hasName', 'deleteName']);
	});

	it('drops leaky exports and data-only classes suppressed on the line above', () => {
		const code = [
			'interface Row { a: string }',
			'// deepcheck-ignore-next-line leaky-export -- Row is only read by callers',
			'export const load = (id: string): Row => ({ a: id });',
			'// deepcheck-ignore-next-line data-only-class -- value object for the API',
			'export class Point {',
			'\tx = 0;',
			'}',
			''
		].join('\n');
		const m = analyze({ root: writeProject({ 'src/m.ts': code }), fallow: 'off' }).modules[0].metrics;
		expect(m.leakyExports).toEqual([]);
		expect(m.dataOnlyClasses).toEqual([]);
	});

	it('reports next-line suppressions without a known rule or a reason', () => {
		const code = [
			'// deepcheck-ignore-next-line -- no rule',
			'// deepcheck-ignore-next-line pass-thru -- typo',
			'// deepcheck-ignore-next-line pass-through',
			'export const x = 1;',
			''
		].join('\n');
		const report = analyze({ root: writeProject({ 'src/m.ts': code }), fallow: 'off' });
		expect(report.suppressionFindings.map((f) => `${f.line}: ${f.message}`)).toEqual([
			'1: deepcheck-ignore-next-line needs a rule: one of pass-through, leaky-export, data-only-class',
			'2: deepcheck-ignore-next-line names an unknown rule "pass-thru": use one of pass-through, leaky-export, data-only-class',
			'3: deepcheck-ignore-next-line needs a reason: add "-- <why this is shallow by design>"'
		]);
	});

	it('lists every suppression with its location, rule and reason', () => {
		const report = analyzeShallow('// deepcheck-ignore-file -- facade\n// deepcheck-ignore-next-line pass-through\n');
		expect(report.suppressions).toEqual([
			{ path: 'src/shallow.ts', line: 1, kind: 'file', rule: null, reason: 'facade', valid: true },
			{ path: 'src/shallow.ts', line: 2, kind: 'next-line', rule: 'pass-through', reason: null, valid: false }
		]);
	});

	it('reports suppressions whose reason is not written as "-- reason"', () => {
		const code = '// deepcheck-ignore-file: legacy\n// deepcheck-ignore-next-line pass-through because API\nexport const x = 1;\n';
		const report = analyze({ root: writeProject({ 'src/m.ts': code }), fallow: 'off' });
		expect(report.modules.map((m) => m.path)).toEqual(['src/m.ts']);
		expect(report.suppressionFindings.map((f) => f.line)).toEqual([1, 2]);
	});

	it('ignores suppression text that is not in a comment', () => {
		const report = analyzeShallow('export const hint = "// deepcheck-ignore-file -- x";\nconst t = `\n// deepcheck-ignore-file -- y\n`;\n');
		expect(report.modules.map((m) => m.path)).toContain('src/shallow.ts');
		expect(report.suppressions).toEqual([]);
	});
});
