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
	/** Fallow data fed the recorded scores. */
	fallow: boolean;
	entries: BaselineEntry[];
}

/** The flagged modules of a full analysis, sorted by path. */
export function createBaseline(report: Report, config: Config): Baseline {
	const entries = report.modules
		.filter((m) => m.flagged)
		.map((m) => ({ fingerprint: `${m.path}#${RULE}`, path: m.path, rule: RULE, score: m.score }))
		.sort((a, b) => (a.path < b.path ? -1 : 1));
	return { schemaVersion: 1, tool: 'deepcheck', failThreshold: config.failThreshold, fallow: report.fallow, entries };
}

export const BASELINE_FILE = '.deepcheck-baseline.json';

/** A baseline from its file content; null (no baseline yet) means every flagged changed module counts as new. */
export function parseBaseline(text: string | null): Baseline {
	if (text === null) return { schemaVersion: 1, tool: 'deepcheck', failThreshold: 0, fallow: false, entries: [] };
	const baseline = parseJson(text, BASELINE_FILE);
	const problems = validate(baseline, loadSchema('baseline.schema.json'));
	if (problems.length) throw new ToolError(`${BASELINE_FILE}: ${problems.join('; ')}; regenerate it with deepcheck baseline`);
	return baseline;
}

/** The baseline in the working tree (scan --use-baseline). */
export function readBaseline(root: string): Baseline {
	const path = join(root, BASELINE_FILE);
	return parseBaseline(existsSync(path) ? readFileSync(path, 'utf8') : null);
}

export function writeBaseline(root: string, baseline: Baseline): void {
	writeFileSync(join(root, BASELINE_FILE), `${JSON.stringify(baseline, null, '\t')}\n`);
}
