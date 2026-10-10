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
});
