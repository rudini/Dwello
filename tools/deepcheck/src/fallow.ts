import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseJson } from './config.ts';
import { ToolError } from './errors.ts';

/** Globs the project's Fallow config ignores (`ignorePatterns` in .fallowrc.json); deepcheck treats them as generated. */
export function fallowIgnorePatterns(root: string): string[] {
	const path = join(root, '.fallowrc.json');
	if (!existsSync(path)) return [];
	return parseJson(readFileSync(path, 'utf8'), '.fallowrc.json').ignorePatterns ?? [];
}

export interface FallowData {
	complexity: Map<string, number>;
	unusedExports: Map<string, number>;
}

/** The parts of `fallow health --file-scores --format json` (schema_version 7) deepcheck reads. */
interface HealthJson {
	file_scores?: { path: string; total_cyclomatic: number }[];
}

/** The parts of `fallow dead-code --format json` deepcheck reads. */
interface DeadCodeJson {
	unused_exports?: { path: string }[];
	unused_types?: { path: string }[];
}

export function parseFallow(health: HealthJson, deadCode: DeadCodeJson): FallowData {
	const unusedExports = new Map<string, number>();
	for (const { path } of [...(deadCode.unused_exports ?? []), ...(deadCode.unused_types ?? [])])
		unusedExports.set(path, (unusedExports.get(path) ?? 0) + 1);
	const complexity = new Map((health.file_scores ?? []).map((f) => [f.path, f.total_cyclomatic]));
	return { complexity, unusedExports };
}

function parseOutput(stdout: string | null) {
	try {
		return JSON.parse(stdout ?? '');
	} catch {
		return undefined;
	}
}

/** Runs one Fallow command; exit codes 0 and 1 both mean the run succeeded. */
function run(bin: string, root: string, args: string[]) {
	const result = spawnSync(bin, [...args, '--format', 'json', '--quiet'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
	const json = parseOutput(result.stdout);
	if ((result.status !== 0 && result.status !== 1) || json?.error)
		throw new ToolError(`Fallow failed: ${json?.message ?? result.error?.message ?? `exit code ${result.status}`}`);
	return json;
}

/**
 * Fallow data for score inputs. `off`: none. `auto`: the project's own Fallow (node_modules/.bin/fallow)
 * if installed. Any other value is the path of a Fallow binary that must work.
 */
export function loadFallow(root: string, mode: string, warnings: string[] = []): FallowData | null {
	if (mode === 'off') return null;
	const bin = mode === 'auto' ? join(root, 'node_modules', '.bin', 'fallow') : mode;
	if (mode === 'auto' && !existsSync(bin)) return null;
	try {
		return parseFallow(run(bin, root, ['health', '--file-scores']), run(bin, root, ['dead-code']));
	} catch (error) {
		if (mode !== 'auto') throw error;
		warnings.push(`${(error as Error).message}; using own complexity and no unused-export data.`);
		return null;
	}
}
