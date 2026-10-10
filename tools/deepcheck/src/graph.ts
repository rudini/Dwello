import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { ts } from 'ts-morph';

export interface Coupling {
	fanIn: number;
	fanOut: number;
}

/** TS5083 "Cannot read file '...'", e.g. an `extends` target that is generated later. */
const CANNOT_READ_FILE = 5083;

const SVELTE_SCRIPT = /<script[^>]*>([\s\S]*?)<\/script>/g;

function importSpecifiers(text: string, path: string): string[] {
	const code = path.endsWith('.svelte') ? [...text.matchAll(SVELTE_SCRIPT)].map((m) => m[1]).join('\n') : text;
	return ts.preProcessFile(code, true, true).importedFiles.map((f) => f.fileName);
}

/** Compiler options of the nearest tsconfig.json at or above the file (within root), cached per config. */
function optionsFinder(root: string, warnings: string[]): (file: string) => ts.CompilerOptions {
	const cache = new Map<string, ts.CompilerOptions>();
	const nearest = (dir: string): string | undefined => {
		const candidate = join(dir, 'tsconfig.json');
		if (existsSync(candidate)) return candidate;
		return dir === root || dirname(dir) === dir ? undefined : nearest(dirname(dir));
	};
	const parse = (config: string) => {
		const host = { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} };
		const parsed = ts.getParsedCommandLineOfConfigFile(config, {}, host);
		for (const error of parsed?.errors.filter((e) => e.code === CANNOT_READ_FILE) ?? [])
			warnings.push(
				`${relative(root, config)}: ${ts.flattenDiagnosticMessageText(error.messageText, ' ').replaceAll(`${root}/`, '')} The extended config was not found; import aliases from it are not resolved, so fan-in and fan-out may be too low (for SvelteKit run "svelte-kit sync" first).`
			);
		return parsed?.options ?? {};
	};
	return (file) => {
		const config = nearest(dirname(file));
		if (!config) return { moduleResolution: ts.ModuleResolutionKind.Bundler, allowJs: true };
		if (!cache.has(config)) cache.set(config, { allowJs: true, ...parse(config) });
		return cache.get(config)!;
	};
}

/** Import targets per file that resolve to project files. */
function edges(root: string, files: string[], warnings: string[]): Map<string, Set<string>> {
	const known = new Set(files);
	const optionsFor = optionsFinder(root, warnings);
	return new Map(
		files.map((file) => {
			const absolute = join(root, file);
			const options = optionsFor(absolute);
			const targets = importSpecifiers(readFileSync(absolute, 'utf8'), file)
				.map((spec) => resolve(root, spec, absolute, options, known))
				.filter((t): t is string => t !== undefined && t !== file);
			return [file, new Set(targets)];
		})
	);
}

/** Targets of an importer, looking through barrels: importing a barrel imports what it re-exports. */
function throughBarrels(targets: Set<string>, graph: Map<string, Set<string>>, barrels: Set<string>): Set<string> {
	const seen = new Set<string>();
	const visit = (t: string) => {
		if (seen.has(t)) return;
		seen.add(t);
		if (barrels.has(t)) graph.get(t)!.forEach(visit);
	};
	targets.forEach(visit);
	return seen;
}

/**
 * Fan-in and fan-out per project file from the whole-project import graph, resolved through
 * the nearest tsconfig (paths, baseUrl). `files` are all project sources (TS and Svelte);
 * only importers in `countedImporters` count towards fan-in, and barrels pass their importers on.
 */
export function coupling(
	root: string,
	files: string[],
	countedImporters: Set<string>,
	barrels: Set<string>,
	warnings: string[]
): Map<string, Coupling> {
	const graph = edges(root, files, warnings);
	const result = new Map<string, Coupling>(files.map((f) => [f, { fanIn: 0, fanOut: graph.get(f)!.size }]));
	for (const [file, targets] of graph) {
		if (!countedImporters.has(file) || barrels.has(file)) continue;
		for (const t of throughBarrels(targets, graph, barrels)) result.get(t)!.fanIn++;
	}
	return result;
}

function resolve(
	root: string,
	spec: string,
	from: string,
	options: ts.CompilerOptions,
	known: Set<string>
): string | undefined {
	const resolved = ts.resolveModuleName(spec, from, options, ts.sys).resolvedModule?.resolvedFileName;
	const candidates = resolved ? [resolved] : spec.startsWith('.') ? [join(dirname(from), spec)] : [];
	for (const candidate of candidates) {
		const path = relative(root, candidate).split(sep).join('/');
		if (known.has(path)) return path;
	}
	return undefined;
}
