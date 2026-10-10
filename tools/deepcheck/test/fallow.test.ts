import { chmodSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadFallow, parseFallow } from '../src/fallow.ts';
import { SHALLOW_MODULE, writeProject } from './helpers.ts';
import { analyze } from '../src/analyze.ts';
import { ToolError } from '../src/errors.ts';

/** Real Fallow 2.104.0 output recorded from this repo (trimmed to a few files). */
const recorded = (name: string) => JSON.parse(readFileSync(new URL(`fallow/${name}`, import.meta.url), 'utf8'));

const fixture = (name: string) => (name.startsWith('/') ? name : fileURLToPath(new URL(`fallow/${name}`, import.meta.url)));

/** A stand-in Fallow binary that prints the recorded output for each command and exits with `code`. */
function fakeFallow(code: number, health = 'health-file-scores.json', deadCode = 'dead-code.json'): string {
	const root = writeProject({
		'fallow': `#!/bin/sh\ncase "$1" in\n  health) cat '${fixture(health)}' ;;\n  dead-code) cat '${fixture(deadCode)}' ;;\nesac\nexit ${code}\n`
	});
	chmodSync(`${root}/fallow`, 0o755);
	return `${root}/fallow`;
}

describe('Fallow adapter', () => {
	it('reads complexity per file and counts unused exports and types per file', () => {
		const data = parseFallow(recorded('health-file-scores.json'), recorded('dead-code.json'));
		expect(data.complexity.get('backend/src/services/qr-bill.service.ts')).toBe(61);
		expect(data.complexity.get('src/lib/utils/format.ts')).toBe(5);
		expect(data.unusedExports.get('backend/src/middleware/auth.ts')).toBe(2);
		expect(data.unusedExports.get('src/lib/server/error-handler.ts')).toBe(1);
		expect(data.unusedExports.get('src/lib/utils/format.ts')).toBeUndefined();
	});

	it('runs the Fallow binary at a given path and accepts exit code 1 (findings) as success', () => {
		const data = loadFallow(writeProject({}), fakeFallow(1));
		expect(data?.complexity.get('backend/src/services/qr-bill.service.ts')).toBe(61);
	});

	it('turns a Fallow error (exit 2, error envelope) at an explicit path into a tool error', () => {
		const bin = fakeFallow(2, 'error.json', 'error.json');
		expect(() => loadFallow(writeProject({}), bin)).toThrow(ToolError);
		expect(() => loadFallow(writeProject({}), bin)).toThrow(/Fallow failed: invalid root path/);
	});

	it('returns no data with off, and with auto when the project has no local Fallow', () => {
		expect(loadFallow(writeProject({}), 'off')).toBeNull();
		expect(loadFallow(writeProject({}), 'auto')).toBeNull();
	});

	it('falls back to no data with auto when the local Fallow fails, and says so', () => {
		const root = writeProject({ 'node_modules/.bin/fallow': readFileSync(fakeFallow(2, 'error.json', 'error.json'), 'utf8') });
		chmodSync(`${root}/node_modules/.bin/fallow`, 0o755);
		const warnings: string[] = [];
		expect(loadFallow(root, 'auto', warnings)).toBeNull();
		expect(warnings).toEqual([
			"Fallow failed: invalid root path '/nonexistent-dir': No such file or directory (os error 2); using own complexity and no unused-export data."
		]);
	});

	it('uses the local Fallow with auto', () => {
		const root = writeProject({ 'node_modules/.bin/fallow': readFileSync(fakeFallow(0), 'utf8') });
		chmodSync(`${root}/node_modules/.bin/fallow`, 0o755);
		expect(loadFallow(root, 'auto')?.complexity.get('src/lib/utils/format.ts')).toBe(5);
	});

	it('feeds Fallow complexity and unused exports into the module metrics', () => {
		const json = writeProject({
			'health.json': JSON.stringify({ file_scores: [{ path: 'src/shallow.ts', total_cyclomatic: 40 }] }),
			'dead.json': JSON.stringify({ unused_exports: [{ path: 'src/shallow.ts' }, { path: 'src/shallow.ts' }] })
		});
		const root = writeProject({
			'src/store.ts': 'export const store = new Map<string, string>();\n',
			'src/shallow.ts': SHALLOW_MODULE
		});
		const report = analyze({ root, fallow: fakeFallow(1, `${json}/health.json`, `${json}/dead.json`) });
		const metrics = (path: string) => report.modules.find((m) => m.path === path)!.metrics;
		expect(metrics('src/shallow.ts')).toMatchObject({ complexity: 40, complexitySource: 'fallow', unusedExports: 2 });
		expect(metrics('src/store.ts')).toMatchObject({ complexitySource: 'own', unusedExports: 0 });
	});
});
