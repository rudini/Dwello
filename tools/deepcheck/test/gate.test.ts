import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze.ts';
import type { Baseline } from '../src/baseline.ts';
import { DEFAULT_CONFIG } from '../src/config.ts';
import { evaluateGate } from '../src/gate.ts';
import { DEEP_MODULE, SHALLOW_MODULE, writeProject } from './helpers.ts';

const STORE = 'export const store = new Map<string, string>();\n';
const EMPTY: Baseline = { schemaVersion: 1, tool: 'deepcheck', failThreshold: 70, entries: [] };
const project = () =>
	analyze({ root: writeProject({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE, 'src/deep.ts': DEEP_MODULE }), fallow: 'off' });
const changed = (...paths: string[]) => paths.map((path) => ({ path, previousPath: null }));
const failing = (result: ReturnType<typeof evaluateGate>) => result.failures.map((f) => `${f.gate} ${f.path}`);

describe('gates', () => {
	it('G1: a new changed module at or above failThreshold fails', () => {
		expect(failing(evaluateGate(project(), changed('src/shallow.ts'), EMPTY, DEFAULT_CONFIG))).toEqual(['G1 src/shallow.ts']);
	});

	it('G2: a baselined module fails only when it worsened by more than tolerance (G3 otherwise)', () => {
		const report = project();
		const score = report.modules.find((m) => m.path === 'src/shallow.ts')!.score;
		const baselineAt = (baselineScore: number): Baseline => ({
			...EMPTY,
			entries: [{ fingerprint: 'src/shallow.ts#shallow-module', path: 'src/shallow.ts', rule: 'shallow-module', score: baselineScore }]
		});
		const gate = (baselineScore: number) => evaluateGate(report, changed('src/shallow.ts'), baselineAt(baselineScore), DEFAULT_CONFIG);
		expect(failing(gate(score))).toEqual([]);
		expect(failing(gate(score - 5))).toEqual([]);
		expect(failing(gate(score - 6))).toEqual(['G2 src/shallow.ts']);
		expect(gate(score - 6).failures[0].baselineScore).toBe(score - 6);
	});

	it('G3: an unchanged shallow module never fails the changed scope, even without a baseline entry', () => {
		const report = project();
		expect(report.modules.find((m) => m.path === 'src/shallow.ts')!.flagged).toBe(true);
		expect(failing(evaluateGate(report, changed('src/deep.ts', 'src/store.ts'), EMPTY, DEFAULT_CONFIG))).toEqual([]);
	});

	it('looks up a renamed module in the baseline under its old path', () => {
		const report = project();
		const score = report.modules.find((m) => m.path === 'src/shallow.ts')!.score;
		const baseline: Baseline = {
			...EMPTY,
			entries: [{ fingerprint: 'src/old-name.ts#shallow-module', path: 'src/old-name.ts', rule: 'shallow-module', score }]
		};
		const renamed = [{ path: 'src/shallow.ts', previousPath: 'src/old-name.ts' }];
		expect(failing(evaluateGate(report, renamed, baseline, DEFAULT_CONFIG))).toEqual([]);
	});

	it('G4: a reasonless suppression in a changed file fails the gate; in an unchanged file it does not', () => {
		const report = analyze({
			root: writeProject({
				'src/a.ts': '// deepcheck-ignore-file\nexport const a = 1;\n',
				'src/b.ts': '// deepcheck-ignore-file\nexport const b = 1;\n'
			}),
			fallow: 'off'
		});
		const result = evaluateGate(report, changed('src/a.ts'), EMPTY, DEFAULT_CONFIG);
		expect(result.suppressionFindings.map((f) => f.path)).toEqual(['src/a.ts']);
		expect(result.passed).toBe(false);
		expect(evaluateGate(report, changed(), EMPTY, DEFAULT_CONFIG).passed).toBe(true);
	});
});
