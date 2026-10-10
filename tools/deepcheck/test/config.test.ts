import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, loadConfig } from '../src/config.ts';
import { ToolError } from '../src/errors.ts';
import { analyze } from '../src/analyze.ts';
import { SHALLOW_MODULE, writeProject } from './helpers.ts';

describe('config', () => {
	it('uses the defaults without a config file', () => {
		expect(loadConfig(writeProject({}))).toEqual(DEFAULT_CONFIG);
	});

	it('merges a config file over the defaults, including single weights', () => {
		const root = writeProject({
			'deepcheck.config.json': JSON.stringify({ failThreshold: 60, weights: { depth: 50 } })
		});
		const config = loadConfig(root);
		expect(config.failThreshold).toBe(60);
		expect(config.weights).toEqual({ ...DEFAULT_CONFIG.weights, depth: 50 });
		expect(config.tolerance).toBe(DEFAULT_CONFIG.tolerance);
	});

	it('rejects a config file that is not valid JSON as a tool error', () => {
		const root = writeProject({ 'deepcheck.config.json': '{ failThreshold: ' });
		expect(() => loadConfig(root)).toThrow(ToolError);
		expect(() => loadConfig(root)).toThrow(/deepcheck\.config\.json/);
	});

	it('rejects an unknown key, e.g. a typo, as a tool error', () => {
		const root = writeProject({ 'deepcheck.config.json': JSON.stringify({ failTreshold: 60 }) });
		expect(() => loadConfig(root)).toThrow(/unknown key "failTreshold"/);
	});

	it('rejects values of the wrong type or out of range', () => {
		const root = writeProject({
			'deepcheck.config.json': JSON.stringify({ failThreshold: 'high', tolerance: -1, include: [1], overrides: [{}] })
		});
		expect(() => loadConfig(root)).toThrow(
			'deepcheck.config.json: failThreshold must be a number; tolerance must be >= 0; include.0 must be a string; overrides.0.files is required'
		);
	});

	it('applies the project config and its per-path overrides when analyzing', () => {
		const root = writeProject({
			'deepcheck.config.json': JSON.stringify({
				exclude: ['src/skip/**'],
				overrides: [{ files: ['src/legacy/**'], failThreshold: 100 }]
			}),
			'src/store.ts': 'export const store = new Map<string, string>();\n',
			'src/shallow.ts': SHALLOW_MODULE,
			'src/legacy/shallow.ts': SHALLOW_MODULE.replace('./store', '../store'),
			'src/skip/shallow.ts': SHALLOW_MODULE.replace('./store', '../store')
		});
		const flagged = analyze({ root, fallow: 'off' }).modules.filter((m) => m.flagged).map((m) => m.path);
		expect(flagged).toEqual(['src/shallow.ts']);
	});

	it('excludes paths the Fallow config ignores as generated', () => {
		const root = writeProject({
			'.fallowrc.json': JSON.stringify({ ignorePatterns: ['src/vendor/**'] }),
			'src/vendor/lib.ts': SHALLOW_MODULE
		});
		expect(analyze({ root, fallow: 'off' }).excluded).toEqual([{ path: 'src/vendor/lib.ts', reason: 'generated' }]);
	});

	it('adds a project exclude to the default excludes instead of replacing them', () => {
		const root = writeProject({ 'deepcheck.config.json': JSON.stringify({ exclude: ['src/skip/**'] }) });
		expect(loadConfig(root).exclude).toEqual([...DEFAULT_CONFIG.exclude, 'src/skip/**']);
	});

	it('turns an unreadable Fallow config into a tool error', () => {
		const root = writeProject({ '.fallowrc.json': '{ // comment\n "ignorePatterns": [] }', 'src/a.ts': SHALLOW_MODULE });
		expect(() => analyze({ root, fallow: 'off' })).toThrow(ToolError);
	});
});
