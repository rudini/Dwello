import { readdirSync, readFileSync } from 'node:fs';
import { join, matchesGlob } from 'node:path';
import type { Config } from './config.ts';
import { fallowIgnorePatterns } from './fallow.ts';
import type { ExcludedModule } from './types.ts';

const SOURCE = /\.(ts|tsx|mts|cts)$/;
const GENERATED_MARKER = /@generated|auto-generated|do not edit/i;

export const matchesAny = (path: string, globs: string[]) => globs.some((g) => matchesGlob(path, g));

/** All files under root (relative, '/'-separated, sorted), skipping dot directories and config excludes. */
function walk(root: string, config: Config): string[] {
	const files: string[] = [];
	const visit = (dir: string) => {
		for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
			const path = dir ? `${dir}/${entry.name}` : entry.name;
			if (entry.name.startsWith('.') || matchesAny(path + (entry.isDirectory() ? '/x' : ''), config.exclude)) continue;
			if (entry.isDirectory()) visit(path);
			else files.push(path);
		}
	};
	visit('');
	return files.sort();
}

const isSource = (path: string) => SOURCE.test(path) || path.endsWith('.svelte');

/** Why a file is not analyzed by path or header, or null when it is a candidate module. */
function excludeByPath(
	root: string,
	path: string,
	config: Config,
	fallowIgnores: string[]
): ExcludedModule['reason'] | null {
	if (path.endsWith('.d.ts')) return 'declaration';
	if (matchesAny(path, config.tests)) return 'test';
	if (matchesAny(path, [...config.generated, ...fallowIgnores])) return 'generated';
	if (matchesAny(path, config.entries)) return 'entry';
	const header = readFileSync(join(root, path), 'utf8').split('\n', 5).join('\n');
	return GENERATED_MARKER.test(header) ? 'generated' : null;
}

const isModuleCandidate = (path: string, config: Config) =>
	SOURCE.test(path) && matchesAny(path, config.include);

/**
 * The project's sources (TS and Svelte, for the import graph), the modules to analyze, and the candidates excluded
 * by path or header with the reason.
 */
export function discover(
	root: string,
	config: Config
): { sources: string[]; modulePaths: string[]; excluded: ExcludedModule[] } {
	const sources = walk(root, config).filter(isSource);
	const fallowIgnores = fallowIgnorePatterns(root);
	const modulePaths: string[] = [];
	const excluded: ExcludedModule[] = [];
	for (const path of sources.filter((p) => isModuleCandidate(p, config))) {
		const reason = excludeByPath(root, path, config, fallowIgnores);
		if (reason) excluded.push({ path, reason });
		else modulePaths.push(path);
	}
	return { sources, modulePaths, excluded };
}
