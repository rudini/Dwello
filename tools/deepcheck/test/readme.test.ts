import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '../src/config.ts';
import { loadSchema } from '../src/schema.ts';

const readme = () => readFileSync(new URL('../README.md', import.meta.url), 'utf8');

describe('README', () => {
	it('documents every metric and the score formula', () => {
		for (const term of ['interfaceSize', 'implementationSize', 'depthRatio', 'passThroughs', 'leakyExports', 'classitis', 'fanIn', 'fanOut', 'complexity', 'shallowScore'])
			expect(readme()).toContain(term);
	});

	it('documents every config key and the default weights', () => {
		const keys = Object.keys((loadSchema('config.schema.json') as { properties: object }).properties).filter((k) => k !== '$schema');
		for (const key of keys) expect(readme()).toContain(`\`${key}\``);
		for (const [name, weight] of Object.entries(DEFAULT_CONFIG.weights))
			expect(readme()).toMatch(new RegExp(`\\| \`${name}\` \\| ${weight} \\|`));
	});

	it('says it is a warning system and lists known false positives', () => {
		expect(readme()).toMatch(/not a verdict on design quality/);
		expect(readme()).toMatch(/## Known false positives/);
	});

	it('documents the changed scope, the gates and the baseline', () => {
		for (const term of ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', '--changed-since', '--agent', '--scope', '--use-baseline', '.deepcheck-baseline.json', 'deepcheck:audit', 'deepcheck:ci', 'deepcheck:baseline'])
			expect(readme()).toContain(term);
	});

	it('documents the wiring: commit/push hook, PR job and scan workflow', () => {
		const wiring = readme().slice(readme().indexOf('## Wiring'));
		for (const term of ['.claude/hooks/deepcheck-gate.sh', 'PreToolUse', 'Deep modules', 'deepcheck-scan.yml', 'workflow_dispatch', 'git -C'])
			expect(wiring).toContain(term);
	});

	it('tells agents in CLAUDE.md to run the audit after each step and the scan only on request', () => {
		const claude = readFileSync(new URL('../../../CLAUDE.md', import.meta.url), 'utf8');
		expect(claude).toMatch(/bun run deepcheck:audit/);
		expect(claude).toMatch(/bun run deepcheck:scan[^\n]*only when/);
	});
});

describe('root README', () => {
	const root = () => readFileSync(new URL('../../../README.md', import.meta.url), 'utf8');

	it('explains how to use deepcheck and points to its reference', () => {
		expect(root()).toMatch(/### Deep modules \(deepcheck\)/);
		for (const script of ['bun run deepcheck:scan', 'bun run deepcheck:audit', 'bun run deepcheck:ci', 'bun run deepcheck:baseline', 'deepcheck-ignore-file'])
			expect(root()).toContain(script);
		expect(root()).not.toMatch(/npm run deepcheck/);
		expect(root()).toContain('(tools/deepcheck/README.md)');
	});
});
