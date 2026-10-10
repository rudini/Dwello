import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Globs the project's Fallow config ignores (`ignorePatterns` in .fallowrc.json); deepcheck treats them as generated. */
export function fallowIgnorePatterns(root: string): string[] {
	const path = join(root, '.fallowrc.json');
	if (!existsSync(path)) return [];
	return JSON.parse(readFileSync(path, 'utf8')).ignorePatterns ?? [];
}
