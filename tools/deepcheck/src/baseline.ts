import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseJson, type Config } from './config.ts';
import { ToolError } from './errors.ts';
import { loadSchema, validate } from './schema.ts';
import type { Report } from './types.ts';

const RULE = 'shallow-module' as const;

export interface BaselineEntry {
	/** `<module path>#<rule id>`, no line numbers, so it survives edits inside the module. */
	fingerprint: string;
	path: string;
	rule: typeof RULE;
	score: number;
}

export interface Baseline {
	schemaVersion: 1;
	tool: 'deepcheck';
	failThreshold: number;
	entries: BaselineEntry[];
}

/** The flagged modules of a full analysis, sorted by path. */
export function createBaseline(report: Report, config: Config): Baseline {
	const entries = report.modules
		.filter((m) => m.flagged)
		.map((m) => ({ fingerprint: `${m.path}#${RULE}`, path: m.path, rule: RULE, score: m.score }))
		.sort((a, b) => (a.path < b.path ? -1 : 1));
	return { schemaVersion: 1, tool: 'deepcheck', failThreshold: config.failThreshold, entries };
}

const FILE = '.deepcheck-baseline.json';

/** The committed baseline; none yet means every flagged changed module counts as new. */
export function readBaseline(root: string): Baseline {
	const path = join(root, FILE);
	if (!existsSync(path)) return { schemaVersion: 1, tool: 'deepcheck', failThreshold: 0, entries: [] };
	const baseline = parseJson(readFileSync(path, 'utf8'), FILE);
	const problems = validate(baseline, loadSchema('baseline.schema.json'));
	if (problems.length) throw new ToolError(`${FILE}: ${problems.join('; ')}; regenerate it with deepcheck baseline`);
	return baseline;
}

export function writeBaseline(root: string, baseline: Baseline): void {
	writeFileSync(join(root, FILE), `${JSON.stringify(baseline, null, '\t')}\n`);
}
