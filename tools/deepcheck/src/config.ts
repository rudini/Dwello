import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ToolError } from './errors.ts';
import { loadSchema, validate } from './schema.ts';

export interface Weights {
	depth: number;
	complexity: number;
	passThrough: number;
	leaky: number;
	classitis: number;
	coupling: number;
	unusedExports: number;
}

export interface Override {
	files: string[];
	failThreshold?: number;
	minInterfaceSize?: number;
}

export interface Config {
	include: string[];
	exclude: string[];
	tests: string[];
	generated: string[];
	/** Modules whose exports are a framework or tool contract (routes, hooks, tool configs). */
	entries: string[];
	failThreshold: number;
	tolerance: number;
	minInterfaceSize: number;
	/** depthRatio at which the depth component reaches 0 (fully deep). */
	depthTarget: number;
	/** cyclomatic complexity per interface unit at which the complexity component reaches 0. */
	complexityTarget: number;
	classitisMinFiles: number;
	weights: Weights;
	overrides: Override[];
}

export const DEFAULT_CONFIG: Config = {
	include: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
	exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**'],
	tests: ['**/*.test.*', '**/*.spec.*', '**/__tests__/**', '**/__mocks__/**', '**/test/**', 'tests/**'],
	generated: ['**/generated/**', '**/*.gen.ts', '**/*.generated.ts'],
	entries: ['**/routes/**/+*.ts', '**/hooks.ts', '**/hooks.server.ts', '**/hooks.client.ts', '**/*.config.ts'],
	failThreshold: 70,
	tolerance: 5,
	minInterfaceSize: 5,
	depthTarget: 16,
	complexityTarget: 8,
	classitisMinFiles: 5,
	weights: {
		depth: 40,
		complexity: 20,
		passThrough: 15,
		leaky: 10,
		classitis: 10,
		coupling: 5,
		unusedExports: 5
	},
	overrides: []
};

const CONFIG_FILE = 'deepcheck.config.json';

export function loadConfig(root: string): Config {
	const path = join(root, CONFIG_FILE);
	if (!existsSync(path)) return DEFAULT_CONFIG;
	const file = parseJson(readFileSync(path, 'utf8'), CONFIG_FILE);
	const problems = validate(file, loadSchema('config.schema.json'));
	if (problems.length) throw new ToolError(`${CONFIG_FILE}: ${problems.join('; ')}`);
	return {
		...DEFAULT_CONFIG,
		...file,
		exclude: [...DEFAULT_CONFIG.exclude, ...(file.exclude ?? [])],
		weights: { ...DEFAULT_CONFIG.weights, ...file.weights }
	};
}

export function parseJson(text: string, name: string) {
	try {
		return JSON.parse(text);
	} catch (error) {
		throw new ToolError(`${name} is not valid JSON: ${(error as Error).message}`);
	}
}
