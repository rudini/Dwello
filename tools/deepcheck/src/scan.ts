import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Config } from './config.ts';
import type { Group, ModuleReport, Report, ScanOutput } from './types.ts';

export interface ScanSelection {
	path?: string;
	top: number;
	minScore?: number;
	groupBy?: 'directory' | 'package';
	/** Paths not to list (--use-baseline). */
	hidden?: Set<string>;
}

export const within = (path: string, prefix?: string) =>
	!prefix || path === prefix || path.startsWith(prefix.replace(/\/?$/, '/'));

function packageOf(root: string, path: string): string {
	for (let dir = dirname(path); dir !== '.'; dir = dirname(dir)) if (existsSync(join(root, dir, 'package.json'))) return dir;
	return '.';
}

function groups(root: string, modules: ModuleReport[], by: 'directory' | 'package'): Group[] {
	const keyOf = (m: ModuleReport) => (by === 'directory' ? dirname(m.path) : packageOf(root, m.path));
	const grouped = Map.groupBy(modules, keyOf);
	return [...grouped]
		.map(([key, members]) => ({ key, count: members.length, maxScore: Math.max(...members.map((m) => m.score)) }))
		.sort((a, b) => b.count - a.count || b.maxScore - a.maxScore || (a.key < b.key ? -1 : 1));
}

/** Modules in the path scope that `--fail-on-score` and `--min-score` consider: large enough to judge. */
export const inScope = (report: Report, path?: string) =>
	report.modules.filter((m) => m.eligible && within(m.path, path));

export function scanOutput(root: string, report: Report, config: Config, s: ScanSelection): ScanOutput {
	const selected = inScope(report, s.path)
		.filter((m) => (s.minScore === undefined ? m.flagged : m.score >= s.minScore))
		.filter((m) => !s.hidden?.has(m.path));
	const findings = selected.slice(0, s.top);
	const suppressionFindings = report.suppressionFindings.filter((f) => within(f.path, s.path));
	return {
		schemaVersion: 1,
		tool: 'deepcheck',
		command: 'scan',
		scope: 'all',
		path: s.path ?? null,
		failThreshold: config.failThreshold,
		minScore: s.minScore ?? null,
		summary: {
			analyzed: report.modules.filter((m) => within(m.path, s.path)).length,
			shallow: selected.length,
			shown: findings.length,
			excluded: report.excluded.filter((m) => within(m.path, s.path)).length,
			invalidSuppressions: suppressionFindings.length
		},
		findings,
		...(s.groupBy && { groups: groups(root, selected, s.groupBy) }),
		suppressionFindings,
		warnings: report.warnings
	};
}
