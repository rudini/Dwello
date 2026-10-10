import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import { createBaseline, readBaseline, writeBaseline } from '../src/baseline.ts';
import { DEFAULT_CONFIG } from '../src/config.ts';
import { ToolError } from '../src/errors.ts';
import { DEEP_MODULE, SHALLOW_MODULE, writeProject } from './helpers.ts';

const STORE = 'export const store = new Map<string, string>();\n';

describe('baseline', () => {
	it('records a stable fingerprint and the score of each flagged module, nothing else', () => {
		const root = writeProject({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE, 'src/deep.ts': DEEP_MODULE });
		const report = analyze({ root, fallow: 'off' });
		const score = report.modules.find((m) => m.path === 'src/shallow.ts')!.score;
		expect(createBaseline(report, DEFAULT_CONFIG)).toEqual({
			schemaVersion: 1,
			tool: 'deepcheck',
			failThreshold: 70,
			fallow: false,
			entries: [{ fingerprint: 'src/shallow.ts#shallow-module', path: 'src/shallow.ts', rule: 'shallow-module', score }]
		});
	});

	it('round-trips through .deepcheck-baseline.json and reads a missing file as empty', () => {
		const root = writeProject({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE });
		expect(readBaseline(root).entries).toEqual([]);
		const baseline = createBaseline(analyze({ root, fallow: 'off' }), DEFAULT_CONFIG);
		writeBaseline(root, baseline);
		expect(readFileSync(`${root}/.deepcheck-baseline.json`, 'utf8')).toBe(`${JSON.stringify(baseline, null, '\t')}\n`);
		expect(readBaseline(root)).toEqual(baseline);
	});

	it('rejects a baseline that is not valid JSON or has the wrong shape as a tool error', () => {
		expect(() => readBaseline(writeProject({ '.deepcheck-baseline.json': '{ "entries": [' }))).toThrow(ToolError);
		expect(() => readBaseline(writeProject({ '.deepcheck-baseline.json': '{ "entries": [{ "path": 1 }] }' }))).toThrow(
			/\.deepcheck-baseline\.json: .*entries\.0\.path must be a string/
		);
	});
});
