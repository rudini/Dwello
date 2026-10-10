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
