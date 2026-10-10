import type { Config, Weights } from './config.ts';
import type { ModuleMetrics } from './types.ts';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** 1 at ratio <= 1, falling logarithmically to 0 at `target`. */
const logShallowness = (ratio: number, target: number) =>
	clamp01(1 - Math.log2(Math.max(ratio, 1)) / Math.log2(target));

/** Each component is 0 (deep) to 1 (shallow). */
export function components(m: ModuleMetrics, exportCount: number, functionCount: number, config: Config): Record<keyof Weights, number> {
	const interfaceSize = Math.max(1, m.interfaceSize);
	const coupled = m.fanIn + m.fanOut;
	return {
		depth: logShallowness((m.implementationSize + m.operations) / interfaceSize, config.depthTarget),
		complexity: logShallowness(m.complexity / interfaceSize, config.complexityTarget),
		passThrough: clamp01((2 * m.passThroughs.length) / Math.max(1, functionCount)),
		leaky: clamp01(m.leakyExports.length / Math.max(1, exportCount)),
		classitis: m.classitis || m.dataOnlyClasses.length > 0 ? 1 : 0,
		coupling: coupled === 0 ? 0 : m.fanOut / coupled,
		unusedExports: m.unusedExports === null ? 0 : clamp01(m.unusedExports / Math.max(1, exportCount))
	};
}

/** Weighted mean of the components, 0..100. The weights' sum never depends on Fallow being available. */
export function shallowScore(parts: Record<keyof Weights, number>, weights: Weights): number {
	const keys = Object.keys(weights) as (keyof Weights)[];
	const total = keys.reduce((sum, k) => sum + weights[k], 0);
	const weighted = keys.reduce((sum, k) => sum + weights[k] * parts[k], 0);
	return total === 0 ? 0 : Math.round((100 * weighted) / total);
}
